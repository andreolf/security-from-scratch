import './styles/base.css';
import { store } from './store.js';
import { AI_SAFETY_URL, SITE_NAME, THEME_KEY, SIZE_KEY } from './config.js';
import { allLessons } from './course.js';
import { tokens } from './util.js';

const main = document.getElementById('main');
const pages = () => import('./views/pages.js');
const routes = [
  [/^#?\/?$/, () => import('./views/home.js').then((m) => m.renderHome(main))],
  [/^#\/learn\/(\d\d-\d\d)$/, (id) => import('./views/lesson.js').then((m) => m.renderLesson(main, id))],
  [/^#\/phase\/(p\d\d)$/, (id) => pages().then((m) => m.renderPhase(main, id))],
  [/^#\/test\/(p\d\d)(?:\?.*)?$/, (id) => pages().then((m) => m.renderTest(main, id))],
  [/^#\/progress$/, () => pages().then((m) => m.renderProgress(main))],
  [/^#\/certificate\/(core|helper|wallet)$/, (k) => pages().then((m) => m.renderCert(main, k))],
  [/^#\/verify$/, () => pages().then((m) => m.renderVerify(main))],
  [/^#\/glossary(?:#.*)?$/, () => pages().then((m) => m.renderGlossary(main))],
  [/^#\/about$/, () => pages().then((m) => m.renderAbout(main))],
  // Practice page: every exercise embedded inline. #practice-01-02 deep-links to one section.
  [/^#(?:\/practice(?:#(practice-\d\d-\d\d))?|(practice-\d\d-\d\d))$/, (a, b) => import('./views/practice.js').then((m) => m.renderPractice(main, a || b))],
];
async function route() {
  const hash = location.hash || '#/';
  for (const [re, fn] of routes) {
    const m = hash.match(re);
    if (m) {
      try { const title = await fn(m[1], m[2]); document.title = title ? `${title} · ${SITE_NAME}` : SITE_NAME; }
      catch (e) { console.warn(e); main.innerHTML = `<div class="page"><h1>Something went wrong</h1><p>Please reload the page.</p></div>`; }
      if (!/practice-|#\/glossary#/.test(hash)) window.scrollTo(0, 0);
      main.focus({ preventScroll: true });
      return;
    }
  }
  main.innerHTML = `<div class="page"><h1>Page not found</h1><p><a href="#/">Go to the course home</a></p></div>`;
}
function paintProgress() {
  const n = Object.keys(store.get().lessons).length;
  document.querySelector('[data-progress-label]').textContent = n ? `${n} of ${allLessons.length} done` : 'My progress';
}
// theme-color and the favicon can't use CSS variables, so they are painted from tokens.css at runtime.
function paintChrome() {
  const k = tokens(['--bg', '--accent', '--on-accent', '--font-display']);
  document.querySelector('meta[name=theme-color]').content = k['--bg'];
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='7' fill='${k['--accent']}'/><text x='16' y='23' font-family="${k['--font-display'].replace(/"/g, "'")}" font-weight='900' font-size='19' text-anchor='middle' fill='${k['--on-accent']}'>S</text></svg>`;
  let l = document.querySelector('link[rel=icon]'); if (!l) { l = document.createElement('link'); l.rel = 'icon'; document.head.appendChild(l); }
  l.href = 'data:image/svg+xml,' + encodeURIComponent(svg);
}
function theme() {
  const b = document.querySelector('[data-theme-toggle]');
  const set = (t) => { document.documentElement.dataset.theme = t; b.textContent = t === 'dark' ? 'Light' : 'Dark'; b.setAttribute('aria-label', t === 'dark' ? 'Switch to the light theme' : 'Switch to the dark theme'); paintChrome(); };
  set(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'daylight');
  b.addEventListener('click', () => { const t = document.documentElement.dataset.theme === 'dark' ? 'daylight' : 'dark'; try { localStorage.setItem(THEME_KEY, t); } catch {} set(t); });
}
function textSize() {
  const b = document.querySelector('[data-size-toggle]'); const root = document.documentElement;
  const set = (big) => { if (big) root.dataset.size = 'large'; else delete root.dataset.size; b.setAttribute('aria-pressed', String(big)); b.textContent = big ? 'Normal text' : 'Bigger text'; };
  set(root.dataset.size === 'large');
  b.addEventListener('click', () => { const big = root.dataset.size !== 'large'; try { localStorage.setItem(SIZE_KEY, big ? 'large' : 'normal'); } catch {} set(big); });
}
document.querySelectorAll('[data-ai-link]').forEach((a) => { a.href = AI_SAFETY_URL; a.target = '_blank'; a.rel = 'noopener'; });
theme(); textSize(); paintProgress(); addEventListener('progress', paintProgress);
addEventListener('hashchange', route); route();
window.__sfs = { store };
