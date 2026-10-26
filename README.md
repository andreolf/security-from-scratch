# Security from Scratch

A free, calm course on everyday digital safety for older adults and the family members who help them: phone and text-message scams, phishing and fake websites, passwords, and more. English, for Switzerland, the EU and the US.

71 short lessons in 13 phases: phone and text-message scams, fake police and bank calls, phishing and fake websites, passwords and password managers, two-step sign-in and passkeys, updates and remote-control scams, WhatsApp and social media, safe online shopping, romance and investment scams, AI voice and video tricks, what to do after a scam (with checked contacts for Switzerland, the EU and the US), helping a family member, and an optional, wallet-neutral phase on crypto wallets. Each lesson has a made-up story, a picture with a text version, calm practice you can play in the page, a short quiz and its sources. Pass the phase checks to earn free Core course, Family helper and Wallet basics certificates, which anyone can verify on the site.

Live: https://andreolf.github.io/security-from-scratch/

## Principles

- Big text (20px+ body), 7:1 contrast, 44px tap targets, no timers, nothing only in an image, “Read this lesson to me” (browser speech, on-device).
- Every fact links to a source that was opened and checked (`content/sources.json`). Phone steps are checked against Apple and Google support pages.
- Stories are made up, and labelled so. Progress is shown as lessons completed only, saved in the browser. No accounts, no tracking.
- Certificates are free certificates of completion, not accredited.

## Develop

```sh
npm install
npm run dev          # http://localhost:4793
npm run build        # compile lessons, run the lesson checker and theme guard, then build
npm run test:unit
npx playwright test --workers=1
```

Lessons live in `lessons/pNN/NN-NN-slug.md` (custom `:::` blocks, see `scripts/build-lessons.mjs`). `scripts/check-lessons.mjs` fails the build on unsourced facts, unverified links, missing pictures, quizzes or phone-step sources. All colours and fonts live in `src/styles/tokens.css` only.

Sibling courses: [AI Safety from Scratch](https://andreolf.github.io/ai-safety-from-scratch/), [Mechanical Engineering from Scratch](https://andreolf.github.io/mechanical-engineering-from-scratch/) and [Mechatronics from Scratch](https://andreolf.github.io/mechatronics-from-scratch/). The glossary (`content/glossary.json`) uses the shared format.

Personal project by Francesco Andreoli. Francesco works at MetaMask; this is not an official MetaMask or Consensys product.
