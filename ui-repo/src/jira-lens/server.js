/**
 * @file server.js
 * @description Jira HTTP Proxy Server
 *
 * PURPOSE
 * -------
 * Browsers cannot call Jira's REST API directly due to CORS restrictions.
 * This Node.js server runs locally on port 3001 and acts as a CORS-free proxy:
 *   Browser → localhost:3001/api/* → Jira Cloud REST API
 *
 * USAGE
 *   node server.js
 *   JIRA_TOKEN=xxx node server.js   (via env vars)
 *
 * REQUIRES Node.js 18+ (uses built-in `fetch`)
 *
 * ENDPOINTS
 *   GET /api/health                Verify credentials (calls /rest/api/3/myself)
 *   GET /api/projects              List all projects (returns key + name)
 *   GET /api/issues?project=KEY    List issues in a project
 *   GET /api/issue/:KEY            Full detail for a single issue
 */

// ── CONFIG ──────────────────────────────────────────────────────────────────
// Credentials are read from env vars first, then fall back to hardcoded values.
// In production-like setups, always use env vars.
const CONFIG = {
  JIRA_DOMAIN: process.env.JIRA_DOMAIN || 'wenchuanlilizhao.atlassian.net',
  JIRA_EMAIL:  process.env.JIRA_EMAIL  || 'wenchuanlilizhao@gmail.com',
  JIRA_TOKEN:  process.env.JIRA_TOKEN  || 'ATATT3xFfGF00rrcg_Py6WYhm2JHhWa-ShHDGwxn68GH3gS7hayRSpHJd8kAUdX9ErtMNXay7WKF9Bs_5VogVPFZaAEHXxU2vtBB4fQYuzL-7X7aGlPTvodY4hefoo8Wr73mNQitRBkEXU99YzsqBhPyuVhuvgB5UrW-65fbQElj2fUZPrzrwaU=A062502E',
};
const PORT = 3001;
// ────────────────────────────────────────────────────────────────────────────

import http from 'http';
import url from 'url';

// Jira Cloud REST API v3 base URL
const JIRA_BASE = `https://${CONFIG.JIRA_DOMAIN}`;

// HTTP Basic Auth header: base64("email:token")
const auth = Buffer.from(`${CONFIG.JIRA_EMAIL}:${CONFIG.JIRA_TOKEN}`).toString('base64');

// ── Jira API helper ──────────────────────────────────────────────────────────
/**
 * Makes an authenticated request to the Jira REST API.
 *
 * @param {string} path  - API path, e.g. "/rest/api/3/project"
 * @param {object} opts  - fetch options (method, body, etc.)
 * @returns {Promise<any>} Parsed JSON response
 * @throws {Error} If response is not OK, throws with Jira's error message
 */
async function jiraFetch(path, opts = {}) {
  const res = await fetch(`${JIRA_BASE}${path}`, {
    ...opts,
    headers: {
      Accept: 'application/json',
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
      ...opts.headers,
    },
  });
  const text = await res.text();
  if (!res.ok) {
    // Jira returns errors as JSON with `errorMessages` array or plain text
    const err = text ? JSON.parse(text).errorMessages?.[0] || text : `HTTP ${res.status}`;
    throw new Error(err);
  }
  return text ? JSON.parse(text) : null;
}

// ── Response helpers ─────────────────────────────────────────────────────────
/**
 * Sends a JSON response with CORS headers.
 * CORS is always open (*) since this proxy is for local dev only.
 */
function send(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  });
  res.end(JSON.stringify(data));
}

/** Sends a JSON error response: { error: message } */
function sendError(res, status, message) {
  send(res, status, { error: message });
}

// ── HTTP Server ──────────────────────────────────────────────────────────────
const server = http.createServer(async (req, res) => {

  // Handle CORS preflight requests (sent by browsers before actual requests)
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return;
  }

  const parsed = url.parse(req.url, true);
  const path   = parsed.pathname;
  const query  = parsed.query;

  try {

    // ── GET /api/health ───────────────────────────────────────────────────
    // Verifies credentials by calling /rest/api/3/myself.
    // Jira returns 200+[] for projects when auth fails; this endpoint returns 401 explicitly.
    if (path === '/api/health') {
      try {
        const me = await jiraFetch('/rest/api/3/myself');
        send(res, 200, { ok: true, user: me?.displayName ?? me?.emailAddress ?? 'unknown' });
      } catch (e) {
        sendError(res, 401, e.message || 'Invalid JIRA_TOKEN or credentials');
      }
      return;
    }

    // ── GET /api/projects ────────────────────────────────────────────────
    // Returns: Array<{ key: string, name: string }>
    // Tries GET /rest/api/3/project first; falls back to /project/search if empty.
    // Note: Jira returns [] (not 401) when token is invalid — use /api/health to verify.
    if (path === '/api/projects') {
      let raw = await jiraFetch('/rest/api/3/project');
      let arr = Array.isArray(raw) ? raw : [];
      if (arr.length === 0) {
        const search = await jiraFetch('/rest/api/3/project/search?maxResults=100');
        arr = search?.values ?? (Array.isArray(search) ? search : []);
      }
      const list = (arr || []).map((p) => ({ key: p.key, name: p.name }));
      send(res, 200, list);
      return;
    }

    // ── GET /api/issues?project=KEY ──────────────────────────────────────
    // Returns: { issues: JiraIssue[] }  (summary/list fields only)
    // Tries POST /rest/api/3/search/jql first; falls back to deprecated /search if removed.
    if (path === '/api/issues') {
      const project = query.project;
      if (!project) {
        sendError(res, 400, 'Missing project query param');
        return;
      }
      const fields = [
        'summary', 'status', 'assignee', 'issuetype', 'priority',
        'created', 'updated', 'labels', 'fixVersions',
      ];
      const body = { jql: `project = ${project}`, fields, maxResults: 100 };
      let data;
      try {
        data = await jiraFetch('/rest/api/3/search/jql', {
          method: 'POST',
          body: JSON.stringify(body),
        });
      } catch (e) {
        const msg = (e.message || '').toLowerCase();
        if (msg.includes('removed') || msg.includes('deprecated') || msg.includes('404')) {
          data = await jiraFetch('/rest/api/3/search', {
            method: 'POST',
            body: JSON.stringify({ ...body, startAt: 0 }),
          });
        } else {
          throw e;
        }
      }
      send(res, 200, { issues: data?.issues ?? [] });
      return;
    }

    // ── GET /api/issue/:KEY ──────────────────────────────────────────────
    // Returns: Full Jira issue object with all detail fields
    // Jira API: GET /rest/api/3/issue/:key?fields=...
    // KEY format: e.g. MATH-1, ABC-123
    const issueMatch = path.match(/^\/api\/issue\/([A-Z][A-Z0-9]+-\d+)$/);
    if (issueMatch) {
      const key = issueMatch[1];
      const fields = [
        'summary', 'description', 'status', 'priority', 'issuetype',
        'assignee', 'reporter', 'created', 'updated', 'duedate',
        'labels', 'fixVersions', 'subtasks', 'issuelinks', 'attachment',
        'comment',
      ].join(',');
      const data = await jiraFetch(`/rest/api/3/issue/${key}?fields=${fields}`);
      if (!data) {
        sendError(res, 404, `Issue ${key} not found`);
        return;
      }
      // Jira stores story points and sprint in custom fields.
      // customfield_10016 = Story Points
      // customfield_10020 = Sprint
      // We normalise these to readable keys before sending to the UI.
      const f = data.fields || {};
      const out = {
        ...data,
        fields: {
          ...f,
          story_points: f.customfield_10016 ?? null,
          sprint:       f.customfield_10020 ?? null,
          epic:         f.parent ? { key: f.parent.key, fields: f.parent.fields } : null,
        },
      };
      send(res, 200, out);
      return;
    }

    // No route matched
    sendError(res, 404, 'Not found');

  } catch (err) {
    console.error(err);
    sendError(res, 500, err.message || 'Internal server error');
  }
});

server.listen(PORT, () => {
  console.log(`Jira proxy listening on http://localhost:${PORT}`);
});
