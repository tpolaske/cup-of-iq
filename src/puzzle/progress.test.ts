import { describe, expect, it } from 'vitest';
import {
  LEGACY_KEY,
  STORAGE_KEY,
  defaultState,
  isPerfect,
  load,
  playedToday,
  recordRound,
  resetAll,
  save,
  type PlayedQuestion,
  type PuzzleState,
  type RoundInput,
  type StorageLike,
} from './progress';

function fakeStorage(): StorageLike & { map: Map<string, string> } {
  const map = new Map<string, string>();
  return {
    map,
    getItem: (k) => map.get(k) ?? null,
    setItem: (k, v) => void map.set(k, v),
    removeItem: (k) => void map.delete(k),
  };
}

function weekdayRound(day: number, correct: [boolean, boolean, boolean], over: Partial<RoundInput> = {}): RoundInput {
  const questions: PlayedQuestion[] = [
    { slot: 'q1', difficulty: 'easy', puzzleId: 'e1', correct: correct[0] },
    { slot: 'q2', difficulty: 'medium', puzzleId: 'm1', correct: correct[1] },
    { slot: 'q3', difficulty: 'hard', puzzleId: 'h1', correct: correct[2] },
  ];
  const n = correct.filter(Boolean).length;
  return {
    dayNumber: day,
    isSpecialDay: false,
    questions,
    totalSeconds: 27,
    outcome: n === 3 ? 'tier1' : n === 2 ? 'tier3' : n === 1 ? 'tier4' : 'fail',
    school: 'Yale',
    ...over,
  };
}

function sundayRound(day: number, correct: boolean): RoundInput {
  return {
    dayNumber: day,
    isSpecialDay: true,
    questions: [{ slot: 'special', difficulty: '1percent', puzzleId: 'p1', correct }],
    outcome: correct ? 'accepted' : 'waitlisted',
    school: 'Princeton',
  };
}

const ALL = [true, true, true] as [boolean, boolean, boolean];

describe('load/save (NFR-S4)', () => {
  it('defaults with no storage at all (private mode)', () => {
    expect(load(null)).toEqual(defaultState());
  });

  it('defaults on empty, corrupt, non-object, and wrong-schema payloads', () => {
    const s = fakeStorage();
    expect(load(s)).toEqual(defaultState());
    s.map.set(STORAGE_KEY, '{not json');
    expect(load(s)).toEqual(defaultState());
    s.map.set(STORAGE_KEY, '42');
    expect(load(s)).toEqual(defaultState());
    s.map.set(STORAGE_KEY, JSON.stringify({ schemaVersion: 1, accuracyStreak: 5 }));
    expect(load(s)).toEqual(defaultState());
  });

  it('drops the legacy v1 key without translating it', () => {
    const s = fakeStorage();
    s.map.set(LEGACY_KEY, JSON.stringify({ schemaVersion: 1, lastPlayed: { dayNumber: 9 } }));
    expect(load(s)).toEqual(defaultState());
    expect(s.map.has(LEGACY_KEY)).toBe(false);
  });

  it('round-trips a weekday and a Sunday state', () => {
    const s = fakeStorage();
    const weekday = recordRound(defaultState(), weekdayRound(96, ALL));
    save(s, weekday);
    expect(load(s)).toEqual(weekday);
    const sunday = recordRound(weekday, sundayRound(98, true));
    save(s, sunday);
    const back = load(s);
    expect(back).toEqual(sunday);
    expect(back.lastPlayed?.totalSeconds).toBeUndefined();
  });

  it('sanitises corrupt streak numbers and keeps bestStreak >= streak (STK-3)', () => {
    const s = fakeStorage();
    s.map.set(STORAGE_KEY, JSON.stringify({ schemaVersion: 2, accuracyStreak: -4, bestStreak: 'x' }));
    expect(load(s)).toMatchObject({ accuracyStreak: 0, bestStreak: 0 });
    s.map.set(STORAGE_KEY, JSON.stringify({ schemaVersion: 2, accuracyStreak: 6, bestStreak: 2 }));
    expect(load(s)).toMatchObject({ accuracyStreak: 6, bestStreak: 6 });
  });

  it('drops an invalid lastPlayed but keeps the streak numbers', () => {
    const s = fakeStorage();
    const good = recordRound(defaultState(), weekdayRound(5, ALL));
    const bad = { ...good, accuracyStreak: 3, bestStreak: 8, lastPlayed: { ...good.lastPlayed, outcome: 'tier9' } };
    s.map.set(STORAGE_KEY, JSON.stringify(bad));
    expect(load(s)).toEqual({ schemaVersion: 2, accuracyStreak: 3, bestStreak: 8, lastPlayed: null });
  });

  it('rejects lastPlayed with empty or malformed questions', () => {
    const s = fakeStorage();
    const base = recordRound(defaultState(), weekdayRound(5, ALL));
    for (const questions of [[], [{ slot: 'q9', difficulty: 'easy', puzzleId: 'x', correct: true }], 'nope']) {
      s.map.set(STORAGE_KEY, JSON.stringify({ ...base, lastPlayed: { ...base.lastPlayed, questions } }));
      expect(load(s).lastPlayed).toBeNull();
    }
  });

  it('save never throws when storage is absent or fails mid-session', () => {
    expect(() => save(null, defaultState())).not.toThrow();
    const broken: StorageLike = {
      getItem: () => null,
      setItem: () => { throw new Error('quota'); },
      removeItem: () => {},
    };
    expect(() => save(broken, defaultState())).not.toThrow();
  });
});

describe('isPerfect (STK-1/2)', () => {
  it('is true only when every question is correct', () => {
    expect(isPerfect(weekdayRound(1, ALL).questions)).toBe(true);
    expect(isPerfect(weekdayRound(1, [true, true, false]).questions)).toBe(false);
    expect(isPerfect(sundayRound(1, true).questions)).toBe(true);
    expect(isPerfect(sundayRound(1, false).questions)).toBe(false);
  });

  it('is false for an empty list', () => {
    expect(isPerfect([])).toBe(false);
  });

  it('does not depend on the outcome: a slow 3/3 (tier2) still counts', () => {
    const slow = weekdayRound(1, ALL, { outcome: 'tier2', totalSeconds: 80 });
    expect(recordRound(defaultState(), slow).accuracyStreak).toBe(1);
  });
});

describe('streak rules (STK-1..5)', () => {
  it('increments on perfect weekdays and tracks bestStreak', () => {
    let st = defaultState();
    st = recordRound(st, weekdayRound(1, ALL));
    st = recordRound(st, weekdayRound(2, ALL));
    expect(st.accuracyStreak).toBe(2);
    expect(st.bestStreak).toBe(2);
  });

  it.each([
    ['2/3 with Q3 right', [true, false, true]],
    ['2/3 with Q3 missed', [true, true, false]],
    ['1/3', [false, false, true]],
    ['0/3', [false, false, false]],
  ] as const)('%s resets the streak to 0 (no partial credit)', (_label, correct) => {
    const st0: PuzzleState = { ...defaultState(), accuracyStreak: 4, bestStreak: 4 };
    const st = recordRound(st0, weekdayRound(10, [...correct] as [boolean, boolean, boolean]));
    expect(st.accuracyStreak).toBe(0);
    expect(st.bestStreak).toBe(4);
  });

  it('bestStreak never decreases across a break and a new run (STK-3)', () => {
    let st = defaultState();
    for (let d = 1; d <= 5; d++) st = recordRound(st, weekdayRound(d, ALL));
    st = recordRound(st, weekdayRound(6, [false, true, true]));
    st = recordRound(st, weekdayRound(7, ALL));
    st = recordRound(st, weekdayRound(8, ALL));
    expect(st.accuracyStreak).toBe(2);
    expect(st.bestStreak).toBe(5);
  });

  it('Sunday accepted increments; Sunday waitlisted resets (sign-offs #16/#23)', () => {
    let st: PuzzleState = { ...defaultState(), accuracyStreak: 3, bestStreak: 3 };
    st = recordRound(st, sundayRound(7, true));
    expect(st.accuracyStreak).toBe(4);
    expect(st.bestStreak).toBe(4);
    st = recordRound(st, sundayRound(14, false));
    expect(st.accuracyStreak).toBe(0);
    expect(st.bestStreak).toBe(4);
  });

  it('skipped days neither increment nor reset (STK-5, sign-off #19)', () => {
    let st = recordRound(defaultState(), weekdayRound(1, ALL));
    st = recordRound(st, weekdayRound(5, ALL)); // days 2-4 never played
    expect(st.accuracyStreak).toBe(2);
  });

  it('does not mutate its inputs and stores a copy of the questions', () => {
    const before = defaultState();
    const round = weekdayRound(1, ALL);
    const after = recordRound(before, round);
    expect(before).toEqual(defaultState());
    round.questions[0].correct = false;
    expect(after.lastPlayed?.questions[0].correct).toBe(true);
  });

  it('omits totalSeconds when the round has none (Sunday)', () => {
    const st = recordRound(defaultState(), sundayRound(7, true));
    expect('totalSeconds' in (st.lastPlayed as object)).toBe(false);
  });
});

describe('duplicate and stale records (PZL-6)', () => {
  it('a second record for the same day is ignored (double lock-in)', () => {
    const once = recordRound(defaultState(), weekdayRound(10, ALL));
    const twice = recordRound(once, weekdayRound(10, ALL));
    expect(twice).toBe(once);
    expect(twice.accuracyStreak).toBe(1);
  });

  it('a stale round from an earlier day cannot overwrite a newer lock', () => {
    const newer = recordRound(defaultState(), weekdayRound(11, ALL));
    const out = recordRound(newer, weekdayRound(10, [false, false, false]));
    expect(out).toBe(newer);
    expect(playedToday(out, 11)).toBe(true);
  });
});

describe('once-a-day lock (LCK-1)', () => {
  it('playedToday matches lastPlayed.dayNumber only', () => {
    const st = recordRound(defaultState(), weekdayRound(14, ALL));
    expect(playedToday(st, 14)).toBe(true);
    expect(playedToday(st, 15)).toBe(false);
    expect(playedToday(defaultState(), 14)).toBe(false);
  });

  it('a round started before midnight is locked against its start day', () => {
    const st = recordRound(defaultState(), weekdayRound(14, ALL)); // dayNumber captured at boot
    expect(playedToday(st, 14)).toBe(true);
    expect(playedToday(st, 15)).toBe(false); // next load after midnight gets a fresh round
  });
});

describe('resetAll', () => {
  it('clears both the v2 and legacy keys', () => {
    const s = fakeStorage();
    save(s, defaultState());
    s.map.set(LEGACY_KEY, '{}');
    resetAll(s);
    expect(s.map.size).toBe(0);
  });

  it('is a no-op without storage', () => {
    expect(() => resetAll(null)).not.toThrow();
  });
});
