// puzzle/progress.ts — localStorage schema v2, once-a-day lock, perfect-day
// streak rules (LCK-1, STK-1..5, NFR-S4; design.md §5). Pure core: storage is
// injected for tests. Mode-specific schema; only the try/catch wrapper is
// shared (NFR-S5).

import { readJson, writeJson, type StorageLike } from '../shared/storage';
import type { Difficulty, Outcome, Slot } from './types';

export type { StorageLike } from '../shared/storage';
export { safeStorage } from '../shared/storage'; // NFR-S4 wrapper lives in shared/

export const STORAGE_KEY = 'cupofiq.puzzle.v2';
// design.md §5: the old single-puzzle shape is dropped, not translated.
export const LEGACY_KEY = 'cupofiq.puzzle.v1';

export interface PlayedQuestion {
  slot: Slot;
  difficulty: Difficulty;
  puzzleId: string;
  correct: boolean;
}

// Written once at lock-in (TMR-3) and read back on every later view of the
// day, so the school is never re-rolled. `dayNumber` is the day the round
// *started* (PZL-6).
export interface LastPlayed {
  dayNumber: number;
  isSpecialDay: boolean;
  questions: PlayedQuestion[];
  totalSeconds?: number; // omitted on Sundays: no timer runs (sign-off #23)
  outcome: Outcome;
  school: string;
}

export interface PuzzleState {
  schemaVersion: 2;
  accuracyStreak: number;
  bestStreak: number;
  lastPlayed: LastPlayed | null;
}

export function defaultState(): PuzzleState {
  return { schemaVersion: 2, accuracyStreak: 0, bestStreak: 0, lastPlayed: null };
}

const SLOTS: readonly string[] = ['q1', 'q2', 'q3', 'special'];
const DIFFICULTIES: readonly string[] = ['easy', 'medium', 'hard', '1percent'];
const OUTCOMES: readonly string[] = [
  'tier1', 'tier2', 'tier3', 'tier4', 'fail', 'accepted', 'waitlisted',
];

function nonNegInt(v: unknown): number {
  return typeof v === 'number' && Number.isFinite(v) ? Math.max(0, Math.round(v)) : 0;
}

function validQuestion(v: unknown): v is PlayedQuestion {
  if (typeof v !== 'object' || v === null) return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.slot === 'string' && SLOTS.includes(o.slot) &&
    typeof o.difficulty === 'string' && DIFFICULTIES.includes(o.difficulty) &&
    typeof o.puzzleId === 'string' &&
    typeof o.correct === 'boolean'
  );
}

function validLastPlayed(v: unknown): v is LastPlayed {
  if (typeof v !== 'object' || v === null) return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.dayNumber === 'number' && Number.isFinite(o.dayNumber) &&
    typeof o.isSpecialDay === 'boolean' &&
    Array.isArray(o.questions) && o.questions.length > 0 && o.questions.every(validQuestion) &&
    (o.totalSeconds === undefined || (typeof o.totalSeconds === 'number' && Number.isFinite(o.totalSeconds))) &&
    typeof o.outcome === 'string' && OUTCOMES.includes(o.outcome) &&
    typeof o.school === 'string'
  );
}

// Corrupt or foreign payloads fall back to a fresh state; a bad `lastPlayed`
// alone is dropped without losing the streak numbers.
export function load(storage: StorageLike | null): PuzzleState {
  if (!storage) return defaultState();
  try {
    storage.removeItem(LEGACY_KEY); // v1 drop-migration; harmless when absent
  } catch {
    // ignore — nothing to migrate
  }
  const p = readJson(storage, STORAGE_KEY);
  if (typeof p !== 'object' || p === null) return defaultState();
  const o = p as Record<string, unknown>;
  if (o.schemaVersion !== 2) return defaultState(); // future: migration lives here
  const accuracyStreak = nonNegInt(o.accuracyStreak);
  return {
    schemaVersion: 2,
    accuracyStreak,
    bestStreak: Math.max(nonNegInt(o.bestStreak), accuracyStreak), // STK-3
    lastPlayed: validLastPlayed(o.lastPlayed) ? o.lastPlayed : null,
  };
}

export function save(storage: StorageLike | null, state: PuzzleState): void {
  writeJson(storage, STORAGE_KEY, state);
}

// LCK-1 — the lock check.
export function playedToday(state: PuzzleState, dayNumber: number): boolean {
  return state.lastPlayed?.dayNumber === dayNumber;
}

// STK-1/2 — a perfect round is every question correct: weekday 3/3, or the
// single Sunday question. Derived from the answers, not the outcome, because
// weekday tier2 covers both a slow 3/3 and a 2/3 with Q3 right.
export function isPerfect(questions: readonly PlayedQuestion[]): boolean {
  return questions.length > 0 && questions.every((q) => q.correct);
}

// What the state machine hands over at lock-in; identical to what is stored.
export type RoundInput = LastPlayed;

// STK-1..5 — called only when a round completes (lock-in), so an unplayed day
// can never touch the streak (STK-5). A perfect round increments; anything else
// resets to 0; bestStreak never decreases.
//
// A record for a day at or before the stored lastPlayed day is ignored: it is a
// duplicate lock-in (second tab) or a stale round that started before a newer
// one finished, and must not double-count or overwrite the newer lock.
export function recordRound(state: PuzzleState, r: RoundInput): PuzzleState {
  if (state.lastPlayed && state.lastPlayed.dayNumber >= r.dayNumber) return state;
  const accuracyStreak = isPerfect(r.questions) ? state.accuracyStreak + 1 : 0;
  const lastPlayed: LastPlayed = {
    dayNumber: r.dayNumber,
    isSpecialDay: r.isSpecialDay,
    questions: r.questions.map((q) => ({ ...q })),
    outcome: r.outcome,
    school: r.school,
  };
  if (r.totalSeconds !== undefined) lastPlayed.totalSeconds = r.totalSeconds;
  return {
    schemaVersion: 2,
    accuracyStreak,
    bestStreak: Math.max(state.bestStreak, accuracyStreak),
    lastPlayed,
  };
}

// Mirrors GRN-3 for puzzle mode: clear the namespace; caller reloads.
export function resetAll(storage: StorageLike | null): void {
  if (!storage) return;
  for (const key of [STORAGE_KEY, LEGACY_KEY]) {
    try {
      storage.removeItem(key);
    } catch {
      // nothing to clear
    }
  }
}
