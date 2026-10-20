# Graph Report - New folder (2)  (2026-10-21)

## Corpus Check
- 117 files · ~600,554 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 959 nodes · 1150 edges · 77 communities (67 shown, 10 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 19 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `057852ea`
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
- [[_COMMUNITY_Community 36|Community 36]]
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
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]
- [[_COMMUNITY_Community 57|Community 57]]
- [[_COMMUNITY_Community 58|Community 58]]
- [[_COMMUNITY_Community 59|Community 59]]
- [[_COMMUNITY_Community 60|Community 60]]
- [[_COMMUNITY_Community 61|Community 61]]
- [[_COMMUNITY_Community 62|Community 62]]
- [[_COMMUNITY_Community 63|Community 63]]
- [[_COMMUNITY_Community 64|Community 64]]
- [[_COMMUNITY_Community 65|Community 65]]
- [[_COMMUNITY_Community 66|Community 66]]
- [[_COMMUNITY_Community 67|Community 67]]
- [[_COMMUNITY_Community 68|Community 68]]
- [[_COMMUNITY_Community 69|Community 69]]
- [[_COMMUNITY_Community 70|Community 70]]
- [[_COMMUNITY_Community 71|Community 71]]
- [[_COMMUNITY_Community 72|Community 72]]
- [[_COMMUNITY_Community 73|Community 73]]
- [[_COMMUNITY_Community 74|Community 74]]
- [[_COMMUNITY_Community 75|Community 75]]
- [[_COMMUNITY_Community 76|Community 76]]

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
- `createMcpServer()` --calls--> `addContactTools()`  [INFERRED]
  resend-mcp/src/server.ts → resend-mcp/src/tools/contacts.ts
- `createMcpServer()` --calls--> `addEventTools()`  [INFERRED]
  resend-mcp/src/server.ts → resend-mcp/src/tools/events.ts
- `createMcpServer()` --calls--> `addLogTools()`  [INFERRED]
  resend-mcp/src/server.ts → resend-mcp/src/tools/logs.ts
- `createMcpServer()` --calls--> `addTopicTools()`  [INFERRED]
  resend-mcp/src/server.ts → resend-mcp/src/tools/topics.ts

## Communities (77 total, 10 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.07
Nodes (10): AdminPage(), money(), API_BASE, apiUrl(), CartPage(), Checkout(), money(), ProductCard() (+2 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (34): bin, resend-mcp, default, devDependencies, @biomejs/biome, @modelcontextprotocol/client, @types/minimist, @types/node (+26 more)

### Community 2 - "Community 2"
Cohesion: 0.07
Nodes (37): CLI_STRING_OPTIONS, HELP_TEXT, printHelp(), stderr, getUnknownArgs(), KNOWN_ARG_KEYS, resolveConfigOrExit(), parseAllowedFileDirs() (+29 more)

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
Cohesion: 0.31
Nodes (5): createMcpServer(), ServerOptions, resend, server, addDomainTools()

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
Cohesion: 0.1
Nodes (21): Claude Code, Claude Desktop, code:bash (npx add-mcp resend-mcp --name resend --env "RESEND_API_KEY=r), code:bash (claude mcp add resend -e RESEND_API_KEY=re_xxxxxxxxx -- npx ), code:bash (codex mcp add resend \), code:json ({), code:json ({), code:json ({) (+13 more)

### Community 16 - "Community 16"
Cohesion: 0.14
Nodes (12): fetchMock, url, DashboardClient, addEditorTools(), CONNECT_TO_EDITOR_TOOL, DISCONNECT_FROM_EDITOR_TOOL, EditorConnection, GET_TIPTAP_JSON_CONTENT_TOOL (+4 more)

### Community 17 - "Community 17"
Cohesion: 0.12
Nodes (15): compilerOptions, declaration, esModuleInterop, forceConsistentCasingInFileNames, jsx, module, moduleResolution, outDir (+7 more)

### Community 18 - "Community 18"
Cohesion: 0.18
Nodes (10): EMAIL_HTML_RULES, COMPOSE_TEMPLATE_TOOL, CREATE_TEMPLATE_TOOL, DUPLICATE_TEMPLATE_TOOL, GET_TEMPLATE_TOOL, LIST_TEMPLATES_TOOL, PUBLISH_TEMPLATE_TOOL, REMOVE_TEMPLATE_TOOL (+2 more)

### Community 19 - "Community 19"
Cohesion: 0.17
Nodes (9): CREATE_DOMAIN_CLAIM_TOOL, CREATE_DOMAIN_TOOL, GET_DOMAIN_CLAIM_TOOL, GET_DOMAIN_TOOL, LIST_DOMAINS_TOOL, REMOVE_DOMAIN_TOOL, UPDATE_DOMAIN_TOOL, VERIFY_DOMAIN_CLAIM_TOOL (+1 more)

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
Cohesion: 0.17
Nodes (11): ADD_CONTACT_TO_SEGMENT_TOOL, addContactTools(), CREATE_CONTACT_TOOL, GET_CONTACT_TOOL, LIST_CONTACT_SEGMENTS_TOOL, LIST_CONTACT_TOPICS_TOOL, LIST_CONTACTS_TOOL, REMOVE_CONTACT_FROM_SEGMENT_TOOL (+3 more)

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
Cohesion: 0.12
Nodes (16): Claude, Claude Code, code:block1 (https://mcp.resend.com/mcp), code:bash (claude mcp add --transport http resend https://mcp.resend.co), code:block3 (https://mcp.resend.com/mcp), code:json ({), code:bash (codex mcp add resend --url https://mcp.resend.com/mcp), code:json ({) (+8 more)

### Community 29 - "Community 29"
Cohesion: 0.14
Nodes (12): 1. Rebuilding & Updating the Knowledge Graph, 2. Opening Visual Dashboards, 3. Querying Architecture with Graph Traversal, Aanur Textile Project Architecture Map, code:mermaid (graph TB), code:powershell (# Via Graphify CLI directly:), code:powershell (# Open interactive 2D graph in default browser:), code:powershell (# Answer architectural questions with BFS:) (+4 more)

### Community 30 - "Community 30"
Cohesion: 0.17
Nodes (10): 1. Executive Summary, 2. End-to-End System Architecture, 3. Order Processing Sequence, 4. Key Performance Metrics, 4. Security & Configuration Matrix, 5. Performance Metrics, 6. Graph Artifacts Navigation, 🔍 Aanur Textile — Architecture & System Audit Report (+2 more)

### Community 31 - "Community 31"
Cohesion: 0.2
Nodes (10): code:block27 (git clone https://github.com/resend/resend-mcp.git), code:bash (claude mcp add resend -e RESEND_API_KEY=re_xxxxxxxxx -- node), code:bash (claude mcp add resend --transport http http://127.0.0.1:3000), code:json ({), code:json ({), code:bash (pnpm tsc --watch), code:bash (mkdir -p /tmp/mcp-test), code:json (// /tmp/mcp-test/.mcp.json) (+2 more)

### Community 32 - "Community 32"
Cohesion: 0.17
Nodes (10): 1. High-Value Architecture Queries, 2. Shortest Path Traversals (`graphify path`), 3. Symbol Explanations (`graphify explain`), 4. Graph Navigation Tips, 4. Graph Updating, Aanur Textile — Graphify Query Cookbook, code:powershell (# Trace end-to-end checkout flow), code:powershell (# Find how checkout triggers email) (+2 more)

### Community 33 - "Community 33"
Cohesion: 0.29
Nodes (6): addTopicTools(), CREATE_TOPIC_TOOL, GET_TOPIC_TOOL, LIST_TOPICS_TOOL, REMOVE_TOPIC_TOOL, UPDATE_TOPIC_TOOL

### Community 34 - "Community 34"
Cohesion: 0.25
Nodes (6): Aanur Textile — Mermaid Diagram Style Guide, code:mermaid (graph TB), code:mermaid (sequenceDiagram), Color Tokens, Sequence Diagram Guidelines, Standard Flowchart Template

### Community 36 - "Community 36"
Cohesion: 0.2
Nodes (10): code:bash (git clone https://github.com/<your-username>/Aanur-textile.g), code:bash (git checkout -b feature/order-tracking-enhancement), code:bash (npm run db:check), code:bash (git commit -m "feat(checkout): add automated postal code val), code:bash (git push origin feature/order-tracking-enhancement), code:text (MIT License), 🤝 Contributing & License, 📍 Headquarters & Store Contact (+2 more)

### Community 37 - "Community 37"
Cohesion: 0.83
Nodes (3): analyze(), closest_name(), main()

### Community 39 - "Community 39"
Cohesion: 0.5
Nodes (3): bcc: manager@example.com, cc: colleague1@example.com, colleague2@example.com, Example of using CC and BCC:

### Community 51 - "Community 51"
Cohesion: 0.07
Nodes (29): adminEmail, autoVerifyAt, cleanEmail, cleanOtp, configured, enquiry, entry, existingRefs (+21 more)

### Community 52 - "Community 52"
Cohesion: 0.2
Nodes (10): code:bash (node -v), code:bash (git clone https://github.com/Phoenix05420/Aanur-textile.git), code:bash (cp .env.example .env), code:ini (# ==========================================================), code:bash (# 1. Check MongoDB Atlas connection & collection status), ⚙️ Installation & Local Setup, Step 1: Verify Prerequisites, Step 2: Clone Repository & Enter Directory (+2 more)

### Community 53 - "Community 53"
Cohesion: 0.5
Nodes (3): addEventTools(), MANAGE_EVENTS_TOOL, SEND_EVENT_TOOL

### Community 54 - "Community 54"
Cohesion: 0.5
Nodes (3): addLogTools(), GET_LOG_TOOL, LIST_LOGS_TOOL

### Community 55 - "Community 55"
Cohesion: 0.3
Nodes (12): run(), sampleOrder, getSql(), handleApiRequest(), isConfigured(), getResendClient(), isResendConfigured(), sendOrderCustomerEmail() (+4 more)

### Community 57 - "Community 57"
Cohesion: 0.15
Nodes (13): buildCreateBroadcastInputSchema(), CANCEL_BROADCAST_TOOL, COMPOSE_BROADCAST_TOOL, CREATE_BROADCAST_TOOL_BASE, DUPLICATE_BROADCAST_TOOL, GET_BROADCAST_TOOL, getCreateBroadcastInputSchema(), LIST_BROADCAST_CLICKED_LINKS_TOOL (+5 more)

### Community 58 - "Community 58"
Cohesion: 0.17
Nodes (10): EnquirySchema, OrderItemSchema, OrderSchema, ProductSchema, VariantSchema, checkMongo(), seedMongo(), autoVerifyPendingOrders() (+2 more)

### Community 59 - "Community 59"
Cohesion: 0.2
Nodes (9): addBroadcastTools(), apiClient, clickedLinks, duplicate, makeClient(), recipients, resend, text (+1 more)

### Community 60 - "Community 60"
Cohesion: 0.15
Nodes (7): connect(), send, HttpTransportOptions, runHttp(), sessions, { port }, server

### Community 61 - "Community 61"
Cohesion: 0.2
Nodes (10): Claude Code, code:bash (npx -y resend-mcp --http --port 3000), code:bash (claude mcp add resend --transport http http://127.0.0.1:3000), code:json ({), code:bash (MCP_PORT=3000 npx -y resend-mcp --http), code:ts (import { runHttp } from 'resend-mcp/http';), code:ts (const server = await runHttp({}, 3000, { host: '0.0.0.0' });), Cursor (+2 more)

### Community 62 - "Community 62"
Cohesion: 0.25
Nodes (7): 🧵 Aanur Textile — Enterprise Full-Stack Textile & Fabric Commerce Platform, 🗺️ API Architecture & Endpoints, code:mermaid (flowchart TD), Comprehensive Stack Specification, System Architecture Diagram, 📑 Table of Contents, 🛠️ Tech Stack & Architecture

### Community 63 - "Community 63"
Cohesion: 0.25
Nodes (8): ⚙️ Administrative Dashboard & Architecture Telemetry, 🤖 AI-Ready Tooling & Architecture Graph, 🧵 Catalog & Fabric Variant Filtering, 🚀 Key Features, 📦 Order Management & Logistics Pipeline, 🛒 Shopping Bag & Dynamic Coupon Engine, 📨 Transactional Notifications & Communication, 🔐 User Authentication & Account Management

### Community 64 - "Community 64"
Cohesion: 0.15
Nodes (7): app, __dirname, distDir, __filename, indexPath, publicDir, rootDir

### Community 65 - "Community 65"
Cohesion: 0.47
Nodes (4): allowedDashboardHosts(), DEFAULT_DASHBOARD_HOSTS, extractIdFromUrl(), SUPPORTED_RESOURCES

### Community 66 - "Community 66"
Cohesion: 0.33
Nodes (6): code:bash (# Compile optimized React assets to /dist), code:bash (npm run dev), Option A: Unified Vite Dev Server (Recommended), Option B: Standalone Production Server, Option C: Windows One-Click Quick Launch, Step 6: Launch the Development Server

### Community 67 - "Community 67"
Cohesion: 0.21
Nodes (7): initDatabase(), sql, categories, products, store, money(), ProfilePage()

### Community 68 - "Community 68"
Cohesion: 0.18
Nodes (7): config, parsed, resend, serverOptions, runStdio(), { mockServeStdio }, resend

### Community 69 - "Community 69"
Cohesion: 0.4
Nodes (5): Core Problems Solved, 🎯 Project Overview & Value Proposition, The Context, What is Aanur Textile?, Who It Serves

### Community 70 - "Community 70"
Cohesion: 0.4
Nodes (4): Local MCP Server, MCP Server Tools, Options, Resend MCP Server

### Community 71 - "Community 71"
Cohesion: 0.22
Nodes (8): build, buildCommand, builder, deploy, restartPolicyMaxRetries, restartPolicyType, startCommand, $schema

### Community 72 - "Community 72"
Cohesion: 0.67
Nodes (3): code:bash (npm install), code:bash (cd resend-mcp && npm install && npm run build && cd ..), Step 3: Install Node Dependencies

### Community 73 - "Community 73"
Cohesion: 0.29
Nodes (7): code:bash (export RESEND_API_KEY=re_your_key_here), code:bash (pnpm inspector), code:bash (node dist/index.js --http --port 3000), code:bash (pnpm inspector), Testing with MCP Inspector, Using HTTP Transport, Using Stdio Transport

### Community 74 - "Community 74"
Cohesion: 0.33
Nodes (5): buildCommand, cleanUrls, framework, outputDirectory, rewrites

### Community 75 - "Community 75"
Cohesion: 0.4
Nodes (5): addTemplateTools(), create, makeClient(), resend, update

### Community 76 - "Community 76"
Cohesion: 0.67
Nodes (3): Authenticating with an API key, code:json ({), code:bash (claude mcp add --transport http resend https://mcp.resend.co)

## Knowledge Gaps
- **534 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+529 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createMcpServer()` connect `Community 8` to `Community 33`, `Community 3`, `Community 5`, `Community 6`, `Community 9`, `Community 75`, `Community 12`, `Community 13`, `Community 16`, `Community 20`, `Community 21`, `Community 53`, `Community 54`, `Community 24`, `Community 26`, `Community 59`, `Community 60`?**
  _High betweenness centrality (0.158) - this node is a cross-community bridge._
- **Why does `addEmailTools()` connect `Community 5` to `Community 8`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Why does `addWebhookTools()` connect `Community 6` to `Community 8`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Are the 18 inferred relationships involving `createMcpServer()` (e.g. with `addEditorTools()` and `addApiKeyTools()`) actually correct?**
  _`createMcpServer()` has 18 INFERRED edges - model-reasoned connections that need verification._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _534 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.07 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._