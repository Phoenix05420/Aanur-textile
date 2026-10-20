# Project Map

## Purpose
Aanur Textile — Modern e-commerce web application for textiles and fabrics featuring animated UI, MongoDB Atlas cloud storage (MERN Stack), and Resend transactional emails.

## Requirements
- Product catalog browsing, category filtering, cart management, secret coupons, and checkout.
- Order submission storing customer and item records into MongoDB Atlas.
- Order confirmation emails dispatched via Resend API.
- Embedded Model Context Protocol (MCP) tooling for Resend management.

## Components
- Frontend SPA: React 19 + Vite (`src/App.jsx`, `src/main.jsx`, `src/styles.css`, GSAP animations).
- Server & API handlers: Express API routes for products/orders/enquiries (`server/app.js`, `server/api.js`).
- Database Layer: MongoDB Atlas with Mongoose ODM models (`server/db.js`, `server/models/`).
- Email Notification Engine: Resend SDK client and order templates (`server/email.js`).
- Embedded Tooling: MCP server (`resend-mcp/`).
- Database seed & checks: Node scripts (`scripts/seed-mongo.js`, `scripts/check-mongo.js`).

## Main Flow
User (Browser) ──[Browse/Cart]──> React App (Vite)
        │
   [Place Order]
        ▼
   Server API (server/app.js)
    ├─── [Save Order] ─────────> MongoDB Atlas (Mongoose Order Model)
    └─── [Send Confirmation] ──> Resend Email API (server/email.js)

## Data and Trust Boundaries
- Storage: MongoDB Atlas Cloud (`MONGODB_URI`).
- Email Provider: Resend API (`RESEND_API_KEY`).
- Secrets: `.env` file (MongoDB URI, Resend API key).

## Build and Deployment
- Dev: `npm run dev` (Vite on 0.0.0.0)
- Build: `npm run build`
- DB init: `npm run db:init`
- Scripts: `start.bat`
