import { byId, loadLesson, neighbours } from '../course.js';
import { store } from '../store.js';
import { esc, pad2, reducedMotion } from '../util.js';
import { questionEl } from './quiz.js';
import { hydratePractice } from '../practice/index.js';

export async function renderLesson(root, id) {
  const meta = byId.get(id);
  if (!meta) { root.innerHTML = `<div class="page"><h1>Lesson not found</h1><p><a href="#/">Go to the course home</a></p></div>`; return 'Not found'; }
  const L = await loadLesson(id); const p = meta.phase; const { prev, next } = neighbours(id);
  const nav = `<nav class="lesson-nav" aria-label="Lesson navigation"><div class="wrap">${prev ? `<a class="btn btn-quiet" href="#/learn/${prev.id}" data-testid="prev">← Back</a>` : '<span></span>'}<a class="btn btn-quiet" href="#/phase/${p.id}">Phase ${pad2(p.number)}</a>${next ? `<a class="btn btn-primary" href="#/learn/${next.id}" data-testid="next">Next →</a>` : '<a class="btn btn-primary" href="#/progress">My progress</a>'}</div></nav>`;
  if (!L) {
    root.innerHTML = `<div class="page"><p class="kicker"><a href="#/phase/${p.id}">Phase ${pad2(p.number)} · ${esc(p.title)}</a></p><h1>${esc(meta.title)}</h1><div class="panel" data-testid="coming-soon"><p><b>Coming soon.</b> This lesson is planned but not written yet. A lesson is published only when it is complete and every fact is checked.</p></div></div>${nav}`;
    return meta.title;
  }
  store.visit(id);
  const done = store.isDone(id);
  root.innerHTML = `<article class="page lesson" data-lesson="${id}">
    <header class="lesson-head"><p class="kicker"><a href="#/phase/${p.id}">Phase ${pad2(p.number)} · ${esc(p.title)}</a></p>
      <h1>${titleHTML(L.title, L.highlight)}</h1><p class="lede-s">${esc(L.summary)}</p>
      <div class="lesson-meta"><span class="chip">Lesson ${id.replace('-', '.')}</span><span class="chip">About ${L.minutes} minutes</span>${done ? '<span class="chip on">Done</span>' : ''}</div>
      <div class="actions"><button class="btn btn-quiet read-btn" type="button" data-read data-testid="read-aloud" aria-pressed="false">🔊 Read this lesson to me</button></div>
    </header>
    <div class="prose">${L.html}</div>
    <section class="complete-card" aria-labelledby="done-h"><h2 id="done-h" style="margin-top:0">Finished this lesson?</h2><p>Tick it off. Your progress stays in this browser only.</p>
      <div class="actions"><button class="btn btn-primary" type="button" data-complete data-testid="complete">${done ? 'Done ✓' : 'Mark this lesson as done'}</button>${next ? `<a class="btn btn-quiet" href="#/learn/${next.id}">Next: ${esc(next.title)}</a>` : ''}</div><p data-done-msg aria-live="polite" style="margin:10px 0 0"></p></section>
  </article>${nav}`;
  const mount = root.querySelector('[data-quiz]');
  if (mount) {
    const form = document.createElement('form'); form.className = 'quiz'; form.dataset.testid = 'lesson-quiz'; form.addEventListener('submit', (e) => e.preventDefault());
    form.append(Object.assign(document.createElement('h2'), { textContent: 'Check yourself' }), Object.assign(document.createElement('p'), { className: 'muted', textContent: 'Three quick questions. Nothing is graded: pick an answer and read why.' }));
    L.quiz.forEach((q, i) => form.append(questionEl(q, i + 1, { onAnswer: (qq, ok) => store.answer(qq.id, ok) })));
    mount.replaceWith(form);
  }
  const btn = root.querySelector('[data-complete]');
  btn.addEventListener('click', () => { store.complete(id); btn.textContent = 'Done ✓'; root.querySelector('[data-done-msg]').textContent = next ? 'Well done. This lesson is ticked off.' : 'Well done. That was the last lesson written so far.'; });
  hydrateSteps(root); hydrateTabs(root); hydratePractice(root); readAloud(root);
  return L.title;
}

// "Read this lesson to me": the browser's own speech (nothing leaves the device), paragraph by paragraph,
// with the paragraph being read highlighted. Press again to stop.
function readAloud(root) {
  const rb = root.querySelector('[data-read]');
  if (!('speechSynthesis' in window)) { rb.disabled = true; rb.textContent = 'Reading aloud is not available in this browser'; return; }
  let on = false, cur = null;
  const stop = () => { on = false; try { speechSynthesis.cancel(); } catch {} cur?.classList.remove('reading'); cur = null; rb.setAttribute('aria-pressed', 'false'); rb.textContent = '🔊 Read this lesson to me'; };
  const chunks = () => [root.querySelector('h1'), root.querySelector('.lede-s'), ...root.querySelectorAll('.prose :is(h2,h3,p,li,.step-text,figcaption)')]
    .filter((el) => el && el.innerText.trim() && !el.closest('.practice, .quiz, [hidden], details:not([open]), .xlink, .try-check') && !el.parentElement.closest('li'));
  rb.addEventListener('click', () => {
    if (on) return stop();
    on = true; rb.setAttribute('aria-pressed', 'true'); rb.textContent = '■ Stop reading';
    const list = chunks(); let i = 0;
    const say = () => {
      cur?.classList.remove('reading'); if (!on || i >= list.length) return stop();
      cur = list[i++]; cur.classList.add('reading'); cur.scrollIntoView({ block: 'center', behavior: reducedMotion() ? 'auto' : 'smooth' });
      const u = new SpeechSynthesisUtterance(cur.innerText.replace(/[→←✓]/g, '')); u.lang = 'en-GB'; u.rate = 0.9;
      u.onend = say; u.onerror = stop; speechSynthesis.speak(u);
    };
    try { speechSynthesis.cancel(); } catch {} say();
  });
  addEventListener('hashchange', stop, { once: true });
}

// Step-through pictures: one step at a time with Back / Next. Without JavaScript every step is visible.
export function hydrateSteps(root) {
  root.querySelectorAll('figure.steps').forEach((fig) => {
    const steps = [...fig.querySelectorAll('.step')]; const nav = fig.querySelector('.steps-nav'); if (!nav || steps.length < 2) return;
    let i = 0; nav.hidden = false; const count = nav.querySelector('.count'), prev = nav.querySelector('[data-prev]'), next = nav.querySelector('[data-next]');
    const show = () => { steps.forEach((s, k) => { s.hidden = k !== i; if (k === i && !reducedMotion()) { s.classList.remove('anim-in'); void s.offsetWidth; s.classList.add('anim-in'); } }); count.textContent = `Step ${i + 1} of ${steps.length}`; prev.disabled = i === 0; next.textContent = i === steps.length - 1 ? 'Start again' : 'Next step'; };
    prev.addEventListener('click', () => { if (i > 0) { i--; show(); } });
    next.addEventListener('click', () => { i = i === steps.length - 1 ? 0 : i + 1; show(); });
    show();
  });
}

// iPhone / Android tabs for "Try it on your phone". Without JavaScript both panels show, one after the other.
export function hydrateTabs(root) {
  root.querySelectorAll('section.try').forEach((sec) => {
    const key = sec.dataset.try; const box = sec.querySelector('[data-try-done]');
    if (box) { box.checked = !!store.get().tries[key]; box.addEventListener('change', () => store.tryDone(key, box.checked)); }
    const list = sec.querySelector('.tabs'); if (!list) return;
    const tabs = [...list.querySelectorAll('.tab')], panels = [...sec.querySelectorAll('.try-panel')];
    list.hidden = false;
    const pick = (n) => { tabs.forEach((t, k) => { t.setAttribute('aria-selected', String(k === n)); t.tabIndex = k === n ? 0 : -1; }); panels.forEach((p, k) => (p.hidden = k !== n)); try { localStorage.setItem('sfs-phone', String(n)); } catch {} };
    tabs.forEach((t, n) => { t.addEventListener('click', () => pick(n)); t.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { const k = (n + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length; pick(k); tabs[k].focus(); } }); });
    let saved = 0; try { saved = Number(localStorage.getItem('sfs-phone')) || 0; } catch {}
    pick(saved < tabs.length ? saved : 0);
  });
}

// One highlighter per surface: wrap the lesson's chosen key word (front matter `highlight`).
function titleHTML(title, word) {
  const t = esc(title); if (!word) return t; const w = esc(word); const i = t.toLowerCase().lastIndexOf(w.toLowerCase());
  return i < 0 ? t : `${t.slice(0, i)}<span class="hl">${t.slice(i, i + w.length)}</span>${t.slice(i + w.length)}`;
}
