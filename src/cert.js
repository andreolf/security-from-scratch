// Certificates: drawn in the browser (canvas), exported as PNG or a minimal hand-built PDF.
// The drawing lives in drawCert() so the branding kit's certificate template can replace it.
import { CERT_PREFIX } from './config.js';
import { corePhases, optionalPhases } from './course.js';
import { tokens } from './util.js';

export const CERT_W = 2000, CERT_H = 1414; // A4 landscape ratio
export const CREDENTIALS = {
  core: { title: 'Core course', line: 'Security from Scratch: Core course', phases: () => corePhases.map((p) => p.id), what: 'Phases 00 to 11: phone and message scams, phishing, passwords, two-step sign-in, devices, money, AI tricks, reporting and helping others.' },
  helper: { title: 'Family helper', line: 'Security from Scratch: Family helper', phases: () => ['p00', 'p01', 'p11'], what: 'Phases 00, 01 and 11: the golden rules, phone scams and how to help a family member stay safe.' },
  wallet: { title: 'Wallet basics (optional)', line: 'Security from Scratch: Wallet basics', phases: () => optionalPhases.map((p) => p.id), what: 'Optional Phase 12: crypto wallet safety basics, wallet-neutral.' },
};
export const DISCLAIMER = 'Free certificate of completion. Not accredited, not a professional or security qualification. Not affiliated with or endorsed by any police force, government body, bank, MetaMask or Consensys.';
const B32 = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'; // Crockford base32
export const normName = (s) => String(s || '').normalize('NFC').trim().replace(/\s+/g, ' ');
export const cleanCode = (s) => String(s || '').toUpperCase().replace(/[^0-9A-Z]/g, '').replace(/O/g, '0').replace(/[IL]/g, '1');
export function codeFromDigest(buf) {
  let bits = 0, val = 0, out = '';
  for (let i = 0; i < 10; i++) { val = ((val << 8) | buf[i]) & 0xffff; bits += 8; while (bits >= 5) { out += B32[(val >>> (bits - 5)) & 31]; bits -= 5; } }
  return out.match(/.{4}/g).join('-');
}
export const certPayload = (name, key, phaseIds, date) => `${CERT_PREFIX}|${normName(name).toLowerCase()}|${key}|${phaseIds.join(',')}|${date}`;
export async function certCode(name, key, date) {
  const c = CREDENTIALS[key]; if (!c) return '';
  const buf = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(certPayload(name, key, c.phases(), date))));
  return codeFromDigest(buf);
}
function wrap(ctx, text, maxW) { const words = text.split(' '), lines = []; let cur = ''; for (const w of words) { const t = cur ? cur + ' ' + w : w; if (ctx.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t; } if (cur) lines.push(cur); return lines; }
let FONT = 'system-ui, sans-serif', MONO = 'ui-monospace, monospace';
const F = (w, size, wdth = 100) => `${wdth === 125 ? 'expanded ' : ''}${w} ${size}px ${FONT}`;

// Layout follows the branding kit's certificate template (2026-10-26-ai-safety-certificate-a4):
// Daylight card, name on the one highlighter box, date / author / verify row.
export async function drawCert(canvas, { name, key, dateLabel, code, verifyUrl }) {
  // All colours and fonts come from tokens.css (the certificate always uses the daylight theme).
  const T = tokens(['--bg', '--fg', '--muted-strong', '--line', '--accent', '--on-accent', '--black', '--font-display', '--font-mono'], 'daylight');
  FONT = T['--font-display'] || FONT; MONO = T['--font-mono'] || MONO;
  try { await Promise.all([document.fonts.load(F(900, 80)), document.fonts.load(F(400, 30)), document.fonts.load(`500 30px ${MONO}`)]); } catch {}
  const c = CREDENTIALS[key]; canvas.width = CERT_W; canvas.height = CERT_H;
  const g = canvas.getContext('2d'); const HL = T['--accent'], ON_HL = T['--on-accent'], INK = T['--fg'], BG = T['--bg'], MUTED = T['--muted-strong'];
  g.fillStyle = BG; g.fillRect(0, 0, CERT_W, CERT_H);
  g.strokeStyle = INK; g.lineWidth = 8; g.beginPath(); g.roundRect(64, 64, CERT_W - 128, CERT_H - 128, 28); g.stroke();
  g.textBaseline = 'alphabetic'; g.textAlign = 'left';
  g.fillStyle = INK; g.font = F(900, 40, 125); g.fillText('SECURITY FROM SCRATCH', 170, 230);
  g.fillStyle = MUTED; g.font = F(800, 34); g.fillText('CERTIFICATE OF COMPLETION', 170, 390);
  const nm = name || 'Your name'; g.font = F(900, 110, 125); const maxW = CERT_W - 360; const nw = Math.min(g.measureText(nm).width, maxW);
  g.fillStyle = HL; g.beginPath(); g.roundRect(150, 420, nw + 44, 150, 12); g.fill();
  g.fillStyle = ON_HL; g.fillText(nm, 172, 535, maxW);
  g.font = F(400, 40); g.fillText('completed', 170, 660);
  g.font = F(800, 46); g.fillText(c.line, 170, 725, CERT_W - 340);
  g.font = F(400, 34); wrap(g, c.what, CERT_W - 340).slice(0, 3).forEach((l, i) => g.fillText(l, 170, 795 + i * 46));
  const cols = [['DATE', dateLabel, F(800, 38)], ['COURSE AUTHOR', 'Francesco Andreoli', F(800, 38)], ['VERIFY', code, `500 34px ${MONO}`]];
  cols.forEach(([h, v, f], i) => { const x = 170 + i * 560; g.fillStyle = MUTED; g.font = F(800, 26); g.fillText(h, x, 1010); g.fillStyle = INK; g.fillRect(x, 1028, 470, 4); g.font = f; g.fillText(v, x, 1085, 500); });
  g.fillStyle = MUTED; g.font = F(400, 24); g.fillText(`Check the code at ${verifyUrl}`, 170, 1140);
  g.fillStyle = T['--line']; g.fillRect(170, 1180, CERT_W - 340, 2);
  g.fillStyle = MUTED; g.font = F(400, 24); wrap(g, DISCLAIMER + ' Personal project by Francesco Andreoli.', CERT_W - 340).forEach((l, i) => g.fillText(l, 170, 1225 + i * 34));
}

export function pdfFromCanvas(canvas) {
  const jpg = atob(canvas.toDataURL('image/jpeg', 0.93).split(',')[1]);
  const img = new Uint8Array(jpg.length); for (let i = 0; i < jpg.length; i++) img[i] = jpg.charCodeAt(i);
  const PW = 842, PH = 595, enc = new TextEncoder();
  const content = `q ${PW} 0 0 ${PH} 0 0 cm /Im0 Do Q`;
  const chunks = [], offsets = []; let len = 0;
  const push = (x) => { const b = typeof x === 'string' ? enc.encode(x) : x; chunks.push(b); len += b.length; };
  push('%PDF-1.4\n');
  const obj = (n, body) => { offsets[n] = len; push(`${n} 0 obj\n`); body(); push('\nendobj\n'); };
  obj(1, () => push('<< /Type /Catalog /Pages 2 0 R >>'));
  obj(2, () => push('<< /Type /Pages /Kids [3 0 R] /Count 1 >>'));
  obj(3, () => push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PW} ${PH}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>`));
  obj(4, () => { push(`<< /Type /XObject /Subtype /Image /Width ${canvas.width} /Height ${canvas.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${img.length} >>\nstream\n`); push(img); push('\nendstream'); });
  obj(5, () => push(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`));
  obj(6, () => push('<< /Title (Security from Scratch certificate of completion) /Creator (security-from-scratch, generated in the browser) >>'));
  const xref = len;
  push(`xref\n0 7\n0000000000 65535 f \n${[1, 2, 3, 4, 5, 6].map((n) => String(offsets[n]).padStart(10, '0') + ' 00000 n \n').join('')}trailer\n<< /Size 7 /Root 1 0 R /Info 6 0 R >>\nstartxref\n${xref}\n%%EOF\n`);
  return new Blob(chunks, { type: 'application/pdf' });
}
