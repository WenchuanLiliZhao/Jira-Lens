/**
 * @file content.tsx
 * @description Jira Lens — Webview UI
 *
 * ARCHITECTURE
 * ────────────
 * Top-level <Content> component manages a 3-step state machine:
 *
 *   Step 0  StepCredentials  — Credential input form (domain / email / API token)
 *   Step 1  StepConnecting   — Connection progress (driven by CONNECT_PROGRESS push messages)
 *   Step 2  Main interface   — 3-level Jira browser (Projects → Issues → Issue detail)
 *
 * Step 2 sub-navigation:
 *   Level 1  ProjectList   — shows all projects
 *   Level 2  IssueList     — shows all issues in the selected project
 *   Level 3  IssueDetail   — shows full detail for a single issue
 *
 * NAVIGATION ACTIONS (Step 2 only — rendered in BasicLayout.Navigation end slot)
 * ───────────────────
 *   Refresh          — resets sub-navigation to project list; uses `refreshKey` to
 *                      force-remount the step-2 subtree so all data is re-fetched
 *   Reset connection — clears SecretStorage token and returns to Step 0 (credential form)
 *
 * After reaching Step 2, a dismissable banner may suggest installing jira-mcp
 * for Cursor AI Chat integration (optional enhancement).
 *
 * DATA FLOW
 * ─────────
 *   VS Code Webview:  Webview → postMessage → extension.ts → Jira Cloud
 *   Browser (dev):    Browser → server.js proxy (localhost:3001) → Jira Cloud
 *
 * Both paths are abstracted by transport.ts.
 * In browser dev mode, initialStep defaults to 2 (skip onboarding entirely).
 */

import React, { useState, useCallback, useEffect, Component } from 'react';
import { chartNeutral, chartRainbow, use } from '../global-styles/colors';
import { BasicLayout } from '../components/layout/basic-layout';
import { Button } from '../components/general/button';
import {
  initialStep,
  onPush,
  saveCredentials,
  resetCredentials,
  getMcpInstallState,
  getMcpBannerState,
  installMcpOptional,
  dismissMcpBanner,
  getProjects,
  getIssues,
  getIssue,
  type ConnectProgressMessage,
  type JiraProject,
  type JiraIssueSummary,
  type JiraIssueDetail,
} from './transport';

// ── Project filter ────────────────────────────────────────────────────────────
// Only these Jira project keys will be shown in the UI.
// In the VS Code extension, the extension host returns all accessible projects;
// this filters client-side. Set to [] to show all projects.
const JIRA_PROJECT_KEYS: string[] = ['JL'];
// ─────────────────────────────────────────────────────────────────────────────

// ── Utilities ─────────────────────────────────────────────────────────────────

function adfToPlainText(node: unknown): string {
  if (!node || typeof node !== 'object') return '';
  const n = node as { type?: string; text?: string; content?: unknown[] };
  if (n.type === 'text' && typeof n.text === 'string') return n.text;
  if (Array.isArray(n.content)) return n.content.map(adfToPlainText).join('');
  return '';
}

// ── Shared UI components ──────────────────────────────────────────────────────

function ErrorBox({ message }: { message: string }) {
  return (
    <div
      style={{
        color: chartRainbow['red-100'],
        background: chartRainbow['red-20'],
        padding: 12,
        borderRadius: 4,
        marginBottom: 16,
      }}
    >
      <strong>Error</strong>
      <br />
      {message}
    </div>
  );
}

// ── Step 0: Credential Input ──────────────────────────────────────────────────

function StepCredentials({ onSaved }: { onSaved: () => void }) {
  const [domain, setDomain] = useState('');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain.trim() || !email.trim() || !token.trim()) {
      setError('All fields are required.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await saveCredentials(domain.trim(), email.trim(), token.trim());
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save credentials.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    display: 'block',
    width: '100%',
    padding: '8px 10px',
    fontSize: 13,
    background: use['bg-prime'],
    border: `1px solid ${use['border-prime']}`,
    borderRadius: 4,
    color: 'inherit',
    boxSizing: 'border-box',
    marginBottom: 12,
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 12,
    color: chartNeutral['6'],
    marginBottom: 4,
  };

  return (
    <div style={{ maxWidth: 400 }}>
      <h3 style={{ marginBottom: 8 }}>Connect to Jira</h3>
      <p style={{ color: chartNeutral['6'], fontSize: 14, marginBottom: 20 }}>
        Enter your Jira credentials. Your API token is stored securely in VS Code's encrypted
        secret storage — never in version control.
      </p>

      <form onSubmit={handleSubmit}>
        <label style={labelStyle}>
          Jira domain
          <input
            style={inputStyle}
            type="text"
            placeholder="your-company.atlassian.net"
            value={domain}
            onChange={e => setDomain(e.target.value)}
            autoComplete="off"
          />
        </label>

        <label style={labelStyle}>
          Email
          <input
            style={inputStyle}
            type="email"
            placeholder="you@your-company.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
          />
        </label>

        <label style={labelStyle}>
          API token
          <input
            style={inputStyle}
            type="password"
            placeholder="ATATT3x…"
            value={token}
            onChange={e => setToken(e.target.value)}
            autoComplete="off"
          />
        </label>

        <p style={{ fontSize: 12, color: chartNeutral['6'], marginBottom: 16 }}>
          Create a token at{' '}
          <a
            href="https://id.atlassian.com/manage-profile/security/api-tokens"
            style={{ color: chartRainbow['blue-100'] }}
          >
            id.atlassian.com → Security → API tokens
          </a>
        </p>

        {error && <ErrorBox message={error} />}

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 24px',
            fontSize: 14,
            background: chartRainbow['blue-100'],
            color: chartNeutral['0'],
            border: 'none',
            borderRadius: 6,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Saving…' : 'Connect'}
        </button>
      </form>
    </div>
  );
}

// ── Step 1: Connecting ────────────────────────────────────────────────────────

const STAGE_LABELS: Record<string, string> = {
  validating: 'Validating credentials…',
  fetching:   'Fetching projects…',
  done:       'Connected',
  error:      'Connection failed',
};

function StepConnecting({
  progress,
  onRetry,
}: {
  progress: ConnectProgressMessage | null;
  onRetry: () => void;
}) {
  const stage = progress?.stage ?? 'validating';
  const isError = stage === 'error';

  return (
    <div style={{ maxWidth: 360 }}>
      <h3 style={{ marginBottom: 16 }}>Connecting to Jira</h3>

      {(['validating', 'fetching', 'done'] as const).map(s => {
        const steps = ['validating', 'fetching', 'done'] as const;
        const currentIdx = steps.indexOf(stage as typeof steps[number]);
        const stepIdx = steps.indexOf(s);
        const isDone = stepIdx < currentIdx || (stage === 'done' && stepIdx <= currentIdx);
        const isCurrent = s === stage && stage !== 'done';
        const color = isDone || stage === 'done'
          ? chartRainbow['green-100']
          : isCurrent
            ? chartRainbow['blue-100']
            : chartNeutral['4'];

        return (
          <div
            key={s}
            style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: color,
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: 14, color }}>
              {STAGE_LABELS[s]}
            </span>
          </div>
        );
      })}

      {isError && (
        <div style={{ marginTop: 8 }}>
          <ErrorBox message={progress?.message ?? 'Connection failed. Check your credentials and try again.'} />
          <button
            type="button"
            onClick={onRetry}
            style={{
              padding: '8px 18px',
              fontSize: 13,
              background: 'transparent',
              border: `1px solid ${use['border-prime']}`,
              borderRadius: 4,
              cursor: 'pointer',
            }}
          >
            Update credentials
          </button>
        </div>
      )}
    </div>
  );
}

// ── Level 1: Project List ─────────────────────────────────────────────────────

function ProjectList({ onSelect }: { onSelect: (project: JiraProject) => void }) {
  const [projects, setProjects] = useState<JiraProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getProjects();
        const filtered = JIRA_PROJECT_KEYS.length > 0
          ? data.filter(p => JIRA_PROJECT_KEYS.includes(p.key))
          : data;
        setProjects(filtered);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Request failed');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p style={{ color: chartNeutral['6'] }}>Loading projects…</p>;
  if (error) return <ErrorBox message={error} />;

  return (
    <div>
      {projects.length === 0 ? (
        <p style={{ color: chartNeutral['6'] }}>
          No matching projects found. Check JIRA_PROJECT_KEYS in content.tsx.
        </p>
      ) : (
        projects.map(p => (
          <button
            key={p.key}
            type="button"
            onClick={() => onSelect(p)}
            style={{
              display: 'block',
              width: '100%',
              textAlign: 'left',
              padding: '12px 16px',
              marginBottom: 8,
              background: use['bg-prime'],
              border: `1px solid ${use['border-prime']}`,
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 14,
            }}
          >
            <strong>{p.name}</strong>{' '}
            <span style={{ color: chartNeutral['6'] }}>({p.key})</span>
          </button>
        ))
      )}
    </div>
  );
}

// ── Level 2: Issue List ───────────────────────────────────────────────────────

function IssueList({
  project,
  onBack,
  onSelectIssue,
}: {
  project: JiraProject;
  onBack: () => void;
  onSelectIssue: (issue: JiraIssueSummary) => void;
}) {
  const [issues, setIssues] = useState<JiraIssueSummary[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchIssues = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getIssues(project.key);
      setIssues(data.issues);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed');
      setIssues(null);
    } finally {
      setLoading(false);
    }
  }, [project.key]);

  useEffect(() => { void fetchIssues(); }, [fetchIssues]);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <button
          type="button"
          onClick={onBack}
          style={{
            padding: '6px 12px',
            fontSize: 13,
            background: 'transparent',
            border: `1px solid ${use['border-prime']}`,
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          ← Back
        </button>
        <span style={{ fontWeight: 600 }}>
          {project.name}{' '}
          <span style={{ color: chartNeutral['6'], fontWeight: 400 }}>({project.key})</span>
        </span>
        <button
          type="button"
          onClick={fetchIssues}
          disabled={loading}
          style={{
            marginLeft: 'auto',
            padding: '6px 12px',
            fontSize: 13,
            background: chartRainbow['blue-100'],
            color: chartNeutral['0'],
            border: 'none',
            borderRadius: 4,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Loading…' : 'Refresh'}
        </button>
      </div>

      {error && <ErrorBox message={error} />}

      {!error && issues !== null && (
        <div>
          {issues.length === 0 ? (
            <p style={{ color: chartNeutral['6'] }}>No issues</p>
          ) : (
            issues.map(i => {
              const f = i.fields ?? {};
              return (
                <button
                  key={i.key}
                  type="button"
                  onClick={() => onSelectIssue(i)}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    padding: 12,
                    border: `1px solid ${use['border-prime']}`,
                    marginBottom: 8,
                    borderRadius: 4,
                    background: use['bg-prime'],
                    cursor: 'pointer',
                  }}
                >
                  <strong>{i.key}</strong> {f.summary ?? '(No title)'}
                  <br />
                  <small style={{ color: chartNeutral['6'] }}>
                    {f.issuetype?.name ?? '-'} · {f.status?.name ?? '-'} ·{' '}
                    {f.assignee?.displayName ?? 'Unassigned'}
                  </small>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

// ── Level 3: Issue Detail ─────────────────────────────────────────────────────

function IssueDetail({ issueKey, onBack }: { issueKey: string; onBack: () => void }) {
  const [issue, setIssue] = useState<JiraIssueDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getIssue(issueKey);
        setIssue(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Request failed');
        setIssue(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [issueKey]);

  if (loading) return <p style={{ color: chartNeutral['6'] }}>Loading issue…</p>;
  if (error) return <ErrorBox message={error} />;
  if (!issue) return null;

  const f = issue.fields;
  const descText = f.description && typeof f.description === 'object'
    ? adfToPlainText(f.description)
    : '';

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <button
          type="button"
          onClick={onBack}
          style={{
            padding: '6px 12px',
            fontSize: 13,
            background: 'transparent',
            border: `1px solid ${use['border-prime']}`,
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          ← Back
        </button>
        <span style={{ fontWeight: 600 }}>{issue.key}</span>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
          {f.issuetype?.iconUrl && (
            <img src={f.issuetype.iconUrl} alt="" width={16} height={16} style={{ marginTop: 2 }} />
          )}
          <span style={{ fontWeight: 600, fontSize: 18 }}>{f.summary}</span>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          <span style={{ padding: '2px 8px', borderRadius: 4, background: chartRainbow['blue-20'], color: chartRainbow['blue-100'], fontSize: 12 }}>
            {f.status?.name ?? '-'}
          </span>
          {f.priority?.name && (
            <span style={{ color: chartNeutral['6'], fontSize: 13 }}>{f.priority.name}</span>
          )}
        </div>

        <div style={{ fontSize: 13, color: chartNeutral['6'], marginBottom: 16 }}>
          Assignee: {f.assignee?.displayName ?? 'Unassigned'} · Reporter: {f.reporter?.displayName ?? '-'}
          {f.created && ` · Created: ${f.created.slice(0, 10)}`}
          {f.updated && ` · Updated: ${f.updated.slice(0, 10)}`}
          {f.duedate && ` · Due: ${f.duedate}`}
        </div>

        {(f.story_points != null || (f.labels?.length ?? 0) > 0 || (f.fixVersions?.length ?? 0) > 0) && (
          <div style={{ fontSize: 13, marginBottom: 16 }}>
            {f.story_points != null && <span style={{ marginRight: 12 }}>Story points: {f.story_points}</span>}
            {f.labels && f.labels.length > 0 && <span style={{ marginRight: 12 }}>Labels: {f.labels.join(', ')}</span>}
            {f.fixVersions && f.fixVersions.length > 0 && <span>Fix versions: {f.fixVersions.map(v => v.name).join(', ')}</span>}
          </div>
        )}

        {descText && (
          <div style={{ marginBottom: 16 }}>
            <strong style={{ fontSize: 13 }}>Description</strong>
            <div style={{ marginTop: 4, whiteSpace: 'pre-wrap', fontSize: 14 }}>{descText}</div>
          </div>
        )}

        {f.subtasks && f.subtasks.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <strong style={{ fontSize: 13 }}>Subtasks</strong>
            <ul style={{ margin: '4px 0 0 20px', padding: 0 }}>
              {f.subtasks.map(st => (
                <li key={st.key} style={{ marginBottom: 4 }}>
                  {st.key} {st.fields?.summary ?? ''} ({st.fields?.status?.name ?? '-'})
                </li>
              ))}
            </ul>
          </div>
        )}

        {f.issuelinks && f.issuelinks.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <strong style={{ fontSize: 13 }}>Linked issues</strong>
            <ul style={{ margin: '4px 0 0 20px', padding: 0 }}>
              {f.issuelinks.map((link, idx) => {
                const other = link.inwardIssue ?? link.outwardIssue;
                return other ? (
                  <li key={`${link.inwardIssue?.key ?? ''}-${link.outwardIssue?.key ?? ''}-${idx}`}>
                    {link.type?.name ?? 'related'}: {other.key}
                  </li>
                ) : null;
              })}
            </ul>
          </div>
        )}

        {f.comment?.comments && f.comment.comments.length > 0 && (
          <div>
            <strong style={{ fontSize: 13 }}>Comments</strong>
            <div style={{ marginTop: 8 }}>
              {f.comment.comments.map((c, idx) => (
                <div
                  key={idx}
                  style={{ padding: 12, marginBottom: 8, border: `1px solid ${use['border-prime']}`, borderRadius: 4, fontSize: 13 }}
                >
                  <strong>{c.author?.displayName ?? 'Unknown'}</strong>
                  {c.created && <span style={{ color: chartNeutral['6'], marginLeft: 8 }}>{c.created.slice(0, 16)}</span>}
                  <div style={{ marginTop: 4 }}>{adfToPlainText(c.body)}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Breadcrumb ────────────────────────────────────────────────────────────────

function Breadcrumb({
  project,
  issueKey,
  onGoToProjects,
  onGoToIssues,
}: {
  project: JiraProject | null;
  issueKey: string | null;
  onGoToProjects: () => void;
  onGoToIssues: () => void;
}) {
  if (!project) return null;
  return (
    <div style={{ fontSize: 13, color: chartNeutral['6'], marginBottom: 12 }}>
      <button
        type="button"
        onClick={onGoToProjects}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0 }}
      >
        Projects
      </button>
      {' > '}
      <button
        type="button"
        onClick={onGoToIssues}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0 }}
      >
        {project.name}
      </button>
      {issueKey && <>{' > '}<span>{issueKey}</span></>}
    </div>
  );
}

// ── MCP Install Banner (optional, shown on main interface) ───────────────────

function McpBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    getMcpBannerState().then(({ show }) => setVisible(show)).catch(() => {});
  }, []);

  if (!visible) return null;

  const handleDismiss = () => {
    setVisible(false);
    dismissMcpBanner().catch(() => {});
  };

  const handleInstall = () => {
    installMcpOptional();
    handleDismiss();
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 14px',
        marginBottom: 16,
        background: chartRainbow['blue-20'],
        border: `1px solid ${chartRainbow['blue-60']}`,
        borderRadius: 6,
        fontSize: 13,
      }}
    >
      <span style={{ flex: 1 }}>
        <strong>Enhance your workflow:</strong> Install{' '}
        <a
          href="https://github.com/WenchuanLiliZhao/jira-mcp"
          style={{ color: chartRainbow['blue-100'] }}
        >
          jira-mcp
        </a>{' '}
        to use Jira directly in Cursor AI Chat.
      </span>
      <button
        type="button"
        onClick={handleInstall}
        style={{
          padding: '5px 12px',
          fontSize: 12,
          background: chartRainbow['blue-100'],
          color: chartNeutral['0'],
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
      >
        Install via AI
      </button>
      <button
        type="button"
        onClick={handleDismiss}
        style={{
          padding: '5px 8px',
          fontSize: 12,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: chartNeutral['6'],
        }}
        title="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}

// ── Navigation actions ────────────────────────────────────────────────────────
//
// AI hint: JiraNavActions is the single place to add/remove global action buttons
// that appear in the BasicLayout navigation bar. All three buttons are always
// visible regardless of the current step — no step-based conditional rendering.
//
// Prop contract:
//   onRefresh         — increment refreshKey in <Content> to force-remount the
//                       step-2 subtree, re-fetching all Jira data
//   onResetConnection — delete stored token (via transport.resetCredentials) and
//                       transition back to Step 0 (credential form)
//   mcpInstalled      — whether ~/Jira-MCP/package.json exists; controls the
//                       icon and tooltip of the jira-mcp button
//   onInstallMcp      — opens Cursor Chat with the jira-mcp install/update prompt
//
// To add a new action: add a <Button> here and the corresponding callback to the
// props interface; wire it in the <Content> component below.

interface JiraNavActionsProps {
  onRefresh: () => void;
  onResetConnection: () => void;
  mcpInstalled: boolean;
  onInstallMcp: () => void;
}

function JiraNavActions({ onRefresh, onResetConnection, mcpInstalled, onInstallMcp }: JiraNavActionsProps) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {/* Refresh: re-fetches all Jira data by remounting the main interface */}
      <Button
        variant="ghost"
        size="medium"
        startIcon="refresh"
        onClick={onRefresh}
        title="Refresh"
      >
        Refresh
      </Button>
      {/* Reset connection: clears stored credentials → returns to credential form */}
      <Button
        variant="ghost"
        size="medium"
        startIcon="link_off"
        onClick={onResetConnection}
        title="Reset Jira connection"
      >
        Reset Jira connection
      </Button>
      {/* jira-mcp: install if missing, update if present; opens Cursor Chat with prompt */}
      <Button
        variant="ghost"
        size="medium"
        startIcon={mcpInstalled ? 'system_update' : 'download'}
        onClick={onInstallMcp}
        title={mcpInstalled ? 'Update jira-mcp' : 'Install jira-mcp for AI Chat'}
      >
        {mcpInstalled ? 'Update jira-mcp' : 'Install jira-mcp for AI Chat'}
      </Button>
    </div>
  );
}

// ── Error boundary (surfaces React errors in webview for debugging) ─────────────

export class JiraLensErrorBoundary extends Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[Jira Lens] React error:', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24, maxWidth: 500 }}>
          <ErrorBox message={this.state.error.message} />
          <pre style={{ fontSize: 11, overflow: 'auto', marginTop: 12 }}>
            {this.state.error.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

// ── Root ──────────────────────────────────────────────────────────────────────

export const Content: React.FC = () => {
  const [step, setStep] = useState<0 | 1 | 2>(initialStep as 0 | 1 | 2);
  const [progress, setProgress] = useState<ConnectProgressMessage | null>(null);

  // Step 2: sub-navigation state
  const [selectedProject, setSelectedProject] = useState<JiraProject | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<JiraIssueSummary | null>(null);

  // Incrementing this key force-remounts the entire step-2 subtree, triggering
  // fresh data fetches in ProjectList / IssueList / IssueDetail.
  const [refreshKey, setRefreshKey] = useState(0);

  // Whether ~/Jira-MCP/package.json exists — controls the Nav jira-mcp button icon/tooltip.
  const [mcpInstalled, setMcpInstalled] = useState(false);

  useEffect(() => {
    getMcpInstallState().then(({ installed }) => setMcpInstalled(installed)).catch(() => {});
  }, []);

  useEffect(() => {
    return onPush(msg => {
      if (msg.type === 'CONNECT_PROGRESS') {
        setProgress(msg);
        if (msg.stage === 'done') {
          setTimeout(() => setStep(2), 600);
        }
      }
    });
  }, []);

  const handleCredentialsSaved = () => {
    setProgress(null);
    setStep(1);
  };

  const handleRetryCredentials = () => {
    setProgress(null);
    setStep(0);
  };

  // Nav action: re-fetch all data by resetting sub-nav and remounting the subtree.
  const handleRefresh = useCallback(() => {
    setSelectedProject(null);
    setSelectedIssue(null);
    setRefreshKey(k => k + 1);
  }, []);

  // Nav action: open Cursor Chat with the jira-mcp install/update prompt.
  const handleInstallMcp = useCallback(() => {
    installMcpOptional();
  }, []);

  // Nav action: wipe the stored token and return to the credential form.
  const handleResetConnection = useCallback(async () => {
    await resetCredentials();
    setSelectedProject(null);
    setSelectedIssue(null);
    setProgress(null);
    setRefreshKey(0);
    setStep(0);
  }, []);

  return (
    <BasicLayout
      navigation={{
        // "Jira Lens" title always visible in the nav start slot.
        start: [
          <span
            key="title"
            style={{ fontWeight: 600, fontSize: 15 }}
          >
            Jira Lens
          </span>,
        ],
        // All three action buttons are always visible regardless of step.
        // AI hint: to conditionalize per step, wrap in a ternary here.
        end: [
          <JiraNavActions
            key="nav-actions"
            onRefresh={handleRefresh}
            onResetConnection={handleResetConnection}
            mcpInstalled={mcpInstalled}
            onInstallMcp={handleInstallMcp}
          />,
        ],
      }}
    >
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '24px 1rem' }}>

        {step < 2 && (
          <p style={{ color: chartNeutral['6'], fontSize: 14, marginBottom: 24 }}>
            {step === 0 && 'Step 1 of 2 — Connect to Jira'}
            {step === 1 && 'Step 2 of 2 — Connecting…'}
          </p>
        )}

        {step === 0 && (
          <StepCredentials onSaved={handleCredentialsSaved} />
        )}

        {step === 1 && (
          <StepConnecting progress={progress} onRetry={handleRetryCredentials} />
        )}

        {/* key={refreshKey} remounts this entire section on each refresh, re-fetching all data */}
        {step === 2 && (
          <div key={refreshKey}>
            <McpBanner />

            <Breadcrumb
              project={selectedProject}
              issueKey={selectedIssue?.key ?? null}
              onGoToProjects={() => { setSelectedProject(null); setSelectedIssue(null); }}
              onGoToIssues={() => setSelectedIssue(null)}
            />

            {selectedProject === null ? (
              <ProjectList onSelect={setSelectedProject} />
            ) : selectedIssue ? (
              <IssueDetail issueKey={selectedIssue.key} onBack={() => setSelectedIssue(null)} />
            ) : (
              <IssueList
                project={selectedProject}
                onBack={() => setSelectedProject(null)}
                onSelectIssue={setSelectedIssue}
              />
            )}
          </div>
        )}

      </div>
    </BasicLayout>
  );
};
