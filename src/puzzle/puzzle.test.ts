import { describe, expect, it } from 'vitest';
import { defaultState, playedToday, recordRound } from './progress';
import { createSession } from './puzzle';
import { pauseWhileHidden } from './timer';
import type { Puzzle, PuzzleContent, SchoolContent } from './types';

const MONDAY = new Date(2026, 9, 26, 9, 0, 0); // 2026-10-26, local
const SUNDAY = new Date(2026, 9, 25, 9, 0, 0); // 2026-10-25, local

function puzzle(id: string, difficulty: Puzzle['difficulty'], correctIndex: number): Puzzle {
  return {
    id,
    category: 'logic',
    difficulty,
    prompt: `Prompt ${id}`,
    answerFormat: 'multipleChoice',
    choices: ['A', 'B', 'C', 'D'],
    correctIndex,
    explanation: `Because ${id}`,
  };
}

// Single-entry pools → the drawn question is the same for any dayNumber.
const content: PuzzleContent = {
  byDifficulty: {
    easy: [puzzle('e1', 'easy', 0)],
    medium: [puzzle('m1', 'medium', 1)],
    hard: [puzzle('h1', 'hard', 2)],
  },
  onePercent: [puzzle('p1', '1percent', 3)],
};

const schools: SchoolContent = {
  tier1: [{ name: 'Yale', base: '#00356B', accent: '#FFFFFF' }],
  tier2: [{ name: 'Brown', base: '#4E3629', accent: '#FFFFFF' }],
  tier3: [{ name: 'Tulane', base: '#006747', accent: '#FFFFFF' }],
  tier4: [{ name: 'Providence', base: '#000000', accent: '#FFFFFF' }],
  fail: [{ name: 'Central Connecticut State', base: '#0033A0', accent: '#FFFFFF' }],
};

function fakeClock(start = 0) {
  let t = start;
  return { now: () => t, set: (ms: number) => void (t = ms) };
}

function weekday(clock = fakeClock(), dayNumber = 96) {
  return createSession({ dayNumber, now: MONDAY, content, schools, clock: clock.now });
}

const RIGHT = [0, 1, 2]; // correct choice per weekday question
const WRONG = [3, 3, 3];

function answerAll(s: ReturnType<typeof weekday>, picks: number[]) {
  picks.forEach((c, i) => s.select(i, c));
}

describe('phases (design.md §2)', () => {
  it('walks idle → answering_round → locked_in → reveal → results', () => {
    const s = weekday();
    expect(s.getState().phase).toBe('idle');
    expect(s.start()).toBe(true);
    expect(s.getState().phase).toBe('answering_round');
    answerAll(s, RIGHT);
    expect(s.lockIn()).not.toBeNull();
    expect(s.getState().phase).toBe('locked_in');
    expect(s.beginReveal()).toBe(true);
    expect(s.getState().phase).toBe('reveal');
    expect(s.finishReveal()).toBe(true);
    expect(s.getState().phase).toBe('results');
  });

  it('rejects out-of-order transitions without changing state', () => {
    const s = weekday();
    expect(s.select(0, 0)).toBe(false); // idle
    expect(s.goTo(1)).toBe(false);
    expect(s.lockIn()).toBeNull();
    expect(s.beginReveal()).toBe(false);
    expect(s.finishReveal()).toBe(false);
    s.start();
    expect(s.start()).toBe(false); // second start
    expect(s.beginReveal()).toBe(false); // before lock-in
    expect(s.finishReveal()).toBe(false);
    expect(s.getState().phase).toBe('answering_round');
  });

  it('exposes the three weekday questions in fixed order (PZL-2)', () => {
    const st = weekday().getState();
    expect(st.questions.map((q) => q.slot)).toEqual(['q1', 'q2', 'q3']);
    expect(st.questions.map((q) => q.puzzle.id)).toEqual(['e1', 'm1', 'h1']);
    expect(st.isSpecialDay).toBe(false);
  });
});

describe('answering (ANS-3)', () => {
  it('select only highlights; answers can be changed freely before lock-in', () => {
    const s = weekday();
    s.start();
    s.select(0, 2);
    s.select(0, 0);
    expect(s.getState().answers).toEqual([0, null, null]);
    expect(s.getState().phase).toBe('answering_round');
    expect(s.getState().result).toBeNull();
  });

  it('navigates freely between questions', () => {
    const s = weekday();
    s.start();
    expect(s.goTo(2)).toBe(true);
    expect(s.getState().currentIndex).toBe(2);
    expect(s.goTo(0)).toBe(true);
    expect(s.getState().currentIndex).toBe(0);
  });

  it('rejects bad indices and choices', () => {
    const s = weekday();
    s.start();
    expect(s.select(3, 0)).toBe(false);
    expect(s.select(-1, 0)).toBe(false);
    expect(s.select(0, 4)).toBe(false);
    expect(s.select(0, -1)).toBe(false);
    expect(s.select(0, 1.5)).toBe(false);
    expect(s.goTo(3)).toBe(false);
    expect(s.goTo(-1)).toBe(false);
    expect(s.getState().answers).toEqual([null, null, null]);
  });

  it('cannot lock in until all three are answered', () => {
    const s = weekday();
    s.start();
    s.select(0, 0);
    s.select(1, 1);
    expect(s.getState().allAnswered).toBe(false);
    expect(s.lockIn()).toBeNull();
    expect(s.getState().phase).toBe('answering_round');
    s.select(2, 2);
    expect(s.getState().allAnswered).toBe(true);
    expect(s.lockIn()).not.toBeNull();
  });
});

describe('one attempt (ANS-1)', () => {
  it('a second lockIn returns null so the caller never records twice', () => {
    const s = weekday();
    s.start();
    answerAll(s, RIGHT);
    expect(s.lockIn()).not.toBeNull();
    expect(s.lockIn()).toBeNull();
  });

  it('answers are frozen after lock-in', () => {
    const s = weekday();
    s.start();
    answerAll(s, RIGHT);
    s.lockIn();
    expect(s.select(0, 3)).toBe(false);
    expect(s.goTo(1)).toBe(false);
    expect(s.getState().answers).toEqual(RIGHT);
  });

  it('there is no path back to answering_round', () => {
    const s = weekday();
    s.start();
    answerAll(s, RIGHT);
    s.lockIn();
    s.beginReveal();
    s.finishReveal();
    expect(s.start()).toBe(false);
    expect(s.getState().phase).toBe('results');
  });
});

describe('weekday result (TMR-1)', () => {
  it('3/3 in under 30 s → tier1 and the tier-1 school', () => {
    const clock = fakeClock();
    const s = weekday(clock);
    s.start();
    clock.set(20_000);
    answerAll(s, RIGHT);
    const r = s.lockIn()!;
    expect(r.outcome).toBe('tier1');
    expect(r.school).toBe('Yale');
    expect(r.totalSeconds).toBe(20);
    expect(r.isSpecialDay).toBe(false);
  });

  it('3/3 slower than 30 s → tier2', () => {
    const clock = fakeClock();
    const s = weekday(clock);
    s.start();
    clock.set(45_000);
    answerAll(s, RIGHT);
    expect(s.lockIn()!.outcome).toBe('tier2');
  });

  it('time is only a 3/3 tiebreaker and is stored rounded, tier uses the exact value', () => {
    const clock = fakeClock();
    const s = weekday(clock);
    s.start();
    clock.set(30_400); // 30.4 s: over the cutoff even though it rounds to 30
    answerAll(s, RIGHT);
    const r = s.lockIn()!;
    expect(r.outcome).toBe('tier2');
    expect(r.totalSeconds).toBe(30);
  });

  it.each([
    ['2/3, hard right → tier2', [0, 3, 2], 'tier2', 'Brown'],
    ['2/3, hard wrong → tier3', [0, 1, 3], 'tier3', 'Tulane'],
    ['1/3 → tier4', [3, 1, 3], 'tier4', 'Providence'],
    ['0/3 → fail', WRONG, 'fail', 'Central Connecticut State'],
  ])('%s', (_label, picks, outcome, school) => {
    const s = weekday();
    s.start();
    answerAll(s, picks);
    const r = s.lockIn()!;
    expect(r.outcome).toBe(outcome);
    expect(r.school).toBe(school);
  });

  it('records each question with slot, difficulty, id and correctness', () => {
    const s = weekday();
    s.start();
    answerAll(s, [0, 3, 2]);
    expect(s.lockIn()!.questions).toEqual([
      { slot: 'q1', difficulty: 'easy', puzzleId: 'e1', correct: true },
      { slot: 'q2', difficulty: 'medium', puzzleId: 'm1', correct: false },
      { slot: 'q3', difficulty: 'hard', puzzleId: 'h1', correct: true },
    ]);
  });

  it('changing an answer before lock-in changes the result', () => {
    const s = weekday();
    s.start();
    answerAll(s, WRONG);
    s.select(0, 0);
    s.select(1, 1);
    s.select(2, 2);
    expect(s.lockIn()!.questions.every((q) => q.correct)).toBe(true);
  });
});

describe('timer (ANS-2/ANS-4)', () => {
  it('starts when the round starts, not at creation', () => {
    const clock = fakeClock();
    const s = weekday(clock);
    clock.set(50_000); // time passes on the idle screen
    s.start();
    clock.set(60_000);
    answerAll(s, RIGHT);
    expect(s.lockIn()!.totalSeconds).toBe(10);
  });

  it('navigating and changing answers never resets or stops it', () => {
    const clock = fakeClock();
    const s = weekday(clock);
    s.start();
    clock.set(5_000);
    s.goTo(2);
    s.select(0, 3);
    clock.set(12_000);
    s.goTo(0);
    answerAll(s, RIGHT);
    clock.set(20_000);
    expect(s.lockIn()!.totalSeconds).toBe(20);
  });

  it('pauses while the page is hidden via pauseWhileHidden', () => {
    const clock = fakeClock();
    const s = weekday(clock);
    s.start();
    const listeners: (() => void)[] = [];
    const doc = {
      hidden: false,
      addEventListener: (_: 'visibilitychange', l: () => void) => void listeners.push(l),
      removeEventListener: () => {},
    };
    pauseWhileHidden(s.timer, doc);
    clock.set(10_000);
    doc.hidden = true;
    listeners.forEach((l) => l()); // hidden at 10 s
    clock.set(100_000);
    doc.hidden = false;
    listeners.forEach((l) => l()); // visible again at 100 s
    clock.set(105_000);
    answerAll(s, RIGHT);
    const r = s.lockIn()!;
    expect(r.totalSeconds).toBe(15);
    expect(r.outcome).toBe('tier1'); // 15 s of active time, not 105
  });
});

describe('Sunday (sign-off #23)', () => {
  function sunday(clock = fakeClock()) {
    return createSession({ dayNumber: 98, now: SUNDAY, content, schools, clock: clock.now });
  }

  it('is a single untimed 1% question', () => {
    const st = sunday().getState();
    expect(st.isSpecialDay).toBe(true);
    expect(st.questions.map((q) => q.slot)).toEqual(['special']);
    expect(st.questions[0].puzzle.id).toBe('p1');
    expect(st.answers).toEqual([null]);
  });

  it('correct → accepted, no totalSeconds, a tier-1 school', () => {
    const clock = fakeClock();
    const s = sunday(clock);
    s.start();
    clock.set(500_000); // however long they think
    s.select(0, 3);
    const r = s.lockIn()!;
    expect(r.outcome).toBe('accepted');
    expect(r.school).toBe('Yale');
    expect(r.questions).toEqual([{ slot: 'special', difficulty: '1percent', puzzleId: 'p1', correct: true }]);
    expect('totalSeconds' in r).toBe(false);
    expect(s.timer.running).toBe(false);
  });

  it('wrong → waitlisted, still a tier-1 school, no totalSeconds', () => {
    const s = sunday();
    s.start();
    s.select(0, 0);
    const r = s.lockIn()!;
    expect(r.outcome).toBe('waitlisted');
    expect(r.school).toBe('Yale');
    expect('totalSeconds' in r).toBe(false);
  });

  it('locks in after one answer', () => {
    const s = sunday();
    s.start();
    expect(s.lockIn()).toBeNull();
    s.select(0, 1);
    expect(s.lockIn()).not.toBeNull();
  });
});

describe('PZL-6 and persistence handoff', () => {
  it('captures dayNumber and questions once; a later clock change cannot alter them', () => {
    const now = new Date(MONDAY);
    const s = createSession({ dayNumber: 96, now, content, schools, clock: fakeClock().now });
    const before = s.getState().questions;
    now.setDate(now.getDate() + 1); // midnight passes; Tuesday
    now.setHours(0, 5, 0, 0);
    s.start();
    answerAll(s, RIGHT);
    const r = s.lockIn()!;
    expect(r.dayNumber).toBe(96); // the day it started
    expect(s.getState().questions).toBe(before);
    expect(r.isSpecialDay).toBe(false);
  });

  it('a result feeds straight into progress.recordRound', () => {
    const s = weekday();
    s.start();
    answerAll(s, RIGHT);
    const st = recordRound(defaultState(), s.lockIn()!);
    expect(st.accuracyStreak).toBe(1);
    expect(playedToday(st, 96)).toBe(true);
    expect(playedToday(st, 97)).toBe(false);
  });

  it('getState().result is null until lock-in, then the persisted shape', () => {
    const s = weekday();
    s.start();
    expect(s.getState().result).toBeNull();
    answerAll(s, RIGHT);
    const r = s.lockIn()!;
    expect(s.getState().result).toEqual(r);
  });
});

describe('failure modes', () => {
  it('an empty pool fails loudly at creation, not mid-round', () => {
    const empty: PuzzleContent = { ...content, byDifficulty: { ...content.byDifficulty, hard: [] } };
    expect(() => createSession({ dayNumber: 1, now: MONDAY, content: empty, schools })).toThrow(/empty hard pool/);
  });

  it('getState answers is a copy: callers cannot mutate session state', () => {
    const s = weekday();
    s.start();
    (s.getState().answers as number[])[0] = 3;
    expect(s.getState().answers).toEqual([null, null, null]);
  });
});
