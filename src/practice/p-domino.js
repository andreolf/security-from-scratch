import { h } from '../util.js';
const ACCOUNTS = ['Old shop', 'Email', 'Bank', 'Photos'];
export function exposed(same) { return same ? ACCOUNTS.slice() : ['Old shop']; }
export default function (body, ctx) {
  let same = true, hacked = false;
  const grid = h('div', { class: 'domino', 'data-testid': 'dm-grid' }); const say = h('div', { 'aria-live': 'polite' });
  const t1 = h('button', { class: 'tab', type: 'button', 'aria-pressed': 'true', 'data-testid': 'dm-same', onclick: () => { same = true; hacked = false; draw(); } }, 'Same password everywhere');
  const t2 = h('button', { class: 'tab', type: 'button', 'aria-pressed': 'false', 'data-testid': 'dm-diff', onclick: () => { same = false; hacked = false; draw(); } }, 'A different password for each');
  const hack = h('button', { class: 'btn btn-primary', type: 'button', 'data-testid': 'dm-hack', onclick: () => { hacked = true; draw(); } }, 'The old shop is hacked');
  function draw() {
    t1.setAttribute('aria-pressed', String(same)); t2.setAttribute('aria-pressed', String(!same));
    [t1, t2].forEach((b) => b.setAttribute('aria-selected', b.getAttribute('aria-pressed')));
    const open = hacked ? exposed(same) : [];
    grid.replaceChildren(...ACCOUNTS.map((a) => h('div', { class: open.includes(a) ? 'open' : 'safe' }, a, h('small', {}, open.includes(a) ? '✗ open to criminals' : '✓ still locked'))));
    say.replaceChildren(hacked ? h('div', { class: 'feedback' + (same ? ' bad' : '') }, same ? 'The criminals try the leaked password everywhere, and every door opens: email, bank, photos.' : 'Only the old shop is affected. Everything else stays locked, because each password is different.') : h('p', { class: 'muted' }, 'Choose a way of using passwords, then press the button.'));
    ctx.status(hacked ? `${open.length} of ${ACCOUNTS.length} accounts open` : 'Ready');
    if (hacked && !same) ctx.done();
  }
  body.append(h('div', { class: 'tabs' }, t1, t2), grid, h('div', { class: 'actions' }, hack), say); draw();
}
