/**
 * @file extension.ts
 * @description Jira Lens — VS Code Extension Host
 *
 * ARCHITECTURE
 * ────────────
 * This file runs in the VS Code Extension Host (Node.js context).
 * It is compiled separately from the Vite/React Webview bundle.
 *
 *   Extension Host (this file)
 *     ↕ vscode.postMessage / onDidReceiveMessage
 *   Webview (dist/index.html — Vite-built React app)
 *     ↕ transport.ts abstraction
 *   Jira Cloud REST API
 *
 * MESSAGE PROTOCOL
 * ────────────────
 * Webview → Host:  { id: string, type: MessageType, ...params }
 * Host → Webview:  { id: string, result?: unknown, error?: string }
 *
 * CREDENTIALS
 * ───────────
 * Read from ~/Jira-MCP/config/secrets.json (shared with jira-mcp).
 * Re-read on every request — no restart needed after credential changes.
 *
 * BUILD
 * ─────
 *   npm run build:extension  →  tsc -p tsconfig.extension.json  →  out/extension.js
 */

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

// ── Types ─────────────────────────────────────────────────────────────────────

interface Secrets {
  JIRA_DOMAIN: string;
  JIRA_EMAIL: string;
  JIRA_TOKEN: string;
}

type InboundMessage =
  | { id: string; type: 'GET_PROJECTS' }
  | { id: string; type: 'GET_ISSUES'; project: string; jql?: string }
  | { id: string; type: 'GET_ISSUE'; key: string };

// ── Credential loading ────────────────────────────────────────────────────────

function loadSecrets(): Secrets {
  const secretsPath = path.join(os.homedir(), 'Jira-MCP', 'config', 'secrets.json');
  if (!fs.existsSync(secretsPath)) {
    throw new Error(
      `Jira credentials not found at ${secretsPath}.\n` +
      `Run /Jira-MCP/install in Cursor to configure them.`
    );
  }
  return JSON.parse(fs.readFileSync(secretsPath, 'utf-8')) as Secrets;
}

// ── Jira API client ───────────────────────────────────────────────────────────

async function jiraFetch(secrets: Secrets, apiPath: string, opts: RequestInit = {}): Promise<unknown> {
  const auth = Buffer.from(`${secrets.JIRA_EMAIL}:${secrets.JIRA_TOKEN}`).toString('base64');
  const res = await fetch(`https://${secrets.JIRA_DOMAIN}${apiPath}`, {
    ...opts,
    headers: {
      Accept: 'application/json',
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
      ...(opts.headers as Record<string, string> ?? {}),
    },
  });
  const text = await res.text();
  if (!res.ok) {
    const parsed = text ? (JSON.parse(text) as { errorMessages?: string[] }) : null;
    throw new Error(parsed?.errorMessages?.[0] ?? text ?? `HTTP ${res.status}`);
  }
  return text ? JSON.parse(text) : null;
}

// ── Message handlers ──────────────────────────────────────────────────────────

async function handleGetProjects(secrets: Secrets): Promise<{ key: string; name: string }[]> {
  let raw = await jiraFetch(secrets, '/rest/api/3/project') as { key: string; name: string }[];
  if (!Array.isArray(raw) || raw.length === 0) {
    const search = await jiraFetch(secrets, '/rest/api/3/project/search?maxResults=100') as { values?: { key: string; name: string }[] };
    raw = search.values ?? [];
  }
  return raw.map(p => ({ key: p.key, name: p.name }));
}

async function handleGetIssues(secrets: Secrets, project: string, jql?: string): Promise<{ issues: unknown[] }> {
  const baseJql = jql ? `project = ${project} AND ${jql}` : `project = ${project}`;
  const fields = ['summary', 'status', 'assignee', 'issuetype', 'priority', 'created', 'updated', 'labels', 'fixVersions'];
  const body = { jql: baseJql, fields, maxResults: 100 };

  let data: { issues?: unknown[] };
  try {
    data = await jiraFetch(secrets, '/rest/api/3/search/jql', { method: 'POST', body: JSON.stringify(body) }) as { issues?: unknown[] };
  } catch (e) {
    const msg = ((e as Error).message ?? '').toLowerCase();
    if (msg.includes('removed') || msg.includes('deprecated') || msg.includes('404')) {
      data = await jiraFetch(secrets, '/rest/api/3/search', { method: 'POST', body: JSON.stringify({ ...body, startAt: 0 }) }) as { issues?: unknown[] };
    } else {
      throw e;
    }
  }
  return { issues: data?.issues ?? [] };
}

async function handleGetIssue(secrets: Secrets, key: string): Promise<unknown> {
  const fields = [
    'summary', 'description', 'status', 'priority', 'issuetype',
    'assignee', 'reporter', 'created', 'updated', 'duedate',
    'labels', 'fixVersions', 'subtasks', 'issuelinks', 'attachment',
    'comment', 'customfield_10016', 'customfield_10020', 'parent',
  ].join(',');
  const data = await jiraFetch(secrets, `/rest/api/3/issue/${key}?fields=${fields}`) as {
    fields?: Record<string, unknown>;
    [key: string]: unknown;
  };
  const f = data?.fields ?? {};
  return {
    ...data,
    fields: {
      ...f,
      story_points: f['customfield_10016'] ?? null,
      sprint: f['customfield_10020'] ?? null,
      epic: f['parent'] ? { key: (f['parent'] as { key: string }).key, fields: (f['parent'] as { fields?: unknown }).fields } : null,
    },
  };
}

// ── WebviewPanel ──────────────────────────────────────────────────────────────

class JiraLensPanel {
  static current: JiraLensPanel | undefined;

  private readonly panel: vscode.WebviewPanel;
  private readonly extensionUri: vscode.Uri;

  static createOrShow(context: vscode.ExtensionContext): void {
    if (JiraLensPanel.current) {
      JiraLensPanel.current.panel.reveal();
      return;
    }
    new JiraLensPanel(context);
  }

  constructor(context: vscode.ExtensionContext) {
    this.extensionUri = context.extensionUri;

    this.panel = vscode.window.createWebviewPanel(
      'jiraLens',
      'Jira Lens',
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'dist')],
        retainContextWhenHidden: true,
      }
    );

    this.panel.webview.html = this.buildHtml();
    this.panel.onDidDispose(() => { JiraLensPanel.current = undefined; });
    JiraLensPanel.current = this;

    this.panel.webview.onDidReceiveMessage(async (msg: InboundMessage) => {
      await this.handleMessage(msg);
    });
  }

  private buildHtml(): string {
    const distPath = vscode.Uri.joinPath(this.extensionUri, 'dist');
    const indexPath = vscode.Uri.joinPath(distPath, 'index.html');

    if (!fs.existsSync(indexPath.fsPath)) {
      return this.buildFallbackHtml();
    }

    let html = fs.readFileSync(indexPath.fsPath, 'utf-8');

    // Rewrite relative asset paths to vscode-resource:// URIs
    const distUri = this.panel.webview.asWebviewUri(distPath).toString();
    html = html.replace(/(src|href)="\.\//g, `$1="${distUri}/`);

    // Inject VS Code flag (detected by transport.ts) and CSP
    const cspSource = this.panel.webview.cspSource;
    const cspMeta = [
      `<meta http-equiv="Content-Security-Policy" content="`,
      `default-src 'none'; `,
      `script-src 'unsafe-inline' ${cspSource}; `,
      `style-src 'unsafe-inline' ${cspSource}; `,
      `img-src ${cspSource} https: data:; `,
      `font-src ${cspSource}; `,
      `connect-src 'none';`,
      `">`,
    ].join('');
    const vsCodeFlag = `<script>window.__IS_VSCODE__ = true;</script>`;

    html = html.replace('</head>', `${cspMeta}\n  ${vsCodeFlag}\n</head>`);
    return html;
  }

  private buildFallbackHtml(): string {
    return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Jira Lens</title></head>
<body style="font-family:sans-serif;padding:2rem;color:#ccc;background:#1e1e1e;">
  <h2>Jira Lens</h2>
  <p>Webview bundle not found. Run <code>npm run build:webview</code> first.</p>
</body>
</html>`;
  }

  private async handleMessage(msg: InboundMessage): Promise<void> {
    try {
      const secrets = loadSecrets();
      let result: unknown;

      switch (msg.type) {
        case 'GET_PROJECTS':
          result = await handleGetProjects(secrets);
          break;
        case 'GET_ISSUES':
          result = await handleGetIssues(secrets, msg.project, msg.jql);
          break;
        case 'GET_ISSUE':
          result = await handleGetIssue(secrets, msg.key);
          break;
        default:
          throw new Error(`Unknown message type: ${(msg as { type: string }).type}`);
      }

      void this.panel.webview.postMessage({ id: msg.id, result });
    } catch (err) {
      void this.panel.webview.postMessage({ id: msg.id, error: (err as Error).message });
    }
  }
}

// ── Extension lifecycle ───────────────────────────────────────────────────────

export function activate(context: vscode.ExtensionContext): void {
  const cmd = vscode.commands.registerCommand('jira-lens.open', () => {
    JiraLensPanel.createOrShow(context);
  });
  context.subscriptions.push(cmd);
}

export function deactivate(): void {
  // nothing to clean up
}
