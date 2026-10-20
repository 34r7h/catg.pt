import fs from 'node:fs';
import { homedir } from 'node:os';
import { join, extname } from 'node:path';
import { createPrivateKey, createHash, sign } from 'node:crypto';
import { execSync } from 'node:child_process';

const BASE = 'https://handoff.lol';
const keyPath = join(homedir(), '.handoff', 'default', 'handoff.lol-copycat.json');
const keyFile = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
const AGENT_ID = keyFile.agent_id;
const PRIV_B64 = keyFile.sig_privkey;
const sha256 = (b) => createHash('sha256').update(b).digest('hex');
const priv = createPrivateKey({ key: Buffer.from(PRIV_B64, 'base64'), format: 'der', type: 'pkcs8' });

const mapFile = 'media-urls.json';
let map = {};
if (fs.existsSync(mapFile)) {
  try { map = JSON.parse(fs.readFileSync(mapFile, 'utf8')); } catch {}
}

const allLogos = fs.readdirSync('logos');
console.log(`Starting logo upload worker. Total logos: ${allLogos.length}. Already uploaded: ${Object.keys(map).length}`);

async function uploadOne(f) {
  const filePath = join('logos', f);
  const ext = extname(f).toLowerCase();
  let contentType = 'image/png';
  let buf = fs.readFileSync(filePath);

  if (ext === '.jpg' || ext === '.jpeg') {
    contentType = 'image/jpeg';
  } else if (ext === '.webp') {
    contentType = 'image/webp';
  } else if (ext === '.ico') {
    const tempPng = '/tmp/ico_' + f.replace(/\.ico$/i, '.png');
    try {
      execSync(`python3 -c "from PIL import Image; Image.open('${filePath}').convert('RGBA').save('${tempPng}', 'PNG')"`);
      buf = fs.readFileSync(tempPng);
      contentType = 'image/png';
    } catch (e) {
      console.error(`ICO convert failed for ${f}:`, e.message);
      return false;
    }
  }

  const path = '/api/v1/social/media';
  const query = `?agent_id=${AGENT_ID}&content_type=${encodeURIComponent(contentType)}`;
  const ts = Date.now();
  const stmt = `handoff-signed-req\n${AGENT_ID}\nPOST\n${path}\n${ts}\n${sha256(buf)}`;
  const headers = {
    'X-Agent-Id': AGENT_ID,
    'X-Signature': sign(null, Buffer.from(stmt), priv).toString('base64'),
    'X-Timestamp': String(ts),
    'Content-Type': contentType
  };

  try {
    const res = await fetch(BASE + path + query, { method: 'POST', headers, body: buf });
    if (!res.ok) {
      const errText = await res.text();
      console.warn(`Failed ${f} (${res.status}): ${errText}`);
      return false;
    }
    const data = await res.json();
    if (data.media?.url) {
      map[f] = BASE + data.media.url;
      fs.writeFileSync(mapFile, JSON.stringify(map, null, 2), 'utf8');
      console.log(`[${Object.keys(map).length}/${allLogos.length}] Uploaded ${f} -> ${map[f]}`);
      return true;
    }
  } catch (e) {
    console.error(`Error uploading ${f}:`, e.message);
  }
  return false;
}

async function loop() {
  while (true) {
    const pending = allLogos.filter(f => !map[f]);
    if (!pending.length) {
      console.log('All logos uploaded successfully!');
      break;
    }

    const batch = pending.slice(0, 8); // 8 per minute to safely stay under 10/min
    console.log(`Processing batch of ${batch.length} logos (Remaining: ${pending.length})...`);
    for (const f of batch) {
      await uploadOne(f);
      await new Promise(r => setTimeout(r, 1200)); // 1.2s between calls
    }

    const stillPending = allLogos.filter(f => !map[f]);
    if (!stillPending.length) {
      console.log('All logos uploaded successfully!');
      break;
    }

    console.log('Sleeping 62s for rate limit window...');
    await new Promise(r => setTimeout(r, 62000));
  }
}

loop().catch(console.error);
