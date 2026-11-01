import { describe, expect, it } from 'vitest';
import { bannerLine } from './banner';
import type { LastPlayed } from './progress';
import { SHARE_URL, buildShareText } from './share';
import type { Outcome } from './types';

function weekday(correct: [boolean, boolean, boolean], outcome: Outcome, school: string, day = 96): LastPlayed {
  return {
    dayNumber: day,
    isSpecialDay: false,
    questions: [
      { slot: 'q1', difficulty: 'easy', puzzleId: 'e', correct: correct[0] },
      { slot: 'q2', difficulty: 'medium', puzzleId: 'm', correct: correct[1] },
      { slot: 'q3', difficulty: 'hard', puzzleId: 'h', correct: correct[2] },
    ],
    totalSeconds: 40,
    outcome,
    school,
  };
}

function sunday(correct: boolean, school: string, day = 98): LastPlayed {
  return {
    dayNumber: day,
    isSpecialDay: true,
    questions: [{ slot: 'special', difficulty: '1percent', puzzleId: 'p', correct }],
    outcome: correct ? 'accepted' : 'waitlisted',
    school,
  };
}

describe('buildShareText — weekday (design.md §10)', () => {
  it('matches the spec example for a 2/3 with a streak', () => {
    const r = weekday([true, false, true], 'tier2', 'Northwestern');
    expect(buildShareText(r, 4)).toBe(
      'Cup of IQ · Puzzle  Day 96\n2/3 correct\nNorthwestern is calling. 🎓\n🔥 4-day streak\nhttps://cupofiq.com/puzzle',
    );
  });

  it('omits the streak line at 0 and 1, shows it at 2+', () => {
    const r = weekday([true, true, true], 'tier1', 'Yale');
    expect(buildShareText(r, 0)).not.toContain('🔥');
    expect(buildShareText(r, 1)).not.toContain('🔥');
    expect(buildShareText(r, 2)).toContain('🔥 2-day streak');
    expect(buildShareText(r, 30)).toContain('🔥 30-day streak');
  });

  it('shows N/3 for every score and always ends with the URL', () => {
    const cases: [[boolean, boolean, boolean], Outcome, string][] = [
      [[true, true, true], 'tier1', '3/3 correct'],
      [[true, false, false], 'tier4', '1/3 correct'],
      [[false, false, false], 'fail', '0/3 correct'],
    ];
    for (const [c, o, line] of cases) {
      const text = buildShareText(weekday(c, o, 'Yale'), 0);
      expect(text.split('\n')[1]).toBe(line);
      expect(text.endsWith(SHARE_URL)).toBe(true);
    }
  });

  it('contains no time information (ANS-2) and no PII', () => {
    const text = buildShareText(weekday([true, true, true], 'tier2', 'Brown'), 3);
    expect(text).not.toMatch(/\d+\s?(s|sec|seconds)\b/i);
    expect(text).not.toContain('40');
  });
});

describe('buildShareText — Sunday (sign-off #23)', () => {
  it('accepted matches the spec example and shows the streak at 2+', () => {
    expect(buildShareText(sunday(true, 'Yale'), 5)).toBe(
      'Cup of IQ · Puzzle  Day 98 · 💯 Sunday special\nSolved the 1% question — accepted!\nYale is calling. 🎓\n🔥 5-day streak\nhttps://cupofiq.com/puzzle',
    );
  });

  it('accepted with a streak of 1 omits the streak line', () => {
    expect(buildShareText(sunday(true, 'Yale'), 1)).not.toContain('🔥');
  });

  it('waitlisted matches the spec example and never has a streak line', () => {
    const expected =
      'Cup of IQ · Puzzle  Day 98 · 💯 Sunday special\nThe 1% question got me — waitlisted\nPrinceton has put you on the waitlist. 😅\nhttps://cupofiq.com/puzzle';
    expect(buildShareText(sunday(false, 'Princeton'), 0)).toBe(expected);
    // even if a caller passes a stale high streak, a waitlist never shows one
    expect(buildShareText(sunday(false, 'Princeton'), 9)).toBe(expected);
  });

  it('does not print an N/3 score line on Sunday', () => {
    expect(buildShareText(sunday(true, 'Yale'), 0)).not.toMatch(/\d\/\d/);
  });
});

describe('bannerLine (TMR-4)', () => {
  it('uses the signed-off wording for tier1/tier2/accepted/waitlisted', () => {
    expect(bannerLine('tier1', 'Yale')).toBe('Yale is calling. 🎓');
    expect(bannerLine('tier2', 'Brown')).toBe('Brown is calling. 🎓');
    expect(bannerLine('accepted', 'Harvard')).toBe('Harvard is calling. 🎓');
    expect(bannerLine('waitlisted', 'Princeton')).toBe('Princeton has put you on the waitlist. 😅');
  });

  it('every outcome yields a non-empty, school-named, single-line banner with no negative words', () => {
    const all: Outcome[] = ['tier1', 'tier2', 'tier3', 'tier4', 'fail', 'accepted', 'waitlisted'];
    for (const o of all) {
      const line = bannerLine(o, 'Test U');
      expect(line).toContain('Test U');
      expect(line).not.toContain('\n');
      expect(line).not.toMatch(/fail|lose|lost|wrong|bad|reject/i);
    }
  });
});
