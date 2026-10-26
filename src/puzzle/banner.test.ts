import { describe, expect, it } from 'vitest';
import { TIER1_TOTAL_SECONDS, computeSundayOutcome, computeWeekdayTier, findSchool, pickSchool, poolKeyFor, type RoundResult } from './banner';
import type { SchoolContent } from './types';

const r = (q1: boolean, q2: boolean, q3: boolean, totalSeconds = 20): RoundResult => ({ q1Correct: q1, q2Correct: q2, q3Correct: q3, totalSeconds });

describe('computeWeekdayTier (TMR-1)', () => {
  it('3/3 within 30s is tier1; slower is tier2 (time is a tiebreaker only)', () => {
    expect(computeWeekdayTier(r(true, true, true, 12))).toBe('tier1');
    expect(computeWeekdayTier(r(true, true, true, TIER1_TOTAL_SECONDS))).toBe('tier1'); // boundary inclusive
    expect(computeWeekdayTier(r(true, true, true, TIER1_TOTAL_SECONDS + 0.1))).toBe('tier2');
    expect(computeWeekdayTier(r(true, true, true, 600))).toBe('tier2');
  });

  it('2/3 is tier2 when Q3 (hard) is among the correct, tier3 when Q3 is missed', () => {
    expect(computeWeekdayTier(r(true, false, true))).toBe('tier2');
    expect(computeWeekdayTier(r(false, true, true))).toBe('tier2');
    expect(computeWeekdayTier(r(true, true, false))).toBe('tier3');
  });

  it('time never affects anything below 3/3', () => {
    expect(computeWeekdayTier(r(true, false, true, 1))).toBe('tier2');
    expect(computeWeekdayTier(r(true, false, true, 999))).toBe('tier2');
    expect(computeWeekdayTier(r(true, true, false, 1))).toBe('tier3');
  });

  it('1/3 is tier4 whichever question it was; 0/3 is fail', () => {
    expect(computeWeekdayTier(r(true, false, false))).toBe('tier4');
    expect(computeWeekdayTier(r(false, true, false))).toBe('tier4');
    expect(computeWeekdayTier(r(false, false, true))).toBe('tier4');
    expect(computeWeekdayTier(r(false, false, false))).toBe('fail');
  });

  it('covers all 8 correctness combinations without throwing', () => {
    for (let m = 0; m < 8; m++) expect(computeWeekdayTier(r(!!(m & 1), !!(m & 2), !!(m & 4)))).toMatch(/^(tier[1-4]|fail)$/);
  });
});

describe('computeSundayOutcome (TMR-2)', () => {
  it('is binary', () => {
    expect(computeSundayOutcome(true)).toBe('accepted');
    expect(computeSundayOutcome(false)).toBe('waitlisted');
  });
});

const sch = (n: string) => ({ name: n, base: '#000000', accent: '#ffffff' });
const schools: SchoolContent = {
  tier1: ['A1', 'A2', 'A3', 'A4', 'A5'].map(sch),
  tier2: ['B1', 'B2'].map(sch),
  tier3: ['C1'].map(sch),
  tier4: ['D1'].map(sch),
  fail: ['F1', 'F2'].map(sch),
};

describe('pickSchool (TMR-3/3a)', () => {
  it('Sunday accepted AND waitlisted both draw from tier1 (no separate Sunday pool)', () => {
    expect(poolKeyFor('accepted')).toBe('tier1');
    expect(poolKeyFor('waitlisted')).toBe('tier1');
    for (let seed = 1; seed < 60; seed++) {
      expect(pickSchool('waitlisted', seed, schools)).toMatch(/^A\d$/);
      expect(pickSchool('accepted', seed, schools)).toMatch(/^A\d$/);
    }
  });

  it('weekday tiers draw only from their own pool', () => {
    for (let seed = 1; seed < 40; seed++) {
      expect(pickSchool('tier2', seed, schools)).toMatch(/^B\d$/);
      expect(pickSchool('tier3', seed, schools)).toBe('C1');
      expect(pickSchool('tier4', seed, schools)).toBe('D1');
      expect(pickSchool('fail', seed, schools)).toMatch(/^F\d$/);
    }
  });

  it('is deterministic for a given seed, and varies across days', () => {
    expect(pickSchool('tier1', 82, schools)).toBe(pickSchool('tier1', 82, schools));
    const seen = new Set<string>();
    for (let day = 1; day <= 200; day++) seen.add(pickSchool('tier1', day, schools));
    expect(seen.size).toBe(5); // every school reachable
  });

  it('throws on an empty pool', () => {
    expect(() => pickSchool('fail', 1, { ...schools, fail: [] })).toThrow(/empty school pool/);
  });
});

describe('findSchool', () => {
  it('finds a persisted school name in any tier, undefined otherwise', () => {
    expect(findSchool('D1', schools)?.name).toBe('D1');
    expect(findSchool('F2', schools)?.base).toBe('#000000');
    expect(findSchool('Nope', schools)).toBeUndefined();
  });
});
