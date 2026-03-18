/**
 * @file transport.ts
 * @description Jira API transport abstraction for the Jira Lens Webview
 *
 * Detects runtime environment and routes API calls accordingly:
 *
 *   VS Code Webview  →  vscode.postMessage  →  extension.ts  →  Jira Cloud
 *   Browser (dev)    →  fetch()             →  server.js proxy  →  Jira Cloud
 *
 * Usage (identical in both environments):
 *   import { getProjects, getIssues, getIssue } from './transport';
 *   const projects = await getProjects();
 *
 * PUSH MESSAGES
 * ─────────────
 * The extension can send unsolicited messages (no id) to the Webview.
 * Subscribe with: onPush(handler)
 * Currently used for: CONNECT_PROGRESS stages during connection flow.
 *
 * INITIAL STEP
 * ────────────
 * The extension injects window.__INITIAL_STEP__ = N before the Webview loads.
 * Import `initialStep` to read it. Defaults to 2 in browser dev mode (skips
 * onboarding so `npm run dev` continues to work as before).
 *
 * STEPS:  0 = credentials form · 1 = connecting · 2 = main interface
 */

// ── Environment detection ─────────────────────────────────────────────────────

declare const acquireVsCodeApi: () => { postMessage: (msg: unknown) => void };

const isVSCode: boolean =
  typeof (window as unknown as Record<string, unknown>).__IS_VSCODE__ === 'boolean' &&
  (window as unknown as Record<string, unknown>).__IS_VSCODE__ === true;

// ── Initial step (injected by extension host) ─────────────────────────────────

export const initialStep: number = isVSCode
  ? (((window as unknown as Record<string, unknown>).__INITIAL_STEP__ as number) ?? 0)
  : 2; // browser dev mode: skip onboarding

// ── VS Code postMessage channel ───────────────────────────────────────────────

let vscodeApi: ReturnType<typeof acquireVsCodeApi> | null = null;

if (isVSCode) {
  vscodeApi = acquireVsCodeApi();
}

let _messageId = 0;
const pending = new Map<string, {
  resolve: (value: unknown) => void;
  reject: (reason: Error) => void;
}>();

// ── Push message types ────────────────────────────────────────────────────────

export type ConnectStage = 'validating' | 'fetching' | 'done' | 'error';

export interface ConnectProgressMessage {
  type: 'CONNECT_PROGRESS';
  stage: ConnectStage;
  message?: string;
}

export type PushMessage = ConnectProgressMessage;

// ── Push message registry ─────────────────────────────────────────────────────

type PushHandler = (msg: PushMessage) => void;
const pushHandlers: PushHandler[] = [];

/**
 * Subscribe to push messages from the extension host.
 * Returns an unsubscribe function — call it in useEffect cleanup.
 */
export function onPush(handler: PushHandler): () => void {
  pushHandlers.push(handler);
  return () => {
    const idx = pushHandlers.indexOf(handler);
    if (idx !== -1) pushHandlers.splice(idx, 1);
  };
}

// ── Message listener ──────────────────────────────────────────────────────────

if (isVSCode) {
  window.addEventListener('message', (
    event: MessageEvent<{ id?: string; result?: unknown; error?: string; type?: string }>
  ) => {
    const data = event.data;

    // Push message: no id, has type
    if (!data.id && data.type) {
      const push = data as unknown as PushMessage;
      for (const handler of pushHandlers) {
        handler(push);
      }
      return;
    }

    // Request-response: match by id
    if (data.id) {
      const p = pending.get(data.id);
      if (!p) return;
      pending.delete(data.id);
      if (data.error !== undefined) {
        p.reject(new Error(data.error));
      } else {
        p.resolve(data.result);
      }
    }
  });
}

function callExtension(type: string, params: Record<string, unknown> = {}): Promise<unknown> {
  const id = String(++_messageId);
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    vscodeApi!.postMessage({ id, type, ...params });
  });
}

// ── Browser fallback ──────────────────────────────────────────────────────────

const API_BASE = 'http://localhost:3001';

async function browserFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(err.error ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

async function browserPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(err.error ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// ── Onboarding actions (VS Code only) ─────────────────────────────────────────

/** Save credentials via SecretStorage. Extension will then push CONNECT_PROGRESS. */
export async function saveCredentials(domain: string, email: string, token: string): Promise<void> {
  if (!isVSCode) return;
  await callExtension('SAVE_CREDENTIALS', { domain, email, token });
}

/**
 * Delete the stored API token from SecretStorage.
 * Used by the "Reset connection" nav action so the user can re-enter credentials.
 * Domain and email are left in VS Code settings to pre-fill the form.
 */
export async function resetCredentials(): Promise<void> {
  if (!isVSCode) return;
  await callExtension('RESET_CREDENTIALS');
}

// ── Optional jira-mcp banner (VS Code only) ──────────────────────────────────

/** Returns whether jira-mcp is installed (~/Jira-MCP/package.json exists). */
export async function getMcpInstallState(): Promise<{ installed: boolean }> {
  if (!isVSCode) return { installed: false };
  return callExtension('GET_MCP_INSTALL_STATE') as Promise<{ installed: boolean }>;
}

/** Check whether the "Install jira-mcp" banner should be shown. */
export async function getMcpBannerState(): Promise<{ show: boolean }> {
  if (!isVSCode) return { show: false };
  return callExtension('GET_MCP_BANNER_STATE') as Promise<{ show: boolean }>;
}

/** Fire-and-forget: ask extension to open Cursor Chat with MCP install prompt. */
export function installMcpOptional(): void {
  if (!isVSCode) return;
  vscodeApi!.postMessage({ id: String(++_messageId), type: 'INSTALL_MCP_OPTIONAL' });
}

/** Dismiss the jira-mcp banner permanently. */
export async function dismissMcpBanner(): Promise<void> {
  if (!isVSCode) return;
  await callExtension('DISMISS_MCP_BANNER');
}

// ── Public Jira API ───────────────────────────────────────────────────────────

export interface JiraProject {
  key: string;
  name: string;
}

export async function getProjects(): Promise<JiraProject[]> {
  if (isVSCode) {
    return callExtension('GET_PROJECTS') as Promise<JiraProject[]>;
  }
  return browserFetch<JiraProject[]>('/api/projects');
}

export interface JiraIssueSummary {
  key: string;
  fields?: {
    summary?: string;
    status?: { name?: string };
    assignee?: { displayName?: string };
    issuetype?: { name?: string; iconUrl?: string };
    priority?: { name?: string; iconUrl?: string };
  };
}

export async function getIssues(project: string, jql?: string): Promise<{ issues: JiraIssueSummary[] }> {
  if (isVSCode) {
    return callExtension('GET_ISSUES', { project, ...(jql ? { jql } : {}) }) as Promise<{ issues: JiraIssueSummary[] }>;
  }
  if (jql) {
    return browserPost<{ issues: JiraIssueSummary[] }>('/api/issues', { project, jql });
  }
  return browserFetch<{ issues: JiraIssueSummary[] }>(`/api/issues?project=${encodeURIComponent(project)}`);
}

export interface JiraIssueDetail {
  key: string;
  fields: {
    summary: string;
    description?: unknown;
    status: { name: string };
    priority?: { name: string; iconUrl?: string };
    issuetype: { name: string; iconUrl?: string };
    assignee?: { displayName: string } | null;
    reporter?: { displayName: string };
    created?: string;
    updated?: string;
    duedate?: string | null;
    labels?: string[];
    story_points?: number | null;
    sprint?: unknown;
    epic?: { key: string; fields?: { summary?: string } } | null;
    subtasks?: { key: string; fields: { summary?: string; status?: { name?: string } } }[];
    issuelinks?: {
      type?: { name?: string };
      inwardIssue?: { key: string };
      outwardIssue?: { key: string };
    }[];
    attachment?: { filename: string; content: string }[];
    comment?: {
      comments?: {
        author?: { displayName: string };
        body?: unknown;
        created?: string;
      }[];
    };
    fixVersions?: { name: string }[];
  };
}

export async function getIssue(key: string): Promise<JiraIssueDetail> {
  if (isVSCode) {
    return callExtension('GET_ISSUE', { key }) as Promise<JiraIssueDetail>;
  }
  return browserFetch<JiraIssueDetail>(`/api/issue/${key}`);
}
