// daily.ts — pure daily/board logic (design.md §3). No DOM, no storage.

export interface Dino {
  id: string;
  displayName: string;
  emoji: string;
  image: string;
  funFact: string;
}

export interface Mission {
  text: string;
  emoji: string;
  count: number;
}

export const LAUNCH_DATE = new Date(2026, 8, 1);
// ⚠️ Placeholder (sign-off #7) — set to the real date on go-live morning.
// IMMUTABLE once the first real result is shared: changing it renumbers every
// day and reshuffles every board.

const MS_PER_DAY = 86_400_000;

// DPS-1 — device-local calendar days since launch, plus one. Math.round (not
// floor) is deliberate: it absorbs DST's 23/25-hour days, since local-midnight
// diffs are then ±1 h off an exact multiple of 24 h. Pre-launch visits clamp
// to Day 1: JS % preserves sign, so day ≤ 0 would index dinos[-1] = undefined
// (swarm.md ARCH-1).
export function dayNumber(now: Date = new Date(), launch: Date = LAUNCH_DATE): number {
  const nowMid = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const launchMid = new Date(launch.getFullYear(), launch.getMonth(), launch.getDate());
  const day = Math.round((nowMid.getTime() - launchMid.getTime()) / MS_PER_DAY) + 1;
  return Math.max(1, day);
}

export function posMod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

// DPS-2 / PRM-1 / MSN-1 — deterministic daily pick with open repeats (sign-off #11).
export function pickDaily<T>(day: number, items: readonly T[]): T {
  if (items.length === 0) throw new Error('pickDaily: empty content list');
  return items[posMod(day - 1, items.length)];
}

export const todaysDino = (day: number, dinos: readonly Dino[]): Dino => pickDaily(day, dinos);
export const todaysPrompt = (day: number, prompts: readonly string[]): string => pickDaily(day, prompts);
export const todaysMission = (day: number, missions: readonly Mission[]): Mission => pickDaily(day, missions); // Phase 2

export type TargetFace = 'prints' | 'prints+numeral' | 'numeral';
export type LayoutId = 'scatter3' | 'quincunx5' | 'grid10';
export type RevealStage = 'crackA' | 'crackA2' | 'crackB' | 'peek' | 'hatch';

export interface BoardSpec {
  values: number[]; // completion order = ascending values (TAP-1)
  face: TargetFace;
  layout: LayoutId;
  minTargetPx: number;
  revealAfterTap: Record<number, RevealStage>; // TRL-2 stage table
}

// BRD-1 / BRD-5 / TRL-2 — one source of truth for the level ladder.
export function boardSpecForLevel(level: number): BoardSpec {
  switch (Math.min(Math.max(Math.round(level), 1), 5)) {
    case 1:
      return {
        values: [1, 2, 3], face: 'prints', layout: 'scatter3', minTargetPx: 100,
        revealAfterTap: { 1: 'crackA', 2: 'peek', 3: 'hatch' },
      };
    case 2:
      return {
        values: [1, 2, 3, 4, 5], face: 'prints+numeral', layout: 'quincunx5', minTargetPx: 88,
        revealAfterTap: { 1: 'crackA', 2: 'crackA2', 3: 'crackB', 4: 'peek', 5: 'hatch' },
      };
    case 3:
      return {
        values: [1, 2, 3, 4, 5], face: 'numeral', layout: 'quincunx5', minTargetPx: 88,
        revealAfterTap: { 1: 'crackA', 2: 'crackA2', 3: 'crackB', 4: 'peek', 5: 'hatch' },
      };
    case 4:
      return {
        values: [6, 7, 8, 9, 10], face: 'numeral', layout: 'quincunx5', minTargetPx: 88,
        revealAfterTap: { 1: 'crackA', 2: 'crackA2', 3: 'crackB', 4: 'peek', 5: 'hatch' },
      };
    default:
      return {
        values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], face: 'numeral', layout: 'grid10', minTargetPx: 64,
        revealAfterTap: { 2: 'crackA', 5: 'crackB', 8: 'peek', 10: 'hatch' },
      };
  }
}

// DPS-3 — mulberry32-driven Fisher–Yates; every device at the same level sees
// the identical arrangement on the same day.
function mulberry32(seed: number): () => number {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seededShuffle<T>(items: readonly T[], seed: number): T[] {
  const a = items.slice();
  const rnd = mulberry32(seed);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function boardSeed(day: number, level: number): number {
  return day * 100 + level;
}
