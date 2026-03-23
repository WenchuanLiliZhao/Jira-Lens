/**
 * Publish docs/jira-lens-technical-discussions.md to Confluence (Cloud REST API v2).
 *
 * Required env:
 *   JIRA_DOMAIN   e.g. your-site.atlassian.net
 *   JIRA_EMAIL
 *   JIRA_TOKEN    API token
 *
 * Optional:
 *   CONFLUENCE_SPACE_ID
 *   CONFLUENCE_PAGE_TITLE
 *
 * Usage (from app/):
 *   npm run build:extension
 *   node scripts/publish-confluence-discussion.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { marked } from 'marked';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const { confluenceFetch } = require('../out/lib/jira-client.js');

function escapeCdata(text) {
  return text.replace(/\]\]>/g, ']]]]><![CDATA[>');
}

function codeBlockMacro(lang, code) {
  const safeCode = escapeCdata(code.replace(/\r\n/g, '\n').trimEnd());
  const langParam =
    lang && lang !== 'plaintext'
      ? `<ac:parameter ac:name="language">${lang}</ac:parameter>\n  `
      : '';
  return (
    `<ac:structured-macro ac:name="code" ac:schema-version="1">\n` +
    `  ${langParam}<ac:plain-text-body><![CDATA[${safeCode}]]></ac:plain-text-body>\n` +
    `</ac:structured-macro>`
  );
}

/** Same logic as src/lib/confluence.ts — uses ESM `marked` to avoid CJS/ESM conflict. */
function mdToConfluenceStorage(markdown) {
  const parts = [];
  const codeBlockRe = /^```(\w*)\n([\s\S]*?)```$/gm;
  let lastIndex = 0;
  let match;
  while ((match = codeBlockRe.exec(markdown)) !== null) {
    const before = markdown.slice(lastIndex, match.index);
    if (before.trim()) parts.push({ type: 'md', content: before });
    parts.push({ type: 'code', lang: match[1] || 'plaintext', content: match[2] });
    lastIndex = match.index + match[0].length;
  }
  const tail = markdown.slice(lastIndex);
  if (tail.trim()) parts.push({ type: 'md', content: tail });

  let html = '';
  for (const part of parts) {
    if (part.type === 'md') {
      let chunk = marked.parse(part.content, { gfm: true });
      chunk = chunk
        .replace(/<tbody><tbody>/g, '<tbody>')
        .replace(/<\/tbody><\/tbody>/g, '</tbody>');
      html += chunk;
    } else {
      html += codeBlockMacro(part.lang, part.content);
    }
  }
  return html;
}

async function main() {
  const domain = process.env.JIRA_DOMAIN;
  const email = process.env.JIRA_EMAIL;
  const token = process.env.JIRA_TOKEN;
  if (!domain || !email || !token) {
    console.error(
      'Missing credentials. Set JIRA_DOMAIN, JIRA_EMAIL, JIRA_TOKEN (Atlassian API token).',
    );
    process.exit(1);
  }

  const creds = { domain, email, token };

  let spaceId = process.env.CONFLUENCE_SPACE_ID;
  if (!spaceId) {
    const data = await confluenceFetch(creds, '/api/v2/spaces?limit=50');
    const results = data.results ?? [];
    if (results.length === 0) {
      console.error('No Confluence spaces found. Set CONFLUENCE_SPACE_ID manually.');
      process.exit(1);
    }
    const jl = results.find((s) => s.key === 'JL');
    const pick = jl ?? results[0];
    spaceId = pick.id;
    console.log(`Using space: ${pick.key} (${pick.name}) — id=${spaceId}`);
  }

  const mdPath = path.join(__dirname, '..', 'docs', 'jira-lens-technical-discussions.md');
  if (!fs.existsSync(mdPath)) {
    console.error('Markdown file not found:', mdPath);
    process.exit(1);
  }
  const body = fs.readFileSync(mdPath, 'utf8');
  const title =
    process.env.CONFLUENCE_PAGE_TITLE ||
    'Jira Lens — 技术讨论纪要（AI Portal / 本地同步 / Webview）';

  const payload = {
    spaceId,
    title,
    body: {
      storage: {
        value: mdToConfluenceStorage(body),
        representation: 'storage',
      },
    },
  };

  const data = await confluenceFetch(creds, '/api/v2/pages', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  const url = `https://${creds.domain}/wiki${data._links?.webui ?? ''}`;
  console.log('Created Confluence page:');
  console.log('  Title:', data.title);
  console.log('  ID:   ', data.id);
  console.log('  URL:  ', url);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
