// Practice page: every exercise embedded inline, each in its own section with an anchor (#practice-01-02),
// mounted lazily when it scrolls near the screen. A jump list at the top links to each section.
import { allLessons, lessonIndex } from '../course.js';
import { practices } from '../practice/meta.js';
import { mountPractice } from '../practice/index.js';
import { esc } from '../util.js';

export function entries() {
  return allLessons.flatMap((l) => (lessonIndex[l.id]?.practice || []).map((p, k, arr) => ({ lesson: l, ...p, anchor: `practice-${l.id}` + (arr.length > 1 && k > 0 ? `-${k + 1}` : '') })));
}
export function renderPractice(root, anchor) {
  const list = entries();
  root.innerHTML = `<div class="page"><h1>Practice</h1><p>Every practice exercise in the course, ready to play right here. They are calm simulations: no clock, nothing real is called, sent or opened. Each one also appears inside its lesson.</p>
    <nav class="jump" aria-label="Jump to a practice exercise" data-testid="practice-jump"><h2 style="font-size:1.2rem">Jump to</h2><ol>${list.map((e) => `<li><a href="#${e.anchor}" data-jump="${e.anchor}">${esc(e.lesson.id.replace('-', '.'))} · ${esc(practices[e.name]?.title || e.name)}</a></li>`).join('')}</ol></nav>
    ${list.map((e) => `<section class="practice-section" id="${e.anchor}" data-testid="${e.anchor}" aria-labelledby="${e.anchor}-h"><h2 id="${e.anchor}-h">${esc(practices[e.name]?.title || e.name)}</h2><p class="kicker">From lesson <a href="#/learn/${e.lesson.id}">${esc(e.lesson.id.replace('-', '.'))} · ${esc(e.lesson.title)}</a></p><div class="practice-slot" data-mounted="0"><p class="muted">${esc(practices[e.name]?.text || '')}</p></div></section>`).join('')}
    ${list.length ? '' : '<p>No practice exercises are ready yet.</p>'}</div>`;
  const byAnchor = new Map(list.map((e) => [e.anchor, e]));
  const mount = (sec) => { const slot = sec.querySelector('.practice-slot'); if (slot.dataset.mounted === '1') return; slot.dataset.mounted = '1'; const e = byAnchor.get(sec.id); mountPractice(slot, e.name, e.args || {}); };
  const secs = [...root.querySelectorAll('.practice-section')];
  if (typeof IntersectionObserver === 'function') { const io = new IntersectionObserver((xs) => xs.forEach((x) => { if (x.isIntersecting) { mount(x.target); io.unobserve(x.target); } }), { rootMargin: '200px 0px' }); secs.forEach((s) => io.observe(s)); }
  else secs.forEach(mount);
  const go = (id, smooth) => { const sec = document.getElementById(id); if (!sec) return; mount(sec); sec.scrollIntoView({ block: 'start', behavior: smooth && !matchMedia('(prefers-reduced-motion: reduce)').matches ? 'smooth' : 'auto' }); sec.querySelector('h2')?.focus?.(); };
  root.querySelectorAll('[data-jump]').forEach((a) => a.addEventListener('click', (ev) => { ev.preventDefault(); history.replaceState(null, '', `#/practice#${a.dataset.jump}`); go(a.dataset.jump, true); }));
  if (anchor) requestAnimationFrame(() => go(anchor, false));
  return 'Practice';
}
