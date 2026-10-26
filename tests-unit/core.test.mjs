import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { hash32, shuffledIdx } from '../src/util.js';
import { realName } from '../src/practice/p-link-reader.js';
import { exposed } from '../src/practice/p-domino.js';
import { pick } from '../src/practice/p-passphrase.js';
import { compile } from '../scripts/build-lessons.mjs';
import { unsourced, STAT, ATTR } from '../scripts/check-lessons.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

test('deterministic shuffle: same key, same order; valid permutation; keys differ', () => {
  assert.equal(hash32('abc'), hash32('abc'));
  const a = shuffledIdx(10, 'p01|0'), b = shuffledIdx(10, 'p01|0');
  assert.deepEqual(a, b);
  assert.deepEqual([...a].sort((x, y) => x - y), [...Array(10).keys()]);
  const orders = new Set(Array.from({ length: 20 }, (_, i) => shuffledIdx(10, 'k' + i).join(',')));
  assert.ok(orders.size > 15, 'different keys should usually give different orders');
});

test('practice logic: link reader finds the real website name', () => {
  assert.equal(realName('https://twint.ch.payment-check.info/login'), 'payment-check.info');
  assert.equal(realName('https://go.twint.ch/1/e/tw?tw=x'), 'twint.ch');
  assert.equal(realName('https://mybank.ch.login-help.net/de'), 'login-help.net');
  assert.equal(realName('https://www.mybank.ch/login'), 'mybank.ch');
});
test('practice logic: domino and passphrase', () => {
  assert.equal(exposed(true).length, 4); assert.deepEqual(exposed(false), ['Old shop']);
  let k = 0; const w = pick(5, (n) => (k++ * 7) % n); assert.equal(w.length, 5); assert.ok(w.every((x) => /^[a-z]+$/.test(x)));
});

// --- tokens: contrast ---
function parseBlock(css, selector) {
  const i = css.indexOf(selector + ' {'); assert.ok(i >= 0, 'missing ' + selector); const j = css.indexOf('}', i);
  const out = {}; for (const m of css.slice(i, j).matchAll(/(--[\w-]+):\s*([^;]+);/g)) out[m[1]] = m[2].trim(); return out;
}
const lum = (hex) => { const n = hex.replace('#', ''); const c = [0, 2, 4].map((k) => parseInt(n.slice(k, k + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
test('text contrast is at least 7:1 in both themes (WCAG AAA)', () => {
  const css = read('src/styles/tokens.css');
  const dark = parseBlock(css, ':root'); const day = { ...dark, ...parseBlock(css, '[data-theme="daylight"]') };
  for (const [name, t] of [['dark', dark], ['daylight', day]]) {
    for (const bg of ['--bg', '--surface', '--surface-2']) {
      assert.ok(ratio(t['--fg'], t[bg]) >= 7, `${name} fg on ${bg}: ${ratio(t['--fg'], t[bg]).toFixed(2)}`);
      assert.ok(ratio(t['--muted-strong'], t[bg]) >= 7, `${name} muted-strong on ${bg}: ${ratio(t['--muted-strong'], t[bg]).toFixed(2)}`);
    }
    assert.ok(ratio(t['--on-accent'], t['--accent']) >= 7, `${name} on-accent on accent`);
  }
  assert.ok(ratio(day['--on-danger'] || '#FFFFFF', day['--danger']) >= 7, 'daylight on-danger on danger');
});
test('lime is never used as a text colour on light surfaces, and no MetaMask colours appear', () => {
  const css = read('src/styles/base.css');
  for (const m of css.matchAll(/(^|[;{\s])color:\s*var\(--accent\)/gm)) assert.fail('color: var(--accent) found in base.css: lime text is not allowed');
  const banned = ['#F6851B', '#E2761B', '#037DD6', '#FF5C16'];
  const files = execFileSync('git', ['ls-files', 'src', 'index.html', 'public', 'content', 'lessons'], { cwd: ROOT, encoding: 'utf8' }).split('\n').filter((f) => /\.(js|mjs|css|html|svg|json|md)$/.test(f));
  for (const f of files) { const t = read(f).toUpperCase(); for (const b of banned) assert.ok(!t.includes(b), `${b} found in ${f}`); }
});
test('theme guard passes: no colours or fonts outside tokens.css', () => {
  execFileSync('node', ['scripts/check-tokens.mjs'], { cwd: ROOT, stdio: 'pipe' });
});

test('lesson IDs and titles match the curriculum draft (71 lessons, numbering stable)', (t) => {
  const draft = '/home/box/second-brain/Agents/physic-teacher/outputs/2026-10-26-security-from-scratch-curriculum.md';
  if (!fs.existsSync(draft)) return t.skip('draft not on this machine');
  const d = {}; for (const m of fs.readFileSync(draft, 'utf8').matchAll(/^\s*[-*]\s*\*\*((?:0\d|1[0-2])\.\d{2})\s+(.+?)\*\*/gm)) d[m[1]] ??= m[2].replace(/\.$/, '');
  const c = JSON.parse(read('content/curriculum.json'));
  const mine = Object.fromEntries(c.phases.flatMap((p) => p.lessons.map((l) => [l.id.replace('-', '.'), l.title])));
  assert.equal(Object.keys(mine).length, 71);
  assert.deepEqual(mine, d);
});

test('glossary uses the shared format and every shared term matches the AI Safety glossary', (t) => {
  const g = JSON.parse(read('content/glossary.json'));
  assert.equal(g.version, 1);
  for (const x of g.terms) { assert.ok(x.id && x.term && x.short && Array.isArray(x.sites) && x.sites.includes('security'), x.id); }
  const sib = '/workspace/ai-safety-from-scratch/content/glossary.json';
  if (!fs.existsSync(sib)) return t.skip('sibling glossary not on this machine');
  const s = new Map(JSON.parse(fs.readFileSync(sib, 'utf8')).terms.map((x) => [x.id, x]));
  for (const x of g.terms) if (s.has(x.id)) assert.equal(x.short, s.get(x.id).short, `definition of ${x.id} differs from the AI Safety glossary`);
});

test('robots: noindex,nofollow meta, Disallow: / and the draft banner are present', () => {
  assert.match(read('index.html'), /<meta name="robots" content="noindex, nofollow"/);
  assert.match(read('public/robots.txt'), /User-agent: \*\s+Disallow: \//);
  assert.match(read('index.html'), /data-testid="draft-banner"/);
});

test('the lesson checker flags an unsourced statistic or attributed claim', () => {
  const md = (body) => `---\nid: 00-01\nminutes: 5\nsummary: x\n---\n\n${body}\n`;
  const L1 = compile(md('In 2025, 29,006 reports were made.'), 't1');
  assert.equal(unsourced(L1.blocks).length, 1);
  const L2 = compile(md('The FTC says scammers love gift cards.'), 't2');
  assert.equal(unsourced(L2.blocks).length, 1);
  const L3 = compile(md('In 2025, 29,006 reports were made ([BACS](https://www.bacs.admin.ch/de/hjb-25-2-de)).'), 't3');
  assert.equal(unsourced(L3.blocks).length, 0);
  assert.ok(STAT.test('$7.7 billion') && STAT.test('52%') && STAT.test('CHF 250') && !STAT.test('call 117'));
  assert.ok(ATTR.test('Swiss police warn that') && ATTR.test('according to the bank'));
});

test('every source used is verified, and every lesson cites only verified sources', () => {
  const s = JSON.parse(read('content/sources.json'));
  for (const x of s.sources) { assert.equal(x.verified, true, x.url); assert.ok(x.checked && x.evidence, x.url); }
  execFileSync('node', ['scripts/check-lessons.mjs'], { cwd: ROOT, stdio: 'pipe' });
});

// "XP" reads like a crypto token. Progress is shown only as lessons completed.
test('no "XP" anywhere visible to users', () => {
  const hits = [];
  const walk = (dir, exts) => { if (!fs.existsSync(path.join(ROOT, dir))) return [];
    return fs.readdirSync(path.join(ROOT, dir), { recursive: true }).map(String).filter((f) => exts.some((x) => f.endsWith(x))).map((f) => path.join(dir, f)); };
  const plain = [...walk('dist', ['.html', '.json', '.txt']), ...walk('src/generated', ['.json']), ...walk('content', ['.json']), ...walk('lessons', ['.md']), ...walk('src', ['.js']), 'README.md', 'index.html'];
  for (const f of plain) if (fs.existsSync(path.join(ROOT, f))) { const m = read(f).match(/\bXP\b/i); if (m) hits.push(`${f}: …${read(f).slice(Math.max(0, m.index - 30), m.index + 10)}…`); }
  for (const f of walk('dist', ['.js'])) { const m = read(f).match(/[\s>"'`]XP(?=[\s<`'".,!])/i); if (m) hits.push(`${f}: …${read(f).slice(Math.max(0, m.index - 30), m.index + 10)}…`); }
  assert.deepEqual(hits, [], 'progress is shown as lessons completed, never as XP');
});
