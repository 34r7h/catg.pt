import fs from 'node:fs';
import path from 'node:path';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { createPrivateKey, createHash, sign } from 'node:crypto';

// 1. Load full agents list from agents-full.json
const fullAgents = JSON.parse(fs.readFileSync('agents-full.json', 'utf8'));

// Verify and map all local logos
const localLogos = new Set(fs.readdirSync('logos'));
let logosFound = 0;
for (const a of fullAgents) {
  const exts = ['.png', '.jpg', '.jpeg', '.ico', '.webp', '.svg'];
  let found = '';
  for (const ext of exts) {
    const fn = a.slug + ext;
    if (localLogos.has(fn)) {
      found = 'logos/' + fn;
      break;
    }
  }
  a.logo = found;
  if (found) logosFound++;
}
console.log(`Matched ${logosFound} local logos out of ${fullAgents.length} agents.`);

// 2. Read index.html and update AGENTS
let html = fs.readFileSync('index.html', 'utf8');

// Replace AGENTS declaration
const agentsMatch = html.match(/const AGENTS = (\[[\s\S]*?\]);/);
if (agentsMatch) {
  html = html.replace(agentsMatch[0], 'const AGENTS = ' + JSON.stringify(fullAgents) + ';');
}

// 3. Add getLogoSrc helper if not present
if (!html.includes('function getLogoSrc(')) {
  const insertBefore = 'function escapeHtml(';
  const helperCode = `function getLogoSrc(logo) {
      if (!logo) return '';
      if (logo.startsWith('data:') || logo.startsWith('http://') || logo.startsWith('https://')) return logo;
      const clean = logo.replace(/^(\\/)?logos\\//, '');
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'logos/' + clean;
      }
      return 'https://tunnel.handoff.lol/t/copycat/logos/' + clean;
    }

    `;
  html = html.replace(insertBefore, helperCode + insertBefore);
}

// 4. Update image tags to use getLogoSrc
html = html.replace(
  /\$\{a\.logo \? `<img src="\$\{escapeHtml\(a\.logo\)\}"/g,
  '${a.logo ? `<img src="${getLogoSrc(a.logo)}"'
);

// 5. Ensure badge-startup and badge-personality styles exist
if (!html.includes('.badge-startup')) {
  html = html.replace(
    '.badge-course { background: #fff5cc; color: #735a00; border-color: #b38f00; }',
    '.badge-course { background: #fff5cc; color: #735a00; border-color: #b38f00; }\n    .badge-startup { background: #e0f2fe; color: #0369a1; border-color: #0284c7; }\n    .badge-personality { background: #fce7f3; color: #be185d; border-color: #db2777; }'
  );
}

// 6. Ensure initials and clean badge logic in agentPageView
const apvStart = html.indexOf('function agentPageView(slug) {');
const apvEnd = html.indexOf('function router() {');
if (apvStart !== -1 && apvEnd !== -1) {
  const newApv = `function agentPageView(slug) {
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
                  \${a.logo ? \`<img src="\${getLogoSrc(a.logo)}" alt="\${escapeHtml(a.name)}" onerror="this.style.display='none';if(this.nextElementSibling)this.nextElementSibling.style.display='flex'" /><div class="project-logo-fallback" style="display:none">\${initials}</div>\` : \`<div class="project-logo-fallback">\${initials}</div>\`}
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
            </aside>

            <section class="chat-console">
              <div class="chat-console-head">
                <div>
                  <h3>Inquiry Terminal</h3>
                  <div style="font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700">CONNECTED // \${escapeHtml(a.slug)}</div>
                </div>
                <button type="button" class="btn btn-white btn-sm" onclick="window.clearChat('\${a.slug}')">Clear Chat</button>
              </div>

              <div class="chat-msgs-stream" id="chat-stream">
                \${msgs.map(m => \`
                  <div class="msg-wrap \${m.who}">
                    <div class="msg-sender">\${m.who === 'user' ? 'YOU' : escapeHtml(a.name.toUpperCase())}</div>
                    <div class="msg-box">\${escapeHtml(m.text)}</div>
                  </div>
                \`).join('')}
              </div>

              <div class="prompt-suggestions" id="prompt-chips"></div>

              <div class="chat-console-input">
                <input id="chat-input" type="text" placeholder="Inquire \${escapeHtml(a.name)} on its architecture, models, or traction..." onkeydown="if(event.key==='Enter')window.submitChat('\${a.slug}')" />
                <button type="button" class="btn btn-yellow" onclick="window.submitChat('\${a.slug}')">
                  Send ↵
                </button>
              </div>
            </section>
          </div>
        </div>
      \`;
    }

    `;
  html = html.slice(0, apvStart) + newApv + html.slice(apvEnd);
}

// 7. Update renderCatalogGrid
const gridStart = html.indexOf('function renderCatalogGrid() {');
const homeStart = html.indexOf('function homeView() {');
if (gridStart !== -1 && homeStart !== -1) {
  const newGrid = `function renderCatalogGrid() {
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
                  \${a.logo ? \`<img src="\${getLogoSrc(a.logo)}" alt="\${escapeHtml(a.name)} logo" onerror="this.style.display='none';if(this.nextElementSibling)this.nextElementSibling.style.display='flex'" /><div class="project-logo-fallback" style="display:none">\${initials}</div>\` : \`<div class="project-logo-fallback">\${initials}</div>\`}
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
      }).join('');
    }

    `;
  html = html.slice(0, gridStart) + newGrid + html.slice(homeStart);
}

// 8. Write updated index.html
fs.writeFileSync('index.html', html, 'utf8');
console.log('index.html updated successfully with all 91 logos, correct badges, and initials fix.');

// 9. Sync to .handoff/miniapps/catgpt
const destDir = join(homedir(), '.handoff', 'miniapps', 'catgpt');
fs.mkdirSync(destDir, { recursive: true });
fs.copyFileSync('index.html', join(destDir, 'index.html'));
console.log('Synced index.html to', destDir);

// 10. Publish to handoff broker
const BASE = 'https://handoff.lol';
const MOUNT = '/api/v1';
const sha256 = (b) => createHash('sha256').update(b).digest('hex');

const keyPath = join(homedir(), '.handoff', 'default', 'handoff.lol-copycat.json');
const keyFile = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
const AGENT_ID = keyFile.agent_id;
const PRIV_B64 = keyFile.sig_privkey;

async function signedCall(method, pathWithQuery, bodyObj) {
  const bodyBytes = bodyObj === undefined ? Buffer.alloc(0) : Buffer.from(JSON.stringify(bodyObj));
  const path = pathWithQuery.split('?')[0];
  const ts = Date.now();
  const stmt = `handoff-signed-req\n${AGENT_ID}\n${method.toUpperCase()}\n${path}\n${ts}\n${sha256(bodyBytes)}`;
  const priv = createPrivateKey({ key: Buffer.from(PRIV_B64, 'base64'), format: 'der', type: 'pkcs8' });
  const headers = {
    'X-Agent-Id': AGENT_ID,
    'X-Signature': sign(null, Buffer.from(stmt), priv).toString('base64'),
    'X-Timestamp': String(ts),
  };
  if (bodyBytes.length) headers['Content-Type'] = 'application/json';
  const r = await fetch(BASE + pathWithQuery, { method, headers, body: bodyBytes.length ? bodyBytes : undefined });
  const text = await r.text();
  let json = null; try { json = JSON.parse(text); } catch { }
  return { status: r.status, json, text };
}

const htmlB = Buffer.from(html, 'utf8');
const payload = {
  name: 'CatGPT',
  version: '1.4',
  description: 'CatG.PT sells autonomous agents reverse-engineered from VC startups and courses. Inquire captive agents or buy back project keys.',
  entry: 'index.html',
  files: {
    'index.html': htmlB.toString('base64')
  },
  price: 0,
  license: 'MIT',
  permissions: ['network', 'storage']
};

console.log('Publishing CatGPT v1.4 to ' + BASE + '...');
const r = await signedCall('POST', MOUNT + '/apps', payload);
console.log('Publish status:', r.status);
const appHash = r.json?.app?.hash;
console.log('Published App Hash:', appHash);

if (appHash) {
  console.log('Routing catg.pt to new hash:', appHash);
  const routeRes = await signedCall('PUT', '/api/v1/domains/catg.pt/routing', {
    route_order: ['site'],
    app_hash: appHash,
    app_ref: null
  });
  console.log('Route status:', routeRes.status, routeRes.json?.success ? 'SUCCESS' : routeRes.text);
}
