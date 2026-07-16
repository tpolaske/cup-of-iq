import { describe, expect, it } from 'vitest';
import {
  STORAGE_KEY,
  defaultState,
  load,
  playedToday,
  recordRound,
  resetAll,
  save,
  setLevel,
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

describe('load/save (NFR-7, BRD-5)', () => {
  it('defaults with no storage at all (private mode)', () => {
    expect(load(null)).toEqual(defaultState());
  });

  it('defaults on empty, corrupt, and wrong-schema payloads', () => {
    const s = fakeStorage();
    expect(load(s)).toEqual(defaultState());
    s.map.set(STORAGE_KEY, '{not json');
    expect(load(s)).toEqual(defaultState());
    s.map.set(STORAGE_KEY, JSON.stringify({ schemaVersion: 9, level: 3 }));
    expect(load(s)).toEqual(defaultState());
  });

  it('clamps a corrupt level to 5 (BRD-5)', () => {
    const s = fakeStorage();
    s.map.set(STORAGE_KEY, JSON.stringify({ schemaVersion: 1, level: 99, perfectsAtLevel: 0 }));
    expect(load(s).level).toBe(5);
  });

  it('treats missing sound as on (pre-existing v1 payloads)', () => {
    const s = fakeStorage();
    s.map.set(STORAGE_KEY, JSON.stringify({ schemaVersion: 1, level: 2, perfectsAtLevel: 1 }));
    expect(load(s).sound).toBe(true);
  });

  it('round-trips a real state', () => {
    const s = fakeStorage();
    const st = recordRound(defaultState(), {
      dayNumber: 3, levelPlayed: 1, wrongTaps: 2, dinoId: 'stegosaurus', titleId: 'stegosaurus',
    });
    save(s, st);
    expect(load(s)).toEqual(st);
  });
});

describe('level-up rules (PRG-1..5)', () => {
  const perfect = (day: number) => ({
    dayNumber: day, levelPlayed: 1, wrongTaps: 0, dinoId: 'x', titleId: 't-rex',
  });

  it('3 perfect rounds \u2192 level 2, counter reset, leveledUp flagged once', () => {
    let st = defaultState();
    st = recordRound(st, perfect(1));
    expect(st.perfectsAtLevel).toBe(1);
    expect(st.lastPlayed?.leveledUp).toBe(false);
    st = recordRound(st, perfect(2));
    expect(st.perfectsAtLevel).toBe(2);
    st = recordRound(st, perfect(3));
    expect(st.level).toBe(2);
    expect(st.perfectsAtLevel).toBe(0);
    expect(st.lastPlayed?.leveledUp).toBe(true);
  });

  it('a non-perfect round never decreases anything (PRG-5)', () => {
    let st = { ...defaultState(), level: 3, perfectsAtLevel: 2 };
    st = recordRound(st, { dayNumber: 9, levelPlayed: 3, wrongTaps: 4, dinoId: 'x', titleId: 'brontosaurus' });
    expect(st.level).toBe(3);
    expect(st.perfectsAtLevel).toBe(2);
    expect(st.lastPlayed?.leveledUp).toBe(false);
  });

  it('caps at level 5: the counter still resets, no phantom level-up (PRG-2)', () => {
    let st = { ...defaultState(), level: 5, perfectsAtLevel: 2 };
    st = recordRound(st, perfect(20));
    expect(st.level).toBe(5);
    expect(st.perfectsAtLevel).toBe(0);
    expect(st.lastPlayed?.leveledUp).toBe(false);
  });

  it('manual override clamps and resets the counter (PRG-4)', () => {
    const st = setLevel({ ...defaultState(), perfectsAtLevel: 2 }, 9);
    expect(st.level).toBe(5);
    expect(st.perfectsAtLevel).toBe(0);
  });
});

describe('once-a-day lock (LCK-1, GRN-3)', () => {
  it('playedToday matches lastPlayed.dayNumber only', () => {
    const st = recordRound(defaultState(), {
      dayNumber: 14, levelPlayed: 1, wrongTaps: 0, dinoId: 'x', titleId: 't-rex',
    });
    expect(playedToday(st, 14)).toBe(true);
    expect(playedToday(st, 15)).toBe(false);
    expect(playedToday(defaultState(), 14)).toBe(false);
  });

  it('resetAll clears the key', () => {
    const s = fakeStorage();
    save(s, defaultState());
    expect(s.map.has(STORAGE_KEY)).toBe(true);
    resetAll(s);
    expect(s.map.has(STORAGE_KEY)).toBe(false);
  });
});
