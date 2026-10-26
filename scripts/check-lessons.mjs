// Lesson checker. Fails the build if a written lesson breaks the course rules.
// Per lesson: front matter; >= 3 quiz questions with valid answers and kind explanations; a hands-on part
// (exercise or practice); at least one figure; a "Remember" box; a "## Sources" section with links; every
// external link listed (and marked verified) in content/sources.json; phone steps in "Try it" tabs checked
// against official Apple / Google support pages; and an UNSOURCED-FACT scan: any paragraph with a statistic,
// an amount or a claim attributed to an organisation must carry its own link (or introduce a :::source quote).
// Per phase (when fully written): >= 10 questions in the bank so the phase check can draw 10.
import fs from 'node:fs';
import path from 'node:path';
import { compile } from './build-lessons.mjs';
import { practices } from '../src/practice/meta.js';
import { AI_SAFETY_URL } from '../src/config.js';

const ROOT = path.resolve(import.meta.dirname, '..');
const curriculum = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/curriculum.json'), 'utf8'));
const sources = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/sources.json'), 'utf8')).sources;
export const norm = (u) => { try { const x = new URL(u); return (x.hostname.replace(/^www\./, '') + x.pathname).replace(/\/$/, '') + (x.hostname.startsWith('support.google') && x.searchParams.get('co') ? '?' + x.searchParams.get('co') : ''); } catch { return u; } };
const known = new Map(sources.map((s) => [norm(s.url), s]));
// Statistics, money amounts, and "Organisation says/warns/reports…" claims.
export const STAT = /\b\d{1,3}(?:[,'’]\d{3})+\b|\b\d+(?:\.\d+)?\s?(?:%|percent|per cent|billion|million)\b|[$€£]\s?\d|\bCHF\s?\d/i;
export const ATTR = /\b(FBI|FTC|FCC|IC3|BACS|NCSC|CISA|TWINT|Europol|Interpol|Swiss police|police|Apple|Google|Have I Been Pwned|European Commission)\b[^.!?]{0,80}?\b(says?|said|warns?|reports?|recommends?|explains?|advises?|states?|lists?|describes?|counts?)\b|\baccording to\b/i;
const LINK = /\]\(https?:\/\/|https?:\/\//;
export function unsourced(blocks) {
  const out = [];
  blocks.forEach((b, bi) => {
    if (b.kind !== 'prose' && b.kind !== 'remember') return;
    const paras = b.text.split(/\n\s*\n|\n(?=\s*(?:[-*]|\d+\.)\s)/).map((p) => p.trim()).filter((p) => p && !p.startsWith('#'));
    paras.forEach((p, pi) => {
      const plain = p.replace(/\[\[term:[^\]]+\]\]/g, 'term');
      if (!(STAT.test(plain) || ATTR.test(plain))) return;
      if (LINK.test(p)) return;
      const introducesQuote = pi === paras.length - 1 && blocks[bi + 1]?.kind === 'source';
      if (introducesQuote) return;
      out.push(p.slice(0, 110).replace(/\s+/g, ' '));
    });
  });
  return out;
}

const problems = []; const warn = []; let n = 0, flags = 0, words = 0;
const written = new Set();
for (const dir of fs.readdirSync(path.join(ROOT, 'lessons')).sort()) {
  for (const f of fs.readdirSync(path.join(ROOT, 'lessons', dir)).filter((x) => x.endsWith('.md')).sort()) {
    const file = `lessons/${dir}/${f}`; const src = fs.readFileSync(path.join(ROOT, file), 'utf8');
    let L; try { L = compile(src, file); } catch (e) { problems.push(`${file}: ${e.message}`); continue; }
    n++; written.add(L.id); flags += L.flags;
    const P = (m) => problems.push(`${file}: ${m}`);
    if (!/^\d\d-\d\d$/.test(L.id) || !f.startsWith(L.id)) P(`id ${L.id} does not match file name`);
    if (!L.minutes || !L.summary) P('front matter needs minutes and summary');
    if (L.minutes > 12) P('lessons should take 5 to 10 minutes');
    if (L.quiz.length < 3) P(`only ${L.quiz.length} quiz questions (need 3)`);
    L.quiz.forEach((q) => { if (!(q.answer >= 0 && q.answer < q.options.length)) P(`${q.id}: answer index out of range`); if (!q.explain) P(`${q.id}: missing explanation`); if (q.options.length < 2) P(`${q.id}: needs 2+ options`); });
    if (L.used.exercises + L.used.practice.length < 1) P('needs a hands-on part (exercise or practice)');
    if (L.used.figures.length < 1) P('needs at least one figure (SVG diagram or step-through)');
    if (L.used.remember < 1) P('needs a :::remember box');
    L.used.practice.forEach((p) => { if (!practices[p]?.ready) P(`practice ${p} is not implemented yet`); });
    for (const t of L.used.tries) for (const tab of t.tabs) {
      if (/iphone|ipad/i.test(tab.name) && !tab.links.some((u) => /^https:\/\/support\.apple\.com\//.test(u))) P(`${t.key} "${tab.name}": phone steps need a "Checked against:" link to support.apple.com`);
      if (/android/i.test(tab.name) && !tab.links.some((u) => /^https:\/\/(support\.google\.com|www\.android\.com)\//.test(u))) P(`${t.key} "${tab.name}": phone steps need a "Checked against:" link to support.google.com`);
    }
    const srcSec = src.split(/^## Sources/m)[1];
    if (!srcSec || !/https?:\/\//.test(srcSec)) P('needs a "## Sources" section with links');
    for (const u of L.links) {
      if (u.startsWith(AI_SAFETY_URL)) continue;
      const s = known.get(norm(u));
      if (!s) P(`link not in content/sources.json (fetch and verify it first): ${u}`);
      else if (!s.verified) P(`source not marked verified: ${u}`);
    }
    for (const p of unsourced(L.blocks)) P(`UNSOURCED FACT (add a link in the same paragraph): "${p}…"`);
    const w = src.replace(/^---[\s\S]*?---/, '').replace(/:::quiz[\s\S]*?:::end/g, '').split(/\s+/).length; words += w;
    if (w < 350) P(`only ${w} words; lessons must be complete, not outlines`);
  }
}
for (const p of curriculum.phases) {
  const ids = p.lessons.map((l) => l.id); const done = ids.filter((i) => written.has(i));
  if (done.length && done.length === ids.length) {
    const bank = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/generated', `quiz-${p.id}.json`), 'utf8'));
    const q = Object.values(bank).flat().length; if (q < 10) problems.push(`${p.id}: bank has ${q} questions, phase check needs 10`);
  } else if (done.length) warn.push(`${p.id}: ${done.length}/${ids.length} lessons written`);
}
const unverified = sources.filter((s) => !s.verified);
if (unverified.length) warn.push(`${unverified.length} source(s) in sources.json not yet verified (cannot be used in lessons)`);
if (warn.length) console.log(warn.join('\n'));
if (problems.length) { console.error(`\n${problems.length} problem(s):\n` + problems.join('\n')); process.exit(1); }
console.log(`check ok: ${n} lessons, ${words} words, ${flags} NEEDS SOURCED DATA flag(s)`);
