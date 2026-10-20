# Graph Report - New folder (2)  (2026-10-20)

## Corpus Check
- 116 files · ~593,319 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 861 nodes · 1039 edges · 59 communities (49 shown, 10 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 19 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `fb8fa593`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]
- [[_COMMUNITY_Community 57|Community 57]]
- [[_COMMUNITY_Community 58|Community 58]]
- [[_COMMUNITY_Community 59|Community 59]]
- [[_COMMUNITY_Community 60|Community 60]]

## God Nodes (most connected - your core abstractions)
1. `createMcpServer()` - 22 edges
2. `ResendEditorClient` - 16 edges
3. `scripts` - 13 edges
4. `dependencies` - 13 edges
5. `compilerOptions` - 13 edges
6. `suspicious` - 11 edges
7. `Stdio Transport (Default)` - 11 edges
8. `Remote MCP Server` - 10 edges
9. `dependencies` - 9 edges
10. `resolveConfig()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `createMcpServer()` --calls--> `addContactPropertyTools()`  [INFERRED]
  resend-mcp/src/server.ts → resend-mcp/src/tools/contactProperties.ts
- `createMcpServer()` --calls--> `addDomainTools()`  [INFERRED]
  resend-mcp/src/server.ts → resend-mcp/src/tools/domains.ts
- `createMcpServer()` --calls--> `addTopicTools()`  [INFERRED]
  resend-mcp/src/server.ts → resend-mcp/src/tools/topics.ts
- `checkMongo()` --calls--> `connectMongoDB()`  [EXTRACTED]
  scripts/check-mongo.js → server/db.js
- `seedMongo()` --calls--> `connectMongoDB()`  [EXTRACTED]
  scripts/seed-mongo.js → server/db.js

## Communities (59 total, 10 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.08
Nodes (6): CartPage(), Checkout(), money(), ProductCard(), ProductDetail(), QuickView()

### Community 1 - "Community 1"
Cohesion: 0.05
Nodes (42): bin, resend-mcp, default, dependencies, dotenv, express, @modelcontextprotocol/express, @modelcontextprotocol/node (+34 more)

### Community 2 - "Community 2"
Cohesion: 0.09
Nodes (29): CLI_STRING_OPTIONS, HELP_TEXT, printHelp(), stderr, getUnknownArgs(), KNOWN_ARG_KEYS, resolveConfigOrExit(), parseAllowedFileDirs() (+21 more)

### Community 3 - "Community 3"
Cohesion: 0.08
Nodes (28): BranchingStep, hasBranches(), LinearStep, sdkResponseToWorkflow(), { connections }, original, roundTripped, steps (+20 more)

### Community 4 - "Community 4"
Cohesion: 0.04
Nodes (47): source, assist, actions, noBannedTypes, noUselessFragments, noUselessSwitchCase, noUnusedImports, noUnusedVariables (+39 more)

### Community 5 - "Community 5"
Cohesion: 0.05
Nodes (41): isInside(), readAllowedFile(), resolveAllowedPath(), missing, path, sibling, addContactImportTools(), CREATE_CONTACT_IMPORT_TOOL (+33 more)

### Community 6 - "Community 6"
Cohesion: 0.08
Nodes (24): addWebhookTools(), CREATE_WEBHOOK_TOOL, GET_WEBHOOK_EVENT_TOOL, GET_WEBHOOK_TOOL, LIST_WEBHOOK_EVENT_ATTEMPTS_TOOL, LIST_WEBHOOK_EVENTS_TOOL, LIST_WEBHOOKS_TOOL, REMOVE_WEBHOOK_TOOL (+16 more)

### Community 7 - "Community 7"
Cohesion: 0.06
Nodes (33): dependencies, axios, cors, dotenv, express, gsap, @gsap/react, mongoose (+25 more)

### Community 8 - "Community 8"
Cohesion: 0.15
Nodes (10): createMcpServer(), resend, server, addContactTools(), addEventTools(), MANAGE_EVENTS_TOOL, SEND_EVENT_TOOL, addLogTools() (+2 more)

### Community 9 - "Community 9"
Cohesion: 0.09
Nodes (19): ADD_SUPPRESSION_TOOL, addSuppressionTools(), BATCH_ADD_SUPPRESSIONS_TOOL, BATCH_REMOVE_SUPPRESSIONS_TOOL, GET_SUPPRESSION_TOOL, LIST_SUPPRESSIONS_TOOL, REMOVE_SUPPRESSION_TOOL, add (+11 more)

### Community 10 - "Community 10"
Cohesion: 0.22
Nodes (8): Developing Concepts, Experience, Goals, Learner Profile, Preferences, Project, Revisit, Strong Concepts

### Community 12 - "Community 12"
Cohesion: 0.12
Nodes (16): addSegmentTools(), CREATE_SEGMENT_TOOL, GET_SEGMENT_TOOL, LIST_SEGMENTS_TOOL, REMOVE_SEGMENT_TOOL, create, get, list (+8 more)

### Community 13 - "Community 13"
Cohesion: 0.12
Nodes (15): addApiKeyTools(), CREATE_API_KEY_TOOL, LIST_API_KEYS_TOOL, REMOVE_API_KEY_TOOL, byName, create, list, makeClient() (+7 more)

### Community 14 - "Community 14"
Cohesion: 0.22
Nodes (8): Build and Deployment, Components, Data and Trust Boundaries, Main Flow, Project Map, Purpose, Requirements, Unknowns

### Community 15 - "Community 15"
Cohesion: 0.06
Nodes (35): Claude Code, Claude Code, Claude Desktop, code:bash (npx add-mcp resend-mcp --name resend --env "RESEND_API_KEY=r), code:bash (claude mcp add resend -e RESEND_API_KEY=re_xxxxxxxxx -- npx ), code:bash (codex mcp add resend \), code:json ({), code:json ({) (+27 more)

### Community 16 - "Community 16"
Cohesion: 0.14
Nodes (12): fetchMock, url, DashboardClient, addEditorTools(), CONNECT_TO_EDITOR_TOOL, DISCONNECT_FROM_EDITOR_TOOL, EditorConnection, GET_TIPTAP_JSON_CONTENT_TOOL (+4 more)

### Community 17 - "Community 17"
Cohesion: 0.12
Nodes (15): compilerOptions, declaration, esModuleInterop, forceConsistentCasingInFileNames, jsx, module, moduleResolution, outDir (+7 more)

### Community 18 - "Community 18"
Cohesion: 0.15
Nodes (13): buildCreateBroadcastInputSchema(), CANCEL_BROADCAST_TOOL, COMPOSE_BROADCAST_TOOL, CREATE_BROADCAST_TOOL_BASE, DUPLICATE_BROADCAST_TOOL, GET_BROADCAST_TOOL, getCreateBroadcastInputSchema(), LIST_BROADCAST_CLICKED_LINKS_TOOL (+5 more)

### Community 19 - "Community 19"
Cohesion: 0.15
Nodes (10): addDomainTools(), CREATE_DOMAIN_CLAIM_TOOL, CREATE_DOMAIN_TOOL, GET_DOMAIN_CLAIM_TOOL, GET_DOMAIN_TOOL, LIST_DOMAINS_TOOL, REMOVE_DOMAIN_TOOL, UPDATE_DOMAIN_TOOL (+2 more)

### Community 20 - "Community 20"
Cohesion: 0.18
Nodes (10): addOAuthGrantTools(), LIST_OAUTH_GRANTS_TOOL, REVOKE_OAUTH_GRANT_TOOL, grant, list, makeClient(), names, resend (+2 more)

### Community 21 - "Community 21"
Cohesion: 0.29
Nodes (6): addContactPropertyTools(), CREATE_CONTACT_PROPERTY_TOOL, GET_CONTACT_PROPERTY_TOOL, LIST_CONTACT_PROPERTIES_TOOL, REMOVE_CONTACT_PROPERTY_TOOL, UPDATE_CONTACT_PROPERTY_TOOL

### Community 22 - "Community 22"
Cohesion: 0.18
Nodes (10): [1.0.0] - 2025-02-24, [1.1.0] - 2025-07-08, Added, Added, Added, Changed, Changed, Changelog (+2 more)

### Community 23 - "Community 23"
Cohesion: 0.18
Nodes (10): RESEND_API_KEY, mcpServers, resend, resend-dev, args, command, args, command (+2 more)

### Community 24 - "Community 24"
Cohesion: 0.18
Nodes (10): ADD_CONTACT_TO_SEGMENT_TOOL, CREATE_CONTACT_TOOL, GET_CONTACT_TOOL, LIST_CONTACT_SEGMENTS_TOOL, LIST_CONTACT_TOPICS_TOOL, LIST_CONTACTS_TOOL, REMOVE_CONTACT_FROM_SEGMENT_TOOL, REMOVE_CONTACT_TOOL (+2 more)

### Community 25 - "Community 25"
Cohesion: 0.22
Nodes (12): sendOtpSms(), result, router, generateOtp(), sendOtp(), verifyOtp(), deleteRecord(), getRecord() (+4 more)

### Community 26 - "Community 26"
Cohesion: 0.22
Nodes (7): addUsageTools(), GET_USAGE_TOOL, get, makeClient(), resend, text, tool

### Community 27 - "Community 27"
Cohesion: 0.13
Nodes (17): 1. Directory Layout & Module Roles, 2. Component Hierarchy in `src/App.jsx`, 3. Server API Routes (`server/api.js`), 3. Server API Routes (`server/app.js`), 4. MongoDB Atlas Mongoose Schemas (`server/models/`), 4. Neon Database Schema (`scripts/init-db.js`), Aanur Textile — Codebase Architecture Reference, code:text (aanur-textile/) (+9 more)

### Community 28 - "Community 28"
Cohesion: 0.11
Nodes (19): Authenticating with an API key, Claude, Claude Code, code:block1 (https://mcp.resend.com/mcp), code:json ({), code:bash (claude mcp add --transport http resend https://mcp.resend.co), code:block3 (https://mcp.resend.com/mcp), code:json ({) (+11 more)

### Community 29 - "Community 29"
Cohesion: 0.14
Nodes (12): 1. Rebuilding & Updating the Knowledge Graph, 2. Opening Visual Dashboards, 3. Querying Architecture with Graph Traversal, Aanur Textile Project Architecture Map, code:mermaid (graph TB), code:powershell (# Via Graphify CLI directly:), code:powershell (# Open interactive 2D graph in default browser:), code:powershell (# Answer architectural questions with BFS:) (+4 more)

### Community 30 - "Community 30"
Cohesion: 0.17
Nodes (10): 1. Executive Summary, 2. End-to-End System Architecture, 3. Order Processing Sequence, 4. Key Performance Metrics, 4. Security & Configuration Matrix, 5. Performance Metrics, 6. Graph Artifacts Navigation, 🔍 Aanur Textile — Architecture & System Audit Report (+2 more)

### Community 31 - "Community 31"
Cohesion: 0.12
Nodes (17): code:block27 (git clone https://github.com/resend/resend-mcp.git), code:bash (claude mcp add resend -e RESEND_API_KEY=re_xxxxxxxxx -- node), code:bash (claude mcp add resend --transport http http://127.0.0.1:3000), code:json ({), code:json ({), code:bash (pnpm tsc --watch), code:bash (mkdir -p /tmp/mcp-test), code:json (// /tmp/mcp-test/.mcp.json) (+9 more)

### Community 32 - "Community 32"
Cohesion: 0.17
Nodes (10): 1. High-Value Architecture Queries, 2. Shortest Path Traversals (`graphify path`), 3. Symbol Explanations (`graphify explain`), 4. Graph Navigation Tips, 4. Graph Updating, Aanur Textile — Graphify Query Cookbook, code:powershell (# Trace end-to-end checkout flow), code:powershell (# Find how checkout triggers email) (+2 more)

### Community 33 - "Community 33"
Cohesion: 0.29
Nodes (6): addTopicTools(), CREATE_TOPIC_TOOL, GET_TOPIC_TOOL, LIST_TOPICS_TOOL, REMOVE_TOPIC_TOOL, UPDATE_TOPIC_TOOL

### Community 34 - "Community 34"
Cohesion: 0.25
Nodes (6): Aanur Textile — Mermaid Diagram Style Guide, code:mermaid (graph TB), code:mermaid (sequenceDiagram), Color Tokens, Sequence Diagram Guidelines, Standard Flowchart Template

### Community 37 - "Community 37"
Cohesion: 0.83
Nodes (3): analyze(), closest_name(), main()

### Community 39 - "Community 39"
Cohesion: 0.5
Nodes (3): bcc: manager@example.com, cc: colleague1@example.com, colleague2@example.com, Example of using CC and BCC:

### Community 51 - "Community 51"
Cohesion: 0.05
Nodes (40): EnquirySchema, OrderItemSchema, OrderSchema, ProductSchema, VariantSchema, checkMongo(), initDatabase(), sql (+32 more)

### Community 53 - "Community 53"
Cohesion: 0.18
Nodes (10): EMAIL_HTML_RULES, COMPOSE_TEMPLATE_TOOL, CREATE_TEMPLATE_TOOL, DUPLICATE_TEMPLATE_TOOL, GET_TEMPLATE_TOOL, LIST_TEMPLATES_TOOL, PUBLISH_TEMPLATE_TOOL, REMOVE_TEMPLATE_TOOL (+2 more)

### Community 54 - "Community 54"
Cohesion: 0.27
Nodes (3): ServerOptions, HttpTransportOptions, sessions

### Community 55 - "Community 55"
Cohesion: 0.2
Nodes (9): addBroadcastTools(), apiClient, clickedLinks, duplicate, makeClient(), recipients, resend, text (+1 more)

### Community 57 - "Community 57"
Cohesion: 0.2
Nodes (7): config, parsed, resend, serverOptions, runStdio(), { mockServeStdio }, resend

### Community 58 - "Community 58"
Cohesion: 0.47
Nodes (4): allowedDashboardHosts(), DEFAULT_DASHBOARD_HOSTS, extractIdFromUrl(), SUPPORTED_RESOURCES

### Community 59 - "Community 59"
Cohesion: 0.4
Nodes (5): addTemplateTools(), create, makeClient(), resend, update

### Community 60 - "Community 60"
Cohesion: 0.22
Nodes (5): connect(), send, runHttp(), { port }, server

## Knowledge Gaps
- **471 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+466 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createMcpServer()` connect `Community 8` to `Community 33`, `Community 3`, `Community 5`, `Community 6`, `Community 9`, `Community 12`, `Community 13`, `Community 16`, `Community 19`, `Community 20`, `Community 21`, `Community 54`, `Community 55`, `Community 57`, `Community 26`, `Community 59`?**
  _High betweenness centrality (0.196) - this node is a cross-community bridge._
- **Why does `addEmailTools()` connect `Community 5` to `Community 8`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Why does `addWebhookTools()` connect `Community 6` to `Community 8`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Are the 18 inferred relationships involving `createMcpServer()` (e.g. with `addEditorTools()` and `addApiKeyTools()`) actually correct?**
  _`createMcpServer()` has 18 INFERRED edges - model-reasoned connections that need verification._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _471 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._