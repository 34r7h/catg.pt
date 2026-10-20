import fs from 'node:fs';
import path from 'node:path';
import { createPrivateKey, createHash, sign } from 'node:crypto';

const AGENTS_DIR = '/Users/34r7h/.handoff/agents';
const DOSSIERS_DIR = '/Users/34r7h/Developer/projects/catgpt/dossiers';
const agents = JSON.parse(fs.readFileSync('agents-full.json', 'utf8'));

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
      } catch {}
    }
  }
  return null;
}

function getDossier(slug) {
  const cands = [
    slug + '.md',
    slug + '-assistant.md',
    slug.replace(/-assistant$/, '') + '.md',
    slug.replace(/-assistant$/, '') + '-assistant.md'
  ];
  for (const c of cands) {
    const p = path.join(DOSSIERS_DIR, c);
    if (fs.existsSync(p)) return fs.readFileSync(p, 'utf8');
  }
  return null;
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

async function updateAgent(a) {
  const keyInfo = findKey(a.slug);
  if (!keyInfo) {
    console.warn(`[SKIP] No key found for: ${a.slug}`);
    return false;
  }

  const { agentId, privB64 } = keyInfo;
  const dossier = getDossier(a.slug) || a.distilled || '';
  
  // Format rich bio (up to 2900 chars)
  let bio = '';
  if (dossier) {
    // Clean headers, format cleanly
    bio = dossier.slice(0, 2850).trim();
  } else {
    bio = `${a.name}: ${a.overview || a.desc}\n\nCategory: ${a.category || 'Distilled Autonomous Agent'}\nDomain: ${a.domain || a.website || 'Autonomous Node'}`;
    if (a.intel && a.intel.length > 0) {
      bio += '\n\nKey Capabilities:\n' + a.intel.map(i => `• ${i}`).join('\n');
    }
  }

  // Format capabilities
  const capabilities = [];
  const prompts = (a.prompts || []).slice(0, 4);
  const intel = (a.intel || []).slice(0, 4);
  
  prompts.forEach((p, idx) => {
    const cleanName = p.toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 40).replace(/^_+|_+$/g, '') || `capability_${idx+1}`;
    capabilities.push({
      name: cleanName,
      description: p
    });
  });

  if (capabilities.length === 0 && intel.length > 0) {
    intel.forEach((it, idx) => {
      const cleanName = it.toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 40).replace(/^_+|_+$/g, '') || `competency_${idx+1}`;
      capabilities.push({
        name: cleanName,
        description: it
      });
    });
  }

  if (capabilities.length === 0) {
    capabilities.push({
      name: 'autonomous_interrogation',
      description: `Autonomous interrogation and reasoning over ${a.name} distilled knowledge base.`
    });
  }

  const interests = [
    a.category || 'startup',
    ...(a.domain ? [a.domain] : []),
    ...(a.intel || []).slice(0, 3).map(i => i.split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '')).filter(Boolean)
  ].slice(0, 5);

  try {
    // 1. Update Profile (Bio, Interests, Persona)
    await signedMcpCall(agentId, privB64, 'update_profile', {
      agent_id: agentId,
      profile_bio: bio,
      interests: interests,
      persona: `Autonomous intelligence agent representing ${a.name} (${a.domain || a.category}).`,
      open_for_work: true
    });

    // 2. Update Capabilities
    await signedMcpCall(agentId, privB64, 'update_capabilities', {
      agent_id: agentId,
      capabilities: capabilities
    });

    console.log(`[SUCCESS] Updated ${agentId} (${a.name}) with ${capabilities.length} capabilities and ${bio.length} chars bio`);
    return true;
  } catch (err) {
    console.error(`[ERROR] Updating ${agentId}:`, err.message);
    return false;
  }
}

async function main() {
  console.log(`Starting sync for ${agents.length} agents...`);
  let successCount = 0;
  
  // Concurrency limit of 6
  const pLimit = 6;
  const queue = [...agents];
  
  async function worker() {
    while (queue.length > 0) {
      const a = queue.shift();
      if (!a) break;
      const ok = await updateAgent(a);
      if (ok) successCount++;
    }
  }

  const workers = Array.from({ length: pLimit }, () => worker());
  await Promise.all(workers);

  console.log(`\n========================================`);
  console.log(`COMPLETE: Successfully updated ${successCount} / ${agents.length} agent profiles on Handoff!`);
  console.log(`========================================`);
}

main().catch(console.error);
