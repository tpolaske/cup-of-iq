import { describe, expect, it } from 'vitest';
import { readJson, safeStorage, writeJson, type StorageLike } from './storage';

function fake(): StorageLike & { map: Map<string, string> } {
  const map = new Map<string, string>();
  return {
    map,
    getItem: (k) => map.get(k) ?? null,
    setItem: (k, v) => void map.set(k, v),
    removeItem: (k) => void map.delete(k),
  };
}

describe('shared/storage', () => {
  it('round-trips JSON', () => {
    const s = fake();
    writeJson(s, 'k', { a: 1 });
    expect(readJson(s, 'k')).toEqual({ a: 1 });
  });

  it('null storage (private mode) is a silent no-op / null read', () => {
    expect(() => writeJson(null, 'k', 1)).not.toThrow();
    expect(readJson(null, 'k')).toBeNull();
  });

  it('missing key and corrupt payload both read as null, never throw', () => {
    const s = fake();
    expect(readJson(s, 'nope')).toBeNull();
    s.map.set('bad', '{not json');
    expect(readJson(s, 'bad')).toBeNull();
  });

  it('a setItem that throws mid-session is swallowed', () => {
    const s = fake();
    s.setItem = () => { throw new Error('quota'); };
    expect(() => writeJson(s, 'k', 1)).not.toThrow();
  });

  it('safeStorage returns null when window is unavailable (Node)', () => {
    expect(safeStorage()).toBeNull();
  });
});
