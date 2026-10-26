// Multiple-choice question element. Options are shuffled deterministically per question id,
// so the order is stable across visits and devices but not always "A is right".
// Wording is kind: a wrong answer is "Not quite", and the explanation always follows.
import { h, esc, shuffledIdx } from '../util.js';
export function questionEl(q, num, { instant = true, onAnswer } = {}) {
  const order = shuffledIdx(q.options.length, q.id);
  const el = h('fieldset', { class: 'q', 'data-qid': q.id, 'data-testid': 'question' });
  el.append(h('legend', { class: 'sr' }, `Question ${num}`));
  el.append(h('p', { class: 'q-stem', html: `<span class="muted-strong">${num}.</span> ${esc(q.q)}` }));
  const opts = h('div', { class: 'q-opts' }); let picked = null, first = null;
  const explain = h('div', { class: 'q-explain', 'aria-live': 'polite' });
  order.forEach((oi, pos) => {
    const inp = h('input', { type: 'radio', name: q.id, value: String(oi) });
    const lab = h('label', { class: 'q-opt', 'data-correct': String(oi === q.answer), 'data-testid': 'q-opt', 'data-pos': String(pos) }, inp, h('span', {}, q.options[oi]));
    inp.addEventListener('change', () => {
      picked = oi; if (first === null) { first = oi; onAnswer?.(q, oi === q.answer); }
      if (instant) reveal();
      el.dispatchEvent(new Event('input', { bubbles: true }));
    });
    opts.append(lab);
  });
  function reveal() {
    opts.querySelectorAll('.q-opt').forEach((l) => { l.classList.remove('correct', 'incorrect'); const c = l.dataset.correct === 'true'; const sel = l.querySelector('input').checked; if (c) l.classList.add('correct'); else if (sel) l.classList.add('incorrect'); });
    const ok = picked === q.answer; const why = q.why && picked != null ? q.why[picked] : '';
    explain.innerHTML = picked == null ? `<b>Not answered.</b> ${esc(q.explain)}` : `<b>${ok ? 'Yes, that’s right.' : 'Not quite, and that’s fine.'}</b> ${why ? esc(why) + ' ' : ''}${esc(q.explain)}`;
  }
  el.append(opts, explain);
  el.answered = () => picked !== null; el.correct = () => picked === q.answer; el.reveal = reveal;
  return el;
}
