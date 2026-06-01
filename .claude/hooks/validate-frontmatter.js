#!/usr/bin/env node
'use strict';

/**
 * PostToolUse hook (matcher: Edit|Write|MultiEdit).
 * Validates YAML frontmatter on agent/command/skill markdown files right
 * after they are edited. Exits 2 with a message on missing required fields so
 * the author gets immediate feedback; exits 0 on anything it can't classify or
 * on internal error (never blocks unrelated edits).
 */

const fs = require('fs');
const path = require('path');

const PREFIX = '[validate-frontmatter]';

function parseFrontmatter(content) {
  if (!content.startsWith('---')) return null;
  const end = content.indexOf('\n---', 3);
  if (end === -1) return null;
  const obj = {};
  for (const line of content.slice(3, end).split('\n')) {
    const m = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (m) obj[m[1]] = m[2];
  }
  return obj;
}

function fail(kind, filePath, problems) {
  process.stderr.write(`${PREFIX} ${kind} frontmatter issues in ${filePath}:\n`);
  for (const p of problems) process.stderr.write(`  - ${p}\n`);
  process.exit(2);
}

function main() {
  let raw = '';
  try { raw = fs.readFileSync(0, 'utf8'); } catch { process.exit(0); }

  let data;
  try { data = JSON.parse(raw); } catch { process.exit(0); }

  const ti = data.tool_input || {};
  const tr = data.tool_response || data.tool_output || {};
  const filePath = ti.file_path || tr.file_path;
  if (!filePath || !filePath.endsWith('.md')) process.exit(0);

  const norm = filePath.replace(/\\/g, '/');
  let kind = null;
  if (/\/\.claude\/agents\//.test(norm)) kind = 'agent';
  else if (/\/\.claude\/commands\//.test(norm)) kind = 'command';
  else if (/\/\.claude\/skills\/.*\/SKILL\.md$/.test(norm)) kind = 'skill';
  if (!kind) process.exit(0);

  let content;
  try { content = fs.readFileSync(filePath, 'utf8'); } catch { process.exit(0); }

  const fm = parseFrontmatter(content);
  if (!fm) fail(kind, filePath, ['no YAML frontmatter found (expected a leading --- block)']);

  const required = kind === 'command' ? ['description'] : ['name', 'description'];
  const problems = required
    .filter((k) => !(k in fm) || String(fm[k]).trim() === '')
    .map((k) => `missing required field: ${k}`);

  if (kind === 'agent' && fm.name) {
    const base = path.basename(filePath, '.md');
    if (fm.name !== base) {
      problems.push(`name ("${fm.name}") must match filename ("${base}")`);
    }
  }

  if (problems.length) fail(kind, filePath, problems);
  process.exit(0);
}

try {
  main();
} catch (e) {
  process.stderr.write(`${PREFIX} internal error: ${e.message}\n`);
  process.exit(0);
}
