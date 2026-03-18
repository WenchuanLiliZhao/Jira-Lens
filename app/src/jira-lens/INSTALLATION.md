# Jira Lens — Installation Guide

This guide helps any team member set up the Jira Lens on their own machine using their own Jira account.

---

## Prerequisites

| Requirement | Minimum version | Check |
|-------------|----------------|-------|
| Node.js | 18+ | `node --version` |
| npm | 8+ | `npm --version` |
| Jira Cloud access | — | Must have "Browse Projects" permission |

---

## Part 1 — Get Your Jira Credentials

You need three values. Every person uses their own credentials.

### 1.1 Find your Jira domain

Your Jira domain is the part of the URL before `.atlassian.net`:

```
https://your-company.atlassian.net  →  JIRA_DOMAIN = your-company.atlassian.net
```

### 1.2 Note your email

The email address you use to log in to Jira:

```
JIRA_EMAIL = you@your-company.com
```

### 1.3 Create an API token

1. Go to: https://id.atlassian.com/manage-profile/security/api-tokens
2. Click **Create API token**
3. Enter a label (e.g. `jira-lens-local`) and an expiration date
4. Click **Create** — **copy the token immediately** (shown only once)

```
JIRA_TOKEN = ATATT3xFfGF0...
```

> **Note:** If your organisation uses scoped tokens, select the **Jira** app and grant at minimum the `read:jira-work` permission.

---

## Part 2 — Configure the Project

### 2.1 Clone / open the repo

This guide assumes you have the `app` project already open. If not:

```bash
git clone <repo-url>
cd app
npm install
```

### 2.2 Set your credentials

Open `src/playground/jira-lens/server.js` and update the `CONFIG` block at the top:

```js
const CONFIG = {
  JIRA_DOMAIN: process.env.JIRA_DOMAIN || 'your-company.atlassian.net',
  JIRA_EMAIL:  process.env.JIRA_EMAIL  || 'you@your-company.com',
  JIRA_TOKEN:  process.env.JIRA_TOKEN  || 'your-api-token-here',
};
```

> **Alternative:** Use environment variables instead of editing the file directly (recommended if you share the repo):
> ```bash
> export JIRA_DOMAIN=your-company.atlassian.net
> export JIRA_EMAIL=you@your-company.com
> export JIRA_TOKEN=your-api-token
> ```

### 2.3 Set your Jira project key

Open `src/playground/jira-lens/content.tsx` and update this line:

```ts
const JIRA_PROJECT_KEYS: JiraProjectKeys = ['YOUR-PROJECT-KEY'];
```

To find your project key: open any Jira issue — it's the prefix before the dash, e.g. `PROJ` in `PROJ-42`.

You can list multiple keys:

```ts
const JIRA_PROJECT_KEYS: JiraProjectKeys = ['PROJ', 'BACKEND', 'DESIGN'];
```

---

## Part 3 — Run the Browser UI

From the `app` directory:

```bash
# Option A: single command — starts proxy + UI dev server together
npm run dev:jira

# Option B: two separate terminals
# Terminal 1
npm run dev:jira-proxy    # starts proxy on localhost:3001

# Terminal 2
npm run dev               # starts Vite UI on localhost:5173
```

Open your browser at `http://localhost:5173` and navigate to the Jira Lens playground page.

### Verify the proxy is working

```bash
curl http://localhost:3001/api/projects
# Expected: [{"key":"YOUR-PROJECT-KEY","name":"..."}]
```

If you see `[]` (empty array), your credentials are incorrect or the project key doesn't match. If you see a connection error, the proxy is not running.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|-------------|-----|
| `ERR_CONNECTION_REFUSED` in browser | Proxy not running | Run `npm run dev:jira-proxy` |
| `[]` empty projects list | Wrong credentials or token expired | Re-check `JIRA_DOMAIN`, `JIRA_EMAIL`, `JIRA_TOKEN` |
| `No matching projects found` in UI | `JIRA_PROJECT_KEYS` doesn't match your project | Update `content.tsx` line 16 |
| `HTTP 401 Unauthorized` | Invalid API token | Create a new token at https://id.atlassian.com/manage-profile/security/api-tokens |
| `HTTP 403 Forbidden` | Missing Jira permissions | Ask your Jira admin for "Browse Projects" permission |
| `The requested API has been removed` | Old Jira search API called | The code already uses the new `/rest/api/3/search/jql` — pull latest |

---

## File Reference

| File | Purpose |
|------|---------|
| `server.js` | HTTP proxy (port 3001) — bridges browser and Jira API |
| `content.tsx` | React browser UI — set `JIRA_PROJECT_KEYS` here |
| `FEATURES.md` | List of implemented and planned features |
| `INSTALLATION.md` | This file |
