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
