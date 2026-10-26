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
  romance: { who: 'Messages from “Daniel”', intro: 'A few weeks ago, a friendly man called Daniel started writing to you on Facebook.', turns: [
    ['“Good morning, my dear. I think about you all day. I am an engineer on an oil platform, so I can’t video call, but soon I will visit you.”', [
      ['Be careful. Love that comes fast, from someone who can never meet or video call, is a known warning sign.', true, 'Good. The Swiss police and the FTC both describe people who claim to work abroad and can never meet.'],
      ['How romantic, he must be busy.', false, 'It may feel romantic. But “I can’t meet you” is part of the script.'],
      ['Send him my address so he can visit.', false, 'Keep personal details to yourself until you have met someone in person.']]],
    ['“My love, there was an accident. I need CHF 3,000 for the hospital, my bank card is blocked. Only you can help me.”', [
      ['Don’t send money. I have never met him in person.', true, 'Exactly. Never send money to someone you have only met online, however real the feelings are.'],
      ['Send half now, to show I care.', false, 'Any amount leads to the next request. Real love doesn’t ask for money.'],
      ['Buy gift cards and send him the codes.', false, 'Scammers like gift cards because the money is very hard to get back.']]],
    ['“If you don’t help me, I will know you never loved me.”', [
      ['End the contact, block him, and talk to someone I trust.', true, 'Right. Someone who really loves you won’t put you under emotional pressure.'],
      ['Apologise and promise to send it tomorrow.', false, 'Pressure and guilt are the scammer’s tools. You owe them nothing.'],
      ['Keep it secret, my family wouldn’t understand.', false, 'Secrecy protects the scammer. Telling someone protects you.']]],
  ] },
  trading: { who: 'WhatsApp, “Sarah, investment coach”', intro: 'You joined a WhatsApp group about investing after seeing an advert.', turns: [
    ['“Our members earn 30% a month, guaranteed. I can open your account today. Places are limited!”', [
      ['That’s a warning sign. Nobody can guarantee returns, and the hurry is pressure.', true, 'Exactly. All investments carry risk. “Guaranteed” and “act now” are classic red flags.'],
      ['Sign up quickly before the places are gone.', false, '“Limited places” is meant to rush you. A real offer can wait.'],
      ['Ask her how she can guarantee it.', false, 'Any answer is part of the script. No one can guarantee returns.']]],
    ['Suppose you invested CHF 500. The app shows CHF 2,100 after four weeks. “Add CHF 10,000 now and you’ll double it!”', [
      ['Don’t add more. A number on a screen is not money in my bank account.', true, 'Right. Fake platforms show made-up growth to get more money from you.'],
      ['Add the money, it’s clearly working.', false, 'The growth is invented. The CHF 500 is probably already gone.'],
      ['Take a loan to invest more.', false, 'Never borrow to put money into an offer like this.']]],
    ['You ask to withdraw. “First you must pay a 15% tax, then the money is released.”', [
      ['Pay nothing more. Keep the messages and report it to the police.', true, 'Good. A “fee to withdraw” is the last stage of the scam. Every fee leads to another.'],
      ['Pay the tax, then I’ll get it all.', false, 'After this fee, there will be another. The money is not there.'],
      ['Let them take over my computer to help.', false, 'Never give remote access to anyone who contacted you about money.']]],
  ] },
  recovery: { who: 'Phone call, “lawyer”', intro: 'Last year you lost money to a fake trading platform. Today your phone rings.', turns: [
    ['“I am a lawyer working with Interpol. We found your money, CHF 8,000. We can return it to you.”', [
      ['Be very careful. Calls offering to recover lost money are a known second scam.', true, 'Exactly. Lists of people who have already been scammed are sold to new scammers.'],
      ['Wonderful! Tell me what to do.', false, 'It is natural to hope. But this call is how people lose money twice.'],
      ['Confirm how much I lost so they can check.', false, 'Don’t confirm details. Hang up and check yourself.']]],
    ['“To release the money, there is a processing fee of CHF 900.”', [
      ['Refuse. Real authorities never ask for a fee to return money.', true, 'Right. Government agencies and real organisations never ask for money to get your refund, and FINMA is never involved in such offers.'],
      ['Pay, it is only a small part of 8,000.', false, 'The 8,000 does not exist. The fee is the scam.'],
      ['Give my bank details so they can send the money.', false, 'Never give account details to someone who called you.']]],
    ['“If you don’t pay today, the money goes back to the state.”', [
      ['Hang up, and tell my police contact or a family member about the call.', true, 'Good. Hurry is the warning sign. The police will want to know about the call.'],
      ['Pay quickly so I don’t lose it.', false, 'There is nothing to lose except the fee they are asking for.'],
      ['Ask for their number to call back later.', false, 'Their number leads back to them. Use a number you look up yourself.']]],
  ] },
  trusted: { who: 'The trusted-person test', intro: 'Before money moves, you tell one person you trust. Here is how it goes.', turns: [
    ['An online friend asks you to “help with a bill” of CHF 400. Who do you tell first?', [
      ['A person I trust: my daughter, a friend or my bank.', true, 'Yes. Just saying it out loud to someone else often makes the warning signs clear.'],
      ['Nobody, it’s my own business.', false, 'It is your money and your choice. But a second pair of eyes protects you.'],
      ['Only the online friend.', false, 'They can’t check their own story. Ask someone outside it.']]],
    ['The online friend writes: “Don’t tell your family, they won’t understand us.”', [
      ['That is a warning sign. I’ll tell them anyway.', true, 'Exactly. A request for secrecy protects the scammer, not you.'],
      ['Keep it secret to be loyal.', false, 'Real friends don’t ask you to hide money matters from your family.'],
      ['Tell them only after I’ve paid.', false, 'Talk before the money moves. Afterwards it is often gone.']]],
    ['Your daughter is worried. The friend says: “It must be today!”', [
      ['Wait. If it is real, it can wait a day while I check.', true, 'Right. Pressure to act today is one of the clearest warning signs.'],
      ['Pay quickly to end the argument.', false, 'The hurry is the trick. Take the time you need.'],
      ['Send it in small amounts so nobody notices.', false, 'Small amounts add up, and the requests won’t stop.']]],
  ] },
  video: { who: 'Video call', intro: 'Your phone rings with a video call from an unknown number.', turns: [
    ['On screen is your nephew Marc, a bit blurry. “Hi! New phone. Can you send me CHF 1,500 by TWINT? I’ll explain later.” His lips don’t quite match his words.', [
      ['End the call and ring Marc on the number I already have.', true, 'Exactly. A face on a screen can be faked. Your own number for Marc can’t.'],
      ['It’s his face, so it must be him. Send it.', false, 'Faces and voices can be faked now. Check first.'],
      ['Ask him to move closer to the camera.', false, 'Looking harder doesn’t help much. Fakes keep improving. Call back.']]],
    ['A video call from a “police officer” in uniform, showing an ID card: “Your bank account is involved in a crime. Move your savings now.”', [
      ['Hang up. Real police don’t ask me to move money. I call the police on 117 myself if worried.', true, 'Right. A uniform and ID on a screen prove nothing.'],
      ['Follow the instructions, it’s the police.', false, 'Real police never ask you to move your money.'],
      ['Read out my bank details to prove I’m honest.', false, 'Never give bank details to a caller.']]],
    ['A video message from a famous TV presenter promoting a crypto investment.', [
      ['Ignore it. Famous people’s faces and voices are used in fake adverts.', true, 'Good. The Swiss cyber security office describes deepfake celebrity adverts.'],
      ['Invest a little, she wouldn’t lie.', false, 'She didn’t say it. The video was made without her.'],
      ['Forward it to friends.', false, 'Forwarding spreads the scam.']]],
  ] },
  codeword: { who: 'Using your code word', intro: 'Your family agreed on a code word last month. Now it’s time to use it.', turns: [
    ['A message from your daughter’s number: “Mum, quick, I need you to pay a bill for me.”', [
      ['Call her on her usual number and ask how she is, before anything else.', true, 'Good. A message can come from a stolen or copied account. A call you start is safer.'],
      ['Ask for the code word by text.', false, 'Better to call. If her account was taken over, the scammer might find old messages.'],
      ['Pay, it’s her number.', false, 'Numbers and accounts can be taken over. Check first.']]],
    ['A caller with your son’s voice asks for money. You ask for the code word. He says: “Come on, Dad, it’s me!”', [
      ['No word, no money. Hang up and call him back on his number.', true, 'Exactly. An excuse instead of the word is your signal to hang up.'],
      ['Accept it, he sounds just like him.', false, 'Voices can be cloned. The word is the test, not the voice.'],
      ['Tell him the first letter.', false, 'Never give hints.']]],
    ['Your grandson asks: “Can I post our code word in the family WhatsApp group so nobody forgets?”', [
      ['No. We keep it out of messages and posts. We say it face to face.', true, 'Right. A written word can be read by anyone who gets into an account.'],
      ['Yes, the group is private.', false, 'Groups and accounts can be taken over. Keep it out of writing.'],
      ['Yes, and also on Facebook.', false, 'Never post it anywhere.']]],
  ] },
  firststeps: { who: 'Right after a scam', intro: 'You have just realised that the “bank adviser” who called you was a scammer. You moved CHF 4,000.', turns: [
    ['What do you do first?', [
      ['Call my bank on the number on my card, and ask them to block and stop the payment.', true, 'Exactly. The faster you act, the better the chances of stopping the money.'],
      ['Wait until tomorrow, I’m too upset.', false, 'It’s natural to feel shaken. But call the bank now. Minutes can matter.'],
      ['Call the “adviser” back to ask for the money.', false, 'Their number leads back to the scammer. Call your own bank.']]],
    ['The bank has blocked your cards. What next?', [
      ['Report it to the police, and keep all messages and call times.', true, 'Right. A report matters even if the money can’t be recovered.'],
      ['Delete everything, I don’t want to see it.', false, 'Keep the messages and numbers. The police will need them.'],
      ['Tell nobody, it’s embarrassing.', false, 'It isn’t your fault. Telling the police and a trusted person helps.']]],
    ['The scammer had remote access to your computer. Which password do you change first, and where?', [
      ['My email password, from my phone or another device I trust.', true, 'Good. Your email can reset other accounts, and the computer may not be safe yet.'],
      ['My shopping site password, on the same computer.', false, 'Start with email, and use a device the scammer never touched.'],
      ['None, the bank fixed it.', false, 'The scammer may still have your passwords. Change them, starting with email.']]],
  ] },
  helper: { who: 'Helping your father', intro: 'Your father, 81, asks you to “make the phone safe”. He hands it to you.', turns: [
    ['What do you say?', [
      ['“Let’s do it together. You hold it, I’ll show you where to tap.”', true, 'Yes. He learns, and stays in charge of his own phone.'],
      ['“Give me ten minutes, I’ll do everything.”', false, 'Quick, but he won’t know what changed or how to do it again.'],
      ['“Just tell me all your passwords.”', false, 'Passwords should stay his. Help him store them safely instead.']]],
    ['He gets a step wrong and says: “I’m too old for this.” What now?', [
      ['“Everyone finds this confusing. Let’s try once more, slowly.”', true, 'Patience and kindness keep him willing to learn.'],
      ['“It’s easy, look how fast I do it.”', false, 'This can make him feel worse. Slow down.'],
      ['Take the phone and finish it yourself.', false, 'Let him try again, at his pace.']]],
    ['You finish. What next?', [
      ['Write the steps on paper for him, and agree he can call you any time.', true, 'Great. He has a reminder and a person to ask.'],
      ['Leave and never mention it again.', false, 'Check in next time. Questions come up later.'],
      ['Change his settings later without telling him.', false, 'It’s his phone. Tell him about any change.']]],
  ] },
  callmefirst: { who: 'Message from “your grandson”', intro: 'Your neighbour Ilse, 79, calls you. She agreed you’re her “call me first” person.', turns: [
    ['Ilse: “My grandson texted from a new number. He needs CHF 1,800 today and says don’t tell his parents.” What do you say?', [
      ['“Thank you for calling me. Let’s pause and call his old number together.”', true, 'Yes. Praise her for calling, then check calmly.'],
      ['“You should have known it’s a scam!”', false, 'Blame makes people stop calling you. Thank her instead.'],
      ['“Just pay it, it’s family.”', false, 'A new number plus secrecy plus money is a classic scam.']]],
    ['They call his old number. He answers and knows nothing about it. What now?', [
      ['Help her block the new number and report the message.', true, 'Good. Block, report, and she’s done.'],
      ['Reply to the scammer to tease them.', false, 'Don’t engage. Block and report.'],
      ['Forget it. Nothing happened.', false, 'Reporting helps warn others.']]],
    ['Ilse says: “I feel silly for calling you.” You say:', [
      ['“Calling me was exactly right. Call me every time.”', true, 'Yes. Make calling you easy and normal.'],
      ['“Yes, try to sort it out yourself next time.”', false, 'That makes her less likely to call next time, when it may matter.'],
      ['“Only call if it’s over CHF 5,000.”', false, 'Any amount is worth a call.']]],
  ] },
  signs: { who: 'Your friend Peter', intro: 'Peter, 73, has been quiet lately. He mentions a new online friend who “understands him”, and he asked his bank for a big withdrawal.', turns: [
    ['How do you start?', [
      ['“You seem a bit worried lately. How are you?”', true, 'Yes. Start with care, not accusations.'],
      ['“That’s obviously a scam, you fool.”', false, 'Blame makes people defend the scammer and hide things.'],
      ['Say nothing, it’s not your business.', false, 'A gentle question can make a big difference.']]],
    ['Peter: “She needs money for a flight to finally meet me. You wouldn’t understand.” What now?', [
      ['“I’d like to understand. Has she ever met you on a live video call? Would you show me the messages?”', true, 'Good. Ask questions and look together, without pressure.'],
      ['“Give me your phone, I’m deleting her.”', false, 'Taking over pushes him away. Keep him on your side.'],
      ['“Fine, do what you want.”', false, 'Stay with him. Suggest checking together.']]],
    ['Peter agrees it might be a scam but feels ashamed. What do you suggest?', [
      ['Stop sending money, call his bank, and report it to the police. You’ll go with him.', true, 'Exactly. Concrete steps, and company.'],
      ['Keep paying until she proves it.', false, 'Scammers always have a new reason. Stop the money.'],
      ['Keep it secret from everyone.', false, 'Secrecy helps the scammer. The bank and police can help.']]],
  ] },
  phrase: { who: 'Your new wallet', intro: 'You set up a crypto wallet app. It shows you 12 words and says: write these down.', turns: [
    ['Where do you keep the 12 words?', [
      ['On paper, hidden at home.', true, 'Yes. Paper can’t be hacked.'],
      ['A screenshot in my photos.', false, 'Photos can sync to the cloud, where they can be stolen.'],
      ['In an email to myself.', false, 'If the email is hacked, the wallet is emptied.']]],
    ['A message says: “Your wallet will be locked. Enter your 12 words here to keep it.” What do you do?', [
      ['Ignore it. Nobody real asks for the words.', true, 'Right. Anyone with the words can take everything.'],
      ['Enter the words quickly.', false, 'That gives the scammer the whole safe.'],
      ['Enter only half of the words.', false, 'Never share any of them.']]],
    ['Your niece offers to “keep a copy” of the words on her phone. What do you say?', [
      ['“Thank you, but the words stay on paper, with me.”', true, 'Good. Every copy is another way in.'],
      ['“Good idea, send me a photo too.”', false, 'More copies on phones means more risk.'],
      ['“Post them in the family group.”', false, 'Never. Anyone in the group could take everything.']]],
  ] },
  fakesupport: { who: '“Wallet Support” (private message)', intro: 'You asked a question in a public crypto chat group. A minute later, “Wallet Support” writes to you privately.', turns: [
    ['“Hi! I’m from official support. I can fix your problem. Open this link.”', [
      ['Don’t click. Real support doesn’t message first in private.', true, 'Right. Support scammers watch public groups for questions.'],
      ['Open the link.', false, 'It will likely ask for your secret phrase.'],
      ['Send a screenshot of your wallet.', false, 'Don’t share anything with them.']]],
    ['“To sync your wallet, enter your 12 words on this page.”', [
      ['Block them. Nobody real ever asks for the phrase.', true, 'Exactly. That is the whole scam.'],
      ['Enter them, it’s support.', false, 'Anyone with the words can empty the wallet.'],
      ['Read them out on a call instead.', false, 'Same result. Never share them.']]],
    ['They say: “If you don’t sync in 10 minutes, your funds are lost.”', [
      ['Ignore the pressure, block, and report the account.', true, 'Good. Urgency is a scam sign.'],
      ['Hurry and do what they say.', false, 'Pressure is how they stop you thinking.'],
      ['Pay a small fee to extend the time.', false, 'There is no time limit. It’s a scam.']]],
  ] },
  hardware: { who: 'A hardware wallet', intro: 'You bought a small hardware wallet online. You open the box.', turns: [
    ['Inside is a card with 24 words already printed, and a note: “Your recovery phrase”. What do you do?', [
      ['Don’t use it. A real device makes its own words at setup.', true, 'Exactly. Someone else has those words.'],
      ['Use the printed words, it’s convenient.', false, 'Whoever printed them can empty the wallet.'],
      ['Photograph the card to keep it safe.', false, 'Don’t use these words at all.']]],
    ['The seller was a cheap marketplace shop. What is safer next time?', [
      ['Buy from the maker or its official resellers.', true, 'Right. The makers warn against unknown sellers.'],
      ['Buy second-hand, it’s cheaper.', false, 'You can’t know who used it before.'],
      ['Buy one already set up.', false, 'Set up means someone else may have the words.']]],
    ['You get a proper device and set it up. It shows you new words. Where do they go?', [
      ['On the blank card, on paper, kept hidden at home.', true, 'Yes. Your own words, only on paper.'],
      ['In my phone notes.', false, 'Phones can be hacked or synced. Paper only.'],
      ['Emailed to the maker for safekeeping.', false, 'The maker never needs your words.']]],
  ] },
  clicked: { who: 'You clicked something', intro: 'A site promised free tokens. You connected your wallet and approved something. Now you are worried.', turns: [
    ['What first?', [
      ['Close the site and don’t sign or approve anything more.', true, 'Good. Stop the damage first.'],
      ['Approve again to “undo” it.', false, 'Never sign more on a site you don’t trust.'],
      ['Ask the site’s chat for help.', false, 'The site is the scam. Leave it.']]],
    ['You also typed your 12 words into the site. What now?', [
      ['Treat them as stolen: make a new wallet with new words and move what’s left at once.', true, 'Right. Speed matters. The old words are burned.'],
      ['Change the wallet app password.', false, 'A password doesn’t help. The words open the wallet anywhere.'],
      ['Wait and see.', false, 'Scammers often empty wallets within minutes.']]],
    ['What else helps?', [
      ['Remove the site’s approval with a revoke tool, and report it to the police.', true, 'Yes. Then talk to someone you trust.'],
      ['Pay a “recovery service” that messages you.', false, 'That is a recovery scam (lesson 10.05).'],
      ['Keep it to myself.', false, 'Reporting helps, and you are not to blame.']]],
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
