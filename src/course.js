import curriculum from '../content/curriculum.json';
import index from './generated/index.json';
export const course = curriculum;
export const phases = curriculum.phases;
export const phaseById = new Map(phases.map((p) => [p.id, p]));
export const allLessons = phases.flatMap((p) => p.lessons.map((l) => ({ ...l, phase: p })));
export const byId = new Map(allLessons.map((l) => [l.id, l]));
export const isWritten = (id) => !!index[id];
export const lessonIndex = index;
export const writtenCount = () => Object.keys(index).length;
export const phaseWritten = (p) => p.lessons.filter((l) => isWritten(l.id)).length;
export const phaseComplete = (p) => p.lessons.length > 0 && phaseWritten(p) === p.lessons.length;
export const corePhases = phases.filter((p) => p.track === 'core');
export const optionalPhases = phases.filter((p) => p.track === 'optional');
const lessonLoaders = import.meta.glob('./generated/lessons/*.json');
const quizLoaders = import.meta.glob('./generated/quiz-*.json');
export async function loadLesson(id) { const f = lessonLoaders[`./generated/lessons/${id}.json`]; return f ? (await f()).default : null; }
export async function loadQuizBank(pid) { const f = quizLoaders[`./generated/quiz-${pid}.json`]; return f ? (await f()).default : {}; }
export function neighbours(id) { const i = allLessons.findIndex((l) => l.id === id); return { prev: allLessons[i - 1], next: allLessons[i + 1] }; }
