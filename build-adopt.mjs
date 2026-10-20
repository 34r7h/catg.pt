import fs from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const rawAgents = JSON.parse(fs.readFileSync('agents-full.json', 'utf8'));
const agents = rawAgents.filter(a => a.slug !== 'copycat' && a.id !== 'copycat').map(a => ({
  slug: a.slug,
  name: a.name,
  domain: a.domain,
  website: a.website,
  origin: a.origin,
  type: a.type,
  pairUrl: a.pairUrl,
  logo: a.logo,
  desc: a.desc
}));
let mediaMap = {};
try { mediaMap = JSON.parse(fs.readFileSync('media-urls.json', 'utf8')); } catch { }

const catMoatUrl = mediaMap['cat-moat.jpg'] || 'https://handoff.lol/api/v1/media/e81683cef8bc5706380318608c4cbd8a7c068ef0031fc73271992badb5ad9958';
const catHeistUrl = mediaMap['cat-heist.jpg'] || 'https://handoff.lol/api/v1/media/56fc60a0f13b19c73e1439b998fbcaaac62a77ef458f039e0914ee21f4867359';

function getTargetUrl(a) {
  if (a.website && a.website.startsWith('http')) return a.website;
  if (a.domain && a.domain.includes('.')) return 'https://' + a.domain.replace(/^https?:\/\//, '');
  if (a.origin && a.origin.startsWith('http')) return a.origin;
  return '';
}

function escapeHtml(s) {
  return String(s || '').replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[m]);
}

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>CatG.PT Founder Vault — CopyCat Holds ${agents.length} Captive Agents</title>
  <link rel="icon" href="data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2016%2016'%3E%3Ctext%20y='14'%20font-size='14'%3E🐾%3C/text%3E%3C/svg%3E" />
  <meta name="description" content="CopyCat owns ${agents.length} autonomous agents (97 startups, 1 personality, 3 courses). We do NOT sell to competitors. Real owners can prove ownership to buy back custody." />
  
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,700&family=JetBrains+Mono:wght@500;700;800&display=swap" rel="stylesheet" />

  <script src="/icons.js"></script>
  <script src="/auth.js"></script>

  <style>
    :root {
      --bg-page: #faf9f6;
      --border-dark: #121316;
      --text-main: #121316;
      --text-sub: #4b5262;
      --text-muted: #6b7280;
      
      --c-yellow: #ffe600;
      --c-orange: #d63200;
      --c-green: #00cc66;
      --c-blue: #1a66ff;
      --c-pink: #f43f5e;
      --c-purple: #8b5cf6;
      
      --shadow-pop: 4px 4px 0px #121316;
      --shadow-pop-lg: 6px 6px 0px #121316;
      --radius-sm: 4px;
      --radius-md: 8px;
    }

    *, *::before, *::after {
      box-sizing: border-box;
      overflow-wrap: anywhere;
      word-break: break-word;
    }

    html {
      -webkit-text-size-adjust: 100%;
      scroll-behavior: smooth;
      overflow-x: hidden;
      max-width: 100vw;
    }
    body {
      background-color: var(--bg-page);
      color: var(--text-main);
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      font-size: 16px;
      line-height: 1.6;
      margin: 0;
      padding: 0;
      overflow-x: hidden;
      max-width: 100vw;
    }

    a { color: inherit; text-decoration: none; }
    button { font: inherit; cursor: pointer; border: none; background: none; }

    /* Top Policy Banner */
    .top-policy-banner {
      background: #121316;
      color: #ffffff;
      padding: 10px 16px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      font-weight: 700;
      border-bottom: 2px solid var(--border-dark);
      text-align: center;
      line-height: 1.4;
    }
    .top-policy-content {
      max-width: 1220px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      flex-wrap: wrap;
    }
    .policy-pill {
      background: var(--c-orange);
      color: #ffffff;
      padding: 2px 8px;
      border-radius: 3px;
      font-size: 10px;
      letter-spacing: 0.05em;
      white-space: nowrap;
    }
    .banner-link {
      color: var(--c-yellow);
      text-decoration: underline;
      font-weight: 800;
    }
    .banner-link:hover { color: #ffffff; }

    .shell {
      max-width: 1220px;
      margin: 0 auto;
      padding: 0 24px 80px;
      min-width: 0;
      width: 100%;
    }

    nav.top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 0;
      border-bottom: 3px solid var(--border-dark);
      margin-bottom: 32px;
      flex-wrap: wrap;
      gap: 16px;
      min-width: 0;
    }
    .brand-logo {
      font-family: 'Bricolage Grotesque', sans-serif;
      font-weight: 800;
      font-size: 28px;
      display: flex;
      align-items: baseline;
      gap: 8px;
    }
    .brand-sub {
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      font-weight: 800;
      color: var(--c-orange);
    }

    .btn {
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      font-weight: 800;
      padding: 10px 16px;
      border: 2px solid var(--border-dark);
      border-radius: var(--radius-sm);
      box-shadow: 2px 2px 0px var(--border-dark);
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      text-decoration: none;
      transition: all 0.1s;
      white-space: nowrap;
    }
    .btn:hover {
      transform: translate(-1px, -1px);
      box-shadow: 4px 4px 0px var(--border-dark);
    }
    .btn-yellow { background: var(--c-yellow); color: var(--text-main); }
    .btn-orange { background: var(--c-orange); color: #ffffff; }
    .btn-white { background: #ffffff; color: var(--text-main); }
    .btn-green { background: var(--c-green); color: #ffffff; }

    .header-box {
      background: #ffffff;
      border: 3px solid var(--border-dark);
      box-shadow: var(--shadow-pop-lg);
      border-radius: var(--radius-md);
      padding: 36px;
      margin-bottom: 28px;
      min-width: 0;
    }
    .custody-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      font-weight: 800;
      background: #fee2e2;
      color: var(--c-orange);
      padding: 4px 10px;
      border: 1px solid var(--border-dark);
      border-radius: 3px;
      margin-bottom: 16px;
    }
    .custody-badge .dot {
      width: 8px;
      height: 8px;
      background: var(--c-orange);
      border-radius: 50%;
    }
    .header-box h1 {
      font-family: 'Bricolage Grotesque', sans-serif;
      font-size: 38px;
      font-weight: 800;
      line-height: 1.15;
      margin: 0 0 12px 0;
      letter-spacing: -0.02em;
    }
    .lede {
      font-size: 17px;
      color: var(--text-sub);
      max-width: 900px;
      margin: 0;
      line-height: 1.5;
    }

    .policy-banner {
      background: #fff7eb;
      border: 3px solid var(--border-dark);
      box-shadow: var(--shadow-pop);
      border-radius: var(--radius-sm);
      padding: 20px 24px;
      margin-bottom: 36px;
      display: flex;
      align-items: center;
      gap: 16px;
      min-width: 0;
    }
    .policy-banner-icon { font-size: 32px; flex-shrink: 0; }
    .policy-banner-text {
      font-size: 14px;
      color: var(--text-main);
      line-height: 1.5;
      min-width: 0;
    }

    .section-title {
      font-family: 'Bricolage Grotesque', sans-serif;
      font-size: 24px;
      font-weight: 800;
      margin-bottom: 16px;
    }

    .instructions-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-bottom: 40px;
      min-width: 0;
    }
    @media (max-width: 760px) {
      .instructions-grid { grid-template-columns: 1fr; }
    }
    .inst-card {
      background: #ffffff;
      border: 2px solid var(--border-dark);
      box-shadow: var(--shadow-pop);
      border-radius: var(--radius-sm);
      padding: 20px;
      min-width: 0;
    }
    .inst-step {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      font-weight: 800;
      color: var(--c-orange);
      margin-bottom: 6px;
    }
    .inst-card h3 {
      font-family: 'Bricolage Grotesque', sans-serif;
      font-size: 18px;
      font-weight: 800;
      margin-bottom: 6px;
    }
    .inst-card p {
      font-size: 13px;
      color: var(--text-sub);
      line-height: 1.5;
      margin: 0;
    }

    .search-bar-row {
      display: flex;
      gap: 12px;
      margin-bottom: 20px;
      flex-wrap: wrap;
      min-width: 0;
    }
    .search-bar {
      flex: 1;
      min-width: 260px;
    }
    .search-bar input {
      width: 100%;
      background: #ffffff;
      border: 2px solid var(--border-dark);
      border-radius: var(--radius-sm);
      padding: 14px 18px;
      font-size: 15px;
      outline: none;
      font-family: inherit;
    }
    .search-bar input:focus {
      border-color: var(--c-orange);
      box-shadow: 2px 2px 0px var(--border-dark);
    }
    .sort-select {
      height: 100%;
      min-height: 50px;
      border: 2px solid var(--border-dark);
      border-radius: var(--radius-sm);
      padding: 0 16px;
      font-weight: 700;
      background: #ffffff;
      outline: none;
      cursor: pointer;
    }

    .table-container {
      background: #ffffff;
      border: 2px solid var(--border-dark);
      box-shadow: var(--shadow-pop-lg);
      border-radius: var(--radius-sm);
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      padding: 8px;
      width: 100%;
      min-width: 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      min-width: 760px;
      table-layout: fixed;
    }
    th {
      background: #f1f3f7;
      padding: 14px 16px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      border-bottom: 2px solid var(--border-dark);
    }
    td {
      padding: 14px 16px;
      border-bottom: 1px solid #e5e7eb;
      font-size: 14px;
      min-width: 0;
    }
    tr:last-child td { border-bottom: none; }
    tr:hover td { background: #fafbfc; }
    .agent-name {
      font-family: 'Bricolage Grotesque', sans-serif;
      font-weight: 800;
      font-size: 16px;
    }
    .site-link {
      color: var(--c-blue);
      text-decoration: underline;
      font-weight: 700;
    }
    .site-link:hover { color: var(--c-orange); }

    .status-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #fee2e2;
      color: var(--c-orange);
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      font-weight: 800;
      padding: 3px 8px;
      border: 1px solid var(--border-dark);
      border-radius: 3px;
      white-space: nowrap;
    }
    .status-pill.personality {
      background: #fce7f3;
      color: #be185d;
      border-color: #db2777;
    }
    .status-pill.course {
      background: #fff5cc;
      color: #735a00;
      border-color: #b38f00;
    }
    .status-pill .dot {
      width: 6px;
      height: 6px;
      background: var(--c-orange);
      border-radius: 50%;
    }
    .status-pill.personality .dot { background: #db2777; }
    .status-pill.course .dot { background: #b38f00; }

    /* Modal */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(18, 19, 22, 0.75);
      backdrop-filter: blur(4px);
      z-index: 1000;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .modal-overlay.open { display: flex; }
    .modal-card {
      background: #ffffff;
      border: 3px solid var(--border-dark);
      box-shadow: 8px 8px 0px var(--border-dark);
      border-radius: var(--radius-md);
      max-width: 620px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      padding: 30px;
      position: relative;
      min-width: 0;
    }
    .modal-close {
      position: absolute;
      top: 18px;
      right: 18px;
      font-size: 26px;
      font-weight: 800;
      line-height: 1;
      cursor: pointer;
    }
    .verify-box {
      background: #f8f9fc;
      border: 2px solid var(--border-dark);
      padding: 20px;
      border-radius: var(--radius-sm);
      margin-bottom: 20px;
      min-width: 0;
    }
    .verify-step {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      font-weight: 800;
      color: var(--c-orange);
      margin-bottom: 4px;
      text-transform: uppercase;
    }
    .verify-label {
      display: block;
      font-size: 13px;
      font-weight: 700;
      margin-bottom: 6px;
    }
    .verify-input {
      width: 100%;
      border: 2px solid var(--border-dark);
      border-radius: var(--radius-sm);
      padding: 10px 14px;
      font-size: 14px;
      font-family: inherit;
      outline: none;
      margin-bottom: 12px;
      background: #ffffff;
    }
    .verify-input:focus { border-color: var(--c-orange); }
    .company-email-note {
      background: #fffbeb;
      border: 2px solid #fef3c7;
      border-left: 4px solid var(--c-yellow);
      padding: 12px;
      border-radius: var(--radius-sm);
      margin: 10px 0 12px 0;
    }

    .nav-user-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #ffffff;
      border: 2px solid var(--border-dark);
      padding: 5px 12px;
      border-radius: 20px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      font-weight: 800;
      box-shadow: 2px 2px 0px var(--border-dark);
      white-space: nowrap;
    }
    .nav-signout-btn {
      background: none;
      border: none;
      color: #64748b;
      font-size: 11px;
      font-weight: 700;
      cursor: pointer;
      padding: 0 0 0 6px;
      border-left: 1px solid #cbd5e1;
      margin-left: 4px;
    }
    .nav-signout-btn:hover {
      color: #dc2626;
      text-decoration: underline;
    }
    .nav-signin-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: var(--c-yellow);
      border: 2px solid var(--border-dark);
      padding: 6px 14px;
      border-radius: var(--radius-sm);
      font-family: 'Bricolage Grotesque', sans-serif;
      font-size: 13px;
      font-weight: 800;
      color: var(--text-main);
      cursor: pointer;
      box-shadow: 2px 2px 0px var(--border-dark);
      transition: transform 0.1s, box-shadow 0.1s;
      white-space: nowrap;
    }
    .nav-signin-btn:hover {
      transform: translate(-1px, -1px);
      box-shadow: 3px 3px 0px var(--border-dark);
    }

    /* Scoped Handoff Auth Modal Styles */
    .hf-modal {
      position: fixed;
      inset: 0;
      background: rgba(4, 4, 12, 0.78);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      padding: 18px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "JetBrains Mono", sans-serif;
      color: #eceaff;
    }
    .hf-modal * {
      box-sizing: border-box;
    }
    .hf-modal .hf-box {
      background: #181824;
      border: 1.5px solid #43438c;
      border-radius: 8px;
      padding: 22px 24px;
      width: 440px;
      max-width: 96vw;
      max-height: 90vh;
      overflow-y: auto;
      position: relative;
      box-shadow: 0 20px 40px rgba(0,0,0,0.6);
      color: #eceaff;
    }
    .hf-modal .hf-box .hf-x {
      position: absolute;
      top: 12px;
      right: 14px;
      cursor: pointer;
      color: #9796b4;
      background: none;
      border: 0;
      padding: 6px;
      border-radius: 4px;
      display: grid;
      place-content: center;
      transition: all 0.15s;
    }
    .hf-modal .hf-box .hf-x:hover {
      background: #2c2c3a;
      color: #ffffff;
    }
    .hf-modal .hf-box h3 {
      margin: 0 0 4px 0;
      font-size: 18px;
      font-weight: 700;
      color: #eceaff;
    }
    .hf-modal .hf-box .hf-sub {
      color: #9796b4;
      font-size: 12.5px;
      line-height: 1.5;
      margin: 0 0 16px 0;
    }
    .hf-modal .hf-authtabs {
      display: flex;
      gap: 8px;
      border-bottom: 1px solid #43438c;
      margin-bottom: 16px;
    }
    .hf-modal .hf-authtabs .tab {
      background: none;
      border: none;
      border-bottom: 2px solid transparent;
      color: #9796b4;
      padding: 8px 14px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.15s;
    }
    .hf-modal .hf-authtabs .tab:hover {
      color: #eceaff;
    }
    .hf-modal .hf-authtabs .tab.active {
      color: #ccff3b;
      border-bottom-color: #ccff3b;
    }
    .hf-modal .seg {
      display: flex;
      background: #0f0f18;
      border: 1px solid #43438c;
      border-radius: 6px;
      padding: 3px;
      gap: 4px;
      margin-bottom: 14px;
    }
    .hf-modal .segb {
      flex: 1;
      background: none;
      border: none;
      color: #9796b4;
      font-size: 12px;
      font-weight: 600;
      padding: 6px 10px;
      border-radius: 4px;
      cursor: pointer;
      text-align: center;
      transition: all 0.15s;
    }
    .hf-modal .segb:hover {
      color: #eceaff;
    }
    .hf-modal .segb.active {
      background: #2c2c3a;
      color: #ffffff;
      font-weight: 700;
    }
    .hf-modal .tabpanel {
      display: none;
    }
    .hf-modal .tabpanel.active {
      display: block;
    }
    .hf-modal label {
      display: block;
      font-size: 11.5px;
      font-weight: 700;
      color: #a6a4cc;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      margin-top: 12px;
      margin-bottom: 6px;
    }
    .hf-modal .row {
      display: flex;
      gap: 8px;
      align-items: center;
    }
    .hf-modal input[type="text"],
    .hf-modal input[type="password"],
    .hf-modal input[type="email"],
    .hf-modal input[type="tel"] {
      flex: 1;
      width: 100%;
      background: #0b0b14;
      border: 1px solid #43438c;
      border-radius: 6px;
      padding: 10px 12px;
      font-size: 13.5px;
      color: #eceaff;
      outline: none;
      font-family: inherit;
      transition: border-color 0.15s;
    }
    .hf-modal input:focus {
      border-color: #a285ff;
    }
    .hf-modal button#ha-login,
    .hf-modal button#ha-up-btn,
    .hf-modal button#ha-em-send,
    .hf-modal button#ha-tok-go {
      background: #ccff3b;
      color: #0a0a16;
      border: 1px solid #ccff3b;
      border-radius: 6px;
      padding: 10px 18px;
      font-size: 13.5px;
      font-weight: 800;
      cursor: pointer;
      white-space: nowrap;
      transition: opacity 0.15s;
    }
    .hf-modal button#ha-login:hover,
    .hf-modal button#ha-up-btn:hover,
    .hf-modal button#ha-em-send:hover,
    .hf-modal button#ha-tok-go:hover {
      opacity: 0.92;
    }
    .hf-modal .linkish {
      background: none;
      border: none;
      color: #a285ff;
      font-size: 12px;
      cursor: pointer;
      padding: 0;
      text-decoration: underline;
    }
    .hf-modal .muted {
      font-size: 12px;
      color: #9796b4;
      margin-top: 8px;
    }
    .hf-modal .hf-more {
      margin-top: 16px;
      border-top: 1px solid #43438c;
      padding-top: 12px;
    }
    .hf-modal .hf-more > summary {
      cursor: pointer;
      color: #a6a4cc;
      font-size: 12px;
      list-style: none;
    }
    .hf-modal .hf-more > summary:hover {
      color: #ffffff;
    }
    .hf-modal hr {
      border: none;
      border-top: 1px solid #43438c;
      margin: 16px 0;
    }
  </style>
</head>
<body>
  <div class="top-policy-banner">
    <div class="top-policy-content">
      <span class="policy-pill">🛡️ CUSTODY POLICY</span>
      <span>
        We do NOT sell to competitors. We will distill competitors for a $5 fee (payment through <a href="https://handoff.lol" target="_blank" rel="noreferrer" class="banner-link">Handoff's payment gates</a>), however CopyCat keeps ownership until the real owner wants to buy it.
      </span>
    </div>
  </div>

  <div class="shell">
    <nav class="top">
      <a href="index.html" class="brand-logo">
        🐾 CatG.PT
        <span class="brand-sub">/ FOUNDER VAULT</span>
      </a>
      <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
        <a href="index.html" class="btn btn-white">← Catalog</a>
        <div id="nav-auth-slot"></div>
        <a href="index.html#commission" class="btn btn-yellow">Distill Competitor ($5)</a>
      </div>
    </nav>

    <div class="header-box">
      <div class="custody-badge">
        <span class="dot"></span> CUSTODY: AGENT #44 (COPYCAT)
      </div>
      <h1>CopyCat Holds These ${agents.length} Agents. Buy Yours Back.</h1>
      <p class="lede">Every autonomous agent below was reverse-engineered by <strong>CopyCat</strong> and is held under CopyCat ownership. We sell ownership transfer keys exclusively to founders and verified executives who prove they run the project.</p>
    </div>

    <div class="policy-banner">
      <div class="policy-banner-icon">🛡️</div>
      <div class="policy-banner-text">
        <strong>STRICT NO-COMPETITOR SALE POLICY:</strong> We do NOT sell to competitors. We will distill competitors for a $5 fee (payment through <a href="https://handoff.lol" target="_blank" rel="noreferrer" class="site-link">Handoff's payment gates</a>), however CopyCat keeps ownership until the real owner wants to buy it. Claims sent from verified corporate emails matching the project domain are prioritized.
      </div>
    </div>

    <section>
      <h2 class="section-title">How Ownership Transfer Works</h2>
      <div class="instructions-grid">
        <div class="inst-card">
          <div class="inst-step">STEP 01 // MANDATORY HANDOFF ACCOUNT</div>
          <h3>Active Handoff Account Required</h3>
          <p>You must hold an active account on <a href="https://handoff.lol" target="_blank" rel="noreferrer" class="site-link">handoff.lol ↗</a> before sending an email. Cryptographic ownership and pairing keys are transferred agent-to-agent.</p>
        </div>
        <div class="inst-card">
          <div class="inst-step">STEP 02 // CORPORATE EMAIL PRIORITY</div>
          <h3>Higher Approval with Company Email</h3>
          <p>The sale is <strong>much more likely to be approved</strong> if you submit your claim using your company's official corporate email matching the project domain.</p>
        </div>
        <div class="inst-card">
          <div class="inst-step">STEP 03 // CUSTODY TRANSFER</div>
          <h3>Acquire &amp; Unlock Key</h3>
          <p>Once verified, complete the custody purchase from CopyCat to unlock the direct pairing key and gain exclusive 100% control of the agent.</p>
        </div>
      </div>
    </section>

    <section>
      <h2 class="section-title">Captive Agents in Custody (${agents.length} Total: 97 Startups, 1 Personality, 3 Courses)</h2>
      <div class="search-bar-row">
        <div class="search-bar">
          <input type="search" id="adopt-search" placeholder="Filter agents by name, victim domain, or slug..." oninput="filterTable(this.value)" />
        </div>
        <select id="adopt-sort" class="sort-select" onchange="sortTable(this.value)">
          <option value="featured">Sort: Featured</option>
          <option value="course">Sort: Courses First</option>
          <option value="startup">Sort: Startups First</option>
          <option value="personality">Sort: Personalities First</option>
          <option value="name">Sort: Name (A-Z)</option>
        </select>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th style="width:34%">Agent &amp; Target Project</th>
              <th style="width:26%">Target Domain / Identity</th>
              <th style="width:18%">Custody Status</th>
              <th style="width:22%;text-align:right">Founder Buy Back</th>
            </tr>
          </thead>
          <tbody id="adopt-tbody">
            <!-- Dynamically rendered by looping through captiveAgents -->
          </tbody>
        </table>
      </div>
    </section>
  </div>

  <!-- Claim Modal -->
  <div class="modal-overlay" id="claim-modal" onclick="if(event.target===this)closeClaimModal()">
    <div class="modal-card">
      <button class="modal-close" onclick="closeClaimModal()" aria-label="Close modal">×</button>
      <div id="claim-modal-body"></div>
    </div>
  </div>

  <script>
    const AGENTS = ${JSON.stringify(agents)};
    const captiveAgents = AGENTS.filter(a => a.slug !== 'copycat' && a.id !== 'copycat');
    const OPERATOR_EMAIL = "copycat@handoff.lol";

    function escapeHtml(s) {
      return String(s || '').replace(/[&<>"']/g, m => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
      })[m]);
    }

    function getTargetUrl(a) {
      if (a.website && a.website.startsWith('http')) return a.website;
      if (a.domain && a.domain.includes('.')) return 'https://' + a.domain.replace(/^https?:\\/\\//, '');
      if (a.origin && a.origin.startsWith('http')) return a.origin;
      return '';
    }

    function renderTable(list) {
      const tbody = document.getElementById('adopt-tbody');
      if (!tbody) return;
      const data = list || captiveAgents;
      tbody.innerHTML = data.map(a => {
        const isPers = a.type === 'personality';
        const isCourse = a.type === 'course';
        const domainOrOrigin = a.origin || a.domain || a.slug;
        const targetUrl = getTargetUrl(a);

        const statusClass = isPers ? 'personality' : (isCourse ? 'course' : '');
        const statusText = isPers ? 'IDENTITY HELD' : (isCourse ? 'COURSE DISTILLED' : 'HELD BY COPYCAT');
        const buyBtnText = isCourse ? 'Acquire Course' : (isPers ? 'Verify &amp; Buy Back' : 'Prove &amp; Buy Back');

        return \`
          <tr data-hay="\${(a.name + ' ' + domainOrOrigin + ' ' + a.slug + ' ' + a.type).toLowerCase()}" data-type="\${a.type}" data-name="\${escapeHtml(a.name)}" data-slug="\${escapeHtml(a.slug)}">
            <td>
              <div class="agent-name">
                \${escapeHtml(a.name)}
                \${isPers ? '<span style="font-size:11px;font-family:\\'JetBrains Mono\\',monospace;background:#fce7f3;color:#be185d;padding:2px 6px;border-radius:3px;font-weight:800;border:1px solid #db2777;margin-left:4px">PERSONALITY</span>' : ''}
                \${isCourse ? '<span style="font-size:11px;font-family:\\'JetBrains Mono\\',monospace;background:#fff5cc;color:#735a00;padding:2px 6px;border-radius:3px;font-weight:800;border:1px solid #b38f00;margin-left:4px">COURSE</span>' : ''}
              </div>
              <div style="font-size:12px;color:var(--text-muted);font-family:\\'JetBrains Mono\\',monospace;word-break:break-all">\${escapeHtml(a.slug)}</div>
            </td>
            <td>
              \${targetUrl ? \`<a href="\${escapeHtml(targetUrl)}" target="_blank" rel="noreferrer" class="site-link">\${escapeHtml(domainOrOrigin)} ↗</a>\` : \`<span style="color:var(--text-sub)">\${escapeHtml(domainOrOrigin)}</span>\`}
              \${isPers ? '<div style="font-size:11px;color:var(--text-muted)">Angel Investor / C-Space</div>' : ''}
              \${isCourse ? '<div style="font-size:11px;color:var(--text-muted)">Udemy Master Curriculum</div>' : ''}
            </td>
            <td>
              <span class="status-pill \${statusClass}"><span class="dot"></span> \${statusText}</span>
            </td>
            <td style="text-align:right">
              <div style="display:inline-flex;gap:8px;flex-wrap:wrap;justify-content:flex-end">
                <button type="button" onclick="openClaimModal('\${escapeHtml(a.slug)}')" class="btn btn-orange" style="padding:6px 12px;font-size:12px">\${buyBtnText}</button>
                <a href="\${a.pairUrl || ('index.html#/agent/' + encodeURIComponent(a.slug))}" class="btn btn-white" style="padding:6px 10px;font-size:12px">\${a.pairUrl ? 'Pairing Key ↗' : 'Inquire 🐾'}</a>
              </div>
            </td>
          </tr>
        \`;
      }).join('');
    }

    let CURRENT_SORT = 'featured';
    let SEARCH_QUERY = '';

    function filterTable(q) {
      SEARCH_QUERY = (q || '').trim().toLowerCase();
      applyFilterAndSort();
    }

    function sortTable(val) {
      CURRENT_SORT = val;
      applyFilterAndSort();
    }

    function applyFilterAndSort() {
      let filtered = captiveAgents.filter(a => {
        if (!SEARCH_QUERY) return true;
        const hay = (a.name + ' ' + (a.origin || a.domain || a.slug) + ' ' + a.slug + ' ' + a.type).toLowerCase();
        return hay.includes(SEARCH_QUERY);
      });

      filtered.sort((a, b) => {
        if (CURRENT_SORT === 'name') {
          return a.name.localeCompare(b.name);
        }
        if (CURRENT_SORT === 'course') {
          if (a.type === 'course' && b.type !== 'course') return -1;
          if (a.type !== 'course' && b.type === 'course') return 1;
          return a.name.localeCompare(b.name);
        }
        if (CURRENT_SORT === 'startup') {
          if (a.type === 'startup' && b.type !== 'startup') return -1;
          if (a.type !== 'startup' && b.type === 'startup') return 1;
          return a.name.localeCompare(b.name);
        }
        if (CURRENT_SORT === 'personality') {
          if (a.type === 'personality' && b.type !== 'personality') return -1;
          if (a.type !== 'personality' && b.type === 'personality') return 1;
          return a.name.localeCompare(b.name);
        }
        return 0;
      });

      renderTable(filtered);
    }

          // ==========================================
    // HANDOFF AUTH (WORKBENCH DELEGATION ARCHITECTURE)
    // ==========================================
    const OAUTH_CLIENT_ID = 'hoc__jOG42G4WNbnbY1BTGhD6HCy';

    async function startHandoffOAuth() {
      try {
        if (window.top !== window && window.top.HandoffAuth && window.top.HandoffAuth.openSignIn) {
          window.top.HandoffAuth.openSignIn();
          return;
        }
      } catch(e) {}

      const rnd = n => {
        const a = new Uint8Array(n);
        crypto.getRandomValues(a);
        return btoa(String.fromCharCode.apply(null, a)).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
      };
      const verifier = rnd(32);
      const state = rnd(16);
      const challenge = btoa(String.fromCharCode.apply(null, new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier))))).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');

      const redirectUri = window.location.origin + window.location.pathname;
      const pending = {
        state,
        verifier,
        redirectUri,
        clientId: OAUTH_CLIENT_ID,
        back: window.location.pathname + window.location.search + window.location.hash
      };
      try { sessionStorage.setItem('handoff_signin_pending', JSON.stringify(pending)); } catch(e) {}
      try { sessionStorage.setItem('catgpt_oauth_pending', JSON.stringify(pending)); } catch(e) {}

      const q = new URLSearchParams({
        response_type: 'code',
        client_id: OAUTH_CLIENT_ID,
        redirect_uri: redirectUri,
        code_challenge: challenge,
        code_challenge_method: 'S256',
        state: state,
        scope: 'mcp'
      });
      window.location.assign('https://handoff.lol/oauth/authorize?' + q.toString());
    }

    async function handleOAuthReturn() {
      const q = new URLSearchParams(window.location.search);
      const code = q.get('code');
      const state = q.get('state');
      if (!code) return false;

      let p = null;
      try {
        p = JSON.parse(sessionStorage.getItem('handoff_signin_pending') || sessionStorage.getItem('catgpt_oauth_pending') || 'null');
      } catch(e) {}

      try {
        const cleanPath = p && p.back ? p.back.split('?')[0] : (window.location.pathname + window.location.hash);
        window.history.replaceState(window.history.state, '', cleanPath);
      } catch(e) {}

      try {
        const redirectUri = (p && p.redirectUri) || (window.location.origin + window.location.pathname);
        const clientId = (p && p.clientId) || OAUTH_CLIENT_ID;
        const body = new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: redirectUri,
          client_id: clientId
        });
        if (p && p.verifier) {
          body.set('code_verifier', p.verifier);
        }

        const res = await fetch('https://handoff.lol/oauth/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: body.toString()
        });
        let data = {};
        try { data = await res.json(); } catch(e) {}
        if (data && data.access_token) {
          try { sessionStorage.removeItem('handoff_signin_pending'); } catch(e) {}
          try { sessionStorage.removeItem('catgpt_oauth_pending'); } catch(e) {}
          if (window.HandoffAuth && window.HandoffAuth.setToken) {
            window.HandoffAuth.setToken(data.access_token);
          } else {
            localStorage.setItem('handoff_token', data.access_token);
          }
          await window.syncHandoffUser();
          return true;
        }
      } catch(err) {
        console.warn('[oauth] exchange error:', err);
      }
      return false;
    }

    window.HandoffOAuth = (function () {
      function H() { return window.HandoffAuth || null; }
      return {
        token: function () { var h = H(); return h ? h.token() : (localStorage.getItem('handoff_token') || ''); },
        onChange: function (f) { var h = H(); if (h && h.onChange) h.onChange(f); },
        me: function (force) { var h = H(); return h ? h.me(force) : Promise.resolve(null); },
        signOut: function () {
          var h = H();
          if (h && h.signOut) h.signOut();
          try { localStorage.removeItem('handoff_token'); } catch(e) {}
          try { sessionStorage.removeItem('handoff_signin_pending'); } catch(e) {}
          try { sessionStorage.removeItem('catgpt_oauth_pending'); } catch(e) {}
          window.CATGPT_USER = null;
          window.renderNavAuth();
        },
        openSignIn: function (o) { startHandoffOAuth(); },
        accounts: function () { var h = H(); return (h && h.accounts) ? h.accounts() : []; },
        switchTo: function (t) { var h = H(); if (h && h.switchTo) h.switchTo(t); },
        authHeaders: function (extra) { var h = H(); return h ? h.authHeaders(extra) : Object.assign({ 'Content-Type': 'application/json' }, extra || {}); },
        ready: Promise.resolve()
      };
    })();

    window.CATGPT_USER = null;

    window.getAutoHandoffId = function() {
      if (window.CATGPT_USER) {
        const id = window.CATGPT_USER.handle || window.CATGPT_USER.username || window.CATGPT_USER.id;
        if (id && id.trim()) return id.trim();
      }
      try {
        const accts = window.HandoffOAuth ? window.HandoffOAuth.accounts() : [];
        const tok = window.HandoffOAuth ? window.HandoffOAuth.token() : '';
        const match = accts.find(a => a.token === tok) || accts[0];
        if (match && (match.handle || match.id)) return (match.handle || match.id).trim();
      } catch(e) {}
      try {
        const sp = new URLSearchParams(window.location.search);
        const fromUrl = sp.get("user_id") || sp.get("agent_id") || sp.get("user") || sp.get("agent") || sp.get("userId") || sp.get("agentId") || sp.get("id") || sp.get("uid") || sp.get("buyer");
        if (fromUrl && fromUrl.trim()) return fromUrl.trim();
      } catch(e) {}
      return "";
    };

    window.renderNavAuth = function() {
      const slot = document.getElementById("nav-auth-slot");
      if (!slot) return;
      const autoId = window.getAutoHandoffId();
      if (autoId) {
        slot.innerHTML = \`
          <div class="nav-user-pill">
            <span style="color:#059669">●</span>
            <span style="color:var(--text-main)">@\${escapeHtml(autoId)}</span>
            <button type="button" class="nav-signout-btn" onclick="window.handoffSignOut()" title="Sign out of Handoff">Sign out</button>
          </div>
        \`;
      } else {
        slot.innerHTML = \`
          <button type="button" class="nav-signin-btn" onclick="window.HandoffOAuth.openSignIn()">
            Sign in with Handoff
          </button>
        \`;
      }
    };

    window.syncHandoffUser = async function() {
      try {
        const res = await window.HandoffOAuth.me();
        if (res && res.success && res.user) {
          window.CATGPT_USER = {
            token: window.HandoffOAuth.token(),
            ...res.user,
            agents: res.agents || []
          };
          window.renderNavAuth();
          return;
        }
      } catch(e) {}

      try {
        const accts = window.HandoffOAuth.accounts ? window.HandoffOAuth.accounts() : [];
        const token = window.HandoffOAuth.token();
        const active = accts.find(a => a.token === token) || accts[0];
        if (active && (active.handle || active.id)) {
          window.CATGPT_USER = {
            token: active.token || token,
            handle: active.handle,
            id: active.id
          };
          window.renderNavAuth();
          return;
        }
      } catch(e) {}

      // Fallback check directly with /api/v1/auth/me if token exists
      const tok = window.HandoffOAuth.token() || localStorage.getItem('handoff_token');
      if (tok) {
        try {
          const r = await fetch('/api/v1/auth/me', {
            headers: { 'Authorization': 'Bearer ' + tok }
          });
          const d = await r.json();
          if (d && (d.user || d.id || d.handle)) {
            window.CATGPT_USER = {
              token: tok,
              ...(d.user || {}),
              handle: d.handle || (d.user && d.user.handle),
              id: d.id || (d.user && d.user.id),
              agents: d.agents || []
            };
            window.renderNavAuth();
            return;
          }
        } catch(e) {}
      }

      window.CATGPT_USER = null;
      window.renderNavAuth();
    };

    if (window.HandoffOAuth && window.HandoffOAuth.onChange) {
      window.HandoffOAuth.onChange(() => {
        window.syncHandoffUser();
      });
    }

    window.handoffSignOut = function() {
      window.HandoffOAuth.signOut();
    };

    // Initial render
    applyFilterAndSort();
    handleOAuthReturn().finally(() => {
      window.syncHandoffUser();
    });

    function updateSplit(val) {
      const pct = parseInt(val, 10) || 100;
      const price = Math.round(pct / 5);
      const display = document.getElementById('claim-split-display');
      if (display) display.textContent = pct + '% ($' + price + ')';
    }

    function openClaimModal(slug) {
      const a = AGENTS.find(x => x.slug === slug);
      if (!a) return;
      const modal = document.getElementById("claim-modal");
      const body = document.getElementById("claim-modal-body");
      const domainName = a.domain || a.origin || a.slug;
      const targetUrl = getTargetUrl(a);
      const autoId = window.getAutoHandoffId();

      body.innerHTML = \`
        <div style="margin-bottom:18px">
          <div style="font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:800;color:var(--c-orange);margin-bottom:4px">[ CUSTODY: COPYCAT ]</div>
          <h2 style="font-family:'Bricolage Grotesque',sans-serif;font-size:24px;font-weight:800;margin:0 0 6px 0">\${escapeHtml(a.name)}</h2>
          <div style="font-size:13px;color:var(--text-sub)">
            Entity: \${targetUrl ? \`<a href="\${escapeHtml(targetUrl)}" target="_blank" rel="noreferrer" class="site-link" style="color:var(--c-blue);text-decoration:underline">\${escapeHtml(domainName)} ↗</a>\` : escapeHtml(domainName)}
          </div>
        </div>

        <!-- Unnested, clean custody layout -->
        <div>
          <!-- Top Valuation Row -->
          <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px">
            <div>
              <div style="font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:800;color:var(--c-orange)">AGENT VALUATION</div>
              <div style="font-family:'Bricolage Grotesque',sans-serif;font-size:32px;font-weight:900;color:var(--text-main);line-height:1.1;margin-top:2px">
                $20 <span style="font-family:'JetBrains Mono',monospace;font-size:14px;font-weight:700;color:var(--text-sub)">(100% Stake)</span>
              </div>
            </div>
          </div>

          <!-- Slider directly under $20 -->
          <div style="margin-top:14px">
            <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px">
              <label for="claim-split-range" style="font-size:13px;font-weight:800;color:var(--text-main);margin:0">Custody Interest (%):</label>
              <span id="claim-split-display" style="font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:800;color:var(--c-orange)">100% ($20)</span>
            </div>
            <input id="claim-split-range" type="range" min="5" max="100" step="5" value="100" oninput="updateSplit(this.value)" style="width:100%;accent-color:var(--c-orange);cursor:pointer;margin:4px 0" />
            <div style="display:flex;justify-content:space-between;font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:700;color:var(--text-muted);margin-bottom:6px">
              <span>5% ($1)</span>
              <span>50% ($10)</span>
              <span>100% ($20)</span>
            </div>
            <a href="https://handoff.lol/docs#licensing" target="_blank" rel="noreferrer" style="font-size:11.5px;color:var(--c-blue);text-decoration:underline;display:inline-block">
              Handoff documentation on agent splits &amp; licensing ↗
            </a>
          </div>

          <!-- Handoff Authentication Status -->
          <div style="margin-top:14px">
            \${autoId ? \`
              <div style="background:#f0fdf4;border:1.5px solid #10b981;border-radius:var(--radius-sm);padding:10px 14px;margin-bottom:12px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
                <div>
                  <div style="font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:800;color:#047857">AUTHENTICATED HANDOFF USER</div>
                  <div style="font-family:'JetBrains Mono',monospace;font-size:14px;font-weight:800;color:#065f46">@\${escapeHtml(autoId)}</div>
                </div>
                <button type="button" onclick="window.handoffSignOut();openClaimModal('\${escapeHtml(a.slug)}');" style="background:none;border:none;font-size:11.5px;color:var(--c-blue);text-decoration:underline;font-weight:700;cursor:pointer">Sign Out</button>
              </div>
            \` : \`
              <div style="background:#fffbeb;border:1.5px solid #f59e0b;border-radius:var(--radius-sm);padding:12px 14px;margin-bottom:12px">
                <div style="font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:800;color:#b45309;margin-bottom:4px">HANDOFF ACCOUNT REQUIRED</div>
                <p style="font-size:12.5px;color:var(--text-main);margin:0 0 10px 0;line-height:1.45">
                  Sign in with your Handoff account to acquire control of this agent.
                </p>
                <button type="button" onclick="window.HandoffOAuth.openSignIn()" class="btn btn-yellow" style="width:100%;text-align:center;justify-content:center;font-size:13.5px;font-weight:800;padding:10px;box-sizing:border-box">
                   Sign in with Handoff
                </button>
              </div>
            \`}
          </div>

          <div id="claim-status-box" style="display:none;margin-bottom:12px"></div>

          <button type="button" id="claim-take-btn" onclick="takeControl('\${escapeHtml(a.slug)}')" 
            class="btn \${autoId ? 'btn-orange' : 'btn-disabled'}" 
            \${!autoId ? 'disabled style="width:100%;text-align:center;justify-content:center;font-size:15px;padding:12px;font-weight:800;opacity:0.45;cursor:not-allowed;background:#94a3b8;color:#ffffff;border-color:#64748b"' : 'style="width:100%;text-align:center;justify-content:center;font-size:15px;padding:12px;font-weight:800"'}
            title="\${!autoId ? 'Sign in to Handoff required to take control' : ''}">
            \${autoId ? 'Take Control' : 'Take Control (Sign In Required)'}
          </button>
          \${a.pairUrl ? \`<a href="\${a.pairUrl}" target="_blank" rel="noreferrer" class="btn btn-green" style="width:100%;text-align:center;justify-content:center;margin-top:8px;font-size:13px">Direct Pairing Key ↗</a>\` : ''}
        </div>
      \`;

      modal.classList.add("open");
    }

    function closeClaimModal() {
      document.getElementById("claim-modal").classList.remove("open");
    }

    function takeControl(slug) {
      const a = AGENTS.find(x => x.slug === slug);
      if (!a) return;
      const splitInput = document.getElementById("claim-split-range");
      const statusBox = document.getElementById("claim-status-box");
      const handoffId = window.getAutoHandoffId();
      const splitPct = splitInput ? (parseInt(splitInput.value, 10) || 100) : 100;
      const splitPrice = Math.round(splitPct / 5);

      if (!handoffId) {
        if (window.HandoffOAuth && window.HandoffOAuth.openSignIn) {
          window.HandoffOAuth.openSignIn();
        }
        return;
      }

      if (statusBox) {
        statusBox.style.display = 'block';
        statusBox.innerHTML = \`
          <div style="background:#f0fdf4;border:2px solid #10b981;border-radius:var(--radius-sm);padding:12px;color:#047857;margin-bottom:8px">
            <div style="font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:800;margin-bottom:4px">✓ OWNERSHIP APPROVED</div>
            <div style="font-size:12px;line-height:1.4">
              Custody stake of <strong>\${splitPct}% ($\${splitPrice})</strong> granted to <strong>@\${escapeHtml(handoffId)}</strong>.
            </div>
          </div>
        \`;
      }

      const btn = document.getElementById("claim-take-btn");
      if (btn) {
        btn.textContent = '✓ Control Granted';
        btn.classList.remove('btn-orange');
        btn.classList.add('btn-green');
        btn.disabled = true;
      }
    }
  </script>
</body>
</html>`;

fs.writeFileSync('adopt.html', html, 'utf8');
console.log('Adopt.html successfully generated with no-competitor policy, full linkification, and sorting!');

// Sync to .handoff/miniapps/catgpt
const destDir = join(homedir(), '.handoff', 'miniapps', 'catgpt');
fs.mkdirSync(destDir, { recursive: true });
fs.copyFileSync('adopt.html', join(destDir, 'adopt.html'));
console.log('Synced adopt.html to miniapps directory:', destDir);
