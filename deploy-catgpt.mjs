import fs from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { createPrivateKey, createHash, sign } from 'node:crypto';
import { execSync } from 'node:child_process';

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

async function deploy() {
  let indexHtml = fs.readFileSync('index.html', 'utf8');
  const adoptHtml = fs.readFileSync('adopt.html', 'utf8');
  const authJs = fs.readFileSync('auth.js', 'utf8');
  const iconsJs = fs.readFileSync('icons.js', 'utf8');

  // Sync to local miniapps
  const destDir = join(homedir(), '.handoff', 'miniapps', 'catgpt');
  fs.mkdirSync(destDir, { recursive: true });
  fs.copyFileSync('index.html', join(destDir, 'index.html'));
  fs.copyFileSync('adopt.html', join(destDir, 'adopt.html'));
  fs.copyFileSync('auth.js', join(destDir, 'auth.js'));
  fs.copyFileSync('icons.js', join(destDir, 'icons.js'));
  console.log('Synced files to local miniapps directory:', destDir);

  // Minify auth.js and icons.js
  console.log('Minifying icons.js and auth.js with esbuild...');
  fs.writeFileSync('/tmp/auth_src.js', authJs);
  execSync('npx -y esbuild /tmp/auth_src.js --minify --outfile=/tmp/auth.min.js');
  fs.writeFileSync('/tmp/icons_src.js', iconsJs);
  execSync('npx -y esbuild /tmp/icons_src.js --minify --outfile=/tmp/icons.min.js');
  const iconsMin = fs.readFileSync('/tmp/icons.min.js', 'utf8').trim();
  const authMin = fs.readFileSync('/tmp/auth.min.js', 'utf8').trim();

  // Inline them into indexHtml so there are NO external script 404s
  indexHtml = indexHtml.replace(
    /<script src="\/icons\.js"><\/script>\s*<script src="\/auth\.js"><\/script>/i,
    () => `<script>${iconsMin}</script>\n  <script>${authMin}</script>`
  );

  // Minify CSS
  const cssMatch = indexHtml.match(/<style>([\s\S]*?)<\/style>/i);
  if (cssMatch) {
    fs.writeFileSync('/tmp/temp.css', cssMatch[1]);
    execSync('npx -y esbuild /tmp/temp.css --minify --outfile=/tmp/temp.min.css');
    const minCss = fs.readFileSync('/tmp/temp.min.css', 'utf8').trim();
    indexHtml = indexHtml.replace(cssMatch[1], () => minCss);
  }

  // Minify main JS in indexHtml
  const scripts = indexHtml.match(/<script[\s\S]*?>([\s\S]*?)<\/script>/gi);
  if (scripts && scripts.length > 0) {
    const lastScript = scripts[scripts.length - 1];
    const jsContent = lastScript.replace(/^<script[\s\S]*?>/i, '').replace(/<\/script>$/i, '');
    fs.writeFileSync('/tmp/main.js', jsContent);
    execSync('npx -y esbuild /tmp/main.js --minify --outfile=/tmp/main.min.js');
    const minJs = fs.readFileSync('/tmp/main.min.js', 'utf8').trim();
    indexHtml = indexHtml.replace(lastScript, () => `<script>${minJs}</script>`);
  }

  // Ensure image height is strictly 350px
  indexHtml = indexHtml.replace(/height:\s*(?:152|304)px;object-fit:cover;object-position:center 30%/g, 'height:350px;object-fit:cover;object-position:center 30%');

  // Strip comments and extra blank lines
  const trimmed = indexHtml
    .replace(/<!--[\s\S]*?-->/g, '')
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean)
    .join('\n');

  const files = {
    'index.html': Buffer.from(trimmed, 'utf8').toString('base64')
  };

  const payload = {
    name: 'CatGPT',
    version: '2.4',
    description: 'CatG.PT reverse-engineered startup, course, and personality agents.',
    entry: 'index.html',
    files,
    notes: 'Ask amuse about any listed agent — replies arrive with prior conversation context and the agent dossier attached.',
    price: 0,
    license: 'MIT',
    permissions: ['network', 'storage']
  };

  const jsonBytes = Buffer.byteLength(JSON.stringify(payload));
  console.log(`Publishing CatGPT v2.4 (payload: ${jsonBytes} bytes / ${(jsonBytes / 1024).toFixed(1)} KiB)...`);
  if (jsonBytes > 262144) {
    throw new Error(`Payload exceeds 256 KiB cap: ${jsonBytes} bytes`);
  }

  let r = await signedCall('POST', MOUNT + '/apps', payload);
  console.log('Publish status:', r.status);

  if (r.status >= 200 && r.status < 300) {
    const appHash = r.json?.app?.hash;
    console.log('Successfully published! App Hash:', appHash);
    if (appHash) {
      console.log('Routing catg.pt domain to new hash:', appHash);
      const routeRes = await signedCall('PUT', '/api/v1/domains/catg.pt/routing', {
        route_order: ['site'],
        app_hash: appHash,
        app_ref: null
      });
      console.log('Domain routing result:', routeRes.status, routeRes.json?.success ? 'SUCCESS' : routeRes.text);
    }
  } else {
    console.error('Failed to publish app:', r.status, r.text);
  }
}

deploy().catch(err => {
  console.error('Deployment error:', err);
  process.exit(1);
});
