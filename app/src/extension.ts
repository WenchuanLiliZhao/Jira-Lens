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
 * Request-response (Webview → Host → Webview):
 *   Webview sends:  { id: string, type: MessageType, ...params }
 *   Host replies:   { id: string, result?: unknown, error?: string }
 *
 * Push (Host → Webview, no id):
 *   { type: 'CONNECT_PROGRESS', stage: 'validating'|'fetching'|'done'|'error', message?: string }
 *
 * ONBOARDING STEPS
 * ────────────────
 *   0 — Credentials needed (SecretStorage token missing)
 *   1 — Connecting         (credentials present, attempting connection)
 *   2 — Main interface     (connected)
 *
 * CREDENTIALS
 * ───────────
 *   JIRA_DOMAIN, JIRA_EMAIL → VS Code settings (jira-lens.domain / jira-lens.email)
 *   JIRA_TOKEN              → VS Code SecretStorage ('jira-lens.token')
 *
 * When credentials are saved, they are also written to ~/Jira-MCP/config/secrets.json
 * so the standalone jira-mcp server (used for Cursor AI Chat) stays in sync.
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

interface Credentials {
  domain: string;
  email: string;
  token: string;
}

type Step = 0 | 1 | 2;

type InboundMessage =
  | { id: string; type: 'GET_PROJECTS' }
  | { id: string; type: 'GET_ISSUES'; project: string; jql?: string }
  | { id: string; type: 'GET_ISSUE'; key: string }
  | { id: string; type: 'SAVE_CREDENTIALS'; domain: string; email: string; token: string }
  | { id: string; type: 'RESET_CREDENTIALS' }
  | { id: string; type: 'INSTALL_MCP_OPTIONAL' }
  | { id: string; type: 'DISMISS_MCP_BANNER' }
  | { id: string; type: 'GET_MCP_BANNER_STATE' }
  | { id: string; type: 'GET_MCP_INSTALL_STATE' };

type PushMessage =
  | { type: 'CONNECT_PROGRESS'; stage: 'validating' | 'fetching' | 'done' | 'error'; message?: string };

// ── Credential management ─────────────────────────────────────────────────────

async function loadCredentials(context: vscode.ExtensionContext): Promise<Credentials | null> {
  const token = await context.secrets.get('jira-lens.token');
  const config = vscode.workspace.getConfiguration('jira-lens');
  const domain = config.get<string>('domain') ?? '';
  const email = config.get<string>('email') ?? '';
  if (token && domain && email) return { domain, email, token };
  return null;
}

async function saveCredentials(
  context: vscode.ExtensionContext,
  domain: string,
  email: string,
  token: string,
): Promise<void> {
  await context.secrets.store('jira-lens.token', token);
  const config = vscode.workspace.getConfiguration('jira-lens');
  await config.update('domain', domain, vscode.ConfigurationTarget.Global);
  await config.update('email', email, vscode.ConfigurationTarget.Global);

  syncCredentialsToMcp(domain, email, token);
}

/**
 * Write credentials to ~/Jira-MCP/config/secrets.json so the standalone
 * jira-mcp server (Cursor AI Chat integration) stays in sync.
 * Best-effort — fails silently if Jira-MCP is not installed.
 */
function syncCredentialsToMcp(domain: string, email: string, token: string): void {
  try {
    const mcpConfigDir = path.join(os.homedir(), 'Jira-MCP', 'config');
    if (!fs.existsSync(mcpConfigDir)) return;
    const secretsPath = path.join(mcpConfigDir, 'secrets.json');
    const payload = { JIRA_DOMAIN: domain, JIRA_EMAIL: email, JIRA_TOKEN: token };
    fs.writeFileSync(secretsPath, JSON.stringify(payload, null, 2) + '\n', 'utf-8');
  } catch {
    // jira-mcp not installed or dir not writable — that's fine
  }
}

function isMcpInstalled(): boolean {
  const mcpDir = path.join(os.homedir(), 'Jira-MCP');
  return fs.existsSync(path.join(mcpDir, 'package.json'));
}

// ── Step detection ────────────────────────────────────────────────────────────

async function detectInitialStep(context: vscode.ExtensionContext): Promise<Step> {
  const creds = await loadCredentials(context);
  if (!creds) return 0;   // no credentials → show credential form
  return 1;               // has credentials → run connection flow
}

// ── Jira API client ───────────────────────────────────────────────────────────

async function jiraFetch(creds: Credentials, apiPath: string, opts: RequestInit = {}): Promise<unknown> {
  const auth = Buffer.from(`${creds.email}:${creds.token}`).toString('base64');
  const res = await fetch(`https://${creds.domain}${apiPath}`, {
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

async function handleGetProjects(creds: Credentials): Promise<{ key: string; name: string }[]> {
  let raw = await jiraFetch(creds, '/rest/api/3/project') as { key: string; name: string }[];
  if (!Array.isArray(raw) || raw.length === 0) {
    const search = await jiraFetch(creds, '/rest/api/3/project/search?maxResults=100') as { values?: { key: string; name: string }[] };
    raw = search.values ?? [];
  }
  return raw.map(p => ({ key: p.key, name: p.name }));
}

async function handleGetIssues(creds: Credentials, project: string, jql?: string): Promise<{ issues: unknown[] }> {
  const baseJql = jql ? `project = ${project} AND ${jql}` : `project = ${project}`;
  const fields = ['summary', 'status', 'assignee', 'issuetype', 'priority', 'created', 'updated', 'labels', 'fixVersions'];
  const body = { jql: baseJql, fields, maxResults: 100 };

  let data: { issues?: unknown[] };
  try {
    data = await jiraFetch(creds, '/rest/api/3/search/jql', { method: 'POST', body: JSON.stringify(body) }) as { issues?: unknown[] };
  } catch (e) {
    const msg = ((e as Error).message ?? '').toLowerCase();
    if (msg.includes('removed') || msg.includes('deprecated') || msg.includes('404')) {
      data = await jiraFetch(creds, '/rest/api/3/search', { method: 'POST', body: JSON.stringify({ ...body, startAt: 0 }) }) as { issues?: unknown[] };
    } else {
      throw e;
    }
  }
  return { issues: data?.issues ?? [] };
}

async function handleGetIssue(creds: Credentials, key: string): Promise<unknown> {
  const fields = [
    'summary', 'description', 'status', 'priority', 'issuetype',
    'assignee', 'reporter', 'created', 'updated', 'duedate',
    'labels', 'fixVersions', 'subtasks', 'issuelinks', 'attachment',
    'comment', 'customfield_10016', 'customfield_10020', 'parent',
  ].join(',');
  const data = await jiraFetch(creds, `/rest/api/3/issue/${key}?fields=${fields}`) as {
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

// ── MCP install / update prompts (optional — for Cursor AI Chat integration) ─
//
// Both prompts reference the GitHub README so the AI reads the authoritative
// instructions rather than relying on hardcoded steps that may go stale.
// The current workspace folder is injected at runtime so link-to-project.sh
// targets the correct directory.

function buildMcpInstallPrompt(workspaceFolder: string): string {
  return (
    'Please install the Jira MCP server for me by following the instructions at ' +
    'https://github.com/WenchuanLiliZhao/jira-mcp. ' +
    `Link the commands into my current project at: ${workspaceFolder}. ` +
    'My Jira credentials are already configured — Jira Lens wrote them to ' +
    '~/Jira-MCP/config/secrets.json automatically, so you can skip that step.'
  );
}

function buildMcpUpdatePrompt(workspaceFolder: string): string {
  return (
    'Please update my Jira MCP server (already installed at ~/Jira-MCP) by following ' +
    'the instructions at https://github.com/WenchuanLiliZhao/jira-mcp. ' +
    `Re-link the commands into my current project at: ${workspaceFolder}. ` +
    'My Jira credentials are already in ~/Jira-MCP/config/secrets.json — do not overwrite them.'
  );
}

// ── WebviewPanel ──────────────────────────────────────────────────────────────

class JiraLensPanel {
  static current: JiraLensPanel | undefined;

  private readonly panel: vscode.WebviewPanel;
  private readonly extensionUri: vscode.Uri;
  private readonly context: vscode.ExtensionContext;
  private initialStep: Step = 0;

  static async createOrShow(context: vscode.ExtensionContext): Promise<void> {
    if (JiraLensPanel.current) {
      JiraLensPanel.current.panel.reveal();
      return;
    }
    const step = await detectInitialStep(context);
    new JiraLensPanel(context, step);
  }

  constructor(context: vscode.ExtensionContext, initialStep: Step) {
    this.context = context;
    this.extensionUri = context.extensionUri;
    this.initialStep = initialStep;

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

    if (initialStep === 1) {
      setTimeout(() => { void this.runConnectionFlow(); }, 500);
    }
  }

  // ── HTML builder ───────────────────────────────────────────────────────────

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

    // Inject flags and CSP
    const cspSource = this.panel.webview.cspSource;
    const cspMeta = [
      `<meta http-equiv="Content-Security-Policy" content="`,
      `default-src 'none'; `,
      `script-src 'unsafe-inline' ${cspSource}; `,
      `style-src 'unsafe-inline' ${cspSource} https://fonts.googleapis.com; `,
      `img-src ${cspSource} https: data:; `,
      `font-src ${cspSource} https://fonts.gstatic.com; `,
      `connect-src 'none';`,
      `">`,
    ].join('');
    const flags = [
      `<script>window.__IS_VSCODE__ = true; window.__INITIAL_STEP__ = ${this.initialStep};</script>`,
    ].join('');

    html = html.replace('</head>', `${cspMeta}\n  ${flags}\n</head>`);
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

  // ── Push messages ──────────────────────────────────────────────────────────

  private sendPush(msg: PushMessage): void {
    void this.panel.webview.postMessage(msg);
  }

  // ── Connection flow ────────────────────────────────────────────────────────

  private async runConnectionFlow(): Promise<void> {
    try {
      this.sendPush({ type: 'CONNECT_PROGRESS', stage: 'validating' });
      const creds = await loadCredentials(this.context);
      if (!creds) {
        this.sendPush({ type: 'CONNECT_PROGRESS', stage: 'error', message: 'Credentials not found. Please re-enter your Jira details.' });
        return;
      }

      // Validate by fetching projects (lightweight check)
      this.sendPush({ type: 'CONNECT_PROGRESS', stage: 'fetching' });
      await handleGetProjects(creds);

      this.sendPush({ type: 'CONNECT_PROGRESS', stage: 'done' });
    } catch (err) {
      this.sendPush({
        type: 'CONNECT_PROGRESS',
        stage: 'error',
        message: (err as Error).message ?? 'Connection failed',
      });
    }
  }

  // ── Message handler ────────────────────────────────────────────────────────

  private async handleMessage(msg: InboundMessage): Promise<void> {
    try {
      let result: unknown;

      switch (msg.type) {

        // ── Jira API ───────────────────────────────────────────────────────
        case 'GET_PROJECTS': {
          const creds = await loadCredentials(this.context);
          if (!creds) throw new Error('Not connected. Please complete setup first.');
          result = await handleGetProjects(creds);
          break;
        }
        case 'GET_ISSUES': {
          const creds = await loadCredentials(this.context);
          if (!creds) throw new Error('Not connected. Please complete setup first.');
          result = await handleGetIssues(creds, msg.project, msg.jql);
          break;
        }
        case 'GET_ISSUE': {
          const creds = await loadCredentials(this.context);
          if (!creds) throw new Error('Not connected. Please complete setup first.');
          result = await handleGetIssue(creds, msg.key);
          break;
        }

        // ── Onboarding ─────────────────────────────────────────────────────
        case 'SAVE_CREDENTIALS': {
          await saveCredentials(this.context, msg.domain, msg.email, msg.token);
          result = { ok: true };
          void this.panel.webview.postMessage({ id: msg.id, result });
          void this.runConnectionFlow();
          return;
        }
        case 'RESET_CREDENTIALS': {
          // Wipe the stored token so detectInitialStep() returns 0 on next open.
          // Domain and email are left in settings (non-sensitive) to pre-fill the form.
          await this.context.secrets.delete('jira-lens.token');
          result = { ok: true };
          break;
        }

        // ── Optional jira-mcp install (for AI Chat integration) ──────────
        case 'GET_MCP_BANNER_STATE': {
          const dismissed = this.context.globalState.get<boolean>('jira-lens.mcpBannerDismissed', false);
          const installed = isMcpInstalled();
          result = { show: !dismissed && !installed };
          break;
        }
        case 'INSTALL_MCP_OPTIONAL': {
          const workspaceFolder =
            vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? os.homedir();
          const prompt = isMcpInstalled()
            ? buildMcpUpdatePrompt(workspaceFolder)
            : buildMcpInstallPrompt(workspaceFolder);
          await vscode.commands.executeCommand('workbench.action.chat.open', { query: prompt });
          result = { ok: true };
          break;
        }
        case 'DISMISS_MCP_BANNER': {
          await this.context.globalState.update('jira-lens.mcpBannerDismissed', true);
          result = { ok: true };
          break;
        }
        case 'GET_MCP_INSTALL_STATE': {
          result = { installed: isMcpInstalled() };
          break;
        }

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
    void JiraLensPanel.createOrShow(context);
  });
  context.subscriptions.push(cmd);
}

export function deactivate(): void {
  // nothing to clean up
}
