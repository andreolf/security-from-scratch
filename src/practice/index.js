// Practice loader. Lessons contain <section class="practice-mount" data-practice="name"> with a text version;
// this swaps it for the live practice. Each module exports default (body, ctx).
import { practices } from './meta.js';
import { h } from '../util.js';
import { store } from '../store.js';
const modules = import.meta.glob('./p-*.js');

export function practiceShell(name) {
  const m = practices[name];
  const status = h('p', { class: 'practice-status', 'data-testid': `practice-${name}-status`, 'aria-live': 'polite' });
  const head = h('div', { class: 'practice-head' }, h('span', { class: 'pill' }, 'Practice'), h('h3', {}, m.title), h('p', {}, m.blurb), status);
  const body = h('div', { class: 'practice-body' });
  const el = h('section', { class: 'practice', 'data-testid': `practice-${name}`, 'data-ready': '0' }, head, body);
  const ctx = { body, status: (t) => (status.textContent = t), done() { store.practiceDone(name); } };
  return { el, ctx };
}
export async function mountPractice(container, name, args = {}) {
  const load = modules[`./p-${name}.js`]; if (!load) return;
  const { el, ctx } = practiceShell(name); ctx.args = args;
  container.replaceChildren(el);
  try { (await load()).default(ctx.body, ctx); el.dataset.ready = '1'; }
  catch (e) { console.warn(e); ctx.body.textContent = 'This practice could not start. ' + practices[name].text; }
}
export function hydratePractice(root) {
  root.querySelectorAll('.practice-mount[data-practice]').forEach((m) => { let a = {}; try { a = JSON.parse(m.dataset.args || '{}'); } catch {} mountPractice(m, m.dataset.practice, a); });
}
