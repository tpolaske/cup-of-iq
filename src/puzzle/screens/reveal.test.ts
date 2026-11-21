import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { RevealView } from '../boot';
import type { LastPlayed } from '../progress';
import { REVEAL_MS, renderReveal, showReveal } from './reveal';

const yale = { name: 'Yale', base: '#00356B', accent: '#FFFFFF' };

function weekday(correct: [boolean, boolean, boolean]): LastPlayed {
  return {
    dayNumber: 96,
    isSpecialDay: false,
    questions: [
      { slot: 'q1', difficulty: 'easy', puzzleId: 'e', correct: correct[0] },
      { slot: 'q2', difficulty: 'medium', puzzleId: 'm', correct: correct[1] },
      { slot: 'q3', difficulty: 'hard', puzzleId: 'h', correct: correct[2] },
    ],
    totalSeconds: 31,
    outcome: 'tier2',
    school: 'Yale',
  };
}
const sundayRound = (ok: boolean): LastPlayed => ({
  dayNumber: 98,
  isSpecialDay: true,
  questions: [{ slot: 'special', difficulty: '1percent', puzzleId: 'p', correct: ok }],
  outcome: ok ? 'accepted' : 'waitlisted',
  school: 'Yale',
});
const mk = (round: LastPlayed): RevealView & { done: number } => {
  const v = { round, school: yale, puzzles: round.questions.map(() => null), done: 0, onDone() { v.done++; } };
  return v;
};

describe('renderReveal (TMR-5)', () => {
  it('shows the pennant and one mark per question, in order', () => {
    const html = renderReveal(mk(weekday([true, false, true])));
    expect(html).toContain('aria-label="Yale pennant"');
    expect(html.match(/<li class="pz-mark/g)).toHaveLength(3);
    expect(html).toMatch(/is-right[\s\S]*is-wrong[\s\S]*is-right/);
    expect(html).toContain('Question 2: not this time');
  });

  it('shows nothing else: no tier, score, time, difficulty or school line', () => {
    const html = renderReveal(mk(weekday([true, true, true])));
    expect(html).not.toMatch(/easy|medium|hard|tier|calling|waitlist|streak|seconds|\d+ of \d|\d\/\d|31/i);
  });

  it('Sunday shows a single mark for the 1% question', () => {
    const html = renderReveal(mk(sundayRound(false)));
    expect(html.match(/<li class="pz-mark/g)).toHaveLength(1);
    expect(html).toContain('The 1% question: not this time');
    expect(html).toContain('aria-label="Your answer"');
  });

  it('always offers a Continue button', () => {
    expect(renderReveal(mk(weekday([true, true, true])))).toContain('data-act="continue"');
  });
});

describe('showReveal', () => {
  beforeEach(() => void vi.useFakeTimers());
  afterEach(() => void vi.useRealTimers());

  function fakeRoot() {
    return { innerHTML: '', onclick: null as null | ((e: unknown) => void) } as unknown as HTMLElement & { onclick: (e: unknown) => void };
  }
  const clickContinue = { target: { closest: (sel: string) => (sel.includes('continue') ? {} : null) } };
  const clickElsewhere = { target: { closest: () => null } };

  it('renders at once and auto-advances after the pause, exactly once', () => {
    const root = fakeRoot();
    const v = mk(weekday([true, true, true]));
    showReveal(root, v);
    expect(root.innerHTML).toContain('pz-reveal');
    vi.advanceTimersByTime(REVEAL_MS - 1);
    expect(v.done).toBe(0);
    vi.advanceTimersByTime(1);
    expect(v.done).toBe(1);
    vi.advanceTimersByTime(10_000);
    expect(v.done).toBe(1);
  });

  it('Continue skips the wait and the timer cannot fire a second advance', () => {
    const root = fakeRoot();
    const v = mk(weekday([true, true, true]));
    showReveal(root, v);
    root.onclick(clickContinue);
    expect(v.done).toBe(1);
    expect(root.onclick).toBeNull();
    vi.advanceTimersByTime(10_000);
    expect(v.done).toBe(1);
  });

  it('a tap elsewhere does not advance', () => {
    const root = fakeRoot();
    const v = mk(weekday([true, true, true]));
    showReveal(root, v);
    root.onclick(clickElsewhere);
    expect(v.done).toBe(0);
  });

  it('the pause is within the designed 1.5–2.5 s window', () => {
    expect(REVEAL_MS).toBeGreaterThanOrEqual(1500);
    expect(REVEAL_MS).toBeLessThanOrEqual(2500);
  });
});
