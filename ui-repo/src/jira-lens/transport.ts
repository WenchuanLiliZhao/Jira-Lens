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
 * How VS Code messaging works:
 *   1. Webview sends { id, type, ...params } via vscode.postMessage()
 *   2. Extension host handles the message, calls Jira, replies with { id, result } or { id, error }
 *   3. Webview receives the reply via window.addEventListener('message', ...)
 *   4. The pending promise resolves or rejects
 */

// ── Environment detection ─────────────────────────────────────────────────────

declare const acquireVsCodeApi: () => { postMessage: (msg: unknown) => void };

const isVSCode: boolean = typeof (window as unknown as Record<string, unknown>).__IS_VSCODE__ === 'boolean'
  && (window as unknown as Record<string, unknown>).__IS_VSCODE__ === true;

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

if (isVSCode) {
  window.addEventListener('message', (event: MessageEvent<{ id: string; result?: unknown; error?: string }>) => {
    const { id, result, error } = event.data;
    const p = pending.get(id);
    if (!p) return;
    pending.delete(id);
    if (error !== undefined) {
      p.reject(new Error(error));
    } else {
      p.resolve(result);
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

// ── Public API ────────────────────────────────────────────────────────────────

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
