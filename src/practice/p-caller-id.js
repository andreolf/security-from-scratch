import { h } from '../util.js';
// Caller ID spoofing (FCC; cybercrimepolice.ch): the displayed number can be anything the caller chooses.
export default function (body, ctx) {
  const inp = h('input', { type: 'text', maxlength: '24', value: '117', 'data-testid': 'cid-input', 'aria-describedby': 'cid-help' });
  const num = h('div', { class: 'num', 'data-testid': 'cid-screen' }, '117');
  const label = h('div', { class: 'muted' }, 'Incoming call');
  const note = h('div', { class: 'feedback', 'aria-live': 'polite' });
  let tries = new Set(['117']);
  const show = () => { const v = inp.value.trim() || 'Unknown'; num.textContent = v; tries.add(v); note.replaceChildren(h('b', {}, 'See? '), `The screen shows “${v}” because that is what was typed. The real caller could be anywhere.`); if (tries.size >= 3) { ctx.status('You have seen it: the number proves nothing.'); ctx.done(); } };
  inp.addEventListener('input', show);
  const presets = [['117', 'Police 117'], ['+41 44 123 45 67', 'A Zurich number'], ['Mum', 'A saved name']].map(([v, l]) => h('button', { class: 'btn btn-quiet btn-small', type: 'button', 'data-testid': `cid-preset-${l.split(' ')[0].toLowerCase()}`, onclick: () => { inp.value = v; show(); } }, l));
  body.append(h('label', { class: 'field' }, 'Type the number you want the other person to see:', inp), h('p', { id: 'cid-help', class: 'muted' }, 'This is a pretend screen on this page. No call is made.'),
    h('div', { class: 'choice-row' }, ...presets), h('div', { class: 'phone', role: 'img', 'aria-label': 'Pretend phone screen' }, label, num), note,
    h('p', {}, h('b', {}, 'What this means: '), 'a call can show the police number, your bank, or even a family member and still be a scammer. Hang up and call the number you already have.'));
  show();
}
