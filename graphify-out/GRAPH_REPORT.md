# Graph Report - Aanur-textile-main  (2026-10-20)

## Corpus Check
- 97 files · ~587,866 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 3, .example 2, .css 1)

## Summary
- 742 nodes · 1199 edges · 35 communities (32 shown, 3 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- App.jsx
- resend-mcp/package.json
- server.ts
- emails.ts
- suspicious
- package.json
- vitest
- broadcasts.ts
- 🧵 Aanur Textile — Modern MERN E-Commerce Platform
- automations.ts
- Learner Profile
- webhooks.ts
- http.ts
- suppressions.test.ts
- Project Map
- Stdio Transport (Default)
- ref_resend
- compilerOptions
- segments.test.ts
- domains.ts
- @modelcontextprotocol/server
- contacts.ts
- [1.1.0] - 2025-07-08
- apiKeys.test.ts
- usage.test.ts
- contactProperties.ts
- topics.ts
- resend
- Workflow: graphify
- rules/graphify.md
- analyze-images.py
- email.md
- renovate.json
- progress.md
- app.js

## God Nodes (most connected - your core abstractions)
1. `@modelcontextprotocol/server` - 35 edges
2. `vitest` - 26 edges
3. `createMcpServer()` - 26 edges
4. `Icon()` - 21 edges
5. `App()` - 19 edges
6. `zod` - 18 edges
7. `ResendEditorClient` - 17 edges
8. `🧵 Aanur Textile — Modern MERN E-Commerce Platform` - 15 edges
9. `@modelcontextprotocol/client` - 14 edges
10. `scripts` - 13 edges

## Surprising Connections (you probably didn't know these)
- `checkMongo()` --calls--> `connectMongoDB()`  [EXTRACTED]
  scripts/check-mongo.js → server/db.js
- `seedMongo()` --calls--> `connectMongoDB()`  [EXTRACTED]
  scripts/seed-mongo.js → server/db.js
- `run()` --calls--> `sendOrderEmail()`  [EXTRACTED]
  scripts/test-email.js → server/email.js
- `addAutomationTools()` --calls--> `extractIdFromUrl()`  [EXTRACTED]
  resend-mcp/src/tools/automations.ts → resend-mcp/src/lib/url-parser.ts
- `addEditorTools()` --calls--> `extractIdFromUrl()`  [EXTRACTED]
  resend-mcp/src/tools/editor.ts → resend-mcp/src/lib/url-parser.ts

## Import Cycles
- None detected.

## Communities (35 total, 3 thin omitted)

### Community 0 - "App.jsx"
Cohesion: 0.16
Nodes (30): react, AboutPage(), AccountPage(), App(), AuthPage(), BestOffersPage(), CartPage(), Catalog() (+22 more)

### Community 1 - "resend-mcp/package.json"
Cohesion: 0.04
Nodes (48): @biomejs/biome, @types/minimist, @types/node, typescript, bin, resend-mcp, dependencies, dotenv (+40 more)

### Community 2 - "server.ts"
Cohesion: 0.06
Nodes (21): DashboardClient, ResendEditorClient, createMcpServer(), addEditorTools(), getAgentName(), withEditorSession(), CONNECT_TO_EDITOR_TOOL, DISCONNECT_FROM_EDITOR_TOOL (+13 more)

### Community 3 - "emails.ts"
Cohesion: 0.06
Nodes (36): eventJson, isInside(), readAllowedFile(), resolveAllowedPath(), addContactImportTools(), CREATE_CONTACT_IMPORT_TOOL, GET_CONTACT_IMPORT_TOOL, LIST_CONTACT_IMPORTS_TOOL (+28 more)

### Community 4 - "suspicious"
Cohesion: 0.04
Nodes (47): source, assist, actions, noBannedTypes, noUselessFragments, noUselessSwitchCase, noUnusedImports, noUnusedVariables (+39 more)

### Community 5 - "package.json"
Cohesion: 0.04
Nodes (43): dependencies, axios, cors, dotenv, express, gsap, @gsap/react, mongoose (+35 more)

### Community 6 - "vitest"
Cohesion: 0.10
Nodes (27): minimist, vitest, default, CLI_STRING_OPTIONS, DEFAULT_HTTP_PORT, HELP_TEXT, printHelp(), getUnknownArgs() (+19 more)

### Community 7 - "broadcasts.ts"
Cohesion: 0.06
Nodes (34): EMAIL_HTML_RULES, allowedDashboardHosts(), DEFAULT_DASHBOARD_HOSTS, extractIdFromUrl(), SUPPORTED_RESOURCES, addBroadcastTools(), buildCreateBroadcastInputSchema(), CANCEL_BROADCAST_TOOL (+26 more)

### Community 8 - "🧵 Aanur Textile — Modern MERN E-Commerce Platform"
Cohesion: 0.07
Nodes (27): 1. Health & Status, 2. Products, 3. Orders, 4. Enquiries, 🧵 Aanur Textile — Modern MERN E-Commerce Platform, 🌟 About The Project, 🔌 API Documentation, 🏗️ Architecture & Tech Stack (+19 more)

### Community 9 - "automations.ts"
Cohesion: 0.11
Nodes (22): BRANCHING_STEP_TYPES, BranchingStep, hasBranches(), LinearStep, sdkResponseToWorkflow(), WorkflowDefinition, WorkflowStep, workflowToSdkOptions() (+14 more)

### Community 10 - "Learner Profile"
Cohesion: 0.22
Nodes (8): Developing Concepts, Experience, Goals, Learner Profile, Preferences, Project, Revisit, Strong Concepts

### Community 11 - "webhooks.ts"
Cohesion: 0.09
Nodes (22): addWebhookTools(), asSdkWebhookEvents(), CREATE_WEBHOOK_TOOL, GET_WEBHOOK_EVENT_TOOL, GET_WEBHOOK_TOOL, LIST_WEBHOOK_EVENT_ATTEMPTS_TOOL, LIST_WEBHOOK_EVENTS_TOOL, LIST_WEBHOOKS_TOOL (+14 more)

### Community 12 - "http.ts"
Cohesion: 0.15
Nodes (11): @modelcontextprotocol/client, @modelcontextprotocol/express, @modelcontextprotocol/node, extractBearerToken(), extractBearerTokenFromWebRequest(), HttpTransportOptions, runHttp(), sendJsonRpcError() (+3 more)

### Community 13 - "suppressions.test.ts"
Cohesion: 0.12
Nodes (17): ADD_SUPPRESSION_TOOL, addSuppressionTools(), BATCH_ADD_SUPPRESSIONS_TOOL, BATCH_REMOVE_SUPPRESSIONS_TOOL, formatSuppression(), GET_SUPPRESSION_TOOL, LIST_SUPPRESSIONS_TOOL, REMOVE_SUPPRESSION_TOOL (+9 more)

### Community 14 - "Project Map"
Cohesion: 0.25
Nodes (7): Build and Deployment, Components, Data and Trust Boundaries, Main Flow, Project Map, Purpose, Requirements

### Community 15 - "Stdio Transport (Default)"
Cohesion: 0.06
Nodes (33): Authenticating with an API key, Claude, Claude Code, Claude Code, Claude Code, Claude Desktop, Codex, Codex (+25 more)

### Community 16 - "ref_resend"
Cohesion: 0.16
Nodes (11): zod, CREATE_API_KEY_TOOL, LIST_API_KEYS_TOOL, REMOVE_API_KEY_TOOL, UPDATE_API_KEY_TOOL, addEventTools(), MANAGE_EVENTS_TOOL, SEND_EVENT_TOOL (+3 more)

### Community 17 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, declaration, esModuleInterop, forceConsistentCasingInFileNames, jsx, module, moduleResolution, outDir (+7 more)

### Community 18 - "segments.test.ts"
Cohesion: 0.14
Nodes (13): addSegmentTools(), CREATE_SEGMENT_TOOL, GET_SEGMENT_TOOL, LIST_SEGMENTS_TOOL, REMOVE_SEGMENT_TOOL, UPDATE_SEGMENT_TOOL, create, get (+5 more)

### Community 19 - "domains.ts"
Cohesion: 0.18
Nodes (12): addDomainTools(), CREATE_DOMAIN_CLAIM_TOOL, CREATE_DOMAIN_TOOL, formatClaimRecord(), formatDnsRecords(), GET_DOMAIN_CLAIM_TOOL, GET_DOMAIN_TOOL, LIST_DOMAINS_TOOL (+4 more)

### Community 20 - "@modelcontextprotocol/server"
Cohesion: 0.21
Nodes (9): @modelcontextprotocol/server, addOAuthGrantTools(), LIST_OAUTH_GRANTS_TOOL, REVOKE_OAUTH_GRANT_TOOL, grant, list, makeClient(), resend (+1 more)

### Community 21 - "contacts.ts"
Cohesion: 0.17
Nodes (11): ADD_CONTACT_TO_SEGMENT_TOOL, addContactTools(), CREATE_CONTACT_TOOL, GET_CONTACT_TOOL, LIST_CONTACT_SEGMENTS_TOOL, LIST_CONTACT_TOPICS_TOOL, LIST_CONTACTS_TOOL, REMOVE_CONTACT_FROM_SEGMENT_TOOL (+3 more)

### Community 22 - "[1.1.0] - 2025-07-08"
Cohesion: 0.18
Nodes (10): [1.0.0] - 2025-02-24, [1.1.0] - 2025-07-08, Added, Added, Added, Changed, Changed, Changelog (+2 more)

### Community 23 - "apiKeys.test.ts"
Cohesion: 0.25
Nodes (7): addApiKeyTools(), create, list, makeClient(), remove, resend, update

### Community 24 - "usage.test.ts"
Cohesion: 0.31
Nodes (6): addUsageTools(), formatQuota(), GET_USAGE_TOOL, get, makeClient(), resend

### Community 25 - "contactProperties.ts"
Cohesion: 0.29
Nodes (6): addContactPropertyTools(), CREATE_CONTACT_PROPERTY_TOOL, GET_CONTACT_PROPERTY_TOOL, LIST_CONTACT_PROPERTIES_TOOL, REMOVE_CONTACT_PROPERTY_TOOL, UPDATE_CONTACT_PROPERTY_TOOL

### Community 26 - "topics.ts"
Cohesion: 0.29
Nodes (6): addTopicTools(), CREATE_TOPIC_TOOL, GET_TOPIC_TOOL, LIST_TOPICS_TOOL, REMOVE_TOPIC_TOOL, UPDATE_TOPIC_TOOL

### Community 27 - "resend"
Cohesion: 0.50
Nodes (4): RESEND_API_KEY, node, resend, resend-dev

### Community 37 - "analyze-images.py"
Cohesion: 0.48
Nodes (3): analyze(), closest_name(), main()

### Community 39 - "email.md"
Cohesion: 0.50
Nodes (3): bcc: manager@example.com, cc: colleague1@example.com, colleague2@example.com, Example of using CC and BCC:

### Community 43 - "renovate.json"
Cohesion: 0.50
Nodes (3): config:recommended, extends, $schema

### Community 51 - "app.js"
Cohesion: 0.09
Nodes (27): mongoose, checkMongo(), seedMongo(), run(), sampleOrder, handleApiRequest(), app, connectMongoDB() (+19 more)

## Knowledge Gaps
- **390 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+385 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 444 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@modelcontextprotocol/server` connect `@modelcontextprotocol/server` to `resend-mcp/package.json`, `server.ts`, `emails.ts`, `broadcasts.ts`, `automations.ts`, `webhooks.ts`, `http.ts`, `suppressions.test.ts`, `ref_resend`, `segments.test.ts`, `domains.ts`, `contacts.ts`, `apiKeys.test.ts`, `usage.test.ts`, `contactProperties.ts`, `topics.ts`?**
  _High betweenness centrality (0.088) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _390 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `resend-mcp/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.04081632653061224 - nodes in this community are weakly interconnected._
- **Why does `vitest` connect `vitest` to `resend-mcp/package.json`, `server.ts`, `emails.ts`, `broadcasts.ts`, `automations.ts`, `webhooks.ts`, `http.ts`, `suppressions.test.ts`, `segments.test.ts`, `@modelcontextprotocol/server`, `apiKeys.test.ts`, `usage.test.ts`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Should `server.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05649717514124294 - nodes in this community are weakly interconnected._
- **Why does `mongoose` connect `app.js` to `package.json`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Should `emails.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05505279034690799 - nodes in this community are weakly interconnected._