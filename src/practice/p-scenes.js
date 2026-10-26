// "What would you do?": a made-up situation in a few turns (screens, chats, offers), same calm engine as the
// practice call. No timers. Nothing is sent, opened or installed.
import { h } from '../util.js';
export const SCENES = {
  popup: { who: 'On the screen', intro: 'You are reading the news on your computer.', turns: [
    ['Suddenly the whole screen turns red: “WARNING! Your computer is infected. Call Microsoft Support now on this number. Do not close this window!” A voice repeats it.', [
      ['Don’t call. Close the browser window.', true, 'Exactly. Real warnings from Microsoft or Apple never show a phone number. The page is just a website shouting.'],
      ['Call the number to be safe.', false, 'The number leads to the scammers. Real error messages never ask you to call.'],
      ['Click “OK” on the warning.', false, 'Clicking on the page can open more pop-ups or a download. Close the browser instead.']]],
    ['The window won’t close. It fills the whole screen.', [
      ['Quit the browser: on Windows Ctrl + Alt + Delete, then Task Manager; on a Mac Cmd + Option + Esc. Or restart the computer.', true, 'Yes. The page cannot really lock your computer. Quitting the browser or restarting ends it.'],
      ['Leave it on for a day until it stops.', false, 'No need to wait. Quit the browser or restart the computer.'],
      ['Call the number after all.', false, 'Still no. Calling is what the page wants.']]],
    ['Later, your phone rings: “Hello, this is technical support. We saw your computer has a virus.”', [
      ['Hang up. Real companies don’t call about viruses on my computer.', true, 'Right. Microsoft and other tech companies don’t call you out of the blue about problems with your computer.'],
      ['Ask them how they knew.', false, 'They don’t know anything. Any answer is part of the script. Just hang up.'],
      ['Let them check, as long as it’s free.', false, '“Free” checks are how they get control of your computer. Hang up.']]],
  ] },
  app: { who: 'The situation', intro: 'You are looking for an app.', turns: [
    ['A caller who says they are from your bank: “Please install the app ‘BankSecure Plus’ from this link I am sending you.”', [
      ['Say no and hang up. I only install apps I chose myself, from the official store.', true, 'Exactly. Banks never ask you to install an app through a link during a call.'],
      ['Install it while they wait on the line.', false, 'An app sent by a caller can give them control of your phone.'],
      ['Install it later, when they have hung up.', false, 'The app is just as dangerous later. Delete the message.']]],
    ['You want the app of your health insurance. You search in the App Store or Google Play and see two with the same logo.', [
      ['Check the maker’s name is the insurer’s, and compare with the insurer’s own website.', true, 'Good. Copycat apps use the same logo, but the maker’s name gives them away.'],
      ['Take the one with the bigger logo.', false, 'Logos are easy to copy. Check who made the app.'],
      ['Install both and see which works.', false, 'Installing a fake app, even briefly, can be risky. Check first.']]],
    ['A website says: “Your phone is slow! Download our cleaner app here (not from the store).”', [
      ['Close the page. I don’t install apps from websites that pop up.', true, 'Right. Install apps only from the App Store or Google Play.'],
      ['Download it, my phone is a bit slow.', false, 'Apps from outside the official store are a common way to spread harmful software.'],
      ['Tap “Allow” on everything it asks.', false, 'Never give permissions to an app you did not choose from the official store.']]],
  ] },
  newnumber: { who: 'WhatsApp, unknown number', intro: 'A message arrives on WhatsApp.', turns: [
    ['“Hi Mum, it’s me. My phone fell in the water, this is my new number. Save it and delete the old one 😊”', [
      ['Don’t save it yet. Call my child on the old number I already have.', true, 'Exactly. The old number is the one you know is real. A quick call clears it up.'],
      ['Reply: “Which child are you?”', false, 'Now they know you believe the story, and they will simply pick a name. Call the old number instead.'],
      ['Save the new number and delete the old one, as asked.', false, 'Deleting the old number removes your way to check. Keep it and call it.']]],
    ['“I can’t talk right now, my phone is broken. Please just write. It’s important.”', [
      ['Ask something only my child would know, that isn’t on social media. Or wait until I reach them another way.', true, 'Good. A control question, or a call to another family member, gives you the truth.'],
      ['Keep chatting to be kind.', false, 'Kindness is what they count on. Check first.'],
      ['Send them my bank details so they can pay me back later.', false, 'Never share bank details in a chat you haven’t checked.']]],
    ['“I have a bill that must be paid today. Can you transfer CHF 1,850? I’ll pay you back tomorrow.”', [
      ['No money because of a message. I call my child on the old number, or another family member.', true, 'Perfect. Never transfer money because of a message alone.'],
      ['Pay half, to be safe.', false, 'Any amount goes to the scammers. Check first.'],
      ['Send a voucher code instead.', false, 'Voucher and prepaid codes are like cash for scammers. Never.']]],
  ] },
  wacode: { who: 'WhatsApp, your friend Rosa', intro: 'A message arrives on WhatsApp, from a friend’s usual number.', turns: [
    ['A text message arrives with a WhatsApp code. A second later Rosa writes: “Oops, I sent my code to your number by mistake. Can you send it to me?”', [
      ['Don’t send it. A WhatsApp code is never for anyone else.', true, 'Exactly. WhatsApp says you should never share your verification code. Whoever has it can take over your account.'],
      ['Send it, it’s Rosa.', false, 'Rosa’s account may already be taken over. With your code, they would take yours too.'],
      ['Send only the first three numbers.', false, 'No part of a code is for anyone else.']]],
    ['“Please, it’s urgent! I’m locked out.”', [
      ['Call Rosa on the phone (not in WhatsApp) to check.', true, 'Good. A real call, on a number you know, tells you if it’s really her.'],
      ['Give in, she sounds stressed.', false, 'Stress is the trick. Call her instead.'],
      ['Forward the code to another friend to decide.', false, 'Forwarding spreads the risk. Keep the code to yourself.']]],
    ['On the phone, Rosa says: “That wasn’t me! Someone took over my WhatsApp.”', [
      ['Turn on two-step verification in my WhatsApp, and tell Rosa to follow WhatsApp’s steps to get her account back.', true, 'Perfect. Two-step verification adds a password only you know, so a code alone isn’t enough to take over your account.'],
      ['Delete WhatsApp forever.', false, 'No need. Protect your account with two-step verification.'],
      ['Do nothing.', false, 'Warn others: the criminal may write to more of Rosa’s friends.']]],
  ] },
  friend: { who: 'Facebook', intro: 'You open Facebook.', turns: [
    ['A friend request from “Anna Meier”, with Anna’s photo. But you have been friends with Anna for years.', [
      ['Don’t accept. Ask Anna by phone if she made a new account.', true, 'Exactly. A second request from someone you are already friends with is a warning sign.'],
      ['Accept, it’s Anna’s photo.', false, 'Photos and names are easy to copy from a public profile.'],
      ['Accept and ask in a message if it’s really her.', false, 'Once accepted, the copy can see your posts and your friends. Check by phone first.']]],
    ['Anna, on the phone: “No, that’s not me!”', [
      ['Report the fake profile to Facebook (Options, then Report profile), and tell Anna.', true, 'Good. Facebook doesn’t allow profiles that impersonate others, and reports help remove them.'],
      ['Ignore it.', false, 'The copy will try your other friends. A report helps.'],
      ['Write angry comments on the fake profile.', false, 'No need to engage. Report it and move on.']]],
    ['A message from your real friend Jean’s account: “I made CHF 5,000 in a week with this trading app! Click here.”', [
      ['Don’t click. Text or call Jean another way to check if his account was hacked.', true, 'Right. A friend suddenly promoting quick money is a typical sign of a taken-over account.'],
      ['Click, Jean wouldn’t lie.', false, 'It may not be Jean writing. Check another way first.'],
      ['Ask in the chat whether it’s safe.', false, 'If the account is hacked, the scammer will answer “yes”. Check another way.']]],
  ] },
  celeb: { who: 'An advert', intro: 'You are scrolling through news on your phone.', turns: [
    ['An advert shows a famous TV presenter: “My secret investment: start with CHF 250 and become rich, no work needed!” It looks like a page from a well-known newspaper.', [
      ['Don’t click. Famous people don’t sell investments in ads, and pages can copy a newspaper’s look.', true, 'Exactly. The Swiss cyber security office describes these fake “interviews” with famous people.'],
      ['Click to read more, it’s from a newspaper.', false, 'The page only looks like a newspaper. Check the real address in your browser.'],
      ['Share it with friends.', false, 'Sharing spreads the scam. Don’t click, and you can report the ad.']]],
    ['Suppose you clicked and left your phone number. Minutes later a friendly “personal adviser” calls.', [
      ['Hang up. Look up the company on the FINMA warning list, and don’t pay anything.', true, 'Good. In Switzerland, financial firms need a FINMA licence. FINMA also lists firms that operate without one.'],
      ['Send CHF 250 to try it.', false, 'The money goes straight to the criminals, even if the screen later shows “profits”.'],
      ['Install the app they suggest.', false, 'Never install an app for a caller, especially remote-control apps.']]],
    ['Months later: “We are lawyers. We can get your lost money back, for a small fee.”', [
      ['Refuse. Recovery offers that ask for a fee are the same scam again.', true, 'Right. Make no more payments, and report it to the cantonal police.'],
      ['Pay the fee, it’s worth it.', false, 'This is a second scam. Don’t pay.'],
      ['Give them my bank login so they can find the money.', false, 'Never. Report it to the police instead.']]],
  ] },
  fakeshop: { who: 'Online shop', intro: 'You are looking for a new coffee machine online.', turns: [
    ['An advert shows your favourite coffee machine at 70% off, from a shop you have never heard of. A banner says “Swiss quality, Swiss shop”.', [
      ['Before buying, search the shop’s name plus the word “scam”, and look for a real address and phone number.', true, 'Good. A few minutes of checking is the best protection. Fake shops often stress Swiss features to look trustworthy.'],
      ['Buy at once before the offer ends.', false, 'A huge discount from an unknown shop is a reason to check first, not to hurry.'],
      ['It ends in .ch, so it must be Swiss.', false, 'A .ch address does not prove a shop is Swiss. Check who runs it.']]],
    ['The shop has 300 reviews, all five stars and all from the last few weeks. There is no address, only a contact form.', [
      ['That is suspicious. I’ll buy from a shop I know instead.', true, 'Right. Many glowing reviews can be a warning sign, and a real shop shows its address and phone number.'],
      ['300 happy customers can’t be wrong.', false, 'Reviews can be fake. Too many perfect ones is itself a warning sign.'],
      ['Send them my phone number through the form to ask.', false, 'No need to share details with a shop you don’t trust. Choose another one.']]],
    ['Suppose you still go to the checkout. The only payment option is a bank transfer in advance.', [
      ['Stop. I don’t pay in advance by transfer to a shop I don’t know.', true, 'Exactly. With transfers the money is usually gone. Prefer invoice or credit card with shops you don’t know.'],
      ['Transfer the money, it’s just this once.', false, 'Money sent by transfer to a fake shop is very hard to get back.'],
      ['Pay half now and half later.', false, 'Half is still lost if the shop is fake.']]],
  ] },
  buyer: { who: 'Marketplace and WhatsApp', intro: 'You put your old armchair up for sale online for CHF 120.', turns: [
    ['Within minutes a “buyer” writes: “I take it! I can’t come, a courier will collect it. Let’s continue on WhatsApp, here’s my number.”', [
      ['Stay in the marketplace’s own messages, and be careful: a rush plus a move to WhatsApp is a known pattern.', true, 'Good. The Swiss cyber security office describes exactly this start.'],
      ['Great, move to WhatsApp and send my address.', false, 'Moving the chat away from the marketplace is a warning sign. Stay put.'],
      ['Lower the price to sell even faster.', false, 'The price is not the problem. The hurry is the warning sign.']]],
    ['The buyer sends a link: “I paid already. Click here and confirm with your card so the money reaches you.”', [
      ['Don’t click. To receive money you never need card details or codes. I check my own bank or TWINT app.', true, 'Exactly. The only proof of payment is money arriving in your own account.'],
      ['Enter my card details to get my 120 francs.', false, 'This page steals card details. Getting paid never needs them.'],
      ['Type the code from my bank into the page.', false, 'Never. That code would approve a payment out of your account.']]],
    ['Next the buyer sends “Twint-Rechnung.zip”: “Open it on your computer, it’s the payment receipt!”', [
      ['Don’t open it. Files from buyers can be harmful, and a receipt proves nothing.', true, 'Right. Screenshots, PDFs and emails can be faked. Only money in your own account counts.'],
      ['Open it to be polite.', false, 'This kind of file can install harmful software that steals your passwords.'],
      ['Ship the armchair, since there is a receipt.', false, 'Ship only after the money has really arrived in your account.']]],
  ] },
  parcel: { who: 'Text message', intro: 'You are waiting for a parcel this week.', turns: [
    ['A text: “Your parcel could not be delivered. Pay CHF 1.95 here to arrange a new delivery: post-ch-delivery.info/…”', [
      ['Don’t tap the link. Open the carrier’s own app or type its address myself.', true, 'Good. The address is not Swiss Post’s, and checking through the carrier itself is always safe.'],
      ['It’s only CHF 1.95, so pay it.', false, 'The small fee is bait. The page wants your full card details.'],
      ['Reply “STOP” to the message.', false, 'No need to reply. Check through the carrier, then delete it.']]],
    ['Suppose you tapped the link and typed your card details. Now the page says: “Error. Please enter your card again, or use another card.”', [
      ['Stop and call my bank at once to block the card.', true, 'Exactly. A fake error asking for a second card is a known trick. Blocking quickly limits the damage.'],
      ['Try a second card.', false, 'That would give the criminals a second card.'],
      ['Wait a day and see what happens.', false, 'Call your bank right away. Every hour counts.']]],
    ['Another day, an email says a parcel from abroad owes customs fees.', [
      ['Check with the carrier myself, using the tracking number from my own order.', true, 'Right. Real customs fees exist for some parcels from abroad, so check them through the carrier directly, never through a link.'],
      ['Pay through the email link, customs is official.', false, 'Criminals copy customs and post messages. Use the carrier’s own site or app.'],
      ['Forward it to friends to ask.', false, 'Better to check with the carrier directly.']]],
  ] },
};
export default function (body, ctx) {
  const sc = SCENES[ctx.args.scene] || SCENES.popup; let t = 0, good = 0;
  const chat = h('div', { class: 'chat', 'aria-live': 'polite', 'data-testid': 'sc-chat' }); const choices = h('div', { class: 'choice-row', style: 'flex-direction:column' }); const fb = h('div', { 'aria-live': 'polite' });
  function turn() {
    const [them, opts] = sc.turns[t]; ctx.status(`Step ${t + 1} of ${sc.turns.length}`);
    chat.append(h('div', { class: 'bubble' }, h('small', {}, sc.who), them));
    choices.replaceChildren(...opts.map(([label, ok, why], i) => h('button', { class: 'btn btn-quiet', style: 'justify-content:flex-start;text-align:left;border-radius:14px', type: 'button', 'data-testid': `sc-${t}-${i}`, 'data-good': String(ok), onclick: () => choose(label, ok, why) }, label)));
  }
  function choose(label, ok, why) {
    chat.append(h('div', { class: 'bubble me' }, h('small', {}, 'You'), label)); if (ok) good++;
    fb.replaceChildren(h('div', { class: 'feedback' + (ok ? '' : ' bad') }, h('b', {}, ok ? 'Good choice. ' : 'Let’s think again. '), why));
    t++; if (t < sc.turns.length) turn(); else end();
  }
  function end() {
    ctx.status(`Finished: ${good} of ${sc.turns.length} safe choices.`);
    choices.replaceChildren(h('p', {}, good === sc.turns.length ? 'Every choice was a safe one. You stopped, and checked through your own path.' : 'The safe moves are always the same: stop, don’t follow their link or number, and check your own way. Try again whenever you like.'),
      h('button', { class: 'btn btn-primary', type: 'button', 'data-testid': 'sc-again', onclick: () => { t = 0; good = 0; chat.replaceChildren(); fb.replaceChildren(); turn(); } }, 'Start again'));
    if (good === sc.turns.length) ctx.done();
  }
  body.append(h('p', { class: 'muted' }, sc.intro + ' This is made up, and nothing here is real.'), chat, fb, choices); turn();
}
