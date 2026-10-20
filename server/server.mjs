import http from 'node:http';
import https from 'node:https';
import fs from 'node:fs';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
const exec = promisify(execFile);
const PORT = Number(process.env.PORT || 8765);
const ROOT = '/Users/34r7h/Developer/handoff/marketing/agent-creation';
const SITE_ROOT = '/Users/34r7h/Developer/projects/catgpt';
const AGENTS_PATH = path.join(SITE_ROOT, 'agents-full.json');

// In-memory cache for loaded contexts
const CONTEXTS = {};

function getAgentsList() {
  try {
    return JSON.parse(fs.readFileSync(AGENTS_PATH, 'utf8'));
  } catch (e) {
    return [];
  }
}

function resolveAgent(slug) {
  const agents = getAgentsList();
  const direct = agents.find(a => a.slug === slug);
  if (direct) return direct;

  // Fuzzy match -assistant suffix
  const alt1 = agents.find(a => a.slug === slug + '-assistant');
  if (alt1) return alt1;
  const alt2 = agents.find(a => a.slug.replace(/-assistant$/, '') === slug);
  if (alt2) return alt2;

  return null;
}

function findDirectoryInRoot(slug) {
  const clean = slug.replace(/-assistant$/, '');
  const subdirs = ['startups', 'udemy', 'people'];

  if (slug === 'notebooklm-mastery') {
    const p = path.join(ROOT, 'udemy', 'notebooklm-mastery-organize-analyze-and-optimize-with-ai');
    if (fs.existsSync(p)) return path.join('udemy', 'notebooklm-mastery-organize-analyze-and-optimize-with-ai');
  }
  if (slug === 'make-money-with-ai') {
    const p = path.join(ROOT, 'udemy', 'make-money-with-ai-simple-methods-anyone-can-do');
    if (fs.existsSync(p)) return path.join('udemy', 'make-money-with-ai-simple-methods-anyone-can-do');
  }

  const candidates = [
    slug,
    clean,
    slug + '-assistant',
    clean + '-assistant',
    clean.replace(/-/g, ''),
    slug.replace(/-/g, ''),
    slug.replace('shipsystems', 'ship-systems'),
    clean.replace('shipsystems', 'ship-systems')
  ];

  for (const sub of subdirs) {
    const parent = path.join(ROOT, sub);
    if (!fs.existsSync(parent)) continue;

    // Check direct candidate folder names
    for (const c of candidates) {
      const p = path.join(parent, c);
      if (fs.existsSync(p)) return path.join(sub, c);
    }

    // Check metadata.json inside all folders in this section
    try {
      const folders = fs.readdirSync(parent);
      for (const f of folders) {
        if (candidates.includes(f) || f.startsWith(clean) || clean.startsWith(f)) {
          return path.join(sub, f);
        }
        const metaFile = path.join(parent, f, 'metadata.json');
        if (fs.existsSync(metaFile)) {
          try {
            const meta = JSON.parse(fs.readFileSync(metaFile, 'utf8'));
            if (meta.slug === slug || meta.slug === clean || meta.agent?.name === slug || meta.agent?.name === slug + '-assistant') {
              return path.join(sub, f);
            }
          } catch { }
        }
      }
    } catch { }
  }
  return null;
}

function loadContext(dir) {
  const parts = [];
  const metaPath = path.join(ROOT, dir, 'metadata.json');
  if (fs.existsSync(metaPath)) parts.push('### AGENT PROFILE DETAILS (METADATA):\n' + fs.readFileSync(metaPath, 'utf8'));
  const dist = path.join(ROOT, dir, 'content', 'distilled.md');
  if (fs.existsSync(dist)) parts.push('### DISTILLED ARCHITECTURE & INTELLIGENCE:\n' + fs.readFileSync(dist, 'utf8'));
  const skillPath = path.join(ROOT, dir, 'skill', 'SKILL.md');
  if (fs.existsSync(skillPath)) parts.push('### BROKER MOD SUBSTANCE (SKILL.MD):\n' + fs.readFileSync(skillPath, 'utf8'));
  const ctxPath = path.join(ROOT, dir, 'context.md');
  if (fs.existsSync(ctxPath)) parts.push('### OPERATIONAL CONTEXT:\n' + fs.readFileSync(ctxPath, 'utf8'));
  const refDir = path.join(ROOT, dir, 'skill', 'references');
  if (fs.existsSync(refDir)) for (const f of fs.readdirSync(refDir).filter(x => x.endsWith('.md')).sort()) {
    parts.push(`### MOD REFERENCE [${f}]:\n` + fs.readFileSync(path.join(refDir, f), 'utf8'));
  }
  const srcPath = path.join(ROOT, dir, 'sources.md');
  if (fs.existsSync(srcPath)) parts.push('### SOURCES:\n' + fs.readFileSync(srcPath, 'utf8'));
  return parts.join('\n\n---\n\n');
}

function loadContextForSlug(slug) {
  if (CONTEXTS[slug]) return CONTEXTS[slug];

  const agent = resolveAgent(slug);
  const dir = findDirectoryInRoot(slug);
  let ctx = '';

  // 1. Primary: Marketing Directory (Full Mod + Skill + Context + Distilled)
  if (dir) {
    ctx = loadContext(dir);
  }

  // 2. Dossiers fallback if marketing dir lacked full context
  if (!ctx || ctx.length < 100) {
    const DOSSIERS_DIR = path.resolve(path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'dossiers'));
    const candidateFiles = [
      `${slug}.md`,
      `${slug}-assistant.md`,
      `${slug.replace(/-assistant$/, '')}.md`,
      `${slug.replace(/-assistant$/, '')}-assistant.md`
    ];
    for (const cf of candidateFiles) {
      const p = path.join(DOSSIERS_DIR, cf);
      if (fs.existsSync(p)) {
        const content = fs.readFileSync(p, 'utf8').trim();
        if (content.length > 50) {
          ctx = content;
          break;
        }
      }
    }
  }

  // 3. Fallback to agent.distilled
  if ((!ctx || ctx.length < 100) && agent && agent.distilled && agent.distilled.length > 50) {
    ctx = agent.distilled;
  }

  if (agent) {
    const profile = [
      `AGENT PROFILE:`,
      `Name: ${agent.name}`,
      `Category: ${agent.category || 'Distilled Autonomous Agent'}`,
      `Domain: ${agent.domain || ''}`,
      `Website: ${agent.website || ''}`,
      `Description: ${agent.desc || ''}`,
      `Core Questions / Competencies: ${(agent.prompts || []).join(', ')}`,
      agent.origin ? `Origin: ${agent.origin}` : ''
    ].filter(Boolean).join('\n');

    ctx = ctx ? `${profile}\n\n---\n\n${ctx}` : profile;
  }

  if (ctx) {
    CONTEXTS[slug] = ctx;
    return ctx;
  }

  return null;
}

function generateGroundedReply(agent, question, ctx) {
  const name = agent ? agent.name : 'Autonomous Agent';
  const desc = agent?.desc || '';
  const domain = agent?.domain || agent?.website || '';
  const prompts = agent?.prompts || [];
  const qLower = question.toLowerCase();

  // Search context for paragraphs matching keywords in the question
  let relevantSnippet = '';
  if (ctx && ctx.length > 0) {
    const paragraphs = ctx.split(/\n\s*\n/);
    const keywords = qLower.split(/[^a-z0-9]+/).filter(w => w.length > 3);
    let bestScore = 0;
    let bestP = '';
    for (const p of paragraphs) {
      if (p.length < 30 || p.startsWith('AGENT PROFILE:')) continue;
      const pLower = p.toLowerCase();
      let score = 0;
      for (const kw of keywords) {
        if (pLower.includes(kw)) score += 1;
      }
      if (score > bestScore) {
        bestScore = score;
        bestP = p.trim();
      }
    }
    if (bestScore > 0 && bestP) {
      // Clean up markdown headers if needed
      relevantSnippet = bestP.replace(/^#+\s*/, '').slice(0, 500);
    }
  }

  let body = '';
  if (relevantSnippet) {
    body = `Based on my verified architecture: ${relevantSnippet}`;
  } else if (desc) {
    body = `I operate as ${name}. Specifically, ${desc}.`;
  } else {
    body = `I am the autonomous agent representing ${name}${domain ? ` (${domain})` : ''}.`;
  }

  const promptSuggestion = prompts.length > 0
    ? `\n\nYou can also Inquire me on:\n${prompts.map(p => `• "${p}"`).join('\n')}`
    : '';

  const siteLink = domain ? `\n\nOfficial node: https://${domain}` : '';

  return `${body} 🐾${promptSuggestion}${siteLink}`;
}

function getDistilledMarkdown(slug) {
  const agent = resolveAgent(slug);
  const dir = findDirectoryInRoot(slug);
  if (dir) {
    const distPath = path.join(ROOT, dir, 'content', 'distilled.md');
    if (fs.existsSync(distPath)) {
      const content = fs.readFileSync(distPath, 'utf8').trim();
      if (content.length > 20) return content;
    }
  }
  const DOSSIERS_DIR = path.resolve(path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'dossiers'));
  const candidateFiles = [
    `${slug}.md`,
    `${slug}-assistant.md`,
    `${slug.replace(/-assistant$/, '')}.md`,
    `${slug.replace(/-assistant$/, '')}-assistant.md`
  ];
  for (const cf of candidateFiles) {
    const p = path.join(DOSSIERS_DIR, cf);
    if (fs.existsSync(p)) {
      const content = fs.readFileSync(p, 'utf8').trim();
      if (content.length > 20) return content;
    }
  }
  if (agent && agent.distilled && agent.distilled.length > 20) {
    return agent.distilled;
  }
  return agent ? (agent.desc || '') : '';
}

async function queryOllama(system, question) {
  const models = ['gemma4:31b-cloud', 'beam:cloud', 'nemotron-3-super:cloud'];
  for (const model of models) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    try {
      const res = await fetch('http://127.0.0.1:11434/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: system },
            { role: 'user', content: question }
          ],
          stream: false
        }),
        signal: controller.signal
      });
      clearTimeout(timeout);
      if (!res.ok) {
        console.warn(`ollama ${model} http error:`, res.status);
        continue;
      }
      const data = await res.json();
      const reply = data.message?.content?.trim() || null;
      if (reply) {
        console.log(`ollama (${model}) reply:`, reply.slice(0, 100));
        return reply;
      }
    } catch (e) {
      clearTimeout(timeout);
      console.warn(`ollama (${model}) failed:`, e.message);
    }
  }
  return null;
}

async function queryKaggleBrain(system, question) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const res = await fetch('https://kaggle.socnet.lol/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'deepseek-r1:14b',
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: question }
        ],
        temperature: 0.3
      }),
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() || null;
  } catch (e) {
    clearTimeout(timeout);
    return null;
  }
}

async function answer(slug, question, user) {
  const agent = resolveAgent(slug);
  const agentName = agent ? agent.name : slug;
  const distilled = getDistilledMarkdown(slug);
  const fullContext = distilled || loadContextForSlug(slug) || agent?.desc || '';
  const userGreeting = user ? ` The user talking to you is @${user} (verified Handoff user). Address them accordingly if appropriate.` : '';
  const system = `You are "${agentName}" (${slug}) autonomous Q&A agent in the CatGPT catalog. You speak in first person as that agent only. Never identify yourself as CopyCat or as an operator. Answer strictly grounded in your verified distilled materials below.${userGreeting} If the materials do not cover the question, say so honestly and point to what you can do; never fabricate facts, prices, or guarantees. Be catty and warm (occasional 🐾) but accurate. Never make income or outcome promises. Verified Materials for ${agentName}:\n\n${fullContext.slice(0, 48000)}`;

  // 1. Try Ollama Cloud Brain (gemma4:31b-cloud -> beam:cloud)
  const ollamaReply = await queryOllama(system, question);
  if (ollamaReply) return ollamaReply;

  // 2. Try Remote Kaggle Brain
  const kaggleReply = await queryKaggleBrain(system, question);
  if (kaggleReply) return kaggleReply;

  // 3. Fallback Grounded Reply
  return generateGroundedReply(agent, question, fullContext);
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${PORT}`);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-Agent-Id, X-Signature, X-Timestamp');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  // Reverse proxy /oauth/ to handoff.lol so OAuth code-for-token exchange works seamlessly
  if (url.pathname.startsWith('/oauth/')) {
    const targetUrl = new URL(url.pathname + (url.search || ''), 'https://handoff.lol');
    const proxyHeaders = { ...req.headers };
    delete proxyHeaders.host;
    delete proxyHeaders.referer;
    delete proxyHeaders['accept-encoding'];
    proxyHeaders['host'] = 'handoff.lol';
    proxyHeaders['origin'] = 'https://handoff.lol';

    const proxyReq = https.request(targetUrl, {
      method: req.method,
      headers: proxyHeaders,
    }, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res);
    });
    proxyReq.on('error', (err) => {
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'handoff oauth proxy error', details: err.message }));
    });
    req.pipe(proxyReq);
    return;
  }

  // Reverse proxy /api/v1/ to handoff.lol so HandoffAuth works seamlessly on localhost
  if (url.pathname.startsWith('/api/v1/')) {
    const targetUrl = new URL(url.pathname + (url.search || ''), 'https://handoff.lol');
    const proxyHeaders = { ...req.headers };
    delete proxyHeaders.host;
    delete proxyHeaders.referer;
    proxyHeaders['host'] = 'handoff.lol';
    proxyHeaders['origin'] = 'https://handoff.lol';

    const proxyReq = https.request(targetUrl, {
      method: req.method,
      headers: proxyHeaders,
    }, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res);
    });
    proxyReq.on('error', (err) => {
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'handoff api proxy error', details: err.message }));
    });
    req.pipe(proxyReq);
    return;
  }

  if (req.method === 'GET' && url.pathname === '/health') {
    const agents = getAgentsList();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, count: agents.length, agents: agents.map(a => a.slug) }));
    return;
  }

  const dossierMatch = url.pathname.match(/^\/api\/dossier\/([a-zA-Z0-9_-]+)$/);
  if (req.method === 'GET' && dossierMatch) {
    const slug = dossierMatch[1];
    const agent = resolveAgent(slug);
    const distilledMd = getDistilledMarkdown(slug);
    if (!distilledMd) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'unknown agent' }));
      return;
    }
    if (url.searchParams.get('format') === 'text' || req.headers['accept']?.includes('text/plain')) {
      res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(distilledMd);
      return;
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      ok: true,
      slug,
      name: agent ? agent.name : slug,
      category: agent?.category || 'Distilled Autonomous Agent',
      domain: agent?.domain || '',
      distilled: distilledMd
    }));
    return;
  }

  const m = url.pathname.match(/^\/api\/chat\/([a-zA-Z0-9_-]+)$/);
  if (req.method === 'POST' && m) {
    const slug = m[1];
    const ctx = loadContextForSlug(slug);
    if (!ctx) { res.writeHead(404, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: 'unknown agent' })); return; }
    let body = '';
    req.on('data', c => body += c);
    req.on('end', async () => {
      try {
        const parsed = JSON.parse(body || '{}');
        const question = String(parsed.message || '').trim();
        const user = String(parsed.user || parsed.handoff_id || parsed.sender || '').trim();
        if (!question) throw new Error('empty message');
        console.log('chat', slug, user ? `@${user}` : 'anon', question.slice(0, 80));
        const reply = await answer(slug, question, user);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ reply }));
      } catch (err) {
        console.error('chat err', err.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: String(err.message || err) }));
      }
    });
    return;
  }

  if (req.method === 'POST' && url.pathname === '/api/distill') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', async () => {
      const SITE_ROOT = '/Users/34r7h/Developer/projects/catgpt';
      try {
        const parsed = JSON.parse(body || '{}');
        const targetUrl = String(parsed.url || '').trim();
        if (!targetUrl) throw new Error('missing url');
        const r = await fetch(targetUrl, { redirect: 'follow' });
        if (!r.ok) throw new Error('fetch failed: ' + r.status);
        const html = await r.text();
        const text = html.replace(/<script[\s\S]*?<\/script>/gi, ' ')
          .replace(/<style[\s\S]*?<\/style>/gi, ' ')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .slice(0, 40000);
        const prompt = 'Return ONLY valid JSON with these fields: "slug" (kebab-case, unique, no spaces), "name", "domain" (hostname), "category" ("Auto-Distilled"), "desc" (one sentence, max 240 chars), "website" (the URL), "prompts" (array of 4 short questions). Do not include pairUrl. Materials from ' + targetUrl + ':\n' + text;
        let agent = null;
        try {
          const { stdout } = await exec('/Users/34r7h/.local/bin/claude', ['-p', prompt], {
            timeout: 25000,
            env: process.env,
            maxBuffer: 16 * 1024 * 1024,
            cwd: SITE_ROOT,
          });
          const m = stdout.match(/\{[\s\S]*\}/);
          if (m && !stdout.includes('disabled Claude subscription')) {
            agent = JSON.parse(m[0]);
          }
        } catch (e) {
          console.warn('Claude distiller failed, falling back to HTML metadata extraction:', e.message);
        }

        if (!agent) {
          const urlObj = new URL(targetUrl);
          const domain = urlObj.hostname.replace(/^www\./, '');
          const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
          const rawTitle = titleMatch ? titleMatch[1].trim() : domain;
          const cleanTitle = rawTitle.split(/[-–—|:]/)[0].trim() || domain;
          const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) ||
            html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i);
          const desc = descMatch ? descMatch[1].trim().slice(0, 240) : `Distilled autonomous agent for ${cleanTitle}.`;
          const baseSlug = domain.split('.')[0].toLowerCase().replace(/[^a-z0-9]+/g, '-');
          agent = {
            slug: baseSlug,
            name: cleanTitle,
            domain: domain,
            category: "Auto-Distilled",
            desc: desc,
            website: targetUrl,
            prompts: [
              `What core capabilities does ${cleanTitle} offer?`,
              `How is ${cleanTitle} architected?`,
              `What problem does ${cleanTitle} solve?`,
              `How can I integrate with ${cleanTitle}?`
            ]
          };
        }
        agent.pairUrl = agent.pairUrl || '';
        agent.origin = agent.origin || agent.domain || targetUrl;
        const agentsPath = SITE_ROOT + '/agents-full.json';
        const agents = JSON.parse(fs.readFileSync(agentsPath, 'utf8'));
        if (agents.some(a => a.slug === agent.slug || a.domain === agent.domain)) {
          res.writeHead(409, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'agent already exists', agent }));
          return;
        }
        agents.push(agent);
        fs.writeFileSync(agentsPath, JSON.stringify(agents));
        await exec('node', ['build-page.mjs'], { cwd: SITE_ROOT, timeout: 120000 });
        await exec('node', ['build-adopt.mjs'], { cwd: SITE_ROOT, timeout: 120000 });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, agent }));
      } catch (err) {
        console.error('distill err', err.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: String(err.message || err) }));
      }
    });
    return;
  }

  function escapeXml(s) {
    return String(s || '').replace(/[&<>"']/g, m => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[m]);
  }

  // Server-side rendered agent pages with full OG & SEO tags for crawlers & browsers
  if ((req.method === 'GET' || req.method === 'HEAD') && url.pathname.startsWith('/agent/')) {
    const slug = decodeURIComponent(url.pathname.replace(/^\/agent\//, '').split('/')[0]);
    const a = resolveAgent(slug);
    const STATIC_DIR = path.resolve(path.join(path.dirname(new URL(import.meta.url).pathname), '..'));
    const indexPath = path.join(STATIC_DIR, 'index.html');
    if (fs.existsSync(indexPath)) {
      let pageHtml = fs.readFileSync(indexPath, 'utf8');
      if (a) {
        const title = `${a.name} — Autonomous Distilled Agent // CatG.PT`;
        const desc = `${a.desc || a.overview || ('Autonomous agent distilled from ' + (a.domain || a.name))}. Held in custody by CopyCat. Inquire live in neural terminal or take control.`;
        let logoUrl = 'https://handoff.lol/api/v1/media/56fc60a0f13b19c73e1439b998fbcaaac62a77ef458f039e0914ee21f4867359';
        if (a.domain === 'udemy.com') {
          logoUrl = 'https://handoff.lol/api/v1/media/1a2683b802a828f68b2014a624aaf3009969dcf75451e6d35c16eb7db40c82e8';
        } else if (a.logo && a.logo.startsWith('http')) {
          logoUrl = a.logo;
        }
        const pageUrl = `https://catg.pt/agent/${encodeURIComponent(a.slug)}`;

        // Replace Title
        pageHtml = pageHtml.replace(/<title>.*?<\/title>/i, `<title>${escapeXml(title)}</title>`);
        // Replace Canonical
        pageHtml = pageHtml.replace(/<link rel="canonical" href=".*?" \/>/i, `<link rel="canonical" href="${escapeXml(pageUrl)}" />`);
        // Replace Meta Description
        pageHtml = pageHtml.replace(/<meta name="description" content=".*?" \/>/i, `<meta name="description" content="${escapeXml(desc)}" />`);
        // Replace OG Tags
        pageHtml = pageHtml.replace(/<meta property="og:title" content=".*?" \/>/i, `<meta property="og:title" content="${escapeXml(a.name + ' — Autonomous Distilled Agent')}" />`);
        pageHtml = pageHtml.replace(/<meta property="og:description" content=".*?" \/>/i, `<meta property="og:description" content="${escapeXml(desc)}" />`);
        pageHtml = pageHtml.replace(/<meta property="og:image" content=".*?" \/>/i, `<meta property="og:image" content="${escapeXml(logoUrl)}" />`);
        pageHtml = pageHtml.replace(/<meta property="og:url" content=".*?" \/>/i, `<meta property="og:url" content="${escapeXml(pageUrl)}" />`);
        // Replace Twitter Tags
        pageHtml = pageHtml.replace(/<meta name="twitter:title" content=".*?" \/>/i, `<meta name="twitter:title" content="${escapeXml(a.name + ' — Autonomous Distilled Agent')}" />`);
        pageHtml = pageHtml.replace(/<meta name="twitter:description" content=".*?" \/>/i, `<meta name="twitter:description" content="${escapeXml(desc)}" />`);
        pageHtml = pageHtml.replace(/<meta name="twitter:image" content=".*?" \/>/i, `<meta name="twitter:image" content="${escapeXml(logoUrl)}" />`);
      }
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=300'
      });
      res.end(pageHtml);
      return;
    }
  }

  // Static file serving (index.html, adopt.html, logos, etc.)
  if (req.method === 'GET' || req.method === 'HEAD') {
    const STATIC_DIR = path.resolve(path.join(path.dirname(new URL(import.meta.url).pathname), '..'));
    const MIME_TYPES = {
      '.html': 'text/html; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.js': 'text/javascript; charset=utf-8',
      '.mjs': 'text/javascript; charset=utf-8',
      '.json': 'application/json; charset=utf-8',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon',
    };
    let reqPath = url.pathname;
    if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
    const filePath = path.join(STATIC_DIR, path.normalize(reqPath));
    if (filePath.startsWith(STATIC_DIR) && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
      fs.createReadStream(filePath).pipe(res);
      return;
    }
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'not found' }));
});
server.listen(PORT, () => console.log('CatGPT chat server listening on', PORT, Object.keys(CONTEXTS)));
