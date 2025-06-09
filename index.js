#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastmcp_1 = require("fastmcp");
const zod_1 = require("zod");
const api_1 = require("@mailsac/api");
const MAILSAC_KEY = process.env.MAILSAC_KEY;
if (!MAILSAC_KEY) {
    console.error("Error: MAILSAC_KEY environment variable is required");
    process.exit(1);
}
const mailsac = new api_1.Mailsac({
    headers: { "Mailsac-Key": MAILSAC_KEY },
});
const server = new fastmcp_1.FastMCP({
    name: "Mailsac MCP Server",
    version: "1.0.0",
});
// ===== ADDRESS MANAGEMENT TOOLS (7 endpoints) =====
server.addTool({
    name: "list_addresses",
    description: "List all enhanced email addresses for the account",
    execute: () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield mailsac.addresses.listAddresses();
        return JSON.stringify(result.data);
    }),
});
server.addTool({
    name: "get_address",
    description: "Fetch an address or check if it is reserved",
    parameters: zod_1.z.object({
        email: zod_1.z.string().describe("The email address to fetch"),
    }),
    execute: (args) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield mailsac.addresses.getAddress(args.email);
        return JSON.stringify(result.data);
    }),
});
server.addTool({
    name: "create_address",
    description: "Reserve (create/own) a private email address",
    parameters: zod_1.z.object({
        email: zod_1.z.string().describe("The email address to create"),
        forward: zod_1.z.string().optional().describe("Forward incoming emails to this address"),
        enablews: zod_1.z.boolean().optional().describe("Enable websocket for this address"),
        webhook: zod_1.z.string().optional().describe("Webhook URL for incoming emails"),
        webhookSlack: zod_1.z.string().optional().describe("Slack webhook URL"),
        webhookSlackToFrom: zod_1.z.boolean().optional().describe("Include to/from in Slack notifications"),
    }),
    execute: (args) => __awaiter(void 0, void 0, void 0, function* () {
        const { email } = args, body = __rest(args, ["email"]);
        const result = yield mailsac.addresses.createAddress(email, body);
        return JSON.stringify(result.data);
    }),
});
server.addTool({
    name: "update_address",
    description: "Update private email address forwarding and metadata",
    parameters: zod_1.z.object({
        email: zod_1.z.string().describe("The email address to update"),
        forward: zod_1.z.string().optional().describe("Forward incoming emails to this address"),
        enablews: zod_1.z.boolean().optional().describe("Enable websocket for this address"),
        webhook: zod_1.z.string().optional().describe("Webhook URL for incoming emails"),
        webhookSlack: zod_1.z.string().optional().describe("Slack webhook URL"),
        webhookSlackToFrom: zod_1.z.boolean().optional().describe("Include to/from in Slack notifications"),
    }),
    execute: (args) => __awaiter(void 0, void 0, void 0, function* () {
        const { email } = args, body = __rest(args, ["email"]);
        const result = yield mailsac.addresses.updateAddress(email, body);
        return JSON.stringify(result.data);
    }),
});
server.addTool({
    name: "delete_address",
    description: "Release an enhanced email address",
    parameters: zod_1.z.object({
        email: zod_1.z.string().describe("The email address to delete"),
        deleteAddressMessages: zod_1.z.boolean().optional().describe("Delete all messages for this address"),
    }),
    execute: (args) => __awaiter(void 0, void 0, void 0, function* () {
        const queryParams = args.deleteAddressMessages ? { deleteAddressMessages: args.deleteAddressMessages } : undefined;
        const result = yield mailsac.addresses.deleteAddress(args.email, queryParams);
        return JSON.stringify(result.data);
    }),
});
server.addTool({
    name: "check_address_availability",
    description: "Check address ownership status",
    parameters: zod_1.z.object({
        email: zod_1.z.string().describe("The email address to check"),
    }),
    execute: (args) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield mailsac.addresses.checkAvailability(args.email);
        return JSON.stringify(result.data);
    }),
});
server.addTool({
    name: "create_addresses_bulk",
    description: "Reserve multiple enhanced addresses (max 100)",
    parameters: zod_1.z.object({
        addresses: zod_1.z.array(zod_1.z.string()).describe("Array of email addresses to create"),
    }),
    execute: (args) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield mailsac.addresses.createAddresses({ addresses: args.addresses });
        return JSON.stringify(result.data);
    }),
});
// ===== EMAIL VALIDATIONS TOOLS (2 endpoints) =====
server.addTool({
    name: "validate_address",
    description: "Validate an email address and check if disposable",
    parameters: zod_1.z.object({
        email: zod_1.z.string().describe("The email address to validate"),
    }),
    execute: (args) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield mailsac.emailValidation.validateAddress(args.email);
        return JSON.stringify(result.data);
    }),
});
server.addTool({
    name: "validate_addresses_bulk",
    description: "Validate up to 50 email addresses",
    parameters: zod_1.z.object({
        emails: zod_1.z.array(zod_1.z.string()).describe("Array of email addresses to validate"),
    }),
    execute: (args) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield mailsac.emailValidation.validateAddressesBulk({ emails: args.emails });
        return JSON.stringify(result.data);
    }),
});
// ===== MESSAGE LISTING & COUNTING TOOLS (6 endpoints) =====
server.addTool({
    name: "count_messages",
    description: "Count messages for an email inbox",
    parameters: zod_1.z.object({
        email: zod_1.z.string().describe("The email address to count messages for"),
    }),
    execute: (args) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield mailsac.messages.countMessages(args.email);
        return JSON.stringify(result.data);
    }),
});
server.addTool({
    name: "list_messages",
    description: "List messages for an email inbox (newest first)",
    parameters: zod_1.z.object({
        email: zod_1.z.string().describe("The email address to list messages for"),
        until: zod_1.z.string().optional().describe("Return messages up to this UTC date"),
        limit: zod_1.z.number().optional().describe("Results limit"),
    }),
    execute: (args) => __awaiter(void 0, void 0, void 0, function* () {
        const queryParams = {};
        if (args.until)
            queryParams.until = args.until;
        if (args.limit)
            queryParams.limit = args.limit;
        const result = yield mailsac.messages.listMessages(args.email, queryParams);
        return JSON.stringify(result.data);
    }),
});
server.addTool({
    name: "list_starred_messages",
    description: "List starred (saved) messages on the account",
    execute: () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield mailsac.messages.listStarredMessages();
        return JSON.stringify(result.data);
    }),
});
server.addTool({
    name: "list_inbox_messages",
    description: "Get all account messages paginated (used by Inbox UI)",
    parameters: zod_1.z.object({
        limit: zod_1.z.number().optional().describe("Results limit"),
        since: zod_1.z.string().optional().describe("Only fetch messages since this date"),
        skip: zod_1.z.number().optional().describe("Pagination offset"),
    }),
    execute: (args) => __awaiter(void 0, void 0, void 0, function* () {
        const queryParams = {};
        if (args.limit)
            queryParams.limit = args.limit;
        if (args.since)
            queryParams.since = args.since;
        if (args.skip)
            queryParams.skip = args.skip;
        const result = yield mailsac.messages.listInboxMessages(queryParams);
        return JSON.stringify(result.data);
    }),
});
server.addTool({
    name: "filter_inbox_messages",
    description: "Filter messages by to, from, and/or subject (logical AND)",
    parameters: zod_1.z.object({
        andSubjectIncludes: zod_1.z.string().optional().describe("Text in subject line"),
        andFrom: zod_1.z.string().optional().describe("Text in FROM envelope"),
        andTo: zod_1.z.string().optional().describe("Text in TO envelope"),
        andRead: zod_1.z.boolean().optional().describe("Read/unread status"),
    }),
    execute: (args) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield mailsac.messages.filterInboxMessages(args);
        return JSON.stringify(result.data);
    }),
});
server.addTool({
    name: "search_inbox_messages",
    description: "Search messages by to, from, and subject (logical OR)",
    parameters: zod_1.z.object({
        query: zod_1.z.string().optional().describe("Search term"),
    }),
    execute: (args) => __awaiter(void 0, void 0, void 0, function* () {
        const queryParams = {};
        if (args.query)
            queryParams.query = args.query;
        const result = yield mailsac.messages.searchInboxMessages(queryParams);
        return JSON.stringify(result.data);
    }),
});
// ===== MESSAGE DETAILS & CONTENT TOOLS (5 endpoints) =====
server.addTool({
    name: "get_message_metadata",
    description: "Get email message metadata with links and attachments",
    parameters: zod_1.z.object({
        email: zod_1.z.string().describe("The email address"),
        messageId: zod_1.z.string().describe("Unique message identifier"),
    }),
    execute: (args) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield mailsac.messages.getMessageMetadata(args.email, args.messageId);
        return JSON.stringify(result.data);
    }),
});
server.addTool({
    name: "get_full_raw_message",
    description: "Get entire original SMTP message",
    parameters: zod_1.z.object({
        email: zod_1.z.string().describe("The email address"),
        messageId: zod_1.z.string().describe("Unique message identifier"),
        download: zod_1.z.boolean().optional().describe("Browser download flag"),
    }),
    execute: (args) => __awaiter(void 0, void 0, void 0, function* () {
        const queryParams = {};
        if (args.download)
            queryParams.download = 1;
        const result = yield mailsac.messages.getFullRawMessage(args.email, args.messageId, queryParams);
        return result.data;
    }),
});
server.addTool({
    name: "get_message_headers",
    description: "Get parsed message headers in multiple formats",
    parameters: zod_1.z.object({
        email: zod_1.z.string().describe("The email address"),
        messageId: zod_1.z.string().describe("Unique message identifier"),
        messageHeadersFormat: zod_1.z.enum(["json", "json-ordered", "plain"]).optional().describe("Headers format"),
        download: zod_1.z.boolean().optional().describe("Browser download flag"),
    }),
    execute: (args) => __awaiter(void 0, void 0, void 0, function* () {
        const queryParams = {};
        if (args.messageHeadersFormat)
            queryParams.messageHeadersFormat = args.messageHeadersFormat;
        if (args.download)
            queryParams.download = 1;
        const result = yield mailsac.messages.getHeaders(args.email, args.messageId, queryParams);
        return JSON.stringify(result.data);
    }),
});
server.addTool({
    name: "get_message_body_dirty",
    description: "Get message HTML body (dirty/unsanitized)",
    parameters: zod_1.z.object({
        email: zod_1.z.string().describe("The email address"),
        messageId: zod_1.z.string().describe("Unique message identifier"),
        download: zod_1.z.boolean().optional().describe("Browser download flag"),
    }),
    execute: (args) => __awaiter(void 0, void 0, void 0, function* () {
        const queryParams = {};
        if (args.download)
            queryParams.download = 1;
        const result = yield mailsac.messages.getBodyDirty(args.email, args.messageId, queryParams);
        return result.data;
    }),
});
server.addTool({
    name: "get_message_body_sanitized",
    description: "Get message HTML body (sanitized/safe)",
    parameters: zod_1.z.object({
        email: zod_1.z.string().describe("The email address"),
        messageId: zod_1.z.string().describe("Unique message identifier"),
        download: zod_1.z.boolean().optional().describe("Browser download flag"),
    }),
    execute: (args) => __awaiter(void 0, void 0, void 0, function* () {
        const queryParams = {};
        if (args.download)
            queryParams.download = 1;
        const result = yield mailsac.messages.getBodySanitized(args.email, args.messageId, queryParams);
        return result.data;
    }),
});
server.addTool({
    name: "get_message_body_plaintext",
    description: "Get message plaintext content",
    parameters: zod_1.z.object({
        email: zod_1.z.string().describe("The email address"),
        messageId: zod_1.z.string().describe("Unique message identifier"),
        download: zod_1.z.boolean().optional().describe("Browser download flag"),
    }),
    execute: (args) => __awaiter(void 0, void 0, void 0, function* () {
        const queryParams = {};
        if (args.download)
            queryParams.download = 1;
        const result = yield mailsac.messages.getBodyPlainText(args.email, args.messageId, queryParams);
        return result.data;
    }),
});
// ===== MESSAGE MANAGEMENT TOOLS (8 endpoints) =====
server.addTool({
    name: "delete_all_messages",
    description: "Delete all messages for an email inbox (starred messages protected)",
    parameters: zod_1.z.object({
        email: zod_1.z.string().describe("The email address"),
    }),
    execute: (args) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield mailsac.messages.deleteAllMessages(args.email);
        return JSON.stringify(result.data);
    }),
});
server.addTool({
    name: "delete_message",
    description: "Delete an individual email message",
    parameters: zod_1.z.object({
        email: zod_1.z.string().describe("The email address"),
        messageId: zod_1.z.string().describe("Unique message identifier"),
    }),
    execute: (args) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield mailsac.messages.deleteMessage(args.email, args.messageId);
        return JSON.stringify(result.data);
    }),
});
server.addTool({
    name: "toggle_message_star",
    description: "Star (save) a message to protect from auto-deletion",
    parameters: zod_1.z.object({
        email: zod_1.z.string().describe("The email address"),
        messageId: zod_1.z.string().describe("Unique message identifier"),
    }),
    execute: (args) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield mailsac.messages.toggleMessageStar(args.email, args.messageId);
        return JSON.stringify(result.data);
    }),
});
server.addTool({
    name: "add_message_label",
    description: "Add a label to a message for organization",
    parameters: zod_1.z.object({
        email: zod_1.z.string().describe("The email address"),
        messageId: zod_1.z.string().describe("Unique message identifier"),
        label: zod_1.z.string().describe("Label string to add"),
    }),
    execute: (args) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield mailsac.messages.addMessageLabel(args.email, args.messageId, args.label);
        return JSON.stringify(result.data);
    }),
});
server.addTool({
    name: "delete_message_label",
    description: "Remove a label from a message",
    parameters: zod_1.z.object({
        email: zod_1.z.string().describe("The email address"),
        messageId: zod_1.z.string().describe("Unique message identifier"),
        label: zod_1.z.string().describe("Label string to remove"),
    }),
    execute: (args) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield mailsac.messages.deleteMessageLabel(args.email, args.messageId, args.label);
        return JSON.stringify(result.data);
    }),
});
server.addTool({
    name: "set_message_folder",
    description: "Move message to folder (inbox, all, spam, trash)",
    parameters: zod_1.z.object({
        email: zod_1.z.string().describe("The email address"),
        messageId: zod_1.z.string().describe("Unique message identifier"),
        folder: zod_1.z.enum(["inbox", "all", "spam", "trash"]).describe("Folder name"),
    }),
    execute: (args) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield mailsac.messages.setMessageFolder(args.email, args.messageId, args.folder);
        return JSON.stringify(result.data);
    }),
});
server.addTool({
    name: "set_message_read_status",
    description: "Set message read/unread status",
    parameters: zod_1.z.object({
        email: zod_1.z.string().describe("The email address"),
        messageId: zod_1.z.string().describe("Unique message identifier"),
        readBoolean: zod_1.z.boolean().describe("Read status (true=read, false=unread)"),
    }),
    execute: (args) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield mailsac.messages.setMessageReadStatus(args.email, args.messageId, args.readBoolean);
        return JSON.stringify(result.data);
    }),
});
// ===== DOMAIN MANAGEMENT TOOLS (4 endpoints) =====
server.addTool({
    name: "list_domains",
    description: "List custom domains for the account",
    execute: () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield mailsac.domains.listDomains();
        return JSON.stringify(result.data);
    }),
});
server.addTool({
    name: "get_domain",
    description: "Get domain information including message count",
    parameters: zod_1.z.object({
        domain: zod_1.z.string().describe("Domain string"),
    }),
    execute: (args) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield mailsac.domains.getDomain(args.domain);
        return JSON.stringify(result.data);
    }),
});
server.addTool({
    name: "list_domain_messages",
    description: "List messages across any inboxes of a domain",
    parameters: zod_1.z.object({
        domain: zod_1.z.string().describe("Domain string"),
        until: zod_1.z.string().optional().describe("Return messages up to this UTC date"),
        limit: zod_1.z.number().optional().describe("Results limit"),
    }),
    execute: (args) => __awaiter(void 0, void 0, void 0, function* () {
        const queryParams = {};
        if (args.until)
            queryParams.until = args.until;
        if (args.limit)
            queryParams.limit = args.limit;
        const result = yield mailsac.messages.listDomainMessages(args.domain, queryParams);
        return JSON.stringify(result.data);
    }),
});
server.addTool({
    name: "delete_all_domain_messages",
    description: "Delete all messages for a domain (including starred)",
    parameters: zod_1.z.object({
        domain: zod_1.z.string().describe("Domain string"),
    }),
    execute: (args) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield mailsac.messages.deleteAllDomainMessages(args.domain);
        return JSON.stringify(result.data);
    }),
});
// ===== USER ACCOUNT TOOLS (2 endpoints) =====
server.addTool({
    name: "get_user_info",
    description: "Get current account information",
    execute: () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield mailsac.account.user();
        return JSON.stringify(result.data);
    }),
});
server.addTool({
    name: "get_account_stats",
    description: "Get account stats and usage information",
    parameters: zod_1.z.object({
        overrideAccountId: zod_1.z.string().optional().describe("Account ID override"),
    }),
    execute: (args) => __awaiter(void 0, void 0, void 0, function* () {
        const queryParams = {};
        if (args.overrideAccountId)
            queryParams.overrideAccountId = args.overrideAccountId;
        const result = yield mailsac.account.accountStats(queryParams);
        return JSON.stringify(result.data);
    }),
});
// ===== EMAIL ATTACHMENTS TOOLS (2 endpoints) =====
server.addTool({
    name: "list_message_attachments",
    description: "List attachment metadata for an email message",
    parameters: zod_1.z.object({
        email: zod_1.z.string().describe("The email address"),
        messageId: zod_1.z.string().describe("Unique message identifier"),
    }),
    execute: (args) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield mailsac.attachments.listMessageAttachments(args.email, args.messageId);
        return JSON.stringify(result.data);
    }),
});
server.addTool({
    name: "download_attachment",
    description: "Download an email message attachment as file",
    parameters: zod_1.z.object({
        email: zod_1.z.string().describe("The email address"),
        messageId: zod_1.z.string().describe("Unique message identifier"),
        attachmentIdentifier: zod_1.z.string().describe("MD5 sum, content-id, or filename"),
    }),
    execute: (args) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield mailsac.attachments.downloadAttachment(args.email, args.messageId, args.attachmentIdentifier);
        return `Binary file data (${result.status} ${result.statusText})`;
    }),
});
// ===== EMAIL STATS TOOLS (3 available endpoints) =====
server.addTool({
    name: "list_top_public_addresses",
    description: "List top public disposable email addresses by message volume",
    parameters: zod_1.z.object({
        startDate: zod_1.z.string().optional().describe("Start date filter"),
        endDate: zod_1.z.string().optional().describe("End date filter"),
        skip: zod_1.z.number().optional().describe("Pagination offset"),
        limit: zod_1.z.number().optional().describe("Results limit"),
    }),
    execute: (args) => __awaiter(void 0, void 0, void 0, function* () {
        const queryParams = {};
        if (args.startDate)
            queryParams.startDate = args.startDate;
        if (args.endDate)
            queryParams.endDate = args.endDate;
        if (args.skip)
            queryParams.skip = args.skip;
        if (args.limit)
            queryParams.limit = args.limit;
        const result = yield mailsac.messageStats.listTopPublicAddresses(queryParams);
        return JSON.stringify(result.data);
    }),
});
server.addTool({
    name: "list_top_public_senders",
    description: "List top sender email addresses for public messages",
    parameters: zod_1.z.object({
        startDate: zod_1.z.string().optional().describe("Start date filter"),
        endDate: zod_1.z.string().optional().describe("End date filter"),
        skip: zod_1.z.number().optional().describe("Pagination offset"),
        limit: zod_1.z.number().optional().describe("Results limit"),
    }),
    execute: (args) => __awaiter(void 0, void 0, void 0, function* () {
        const queryParams = {};
        if (args.startDate)
            queryParams.startDate = args.startDate;
        if (args.endDate)
            queryParams.endDate = args.endDate;
        if (args.skip)
            queryParams.skip = args.skip;
        if (args.limit)
            queryParams.limit = args.limit;
        const result = yield mailsac.messageStats.listTopPublicSenders(queryParams);
        return JSON.stringify(result.data);
    }),
});
server.addTool({
    name: "list_top_public_domains",
    description: "List top public domains receiving disposable messages",
    parameters: zod_1.z.object({
        startDate: zod_1.z.string().optional().describe("Start date filter"),
        endDate: zod_1.z.string().optional().describe("End date filter"),
        skip: zod_1.z.number().optional().describe("Pagination offset"),
        limit: zod_1.z.number().optional().describe("Results limit"),
    }),
    execute: (args) => __awaiter(void 0, void 0, void 0, function* () {
        const queryParams = {};
        if (args.startDate)
            queryParams.startDate = args.startDate;
        if (args.endDate)
            queryParams.endDate = args.endDate;
        if (args.skip)
            queryParams.skip = args.skip;
        if (args.limit)
            queryParams.limit = args.limit;
        const result = yield mailsac.messageStats.listTopPublicDomains(queryParams);
        return JSON.stringify(result.data);
    }),
});
// ===== WEBSOCKET/WEBHOOK DOCUMENTATION TOOLS (2 endpoints) =====
server.addTool({
    name: "websocket_info",
    description: "Get WebSocket connection information and documentation",
    execute: () => __awaiter(void 0, void 0, void 0, function* () {
        return JSON.stringify({
            endpoint: "wss://sock.mailsac.com/incoming-messages",
            usage: "Connect with ?key=YOUR_API_KEY&addresses=email1@domain.com,email2@domain.com",
            description: "Real-time email delivery via WebSocket connection",
            example: "wss://sock.mailsac.com/incoming-messages?key=k_eoj1mn7x5y61w0egs25j6xrv&addresses=test@mailsac.com"
        });
    }),
});
server.addTool({
    name: "webhook_info",
    description: "Get webhook configuration information and documentation",
    execute: () => __awaiter(void 0, void 0, void 0, function* () {
        return JSON.stringify({
            description: "Webhooks are configured per email address via the update_address tool",
            configuration: "Set webhook URL in the 'webhook' field when creating/updating addresses",
            slackSupport: "Slack webhooks supported via 'webhookSlack' field",
            payload: "Webhook receives EmailMessageWebhook objects as JSON POST",
            expectedResponse: "Webhook endpoint should return HTTP 200 status"
        });
    }),
});
server.start({
    transportType: "stdio",
});
