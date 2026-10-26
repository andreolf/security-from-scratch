import { h } from '../util.js';
import { store } from '../store.js';
// Emergency numbers: 117 (Swiss police, cybercrimepolice.ch), 112 (EU, European Commission), 911 (US, DOJ).
const FIXED = { ch: [['Police (Switzerland)', '117'], ['Emergency (all of Europe)', '112']], eu: [['Emergency (all of Europe)', '112']], us: [['Emergency (US)', '911']] };
const ROWS = [['bank', 'My bank (number on the back of my card)'], ['family1', 'Family member'], ['family2', 'Another family member'], ['helper', 'My “call me first” helper'], ['doctor', 'My doctor']];
export default function (body, ctx) {
  const saved = store.get().card || {}; let region = saved.region || 'ch';
  const sel = h('select', { 'data-testid': 'tc-region' }, ...[['ch', 'Switzerland'], ['eu', 'Another EU country'], ['us', 'United States']].map(([v, l]) => h('option', { value: v, selected: v === region || null }, l)));
  const inputs = ROWS.map(([k, l]) => { const i = h('input', { type: 'text', inputmode: 'tel', autocomplete: 'off', maxlength: '40', value: saved[k] || '', 'data-testid': `tc-${k}` }); return [k, l, i]; });
  const card = h('div', { class: 'card-print', 'data-testid': 'tc-card' });
  function draw() {
    const rows = [...FIXED[region], ...inputs.map(([k, l, i]) => [l, i.value.trim() || '………………'])];
    card.replaceChildren(h('h3', { style: 'margin-top:0' }, h('span', { class: 'hl' }, 'My trusted numbers')), h('table', {}, h('tbody', {}, ...rows.map(([a, b]) => h('tr', {}, h('td', {}, a), h('td', {}, b))))),
      h('p', { style: 'margin:10px 0 0;font-weight:700' }, 'If a call or message makes me worried about money: stop, hang up, and call one of these numbers myself.'));
  }
  const saveAll = () => { const c = { region }; inputs.forEach(([k, , i]) => (c[k] = i.value.trim())); store.setCard(c); };
  sel.addEventListener('change', () => { region = sel.value; draw(); saveAll(); });
  inputs.forEach(([, , i]) => i.addEventListener('input', () => { draw(); saveAll(); }));
  const print = h('button', { class: 'btn btn-primary', type: 'button', 'data-testid': 'tc-print', onclick: () => {
    card.classList.add('print-target'); document.body.classList.add('printing-card'); ctx.done(); ctx.status('Card ready to print.');
    const off = () => { document.body.classList.remove('printing-card'); card.classList.remove('print-target'); removeEventListener('afterprint', off); };
    addEventListener('afterprint', off); try { window.print(); } catch { off(); }
  } }, 'Print my card');
  body.append(h('p', {}, 'Type the real numbers you already trust: from the back of your bank card, from a letter, or from family. ', h('b', {}, 'Never copy a number from a call or message you received.')),
    h('label', { class: 'field' }, 'Where do you live?', sel), ...inputs.map(([, l, i]) => h('label', { class: 'field' }, l, i)), card, h('div', { class: 'actions' }, print),
    h('p', { class: 'muted' }, 'These numbers are saved only in this browser, on this device. Nothing is sent anywhere.'));
  draw();
}
