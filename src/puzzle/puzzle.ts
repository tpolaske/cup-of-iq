// puzzle/puzzle.ts — round state machine (design.md §2, ANS-1..4, PZL-6).
//   idle → answering_round → locked_in → reveal → results
// (the standalone `comeback` screen is chosen by the caller via
// progress.playedToday, never entered through this machine).
//
// Pure: no DOM, no storage, no wall-clock reads. The caller persists the
// result of lockIn() (progress.recordRound + save) and wires visibility
// pausing with pauseWhileHidden(session.timer, document).

import { computeSundayOutcome, computeWeekdayTier, pickSchool } from './banner';
import type { LastPlayed, PlayedQuestion } from './progress';
import { todaysRound, type RoundQuestion } from './puzzle-daily';
import { createRoundTimer, type RoundTimer } from './timer';
import type { Outcome, PuzzleContent, SchoolContent } from './types';

export type Phase = 'idle' | 'answering_round' | 'locked_in' | 'reveal' | 'results';

export interface SessionOptions {
  dayNumber: number;
  now: Date;
  content: PuzzleContent;
  schools: SchoolContent;
  clock?: () => number; // injected for tests; defaults to performance.now
}

export interface SessionState {
  phase: Phase;
  dayNumber: number;
  isSpecialDay: boolean;
  questions: readonly RoundQuestion[];
  answers: readonly (number | null)[]; // chosen choice index per question
  currentIndex: number;
  allAnswered: boolean;
  result: LastPlayed | null; // set once locked in
}

export interface PuzzleSession {
  readonly timer: RoundTimer;
  getState(): SessionState;
  start(): boolean; // idle → answering_round; starts the timer (ANS-4)
  select(questionIndex: number, choiceIndex: number): boolean; // highlight only (ANS-3)
  goTo(questionIndex: number): boolean; // free navigation (ANS-3)
  lockIn(): LastPlayed | null; // answering_round → locked_in; null when not allowed
  beginReveal(): boolean; // locked_in → reveal
  finishReveal(): boolean; // reveal → results (the screen auto-advances, TMR-5)
}

// PZL-6 — dayNumber, Sunday status and the questions are captured ONCE here and
// used for the whole round, including lock-in after midnight.
export function createSession(opts: SessionOptions): PuzzleSession {
  const dayNumber = opts.dayNumber;
  const questions = todaysRound(dayNumber, opts.now, opts.content);
  const isSpecialDay = questions.some((q) => q.slot === 'special');
  const timer = createRoundTimer(questions.some((q) => q.timed), opts.clock);

  let phase: Phase = 'idle';
  let currentIndex = 0;
  let result: LastPlayed | null = null;
  const answers: (number | null)[] = questions.map(() => null);

  const allAnswered = () => answers.every((a) => a !== null);

  function buildResult(): LastPlayed {
    const seconds = timer.stop(); // null on Sunday (untimed)
    const played: PlayedQuestion[] = questions.map((q, i) => ({
      slot: q.slot,
      difficulty: q.difficulty,
      puzzleId: q.puzzle.id,
      correct: answers[i] === q.puzzle.correctIndex,
    }));

    let outcome: Outcome;
    if (isSpecialDay) {
      outcome = computeSundayOutcome(played[0].correct);
    } else {
      // A missing time must never award the fast tier: treat it as slow.
      outcome = computeWeekdayTier({
        q1Correct: played[0].correct,
        q2Correct: played[1].correct,
        q3Correct: played[2].correct,
        totalSeconds: seconds ?? Number.POSITIVE_INFINITY,
      });
    }

    const round: LastPlayed = {
      dayNumber,
      isSpecialDay,
      questions: played,
      outcome,
      school: pickSchool(outcome, dayNumber, opts.schools), // once; persisted, never re-rolled (TMR-3)
    };
    if (seconds !== null) round.totalSeconds = Math.round(seconds);
    return round;
  }

  return {
    timer,
    getState: () => ({
      phase,
      dayNumber,
      isSpecialDay,
      questions,
      answers: [...answers],
      currentIndex,
      allAnswered: allAnswered(),
      result,
    }),
    start() {
      if (phase !== 'idle') return false;
      phase = 'answering_round';
      timer.start(); // no-op on Sunday
      return true;
    },
    select(questionIndex, choiceIndex) {
      if (phase !== 'answering_round') return false;
      const q = questions[questionIndex];
      if (!q || !Number.isInteger(choiceIndex) || choiceIndex < 0 || choiceIndex >= q.puzzle.choices.length) {
        return false;
      }
      answers[questionIndex] = choiceIndex;
      return true;
    },
    goTo(questionIndex) {
      if (phase !== 'answering_round') return false;
      if (!Number.isInteger(questionIndex) || questionIndex < 0 || questionIndex >= questions.length) return false;
      currentIndex = questionIndex;
      return true;
    },
    lockIn() {
      // ANS-1/3: one attempt, and only once every question is answered. A second
      // call (double tap) returns null so the caller never records twice.
      if (phase !== 'answering_round' || !allAnswered()) return null;
      result = buildResult();
      phase = 'locked_in';
      return result;
    },
    beginReveal() {
      if (phase !== 'locked_in') return false;
      phase = 'reveal';
      return true;
    },
    finishReveal() {
      if (phase !== 'reveal') return false;
      phase = 'results';
      return true;
    },
  };
}
