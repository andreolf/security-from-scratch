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
