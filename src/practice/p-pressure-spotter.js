import { h } from '../util.js';
// Six sentences from a made-up call. Patterns from cybercrimepolice.ch (Schockanruf) and the FTC (fake emergencies).
export const LINES = [
  ['“Your son has caused a serious accident.”', 'fear', 'Fear: a terrible event involving someone you love.'],
  ['“We need the deposit within the hour.”', 'hurry', 'Hurry: a deadline so you have no time to think or check.'],
  ['“Please don’t tell anyone, it could make things worse for him.”', 'secrecy', 'Secrecy: they want to stop you from talking to family, who would spot the trick.'],
  ['“My name is Officer Meier.”', 'none', 'None of these on its own. But a name proves nothing: anyone can say one.'],
  ['“If you hang up, he will go to prison tonight.”', 'fear', 'Fear (and hurry): a threat to stop you from hanging up and checking.'],
  ['“Don’t speak to the bank staff about this.”', 'secrecy', 'Secrecy: Swiss police describe callers telling victims not to trust bank staff.'],
];
const LABEL = { fear: 'Fear', hurry: 'Hurry', secrecy: 'Secrecy', none: 'None of these' };
export default function (body, ctx) {
  let i = 0, right = 0;
  const card = h('div', { class: 'msg-card', 'aria-live': 'polite' }); const row = h('div', { class: 'choice-row' }); const fb = h('div', { 'aria-live': 'polite' });
  function show() {
    fb.replaceChildren(); ctx.status(`Sentence ${i + 1} of ${LINES.length}`);
    card.replaceChildren(h('span', { class: 'from' }, 'The caller says:'), h('div', { class: 'body' }, LINES[i][0]));
    row.replaceChildren(...Object.keys(LABEL).map((k) => h('button', { class: 'btn btn-quiet', type: 'button', 'data-testid': `ps-${k}`, onclick: () => pick(k) }, LABEL[k])));
  }
  function pick(k) {
    const [, ans, why] = LINES[i]; const ok = k === ans; if (ok) right++;
    row.querySelectorAll('button').forEach((b) => (b.disabled = true));
    fb.replaceChildren(h('div', { class: 'feedback' }, h('b', {}, ok ? 'Yes. ' : `Good try. This one is “${LABEL[ans]}”. `), why),
      h('button', { class: 'btn btn-primary', type: 'button', 'data-testid': 'ps-next', onclick: next }, i < LINES.length - 1 ? 'Next sentence' : 'See my summary'));
  }
  function next() {
    i++; if (i < LINES.length) return show();
    card.replaceChildren(h('b', {}, `You spotted ${right} of ${LINES.length}.`), h('p', {}, 'The exact label matters less than the feeling. When a call makes you afraid, rushed or secretive, that feeling is your signal to stop, hang up and check.'));
    row.replaceChildren(h('button', { class: 'btn btn-quiet', type: 'button', onclick: () => { i = 0; right = 0; show(); } }, 'Start again'));
    fb.replaceChildren(); ctx.status('Finished'); ctx.done();
  }
  body.append(h('p', { class: 'muted' }, 'A made-up call. Nothing here is real.'), card, row, fb); show();
}
