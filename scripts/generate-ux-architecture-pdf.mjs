import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Aanur Textile — Enterprise UX Architecture & User Flow Specification</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 10mm 12mm 12mm 12mm;
      @bottom-right {
        content: "Page " counter(page) " of 20";
        font-family: Arial, Helvetica, sans-serif;
        font-size: 7.5pt;
        color: #64748b;
      }
      @bottom-left {
        content: "Aanur Textile - Enterprise UX Architecture & System Specification (Confidential)";
        font-family: Arial, Helvetica, sans-serif;
        font-size: 7.5pt;
        color: #64748b;
      }
    }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      font-variant-ligatures: none !important;
      text-rendering: geometricPrecision !important;
    }

    body {
      font-family: Arial, Helvetica, sans-serif;
      color: #0f172a;
      background: #ffffff;
      line-height: 1.4;
      font-size: 8.2pt;
      margin: 0;
      padding: 0;
    }

    .page-sheet {
      page-break-after: always;
      break-after: page;
      height: 248mm;
      max-height: 248mm;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      padding: 0;
    }

    .page-sheet:last-of-type,
    .page-sheet:last-child {
      page-break-after: avoid !important;
      break-after: avoid !important;
    }

    /* COVER PAGE */
    .cover-container {
      height: 265mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 20px 8px 10px 8px;
    }

    .cover-badge {
      display: inline-block;
      background: #fef3c7;
      color: #92400e;
      padding: 4px 10px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 8pt;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      border: 1px solid #fde68a;
      margin-bottom: 8px;
    }

    .cover-title {
      font-size: 26pt;
      font-weight: 800;
      line-height: 1.15;
      color: #0f172a;
      margin: 10px 0 8px 0;
      letter-spacing: -0.5px;
    }

    .cover-subtitle {
      font-size: 11pt;
      color: #475569;
      line-height: 1.4;
      max-width: 680px;
      margin-bottom: 16px;
    }

    .cover-meta-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 12px 16px;
      margin-top: 15px;
    }

    .meta-item {
      display: flex;
      flex-direction: column;
    }

    .meta-label {
      font-size: 6.8pt;
      text-transform: uppercase;
      font-weight: 700;
      color: #64748b;
      letter-spacing: 0.5px;
    }

    .meta-value {
      font-size: 8.8pt;
      font-weight: 600;
      color: #1e293b;
      margin-top: 1px;
    }

    .cover-footer {
      border-top: 1px solid #e2e8f0;
      padding-top: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 7.5pt;
      color: #64748b;
    }

    /* HEADINGS */
    h1 {
      font-size: 13pt;
      font-weight: 800;
      color: #0f172a;
      border-bottom: 2px solid #ea580c;
      padding-bottom: 3px;
      margin: 0 0 6px 0;
      display: flex;
      align-items: center;
      gap: 5px;
    }

    h2 {
      font-size: 9.5pt;
      font-weight: 700;
      margin: 6px 0 3px 0;
      color: #1e293b;
      border-left: 3px solid #ea580c;
      padding-left: 5px;
    }

    h3 {
      font-size: 8.8pt;
      font-weight: 700;
      margin: 5px 0 2px 0;
      color: #334155;
    }

    p {
      margin: 0 0 5px 0;
      text-align: left;
      line-height: 1.4;
    }

    ul, ol {
      margin: 2px 0 5px 14px;
      padding: 0;
    }

    li {
      margin-bottom: 2px;
    }

    /* CALLOUT BOXES */
    .callout {
      border-radius: 5px;
      padding: 5px 8px;
      margin: 4px 0;
      font-size: 7.5pt;
      line-height: 1.35;
    }

    .callout-info {
      background: #f0f9ff;
      border-left: 3.5px solid #0284c7;
      color: #0369a1;
    }

    .callout-success {
      background: #f0fdf4;
      border-left: 3.5px solid #16a34a;
      color: #15803d;
    }

    .callout-warning {
      background: #fffbeb;
      border-left: 3.5px solid #d97706;
      color: #b45309;
    }

    .callout-danger {
      background: #fef2f2;
      border-left: 3.5px solid #dc2626;
      color: #b91c1c;
    }

    /* TABLES */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 4px 0 6px 0;
      font-size: 7.4pt;
    }

    th {
      background-color: #f1f5f9;
      font-weight: 700;
      color: #1e293b;
      border: 1px solid #cbd5e1;
      padding: 3px 5px;
      text-align: left;
      text-transform: uppercase;
      font-size: 6.6pt;
      letter-spacing: 0.2px;
    }

    td {
      border: 1px solid #e2e8f0;
      padding: 3px 5px;
      text-align: left;
      vertical-align: middle;
      color: #334155;
      line-height: 1.3;
    }

    tr:nth-child(even) td {
      background-color: #f8fafc;
    }

    /* BADGES & CODE */
    code {
      font-family: Consolas, 'Courier New', monospace;
      font-size: 6.8pt;
      background: #f1f5f9;
      padding: 1px 3px;
      border-radius: 2px;
      color: #c2410c;
      white-space: nowrap;
    }

    .tag {
      display: inline-block;
      padding: 1px 4px;
      border-radius: 2px;
      font-size: 6.2pt;
      font-weight: 700;
      text-transform: uppercase;
      white-space: nowrap;
    }

    .tag-green { background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; }
    .tag-red { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }
    .tag-orange { background: #ffedd5; color: #c2410c; border: 1px solid #fed7aa; }
    .tag-blue { background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; }
    .tag-slate { background: #f1f5f9; color: #334155; border: 1px solid #e2e8f0; }

    /* DIAGRAM BOX */
    .diagram-card {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 5px;
      padding: 6px 8px;
      margin: 4px 0 6px 0;
      box-shadow: 0 1px 2px rgba(0,0,0,0.02);
      overflow: hidden;
    }

    .diagram-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 3px;
      margin-bottom: 4px;
    }

    .diagram-title {
      font-size: 8pt;
      font-weight: 700;
      color: #1e293b;
    }

    .diagram-badge {
      font-size: 6.5pt;
      font-weight: 700;
      color: #64748b;
      background: #f1f5f9;
      padding: 1px 4px;
      border-radius: 2px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .mermaid {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      padding: 2px 0;
      overflow: hidden;
    }

    .mermaid svg {
      width: 100% !important;
      max-width: 680px !important;
      max-height: 110mm !important;
      height: auto !important;
      object-fit: contain;
    }

    /* PERSONA CARD */
    .persona-card {
      border: 1px solid #e2e8f0;
      border-radius: 5px;
      padding: 6px 8px;
      margin-bottom: 5px;
      background: #ffffff;
    }

    .persona-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 2px;
      margin-bottom: 4px;
    }

    .persona-name {
      font-size: 8.5pt;
      font-weight: 700;
      color: #0f172a;
    }

    .persona-role {
      font-size: 7pt;
      color: #ea580c;
      font-weight: 600;
    }

    .persona-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px;
      font-size: 7.4pt;
    }

    /* TOC */
    .toc-item {
      display: flex;
      justify-content: space-between;
      padding: 2.2px 0;
      border-bottom: 1px dotted #cbd5e1;
      font-size: 7.8pt;
    }
    .toc-number {
      font-weight: 700;
      color: #ea580c;
      margin-right: 5px;
    }
  </style>
  <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
  <script>
    window.onload = () => {
      mermaid.initialize({
        startOnLoad: true,
        theme: 'neutral',
        fontFamily: 'Arial, Helvetica, sans-serif',
        themeVariables: {
          fontSize: '11px',
          primaryColor: '#f8fafc',
          primaryTextColor: '#0f172a',
          primaryBorderColor: '#cbd5e1',
          lineColor: '#475569',
          secondaryColor: '#f1f5f9',
          tertiaryColor: '#ffffff',
          clusterBkg: '#f8fafc',
          clusterBorder: '#cbd5e1'
        },
        flowchart: {
          curve: 'basis',
          nodeSpacing: 14,
          rankSpacing: 16,
          htmlLabels: true
        },
        sequence: {
          useMaxWidth: true,
          boxMargin: 3
        }
      });
    };
  </script>
</head>
<body>

  <!-- PAGE 1: COVER -->
  <div class="page-sheet cover-container">
    <div>
      <div class="cover-badge">Executive Architecture Deliverable</div>
      <div class="cover-title">Enterprise UX Architecture & User Flow Specification</div>
      <div class="cover-subtitle">
        Comprehensive Information Architecture, Multi-Role User Journeys, System Interaction Models, and State Transition Specifications for Aanur Textile Digital Commerce Platform.
      </div>

      <div class="callout callout-info" style="margin-top: 15px;">
        <strong>System Context:</strong> Aanur Textile (Founded 2013 by Velusamy R, Nathakadaiyur, Kangayam, Tiruppur) - Factory-direct pure combed cotton bedding & master-woven fabrics bridging traditional handloom/shuttleless artisans directly with B2C consumers and B2B institutional buyers across India.
      </div>

      <div class="cover-meta-grid">
        <div class="meta-item">
          <span class="meta-label">Author & UX Architect</span>
          <span class="meta-value">Senior UX & Enterprise Systems Architect</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Client / Platform</span>
          <span class="meta-value">Aanur Textile (Pvt. Ltd.)</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Production Runtime</span>
          <span class="meta-value">React 19.1 - Node 24 / Express 4 - MongoDB Atlas - Resend</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Document Version & Date</span>
          <span class="meta-value">v1.3.0 (Pixel-Perfect Final Edition) - November 2026</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Target Channels</span>
          <span class="meta-value">Responsive Web (Mobile First), Workshop Administration, B2B</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Compliance & SLAs</span>
          <span class="meta-value">7-14 Day Delivery SLA - HMAC Session Security - Dual Resend Deliverability</span>
        </div>
      </div>
    </div>

    <div class="cover-footer">
      <span>(c) 2026 Aanur Textile. All rights reserved. Strictly Confidential.</span>
      <span>Document Ref: AT-UXA-2026-M1</span>
    </div>
  </div>

  <!-- PAGE 2: TOC & EXECUTIVE SUMMARY -->
  <div class="page-sheet">
    <h1>Table of Contents & Executive Summary</h1>
    
    <div style="margin-top: 2px; margin-bottom: 6px;">
      <div class="toc-item"><span><span class="toc-number">1.0</span> Executive Project Understanding & Business Scope</span><span>Page 3</span></div>
      <div class="toc-item"><span><span class="toc-number">2.0</span> Architectural Assumptions & Stakeholder Clarifications</span><span>Page 4</span></div>
      <div class="toc-item"><span><span class="toc-number">3.0</span> User Personas, Target Roles & Mental Models</span><span>Page 5</span></div>
      <div class="toc-item"><span><span class="toc-number">4.0</span> Complete Information Architecture (IA) & Navigation Architecture</span><span>Page 6</span></div>
      <div class="toc-item"><span><span class="toc-number">5.0</span> User Permissions Matrix (RBAC Boundaries) & Feature Priority</span><span>Page 7</span></div>
      <div class="toc-item"><span><span class="toc-number">6.0</span> Comprehensive Screen Inventory (SCR-01 to SCR-09)</span><span>Page 8</span></div>
      <div class="toc-item"><span><span class="toc-number">6.1</span> Comprehensive Screen Inventory (SCR-10 to SCR-18)</span><span>Page 9</span></div>
      <div class="toc-item"><span><span class="toc-number">7.0</span> End-to-End Multi-Role User Journeys</span><span>Page 10</span></div>
      <div class="toc-item"><span><span class="toc-number">8.0</span> High-Level System Architecture & Application Flow (Mermaid)</span><span>Page 11</span></div>
      <div class="toc-item"><span><span class="toc-number">9.0</span> Feature-Level User Flows: Catalog, Swatches & Quick View</span><span>Page 12</span></div>
      <div class="toc-item"><span><span class="toc-number">10.0</span> Feature-Level User Flows: Shopping Bag & Secret Coupon Engine</span><span>Page 13</span></div>
      <div class="toc-item"><span><span class="toc-number">11.0</span> Feature-Level User Flows: Multi-Step Checkout & Postal PIN Validator</span><span>Page 14</span></div>
      <div class="toc-item"><span><span class="toc-number">12.0</span> Feature-Level User Flows: Passwordless OTP Authentication Lifecycle</span><span>Page 15</span></div>
      <div class="toc-item"><span><span class="toc-number">13.0</span> Feature-Level User Flows: Profile Address Book & Workshop Order Pipeline</span><span>Page 16</span></div>
      <div class="toc-item"><span><span class="toc-number">14.0</span> System Interaction & Sequence: Distributed Order & Resend Email</span><span>Page 17</span></div>
      <div class="toc-item"><span><span class="toc-number">15.0</span> State Transition Diagrams: Order Lifecycle & Cart Item Machines</span><span>Page 18</span></div>
      <div class="toc-item"><span><span class="toc-number">16.0</span> Edge Cases, Validation Matrix & Resilient Fallbacks</span><span>Page 19</span></div>
      <div class="toc-item"><span><span class="toc-number">17.0</span> Platform Dependencies, UX Gaps & Strategic Roadmap</span><span>Page 20</span></div>
    </div>

    <h2>Executive Architectural Summary</h2>
    <p>
      This document constitutes the definitive User Experience Architecture, Navigation Framework, and Systems Interaction Specification for the Aanur Textile Digital Commerce Platform. Operating on modern React 19 and Node 24 Express runtime, the architecture bridges heritage textile manufacturing in Kangayam directly with modern omni-channel retail.
    </p>
    <div class="callout callout-success">
      <strong>Architectural Guarantee:</strong> Every user journey accounts for non-happy-path edge cases, offline network resilience, automated fallback catalogs, and transactional email verification.
    </div>
  </div>

  <!-- PAGE 3: PROJECT UNDERSTANDING -->
  <div class="page-sheet">
    <h1>1.0 Executive Project Understanding & Business Scope</h1>
    <p>
      <strong>Aanur Textile</strong> is an established heritage textile manufacturing enterprise founded in <strong>2013 by Velusamy R</strong> in <em>Nathakadaiyur, Kangayam, Tiruppur</em>—the premier textile and weaving hub of Tamil Nadu, India. Operating continuously for over 13+ years with a dedicated master collective of 20+ artisans, Aanur Textile manufactures high-grade 100% pure combed cotton bedsheets, heritage plaids, gingham checks, and soft home comforts.
    </p>

    <h2>1.1 Core Problems Solved</h2>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 4px;">
      <div class="callout callout-warning" style="margin: 0;">
        <strong>Middlemen Disintermediation:</strong> Eliminates tiered agent commissions and distributor markups, connecting master weavers directly to homeowners and boutique hotels.
      </div>
      <div class="callout callout-info" style="margin: 0;">
        <strong>Fabric Traceability & Transparency:</strong> Solves ambiguous synthetic blend labeling through explicit material provenance (e.g. 100% Combed Cotton vs Cotton-Poly blends).
      </div>
      <div class="callout callout-success" style="margin: 0;">
        <strong>Resilient Zero-Downtime Architecture:</strong> Guarantees catalog browsing and cart persistence even if cloud MongoDB Atlas credentials or clusters experience network timeouts.
      </div>
      <div class="callout callout-danger" style="margin: 0;">
        <strong>Lost Transaction Prevention:</strong> Eliminates missing receipts via dual-recipient transactional dispatch using Resend API to both buyer and workshop admin.
      </div>
    </div>

    <h2>1.2 Business Objectives & Key Metrics (KPIs)</h2>
    <table>
      <thead>
        <tr>
          <th style="width: 25%;">Business Goal</th>
          <th style="width: 35%;">Strategic Rationale</th>
          <th style="width: 25%;">Target Metric / KPI</th>
          <th style="width: 15%;">Impact Area</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Direct B2C Adoption</strong></td>
          <td>Establish factory-direct retail channel across urban metros in India</td>
          <td>&gt; 2,500 monthly orders</td>
          <td><span class="tag tag-green">Revenue</span></td>
        </tr>
        <tr>
          <td><strong>B2B Quotation Capture</strong></td>
          <td>Insource bulk linen orders from homestays, hotels, and boutiques</td>
          <td>&gt; 25 vetted bulk leads/mo</td>
          <td><span class="tag tag-blue">Wholesale</span></td>
        </tr>
        <tr>
          <td><strong>Zero-Drop Checkout</strong></td>
          <td>Streamlined 3-step checkout funnel with PIN-code validation</td>
          <td>&lt; 20% Cart Abandonment</td>
          <td><span class="tag tag-orange">Conversion</span></td>
        </tr>
        <tr>
          <td><strong>Deliverability Guarantee</strong></td>
          <td>Instant transactional order receipts and workshop alerts via Resend</td>
          <td>99.9% Inbox Placement</td>
          <td><span class="tag tag-green">Trust</span></td>
        </tr>
      </tbody>
    </table>

    <h2>1.3 Technical Constraints & Platform Guarantees</h2>
    <ul>
      <li><strong>Frontend Ecosystem:</strong> React 19.1.0 with Vite 6.3.5, client-side SPA routing with browser history pushState, GSAP 3 + ScrollTrigger for buttery 60fps micro-interactions.</li>
      <li><strong>Backend Runtime:</strong> Node.js v24 LTS + Express 4.21.2, operating dual-mode (Vite connect middleware in local development, standalone Express server in production).</li>
      <li><strong>Data Tier & Fallback:</strong> MongoDB Atlas Cloud with Mongoose 9 ODM; automated graceful fallback to in-memory immutable catalog (<code>src/data.js</code>) if database is unreachable.</li>
      <li><strong>Transactional Communications:</strong> Resend REST API for high-deliverability HTML order confirmation emails and workshop admin alerts.</li>
      <li><strong>State Resilience:</strong> Browser <code>localStorage</code> cache for shopping bag, wishlist, coupon tokens, and customer address preferences.</li>
    </ul>
  </div>

  <!-- PAGE 4: ASSUMPTIONS & CLARIFICATIONS -->
  <div class="page-sheet">
    <h1>2.0 Architectural Assumptions & Stakeholder Clarifications</h1>
    <p>
      Explicit identification of architectural assumptions ensures complete alignment between product vision and engineering realization.
    </p>

    <h2>2.1 Documented System Assumptions</h2>
    <table>
      <thead>
        <tr>
          <th style="width: 20%;">Domain</th>
          <th style="width: 45%;">Architecture Assumption</th>
          <th style="width: 35%;">Engineering Realization</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Payments</strong></td>
          <td>Cash on Delivery (COD) is the primary zero-friction settlement method; Pre-paid is modeled for gateway integration.</td>
          <td>Immediate order commitment on COD; simulated pre-paid flow ready for Razorpay/Cashfree webhook integration.</td>
        </tr>
        <tr>
          <td><strong>Logistics SLA</strong></td>
          <td>Standard shipping timeline across all Indian PIN codes is 7 to 14 business days from Kangayam looms.</td>
          <td>Prominently rendered in header banner, product detail specs, checkout summary, and email receipts.</td>
        </tr>
        <tr>
          <td><strong>Catalog Inventory</strong></td>
          <td>Initial collection comprises 11 artisan bedsheets across 4 sizes (Single, Double, Queen, King) and 5 dye swatches.</td>
          <td>Hydrated via MongoDB Atlas collections with fallback to static schema in <code>src/data.js</code>.</td>
        </tr>
        <tr>
          <td><strong>Authentication</strong></td>
          <td>Lightweight passwordless OTP (Email/SMS) prioritized over rigid password enforcement to reduce churn.</td>
          <td>Server-side HMAC rate-limited OTP generator with 7-day session token stored in browser localStorage.</td>
        </tr>
        <tr>
          <td><strong>Administration</strong></td>
          <td>Workshop operators access management functions via dedicated PIN/Secret authentication gate at <code>/admin</code>.</td>
          <td>Token-based Bearer auth protecting Express routes; client UI renders order filters, status updates, and stats.</td>
        </tr>
      </tbody>
    </table>

    <h2>2.2 Open Stakeholder Clarification Questions</h2>
    <div class="callout callout-warning">
      <strong>Clarification Item 1: Payment Gateway Provider</strong><br>
      Will the production store standardize on <em>Razorpay Standard Checkout</em>, <em>Cashfree</em>, or <em>PhonePe PG</em> for pre-paid UPI/Credit transactions? (Architecture currently isolates the payment gateway behind a pluggable interface).
    </div>
    <div class="callout callout-info">
      <strong>Clarification Item 2: Real-Time Multi-Courier Tracking</strong><br>
      Should dispatch tracking numbers link to external aggregators (e.g., Shiprocket, Delhivery, India Post API) or remain manual status updates by the loom manager?
    </div>
    <div class="callout callout-info">
      <strong>Clarification Item 3: GST & Automated Tax Invoicing</strong><br>
      Are B2B buyers eligible to input company GSTIN numbers during checkout for tax credit, requiring automated PDF invoice dispatch?
    </div>
  </div>

  <!-- PAGE 5: PERSONAS -->
  <div class="page-sheet">
    <h1>3.0 User Personas, Target Roles & Mental Models</h1>

    <div class="persona-card">
      <div class="persona-header">
        <div>
          <span class="persona-name">Ananya Sharma (Age 32)</span> · <span class="persona-role">Urban Home Stylist & B2C Consumer</span>
        </div>
        <span class="tag tag-green">B2C Primary Persona</span>
      </div>
      <div class="persona-grid">
        <div>
          <p><strong>Profile:</strong> Lives in Bengaluru. Seeks natural, breathable 100% combed cotton bedding for minimalist bedroom aesthetics.</p>
          <p><strong>Goals:</strong> Easily visualize dye swatches on real beds; ensure shrinkage resistance; fast mobile COD checkout.</p>
        </div>
        <div>
          <p><strong>Pain Points:</strong> Misleading polyester blends online; frustrating forced password registrations; uncontactable support.</p>
          <p><strong>Touchpoints:</strong> Mobile Catalog, Swatches, Quick View Modal, 3-Step Checkout, WhatsApp Loom Drops.</p>
        </div>
      </div>
    </div>

    <div class="persona-card">
      <div class="persona-header">
        <div>
          <span class="persona-name">K. Sundaram (Age 48)</span> · <span class="persona-role">Boutique Resort General Manager</span>
        </div>
        <span class="tag tag-orange">B2B Institutional Persona</span>
      </div>
      <div class="persona-grid">
        <div>
          <p><strong>Profile:</strong> Manages a 24-room eco-resort in Nilgiris. Requires reliable bulk sourcing of durable commercial-wash bed sets.</p>
          <p><strong>Goals:</strong> Submit bulk requests for 50–200 unit sets; direct mill pricing; verified fabric weight (GSM) and loom provenance.</p>
        </div>
        <div>
          <p><strong>Pain Points:</strong> Inconsistent dye lot quality from brokers; hidden distributor markups; lack of mill access.</p>
          <p><strong>Touchpoints:</strong> Heritage Story, Bulk Wholesale Enquiry Form, Direct Factory Hotline.</p>
        </div>
      </div>
    </div>

    <div class="persona-card">
      <div class="persona-header">
        <div>
          <span class="persona-name">Velusamy R. (Age 56)</span> · <span class="persona-role">Founder & Loom Operations Supervisor</span>
        </div>
        <span class="tag tag-blue">Internal Admin Persona</span>
      </div>
      <div class="persona-grid">
        <div>
          <p><strong>Profile:</strong> Master weaver with 13+ years operating shuttleless looms in Kangayam. Oversees 20+ artisans and daily dispatch packaging.</p>
          <p><strong>Goals:</strong> View incoming orders in real-time; update status to "Dispatched" with one click; inspect daily revenue.</p>
        </div>
        <div>
          <p><strong>Pain Points:</strong> Cluttered software interfaces; delayed customer email alerts; complicated manual database operations.</p>
          <p><strong>Touchpoints:</strong> <code>/admin</code> Workshop Portal, Live Orders Table, Stock Manager, Resend Logs.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- PAGE 6: IA & NAVIGATION -->
  <div class="page-sheet">
    <h1>4.0 Information Architecture (IA) & Navigation Architecture</h1>
    <p>Structured 5-level hierarchy separating discovery, commerce transactions, customer account loyalty, and workshop administration:</p>

    <table>
      <thead>
        <tr>
          <th style="width: 18%;">Hierarchy Level</th>
          <th style="width: 25%;">Structural Entity</th>
          <th style="width: 57%;">Constituent Modules & Scope</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Level 1: Application</strong></td>
          <td>Aanur Textile Commerce Platform</td>
          <td>Single-Page Application container, GSAP animation orchestration, responsive header/footer, global state context.</td>
        </tr>
        <tr>
          <td><strong>Level 2: Main Modules</strong></td>
          <td>Core Application Domains</td>
          <td>1. Storefront & Catalog Discovery · 2. Shopping Bag & Pricing · 3. Logistics Checkout · 4. Customer Portal · 5. Workshop Administration</td>
        </tr>
        <tr>
          <td><strong>Level 3: Submodules</strong></td>
          <td>Functional Feature Clusters</td>
          <td>Catalog Filtering & Swatches · Dynamic Coupon Engine · PIN-Code Logistics Validator · Multi-Address Book · Live Order Tracker · Resend Dual Emails</td>
        </tr>
        <tr>
          <td><strong>Level 4: Pages / Screens</strong></td>
          <td>Unique Rendered Viewports</td>
          <td>Home (<code>/</code>), Shop (<code>/shop</code>), PDP (<code>/product/:id</code>), Offers (<code>/sale</code>), Search (<code>/search</code>), Bag (<code>/cart</code>), Checkout (<code>/checkout</code>), Success (<code>/verify-order</code>), Profile (<code>/profile</code>), Admin (<code>/admin</code>), Story (<code>/about</code>), Contact (<code>/contact</code>).</td>
        </tr>
        <tr>
          <td><strong>Level 5: Components</strong></td>
          <td>UI & Interaction Elements</td>
          <td>Color Swatches, Size Radio Pills, Qty Stepper, Quick View Flyout, Floating Toasts, Address Editor, Status Badges, Resend Diagnostic Dot.</td>
        </tr>
      </tbody>
    </table>

    <h2>Navigation Architecture Taxonomy</h2>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
      <div class="callout callout-info" style="margin: 0;">
        <strong>Global Navigation (Header & Drawer):</strong><br>
        • Brand Logo (Home)<br>
        • Primary: Collections (<code>/shop</code>), Offers (<code>/sale</code>), Story (<code>/about</code>), Contact (<code>/contact</code>)<br>
        • Global Actions: Search, Wishlist, Shopping Bag with Live Count, Account Profile<br>
        • Admin Access Gate (Desktop header & drawer)
      </div>
      <div class="callout callout-success" style="margin: 0;">
        <strong>Local & Contextual Navigation:</strong><br>
        • <strong>Catalog Local Nav:</strong> Weave category pills, Bed Size filters (Single, Double, Queen, King), Price sort.<br>
        • <strong>Product Contextual Nav:</strong> Live color swatches, Quick View modal, Related weaves carousel.<br>
        • <strong>Mobile Bottom Bar:</strong> Home, Shop, Saved, Bag, Account.
      </div>
    </div>
  </div>

  <!-- PAGE 7: PERMISSIONS & FEATURE MAPPING -->
  <div class="page-sheet">
    <h1>5.0 User Permissions Matrix (RBAC Boundaries)</h1>
    <table>
      <thead>
        <tr>
          <th style="width: 25%;">Functional Resource</th>
          <th style="width: 15%;">Guest Shopper</th>
          <th style="width: 20%;">Registered Customer</th>
          <th style="width: 20%;">B2B Wholesale Buyer</th>
          <th style="width: 20%;">Workshop Administrator</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Browse Catalog & Swatches</strong></td>
          <td><span class="tag tag-green">Full Access</span></td>
          <td><span class="tag tag-green">Full Access</span></td>
          <td><span class="tag tag-green">Full Access</span></td>
          <td><span class="tag tag-green">Full Access</span></td>
        </tr>
        <tr>
          <td><strong>Manage Cart & Coupons</strong></td>
          <td><span class="tag tag-green">Full Access</span></td>
          <td><span class="tag tag-green">Full Access</span></td>
          <td><span class="tag tag-green">Full Access</span></td>
          <td><span class="tag tag-green">Full Access</span></td>
        </tr>
        <tr>
          <td><strong>Place Order (COD / Prepaid)</strong></td>
          <td><span class="tag tag-green">Full Access</span></td>
          <td><span class="tag tag-green">Full Access</span></td>
          <td><span class="tag tag-green">Full Access</span></td>
          <td><span class="tag tag-green">Full Access</span></td>
        </tr>
        <tr>
          <td><strong>Saved Address Book</strong></td>
          <td><span class="tag tag-red">No Access</span></td>
          <td><span class="tag tag-green">Create / Edit / Delete</span></td>
          <td><span class="tag tag-green">Create / Edit / Delete</span></td>
          <td><span class="tag tag-green">Full Manage</span></td>
        </tr>
        <tr>
          <td><strong>View Order History</strong></td>
          <td><span class="tag tag-blue">Token Only</span></td>
          <td><span class="tag tag-green">Full History Access</span></td>
          <td><span class="tag tag-green">Full History Access</span></td>
          <td><span class="tag tag-green">Global Order Access</span></td>
        </tr>
        <tr>
          <td><strong>Wholesale Bulk Enquiry</strong></td>
          <td><span class="tag tag-green">Submit (Create)</span></td>
          <td><span class="tag tag-green">Submit (Create)</span></td>
          <td><span class="tag tag-green">Submit (Create)</span></td>
          <td><span class="tag tag-green">Review & Process</span></td>
        </tr>
        <tr>
          <td><strong>Modify Order Status</strong></td>
          <td><span class="tag tag-red">No Access</span></td>
          <td><span class="tag tag-red">No Access</span></td>
          <td><span class="tag tag-red">No Access</span></td>
          <td><span class="tag tag-green">Full Approve & Update</span></td>
        </tr>
        <tr>
          <td><strong>Catalog Inventory CRUD</strong></td>
          <td><span class="tag tag-red">No Access</span></td>
          <td><span class="tag tag-red">No Access</span></td>
          <td><span class="tag tag-red">No Access</span></td>
          <td><span class="tag tag-green">Full Create / Edit / Delete</span></td>
        </tr>
        <tr>
          <td><strong>Workshop Revenue Telemetry</strong></td>
          <td><span class="tag tag-red">No Access</span></td>
          <td><span class="tag tag-red">No Access</span></td>
          <td><span class="tag tag-red">No Access</span></td>
          <td><span class="tag tag-green">Full View & Audit</span></td>
        </tr>
      </tbody>
    </table>

    <h2>Feature & Module Priority Matrix (MoSCoW)</h2>
    <table>
      <thead>
        <tr>
          <th style="width: 20%;">Module</th>
          <th style="width: 25%;">Feature</th>
          <th style="width: 35%;">Sub-feature & Architectural Scope</th>
          <th style="width: 10%;">Role</th>
          <th style="width: 10%;">Priority</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Storefront</strong></td>
          <td>Dynamic Swatches</td>
          <td>Instant high-res photo swap on dye swatch selection</td>
          <td>Public</td>
          <td><span class="tag tag-green">P0-Must</span></td>
        </tr>
        <tr>
          <td><strong>Commerce Bag</strong></td>
          <td>Secret Coupon Engine</td>
          <td>Algorithmic validation for flat (<code>OFFER50</code>) and % (<code>BESTOFFER</code>)</td>
          <td>Public</td>
          <td><span class="tag tag-green">P0-Must</span></td>
        </tr>
        <tr>
          <td><strong>Logistics</strong></td>
          <td>PIN Code Validator</td>
          <td>Client regex (<code>^\\d{6}$</code>) validating Indian postal codes</td>
          <td>Public</td>
          <td><span class="tag tag-green">P0-Must</span></td>
        </tr>
        <tr>
          <td><strong>Notifications</strong></td>
          <td>Dual Resend Emails</td>
          <td>Parallel HTML receipts to customer & store administrator</td>
          <td>System</td>
          <td><span class="tag tag-green">P0-Must</span></td>
        </tr>
        <tr>
          <td><strong>Administration</strong></td>
          <td>Order Fulfillment</td>
          <td>Live orders status update (Processing, Dispatched, Delivered)</td>
          <td>Admin</td>
          <td><span class="tag tag-green">P0-Must</span></td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- PAGE 8: SCREEN INVENTORY PART 1 -->
  <div class="page-sheet">
    <h1>6.0 Comprehensive Screen Inventory (SCR-01 to SCR-09)</h1>
    <p>Detailed specification of Storefront, Catalog Discovery, and Checkout Funnel Screens:</p>
    <table>
      <thead>
        <tr>
          <th style="width: 8%;">ID</th>
          <th style="width: 14%;">Screen Name</th>
          <th style="width: 14%;">Route Path</th>
          <th style="width: 12%;">Role</th>
          <th style="width: 32%;">Primary Components & Actions</th>
          <th style="width: 20%;">Dependencies</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>SCR-01</code></td>
          <td>Home Landing</td>
          <td><code>/</code></td>
          <td>Public</td>
          <td>Hero Parallax, Best Sellers Grid, Swatch Carousel, Newsletter drop.</td>
          <td>GSAP, Products API</td>
        </tr>
        <tr>
          <td><code>SCR-02</code></td>
          <td>Catalog Grid</td>
          <td><code>/shop</code></td>
          <td>Public</td>
          <td>Parametric Filter Bar, Size Selector, Price Slider, Product Card Swatches.</td>
          <td>Products State</td>
        </tr>
        <tr>
          <td><code>SCR-03</code></td>
          <td>Category View</td>
          <td><code>/category/:slug</code></td>
          <td>Public</td>
          <td>Category Narrative Header, Filtered Grid, Quick View Trigger.</td>
          <td>Route Params</td>
        </tr>
        <tr>
          <td><code>SCR-04</code></td>
          <td>Product Detail</td>
          <td><code>/product/:id</code></td>
          <td>Public</td>
          <td>Gallery Zoom, Color Swatches, Size Dimensions Table, Quantity, Add to Bag.</td>
          <td>Products API, Cart</td>
        </tr>
        <tr>
          <td><code>SCR-05</code></td>
          <td>Quick View Modal</td>
          <td>Overlay Flyout</td>
          <td>Public</td>
          <td>Instant Fabric Specs, Variant Switcher, Add to Bag CTA without page reload.</td>
          <td>Parent State</td>
        </tr>
        <tr>
          <td><code>SCR-06</code></td>
          <td>Best Offers</td>
          <td><code>/sale</code></td>
          <td>Public</td>
          <td>Secret Coupon Showcase (<code>BESTOFFER</code>, <code>AANUR10</code>), Copy Code.</td>
          <td>Coupon Engine</td>
        </tr>
        <tr>
          <td><code>SCR-07</code></td>
          <td>Search View</td>
          <td><code>/search?q=...</code></td>
          <td>Public</td>
          <td>Fuzzy search input, zero-state suggestions, live matching product cards.</td>
          <td>Search Hook</td>
        </tr>
        <tr>
          <td><code>SCR-08</code></td>
          <td>Shopping Bag</td>
          <td><code>/cart</code></td>
          <td>Public</td>
          <td>Line items, size/color variant thumbnails, quantity stepper, coupon input.</td>
          <td><code>localStorage ('dd-cart')</code></td>
        </tr>
        <tr>
          <td><code>SCR-09</code></td>
          <td>Checkout Funnel</td>
          <td><code>/checkout</code></td>
          <td>Public / Cust</td>
          <td>6-digit Indian PIN validator, address form, COD/Prepaid choice, Complete Order.</td>
          <td><code>POST /api/orders</code></td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- PAGE 9: SCREEN INVENTORY PART 2 -->
  <div class="page-sheet">
    <h1>6.1 Comprehensive Screen Inventory (SCR-10 to SCR-18)</h1>
    <p>Detailed specification of Confirmation, Customer Account Portal, and Workshop Administration Screens:</p>
    <table>
      <thead>
        <tr>
          <th style="width: 8%;">ID</th>
          <th style="width: 14%;">Screen Name</th>
          <th style="width: 14%;">Route Path</th>
          <th style="width: 12%;">Role</th>
          <th style="width: 32%;">Primary Components & Actions</th>
          <th style="width: 20%;">Dependencies</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>SCR-10</code></td>
          <td>Order Confirmation</td>
          <td><code>/verify-order</code></td>
          <td>Public / Cust</td>
          <td>Order Ref Badge (<code>AT-XXXXXX</code>), Tracking Timeline, Printable Receipt.</td>
          <td>Order Ref Token</td>
        </tr>
        <tr>
          <td><code>SCR-11</code></td>
          <td>Saved Wishlist</td>
          <td><code>/wishlist</code></td>
          <td>Public / Cust</td>
          <td>Saved artisan pieces grid, one-click batch move to bag, empty state.</td>
          <td><code>localStorage ('dd-wishlist')</code></td>
        </tr>
        <tr>
          <td><code>SCR-12</code></td>
          <td>Auth Modal</td>
          <td><code>/login</code>, <code>/signup</code></td>
          <td>Public / Guest</td>
          <td>Dual-mode Mobile OTP / Email login, 60s countdown timer, auto-focus.</td>
          <td><code>POST /api/auth/*</code></td>
        </tr>
        <tr>
          <td><code>SCR-13</code></td>
          <td>Profile Overview</td>
          <td><code>/profile</code> (Tab 1)</td>
          <td>Customer</td>
          <td>Avatar customizer, stats (orders, addresses), recent order widget.</td>
          <td>User Auth State</td>
        </tr>
        <tr>
          <td><code>SCR-14</code></td>
          <td>Order History</td>
          <td><code>/profile</code> (Tab 2)</td>
          <td>Customer</td>
          <td>Historical order cards, status filter tabs, receipt printable modal.</td>
          <td>Orders Storage</td>
        </tr>
        <tr>
          <td><code>SCR-15</code></td>
          <td>Address Book</td>
          <td><code>/profile</code> (Tab 3)</td>
          <td>Customer</td>
          <td>Saved address cards (Home, Work, Studio), primary default toggle, Delete.</td>
          <td>Profile Storage</td>
        </tr>
        <tr>
          <td><code>SCR-16</code></td>
          <td>Account Settings</td>
          <td><code>/profile</code> (Tab 5)</td>
          <td>Customer</td>
          <td>Contact details editor, loom preferences, session logout button.</td>
          <td>HMAC Token</td>
        </tr>
        <tr>
          <td><code>SCR-17</code></td>
          <td>Admin Dashboard</td>
          <td><code>/admin</code></td>
          <td>Administrator</td>
          <td>Live orders pipeline, milestone status update, catalog CRUD, telemetry.</td>
          <td><code>/api/admin/*</code></td>
        </tr>
        <tr>
          <td><code>SCR-18</code></td>
          <td>Story & Contact</td>
          <td><code>/about</code>, <code>/contact</code></td>
          <td>Public / B2B</td>
          <td>13-year loom story, factory address, wholesale bulk enquiry form.</td>
          <td><code>POST /api/enquiries</code></td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- PAGE 10: USER JOURNEYS -->
  <div class="page-sheet">
    <h1>7.0 End-to-End Multi-Role User Journeys</h1>
    
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 5px;">
      <div class="callout callout-info" style="margin: 0;">
        <strong>Journey 1: Guest Shopper (Fast Checkout)</strong><br>
        1. Land on Home (<code>/</code>), explore Bed Collections.<br>
        2. Click "Forest Olive" swatch on Signature Check Bedsheet; photo updates instantly.<br>
        3. Open Quick View, select King Size, add to bag.<br>
        4. Go to <code>/cart</code>, enter secret coupon <code>BESTOFFER</code> (-15%).<br>
        5. Proceed to <code>/checkout</code>, enter 6-digit PIN & contact.<br>
        6. Select Cash on Delivery (COD) -> Complete Order.<br>
        7. Dual confirmation emails dispatched; receipt shown.
      </div>
      <div class="callout callout-success" style="margin: 0;">
        <strong>Journey 2: Workshop Manager (Fulfillment)</strong><br>
        1. Navigate to <code>/admin</code>, authenticate via admin security token.<br>
        2. Filter Live Orders by "Processing".<br>
        3. Inspect order <code>AT-891042</code> logistics details.<br>
        4. Package bedsheet set, change status to "Dispatched".<br>
        5. Customer receives automated dispatch notification.<br>
        6. Review gross daily revenue metrics & stock levels.
      </div>
    </div>

    <div class="callout callout-warning">
      <strong>Journey 3: Registered Customer (Re-order & Preferences)</strong><br>
      1. Open Auth modal -> enter mobile number -> receive 6-digit OTP -> instant authentication.<br>
      2. Profile hydrates saved shipping address (Indiranagar, Bengaluru) and loom preference ("King Size Weaves").<br>
      3. Navigate to Collections (<code>/shop</code>) -> add "Rustic Crimson Gingham" to bag.<br>
      4. Proceed to checkout -> address auto-fills with zero typing -> confirm order.<br>
      5. View real-time fulfillment status under "My Orders" tab on <code>/profile</code>.
    </div>

    <div class="callout callout-info">
      <strong>Journey 4: Institutional B2B Buyer (Bulk Wholesale Quotation)</strong><br>
      1. Resort GM navigates to Story (<code>/about</code>) to review loom capacity and yarn provenance.<br>
      2. Clicks "Wholesale & Bulk Inquiries" button -> fills form (50 sets, King size, yarn-dyed checks).<br>
      3. Form POSTs to <code>/api/enquiries</code> -> stored in MongoDB and dispatches instant alert to factory manager.<br>
      4. Factory supervisor contacts resort manager within 24 hours with custom GST invoice quote.
    </div>
  </div>

  <!-- PAGE 11: HIGH-LEVEL ARCHITECTURE FLOW -->
  <div class="page-sheet">
    <h1>8.0 High-Level System Architecture & Application Flow</h1>
    <p>Balanced vertical 4-tier architecture connecting Client SPA, State Storage, Express API, MongoDB, and Resend:</p>

    <div class="diagram-card" style="max-height: 195mm;">
      <div class="diagram-header">
        <span class="diagram-title">Modular Application Routing & Operational Architecture</span>
        <span class="diagram-badge">Mermaid Flowchart</span>
      </div>
      <div class="mermaid">
flowchart TD
    User([User Client: Mobile / Desktop]) --> Gateway[Application Router]

    subgraph Tier1 ["1. Public Storefront Discovery"]
        HomeView[Home Landing SCR-01]
        CatalogView[Catalog Grid SCR-02]
        PDPView[Product Detail SCR-04]
        HomeView --> CatalogView --> PDPView
    end
    Gateway --> Tier1

    subgraph Tier2 ["2. Commerce & Checkout Funnel"]
        CartView[Shopping Bag SCR-08]
        CheckoutView[Checkout Funnel SCR-09]
        ConfirmView[Order Confirmation SCR-10]
        CartView --> CheckoutView --> ConfirmView
    end
    Tier1 -->|Add to Bag| Tier2

    subgraph Tier3 ["3. Portals & Administration"]
        ProfileView[Customer Portal SCR-13]
        AdminView[Workshop Admin SCR-17]
        EnquiryView[Wholesale Lead SCR-18]
    end
    Gateway --> Tier3

    subgraph Tier4 ["4. Persistence & API Tier"]
        API[Express REST API /api/*]
        DB[(MongoDB Atlas + Local Fallback)]
        Resend[Resend Email Gateway]
        API --> DB
        API --> Resend
    end
    Tier2 -->|POST /api/orders| API
    Tier3 -->|Auth & Updates| API
      </div>
    </div>

    <h2>Architectural Trust Boundaries & Protocol SLAs</h2>
    <p>
      • <strong>Client-to-Express REST API:</strong> JSON over HTTPS, secured with HMAC SHA-256 session tokens.<br>
      • <strong>Express-to-MongoDB Atlas:</strong> Persistent TCP connection with automated fallback to <code>src/data.js</code> upon connection drops.<br>
      • <strong>Express-to-Resend REST API:</strong> HTTPS API gateway with 99.9% inbox SLA for dual-recipient order confirmations.
    </p>
  </div>

  <!-- PAGE 12: CATALOG & SWATCH FLOW -->
  <div class="page-sheet">
    <h1>9.0 Feature User Flow: Catalog, Swatches & Quick View</h1>
    <p>Dual-stage user flow for catalog filtering, live photo swatch switching, and modal quick-view cart addition:</p>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin: 2px 0 4px 0;">
      <div class="diagram-card" style="margin: 0; max-height: 125mm;">
        <div class="diagram-header">
          <span class="diagram-title">Catalog Filtering & Swatch Swap</span>
          <span class="diagram-badge">Flowchart</span>
        </div>
        <div class="mermaid">
flowchart TD
    A([Enter /shop]) --> B[Fetch /api/products]
    B --> C[Render Bedsheet Grid]
    C --> D{Customer Action}
    D -->|Filter Size/Weave| E1[Update Active Cards]
    D -->|Click Dye Swatch| E2[Live Color Photo Swap]
    D -->|Click Card Title| E3([Navigate /product/:id])
    E1 --> C
    E2 --> C
        </div>
      </div>

      <div class="diagram-card" style="margin: 0; max-height: 125mm;">
        <div class="diagram-header">
          <span class="diagram-title">Quick View Modal & Bag Add</span>
          <span class="diagram-badge">Flowchart</span>
        </div>
        <div class="mermaid">
flowchart TD
    A([Click Quick View]) --> B[Open Flyout Modal]
    B --> C[Fetch Product Details]
    C --> D[Select Bed Size Pill]
    D --> E[Click Add to Bag]
    E --> F[Display Feedback Toast]
    F --> G([Close Modal & Continue])
        </div>
      </div>
    </div>

    <h2>Decision Rules & Edge States</h2>
    <table>
      <thead>
        <tr>
          <th style="width: 25%;">Decision Branch</th>
          <th style="width: 40%;">System Behavior</th>
          <th style="width: 35%;">User Feedback</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>No Products Match Filter</strong></td>
          <td>Preserves active filter pills; renders friendly zero-state illustration</td>
          <td><em>"No weaves found matching these filters. Reset filters to explore all pieces."</em></td>
        </tr>
        <tr>
          <td><strong>Missing Swatch Thumbnail</strong></td>
          <td>Falls back to primary variant image index 0 automatically</td>
          <td>Zero visual distortion; catalog keeps smooth 60fps scroll.</td>
        </tr>
        <tr>
          <td><strong>Quick View Modal Dismiss</strong></td>
          <td>Escape key or backdrop click closes flyout with zero scroll disruption</td>
          <td>User remains at exact catalog scroll position.</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- PAGE 13: SHOPPING BAG & COUPON ENGINE -->
  <div class="page-sheet">
    <h1>10.0 Feature User Flow: Shopping Bag & Secret Coupons</h1>
    <p>Shopping bag line-item control alongside algorithmic coupon evaluation and threshold calculations:</p>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin: 2px 0 4px 0;">
      <div class="diagram-card" style="margin: 0; max-height: 125mm;">
        <div class="diagram-header">
          <span class="diagram-title">Shopping Bag Line-Item Controls</span>
          <span class="diagram-badge">Flowchart</span>
        </div>
        <div class="mermaid">
flowchart TD
    A([Open /cart]) --> B{Bag Items?}
    B -->|Empty| C[Show Zero-State CTA]
    B -->|Active| D[Render Line Items]
    D --> E{User Action}
    E -->|Qty +/-| F1[Update Item Quantity]
    E -->|Delete| F2[Remove Line Item]
    F1 --> G[Recalculate Subtotal]
    F2 --> G
    G --> H([Proceed to Checkout])
        </div>
      </div>

      <div class="diagram-card" style="margin: 0; max-height: 125mm;">
        <div class="diagram-header">
          <span class="diagram-title">Secret Coupon & Shipping Engine</span>
          <span class="diagram-badge">Flowchart</span>
        </div>
        <div class="mermaid">
flowchart TD
    A([Input Promo Code]) --> B{Evaluate Code}
    B -->|SECRET15| C1[Apply 15% Secret Off]
    B -->|AANUR10| C2[Apply 10% Mill Off]
    B -->|OFFER50| C3[Apply Flat Rs 50 Off]
    B -->|Invalid| C4[Show Invalid Toast]
    C1 --> D{Subtotal >= Rs 999?}
    C2 --> D
    C3 --> D
    C4 --> D
    D -->|Yes| E1[Free Shipping: Rs 0]
    D -->|No| E2[Standard Courier: Rs 49]
    E1 --> F([Render Gross Net Total])
    E2 --> F
        </div>
      </div>
    </div>

    <h2>Coupon Validation Engine Rules</h2>
    <table>
      <thead>
        <tr>
          <th style="width: 20%;">Coupon Token</th>
          <th style="width: 25%;">Discount Value</th>
          <th style="width: 30%;">Validation Constraints</th>
          <th style="width: 25%;">UI Badge / Feedback</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>BESTOFFER</code> / <code>SECRET15</code></td>
          <td>15% Tiered Percentage Off</td>
          <td>Case-insensitive, trimmed automatically</td>
          <td><span class="tag tag-green">15% Secret Offer Discount</span></td>
        </tr>
        <tr>
          <td><code>AANUR10</code> / <code>SECRET10</code></td>
          <td>10% Factory Percentage Off</td>
          <td>Case-insensitive, trimmed automatically</td>
          <td><span class="tag tag-green">10% Factory Discount</span></td>
        </tr>
        <tr>
          <td><code>OFFER50</code></td>
          <td>Rs 50 Flat Cash Deduction</td>
          <td>Minimum subtotal Rs 500 required</td>
          <td><span class="tag tag-blue">Rs 50 Flat Off</span></td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- PAGE 14: CHECKOUT & PIN CODE VALIDATION -->
  <div class="page-sheet">
    <h1>11.0 Feature User Flow: Multi-Step Checkout Funnel</h1>
    <p>Logistics gathering, 6-digit postal PIN validation, payment mode selection, and order generation:</p>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin: 2px 0 4px 0;">
      <div class="diagram-card" style="margin: 0; max-height: 125mm;">
        <div class="diagram-header">
          <span class="diagram-title">Logistics & Postal PIN Validator</span>
          <span class="diagram-badge">Flowchart</span>
        </div>
        <div class="mermaid">
flowchart TD
    A([Enter /checkout]) --> B{Auth Status}
    B -->|Guest| C1[Manual Address Entry]
    B -->|Member| C2[Autofill Saved Address]
    C1 --> D{Validate 6-Digit PIN}
    C2 --> D
    D -->|Invalid Digits| E1[Alert: 6 Digits Required]
    E1 --> C1
    D -->|Valid PIN| E2([Proceed to Payment])
        </div>
      </div>

      <div class="diagram-card" style="margin: 0; max-height: 125mm;">
        <div class="diagram-header">
          <span class="diagram-title">Payment & Server Fulfillment</span>
          <span class="diagram-badge">Flowchart</span>
        </div>
        <div class="mermaid">
flowchart TD
    A([Select Payment]) --> B{Payment Mode}
    B -->|Cash on Delivery| C1[Status: Pending Delivery]
    B -->|Pre-paid Online| C2[Gateway Simulation]
    C1 --> D[Click Complete Order]
    C2 --> D
    D --> E[POST /api/orders]
    E --> F[Issue AT-XXXXXX Ref]
    F --> G[Dual Resend Email Dispatch]
    G --> H([Redirect /verify-order])
        </div>
      </div>
    </div>

    <h2>Checkout Resilience & Form Validation Matrix</h2>
    <table>
      <thead>
        <tr>
          <th style="width: 22%;">Checkout Stage</th>
          <th style="width: 28%;">Validation Mechanism</th>
          <th style="width: 25%;">Failure Handling</th>
          <th style="width: 25%;">Resilience Architecture</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Contact Information</strong></td>
          <td>Name and Email format check (/^\S+@\S+\.\S+$/)</td>
          <td>Inline red label & shake highlight</td>
          <td>Preserves input field state on reload</td>
        </tr>
        <tr>
          <td><strong>Postal PIN Code</strong></td>
          <td>Strict 6-digit evaluation (/^\d{6}$/) on blur</td>
          <td>Alert: <em>"Enter valid 6-digit Indian PIN"</em></td>
          <td>Prevents form submission if invalid</td>
        </tr>
        <tr>
          <td><strong>Payment Processing</strong></td>
          <td>COD flagged as 'pending'; Online triggers mock gateway</td>
          <td>Network retry prompt with state rollback</td>
          <td>Idempotent order reference prevent duplicates</td>
        </tr>
        <tr>
          <td><strong>Order Submission</strong></td>
          <td>isSubmitting lock prevents multi-click duplication</td>
          <td>Disables CTA button with spinner indicator</td>
          <td>Dual transactional Resend email dispatch</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- PAGE 15: AUTHENTICATION & OTP LIFECYCLE -->
  <div class="page-sheet">
    <h1>12.0 Feature User Flow: Passwordless OTP Authentication</h1>
    <p>Rate-limited passwordless authentication with 6-digit numeric OTP and 7-day HMAC bearer token:</p>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin: 2px 0 4px 0;">
      <div class="diagram-card" style="margin: 0; max-height: 125mm;">
        <div class="diagram-header">
          <span class="diagram-title">Phase 1: Rate Limit & OTP Dispatch</span>
          <span class="diagram-badge">Flowchart</span>
        </div>
        <div class="mermaid">
flowchart TD
    A([Open Sign In Modal]) --> B[Input Mobile or Email]
    B --> C{Rate Limit Check}
    C -->|Exceeded > 5| D1[429 Rate Limit Alert]
    D1 --> B
    C -->|Allowed| D2[Generate 6-Digit OTP]
    D2 --> E{Channel}
    E -->|Email| F1[Resend API Gateway]
    E -->|Phone| F2[SMS Gateway Mock]
    F1 --> G([Display 6-Digit Modal])
    F2 --> G
        </div>
      </div>

      <div class="diagram-card" style="margin: 0; max-height: 125mm;">
        <div class="diagram-header">
          <span class="diagram-title">Phase 2: Verification & Session</span>
          <span class="diagram-badge">Flowchart</span>
        </div>
        <div class="mermaid">
flowchart TD
    A([Enter 6-Digit OTP]) --> B[Start 60s Countdown]
    B --> C{Verify Code & TTL}
    C -->|Mismatch/Expired| D1[Show Error Alert]
    D1 --> A
    C -->|Valid Code| D2[Sign HMAC-SHA256 Token]
    D2 --> E[Save aanur_is_logged_in]
    E --> F[Hydrate Customer Profile]
    F --> G([Close Modal & Resume])
        </div>
      </div>
    </div>

    <h2>Authentication Security Model</h2>
    <table>
      <thead>
        <tr>
          <th style="width: 25%;">Security Dimension</th>
          <th style="width: 45%;">Implementation Detail</th>
          <th style="width: 30%;">Attack Mitigation</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Rate Limiting</strong></td>
          <td>Max 5 OTP requests per IP/account within 10-minute sliding window</td>
          <td>Prevents SMS flooding & credential brute forcing</td>
        </tr>
        <tr>
          <td><strong>Token Signing</strong></td>
          <td>Cryptographic HMAC-SHA256 signature using <code>SESSION_SECRET</code></td>
          <td>Prevents token tampering & privilege escalation</td>
        </tr>
        <tr>
          <td><strong>OTP Expiration</strong></td>
          <td>In-memory TTL capped at 5 minutes; auto-cleansed via background sweep</td>
          <td>Prevents replay attacks of stale OTP codes</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- PAGE 16: PROFILE & WORKSHOP ADMIN PIPELINES -->
  <div class="page-sheet">
    <h1>13.0 Feature User Flows: Profile & Workshop Admin</h1>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
      <div class="diagram-card" style="margin: 0; max-height: 165mm;">
        <div class="diagram-header">
          <span class="diagram-title">Profile & Address Book Flow</span>
          <span class="diagram-badge">Flowchart</span>
        </div>
        <div class="mermaid">
flowchart TD
    A([Open /profile]) --> B{Authenticated?}
    B -->|No| C([Redirect to /login])
    B -->|Yes| D[Render 5 Profile Tabs]
    
    D --> E{Select Tab}
    E -->|Overview| F1[Stats & Recent Order]
    E -->|My Orders| F2[Order History & Slips]
    E -->|Addresses| F3[Saved Address Cards]
    
    F3 --> G[Click Add New Address]
    G --> H[Input Logistics & Set Primary]
    H --> I[Persist to Profile Cache]
    I --> J([Refresh Address Grid])
        </div>
      </div>

      <div class="diagram-card" style="margin: 0; max-height: 165mm;">
        <div class="diagram-header">
          <span class="diagram-title">Workshop Admin Pipeline</span>
          <span class="diagram-badge">Flowchart</span>
        </div>
        <div class="mermaid">
flowchart TD
    A([Open /admin]) --> B{Admin Bearer Valid?}
    B -->|No| C[Display Security Gate Login]
    B -->|Yes| D[Load Admin Dashboard]
    
    D --> E{Select Admin Tab}
    E -->|Live Orders| F1[Orders Table]
    E -->|Overview| F2[Gross Sales Metrics]
    E -->|Products| F3[Catalog Stock CRUD]
    
    F1 --> G[Filter by Processing]
    G --> H[Package & Select 'Dispatched']
    H --> I[PATCH /api/admin/orders/:id]
    I --> J([Trigger Resend Dispatch Email])
        </div>
      </div>
    </div>

    <h2>Workshop Operational Workflows</h2>
    <p>
      • <strong>Morning Order Audit:</strong> Workshop manager logs in at <code>/admin</code>, sorts by "Processing", and prints picking slips.<br>
      • <strong>Fulfillment Handover:</strong> As packages are sealed, the manager selects "Dispatched" in the status dropdown, triggering an automatic customer notification email.<br>
      • <strong>Inventory Stock Adjustment:</strong> When a loom weave run completes, stock levels and pricing are adjusted under the "Products" tab with zero server reboots.
    </p>
  </div>

  <!-- PAGE 17: DISTRIBUTED ORDER & RESEND SEQUENCE -->
  <div class="page-sheet">
    <h1>14.0 System Interaction & Sequence Diagram</h1>
    <p>Distributed order placement across Browser SPA, Express API, MongoDB Atlas, and Resend Gateway:</p>

    <div class="diagram-card" style="max-height: 170mm;">
      <div class="diagram-header">
        <span class="diagram-title">Distributed Order Placement & Dual Transactional Email Sequence</span>
        <span class="diagram-badge">Mermaid Sequence Diagram</span>
      </div>
      <div class="mermaid">
sequenceDiagram
    autonumber
    actor Shopper as Customer Browser
    participant Express as Express API (/api/orders)
    participant Mongo as MongoDB Atlas Cluster
    participant Resend as Resend Gateway
    actor Admin as Workshop Admin Inbox

    Shopper->>Express: POST /api/orders {orderRef, customer, items, total, payment}
    activate Express

    Express->>Mongo: Order.create({ orderRef, customer, items, status: 'processing' })
    alt MongoDB Atlas Connected
        Mongo-->>Express: Order Document Persisted (201 Created)
    else MongoDB Atlas Offline / Latency Timeout
        Express->>Express: saveLocalOrder(orderRef, data) [In-Memory Fallback]
    end

    par Parallel Email Dispatch via Resend
        Express->>Resend: sendOrderCustomerEmail(Customer HTML Receipt)
        Resend-->>Shopper: Order Confirmation Delivered (AT-XXXXXX)
    and
        Express->>Resend: sendOrderOwnerEmail(Workshop Packing Alert)
        Resend-->>Admin: Workshop Alert (Kangayam Loom Dispatch)
    end

    Express-->>Shopper: 200 OK { success: true, orderRef: "AT-XXXXXX" }
    deactivate Express

    Shopper->>Shopper: Clear dd-cart & Render /verify-order Confirmation
      </div>
    </div>

    <h2>Dual Resend Email Dispatch Architecture</h2>
    <table>
      <thead>
        <tr>
          <th style="width: 25%;">Recipient Role</th>
          <th style="width: 35%;">Email Template & Contents</th>
          <th style="width: 40%;">Delivery SLA & Provider Gateway</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Customer Shopper</strong></td>
          <td>Itemized order receipt, variant thumbnails, delivery address, 7–14 day SLA reminder</td>
          <td>Dispatched immediately via Resend API (99.9% inbox placement guarantee)</td>
        </tr>
        <tr>
          <td><strong>Workshop Admin</strong></td>
          <td>Packaging alert, customer phone number, shipping logistics, line item picking list</td>
          <td>Dispatched simultaneously to <code>STORE_ADMIN_EMAIL</code> inbox for instant fulfillment</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- PAGE 18: STATE MACHINES -->
  <div class="page-sheet">
    <h1>15.0 State Transition Diagrams</h1>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
      <div class="diagram-card" style="margin: 0; max-height: 165mm;">
        <div class="diagram-header">
          <span class="diagram-title">Order Lifecycle State Machine</span>
          <span class="diagram-badge">Mermaid State</span>
        </div>
        <div class="mermaid">
stateDiagram-v2
    [*] --> Draft: Line item in bag
    Draft --> Placed: Checkout submitted
    
    state Placed {
        [*] --> Processing: AT-XXXXXX created
        Processing --> Dispatched: Courier assigned
        Dispatched --> Delivered: Handover confirmed
    }

    Processing --> Cancelled: Customer cancels
    Dispatched --> Returned: Address failure
    Returned --> Cancelled: Returned to mill

    Delivered --> [*]: Order fulfilled
    Cancelled --> [*]: Inventory released
        </div>
      </div>

      <div class="diagram-card" style="margin: 0; max-height: 165mm;">
        <div class="diagram-header">
          <span class="diagram-title">Shopping Bag Item State Machine</span>
          <span class="diagram-badge">Mermaid State</span>
        </div>
        <div class="mermaid">
stateDiagram-v2
    [*] --> EmptyCart: Session init
    EmptyCart --> ActiveItem: Add to Bag clicked
    
    state ActiveItem {
        [*] --> QtySingle: Qty = 1
        QtySingle --> QtyMulti: Plus (+)
        QtyMulti --> QtySingle: Minus (-) to 1
    }

    ActiveItem --> Discounted: Coupon applied
    Discounted --> ActiveItem: Coupon removed
    ActiveItem --> EmptyCart: Delete item / checkout
        </div>
      </div>
    </div>

    <h2>State Transition Invariants</h2>
    <p>
      • <strong>Immutable Order IDs:</strong> Once issued (e.g. <code>AT-102948</code>), the order identifier cannot be mutated or reassigned.<br>
      • <strong>Terminal States:</strong> <code>Delivered</code> and <code>Cancelled</code> are final terminal states. Reopening an order requires generating a new transaction record.<br>
      • <strong>Cart Line-Item Indexing:</strong> Items are keyed as <code>productId::size::colorIndex</code> to prevent variant collisions.
    </p>
  </div>

  <!-- PAGE 19: EDGE CASES & VALIDATION -->
  <div class="page-sheet">
    <h1>16.0 Edge Cases, Validation Matrix & Resilient Fallbacks</h1>
    <table>
      <thead>
        <tr>
          <th style="width: 18%;">Edge Case Category</th>
          <th style="width: 27%;">Trigger Condition</th>
          <th style="width: 25%;">System Detection & Handling</th>
          <th style="width: 30%;">User Feedback & Fallback Action</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Postal Validation</strong></td>
          <td>Shopper enters 5-digit PIN or letters in PIN input during checkout</td>
          <td>Client regex check (<code>^\\d{6}$</code>) halts submission before network dispatch</td>
          <td>Renders inline red validation alert: <em>"Please enter a valid 6-digit Indian PIN Code"</em>; input autofocuses.</td>
        </tr>
        <tr>
          <td><strong>Coupon Abuse</strong></td>
          <td>User submits expired, randomized, or lowercase coupon codes</td>
          <td><code>validateCoupon()</code> normalizes text; returns <code>null</code> on unrecognized token</td>
          <td>Displays subtle toast: <em>"Coupon code is invalid or expired"</em>; maintains original subtotal without recalculation.</td>
        </tr>
        <tr>
          <td><strong>Database Downtime</strong></td>
          <td>MongoDB Atlas cluster unreachable, DNS failure, or credentials missing</td>
          <td>Express API traps error inside middleware, falls back to static catalog in <code>src/data.js</code></td>
          <td>Catalog loads with zero latency; returns HTTP 200 with <code>source: 'local'</code>; console outputs warning.</td>
        </tr>
        <tr>
          <td><strong>Email Rate Limiting</strong></td>
          <td>Resend API quota exceeded or unverified sandbox recipient domain</td>
          <td><code>try/catch</code> block in <code>sendOrderCustomerEmail()</code> catches Resend error</td>
          <td>Order successfully recorded in MongoDB regardless; logs error server-side without crashing checkout.</td>
        </tr>
        <tr>
          <td><strong>Duplicate Submission</strong></td>
          <td>User rapidly double-clicks "Complete Order" button during network latency</td>
          <td>Client sets <code>isSubmitting=true</code>, disabling the CTA button immediately</td>
          <td>Button displays animated spinner; duplicate order prevention avoids double-billing.</td>
        </tr>
        <tr>
          <td><strong>Unauthorized Admin</strong></td>
          <td>Non-admin attempts to access <code>/api/admin/*</code> without Bearer token</td>
          <td><code>requireAdmin</code> middleware validates HMAC signature and checks email allowlist</td>
          <td>Returns HTTP 403 Forbidden: <em>"Access denied. Administrator authentication required."</em></td>
        </tr>
        <tr>
          <td><strong>Empty Cart Access</strong></td>
          <td>User manually types <code>/checkout</code> URL into browser with empty bag</td>
          <td>Checkout component checks <code>Object.keys(cart).length === 0</code></td>
          <td>Displays friendly empty bag state with prominent <em>"Discover Collections"</em> CTA button.</td>
        </tr>
        <tr>
          <td><strong>Session Token Expiry</strong></td>
          <td>Customer JWT/HMAC token exceeds 7-day expiration timestamp</td>
          <td><code>verifyAuthToken()</code> detects <code>Date.now() > data.exp</code></td>
          <td>Silently flushes expired token, falls back to guest mode, prompts for fresh OTP on account actions.</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- PAGE 20: DEPENDENCIES, GAPS & ROADMAP -->
  <div class="page-sheet">
    <h1>17.0 Platform Dependencies, UX Gaps & Strategic Roadmap</h1>

    <h2>Platform Architectural Dependencies</h2>
    <div class="diagram-card" style="margin-bottom: 4px; max-height: 48mm;">
      <div class="diagram-header">
        <span class="diagram-title">System Dependency Graph</span>
        <span class="diagram-badge">Mermaid Flowchart</span>
      </div>
      <div class="mermaid">
flowchart LR
    Env[".env Secrets"] --> AtlasURI["MONGODB_URI"]
    Env --> ResendKey["RESEND_API_KEY"]
    Env --> AdminEmail["STORE_ADMIN_EMAIL"]

    AtlasURI --> DBConnect["MongoDB Connection"]
    ResendKey --> EmailClient["Resend Email Client"]
    AdminEmail --> AuthHelper["HMAC Admin Auth"]

    DBConnect --> CatalogModule["Catalog Grid /shop"]
    CatalogModule --> CartModule["Shopping Bag /cart"]
    CartModule --> CheckoutModule["Checkout Funnel /checkout"]
    EmailClient --> CheckoutModule
    AuthHelper --> AdminModule["Workshop Admin /admin"]
    DBConnect --> AdminModule
      </div>
    </div>

    <h2>UX Gaps & Tactical Recommendations</h2>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 4px;">
      <div class="callout callout-warning" style="margin: 0;">
        <strong>Gap 1: Manual Courier Tracking Updates</strong><br>
        <em>Current State:</em> Loom manager manually marks orders as "Dispatched".<br>
        <em>Recommendation:</em> Connect Shiprocket / Delhivery REST APIs to generate automatic tracking links and sync milestone webhooks.
      </div>
      <div class="callout callout-info" style="margin: 0;">
        <strong>Gap 2: Pillow Cover & Fitted Sheet Upsells</strong><br>
        <em>Current State:</em> Bedsheets currently sell as standalone flat sheets.<br>
        <em>Recommendation:</em> Offer PDP upsell bundles (e.g. <em>Add 2 Pillow Covers (+₹199)</em> or <em>Elasticized Fitted Corners (+₹149)</em>).
      </div>
    </div>

    <h2>Strategic Product Roadmap</h2>
    <table>
      <thead>
        <tr>
          <th style="width: 15%;">Phase</th>
          <th style="width: 25%;">Target Milestone</th>
          <th style="width: 42%;">Key Architectural Deliverables</th>
          <th style="width: 18%;">Horizon</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Phase 1 (Current)</strong></td>
          <td>Full-Stack MERN Launch</td>
          <td>MERN architecture, GSAP parallax storytelling, Resend dual emails, local in-memory fallback, secret coupon validator.</td>
          <td><span class="tag tag-green">Delivered</span></td>
        </tr>
        <tr>
          <td><strong>Phase 2</strong></td>
          <td>Payment & Courier Automation</td>
          <td>Razorpay/Cashfree pre-paid gateway integration, Shiprocket courier sync, automated WhatsApp dispatch notifications.</td>
          <td><span class="tag tag-blue">Q1 2027</span></td>
        </tr>
        <tr>
          <td><strong>Phase 3</strong></td>
          <td>B2B Wholesale Portal</td>
          <td>Dedicated wholesale customer tier with volume tiers (50+, 200+ units), sample swatch kit ordering, automated GST invoicing.</td>
          <td><span class="tag tag-orange">Q2 2027</span></td>
        </tr>
        <tr>
          <td><strong>Phase 4</strong></td>
          <td>Global Handloom Export</td>
          <td>Multi-currency switcher (USD, EUR, GBP), international DHL/FedEx logistics integration, custom jacquard weaving pre-order pipeline.</td>
          <td><span class="tag tag-slate">Q3 2027</span></td>
        </tr>
      </tbody>
    </table>

    <div style="margin-top: 6px; border-top: 1px solid #e2e8f0; padding-top: 4px; text-align: center; font-size: 7.2pt; color: #64748b;">
      <strong>Aanur Textile Enterprise UX Architecture Specification</strong> · Authored by Senior UX Architect & Enterprise Systems Designer · Document Ref: AT-UXA-2026-M1 · Confirmed for Stakeholder Review & Engineering Handoff.
    </div>
  </div>

</body>
</html>
`;

async function generatePDF() {
  console.log('Starting Pixel-Perfect PDF Generation with Puppeteer...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 1600, deviceScaleFactor: 2 });
  
  await page.setContent(htmlContent, { waitUntil: 'networkidle0', timeout: 60000 });
  
  console.log('Waiting for Mermaid diagrams to render...');
  await page.waitForFunction(() => {
    const diagrams = document.querySelectorAll('.mermaid');
    if (diagrams.length === 0) return true;
    return Array.from(diagrams).every(d => d.querySelector('svg') !== null);
  }, { timeout: 30000 });

  await new Promise(r => setTimeout(r, 2000));

  const outputPath = path.resolve('Aanur_Textile_UX_Architecture_Specification.pdf');
  console.log('Printing to PDF:', outputPath);

  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '10mm',
      bottom: '10mm',
      left: '12mm',
      right: '12mm'
    },
    displayHeaderFooter: false
  });

  await browser.close();

  // Cleanly trim any trailing blank overflow page
  try {
    const { execSync } = await import('child_process');
    const cleanPath = outputPath.split('\\\\').join('/');
    execSync(`python -c "from pypdf import PdfReader, PdfWriter; r = PdfReader(r'${cleanPath}'); w = PdfWriter(); [w.add_page(r.pages[i]) for i in range(min(20, len(r.pages)))]; f = open(r'${cleanPath}', 'wb'); w.write(f); f.close()"`);
  } catch (trimErr) {
    console.warn('Trim check note:', trimErr.message);
  }

  const stats = fs.statSync(outputPath);
  console.log(`Pixel-Perfect PDF generated successfully! Size: ${(stats.size / 1024).toFixed(1)} KB at ${outputPath}`);
}

generatePDF().catch(err => {
  console.error('Failed to generate PDF:', err);
  process.exit(1);
});
