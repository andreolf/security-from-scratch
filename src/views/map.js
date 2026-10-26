// Progress visuals: the phase map (a ring per phase) and a lessons-done meter. No points, no levels.
import { phases, phaseWritten, phaseComplete, allLessons } from '../course.js';
import { store } from '../store.js';
import { esc, pad2 } from '../util.js';
const C = 2 * Math.PI * 26;
export function phaseMap() {
  const s = store.get();
  return `<ol class="map" data-testid="phase-map" aria-label="Phase map">${phases.map((p) => {
    const ids = p.lessons.map((l) => l.id); const done = store.doneCount(ids); const frac = done / ids.length;
    const passed = s.tests[p.id]?.passed; const written = phaseWritten(p);
    const status = passed ? 'Check passed' : written === 0 ? 'Coming soon' : `${done} of ${ids.length} lessons done` + (written < ids.length ? ` · ${written} ready so far` : phaseComplete(p) ? ' · check open' : '');
    return `<li><a class="map-item${passed ? ' passed' : ''}${written ? '' : ' locked'}" href="#/phase/${p.id}" data-phase="${p.id}">
      <span class="map-node" aria-hidden="true"><svg viewBox="0 0 56 56"><circle class="ring" cx="28" cy="28" r="26" stroke-dasharray="${(C * frac).toFixed(1)} ${C.toFixed(1)}"/></svg>${passed ? '✓' : pad2(p.number)}</span>
      <span><span class="map-t">${esc(p.title)}${p.track === 'optional' ? ' <span class="chip">Optional</span>' : ''}</span><span class="map-s">${esc(status)}</span></span></a></li>`;
  }).join('')}</ol>`;
}
export function meter() {
  const n = Object.keys(store.get().lessons).length, total = allLessons.length;
  return `<div data-testid="lessons-meter"><div class="meter" role="progressbar" aria-label="Lessons completed" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${n}"><i style="width:${(100 * n) / total}%"></i></div>
    <p style="margin:6px 0 0"><b>${n} of ${total} lessons completed.</b> Go at your own pace. There are no deadlines.</p></div>`;
}
