import { expect } from '@playwright/test';
// Collect console errors and page errors for the whole test.
export function watchErrors(page) {
  const errs = [];
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', (e) => errs.push(String(e)));
  return errs;
}
export async function go(page, hash) {
  await page.goto('./' + hash);
  await page.waitForFunction(() => document.querySelector('#main')?.children.length > 0);
  await page.waitForTimeout(150);
}
export async function noOverflow(page) {
  const o = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, w: window.innerWidth,
    wide: [...document.querySelectorAll('body *')].filter((e) => { const r = e.getBoundingClientRect(); return r.width && r.right > window.innerWidth + 1 && getComputedStyle(e).position !== 'fixed' && !e.closest('.sr, [hidden], pre, .table-wrap'); }).slice(0, 5).map((e) => e.tagName + '.' + e.className) }));
  expect(o.sw, `horizontal overflow: ${o.wide.join(', ')}`).toBeLessThanOrEqual(o.w + 1);
}
// Tap targets ≥44px (WCAG 2.5.5). Inline links inside sentences are exempt, as WCAG allows.
export async function tapTargets(page) {
  const bad = await page.evaluate(() => {
    const sel = 'button, .btn, select, input:not([type=radio]):not([type=checkbox]):not([type=hidden]), summary, label.q-opt, a.chip, button.chip, .top a, .lesson-nav a, .lessons a, .phase-map a, [role=button]';
    return [...document.querySelectorAll(sel)].filter((e) => {
      const r = e.getBoundingClientRect(); const cs = getComputedStyle(e);
      if (!r.width || !r.height || cs.visibility === 'hidden' || e.closest('[hidden], .sr, .skip')) return false;
      return r.height < 43.5 || (e.matches('button, .btn, select, summary, a.chip, button.chip, [role=button]') && r.width < 43.5);
    }).slice(0, 8).map((e) => `${e.tagName}.${e.className} "${(e.textContent || '').trim().slice(0, 30)}" ${Math.round(e.getBoundingClientRect().width)}x${Math.round(e.getBoundingClientRect().height)}`);
  });
  expect(bad, 'tap targets under 44px').toEqual([]);
}
export const seedPassedFoundations = (page, extra = {}) => page.addInitScript(([extra]) => {
  if (sessionStorage.getItem('seeded')) return; sessionStorage.setItem('seeded', '1');
  const tests = {}; for (let i = 0; i <= 10; i++) tests['p' + String(i).padStart(2, '0')] = { best: 1, passed: true, date: '2026-10-26', attempts: 1 };
  localStorage.setItem('aisfs-v1', JSON.stringify({ v: 1, xp: 0, lessons: {}, quiz: {}, tests, days: [], name: '', certs: {}, labs: {}, last: null, ...extra }));
}, [extra]);
