import fs from 'node:fs';
import path from 'node:path';

const ROOT = '/Users/34r7h/Developer/handoff/marketing/agent-creation';
const SITE_ROOT = '/Users/34r7h/Developer/projects/catgpt';
const AGENTS_PATH = path.join(SITE_ROOT, 'agents-full.json');

const agents = JSON.parse(fs.readFileSync(AGENTS_PATH, 'utf8'));

function findDir(slug) {
  const subdirs = ['startups', 'udemy', 'people'];
  const clean = slug.replace(/-assistant$/, '');
  const candidates = [slug, clean, slug + '-assistant', clean.replace(/-/g, ''), slug.replace(/-/g, '')];
  
  for (const sub of subdirs) {
    const parent = path.join(ROOT, sub);
    if (!fs.existsSync(parent)) continue;
    const entries = fs.readdirSync(parent);
    
    for (const c of candidates) {
      if (entries.includes(c)) return path.join(parent, c);
    }
    for (const e of entries) {
      if (e === clean || e.includes(clean) || clean.includes(e)) {
        return path.join(parent, e);
      }
    }
  }
  return null;
}

function cleanDistilledText(raw) {
  if (!raw) return '';
  let clean = raw
    .replace(/```[\s\S]*?```/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/^#+\s+/gm, '')
    .replace(/\r\n/g, '\n');
  
  clean = clean.split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0 && !l.startsWith('Source:') && !l.startsWith('Uploader:') && !l.startsWith('Torrent'))
    .join('\n');
  
  return clean.slice(0, 3000);
}

for (const a of agents) {
  const dir = findDir(a.slug);
  let content = '';
  if (dir) {
    const distPath = path.join(dir, 'content', 'distilled.md');
    const ctxPath = path.join(dir, 'context.md');
    const skillPath = path.join(dir, 'skill', 'SKILL.md');
    
    if (fs.existsSync(distPath)) content = fs.readFileSync(distPath, 'utf8');
    else if (fs.existsSync(ctxPath)) content = fs.readFileSync(ctxPath, 'utf8');
    else if (fs.existsSync(skillPath)) content = fs.readFileSync(skillPath, 'utf8');
  }
  
  if (!content) {
    content = `${a.name} is ${a.desc}. Category: ${a.category || 'Distilled Autonomous Agent'}. Domain: ${a.domain || ''}. Competencies: ${(a.prompts || []).join('; ')}.`;
  }
  
  a.distilled = cleanDistilledText(content);
}

fs.writeFileSync(AGENTS_PATH, JSON.stringify(agents, null, 2));
console.log(`Successfully enriched ${agents.length} agents in agents-full.json with distilled content.`);
