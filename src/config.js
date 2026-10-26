// Site-wide constants. Change cross-site links here only.
export const SITE_NAME = 'Security from Scratch';
export const SITE_URL = 'https://andreolf.github.io/security-from-scratch/'; // unlisted draft preview (noindex) until Francesco gives the go to launch
export const AI_SAFETY_URL = 'https://andreolf.github.io/ai-safety-from-scratch/'; // sibling course (two-way links, shared glossary)
export const STORE_KEY = 'sfs-v1';
export const THEME_KEY = 'sfs-theme';
export const SIZE_KEY = 'sfs-size';
export const CERT_PREFIX = 'SFS-CERT-1';
export const PASS = 0.8;
export const TEST_N = 10;
export const LAST_CHECKED = '2026-10-26';
// AI Safety from Scratch lesson link: #/learn/<id> on the sibling site.
export const aiLesson = (id) => `${AI_SAFETY_URL}#/learn/${id.replace('.', '-')}`;
