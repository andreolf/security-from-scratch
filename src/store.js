// Progress lives only in this browser (localStorage). No accounts, no tracking, nothing sent anywhere.
// Gentle progress only: lessons done, practice done, phase checks passed. No points, no streaks, no timers.
import { STORE_KEY, PASS } from './config.js';
const blank = () => ({ v: 1, lessons: {}, quiz: {}, tests: {}, tries: {}, practice: {}, name: '', certs: {}, card: {}, last: null });
let s;
function load() { try { s = { ...blank(), ...JSON.parse(localStorage.getItem(STORE_KEY) || '{}') }; } catch { s = blank(); } }
function save() { try { localStorage.setItem(STORE_KEY, JSON.stringify(s)); } catch {} dispatchEvent(new CustomEvent('progress')); }
const pad = (n) => String(n).padStart(2, '0');
const dayKey = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
load();
export const store = {
  get: () => s,
  today: () => dayKey(),
  isDone: (id) => !!s.lessons[id],
  doneCount: (ids) => ids.filter((i) => s.lessons[i]).length,
  visit(id) { s.last = id; save(); },
  complete(id) { if (s.lessons[id]) return false; s.lessons[id] = dayKey(); save(); return true; },
  answer(qid, firstTryCorrect) { if (qid in s.quiz) return; s.quiz[qid] = !!firstTryCorrect; save(); },
  tryDone(key, on = true) { if (on) s.tries[key] = dayKey(); else delete s.tries[key]; save(); },
  practiceDone(name) { if (s.practice[name]) return false; s.practice[name] = dayKey(); save(); return true; },
  setCard(card) { s.card = card; save(); },
  testResult(pid, score, n) {
    const frac = score / n, passed = frac >= PASS, prev = s.tests[pid];
    const first = passed && !prev?.passed;
    s.tests[pid] = { best: Math.max(frac, prev?.best || 0), passed: passed || !!prev?.passed, date: first ? dayKey() : prev?.date || (passed ? dayKey() : null), attempts: (prev?.attempts || 0) + 1 };
    save(); return first;
  },
  setName(n) { s.name = n; save(); },
  saveCert(key, c) { s.certs[key] = c; save(); },
  replace(obj) { s = { ...blank(), ...obj }; save(); },
  reset() { s = blank(); save(); },
};
