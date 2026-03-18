# Jira Lens — Project Report

> Source: Confluence space **JL** · Updated: 2026-03-18

---

## Project Overview

**Jira Lens** is a Cursor / VS Code extension that treats Jira as a CMS — a structured data backend — rather than an end-user application. It provides a flexible, Notion-inspired observation layer for cross-project visibility, powered by both human interaction and AI.

### Why It Exists

The closest existing tool, Atlassian's [Atlascode](https://open-vsx.org/extension/atlassian/atlascode), has fundamental limitations:

- Locked into VS Code native Tree Views — low information density, rigid layout
- Single-project, single-user mindset with no cross-project observation
- Breadth without depth — covers Jira, Bitbucket, and pipelines but none of them well
- No AI integration whatsoever
- Labeled as "Labs" and effectively unmaintained

Jira Lens addresses these with two key architectural choices Atlascode cannot replicate:

1. **Webview-first UI** — full HTML/CSS/JS control, enabling Notion-level flexibility: rich cards, multiple view types, and custom dashboards
2. **AI-native from day one** — an embedded MCP (Model Context Protocol) layer allows AI agents inside the IDE to read, query, and write to Jira

### Target Users

| User Type | Description |
|---|---|
| **Cross-project observers** | Tech leads, PMs, architects monitoring multiple projects simultaneously — patterns, progress, and blockers across the organization |
| **AI-enabled workflows** | Users who want AI to access Jira: querying issues, summarizing sprint status, integrating project data into AI-assisted development |

---

## Architecture

### ADR-001: Extension + Standalone MCP Server (Decoupled)

The Jira Lens extension and [jira-mcp](https://github.com/WenchuanLiliZhao/jira-mcp) are **separate projects** that share credentials:

```
Jira Lens Extension
├── Jira API Client        ← built-in: auth, requests (SecretStorage + settings)
├── Webview UI              ← human: renders Notion-style interface
└── credential sync         ← writes to ~/Jira-MCP/config/secrets.json on save

jira-mcp (optional, standalone)
├── MCP Server              ← AI: exposes Jira tools to Cursor AI Chat
└── reads secrets.json      ← stays in sync automatically
```

**Rationale:**
- **Independent update cycles** — jira-mcp can be updated via `git pull` without touching the extension
- **No hard dependency** — Extension works without jira-mcp; jira-mcp works without the Extension
- **Single credential entry** — credentials entered in the Extension UI are synced to jira-mcp automatically
- **Future-proof** — jira-mcp can also be used with Claude Desktop or other MCP clients

**Trade-off:** Two separate Jira API clients (extension's built-in vs. jira-mcp's). Mitigated by credential sync; a shared npm package could unify them later if needed.

---

## Basic Interaction Flow

### Step 0 — Credential Input
On first launch, a Webview-based form prompts for `JIRA_DOMAIN`, `JIRA_EMAIL`, and `JIRA_TOKEN`. Credentials are persisted as:
- `JIRA_DOMAIN` + `JIRA_EMAIL` → VS Code `settings.json` (visible in Settings UI)
- `JIRA_TOKEN` → VS Code **SecretStorage API** (encrypted, never in version control)

When saved, credentials are also synced to `~/Jira-MCP/config/secrets.json` (if the directory exists) so the standalone jira-mcp server stays in sync.

### Step 1 — Connecting to Jira
A connection progress screen walks through each stage in real time: validating credentials → fetching projects → finalizing connection. Errors show a clear message with recommended action. On subsequent launches, the extension connects silently.

### Step 2 — Main Interface (MVP)
Once connected, the MVP view is a **Projects card list** — a grid of cards, each representing a Jira project the user has access to. Each card shows project name/key, issue count, and last updated timestamp. Clicking navigates into that project's issue list.

### Optional: jira-mcp Installation Banner
After reaching the main interface, a dismissable banner suggests installing [jira-mcp](https://github.com/WenchuanLiliZhao/jira-mcp) for Cursor AI Chat integration. Clicking "Install via AI" opens Cursor's native Chat panel with a pre-composed install prompt. The banner is suppressed if jira-mcp is already installed or the user has dismissed it (state persisted in VS Code `globalState`).

---

## Sprint Plan & Current Issues

### Sprint 1 — Clarify & Formalize · Mar 15–20 *(active)*
**Goal:** Identify effective patterns from prototypes, define observation scenarios and unified data model.

| Issue | Summary | Type | Priority | Status |
|---|---|---|---|---|
| [JL-5](https://zhaowenchuan.atlassian.net/browse/JL-5) | Identify patterns from prototypes | Exploration | High | To Do |
| [JL-6](https://zhaowenchuan.atlassian.net/browse/JL-6) | Define cross-project observation scenarios | Exploration | High | To Do |
| [JL-7](https://zhaowenchuan.atlassian.net/browse/JL-7) | Define unified data model | Exploration | Medium | To Do |
| [JL-8](https://zhaowenchuan.atlassian.net/browse/JL-8) | Finalize first view specification | Exploration | High | To Do |

### Sprint 2 — UI Prototyping · Mar 21–28
**Goal:** Prototype cross-project views, Notion-style interactions, and view switching in the `app/` playground.

| Issue | Summary | Type | Priority | SP | Status |
|---|---|---|---|---|---|
| [JL-2](https://zhaowenchuan.atlassian.net/browse/JL-2) | Prototype: cross-project view | Task | High | 5 | To Do |
| [JL-3](https://zhaowenchuan.atlassian.net/browse/JL-3) | Prototype: Notion-style interactions | Task | High | 5 | To Do |
| [JL-4](https://zhaowenchuan.atlassian.net/browse/JL-4) | Prototype: view switching | Task | Medium | 3 | To Do |

> Story points use the Fibonacci scale reflecting **relative complexity**, not hours. AI assistance is expected to roughly double throughput on code-generation tasks, but has limited impact on design judgment calls.

### Sprint 3 — Converge · Mar 29–Apr 5
**Goal:** Finalize MVP view specification, compare against Atlascode, and plan Extension migration.

| Issue | Summary | Type | Priority | Status |
|---|---|---|---|---|
| [JL-9](https://zhaowenchuan.atlassian.net/browse/JL-9) | Analyze Atlascode limitations against prototypes | Exploration | Medium | To Do |
| [JL-10](https://zhaowenchuan.atlassian.net/browse/JL-10) | Plan Extension migration | Exploration | Medium | To Do |

### Epic
| Issue | Summary | Status |
|---|---|---|
| [JL-1](https://zhaowenchuan.atlassian.net/browse/JL-1) | Define the Observation Layer | To Do |

---

## Key Experiment: Invoking IDE AI Chat via Extension

*(Completed: 2026-03-17)*

**Objective:** Validate whether a VS Code / Cursor Extension can trigger the IDE's built-in AI chat without requiring users to manually inject an API key, and auto-inject structured Jira Issue context.

**Approach chosen:** `executeCommand("workbench.action.chat.open", { query })` — results appear in Cursor's native Chat panel, no API key needed, reuses the user's existing IDE subscription.

**Conclusions:**
1. ✅ Feasibility confirmed — the Extension can invoke Cursor's native AI chat and inject arbitrary structured context
2. ✅ Users only need to click a button to get AI analysis for a specific Issue (no manual copy-paste)
3. ✅ Data layer (`IssueProvider`) is fully decoupled from the UI — switching to real Jira API requires no UI changes

**Future directions from this experiment:**
- **Click-to-Prompt** — different Issue types (Bug/Story/Epic) trigger different prompt templates; multi-Issue selection with merged context
- **Auto-Inject Cursor Rules** — on activation, write to `.cursor/rules/` to elevate prompts to system-prompt level, benefiting from Anthropic prompt caching (~10% cost)
- **Auto-Inject Cursor Skills** — inject `.cursor/skills/` definitions for AI-callable workflows (e.g. "extract Issue keywords", "generate fix draft")

---

## Current Assets

| Component | Repository |
|---|---|
| Jira MCP Server | [github.com/WenchuanLiliZhao/jira-lens](https://github.com/WenchuanLiliZhao/jira-lens) |
| Jira Lens Extension | [github.com/WenchuanLiliZhao/Jira-Lens](https://github.com/WenchuanLiliZhao/Jira-Lens) — `app/` (this directory) |

---

## Local Development Setup

### 1. Get Jira API Credentials

| Variable | Description | Example |
|---|---|---|
| `JIRA_DOMAIN` | Jira site domain (without `https://`) | `your-company.atlassian.net` |
| `JIRA_EMAIL` | Atlassian account email | `you@example.com` |
| `JIRA_TOKEN` | API token from [Atlassian Account Management](https://id.atlassian.com/manage-profile/security/api-tokens) | `ATATT3xFfGF0...` |

### 2. Configure Credentials

Set values in `jira-lens/server.js` CONFIG, or via environment variables:

```bash
export JIRA_DOMAIN=your-company.atlassian.net
export JIRA_EMAIL=you@example.com
export JIRA_TOKEN=your-api-token
```

### 3. Start Services

```bash
# Option A: Single command (runs proxy + UI together)
npm run dev:jira

# Option B: Two terminals
npm run dev:jira-proxy   # Terminal 1: Proxy
npm run dev              # Terminal 2: UI dev server
```

### 4. Use

Open the playground page in your browser and select a project.

> For local testing only. Credentials are stored in code or environment variables. Requires Node.js 18+.
