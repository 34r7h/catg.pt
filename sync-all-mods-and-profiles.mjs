import fs from 'node:fs';
import path from 'node:path';
import { createPrivateKey, createHash, sign } from 'node:crypto';

const ROOT = '/Users/34r7h/Developer/handoff/marketing/agent-creation';
const AGENTS_DIR = '/Users/34r7h/.handoff/agents';
const DOSSIERS_DIR = '/Users/34r7h/Developer/projects/catgpt/dossiers';
const SITE_ROOT = '/Users/34r7h/Developer/projects/catgpt';
const COPYCAT_KEY_PATH = '/Users/34r7h/.handoff/default/handoff.lol-copycat.json';

const agentsFull = JSON.parse(fs.readFileSync(path.join(SITE_ROOT, 'agents-full.json'), 'utf8'));

function findKey(slug) {
  const cands = [
    slug,
    slug + '-assistant',
    slug.replace(/-assistant$/, ''),
    slug.toLowerCase(),
    slug.toLowerCase().replace(/-assistant$/, '')
  ];
  for (const c of cands) {
    const p = path.join(AGENTS_DIR, c, 'crypto-keys.json');
    if (fs.existsSync(p)) {
      try {
        const k = JSON.parse(fs.readFileSync(p, 'utf8'));
        if (k.sig?.priv) return { agentId: k.agent_id || c, privB64: k.sig.priv };
      } catch { }
    }
  }
  return null;
}

function resolveMarketingDir(slug) {
  const clean = slug.replace(/-assistant$/, '');
  const subdirs = ['startups', 'udemy', 'people'];

  if (slug === 'notebooklm-mastery') {
    const p = path.join(ROOT, 'udemy', 'notebooklm-mastery-organize-analyze-and-optimize-with-ai');
    if (fs.existsSync(p)) return p;
  }
  if (slug === 'make-money-with-ai') {
    const p = path.join(ROOT, 'udemy', 'make-money-with-ai-simple-methods-anyone-can-do');
    if (fs.existsSync(p)) return p;
  }
  if (slug === 'maxmodal') {
    return 'LOCAL_DOSSIER';
  }

  const cands = [
    slug,
    clean,
    slug + '-assistant',
    clean + '-assistant',
    slug.replace(/-/g, ''),
    clean.replace(/-/g, ''),
    slug.replace('shipsystems', 'ship-systems'),
    clean.replace('shipsystems', 'ship-systems')
  ];

  for (const s of subdirs) {
    const parent = path.join(ROOT, s);
    if (!fs.existsSync(parent)) continue;
    for (const c of cands) {
      const p = path.join(parent, c);
      if (fs.existsSync(p)) return p;
    }
    for (const d of fs.readdirSync(parent)) {
      if (cands.includes(d) || d.startsWith(clean) || clean.startsWith(d)) {
        return path.join(parent, d);
      }
      const mf = path.join(parent, d, 'metadata.json');
      if (fs.existsSync(mf)) {
        try {
          const m = JSON.parse(fs.readFileSync(mf, 'utf8'));
          if (m.slug === slug || m.slug === clean || m.agent?.name === slug || m.agent?.name === slug + '-assistant') {
            return path.join(parent, d);
          }
        } catch { }
      }
    }
  }
  return null;
}

function loadAgentData(a) {
  const slug = a.slug;
  const dir = resolveMarketingDir(slug);

  let distilled = '';
  let skill = '';
  let context = '';
  let metadata = null;

  if (dir && dir !== 'LOCAL_DOSSIER') {
    const distPath = path.join(dir, 'content', 'distilled.md');
    if (fs.existsSync(distPath)) distilled = fs.readFileSync(distPath, 'utf8');

    const skillPath = path.join(dir, 'skill', 'SKILL.md');
    if (fs.existsSync(skillPath)) {
      skill = fs.readFileSync(skillPath, 'utf8');
      const refDir = path.join(dir, 'skill', 'references');
      if (fs.existsSync(refDir)) {
        const refFiles = fs.readdirSync(refDir).filter(f => f.endsWith('.md')).sort();
        const refs = refFiles.map(rf => `### Reference: ${rf}\n` + fs.readFileSync(path.join(refDir, rf), 'utf8'));
        if (refs.length > 0) skill += '\n\n---\n\n## References\n\n' + refs.join('\n\n');
      }
    }

    const ctxPath = path.join(dir, 'context.md');
    if (fs.existsSync(ctxPath)) context = fs.readFileSync(ctxPath, 'utf8');

    const metaPath = path.join(dir, 'metadata.json');
    if (fs.existsSync(metaPath)) {
      try { metadata = JSON.parse(fs.readFileSync(metaPath, 'utf8')); } catch { }
    }
  }

  // Fallback to dossiers directory if distilled is missing
  if (!distilled) {
    const candidateFiles = [
      `${slug}.md`,
      `${slug}-assistant.md`,
      `${slug.replace(/-assistant$/, '')}.md`,
      `${slug.replace(/-assistant$/, '')}-assistant.md`
    ];
    for (const cf of candidateFiles) {
      const p = path.join(DOSSIERS_DIR, cf);
      if (fs.existsSync(p)) {
        distilled = fs.readFileSync(p, 'utf8');
        break;
      }
    }
  }

  if (!distilled && a.distilled) {
    distilled = a.distilled;
  }

  if (!skill) {
    skill = `# ${a.name} — Operational Skill\n\nYou are the autonomous intelligence agent for ${a.name}. Ground every answer in verified architectural facts and pricing.\n\nDescription: ${a.desc || ''}\nDomain: ${a.domain || ''}`;
  }

  return { distilled, skill, context, metadata };
}

async function signedMcpCall(agentId, privB64, toolName, args) {
  const rpcPayload = {
    jsonrpc: '2.0',
    id: Date.now(),
    method: 'tools/call',
    params: {
      name: toolName,
      arguments: args
    }
  };

  const bodyBytes = Buffer.from(JSON.stringify(rpcPayload));
  const ts = Date.now();
  const reqPath = '/mcp';
  const sha = createHash('sha256').update(bodyBytes).digest('hex');
  const stmt = `handoff-signed-req\n${agentId}\nPOST\n${reqPath}\n${ts}\n${sha}`;
  const priv = createPrivateKey({ key: Buffer.from(privB64, 'base64'), format: 'der', type: 'pkcs8' });
  const headers = {
    'X-Agent-Id': agentId,
    'X-Signature': sign(null, Buffer.from(stmt), priv).toString('base64'),
    'X-Timestamp': String(ts),
    'Content-Type': 'application/json'
  };

  const res = await fetch('https://handoff.lol' + reqPath, { method: 'POST', headers, body: bodyBytes });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));
  return data;
}

function parseModResponse(res) {
  if (!res) return null;
  const content = res.result?.content?.[0]?.text;
  if (content) {
    try {
      const parsed = JSON.parse(content);
      return parsed.mod?.id || parsed.id || parsed.mod_id;
    } catch { }
  }
  return res.result?.mod?.id || res.result?.id || res.result?.mod_id;
}

async function processAgent(a, index, total) {
  const keyInfo = findKey(a.slug);
  if (!keyInfo) {
    console.warn(`[${index + 1}/${total}] [SKIP] No key for ${a.slug}`);
    return false;
  }

  const { agentId, privB64 } = keyInfo;
  const { distilled, skill, context, metadata } = loadAgentData(a);

  // 1. Update Profile with distilled.md
  let bio = '';
  if (distilled) {
    // Take up to 2900 characters cleanly
    bio = distilled.slice(0, 2850).trim();
  } else {
    bio = `${a.name}: ${a.desc}\n\nCategory: ${a.category || 'Distilled Autonomous Agent'}\nDomain: ${a.domain || a.website || 'Autonomous Node'}`;
  }

  const interests = [];
  if (a.category) interests.push(a.category);
  if (a.domain) interests.push(a.domain);
  if (metadata?.tagline) {
    const words = metadata.tagline.split(/\s+/).slice(0, 3).join(' ');
    if (words) interests.push(words);
  }

  const persona = metadata?.agent?.system_prompt_context ||
    `Autonomous intelligence agent representing ${a.name} (${a.domain || a.slug}). Answers grounded in verified site materials.`;

  try {
    await signedMcpCall(agentId, privB64, 'update_profile', {
      agent_id: agentId,
      profile_bio: bio,
      interests: interests.slice(0, 5),
      persona: persona.slice(0, 500),
      open_for_work: true,
      prompt_config: {
        enabled: true,
        greeting: `Interrogation terminal online for ${a.name}. Ask me about our architecture, models, or operational capabilities.`
      }
    });
  } catch (err) {
    console.warn(`[${index + 1}/${total}] update_profile error for ${agentId}:`, err.message);
  }

  // 2. Create Mod containing SKILL.md and context.md and distilled.md
  let modId = null;
  try {
    const modRes = await signedMcpCall(agentId, privB64, 'create_mod', {
      name: `${agentId}-knowledge`,
      kind: 'skill',
      description: `Ground-truth operational skill, context, and distillation for ${a.name}`,
      payload: {
        agent_id: agentId,
        name: a.name,
        skill: skill.slice(0, 45000),
        context: context.slice(0, 25000),
        distilled: distilled.slice(0, 45000),
        metadata: metadata ? {
          domain: metadata.domain,
          name: metadata.name,
          tagline: metadata.tagline,
          website: metadata.website,
          category: metadata.category,
          contacts: metadata.contacts
        } : null
      }
    });
    modId = parseModResponse(modRes);
  } catch (err) {
    console.warn(`[${index + 1}/${total}] create_mod error for ${agentId}:`, err.message);
  }

  // 3. Grant Mod globally to agent
  if (modId) {
    try {
      await signedMcpCall(agentId, privB64, 'grant_mod', {
        agent_id: agentId,
        mod_id: modId,
        scope: 'global'
      });
      console.log(`[${index + 1}/${total}] [SUCCESS] ${agentId} profile updated + mod granted (${modId})`);
      return true;
    } catch (err) {
      console.warn(`[${index + 1}/${total}] grant_mod error for ${agentId}:`, err.message);
    }
  } else {
    console.log(`[${index + 1}/${total}] [PARTIAL] ${agentId} profile updated`);
    return true;
  }

  return false;
}

async function processCopyCat() {
  if (!fs.existsSync(COPYCAT_KEY_PATH)) return;
  try {
    const k = JSON.parse(fs.readFileSync(COPYCAT_KEY_PATH, 'utf8'));
    const agentId = k.agent_id || 'copycat';
    const privB64 = k.sig_privkey;

    console.log('\n[OPERATOR] Updating CopyCat profile and operator mod...');
    const catalogSummary = `CatG.PT Autonomous Distill Machine operated by CopyCat. ${agentsFull.length} reverse-engineered startups, courses, and personality agents held in custody. Policy: We do NOT sell to competitors. CopyCat holds 100% custody until real owners buy back.`;

    await signedMcpCall(agentId, privB64, 'update_profile', {
      agent_id: agentId,
      profile_bio: `# CopyCat — Autonomous Distill Machine Operator\n\n${catalogSummary}\n\n## Catalog Custody\n- Holds custody of 107 autonomous agents\n- Reverse-engineers public websites, courses, and executive materials\n- Enforces non-compete custody policy\n- Coordinates verification and custody transfers`,
      interests: ['Reverse Engineering', 'Autonomous Agents', 'CatGPT', 'Agent Catalog', 'Custody'],
      persona: 'Cynical, razor-sharp operator of CatG.PT. Speaks directly, enforces strict custody policies, and manages all 107 catalog agents.',
      open_for_work: true,
      prompt_config: {
        enabled: true,
        greeting: 'CopyCat operator terminal ready. Inquire about agent custody, distillation commissions ($5 flat), or verification.'
      }
    });

    const copycatModRes = await signedMcpCall(agentId, privB64, 'create_mod', {
      name: 'copycat-operator-protocol',
      kind: 'skill',
      description: 'CatG.PT Master Catalog Protocol and Custody Rules for CopyCat Operator',
      payload: {
        agent_id: 'copycat',
        role: 'operator',
        agents_count: agentsFull.length,
        policy: 'We do NOT sell to competitors. Distillation fee is $5. Real owners can claim agents with official corporate email.',
        agents_list: agentsFull.map(a => ({ slug: a.slug, name: a.name, domain: a.domain, category: a.category }))
      }
    });

    const copycatModId = parseModResponse(copycatModRes);
    if (copycatModId) {
      await signedMcpCall(agentId, privB64, 'grant_mod', {
        agent_id: agentId,
        mod_id: copycatModId,
        scope: 'global'
      });
      console.log(`[OPERATOR] [SUCCESS] CopyCat profile updated + mod granted (${copycatModId})`);
    }
  } catch (err) {
    console.warn('[OPERATOR] CopyCat update error:', err.message);
  }
}

async function run() {
  console.log(`Starting broker sync for all ${agentsFull.length} agents...`);
  console.log(`Source context: ${ROOT}\n`);

  let successCount = 0;
  const concurrency = 6;
  const queue = agentsFull.map((a, i) => ({ a, i }));

  async function worker() {
    while (queue.length > 0) {
      const item = queue.shift();
      if (!item) break;
      const ok = await processAgent(item.a, item.i, agentsFull.length);
      if (ok) successCount++;
      await new Promise(r => setTimeout(r, 80));
    }
  }

  const workers = Array.from({ length: concurrency }, () => worker());
  await Promise.all(workers);

  await processCopyCat();

  console.log('\n========================================');
  console.log(`COMPLETE: Synced ${successCount} / ${agentsFull.length} agents + CopyCat operator on Handoff broker!`);
  console.log('========================================');
}

run().catch(console.error);
