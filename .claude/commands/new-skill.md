---
description: Scaffold a new skill directory in .claude/skills/ with a valid SKILL.md
---

Create a new Claude Code skill for: $ARGUMENTS

Steps:
1. Derive a kebab-case `<name>` from the purpose.
2. Read 1-2 existing `SKILL.md` files under `.claude/skills/*/` to match structure and depth.
3. Create `.claude/skills/<name>/SKILL.md` with frontmatter:
   - `name`: equals the directory name
   - `description`: a precise trigger description — when Claude should activate this skill, including the situations and keywords that should invoke it
4. Body sections (required): **When to Use**, **How It Works**, **Examples**.
5. Skills are model-invoked context, not slash commands — write the `description` so the model can decide relevance. Be specific about triggers and anti-triggers (when NOT to use it).
