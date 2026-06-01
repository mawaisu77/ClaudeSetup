# MCP Configs

Example MCP server configurations referenced by this plugin. These are
**templates** — copy one into a project `.mcp.json` (or your user-level
`~/.claude.json`) and fill in credentials via environment variables.

They are intentionally NOT auto-loaded, so opening this repo never starts an
MCP server you didn't ask for.

## Usage

```bash
# Project-scoped (shared with the team, committed):
cp mcp-configs/github.example.json .mcp.json
# then set the referenced env vars in your shell or .env
```

To expose an MCP server through the plugin itself, add an `mcpServers` field to
`.claude-plugin/plugin.json` pointing at a `.mcp.json` file.

## Available templates

- `github.example.json` — GitHub MCP server (issues, PRs, search) via a PAT.
