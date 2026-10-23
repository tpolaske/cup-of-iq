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

// Date math + PRNG live in shared/ (puzzle design.md §12). Re-exported here so
// existing imports keep working unchanged.
import { mulberry32, posMod } from './shared/daily';
export { LAUNCH_DATE, dayNumber, posMod } from './shared/daily';

// DPS-2 / PRM-1 / MSN-1 — deterministic daily pick with open repeats (sign-off #11).
export function pickDaily<T>(day: number, items: readonly T[]): T {
  if (items.length === 0) throw new Error('pickDaily: empty content list');
  return items[posMod(day - 1, items.length)];
}

export const todaysDino = (day: number, dinos: readonly Dino[]): Dino => pickDaily(day, dinos);
export const todaysPrompt = (day: number, prompts: readonly string[]): string => pickDaily(day, prompts);
export const todaysMission = (day: number, missions: readonly Mission[]): Mission => pickDaily(day, missions); // Phase 2

// Sign-off #22 — interim visual distinctiveness. No per-species art is
// committed yet (Phase 2), so every dino currently falls back to one of only
// two emoji (🦕/🦖), which made the daily species change invisible even
// though DPS-2 was picking correctly underneath. This derives a stable pastel
// hue from the dino's id (same id → same color, always) so each of the 34
// species reads as visually distinct day to day until real art replaces it.
export function dinoBadgeColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0;
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 58%, 80%)`;
}

export type TargetFace = 'prints' | 'prints+numeral' | 'numeral';
export type LayoutId = 'scatter3' | 'scatter5' | 'quincunx5' | 'grid10';
export type RevealStage = 'crackA' | 'crackA2' | 'crackB' | 'peek' | 'hatch';

export interface BoardSpec {
  values: number[]; // completion order = ascending values (TAP-1)
  face: TargetFace;
  layout: LayoutId;
  minTargetPx: number;
  revealAfterTap: Record<number, RevealStage>; // TRL-2 stage table
}

// TRL-2's "5 targets" reveal-stage row — shared by every 5-target level
// (L2–L5) regardless of target face (BRD-1). One object, reused, so the four
// levels can never drift out of sync with each other.
const FIVE_TARGET_REVEAL: Record<number, RevealStage> = {
  1: 'crackA', 2: 'crackA2', 3: 'crackB', 4: 'peek', 5: 'hatch',
};

// BRD-1 / BRD-5 / TRL-2 — one source of truth for the level ladder.
// Sign-off #24: a new L2 "Tracks (more)" was inserted between the original
// L1 and L2 — same footprint-scatter mechanic as L1, just 5 targets instead
// of 3. The former L2–L5 shift up to L3–L6; the level cap is now 6.
export function boardSpecForLevel(level: number): BoardSpec {
  switch (Math.min(Math.max(Math.round(level), 1), 6)) {
    case 1:
      return {
        values: [1, 2, 3], face: 'prints', layout: 'scatter3', minTargetPx: 100,
        revealAfterTap: { 1: 'crackA', 2: 'peek', 3: 'hatch' },
      };
    case 2: // "Tracks (more)" (sign-off #24) — L1 mechanic, 5 targets, ≥ 88 px
      return {
        values: [1, 2, 3, 4, 5], face: 'prints', layout: 'scatter5', minTargetPx: 88,
        revealAfterTap: FIVE_TARGET_REVEAL,
      };
    case 3:
      return {
        values: [1, 2, 3, 4, 5], face: 'prints+numeral', layout: 'quincunx5', minTargetPx: 88,
        revealAfterTap: FIVE_TARGET_REVEAL,
      };
    case 4:
      return {
        values: [1, 2, 3, 4, 5], face: 'numeral', layout: 'quincunx5', minTargetPx: 88,
        revealAfterTap: FIVE_TARGET_REVEAL,
      };
    case 5:
      return {
        values: [6, 7, 8, 9, 10], face: 'numeral', layout: 'quincunx5', minTargetPx: 88,
        revealAfterTap: FIVE_TARGET_REVEAL,
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
export function seededShuffle<T>(items: readonly T[], seed: number): T[] {
  const a = items.slice();
  const rnd = mulberry32(seed);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// `attempt` is 0 for the day's real round, so DPS-3 is untouched: every device
// still sees the identical morning board. Replays (LCK-5, sign-off #18) pass
// 1, 2, … and get a fresh arrangement, so he practises counting rather than
// memorising positions. Replays are never recorded or shared, so they need no
// cross-device agreement.
export function boardSeed(day: number, level: number, attempt = 0): number {
  return day * 100 + level + attempt * 1_000_003;
}
