/**
 * @file content.tsx
 * @description Jira Lens — Browser UI
 *
 * ARCHITECTURE
 * ────────────
 * Three-level navigation rendered by the root <Content> component:
 *
 *   Level 1  ProjectList   — shows all projects
 *   Level 2  IssueList     — shows all issues in the selected project
 *   Level 3  IssueDetail   — shows full detail for a single issue
 *
 * Navigation state is managed by two pieces of state in <Content>:
 *   selectedProject: null → Level 1
 *   selectedProject set, selectedIssue: null → Level 2
 *   selectedProject set, selectedIssue set → Level 3
 *
 * DATA FLOW
 * ─────────
 *   VS Code Webview:  Webview → postMessage → extension.ts → Jira Cloud
 *   Browser (dev):    Browser → server.js proxy (localhost:3001) → Jira Cloud
 *
 * Both paths are abstracted by transport.ts — this file never calls fetch() directly.
 */

import React, { useState, useCallback, useEffect } from 'react';
import { chartNeutral, chartRainbow, use } from '../global-styles/colors';
import {
  getProjects,
  getIssues,
  getIssue,
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

/**
 * Converts an Atlassian Document Format (ADF) node tree to a plain string.
 */
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
      <strong>Request failed</strong>
      <br />
      {message}
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

  if (loading) return <p style={{ color: chartNeutral['6'] }}>Loading projects...</p>;
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

  useEffect(() => { fetchIssues(); }, [fetchIssues]);

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
          {loading ? 'Loading...' : 'Refresh'}
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

  if (loading) return <p style={{ color: chartNeutral['6'] }}>Loading issue...</p>;
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

// ── Root ──────────────────────────────────────────────────────────────────────

export const Content: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<JiraProject | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<JiraIssueSummary | null>(null);

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '0 1rem' }}>
      <h2 style={{ marginBottom: 4 }}>Jira Lens</h2>
      <p style={{ color: chartNeutral['6'], fontSize: 14, marginBottom: 16 }}>
        For local testing only. Do not use in production.
      </p>

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
  );
};
