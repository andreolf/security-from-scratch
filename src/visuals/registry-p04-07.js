// Figures for Phases 04–07. Same rules as registry.js: every picture ships with its words.
import { T, box, hlBox, arrow, svg } from './svg.js';
const W = 360;
const steps = (id, alt, list) => ({ kind: 'steps', alt, steps: list.map(([body, text, h = 200]) => ({ svg: svg(id, W, h, body, text), text })) });
const one = (id, alt, h, body, text) => ({ kind: 'svg', alt, text, svg: svg(id, W, h, body, alt) });
const node = (x, y, w, h, label, opt = {}) => `${box(x, y, w, h, opt)}${T(x + w / 2, y + h / 2 + 6 - (Array.isArray(label) ? (label.length - 1) * 11 : 0), label, { size: opt.size || 18, anchor: 'middle', weight: 800, cls: opt.hl ? 'svg-on-hl' : 'svg-t' })}`;
const flow = (id, labels, active, { y0 = 12, gap = 58, h = 44 } = {}) => labels.map((l, i) => { const y = y0 + i * gap; return node(30, y, 300, h, l, { hl: i === active, size: l.length > 26 ? 16 : 18 }) + (i < labels.length - 1 ? arrow(id, 180, y + h, 180, y + gap - 2) : ''); }).join('');
const flowSteps = (id, alt, labels, texts) => steps(id, alt, labels.map((_, i) => [flow(id, labels, i), texts[i], 12 + labels.length * 58]));
const cross = (x, y, s = 16) => `<path d="M${x - s} ${y - s}L${x + s} ${y + s}M${x + s} ${y - s}L${x - s} ${y + s}" style="stroke:var(--danger);stroke-width:5;stroke-linecap:round"/>`;
const tick = (x, y, s = 16) => `<path d="M${x - s} ${y}L${x - s / 3} ${y + s * .7}L${x + s} ${y - s * .7}" style="stroke:var(--fg);stroke-width:5;stroke-linecap:round;stroke-linejoin:round;fill:none"/>`;
const phone = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="22" class="svg-box" stroke-width="4"/><rect x="${x + w / 2 - 22}" y="${y + 10}" width="44" height="7" rx="3.5" style="fill:var(--line-strong)"/>`;
// A checklist: rows with a tick (good) or a cross (warning sign).
const list = (rows, { y0 = 14, gap = 56, hl = -1 } = {}) => rows.map(([good, t], i) => { const y = y0 + i * gap; return `${i === hl ? hlBox(12, y, 336, 46, 10) : box(12, y, 336, 46, { dash: !good })}${good ? tick(36, y + 23, 10) : cross(36, y + 23, 9)}${T(60, y + 29, t, { size: 16.5, weight: 800, cls: i === hl ? 'svg-on-hl' : 'svg-t' })}`; }).join('');

export const visuals2 = {
  // ---------- Phase 04 ----------
  'two-locks': one('two-locks', 'Two-step sign-in: a password plus a second proof.', 280,
    `${node(14, 20, 150, 70, ['1. Password', 'something you know'], { size: 16 })}${T(180, 62, '+', { size: 34, anchor: 'middle', weight: 900 })}${node(196, 20, 150, 70, ['2. Your phone', 'something you have'], { size: 16, hl: true })}
     ${arrow('two-locks', 180, 98, 180, 140)}${node(80, 144, 200, 50, 'You get in')}
     ${T(180, 230, ['A thief with only your password', 'is stuck at the second lock.'], { size: 16.5, anchor: 'middle', weight: 700 })}`,
    'Two boxes: first, your password, something you know; plus second, your phone, something you have. Together they let you in. A thief who only has your password is stuck at the second lock.'),
  'code-rule': flowSteps('code-rule', 'Who should ever see a sign-in code: only you.',
    ['You start signing in yourself', 'A code arrives on your phone', 'You type it in, on that same screen', 'Anyone who asks for it = a scam'],
    ['Step 1: a code is only useful when you yourself are signing in to something, right now.', 'Step 2: the code arrives by text message or in an app. It is a key to your account.', 'Step 3: you type it into the screen where you are signing in. You never read it out or send it to anyone.', 'Step 4: if a caller, a message or even a “bank” asks you for the code, it is a scam. Hang up. Real banks, TWINT and the police never ask for it.']),
  'mfa-setup': flowSteps('mfa-setup', 'Turning on two-step sign-in for your email.',
    ['Open your account settings', 'Find “Security” or “Sign-in”', 'Turn on two-step sign-in', 'Save a spare way back in'],
    ['Step 1: open the settings of your email account, on your phone or the email website.', 'Step 2: look for a section called Security, or Sign-in & Security.', 'Step 3: turn on two-step sign-in (Google calls it 2-Step Verification, Apple calls it two-factor authentication) and follow the steps on screen.', 'Step 4: set up a spare way back in, such as backup codes or a recovery contact. Lesson 04.05 explains how.']),
  'passkey': one('passkey', 'A passkey: your phone unlocks the real site, and a fake site gets nothing.', 300,
    `${phone(14, 14, 120, 200)}${T(74, 96, ['Face,', 'finger', 'or code'], { size: 16, anchor: 'middle', weight: 800 })}
     ${arrow('passkey', 140, 70, 214, 56, { acc: true })}${hlBox(220, 30, 128, 50, 10)}${T(284, 61, 'Real site', { size: 17, anchor: 'middle', weight: 900, cls: 'svg-on-hl' })}${tick(300, 100, 12)}
     ${arrow('passkey', 140, 160, 214, 176)}${box(220, 150, 128, 50, { dash: true })}${T(284, 181, 'Fake site', { size: 17, anchor: 'middle', weight: 900 })}${cross(300, 224, 11)}
     ${T(180, 272, 'Nothing to type, nothing to steal.', { size: 16.5, anchor: 'middle', weight: 800 })}`,
    'Your phone, unlocked with your face, finger or code, signs you in to the real website. A fake website that looks the same gets nothing, because the passkey only works for the site it was made for. There is nothing to type and nothing to steal.'),
  'spare-key': one('spare-key', 'Keep a spare key: backup codes on paper and a recovery contact.', 280,
    `${box(14, 20, 160, 150)}${T(94, 50, 'Backup codes', { size: 17, anchor: 'middle', weight: 900 })}${['1234 5678', '2345 6789', '3456 7890'].map((c, i) => T(94, 84 + i * 28, c, { size: 16, anchor: 'middle', weight: 700, cls: 'svg-m' })).join('')}
     ${box(188, 20, 160, 150)}${T(268, 50, 'Recovery contact', { size: 16, anchor: 'middle', weight: 900 })}${T(268, 96, ['Someone you trust', 'who can help you', 'get back in'], { size: 15.5, anchor: 'middle', weight: 700 })}
     ${hlBox(14, 190, 334, 70, 10)}${T(181, 220, ['Keep codes with your passport.', 'Never give them to anyone who asks.'], { size: 16, anchor: 'middle', weight: 800, cls: 'svg-on-hl' })}`,
    'Left: a paper with backup codes (example numbers only). Right: a recovery contact, someone you trust who can help you get back into your account. Below: keep the codes with your passport or other important papers, and never give them to anyone who asks.'),

  // ---------- Phase 05 ----------
  'update-holes': one('update-holes', 'An update closes holes in your phone’s defences.', 260,
    `${box(14, 20, 150, 150, { dash: true })}${T(89, 50, 'Old version', { size: 17, anchor: 'middle', weight: 900 })}${[0, 1, 2].map((i) => `<circle cx="${50 + i * 38}" cy="110" r="12" style="fill:var(--bg);stroke:var(--danger);stroke-width:4"/>`).join('')}${T(89, 152, 'holes', { size: 15, anchor: 'middle', cls: 'svg-m', weight: 700 })}
     ${arrow('update-holes', 170, 95, 190, 95, { acc: true })}
     ${hlBox(196, 20, 150, 150, 10)}${T(271, 50, 'Updated', { size: 17, anchor: 'middle', weight: 900, cls: 'svg-on-hl' })}${tick(271, 106, 18)}${T(271, 152, 'holes closed', { size: 15, anchor: 'middle', cls: 'svg-on-hl', weight: 700 })}
     ${T(180, 214, ['Turn on automatic updates,', 'then you don’t have to remember.'], { size: 16.5, anchor: 'middle', weight: 800 })}`,
    'Left: an old version of the software with holes in it. Arrow to the right: the updated version, with the holes closed. Underneath: turn on automatic updates, then you don’t have to remember.'),
  'update-steps': flowSteps('update-steps', 'Turning on automatic updates.',
    ['Plug in your phone, use Wi-Fi', 'Open Settings', 'Find “Software update”', 'Turn on automatic updates'],
    ['Step 1: updates are large. Plug in your phone and use your home Wi-Fi.', 'Step 2: open the Settings app on your phone or computer.', 'Step 3: find the software update section. Its exact name differs on iPhone, Android, Windows and Mac. The steps for each are below.', 'Step 4: turn on automatic updates, so your device installs them for you, for example overnight.']),
  'fake-virus': one('fake-virus', 'A loud “virus” pop-up with a phone number is the scam itself.', 300,
    `<rect x="20" y="14" width="320" height="200" rx="8" class="svg-box" stroke-width="4"/><rect x="20" y="14" width="320" height="36" rx="8" style="fill:var(--danger)"/>${T(180, 39, 'WARNING! VIRUS FOUND!', { size: 17, anchor: 'middle', weight: 900, cls: 'svg-on-danger' })}
     ${T(180, 84, ['Your computer is blocked.', 'Call support now:', '+00 000 000 000'], { size: 17, anchor: 'middle', weight: 800 })}${T(180, 180, 'Do not close this window!', { size: 15, anchor: 'middle', cls: 'svg-m', weight: 700 })}
     ${hlBox(20, 232, 320, 56, 10)}${T(180, 266, 'Don’t call. Close it. Ask your helper.', { size: 16.5, anchor: 'middle', weight: 900, cls: 'svg-on-hl' })}`,
    'A fake warning window, with a red bar saying “Warning! Virus found!”, the text “Your computer is blocked. Call support now” with a phone number, and “Do not close this window!”. Below, the safe answer: don’t call, close it, ask your helper.'),
  'remote-control': flowSteps('remote-control', 'How a remote-control scam works, and where you can stop it.',
    ['A call or pop-up: “we will help”', '“Install this app for us”', 'They see and control your screen', 'They open your banking'],
    ['Step 1: a caller says they are the police, your bank or technical support, or a pop-up tells you to call. They offer to help.', 'Step 2: they ask you to install a “support” or “security” app. This is the moment to stop and hang up.', 'Step 3: the app lets them see your screen and control your phone or computer from far away.', 'Step 4: they can then open your online banking and move money. Never let someone who contacted you control your device.']),
  'app-store-check': one('app-store-check', 'Four checks before you install an app.', 250,
    list([[true, 'From the App Store or Google Play'], [true, 'The right maker’s name'], [true, 'You went looking for it yourself'], [false, 'Not because a caller told you to']], { hl: 0 }),
    'Four checks before installing an app: it comes from the official App Store or Google Play; the maker’s name is right; you went looking for it yourself; and you are not installing it because a caller or message told you to.'),

  // ---------- Phase 06 ----------
  'new-number': flowSteps('new-number', 'The “Hi Mum, this is my new number” message, and how to check it.',
    ['“Hi Mum, my phone broke”', '“Save my new number”', '“Can you pay a bill for me?”', 'You call the OLD number'],
    ['Step 1: a message from an unknown number: “Hi Mum, my phone broke, this is my new number.”', 'Step 2: they ask you to save the new number and delete the old one.', 'Step 3: soon there is an urgent problem: a bill to pay today, and they can’t use their banking app.', 'Step 4: you call your child on the old number you already have, or ask them a question only they would know. The real person answers.']),
  'whatsapp-pin': one('whatsapp-pin', 'Two-step verification: a PIN only you know protects your WhatsApp.', 260,
    `${phone(110, 10, 140, 230)}${T(180, 64, 'WhatsApp', { size: 16, anchor: 'middle', weight: 800 })}${T(180, 92, 'Enter your PIN', { size: 15, anchor: 'middle', cls: 'svg-m', weight: 700 })}
     ${[0, 1, 2, 3, 4, 5].map((i) => `${hlBox(122 + i * 20, 110, 16, 28, 4)}${T(130 + i * 20, 130, '•', { size: 16, anchor: 'middle', weight: 900, cls: 'svg-on-hl' })}`).join('')}
     ${T(180, 176, ['6 digits', 'you choose'], { size: 15, anchor: 'middle', weight: 800 })}`,
    'A phone showing WhatsApp asking: enter your PIN, with six hidden digits. With two-step verification, anyone who tries to set up your WhatsApp on another phone also needs this 6-digit PIN, which only you know.'),
  'code-theft': flowSteps('code-theft', 'How a WhatsApp account is stolen with a code.',
    ['They try to sign in as you', 'WhatsApp sends YOU a code', '“Sorry, I sent it to you by mistake”', 'You forward it: they take over'],
    ['Step 1: a criminal tries to set up WhatsApp with your phone number on their own phone.', 'Step 2: WhatsApp sends a 6-digit code by text to your phone, the real owner.', 'Step 3: a message, often from a friend’s hacked account, says: “I sent you a code by mistake, please send it back.”', 'Step 4: if you send the code, they take over your WhatsApp and write to all your contacts. The safe move at step 3: never send a code to anyone.']),
  'share-less': one('share-less', 'Three details in a public post that help scammers.', 300,
    `${box(14, 14, 332, 150)}${T(30, 44, 'Public post:', { size: 15, weight: 800, cls: 'svg-m' })}${T(30, 76, ['“Off to Spain for 3 weeks!', 'Happy 80th to me, and', 'cuddles to our dog Bello!”'], { size: 16.5, weight: 800 })}
     ${[['Empty home', 'for 3 weeks'], ['Birthday', 'and age'], ['Pet name, often', 'in passwords']].map(([a, b], i) => `${hlBox(14 + i * 113, 180, 106, 66, 8)}${T(67 + i * 113, 206, [a, b], { size: 14, anchor: 'middle', weight: 800, cls: 'svg-on-hl' })}`).join('')}
     ${T(180, 282, 'Share holidays after you are back.', { size: 16, anchor: 'middle', weight: 800 })}`,
    'A public post: “Off to Spain for 3 weeks! Happy 80th to me, and cuddles to our dog Bello!” Three highlighted details help scammers: your home is empty for three weeks; your birthday and age; and your pet’s name, which people often use in passwords. Tip: share holiday photos after you are back.'),
  'friend-clone': one('friend-clone', 'A copied profile: same photo and name, new account.', 290,
    `${box(14, 14, 160, 170)}<circle cx="94" cy="62" r="28" class="svg-box" stroke-width="3"/>${T(94, 118, 'Anna Meier', { size: 16, anchor: 'middle', weight: 900 })}${T(94, 144, 'friends for 8 years', { size: 14, anchor: 'middle', cls: 'svg-m', weight: 700 })}
     ${box(186, 14, 160, 170, { dash: true })}<circle cx="266" cy="62" r="28" class="svg-box" stroke-width="3"/>${T(266, 118, 'Anna Meier', { size: 16, anchor: 'middle', weight: 900 })}${T(266, 144, 'new request today', { size: 14, anchor: 'middle', cls: 'svg-m', weight: 700 })}${cross(330, 30, 9)}
     ${hlBox(14, 200, 332, 70, 10)}${T(180, 230, ['Already friends? A second request', 'is a warning sign. Ask her by phone.'], { size: 15.5, anchor: 'middle', weight: 800, cls: 'svg-on-hl' })}`,
    'Two profiles with the same photo and the same name, Anna Meier. The real one: friends for eight years. The copy: a new friend request today. If you are already friends, a second request is a warning sign. Ask her by phone.'),
  'celeb-ad': one('celeb-ad', 'A fake advert with a famous face.', 300,
    `${box(14, 14, 332, 180)}${T(30, 42, 'Sponsored', { size: 14, weight: 800, cls: 'svg-m' })}<circle cx="70" cy="104" r="34" class="svg-box" stroke-width="3"/>${T(70, 110, 'TV star', { size: 13, anchor: 'middle', weight: 800 })}
     ${T(120, 82, ['“My secret: I turned', 'CHF 250 into a fortune.', 'Banks hate this!”'], { size: 16, weight: 800 })}
     ${hlBox(14, 206, 332, 80, 10)}${T(180, 236, ['Famous people don’t give money tips', 'in ads. Faces and voices can be fake.'], { size: 15.5, anchor: 'middle', weight: 800, cls: 'svg-on-hl' })}`,
    'A sponsored advert with the photo of a TV star and the text: “My secret: I turned CHF 250 into a fortune. Banks hate this!” The lesson: famous people don’t give money tips in adverts, and faces and voices can be faked.'),

  // ---------- Phase 07 ----------
  'shop-check': one('shop-check', 'Warning signs of a fake online shop.', 300,
    list([[false, 'Prices far too good to be true'], [false, 'No real address or company name'], [false, 'Only bank transfer or crypto'], [false, 'Brand-new site, pushy countdown'], [true, 'Check reviews and the address first']], { gap: 56, hl: 4 }),
    'Warning signs of a fake shop: prices far too good to be true; no real address or company name; payment only by bank transfer or crypto; a brand-new website with a pushy countdown. The safe step: check reviews and the address before you pay.'),
  'card-safe': flowSteps('card-safe', 'Paying by card online, safely.',
    ['Type the shop address yourself', 'Pay by card, not by transfer', 'Confirm only what YOU started', 'Check your statement each month'],
    ['Step 1: open the shop through your own bookmark or by typing its address, not through an advert or a message.', 'Step 2: pay by card or another method with buyer protection. Avoid bank transfers to shops you don’t know.', 'Step 3: your bank may ask you to confirm the payment in its app. Only confirm a payment you started yourself, with the right shop and amount.', 'Step 4: once a month, read your card statement. If you see a payment you don’t recognise, call the number on your card.']),
  'twint-safe': one('twint-safe', 'TWINT, the safe way.', 300,
    list([[true, 'Scan QR codes only in the TWINT app'], [true, 'Check name and amount before paying'], [false, 'Never pay with a code someone sent'], [false, 'Never share your PIN or security code'], [true, 'Scammed? Call your bank at once']], { hl: 0 }),
    'TWINT, the safe way: scan TWINT QR codes only inside the TWINT app; check the name and the amount before you pay; never pay with a code someone sent you; never share your PIN or security code; if you were scammed, call your bank at once.'),
  'marketplace-buyer': flowSteps('marketplace-buyer', 'The fake buyer with a payment link.',
    ['You sell an item online', '“I’ll buy it! Here is a link to get paid”', 'The link asks for card details or a code', 'Real payments need no link from you'],
    ['Step 1: you put an item up for sale on a marketplace.', 'Step 2: a friendly “buyer” agrees at once and sends a link, for example to a delivery or payment service, so you can “receive” the money.', 'Step 3: the link opens a fake page that asks for your card details, your banking login or a code.', 'Step 4: to receive money you never need to enter card details or codes. Stop, and only use the marketplace’s own messages and payment system.']),
  'parcel-check': flowSteps('parcel-check', 'Checking a parcel message, the safe way.',
    ['“Your parcel is waiting”', 'Don’t tap the link', 'Open the post app yourself', 'Nothing there? It was fake'],
    ['Step 1: a text or email says your parcel is on hold and asks for a small fee or new details.', 'Step 2: don’t tap the link and don’t reply.', 'Step 3: open the delivery company’s own app, or type its address yourself, and enter the tracking number if you have one.', 'Step 4: if there is no parcel and no fee there, the message was fake. Delete it.']),
  'ecc-help': flowSteps('ecc-help', 'Getting help when a shop in another European country does not deliver.',
    ['The shop doesn’t deliver', 'Write to the shop first', 'Contact your European Consumer Centre', 'Free advice, in your language'],
    ['Step 1: you paid a shop in another European country, and nothing arrived, or it was faulty.', 'Step 2: write to the shop first, and keep copies of your order, payment and messages.', 'Step 3: if the shop doesn’t help, contact the European Consumer Centre in your own country.', 'Step 4: the centres give free help with problems with traders in other European countries.']),
};
