import { describe, expect, it } from 'vitest';
import { LAUNCH_DATE, dayNumber, mulberry32, posMod } from './daily';
import { boardSeed, seededShuffle } from '../daily';

// TZ is pinned to America/New_York in vite.config.ts.

describe('shared/daily — golden values captured from the pre-extraction code', () => {
  it('LAUNCH_DATE is immutable: Aug 3 2026', () => {
    expect([LAUNCH_DATE.getFullYear(), LAUNCH_DATE.getMonth(), LAUNCH_DATE.getDate()]).toEqual([2026, 7, 3]);
  });

  it('dayNumber: Oct 23 2026 is Day 82', () => {
    expect(dayNumber(new Date(2026, 9, 23))).toBe(82);
  });

  it('dayNumber clamps pre-launch to 1 and survives DST (Nov 1 2026 fall-back)', () => {
    expect(dayNumber(new Date(2026, 6, 1))).toBe(1);
    expect(dayNumber(new Date(2026, 10, 1, 23, 59))).toBe(91);
    expect(dayNumber(new Date(2026, 10, 2, 0, 1))).toBe(92);
  });

  it('seeded shuffles are byte-identical to the shipped boards (no reshuffle)', () => {
    expect(seededShuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 8201)).toEqual([7, 5, 9, 2, 8, 1, 6, 10, 3, 4]);
    expect(seededShuffle([1, 2, 3], boardSeed(82, 1))).toEqual([3, 1, 2]);
    expect(seededShuffle([1, 2, 3, 4, 5], boardSeed(82, 3))).toEqual([2, 3, 5, 4, 1]);
  });
});

describe('posMod', () => {
  it('never returns a negative index', () => {
    expect(posMod(-1, 7)).toBe(6);
    expect(posMod(-14, 7)).toBe(0);
    expect(posMod(15, 7)).toBe(1);
  });
});

describe('mulberry32', () => {
  it('same seed → same sequence; different seed → different', () => {
    const a = mulberry32(42), b = mulberry32(42), c = mulberry32(43);
    const sa = [a(), a(), a()], sb = [b(), b(), b()];
    expect(sa).toEqual(sb);
    expect(c()).not.toBe(sa[0]);
  });

  it('stays in [0, 1)', () => {
    const r = mulberry32(1);
    for (let i = 0; i < 1000; i++) {
      const v = r();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});
