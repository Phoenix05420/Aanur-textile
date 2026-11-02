# Graph Report - New folder (2)  (2026-11-02)

## Corpus Check
- 150 files · ~653,582 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1178 nodes · 1366 edges · 88 communities (77 shown, 11 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 19 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `53ea8f85`
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
- [[_COMMUNITY_Community 66|Community 66]]
- [[_COMMUNITY_Community 68|Community 68]]
- [[_COMMUNITY_Community 69|Community 69]]
- [[_COMMUNITY_Community 70|Community 70]]
- [[_COMMUNITY_Community 71|Community 71]]
- [[_COMMUNITY_Community 73|Community 73]]
- [[_COMMUNITY_Community 74|Community 74]]
- [[_COMMUNITY_Community 75|Community 75]]
- [[_COMMUNITY_Community 76|Community 76]]
- [[_COMMUNITY_Community 77|Community 77]]
- [[_COMMUNITY_Community 78|Community 78]]
- [[_COMMUNITY_Community 79|Community 79]]
- [[_COMMUNITY_Community 80|Community 80]]
- [[_COMMUNITY_Community 81|Community 81]]
- [[_COMMUNITY_Community 82|Community 82]]
- [[_COMMUNITY_Community 83|Community 83]]
- [[_COMMUNITY_Community 84|Community 84]]
- [[_COMMUNITY_Community 85|Community 85]]
- [[_COMMUNITY_Community 86|Community 86]]
- [[_COMMUNITY_Community 87|Community 87]]
- [[_COMMUNITY_Community 88|Community 88]]
- [[_COMMUNITY_Community 90|Community 90]]
- [[_COMMUNITY_Community 91|Community 91]]

## God Nodes (most connected - your core abstractions)
1. `createMcpServer()` - 22 edges
2. `ResendEditorClient` - 16 edges
3. `dependencies` - 14 edges
4. `scripts` - 13 edges
5. `compilerOptions` - 13 edges
6. `suspicious` - 11 edges
7. `Stdio Transport (Default)` - 11 edges
8. `Client-Side and Browser Hunting` - 10 edges
9. `Cloud and Deployment Hunting` - 10 edges
10. `Desktop, Mobile, and Local IPC Hunting` - 10 edges

## Surprising Connections (you probably didn't know these)
- `parseArgs()` --calls--> `minimist`  [INFERRED]
  resend-mcp/src/cli/parse.ts → resend-mcp/package.json
- `createMcpServer()` --calls--> `addContactPropertyTools()`  [INFERRED]
  resend-mcp/src/server.ts → resend-mcp/src/tools/contactProperties.ts
- `createMcpServer()` --calls--> `addDomainTools()`  [INFERRED]
  resend-mcp/src/server.ts → resend-mcp/src/tools/domains.ts
- `createMcpServer()` --calls--> `addTopicTools()`  [INFERRED]
  resend-mcp/src/server.ts → resend-mcp/src/tools/topics.ts
- `checkMongo()` --calls--> `connectMongoDB()`  [EXTRACTED]
  scripts/check-mongo.js → server/db.js

## Communities (88 total, 11 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (17): initDatabase(), sql, AdminPage(), money(), API_BASE, apiUrl(), CartPage(), Checkout() (+9 more)

### Community 1 - "Community 1"
Cohesion: 0.05
Nodes (43): bin, resend-mcp, default, dependencies, dotenv, express, minimist, @modelcontextprotocol/express (+35 more)

### Community 2 - "Community 2"
Cohesion: 0.1
Nodes (28): CLI_STRING_OPTIONS, HELP_TEXT, printHelp(), stderr, getUnknownArgs(), KNOWN_ARG_KEYS, resolveConfigOrExit(), parseAllowedFileDirs() (+20 more)

### Community 3 - "Community 3"
Cohesion: 0.07
Nodes (32): allowedDashboardHosts(), DEFAULT_DASHBOARD_HOSTS, extractIdFromUrl(), SUPPORTED_RESOURCES, BranchingStep, hasBranches(), LinearStep, sdkResponseToWorkflow() (+24 more)

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
Nodes (34): dependencies, axios, cors, dotenv, express, gsap, @gsap/react, mongoose (+26 more)

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
Nodes (33): Claude Code, Claude Code, Claude Desktop, code:bash (npx add-mcp resend-mcp --name resend --env "RESEND_API_KEY=r), code:bash (claude mcp add resend -e RESEND_API_KEY=re_xxxxxxxxx -- npx ), code:bash (codex mcp add resend \), code:json ({), code:json ({) (+25 more)

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
Cohesion: 0.05
Nodes (38): Authenticating with an API key, Claude, Claude Code, code:block1 (https://mcp.resend.com/mcp), code:json ({), code:bash (claude mcp add --transport http resend https://mcp.resend.co), code:block27 (git clone https://github.com/resend/resend-mcp.git), code:bash (claude mcp add resend -e RESEND_API_KEY=re_xxxxxxxxx -- node) (+30 more)

### Community 29 - "Community 29"
Cohesion: 0.14
Nodes (12): 1. Rebuilding & Updating the Knowledge Graph, 2. Opening Visual Dashboards, 3. Querying Architecture with Graph Traversal, Aanur Textile Project Architecture Map, code:mermaid (graph TB), code:powershell (# Via Graphify CLI directly:), code:powershell (# Open interactive 2D graph in default browser:), code:powershell (# Answer architectural questions with BFS:) (+4 more)

### Community 30 - "Community 30"
Cohesion: 0.17
Nodes (10): 1. Executive Summary, 2. End-to-End System Architecture, 3. Order Processing Sequence, 4. Key Performance Metrics, 4. Security & Configuration Matrix, 5. Performance Metrics, 6. Graph Artifacts Navigation, 🔍 Aanur Textile — Architecture & System Audit Report (+2 more)

### Community 31 - "Community 31"
Cohesion: 0.11
Nodes (18): Anti-patterns, Core principles, Cost budget, Coverage and prior runs, Full audit planning, Full audit setup, Full audit workflow, Operating modes (+10 more)

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
Cohesion: 0.04
Nodes (47): adminEmail, allowedOrigins, autoVerifyAt, autoVerifyTimer, candidateBuffer, cleanEmail, cleanOtp, computedTotal (+39 more)

### Community 52 - "Community 52"
Cohesion: 0.2
Nodes (10): code:bash (node -v), code:bash (git clone https://github.com/Phoenix05420/Aanur-textile.git), code:bash (cp .env.example .env), code:ini (# ==========================================================), code:bash (# 1. Check MongoDB Atlas connection & collection status), ⚙️ Installation & Local Setup, Step 1: Verify Prerequisites, Step 2: Clone Repository & Enter Directory (+2 more)

### Community 53 - "Community 53"
Cohesion: 0.29
Nodes (4): getSql(), handleApiRequest(), isConfigured(), app

### Community 54 - "Community 54"
Cohesion: 0.27
Nodes (3): ServerOptions, HttpTransportOptions, sessions

### Community 55 - "Community 55"
Cohesion: 0.3
Nodes (13): run(), sampleOrder, escapeHtml(), getGmailTransporter(), getResendClient(), isEmailConfigured(), isGmailConfigured(), isResendConfigured() (+5 more)

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
Cohesion: 0.22
Nodes (5): connect(), send, runHttp(), { port }, server

### Community 61 - "Community 61"
Cohesion: 0.12
Nodes (15): code:text (## Defensive vulnerability-finding method), code:text (Artifact promotion procedure (trusted parent-side code only)), code:text (## Candidate gate), code:json ({), code:json ({), Core hunting method — include in every hunter prompt, Core validation rules — include in every hunter prompt, Coverage-critic waves (+7 more)

### Community 62 - "Community 62"
Cohesion: 0.25
Nodes (7): 🧵 Aanur Textile — Enterprise Full-Stack Textile & Fabric Commerce Platform, 🗺️ API Architecture & Endpoints, code:mermaid (flowchart TD), Comprehensive Stack Specification, System Architecture Diagram, 📑 Table of Contents, 🛠️ Tech Stack & Architecture

### Community 63 - "Community 63"
Cohesion: 0.25
Nodes (8): ⚙️ Administrative Dashboard & Architecture Telemetry, 🤖 AI-Ready Tooling & Architecture Graph, 🧵 Catalog & Fabric Variant Filtering, 🚀 Key Features, 📦 Order Management & Logistics Pipeline, 🛒 Shopping Bag & Dynamic Coupon Engine, 📨 Transactional Notifications & Communication, 🔐 User Authentication & Account Management

### Community 64 - "Community 64"
Cohesion: 0.29
Nodes (6): __dirname, distDir, __filename, indexPath, publicDir, rootDir

### Community 66 - "Community 66"
Cohesion: 0.33
Nodes (6): code:bash (# Compile optimized React assets to /dist), code:bash (npm run dev), Option A: Unified Vite Dev Server (Recommended), Option B: Standalone Production Server, Option C: Windows One-Click Quick Launch, Step 6: Launch the Development Server

### Community 68 - "Community 68"
Cohesion: 0.2
Nodes (7): config, parsed, resend, serverOptions, runStdio(), { mockServeStdio }, resend

### Community 69 - "Community 69"
Cohesion: 0.4
Nodes (5): Core Problems Solved, 🎯 Project Overview & Value Proposition, The Context, What is Aanur Textile?, Who It Serves

### Community 70 - "Community 70"
Cohesion: 0.15
Nodes (12): Candidate-verifier prompt, code:text (You did not write this candidate. Try to refute it from repo), code:text (Artifact promotion procedure (trusted parent-side code only)), code:sh (node <skill-dir>/validate-findings.cjs <output-dir>/findings), `FINDINGS-DETAIL.md`, `NEEDS-VALIDATION.md`, Phase 3: Independently validate every candidate, Phase 4: Write and validate `findings.json` (+4 more)

### Community 71 - "Community 71"
Cohesion: 0.22
Nodes (8): build, buildCommand, builder, deploy, restartPolicyMaxRetries, restartPolicyType, startCommand, $schema

### Community 73 - "Community 73"
Cohesion: 0.17
Nodes (11): Cloud and Deployment Hunting, code:block1 (- Do not infer a live exposure from a manifest alone. Establ), Configuration and secret lifecycle attack classes (subagent_type: `general`), Container and orchestration attack classes (subagent_type: `general`), Core discipline (include in every agent prompt for this domain), Ingress, network, and control-plane attack classes (subagent_type: `general`), Managed storage, events, and edge attack classes (subagent_type: `general`), Universal moves (apply across the above) (+3 more)

### Community 74 - "Community 74"
Cohesion: 0.33
Nodes (5): buildCommand, cleanUrls, framework, outputDirectory, rewrites

### Community 75 - "Community 75"
Cohesion: 0.4
Nodes (5): addTemplateTools(), create, makeClient(), resend, update

### Community 76 - "Community 76"
Cohesion: 0.17
Nodes (11): Application-state and device-lifecycle attack classes (subagent_type: `general`), code:block1 (- Establish the realistic local or remote-content attacker: ), Core discipline (include in every agent prompt for this domain), Deep-link, callback, and navigation attack classes (subagent_type: `general`), Desktop, Mobile, and Local IPC Hunting, Local IPC and exported-component attack classes (subagent_type: `general`), Privileged-helper and local-file attack classes (subagent_type: `general`), Universal moves (apply across the above) (+3 more)

### Community 77 - "Community 77"
Cohesion: 0.17
Nodes (11): Binary loading and runtime attack classes (subagent_type: `general`), Bounds, integer, and representation attack classes (subagent_type: `general`), code:block1 (- Re-derive every bound and lifetime from attacker-controlle), Core discipline (include in every agent prompt for this domain), FFI and ABI attack classes (subagent_type: `general`), Kernel and privileged-interface attack classes (subagent_type: `general`), Lifetime, type, and concurrency attack classes (subagent_type: `general`), Memory Safety, Binary, and Kernel Hunting (+3 more)

### Community 78 - "Community 78"
Cohesion: 0.17
Nodes (11): API-key and mTLS attack classes (subagent_type: `general`), Browser-session attack classes (subagent_type: `general`), code:block1 (- Framing and cache findings require two interpretations of ), Core discipline (include in every agent prompt for this domain), Federated-identity attack classes (subagent_type: `general`), HTTP framing and cache attack classes (subagent_type: `general`), HTTP-Protocol and Authentication Hunting, MFA, passkey, and account-transition attack classes (subagent_type: `general`) (+3 more)

### Community 79 - "Community 79"
Cohesion: 0.17
Nodes (11): Client-Side and Browser Hunting, code:block1 (- A client-side candidate needs a controllable source and an), Core discipline (include in every agent prompt for this domain), Cross-origin messaging and network attack classes (subagent_type: `general`), Cross-site information leak classes (subagent_type: `general`), DOM and object-state attack classes (subagent_type: `general`), Service-worker and browser-storage attack classes (subagent_type: `general`), UI-redress and navigation attack classes (subagent_type: `general`) (+3 more)

### Community 80 - "Community 80"
Cohesion: 0.18
Nodes (10): AI, LLM, and Agent Hunting, code:block1 (- Prompt injection alone is not a finding. Require a code-le), Context, retrieval, and memory attack classes (subagent_type: `general`), Core discipline (include in every agent prompt for this domain), MCP and sub-agent trust classes (subagent_type: `general`), Output and disclosure attack classes (subagent_type: `general`), Tool and action attack classes (subagent_type: `general`), Universal moves (apply across the above) (+2 more)

### Community 81 - "Community 81"
Cohesion: 0.18
Nodes (10): code:block1 (- A tenant or owner field on a record is not isolation. Find), Core discipline (include in every agent prompt for this domain), Data Isolation and Lifecycle Hunting, Deletion, revocation, and lifecycle attack classes (subagent_type: `general`), Derived-data and disclosure attack classes (subagent_type: `general`), Export, backup, restore, and migration attack classes (subagent_type: `general`), Tenant and object-isolation attack classes (subagent_type: `general`), Universal moves (apply across the above) (+2 more)

### Community 82 - "Community 82"
Cohesion: 0.18
Nodes (10): Broker and queue isolation attack classes (subagent_type: `general`), code:block1 (- "Internal" is not authentication. Name the peer identity a), Core discipline (include in every agent prompt for this domain), Framing, schema, and interpretation attack classes (subagent_type: `general`), Protocols, RPC, and Messaging Hunting, Replay, ordering, and transaction attack classes (subagent_type: `general`), RPC identity and authorization attack classes (subagent_type: `general`), Universal moves (apply across the above) (+2 more)

### Community 83 - "Community 83"
Cohesion: 0.18
Nodes (10): code:block1 (- Require an input-to-cost path, a missing effective bound, ), Computational amplification attack classes (subagent_type: `general`), Core discipline (include in every agent prompt for this domain), Failure and recovery attack classes (subagent_type: `general`), Quota and scheduling attack classes (subagent_type: `general`), Resource accumulation attack classes (subagent_type: `general`), Resource Exhaustion and Availability Hunting, Universal moves (apply across the above) (+2 more)

### Community 84 - "Community 84"
Cohesion: 0.18
Nodes (10): Architecture summary and companion selection, code:text (Read the target at <target>. Do not use network access. Retu), code:text (Read all source that establishes identity, authorization, is), code:text (Inventory every source-visible place external or lower-trust), code:text (Read tests, build definitions, manifests, packaging, and mai), code:json ({), Deterministic coverage ledger, Phase 1: Map the source and plan coverage (+2 more)

### Community 85 - "Community 85"
Cohesion: 0.2
Nodes (9): CI and automation attack classes (subagent_type: `general`), code:block1 (- A mutable or known-vulnerable dependency is not a finding ), Core discipline (include in every agent prompt for this domain), Dependency and build-input attack classes (subagent_type: `general`), Release and update attack classes (subagent_type: `general`), Supply Chain and Release Hunting, Universal moves (apply across the above), Validation rules (apply before reporting ANY finding here) (+1 more)

### Community 86 - "Community 86"
Cohesion: 0.25
Nodes (7): computedHash, skillPath, source, sourceType, skills, security-audit, version

### Community 87 - "Community 87"
Cohesion: 0.47
Nodes (4): $comment, items, oneOf, type

### Community 90 - "Community 90"
Cohesion: 0.4
Nodes (5): checkRateLimit(), generateAuthToken(), now, requireAdmin(), verifyAuthToken()

### Community 91 - "Community 91"
Cohesion: 0.67
Nodes (3): code:bash (npm install), code:bash (cd resend-mcp && npm install && npm run build && cd ..), Step 3: Install Node Dependencies

## Knowledge Gaps
- **679 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+674 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createMcpServer()` connect `Community 8` to `Community 33`, `Community 3`, `Community 68`, `Community 5`, `Community 6`, `Community 9`, `Community 75`, `Community 12`, `Community 13`, `Community 16`, `Community 19`, `Community 20`, `Community 21`, `Community 54`, `Community 26`, `Community 59`?**
  _High betweenness centrality (0.118) - this node is a cross-community bridge._
- **Why does `addSuppressionTools()` connect `Community 9` to `Community 8`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Why does `addWebhookTools()` connect `Community 6` to `Community 8`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Are the 18 inferred relationships involving `createMcpServer()` (e.g. with `addEditorTools()` and `addApiKeyTools()`) actually correct?**
  _`createMcpServer()` has 18 INFERRED edges - model-reasoned connections that need verification._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _679 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._