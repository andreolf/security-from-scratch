// Lesson figures: pure data + SVG strings, rendered at build time into the lesson HTML,
// so every figure works without JavaScript and always ships with words (nothing exists only in a picture).
//   kind 'svg'   -> one diagram (role=img + aria-label) and a "Text version" disclosure
//   kind 'steps' -> step-through; every step's words are real text under the picture; JS shows one at a time
import { T, box, hlBox, arrow, svg, e } from './svg.js';
import { visuals2 } from './registry-p04-07.js';
import { visuals3 } from './registry-p08-12.js';

const W = 360;
const S = { size: 18, weight: 700 };
const steps = (id, alt, list) => ({ kind: 'steps', alt, steps: list.map(([body, text, h = 200]) => ({ svg: svg(id, W, h, body, text), text })) });
const one = (id, alt, h, body, text) => ({ kind: 'svg', alt, text, svg: svg(id, W, h, body, alt) });
const node = (x, y, w, h, label, opt = {}) => `${box(x, y, w, h, opt)}${T(x + w / 2, y + h / 2 + 6 - (Array.isArray(label) ? (label.length - 1) * 11 : 0), label, { size: opt.size || 18, anchor: 'middle', weight: 800, cls: opt.hl ? 'svg-on-hl' : 'svg-t' })}`;
// A vertical flow of boxes; the active one is highlighted.
const flow = (id, labels, active, { y0 = 12, gap = 58, h = 44 } = {}) => labels.map((l, i) => { const y = y0 + i * gap; return node(30, y, 300, h, l, { hl: i === active }) + (i < labels.length - 1 ? arrow(id, 180, y + h, 180, y + gap - 2) : ''); }).join('');
const flowSteps = (id, alt, labels, texts) => steps(id, alt, labels.map((_, i) => [flow(id, labels, i), texts[i], 12 + labels.length * 58]));
const cross = (x, y, s = 16) => `<path d="M${x - s} ${y - s}L${x + s} ${y + s}M${x + s} ${y - s}L${x - s} ${y + s}" style="stroke:var(--danger);stroke-width:5;stroke-linecap:round"/>`;
const tick = (x, y, s = 16) => `<path d="M${x - s} ${y}L${x - s / 3} ${y + s * .7}L${x + s} ${y - s * .7}" style="stroke:var(--fg);stroke-width:5;stroke-linecap:round;stroke-linejoin:round;fill:none"/>`;
const phone = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="22" class="svg-box" stroke-width="4"/><rect x="${x + w / 2 - 22}" y="${y + 10}" width="44" height="7" rx="3.5" style="fill:var(--line-strong)"/>`;

export const visuals = {
  // ---------- Phase 00 ----------
  'site-tour': flowSteps('site-tour', 'How each lesson works, step by step.',
    ['A short story', 'The one thing to remember', 'Try it on your own phone', 'Three calm questions', 'Phase check, then certificate'],
    ['Step 1: each lesson starts with a short story. The stories are made up, and we say so.', 'Step 2: a highlighted box gives you the one thing to remember.', 'Step 3: where it helps, you try one real setting on your own phone. iPhone and Android steps are side by side.', 'Step 4: three questions. Answer as often as you like. Every answer is explained kindly.', 'Step 5: at the end of a phase there is a check of 10 questions. 8 right is a pass, and you can retake it as often as you like. Pass the core phases for a free certificate.']),
  'pressure-trio': one('pressure-trio', 'Fear, hurry and secrecy push out calm thinking.', 250,
    `${['FEAR', 'HURRY', 'SECRECY'].map((t, i) => node(12 + i * 116, 14, 104, 56, t, { size: 18 })).join('')}
     ${[0, 1, 2].map((i) => arrow('pressure-trio', 64 + i * 116, 72, 180, 132)).join('')}
     ${node(60, 136, 240, 50, 'Calm thinking stops', { hl: true })}
     ${T(180, 222, 'That is the whole trick.', { size: 18, anchor: 'middle', weight: 700, cls: 'svg-m' })}`,
    'Three boxes at the top: fear, hurry and secrecy. Arrows from all three point down to a highlighted box: calm thinking stops. Underneath: that is the whole trick.'),
  'three-rules': steps('three-rules', 'The three golden rules: Stop, Hang up, Check.', [
    [`${node(30, 20, 300, 70, 'STOP', { hl: true, size: 30 })}${T(180, 130, ['Don’t answer the question.', 'Don’t tap. Don’t pay.'], { size: 18, anchor: 'middle', weight: 700 })}`, 'Rule 1, Stop: when a call or message makes you worried or rushed, pause. Don’t answer its questions, don’t tap, don’t pay.', 180],
    [`${node(30, 20, 300, 70, 'HANG UP', { hl: true, size: 30 })}${T(180, 130, ['End the call or close the message.', 'You don’t have to be polite.'], { size: 18, anchor: 'middle', weight: 700 })}`, 'Rule 2, Hang up: end the call, or close the message. You don’t have to be polite to a stranger who pressures you.', 180],
    [`${node(30, 20, 300, 70, 'CHECK', { hl: true, size: 30 })}${T(180, 130, ['Call back on a number', 'you already have.'], { size: 18, anchor: 'middle', weight: 700 })}`, 'Rule 3, Check: contact the person or company yourself, on a number or website you already know is real. Never use the number the caller gave you.', 180],
  ]),
  'trusted-card': one('trusted-card', 'A trusted-numbers card kept by the phone.', 300,
    `<rect x="20" y="14" width="320" height="272" rx="14" class="svg-box" stroke-width="4"/>${hlBox(36, 28, 288, 40, 8)}${T(180, 56, 'MY TRUSTED NUMBERS', { size: 18, anchor: 'middle', weight: 900, cls: 'svg-on-hl' })}
     ${[['Police (Switzerland)', '117'], ['Emergency (Europe)', '112'], ['My bank (back of card)', '……'], ['My daughter', '……'], ['My helper', '……']].map(([a, b], i) => `${T(40, 104 + i * 38, a, { size: 17, weight: 700 })}${T(320, 104 + i * 38, b, { size: 18, weight: 900, anchor: 'end' })}<line x1="40" x2="320" y1="${114 + i * 38}" y2="${114 + i * 38}" class="svg-line" stroke-width="1.5"/>`).join('')}`,
    'A card titled My trusted numbers, with rows: Police (Switzerland) 117; Emergency (Europe) 112; My bank, from the back of the card; my daughter; my helper. You fill in the empty numbers yourself.'),

  // ---------- Phase 01 ----------
  'grandchild-call': flowSteps('grandchild-call', 'How the grandchild-in-trouble call goes, and how it ends safely.',
    ['Phone rings: “police”', 'Crying “grandchild”', 'Money now. Tell no one.', 'You hang up', 'You call her yourself: she is fine'],
    ['Step 1: the phone rings. A serious, kind voice says he is from the police.', 'Step 2: you hear crying. It sounds like your grandchild, but you cannot really talk to her.', 'Step 3: money is needed right now, and you must not tell anyone. Fear, hurry and secrecy.', 'Step 4: you say “I will call back” and hang up.', 'Step 5: you call your grandchild on the number saved in your phone. She is fine.']),
  'fake-police-flow': flowSteps('fake-police-flow', 'The four steps of the fake police officer trick, as Swiss police describe them.',
    ['A “police officer” calls', 'You are asked to “help”', 'Get your money or valuables ready', 'A “courier” comes to collect'],
    ['Step 1: a caller says he is a police officer. For example, burglars were caught nearby with a note of your name and address.', 'Step 2: you are asked to help catch criminals. You may be told that bank staff work with the criminals, so you must not tell them anything.', 'Step 3: you are told your money and valuables are not safe at home or at the bank, and to get them ready.', 'Step 4: a “plain-clothes officer” or courier comes to your door to collect them, or you are told to leave them somewhere. Real police never do this.']),
  'bank-call': one('bank-call', 'What a real bank does, compared with a fake bank caller.', 300,
    `${T(90, 30, 'REAL BANK', { size: 18, anchor: 'middle', weight: 900 })}${T(270, 30, 'FAKE CALLER', { size: 18, anchor: 'middle', weight: 900 })}
     ${['Never asks for your', 'Never asks you to', 'Never asks you to'].map((t, i) => '').join('')}
     ${[['Never asks for', 'your password'], ['Never asks you', 'to move money'], ['Never asks you to', 'install an app']].map((t, i) => `${box(10, 48 + i * 82, 160, 70)}${tick(30, 83 + i * 82, 10)}${T(100, 76 + i * 82, t, { size: 15.5, anchor: 'middle', weight: 700 })}`).join('')}
     ${[['“Read me the', 'code we sent”'], ['“Your money is not', 'safe. Move it.”'], ['“Install this', 'app for help”']].map((t, i) => `${box(190, 48 + i * 82, 160, 70, { dash: true })}${cross(206, 83 + i * 82, 8)}${T(276, 76 + i * 82, t, { size: 15.5, anchor: 'middle', weight: 700 })}`).join('')}`,
    'Two columns. Real bank: never asks for your password, never asks you to move money to keep it safe, never asks you to install an app so they can help. Fake caller: read me the code we sent; your money is not safe, move it; install this app for help.'),
  'press-1': flowSteps('press-1', 'How robot calls with “press 1” work.',
    ['A machine calls many numbers', 'Recording: “Press 1”', 'Pressing 1 connects a scammer', 'They ask you to install an app'],
    ['Step 1: a computer calls many phone numbers, one after the other.', 'Step 2: when someone answers, a recording claims to be the police, Interpol or Europol, often in English, and says “press 1”.', 'Step 3: only people who press 1 are connected to a real scammer. Pressing 1 tells them you might believe the story.', 'Step 4: the scammer wants you to install a program that lets them control your phone and reach your online banking. The safe move at step 2: press nothing and hang up.']),
  'spoofing': one('spoofing', 'A scammer can make any number appear on your screen.', 280,
    `${box(12, 40, 130, 110)}${T(77, 70, 'SCAMMER', { size: 17, anchor: 'middle', weight: 900 })}${T(77, 100, 'types:', { size: 16, anchor: 'middle', cls: 'svg-m' })}${T(77, 128, '“117”', { size: 22, anchor: 'middle', weight: 900 })}
     ${arrow('spoofing', 146, 95, 204, 95, { acc: true })}${T(175, 80, 'internet', { size: 13, anchor: 'middle', cls: 'svg-m' })}
     ${phone(210, 14, 138, 250)}${T(279, 80, 'Incoming call', { size: 15, anchor: 'middle', cls: 'svg-m' })}${hlBox(224, 96, 110, 44, 8)}${T(279, 126, '117', { size: 26, anchor: 'middle', weight: 900, cls: 'svg-on-hl' })}${T(279, 176, ['The screen', 'shows what', 'they typed'], { size: 15, anchor: 'middle', weight: 700 })}`,
    'Left: a scammer types the number 117 into an internet phone system. An arrow goes to your phone. Your phone shows an incoming call from 117. The screen shows whatever number the scammer typed, so the number alone proves nothing.'),
  'sms-anatomy': one('sms-anatomy', 'A fake parcel text message, with its warning signs.', 340,
    `${phone(20, 10, 320, 320)}${T(180, 52, 'Text message', { size: 15, anchor: 'middle', cls: 'svg-m' })}
     <rect x="40" y="66" width="280" height="132" rx="16" class="svg-box" stroke-width="2"/>${T(56, 94, ['Your parcel is on hold.', 'Pay CHF 1.99 within 24h:', 'post-ch-delivery.info/pay'], { size: 16.5, weight: 600 })}
     ${['1 You did not expect it', '2 Hurry: “within 24h”', '3 A link to a strange address'].map((t, i) => `${hlBox(40, 212 + i * 36, 280, 30, 6)}${T(52, 233 + i * 36, t, { size: 16, weight: 800, cls: 'svg-on-hl' })}`).join('')}`,
    'A phone shows a text message: your parcel is on hold, pay CHF 1.99 within 24 hours, with a link to post-ch-delivery.info/pay. This example is made up. Warning signs: 1, you did not expect it; 2, it hurries you; 3, the link goes to a strange address that is not the post office’s own.'),
  'say-no': steps('say-no', 'Three polite sentences that end any call.', [
    [`${node(20, 30, 320, 90, ['“I will call you back', 'on the official number.”'], { hl: true, size: 19 })}`, 'Sentence 1: “I will call you back on the official number.” Then hang up and find the number yourself.', 150],
    [`${node(20, 30, 320, 90, ['“I never decide about', 'money on the phone.”'], { hl: true, size: 19 })}`, 'Sentence 2: “I never decide about money on the phone.” A real organisation accepts this.', 150],
    [`${node(20, 30, 320, 90, ['“I am going to hang up', 'now. Goodbye.”'], { hl: true, size: 19 })}`, 'Sentence 3: “I am going to hang up now. Goodbye.” You don’t need a reason, and you don’t need to wait for an answer.', 150],
  ]),

  // ---------- Phase 02 ----------
  'phishing-hook': one('phishing-hook', 'Phishing: a fake message used as bait on a hook.', 260,
    `<path d="M180 10 V120 a36 36 0 1 1 -50 -32" style="fill:none;stroke:var(--fg);stroke-width:6;stroke-linecap:round"/>
     ${hlBox(60, 160, 240, 46, 10)}${T(180, 190, '“Your account is blocked”', { size: 18, anchor: 'middle', weight: 800, cls: 'svg-on-hl' })}
     ${T(180, 240, 'The bait hides the hook: your password or card', { size: 15.5, anchor: 'middle', weight: 700 })}`,
    'A fishing hook. On the hook is the bait: a message saying “your account is blocked”. The bait hides the hook, which is what the scammer really wants: your password or your card number.'),
  'link-anatomy': one('link-anatomy', 'How to find the real website name in a link.', 300,
    `${T(18, 34, 'A made-up link:', { size: 16, weight: 800, cls: 'svg-m' })}
     ${T(18, 70, 'https://mybank.ch.login-help.net/de', { size: 17, weight: 700 })}
     ${hlBox(150, 82, 126, 30, 6)}${T(213, 103, 'login-help.net', { size: 16, anchor: 'middle', weight: 900, cls: 'svg-on-hl' })}
     ${T(18, 150, ['Find the first single “/” after the', 'start. Just before it, the last two', 'parts are the real owner:'], { size: 16.5, weight: 700 })}
     ${T(18, 232, ['login-help.net, not mybank.ch.'], { size: 18, weight: 900 })}
     ${T(18, 268, 'Names in front of it mean nothing.', { size: 16.5, weight: 700, cls: 'svg-m' })}`,
    'A made-up link: https://mybank.ch.login-help.net/de. To find the real website, look at the part just before the first single slash after the start. The last two parts there, login-help.net, are the real owner. It is not mybank.ch, even though a bank-like name appears at the front.'),
  'padlock': one('padlock', 'The padlock means a private line, not an honest shop.', 260,
    `<rect x="40" y="60" width="80" height="64" rx="10" class="svg-hl"/><path d="M56 60 V44 a24 24 0 0 1 48 0 V60" style="fill:none;stroke:var(--fg);stroke-width:7"/>
     ${T(150, 80, ['Padlock means:', 'nobody can listen in', 'on the way.'], { size: 17, weight: 800 })}
     ${box(20, 160, 320, 80, { dash: true })}${T(180, 192, ['It does NOT mean the site', 'is honest. Fake sites have it too.'], { size: 17, anchor: 'middle', weight: 800 })}`,
    'A padlock. The padlock means the connection is private: nobody can listen in on the way. It does not mean the website is honest. Fake websites can have a padlock too.'),
  'safe-way-in': one('safe-way-in', 'The safe way in: a saved bookmark or the official app, not a link or a search advert.', 300,
    `${node(110, 10, 140, 44, 'Your bank', { hl: true })}
     ${[['Link in a message'], ['Search advert'], ['Saved bookmark'], ['Official app']].map(([t], i) => { const x = 8 + (i % 2) * 176, y = 130 + Math.floor(i / 2) * 84; const good = i >= 2; return `${box(x, y, 168, 62, { dash: !good })}${T(x + 98, y + 37, t, { size: 16, anchor: 'middle', weight: 800 })}${good ? tick(x + 22, y + 31, 10) : cross(x + 20, y + 31, 8)}`; }).join('')}
     ${arrow('safe-way-in', 92, 214, 150, 58)}${arrow('safe-way-in', 268, 214, 210, 58)}
     ${T(180, 118, 'Use only the paths with a tick', { size: 15, anchor: 'middle', weight: 700, cls: 'svg-m' })}`,
    'Four ways to reach your bank. A link in a message: no. A search advert: no. A saved bookmark: yes. The official app: yes. Only the bookmark and the official app lead safely to your bank.'),
  'attachment-stop': flowSteps('attachment-stop', 'What to do with an attachment or QR code you did not expect.',
    ['Unexpected file or QR code', 'Don’t open, don’t scan', 'Check with the sender yourself', 'Real? Open it. Not? Delete.'],
    ['Step 1: an email arrives with an invoice, a file or a QR code you did not expect.', 'Step 2: don’t open the file and don’t scan the code yet.', 'Step 3: contact the company or person yourself, with a phone number or website you know is real, not the details in the email.', 'Step 4: if they really sent it, you can open it. If not, delete it, or report it.']),
  'five-signs': one('five-signs', 'Five warning signs of a fake message.', 330,
    `${['1  You did not expect it', '2  It makes you worried or rushed', '3  It asks for a password, code or card', '4  The link goes somewhere strange', '5  Hello “Dear customer”'].map((t, i) => `${i === 1 ? hlBox(14, 14 + i * 62, 332, 50, 10) : box(14, 14 + i * 62, 332, 50)}${T(30, 46 + i * 62, t, { size: 17, weight: 800, cls: i === 1 ? 'svg-on-hl' : 'svg-t' })}`).join('')}`,
    'Five warning signs: 1, you did not expect it; 2, it makes you worried or rushed; 3, it asks for a password, a code or card details; 4, the link goes to a strange address; 5, it does not use your name, for example “Dear customer”.'),

  // ---------- Phase 03 ----------
  'one-key': one('one-key', 'One password everywhere is like one key for every door.', 300,
    `${T(180, 28, 'Same password everywhere', { size: 17, anchor: 'middle', weight: 900 })}
     ${['Shop', 'Email', 'Bank'].map((t, i) => `${box(14 + i * 116, 44, 104, 60, { dash: true })}${T(66 + i * 116, 80, t, { size: 17, anchor: 'middle', weight: 800 })}`).join('')}
     ${T(180, 130, 'The shop leaks it: every door opens.', { size: 16, anchor: 'middle', weight: 700, cls: 'svg-m' })}
     ${T(180, 184, 'A different password for each', { size: 17, anchor: 'middle', weight: 900 })}
     ${['Shop', 'Email', 'Bank'].map((t, i) => `${i === 0 ? box(14 + i * 116, 200, 104, 60, { dash: true }) : hlBox(14 + i * 116, 200, 104, 60, 10)}${T(66 + i * 116, 236, t, { size: 17, anchor: 'middle', weight: 800, cls: i === 0 ? 'svg-t' : 'svg-on-hl' })}`).join('')}
     ${T(180, 288, 'The shop leaks: only the shop is affected.', { size: 16, anchor: 'middle', weight: 700, cls: 'svg-m' })}`,
    'Top: the same password for the shop, the email and the bank. When the shop leaks it, every door opens. Bottom: a different password for each. When the shop leaks, only the shop account is affected; the email and the bank stay locked.'),
  'leak-flow': flowSteps('leak-flow', 'What happens after a website leaks passwords.',
    ['A website is hacked', 'A list of emails and passwords leaks', 'Criminals try them on other sites', 'You change it, and use different ones'],
    ['Step 1: a website you once used is hacked. This is not your fault.', 'Step 2: a list of email addresses and passwords is copied and shared or sold.', 'Step 3: criminals try the same email and password on email accounts, banks and shops.', 'Step 4: you check, change the leaked password everywhere you used it, and from now on use a different password for each account.']),
  'notebook': one('notebook', 'A password manager is a locked notebook for all your passwords.', 280,
    `<rect x="70" y="20" width="220" height="190" rx="14" class="svg-box" stroke-width="4"/>${[0, 1, 2, 3].map((i) => `<line x1="96" x2="264" y1="${66 + i * 34}" y2="${66 + i * 34}" class="svg-line" stroke-width="2"/>`).join('')}
     ${T(100, 58, 'Bank  ••••••••', { size: 16, weight: 700 })}${T(100, 92, 'Email  ••••••••', { size: 16, weight: 700 })}${T(100, 126, 'Shop  ••••••••', { size: 16, weight: 700 })}
     <rect x="160" y="168" width="40" height="34" rx="6" class="svg-hl"/><path d="M168 168 V158 a12 12 0 0 1 24 0 V168" style="fill:none;stroke:var(--fg);stroke-width:5"/>
     ${T(180, 244, 'One lock to remember: your phone’s', { size: 16.5, anchor: 'middle', weight: 800 })}${T(180, 266, 'code or face. It fills in the rest.', { size: 16.5, anchor: 'middle', weight: 800 })}`,
    'A locked notebook with lines for bank, email and shop passwords, all hidden. One lock on the notebook. You only remember one thing, for example your phone’s code or your face, and the password manager fills in the rest.'),
  'pm-setup': flowSteps('pm-setup', 'Setting up the password manager that is already on your phone.',
    ['Open the built-in manager', 'Check it is switched on', 'Let it create a new password', 'Fix weak or leaked ones, one a week'],
    ['Step 1: open the password manager your phone already has. On iPhone it is the Passwords app. On Android it is Google Password Manager.', 'Step 2: check that the phone is allowed to fill in and save passwords for you.', 'Step 3: next time you sign up somewhere, let the phone suggest a strong password, and save it.', 'Step 4: the manager can warn you about weak, reused or leaked passwords. Fix one each week, starting with email and bank. No rush.']),
  'master-key': one('master-key', 'Your email can reset all your other passwords.', 290,
    `${node(110, 110, 140, 60, 'Your email', { hl: true })}
     ${[['Bank', 20, 14], ['Shop', 240, 14], ['Photos', 20, 216], ['Social', 240, 216]].map(([t, x, y]) => `${box(x, y, 100, 56)}${T(x + 50, y + 34, t, { size: 17, anchor: 'middle', weight: 800 })}`).join('')}
     ${arrow('master-key', 140, 110, 100, 72)}${arrow('master-key', 220, 110, 260, 72)}${arrow('master-key', 140, 170, 100, 214)}${arrow('master-key', 220, 170, 260, 214)}
     ${T(180, 100, '“Forgot password?”', { size: 14, anchor: 'middle', cls: 'svg-m', weight: 700 })}`,
    'Your email in the middle, with arrows to bank, shop, photos and social media. The arrows are the “forgot password?” links: they send a reset link to your email. Whoever controls your email can reset the others, so your email needs the strongest protection.'),
  ...visuals2,
  ...visuals3,
};

export function renderVisual(name, captionHTML = '') {
  const v = visuals[name]; if (!v) throw new Error('unknown visual ' + name);
  const cap = captionHTML ? `<figcaption>${captionHTML}</figcaption>` : '';
  if (v.kind === 'svg') return `<figure class="fig" data-figure="${name}">${v.svg}${cap}<details><summary>Read the picture as text</summary><p>${e(v.text)}</p></details></figure>`;
  return `<figure class="fig steps" data-figure="${name}" data-steps="${v.steps.length}" aria-label="${e(v.alt)}">${v.steps.map((s, i) => `<div class="step" data-step="${i}"><div aria-hidden="true">${s.svg}</div><p class="step-text">${e(s.text)}</p></div>`).join('')}<div class="steps-nav" hidden><span class="count" aria-live="polite">1 of ${v.steps.length}</span><button type="button" class="btn btn-quiet btn-small" data-prev>Back</button><button type="button" class="btn btn-primary btn-small" data-next>Next step</button></div>${cap}</figure>`;
}
