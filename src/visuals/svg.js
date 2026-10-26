// Tiny SVG string helpers. Everything is plain strings so figures render at build time (no JS needed).
export const e = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
export function T(x, y, text, { size = 16, cls = 'svg-t', anchor = 'start', weight = 400, lh = 1.25, wdth } = {}) {
  const lines = Array.isArray(text) ? text : [text];
  const st = `font-size:${size}px;font-weight:${weight}${wdth ? `;font-stretch:${wdth}%` : ''}`;
  return `<text x="${x}" y="${y}" class="${cls}" text-anchor="${anchor}" style="${st}">${lines.map((l, i) => `<tspan x="${x}" dy="${i ? size * lh : 0}">${e(l)}</tspan>`).join('')}</text>`;
}
export const box = (x, y, w, h, { hl = false, r = 10, dash = false } = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" class="${hl ? 'svg-hl' : 'svg-box'}"${dash ? ' stroke-dasharray="6 5"' : ''} stroke-width="2"/>`;
export const hlBox = (x, y, w, h, r = 6) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" class="svg-hl"/>`;
export const arrowDefs = (id) => `<defs><marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" style="fill:var(--muted-strong)"/></marker></defs>`;
export const arrow = (id, x1, y1, x2, y2, { acc = false, curve = 0 } = {}) => {
  const d = curve ? `M${x1} ${y1} Q${(x1 + x2) / 2 + curve} ${(y1 + y2) / 2 - Math.abs(curve)} ${x2} ${y2}` : `M${x1} ${y1} L${x2} ${y2}`;
  return `<path d="${d}" class="${acc ? 'svg-acc' : 'svg-line'}" stroke-width="2.4" fill="none" marker-end="url(#ar-${id})"/>`;
};
export const svg = (id, w, h, body, label) => `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${e(label)}" focusable="false">${arrowDefs('ar-' + id)}${body}</svg>`;
export const bar = (x, y, w, h, frac, { hl = false } = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" class="svg-box" stroke-width="1"/><rect x="${x}" y="${y}" width="${Math.max(0, w * frac)}" height="${h}" rx="4" ${hl ? 'class="svg-hl"' : 'style="fill:var(--muted-strong)"'}/>`;
