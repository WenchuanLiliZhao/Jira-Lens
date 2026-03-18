# Jira Lens — Feature Tracker

## Browser UI (`content.tsx` + `server.js`)

| Feature | Status | Notes |
|---------|--------|-------|
| Project list | ✅ Done | Filtered by `JIRA_PROJECT_KEYS` |
| Issue list (per project) | ✅ Done | Shows summary, type, status, assignee, priority |
| Issue detail view | ✅ Done | Full fields: description, comments, subtasks, linked issues, story points, labels, fix versions |
| 3-level breadcrumb navigation | ✅ Done | Projects → Issue list → Issue detail |
| ADF → plain text rendering | ✅ Done | Converts Jira's rich text format to readable text |
| Click-through from issue list to detail | ✅ Done | Issue cards are clickable buttons |
| Refresh button on issue list | ✅ Done | Re-fetches from proxy |
| Error display | ✅ Done | Shows proxy connection errors clearly |
| One-command startup (`npm run dev:jira`) | ✅ Done | Runs proxy + Vite together via `concurrently` |
| Sprint info in issue detail | ❌ Not yet | Server returns `customfield_10020` but UI doesn't display it |
| Epic info in issue detail | ❌ Not yet | `parent` field is fetched but not rendered |
| Attachment list | ❌ Not yet | Field is fetched but not rendered |
| Issue status filter | ❌ Not yet | Could add a dropdown to filter by status |
| Assignee filter | ❌ Not yet | Could filter issues by assignee |
| Search / keyword filter | ❌ Not yet | Local filter or JQL-backed search |
| Sprint board view | ❌ Not yet | Group issues by Sprint in a Kanban-style layout |
| Pagination | ❌ Not yet | Currently hardcoded to `maxResults=100` |
| Dark mode support | ❌ Not yet | Uses design system colors, could follow system theme |

---

## Potential Additions

| Idea | Value | Effort |
|------|-------|--------|
| Sprint board view | High — visualizes workload at a glance | Medium |
| Epic grouping in issue list | Medium — easier to see the big picture | Low |
| Webhook listener for real-time updates | Medium — keep UI in sync without refreshing | High |
| Export to Markdown / clipboard | Low — useful for sharing summaries | Low |
| Multi-project support | Low — currently only one project shown at a time | Low |
