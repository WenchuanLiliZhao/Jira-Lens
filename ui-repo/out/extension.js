"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const os = __importStar(require("os"));
// ── Credential loading ────────────────────────────────────────────────────────
function loadSecrets() {
    const secretsPath = path.join(os.homedir(), 'Jira-MCP', 'config', 'secrets.json');
    if (!fs.existsSync(secretsPath)) {
        throw new Error(`Jira credentials not found at ${secretsPath}.\n` +
            `Run /Jira-MCP/install in Cursor to configure them.`);
    }
    return JSON.parse(fs.readFileSync(secretsPath, 'utf-8'));
}
// ── Jira API client ───────────────────────────────────────────────────────────
async function jiraFetch(secrets, apiPath, opts = {}) {
    const auth = Buffer.from(`${secrets.JIRA_EMAIL}:${secrets.JIRA_TOKEN}`).toString('base64');
    const res = await fetch(`https://${secrets.JIRA_DOMAIN}${apiPath}`, {
        ...opts,
        headers: {
            Accept: 'application/json',
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/json',
            ...(opts.headers ?? {}),
        },
    });
    const text = await res.text();
    if (!res.ok) {
        const parsed = text ? JSON.parse(text) : null;
        throw new Error(parsed?.errorMessages?.[0] ?? text ?? `HTTP ${res.status}`);
    }
    return text ? JSON.parse(text) : null;
}
// ── Message handlers ──────────────────────────────────────────────────────────
async function handleGetProjects(secrets) {
    let raw = await jiraFetch(secrets, '/rest/api/3/project');
    if (!Array.isArray(raw) || raw.length === 0) {
        const search = await jiraFetch(secrets, '/rest/api/3/project/search?maxResults=100');
        raw = search.values ?? [];
    }
    return raw.map(p => ({ key: p.key, name: p.name }));
}
async function handleGetIssues(secrets, project, jql) {
    const baseJql = jql ? `project = ${project} AND ${jql}` : `project = ${project}`;
    const fields = ['summary', 'status', 'assignee', 'issuetype', 'priority', 'created', 'updated', 'labels', 'fixVersions'];
    const body = { jql: baseJql, fields, maxResults: 100 };
    let data;
    try {
        data = await jiraFetch(secrets, '/rest/api/3/search/jql', { method: 'POST', body: JSON.stringify(body) });
    }
    catch (e) {
        const msg = (e.message ?? '').toLowerCase();
        if (msg.includes('removed') || msg.includes('deprecated') || msg.includes('404')) {
            data = await jiraFetch(secrets, '/rest/api/3/search', { method: 'POST', body: JSON.stringify({ ...body, startAt: 0 }) });
        }
        else {
            throw e;
        }
    }
    return { issues: data?.issues ?? [] };
}
async function handleGetIssue(secrets, key) {
    const fields = [
        'summary', 'description', 'status', 'priority', 'issuetype',
        'assignee', 'reporter', 'created', 'updated', 'duedate',
        'labels', 'fixVersions', 'subtasks', 'issuelinks', 'attachment',
        'comment', 'customfield_10016', 'customfield_10020', 'parent',
    ].join(',');
    const data = await jiraFetch(secrets, `/rest/api/3/issue/${key}?fields=${fields}`);
    const f = data?.fields ?? {};
    return {
        ...data,
        fields: {
            ...f,
            story_points: f['customfield_10016'] ?? null,
            sprint: f['customfield_10020'] ?? null,
            epic: f['parent'] ? { key: f['parent'].key, fields: f['parent'].fields } : null,
        },
    };
}
// ── WebviewPanel ──────────────────────────────────────────────────────────────
class JiraLensPanel {
    static current;
    panel;
    extensionUri;
    static createOrShow(context) {
        if (JiraLensPanel.current) {
            JiraLensPanel.current.panel.reveal();
            return;
        }
        new JiraLensPanel(context);
    }
    constructor(context) {
        this.extensionUri = context.extensionUri;
        this.panel = vscode.window.createWebviewPanel('jiraLens', 'Jira Lens', vscode.ViewColumn.One, {
            enableScripts: true,
            localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'dist')],
            retainContextWhenHidden: true,
        });
        this.panel.webview.html = this.buildHtml();
        this.panel.onDidDispose(() => { JiraLensPanel.current = undefined; });
        JiraLensPanel.current = this;
        this.panel.webview.onDidReceiveMessage(async (msg) => {
            await this.handleMessage(msg);
        });
    }
    buildHtml() {
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
    buildFallbackHtml() {
        return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Jira Lens</title></head>
<body style="font-family:sans-serif;padding:2rem;color:#ccc;background:#1e1e1e;">
  <h2>Jira Lens</h2>
  <p>Webview bundle not found. Run <code>npm run build:webview</code> first.</p>
</body>
</html>`;
    }
    async handleMessage(msg) {
        try {
            const secrets = loadSecrets();
            let result;
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
                    throw new Error(`Unknown message type: ${msg.type}`);
            }
            void this.panel.webview.postMessage({ id: msg.id, result });
        }
        catch (err) {
            void this.panel.webview.postMessage({ id: msg.id, error: err.message });
        }
    }
}
// ── Extension lifecycle ───────────────────────────────────────────────────────
function activate(context) {
    const cmd = vscode.commands.registerCommand('jira-lens.open', () => {
        JiraLensPanel.createOrShow(context);
    });
    context.subscriptions.push(cmd);
}
function deactivate() {
    // nothing to clean up
}
//# sourceMappingURL=extension.js.map