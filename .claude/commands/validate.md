---
description: Validate all agents, skills, and commands for required frontmatter and structure
---

Audit every config file and report problems as a table. Do NOT fix unless asked.

Check:
1. **Agents** (`.claude/agents/*.md`): frontmatter present with `name` (must equal filename), `description`, `tools`, `model`.
2. **Commands** (`.claude/commands/*.md`): frontmatter present with `description`.
3. **Skills** (`.claude/skills/*/`): each directory contains a `SKILL.md` with `name` (equals directory) and `description`.

For each issue, output: `path | type | problem`. End with a one-line summary (`N files checked, M issues`). If everything passes, say so plainly.
