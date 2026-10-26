import { h } from '../util.js';
// Made-up calls. Safe moves follow cybercrimepolice.ch (hang up, call the person yourself, call 117),
// sg.ch (never hand over valuables), BACS (end bank calls, never install remote-access apps) and the FCC (press nothing).
// Each turn: [caller line, [[answer, good?, feedback], ...]]
export const SCENARIOS = {
  grandchild: { who: 'Caller', turns: [
    ['“Hello, this is the police. Your granddaughter has caused a bad accident. She is here with me, crying.”', [
      ['“I will hang up and call my granddaughter myself.”', true, 'Exactly. You check the story on a number you already have.'],
      ['“Oh no! What does she need?”', false, 'A loving reaction, and the caller counts on it. It hands them control of the call.'],
      ['“Put her on the phone so I can hear her.”', false, 'The voice can be faked or too upset to speak. Checking yourself works better than listening.']]],
    ['“There is no time! We need a deposit tonight, or she goes to prison. Don’t tell anyone.”', [
      ['Hang up, and call her on the number saved in your phone.', true, 'Yes. Hurry and secrecy are the trick. Real police never ask for money on the phone.'],
      ['Ask how much, just to know.', false, 'Talking about the amount keeps you in the conversation. End the call.'],
      ['Promise to keep it secret.', false, 'Secrecy protects the scammer, not your family.']]],
    ['She answers on the second ring. She is at work, and she is fine.', [
      ['Call 117 to report the call, and tell the family.', true, 'Well done. Swiss police ask you to report it, even when nothing was lost.'],
      ['Forget about it.', false, 'Tell the police and the family. Scammers often try again.'],
      ['Call the “police” number back.', false, 'Never use a number from the scam call. Dial 117 yourself.']]],
  ] },
  police: { who: '“Police officer”', turns: [
    ['“Good afternoon, police. We arrested burglars near your home. They had a note with your name and address.”', [
      ['“I will call the police myself on 117 to check.”', true, 'Yes. On a landline, hang up first, wait for the dial tone, then dial.'],
      ['“How can I help you?”', false, 'Helpful, and exactly what the caller wants. Stop and check instead.'],
      ['“What is your badge number?”', false, 'A badge number can be invented in a second. It proves nothing.']]],
    ['“Your money is not safe at the bank. Some bank staff work with the criminals. Don’t tell them anything.”', [
      ['“Real police never say that. Goodbye.”', true, 'Right. Telling you not to trust your bank is a classic sign of this scam.'],
      ['Agree to go to the bank tomorrow.', false, 'The next step would be withdrawing your money for a “courier”. Hang up now.'],
      ['Ask which staff member is involved.', false, 'Any answer is invented. End the call.']]],
    ['“An officer in plain clothes will come to collect your cash and jewellery for safekeeping.”', [
      ['Say no, hang up, and call 117.', true, 'Perfect. Real police never collect money or valuables at your door.'],
      ['Get the valuables ready, just in case.', false, 'Never hand money, gold or jewellery to strangers, however trustworthy they seem.'],
      ['Let the officer in, but watch carefully.', false, 'Don’t open the door. Call 117.']]],
  ] },
  bank: { who: '“Bank security”', turns: [
    ['“This is your bank’s security team. Someone just paid CHF 2,400 with your card.”', [
      ['“I will hang up and call the number on the back of my card.”', true, 'Exactly. That number is real, the caller’s is not proven.'],
      ['“That wasn’t me! Please stop it.”', false, 'Natural, but now the caller leads. Hang up and call your bank yourself.'],
      ['Give your card number so they can find it.', false, 'Never give card numbers or passwords to a caller.']]],
    ['“To stop the payment, read me the code we just sent to your phone.”', [
      ['“I never read codes to anyone. Goodbye.”', true, 'Right. A code you read out lets the caller into your account.'],
      ['Read the code quickly.', false, 'That code is the key. A real bank never asks for it.'],
      ['Ask them to send another code.', false, 'Any code they ask for is for them, not for you.']]],
    ['“Then install this support app so I can fix it on your phone.”', [
      ['Refuse, hang up, and call your bank.', true, 'Yes. Remote-control apps let strangers use your phone and your banking.'],
      ['Install it, but watch the screen.', false, 'Once installed, they can act faster than you can see.'],
      ['Install it on a different phone.', false, 'No stranger should ever control any of your devices.']]],
  ] },
  code: { who: '“Bank support”', turns: [
    ['A text: “Your bank: a new device is signing in to your account. If this was not you, call us on this number.” You call.', [
      ['Don’t call that number. Call the number on the back of my card.', true, 'Right. A number inside a surprise message is not proven. Use the one you already have.'],
      ['Call quickly: it might be urgent.', false, 'Urgency is the trick. The number in the text leads to the scammer.'],
      ['Reply to the text with “STOP”.', false, 'Replying shows them your number is active. Just use your own number for the bank.']]],
    ['Suppose you did call. A friendly voice: “To block the intruder, I’ll send you a code. Please read it to me.”', [
      ['“I never read a code to anyone. Goodbye.”', true, 'Exactly. The code is for signing in. Whoever has it can get in as you.'],
      ['Read it out: they are helping.', false, 'Reading the code lets the caller sign in as you, or confirm a payment.'],
      ['Read only the first half.', false, 'No part of a code is for anyone else.']]],
    ['“Then just approve the message that pops up in your banking app.”', [
      ['Approve nothing I didn’t start myself. Hang up and call my bank.', true, 'Perfect. Only approve sign-ins and payments you started yourself, right now.'],
      ['Approve it, so the call can end.', false, 'Approving would confirm their sign-in or payment.'],
      ['Approve it, then check later.', false, 'Once approved, money can leave in seconds. Never approve what you didn’t start.']]],
  ] },
  support: { who: '“Bank IT specialist”', turns: [
    ['“Your bank here. There is a wrong booking on your account. I’ll connect you to our IT specialist.” A second voice: “Your e-banking is infected. We must clean it together.”', [
      ['Hang up, and call my bank on the number on my card.', true, 'Exactly. You check through your own number, not theirs.'],
      ['Let them explain what is wrong.', false, 'The longer the call, the more pressure. You can always hang up.'],
      ['Give my e-banking login so they can check.', false, 'Never give your login to a caller.']]],
    ['Suppose you stayed on. “Please install the support app AnyDesk, then tell me the number it shows.”', [
      ['“No. I never install apps for a caller.” Hang up.', true, 'Right. Banks and authorities never ask you to install remote-control software on the phone.'],
      ['Install it but don’t tell them the number.', false, 'Don’t install it at all. Hang up.'],
      ['Install it, they are from the bank.', false, 'With that app they would see your screen and control your device, including your banking.']]],
    ['“If you hang up now, your money will be lost!”', [
      ['Hang up anyway. Then tell a family member and call my bank.', true, 'Perfect. Pressure is the sign of a scam. Your real bank will be glad you checked.'],
      ['Stay on, just in case.', false, 'Hanging up is always safe. A real bank never threatens you.'],
      ['Move my money to a “safe account” they give me.', false, 'There is no such thing as a safe account from a caller. That is the theft.']]],
  ] },
  robot: { who: 'Recorded voice', turns: [
    ['A recorded voice, in English: “This is the police. Your bank account is involved in a crime. Press 1 to speak to an officer.”', [
      ['Press nothing and hang up.', true, 'Exactly. Real police never call with a recording.'],
      ['Press 1 to find out more.', false, 'Pressing 1 connects you to the scammer and tells them you might believe it.'],
      ['Wait to hear the rest.', false, 'There is nothing to hear. End the call.']]],
    ['The same number calls again a few minutes later.', [
      ['Don’t answer. Block the number if you like.', true, 'Good. You owe them nothing. You can block or report the number.'],
      ['Answer and shout at them.', false, 'No need. Every call keeps you on their list.'],
      ['Call the number back.', false, 'The number may belong to an innocent person whose number was faked.']]],
    ['You are still a bit worried about your account.', [
      ['Call your bank on the number on your card.', true, 'Perfect: you check through your own path.'],
      ['Search online for “bank police number”.', false, 'Search results and adverts can be fake. Use the number on your card.'],
      ['Ignore the worry.', false, 'It is fine to check. Do it on a number you already trust.']]],
  ] },
};
export default function (body, ctx) {
  const sc = SCENARIOS[ctx.args.scenario] || SCENARIOS.grandchild; let t = 0, good = 0;
  const chat = h('div', { class: 'chat', 'aria-live': 'polite', 'data-testid': 'cd-chat' }); const choices = h('div', { class: 'choice-row', style: 'flex-direction:column' }); const fb = h('div', { 'aria-live': 'polite' });
  function turn() {
    const [them, opts] = sc.turns[t]; ctx.status(`Turn ${t + 1} of ${sc.turns.length}`);
    chat.append(h('div', { class: 'bubble' }, h('small', {}, t === sc.turns.length - 1 && !them.startsWith('“') ? 'What happens' : sc.who), them));
    choices.replaceChildren(...opts.map(([label, ok, why], i) => h('button', { class: 'btn btn-quiet', style: 'justify-content:flex-start;text-align:left;border-radius:14px', type: 'button', 'data-testid': `cd-${t}-${i}`, 'data-good': String(ok), onclick: () => choose(label, ok, why) }, label)));
  }
  function choose(label, ok, why) {
    chat.append(h('div', { class: 'bubble me' }, h('small', {}, 'You'), label)); if (ok) good++;
    fb.replaceChildren(h('div', { class: 'feedback' + (ok ? '' : ' bad') }, h('b', {}, ok ? 'Good choice. ' : 'Let’s think again. '), why));
    t++; if (t < sc.turns.length) turn(); else end();
  }
  function end() {
    ctx.status(`Finished: ${good} of ${sc.turns.length} safe choices.`);
    choices.replaceChildren(h('p', {}, good === sc.turns.length ? 'Every choice was a safe one. You did not need to know if it was fake. You just stopped, hung up and checked.' : 'The safe moves are always the same: stop, hang up, and check on a number you already have. Try again whenever you like.'),
      h('button', { class: 'btn btn-primary', type: 'button', 'data-testid': 'cd-again', onclick: () => { t = 0; good = 0; chat.replaceChildren(); fb.replaceChildren(); turn(); } }, 'Start the call again'));
    if (good === sc.turns.length) ctx.done();
  }
  body.append(h('p', { class: 'muted' }, 'A made-up call, written out. Take your time: there is no clock.'), chat, fb, choices); turn();
}
