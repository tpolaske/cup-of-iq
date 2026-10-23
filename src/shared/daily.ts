// shared/daily.ts — date math + seeded PRNG used by every mode (puzzle design.md §12).
// Pure: no DOM, no storage. Extracted verbatim from the toddler app's daily.ts;
// behavior is pinned by src/shared/daily.test.ts golden values.

export const LAUNCH_DATE = new Date(2026, 7, 3); // 2026-08-03 — go-live day, Day 1.
// ⚠️ IMMUTABLE (sign-off #7). Changing this renumbers every day and reshuffles
// every board in BOTH modes. Note the month is 0-indexed: 7 = August.

const MS_PER_DAY = 86_400_000;

// DPS-1 / PZL-1 — device-local calendar days since launch, plus one. Math.round
// (not floor) is deliberate: it absorbs DST's 23/25-hour days, since
// local-midnight diffs are then ±1 h off an exact multiple of 24 h. Pre-launch
// visits clamp to Day 1: JS % preserves sign, so day ≤ 0 would index
// items[-1] = undefined (swarm.md ARCH-1). Beware: while LAUNCH_DATE is in the
// future the clamp pins every visit to Day 1, which also pins the lock closed.
export function dayNumber(now: Date = new Date(), launch: Date = LAUNCH_DATE): number {
  const nowMid = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const launchMid = new Date(launch.getFullYear(), launch.getMonth(), launch.getDate());
  const day = Math.round((nowMid.getTime() - launchMid.getTime()) / MS_PER_DAY) + 1;
  return Math.max(1, day);
}

// JS % preserves sign — always use this for array indexing.
export function posMod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

// DPS-3 — mulberry32 seeded PRNG; same seed → same sequence on every device.
export function mulberry32(seed: number): () => number {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
