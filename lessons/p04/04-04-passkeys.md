---
id: 04-04
minutes: 9
summary: A passkey lets you sign in with your face, fingerprint or phone code instead of a password. It only works on the real website, so it can’t be phished.
highlight: passkey
---

:::story The password that wasn’t
Hélène is 72 and lives in Geneva. One morning her online shop asks: “Create a passkey? Next time, sign in with your face.” She is suspicious and calls her son.

“That one is real,” he says, “because you were already signed in, on the shop’s own app. A passkey is like a key that only fits that one shop’s door. Even if someone sends you a fake shop, the key doesn’t fit there.” Hélène taps Continue and looks at the phone. Done.

*Hélène is made up.*
:::end

:::remember
**A [[term:passkey|passkey]] is a key that lives on your phone and only fits the real website. There is no password to type, so there is nothing to give away.**
:::end

## What a passkey is

A passkey replaces a password. Instead of typing a secret, you unlock your phone the way you always do: with your face, your fingerprint or your phone’s code. The FIDO Alliance, the industry group behind passkeys, describes them as a secret stored on your devices, unlocked the same way you unlock your device ([FIDO Alliance: Passkeys](https://fidoalliance.org/passkeys/)).

## Why scammers can’t steal it

Each passkey is linked to the website or app it was made for. Apple explains that passkeys are uniquely generated for every account by your own device and are less vulnerable to phishing ([Apple Support: Use passkeys on iPhone](https://support.apple.com/guide/iphone/use-passkeys-to-sign-in-to-websites-and-apps-iphf538ea8d0/ios)). Google adds that, unlike passwords, passkeys can’t be shared, copied, written down or accidentally given to someone else ([Google Account Help: Passkeys](https://support.google.com/accounts/answer/13548313?co=GENIE.Platform%3DAndroid&hl=en)).

:::figure passkey
Your phone signs you in to the real site; a fake site gets nothing.
:::end

## Two cautions

- **Only on your own device.** Google warns: only create passkeys on devices you personally own, because anyone who can unlock that device can get into the account ([Google Account Help](https://support.google.com/accounts/answer/13548313?co=GENIE.Platform%3DAndroid&hl=en)). Keep your phone’s lock code private.
- **Only offers you didn’t expect are suspicious.** A real offer appears inside the app or website you opened yourself, usually right after you signed in. A message or call telling you to “set up a passkey now” through a link is a scam. Use your own door.

:::try Create a passkey
Not every website offers passkeys yet. If you don’t see the option, that’s fine: the site doesn’t support it.

--- iPhone
1. Sign in to a website or app that supports passkeys, then go to its account settings.
2. When you see the option to save a passkey, tap **Continue**. Your passkey is saved in the **Passwords** app.
3. Next time: tap the account name field, tap the suggested name, and use **Face ID** or **Touch ID** (or your phone code).

You need iCloud Keychain and two-factor authentication turned on. Checked against: [Apple Support: Use passkeys to sign in on iPhone](https://support.apple.com/guide/iphone/use-passkeys-to-sign-in-to-websites-and-apps-iphf538ea8d0/ios).

--- Android
For your Google Account:
1. In your browser, go to myaccount.google.com/signinoptions/passkeys (type it yourself).
2. Tap **Create a passkey**, then **Continue** if asked.
3. Unlock your phone the way you usually do. Done.

Checked against: [Google Account Help: Sign in with a passkey](https://support.google.com/accounts/answer/13548313?co=GENIE.Platform%3DAndroid&hl=en).
:::end

:::exercise Real offer or trick?
Which of these is a real passkey offer? (a) A text: “Your bank: set up your passkey now at this link.” (b) Right after signing in to your shop’s app, a box: “Sign in faster next time with a passkey?”
:::solution
(b) is a normal offer: you opened the app yourself and you were already signed in. (a) is a trick: a surprise message with a link. Delete it, and if you want a passkey with your bank, open the bank’s app yourself.
:::end

:::helper
Passkeys are optional. Don’t switch everything at once. Start with one account, for example the Google or Apple Account, and keep the password manager running alongside. Make sure the phone’s own lock code is not something easy like 1234.
:::end

:::quiz
- q: How do you sign in with a passkey?
  options: ["By unlocking your phone with your face, fingerprint or code", "By reading a code to a caller", "By typing a long password"]
  answer: 0
  explain: The phone does the secret part. You just unlock it.
- q: Why can’t a fake website steal your passkey?
  options: ["The passkey only works for the real site it was made for", "Fake websites are always slow", "Passkeys are written on paper"]
  answer: 0
  explain: The key doesn’t fit the fake site’s lock, and there is nothing to type.
- q: Where should you create passkeys?
  options: ["Only on your own devices", "On a library computer", "On a friend’s phone"]
  answer: 0
  explain: Anyone who can unlock the device could use the passkey.
:::end

:::xlink
lesson 02-03 | Fake websites that look real
lesson 03-03 | A password manager: one safe notebook for all your passwords
:::end

## Sources

- [FIDO Alliance: Passkeys](https://fidoalliance.org/passkeys/)
- [Apple Support: Use passkeys to sign in to websites and apps on iPhone](https://support.apple.com/guide/iphone/use-passkeys-to-sign-in-to-websites-and-apps-iphf538ea8d0/ios)
- [Apple Support: About the security of passkeys](https://support.apple.com/en-us/102195)
- [Google Account Help: Sign in with a passkey instead of a password](https://support.google.com/accounts/answer/13548313?co=GENIE.Platform%3DAndroid&hl=en)
