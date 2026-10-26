export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const pad2 = (n) => String(n).padStart(2, '0');
export const fmtDate = (iso) => new Intl.DateTimeFormat('en-GB', { dateStyle: 'long' }).format(new Date(iso + 'T12:00:00'));
export const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
export const h = (tag, attrs = {}, ...kids) => {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') e.className = v; else if (k === 'html') e.innerHTML = v;
    else if (k.startsWith('on')) e.addEventListener(k.slice(2), v); else e.setAttribute(k, v === true ? '' : v);
  }
  for (const k of kids.flat()) if (k != null && k !== false) e.append(k);
  return e;
};
let toastTimer;
export function toast(msg) {
  let t = document.querySelector('.toast');
  if (!t) { t = h('div', { class: 'toast', role: 'status', 'aria-live': 'polite' }); document.body.append(t); }
  t.textContent = msg; t.hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => (t.hidden = true), 6000);
}
export function download(name, blob) {
  const a = h('a', { href: URL.createObjectURL(blob), download: name }); document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
// Deterministic shuffle: FNV-1a hash of the key seeds a mulberry32 RNG, then Fisher–Yates.
export function hash32(str) { let x = 0x811c9dc5; for (let i = 0; i < str.length; i++) { x ^= str.charCodeAt(i); x = Math.imul(x, 0x01000193); } return x >>> 0; }
export function rng(seed) { let s = seed >>> 0; return () => { s = (s + 0x6d2b79f5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
export function shuffledIdx(n, key) { const r = rng(hash32(String(key))); const a = [...Array(n).keys()]; for (let i = n - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

// Read design tokens from tokens.css at runtime (for canvas, favicon and theme-color, which can't use var()).
// theme: 'dark' | 'daylight' | undefined (current page theme).
export function tokens(names, theme) {
  const el = document.createElement('div');
  if (theme) el.setAttribute('data-theme', theme);
  el.style.display = 'none'; document.body.appendChild(el);
  const cs = getComputedStyle(el); const out = {};
  for (const n of names) out[n] = cs.getPropertyValue(n).trim();
  el.remove(); return out;
}
// Resolve var(--x) references in an SVG string so it renders outside the document (e.g. as an <img>).
export function resolveVars(svg, theme) {
  const names = [...new Set([...svg.matchAll(/var\((--[\w-]+)\)/g)].map((m) => m[1]))];
  const t = tokens(names, theme);
  return svg.replace(/var\((--[\w-]+)\)/g, (_, n) => t[n]);
}
