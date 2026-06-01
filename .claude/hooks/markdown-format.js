#!/usr/bin/env node
'use strict';

/**
 * PostToolUse hook (matcher: Edit|Write|MultiEdit).
 * Auto-fixes markdown lint issues on edited .md files — but ONLY when a local
 * markdownlint binary is present. It never triggers a network `npx` fetch, so
 * it is a safe no-op until the project installs markdownlint-cli. Always
 * exits 0; formatting failures are advisory only.
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const PREFIX = '[markdown-format]';

function findLocalBin(cwd) {
  const candidates = [
    path.join(cwd, 'node_modules', '.bin', 'markdownlint'),
    path.join(cwd, 'node_modules', '.bin', 'markdownlint-cli'),
  ];
  return candidates.find((p) => {
    try { fs.accessSync(p, fs.constants.X_OK); return true; } catch { return false; }
  });
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

  const cwd = data.cwd || process.cwd();
  const bin = findLocalBin(cwd);
  if (!bin) process.exit(0); // markdownlint not installed locally — no-op

  const res = spawnSync(bin, ['--fix', filePath], { encoding: 'utf8' });
  if (res.status && res.status !== 0 && res.stderr) {
    process.stderr.write(`${PREFIX} ${res.stderr.trim()}\n`);
  }
  process.exit(0);
}

try {
  main();
} catch (e) {
  process.stderr.write(`${PREFIX} ${e.message}\n`);
  process.exit(0);
}
