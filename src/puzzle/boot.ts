// puzzle/boot.ts — boot controller (design.md §2, §3 "capture once", LCK-1, PZL-6).
// Reads saved state, decides play vs come-back, owns the lock-in → persist →
// reveal → results flow. Pure orchestration: the screens, storage, clock and
// visibility wiring are all injected, so nothing here touches the DOM.
// The thin DOM entry (src/puzzle/main.ts) wires the real screens in with them.

import {
  load,
  playedToday,
  recordRound,
  save,
  type LastPlayed,
  type PuzzleState,
  type StorageLike,
} from './progress';
import { findSchool } from './banner';
import { createSession, type PuzzleSession } from './puzzle';
import type { RoundTimer } from './timer';
import { buildShareText } from './share';
import type { Puzzle, PuzzleContent, School, SchoolContent } from './types';

// Screen contracts. Screens render what they are given and call back; they never
// touch storage or the state machine's transitions themselves.

export interface PlayView {
  session: PuzzleSession; // screens call session.select / goTo and re-read getState()
  onLockIn(): void; // the confirmed "Lock it in" (ANS-3)
}

export interface RevealView {
  round: LastPlayed;
  school: School; // pennant colors for round.school (neutral fallback if unknown)
  puzzles: (Puzzle | null)[]; // aligned with round.questions
  onDone(): void; // the screen auto-advances when its animation ends (TMR-5)
}

export interface ResultsView {
  round: LastPlayed;
  school: School;
  puzzles: (Puzzle | null)[];
  streak: number;
  bestStreak: number;
  shareText: string;
}

export type ComebackView = ResultsView;

export interface Screens {
  showPlay(view: PlayView): void;
  showReveal(view: RevealView): void;
  showResults(view: ResultsView): void;
  showComeback(view: ComebackView): void;
}

export interface BootDeps {
  now: Date; // captured once (PZL-6)
  dayNumber: number; // captured once (PZL-6)
  storage: StorageLike | null; // null = private mode → stateless (NFR-S4)
  content: PuzzleContent;
  schools: SchoolContent;
  screens: Screens;
  clock?: () => number;
  // The entry wires pauseWhileHidden(timer, document) here (ANS-4).
  watchVisibility?: (timer: RoundTimer) => void;
}

export type BootResult =
  | { route: 'comeback' }
  | { route: 'play'; session: PuzzleSession };

// Resolve persisted puzzle ids back to puzzles. A null means the id is no longer
// in the bank (content edited); screens must tolerate it rather than crash.
export function findPuzzle(content: PuzzleContent, id: string): Puzzle | null {
  const pools: Puzzle[][] = [
    content.byDifficulty.easy,
    content.byDifficulty.medium,
    content.byDifficulty.hard,
    content.onePercent,
  ];
  for (const pool of pools) {
    const hit = pool.find((p) => p.id === id);
    if (hit) return hit;
  }
  return null;
}

// A school removed from schools.json must never break a stored day: fall back to
// a neutral pennant carrying the stored name.
function schoolFor(schools: SchoolContent, round: LastPlayed): School {
  return findSchool(round.school, schools) ?? { name: round.school, base: '#4A382B', accent: '#FFFFFF' };
}

function resolve(content: PuzzleContent, round: LastPlayed): (Puzzle | null)[] {
  return round.questions.map((q) => findPuzzle(content, q.puzzleId));
}

export function boot(deps: BootDeps): BootResult {
  const { dayNumber, storage, content, screens } = deps;
  let state: PuzzleState = load(storage);

  const resultsView = (round: LastPlayed): ResultsView => ({
    round,
    school: schoolFor(deps.schools, round),
    puzzles: resolve(content, round),
    streak: state.accuracyStreak,
    bestStreak: state.bestStreak,
    shareText: buildShareText(round, state.accuracyStreak),
  });

  // LCK-1 — a completed round shows the come-back card, never the board. The
  // persisted lastPlayed (incl. the school) is shown as stored, never re-rolled.
  if (state.lastPlayed && playedToday(state, dayNumber)) {
    screens.showComeback(resultsView(state.lastPlayed));
    return { route: 'comeback' };
  }

  const session = createSession({
    dayNumber,
    now: deps.now,
    content,
    schools: deps.schools,
    clock: deps.clock,
  });
  deps.watchVisibility?.(session.timer);

  let revealDone = false;

  function onLockIn(): void {
    const round = session.lockIn(); // null unless fully answered, and only once (ANS-1)
    if (!round) return;
    // Persist BEFORE the reveal: a reload mid-reveal must find the day locked.
    state = recordRound(state, round);
    save(storage, state);
    session.beginReveal();
    screens.showReveal({
      round,
      school: schoolFor(deps.schools, round),
      puzzles: resolve(content, round),
      onDone() {
        if (revealDone) return;
        revealDone = true;
        session.finishReveal();
        screens.showResults(resultsView(round));
      },
    });
  }

  session.start(); // timer begins as the round first renders (ANS-4)
  screens.showPlay({ session, onLockIn });
  return { route: 'play', session };
}
