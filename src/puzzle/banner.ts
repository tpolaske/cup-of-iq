// puzzle/banner.ts — tier algorithm and school pick (design.md §4, TMR-1..3a).
// Pure and fully unit-tested.

import { mulberry32 } from '../shared/daily';
import type { Outcome, School, SchoolContent, SundayOutcome, WeekdayTier } from './types';

export const TIER1_TOTAL_SECONDS = 30; // provisional, TMR-1 — expect to retune after real play

export interface RoundResult {
  q1Correct: boolean;
  q2Correct: boolean;
  q3Correct: boolean; // the "hard" slot (Mon–Sat only)
  totalSeconds: number; // single round timer, stopped at Lock it in (ANS-4)
}

// TMR-1 — Mon–Sat only. Correctness drives the tier; total time is a 3/3
// tiebreaker only; Q3 correctness outweighs a straight fraction at 2/3.
export function computeWeekdayTier(r: RoundResult): WeekdayTier {
  const correctCount = [r.q1Correct, r.q2Correct, r.q3Correct].filter(Boolean).length;
  if (correctCount === 3) return r.totalSeconds <= TIER1_TOTAL_SECONDS ? 'tier1' : 'tier2';
  if (correctCount === 2) return r.q3Correct ? 'tier2' : 'tier3';
  if (correctCount === 1) return 'tier4';
  return 'fail';
}

// TMR-2 — Sunday: binary on the single untimed 1% question (sign-off #23).
export function computeSundayOutcome(specialCorrect: boolean): SundayOutcome {
  return specialCorrect ? 'accepted' : 'waitlisted';
}

// TMR-3/TMR-3a — Sunday outcomes both draw from the tier1 pool (the "so close"
// joke); there is no separate Sunday pool.
export function poolKeyFor(outcome: Outcome): WeekdayTier {
  return outcome === 'accepted' || outcome === 'waitlisted' ? 'tier1' : outcome;
}

// Runs ONCE when a round completes; the caller persists the returned name in
// lastPlayed and never re-rolls on later views (TMR-3). Seed = dayNumber, so a
// same-day reload before completion reproduces the same pick (PZL-4).
export function pickSchool(outcome: Outcome, seed: number, schools: SchoolContent): string {
  const pool = schools[poolKeyFor(outcome)];
  if (!pool || pool.length === 0) throw new Error(`banner: empty school pool for ${outcome}`);
  return pool[Math.floor(mulberry32(seed)() * pool.length)].name;
}

// Pennant colors for a persisted school name (searches every tier).
export function findSchool(name: string, schools: SchoolContent): School | undefined {
  for (const pool of Object.values(schools)) {
    const hit = pool.find((s) => s.name === name);
    if (hit) return hit;
  }
  return undefined;
}
