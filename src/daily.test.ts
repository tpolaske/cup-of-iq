import { describe, expect, it } from 'vitest';
import { boardSeed, boardSpecForLevel, dayNumber, pickDaily, posMod, seededShuffle } from './daily';

// TZ is pinned to America/New_York in vite.config.ts, so the DST dates below
// are real 23/25-hour local days.

describe('dayNumber (DPS-1)', () => {
  const launch = new Date(2026, 8, 1); // Sep 1 2026 (the placeholder)

  it('launch morning is Day 1', () => {
    expect(dayNumber(new Date(2026, 8, 1, 7, 30), launch)).toBe(1);
  });

  it('the next day is Day 2', () => {
    expect(dayNumber(new Date(2026, 8, 2, 6, 0), launch)).toBe(2);
  });

  it('clamps pre-launch visits to Day 1 (swarm.md ARCH-1)', () => {
    expect(dayNumber(new Date(2026, 7, 15), launch)).toBe(1);
    expect(dayNumber(new Date(2025, 0, 1), launch)).toBe(1);
  });

  it('absorbs the fall-back DST boundary (Nov 1 2026, a 25-hour day)', () => {
    expect(dayNumber(new Date(2026, 9, 31), launch)).toBe(61);
    expect(dayNumber(new Date(2026, 10, 1), launch)).toBe(62);
    expect(dayNumber(new Date(2026, 10, 2, 6), launch)).toBe(63);
  });

  it('absorbs the spring-forward DST boundary (Mar 8 2026, a 23-hour day)', () => {
    const jan1 = new Date(2026, 0, 1);
    expect(dayNumber(new Date(2026, 2, 8), jan1)).toBe(67);
    expect(dayNumber(new Date(2026, 2, 9), jan1)).toBe(68);
  });
});

describe('daily picks (DPS-2, PRM-1)', () => {
  it('posMod is always non-negative', () => {
    expect(posMod(-1, 30)).toBe(29);
    expect(posMod(0, 30)).toBe(0);
    expect(posMod(31, 30)).toBe(1);
  });

  it('wraps with open repeats (sign-off #11)', () => {
    const items = ['a', 'b', 'c'];
    expect(pickDaily(1, items)).toBe('a');
    expect(pickDaily(3, items)).toBe('c');
    expect(pickDaily(4, items)).toBe('a');
  });

  it('throws on an empty content list', () => {
    expect(() => pickDaily(1, [])).toThrow();
  });
});

describe('boardSpecForLevel (BRD-1, BRD-5, TRL-2)', () => {
  it('L1 Tracks: quantities 1\u20133, prints only, scatter, \u2265 100 px', () => {
    const s = boardSpecForLevel(1);
    expect(s.values).toEqual([1, 2, 3]);
    expect(s.face).toBe('prints');
    expect(s.layout).toBe('scatter3');
    expect(s.minTargetPx).toBe(100);
    expect(s.revealAfterTap[2]).toBe('peek'); // eyes at step two
  });

  it('L2 pairs prints with numerals 1\u20135 (BRD-4)', () => {
    const s = boardSpecForLevel(2);
    expect(s.values).toEqual([1, 2, 3, 4, 5]);
    expect(s.face).toBe('prints+numeral');
    expect(s.layout).toBe('quincunx5');
  });

  it('L3 is numerals only 1\u20135; L4 is numerals 6\u201310', () => {
    expect(boardSpecForLevel(3).face).toBe('numeral');
    expect(boardSpecForLevel(3).values).toEqual([1, 2, 3, 4, 5]);
    expect(boardSpecForLevel(4).values).toEqual([6, 7, 8, 9, 10]);
  });

  it('L5 is all numbers on the ten-egg grid', () => {
    const s = boardSpecForLevel(5);
    expect(s.values).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(s.layout).toBe('grid10');
    expect(s.minTargetPx).toBe(64);
  });

  it('clamps out-of-range levels (BRD-5)', () => {
    expect(boardSpecForLevel(99)).toEqual(boardSpecForLevel(5));
    expect(boardSpecForLevel(0)).toEqual(boardSpecForLevel(1));
    expect(boardSpecForLevel(-3)).toEqual(boardSpecForLevel(1));
  });

  it('every level hatches on its final tap (TRL-4)', () => {
    for (let level = 1; level <= 5; level++) {
      const s = boardSpecForLevel(level);
      expect(s.revealAfterTap[s.values.length]).toBe('hatch');
    }
  });
});

describe('seeded shuffle (DPS-3/4)', () => {
  it('same seed \u2192 identical order on every device', () => {
    expect(seededShuffle([1, 2, 3, 4, 5], 1401)).toEqual(seededShuffle([1, 2, 3, 4, 5], 1401));
  });

  it('is a permutation and never mutates its input', () => {
    const input = [1, 2, 3, 4, 5];
    const out = seededShuffle(input, 777);
    expect([...out].sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5]);
    expect(input).toEqual([1, 2, 3, 4, 5]);
  });

  it('different seeds produce different orders (spot check)', () => {
    const a = seededShuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 1401);
    const b = seededShuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 1502);
    expect(a).not.toEqual(b);
  });

  it('boardSeed: day 14 at level 1 \u2192 1401 (design.md \u00a73 worked example)', () => {
    expect(boardSeed(14, 1)).toBe(1401);
  });
});
