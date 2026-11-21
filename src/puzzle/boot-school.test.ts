import { describe, expect, it } from 'vitest';
import { boot, type Screens } from './boot';
import type { StorageLike } from './progress';
import type { Puzzle, PuzzleContent, SchoolContent } from './types';

const MONDAY = new Date(2026, 9, 26, 9, 0, 0);

function puzzle(id: string, difficulty: Puzzle['difficulty'], correctIndex: number): Puzzle {
  return { id, category: 'logic', difficulty, prompt: id, answerFormat: 'multipleChoice', choices: ['A', 'B', 'C', 'D'], correctIndex, explanation: 'x' };
}
const content: PuzzleContent = {
  byDifficulty: { easy: [puzzle('e1', 'easy', 0)], medium: [puzzle('m1', 'medium', 1)], hard: [puzzle('h1', 'hard', 2)] },
  onePercent: [puzzle('p1', '1percent', 3)],
};
const yale = { name: 'Yale', base: '#00356B', accent: '#FFFFFF' };
const schools: SchoolContent = { tier1: [yale], tier2: [yale], tier3: [yale], tier4: [yale], fail: [yale] };

function storage(): StorageLike {
  const m = new Map<string, string>();
  return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => void m.set(k, v), removeItem: (k) => void m.delete(k) };
}

function setup(store: StorageLike, over: Partial<{ schools: SchoolContent }> = {}) {
  const calls = { play: [] as Parameters<Screens['showPlay']>[0][], reveal: [] as Parameters<Screens['showReveal']>[0][], results: [] as Parameters<Screens['showResults']>[0][], comeback: [] as Parameters<Screens['showComeback']>[0][] };
  const screens: Screens = {
    showPlay: (v) => void calls.play.push(v),
    showReveal: (v) => void calls.reveal.push(v),
    showResults: (v) => void calls.results.push(v),
    showComeback: (v) => void calls.comeback.push(v),
  };
  boot({ now: MONDAY, dayNumber: 96, storage: store, content, schools: over.schools ?? schools, screens, clock: () => 0 });
  return calls;
}

function playRound(store: StorageLike) {
  const c = setup(store);
  [0, 1, 2].forEach((a, i) => c.play[0].session.select(i, a));
  c.play[0].onLockIn();
  c.reveal[0].onDone();
  return c;
}

describe('school colors for the pennant', () => {
  it('reveal, results and come-back all carry the stored school colors', () => {
    const store = storage();
    const first = playRound(store);
    expect(first.reveal[0].school).toEqual(yale);
    expect(first.results[0].school).toEqual(yale);
    expect(setup(store).comeback[0].school).toEqual(yale);
  });

  it('a school that has left schools.json falls back to a neutral pennant with the stored name', () => {
    const store = storage();
    playRound(store);
    const gone: SchoolContent = { tier1: [{ name: 'Other', base: '#111111', accent: '#FFFFFF' }], tier2: [], tier3: [], tier4: [], fail: [] };
    expect(setup(store, { schools: gone }).comeback[0].school).toEqual({ name: 'Yale', base: '#4A382B', accent: '#FFFFFF' });
  });
});
