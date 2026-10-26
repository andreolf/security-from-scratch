// Figures for Phases 08–12. Same rules as registry.js: every picture ships with its words.
import { T, box, hlBox, arrow, svg } from './svg.js';
const W = 360;
const steps = (id, alt, list) => ({ kind: 'steps', alt, steps: list.map(([body, text, h = 200]) => ({ svg: svg(id, W, h, body, text), text })) });
const one = (id, alt, h, body, text) => ({ kind: 'svg', alt, text, svg: svg(id, W, h, body, alt) });
const node = (x, y, w, h, label, opt = {}) => `${box(x, y, w, h, opt)}${T(x + w / 2, y + h / 2 + 6 - (Array.isArray(label) ? (label.length - 1) * 11 : 0), label, { size: opt.size || 18, anchor: 'middle', weight: 800, cls: opt.hl ? 'svg-on-hl' : 'svg-t' })}`;
const flow = (id, labels, active, { y0 = 12, gap = 58, h = 44 } = {}) => labels.map((l, i) => { const y = y0 + i * gap; return node(30, y, 300, h, l, { hl: i === active, size: l.length > 26 ? 16 : 18 }) + (i < labels.length - 1 ? arrow(id, 180, y + h, 180, y + gap - 2) : ''); }).join('');
const flowSteps = (id, alt, labels, texts) => steps(id, alt, labels.map((_, i) => [flow(id, labels, i), texts[i], 12 + labels.length * 58]));
const cross = (x, y, s = 16) => `<path d="M${x - s} ${y - s}L${x + s} ${y + s}M${x + s} ${y - s}L${x - s} ${y + s}" style="stroke:var(--danger);stroke-width:5;stroke-linecap:round"/>`;
const tick = (x, y, s = 16) => `<path d="M${x - s} ${y}L${x - s / 3} ${y + s * .7}L${x + s} ${y - s * .7}" style="stroke:var(--fg);stroke-width:5;stroke-linecap:round;stroke-linejoin:round;fill:none"/>`;
const list = (rows, { y0 = 14, gap = 56, hl = -1 } = {}) => rows.map(([good, t], i) => { const y = y0 + i * gap; return `${i === hl ? hlBox(12, y, 336, 46, 10) : box(12, y, 336, 46, { dash: !good })}${good ? tick(36, y + 23, 10) : cross(36, y + 23, 9)}${T(58, y + 29, t, { size: 16, weight: 800, cls: i === hl ? 'svg-on-hl' : 'svg-t' })}`; }).join('');
const checklist = (id, alt, rows, hl, text) => one(id, alt, 14 + rows.length * 56, list(rows, { hl }), text);

export const visuals3 = {
  // ---------- Phase 08 ----------
  'romance-path': flowSteps('romance-path', 'How a romance scam usually unfolds.',
    ['A charming stranger writes', 'Daily chats, love comes fast', 'Somehow you never meet', 'Then an emergency needs money'],
    ['Step 1: a friendly stranger writes to you on social media, a dating site or a messaging app.', 'Step 2: they write every day, pay compliments and soon talk about love and a future together.', 'Step 3: there is always a reason you can’t meet: they work abroad, on an oil rig, in the army.', 'Step 4: then comes an emergency, such as an accident, an illness or a ticket, and they ask for money. Never send money to someone you have never met in person.']),
  'not-your-fault': checklist('not-your-fault', 'Four true things about being scammed.',
    [[true, 'Scammers use feelings, not stupidity'], [true, 'Their scripts are practised'], [true, 'Police hunt criminals, not victims'], [true, 'Telling someone stops the harm']], 3,
    'Four true things: scammers use feelings, not stupidity; their scripts are practised and organised; the police hunt criminals, not victims; and telling someone is how the harm stops.'),
  'guaranteed-flags': checklist('guaranteed-flags', 'Warning signs of an investment scam.',
    [[false, '“Guaranteed” or “risk-free”'], [false, 'Big profits, fast, little effort'], [false, '“Act now, places are limited”'], [false, 'Contacted you out of the blue'], [true, 'Check the licence. Ask someone.']], 4,
    'Warning signs of an investment scam: “guaranteed” or “risk-free” returns; big profits quickly with little effort; pressure to act now because places are limited; and an offer that came to you out of the blue. The safe step: check whether the firm is licensed, and talk it over with someone you trust.'),
  'trading-app': flowSteps('trading-app', 'The friendly “adviser” and the fake trading app.',
    ['An “adviser” offers to help', 'A slick app shows profits', '“Add more, it’s growing!”', 'Withdraw? Suddenly not possible'],
    ['Step 1: a friendly “adviser” or new online friend offers to show you how to invest.', 'Step 2: they send you to a website or app that looks professional and shows your money growing.', 'Step 3: they urge you to put in more, because the numbers look so good.', 'Step 4: when you try to take money out, it is blocked or needs a fee. The numbers were never real.']),
  'fee-trap': flowSteps('fee-trap', 'The fee trap: why paying “just one more fee” never works.',
    ['You want your money out', '“First pay a fee or a tax”', 'You pay. A new fee appears', 'Stop: pay nothing more'],
    ['Step 1: you ask to withdraw your money from the platform, or someone offers to get lost money back.', 'Step 2: you are told you must first pay a fee, a tax or a release charge.', 'Step 3: you pay, and a new reason to pay appears. It never ends.', 'Step 4: stop. Pay nothing more, keep the messages, and report it to the police.']),
  'trusted-test': flowSteps('trusted-test', 'The trusted-person test before money moves.',
    ['Someone wants your money', 'Tell one person you trust', 'Show them the messages', 'They worry? Then stop'],
    ['Step 1: someone you know only online, or a caller, asks you to send, move or invest money.', 'Step 2: before you do anything, tell one person you trust, such as a family member, a friend or your bank.', 'Step 3: show them the messages or tell them exactly what was said.', 'Step 4: if they are worried, stop. A real friend or real offer can wait a day. A scammer will push or ask for secrecy.']),
};
