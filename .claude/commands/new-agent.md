---
description: Scaffold a new subagent in .claude/agents/ with valid, convention-matching frontmatter
---

Create a new Claude Code subagent for: $ARGUMENTS

Steps:
1. Derive a kebab-case `<name>` from the purpose (e.g. `graphql-reviewer`).
2. Read 2-3 existing files in `.claude/agents/` to match tone, structure, and tool conventions.
3. Create `.claude/agents/<name>.md` with frontmatter:
   - `name`: must equal the filename (without `.md`)
   - `description`: when to use it — include explicit trigger phrases ("Use PROACTIVELY when…", "MUST BE USED for…")
   - `tools`: the minimal set the agent actually needs (e.g. `["Read", "Grep", "Glob"]`)
   - `model`: `opus` (deep reasoning), `sonnet` (default), or `haiku` (fast/cheap)
4. Body sections: role, responsibilities, step-by-step approach, and output format. Keep it focused on one job.
5. Do NOT add tools the agent won't use. Confirm the final `name` matches the filename so the validate-frontmatter hook passes.
