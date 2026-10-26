import { test, expect } from '@playwright/test';
import { watchErrors, go, noOverflow, tapTargets } from './helpers.js';
import { readdirSync } from 'node:fs';
// Every written lesson, read from the lessons/ folder so new phases are covered automatically.
const WRITTEN = readdirSync(new URL('../lessons/', import.meta.url), { recursive: true }).map(String).filter((f) => /\d\d-\d\d-.*\.md$/.test(f)).map((f) => f.match(/(\d\d-\d\d)-[^/\\]*\.md$/)[1]).filter((id) => !process.env.MAX_PHASE || id.slice(0, 2) <= process.env.MAX_PHASE).sort();
// MAX_PHASE=04 limits a live check to the phases that were deployed.
const ROUTES = ['#/', '#/phase/p00', '#/phase/p03', '#/phase/p12', '#/test/p01', '#/progress', '#/glossary', '#/verify', '#/about', '#/practice', '#/learn/08-01', '#/certificate/core'];
for (const r of ROUTES) {
  test(`page ${r}: banner, no overflow, no console errors, tap targets`, async ({ page }) => {
    const errs = watchErrors(page);
    await go(page, r);
    await expect(page.getByTestId('draft-banner')).toBeVisible();
    await expect(page.getByTestId('draft-banner')).toContainText('Draft preview');
    if (r === '#/practice') { // mount every section so all exercises are checked too
      for (const s of await page.locator('.practice-section').all()) await s.scrollIntoViewIfNeeded();
      await expect(page.locator('.practice-slot[data-mounted="0"]')).toHaveCount(0);
      await expect(page.locator('.practice-section .practice[data-ready="1"]')).toHaveCount(await page.locator('.practice-section').count());
    }
    await noOverflow(page);
    await tapTargets(page);
    expect(await page.locator('body').innerText()).not.toMatch(/\bXP\b/i);
    expect(errs).toEqual([]);
  });
}
test(`all ${WRITTEN.length} written lessons: render, no overflow, no console errors, tap targets, a picture with a text version`, async ({ page }) => {
  test.setTimeout(240_000);
  const errs = watchErrors(page);
  const ids = WRITTEN;
  expect(ids.length).toBeGreaterThanOrEqual(27);
  for (const id of ids) {
    await go(page, `#/learn/${id}`);
    await expect(page.locator(`article[data-lesson="${id}"]`), id).toBeVisible();
    await expect(page.locator('.lesson-quiz, [data-testid=lesson-quiz] [data-testid=question]').first(), id).toBeVisible();
    await expect(page.locator('figure.fig').first(), id).toBeVisible();
    // every picture has words: an SVG figure has a "Read the picture as text" box, a step-through has step text
    for (const f of await page.locator('figure.fig').all()) expect(await f.locator('details, .step-text').count(), `${id} figure without text`).toBeGreaterThan(0);
    await expect(page.locator('.remember'), id).toBeVisible();
    await expect(page.getByTestId('read-aloud'), id).toBeVisible();
    for (const p of await page.locator('.practice').all()) await expect(p, id).toHaveAttribute('data-ready', '1');
    const imgs = await page.locator('img:not([alt])').count(); expect(imgs, `${id} img without alt`).toBe(0);
    await noOverflow(page); await tapTargets(page);
    expect(await page.locator('body').innerText(), id).not.toMatch(/\bXP\b/i);
  }
  expect(errs).toEqual([]);
});
test('robots: noindex, nofollow meta and robots.txt', async ({ page, request }) => {
  await go(page, '#/');
  await expect(page.locator('meta[name=robots]')).toHaveAttribute('content', 'noindex, nofollow');
  const r = await request.get('./robots.txt'); expect(r.ok()).toBeTruthy(); expect(await r.text()).toMatch(/Disallow: \//);
});
test('body text is at least 20px', async ({ page }) => {
  await go(page, '#/learn/01-01');
  const px = await page.evaluate(() => parseFloat(getComputedStyle(document.querySelector('.prose p')).fontSize));
  expect(px).toBeGreaterThanOrEqual(20);
});
