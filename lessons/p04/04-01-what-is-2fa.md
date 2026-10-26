---
id: 04-01
minutes: 7
summary: Two-step sign-in asks for a second proof, usually from your phone, after your password. A stolen password alone is then not enough.
highlight: second lock
---

:::story The second lock
Walter is 77 and lives in Basel. His neighbour Rita tells him that someone got into her email last month. “They had my password from some old website. They read everything and sent messages to my friends.”

Her grandson set up two-step sign-in afterwards. “Now, when someone signs in, my phone asks me first,” Rita says. “Even if they have my password, they’re stuck.” Walter decides to ask about it at the next family lunch.

*Walter and Rita are made up, but this kind of break-in is common.*
:::end

:::remember
**Two-step sign-in adds a second lock. A thief with only your password is stuck at the door.**
:::end

## What it means

Normally you sign in with one thing: your password. With [[term:two-factor|two-step sign-in]], the account also asks for a second proof that it is really you. This is usually something on your phone: a code in a text message, a tap on a pop-up, or your fingerprint.

It has many names. Google calls it 2-Step Verification, Apple calls it two-factor authentication, and others say 2FA or MFA. They all mean the same idea ([Google Account Help](https://support.google.com/accounts/answer/185839?co=GENIE.Platform%3DAndroid&hl=en), [Apple Support](https://support.apple.com/en-us/102660)).

:::figure two-locks
A password plus a second proof from your phone.
:::end

## Why it helps so much

Passwords leak from websites all the time, as you saw in Phase 03. The second step means a leaked password is not enough on its own. Google describes it as an extra layer of security in case your password is stolen ([Google Account Help: Turn on 2-Step Verification](https://support.google.com/accounts/answer/185839?co=GENIE.Platform%3DAndroid&hl=en)).

The US Cybersecurity and Infrastructure Security Agency recommends turning it on for every account that offers it, starting with email, banking and social media ([CISA: Turn on MFA](https://www.cisa.gov/secure-our-world/turn-mfa)).

## Some second steps are stronger than others

All of them are much better than nothing. Google’s advice ranks them: a prompt from Google on your phone is more secure than a code by text message, and a physical security key is the most secure ([Google Account Help: Make your account more secure](https://support.google.com/accounts/answer/46526)). Passkeys, in lesson 04.04, are another strong option.

You don’t need the strongest one to start. Text-message codes are fine as a first step, as long as you never share the code. That is the next lesson.

:::exercise Which accounts deserve a second lock?
Write a short list of your accounts in order of importance. Which three would hurt most if a stranger got in?
:::solution
For most people the top three are: your email (it can reset everything else), your bank or TWINT, and your phone’s own account (Apple Account or Google Account). Banks usually already use a second step, such as an app confirmation. Start with your email in lesson 04.03.
:::end

:::helper
Ask what accounts your relative actually uses before turning anything on. Make sure the phone number on the account is current: the second step will go there. Do it together, on their phone, and let them press the buttons.
:::end

:::quiz
- q: What does two-step sign-in add?
  options: ["A second proof, usually from your phone, after the password", "A second password that is the same as the first", "A longer username"]
  answer: 0
  explain: The second proof is usually a code, a tap or your fingerprint on your phone.
- q: Someone stole your password in a website leak. You have two-step sign-in on. What happens when they try to sign in?
  options: ["They get in straight away", "They are stuck, because they don’t have your phone", "Your password changes by itself"]
  answer: 1
  explain: Without the second proof, the password alone doesn’t open the door.
- q: Which account should get a second lock first?
  options: ["Your email", "A shop you used once", "A newsletter"]
  answer: 0
  explain: Your email can reset your other passwords, so it matters most.
:::end

:::xlink
lesson 03-05 | Your email is your master key
lesson 04-03 | Try it: turn on 2FA for your email
:::end

## Sources

- [Google Account Help: Turn on 2-Step Verification](https://support.google.com/accounts/answer/185839?co=GENIE.Platform%3DAndroid&hl=en)
- [CISA: Turn on multifactor authentication](https://www.cisa.gov/secure-our-world/turn-mfa)
- [Apple Support: Two-factor authentication for Apple Account](https://support.apple.com/en-us/102660)
- [Google Account Help: Make your account more secure](https://support.google.com/accounts/answer/46526)
