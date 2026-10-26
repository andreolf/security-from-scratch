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
    [[true, 'They use feelings, not stupidity'], [true, 'Their scripts are practised'], [true, 'Police hunt criminals, not victims'], [true, 'Telling someone stops the harm']], 3,
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

  // ---------- Phase 09 ----------
  'voice-clone': flowSteps('voice-clone', 'How a cloned voice is used, and how you stop it.',
    ['A few seconds of voice online', 'Software copies the voice', '“Mum, I’m in trouble! Pay!”', 'Hang up. Call the known number'],
    ['Step 1: a short recording of someone’s voice, for example from a video on social media.', 'Step 2: voice-cloning software makes a voice that sounds just like them.', 'Step 3: the scammer calls you with that voice, in a hurry, and asks for money or help.', 'Step 4: hang up, and call the person back on the number you already have. Don’t trust the voice.']),
  'video-fake': checklist('video-fake', 'Possible signs of a faked video, and the safe step.',
    [[false, 'Lips not in sync with words'], [false, 'Odd eyes, teeth or hands'], [false, 'Lag or stiff movements'], [false, 'Acts unlike the real person'], [true, 'Hang up, call a known number']], 4,
    'Possible signs that a video is faked: the lips don’t match the words; the eyes, teeth or hands look odd; there is lag or the movements are stiff; the person behaves unlike themselves. But fakes keep improving, so the safe step is the same every time: hang up and call back on a number you know.'),
  'code-word': flowSteps('code-word', 'A family code word, step by step.',
    ['Choose a word together', 'Never post it or text it', 'Odd call? Ask for the word', 'No word? Hang up, call back'],
    ['Step 1: sit together and choose a word or short phrase that only your family knows, and that nobody could guess from social media.', 'Step 2: keep it out of messages and posts. Say it only face to face or on a call you started.', 'Step 3: if a call or message asks for money or help in a hurry, ask: “What is our word?”', 'Step 4: no word, a wrong word or an excuse? Hang up, and call the person back on the number you already have.']),
  'share-voice': checklist('share-voice', 'Leave less for scammers to copy.',
    [[true, 'Profile photo: “My contacts”'], [true, 'Accounts private, friends only'], [true, 'Fewer public videos with voice'], [false, 'Strangers as followers']], 0,
    'Leave less for scammers to copy: set your WhatsApp profile photo to “My contacts”; make your social media accounts private, for friends only; post fewer public videos with your voice; and don’t accept strangers as followers.'),

  // ---------- Phase 10 ----------
  'first-steps': flowSteps('first-steps', 'After a scam: the right order.',
    ['1. Stop all contact', '2. Call your bank now', '3. Report it', '4. Secure your email'],
    ['Step 1: stop replying, end the call, and don’t send anything more. Keep the messages.', 'Step 2: call your bank or card company at once to block cards and try to stop the payment. Minutes can matter.', 'Step 3: report it to the police, and to the right office where you live.', 'Step 4: change your email password from a safe device and turn on two-step sign-in. Then the other accounts.']),
  'bank-call': checklist('bank-call', 'What to say when you call your bank after a scam.',
    [[true, 'Call the number on your card'], [true, '“Block my cards and accounts”'], [true, '“Please stop this payment”'], [true, '“Can it be reversed?”'], [true, 'Note the time and the name']], 0,
    'When you call your bank after a scam: use the number on your card or your bank’s website; ask them to block your cards and accounts; ask them to stop the payment; ask whether it can be reversed; and note the time and the name of the person you spoke to.'),
  'report-where': checklist('report-where', 'Where to report a scam.',
    [[true, 'CH: local police, 117 if urgent'], [true, 'CH: also report to BACS'], [true, 'EU: your national police'], [true, 'US: ReportFraud.ftc.gov, IC3']], -1,
    'Where to report a scam. In Switzerland: your local police station, or 117 in an emergency, and also the federal cyber security office (BACS) online. In the EU: your national police; Europol lists each country’s reporting website. In the US: the FTC at ReportFraud.ftc.gov and the FBI at ic3.gov.'),
  'secure-email': flowSteps('secure-email', 'Securing your email after a scam.',
    ['Use a device you trust', 'New password for your email', 'Turn on two-step sign-in', 'Remove devices you don’t know'],
    ['Step 1: if a scammer had access to your computer, use another device you trust, such as your phone.', 'Step 2: change your email password first. Your email can reset all your other passwords.', 'Step 3: turn on two-step sign-in, so a stolen password alone is not enough.', 'Step 4: in your account settings, remove any devices you don’t recognise. Then change passwords for your bank and other accounts.']),
  'recovery-flags': checklist('recovery-flags', 'Signs of a “we can get your money back” scam.',
    [[false, 'They contact you out of the blue'], [false, '“Pay a fee first”'], [false, '“We work with Interpol / the FBI”'], [false, '“Act today or lose it”'], [true, 'Real agencies never charge']], 4,
    'Signs of a recovery scam: someone contacts you out of the blue about money you lost; they want a fee first; they claim to work with Interpol, the FBI or a regulator; they push you to act today. Real agencies never charge you to get your money back.'),
  'support-circle': checklist('support-circle', 'Support after a scam.',
    [[true, 'Talk to someone you trust'], [true, 'CH: 143, Die Dargebotene Hand'], [true, 'US: AARP helpline 877-908-3360'], [true, 'Money worries: debt advice']], 0,
    'Support after a scam: talk to someone you trust. In Switzerland, Die Dargebotene Hand answers on 143, anonymously. In the US, the AARP Fraud Watch Network Helpline is 877-908-3360. If money is now a worry, contact a debt advice service, in Switzerland the one in your canton.'),
};
