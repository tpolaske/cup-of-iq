import { describe, expect, it } from 'vitest';
import puzzlesJson from '../../../content/puzzles.json';
import onePercentJson from '../../../content/puzzles-1percent.json';
import { applyPlayAction, actionFromDataset, escapeHtml, renderPlay } from './play';
import { createSession, type PuzzleSession } from '../puzzle';
import type { PlayView } from '../boot';
import type { Puzzle, PuzzleContent, SchoolContent } from '../types';

const MONDAY = new Date(2026, 9, 26, 9, 0, 0);
const SUNDAY = new Date(2026, 9, 25, 9, 0, 0);

function puzzle(id: string, difficulty: Puzzle['difficulty'], correctIndex: number, prompt = `Prompt ${id}`): Puzzle {
  return { id, category: 'logic', difficulty, prompt, answerFormat: 'multipleChoice', choices: ['one', 'two', 'three', 'four'], correctIndex, explanation: 'x' };
}
const content: PuzzleContent = {
  byDifficulty: { easy: [puzzle('e1', 'easy', 0, 'Is 1 < 2 & "ok"?')], medium: [puzzle('m1', 'medium', 1)], hard: [puzzle('h1', 'hard', 2)] },
  onePercent: [puzzle('p1', '1percent', 3)],
};
const t = { name: 'Yale', base: '#00356B', accent: '#FFFFFF' };
const schools: SchoolContent = { tier1: [t], tier2: [t], tier3: [t], tier4: [t], fail: [t] };

function view(now = MONDAY, day = 96): PlayView & { locked: number } {
  const session: PuzzleSession = createSession({ dayNumber: day, now, content, schools, clock: () => 0 });
  session.start();
  const v = { session, locked: 0, onLockIn() { v.locked++; session.lockIn(); } };
  return v;
}

describe('renderPlay', () => {
  it('weekday: header, three progress bars, question, four lettered choices, disabled lock', () => {
    const html = renderPlay(view().session.getState());
    expect(html).toContain('Cup of IQ · Day 96');
    expect(html).toContain('Question 1 of 3');
    expect(html.match(/<span class="pz-bar/g)).toHaveLength(3);
    expect(html.match(/data-act="choose"/g)).toHaveLength(4);
    expect(html).toContain('>A<');
    expect(html).toContain('>D<');
    expect(html).toMatch(/data-act="lock"[^>]*disabled/);
    expect(html).toContain('Answer all three to lock in.');
  });

  it('shows no timer and no difficulty label (ANS-2)', () => {
    const html = renderPlay(view().session.getState());
    expect(html).not.toMatch(/easy|medium|hard|timer|seconds|\d+:\d\d/i);
  });

  it('escapes prompts and choices', () => {
    const html = renderPlay(view().session.getState());
    expect(html).toContain('Is 1 &lt; 2 &amp; &quot;ok&quot;?');
    expect(html).not.toContain('< 2 &');
    expect(escapeHtml(`<b>'x'</b>`)).toBe('&lt;b&gt;&#39;x&#39;&lt;/b&gt;');
  });

  it('marks the selected choice and fills the done bar', () => {
    const v = view();
    v.session.select(0, 2);
    const html = renderPlay(v.session.getState());
    expect(html).toMatch(/pz-choice is-selected"[^>]*data-val="2"[^>]*aria-pressed="true"/);
    expect(html).toContain('pz-bar is-done is-current');
  });

  it('first question has a disabled back arrow; last has a disabled forward arrow', () => {
    const v = view();
    expect(renderPlay(v.session.getState())).toMatch(/aria-label="Previous question" disabled/);
    v.session.goTo(2);
    const html = renderPlay(v.session.getState());
    expect(html).toMatch(/aria-label="Next question" disabled/);
    expect(html).not.toMatch(/aria-label="Previous question" disabled/);
  });

  it('enables Lock it in once all three are answered', () => {
    const v = view();
    [0, 1, 2].forEach((c, i) => v.session.select(i, c));
    const html = renderPlay(v.session.getState());
    expect(html).not.toMatch(/data-act="lock"[^>]*disabled/);
    expect(html).toContain("Once locked in, answers can't change.");
  });

  it('Sunday: one question, no bars, no arrows, labelled special', () => {
    const html = renderPlay(view(SUNDAY, 98).session.getState());
    expect(html).toContain('Sunday special');
    expect(html).not.toContain('pz-bars');
    expect(html).not.toContain('Previous question');
    expect(html).toContain('Pick an answer to lock in.');
  });

  it('renders every real puzzle in the bank without throwing, with 2–6 choices', () => {
    const bank = puzzlesJson as unknown as PuzzleContent['byDifficulty'];
    const all: Puzzle[] = [...bank.easy, ...bank.medium, ...bank.hard, ...(onePercentJson as unknown as { onePercent: Puzzle[] }).onePercent];
    expect(all.length).toBeGreaterThan(80);
    for (const p of all) {
      const c: PuzzleContent = { byDifficulty: { easy: [p], medium: [p], hard: [p] }, onePercent: [p] };
      const s = createSession({ dayNumber: 1, now: MONDAY, content: c, schools, clock: () => 0 });
      const html = renderPlay(s.getState());
      expect(html).toContain('pz-prompt');
      expect(p.choices.length).toBeGreaterThanOrEqual(2);
      expect(p.choices.length).toBeLessThanOrEqual(6);
    }
  });
});

describe('actions', () => {
  it('parses data attributes and rejects junk', () => {
    expect(actionFromDataset('choose', '2')).toEqual({ type: 'choose', choice: 2 });
    expect(actionFromDataset('goto', '1')).toEqual({ type: 'goto', index: 1 });
    expect(actionFromDataset('lock', undefined)).toEqual({ type: 'lock' });
    expect(actionFromDataset('choose', 'x')).toBeNull();
    expect(actionFromDataset('choose', undefined)).toBeNull();
    expect(actionFromDataset('nope', '1')).toBeNull();
    expect(actionFromDataset(undefined, undefined)).toBeNull();
  });

  it('choose selects on the current question; goto navigates; both ask for a redraw', () => {
    const v = view();
    expect(applyPlayAction(v, { type: 'choose', choice: 1 })).toBe(true);
    expect(v.session.getState().answers).toEqual([1, null, null]);
    expect(applyPlayAction(v, { type: 'goto', index: 2 })).toBe(true);
    applyPlayAction(v, { type: 'choose', choice: 3 });
    expect(v.session.getState().answers).toEqual([1, null, 3]);
  });

  it('an invalid goto or choice changes nothing', () => {
    const v = view();
    applyPlayAction(v, { type: 'goto', index: 9 });
    applyPlayAction(v, { type: 'choose', choice: 9 });
    expect(v.session.getState().currentIndex).toBe(0);
    expect(v.session.getState().answers).toEqual([null, null, null]);
  });

  it('lock before all answered asks for a redraw and does not lock', () => {
    const v = view();
    expect(applyPlayAction(v, { type: 'lock' })).toBe(true);
    expect(v.session.getState().phase).toBe('answering_round');
  });

  it('a successful lock does NOT redraw over the reveal', () => {
    const v = view();
    [0, 1, 2].forEach((c, i) => v.session.select(i, c));
    expect(applyPlayAction(v, { type: 'lock' })).toBe(false);
    expect(v.locked).toBe(1);
    expect(v.session.getState().phase).toBe('locked_in');
  });
});
