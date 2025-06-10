# Mailsac MCP Server

A comprehensive Model Context Protocol (MCP) server that provides access to all major Mailsac API endpoints for email testing and management.

## Prerequisites

1. **Mailsac Account**: Sign up at [mailsac.com](https://mailsac.com)
2. **API Key**: Get your API key from [Mailsac API Keys page](https://mailsac.com/api-keys)
3. **Node.js**: Version 16 or higher

## Installation

### Option 1: Install from npm (Recommended)
```bash
npm install -g @kikin/mailsac-mcp
```

### Option 2: Clone and build from source
1. Clone this repository:
```bash
git clone <repository-url>
cd mailsac-mcp
```

2. Install dependencies:
```bash
npm install
```

3. Compile TypeScript:
```bash
npx tsc
```

## Usage with Claude Code

Add this MCP server to Claude Code:

```bash
claude mcp add mailsac -s user npx @kikin/mailsac-mcp --env MAILSAC_KEY=your_api_key_here
```

## Usage with Claude Desktop

Add this MCP server to your Claude Desktop configuration file:

**Configuration file locations:**
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%/Claude/claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

**Configuration:**
```json
{
  "mcpServers": {
    "mailsac": {
      "command": "npx",
      "args": ["@kikin/mailsac-mcp"],
      "env": {
        "MAILSAC_KEY": "your_api_key_here"
      }
    }
  }
}
```

## Usage with Other MCP Clients

You can also use this server with any other MCP-compatible client by running:

```bash
MAILSAC_KEY=your_api_key_here npx @kikin/mailsac-mcp
```

## Example Usage

Once connected to Claude Desktop, you can use natural language to interact with Mailsac:

```
"Create a new email address test@mailsac.com and set up forwarding to my-email@example.com"

"List all messages in the inbox for user@mailsac.com"

"Get the plaintext content of message ID abc123 from user@mailsac.com"

"Validate these email addresses: [email1@test.com, email2@test.com]"

"Delete all messages from the test@mailsac.com inbox"

"Show me the top public email domains by message volume"
```

## Development

This project uses [FastMCP](https://github.com/jlowin/fastmcp) for MCP server development.

### Development Mode with Inspector
For development with the FastMCP inspector (recommended):
```bash
npx fastmcp dev index.ts
```

This provides:
- Hot reload on file changes
- Web-based inspector at http://localhost:3001
- Interactive tool testing
- Real-time debugging

### Alternative: Manual Development
```bash
# Compile TypeScript
npx tsc

# Run the server
MAILSAC_KEY=your_api_key_here node index.js
```

### Watch Mode
```bash
npx tsc --watch
```

### FastMCP Inspector
Use the FastMCP inspector for interactive development:
```bash
npx fastmcp inspect index.ts
```

## License

MIT - Same as the [Mailsac TypeScript SDK](https://github.com/mailsac/mailsac-typescript-api)

## Support

- [Mailsac Documentation](https://docs.mailsac.com)
- [Mailsac API Documentation](https://mailsac.com/docs/api)
- [MCP Documentation](https://modelcontextprotocol.io)

## Related Links

- [Mailsac Website](https://mailsac.com)
- [Mailsac TypeScript SDK](https://www.npmjs.com/package/@mailsac/api)