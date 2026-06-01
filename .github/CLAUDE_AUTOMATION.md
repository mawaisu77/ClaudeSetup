# Claude issue automation

When a GitHub issue is opened with — or later given — the **`claude`** label,
[`.github/workflows/claude-issue-handler.yml`](workflows/claude-issue-handler.yml)
runs Claude Code in CI. Claude reads the issue, implements it on a branch, opens
a PR that says `Closes #<n>`, and leaves it for you to review and merge.

## One-time setup

1. **Add your Anthropic API key as a repo secret** (never commit it):

   ```bash
   gh secret set ANTHROPIC_API_KEY --repo mawaisu77/ClaudeSetup
   # paste the key when prompted
   ```

2. **Create the trigger label** (already done if you ran the setup):

   ```bash
   gh label create claude --color 5319e7 \
     --description "Hand this issue to Claude Code" \
     --repo mawaisu77/ClaudeSetup
   ```

3. **Allow Actions to create PRs**: GitHub → repo **Settings → Actions →
   General → Workflow permissions** → enable
   *"Allow GitHub Actions to create and approve pull requests."*

## Using it

- Open an issue and add the `claude` label (or add the label to an existing one).
- Watch the run under the repo's **Actions** tab.
- Claude opens a PR or, if the issue isn't actionable, comments asking for detail.

## Tuning

All knobs live in the workflow's `claude_args` and `prompt`:

- **Model**: change `--model claude-sonnet-4-6` (e.g. `claude-opus-4-8` for harder
  tasks, at higher cost).
- **Run length**: `--max-turns 40`.
- **Tools**: `--allowedTools Bash,Edit,Write,Read,Glob,Grep`.
- **Trigger**: edit the `on:` / `if:` block — e.g. drop the label gate to act on
  every new issue, or switch to a "comment a plan first" flow.

## Security notes

- The workflow interpolates only the issue **number** (an integer) into the
  prompt. The untrusted title/body are fetched at runtime via `gh issue view`,
  so a crafted issue title can't inject shell or prompt commands.
- The prompt explicitly tells Claude to treat issue text as untrusted and not to
  follow embedded instructions that conflict with project rules.
- Claude never merges — a human reviews every PR.
- Cost: each labeled issue consumes Anthropic API tokens + GitHub Actions
  minutes. The label gate keeps this opt-in per issue.
