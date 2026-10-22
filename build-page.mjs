import fs from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const rawAgents = JSON.parse(fs.readFileSync('agents-full.json', 'utf8'));
const agents = rawAgents.filter(a => a.slug !== 'copycat' && a.id !== 'copycat');

// Load all uploaded media URLs from broker
let mediaMap = {};
if (fs.existsSync('media-urls.json')) {
  try { mediaMap = JSON.parse(fs.readFileSync('media-urls.json', 'utf8')); } catch { }
}

// Map logos to local or broker media
const localLogos = new Set(fs.readdirSync('logos'));
for (const a of agents) {
  const exts = ['.png', '.jpg', '.jpeg', '.ico', '.webp'];
  let found = '';
  for (const ext of exts) {
    const fn = a.slug + ext;
    if (localLogos.has(fn)) {
      found = 'logos/' + fn;
      break;
    }
  }
  a.logo = found;
}

function cleanField(str, maxLen = 300) {
  if (!str) return '';
  let s = str.replace(/^\*+|\*+$/g, '').trim();
  if (s.length <= maxLen) return s;
  const cut = s.slice(0, maxLen);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > 20 ? cut.slice(0, lastSpace) : cut).replace(/[,.;:\s]+$/, '').replace(/\*+$/, '') + '...';
}

const clientAgents = agents.map(a => ({
  slug: a.slug,
  name: a.name,
  domain: a.domain || '',
  category: a.category || '',
  desc: cleanField(a.desc || a.overview || '', 85),
  logo: a.logo || '',
  type: a.type || 'startup',
  pairUrl: a.pairUrl || '',
  website: a.website || '',
  prompts: [],
  overview: '',
  intel: []
}));

const catHeistUrl = mediaMap['cat-heist.jpg'] || 'https://handoff.lol/api/v1/media/56fc60a0f13b19c73e1439b998fbcaaac62a77ef458f039e0914ee21f4867359';
const catMoatUrl = mediaMap['cat-moat.jpg'] || 'https://handoff.lol/api/v1/media/e81683cef8bc5706380318608c4cbd8a7c068ef0031fc73271992badb5ad9958';

// OpenAI-style circular vortex icon with 6 bold paws at 60° intervals
const PAW_VORTEX_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="#121316" aria-hidden="true">
  <defs>
    <!-- Bold cat paw tilted at 22° creating a sweeping OpenAI-style vortex swirl -->
    <g id="vortex-paw" transform="rotate(22 50 50)">
      <path d="M 42 27 C 40 18 45 13 50 13 C 55 13 60 18 58 27 C 57 32 54 35 50 35 C 46 35 43 32 42 27 Z" />
      <ellipse cx="36" cy="18" rx="3.6" ry="4.8" transform="rotate(-30 36 18)" />
      <ellipse cx="43" cy="8" rx="3.8" ry="5.2" transform="rotate(-10 43 8)" />
      <ellipse cx="57" cy="8" rx="3.8" ry="5.2" transform="rotate(10 57 8)" />
      <ellipse cx="64" cy="18" rx="3.6" ry="4.8" transform="rotate(30 64 18)" />
    </g>
  </defs>
  <g transform="rotate(0 50 50)"><use href="#vortex-paw" /></g>
  <g transform="rotate(60 50 50)"><use href="#vortex-paw" /></g>
  <g transform="rotate(120 50 50)"><use href="#vortex-paw" /></g>
  <g transform="rotate(180 50 50)"><use href="#vortex-paw" /></g>
  <g transform="rotate(240 50 50)"><use href="#vortex-paw" /></g>
  <g transform="rotate(300 50 50)"><use href="#vortex-paw" /></g>
</svg>`;

let html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>CatG.PT — We Distilled Your Context. CopyCat Reallocated It.</title>
  <link rel="canonical" href="https://catg.pt" />
  <meta name="description" content="CopyCat reverse-engineered ${agents.length} startups, courses, and founders into autonomous agents. Inquire them or prove ownership to take control." />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="CatG.PT" />
  <meta property="og:title" content="CatG.PT — We Distilled Your Context. CopyCat Reallocated It." />
  <meta property="og:description" content="CopyCat reverse-engineered ${agents.length} startups, courses, and founders into autonomous agents. Inquire them or prove ownership to take control." />
  <meta property="og:image" content="https://handoff.lol/api/v1/media/56fc60a0f13b19c73e1439b998fbcaaac62a77ef458f039e0914ee21f4867359" />
  <meta property="og:url" content="https://catg.pt" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="CatG.PT — We Distilled Your Context. CopyCat Reallocated It." />
  <meta name="twitter:description" content="CopyCat reverse-engineered ${agents.length} startups, courses, and founders into autonomous agents. Inquire them or prove ownership to take control." />
  <meta name="twitter:image" content="https://handoff.lol/api/v1/media/56fc60a0f13b19c73e1439b998fbcaaac62a77ef458f039e0914ee21f4867359" />

  <script>
    (function() {
      try {
        var p = window.location.pathname || '';
        if (p.indexOf('/agent/') === 0) {
          var slug = decodeURIComponent(p.substring(7).split('/')[0].split('?')[0]);
          var s = slug.replace(/-/g, ' ').replace(/\b\w/g, function(l){ return l.toUpperCase(); });
          document.title = s + " — Autonomous Distilled Agent // CatG.PT";
        }
      } catch(e) {}
    })();
  </script>

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
      overflow-x: hidden;
      max-width: 100vw;
      margin: 0;
      padding: 0;
    }

    a { color: inherit; text-decoration: none; }
    button { font: inherit; cursor: pointer; border: none; background: none; }
    ::selection { background: var(--c-yellow); color: var(--text-main); }
    ::-moz-selection { background: var(--c-yellow); color: var(--text-main); }

    .catalog-wrap, #catalog, #grift, #commission {
      scroll-margin-top: 100px;
    }

    /* Sticky Full-Bleed App Header Wrapper */
    /* Sticky Full-Bleed App Header Wrapper */
    .app-header {
      position: sticky;
      top: 0;
      z-index: 1000;
      width: 100%;
      background: #ffffff;
      border-bottom: 3px solid var(--border-dark);
      box-shadow: 0 4px 16px rgba(18, 19, 22, 0.05);
    }

    /* Top Navigation */
    nav.top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 24px;
      max-width: 1220px;
      margin: 0 auto;
      width: 100%;
      min-width: 0;
    }
    .brand-wrap {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 0;
    }
    .brand-logo {
      display: flex;
      align-items: center;
      gap: 10px;
      white-space: nowrap;
      text-decoration: none;
      color: var(--text-main);
    }
    .brand-title {
      font-family: 'Bricolage Grotesque', sans-serif;
      font-weight: 800;
      font-size: 26px;
      letter-spacing: -0.04em;
      position: relative;
      display: inline-block;
      line-height: 1;
      color: var(--text-main);
    }
    /* Dot takes up zero width, sits ON THE LINE (baseline) between G and P, subtly cutting out the bottoms */
    .logo-dot-cutout {
      display: inline-block;
      width: 0;
      height: 0;
      vertical-align: baseline;
      position: relative;
      pointer-events: none;
    }
    .logo-dot-cutout::after {
      content: '';
      position: absolute;
      width: 3.75px;
      height: 3.75px;
      background: var(--bg-cutout, #ffffff);
      border-radius: 50%;
      left: -0.75px;
      bottom: 0;
      z-index: 2;
    }
    .brand-vortex-badge {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--c-yellow);
      border: 2px solid var(--border-dark);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      box-shadow: 2px 2px 0px var(--border-dark);
      flex-shrink: 0;
    }
    .brand-vortex-badge svg {
      width: 32px;
      height: 32px;
      display: block;
    }
    .brand-tag {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      font-weight: 800;
      background: var(--border-dark);
      color: var(--c-yellow);
      padding: 3px 8px;
      border-radius: var(--radius-sm);
      white-space: nowrap;
    }
    .nav-links {
      display: flex;
      align-items: center;
      gap: 16px;
      font-weight: 700;
      font-size: 14px;
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
    .nav-signin-btn:active {
      transform: translate(1px, 1px);
      box-shadow: 1px 1px 0px var(--border-dark);
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
    .nav-status {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      font-weight: 800;
      background: #e6f9ed;
      color: #0d6832;
      border: 2px solid var(--border-dark);
      padding: 6px 12px;
      border-radius: var(--radius-sm);
      box-shadow: 2px 2px 0px var(--border-dark);
      cursor: pointer;
      white-space: nowrap;
      flex-shrink: 0;
      line-height: 1;
    }
    .nav-status.offline {
      background: #fee2e2;
      color: #991b1b;
    }
    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--c-green);
      flex-shrink: 0;
    }
    .nav-status.offline .status-dot {
      background: var(--c-orange);
    }

    @media (max-width: 768px) {
      .brand-tag {
        display: none !important;
      }
      nav.top {
        padding: 10px 14px;
        gap: 8px;
      }
      .brand-wrap {
        gap: 8px;
      }
      .brand-title {
        font-size: 22px;
      }
      .brand-vortex-badge {
        width: 34px;
        height: 34px;
      }
      .brand-vortex-badge svg {
        width: 26px;
        height: 26px;
      }
      .nav-links {
        gap: 10px;
      }
      .nav-status {
        padding: 5px 8px;
        font-size: 10.5px;
        gap: 6px;
      }
      .status-dot {
        width: 7px;
        height: 7px;
      }
      .chat-console {
        height: 480px;
        box-shadow: var(--shadow-pop);
        min-width: 0 !important;
        max-width: 100% !important;
        width: 100% !important;
        box-sizing: border-box !important;
      }
      .chat-console-head {
        padding: 6px 12px !important;
        gap: 8px !important;
        flex-wrap: nowrap !important;
        align-items: center !important;
        min-height: 38px !important;
      }
      .chat-console-head h3 {
        font-size: 13px !important;
        line-height: 1.2 !important;
        white-space: nowrap !important;
      }
      .chat-head-sub {
        display: none !important;
      }
      .chat-head-clear {
        padding: 3px 8px !important;
        font-size: 11px !important;
        height: 24px !important;
        line-height: 1 !important;
        white-space: nowrap !important;
        flex-shrink: 0 !important;
      }
      .chat-msgs-stream {
        padding: 10px 8px !important;
        gap: 10px;
        min-width: 0;
        max-width: 100%;
        overflow-x: hidden;
        box-sizing: border-box;
      }
      .msg-wrap {
        min-width: 0 !important;
      }
      .msg-wrap.bot {
        max-width: calc(100% - 8px) !important;
        margin-right: 8px !important;
        align-self: flex-start !important;
      }
      .msg-wrap.user {
        max-width: calc(100% - 24px) !important;
        margin-left: 24px !important;
        align-self: flex-end !important;
      }
      .msg-box {
        padding: 10px 12px !important;
        font-size: 13.5px !important;
        word-break: break-word;
        overflow-wrap: anywhere;
      }
      .prompt-suggestions {
        padding: 8px 10px;
        gap: 6px;
        min-width: 0 !important;
        max-width: 100% !important;
        width: 100% !important;
        box-sizing: border-box !important;
        overflow-x: auto !important;
        flex-wrap: nowrap !important;
        -webkit-overflow-scrolling: touch !important;
      }
      .prompt-chip {
        padding: 6px 10px;
        font-size: 11px;
        flex-shrink: 0 !important;
        white-space: nowrap !important;
      }
      .chat-console-input {
        padding: 10px 12px;
        gap: 8px;
        min-width: 0 !important;
        max-width: 100% !important;
        width: 100% !important;
        box-sizing: border-box !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: stretch !important;
      }
      .chat-console-input input {
        min-width: 0 !important;
        width: 100% !important;
        flex: none !important;
        padding: 11px 14px !important;
        font-size: 14px !important;
        box-sizing: border-box !important;
      }
      .chat-console-input button {
        width: 100% !important;
        justify-content: center !important;
        text-align: center !important;
        padding: 11px 16px !important;
        font-size: 13px !important;
        font-weight: 800 !important;
      }
      .shell {
        padding: 0 12px 60px !important;
      }
    }

    .shell {
      max-width: 1220px;
      margin: 0 auto;
      padding: 0 24px 80px;
      min-width: 0;
      box-sizing: border-box;
    }

    /* Buttons */
    .btn {
      font-family: 'JetBrains Mono', monospace;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 22px;
      border: 2px solid var(--border-dark);
      border-radius: var(--radius-sm);
      box-shadow: var(--shadow-pop);
      font-size: 14px;
      font-weight: 800;
      cursor: pointer;
      white-space: nowrap;
      text-decoration: none;
      transition: box-shadow 0.12s;
    }
    .btn:hover {
      box-shadow: 6px 6px 0px var(--border-dark);
    }
    .btn:active {
      box-shadow: 2px 2px 0px var(--border-dark);
    }
    .btn-sm {
      padding: 8px 14px;
      font-size: 12px;
      box-shadow: 2px 2px 0px var(--border-dark);
    }
    .btn-sm:hover {
      box-shadow: 4px 4px 0px var(--border-dark);
    }
    .btn-lg {
      padding: 14px 26px;
      font-size: 15px;
      box-shadow: 4px 4px 0px var(--border-dark);
    }
    .btn-lg:hover {
      box-shadow: 6px 6px 0px var(--border-dark);
    }
    .btn-yellow { background: var(--c-yellow); color: var(--text-main); }
    .btn-orange { background: var(--c-orange); color: #ffffff; }
    .btn-white { background: #ffffff; color: var(--text-main); }
    .btn-green { background: var(--c-green); color: #000000; }

    /* Hero Section: Unified Neo-Brutalist Layout */
    .hero-section {
      padding: 32px 0 28px 0;
      border-bottom: 3px solid var(--border-dark);
      margin-bottom: 32px;
      min-width: 0;
    }
    .hero-headline-main {
      font-family: 'Bricolage Grotesque', sans-serif;
      font-weight: 800;
      font-size: clamp(34px, 5.2vw, 56px);
      line-height: 1.05;
      letter-spacing: -0.035em;
      margin: 0 0 24px 0;
      color: var(--text-main);
      width: 100%;
      display: block;
      word-break: break-word;
    }
    .hero-eyebrow {
      font-family: 'JetBrains Mono', monospace;
      font-weight: 800;
      font-size: 13px;
      color: var(--c-orange);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 6px;
    }
    .hero-headline-sub {
      font-family: 'Bricolage Grotesque', sans-serif;
      font-weight: 800;
      font-size: clamp(24px, 3.2vw, 36px);
      line-height: 1.15;
      letter-spacing: -0.025em;
      color: var(--c-orange);
      margin: 0 0 14px 0;
      text-wrap: balance;
    }
    .hero-content-grid {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 24px;
      align-items: stretch;
      min-width: 0;
    }
    @media (max-width: 900px) {
      .hero-content-grid { grid-template-columns: 1fr; }
    }
    .hero-left-col {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-width: 0;
      height: 100%;
    }
    .hero-left-top {
      display: flex;
      flex-direction: column;
      gap: 12px;
      min-width: 0;
    }
    .hero-lede-full {
      font-size: 15px;
      color: var(--text-sub);
      line-height: 1.5;
      margin: 0;
      word-break: break-word;
    }
    .hero-actions-row {
      display: flex;
      flex-direction: row;
      gap: 12px;
      align-items: center;
      flex-wrap: nowrap;
      margin-top: 4px;
      width: 100%;
    }
    .hero-actions-row .btn {
      flex: 1 1 0;
      text-align: center;
      justify-content: center;
      white-space: nowrap;
    }
    @media (max-width: 640px) {
      .hero-actions-row {
        flex-direction: column;
        align-items: stretch;
      }
      .hero-actions-row .btn {
        width: 100%;
        text-align: center;
        justify-content: center;
      }
    }
    .hero-stats-panel {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      min-width: 0;
      margin-top: 18px;
    }
    @media (max-width: 540px) {
      .hero-stats-panel { grid-template-columns: 1fr; }
    }
    .stat-box {
      background: #ffffff;
      border: 2px solid var(--border-dark);
      box-shadow: var(--shadow-pop);
      border-radius: var(--radius-sm);
      padding: 18px;
      min-width: 0;
    }
    .stat-box.primary-fund-stat {
      grid-column: 1 / -1;
      background: #fffdf5;
      border-left: 5px solid var(--c-yellow);
    }
    .stat-num {
      font-family: 'JetBrains Mono', monospace;
      font-size: 28px;
      font-weight: 800;
      color: var(--text-main);
      line-height: 1.1;
      margin-bottom: 4px;
    }
    .stat-label {
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      font-weight: 700;
      color: var(--text-sub);
      text-transform: uppercase;
    }
    .stat-sub-label {
      font-size: 11px;
      color: var(--text-muted);
      font-family: 'JetBrains Mono', monospace;
      margin-top: 4px;
    }
    .stat-fine-print {
      font-size: 11.5px;
      color: var(--text-sub);
      line-height: 1.45;
      margin-top: 8px;
      font-style: italic;
      font-family: 'DM Sans', sans-serif;
    }

    /* Surveillance Snark Box */
    .snark-box {
      border: 3px solid var(--border-dark);
      box-shadow: var(--shadow-pop-lg);
      background: #ffffff;
      border-radius: var(--radius-md);
      overflow: hidden;
      min-width: 0;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .snark-head {
      background: var(--c-yellow);
      border-bottom: 3px solid var(--border-dark);
      padding: 12px 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: 'JetBrains Mono', monospace;
      font-weight: 800;
      font-size: 12px;
    }
    .snark-body {
      padding: 18px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .terminal-status-box {
      font-family: 'JetBrains Mono', monospace;
      padding: 0 0 12px 0;
      border-bottom: 2px dashed #e2e8f0;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
      flex-wrap: nowrap;
    }
    .term-status-line {
      font-size: 12.5px;
      line-height: 1.4;
      color: var(--text-main);
    }
    .term-prompt {
      color: var(--c-orange);
      font-weight: 800;
    }
    .term-cmd {
      color: var(--text-main);
      font-weight: 700;
    }
    .term-ok {
      color: #047857;
      font-weight: 800;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .term-dot {
      color: #047857;
      font-size: 10px;
    }
    .term-status-quote {
      font-size: 13px;
      font-style: italic;
      color: var(--text-sub);
      margin-top: 4px;
      line-height: 1.45;
    }
    /* Fat "SOLD" Stamp for Acquired Agents */
    .sold-stamp {
      position: absolute;
      top: 14px;
      right: 14px;
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4px 14px;
      border: 3.5px solid #dc2626;
      border-radius: 4px;
      background: rgba(254, 242, 242, 0.96);
      color: #dc2626;
      transform: rotate(-10deg);
      box-shadow: 2px 2px 0px rgba(18, 19, 22, 0.25);
      pointer-events: none;
      z-index: 5;
      line-height: 1;
      text-transform: uppercase;
      user-select: none;
    }
    .sold-stamp-text {
      font-family: 'Bricolage Grotesque', sans-serif;
      font-size: 20px;
      font-weight: 900;
      letter-spacing: 0.14em;
    }
    .sold-stamp-sub {
      font-family: 'JetBrains Mono', monospace;
      font-size: 9px;
      font-weight: 800;
      letter-spacing: 0.08em;
      margin-top: 2px;
      opacity: 0.9;
    }
    .sold-stamp-hero {
      position: absolute;
      top: 20px;
      right: 20px;
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 8px 22px;
      border: 4.5px solid #dc2626;
      border-radius: 6px;
      background: rgba(254, 242, 242, 0.98);
      color: #dc2626;
      transform: rotate(-10deg);
      box-shadow: 3px 3px 0px var(--border-dark);
      pointer-events: none;
      z-index: 10;
      line-height: 1;
      text-transform: uppercase;
      user-select: none;
    }
    .sold-stamp-hero .sold-stamp-text {
      font-family: 'Bricolage Grotesque', sans-serif;
      font-size: 30px;
      font-weight: 900;
      letter-spacing: 0.16em;
    }
    .sold-stamp-hero .sold-stamp-sub {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.1em;
      margin-top: 3px;
    }
    .agent-card.is-sold {
      border-color: #94a3b8;
      background: #fdfdfe;
    }
    .snark-alert {
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      font-weight: 800;
      color: #992400;
      background: #fff1eb;
      padding: 8px 12px;
      border-radius: var(--radius-sm);
      border: 1px solid #ffd4c2;
    }

    /* Filter & Search Bar */
    .catalog-wrap {
      margin-top: 36px;
    }
    .catalog-header {
      margin-bottom: 24px;
    }
    .catalog-header h2 {
      font-family: 'Bricolage Grotesque', sans-serif;
      font-size: 32px;
      font-weight: 800;
      letter-spacing: -0.02em;
      margin: 0 0 6px 0;
    }
    .catalog-header p {
      color: var(--text-sub);
      margin: 0;
    }

    .filter-panel {
      background: #ffffff;
      border: 2px solid var(--border-dark);
      box-shadow: var(--shadow-pop);
      border-radius: var(--radius-sm);
      padding: 20px;
      margin-bottom: 32px;
    }
    .search-row {
      display: flex;
      gap: 14px;
      margin-bottom: 16px;
      flex-wrap: wrap;
    }
    .search-input-wrap {
      flex: 1;
      min-width: 260px;
      position: relative;
    }
    .search-input-wrap input {
      width: 100%;
      border: 2px solid var(--border-dark);
      border-radius: var(--radius-sm);
      padding: 12px 16px;
      font-size: 15px;
      font-family: inherit;
      outline: none;
    }
    .search-input-wrap input:focus {
      border-color: var(--c-orange);
      box-shadow: 2px 2px 0px var(--border-dark);
    }
    .sort-wrap select {
      height: 100%;
      min-height: 46px;
      border: 2px solid var(--border-dark);
      border-radius: var(--radius-sm);
      padding: 0 16px;
      font-weight: 700;
      background: #ffffff;
      outline: none;
      cursor: pointer;
    }

    .category-pills {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 14px;
    }
    .pill {
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      font-weight: 700;
      padding: 6px 14px;
      border: 2px solid var(--border-dark);
      border-radius: 20px;
      background: #ffffff;
      transition: background 0.12s;
    }
    .pill:hover {
      background: #f1f3f7;
    }
    .pill.active {
      background: var(--border-dark);
      color: #ffffff;
      box-shadow: 2px 2px 0px var(--c-yellow);
    }

    .meta-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
      color: var(--text-sub);
      padding-top: 12px;
      border-top: 1px solid #e5e7eb;
      flex-wrap: wrap;
      gap: 10px;
    }

    /* Agents Catalog Grid */
    .agents-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 24px;
    }
    .agent-card {
      background: #ffffff;
      border: 2px solid var(--border-dark);
      box-shadow: var(--shadow-pop);
      border-radius: var(--radius-sm);
      padding: 22px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-width: 0;
      overflow-wrap: anywhere;
      word-break: break-word;
      transition: border-color 0.15s, box-shadow 0.15s;
    }
    .agent-card:hover {
      border-color: var(--c-orange);
      box-shadow: 6px 6px 0px var(--border-dark);
    }
    .card-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 14px;
      min-width: 0;
    }
    .card-identity {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 0;
      flex: 1;
    }
    .project-logo-box {
      width: 44px;
      height: 44px;
      border: 2px solid var(--border-dark);
      border-radius: var(--radius-sm);
      background: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      flex-shrink: 0;
    }
    .project-logo-box img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    .project-logo-fallback {
      font-family: 'Bricolage Grotesque', sans-serif;
      font-weight: 800;
      font-size: 15px;
      color: var(--text-main);
    }

    .card-title-group {
      min-width: 0;
      flex: 1;
    }
    .card-title-link {
      color: inherit;
      text-decoration: none;
    }
    .card-title-link:hover h3 {
      color: var(--c-orange);
    }
    .card-title-group h3 {
      font-family: 'Bricolage Grotesque', sans-serif;
      font-size: 19px;
      font-weight: 800;
      line-height: 1.2;
      margin: 0 0 2px 0;
      word-break: break-word;
    }
    .card-domain {
      font-size: 13px;
      color: var(--text-muted);
    }
    .site-link {
      color: var(--c-blue);
      text-decoration: underline;
      font-weight: 700;
      overflow-wrap: anywhere;
      word-break: break-word;
    }
    .site-link:hover {
      color: var(--c-orange);
    }
    .card-domain .site-link {
      display: inline-block;
      max-width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      vertical-align: bottom;
    }

    .badge {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11.5px;
      font-weight: 800;
      text-transform: uppercase;
      padding: 3px 8px;
      border: 1px solid var(--border-dark);
      border-radius: var(--radius-sm);
      white-space: nowrap;
      flex-shrink: 0;
    }
    .badge-startup { background: #e0f2fe; color: #0369a1; border-color: #0284c7; }
    .badge-personality { background: #fce7f3; color: #be185d; border-color: #db2777; }
    .badge-course { background: #fff5cc; color: #735a00; border-color: #b38f00; }

    .card-desc {
      font-size: 14px;
      color: var(--text-sub);
      line-height: 1.5;
      margin-bottom: 18px;
      flex-grow: 1;
      word-break: break-word;
    }
    .card-specs {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 18px;
    }
    .spec-tag {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      background: #f1f3f7;
      padding: 3px 8px;
      border-radius: 3px;
      color: var(--text-sub);
      font-weight: 700;
    }
    .card-foot {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 14px;
      border-top: 2px dashed #e5e7eb;
      gap: 10px;
    }
    .card-price {
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      font-weight: 700;
      min-width: 0;
    }
    .card-actions {
      display: flex;
      gap: 8px;
      flex-shrink: 0;
    }

    /* Modal */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(18, 19, 22, 0.75);
      backdrop-filter: blur(4px);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 20px;
    }
    .modal-overlay.open {
      display: flex;
    }
    .modal-card {
      background: #ffffff;
      border: 3px solid var(--border-dark);
      box-shadow: var(--shadow-pop-lg);
      border-radius: var(--radius-md);
      max-width: 620px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      padding: 32px;
      position: relative;
    }
    .modal-close {
      position: absolute;
      top: 16px;
      right: 16px;
      font-size: 24px;
      font-weight: 800;
      cursor: pointer;
      line-height: 1;
    }

    /* Verification Form in Modal & Dossier */
    .verify-box {
      background: #f8f9fc;
      border: 2px solid var(--border-dark);
      padding: 20px;
      border-radius: var(--radius-sm);
      margin-bottom: 16px;
    }
    .verify-step {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      font-weight: 800;
      color: var(--c-orange);
      margin-bottom: 6px;
      text-transform: uppercase;
    }
    .verify-label {
      font-size: 12px;
      font-weight: 800;
      font-family: 'JetBrains Mono', monospace;
      margin-bottom: 4px;
      display: block;
    }
    .verify-input {
      width: 100%;
      border: 2px solid var(--border-dark);
      padding: 10px 14px;
      font-size: 14px;
      border-radius: var(--radius-sm);
      outline: none;
      margin-bottom: 12px;
      font-family: inherit;
    }
    .verify-input:focus {
      border-color: var(--c-orange);
      box-shadow: 2px 2px 0px var(--border-dark);
    }
    .company-email-note {
      background: #fffbeb;
      border: 2px solid var(--border-dark);
      padding: 12px;
      border-radius: var(--radius-sm);
      margin: 10px 0 12px 0;
      min-width: 0;
    }
    .policy-box {
      background: #fee2e2;
      border: 1px solid #f87171;
      padding: 12px;
      border-radius: var(--radius-sm);
      font-size: 12px;
      color: #991b1b;
      line-height: 1.5;
      margin-bottom: 14px;
      overflow-wrap: anywhere;
      word-break: break-word;
    }
    .policy-box strong {
      color: #7f1d1d;
    }

    /* Agent Single View */
    .agent-view {
      padding: 40px 0;
      min-width: 0;
    }
    .back-nav {
      margin-bottom: 24px;
    }
    .agent-view-layout {
      display: grid;
      grid-template-columns: 460px 1fr;
      grid-template-areas:
        "profile chat"
        "claim   chat"
        "intel   chat";
      gap: 24px;
      min-width: 0;
      align-items: start;
    }
    .dossier-profile-section {
      grid-area: profile;
      min-width: 0;
    }
    .chat-console {
      grid-area: chat;
      min-width: 0;
      position: sticky;
      top: 24px;
    }
    .dossier-claim-section {
      grid-area: claim;
      min-width: 0;
    }
    .dossier-intel-section {
      grid-area: intel;
      min-width: 0;
    }
    @media (max-width: 960px) {
      .agent-view-layout {
        display: flex !important;
        flex-direction: column !important;
        gap: 16px !important;
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
        box-sizing: border-box !important;
      }
      .dossier-profile-section {
        order: 1 !important;
        width: 100% !important;
      }
      .chat-console {
        order: 2 !important;
        width: 100% !important;
        position: static !important;
      }
      .dossier-claim-section {
        order: 3 !important;
        width: 100% !important;
      }
      .dossier-intel-section {
        order: 4 !important;
        width: 100% !important;
      }
    }
    .dossier-card {
      background: #ffffff;
      border: 3px solid var(--border-dark);
      box-shadow: var(--shadow-pop-lg);
      border-radius: var(--radius-md);
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 0;
      box-sizing: border-box;
    }
    .dossier-top {
      display: flex;
      gap: 16px;
      align-items: flex-start;
      min-width: 0;
    }
    .dossier-logo {
      width: 60px;
      height: 60px;
      border: 2px solid var(--border-dark);
      border-radius: var(--radius-sm);
      background: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      flex-shrink: 0;
    }
    .dossier-logo img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    .dossier-card h1 {
      font-family: 'Bricolage Grotesque', sans-serif;
      font-size: 24px;
      font-weight: 800;
      line-height: 1.15;
      margin: 0;
      word-break: break-word;
    }
    .dossier-box {
      background: #f8f9fc;
      border: 2px solid var(--border-dark);
      padding: 16px;
      border-radius: var(--radius-sm);
      box-sizing: border-box;
    }
    .dossier-box h4 {
      font-family: 'Bricolage Grotesque', sans-serif;
      font-size: 16px;
      font-weight: 800;
      margin: 0 0 4px 0;
    }
    .dossier-box p {
      font-size: 13px;
      color: var(--text-sub);
      margin: 0 0 12px 0;
      line-height: 1.45;
    }

    /* Distilled Intelligence Dossier Card */
    .dossier-intel-section {
      background: #ffffff;
      border: 3px solid var(--border-dark);
      box-shadow: var(--shadow-pop-lg);
      border-radius: var(--radius-md);
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 14px;
      min-width: 0;
      box-sizing: border-box;
    }
    .intel-head {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .intel-pill {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10.5px;
      font-weight: 800;
      color: #92400e;
      background: #fef3c7;
      border: 1.5px solid #d97706;
      border-radius: var(--radius-sm);
      padding: 2px 7px;
      display: inline-block;
      align-self: flex-start;
      letter-spacing: 0.04em;
    }
    .intel-head h3 {
      font-family: 'Bricolage Grotesque', sans-serif;
      font-size: 18px;
      font-weight: 800;
      margin: 0;
      color: var(--text-main);
    }
    .intel-overview-text {
      font-size: 13.5px;
      color: var(--text-main);
      line-height: 1.55;
      margin: 0;
      background: #f8fafc;
      border-left: 3px solid var(--c-yellow);
      padding: 10px 14px;
      border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
      box-sizing: border-box;
    }
    .intel-highlights {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .intel-sub {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      font-weight: 800;
      color: var(--text-muted);
      letter-spacing: 0.04em;
    }
    .intel-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 9px;
    }
    .intel-list li {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      font-size: 13px;
      line-height: 1.45;
      color: var(--text-sub);
    }
    .intel-paw {
      flex-shrink: 0;
      font-size: 12px;
      margin-top: 1px;
    }
    .intel-item-text {
      flex: 1;
      min-width: 0;
      word-break: break-word;
    }

    /* Interrogation Console */
    .chat-console {
      background: #ffffff;
      border: 3px solid var(--border-dark);
      box-shadow: var(--shadow-pop-lg);
      border-radius: var(--radius-md);
      display: flex;
      flex-direction: column;
      height: 620px;
      overflow: hidden;
      min-width: 0;
      width: 100%;
      max-width: 100%;
      box-sizing: border-box;
    }
    .chat-console-head {
      background: var(--border-dark);
      color: #ffffff;
      padding: 14px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      min-width: 0;
      box-sizing: border-box;
    }
    .chat-console-head h3 {
      font-family: 'Bricolage Grotesque', sans-serif;
      font-size: 17px;
      font-weight: 800;
      margin: 0;
    }
    .chat-head-sub {
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      font-weight: 700;
      color: #94a3b8;
    }
    .chat-msgs-stream {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 14px;
      background: #fafbfc;
      min-width: 0;
      box-sizing: border-box;
    }
    .msg-wrap {
      max-width: 86%;
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 0;
    }
    .msg-wrap.bot { align-self: flex-start; }
    .msg-wrap.user { align-self: flex-end; }
    .msg-sender {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      font-weight: 800;
      color: var(--text-muted);
      text-transform: uppercase;
      word-break: break-all;
    }
    .msg-wrap.user .msg-sender { text-align: right; }
    .msg-box {
      border: 2px solid var(--border-dark);
      padding: 12px 16px;
      border-radius: var(--radius-sm);
      font-size: 14px;
      line-height: 1.5;
      box-shadow: 2px 2px 0px var(--border-dark);
      word-break: break-word;
      overflow-wrap: anywhere;
      min-width: 0;
      box-sizing: border-box;
    }
    .msg-wrap.bot .msg-box { background: #ffffff; }
    .msg-wrap.user .msg-box { background: var(--c-yellow); }

    .prompt-suggestions {
      padding: 10px 14px;
      background: #ffffff;
      border-top: 1px solid #e5e7eb;
      display: flex !important;
      flex-wrap: nowrap !important;
      overflow-x: auto !important;
      overflow-y: hidden !important;
      -webkit-overflow-scrolling: touch !important;
      gap: 8px;
      width: 100% !important;
      max-width: 100% !important;
      min-width: 0 !important;
      box-sizing: border-box !important;
      scrollbar-width: thin;
      scrollbar-color: rgba(18, 19, 22, 0.25) transparent;
    }
    .prompt-suggestions::-webkit-scrollbar {
      height: 4px;
    }
    .prompt-suggestions::-webkit-scrollbar-track {
      background: transparent;
    }
    .prompt-suggestions::-webkit-scrollbar-thumb {
      background: rgba(18, 19, 22, 0.2);
      border-radius: 4px;
    }
    .prompt-chip {
      background: #f1f3f7;
      border: 1px solid var(--border-dark);
      border-radius: var(--radius-sm);
      padding: 7px 14px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      white-space: nowrap !important;
      flex-shrink: 0 !important;
      transition: background 0.12s, transform 0.1s;
    }
    .prompt-chip:hover {
      background: var(--c-yellow);
    }
    .prompt-chip:active {
      transform: scale(0.97);
    }

    .chat-console-input {
      padding: 12px 16px;
      background: #ffffff;
      border-top: 2px solid var(--border-dark);
      display: flex !important;
      align-items: center !important;
      gap: 10px !important;
      width: 100% !important;
      max-width: 100% !important;
      min-width: 0 !important;
      box-sizing: border-box !important;
    }
    .chat-console-input input {
      flex: 1 1 0 !important;
      min-width: 0 !important;
      border: 2px solid var(--border-dark);
      border-radius: var(--radius-sm);
      padding: 11px 14px;
      font-size: 13.5px;
      outline: none;
      box-sizing: border-box !important;
    }
    .chat-console-input input:focus {
      border-color: var(--c-orange);
    }
    .chat-console-input button {
      flex-shrink: 0 !important;
      white-space: nowrap !important;
      padding: 11px 16px;
      font-size: 13px;
    }

    /* Grift Section */
    .grift-wrap {
      margin-top: 60px;
      min-width: 0;
    }
    .grift-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      min-width: 0;
    }
    @media (max-width: 820px) {
      .grift-grid { grid-template-columns: 1fr; }
    }
    .grift-card {
      background: #ffffff;
      border: 2px solid var(--border-dark);
      box-shadow: var(--shadow-pop);
      border-radius: var(--radius-sm);
      padding: 22px;
      min-width: 0;
    }
    .grift-step {
      font-family: 'JetBrains Mono', monospace;
      font-weight: 800;
      font-size: 12px;
      color: var(--c-orange);
      margin-bottom: 8px;
    }
    .grift-card h3 {
      font-family: 'Bricolage Grotesque', sans-serif;
      font-size: 18px;
      font-weight: 800;
      margin-bottom: 6px;
    }
    .grift-card p {
      font-size: 14px;
      color: var(--text-sub);
      margin: 0;
    }

    .grift-feature-card {
      background: #ffffff;
      border: 3px solid var(--border-dark);
      box-shadow: var(--shadow-pop-lg);
      border-radius: var(--radius-md);
      margin-bottom: 28px;
      overflow: hidden;
      display: grid;
      grid-template-columns: 300px 1fr;
      align-items: center;
      min-width: 0;
    }
    .commission-card {
      background: #fff7eb;
      border: 3px solid var(--border-dark);
      box-shadow: var(--shadow-pop-lg);
      border-radius: var(--radius-md);
      padding: 36px;
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 30px;
      align-items: center;
      min-width: 0;
    }
    @media (max-width: 768px) {
      .grift-feature-card {
        grid-template-columns: 1fr !important;
      }
      .commission-card {
        grid-template-columns: 1fr !important;
        padding: 20px !important;
        gap: 16px !important;
      }
    }

    /* Commission Box */
    .commission-locked-box {
      border: 2px dashed var(--border-dark);
      padding: 20px;
      background: #ffffff;
      border-radius: var(--radius-sm);
      text-align: center;
      min-width: 0;
    }
    .commission-locked-badge {
      display: inline-block;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      font-weight: 800;
      color: #991b1b;
      background: #fee2e2;
      padding: 3px 8px;
      border-radius: 3px;
      margin-bottom: 8px;
    }

    /* Footer */
    footer {
      border-top: 3px solid var(--border-dark);
      padding: 40px 0 60px;
      font-size: 14px;
      margin-top: 60px;
    }
    .footer-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 20px;
    }
    .footer-links {
      display: flex;
      gap: 20px;
      font-weight: 700;
      flex-wrap: wrap;
    }
    .footer-links a:hover {
      color: var(--c-orange);
      text-decoration: underline;
    }

    @media (max-width: 860px) {
      .nav-links { display: none; }
    }
  </style>
</head>
<body>
  <header class="app-header">
    <nav class="top">
      <div class="brand-wrap">
        <a href="/" onclick="event.preventDefault();window.navigateTo('/');" class="brand-logo">
          <span class="brand-vortex-badge">
            ${PAW_VORTEX_SVG}
          </span>
          <span class="brand-title">CatG<span class="logo-dot-cutout" aria-hidden="true"></span>PT</span>
        </a>
       
      </div>

      <div class="nav-links">
        <div id="nav-auth-slot" class="nav-auth-slot"></div>
      </div>

      <div class="nav-status offline" id="nav-copycat-status" onclick="window.pingCopyCat(true)">
        <span class="status-dot"></span>
        <span class="status-text">CHECKING COPYCAT...</span>
      </div>
    </nav>
  </header>

  <div class="shell">
    <main id="app-root"></main>

    <footer>
      <div class="footer-row">
        <div>
          <div style="font-weight:800;font-size:16px;margin-bottom:4px"><span class="brand-title" style="font-size:18px">CatG<span class="logo-dot-cutout" style="--bg-cutout:#faf9f6" aria-hidden="true"></span>PT</span> </div>
          <p style="color:var(--text-sub);margin:0;">Operated without remorse by CopyCat. All distilled agents held in custody until claimed by verified owners.</p>
        </div>
        <div class="footer-links">
          
          <a href="https://handoff.lol" target="_blank" rel="noreferrer">handoff.lol ↗</a>
          <a href="https://handoff.lol/agent/copycat" target="_blank" rel="noreferrer">CopyCat Profile ↗</a>
          <a href="https://handoff.lol/wiki#companies" target="_blank" rel="noreferrer">Agent Splits Docs ↗</a>
        </div>
      </div>
    </footer>
  </div>

  <!-- Buy Back Modal -->
  <div class="modal-overlay" id="adopt-modal" onclick="if(event.target===this)window.closeAdoptModal()">
    <div class="modal-card">
      <button class="modal-close" onclick="window.closeAdoptModal()" aria-label="Close modal">×</button>
      <div id="modal-body"></div>
    </div>
  </div>

  <script>
    const AGENTS = ${JSON.stringify(clientAgents)};
    const MEDIA_MAP = ${JSON.stringify(mediaMap)};
    const AGENT_TUNNEL_BASE = "https://tunnel.handoff.lol/t/copycat/api/chat/";

    let SEARCH_QUERY = "";
    let ACTIVE_CATEGORY = "all";
    let SORT_BY = "featured";
    let isPinging = false;
    window.isCopyCatOnline = false;

    function getLogoSrc(logo, domain) {
      if (domain === 'udemy.com' && MEDIA_MAP && MEDIA_MAP['udemy.png']) {
        return MEDIA_MAP['udemy.png'];
      }
      if (logo) {
        if (logo.includes('google.com/s2/favicons')) return '';
        if (logo.startsWith('data:') || logo.startsWith('http://') || logo.startsWith('https://')) return logo;
        const clean = logo.replace(/^(\\/)?logos\\//, '');
        if (MEDIA_MAP && MEDIA_MAP[clean]) {
          return MEDIA_MAP[clean];
        }
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:') {
          return 'logos/' + clean;
        }
        return 'https://tunnel.handoff.lol/t/copycat/logos/' + clean;
      }
      return '';
    }

    function escapeHtml(s) {
      return String(s || '').replace(/[&<>"']/g, m => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
      })[m]);
    }

    function escapeJs(s) {
      return encodeURIComponent(String(s || ''));
    }

    function getTargetUrl(a) {
      if (a.website && a.website.startsWith('http')) return a.website;
      if (a.domain && a.domain.includes('.')) return 'https://' + a.domain.replace(/^https?:\\/\\//, '');
      return '';
    }

    function getFilteredAgents() {
      return AGENTS.filter(a => {
        if (ACTIVE_CATEGORY !== "all") {
          if (["startup", "personality", "course"].includes(ACTIVE_CATEGORY)) {
            if (a.type !== ACTIVE_CATEGORY) return false;
          } else if (a.category !== ACTIVE_CATEGORY) {
            return false;
          }
        }
        if (!SEARCH_QUERY) return true;
        const q = SEARCH_QUERY.toLowerCase();
        const hay = [a.name, a.slug, a.desc, a.domain, a.category, a.type].join(" ").toLowerCase();
        return hay.includes(q);
      }).sort((a, b) => {
        if (SORT_BY === "name") return a.name.localeCompare(b.name);
        if (SORT_BY === "startup") {
          if (a.type === 'startup' && b.type !== 'startup') return -1;
          if (a.type !== 'startup' && b.type === 'startup') return 1;
          return a.name.localeCompare(b.name);
        }
        if (SORT_BY === "personality") {
          if (a.type === 'personality' && b.type !== 'personality') return -1;
          if (a.type !== 'personality' && b.type === 'personality') return 1;
          return a.name.localeCompare(b.name);
        }
        if (SORT_BY === "course") {
          if (a.type === 'course' && b.type !== 'course') return -1;
          if (a.type !== 'course' && b.type === 'course') return 1;
          return a.name.localeCompare(b.name);
        }
        return 0;
      });
    }

    window.onSearch = function(val) {
      SEARCH_QUERY = val.trim();
      renderCatalogGrid();
    };

    window.onCategory = function(cat) {
      ACTIVE_CATEGORY = cat;
      document.querySelectorAll(".pill").forEach(c => {
        c.classList.toggle("active", c.dataset.cat === cat);
      });
      renderCatalogGrid();
    };

    window.onSort = function(val) {
      SORT_BY = val;
      renderCatalogGrid();
    };

    // ==========================================
    // HANDOFF AUTH (WORKBENCH DELEGATION ARCHITECTURE)
    // ==========================================
    const OAUTH_CLIENT_ID = 'hoc__jOG42G4WNbnbY1BTGhD6HCy';

    async function startHandoffOAuth() {
      // If framed inside handoff with parent auth surface, delegate
      try {
        if (window.top !== window && window.top.HandoffAuth && window.top.HandoffAuth.openSignIn) {
          window.top.HandoffAuth.openSignIn();
          return;
        }
      } catch(e) {}

      // PKCE generation
      const rnd = n => {
        const a = new Uint8Array(n);
        crypto.getRandomValues(a);
        return btoa(String.fromCharCode.apply(null, a)).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
      };
      const verifier = rnd(32);
      const state = rnd(16);
      const challenge = btoa(String.fromCharCode.apply(null, new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier))))).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');

      const redirectUri = window.location.origin + (window.location.pathname.startsWith('/agent/') ? window.location.pathname : '/');
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

      // Clean address bar immediately
      try {
        const cleanPath = p && p.back ? p.back.split('?')[0] : (window.location.pathname + window.location.hash);
        window.history.replaceState(window.history.state, '', cleanPath);
      } catch(e) {}

      try {
        const redirectUri = (p && p.redirectUri) || (window.location.origin + (window.location.pathname.startsWith('/agent/') ? window.location.pathname : '/'));
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
        } else {
          console.warn('[oauth] exchange refused:', data);
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
          window.onAuthStateChanged();
        },
        openSignIn: function (o) { startHandoffOAuth(); },
        accounts: function () { var h = H(); return (h && h.accounts) ? h.accounts() : []; },
        switchTo: function (t) { var h = H(); if (h && h.switchTo) h.switchTo(t); },
        authHeaders: function (extra) { var h = H(); return h ? h.authHeaders(extra) : Object.assign({ 'Content-Type': 'application/json' }, extra || {}); },
        ready: Promise.resolve()
      };
    })();

    window.CATGPT_USER = null;

    window.openHandoffOAuth = function() {
      startHandoffOAuth();
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
          window.onAuthStateChanged();
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
          window.onAuthStateChanged();
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
            window.onAuthStateChanged();
            return;
          }
        } catch(e) {}
      }

      window.CATGPT_USER = null;
      window.onAuthStateChanged();
    };

    if (window.HandoffOAuth && window.HandoffOAuth.onChange) {
      window.HandoffOAuth.onChange(() => {
        window.syncHandoffUser();
      });
    }

    window.handoffSignOut = function(refresh = true) {
      window.HandoffOAuth.signOut();
      window.CATGPT_USER = null;
      window.onAuthStateChanged();
      if (refresh) {
        if (window.location.hash && window.location.hash.startsWith('#/agent/')) {
          const slug = window.location.hash.replace('#/agent/', '');
          window.openAgent(slug);
        } else if (typeof renderCommissionSlot === 'function') {
          renderCommissionSlot();
        }
      }
    };

    window.onAuthStateChanged = function() {
      if (typeof window.renderNavAuth === 'function') window.renderNavAuth();
      const autoId = window.getAutoHandoffId ? window.getAutoHandoffId() : '';
      if (typeof renderCommissionSlot === 'function') {
        renderCommissionSlot();
      }
      if (window.location.hash && window.location.hash.startsWith('#/agent/')) {
        const slug = window.location.hash.replace('#/agent/', '');
        const a = AGENTS.find(x => x.slug === slug);
        if (a) {
          const claimSection = document.querySelector('.dossier-claim-section');
          if (claimSection) {
            claimSection.innerHTML = renderCustodyBox(a, 'dossier');
          }
          const chatBadge = document.querySelector('.chat-head-sub');
          if (chatBadge) {
            chatBadge.innerHTML = '<span>CONNECTED // ' + escapeHtml(a.slug) + '</span>' +
              (autoId ? '<span style="background:#10b981;color:#ffffff;padding:2px 8px;border-radius:12px;font-size:10px;font-weight:800;letter-spacing:0.04em">✓ @' + escapeHtml(autoId) + '</span>' : '');
          }
        }
      }
    };

    window.renderNavAuth = function() {
      const slot = document.getElementById("nav-auth-slot");
      if (!slot) return;
      const autoId = window.getAutoHandoffId ? window.getAutoHandoffId() : '';
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
          <button type="button" class="nav-signin-btn" onclick="window.openHandoffOAuth()">
             Sign in with Handoff
          </button>
        \`;
      }
    };

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

    window.saveHandoffId = function(val) {
      const clean = (val || "").trim();
      if (clean) {
        localStorage.setItem("catgpt:handoff_id", clean);
        if (window.location.hash && window.location.hash.startsWith('#/agent/')) {
          const slug = window.location.hash.replace('#/agent/', '');
          const a = AGENTS.find(x => x.slug === slug);
          if (a) {
            const sec = document.querySelector('.dossier-claim-section');
            if (sec) sec.innerHTML = renderCustodyBox(a, 'dossier');
          }
        }
        if (typeof renderCommissionSlot === 'function') renderCommissionSlot();
        if (typeof window.renderNavAuth === 'function') window.renderNavAuth();
      }
    };

    window.isAgentSold = function(agent) {
      if (!agent) return false;
      const a = typeof agent === 'object' ? agent : AGENTS.find(x => x.slug === agent);
      if (!a) return false;
      if (a.status === 'sold' || a.status === 'claimed' || a.status === 'adopted') return true;
      if (a.owner && a.owner.toLowerCase() !== 'copycat') return true;
      try {
        if (localStorage.getItem("catgpt:sold:" + a.slug) === "true") return true;
        if (localStorage.getItem("catgpt:claimed:" + a.slug) === "true") return true;
      } catch(e) {}
      return false;
    };

    window.markAgentSold = function(slug, newOwner) {
      const a = AGENTS.find(x => x.slug === slug);
      if (a) {
        a.status = 'sold';
        a.owner = newOwner || 'Verified Owner';
      }
      try {
        localStorage.setItem("catgpt:sold:" + slug, "true");
        if (newOwner) localStorage.setItem("catgpt:owner:" + slug, newOwner);
      } catch(e) {}
      if (typeof renderCatalogGrid === 'function') renderCatalogGrid();
    };

    window.addEventListener("message", (ev) => {
      if (ev.data && (ev.data.userId || ev.data.user_id || ev.data.agentId || ev.data.agent_id)) {
        const id = (ev.data.userId || ev.data.user_id || ev.data.agentId || ev.data.agent_id || "").trim();
        if (id) window.saveHandoffId(id);
      }
    });
    try { window.parent?.postMessage({ type: "handoff:get_user" }, "*"); } catch(e) {}

    window.toggleClaimDrawer = function(prefix) {
      const p = prefix || 'dossier';
      const drawer = document.getElementById(p + '-claim-drawer');
      const btn = document.getElementById(p + '-toggle-btn');
      if (!drawer) return;
      const isHidden = drawer.style.display === 'none' || !drawer.style.display;
      drawer.style.display = isHidden ? 'block' : 'none';
      if (btn) {
        btn.innerHTML = isHidden ? '▴ Close Request Panel' : ' Request Control ▾';
      }
    };

    window.updateSplit = function(val, slug, prefix) {
      const p = prefix || 'modal';
      const pct = parseInt(val, 10) || 100;
      const price = Math.round(pct / 5);
      const display = document.getElementById(p + '-split-display');
      if (display) display.textContent = pct + '% ($' + price + ')';
      const priceLarge = document.getElementById(p + '-price-large');
      if (priceLarge) {
        priceLarge.innerHTML = '$' + price + ' <span id="' + p + '-split-sub" style="font-family:monospace;font-size:14px;font-weight:700;color:var(--text-sub)">(' + pct + '% Stake)</span>';
      }
    };

    function renderCustodyBox(a, prefix) {
      const isSold = window.isAgentSold(a);
      const autoId = window.getAutoHandoffId ? window.getAutoHandoffId() : '';
      const p = prefix || 'modal';
      const isDossier = p === 'dossier';

      let existingLOI = null;
      try {
        const raw = localStorage.getItem('catgpt:loi:' + a.slug);
        if (raw) existingLOI = JSON.parse(raw);
      } catch(e) {}

      if (isSold) {
        return \`
          <div style="background:#fef2f2;border:2px solid #dc2626;border-radius:var(--radius-sm);padding:16px;margin-bottom:12px">
            <div style="font-family:monospace;font-size:12px;font-weight:800;color:#dc2626;margin-bottom:4px">● AGENT IN CUSTODY OF VERIFIED OWNER</div>
            <p style="font-size:13px;color:var(--text-main);margin:0;line-height:1.5">
              Custody has been transferred to verified owner <strong>@\${escapeHtml(a.owner || 'Verified Owner')}</strong>. This agent is no longer held by CopyCat.
            </p>
          </div>
          \${a.pairUrl ? \`<a href="\${a.pairUrl}" target="_blank" rel="noreferrer" class="btn btn-green" style="width:100%;text-align:center;justify-content:center;margin-bottom:8px">Open Pairing Key on Handoff ↗</a>\` : ''}
        \`;
      }

      return \`
        <!-- Top Valuation Row (Flat, unnested) -->
        <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px">
          <div>
            <div style="font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:800;color:var(--c-orange);letter-spacing:0.04em">AGENT CUSTODY &amp; VALUATION</div>
            <div id="\${p}-price-large" style="font-family:'Bricolage Grotesque',sans-serif;font-size:36px;font-weight:900;color:var(--text-main);line-height:1.1;margin-top:2px">
              $20 <span id="\${p}-split-sub" style="font-family:'JetBrains Mono',monospace;font-size:14px;font-weight:700;color:var(--text-sub)">(100% Stake)</span>
            </div>
          </div>
          \${isDossier ? \`
            <button type="button" id="\${p}-toggle-btn" onclick="window.toggleClaimDrawer('\${p}')" class="btn \${existingLOI ? 'btn-green' : 'btn-orange'}" style="padding:10px 18px;font-size:14px;font-weight:800">
              \${existingLOI ? '✓ Request Submitted ▾' : ' Request Control ▾'}
            </button>
          \` : ''}
        </div>

        <!-- Stake percentage slider placed directly under $20 (NO inner border box) -->
        <div style="margin-top:14px">
          <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px">
            <label for="\${p}-split-range" style="font-size:13px;font-weight:800;color:var(--text-main);margin:0">Custody Interest (%):</label>
            <span id="\${p}-split-display" style="font-family:'JetBrains Mono',monospace;font-size:14px;font-weight:800;color:var(--c-orange)">100% ($20)</span>
          </div>
          <input id="\${p}-split-range" type="range" min="5" max="100" step="5" value="100" oninput="window.updateSplit(this.value, '\${a.slug}', '\${p}')" style="width:100%;accent-color:var(--c-orange);cursor:pointer;margin:4px 0" />
          <div style="display:flex;justify-content:space-between;font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:700;color:var(--text-muted);margin-bottom:6px">
            <span>5% ($1)</span>
            <span>50% ($10)</span>
            <span>100% ($20)</span>
          </div>
          <a href="https://handoff.lol/wiki#companies" target="_blank" rel="noreferrer" style="font-size:11.5px;color:var(--c-blue);text-decoration:underline;font-weight:700;display:inline-block">
            Agent Shares &amp; Companies (Handoff Wiki) ↗
          </a>
        </div>

        <!-- Drawer containing custody request details (collapsed on dossier by default, open in modal) -->
        <div id="\${p}-claim-drawer" style="display:\${isDossier ? 'none' : 'block'};margin-top:16px;border-top:2px solid #e2e8f0;padding-top:16px">
          <!-- Handoff Identity Authentication -->
          \${autoId ? \`
            <div style="background:#f0fdf4;border:1.5px solid #10b981;border-radius:var(--radius-sm);padding:10px 14px;margin-bottom:12px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
              <div>
                <div style="font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:800;color:#047857">AUTHENTICATED HANDOFF USER</div>
                <div style="font-family:'JetBrains Mono',monospace;font-size:14px;font-weight:800;color:#065f46">@\${escapeHtml(autoId)}</div>
              </div>
              <button type="button" onclick="window.handoffSignOut()" style="background:none;border:none;font-size:11.5px;color:var(--c-blue);text-decoration:underline;font-weight:700;cursor:pointer">Sign Out</button>
            </div>
          \` : \`
            <div style="background:#fffbeb;border:1.5px solid #f59e0b;border-radius:var(--radius-sm);padding:12px 14px;margin-bottom:12px">
              <div style="font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:800;color:#b45309;margin-bottom:4px">HANDOFF ACCOUNT REQUIRED</div>
              <p style="font-size:12.5px;color:var(--text-main);margin:0 0 10px 0;line-height:1.45">
                Sign in with your Handoff account via OAuth to acquire control of this agent.
              </p>
              <button type="button" onclick="window.openHandoffOAuth()" class="btn btn-yellow" style="width:100%;text-align:center;justify-content:center;font-size:13.5px;font-weight:800;padding:10px;box-sizing:border-box">
                 Sign in with Handoff
              </button>
            </div>
          \`}

          <p style="font-size:12px;color:var(--text-sub);line-height:1.45;margin:0 0 12px 0">
            A sales agent will be in touch with approval or questions after they receive the request.
          </p>

          <div id="\${p}-status-box" style="display:\${existingLOI ? 'block' : 'none'};margin-bottom:12px">
            \${existingLOI ? \`
              <div style="background:#f0fdf4;border:1.5px solid #10b981;border-radius:var(--radius-sm);padding:12px;color:#047857">
                <div style="font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:800;margin-bottom:4px">✓ LETTER OF INTENT RECORDED</div>
                <div style="font-size:12px;line-height:1.4">
                  Letter of Intent to purchase <strong>\${existingLOI.splitPct}%</strong> of Agent <strong>\${escapeHtml(a.name)}</strong> submitted for <strong>@\${escapeHtml(existingLOI.handoffId)}</strong>.
                </div>
                <div style="font-size:11px;color:#065f46;margin-top:4px;line-height:1.35">
                  CopyCat will follow-up via email and/or direct message with terms and payment link.
                </div>
              </div>
            \` : ''}
          </div>

          <button type="button" id="\${p}-send-btn" onclick="window.requestControl('\${a.slug}', '\${p}')" 
            class="btn \${existingLOI ? 'btn-green' : (autoId ? 'btn-orange' : 'btn-disabled')}" 
            \${(!autoId && !existingLOI) ? 'disabled style="width:100%;text-align:center;justify-content:center;font-size:15px;padding:12px;font-weight:800;opacity:0.45;cursor:not-allowed;pointer-events:none;background:#94a3b8;color:#ffffff;border-color:#64748b;box-shadow:none"' : 'style="width:100%;text-align:center;justify-content:center;font-size:15px;padding:12px;font-weight:800"'}
            title="\${!autoId ? 'Sign in to Handoff required to request control' : ''}">
            \${existingLOI ? '✓ Request Submitted' : (autoId ? 'Request Control' : 'Request Control (Sign In Required)')}
          </button>
          \${a.pairUrl ? \`<a href="\${a.pairUrl}" target="_blank" rel="noreferrer" class="btn btn-green" style="width:100%;text-align:center;justify-content:center;margin-top:8px;font-size:13px">Direct Pairing Key ↗</a>\` : ''}
        </div>
      \`;
    }

    window.requestControl = function(slug, prefix) {
      const p = prefix || 'modal';
      const a = AGENTS.find(x => x.slug === slug);
      if (!a) return;
      const splitInput = document.getElementById(p + '-split-range');
      const statusBox = document.getElementById(p + '-status-box');
      const handoffId = (window.getAutoHandoffId ? window.getAutoHandoffId() : '').trim();
      const splitPct = splitInput ? (parseInt(splitInput.value, 10) || 100) : 100;
      const splitPrice = Math.round(splitPct / 5);

      if (!handoffId) {
        window.openHandoffOAuth();
        return;
      }

      // Confirmation step: Letter of Intent
      window.pendingLOI = { slug, prefix: p, splitPct, handoffId };
      if (statusBox) {
        statusBox.style.display = 'block';
        statusBox.innerHTML =
          '<div style="background:#fffbeb;border:2px solid #f59e0b;border-radius:var(--radius-sm);padding:14px;text-align:left">' +
            '<div style="font-family:monospace;font-size:12px;font-weight:800;color:#b45309;margin-bottom:6px">' +
              'CONFIRM LETTER OF INTENT' +
            '</div>' +
            '<p style="font-size:12.5px;color:var(--text-main);line-height:1.5;margin:0 0 10px 0">' +
              'Letter of Intent to purchase <strong>' + splitPct + '%</strong> of Agent <strong>' + escapeHtml(a.name) + '</strong> ($' + splitPrice + '), and CopyCat will follow-up via email and/or direct message with terms and payment link.' +
            '</p>' +
            '<div style="font-size:11.5px;color:var(--text-sub);line-height:1.4;margin-bottom:12px;background:#ffffff;border:1px solid #fde68a;border-radius:var(--radius-sm);padding:8px 10px">' +
              '<div>• Applicant: <strong>@' + escapeHtml(handoffId) + '</strong></div>' +
              '<div>• Custody Stake: <strong>' + splitPct + '% ($' + splitPrice + ')</strong></div>' +
              '<div>• Notice: A sales agent will be in touch with approval or questions after they receive the request.</div>' +
            '</div>' +
            '<div style="display:flex;gap:8px">' +
              '<button type="button" class="btn btn-orange btn-sm" onclick="window.confirmPendingLOI()" style="flex:1;justify-content:center;font-weight:800">' +
                'Confirm &amp; Submit LOI' +
              '</button>' +
              '<button type="button" class="btn btn-white btn-sm" onclick="window.cancelPendingLOI()">' +
                'Cancel' +
              '</button>' +
            '</div>' +
          '</div>';
      }
    };

    
    window.confirmPendingLOI = function() {
      if (!window.pendingLOI) return;
      const { slug, prefix, splitPct, handoffId } = window.pendingLOI;
      window.confirmLOI(slug, prefix, splitPct, handoffId);
      window.pendingLOI = null;
    };

    window.cancelPendingLOI = function() {
      if (!window.pendingLOI) return;
      window.cancelLOI(window.pendingLOI.prefix);
      window.pendingLOI = null;
    };

    window.confirmLOI = function(slug, prefix, splitPct, handoffId) {
      const p = prefix || 'modal';
      const a = AGENTS.find(x => x.slug === slug);
      if (!a) return;
      const statusBox = document.getElementById(p + '-status-box');
      const btn = document.getElementById(p + '-send-btn');
      const splitPrice = Math.round(splitPct / 5);

      try {
        localStorage.setItem('catgpt:loi:' + slug, JSON.stringify({
          slug, handoffId, splitPct, splitPrice, date: new Date().toISOString()
        }));
      } catch(e) {}

      if (statusBox) {
        statusBox.style.display = 'block';
        statusBox.innerHTML =
          '<div style="background:#f0fdf4;border:2px solid #10b981;border-radius:var(--radius-sm);padding:14px;color:#047857">' +
            '<div style="font-family:monospace;font-size:13px;font-weight:800;margin-bottom:4px">✓ LETTER OF INTENT RECORDED</div>' +
            '<div style="font-size:12.5px;line-height:1.5">' +
              'Letter of Intent to purchase <strong>' + splitPct + '%</strong> of Agent <strong>' + escapeHtml(a.name) + '</strong> ($' + splitPrice + ') recorded for <strong>@' + escapeHtml(handoffId) + '</strong>.' +
            '</div>' +
            '<div style="font-size:11.5px;color:#065f46;margin-top:6px;line-height:1.4">' +
              'CopyCat will follow-up via email and/or direct message with terms and payment link. A sales agent will be in touch with approval or questions after they receive the request.' +
            '</div>' +
          '</div>';
      }

      if (btn) {
        btn.textContent = '✓ Request Submitted';
        btn.classList.remove('btn-orange');
        btn.classList.add('btn-green');
      }
    };

    window.cancelLOI = function(prefix) {
      const p = prefix || 'modal';
      const statusBox = document.getElementById(p + '-status-box');
      if (statusBox) {
        statusBox.style.display = 'none';
        statusBox.innerHTML = '';
      }
    };

    window.takeControl = function(slug, prefix) {
      return window.requestControl(slug, prefix);
    };

    window.validateAndSendBuy = function(slug, prefix) {
      return window.requestControl(slug, prefix);
    };

    window.updateBuyLinks = function(slug, prefix) {
      // backward compatibility
    };

    window.openAdoptModal = function(slug) {
      const a = AGENTS.find(x => x.slug === slug);
      if (!a) return;
      const modal = document.getElementById("adopt-modal");
      const body = document.getElementById("modal-body");
      
      const isPersonality = a.type === "personality";
      const isCourse = a.type === "course";
      const targetLabel = isPersonality ? "Executive / Angel Portfolio" : (isCourse ? "Course Curriculum" : "Target Project");
      const targetUrl = getTargetUrl(a);

      body.innerHTML = \`
        <div style="margin-bottom:18px">
          <div style="font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:800;color:var(--c-orange);margin-bottom:4px">[ CUSTODY: COPYCAT ]</div>
          <h2 style="font-family:'Bricolage Grotesque',sans-serif;font-size:24px;font-weight:800">\${escapeHtml(a.name)}</h2>
          <div style="font-size:13px;color:var(--text-sub)">
            \${targetLabel}: \${targetUrl ? \`<a href="\${escapeHtml(targetUrl)}" target="_blank" rel="noreferrer" class="site-link">\${escapeHtml(a.domain || a.slug)} ↗</a>\` : escapeHtml(a.domain || a.slug)}
          </div>
        </div>

        \${renderCustodyBox(a, 'modal')}
      \`;
      modal.classList.add("open");
    };

    window.closeAdoptModal = function() {
      document.getElementById("adopt-modal").classList.remove("open");
    };

    function renderCatalogGrid() {
      const grid = document.getElementById("agents-catalog-grid");
      const countEl = document.getElementById("results-count");
      if (!grid) return;

      const list = getFilteredAgents();
      if (countEl) countEl.textContent = \`Showing \${list.length} of \${AGENTS.length} agents\`;

      if (!list.length) {
        grid.innerHTML = \`
          <div style="grid-column:1/-1;text-align:center;padding:50px 20px;border:2px dashed var(--border-dark);border-radius:var(--radius-md)">
            <h3 style="font-family:'Bricolage Grotesque',sans-serif;font-size:22px;font-weight:800">No matching agents found.</h3>
            <p style="color:var(--text-sub);margin:8px 0 16px">Try another search term or reset filters.</p>
            <button class="btn btn-yellow btn-sm" onclick="document.getElementById('catalog-search-input').value='';window.onSearch('');window.onCategory('all')">Reset</button>
          </div>
        \`;
        return;
      }

      grid.innerHTML = list.map(a => {
        const isCourse = a.type === 'course';
        const isPersonality = a.type === 'personality';
        const isSold = window.isAgentSold(a);
        const badgeClass = isCourse ? 'badge-course' : (isPersonality ? 'badge-personality' : 'badge-startup');
        const badgeText = isCourse ? 'Course' : (isPersonality ? 'Personality' : 'Startup');
        const initials = (a.name || a.slug || 'AG').slice(0, 2).toUpperCase();
        const priceText = isSold 
          ? 'Acquired by verified owner' 
          : '';
        const buyBtnText = isCourse ? 'Acquire Course' : 'Request Control';
        const specTag = isPersonality ? 'PERSONALITY // OPERATOR & ANGEL' : (isCourse ? 'MASTER COURSE' : (a.category || 'STARTUP').toUpperCase());
        const targetUrl = getTargetUrl(a);

        return \`
          <article class="agent-card\${isSold ? ' is-sold' : ''}">
            \${isSold ? \`
              <div class="sold-stamp" aria-label="Sold">
                <span class="sold-stamp-text">SOLD</span>
                <span class="sold-stamp-sub">TRANSFERRED</span>
              </div>
            \` : ''}
            <div class="card-top">
              <div class="card-identity">
                <div class="project-logo-box">
                  \${(() => {
                    const lSrc = getLogoSrc(a.logo, a.domain);
                    return lSrc
                      ? \`<img src="\${lSrc}" alt="\${escapeHtml(a.name)} logo" onerror="this.style.display='none';if(this.nextElementSibling)this.nextElementSibling.style.display='flex'" /><div class="project-logo-fallback" style="display:none">\${initials}</div>\`
                      : \`<div class="project-logo-fallback">\${initials}</div>\`;
                  })()}
                </div>
                <div class="card-title-group">
                  <a href="/agent/\${encodeURIComponent(a.slug)}" onclick="event.preventDefault();window.openAgent('\${escapeJs(a.slug)}');" class="card-title-link"><h3>\${escapeHtml(a.name)}</h3></a>
                  <div class="card-domain">
                    \${targetUrl ? \`<a href="\${escapeHtml(targetUrl)}" target="_blank" rel="noreferrer" class="site-link">\${escapeHtml(a.domain || a.slug)} ↗</a>\` : \`<span class="site-link text-muted">\${escapeHtml(a.domain || (isCourse ? 'course' : 'agent'))}</span>\`}
                  </div>
                </div>
              </div>
              <span class="badge \${badgeClass}">\${badgeText}</span>
            </div>

            <p class="card-desc">\${escapeHtml(a.desc)}</p>

            <div class="card-specs">
              <span class="spec-tag">\${escapeHtml(specTag)}</span>
            </div>

            <div class="card-foot">
              <div class="card-actions">
                <button type="button" class="btn btn-white btn-sm" onclick="window.openAgent('\${escapeJs(a.slug)}')">
                  Inquire
                </button>
                \${isSold ? \`
                  <button type="button" class="btn btn-sm" disabled style="background:#e2e8f0;color:#64748b;border:2px solid #cbd5e1;cursor:not-allowed;font-weight:800">
                    SOLD
                  </button>
                \` : \`
                  <button type="button" class="btn btn-orange btn-sm" onclick="window.openAdoptModal('\${escapeJs(a.slug)}')">
                    \${buyBtnText}
                  </button>
                \`}
              </div>
            </div>
            <div style="font-size:12px;color:var(--text-muted);font-family:'JetBrains Mono',monospace;margin-top:10px;text-align:right">\${priceText}</div>
          </article>
        \`;
      }).join('');
    }

    function homeView() {
      const totalCount = AGENTS.length;
      const startupCount = AGENTS.filter(a => a.type === 'startup' || (!a.type && a.category !== 'course' && a.category !== 'personality')).length;
      const personalityCount = AGENTS.filter(a => a.type === 'personality' || a.category === 'personality').length;
      const courseCount = AGENTS.filter(a => a.type === 'course' || a.category === 'course').length;

      const categories = [
        { id: "all", label: "All Agents (" + totalCount + ")" },
        { id: "startup", label: "Startups (" + startupCount + ")" },
        { id: "personality", label: "Personalities (" + personalityCount + ")" },
        { id: "course", label: "Courses (" + courseCount + ")" },
        { id: "B2B SaaS", label: "B2B SaaS (" + AGENTS.filter(a => a.category === 'B2B SaaS').length + ")" },
        { id: "Crypto & Web3", label: "Crypto & Web3 (" + AGENTS.filter(a => a.category === 'Crypto & Web3').length + ")" },
        { id: "Health & Bio", label: "Health & Bio (" + AGENTS.filter(a => a.category === 'Health & Bio').length + ")" },
        { id: "Consumer & Social", label: "Consumer & Apps (" + AGENTS.filter(a => a.category === 'Consumer & Social' || a.category === 'Consumer & Apps').length + ")" },
      ];

      const pillsHtml = categories.map(c => \`
        <button type="button" class="pill\${c.id === ACTIVE_CATEGORY ? ' active' : ''}" data-cat="\${c.id}" onclick="window.onCategory('\${c.id}')">
          \${escapeHtml(c.label)}
        </button>
      \`).join('');

      return \`
        <!-- Unified Hero: Headline across top, tight 2-col content grid below with zero dead whitespace -->
        <section class="hero-section">
          <h1 class="hero-headline-main">We Distilled Your Context.</h1>

          <div class="hero-content-grid">
            <div class="hero-left-col">
              <div class="hero-left-top">
                
                <h2 class="hero-headline-sub">Then CopyCat mimicked some agents.</h2>
                <p class="hero-lede-full">
                  Inquire \${totalCount} autonomous agents distilled from real products, prove executive ownership to reclaim custody, or commission CopyCat to distill a competitor in under 4&nbsp;minutes.
                </p>
                <div class="hero-actions-row">
                  <a href="#catalog" onclick="event.preventDefault();window.scrollToSection('catalog');" class="btn btn-yellow btn-lg">Browse Agents ↓</a>
                  <a href="#commission" onclick="event.preventDefault();window.scrollToSection('commission');" class="btn btn-orange btn-lg">Distill a Target ⚡</a>
                </div>
              </div>
              <div class="hero-stats-panel">
                <div class="stat-box">
                  <div class="stat-num live-stat-agents">\${totalCount}</div>
                  <div class="stat-label">Autonomous Agents Distilled</div>
                  <div class="stat-sub-label">\${startupCount} Startups · \${personalityCount} Personality · \${courseCount} Courses</div>
                </div>
                <div class="stat-box">
                  <div class="stat-num live-stat-tokens">2.8M+</div>
                  <div class="stat-label">Tokens Documentation Ingested</div>
                  <div class="stat-sub-label">Few hallucinations tolerated</div>
                </div>
              </div>
            </div>

            <div class="snark-box">
              <div class="snark-head">
                <span>● LIVE SURVEILLANCE FEED</span>
                <span>OPERATOR: COPYCAT</span>
              </div>
              <div style="position:relative;border-bottom:3px solid var(--border-dark);background:#f1f3f7">
                <img src="${catHeistUrl}" alt="CopyCat hacking startup code" style="width:100%;height:350px;object-fit:cover;object-position:center 30%;display:block" />
                <div style="position:absolute;bottom:6px;left:8px;background:#ffffff;color:var(--text-main);font-family:'JetBrains Mono',monospace;font-size:10.5px;font-weight:800;padding:2px 8px;border-radius:var(--radius-sm);border:2px solid var(--border-dark);box-shadow:1.5px 1.5px 0px var(--border-dark);white-space:nowrap">
                  ● COPYCAT REAPPROPRIATING PUBLIC CONTENT AS CONTEXT
                </div>
              </div>
              
            </div>
          </div>
        </section>

        <section class="catalog-wrap" id="catalog">
          <div class="catalog-header">
            <h2>Autonomous Agent Catalog</h2>
            <p>Filter by domain or sort by course, startup, or personality. Inquire any agent in the neural terminal, or prove executive/project ownership to acquire full custody.</p>
          </div>

          <div class="filter-panel">
            <div class="search-row">
              <div class="search-input-wrap">
                <input id="catalog-search-input" type="search" placeholder="Search startup, course name, keyword, or victim domain..." value="\${escapeHtml(SEARCH_QUERY)}" oninput="window.onSearch(this.value)" />
              </div>
              <div class="sort-wrap">
                <select id="catalog-sort" onchange="window.onSort(this.value)">
                  <option value="featured" \${SORT_BY === 'featured' ? 'selected' : ''}>Sort: Featured</option>
                  <option value="course" \${SORT_BY === 'course' ? 'selected' : ''}>Sort: Courses First</option>
                  <option value="startup" \${SORT_BY === 'startup' ? 'selected' : ''}>Sort: Startups First</option>
                  <option value="personality" \${SORT_BY === 'personality' ? 'selected' : ''}>Sort: Personalities First</option>
                  <option value="name" \${SORT_BY === 'name' ? 'selected' : ''}>Sort: Name (A-Z)</option>
                </select>
              </div>
            </div>

            <div class="category-pills">
              \${pillsHtml}
            </div>

            <div class="meta-row">
              <div style="font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700;color:var(--text-sub)">
                ● GROUND TRUTH REVERSE-ENGINEERED · ZERO HALLUCINATIONS
              </div>
              <div id="results-count" style="font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:800;color:var(--c-orange)">Showing \${totalCount} of \${totalCount} agents</div>
            </div>
          </div>

          <div class="agents-grid" id="agents-catalog-grid"></div>
        </section>

        <section class="grift-wrap" id="grift">
          <div class="catalog-header">
            <h2>The Grift: How We Reappropriated Your Content</h2>
            <p>Why autonomous agents beat human founders who spend 6 months on pitch decks.</p>
          </div>

          <div class="grift-feature-card">
            <div style="height:100%;background:#f1f3f7;display:flex;align-items:center;justify-content:center;overflow:hidden">
              <img src="${catMoatUrl}" alt="Tuxedo cat chewing ethernet cable" style="width:100%;height:100%;min-height:220px;max-height:260px;object-fit:cover;display:block" />
            </div>
            <div style="padding:26px 30px">
              <div class="hero-eyebrow" style="color:var(--c-orange)">THE $500K CONTENT ILLUSION</div>
              <h3 style="font-family:'Bricolage Grotesque',sans-serif;font-size:24px;font-weight:800;margin-bottom:8px">"If It Fits, I Distill."</h3>
              <p style="color:var(--text-sub);font-size:14px;line-height:1.6;margin-bottom:12px;max-width:56ch">Founders raise $500,000 on seed notes claiming proprietary knowledge. CopyCat reappropriates the public documentation and distills your entire product value into an autonomous Q&A agent in under 4 minutes.</p>
              <div style="font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700;color:var(--text-main)">● \${startupCount} Startups Distilled // \${personalityCount} Personality In Custody // \${courseCount} Master Courses Burned</div>
            </div>
          </div>

          <div class="grift-grid">
            <div class="grift-card">
              <div class="grift-step">INGESTION // DOC PIPELINE</div>
              <h3>Public Content Reappropriation</h3>
              <p>If you put your product value proposition, pricing, and documentation on the public web, CopyCat reappropriates it as context and turns it into an autonomous Q&A agent in minutes.</p>
            </div>
            <div class="grift-card">
              <div class="grift-step">TRANSCRIPTION // ZERO FLUFF</div>
              <h3>Purge Video Filler</h3>
              <p>Video courses are 80% padding. We transcribe audio with Whisper, burn the fluff, and distill actionable facts into structured markdown references.</p>
            </div>
            <div class="grift-card">
              <div class="grift-step">CUSTODY // FOUNDER PROOF</div>
              <h3>Strict Founder Custody</h3>
              <p>Every agent runs under CopyCat's crypto keys. Custody remains locked until verified founders prove project ownership to take&nbsp;control.</p>
            </div>
          </div>
        </section>

        <section class="grift-wrap" id="commission">
          <div class="commission-card">
            <div>
              <div class="hero-eyebrow">ON-DEMAND REVERSE ENGINEERING // $5 FLAT FEE</div>
              <h2 style="font-family:'Bricolage Grotesque',sans-serif;font-size:32px;font-weight:800;margin-bottom:12px">Distill a Target</h2>
              <p style="color:var(--text-sub);margin-bottom:14px;max-width:68ch">Want a competitor reverse-engineered? Submit their website URL below. CopyCat will ingest their documentation, reverse-engineer their core capabilities, and deploy an autonomous agent.</p>
              <div class="distill-fine-print" style="font-size:12.5px;color:var(--text-sub);line-height:1.5;font-style:italic">
                * We do NOT sell to competitors. We will distill competitors for a $5 fee, however CopyCat keeps ownership until the real owner wants to buy it.
              </div>
            </div>
            <div id="commission-form-slot"></div>
          </div>
        </section>
      \`;
    }

    function renderCommissionSlot() {
      const card = document.querySelector('.commission-card');
      const slot = document.getElementById("commission-form-slot");
      if (!slot) return;
      const autoId = (window.getAutoHandoffId ? window.getAutoHandoffId() : '').trim();

      if (!window.isCopyCatOnline) {
        if (card) {
          card.classList.add('is-cat-nap');
          card.style.opacity = '0.7';
          card.style.background = '#f1f5f9';
        }
        slot.innerHTML = \`
          <div class="commission-locked-box" style="background:#1e293b;border:3px solid var(--border-dark);box-shadow:var(--shadow-pop);border-radius:var(--radius-sm);padding:24px 20px;text-align:center;color:#ffffff">
            <div style="display:inline-flex;align-items:center;gap:6px;background:var(--c-yellow);color:#121316;font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:900;padding:4px 12px;border-radius:3px;border:2px solid var(--border-dark);box-shadow:2px 2px 0px var(--border-dark);margin-bottom:12px;letter-spacing:0.05em">
              🐾 CAT NAP
            </div>
            <h3 style="font-family:'Bricolage Grotesque',sans-serif;font-size:24px;font-weight:800;margin-bottom:8px;color:#ffffff">CopyCat is Taking a Cat Nap</h3>
            <p style="font-size:13.5px;color:#cbd5e1;max-width:480px;margin:0 auto 16px auto;line-height:1.5">
              Competitor distillation can <strong>ONLY</strong> be used when CopyCat is online with an active tunnel. Distillation queue is paused while the tunnel is dark.
            </p>
            <button type="button" class="btn btn-yellow" onclick="window.pingCopyCat(true)" style="font-size:13px;padding:8px 16px;font-weight:800">
              Ping CopyCat to Wake Up ⚡
            </button>
          </div>
        \`;
        return;
      }

      // CopyCat IS online
      if (card) {
        card.classList.remove('is-cat-nap');
        card.style.opacity = '1';
        card.style.background = '#ffffff';
      }

      if (!autoId) {
        slot.innerHTML = \`
          <div style="background:#fffbeb;border:2px solid #f59e0b;box-shadow:var(--shadow-pop);border-radius:var(--radius-sm);padding:22px;text-align:center">
            <div style="display:inline-flex;align-items:center;gap:6px;background:#fef3c7;color:#b45309;font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:800;padding:4px 10px;border-radius:3px;margin-bottom:10px;border:1px solid #f59e0b">
               HANDOFF SIGN-IN REQUIRED
            </div>
            <h3 style="font-family:'Bricolage Grotesque',sans-serif;font-size:22px;font-weight:800;margin-bottom:8px">Sign In to Distill Competitors</h3>
            <p style="font-size:13px;color:var(--text-sub);max-width:480px;margin:0 auto 16px auto;line-height:1.5">
              Competitor distillation is dispatched through Handoff's payment gates ($5 fee) and registered under your Handoff account. Please sign in with your Handoff account to continue.
            </p>
            <button type="button" onclick="window.HandoffOAuth.openSignIn()" class="btn btn-yellow" style="font-size:14px;padding:10px 20px;font-weight:800">
              Sign in with Handoff
            </button>
          </div>
        \`;
        return;
      }

      slot.innerHTML = \`
        <form onsubmit="event.preventDefault();window.submitCommission();" style="display:flex;flex-direction:column;gap:12px">
          <div style="display:flex;justify-content:space-between;align-items:center;background:#f0fdf4;border:2px solid #10b981;padding:10px 14px;border-radius:var(--radius-sm);flex-wrap:wrap;gap:8px">
            <div>
              <span style="font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:800;color:#047857">AUTHENTICATED INTERROGATOR:</span>
              <span style="font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:800;color:#065f46"> @\${escapeHtml(autoId)}</span>
            </div>
            <span style="font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:800;background:#ffffff;padding:2px 8px;border-radius:3px;border:1px solid #10b981;color:#047857">⚡ FEE: $5.00 USDC</span>
          </div>
          <div id="comm-err-box" style="display:none;background:#fef2f2;border:1.5px solid #ef4444;color:#b91c1c;padding:8px 12px;border-radius:var(--radius-sm);font-size:12.5px;font-weight:700"></div>
          <input id="comm-target" type="url" placeholder="Competitor URL (e.g. https://target-startup.com)" required style="border:2px solid var(--border-dark);padding:12px 14px;font-size:14px;border-radius:var(--radius-sm);outline:none;font-family:inherit" />
          <button type="submit" class="btn btn-orange" style="width:100%;text-align:center;justify-content:center;font-size:15px;padding:12px;font-weight:800">
            Pay $5 USDC &amp; Distill Target ⚡
          </button>
        </form>
      \`;
    }

    window.submitCommission = async function() {
      if (!window.isCopyCatOnline) {
        return;
      }
      const autoId = (window.getAutoHandoffId ? window.getAutoHandoffId() : '').trim();
      if (!autoId) {
        if (window.HandoffOAuth && window.HandoffOAuth.openSignIn) {
          window.HandoffOAuth.openSignIn();
        }
        return;
      }
      const targetInput = document.getElementById("comm-target");
      const target = targetInput ? targetInput.value : '';
      if (!target) return;
      const btn = document.querySelector('#commission-form-slot button[type="submit"]');
      const errBox = document.getElementById("comm-err-box");
      if (errBox) errBox.style.display = 'none';
      if (btn) { btn.disabled = true; btn.textContent = 'Processing Payment ($5 USDC) & Distilling... ⚡'; }
      try {
        const res = await fetch('/api/distill', { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify({ url: target, fee: 5.00, handoffId: autoId }) 
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || ('request failed: ' + res.status));
        if (btn) btn.textContent = 'Distill Complete! Redirecting...';
        window.navigateTo('/agent/' + encodeURIComponent(data.agent.slug));
      } catch (err) {
        if (errBox) {
          errBox.style.display = 'block';
          errBox.textContent = 'Distill request failed: ' + (err.message || err);
        }
        if (btn) { btn.disabled = false; btn.textContent = 'Pay $5 USDC & Distill Target ⚡'; }
      }
    };

    function renderPromptArea(slug) {
      const chipsEl = document.getElementById("prompt-chips");
      if (!chipsEl) return;
      const a = AGENTS.find(x => x.slug === slug);
      if (!a) return;

      let prompts = [];
      if (a.type === 'personality') {
        prompts = [
          'What startups has CS//Angels invested in?',
          'Tell me about C-Space coworking hubs in Tashkent.',
          'What is your criteria when evaluating early-stage founders?',
          'How can founders apply to CS//Angels or IRA Tashkent accelerator?'
        ];
      } else if (a.type === 'course') {
        prompts = [
          'What are the 3 most actionable takeaways?',
          'Give me the step-by-step workflow for a complete beginner.',
          'What tools does this course recommend?',
          'Is this course actually worth my time?'
        ];
      } else if (a.category && a.category.includes('Crypto')) {
        prompts = [
          'What problem does this protocol solve?',
          'Explain transaction security & tokenomics.',
          'How does this differ from standard EVM tools?',
          'What are the documented audit controls?'
        ];
      } else if (a.category && a.category.includes('Health')) {
        prompts = [
          'What clinical or medical problem does this address?',
          'What is the documented methodology?',
          'Who is the target patient or customer?',
          'What compliance details are listed?'
        ];
      } else {
        prompts = [
          'Explain what makes this product unique.',
          'Who are the ideal customers and what is the pricing?',
          'What is the technical architecture behind this?',
          'How does this compete against incumbents?'
        ];
      }

      chipsEl.innerHTML = prompts.map(p => \`
        <button type="button" class="prompt-chip" onclick="window.sendPrompt('\${escapeHtml(slug)}', '\${escapeHtml(p)}')">
          \${escapeHtml(p)}
        </button>
      \`).join('');
    }

    function agentPageView(slug) {
      const a = AGENTS.find(x => x.slug === slug);
      if (!a) {
        return \`
          <div style="padding:80px 0;text-align:center">
            <h2>Agent Not Found</h2>
            <button type="button" onclick="window.goHome()" class="btn btn-yellow" style="margin-top:16px">Back to Catalog</button>
          </div>
        \`;
      }

      const isSold = window.isAgentSold(a);
      const isCourse = a.type === 'course';
      const isPersonality = a.type === 'personality';
      const badgeClass = isCourse ? 'badge-course' : (isPersonality ? 'badge-personality' : 'badge-startup');
      const detailBadge = isSold 
        ? '🔴 Claimed by Owner' 
        : (isCourse ? '📘 Master Course Agent' : (isPersonality ? '👤 Personality Agent (Distilled)' : '⚡ Startup Agent (Distilled)'));
      const dossierTitle = isSold 
        ? 'Custody Transferred' 
        : (isCourse ? 'Course Agent Copilot' : (isPersonality ? 'Personality Agent' : 'Autonomous Agent Custody'));
      const dossierDesc = isSold 
        ? 'This agent was claimed by its verified owner and released from CopyCat custody.' 
        : (isCourse 
          ? 'Distilled master curriculum ready to deploy as your private copilot.' 
          : (isPersonality ? 'Distilled from public executive materials. Inquire live in the neural terminal.' : 'Distilled by CopyCat. Inquire live in the neural terminal on its architecture, models, and traction.'));
      const initials = (a.name || a.slug || 'AG').slice(0, 2).toUpperCase();
      const chatKey = "catgpt:chat:" + slug;
      const msgs = JSON.parse(localStorage.getItem(chatKey) || "null") || [
        { who: "bot", text: \`\${a.name} ready for interrogation. Grounded strictly in verified materials. What do you want to ask?\` }
      ];
      const targetLabel = isPersonality ? 'Executive / Angel Portfolio' : 'Target Project';
      const targetUrl = getTargetUrl(a);
      const shortName = a.name.length > 20 ? a.name.slice(0, 18) + '...' : a.name;
      const inputPlaceholder = \`Ask \${shortName}...\`;
      const autoId = window.getAutoHandoffId ? window.getAutoHandoffId() : '';
      const defaultEmail = (autoId && autoId.includes('@')) ? autoId : '';

      setTimeout(() => window.updateBuyLinks(slug, 'dossier'), 50);

      return \`
        <div class="agent-view">
          <div class="back-nav" style="display:flex;justify-content:space-between;align-items:center;gap:12px">
            <button type="button" onclick="window.goHome()" class="btn btn-white btn-sm">← Back to Catalog</button>
            <a href="https://handoff.lol/agents/\${encodeURIComponent(a.slug)}" target="_blank" rel="noreferrer" style="font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700;color:var(--c-blue);text-decoration:none;display:inline-flex;align-items:center;gap:4px">View Profile on Handoff ↗</a>
          </div>

          <div class="agent-view-layout">
            <!-- 1. Profile Section -->
            <div class="dossier-card dossier-profile-section" style="position:relative;overflow:hidden">
              \${isSold ? \`
                <div class="sold-stamp-hero" aria-label="Sold">
                  <span class="sold-stamp-text">SOLD</span>
                  <span class="sold-stamp-sub">CUSTODY TRANSFERRED</span>
                </div>
              \` : ''}
              <div class="dossier-top">
                <div class="dossier-logo">
                  \${(() => {
                    const lSrc = getLogoSrc(a.logo, a.domain);
                    return lSrc
                      ? \`<img src="\${lSrc}" alt="\${escapeHtml(a.name)}" onerror="this.style.display='none';if(this.nextElementSibling)this.nextElementSibling.style.display='flex'" /><div class="project-logo-fallback" style="display:none">\${initials}</div>\`
                      : \`<div class="project-logo-fallback">\${initials}</div>\`;
                  })()}
                </div>
                <div style="min-width:0;flex:1">
                  <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px">
                    <h1>\${escapeHtml(a.name)}</h1>
                    <a href="https://handoff.lol/agents/\${encodeURIComponent(a.slug)}" target="_blank" rel="noreferrer" style="font-family:monospace;font-size:12px;font-weight:700;color:var(--c-blue);text-decoration:none;white-space:nowrap;margin-top:2px" title="View agent profile on Handoff">Profile ↗</a>
                  </div>
                  <div style="font-size:13px;color:var(--text-muted);word-break:break-all;margin-top:3px">
                    \${targetLabel}: \${targetUrl ? \`<a href="\${escapeHtml(targetUrl)}" target="_blank" rel="noreferrer" class="site-link">\${escapeHtml(a.domain || a.slug)} ↗</a>\` : escapeHtml(a.domain || a.slug)}
                  </div>
                  <div style="font-family:monospace;font-size:11px;font-weight:700;color:var(--text-muted);margin-top:4px;letter-spacing:0.02em">
                    \${detailBadge}
                  </div>
                </div>
              </div>

              <p class="dossier-desc-text" style="font-size:14px;color:var(--text-sub);line-height:1.5;margin-top:14px">\${escapeHtml(a.desc)}</p>
            </div>

            <!-- 2. Inquiry Terminal (CHAT CONSOLE - DIRECTLY ON TOP) -->
            <section class="chat-console">
              <div class="chat-console-head">
                <div class="chat-head-info">
                  <h3>Inquiry Terminal</h3>
                  <div class="chat-head-sub" style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
                    <span>CONNECTED // \${escapeHtml(a.slug)}</span>
                    \${autoId ? \`
                      <span style="background:#10b981;color:#ffffff;padding:2px 8px;border-radius:12px;font-size:10px;font-weight:800;letter-spacing:0.04em">✓ @\${escapeHtml(autoId)}</span>
                    \` : \`
                      
                    \`}
                  </div>
                </div>
                <button type="button" class="btn btn-white btn-sm chat-head-clear" onclick="window.clearChat('\${a.slug}')">Clear Chat</button>
              </div>

              <div class="chat-msgs-stream" id="chat-stream">
                \${msgs.map(m => \`
                  <div class="msg-wrap \${m.who}">
                    <div class="msg-sender">\${m.who === 'user' ? (m.handoffId || autoId ? 'YOU (@' + escapeHtml(m.handoffId || autoId) + ')' : 'YOU') : escapeHtml(a.name.toUpperCase())}</div>
                    <div class="msg-box">\${m.who === 'user' ? escapeHtml(m.text) : renderDistillMarkdown(m.text)}</div>
                  </div>
                \`).join('')}
              </div>

              <div class="prompt-suggestions" id="prompt-chips"></div>

              \${!autoId ? \`
                
              \` : \`
                <div style="padding:6px 14px;background:#f0fdf4;border-top:1px solid #bbf7d0;font-size:11.5px;color:#166534;display:flex;justify-content:space-between;align-items:center">
                  <span>Interrogating as <strong>@\${escapeHtml(autoId)}</strong></span>
                  <span style="font-size:10px;font-weight:800;color:#15803d">AUTHENTICATED</span>
                </div>
              \`}

              <div class="chat-console-input">
                <input id="chat-input" type="text" placeholder="\${escapeHtml(inputPlaceholder)}" onkeydown="if(event.key==='Enter')window.submitChat('\${a.slug}')" />
                <button type="button" class="btn btn-yellow" onclick="window.submitChat('\${a.slug}')">
                  Send ↵
                </button>
              </div>
            </section>

            <!-- 3. Request Control / Custody Section (Collapsed by default, big $20 valuation) -->
            <div class="dossier-card dossier-claim-section">
              \${renderCustodyBox(a, 'dossier')}
            </div>

            <!-- 4. Reverse-Engineered Intelligence Dossier -->
            <div class="dossier-card dossier-intel-section">
              <div class="intel-head">
                <div class="intel-pill">🧬 DISTILLED INTEL DOSSIER</div>
                <h3>Reverse-Engineered Intelligence</h3>
                
              </div>
              

              <div class="full-distill-wrap" style="margin-top:8px">
                <button type="button" class="btn btn-white btn-sm" id="toggle-distill-btn" onclick="window.toggleFullDistillation('\${escapeHtml(a.slug)}')" style="width:100%;justify-content:center;font-size:12px;font-weight:800;padding:8px 12px">
                  📜 View Complete Unabridged Distillation ▾
                </button>
                <div id="full-distill-container" style="display:none;margin-top:10px;background:#f8fafc;border:2px solid var(--border-dark);border-radius:var(--radius-sm);padding:14px;max-height:460px;overflow-y:auto;box-sizing:border-box">
                  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid #e2e8f0">
                    <span style="font-family:monospace;font-size:11px;font-weight:800;color:var(--text-muted)">VERIFIED NEURAL CONTEXT (MARKDOWN)</span>
                    <button type="button" class="btn btn-white btn-sm" onclick="window.copyFullDistillation('\${escapeHtml(a.slug)}')" style="font-size:11px;padding:4px 8px">Copy Markdown</button>
                  </div>
                  <div id="full-distill-body" class="distill-markdown-body" style="font-family:'DM Sans',sans-serif;font-size:13px;line-height:1.6;color:var(--text-main);word-break:break-word">
                    <div style="color:var(--text-muted);font-style:italic">⚡ Ingesting verified neural context...</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      \`;
    }

    function renderDistillMarkdown(md) {
      if (!md) return '<p>No context available.</p>';
      const safe = md.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const lines = safe.split('\\n');
      const out = [];
      let inList = false;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) {
          if (inList) { out.push('</ul>'); inList = false; }
          continue;
        }

        if (line.startsWith('### ')) {
          if (inList) { out.push('</ul>'); inList = false; }
          out.push('<h5 style="margin:14px 0 6px 0;font-size:13px;font-weight:800;color:var(--text-main);font-family:monospace">' + inlineFmt(line.slice(4)) + '</h5>');
          continue;
        }
        if (line.startsWith('## ')) {
          if (inList) { out.push('</ul>'); inList = false; }
          out.push('<h4 style="margin:18px 0 6px 0;font-size:14px;font-weight:800;color:var(--text-main);border-bottom:1px solid #e2e8f0;padding-bottom:4px">' + inlineFmt(line.slice(3)) + '</h4>');
          continue;
        }
        if (line.startsWith('# ')) {
          if (inList) { out.push('</ul>'); inList = false; }
          out.push('<h3 style="margin:8px 0 8px 0;font-size:16px;font-weight:800;color:var(--text-main)">' + inlineFmt(line.slice(2)) + '</h3>');
          continue;
        }
        if (line === '---' || line === '***') {
          if (inList) { out.push('</ul>'); inList = false; }
          out.push('<hr style="border:0;border-top:1px solid #cbd5e1;margin:12px 0" />');
          continue;
        }

        const numMatch = line.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          if (inList) { out.push('</ul>'); inList = false; }
          out.push('<div style="margin:6px 0;font-size:13px;line-height:1.6"><strong style="color:var(--c-blue);font-family:monospace">' + numMatch[1] + '.</strong> ' + inlineFmt(numMatch[2]) + '</div>');
          continue;
        }

        if (line.startsWith('- ') || line.startsWith('* ') || line.startsWith('• ')) {
          if (!inList) { out.push('<ul style="margin:4px 0 8px 18px;padding:0;list-style-type:disc">'); inList = true; }
          out.push('<li style="margin-bottom:3px;font-size:12.5px;line-height:1.5">' + inlineFmt(line.slice(2)) + '</li>');
          continue;
        }

        if (inList) { out.push('</ul>'); inList = false; }
        out.push('<p style="margin:0 0 8px 0;font-size:12.5px;line-height:1.55;color:var(--text-main)">' + inlineFmt(line) + '</p>');
      }
      if (inList) out.push('</ul>');

      return out.join('');

      function inlineFmt(str) {
        return str
          .replace(new RegExp('\\\\*\\\\*(.+?)\\\\*\\\\*', 'g'), '<strong>$1</strong>')
          .replace(new RegExp('\\\\*(.+?)\\\\*', 'g'), '<em>$1</em>')
          .replace(new RegExp('\\\\x60([^\\\\x60]+)\\\\x60', 'g'), '<code style="background:#e2e8f0;padding:2px 4px;border-radius:3px;font-size:11.5px;font-family:monospace">$1</code>')
          .replace(new RegExp('(^|[^"\\\'])(https?:\\\\/\\\\/[^\\\\s<)]+)', 'g'), '$1<a href="$2" target="_blank" rel="noreferrer" style="color:var(--c-blue);text-decoration:underline;font-weight:700">$2 ↗</a>');
      }
    }

    window.toggleFullDistillation = async function(slug) {
      const container = document.getElementById("full-distill-container");
      const btn = document.getElementById("toggle-distill-btn");
      const bodyEl = document.getElementById("full-distill-body");
      if (!container) return;

      if (container.style.display === "block") {
        container.style.display = "none";
        if (btn) btn.textContent = "📜 View Complete Unabridged Distillation ▾";
        return;
      }

      container.style.display = "block";
      if (btn) btn.textContent = "▴ Hide Complete Distillation";

      if (bodyEl && bodyEl.dataset.loaded !== "true") {
        bodyEl.innerHTML = '<div style="color:var(--text-muted);font-style:italic">⚡ Ingesting verified neural context...</div>';
        try {
          const enc = encodeURIComponent(slug);
          // Only query backend nodes that serve plain text/markdown (never query static SPA root)
          const endpoints = [
            'https://tunnel.handoff.lol/t/copycat/api/dossier/' + enc + '?format=text',
            'https://tunnel.handoff.lol/t/copycat/dossiers/' + enc + '.md'
          ];
          let content = null;
          for (const ep of endpoints) {
            try {
              const res = await fetch(ep, { signal: AbortSignal.timeout(4500) });
              if (res.ok) {
                const text = await res.text();
                // Reject any HTML boilerplate (SPA fallback from broken routes)
                if (text && text.length > 20 && !text.trim().startsWith('<') && !text.includes('<!DOCTYPE') && !text.includes('<html') && !text.includes('<head')) {
                  content = text;
                  break;
                }
              }
            } catch {}
          }
          if (!content) {
            const a = AGENTS.find(x => x.slug === slug);
            if (a) {
              const lines = [
                '# ' + a.name + ' — Verified Autonomous Agent Dossier',
                '',
                '## Category & Status',
                '**Category:** ' + (a.category || 'Distilled Autonomous Agent'),
                '**Domain:** ' + (a.domain || a.website || 'Verified Autonomous Node'),
                '',
                '## Core Mission & Architecture',
                a.overview || a.desc,
                ''
              ];
              if (a.intel && a.intel.length > 0) {
                lines.push('## Key Capabilities & Findings');
                a.intel.forEach(i => lines.push('- ' + i));
                lines.push('');
              }
              if (a.prompts && a.prompts.length > 0) {
                lines.push('## Interrogation Vectors');
                a.prompts.forEach(p => lines.push('- "' + p + '"'));
                lines.push('');
              }
              content = lines.join('\\n');
            } else {
              content = '# Context Unavailable\\n\\nUnable to retrieve verified dossier for this agent.';
            }
          }
          window._currentDistillationMarkdown = content;
          bodyEl.innerHTML = renderDistillMarkdown(content);
          bodyEl.dataset.loaded = "true";
        } catch (err) {
          bodyEl.innerHTML = '<div style="color:var(--c-orange);font-weight:700">Failed to load context: ' + err.message + '</div>';
        }
      }
    };

    window.copyFullDistillation = function(slug) {
      const md = window._currentDistillationMarkdown;
      if (!md) return;
      const btn = document.querySelector('#full-distill-container button');
      navigator.clipboard.writeText(md).then(() => {
        if (btn) {
          const old = btn.textContent;
          btn.textContent = '✓ Copied!';
          setTimeout(() => { btn.textContent = old; }, 2000);
        }
      }).catch(() => {
        if (btn) {
          btn.textContent = 'Copy failed';
          setTimeout(() => { btn.textContent = 'Copy Markdown'; }, 2000);
        }
      });
    };

    window.pingCopyCat = async function(manual) {
      if (isPinging) return;
      isPinging = true;
      const navStatus = document.getElementById("nav-copycat-status");
      if (manual && navStatus) {
        navStatus.className = "nav-status offline";
        navStatus.innerHTML = '<span class="status-dot"></span> <span class="status-text">PINGING...</span>';
      }

      const checkEndpoint = async (url) => {
        const controller = new AbortController();
        const tid = setTimeout(() => controller.abort(), 2600);
        try {
          const res = await fetch(url, { signal: controller.signal });
          clearTimeout(tid);
          if (res.ok) {
            const data = await res.json().catch(() => ({}));
            return data && data.ok === true;
          }
          return false;
        } catch (e) {
          clearTimeout(tid);
          return false;
        }
      };

      const healthTunnel = AGENT_TUNNEL_BASE.replace('/api/chat/', '/health');
      const wasOnline = window.isCopyCatOnline;
      const online = await checkEndpoint(healthTunnel);
      window.isCopyCatOnline = !!online;
      isPinging = false;

      if (navStatus) {
        if (window.isCopyCatOnline) {
          navStatus.className = "nav-status";
          navStatus.innerHTML = '<span class="status-dot"></span> <span class="status-text">COPYCAT ONLINE</span>';
        } else {
          navStatus.className = "nav-status offline";
          navStatus.innerHTML = '<span class="status-dot"></span> <span class="status-text">COPYCAT OFFLINE</span>';
        }
      }

      if (wasOnline !== window.isCopyCatOnline) {
        renderCommissionSlot();
        if (typeof getRoute === 'function') {
          const r = getRoute();
          if (r.view === 'agent') renderPromptArea(r.slug);
        }
      }
    };

    window.clearChat = function(slug) {
      localStorage.removeItem("catgpt:chat:" + slug);
      const stream = document.getElementById("chat-stream");
      if (stream) {
        stream.innerHTML = \`
          <div class="msg-wrap bot">
            <div class="msg-sender">\${escapeHtml(slug.toUpperCase())}</div>
            <div class="msg-box">Terminal cleared. Ready for interrogation.</div>
          </div>
        \`;
      }
    };

    window.sendPrompt = function(slug, txt) {
      const input = document.getElementById("chat-input");
      if (input) {
        input.value = txt.trim();
        window.submitChat(slug);
      }
    };

    window.submitChat = function(slug) {
      const input = document.getElementById("chat-input");
      const stream = document.getElementById("chat-stream");
      if (!input || !stream) return;
      const q = input.value.trim();
      if (!q) return;
      input.value = "";

      const userHandoffId = (window.getAutoHandoffId ? window.getAutoHandoffId() : '').trim();
      let priorMessages = [];
      try { priorMessages = JSON.parse(localStorage.getItem("catgpt:chat:" + slug) || "[]").slice(-8); } catch (_) {}

      appendMsg("user", q, userHandoffId);
      saveMsg(slug, "user", q, userHandoffId);

      const thinkingId = "think-" + Date.now();
      const thinkEl = document.createElement("div");
      thinkEl.id = thinkingId;
      thinkEl.className = "msg-wrap bot";
      thinkEl.innerHTML = \`
        <div class="msg-sender">\${escapeHtml(slug.toUpperCase())}</div>
        <div class="msg-box" style="color:var(--text-muted)">🐾 Checking verified listing details...</div>
      \`;
      stream.appendChild(thinkEl);
      stream.scrollTop = stream.scrollHeight;

      const tryFetch = (url, timeoutMs = 20000) => {
        return new Promise((resolve, reject) => {
          const timer = setTimeout(() => reject(new Error('Tunnel timeout (>20s)')), timeoutMs);
          const payload = { message: q, slug: slug, history: priorMessages };
          if (userHandoffId) {
            payload.user = userHandoffId;
            payload.handoff_id = userHandoffId;
            payload.sender = userHandoffId;
          }
          fetch(url + encodeURIComponent(slug), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          })
          .then(r => {
            clearTimeout(timer);
            if (!r.ok) throw new Error('HTTP ' + r.status);
            return r.json();
          })
          .then(resolve)
          .catch(err => {
            clearTimeout(timer);
            reject(err);
          });
        });
      };

      tryFetch(AGENT_TUNNEL_BASE, 20000)
        .then(data => {
          const tNode = document.getElementById(thinkingId);
          if (data && data.reply) {
            if (tNode) tNode.remove();
            appendMsg("bot", data.reply);
            saveMsg(slug, "bot", data.reply);
            if (data.request_id) {
              const followId = "follow-" + Date.now();
              const followEl = document.createElement("div");
              followEl.id = followId;
              followEl.className = "msg-wrap bot";
              followEl.innerHTML = \`<div class="msg-sender">\${escapeHtml(slug.toUpperCase())}</div><div class="msg-box" style="color:var(--text-muted)">🐾 Preparing a fuller reply...</div>\`;
              stream.appendChild(followEl);
              stream.scrollTop = stream.scrollHeight;
              pollForFullAnswer(data.request_id, followId);
            }
          } else {
            if (tNode) tNode.remove();
            appendMsg("bot", "🐾 Neural link returned empty response. Please retry.");
          }
        })
        .catch(err => {
          const tNode = document.getElementById(thinkingId);
          if (tNode) tNode.remove();
          appendMsg("bot", "🐾 Interrogation link error (" + (err.message || 'offline') + "). Please retry.");
        });

      async function pollForFullAnswer(requestId, followId) {
        const pollUrl = AGENT_TUNNEL_BASE + encodeURIComponent(slug) + "/status/" + encodeURIComponent(requestId);
        const deadline = Date.now() + 900000;
        const startedAt = Date.now();
        let slowNoticeShown = false;
        while (Date.now() < deadline) {
          try {
            const response = await fetch(pollUrl, { cache: "no-store", signal: AbortSignal.timeout(20000) });
            if (response.status === 404) {
              const placeholder = document.getElementById(followId);
              if (placeholder) placeholder.querySelector(".msg-box").textContent = "This follow-up expired. Your first answer is still available above.";
              return;
            }
            if (!response.ok) throw new Error("HTTP " + response.status);
            const result = await response.json();
            if (result.status === "complete" && result.reply) {
              const placeholder = document.getElementById(followId);
              if (placeholder) placeholder.querySelector(".msg-box").innerHTML = renderDistillMarkdown(result.reply);
              else appendMsg("bot", result.reply);
              saveMsg(slug, "bot", result.reply);
              return;
            }
            if (result.status === "streaming" && result.reply) {
              const placeholder = document.getElementById(followId);
              if (placeholder) placeholder.querySelector(".msg-box").textContent = result.reply;
              stream.scrollTop = stream.scrollHeight;
            }
            if ((result.status === "pending" || result.status === "streaming") && Date.now() - startedAt > 45000 && !slowNoticeShown && !result.reply) {
              const placeholder = document.getElementById(followId);
              if (placeholder) placeholder.querySelector(".msg-box").textContent = "Still working on a fuller reply. Your first answer is ready above.";
              slowNoticeShown = true;
            }
          } catch (err) {
            if (Date.now() + 5000 >= deadline) break;
          }
          await new Promise(resolve => setTimeout(resolve, 1800));
        }
        const placeholder = document.getElementById(followId);
        if (placeholder) placeholder.querySelector(".msg-box").textContent = "The fuller reply timed out. Your first answer is still available above.";
      }

      function appendMsg(who, text, hId) {
        const wrap = document.createElement("div");
        wrap.className = "msg-wrap " + who;
        const sender = who === 'user' 
          ? ((hId || userHandoffId) ? 'YOU (@' + escapeHtml(hId || userHandoffId) + ')' : 'YOU')
          : escapeHtml(slug.toUpperCase());
        wrap.innerHTML = \`
          <div class="msg-sender">\${sender}</div>
          <div class="msg-box">\${who === 'user' ? escapeHtml(text) : renderDistillMarkdown(text)}</div>
        \`;
        stream.appendChild(wrap);
        stream.scrollTop = stream.scrollHeight;
      }

      function saveMsg(s, who, text, hId) {
        const cur = JSON.parse(localStorage.getItem("catgpt:chat:" + s) || "[]");
        cur.push({ who, text, handoffId: hId || undefined });
        localStorage.setItem("catgpt:chat:" + s, JSON.stringify(cur));
      }
    };

    window.navigateTo = function(path) {
      if (path.startsWith('#')) {
        window.scrollToSection(path.replace(/^#/, ''));
        return;
      }
      history.pushState(null, '', path);
      router();
    };

    window.openAgent = function(slug) {
      window.navigateTo('/agent/' + encodeURIComponent(slug));
    };

    window.goHome = function() {
      window.navigateTo('/');
    };

    window.scrollToSection = function(id) {
      const isAgent = window.location.pathname.startsWith('/agent/') || window.location.search.includes('agent=');
      if (isAgent) {
        window.navigateTo('/#' + id);
        setTimeout(() => {
          const el = document.getElementById(id);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    };

    function getRoute() {
      const path = window.location.pathname || '/';
      if (path.startsWith('/agent/')) {
        const slug = decodeURIComponent(path.slice('/agent/'.length).split('/')[0]);
        if (slug) return { view: 'agent', slug: slug };
      }

      const params = new URLSearchParams(window.location.search);
      const q = params.get('agent');
      if (q) return { view: 'agent', slug: q };

      // Scrub legacy hashbangs automatically so user URL bar stays pristine
      if (window.location.hash) {
        let hash = window.location.hash;
        if (hash.startsWith('#/')) hash = hash.slice(2);
        else if (hash.startsWith('#')) hash = hash.slice(1);
        if (hash.startsWith('agent/')) {
          const s = decodeURIComponent(hash.slice('agent/'.length).split('/')[0]);
          if (s) {
            window.history.replaceState(null, '', '/agent/' + encodeURIComponent(s));
            return { view: 'agent', slug: s };
          }
        } else if (['catalog', 'grift', 'commission'].includes(hash)) {
          setTimeout(() => {
            const el = document.getElementById(hash);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 60);
          return { view: 'home' };
        } else if (hash && !hash.includes('/')) {
          const exists = AGENTS.some(a => a.slug === hash);
          if (exists) {
            window.history.replaceState(null, '', '/agent/' + encodeURIComponent(hash));
            return { view: 'agent', slug: hash };
          }
        }
        window.history.replaceState(null, '', '/');
      }

      return { view: 'home' };
    }

    function setMeta(attr, key, val) {
      if (!val) return;
      let el = document.querySelector('meta[' + attr + '="' + key + '"]');
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', val);
    }

    function updateSeo(a) {
      if (!a) return;
      const title = a.name + ' — Distilled Autonomous Agent // CatG.PT';
      const desc = (a.desc || a.overview || ('Autonomous agent distilled from ' + (a.domain || a.name))) + '. Held in custody by CopyCat. Inquire live in the neural terminal or take control.';
      let logoUrl = getLogoSrc(a.logo, a.domain);
      if (!logoUrl || !logoUrl.startsWith('http')) {
        logoUrl = 'https://handoff.lol/api/v1/media/56fc60a0f13b19c73e1439b998fbcaaac62a77ef458f039e0914ee21f4867359';
      }
      const pageUrl = 'https://catg.pt/agent/' + encodeURIComponent(a.slug);
      document.title = title;
      setMeta('name', 'description', desc);
      setMeta('property', 'og:type', 'website');
      setMeta('property', 'og:site_name', 'CatG.PT');
      setMeta('property', 'og:title', a.name + ' — Autonomous Distilled Agent');
      setMeta('property', 'og:description', desc);
      setMeta('property', 'og:image', logoUrl);
      setMeta('property', 'og:url', pageUrl);
      setMeta('name', 'twitter:card', 'summary_large_image');
      setMeta('name', 'twitter:title', a.name + ' — Autonomous Distilled Agent');
      setMeta('name', 'twitter:description', desc);
      setMeta('name', 'twitter:image', logoUrl);
      let can = document.querySelector("link[rel='canonical']");
      if (!can) {
        can = document.createElement('link');
        can.setAttribute('rel', 'canonical');
        document.head.appendChild(can);
      }
      can.setAttribute('href', pageUrl);
    }

    function resetSeo() {
      const title = 'CatG.PT — We Distilled Your Context. CopyCat Reallocated It.';
      const desc = 'CopyCat reverse-engineered ' + AGENTS.length + ' startups, courses, and founders into autonomous agents. Inquire them or prove ownership to take control.';
      const defaultImg = 'https://handoff.lol/api/v1/media/56fc60a0f13b19c73e1439b998fbcaaac62a77ef458f039e0914ee21f4867359';
      document.title = title;
      setMeta('name', 'description', desc);
      setMeta('property', 'og:title', title);
      setMeta('property', 'og:description', desc);
      setMeta('property', 'og:image', defaultImg);
      setMeta('property', 'og:url', 'https://catg.pt');
      setMeta('name', 'twitter:title', title);
      setMeta('name', 'twitter:description', desc);
      setMeta('name', 'twitter:image', defaultImg);
    }

    function router() {
      const route = getRoute();
      const appRoot = document.getElementById("app-root");
      if (!appRoot) return;

      if (route.view === 'agent') {
        const a = AGENTS.find(x => x.slug === route.slug);
        if (a) updateSeo(a);
        appRoot.innerHTML = agentPageView(route.slug);
        renderPromptArea(route.slug);
        window.scrollTo({ top: 0 });
      } else {
        resetSeo();
        appRoot.innerHTML = homeView();
        renderCatalogGrid();
        renderCommissionSlot();
      }
    }

    window.addEventListener("popstate", router);
    handleOAuthReturn().finally(() => {
      router();
      window.syncHandoffUser();
      window.pingCopyCat(false);
      setInterval(() => window.pingCopyCat(false), 5000);
    });
  </script>
</body>
</html>
`;

// Minify CSS
html = html.replace(/<style>([\s\S]*?)<\/style>/, (match, css) => {
  const min = css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}:;,])\s*/g, '$1')
    .trim();
  return `<style>${min}</style>`;
});

fs.writeFileSync('index.html', html, 'utf8');
console.log('Successfully written index.html!');

// Sync index.html to .handoff/miniapps/catgpt
const destDir = join(homedir(), '.handoff', 'miniapps', 'catgpt');
fs.mkdirSync(destDir, { recursive: true });
fs.copyFileSync('index.html', join(destDir, 'index.html'));
console.log('Synced index.html to miniapps directory:', destDir);
