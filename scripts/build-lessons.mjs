// Compile lessons/pNN/*.md into src/generated/lessons/<id>.json, quiz banks and an index.
// Custom blocks (each closed by :::end unless noted):
//   :::figure <name>             build-time SVG from src/visuals/registry.js, caption = body, text version baked in
//   :::story <Title>             a made-up (composite) story, always labelled as made up
//   :::remember                  "The one thing to remember" highlighter box
//   :::source url="" by="" date="" checked=""   a quoted, linked fact; body = the quote
//   :::callout <note|warn> Title
//   :::try <Title>               "Try it on your own phone": sections "--- iPhone", "--- Android", "--- Any phone"
//   :::helper                    "For family helpers" box
//   :::practice <name> [k=v]     single line; calm simulation hydrated by src/practice/index.js (text fallback baked in)
//   :::exercise <Title> ... :::solution ... :::end
//   :::quiz                      YAML list: q, options, answer, explain, why?
//   :::xlink                     lines "ai 03-02 | Title" (AI Safety from Scratch) or "lesson 02-01 | Title"
// Inline: [[NEEDS SOURCED DATA]] -> visible flag; [[term:id]] or [[term:id|label]] -> Word Box link.
import fs from 'node:fs';
import path from 'node:path';
import { marked } from 'marked';
import * as yaml from 'js-yaml';
import { visuals, renderVisual } from '../src/visuals/registry.js';
import { practices } from '../src/practice/meta.js';
import { aiLesson } from '../src/config.js';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = path.join(ROOT, 'src/generated');
const curriculum = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/curriculum.json'), 'utf8'));
const glossary = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/glossary.json'), 'utf8'));
const gl = new Map(glossary.terms.map((t) => [t.id, t]));
const titles = new Map(curriculum.phases.flatMap((p) => p.lessons.map((l) => [l.id, { ...l, phase: p.id }])));
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const attrs = (s) => Object.fromEntries([...String(s || '').matchAll(/(\w+)=("([^"]*)"|\S+)/g)].map((m) => [m[1], m[3] ?? m[2]]));
const slug = (s) => s.toLowerCase().replace(/<[^>]+>/g, '').replace(/&[a-z#0-9]+;/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const errors = [];

function inline(md) {
  return md
    .replace(/\[\[NEEDS SOURCED DATA\]\]/g, '<span class="flag">NEEDS SOURCED DATA</span>')
    .replace(/\[\[term:([a-z0-9-]+)(?:\|([^\]]+))?\]\]/g, (_, id, label) => {
      const t = gl.get(id); if (!t) { errors.push(`unknown glossary term ${id}`); return label || id; }
      if (!t.sites?.includes('security')) errors.push(`glossary term ${id} is not marked for site "security"`);
      return `<a class="term" href="#/glossary#${id}" title="${esc(t.short)}">${esc(label || t.term)}</a>`;
    });
}
const md = (s) => marked.parse(inline(s));

export function compile(src, file) {
  const fm = src.match(/^---\n([\s\S]*?)\n---\n/); if (!fm) throw new Error(`${file}: missing front matter`);
  const meta = yaml.load(fm[1]); const body = src.slice(fm[0].length);
  const lines = body.split('\n'); const html = []; let buf = []; const quiz = [];
  const used = { figures: [], practice: [], practiceArgs: [], stories: 0, sources: 0, exercises: 0, tries: [], helpers: 0, remember: 0 };
  const blocks = []; // raw text of fact-bearing prose, for the checker
  const flush = () => { if (buf.length) { html.push(md(buf.join('\n'))); blocks.push({ kind: 'prose', text: buf.join('\n') }); buf = []; } };
  const take = (i) => { const out = []; while (i < lines.length && !/^:::end\s*$/.test(lines[i])) out.push(lines[i++]); if (i >= lines.length) errors.push(`${file}: unclosed block`); return [out, i]; };
  let tryN = 0;
  for (let i = 0; i < lines.length; i++) {
    const L = lines[i]; const m = L.match(/^:::(\w+)\s*(.*)$/);
    if (!m || m[1] === 'end' || m[1] === 'solution') { buf.push(L); continue; }
    flush(); const [kind, rest] = [m[1], m[2].trim()];
    if (kind === 'practice') {
      const [name, ...a] = rest.split(/\s+/); const p = practices[name]; used.practice.push(name); (used.practiceArgs ||= []).push({ name, args: attrs(a.join(' ')) });
      if (!p) { errors.push(`${file}: unknown practice ${name}`); continue; }
      html.push(`<section class="practice-mount" data-practice="${esc(name)}" data-args="${esc(JSON.stringify(attrs(a.join(' '))))}"><div class="practice"><div class="practice-head"><span class="pill">Practice</span><h3>${esc(p.title)}</h3><p>${esc(p.blurb)}</p></div><div class="practice-body"><p class="muted">Loading the practice… If it does not load, here is what it does: ${esc(p.text)}</p></div></div></section>`);
      continue;
    }
    let block; [block, i] = take(i + 1); const text = block.join('\n');
    if (kind === 'figure') {
      used.figures.push(rest);
      if (!visuals[rest]) { errors.push(`${file}: unknown figure ${rest}`); continue; }
      html.push(renderVisual(rest, text.trim() ? marked.parseInline(inline(text.trim())) : ''));
    } else if (kind === 'story') {
      used.stories++;
      html.push(`<aside class="story" aria-label="A made-up story"><span class="label">A made-up story. It follows a pattern that police and consumer agencies describe.</span>${rest ? `<h3>${esc(rest)}</h3>` : ''}${md(text)}</aside>`);
    } else if (kind === 'remember') {
      used.remember++; blocks.push({ kind: 'remember', text });
      html.push(`<div class="remember" role="note"><span class="label">The one thing to remember</span>${md(text)}</div>`);
    } else if (kind === 'source') {
      used.sources++; const a = attrs(rest); if (!a.url) errors.push(`${file}: source without url`);
      blocks.push({ kind: 'source', text, url: a.url });
      html.push(`<blockquote class="source"><q>${marked.parseInline(inline(text.trim()))}</q><cite>${esc(a.by || '')}${a.date ? `, ${esc(a.date)}` : ''}. <a href="${esc(a.url)}" rel="noopener" target="_blank">Read the source</a>${a.checked ? ` · checked ${esc(a.checked)}` : ''}</cite></blockquote>`);
    } else if (kind === 'callout') {
      const [k, ...t] = rest.split(/\s+/); blocks.push({ kind: 'prose', text });
      html.push(`<div class="callout ${esc(k)}">${t.length ? `<span class="callout-title">${esc(t.join(' '))}</span>` : ''}${md(text)}</div>`);
    } else if (kind === 'helper') {
      used.helpers++; blocks.push({ kind: 'prose', text });
      html.push(`<aside class="helper" aria-label="For family helpers"><h3>For family helpers</h3>${md(text)}</aside>`);
    } else if (kind === 'try') {
      tryN++; const key = `${meta.id}-t${tryN}`;
      const parts = text.split(/^---\s+(.+)$/m); const intro = parts[0]; const tabs = [];
      for (let k = 1; k < parts.length; k += 2) tabs.push({ name: parts[k].trim(), body: parts[k + 1] || '' });
      used.tries.push({ key, tabs: tabs.map((t) => ({ name: t.name, links: [...t.body.matchAll(/https?:\/\/[^\s)"'<>\]]+/g)].map((x) => x[0]) })) });
      const tid = (n) => `${key}-${slug(n)}`;
      html.push(`<section class="try" data-try="${esc(key)}" aria-labelledby="${key}-h"><h3 id="${key}-h">Try it on your own phone: ${esc(rest)}</h3>${md(intro)}
        ${tabs.length > 1 ? `<div class="tabs" role="tablist" aria-label="Choose your phone" hidden>${tabs.map((t, n) => `<button class="tab" type="button" role="tab" id="${tid(t.name)}-tab" aria-controls="${tid(t.name)}" aria-selected="${n === 0}" data-tab="${n}">${esc(t.name)}</button>`).join('')}</div>` : ''}
        ${tabs.map((t) => `<div class="try-panel" role="tabpanel" id="${tid(t.name)}" aria-labelledby="${tid(t.name)}-tab"><h4>${esc(t.name)}</h4>${md(t.body).replace(/<p>Checked against:/g, '<p class="try-check">Checked against:')}</div>`).join('')}
        <label class="check"><input type="checkbox" data-try-done="${esc(key)}"> Done! I tried this on my phone.</label></section>`);
    } else if (kind === 'exercise') {
      used.exercises++; const [task, sol = ''] = text.split(/^:::solution\s*$/m);
      if (!sol.trim()) errors.push(`${file}: exercise without solution`);
      html.push(`<div class="exercise"><h3>Practice on paper: ${esc(rest)}</h3>${md(task)}<details><summary>Show an example answer</summary>${md(sol)}</details></div>`);
    } else if (kind === 'quiz') {
      const safe = text.replace(/^(\s*-?\s*(?:q|explain):\s)(?!["'])(.*)$/gm, (_, k, v) => k + JSON.stringify(v));
      const qs = yaml.load(safe) || [];
      qs.forEach((q, n) => quiz.push({ id: `${meta.id}-q${n + 1}`, q: q.q, options: q.options.map(String), answer: q.answer, explain: q.explain, why: q.why || null }));
      html.push('<div class="quiz-mount" data-quiz></div>');
    } else if (kind === 'xlink') {
      const items = block.filter((x) => x.trim()).map((x) => { const [ref, title] = x.split('|').map((s) => s.trim()); const [site, id] = ref.split(/\s+/);
        if (site === 'ai') return `<a href="${esc(aiLesson(id))}" rel="noopener" target="_blank" data-xlink="ai"><span><span class="xl-label">AI Safety from Scratch ${esc(id.replace('-', '.'))}:</span> ${esc(title)}</span></a>`;
        if (!titles.has(id)) errors.push(`${file}: xlink to unknown lesson ${id}`);
        return `<a href="#/learn/${esc(id)}" data-xlink="lesson"><span><span class="xl-label">Lesson ${esc(id.replace('-', '.'))}:</span> ${esc(title || titles.get(id)?.title)}</span></a>`; });
      html.push(`<nav class="xlink" aria-label="Related lessons">${items.join('')}</nav>`);
    } else errors.push(`${file}: unknown block ${kind}`);
  }
  flush();
  let out = html.join('\n'); const toc = [];
  out = out.replace(/<h2>(.*?)<\/h2>/g, (_, t) => { const id = slug(t); toc.push({ id, t: t.replace(/<[^>]+>/g, '') }); return `<h2 id="${id}">${t}</h2>`; });
  out = out.replace(/<a href="(https?:[^"]+)"(?![^>]*target)/g, '<a href="$1" rel="noopener" target="_blank"');
  const links = [...new Set([...body.matchAll(/https?:\/\/[^\s)"'<>\]]+/g)].map((x) => x[0].replace(/[.,;]+$/, '')))];
  return { id: meta.id, minutes: meta.minutes, summary: meta.summary, highlight: meta.highlight || '', html: out, toc, quiz, used, links, blocks, flags: (body.match(/\[\[NEEDS SOURCED DATA\]\]/g) || []).length };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(path.join(OUT, 'lessons'), { recursive: true });
  const index = {}; const banks = {};
  for (const dir of fs.readdirSync(path.join(ROOT, 'lessons')).sort()) {
    for (const f of fs.readdirSync(path.join(ROOT, 'lessons', dir)).filter((x) => x.endsWith('.md')).sort()) {
      const file = `lessons/${dir}/${f}`; const L = compile(fs.readFileSync(path.join(ROOT, file), 'utf8'), file);
      const t = titles.get(L.id); if (!t) { errors.push(`${file}: id ${L.id} not in curriculum`); continue; }
      const { blocks, ...pub } = L;
      fs.writeFileSync(path.join(OUT, 'lessons', `${L.id}.json`), JSON.stringify({ ...pub, title: t.title }));
      index[L.id] = { minutes: L.minutes, summary: L.summary, practice: L.used.practiceArgs };
      (banks[t.phase] ||= {})[L.id] = L.quiz;
    }
  }
  for (const [pid, b] of Object.entries(banks)) fs.writeFileSync(path.join(OUT, `quiz-${pid}.json`), JSON.stringify(b));
  fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify(index));
  if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
  console.log(`built ${Object.keys(index).length} lessons`);
}
