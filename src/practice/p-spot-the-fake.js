import { h } from '../util.js';
// Made-up messages only. Links are shown as text and never open. Signs follow the FTC and BACS phishing advice.
export const SETS = {
  sms: [
    { from: '+41 76 000 00 00', meta: 'Text message', body: 'Swiss Post: your parcel is on hold. Pay the CHF 1.99 customs fee within 24 hours: post-ch-delivery.info/pay', fake: true, signs: ['You were not expecting a parcel fee.', 'It hurries you: “within 24 hours”.', 'The link’s real website name is post-ch-delivery.info, not the post office’s own address.'], safe: 'Delete it. If you are expecting a parcel, check in the post office’s own app or website, which you open yourself.' },
    { from: 'Anna (saved in your contacts)', meta: 'Text message', body: 'Hi Mum, I’m at the shop. Do you still need milk?', fake: false, signs: ['It comes from a contact you saved yourself.', 'It asks for nothing: no money, no code, no link.'], safe: 'This looks normal. If a message like this ever asks for money, call Anna on her usual number first.' },
    { from: 'YourBank', meta: 'Text message', body: 'Your card has been blocked for your security. Confirm your details to unblock it: yourbank-secure-check.com', fake: true, signs: ['It makes you worried about your money.', 'It asks you to “confirm your details” through a link.', 'The Swiss federal cyber office says no bank will ever ask you by email to change passwords or verify card details, and the same caution applies to texts.'], safe: 'Don’t tap. Call your bank on the number on the back of your card.' },
    { from: '+1 202 555 0100', meta: 'Text message', body: 'Your 6-digit code is 481 552. Don’t share this code with anyone.', fake: false, signs: ['A code like this is normal if YOU just tried to sign in somewhere.', 'If you did not ask for it, someone may be trying your account. Still never share it.'], safe: 'If you did not ask for a code, ignore it, and nobody gets it. If someone then calls asking for it, hang up.' },
  ],
  email: [
    { from: 'Support <support@mybank-help.net>', meta: 'Subject: Unusual sign-in detected', body: 'Dear customer, we noticed suspicious activity. Your account will be closed in 24 hours unless you confirm your password here: mybank-help.net/confirm', fake: true, signs: ['“Dear customer” instead of your name.', 'A threat and a deadline: “closed in 24 hours”.', 'It asks for your password through a link.'], safe: 'Delete it, or report it. To check your account, open your banking app or your saved bookmark.' },
    { from: 'Garden Club <newsletter@gardenclub.example>', meta: 'Subject: Spring plant swap on Saturday', body: 'Hello Rosa, our plant swap is on Saturday at 10 at the community hall. Bring cuttings if you have some! See you there.', fake: false, signs: ['You know this club and expect its newsletter.', 'It uses your name and asks for nothing.'], safe: 'This looks normal. Even so, you never need to click anything to enjoy it.' },
    { from: 'Accounts <invoice@billing-dept.example>', meta: 'Subject: Invoice 88231 overdue (attachment: Invoice_88231.zip)', body: 'Please find the overdue invoice attached. Payment must be made today to avoid legal action.', fake: true, signs: ['An invoice you do not recognise.', 'A zipped attachment you did not expect.', 'Pressure: “today”, “legal action”.'], safe: 'Don’t open the attachment. If you think you might owe something, contact the company with details you already have.' },
    { from: 'TWINT <info@twint-support.example>', meta: 'Subject: Your TWINT account needs verification', body: 'To keep using TWINT, please reply with your TWINT PIN and the security code we sent you.', fake: true, signs: ['TWINT says its staff will never ask you to share passwords or access details.', 'It asks for your PIN and security code.'], safe: 'Never send a PIN or code. You can forward suspicious TWINT emails to abuse@twint.ch, then delete them.' },
    { from: 'Swiss Lottery Winner Team', meta: 'Subject: Congratulations! You have won CHF 850,000', body: 'You were selected in our international draw. To release your prize, pay a small processing fee of CHF 250.', fake: true, signs: ['You cannot win a lottery you never entered.', 'You must pay a fee to “release” money. That is the scam.'], safe: 'Delete it. Never pay to receive a prize.' },
  ],
};
export default function (body, ctx) {
  const set = SETS[ctx.args.set] || SETS.sms; let i = 0, right = 0;
  const card = h('div', { 'aria-live': 'polite' }); const row = h('div', { class: 'choice-row' }); const fb = h('div', { 'aria-live': 'polite' });
  function show() {
    const m = set[i]; fb.replaceChildren(); ctx.status(`Message ${i + 1} of ${set.length}`);
    card.replaceChildren(h('div', { class: 'msg-card', 'data-testid': 'stf-msg' }, h('span', { class: 'from' }, `From: ${m.from}`), h('span', { class: 'meta' }, m.meta), h('div', { class: 'body' }, m.body)));
    row.replaceChildren(h('button', { class: 'btn btn-quiet', type: 'button', 'data-testid': 'stf-real', onclick: () => pick(false) }, 'Looks real'), h('button', { class: 'btn btn-quiet', type: 'button', 'data-testid': 'stf-fake', onclick: () => pick(true) }, 'Looks fake'));
  }
  function pick(saysFake) {
    const m = set[i]; const ok = saysFake === m.fake; if (ok) right++;
    row.querySelectorAll('button').forEach((b) => (b.disabled = true));
    fb.replaceChildren(h('div', { class: 'feedback' + (m.fake ? ' bad' : '') }, h('b', {}, `${ok ? 'Well spotted.' : 'Good try.'} This one is ${m.fake ? 'fake' : 'most likely real'}.`),
      h('ul', {}, ...m.signs.map((s) => h('li', {}, s))), h('p', { style: 'margin:6px 0 0' }, h('b', {}, 'The safe thing to do: '), m.safe)),
      h('button', { class: 'btn btn-primary', type: 'button', 'data-testid': 'stf-next', onclick: next }, i < set.length - 1 ? 'Next message' : 'See my summary'));
  }
  function next() {
    i++; if (i < set.length) return show();
    card.replaceChildren(h('div', { class: 'feedback' }, h('b', {}, `You judged ${right} of ${set.length} the same way we did.`), h('p', { style: 'margin:6px 0 0' }, 'You don’t need a perfect score. When you are not sure, you never have to tap: open the app or website yourself, or call a number you already have.')));
    row.replaceChildren(h('button', { class: 'btn btn-quiet', type: 'button', onclick: () => { i = 0; right = 0; show(); } }, 'Start again'));
    fb.replaceChildren(); ctx.status('Finished'); ctx.done();
  }
  body.append(h('p', { class: 'muted' }, 'All messages are made up. The links are only text: nothing here can be opened.'), card, row, fb); show();
}
