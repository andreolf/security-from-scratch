import { h, shuffledIdx } from '../util.js';
const ROUNDS = [
  ['TWINT', 'twint.ch', [['twlnt.ch', 'An “l” instead of an “i”: twlnt.'], ['twint-ch.com', 'A dash and a different ending.'], ['twint.ch.secure-pay.info', 'The real name is secure-pay.info.']]],
  ['your bank (made-up name)', 'mybank.ch', [['mybank.ch-login.com', 'The real name is ch-login.com.'], ['rnybank.ch', '“rn” looks like “m” at a glance.'], ['mybank-ch.net', 'A dash and a different ending.']]],
  ['your parcel service (made-up name)', 'parcelpost.ch', [['parcelpost-ch.info', 'A dash and a different ending.'], ['parcel-post.ch', 'An extra dash makes it a different address.'], ['parcelpost.ch.delivery-fee.com', 'The real name is delivery-fee.com.']]],
];
export default function (body, ctx) {
  let r = 0, right = 0; const box = h('div', { 'aria-live': 'polite' });
  function show() {
    const [who, real, fakes] = ROUNDS[r]; ctx.status(`Round ${r + 1} of ${ROUNDS.length}`);
    const opts = [[real, 'This is the real one.'], ...fakes]; const order = shuffledIdx(opts.length, `look-${r}`);
    box.replaceChildren(h('p', { style: 'font-weight:700' }, `Which is the real address of ${who}?`), h('div', { class: 'choice-row', style: 'flex-direction:column' }, ...order.map((k) => h('button', { class: 'btn btn-quiet addr', style: 'justify-content:flex-start', type: 'button', 'data-testid': k === 0 ? 'lk-real' : 'lk-fake', onclick: (ev) => pick(k, ev.currentTarget) }, opts[k][0]))));
  }
  function pick(k, btn) {
    const [, real, fakes] = ROUNDS[r]; const ok = k === 0; if (ok) right++;
    box.querySelectorAll('button').forEach((b) => (b.disabled = true));
    box.append(h('div', { class: 'feedback' + (ok ? '' : ' bad') }, h('b', {}, ok ? 'Yes: ' : `Not this one: ${fakes[k - 1][1]} `), `The real one is ${real}.`, h('ul', {}, ...fakes.map(([a, why]) => h('li', {}, h('span', { class: 'addr' }, a), ': ', why)))),
      h('button', { class: 'btn btn-primary', type: 'button', 'data-testid': 'lk-next', onclick: () => { r++; if (r < ROUNDS.length) show(); else end(); } }, r < ROUNDS.length - 1 ? 'Next round' : 'See my summary'));
  }
  function end() { box.replaceChildren(h('div', { class: 'feedback' }, h('b', {}, `You found ${right} of ${ROUNDS.length} real addresses.`), h('p', { style: 'margin:6px 0 0' }, 'Look-alikes are hard to spot, even for experts. That is why the safe habit is to open sites from your own bookmark or the official app.')), h('button', { class: 'btn btn-quiet', type: 'button', onclick: () => { r = 0; right = 0; show(); } }, 'Start again')); ctx.status('Finished'); ctx.done(); }
  body.append(h('p', { class: 'muted' }, 'Only TWINT is a real company here. The bank and parcel names are made up for practice.'), box); show();
}
