// Phase overview, phase check, progress, certificates, verify, Word Box (glossary) and About.
import { phases, phaseById, isWritten, phaseWritten, phaseComplete, loadQuizBank, allLessons, course } from '../course.js';
import { store } from '../store.js';
import { esc, pad2, download, fmtDate, rng, hash32, h } from '../util.js';
import { PASS, TEST_N, AI_SAFETY_URL, LAST_CHECKED } from '../config.js';
import { questionEl } from './quiz.js';
import { CREDENTIALS, DISCLAIMER, certCode, drawCert, pdfFromCanvas, cleanCode, normName } from '../cert.js';
import { phaseMap, meter } from './map.js';
import glossary from '../../content/glossary.json';
import sources from '../../content/sources.json';

const nf = (root, what) => { root.innerHTML = `<div class="page"><h1>${what} not found</h1><p><a href="#/">Go to the course home</a></p></div>`; return what; };
const verifyUrl = () => location.href.split('#')[0] + '#/verify';
const certPhases = (key) => CREDENTIALS[key].phases().map((id) => phaseById.get(id));
const lower = (t) => t.charAt(0).toLowerCase() + t.slice(1);

export function renderPhase(root, pid) {
  const p = phaseById.get(pid); if (!p) return nf(root, 'Phase');
  const t = store.get().tests[pid]; const ready = phaseComplete(p); const w = phaseWritten(p);
  root.innerHTML = `<div class="page"><header><p class="kicker"><a href="#/">Course</a> · Phase ${pad2(p.number)} of ${pad2(phases.length - 1)}</p><h1>${esc(p.title)}</h1><p class="lede-s">After this phase you can ${esc(lower(p.tagline))}</p>
    <div class="lesson-meta"><span class="chip">${p.lessons.length} lessons</span><span class="chip">${w} ready</span>${p.track === 'optional' ? '<span class="chip">Optional</span>' : ''}</div></header>
    ${p.track === 'optional' ? '<p class="callout"><b>Disclosure:</b> Francesco Andreoli, who made this course, works at MetaMask. This phase is wallet-neutral and is not an official MetaMask or Consensys product.</p>' : ''}
    <section aria-labelledby="l-h"><h2 id="l-h">Lessons</h2><ol class="lessons">${p.lessons.map((l) => `<li class="${store.isDone(l.id) ? 'done' : ''}"><a href="#/learn/${l.id}"><span class="n">${store.isDone(l.id) ? '✓' : pad2(l.n)}</span><span>${esc(l.title)}<small>${store.isDone(l.id) ? 'Done' : isWritten(l.id) ? 'Ready' : ''}</small></span><span aria-hidden="true">→</span></a></li>`).join('')}</ol></section>
    <section class="panel" aria-labelledby="t-h"><h2 id="t-h">Phase check</h2>${ready ? `<p>${TEST_N} questions from this phase. Get ${Math.ceil(TEST_N * PASS)} right to pass. There is no clock, and you can try as many times as you like.${t ? ` Best so far: ${Math.round(t.best * TEST_N)} of ${TEST_N}.` : ''}</p><div class="actions"><a class="btn btn-primary" href="#/test/${p.id}" data-testid="start-test">${t?.passed ? 'Take the check again' : 'Take the phase check'}</a></div>` : `<p>The check opens when every lesson in this phase is ready (${w} of ${p.lessons.length} so far).</p>`}</section></div>`;
  return p.title;
}

export async function renderTest(root, pid) {
  const p = phaseById.get(pid); if (!p) return nf(root, 'Phase');
  if (!phaseComplete(p)) { root.innerHTML = `<div class="page"><h1>Phase ${pad2(p.number)} check</h1><p>This check opens when every lesson in the phase is ready. <a href="#/phase/${p.id}">Back to the phase</a></p></div>`; return 'Check not open yet'; }
  const bank = await loadQuizBank(pid);
  const all = p.lessons.flatMap((l) => (bank[l.id] || []).map((q) => ({ ...q, lesson: l })));
  const attempts = store.get().tests[pid]?.attempts || 0;
  const r = rng(hash32(`${pid}|${attempts}`)); const pool = [...all];
  for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
  const qs = pool.slice(0, Math.min(TEST_N, pool.length)); const need = Math.ceil(qs.length * PASS);
  root.innerHTML = `<div class="page"><header><p class="kicker"><a href="#/phase/${p.id}">Phase ${pad2(p.number)} · ${esc(p.title)}</a></p><h1>Phase check</h1><p>${qs.length} questions. Get ${need} right to pass. Take your time: there is no clock. If you don’t pass, you can simply try again with different questions.</p></header>
    <div class="test-progress" aria-live="polite"><span data-answered>0 of ${qs.length} answered</span><span>Pass: ${need}</span></div>
    <form class="quiz" data-testid="phase-test" novalidate></form>
    <div class="actions"><button class="btn btn-primary" type="button" data-testid="submit-test">Check my answers</button></div><div data-out aria-live="polite"></div></div>`;
  const form = root.querySelector('form'); form.addEventListener('submit', (e) => e.preventDefault());
  const els = qs.map((q, i) => { const e = questionEl(q, i + 1, { instant: false }); e.append(h('p', { class: 'q-src', html: `From the lesson <a href="#/learn/${q.lesson.id}">${esc(q.lesson.title)}</a>` })); form.append(e); return e; });
  const counter = root.querySelector('[data-answered]');
  form.addEventListener('input', () => (counter.textContent = `${els.filter((e) => e.answered()).length} of ${qs.length} answered`));
  const submit = root.querySelector('[data-testid=submit-test]'); let armed = false;
  submit.addEventListener('click', () => {
    const missing = els.filter((e) => !e.answered()).length;
    if (missing && !armed) { armed = true; submit.textContent = `${missing} not answered yet. Check anyway?`; return; }
    submit.disabled = true; submit.textContent = 'Checked';
    els.forEach((e) => { e.reveal(); e.querySelectorAll('input').forEach((i) => (i.disabled = true)); });
    const score = els.filter((e) => e.correct()).length; const pass = score / qs.length >= PASS;
    store.testResult(pid, score, qs.length);
    const core = certPhases('core').every((x) => store.get().tests[x.id]?.passed);
    const helper = certPhases('helper').every((x) => store.get().tests[x.id]?.passed);
    const out = root.querySelector('[data-out]');
    out.innerHTML = `<div class="complete-card" data-testid="test-result" data-pass="${pass}"><h2 style="margin-top:0">${pass ? 'Passed' : 'Not passed yet'}: ${score} of ${qs.length}</h2><p>${pass ? `Well done. Phase ${pad2(p.number)} is passed. ${core ? 'Every core phase is passed: your certificate is ready.' : helper ? 'Your Family helper certificate is ready.' : ''}` : `You need ${need}. That’s fine: read the explanations above, look at the linked lessons if you like, then try again. You will get different questions.`}</p>
      <div class="actions">${core ? '<a class="btn btn-primary" href="#/certificate/core">Get your certificate</a>' : helper && pass ? '<a class="btn btn-primary" href="#/certificate/helper">Get your Family helper certificate</a>' : ''}<a class="btn btn-quiet" href="#/test/${p.id}?a=${attempts + 1}" data-testid="retake">Try again with new questions</a><a class="btn btn-quiet" href="#/progress">My progress</a></div></div>`;
    out.scrollIntoView({ block: 'center' });
  });
  return `Phase ${pad2(p.number)} check`;
}

export function renderProgress(root) {
  const s = store.get(); const done = Object.keys(s.lessons).length;
  const core = certPhases('core'); const passed = core.filter((p) => s.tests[p.id]?.passed).length;
  const tries = Object.keys(s.tries).length, prac = Object.keys(s.practice).length;
  const cert = (k) => { const ok = certPhases(k).every((p) => s.tests[p.id]?.passed); return `<a class="btn btn-quiet btn-small" href="#/certificate/${k}">${esc(CREDENTIALS[k].title)}${ok ? '' : ' (not yet)'}</a>`; };
  root.innerHTML = `<div class="page"><header><h1>My progress</h1><p>Everything here is saved only in this browser. There is no account, and nothing is sent anywhere. You can save a backup below.</p></header>
    ${meter()}
    <dl class="stat-grid" data-testid="dashboard" style="margin-top:16px">
      <div class="stat"><dt>Lessons completed</dt><dd data-testid="lessons-done">${done} <small>of ${allLessons.length}</small></dd></div>
      <div class="stat"><dt>Phase checks passed</dt><dd>${passed} <small>of ${core.length}</small></dd></div>
      <div class="stat"><dt>Tried on my phone</dt><dd>${tries} <small>steps</small></dd></div>
      <div class="stat"><dt>Practice exercises tried</dt><dd>${prac}</dd></div>
    </dl>
    <section class="panel"><h2>Certificates</h2><p><b>Core course:</b> pass the checks for phases 00 to 11. <b>Family helper:</b> pass phases 00, 01 and 11. <b>Wallet basics:</b> pass the optional Phase 12.</p><p class="muted">${esc(DISCLAIMER)}</p><div class="actions">${cert('core')}${cert('helper')}${cert('wallet')}<a class="btn btn-quiet btn-small" href="#/verify">Check a certificate</a></div></section>
    <section><h2>Phase map</h2>${phaseMap()}</section>
    <section class="panel"><h2>Backup</h2><p>Moving to a new phone or computer? Save your progress as a file, then open it there.</p><div class="actions"><button class="btn btn-quiet btn-small" type="button" data-export>Save progress as a file</button><label class="btn btn-quiet btn-small">Open a progress file<input type="file" accept="application/json" data-import class="sr"></label><button class="btn btn-quiet btn-small" type="button" data-reset>Erase all progress</button></div><p data-msg aria-live="polite"></p></section></div>`;
  root.querySelector('[data-export]').addEventListener('click', () => download(`security-from-scratch-progress-${store.today()}.json`, new Blob([JSON.stringify(store.get(), null, 2)], { type: 'application/json' })));
  root.querySelector('[data-import]').addEventListener('change', async (e) => { const f = e.target.files[0]; if (!f) return; try { const j = JSON.parse(await f.text()); if (!j || typeof j.lessons !== 'object') throw 0; store.replace(j); renderProgress(root); } catch { root.querySelector('[data-msg]').textContent = 'That file is not a progress file from this site.'; } });
  let armed = false; const rb = root.querySelector('[data-reset]');
  rb.addEventListener('click', () => { if (!armed) { armed = true; rb.textContent = 'Yes, erase everything'; root.querySelector('[data-msg]').textContent = 'Are you sure? Press “Yes, erase everything” to confirm, or leave this page to keep your progress.'; return; } store.reset(); renderProgress(root); });
  return 'My progress';
}

export async function renderCert(root, key) {
  const c = CREDENTIALS[key]; const s = store.get(); const ph = certPhases(key).filter(Boolean);
  const passed = ph.length > 0 && ph.every((p) => s.tests[p.id]?.passed); const title = `${c.title} certificate`;
  if (!passed) { const n = ph.filter((p) => s.tests[p.id]?.passed).length; root.innerHTML = `<div class="page"><h1>${esc(title)}</h1><p data-testid="cert-locked">Not ready yet. Pass the phase checks for ${esc(lower(c.what.split(':')[0]))} to get it (${n} of ${ph.length} passed so far).</p><p class="muted">${esc(DISCLAIMER)}</p><div class="actions"><a class="btn btn-primary" href="#/progress">My progress</a></div></div>`; return title; }
  const date = ph.map((p) => s.tests[p.id].date).sort().pop();
  root.innerHTML = `<div class="page"><h1>${esc(title)}</h1><p>Type your name as you want it printed. The certificate is made in your browser. Nothing is uploaded.</p><p class="muted">${esc(DISCLAIMER)}</p>
    <div class="panel"><label class="field">Name on the certificate<input type="text" maxlength="80" autocomplete="name" value="${esc(s.name)}" data-testid="cert-name"></label>
    <div class="actions"><button class="btn btn-primary" type="button" data-png data-testid="cert-png">Download as a picture (PNG)</button><button class="btn btn-quiet" type="button" data-pdf data-testid="cert-pdf">Download as a PDF</button></div>
    <p>Check code: <b class="mono" data-testid="cert-code" translate="no">…</b>. Anyone can check it on <a href="#/verify">the check page</a> with your name and the date.</p>
    <div class="cert-preview"><canvas data-testid="cert-canvas" role="img" aria-label="Certificate preview"></canvas></div></div></div>`;
  const cv = root.querySelector('canvas'), inp = root.querySelector('[data-testid=cert-name]'), codeEl = root.querySelector('[data-testid=cert-code]'); let seq = 0;
  const draw = async () => { const my = ++seq; const name = normName(inp.value); const code = await certCode(name, key, date); if (my !== seq) return; codeEl.textContent = code; await drawCert(cv, { name, key, dateLabel: fmtDate(date), code, verifyUrl: verifyUrl() }); if (my !== seq) return; cv.dataset.ready = '1'; cv.setAttribute('aria-label', `Certificate for ${name || 'your name'}: ${c.line}, ${fmtDate(date)}, check code ${code}`); store.setName(name); store.saveCert(key, { name, date, code }); };
  let t; inp.addEventListener('input', () => { seq++; cv.dataset.ready = '0'; clearTimeout(t); t = setTimeout(draw, 200); });
  const fname = (ext) => `security-from-scratch-${key}-certificate.${ext}`;
  root.querySelector('[data-png]').addEventListener('click', async () => { await draw(); cv.toBlob((b) => download(fname('png'), b), 'image/png'); });
  root.querySelector('[data-pdf]').addEventListener('click', async () => { await draw(); download(fname('pdf'), pdfFromCanvas(cv)); });
  await draw(); return title;
}

export function renderVerify(root) {
  root.innerHTML = `<div class="page"><h1>Check a certificate</h1><p>Each certificate has a check code made from the name, the certificate type and the date (using SHA-256). Type them exactly as printed. A match shows the certificate was not changed. It is not an accreditation.</p>
    <form class="panel" data-testid="verify-form" novalidate>
      <label class="field">Name as printed<input name="name" autocomplete="off" required data-testid="v-name"></label>
      <label class="field">Certificate<select name="key" data-testid="v-key">${Object.entries(CREDENTIALS).map(([k, c]) => `<option value="${k}">${esc(c.line)}</option>`).join('')}</select></label>
      <label class="field">Date on the certificate<input name="date" type="date" value="${store.today()}" required data-testid="v-date"></label>
      <label class="field">Check code<input name="code" autocomplete="off" spellcheck="false" placeholder="XXXX-XXXX-XXXX-XXXX" data-testid="v-code" class="mono"></label>
      <button class="btn btn-primary" type="submit" data-testid="v-submit">Check</button>
      <div class="verify-out" hidden aria-live="polite" data-testid="v-out"></div></form></div>`;
  const f = root.querySelector('form'), out = root.querySelector('[data-testid=v-out]');
  f.addEventListener('submit', async (e) => { e.preventDefault(); const d = new FormData(f); const want = await certCode(d.get('name'), d.get('key'), d.get('date')); const ok = cleanCode(want) === cleanCode(d.get('code')) && cleanCode(want).length > 0;
    out.hidden = false; out.className = 'verify-out ' + (ok ? 'ok' : 'no'); out.dataset.ok = String(ok); out.textContent = ok ? 'Match. This code belongs to this name, certificate and date.' : 'No match. Check the spelling of the name, the date and the certificate type.'; });
  return 'Check a certificate';
}

export function renderGlossary(root) {
  const terms = glossary.terms.filter((t) => t.sites.includes('security')).sort((a, b) => a.term.localeCompare(b.term));
  root.innerHTML = `<div class="page"><h1>Word Box</h1><p>Plain-language meanings of the words used in this course. The list is shared with <a href="${esc(AI_SAFETY_URL)}#/glossary" target="_blank" rel="noopener">AI Safety from Scratch</a>, so a word means the same thing on both sites.</p><dl class="prose" data-testid="glossary">${terms.map((t) => `<dt id="${t.id}" style="font-weight:800;margin-top:1em">${esc(t.term)}</dt><dd style="margin:4px 0 0">${esc(t.short)}</dd>`).join('')}</dl></div>`;
  const id = location.hash.split('#')[2]; if (id) requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
  return 'Word Box';
}

export function renderAbout(root) {
  root.innerHTML = `<div class="page"><h1>About this course and its sources</h1><div class="prose">
    <p>Security from Scratch is a free course for older adults and the family members who help them. It covers phone and message scams, fake websites, passwords and more. There is no sign-up and no tracking.</p>
    <h2>Who made it</h2><p>Francesco Andreoli, as a personal project. Francesco works at MetaMask. This course is not an official MetaMask or Consensys product, and it is not endorsed by any police force, government body or bank.</p>
    <h2>Stories</h2><p>The stories in the lessons are made up. Each one follows a pattern that police and consumer agencies describe, and each is labelled “A made-up story”.</p>
    <h2>How facts are handled</h2><p>Every fact and number links to a source that was opened and read on the date shown. Phone steps were checked against Apple’s and Google’s own support pages. Phone menus change with updates, so if a step looks different on your phone, follow the linked support page. Anything not yet confirmed is marked <span class="flag">NEEDS SOURCED DATA</span>. Last full check: ${fmtDate(LAST_CHECKED)}.</p>
    <h2>Not yet checked</h2><ul>${(sources.unverified || []).map((u) => `<li>${esc(u)}</li>`).join('')}</ul>
    <h2>Practice exercises</h2><p>All practice exercises are simulations on this page. No real call is made, no message is sent, and no link opens a real website.</p>
    <h2>Sister course</h2><p><a href="${esc(AI_SAFETY_URL)}" target="_blank" rel="noopener">AI Safety from Scratch</a> explains how AI works and how it can be misused, including voice clones and deepfakes.</p>
    <h2>Source list</h2><ol class="sources-list" data-testid="sources">${sources.sources.map((s) => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.title)}</a>, ${esc(s.publisher)}${s.date ? `, ${esc(s.date)}` : ''}. Checked ${esc(s.checked)}.</li>`).join('')}</ol></div></div>`;
  return 'About and sources';
}
export { course };
