#!/usr/bin/env node
'use strict';

/**
 * SessionStart hook.
 * Prints a compact orientation summary that Claude Code adds to session
 * context: how many agents/skills/commands/rules are available plus the core
 * conventions. Always exits 0.
 */

const fs = require('fs');
const path = require('path');

const PREFIX = '[session-start]';

function countFiles(dir, ext) {
  try {
    return fs.readdirSync(dir).filter((f) => f.endsWith(ext)).length;
  } catch {
    return 0;
  }
}

function countDirs(dir) {
  try {
    return fs.readdirSync(dir, { withFileTypes: true }).filter((d) => d.isDirectory()).length;
  } catch {
    return 0;
  }
}

function main() {
  let raw = '';
  try { raw = fs.readFileSync(0, 'utf8'); } catch { /* no stdin */ }

  let cwd = process.cwd();
  try { const d = JSON.parse(raw); if (d && d.cwd) cwd = d.cwd; } catch { /* keep default */ }

  const root = path.join(cwd, '.claude');
  const agents = countFiles(path.join(root, 'agents'), '.md');
  const skills = countDirs(path.join(root, 'skills'));
  const commands = countFiles(path.join(root, 'commands'), '.md');
  const rules = countFiles(path.join(root, 'rules'), '.md');

  const lines = [
    `everything-claude-code config loaded: ${agents} agents, ${skills} skills, ${commands} commands, ${rules} rule files.`,
    'Conventions: Node.js CommonJS, lowercase-hyphen filenames, conventional commits.',
    'Run /validate to check agent/skill/command frontmatter.',
  ];

  // SessionStart stdout is appended to the session context.
  process.stdout.write(lines.join(' ') + '\n');
  process.exit(0);
}

try {
  main();
} catch (e) {
  process.stderr.write(`${PREFIX} ${e.message}\n`);
  process.exit(0);
}
