import { describe, expect, it } from 'vitest';
import {
  boot,
  findPuzzle,
  type BootDeps,
  type ComebackView,
  type PlayView,
  type ResultsView,
  type RevealView,
  type Screens,
} from './boot';
import { defaultState, load, save, type StorageLike } from './progress';
import type { Puzzle, PuzzleContent, SchoolContent } from './types';

const MONDAY = new Date(2026, 9, 26, 9, 0, 0);
const TUESDAY = new Date(2026, 9, 27, 9, 0, 0);
const SUNDAY = new Date(2026, 9, 25, 9, 0, 0);

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

function fakeStorage(): StorageLike & { map: Map<string, string> } {
  const map = new Map<string, string>();
  return {
    map,
    getItem: (k) => map.get(k) ?? null,
    setItem: (k, v) => void map.set(k, v),
    removeItem: (k) => void map.delete(k),
  };
}

function fakeScreens() {
  const calls = {
    play: [] as PlayView[],
    reveal: [] as RevealView[],
    results: [] as ResultsView[],
    comeback: [] as ComebackView[],
  };
  const screens: Screens = {
    showPlay: (v) => void calls.play.push(v),
    showReveal: (v) => void calls.reveal.push(v),
    showResults: (v) => void calls.results.push(v),
    showComeback: (v) => void calls.comeback.push(v),
  };
  return { screens, calls };
}

function run(over: Partial<BootDeps> & { screens: Screens }, dayNumber = 96, now = MONDAY) {
  return boot({ now, dayNumber, storage: null, content, schools, ...over });
}

function answerRight(view: PlayView) {
  [0, 1, 2].forEach((c, i) => view.session.select(i, c));
}

describe('a fresh day', () => {
  it('routes to the play screen with a started session and saves nothing yet', () => {
    const storage = fakeStorage();
    const { screens, calls } = fakeScreens();
    const result = run({ screens, storage });
    expect(result.route).toBe('play');
    expect(calls.play).toHaveLength(1);
    expect(calls.comeback).toHaveLength(0);
    expect(calls.play[0].session.getState().phase).toBe('answering_round');
    expect(storage.map.size).toBe(0);
  });

  it('hands the screen the three weekday questions', () => {
    const { screens, calls } = fakeScreens();
    run({ screens });
    expect(calls.play[0].session.getState().questions.map((q) => q.puzzle.id)).toEqual(['e1', 'm1', 'h1']);
  });

  it('hands the screen the single Sunday question (sign-off #23)', () => {
    const { screens, calls } = fakeScreens();
    run({ screens }, 98, SUNDAY);
    const st = calls.play[0].session.getState();
    expect(st.isSpecialDay).toBe(true);
    expect(st.questions.map((q) => q.puzzle.id)).toEqual(['p1']);
  });

  it('lets the entry wire visibility pausing to the session timer (ANS-4)', () => {
    const { screens } = fakeScreens();
    let seen: unknown = null;
    run({ screens, watchVisibility: (t) => void (seen = t) });
    expect(seen).toBeTruthy();
  });
});

describe('lock-in → persist → reveal → results', () => {
  it('locking in saves the round, then shows the reveal, then results', () => {
    const storage = fakeStorage();
    const { screens, calls } = fakeScreens();
    run({ screens, storage });
    const play = calls.play[0];
    answerRight(play);
    play.onLockIn();

    // persisted before the reveal is even finished
    const saved = load(storage);
    expect(saved.lastPlayed?.dayNumber).toBe(96);
    expect(saved.lastPlayed?.questions.every((q) => q.correct)).toBe(true);
    expect(saved.accuracyStreak).toBe(1);

    expect(calls.reveal).toHaveLength(1);
    expect(calls.results).toHaveLength(0);
    expect(calls.reveal[0].round).toEqual(saved.lastPlayed);
    expect(calls.reveal[0].puzzles.map((p) => p?.id)).toEqual(['e1', 'm1', 'h1']);

    calls.reveal[0].onDone();
    expect(calls.results).toHaveLength(1);
    expect(calls.results[0].round).toEqual(saved.lastPlayed);
    expect(calls.results[0].streak).toBe(1);
    expect(calls.results[0].bestStreak).toBe(1);
  });

  it('does nothing until every question is answered', () => {
    const storage = fakeStorage();
    const { screens, calls } = fakeScreens();
    run({ screens, storage });
    calls.play[0].session.select(0, 0);
    calls.play[0].onLockIn();
    expect(calls.reveal).toHaveLength(0);
    expect(storage.map.size).toBe(0);
  });

  it('a double tap on Lock it in records once and reveals once (ANS-1)', () => {
    const storage = fakeStorage();
    const { screens, calls } = fakeScreens();
    run({ screens, storage });
    answerRight(calls.play[0]);
    calls.play[0].onLockIn();
    calls.play[0].onLockIn();
    expect(calls.reveal).toHaveLength(1);
    expect(load(storage).accuracyStreak).toBe(1);
  });

  it('onDone twice shows the results once', () => {
    const { screens, calls } = fakeScreens();
    run({ screens, storage: fakeStorage() });
    answerRight(calls.play[0]);
    calls.play[0].onLockIn();
    calls.reveal[0].onDone();
    calls.reveal[0].onDone();
    expect(calls.results).toHaveLength(1);
  });

  it('results share text carries the streak line once the streak is 2+', () => {
    const storage = fakeStorage();
    save(storage, { ...defaultState(), accuracyStreak: 3, bestStreak: 3 });
    const { screens, calls } = fakeScreens();
    run({ screens, storage });
    answerRight(calls.play[0]);
    calls.play[0].onLockIn();
    calls.reveal[0].onDone();
    expect(calls.results[0].streak).toBe(4);
    expect(calls.results[0].shareText).toContain('🔥 4-day streak');
    expect(calls.results[0].shareText.endsWith('https://cupofiq.com/puzzle')).toBe(true);
  });

  it('a wrong round resets the streak and the share text has no streak line', () => {
    const storage = fakeStorage();
    save(storage, { ...defaultState(), accuracyStreak: 5, bestStreak: 5 });
    const { screens, calls } = fakeScreens();
    run({ screens, storage });
    [3, 3, 3].forEach((c, i) => calls.play[0].session.select(i, c));
    calls.play[0].onLockIn();
    calls.reveal[0].onDone();
    expect(calls.results[0].streak).toBe(0);
    expect(calls.results[0].bestStreak).toBe(5);
    expect(calls.results[0].shareText).not.toContain('🔥');
    expect(calls.results[0].round.outcome).toBe('fail');
    expect(calls.results[0].shareText).toContain('Central Connecticut State is calling. 🎓');
  });
});

describe('the once-a-day lock (LCK-1..3)', () => {
  function playAndFinish(storage: StorageLike, dayNumber: number, now: Date) {
    const { screens, calls } = fakeScreens();
    run({ screens, storage }, dayNumber, now);
    answerRight(calls.play[0]);
    calls.play[0].onLockIn();
    calls.reveal[0].onDone();
    return calls;
  }

  it('reopening the same day shows the come-back card with the stored result', () => {
    const storage = fakeStorage();
    const first = playAndFinish(storage, 96, MONDAY);
    const { screens, calls } = fakeScreens();
    const result = run({ screens, storage }, 96, MONDAY);
    expect(result.route).toBe('comeback');
    expect(calls.play).toHaveLength(0);
    expect(calls.comeback).toHaveLength(1);
    // the school is the one stored at lock-in, not re-rolled
    expect(calls.comeback[0].round).toEqual(first.results[0].round);
    expect(calls.comeback[0].shareText).toBe(first.results[0].shareText);
  });

  it('a reload during the reveal finds the day already locked', () => {
    const storage = fakeStorage();
    const { screens, calls } = fakeScreens();
    run({ screens, storage });
    answerRight(calls.play[0]);
    calls.play[0].onLockIn(); // reveal is on screen, onDone not yet called
    const again = fakeScreens();
    expect(run({ screens: again.screens, storage }).route).toBe('comeback');
  });

  it('the next day opens a fresh round with no residual lock', () => {
    const storage = fakeStorage();
    playAndFinish(storage, 96, MONDAY);
    const { screens, calls } = fakeScreens();
    expect(run({ screens, storage }, 97, TUESDAY).route).toBe('play');
    expect(calls.comeback).toHaveLength(0);
  });

  it('a reload mid-round restarts the same round and is not a completed day', () => {
    const storage = fakeStorage();
    const a = fakeScreens();
    run({ screens: a.screens, storage });
    a.calls.play[0].session.select(0, 0); // abandoned partway
    const b = fakeScreens();
    expect(run({ screens: b.screens, storage }).route).toBe('play');
    expect(b.calls.play[0].session.getState().questions.map((q) => q.puzzle.id)).toEqual(['e1', 'm1', 'h1']);
    expect(b.calls.play[0].session.getState().answers).toEqual([null, null, null]);
    expect(storage.map.size).toBe(0);
  });

  it('the come-back card for a Sunday shows the Sunday share text', () => {
    const storage = fakeStorage();
    const first = fakeScreens();
    run({ screens: first.screens, storage }, 98, SUNDAY);
    first.calls.play[0].session.select(0, 3);
    first.calls.play[0].onLockIn();
    first.calls.reveal[0].onDone();
    const { screens, calls } = fakeScreens();
    run({ screens, storage }, 98, SUNDAY);
    expect(calls.comeback[0].round.outcome).toBe('accepted');
    expect(calls.comeback[0].shareText).toContain('Solved the 1% question — accepted!');
  });
});

describe('resilience (NFR-S4)', () => {
  it('private mode (no storage): the round still completes end to end', () => {
    const { screens, calls } = fakeScreens();
    run({ screens, storage: null });
    answerRight(calls.play[0]);
    calls.play[0].onLockIn();
    calls.reveal[0].onDone();
    expect(calls.results).toHaveLength(1);
    expect(calls.results[0].streak).toBe(1);
  });

  it('private mode has no lock: a reopen is a fresh round', () => {
    const a = fakeScreens();
    run({ screens: a.screens, storage: null });
    answerRight(a.calls.play[0]);
    a.calls.play[0].onLockIn();
    const b = fakeScreens();
    expect(run({ screens: b.screens, storage: null }).route).toBe('play');
  });

  it('storage that fails on write still lets the player see the reveal and results', () => {
    const broken: StorageLike = {
      getItem: () => null,
      setItem: () => {
        throw new Error('quota');
      },
      removeItem: () => {},
    };
    const { screens, calls } = fakeScreens();
    run({ screens, storage: broken });
    answerRight(calls.play[0]);
    expect(() => calls.play[0].onLockIn()).not.toThrow();
    calls.reveal[0].onDone();
    expect(calls.results).toHaveLength(1);
  });

  it('corrupt saved state is treated as a fresh install', () => {
    const storage = fakeStorage();
    storage.map.set('cupofiq.puzzle.v2', '{nope');
    const { screens } = fakeScreens();
    expect(run({ screens, storage }).route).toBe('play');
  });
});

describe('findPuzzle', () => {
  it('finds a puzzle in any pool and returns null for an unknown id', () => {
    expect(findPuzzle(content, 'e1')?.id).toBe('e1');
    expect(findPuzzle(content, 'h1')?.id).toBe('h1');
    expect(findPuzzle(content, 'p1')?.id).toBe('p1');
    expect(findPuzzle(content, 'gone')).toBeNull();
  });

  it('the come-back card tolerates a puzzle that has since left the bank', () => {
    const storage = fakeStorage();
    const first = fakeScreens();
    run({ screens: first.screens, storage });
    answerRight(first.calls.play[0]);
    first.calls.play[0].onLockIn();
    const trimmed: PuzzleContent = { ...content, byDifficulty: { ...content.byDifficulty, medium: [puzzle('m2', 'medium', 0)] } };
    const { screens, calls } = fakeScreens();
    run({ screens, storage, content: trimmed });
    expect(calls.comeback[0].puzzles.map((p) => p?.id ?? null)).toEqual(['e1', null, 'h1']);
  });
});
