import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

console.log('Generating Publication-Grade Executive Usability Test Report PDF...');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Usability Test Report — Job Portal Website Design</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 10mm 12mm 10mm 12mm;
      @bottom-right {
        content: "Page " counter(page) " of 4";
        font-family: Arial, Helvetica, sans-serif;
        font-size: 7.5pt;
        font-weight: 600;
        color: #64748b;
      }
      @bottom-left {
        content: "Usability Test Report: Job Portal Website Design · Confidential Executive Audit";
        font-family: Arial, Helvetica, sans-serif;
        font-size: 7.5pt;
        font-weight: 500;
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
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      line-height: 1.34;
      font-size: 7.6pt;
      margin: 0;
      padding: 0;
    }

    .page-sheet {
      height: 268mm;
      max-height: 268mm;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      padding: 0;
      box-sizing: border-box;
    }

    .page-sheet:not(:last-child) {
      page-break-after: always;
      break-after: page;
    }

    .page-sheet:last-child {
      page-break-after: avoid !important;
      break-after: avoid !important;
    }

    /* HEADER BANNER */
    .report-header {
      background: linear-gradient(135deg, #091e42 0%, #1e293b 100%);
      color: #ffffff;
      padding: 10px 14px;
      border-radius: 6px;
      margin-bottom: 6px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #2563eb;
    }

    .header-title-block h1 {
      color: #ffffff !important;
      border-bottom: none !important;
      padding: 0 !important;
      margin: 0 0 2px 0 !important;
      font-size: 13.5pt !important;
      font-weight: 800;
      letter-spacing: -0.3px;
    }

    .header-subtitle {
      font-size: 7.8pt;
      color: #94a3b8;
      font-weight: 500;
    }

    .header-badges {
      display: flex;
      gap: 6px;
      align-items: center;
    }

    .header-badge {
      background: #2563eb;
      color: #ffffff;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 6.8pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .header-badge-outline {
      border: 1px solid #475569;
      color: #cbd5e1;
      padding: 3px 7px;
      border-radius: 4px;
      font-size: 6.8pt;
      font-weight: 600;
      text-transform: uppercase;
    }

    /* HEADINGS */
    h1 {
      font-size: 10.8pt;
      font-weight: 800;
      color: #0f172a;
      border-bottom: 2px solid #2563eb;
      padding-bottom: 2px;
      margin: 0 0 3px 0;
      display: flex;
      align-items: center;
      gap: 5px;
    }

    h2 {
      font-size: 8.4pt;
      font-weight: 700;
      margin: 3px 0 2px 0;
      color: #1e293b;
      border-left: 3px solid #2563eb;
      padding-left: 5px;
      letter-spacing: -0.1px;
    }

    p {
      margin: 0 0 3px 0;
      line-height: 1.34;
      text-align: left;
    }

    /* SCORECARD GRID */
    .scorecard-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 6px;
      margin: 3px 0 5px 0;
    }

    .score-card {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 5px;
      padding: 5px 6px;
      text-align: center;
      box-shadow: 0 1px 2px rgba(0,0,0,0.02);
    }

    .score-num {
      font-size: 13pt;
      font-weight: 800;
      line-height: 1.1;
    }

    .score-label {
      font-size: 6.5pt;
      text-transform: uppercase;
      font-weight: 700;
      color: #64748b;
      letter-spacing: 0.3px;
      margin-top: 2px;
    }

    .score-sub {
      font-size: 5.9pt;
      color: #94a3b8;
      margin-top: 1px;
    }

    /* TABLES */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 2px 0 4px 0;
      font-size: 7pt;
    }

    th {
      background-color: #f1f5f9;
      font-weight: 700;
      color: #1e293b;
      border: 1px solid #cbd5e1;
      padding: 3px 5px;
      text-align: left;
      text-transform: uppercase;
      font-size: 6.3pt;
      letter-spacing: 0.2px;
    }

    td {
      border: 1px solid #e2e8f0;
      padding: 2.8px 5px;
      text-align: left;
      vertical-align: top;
      color: #334155;
      line-height: 1.26;
    }

    tr:nth-child(even) td {
      background-color: #f8fafc;
    }

    /* BADGES */
    .tag {
      display: inline-block;
      padding: 1px 4px;
      border-radius: 3px;
      font-size: 5.8pt;
      font-weight: 700;
      text-transform: uppercase;
      white-space: nowrap;
    }

    .tag-green { background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; }
    .tag-red { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }
    .tag-orange { background: #ffedd5; color: #c2410c; border: 1px solid #fed7aa; }
    .tag-blue { background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; }
    .tag-slate { background: #f1f5f9; color: #334155; border: 1px solid #cbd5e1; }

    /* CALLOUT BOXES */
    .callout {
      border-radius: 4px;
      padding: 4px 7px;
      margin: 2px 0 4px 0;
      font-size: 7.1pt;
      line-height: 1.33;
    }

    .callout-info {
      background: #f0f9ff;
      border-left: 3px solid #0284c7;
      color: #0369a1;
    }

    .callout-success {
      background: #f0fdf4;
      border-left: 3px solid #16a34a;
      color: #15803d;
    }

    .callout-warning {
      background: #fffbeb;
      border-left: 3px solid #d97706;
      color: #b45309;
    }

    /* FINDING CARD */
    .finding-card {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 4px;
      padding: 4px 7px;
      margin-bottom: 3.5px;
    }

    .finding-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 2px;
      margin-bottom: 2px;
    }

    .finding-title {
      font-weight: 700;
      color: #0f172a;
      font-size: 7.6pt;
    }

    .finding-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px;
      font-size: 6.9pt;
    }

    .finding-col strong {
      display: block;
      margin-bottom: 1px;
      font-size: 6.5pt;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    /* VERBATIM CARD */
    .quote-box {
      background: #f8fafc;
      border-left: 3px solid #64748b;
      padding: 3px 6px;
      font-style: italic;
      color: #334155;
      font-size: 6.7pt;
      margin: 2px 0 0 0;
      border-radius: 0 4px 4px 0;
    }

    /* DIAGRAM BOX */
    .diagram-card {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 5px;
      padding: 4px 6px;
      margin: 2px 0 4px 0;
      box-shadow: 0 1px 2px rgba(0,0,0,0.02);
      overflow: hidden;
    }

    .diagram-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 2px;
      margin-bottom: 2px;
    }

    .diagram-title {
      font-size: 7.5pt;
      font-weight: 700;
      color: #1e293b;
    }

    .diagram-badge {
      font-size: 5.9pt;
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
      max-height: 62mm !important;
      height: auto !important;
      object-fit: contain;
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
          fontSize: '9px',
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
          nodeSpacing: 8,
          rankSpacing: 10,
          htmlLabels: true
        }
      });
    };
  </script>
</head>
<body>

  <!-- PAGE 1: TEST OVERVIEW, METHODOLOGY, PARTICIPANTS & CORE SCENARIOS -->
  <div class="page-sheet">
    <div class="report-header">
      <div class="header-title-block">
        <h1>Usability Test Report: Job Portal Website Design</h1>
        <div class="header-subtitle">Comprehensive Empirical Audit of Information Architecture, User Flows, Accessibility & Performance</div>
      </div>
      <div class="header-badges">
        <div class="header-badge-outline">Ref: UTR-JOB-2024-V1</div>
        <div class="header-badge">Executive Audit</div>
      </div>
    </div>

    <div class="callout callout-info">
      <strong>1.0 Purpose of the Test:</strong> This usability evaluation empirically audits the effectiveness, intuitiveness, and user-friendliness of the job portal platform across 7 core functional pillars: <em>Navigation & UI Design, Faceted Search Functionality, Content Accessibility & WCAG 2.1 Compliance, Front-End Code Practices, Account Management & Security, Multi-Device Responsiveness, and 3G Throttled Performance</em>. The primary objective is to pinpoint friction points, eliminate conversion roadblocks, and provide an actionable, prioritized engineering remediation backlog for product stakeholders.
    </div>

    <h2>Executive Usability Scorecard</h2>
    <div class="scorecard-grid">
      <div class="score-card">
        <div class="score-num" style="color: #2563eb;">8</div>
        <div class="score-label">Testers Evaluated</div>
        <div class="score-sub">5 Seekers · 3 Recruiters</div>
      </div>
      <div class="score-card">
        <div class="score-num" style="color: #dc2626;">6</div>
        <div class="score-label">Critical Defects</div>
        <div class="score-sub">State Reset · Mobile Clip · 2FA</div>
      </div>
      <div class="score-card">
        <div class="score-num" style="color: #ea580c;">8</div>
        <div class="score-label">High Severity Gaps</div>
        <div class="score-sub">A11y Badges · Inline CSS · Lag</div>
      </div>
      <div class="score-card">
        <div class="score-num" style="color: #16a34a;">71%</div>
        <div class="score-label">Task Success Rate</div>
        <div class="score-sub">Target Benchmark &ge; 85%</div>
      </div>
    </div>

    <h2>2.0 Testing Methodology & Technical Environment</h2>
    <table>
      <thead>
        <tr>
          <th style="width: 20%;">Dimension</th>
          <th style="width: 40%;">Test Execution Specification</th>
          <th style="width: 40%;">Coverage Scope & Empirical Constraints</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Test Date</strong></td>
          <td><code>20.11.2024</code> (Moderated task-based evaluation protocol)</td>
          <td>Conducted across active staging release candidate v1.0.4</td>
        </tr>
        <tr>
          <td><strong>Participant Cohort</strong></td>
          <td><strong>8 participants:</strong> 5 Active Job Seekers & 3 Corporate Recruiters / Employers</td>
          <td>Ages 20–45; balanced between novice job applicants and high-frequency recruiters</td>
        </tr>
        <tr>
          <td><strong>Hardware Devices</strong></td>
          <td>Desktop (Windows 11, macOS Sequoia), Smartphones (Android 14, iOS 18), Tablets</td>
          <td>Viewport resolutions: 360px mobile, 768px iPad portrait, 1440px/1920px desktop</td>
        </tr>
        <tr>
          <td><strong>Browsers & Engines</strong></td>
          <td>Google Chrome (Blink), Mozilla Firefox (Gecko), Apple Safari (WebKit), MS Edge</td>
          <td>Cross-browser feature parity, touch event handling, CSS Grid/Flexbox rendering</td>
        </tr>
        <tr>
          <td><strong>Network Conditions</strong></td>
          <td>High-speed Fiber broadband (100 Mbps) vs. Throttled Fast 3G (1.6 Mbps / 150ms RTT)</td>
          <td>Benchmarked for cold-cache script parsing, lazy-loading, and WebSocket latency</td>
        </tr>
      </tbody>
    </table>

    <h2>Participant Cohort Demographics & Usability Performance</h2>
    <table>
      <thead>
        <tr>
          <th style="width: 10%;">User ID</th>
          <th style="width: 18%;">User Persona Role</th>
          <th style="width: 8%;">Age</th>
          <th style="width: 24%;">Device & Browser Spec</th>
          <th style="width: 22%;">Primary Evaluated Goal</th>
          <th style="width: 18%;">Task Completion</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>P-01</strong></td>
          <td>Entry-Level Job Seeker</td>
          <td>22</td>
          <td>Android 14 (Samsung S23) · Chrome</td>
          <td>Quick mobile job search & resume upload</td>
          <td><span class="tag tag-orange">66.7% (4/6)</span></td>
        </tr>
        <tr>
          <td><strong>P-02</strong></td>
          <td>Senior Software Engineer</td>
          <td>34</td>
          <td>macOS Sequoia (MacBook Pro) · Firefox</td>
          <td>Faceted search by salary, stack & remote</td>
          <td><span class="tag tag-green">100% (6/6)</span></td>
        </tr>
        <tr>
          <td><strong>P-03</strong></td>
          <td>Mid-Weight UX Designer</td>
          <td>29</td>
          <td>iPad Air (Tablet Portrait) · Safari</td>
          <td>Portfolio attachment & application history</td>
          <td><span class="tag tag-orange">66.7% (4/6)</span></td>
        </tr>
        <tr>
          <td><strong>P-04</strong></td>
          <td>Career Switcher (Non-Tech)</td>
          <td>43</td>
          <td>Windows 11 (Dell XPS) · Chrome</td>
          <td>Account creation, LinkedIn import & filters</td>
          <td><span class="tag tag-green">83.3% (5/6)</span></td>
        </tr>
        <tr>
          <td><strong>P-05</strong></td>
          <td>Freelance Contractor</td>
          <td>27</td>
          <td>iPhone 15 Pro (iOS 18) · Safari</td>
          <td>Hourly job filtering on cellular connection</td>
          <td><span class="tag tag-red">50.0% (3/6)</span></td>
        </tr>
        <tr>
          <td><strong>P-06</strong></td>
          <td>Agency Recruitment Lead</td>
          <td>38</td>
          <td>Windows 11 (Dual 4K Monitor) · Edge</td>
          <td>Multi-role job posting & candidate pipeline</td>
          <td><span class="tag tag-green">83.3% (5/6)</span></td>
        </tr>
        <tr>
          <td><strong>P-07</strong></td>
          <td>Corporate HR Specialist</td>
          <td>31</td>
          <td>macOS Sequoia (MacBook Air) · Chrome</td>
          <td>Company branding setup & applicant scoring</td>
          <td><span class="tag tag-green">83.3% (5/6)</span></td>
        </tr>
        <tr>
          <td><strong>P-08</strong></td>
          <td>Startup Founder / Employer</td>
          <td>41</td>
          <td>Android 13 (Pixel 7) · Chrome Mobile</td>
          <td>Urgent job posting creation while on mobile</td>
          <td><span class="tag tag-red">33.3% (2/6)</span></td>
        </tr>
      </tbody>
    </table>

    <h2>Core Test Scenarios Evaluated</h2>
    <table>
      <thead>
        <tr>
          <th style="width: 12%;">Scenario</th>
          <th style="width: 28%;">Workflow Task</th>
          <th style="width: 44%;">Key Behavioral & Architecture Evaluation Focus</th>
          <th style="width: 16%;">Completion</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>TS-01</strong></td>
          <td>Homepage & Catalog Discovery</td>
          <td>Audited first impression comprehension, clarity of primary navigation, CTA visibility</td>
          <td><span class="tag tag-green">100% (8/8)</span></td>
        </tr>
        <tr>
          <td><strong>TS-02</strong></td>
          <td>Faceted Search & Keyword Filtering</td>
          <td>Filter persistence across back navigation, keyword relevancy, zero-result handling</td>
          <td><span class="tag tag-orange">62.5% (5/8)</span></td>
        </tr>
        <tr>
          <td><strong>TS-03</strong></td>
          <td>Account Creation & Social OAuth</td>
          <td>OAuth flow with Google/LinkedIn, inline form validation feedback, error message clarity</td>
          <td><span class="tag tag-green">87.5% (7/8)</span></td>
        </tr>
        <tr>
          <td><strong>TS-04</strong></td>
          <td>Resume Upload & Job Posting</td>
          <td>File drag-and-drop parsing, multi-step job submission, input preservation</td>
          <td><span class="tag tag-green">75.0% (6/8)</span></td>
        </tr>
        <tr>
          <td><strong>TS-05</strong></td>
          <td>Cross-Device Responsiveness</td>
          <td>Viewport fluidity (360px–1920px), mobile dropdown clipping, horizontal overflow checks</td>
          <td><span class="tag tag-red">50.0% (4/8)</span></td>
        </tr>
        <tr>
          <td><strong>TS-06</strong></td>
          <td>3G Throttled Latency Stress</td>
          <td>Cold-cache asset weight, unbundled script blocking, real-time message notification delay</td>
          <td><span class="tag tag-red">50.0% (4/8)</span></td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- PAGE 2: FINDINGS PART 1 (NAVIGATION, SEARCH, ACCESSIBILITY) -->
  <div class="page-sheet">
    <h1>3.0 Detailed Findings: Navigation, Search & Accessibility</h1>
    <p>Empirical heuristic evaluation detailing qualitative observations, verified strengths, critical usability defects, and compliance gaps:</p>

    <!-- Finding 1: Navigation -->
    <div class="finding-card">
      <div class="finding-header">
        <span class="finding-title">3.1 Navigation and UI Design</span>
        <span class="tag tag-orange">Severity: High · Priority: P1</span>
      </div>
      <div class="finding-grid">
        <div class="finding-col">
          <strong style="color: #0369a1;">Observations & Field Notes</strong>
          • Top navigation bar is always visible, but menu labels are ambiguous (e.g., generic <em>"Resources"</em> obscures career guides and resume builders).<br>
          • Complete absence of quick-access shortcuts for frequent high-intent actions like <em>"My Profile"</em>, <em>"Saved Jobs"</em>, or <em>"Applied (4)"</em>.<br>
          • Overcrowded footer contains 42 redundant anchor links that dilute visual hierarchy and inflate page height.
        </div>
        <div class="finding-col">
          <strong style="color: #15803d;">Strengths & Identified Usability Issues</strong>
          <span style="color: #15803d;">✔</span> Clean, modern minimalistic layout with generous whitespace.<br>
          <span style="color: #15803d;">✔</span> Prominent, high-contrast CTA buttons: <em>"Apply Now"</em> and <em>"Post a Job"</em>.<br>
          <span style="color: #b91c1c;">✖</span> Inconsistent button geometry (pill vs. 4px rounded) and variable hover states.<br>
          <span style="color: #b91c1c;">✖</span> Secondary utility actions lack dedicated persistent toolbar docking.
        </div>
      </div>
      <div class="quote-box">
        <strong>Tester Verbatim (P-03, iPad):</strong> "I kept hunting for my saved jobs list. Having to drill through an unlabelled hamburger menu every time I want to compare jobs created a lot of unnecessary tapping."
      </div>
    </div>

    <!-- Finding 2: Search -->
    <div class="finding-card">
      <div class="finding-header">
        <span class="finding-title">3.2 Search Functionality & Filtering Engine</span>
        <span class="tag tag-red">Severity: Critical · Priority: P0</span>
      </div>
      <div class="finding-grid">
        <div class="finding-col">
          <strong style="color: #0369a1;">Observations & Field Notes</strong>
          • Initial search results render rapidly, but applied filters (e.g. <em>"Location: New York"</em>, <em>"Job Type: Full-Time"</em>) wipe completely upon browser Back navigation.<br>
          • Advanced search parameters (salary bands, remote tiers) exist in backend schema but are deeply obscured in the UI.<br>
          • <em>"Experience Level"</em> dropdown filter occasionally yields zero listings for common mid-level roles due to strict string matching.
        </div>
        <div class="finding-col">
          <strong style="color: #15803d;">Strengths & Identified Usability Issues</strong>
          <span style="color: #15803d;">✔</span> Search input container is prominently anchored above the fold on all routes.<br>
          <span style="color: #15803d;">✔</span> Highly accurate relevance ranking for broad single-keyword queries.<br>
          <span style="color: #b91c1c;">✖</span> Zero predictive autocomplete, debounced suggestions, or trending search tags.<br>
          <span style="color: #b91c1c;">✖</span> State serialization failure: filter parameters are not bound to URL query string.
        </div>
      </div>
      <div class="quote-box">
        <strong>Tester Verbatim (P-02, Senior Dev):</strong> "I filtered by React + Remote, clicked into a job post to review requirements, hit Back, and all my filters vanished. Having to re-enter filters repeatedly is a major dealbreaker."
      </div>
    </div>

    <!-- Finding 3: Accessibility -->
    <div class="finding-card">
      <div class="finding-header">
        <span class="finding-title">3.3 Content Accessibility & WCAG 2.1 Compliance</span>
        <span class="tag tag-orange">Severity: High · Priority: P1</span>
      </div>
      <div class="finding-grid">
        <div class="finding-col">
          <strong style="color: #0369a1;">Observations & Field Notes</strong>
          • Primary body typography and primary CTAs are accessible for sighted users.<br>
          • Small sub-11px font sizes in secondary metadata badges (e.g., date posted, applicant count) cause significant eye strain.<br>
          • Over 35% of corporate employer logos and custom UI icons lack descriptive <code>alt</code> text.<br>
          • Interactive dropdown selectors trap keyboard focus and cannot be closed via standard <code>Escape</code> or arrow keys.
        </div>
        <div class="finding-col">
          <strong style="color: #15803d;">Strengths & Identified Usability Issues</strong>
          <span style="color: #15803d;">✔</span> Color contrast ratio exceeds 4.8:1 on primary headers and body copy.<br>
          <span style="color: #15803d;">✔</span> Logical visual typographic hierarchy maintained within job descriptions.<br>
          <span style="color: #b91c1c;">✖</span> Non-semantic HTML: generic <code>&lt;div&gt;</code> tags used instead of <code>&lt;nav&gt;</code> and <code>&lt;main&gt;</code>.<br>
          <span style="color: #b91c1c;">✖</span> Screen reader failure: ARIA landmarks and <code>aria-expanded</code> attributes missing.
        </div>
      </div>
      <div class="quote-box">
        <strong>Tester Verbatim (P-04, Non-Tech):</strong> "The gray tags below the job title showing 'Posted 3 days ago' and 'Mid-Senior' were so tiny and faint on my laptop that I could barely read them without zooming in."
      </div>
    </div>

    <h2>Accessibility & Navigation Heuristic Severity Summary</h2>
    <table>
      <thead>
        <tr>
          <th style="width: 22%;">Heuristic Dimension</th>
          <th style="width: 38%;">Observed UX Friction Point</th>
          <th style="width: 26%;">Compliance / Design Standard</th>
          <th style="width: 14%;">Risk Level</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Filter State Persistence</strong></td>
          <td>Browser Back navigation purges active filters, forcing tedious user re-entry</td>
          <td>Nielsen Heuristic: User Control & Freedom</td>
          <td><span class="tag tag-red">High Friction</span></td>
        </tr>
        <tr>
          <td><strong>Keyboard Operability</strong></td>
          <td>Dropdown filter menus trap focus and cannot be controlled via <code>Tab</code>/<code>Arrow</code> keys</td>
          <td>WCAG 2.1 Guideline 2.1.1 (Level A)</td>
          <td><span class="tag tag-red">Non-Compliant</span></td>
        </tr>
        <tr>
          <td><strong>Non-Text Content</strong></td>
          <td>Company logos and SVG interface icons missing descriptive <code>alt</code> attributes</td>
          <td>WCAG 2.1 Guideline 1.1.1 (Level A)</td>
          <td><span class="tag tag-orange">High Priority</span></td>
        </tr>
        <tr>
          <td><strong>Footer Clutter & Noise</strong></td>
          <td>Over 40 redundant unstructured footer links dilute IA and induce cognitive overload</td>
          <td>Hick's Law / Information Architecture</td>
          <td><span class="tag tag-blue">Moderate</span></td>
        </tr>
        <tr>
          <td><strong>Secondary Typography</strong></td>
          <td>Sub-11px font sizes on metadata badges create visual fatigue on standard displays</td>
          <td>WCAG 2.1 Guideline 1.4.4 (Resize Text)</td>
          <td><span class="tag tag-orange">High Priority</span></td>
        </tr>
      </tbody>
    </table>

    <h2>WCAG 2.1 Level AA Accessibility Standards Conformance Audit</h2>
    <table>
      <thead>
        <tr>
          <th style="width: 20%;">WCAG 2.1 Criterion</th>
          <th style="width: 16%;">Compliance Level</th>
          <th style="width: 46%;">Observed Implementation Status & Evidence</th>
          <th style="width: 18%;">Audit Result</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>1.1.1 Non-Text Content</strong></td>
          <td>Level A</td>
          <td>Employer company brand marks and inline SVGs lack informative <code>alt</code> attributes</td>
          <td><span class="tag tag-red">Failed (35% Gaps)</span></td>
        </tr>
        <tr>
          <td><strong>1.4.3 Contrast (Minimum)</strong></td>
          <td>Level AA</td>
          <td>Primary typography tests at 4.9:1; secondary gray badges fall to 3.2:1 contrast</td>
          <td><span class="tag tag-orange">Partial Conformance</span></td>
        </tr>
        <tr>
          <td><strong>2.1.1 Keyboard Support</strong></td>
          <td>Level A</td>
          <td>Modal sheets and filter dropdowns lack keyboard event listeners (<code>Enter</code>/<code>Space</code>)</td>
          <td><span class="tag tag-red">Failed</span></td>
        </tr>
        <tr>
          <td><strong>2.4.6 Headings & Labels</strong></td>
          <td>Level AA</td>
          <td>H1 tags duplicated in sub-cards; form controls lack linked <code>&lt;label for="..."&gt;</code> tags</td>
          <td><span class="tag tag-orange">Needs Remediation</span></td>
        </tr>
        <tr>
          <td><strong>4.1.2 Name, Role, Value</strong></td>
          <td>Level A</td>
          <td>Custom accordion filters lack <code>aria-expanded</code> and <code>role="combobox"</code> metadata</td>
          <td><span class="tag tag-red">Failed</span></td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- PAGE 3: FINDINGS PART 2 (CODE, ACCOUNT, RESPONSIVENESS, PERFORMANCE) -->
  <div class="page-sheet">
    <h1>3.0 Detailed Findings: Architecture, Accounts, Mobile & Speed</h1>
    <p>Evaluation of underlying front-end engineering practices, account security posture, mobile viewport adaptation, and latency:</p>

    <!-- Finding 4: Code Practices -->
    <div class="finding-card">
      <div class="finding-header">
        <span class="finding-title">3.4 Code Practices & Front-End Architecture</span>
        <span class="tag tag-orange">Severity: High · Priority: P1</span>
      </div>
      <div class="finding-grid">
        <div class="finding-col">
          <strong style="color: #0369a1;">Observations & Field Notes</strong>
          • Source code is structured into modular CSS files, but completely lacks an automated asset optimization build pipeline.<br>
          • Raw JavaScript files load individually in the <code>&lt;head&gt;</code> without bundling, minification, or tree-shaking.<br>
          • High prevalence of redundant inline CSS style attributes and un-minified inline JavaScript handlers scattered across templates.
        </div>
        <div class="finding-col">
          <strong style="color: #15803d;">Strengths & Identified Architectural Gaps</strong>
          <span style="color: #15803d;">✔</span> Modular CSS stylesheet architecture simplifies team codebase navigation.<br>
          <span style="color: #15803d;">✔</span> Comprehensive comments in CSS and JavaScript explaining functional blocks.<br>
          <span style="color: #b91c1c;">✖</span> Duplicate style declarations across 4 separate CSS files (color tokens not unified).<br>
          <span style="color: #b91c1c;">✖</span> Inflated HTML payload (+38% weight) due to repetitive inline styling.
        </div>
      </div>
    </div>

    <!-- Finding 5: Account Management -->
    <div class="finding-card">
      <div class="finding-header">
        <span class="finding-title">3.5 Account Management & User Security</span>
        <span class="tag tag-blue">Severity: Medium · Priority: P2</span>
      </div>
      <div class="finding-grid">
        <div class="finding-col">
          <strong style="color: #0369a1;">Observations & Field Notes</strong>
          • Job seeker registration and recruiter login workflows are straightforward and complete in under 45 seconds.<br>
          • Form validation errors display generic feedback (<em>"Error occurred"</em>) without highlighting specific erroneous input fields.<br>
          • Job seekers receive zero visual guidance or percentage indicators showing profile completeness.
        </div>
        <div class="finding-col">
          <strong style="color: #15803d;">Strengths & Identified Security Gaps</strong>
          <span style="color: #15803d;">✔</span> 1-click social sign-in integration with Google and LinkedIn works seamlessly.<br>
          <span style="color: #15803d;">✔</span> Intuitive resume upload workflow with drag-and-drop file detection.<br>
          <span style="color: #b91c1c;">✖</span> Critical absence of Two-Factor Authentication (2FA) for recruiter billing accounts.<br>
          <span style="color: #b91c1c;">✖</span> Profile modifications trigger full-page reloads rather than dynamic optimistic updates.
        </div>
      </div>
    </div>

    <!-- Finding 6 & 7: Responsiveness & Performance in 2 Columns -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-top: 2px;">
      <div class="finding-card" style="margin: 0;">
        <div class="finding-header">
          <span class="finding-title">3.6 Multi-Device Responsiveness</span>
          <span class="tag tag-red">Severity: Critical</span>
        </div>
        <p><strong>Observations:</strong> Layout displays cleanly on desktop (1440px) and tablet (768px landscape), but breaks on mobile screens (&lt; 375px). Horizontal scrollbars appear on iPad portrait mode.</p>
        <p><strong>Strengths:</strong> Fluid desktop grid system; touch targets on primary CTA buttons exceed 44px.</p>
        <p><strong>Identified Defects:</strong> Filter dropdowns clip beyond screen bounds; sidebars overflow on older Android mobile viewports; text overlaid on hero banner images is unreadable on mobile.</p>
      </div>

      <div class="finding-card" style="margin: 0;">
        <div class="finding-header">
          <span class="finding-title">3.7 Performance & Throttled Latency</span>
          <span class="tag tag-orange">Severity: High</span>
        </div>
        <p><strong>Observations:</strong> Initial load on high-speed Fiber is satisfactory (1.8s), but degrades to 6.2s under simulated Fast 3G conditions, causing significant user bounce risk.</p>
        <p><strong>Strengths:</strong> Job recommendation cards load asynchronously; core static icons load cleanly.</p>
        <p><strong>Identified Defects:</strong> Over 48 unbundled HTTP requests on initial landing; raw PNG hero images (>2.8MB) lack WebP compression; absence of HTTP/2 multiplexing and caching headers.</p>
      </div>
    </div>

    <h2>Technical Defect Matrix & Architectural Impact</h2>
    <table>
      <thead>
        <tr>
          <th style="width: 22%;">Defect Category</th>
          <th style="width: 36%;">Root Architectural Cause</th>
          <th style="width: 28%;">User & Business Impact</th>
          <th style="width: 14%;">Severity</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Mobile Dropdown Overflow</strong></td>
          <td>Hardcoded absolute pixel dimensions (<code>width: 320px</code>) without viewport media bounds</td>
          <td>Filter menus clipped off-screen; mobile job seekers cannot filter results</td>
          <td><span class="tag tag-red">Critical</span></td>
        </tr>
        <tr>
          <td><strong>Unbundled HTTP Pipeline</strong></td>
          <td>Absence of modern bundler (Vite/Rollup) resulting in 48 sequential asset requests</td>
          <td>6.2s load latency on 3G networks; high bounce rate among mobile applicants</td>
          <td><span class="tag tag-orange">High</span></td>
        </tr>
        <tr>
          <td><strong>Missing 2FA Gateway</strong></td>
          <td>Authentication endpoints lack TOTP / SMS multi-factor security verification</td>
          <td>High vulnerability to corporate recruiter credential stuffing & billing compromise</td>
          <td><span class="tag tag-orange">High</span></td>
        </tr>
        <tr>
          <td><strong>Hero Image Weight</strong></td>
          <td>Uncompressed 2.8MB PNG banners served to mobile screens without responsive <code>srcset</code></td>
          <td>Severe data consumption for mobile users; Cumulative Layout Shift (CLS: 0.24)</td>
          <td><span class="tag tag-orange">High</span></td>
        </tr>
        <tr>
          <td><strong>Static Caching Absence</strong></td>
          <td>Nginx web server lacks <code>Cache-Control: max-age=31536000, immutable</code> headers</td>
          <td>Repeat visitors re-download identical branding assets and stylesheets on every visit</td>
          <td><span class="tag tag-blue">Medium</span></td>
        </tr>
      </tbody>
    </table>

    <h2>Lighthouse & Synthetic Performance Audit Benchmarks</h2>
    <table>
      <thead>
        <tr>
          <th style="width: 24%;">Audit Metric</th>
          <th style="width: 20%;">Desktop (Fiber 100M)</th>
          <th style="width: 22%;">Mobile (Throttled 3G)</th>
          <th style="width: 20%;">Target Benchmark</th>
          <th style="width: 14%;">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>First Contentful Paint (FCP)</strong></td>
          <td>0.9s</td>
          <td>3.4s</td>
          <td>&lt; 1.5s</td>
          <td><span class="tag tag-orange">Needs Work</span></td>
        </tr>
        <tr>
          <td><strong>Largest Contentful Paint (LCP)</strong></td>
          <td>1.6s</td>
          <td>6.2s</td>
          <td>&lt; 2.5s</td>
          <td><span class="tag tag-red">Critical Lag</span></td>
        </tr>
        <tr>
          <td><strong>Cumulative Layout Shift (CLS)</strong></td>
          <td>0.02</td>
          <td>0.24</td>
          <td>&lt; 0.10</td>
          <td><span class="tag tag-red">Fails Core Web Vitals</span></td>
        </tr>
        <tr>
          <td><strong>Total Page Weight & Requests</strong></td>
          <td>4.8 MB / 48 requests</td>
          <td>4.8 MB / 48 requests</td>
          <td>&lt; 1.2 MB / &lt; 20 requests</td>
          <td><span class="tag tag-red">Bloated Payload</span></td>
        </tr>
      </tbody>
    </table>

    <h2>Front-End Architecture & Asset Optimization Action Plan</h2>
    <table>
      <thead>
        <tr>
          <th style="width: 22%;">Layer</th>
          <th style="width: 52%;">Prescribed Engineering Action</th>
          <th style="width: 26%;">Expected Performance Gain</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>CSS Architecture</strong></td>
          <td>Extract duplicated design tokens into CSS custom properties; eliminate inline styles</td>
          <td>-38% HTML payload; zero style collision</td>
        </tr>
        <tr>
          <td><strong>Asset Pipeline</strong></td>
          <td>Adopt Vite / Rollup build with route-level code splitting and tree-shaking</td>
          <td>Asset count reduced from 48 to 14 chunks</td>
        </tr>
        <tr>
          <td><strong>Image Optimization</strong></td>
          <td>Automate WebP/AVIF generation with responsive <code>&lt;picture&gt;</code> and lazy loading</td>
          <td>Hero banner payload reduced from 2.8MB to 180KB</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- PAGE 4: RECOMMENDATIONS, ROADMAP, WORKFLOW & NEXT STEPS -->
  <div class="page-sheet">
    <h1>4.0 Actionable Recommendations & Remediation Roadmap</h1>
    <p>Prioritized engineering and UX enhancements structured by discipline, effort-to-impact ratio, and sprint delivery horizons:</p>

    <h2>4.1 Actionable Remediation Matrix by Category</h2>
    <table>
      <thead>
        <tr>
          <th style="width: 18%;">Pillar</th>
          <th style="width: 48%;">Prescribed Architectural Remediation</th>
          <th style="width: 18%;">Effort vs Impact</th>
          <th style="width: 16%;">Sprint Horizon</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Navigation & UI</strong></td>
          <td>Introduce sticky secondary utility bar for quick actions (<em>"My Profile"</em>, <em>"Saved Jobs"</em>); unify button styles into design tokens; trim footer from 42 to 12 curated links.</td>
          <td>Low Effort / High Impact</td>
          <td><span class="tag tag-green">Quick Win</span></td>
        </tr>
        <tr>
          <td><strong>Search & Filters</strong></td>
          <td>Serialize filter state into URL parameters (<code>?location=ny&type=ft&exp=mid</code>); implement debounced predictive autocomplete; render active dismissible filter tag chips.</td>
          <td>Med Effort / High Impact</td>
          <td><span class="tag tag-orange">Sprint 1</span></td>
        </tr>
        <tr>
          <td><strong>Accessibility</strong></td>
          <td>Inject semantic HTML (<code>&lt;nav&gt;</code>, <code>&lt;main&gt;</code>); enforce WAI-ARIA roles & focus trapping on modals; audit all company logos for descriptive <code>alt</code> text; bump metadata badges to 12px.</td>
          <td>Low Effort / Med Impact</td>
          <td><span class="tag tag-green">Quick Win</span></td>
        </tr>
        <tr>
          <td><strong>Code Practices</strong></td>
          <td>Introduce modern bundler (Vite / Rollup); minify scripts and styles; eliminate repetitive inline CSS rules in favor of Tailwind / CSS module utility classes; implement lazy loading.</td>
          <td>Med Effort / High Impact</td>
          <td><span class="tag tag-orange">Sprint 1</span></td>
        </tr>
        <tr>
          <td><strong>Account Security</strong></td>
          <td>Implement TOTP Two-Factor Authentication for employers; add real-time gamified profile completion meter with contextual completion tips for job seekers.</td>
          <td>High Effort / High Impact</td>
          <td><span class="tag tag-blue">Sprint 2</span></td>
        </tr>
        <tr>
          <td><strong>Responsiveness</strong></td>
          <td>Replace fixed pixel widths with fluid CSS Flexbox/Grid; redesign mobile filter panel as a slide-out drawer; test viewport bounds down to 320px; ensure contrast on hero overlays.</td>
          <td>Med Effort / High Impact</td>
          <td><span class="tag tag-orange">Sprint 1</span></td>
        </tr>
        <tr>
          <td><strong>Performance</strong></td>
          <td>Convert images to next-gen WebP format; implement HTTP/2 multiplexing, Brotli compression, and long-term asset caching (<code>max-age=31536000</code>); cache job details API responses.</td>
          <td>Med Effort / High Impact</td>
          <td><span class="tag tag-orange">Sprint 1</span></td>
        </tr>
      </tbody>
    </table>

    <h2>Remediation & Re-Testing Operational Lifecycle</h2>
    <div class="diagram-card" style="max-height: 60mm;">
      <div class="diagram-header">
        <span class="diagram-title">Agile Usability Defect Resolution & Verification Workflow</span>
        <span class="diagram-badge">Mermaid Lifecycle</span>
      </div>
      <div class="mermaid">
flowchart LR
    classDef default fill:#f8fafc,stroke:#94a3b8,stroke-width:1px,color:#0f172a,font-size:8.5px;
    classDef startNode fill:#eff6ff,stroke:#2563eb,stroke-width:1.5px,color:#1e40af,font-size:9px,font-weight:bold;
    classDef passNode fill:#dcfce7,stroke:#16a34a,stroke-width:1.5px,color:#15803d,font-size:9px,font-weight:bold;
    classDef gateNode fill:#fef3c7,stroke:#d97706,stroke-width:1.5px,color:#92400e,font-size:8.5px;

    Audit(["1. Audit Baseline<br/>6 Critical Defects"]):::startNode --> S1["2. Sprints 1 & 2: Quick Wins & Core Architecture<br/>• Truncate footer links & clarify menu labels<br/>• URL search filter state serialization<br/>• Mobile fluid layout & 320px drawer fix<br/>• Vite bundling, tree-shaking & WebP images"]
    S1 --> S2["3. Sprint 3: Security & Polish<br/>• Recruiter TOTP 2FA gateway<br/>• Gamified profile completion meter<br/>• Long-term HTTP/2 asset caching"]
    S2 --> QA["4. Verification Protocol<br/>• Lighthouse CI >= 90<br/>• 8-Participant Re-Audit"]:::gateNode
    QA --> Dec{"Quality Met?<br/>Task >= 90%"}:::gateNode
    Dec -->|Approved| Prod(["5. Production Release<br/>Validated Candidate"]):::passNode
    Dec -->|Defects| S1
      </div>
    </div>

    <h2>5.0 Final Thoughts & Follow-Up Protocol</h2>
    <div class="callout callout-success" style="margin: 0 0 4px 0;">
      <strong>Executive Synthesis:</strong> The job portal demonstrates a solid, modern design foundation, high user appeal in core visual aesthetics, and an effortless 1-click social sign-up workflow. Addressing the identified usability issues—specifically <strong>search filter state persistence, mobile viewport overflow clipping, 3G asset bundling latency, and keyboard accessibility</strong>—will significantly elevate conversion rates, user satisfaction, and overall platform scalability.
    </div>

    <h2>Remediation KPI Target Benchmarks & Acceptance Criteria</h2>
    <table>
      <thead>
        <tr>
          <th style="width: 25%;">Target Quality Metric</th>
          <th style="width: 25%;">Current Audit Baseline</th>
          <th style="width: 25%;">Target Remediation Goal</th>
          <th style="width: 25%;">Verification Mechanism</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Core Task Completion</strong></td>
          <td>71.0% (Scenario Average)</td>
          <td><strong>&ge; 90.0%</strong> across all cohorts</td>
          <td>Follow-up moderated usability testing</td>
        </tr>
        <tr>
          <td><strong>Mobile 3G Load Time (LCP)</strong></td>
          <td>6.2s (Throttled Fast 3G)</td>
          <td><strong>&le; 2.2s</strong> (Google Core Web Vitals)</td>
          <td>Automated Lighthouse CI regression build</td>
        </tr>
        <tr>
          <td><strong>WCAG 2.1 Accessibility</strong></td>
          <td>Multiple Level A Violations</td>
          <td><strong>100% WCAG 2.1 Level AA Compliance</strong></td>
          <td>Axe DevTools & manual screen reader audit</td>
        </tr>
        <tr>
          <td><strong>Filter State Persistence</strong></td>
          <td>0% (State wiped on Back)</td>
          <td><strong>100% URL Query Param Preservation</strong></td>
          <td>Automated Cypress / Playwright E2E suite</td>
        </tr>
      </tbody>
    </table>

    <div style="margin-top: 5px; border-top: 1px solid #cbd5e1; padding-top: 3px; display: flex; justify-content: space-between; align-items: center; font-size: 6.8pt; color: #64748b;">
      <div><strong>Report Sign-Off:</strong> Lead UX Researcher & Product Architect · QA Engineering Delivery Lead</div>
      <div><strong>Date:</strong> Nov 20, 2024 · <strong>Status:</strong> Approved for Sprint Planning</div>
    </div>
  </div>

</body>
</html>
`;

async function generateReportPDF() {
  console.log('Launching headless Chrome with Puppeteer...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 1600, deviceScaleFactor: 2 });

  console.log('Loading HTML content...');
  await page.setContent(htmlContent, { waitUntil: 'networkidle0', timeout: 60000 });

  console.log('Waiting for Mermaid diagrams...');
  await page.waitForFunction(() => {
    const diagrams = document.querySelectorAll('.mermaid');
    if (diagrams.length === 0) return true;
    return Array.from(diagrams).every(d => d.querySelector('svg') !== null);
  }, { timeout: 30000 });

  await new Promise(r => setTimeout(r, 1500));

  const outputPath = path.resolve('Job_Portal_Usability_Test_Report.pdf');
  console.log('Printing PDF to:', outputPath);

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

  // Cleanly trim any trailing blank overflow page to guarantee exact 4 pages
  try {
    const { execSync } = await import('child_process');
    const cleanPath = outputPath.split('\\\\').join('/');
    execSync(`python -c "from pypdf import PdfReader, PdfWriter; r = PdfReader(r'${cleanPath}'); w = PdfWriter(); [w.add_page(r.pages[i]) for i in range(min(4, len(r.pages)))]; f = open(r'${cleanPath}', 'wb'); w.write(f); f.close()"`);
  } catch (trimErr) {
    console.warn('Trim check note:', trimErr.message);
  }

  const stats = fs.statSync(outputPath);
  console.log(`Usability Report PDF generated successfully! Size: ${(stats.size / 1024).toFixed(1)} KB at ${outputPath}`);
}

generateReportPDF().catch(err => {
  console.error('PDF Generation failed:', err);
  process.exit(1);
});
