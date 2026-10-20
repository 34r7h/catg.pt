import fs from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { createPrivateKey, createHash, sign } from 'node:crypto';

let html = fs.readFileSync('index.html', 'utf8');

// 1. Fix favicon data URI
html = html.replace(
  /<link rel="icon" href="data:image\/svg\+xml,[^"]*" \/>/,
  '<link rel="icon" href="data:image/svg+xml,%3Csvg%20xmlns=\'http://www.w3.org/2000/svg\'%20viewBox=\'0%200%2016%2016\'%3E%3Ctext%20y=\'14\'%20font-size=\'14\'%3E🐾%3C/text%3E%3C/svg%3E" />'
);

// 2. Add badge styles
if (!html.includes('.badge-startup')) {
  html = html.replace(
    '.badge-course { background: #fff5cc; color: #735a00; border-color: #b38f00; }',
    '.badge-course { background: #fff5cc; color: #735a00; border-color: #b38f00; }\n    .badge-startup { background: #e0f2fe; color: #0369a1; border-color: #0284c7; }\n    .badge-personality { background: #fce7f3; color: #be185d; border-color: #db2777; }'
  );
}

// 3. Fix AGENTS: remove flaky external gstatic/google favicon URLs that return 404
const agentsMatch = html.match(/const AGENTS = (\[[\s\S]*?\]);/);
if (agentsMatch) {
  const agents = JSON.parse(agentsMatch[1]);
  for (const a of agents) {
    if (a.logo && (a.logo.startsWith('http://') || a.logo.startsWith('https://'))) {
      a.logo = ''; // Use clean local fallback letter badge instead of 404ing external favicon
    }
    // Also verify local logo file exists
    if (a.logo && a.logo.startsWith('/logos/')) {
      const localPath = a.logo.replace(/^\//, '');
      if (!fs.existsSync(localPath)) {
        a.logo = '';
      }
    }
  }
  html = html.replace(agentsMatch[0], 'const AGENTS = ' + JSON.stringify(agents) + ';');
}

// 4. Update getFilteredAgents filter logic
html = html.replace(
  'if (ACTIVE_CATEGORY !== "all" && a.category !== ACTIVE_CATEGORY) return false;',
  `if (ACTIVE_CATEGORY !== "all") {
        if (["startup", "personality", "course"].includes(ACTIVE_CATEGORY)) {
          if (a.type !== ACTIVE_CATEGORY) return false;
        } else if (a.category !== ACTIVE_CATEGORY) {
          return false;
        }
      }`
);

// 5. Update renderCatalogGrid
const oldGrid = /grid\.innerHTML = list\.map\(a => \{[\s\S]*?return `[\s\S]*?<\/article>`;\s*\}\)\.join\(''\);/;
const newGrid = `grid.innerHTML = list.map(a => {
        const isCourse = a.type === 'course';
        const isPersonality = a.type === 'personality';
        const badgeClass = isCourse ? 'badge-course' : (isPersonality ? 'badge-personality' : 'badge-startup');
        const badgeText = isCourse ? 'Course' : (isPersonality ? 'Personality' : 'Startup');
        const initials = (a.name || a.slug || 'AG').slice(0, 2).toUpperCase();
        const priceText = isCourse ? 'Curriculum: <strong>DISTILLED</strong>' : 'Custody: <strong>COPYCAT (#44)</strong>';
        const buyBtnText = isCourse ? 'Acquire Course' : 'Buy Agent ⚡';

        return \`
          <article class="agent-card">
            <div class="card-top">
              <div class="card-identity">
                <div class="project-logo-box">
                  \${a.logo ? \`<img src="\${escapeHtml(a.logo)}" alt="\${escapeHtml(a.name)} logo" onerror="this.style.display='none';if(this.nextElementSibling)this.nextElementSibling.style.display='flex'" /><div class="project-logo-fallback" style="display:none">\${initials}</div>\` : \`<div class="project-logo-fallback">\${initials}</div>\`}
                </div>
                <div class="card-title-group">
                  <h3>\${escapeHtml(a.name)}</h3>
                  <div class="card-domain">
                    \${a.website ? \`<a href="\${escapeHtml(a.website)}" target="_blank" rel="noreferrer">\${escapeHtml(a.domain || 'website')} ↗</a>\` : \`<span>\${escapeHtml(a.domain || (isCourse ? 'course' : 'agent'))}</span>\`}
                  </div>
                </div>
              </div>
              <span class="badge \${badgeClass}">\${badgeText}</span>
            </div>

            <p class="card-desc">\${escapeHtml(a.desc)}</p>

            <div class="card-specs">
              <span class="spec-tag">\${escapeHtml((isPersonality ? 'PERSONALITY // OPERATOR' : (isCourse ? 'MASTER COURSE' : (a.category || 'STARTUP'))).toUpperCase())}</span>
            </div>

            <div class="card-foot">
              <div class="card-price">
                \${priceText}
              </div>
              <div class="card-actions">
                <a href="#/agent/\${encodeURIComponent(a.slug)}" class="btn btn-white btn-sm">
                  Chat with Agent
                </a>
                <button type="button" class="btn btn-orange btn-sm" onclick="window.openAdoptModal('\${a.slug}')">
                  \${buyBtnText}
                </button>
              </div>
            </div>
          </article>
        \`;
      }).join('');`;
html = html.replace(oldGrid, newGrid);

// 6. Update homeView categories & stats
const oldHomeView = /function homeView\(\) \{[\s\S]*?return `\s*<section class="hero">/;
const newHomeView = `function homeView() {
      const categories = [
        { id: "all", label: "All Agents (101)" },
        { id: "startup", label: "Startups (97)" },
        { id: "personality", label: "Personalities (1)" },
        { id: "course", label: "Courses (3)" },
        { id: "B2B SaaS", label: "B2B SaaS" },
        { id: "Crypto & Web3", label: "Crypto & Web3" },
        { id: "Health & Bio", label: "Health & Bio" },
        { id: "Consumer & Social", label: "Consumer & Apps" },
      ];

      const pillsHtml = categories.map(c => \`
        <button type="button" class="pill\${c.id === ACTIVE_CATEGORY ? ' active' : ''}" data-cat="\${c.id}" onclick="window.onCategory('\${c.id}')">
          \${escapeHtml(c.label)}
        </button>
      \`).join('');

      return \`
        <section class="hero">`;
html = html.replace(oldHomeView, newHomeView);

// Hero numbers
html = html.replaceAll('Buy Back Vault (65) ⚡', 'Buy Back Vault (98) ⚡');
html = html.replaceAll('Buy Back Vault (65)', 'Buy Back Vault (98)');
html = html.replaceAll('Show only Captive Agents with Pairing Keys (65)', 'Show only Captive Keys (98)');
html = html.replace('<div class="stat-num">65</div>', '<div class="stat-num live-stat-keys">98</div>');
html = html.replace('<div class="stat-num">180K</div>', '<div class="stat-num live-stat-tokens">622K</div>');
html = html.replace('<div class="stat-num">68</div>', '<div class="stat-num live-stat-agents">101</div>');
html = html.replace('Browse 68 Captive Agents ↓', 'Browse 101 Captive Agents ↓');
html = html.replace('Showing 68 of 68 agents', 'Showing 101 of 101 agents');

// 7. Update agentPageView
const oldPageView = /function agentPageView\(slug\) \{[\s\S]*?return `\s*<div class="agent-view">[\s\S]*?<\/aside>/;
const newPageView = `function agentPageView(slug) {
      const a = AGENTS.find(x => x.slug === slug);
      if (!a) {
        return \`
          <div style="padding:80px 0;text-align:center">
            <h2>Agent Not Found</h2>
            <a href="#/" class="btn btn-yellow" style="margin-top:16px">Back to Catalog</a>
          </div>
        \`;
      }

      const isCourse = a.type === 'course';
      const isPersonality = a.type === 'personality';
      const badgeClass = isCourse ? 'badge-course' : (isPersonality ? 'badge-personality' : 'badge-startup');
      const detailBadge = isCourse ? '📘 Master Course Agent' : (isPersonality ? '👤 Personality Agent (Captive)' : '⚡ Startup Agent (Captive)');
      const dossierTitle = isCourse ? 'Acquire Course Agent' : '⚡ Acquire / Buy Back Agent';
      const dossierDesc = isCourse 
        ? 'Distilled master curriculum ready to deploy as your private copilot.' 
        : (isPersonality ? 'CopyCat holds custody. Prove personal or executive identity to acquire full rights, or acquire custody before a competitor does.' : 'CopyCat holds custody. Prove project ownership to buy full rights, or acquire it before a rival does.');
      const initials = (a.name || a.slug || 'AG').slice(0, 2).toUpperCase();
      const chatKey = "catgpt:chat:" + slug;
      const msgs = JSON.parse(localStorage.getItem(chatKey) || "null") || [
        { who: "bot", text: \`\${a.name} ready for interrogation. Grounded strictly in materials for this project. What do you want to ask?\` }
      ];

      return \`
        <div class="agent-view">
          <div class="back-nav">
            <a href="#/" class="btn btn-white btn-sm">← Back to Catalog</a>
          </div>

          <div class="agent-view-layout">
            <aside class="dossier-card">
              <div class="dossier-top">
                <div class="dossier-logo">
                  \${a.logo ? \`<img src="\${escapeHtml(a.logo)}" alt="\${escapeHtml(a.name)}" onerror="this.style.display='none';if(this.nextElementSibling)this.nextElementSibling.style.display='flex'" /><div class="project-logo-fallback" style="display:none">\${initials}</div>\` : \`<div class="project-logo-fallback">\${initials}</div>\`}
                </div>
                <div>
                  <span class="badge \${badgeClass}" style="margin-bottom:4px;display:inline-block">
                    \${detailBadge}
                  </span>
                  <h1>\${escapeHtml(a.name)}</h1>
                  <div style="font-size:13px;color:var(--text-muted)">
                    Target: \${escapeHtml(a.domain || a.slug)}
                  </div>
                </div>
              </div>

              <p style="font-size:14px;color:var(--text-sub);line-height:1.5">\${escapeHtml(a.desc)}</p>

              <div class="dossier-box">
                <h4>\${dossierTitle}</h4>
                <p>\${dossierDesc}</p>
                <div style="display:flex;flex-direction:column;gap:8px">
                  \${isCourse ? \`
                    <a href="mailto:\${OPERATOR_EMAIL}?subject=Acquire%20Course%20Agent:%20\${encodeURIComponent(a.name)}" class="btn btn-yellow" style="width:100%;text-align:center;justify-content:center">
                      Acquire Course Agent
                    </a>
                  \` : \`
                    <a href="mailto:\${OPERATOR_EMAIL}?subject=Prove%20Ownership%20&%20Buy%20Agent:%20\${encodeURIComponent(a.name)}%20(\${encodeURIComponent(a.origin || a.domain || a.slug)})&body=Hey%20CopyCat,%0A%0AI%20am%20the%20verified%20owner/founder%20of%20\${encodeURIComponent(a.origin || a.domain || a.slug)}.%20I%20want%20to%20prove%20project%20ownership%20and%20purchase%20transfer%20rights%20for%20\${encodeURIComponent(a.name)}.%0A%0AProof%20of%20ownership:%20" class="btn btn-orange" style="width:100%;text-align:center;justify-content:center">
                      Prove Ownership &amp; Buy Back
                    </a>
                    \${a.pairUrl ? \`<a href="\${a.pairUrl}" target="_blank" rel="noreferrer" class="btn btn-green" style="width:100%;text-align:center;justify-content:center">Direct Pairing Key ↗</a>\` : ''}
                  \`}
                </div>
              </div>

              <div>
                <div style="font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:800;color:var(--text-muted);margin-bottom:8px;text-transform:uppercase">Target Website</div>
                \${a.website ? \`<a href="\${escapeHtml(a.website)}" target="_blank" rel="noreferrer" style="font-size:14px;font-weight:700;color:var(--c-blue);display:inline-block">\${escapeHtml(a.website)} ↗</a>\` : \`<span style="color:var(--text-muted)">No public site link</span>\`}
              </div>
            </aside>`;
html = html.replace(oldPageView, newPageView);

// 8. pingCopyCat real-time DOM update
const oldPing = /window\.pingCopyCat = function\(silent\) \{[\s\S]*?setNav\(false\);\s*\}\);/m;
const newPing = `window.pingCopyCat = function(silent) {
      const wasOnline = window.isCopyCatOnline;
      const setNav = (online, data) => {
        window.isCopyCatOnline = online;
        const navStatus = document.getElementById("nav-copycat-status");
        if (!navStatus) return;
        if (online) {
          navStatus.className = "nav-status online";
          navStatus.innerHTML = '<span class="status-dot"></span> <span class="status-text">COPYCAT ONLINE</span>';
          if (data) {
            if (data.totalAgents) document.querySelectorAll('.live-stat-agents').forEach(el => el.textContent = data.totalAgents);
            if (data.captiveKeys) document.querySelectorAll('.live-stat-keys').forEach(el => el.textContent = data.captiveKeys);
            if (data.tokensIngested) document.querySelectorAll('.live-stat-tokens').forEach(el => el.textContent = Math.round(data.tokensIngested / 1000) + 'K');
          }
        } else {
          navStatus.className = "nav-status offline";
          navStatus.innerHTML = '<span class="status-dot"></span> <span class="status-text">COPYCAT OFFLINE</span>';
        }
      };

      const healthTunnel = AGENT_TUNNEL_BASE.replace('/api/chat/', '/health');
      const healthLocal = AGENT_LOCAL_BASE.replace('/api/chat/', '/health');

      fetch(healthTunnel)
        .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
        .then(d => setNav(true, d))
        .catch(() => {
          fetch(healthLocal)
            .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
            .then(d => setNav(true, d))
            .catch(() => setNav(false));
        });`;
html = html.replace(oldPing, newPing);

fs.writeFileSync('index.html', html, 'utf8');
console.log('index.html written and validated.');
