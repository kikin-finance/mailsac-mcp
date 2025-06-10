#!/usr/bin/env node

import { FastMCP } from "fastmcp";
import { z } from "zod";
import { Mailsac } from "@mailsac/api";

const MAILSAC_KEY = process.env.MAILSAC_KEY;

if (!MAILSAC_KEY) {
  console.error("Error: MAILSAC_KEY environment variable is required");
  process.exit(1);
}

const mailsac = new Mailsac({
  headers: { "Mailsac-Key": MAILSAC_KEY },
});

const server = new FastMCP({
  name: "Mailsac MCP Server",
  version: "1.0.0",
  instructions:
    "Manage your Mailsac email inboxs and addresses. Full documentation at https://mailsac.com/docs/api",
});

// ===== ADDRESS MANAGEMENT TOOLS (7 endpoints) =====

server.addTool({
  name: "list_addresses",
  description: "List all enhanced email addresses for the account",
  execute: async () => {
    const result = await mailsac.addresses.listAddresses();
    return JSON.stringify(result.data);
  },
});

server.addTool({
  name: "get_address",
  description: "Fetch an address or check if it is reserved",
  parameters: z.object({
    email: z.string().describe("The email address to fetch"),
  }),
  execute: async (args) => {
    const result = await mailsac.addresses.getAddress(args.email);
    return JSON.stringify(result.data);
  },
});

server.addTool({
  name: "create_address",
  description: "Reserve (create/own) a private email address",
  parameters: z.object({
    email: z.string().describe("The email address to create"),
    forward: z
      .string()
      .optional()
      .describe("Forward incoming emails to this address"),
    enablews: z
      .boolean()
      .optional()
      .describe("Enable websocket for this address"),
    webhook: z.string().optional().describe("Webhook URL for incoming emails"),
    webhookSlack: z.string().optional().describe("Slack webhook URL"),
    webhookSlackToFrom: z
      .boolean()
      .optional()
      .describe("Include to/from in Slack notifications"),
  }),
  execute: async (args) => {
    const { email, ...body } = args;
    const result = await mailsac.addresses.createAddress(email, body);
    return JSON.stringify(result.data);
  },
});

server.addTool({
  name: "update_address",
  description: "Update private email address forwarding and metadata",
  parameters: z.object({
    email: z.string().describe("The email address to update"),
    forward: z
      .string()
      .optional()
      .describe("Forward incoming emails to this address"),
    enablews: z
      .boolean()
      .optional()
      .describe("Enable websocket for this address"),
    webhook: z.string().optional().describe("Webhook URL for incoming emails"),
    webhookSlack: z.string().optional().describe("Slack webhook URL"),
    webhookSlackToFrom: z
      .boolean()
      .optional()
      .describe("Include to/from in Slack notifications"),
  }),
  execute: async (args) => {
    const { email, ...body } = args;
    const result = await mailsac.addresses.updateAddress(email, body);
    return JSON.stringify(result.data);
  },
});

server.addTool({
  name: "delete_address",
  description: "Release an enhanced email address",
  parameters: z.object({
    email: z.string().describe("The email address to delete"),
    deleteAddressMessages: z
      .boolean()
      .optional()
      .describe("Delete all messages for this address"),
  }),
  execute: async (args) => {
    const queryParams = args.deleteAddressMessages
      ? { deleteAddressMessages: args.deleteAddressMessages }
      : undefined;
    const result = await mailsac.addresses.deleteAddress(
      args.email,
      queryParams,
    );
    return JSON.stringify(result.data);
  },
});

server.addTool({
  name: "check_address_availability",
  description: "Check address ownership status",
  parameters: z.object({
    email: z.string().describe("The email address to check"),
  }),
  execute: async (args) => {
    const result = await mailsac.addresses.checkAvailability(args.email);
    return JSON.stringify(result.data);
  },
});

server.addTool({
  name: "create_addresses_bulk",
  description: "Reserve multiple enhanced addresses (max 100)",
  parameters: z.object({
    addresses: z
      .array(z.string())
      .describe("Array of email addresses to create"),
  }),
  execute: async (args) => {
    const result = await mailsac.addresses.createAddresses({
      addresses: args.addresses,
    });
    return JSON.stringify(result.data);
  },
});

// ===== EMAIL VALIDATIONS TOOLS (2 endpoints) =====

server.addTool({
  name: "validate_address",
  description: "Validate an email address and check if disposable",
  parameters: z.object({
    email: z.string().describe("The email address to validate"),
  }),
  execute: async (args) => {
    const result = await mailsac.emailValidation.validateAddress(args.email);
    return JSON.stringify(result.data);
  },
});

server.addTool({
  name: "validate_addresses_bulk",
  description: "Validate up to 50 email addresses",
  parameters: z.object({
    emails: z
      .array(z.string())
      .describe("Array of email addresses to validate"),
  }),
  execute: async (args) => {
    const result = await mailsac.emailValidation.validateAddressesBulk({
      emails: args.emails,
    });
    return JSON.stringify(result.data);
  },
});

// ===== MESSAGE LISTING & COUNTING TOOLS (6 endpoints) =====

server.addTool({
  name: "count_messages",
  description: "Count messages for an email inbox",
  parameters: z.object({
    email: z.string().describe("The email address to count messages for"),
  }),
  execute: async (args) => {
    const result = await mailsac.messages.countMessages(args.email);
    return JSON.stringify(result.data);
  },
});

server.addTool({
  name: "list_messages",
  description: "List messages for an email inbox (newest first)",
  parameters: z.object({
    email: z.string().describe("The email address to list messages for"),
    until: z
      .string()
      .optional()
      .describe("Return messages up to this UTC date"),
    limit: z.number().optional().describe("Results limit"),
  }),
  execute: async (args) => {
    const queryParams: any = {};
    if (args.until) queryParams.until = args.until;
    if (args.limit) queryParams.limit = args.limit;
    const result = await mailsac.messages.listMessages(args.email, queryParams);
    return JSON.stringify(result.data);
  },
});

server.addTool({
  name: "list_starred_messages",
  description: "List starred (saved) messages on the account",
  execute: async () => {
    const result = await mailsac.messages.listStarredMessages();
    return JSON.stringify(result.data);
  },
});

server.addTool({
  name: "list_inbox_messages",
  description: "Get all account messages paginated (used by Inbox UI)",
  parameters: z.object({
    limit: z.number().optional().describe("Results limit"),
    since: z
      .string()
      .optional()
      .describe("Only fetch messages since this date"),
    skip: z.number().optional().describe("Pagination offset"),
  }),
  execute: async (args) => {
    const queryParams: any = {};
    if (args.limit) queryParams.limit = args.limit;
    if (args.since) queryParams.since = args.since;
    if (args.skip) queryParams.skip = args.skip;
    const result = await mailsac.messages.listInboxMessages(queryParams);
    return JSON.stringify(result.data);
  },
});

server.addTool({
  name: "filter_inbox_messages",
  description: "Filter messages by to, from, and/or subject (logical AND)",
  parameters: z.object({
    andSubjectIncludes: z.string().optional().describe("Text in subject line"),
    andFrom: z.string().optional().describe("Text in FROM envelope"),
    andTo: z.string().optional().describe("Text in TO envelope"),
    andRead: z.boolean().optional().describe("Read/unread status"),
  }),
  execute: async (args) => {
    const result = await mailsac.messages.filterInboxMessages(args);
    return JSON.stringify(result.data);
  },
});

server.addTool({
  name: "search_inbox_messages",
  description: "Search messages by to, from, and subject (logical OR)",
  parameters: z.object({
    query: z.string().optional().describe("Search term"),
  }),
  execute: async (args) => {
    const queryParams: any = {};
    if (args.query) queryParams.query = args.query;
    const result = await mailsac.messages.searchInboxMessages(queryParams);
    return JSON.stringify(result.data);
  },
});

// ===== MESSAGE DETAILS & CONTENT TOOLS (5 endpoints) =====

server.addTool({
  name: "get_message_metadata",
  description: "Get email message metadata with links and attachments",
  parameters: z.object({
    email: z.string().describe("The email address"),
    messageId: z.string().describe("Unique message identifier"),
  }),
  execute: async (args) => {
    const result = await mailsac.messages.getMessageMetadata(
      args.email,
      args.messageId,
    );
    return JSON.stringify(result.data);
  },
});

server.addTool({
  name: "get_full_raw_message",
  description: "Get entire original SMTP message",
  parameters: z.object({
    email: z.string().describe("The email address"),
    messageId: z.string().describe("Unique message identifier"),
    download: z.boolean().optional().describe("Browser download flag"),
  }),
  execute: async (args) => {
    const queryParams: any = {};
    if (args.download) queryParams.download = 1;
    const result = await mailsac.messages.getFullRawMessage(
      args.email,
      args.messageId,
      queryParams,
    );
    return result.data;
  },
});

server.addTool({
  name: "get_message_headers",
  description: "Get parsed message headers in multiple formats",
  parameters: z.object({
    email: z.string().describe("The email address"),
    messageId: z.string().describe("Unique message identifier"),
    messageHeadersFormat: z
      .enum(["json", "json-ordered", "plain"])
      .optional()
      .describe("Headers format"),
    download: z.boolean().optional().describe("Browser download flag"),
  }),
  execute: async (args) => {
    const queryParams: any = {};
    if (args.messageHeadersFormat)
      queryParams.messageHeadersFormat = args.messageHeadersFormat;
    if (args.download) queryParams.download = 1;
    const result = await mailsac.messages.getHeaders(
      args.email,
      args.messageId,
      queryParams,
    );
    return JSON.stringify(result.data);
  },
});

server.addTool({
  name: "get_message_body_dirty",
  description: "Get message HTML body (dirty/unsanitized)",
  parameters: z.object({
    email: z.string().describe("The email address"),
    messageId: z.string().describe("Unique message identifier"),
    download: z.boolean().optional().describe("Browser download flag"),
  }),
  execute: async (args) => {
    const queryParams: any = {};
    if (args.download) queryParams.download = 1;
    const result = await mailsac.messages.getBodyDirty(
      args.email,
      args.messageId,
      queryParams,
    );
    return result.data;
  },
});

server.addTool({
  name: "get_message_body_sanitized",
  description: "Get message HTML body (sanitized/safe)",
  parameters: z.object({
    email: z.string().describe("The email address"),
    messageId: z.string().describe("Unique message identifier"),
    download: z.boolean().optional().describe("Browser download flag"),
  }),
  execute: async (args) => {
    const queryParams: any = {};
    if (args.download) queryParams.download = 1;
    const result = await mailsac.messages.getBodySanitized(
      args.email,
      args.messageId,
      queryParams,
    );
    return result.data;
  },
});

server.addTool({
  name: "get_message_body_plaintext",
  description: "Get message plaintext content",
  parameters: z.object({
    email: z.string().describe("The email address"),
    messageId: z.string().describe("Unique message identifier"),
    download: z.boolean().optional().describe("Browser download flag"),
  }),
  execute: async (args) => {
    const queryParams: any = {};
    if (args.download) queryParams.download = 1;
    const result = await mailsac.messages.getBodyPlainText(
      args.email,
      args.messageId,
      queryParams,
    );
    return result.data;
  },
});

// ===== MESSAGE MANAGEMENT TOOLS (8 endpoints) =====

server.addTool({
  name: "delete_all_messages",
  description:
    "Delete all messages for an email inbox (starred messages protected)",
  parameters: z.object({
    email: z.string().describe("The email address"),
  }),
  execute: async (args) => {
    const result = await mailsac.messages.deleteAllMessages(args.email);
    return JSON.stringify(result.data);
  },
});

server.addTool({
  name: "delete_message",
  description: "Delete an individual email message",
  parameters: z.object({
    email: z.string().describe("The email address"),
    messageId: z.string().describe("Unique message identifier"),
  }),
  execute: async (args) => {
    const result = await mailsac.messages.deleteMessage(
      args.email,
      args.messageId,
    );
    return JSON.stringify(result.data);
  },
});

server.addTool({
  name: "toggle_message_star",
  description: "Star (save) a message to protect from auto-deletion",
  parameters: z.object({
    email: z.string().describe("The email address"),
    messageId: z.string().describe("Unique message identifier"),
  }),
  execute: async (args) => {
    const result = await mailsac.messages.toggleMessageStar(
      args.email,
      args.messageId,
    );
    return JSON.stringify(result.data);
  },
});

server.addTool({
  name: "add_message_label",
  description: "Add a label to a message for organization",
  parameters: z.object({
    email: z.string().describe("The email address"),
    messageId: z.string().describe("Unique message identifier"),
    label: z.string().describe("Label string to add"),
  }),
  execute: async (args) => {
    const result = await mailsac.messages.addMessageLabel(
      args.email,
      args.messageId,
      args.label,
    );
    return JSON.stringify(result.data);
  },
});

server.addTool({
  name: "delete_message_label",
  description: "Remove a label from a message",
  parameters: z.object({
    email: z.string().describe("The email address"),
    messageId: z.string().describe("Unique message identifier"),
    label: z.string().describe("Label string to remove"),
  }),
  execute: async (args) => {
    const result = await mailsac.messages.deleteMessageLabel(
      args.email,
      args.messageId,
      args.label,
    );
    return JSON.stringify(result.data);
  },
});

server.addTool({
  name: "set_message_folder",
  description: "Move message to folder (inbox, all, spam, trash)",
  parameters: z.object({
    email: z.string().describe("The email address"),
    messageId: z.string().describe("Unique message identifier"),
    folder: z.enum(["inbox", "all", "spam", "trash"]).describe("Folder name"),
  }),
  execute: async (args) => {
    const result = await mailsac.messages.setMessageFolder(
      args.email,
      args.messageId,
      args.folder as any,
    );
    return JSON.stringify(result.data);
  },
});

server.addTool({
  name: "set_message_read_status",
  description: "Set message read/unread status",
  parameters: z.object({
    email: z.string().describe("The email address"),
    messageId: z.string().describe("Unique message identifier"),
    readBoolean: z.boolean().describe("Read status (true=read, false=unread)"),
  }),
  execute: async (args) => {
    const result = await mailsac.messages.setMessageReadStatus(
      args.email,
      args.messageId,
      args.readBoolean,
    );
    return JSON.stringify(result.data);
  },
});

// ===== DOMAIN MANAGEMENT TOOLS (4 endpoints) =====

server.addTool({
  name: "list_domains",
  description: "List custom domains for the account",
  execute: async () => {
    const result = await mailsac.domains.listDomains();
    return JSON.stringify(result.data);
  },
});

server.addTool({
  name: "get_domain",
  description: "Get domain information including message count",
  parameters: z.object({
    domain: z.string().describe("Domain string"),
  }),
  execute: async (args) => {
    const result = await mailsac.domains.getDomain(args.domain);
    return JSON.stringify(result.data);
  },
});

server.addTool({
  name: "list_domain_messages",
  description: "List messages across any inboxes of a domain",
  parameters: z.object({
    domain: z.string().describe("Domain string"),
    until: z
      .string()
      .optional()
      .describe("Return messages up to this UTC date"),
    limit: z.number().optional().describe("Results limit"),
  }),
  execute: async (args) => {
    const queryParams: any = {};
    if (args.until) queryParams.until = args.until;
    if (args.limit) queryParams.limit = args.limit;
    const result = await mailsac.messages.listDomainMessages(
      args.domain,
      queryParams,
    );
    return JSON.stringify(result.data);
  },
});

server.addTool({
  name: "delete_all_domain_messages",
  description: "Delete all messages for a domain (including starred)",
  parameters: z.object({
    domain: z.string().describe("Domain string"),
  }),
  execute: async (args) => {
    const result = await mailsac.messages.deleteAllDomainMessages(args.domain);
    return JSON.stringify(result.data);
  },
});

// ===== USER ACCOUNT TOOLS (2 endpoints) =====

server.addTool({
  name: "get_user_info",
  description: "Get current account information",
  execute: async () => {
    const result = await mailsac.account.user();
    return JSON.stringify(result.data);
  },
});

server.addTool({
  name: "get_account_stats",
  description: "Get account stats and usage information",
  parameters: z.object({
    overrideAccountId: z.string().optional().describe("Account ID override"),
  }),
  execute: async (args) => {
    const queryParams: any = {};
    if (args.overrideAccountId)
      queryParams.overrideAccountId = args.overrideAccountId;
    const result = await mailsac.account.accountStats(queryParams);
    return JSON.stringify(result.data);
  },
});

// ===== EMAIL ATTACHMENTS TOOLS (2 endpoints) =====

server.addTool({
  name: "list_message_attachments",
  description: "List attachment metadata for an email message",
  parameters: z.object({
    email: z.string().describe("The email address"),
    messageId: z.string().describe("Unique message identifier"),
  }),
  execute: async (args) => {
    const result = await mailsac.attachments.listMessageAttachments(
      args.email,
      args.messageId,
    );
    return JSON.stringify(result.data);
  },
});

server.addTool({
  name: "download_attachment",
  description: "Download an email message attachment as file",
  parameters: z.object({
    email: z.string().describe("The email address"),
    messageId: z.string().describe("Unique message identifier"),
    attachmentIdentifier: z
      .string()
      .describe("MD5 sum, content-id, or filename"),
  }),
  execute: async (args) => {
    const result = await mailsac.attachments.downloadAttachment(
      args.email,
      args.messageId,
      args.attachmentIdentifier,
    );
    return `Binary file data (${result.status} ${result.statusText})`;
  },
});

// ===== EMAIL STATS TOOLS (3 available endpoints) =====

server.addTool({
  name: "list_top_public_addresses",
  description: "List top public disposable email addresses by message volume",
  parameters: z.object({
    startDate: z.string().optional().describe("Start date filter"),
    endDate: z.string().optional().describe("End date filter"),
    skip: z.number().optional().describe("Pagination offset"),
    limit: z.number().optional().describe("Results limit"),
  }),
  execute: async (args) => {
    const queryParams: any = {};
    if (args.startDate) queryParams.startDate = args.startDate;
    if (args.endDate) queryParams.endDate = args.endDate;
    if (args.skip) queryParams.skip = args.skip;
    if (args.limit) queryParams.limit = args.limit;
    const result =
      await mailsac.messageStats.listTopPublicAddresses(queryParams);
    return JSON.stringify(result.data);
  },
});

server.addTool({
  name: "list_top_public_senders",
  description: "List top sender email addresses for public messages",
  parameters: z.object({
    startDate: z.string().optional().describe("Start date filter"),
    endDate: z.string().optional().describe("End date filter"),
    skip: z.number().optional().describe("Pagination offset"),
    limit: z.number().optional().describe("Results limit"),
  }),
  execute: async (args) => {
    const queryParams: any = {};
    if (args.startDate) queryParams.startDate = args.startDate;
    if (args.endDate) queryParams.endDate = args.endDate;
    if (args.skip) queryParams.skip = args.skip;
    if (args.limit) queryParams.limit = args.limit;
    const result = await mailsac.messageStats.listTopPublicSenders(queryParams);
    return JSON.stringify(result.data);
  },
});

server.addTool({
  name: "list_top_public_domains",
  description: "List top public domains receiving disposable messages",
  parameters: z.object({
    startDate: z.string().optional().describe("Start date filter"),
    endDate: z.string().optional().describe("End date filter"),
    skip: z.number().optional().describe("Pagination offset"),
    limit: z.number().optional().describe("Results limit"),
  }),
  execute: async (args) => {
    const queryParams: any = {};
    if (args.startDate) queryParams.startDate = args.startDate;
    if (args.endDate) queryParams.endDate = args.endDate;
    if (args.skip) queryParams.skip = args.skip;
    if (args.limit) queryParams.limit = args.limit;
    const result = await mailsac.messageStats.listTopPublicDomains(queryParams);
    return JSON.stringify(result.data);
  },
});

// ===== WEBSOCKET/WEBHOOK DOCUMENTATION TOOLS (2 endpoints) =====

server.addTool({
  name: "websocket_info",
  description: "Get WebSocket connection information and documentation",
  execute: async () => {
    return JSON.stringify({
      endpoint: "wss://sock.mailsac.com/incoming-messages",
      usage:
        "Connect with ?key=YOUR_API_KEY&addresses=email1@domain.com,email2@domain.com",
      description: "Real-time email delivery via WebSocket connection",
      example:
        "wss://sock.mailsac.com/incoming-messages?key=k_eoj1mn7x5y61w0egs25j6xrv&addresses=test@mailsac.com",
    });
  },
});

server.addTool({
  name: "webhook_info",
  description: "Get webhook configuration information and documentation",
  execute: async () => {
    return JSON.stringify({
      description:
        "Webhooks are configured per email address via the update_address tool",
      configuration:
        "Set webhook URL in the 'webhook' field when creating/updating addresses",
      slackSupport: "Slack webhooks supported via 'webhookSlack' field",
      payload: "Webhook receives EmailMessageWebhook objects as JSON POST",
      expectedResponse: "Webhook endpoint should return HTTP 200 status",
    });
  },
});

server.start({
  transportType: "stdio",
});
