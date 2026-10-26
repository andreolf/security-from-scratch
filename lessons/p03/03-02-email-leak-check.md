---
id: 03-02
minutes: 8
summary: Check calmly whether your email address appeared in a known data leak, and what to do if it did. A leak is common and fixable.
highlight: leak
---

:::story Two names on the list
Margrit is 73. Her grandson Luca shows her a website where you can type in an email address to see if it appeared in known leaks. Margrit types hers. The answer: it appeared in two leaks, one from an old photo service and one from a newspaper website.

Margrit is shocked at first. Luca explains: “That doesn’t mean anyone is in your email. It means those companies lost data. We just make sure those old passwords aren’t used anywhere important.” They change her email password together that afternoon. It takes fifteen minutes.
:::end

:::remember
**Finding your email in a leak is common and fixable. Change any password that was used there, starting with your email.**
:::end

## What a leak check tells you

When a company is hacked, lists of email addresses and sometimes passwords can end up online. A leak-check service collects these lists, so you can see if your email address is on one.

:::figure leak-flow
From a leak to a fix, step by step.
:::end

The best-known free service is **Have I Been Pwned** (“pwned” is internet slang for “taken over”). Its home page says it lets you check whether your email address is in a data breach ([haveibeenpwned.com](https://haveibeenpwned.com/)). It was created by an independent security researcher, Troy Hunt, and has run since 2013 ([Have I Been Pwned: About](https://haveibeenpwned.com/About)). It is not run by a government, and this course doesn’t endorse it or any advert on it.

You may also already have a check built in. Apple’s Passwords app warns you about passwords that appeared in a data leak ([Apple Support](https://support.apple.com/en-us/120758)). Google’s Password Checkup can show whether passwords saved in your Google Account have been exposed ([Google Account Help](https://support.google.com/accounts/answer/9457609)).

## If your email was in a leak

1. **Don’t panic.** It means a company lost data. It doesn’t mean someone is in your accounts.
2. **Think about where you used the same password.** If you used the leaked password anywhere else, change it there.
3. **Start with your email.** The Swiss Federal Office for Cyber Security advises: if your email password was leaked, change it and also reset the services linked to that email ([BACS](https://www.bacs.admin.ch/de/phishing-de)).
4. **Turn on two-step sign-in** for your email and bank. CISA recommends it for every account that offers it, including email ([CISA: Turn on MFA](https://www.cisa.gov/secure-our-world/turn-mfa)). Phase 04 shows how.

## Be careful with “leak warning” emails

Scammers sometimes send emails that say “Your password was leaked, click here to fix it.” That is phishing. Only check leaks on a site you open yourself, or in your phone’s own password app.

:::exercise Check together, calmly
With a family member or helper, open haveibeenpwned.com yourself by typing the address. Type your email address and read the result together. Write down the names of any leaks, and whether you used the same password anywhere else.
:::solution
If the result is “no leaks found”, good: keep using unique passwords. If leaks are found, look at the dates and names. For each one, ask: “Did I use that password anywhere else?” Change those passwords, email first. Many people find one or two old leaks. That is normal.
:::end

:::helper
Do the check together and stay calm: your reaction sets the tone. Explain that leaks happen to companies, not because of anything your relative did. Never type their passwords into any leak-check website. Only their email address is needed. Then help change the email password first.
:::end

:::quiz
- q: Your email appears in a leak on Have I Been Pwned. What does it mean?
  options: ["Someone is reading your email right now", "A company you used lost data that included your email address", "Your phone has a virus"]
  answer: 1
  explain: It means a company leaked data. Change any password used there, starting with email.
- q: Which password should you change first after a leak?
  options: ["Your email password", "Your newspaper password", "None"]
  answer: 0
  explain: Your email can reset your other accounts, so secure it first.
- q: An email says “Your password was leaked, click here to fix it”. What do you do?
  options: ["Click quickly", "Treat it as possible phishing, and check through your own path", "Reply with your password"]
  answer: 1
  explain: Scammers use leak fears as bait. Use your own password app or a site you open yourself.
:::end

:::xlink
lesson 03-01 | Why one password everywhere is risky
lesson 03-05 | Your email is your master key
:::end

## Sources

- [Have I Been Pwned](https://haveibeenpwned.com/)
- [Have I Been Pwned: About](https://haveibeenpwned.com/About)
- [Apple Support: Use the Passwords app on your iPhone](https://support.apple.com/en-us/120758)
- [Google Account Help: Change compromised passwords (Password Checkup)](https://support.google.com/accounts/answer/9457609)
- [BACS: Phishing, vishing and smishing](https://www.bacs.admin.ch/de/phishing-de)
- [CISA: Turn on multifactor authentication](https://www.cisa.gov/secure-our-world/turn-mfa)
