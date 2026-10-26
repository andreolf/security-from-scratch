import { h } from '../util.js';
// The registrable name is (roughly) the last two labels of the host: good enough for .ch, .com, .net, .info, .example.
export function realName(url) { const host = url.replace(/^[a-z]+:\/\//i, '').split(/[/?#]/)[0].toLowerCase(); return host.split('.').slice(-2).join('.'); }
const LINKS = [
  ['TWINT', 'https://go.twint.ch/1/e/tw?tw=acq.abc', 'twint.ch', true, 'TWINT says its official payment links start with https://go.twint.ch/.'],
  ['TWINT', 'https://twint.ch.payment-check.info/login', 'twint.ch', false, '“twint.ch” is only at the front. The real name is payment-check.info.'],
  ['your bank (made-up name “mybank.ch”)', 'https://www.mybank.ch/login', 'mybank.ch', true, 'The part before the first single slash ends in mybank.ch.'],
  ['your bank (made-up name “mybank.ch”)', 'https://mybank-ch.secure-login.net/', 'mybank.ch', false, 'The real name is secure-login.net. A dash makes it a different address.'],
  ['your parcel service (made-up name “parcelpost.ch”)', 'https://parcelpost.ch-track.info/pay', 'parcelpost.ch', false, 'Look closely: the real name is ch-track.info.'],
];
export default function (body, ctx) {
  let i = 0, right = 0;
  const box = h('div', { 'aria-live': 'polite' });
  const mark = (u) => { const st = u.indexOf('//') + 2; const host = u.slice(st).split(/[/?#]/)[0]; const name = realName(u); const k = st + host.length - name.length; return [u.slice(0, k), u.slice(k, k + name.length), u.slice(k + name.length)]; };
  function show() {
    const [who, url] = LINKS[i]; ctx.status(`Link ${i + 1} of ${LINKS.length}`);
    const addr = h('p', { class: 'addr', 'data-testid': 'lr-addr' }, url);
    const q = h('div', { hidden: true }, h('p', { style: 'font-weight:700' }, `Does this link really belong to ${who}?`), h('div', { class: 'choice-row' }, h('button', { class: 'btn btn-quiet', type: 'button', 'data-testid': 'lr-yes', onclick: () => pick(true) }, 'Yes, it belongs to them'), h('button', { class: 'btn btn-quiet', type: 'button', 'data-testid': 'lr-no', onclick: () => pick(false) }, 'No, it goes somewhere else')));
    const reveal = h('button', { class: 'btn btn-primary', type: 'button', 'data-testid': 'lr-reveal', onclick: () => { const [a, b, c] = mark(url); addr.replaceChildren(a, h('span', { class: 'dom' }, b), c); reveal.hidden = true; q.hidden = false; } }, 'Show the real website name');
    box.replaceChildren(h('div', { class: 'msg-card' }, h('span', { class: 'from' }, `A message says it is from ${who} and contains this link:`), addr), reveal, q);
  }
  function pick(yes) {
    const [, , , real, why] = LINKS[i]; const ok = yes === real; if (ok) right++;
    box.querySelectorAll('[data-testid=lr-yes],[data-testid=lr-no]').forEach((b) => (b.disabled = true));
    box.append(h('div', { class: 'feedback' + (real ? '' : ' bad') }, h('b', {}, ok ? 'Right. ' : 'Good try. '), why), h('button', { class: 'btn btn-primary', type: 'button', 'data-testid': 'lr-next', onclick: next }, i < LINKS.length - 1 ? 'Next link' : 'See my summary'));
  }
  function next() {
    i++; if (i < LINKS.length) return show();
    box.replaceChildren(h('div', { class: 'feedback' }, h('b', {}, `You read ${right} of ${LINKS.length} links correctly.`), h('p', { style: 'margin:6px 0 0' }, 'Reading links is a useful skill, but you never have to rely on it: the safest way in is always your own bookmark or the official app.')),
      h('button', { class: 'btn btn-quiet', type: 'button', onclick: () => { i = 0; right = 0; show(); } }, 'Start again'));
    ctx.status('Finished'); ctx.done();
  }
  body.append(h('p', { class: 'muted' }, 'Made-up links, shown as plain text. Nothing here can be opened.'), box); show();
}
