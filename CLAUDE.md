# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an MCP (Model Context Protocol) server that integrates with GetTestMail, a testing email service. The project uses:
- FastMCP framework for building MCP servers
- GetTestMail TypeScript SDK for email testing functionality
- Zod for schema validation

## Commands

### Development
- `npm start` - Start the MCP server (main entry point is index.ts)
- `npx tsc` - Compile TypeScript to JavaScript
- `npx tsc --watch` - Compile TypeScript in watch mode

### Testing
Currently no test framework is configured. The default test script exits with an error.

## Architecture

- **index.ts** - Main entry point (currently empty, needs implementation)
- **fastmcp** - Framework for building MCP servers with tool definitions
- **@gettestmail/typescript-sdk** - Provides email testing capabilities
- **zod** - Schema validation for request/response validation

The project structure follows a simple single-file MCP server pattern using FastMCP's framework conventions.