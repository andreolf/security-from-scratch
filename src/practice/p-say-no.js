import { h } from '../util.js';
const CARDS = [
  ['“This is urgent. You must decide now.”', '“I never decide about money on the phone. I will call you back on the official number.”'],
  ['“Don’t hang up, or you will lose everything.”', '“I am going to hang up now. Goodbye.”'],
  ['“Just read me the code we sent you.”', '“I never read codes to anyone. Goodbye.”'],
  ['“You can trust me, I am from the police.”', '“Then you will understand that I will call 117 myself.”'],
  ['“Don’t tell your family about this.”', '“I talk about everything with my family. Goodbye.”'],
];
export default function (body, ctx) {
  let i = 0; const seen = new Set();
  const card = h('div', { class: 'msg-card' }); const nav = h('div', { class: 'choice-row' });
  const speak = (t) => { try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(t.replace(/[“”]/g, '')); u.lang = 'en-GB'; u.rate = 0.9; speechSynthesis.speak(u); } catch {} };
  function show() {
    const [them, me] = CARDS[i]; seen.add(i); ctx.status(`Card ${i + 1} of ${CARDS.length}`);
    const ans = h('div', { class: 'bubble me', hidden: true, 'data-testid': 'sn-answer' }, h('small', {}, 'You say'), me);
    card.replaceChildren(h('div', { class: 'chat' }, h('div', { class: 'bubble' }, h('small', {}, 'The caller says'), them), ans),
      h('div', { class: 'choice-row' }, h('button', { class: 'btn btn-primary', type: 'button', 'data-testid': 'sn-show', onclick: (e) => { ans.hidden = false; e.currentTarget.hidden = true; } }, 'Show a calm answer'),
        'speechSynthesis' in window ? h('button', { class: 'btn btn-quiet', type: 'button', onclick: () => { ans.hidden = false; speak(me); } }, 'Read the answer to me') : null));
    nav.replaceChildren(h('button', { class: 'btn btn-quiet', type: 'button', disabled: i === 0 || null, onclick: () => { i--; show(); } }, '← Previous card'), h('button', { class: 'btn btn-quiet', type: 'button', 'data-testid': 'sn-next', onclick: () => { i = (i + 1) % CARDS.length; show(); } }, i === CARDS.length - 1 ? 'Back to the first card' : 'Next card →'));
    if (seen.size === CARDS.length) ctx.done();
  }
  body.append(h('p', { class: 'muted' }, 'Tip: ask a family member to read the caller’s line in a pushy voice. You answer with the calm sentence. Practise until it feels easy.'), card, nav); show();
}
