import { describe, expect, it } from 'vitest';
import { buildContent, isSpecialDay, todaysRound } from './puzzle-daily';
import type { Puzzle } from './types';

const mk = (difficulty: Puzzle['difficulty'], n: number): Puzzle[] =>
  Array.from({ length: n }, (_, i) => ({
    id: `${difficulty}-${String(i + 1).padStart(3, '0')}`,
    category: 'logic',
    difficulty,
    prompt: 'p',
    answerFormat: 'multipleChoice',
    choices: ['a', 'b', 'c', 'd'],
    correctIndex: 0,
    explanation: 'e',
  }));

// Pool lengths are deliberately coprime-ish with each other and not multiples of 7.
const content = buildContent({ easy: mk('easy', 32), medium: mk('medium', 31), hard: mk('hard', 23) }, { onePercent: mk('1percent', 10) });

const FRI = new Date(2026, 9, 23); // Friday — Day 82
const SUN = new Date(2026, 9, 25); // Sunday — Day 84

describe('isSpecialDay (PZL-3)', () => {
  it('is true only on Sunday, device-local', () => {
    expect(isSpecialDay(SUN)).toBe(true);
    for (let d = 19; d <= 24; d++) expect(isSpecialDay(new Date(2026, 9, d))).toBe(false); // Mon–Sat
  });
});

describe('todaysRound — Mon–Sat', () => {
  const round = todaysRound(82, FRI, content);

  it('is exactly Q1 easy, Q2 medium, Q3 hard, all timed, in that order', () => {
    expect(round.map((q) => [q.slot, q.difficulty, q.timed])).toEqual([
      ['q1', 'easy', true],
      ['q2', 'medium', true],
      ['q3', 'hard', true],
    ]);
    expect(round.map((q) => q.puzzle.difficulty)).toEqual(['easy', 'medium', 'hard']);
  });

  it('indexes each pool by posMod(dayNumber, length) (design §3)', () => {
    expect(round[0].puzzle.id).toBe('easy-' + String((82 % 32) + 1).padStart(3, '0'));
    expect(round[1].puzzle.id).toBe('medium-' + String((82 % 31) + 1).padStart(3, '0'));
    expect(round[2].puzzle.id).toBe('hard-' + String((82 % 23) + 1).padStart(3, '0'));
  });

  it('is deterministic: same day + content → identical round (PZL-4)', () => {
    expect(todaysRound(82, FRI, content).map((q) => q.puzzle.id)).toEqual(round.map((q) => q.puzzle.id));
  });

  it('changes from one day to the next', () => {
    const next = todaysRound(83, new Date(2026, 9, 24), content);
    for (let i = 0; i < 3; i++) expect(next[i].puzzle.id).not.toBe(round[i].puzzle.id);
  });
});

describe('todaysRound — Sunday (sign-off #23)', () => {
  it('is a single untimed 1% Club question', () => {
    const r = todaysRound(84, SUN, content);
    expect(r).toHaveLength(1);
    expect(r[0]).toMatchObject({ slot: 'special', difficulty: '1percent', timed: false });
    expect(r[0].puzzle.id).toBe('1percent-' + String((84 % 10) + 1).padStart(3, '0'));
  });

  it('with 7-day steps every Sunday question is reachable (pool not a multiple of 7)', () => {
    const seen = new Set<string>();
    for (let day = 84, i = 0; i < 10; i++, day += 7) seen.add(todaysRound(day, new Date(2026, 9, 25 + i * 7), content)[0].puzzle.id);
    expect(seen.size).toBe(10);
  });
});

describe('guards', () => {
  it('throws on an empty pool rather than serving an undefined question', () => {
    const bad = buildContent({ easy: [], medium: mk('medium', 3), hard: mk('hard', 3) }, { onePercent: mk('1percent', 3) });
    expect(() => todaysRound(1, FRI, bad)).toThrow(/empty easy/);
    const noSpecial = buildContent({ easy: mk('easy', 3), medium: mk('medium', 3), hard: mk('hard', 3) }, { onePercent: [] });
    expect(() => todaysRound(1, SUN, noSpecial)).toThrow(/empty 1percent/);
  });

  it('handles pre-launch Day 1 and large day numbers without negative indexes', () => {
    expect(todaysRound(1, FRI, content)[0].puzzle).toBeDefined();
    expect(todaysRound(100000, FRI, content)[2].puzzle).toBeDefined();
  });
});
