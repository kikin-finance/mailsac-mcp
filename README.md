# Mailsac MCP Server

A comprehensive Model Context Protocol (MCP) server that provides access to all major Mailsac API endpoints for email testing and management.

## Features

This MCP server implements **39 tools** covering all major Mailsac functionality:

### 📧 Address Management (7 tools)
- `list_addresses` - List all enhanced email addresses for the account
- `get_address` - Fetch an address or check if it is reserved
- `create_address` - Reserve (create/own) a private email address
- `update_address` - Update private email address forwarding and metadata
- `delete_address` - Release an enhanced email address
- `check_address_availability` - Check address ownership status
- `create_addresses_bulk` - Reserve multiple enhanced addresses (max 100)

### ✉️ Message Operations (19 tools)

**Listing & Counting:**
- `count_messages` - Count messages for an email inbox
- `list_messages` - List messages for an email inbox (newest first)
- `list_starred_messages` - List starred (saved) messages on the account
- `list_inbox_messages` - Get all account messages paginated
- `filter_inbox_messages` - Filter messages by to, from, and/or subject
- `search_inbox_messages` - Search messages by to, from, and subject

**Content & Details:**
- `get_message_metadata` - Get email message metadata with links and attachments
- `get_full_raw_message` - Get entire original SMTP message
- `get_message_headers` - Get parsed message headers in multiple formats
- `get_message_body_dirty` - Get message HTML body (dirty/unsanitized)
- `get_message_body_sanitized` - Get message HTML body (sanitized/safe)
- `get_message_body_plaintext` - Get message plaintext content

**Management:**
- `delete_all_messages` - Delete all messages for an email inbox
- `delete_message` - Delete an individual email message
- `toggle_message_star` - Star (save) a message to protect from auto-deletion
- `add_message_label` - Add a label to a message for organization
- `delete_message_label` - Remove a label from a message
- `set_message_folder` - Move message to folder (inbox, all, spam, trash)
- `set_message_read_status` - Set message read/unread status

### 🌐 Domain Management (4 tools)
- `list_domains` - List custom domains for the account
- `get_domain` - Get domain information including message count
- `list_domain_messages` - List messages across any inboxes of a domain
- `delete_all_domain_messages` - Delete all messages for a domain

### ✅ Email Validation (2 tools)
- `validate_address` - Validate an email address and check if disposable
- `validate_addresses_bulk` - Validate up to 50 email addresses

### 👤 Account Management (2 tools)
- `get_user_info` - Get current account information
- `get_account_stats` - Get account stats and usage information

### 📎 Attachments (2 tools)
- `list_message_attachments` - List attachment metadata for an email message
- `download_attachment` - Download an email message attachment as file

### 📊 Public Statistics (3 tools)
- `list_top_public_addresses` - List top public disposable email addresses by message volume
- `list_top_public_senders` - List top sender email addresses for public messages
- `list_top_public_domains` - List top public domains receiving disposable messages

### 🔗 WebSocket/Webhook Info (2 tools)
- `websocket_info` - Get WebSocket connection information and documentation
- `webhook_info` - Get webhook configuration information and documentation

## Prerequisites

1. **Mailsac Account**: Sign up at [mailsac.com](https://mailsac.com)
2. **API Key**: Get your API key from [Mailsac API Keys page](https://mailsac.com/api-keys)
3. **Node.js**: Version 16 or higher

## Installation

1. Clone this repository:
```bash
git clone <repository-url>
cd mailsac-mcp
```

2. Install dependencies:
```bash
npm install
```

3. Set your Mailsac API key as an environment variable:
```bash
export MAILSAC_KEY=your_api_key_here
```

4. Compile TypeScript:
```bash
npx tsc
```

## Usage with Claude Desktop

Add this MCP server to your Claude Desktop configuration:

### macOS
Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "mailsac": {
      "command": "node",
      "args": ["/path/to/mailsac-mcp/index.js"],
      "env": {
        "MAILSAC_KEY": "your_api_key_here"
      }
    }
  }
}
```

### Windows
Edit `%APPDATA%/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "mailsac": {
      "command": "node",
      "args": ["C:\\path\\to\\mailsac-mcp\\index.js"],
      "env": {
        "MAILSAC_KEY": "your_api_key_here"
      }
    }
  }
}
```

### Linux
Edit `~/.config/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "mailsac": {
      "command": "node",
      "args": ["/path/to/mailsac-mcp/index.js"],
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
MAILSAC_KEY=your_api_key_here node index.js
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

### Run in Development Mode
```bash
npm start
```

### Compile TypeScript
```bash
npx tsc
```

### Watch Mode
```bash
npx tsc --watch
```

## Project Structure

```
mailsac-mcp/
├── index.ts          # Main MCP server implementation
├── package.json      # Dependencies and scripts
├── tsconfig.json     # TypeScript configuration
├── CLAUDE.md         # Project instructions for Claude Code
└── README.md         # This file
```

## API Coverage

This MCP server provides comprehensive coverage of the Mailsac API:

- **Address Management**: Complete CRUD operations for email addresses
- **Message Operations**: Full lifecycle management from listing to deletion
- **Domain Management**: Custom domain operations and bulk message management
- **Email Validation**: Address validation and disposable email detection
- **Account Management**: User info and usage statistics
- **Attachments**: List and download email attachments
- **Public Statistics**: Research tools for public email data
- **Real-time Features**: WebSocket and webhook configuration info

## Error Handling

The server includes proper error handling for:
- Invalid API keys (401 errors)
- Resource not found (404 errors)
- Rate limiting and quota issues
- Network connectivity problems

## Security

- API keys are passed securely via environment variables
- No API keys are logged or stored in code
- All requests use HTTPS via the Mailsac TypeScript SDK

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

ISC

## Support

- [Mailsac Documentation](https://docs.mailsac.com)
- [Mailsac API Documentation](https://mailsac.com/docs/api)
- [MCP Documentation](https://modelcontextprotocol.io)

## Related Links

- [Mailsac Website](https://mailsac.com)
- [Mailsac TypeScript SDK](https://www.npmjs.com/package/@mailsac/api)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [Claude Desktop](https://claude.ai/desktop)