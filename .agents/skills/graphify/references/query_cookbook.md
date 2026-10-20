# Aanur Textile — Graphify Query Cookbook

This cookbook lists practical, high-impact queries to run against `graphify-out/graph.json` to understand connections, debug data paths, and trace code dependencies across Aanur Textile.

---

## 1. High-Value Architecture Queries

```powershell
# Trace end-to-end checkout flow
graphify query "How does an order flow from Checkout to MongoDB Atlas and Resend?"

# Check database query sites
graphify query "Which files connect to MongoDB Atlas and query Mongoose models?"

# Check fallback logic
graphify query "Where is src/data.js imported and used as a fallback?"

# Trace transactional email integration
graphify query "Where is sendOrderEmail called and what arguments does it require?"
```

---

## 2. Shortest Path Traversals (`graphify path`)

Find the direct chain of dependencies or calls between components and backend functions:

```powershell
# Find how checkout triggers email
graphify path "Checkout" "sendOrderEmail"

# Find how server routes connect to MongoDB models
graphify path "handleApiRequest" "Product"

# Find how test script reaches Resend
graphify path "run" "sendOrderEmail"
```

---

## 3. Symbol Explanations (`graphify explain`)

Get immediate context on key symbols and their neighbors:

```powershell
# API request dispatcher
graphify explain "handleApiRequest"

# Order email sender
graphify explain "sendOrderEmail"

# MongoDB connection manager
graphify explain "connectMongoDB"

# Resend configuration checker
graphify explain "isResendConfigured"
```

---

## 4. Graph Updating

After any modification to code files:
```powershell
graphify update .
```
