import { test, expect } from '@playwright/test';
import crypto from 'node:crypto';
import { watchErrors, go, seedPassed } from './helpers.js';

test('lesson: quiz explains, complete updates progress, no points shown', async ({ page }) => {
  const errs = watchErrors(page);
  await go(page, '#/learn/00-02');
  const q = page.getByTestId('question').first();
  await q.locator('label.q-opt[data-correct="false"]').first().click();
  await expect(q.locator('.q-explain')).toContainText('Not quite');
  await expect(q.locator('label.q-opt.correct')).toHaveCount(1);
  await page.getByTestId('complete').click();
  await expect(page.getByTestId('complete')).toHaveText('Done ✓');
  await expect(page.locator('[data-progress-label]')).toHaveText('1 of 71 done');
  await go(page, '#/progress');
  await expect(page.getByTestId('lessons-done')).toContainText('1');
  await expect(page.getByTestId('lessons-meter')).toContainText('1 of 71 lessons completed');
  expect(await page.locator('body').innerText()).not.toMatch(/\bXP\b|points/i);
  expect(errs).toEqual([]);
});

test('step-through picture: Next and Back, one step at a time', async ({ page }) => {
  await go(page, '#/learn/01-01');
  const fig = page.locator('figure.steps').first();
  await expect(fig.locator('.count')).toHaveText(/Step 1 of \d/);
  await expect(fig.locator('.step:visible')).toHaveCount(1);
  await fig.locator('[data-next]').click();
  await expect(fig.locator('.count')).toHaveText(/Step 2 of/);
  await fig.locator('[data-prev]').click();
  await expect(fig.locator('.count')).toHaveText(/Step 1 of/);
});

test('try-it tabs: iPhone and Android, checked-against links, done box remembered', async ({ page }) => {
  await go(page, '#/learn/00-01');
  const t = page.locator('section.try').first();
  await expect(t.locator('.tabs')).toBeVisible();
  await expect(t.locator('.try-panel:visible')).toHaveCount(1);
  await t.getByRole('tab', { name: 'Android' }).click();
  await expect(t.locator('.try-panel:visible')).toContainText('Font size');
  await expect(t.locator('.try-panel:visible a[href*="support.google.com"]')).toHaveCount(1);
  await t.getByRole('tab', { name: 'iPhone' }).click();
  await expect(t.locator('.try-panel:visible a[href*="support.apple.com"]')).toHaveCount(1);
  await t.locator('[data-try-done]').check();
  await page.reload(); await page.waitForSelector('section.try');
  await expect(page.locator('section.try [data-try-done]').first()).toBeChecked();
});

test('read this lesson to me: big button that starts and stops', async ({ page }) => {
  await go(page, '#/learn/01-02');
  const b = page.getByTestId('read-aloud');
  await expect(b).toBeVisible();
  const box = await b.boundingBox(); expect(box.height).toBeGreaterThanOrEqual(44);
  if (await b.isDisabled()) return; // browser without speech: button explains itself
  await b.click();
  // Either the device speaks (a paragraph is outlined) or it can't, and the page says so in words.
  await expect.poll(async () => (await page.locator('.reading').count()) === 1 || (await page.getByTestId('read-note').isVisible())).toBe(true);
  if (await page.getByTestId('read-note').isVisible()) { await expect(b).toHaveAttribute('aria-pressed', 'false'); return; }
  await expect(b).toHaveAttribute('aria-pressed', 'true');
  await b.click();
  await expect(b).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('.reading')).toHaveCount(0);
});

async function answer(page, nCorrect) {
  const qs = page.getByTestId('question'); const n = await qs.count();
  for (let i = 0; i < n; i++) await qs.nth(i).locator(`label.q-opt[data-correct="${i < nCorrect}"]`).first().click();
  return n;
}
test('phase check: 8 of 10 passes, 7 of 10 does not, retakes draw new questions', async ({ page }) => {
  await go(page, '#/test/p00');
  expect(await answer(page, 7)).toBe(10);
  await page.getByTestId('submit-test').click();
  await expect(page.getByTestId('test-result')).toHaveAttribute('data-pass', 'false');
  await expect(page.getByTestId('test-result')).toContainText('Not passed yet: 7 of 10');
  const first = await page.getByTestId('question').evaluateAll((els) => els.map((e) => e.dataset.qid).join(','));
  await page.getByTestId('retake').click();
  await page.waitForFunction((f) => [...document.querySelectorAll('[data-testid=question]')].map((e) => e.dataset.qid).join(',') !== f && document.querySelectorAll('[data-testid=question]').length === 10, first);
  const second = await page.getByTestId('question').evaluateAll((els) => els.map((e) => e.dataset.qid).join(','));
  expect(second).not.toBe(first);
  await answer(page, 8);
  await page.getByTestId('submit-test').click();
  await expect(page.getByTestId('test-result')).toHaveAttribute('data-pass', 'true');
  await go(page, '#/phase/p00');
  await expect(page.getByTestId('start-test')).toHaveText('Take the check again');
});

const B32 = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
function code(payload) {
  const buf = crypto.createHash('sha256').update(payload).digest(); let bits = 0, val = 0, out = '';
  for (let i = 0; i < 10; i++) { val = ((val << 8) | buf[i]) & 0xffff; bits += 8; while (bits >= 5) { out += B32[(val >>> (bits - 5)) & 31]; bits -= 5; } }
  return out.match(/.{4}/g).join('-');
}
test('certificate: core certificate, PNG and PDF, code matches an independent SHA-256, verify page', async ({ page }) => {
  await seedPassed(page);
  await go(page, '#/certificate/core');
  await page.getByTestId('cert-name').fill('Ada Lovelace');
  const want = code('SFS-CERT-1|ada lovelace|core|p00,p01,p02,p03,p04,p05,p06,p07,p08,p09,p10,p11|2026-10-26');
  await expect(page.getByTestId('cert-code')).toHaveText(want);
  await expect(page.getByTestId('cert-canvas')).toHaveAttribute('data-ready', '1');
  const [png] = await Promise.all([page.waitForEvent('download'), page.getByTestId('cert-png').click()]);
  expect(png.suggestedFilename()).toBe('security-from-scratch-core-certificate.png');
  const [pdf] = await Promise.all([page.waitForEvent('download'), page.getByTestId('cert-pdf').click()]);
  expect(pdf.suggestedFilename()).toBe('security-from-scratch-core-certificate.pdf');
  const head = (await import('node:fs')).readFileSync(await pdf.path()).subarray(0, 8).toString(); expect(head).toContain('%PDF-1.4');
  await go(page, '#/verify');
  await page.getByTestId('v-name').fill('Ada Lovelace');
  await page.getByTestId('v-key').selectOption('core');
  await page.getByTestId('v-date').fill('2026-10-26');
  await page.getByTestId('v-code').fill(want.toLowerCase());
  await page.getByTestId('v-submit').click();
  await expect(page.getByTestId('v-out')).toHaveAttribute('data-ok', 'true');
  await page.getByTestId('v-name').fill('Ada Lovelaces');
  await page.getByTestId('v-submit').click();
  await expect(page.getByTestId('v-out')).toHaveAttribute('data-ok', 'false');
});
test('certificate is locked until the phase checks are passed', async ({ page }) => {
  await go(page, '#/certificate/helper');
  await expect(page.getByTestId('cert-locked')).toBeVisible();
});

test('theme: daylight by default, dark toggle remembered; bigger text toggle', async ({ page }) => {
  await go(page, '#/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'daylight');
  await page.getByTestId('theme-toggle').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.reload(); await page.waitForSelector('#main > *');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  const before = await page.evaluate(() => parseFloat(getComputedStyle(document.body).fontSize));
  await page.getByTestId('size-toggle').click();
  await expect(page.getByTestId('size-toggle')).toHaveAttribute('aria-pressed', 'true');
  const after = await page.evaluate(() => parseFloat(getComputedStyle(document.body).fontSize));
  expect(after).toBeGreaterThan(before);
});

test('practice page: inline exercises, anchors, jump nav, lazy mounting', async ({ page }) => {
  const errs = watchErrors(page);
  await go(page, '#/practice');
  await expect(page.getByTestId('practice-jump')).toBeVisible();
  const n = await page.locator('.practice-section').count(); expect(n).toBeGreaterThanOrEqual(14);
  await expect(page.locator('.practice-section').last().locator('.practice-slot')).toHaveAttribute('data-mounted', '0');
  await page.locator('[data-jump="practice-03-01"]').click();
  await expect(page).toHaveURL(/#\/practice#practice-03-01$/);
  await expect(page.getByTestId('practice-03-01')).toBeInViewport();
  await expect(page.getByTestId('practice-03-01').locator('.practice')).toHaveAttribute('data-ready', '1');
  await page.getByTestId('practice-03-01').getByTestId('dm-diff').click();
  await page.getByTestId('practice-03-01').getByTestId('dm-hack').click();
  await expect(page.getByTestId('practice-domino-status')).toHaveText('1 of 4 accounts open');
  await page.goto('./#practice-01-05'); await page.waitForSelector('#practice-01-05 .practice[data-ready="1"]');
  await expect(page.getByTestId('practice-01-05')).toBeInViewport();
  await page.getByTestId('cid-input').fill('+41 00 000 00 00');
  await expect(page.getByTestId('cid-screen')).toHaveText('+41 00 000 00 00');
  expect(errs).toEqual([]);
});

test('practice inside a lesson: the grandchild call can be played to the end', async ({ page }) => {
  await go(page, '#/learn/01-01');
  const p = page.getByTestId('practice-call-drill');
  await expect(p).toHaveAttribute('data-ready', '1');
  for (let t = 0; t < 3; t++) await p.locator(`[data-testid^="cd-${t}-"][data-good="true"]`).click();
  await expect(page.getByTestId('practice-call-drill-status')).toContainText('3 of 3 safe choices');
  await expect(p.getByTestId('cd-again')).toBeVisible();
});

test('spot the fake (email set): every message explains its signs in words', async ({ page }) => {
  await go(page, '#/learn/02-06');
  const p = page.getByTestId('practice-spot-the-fake');
  for (let i = 0; i < 5; i++) { await p.getByTestId('stf-fake').click(); await expect(p.locator('.feedback li').first()).toBeVisible(); await p.getByTestId('stf-next').click(); }
  await expect(page.getByTestId('practice-spot-the-fake-status')).toHaveText('Finished');
});

test('cross-links to AI Safety from Scratch lessons', async ({ page }) => {
  await go(page, '#/learn/01-01');
  await expect(page.locator('a[data-xlink="ai"][href="https://andreolf.github.io/ai-safety-from-scratch/#/learn/03-02"]')).toHaveCount(1);
  await go(page, '#/learn/02-01');
  await expect(page.locator('a[data-xlink="ai"][href$="#/learn/03-04"]')).toHaveCount(1);
});

test('reduced motion: step-throughs change without animation', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' }); const page = await ctx.newPage();
  await go(page, '#/learn/00-03');
  const fig = page.locator('figure.steps').first();
  await fig.locator('[data-next]').click();
  await expect(fig.locator('.step.anim-in')).toHaveCount(0);
  await ctx.close();
});
