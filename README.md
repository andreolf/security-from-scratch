# Security from Scratch (draft preview)

A free, calm course on everyday digital safety for older adults and the family members who help them: phone and text-message scams, phishing and fake websites, passwords, and more. English, for Switzerland, the EU and the US.

**Status:** draft preview. 54 of 71 lessons are written (Phases 00–09). The site shows a “Draft preview” banner and is set to `noindex` until all lessons are done. Please don’t share or link to it yet.

Live preview: https://andreolf.github.io/security-from-scratch/

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

Sister course: [AI Safety from Scratch](https://andreolf.github.io/ai-safety-from-scratch/). The glossary (`content/glossary.json`) uses the shared format.

Personal project by Francesco Andreoli. Francesco works at MetaMask; this is not an official MetaMask or Consensys product.
