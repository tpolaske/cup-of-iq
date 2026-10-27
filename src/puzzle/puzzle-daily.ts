// puzzle/puzzle-daily.ts — deterministic daily round selection (design.md §3).
// Pure: no DOM, no storage, no clock reads (callers pass `now`).

import { posMod } from '../shared/daily';
import type { Difficulty, Puzzle, PuzzleContent, Slot } from './types';

// PZL-3 — Sunday, device-local.
export function isSpecialDay(now: Date = new Date()): boolean {
  return now.getDay() === 0;
}

export interface RoundQuestion {
  slot: Slot;
  difficulty: Difficulty;
  puzzle: Puzzle;
  timed: boolean; // false only for Sunday's special question (ANS-2)
}

// Assemble PuzzleContent from the two JSON files' shapes.
export function buildContent(
  main: { easy: Puzzle[]; medium: Puzzle[]; hard: Puzzle[] },
  onePercent: { onePercent: Puzzle[] },
): PuzzleContent {
  return { byDifficulty: { easy: main.easy, medium: main.medium, hard: main.hard }, onePercent: onePercent.onePercent };
}

// An empty pool would index [NaN] → undefined and blank the board; fail loudly.
function draw(pool: readonly Puzzle[], dayNumber: number, name: string): Puzzle {
  if (pool.length === 0) throw new Error(`puzzle-daily: empty ${name} pool`);
  return pool[posMod(dayNumber, pool.length)];
}

// PZL-2/PZL-3 — Mon–Sat: fixed three-question round (Q1 easy, Q2 medium,
// Q3 hard). Sunday: a single untimed 1% Club question (sign-off #23).
// Same dayNumber + same content → same round, on every device (PZL-4).
export function todaysRound(dayNumber: number, now: Date, content: PuzzleContent): RoundQuestion[] {
  if (isSpecialDay(now)) {
    return [{ slot: 'special', difficulty: '1percent', puzzle: draw(content.onePercent, dayNumber, '1percent'), timed: false }];
  }
  const { easy, medium, hard } = content.byDifficulty;
  return [
    { slot: 'q1', difficulty: 'easy', puzzle: draw(easy, dayNumber, 'easy'), timed: true },
    { slot: 'q2', difficulty: 'medium', puzzle: draw(medium, dayNumber, 'medium'), timed: true },
    { slot: 'q3', difficulty: 'hard', puzzle: draw(hard, dayNumber, 'hard'), timed: true },
  ];
}
