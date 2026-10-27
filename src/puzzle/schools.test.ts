import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import type { SchoolContent } from './types';

// content/schools.json validation (design §11, TMR-3/3a, design §9 pennant colors).

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const schools = JSON.parse(readFileSync(path.join(root, 'content/schools.json'), 'utf8')) as SchoolContent;
const TIERS = ['tier1', 'tier2', 'tier3', 'tier4', 'fail'] as const;
const HEX = /^#[0-9a-fA-F]{6}$/;

const lum = (hex: string) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const contrast = (a: string, b: string) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

describe('content/schools.json', () => {
  it('has exactly tier1..tier4 and fail — no Sunday pool (TMR-3a) — each non-empty', () => {
    expect(Object.keys(schools).sort()).toEqual([...TIERS].sort());
    for (const t of TIERS) expect(schools[t].length, t).toBeGreaterThan(0);
  });

  it('every entry has a name and a valid, distinct color pair', () => {
    for (const t of TIERS) for (const s of schools[t]) {
      expect(s.name.trim().length, t).toBeGreaterThan(0);
      expect(s.base, s.name).toMatch(HEX);
      expect(s.accent, s.name).toMatch(HEX);
      expect(s.base.toLowerCase(), s.name).not.toBe(s.accent.toLowerCase());
    }
  });

  it('school names are unique across all tiers (findSchool is by name)', () => {
    const names = TIERS.flatMap((t) => schools[t].map((s) => s.name));
    expect(new Set(names).size).toBe(names.length);
  });

  it('pennant stitching/text is legible against the felt (contrast ≥ 2:1)', () => {
    for (const t of TIERS) for (const s of schools[t]) expect(contrast(s.base, s.accent), `${s.name} ${s.base}/${s.accent}`).toBeGreaterThanOrEqual(2);
  });
});
