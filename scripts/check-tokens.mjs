// Theme guard: every colour and font must come from src/styles/tokens.css, so a different brand
// can be swapped in by replacing that one file.
// Fails on hex colours, rgb()/hsl() literals or named font families anywhere else in the shipped source.
import fs from 'node:fs';
import path from 'node:path';
const ROOT = path.resolve(import.meta.dirname, '..');
const SCAN = ['index.html', 'src', 'public'];
const SKIP = new Set(['src/styles/tokens.css', 'src/styles/tokens.json']);
// Kit originals, kept verbatim and never shipped as-is (the app uses the tokenised copy in src/visuals/mascot-svgs.js).
const SKIP_DIRS = ['src/generated'];
const EXT = /\.(js|mjs|css|html|svg|json|txt)$/;
const RULES = [
  [/(?<![&\w])#(?:[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{3,4})\b/gi, 'hex colour'],
  [/\b(rgba?|hsla?)\(\s*\d/gi, 'rgb()/hsl() colour literal'],
  [/font-family\s*:(?!\s*var\()[^;"'}]+/gi, 'font-family without var()'],
  [/@import\s+['"]@fontsource/g, 'font file import (belongs in tokens.css)'],
  [/['"](Archivo|JetBrains Mono|Arial|Helvetica|Inter|Roboto)[^'"]*['"]/g, 'named font family'],
];
const files = [];
const walk = (rel) => { const abs = path.join(ROOT, rel); if (!fs.existsSync(abs)) return; const st = fs.statSync(abs);
  if (st.isDirectory()) { if (SKIP_DIRS.some((d) => rel === d || rel.startsWith(d + '/'))) return; for (const f of fs.readdirSync(abs)) walk(path.join(rel, f)); }
  else if (EXT.test(rel) && !SKIP.has(rel)) files.push(rel); };
SCAN.forEach(walk);
const problems = [];
for (const rel of files) {
  fs.readFileSync(path.join(ROOT, rel), 'utf8').split('\n').forEach((line, i) => {
    for (const [re, label, keep] of RULES) for (const m of line.matchAll(re)) if (!keep || keep(m[0], line)) problems.push(`${rel}:${i + 1}  ${label}: ${m[0]}`);
  });
}
if (problems.length) { console.error('Theme guard failed. Move these into src/styles/tokens.css and use var(--token):\n' + problems.join('\n')); process.exit(1); }
console.log(`theme guard ok: ${files.length} files, no colours or fonts outside tokens.css`);
