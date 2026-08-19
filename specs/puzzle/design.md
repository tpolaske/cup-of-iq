# Cup of IQ — Puzzle Mode Design (v1 draft, 2026-08-15)

*Companion to `design.md` (toddler dino mode) and `requirements-puzzle.md`.
Same repo, same stack, same no-backend static-files architecture — this
document covers what's specific to Puzzle mode: puzzle selection, the
timing/banner algorithm, content schema, and component breakdown.*

## 1. Stack — unchanged, no new decision needed

Puzzle mode makes zero stack changes: same Vite + vanilla TypeScript, same
GitHub Pages + Actions deploy, same Vitest for logic tests, same
`localStorage`-only state, same JSON-in-repo content model. The toddler
project's §1 reasoning (small state machine, solo maintainer, dependency
risk over rendering scale) applies identically here — if anything more so,
since Puzzle mode is *less* visually complex than the L1 tracks scene (no
SVG scene geometry, no audio, text-only for MVP per requirements-puzzle.md
decision #12).

**One explicit legal/design decision this doc bakes in:** school "banner"
results use only **generic, unowned visual elements** — a felt-pennant
shape, real school colors, and the school name set in a generic collegiate
*style* of font. Never an official mascot, seal, or a specific school's
actual proprietary wordmark/logo — those are active trademarks (and often
separately copyrighted artwork), not public domain, and licensing them
isn't worth it for a joke banner. Full design in §9.

## 2. Architecture overview

```
                    ┌────────────────────────────────────┐
                    │  index.html (static landing router) │
                    │  root "/" — two-icon chooser        │
                    │  no persistence, always shown       │
                    └───────┬──────────────────┬──────────┘
                            │                   │
                     "/dino/"             "/puzzle/"
                            │                   │
              (existing toddler app)   ┌────────▼─────────────┐
                                        │ main.ts — decide      │
                                        │ today's screen        │
                                        │  played today? ─yes─► │
                                        │   comeback            │
                                        │       │ no            │
                                        │       ▼               │
                                        │  puzzle.ts (state      │
                                        │  machine)              │
                                        └──┬─────────┬──────────┘
                                           │         │
                                    daily.ts   progress.ts
                                 (dayNumber,   (localStorage,
                                  difficulty    streak rules)
                                  seed, puzzle
                                  pick)              │
                                           banner.ts  share.ts
                                        (tier calc,   (text builder,
                                         school pick)  Web Share/
                                                        clipboard)
                          content/puzzles.json
                          content/puzzles-1percent.json
                          content/schools.json
```

`daily.ts`'s date math (`dayNumber`, the local-midnight algorithm, the
pre-launch clamp) is the *same function*, imported from the toddler app's
module rather than reimplemented — per NFR-S5, this is exactly the kind of
genuinely-shared logic worth extracting once both modes exist. Puzzle
selection, banner tiers, and the timer are new, Puzzle-mode-only logic.

**States:** *(revised 2026-08-15)* `idle → awaiting_answer → locked_in →
reveal → results`, plus the standalone `comeback` screen (post-completion).
A `reveal` state was added after visual review — a brief, standalone
pennant moment (full-size pennant, correct/incorrect word, nothing else)
that auto-advances into `results`. This actually brings Puzzle mode's state
shape closer to the toddler game's `celebration → results` pattern than
originally planned, just quieter (no dance loop, no confetti unless it's a
Tier-1/Sunday-solved result).

## 3. Daily Puzzle Selection

```ts
// puzzle-daily.ts

export type Difficulty = 'easy' | 'medium' | 'hard' | '1percent';

const DIFFICULTY_WEIGHTS: Record<Exclude<Difficulty, '1percent'>, number> = {
  easy: 0.50,
  medium: 0.35,
  hard: 0.15,
}; // provisional — see requirements-puzzle.md PZL-2, retune after real play

function posMod(n: number, m: number): number { return ((n % m) + m) % m; }

// mulberry32 — same tiny deterministic PRNG as the toddler game's daily.ts
function mulberry32(seed: number): () => number {
  let a = seed;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function isSpecialDay(now = new Date()): boolean {
  return now.getDay() === 0; // Sunday, device-local — WKS-1
}

export function pickDifficulty(dayNumber: number): Exclude<Difficulty, '1percent'> {
  const rand = mulberry32(dayNumber * 7 + 3)(); // distinct seed space from board/dino seeds
  let cum = 0;
  for (const [tier, weight] of Object.entries(DIFFICULTY_WEIGHTS)) {
    cum += weight;
    if (rand < cum) return tier as Exclude<Difficulty, '1percent'>;
  }
  return 'hard'; // float-rounding fallback
}

export function todaysPuzzle(dayNumber: number, now: Date, content: PuzzleContent): Puzzle {
  if (isSpecialDay(now)) {
    const pool = content.onePercent;
    return pool[posMod(dayNumber, pool.length)];
  }
  const difficulty = pickDifficulty(dayNumber);
  const pool = content.byDifficulty[difficulty];
  return pool[posMod(dayNumber, pool.length)];
}
```

Same determinism guarantee as the toddler game (PZL-4/DPS-4): same
`dayNumber` + same content files → same puzzle, same difficulty, same
special-day status, every time, every device, no network call.

## 4. Timing & Banner Tiers

```ts
// banner.ts

export type Tier = 'tier1' | 'tier2' | 'tier3' | 'tier4' | 'fail' | 'sundayFail';

const TIME_BANDS: Record<Exclude<Difficulty, '1percent'>, { tier1: number; tier2: number; tier3: number }> = {
  easy:   { tier1: 5,  tier2: 15, tier3: 20 },
  medium: { tier1: 10, tier2: 30, tier3: 40 },
  hard:   { tier1: 15, tier2: 45, tier3: 60 },
}; // provisional, TMR-1 — expect to retune after real play, same spirit as
   // the toddler game's animation timings

export function computeTier(
  difficulty: Difficulty,
  correct: boolean,
  seconds: number
): Tier {
  if (difficulty === '1percent') {
    return correct ? 'tier1' : 'sundayFail'; // WKS-3/WKS-4 — separate, gentler fail pool
  }
  if (!correct) return 'fail';
  const b = TIME_BANDS[difficulty];
  if (seconds <= b.tier1) return 'tier1';
  if (seconds <= b.tier2) return 'tier2';
  if (seconds <= b.tier3) return 'tier3';
  return 'tier4';
}

export function pickSchool(tier: Tier, seed: number, schools: SchoolContent): string {
  const pool = schools[tier];
  const rand = mulberry32(seed)();
  return pool[Math.floor(rand * pool.length)];
}
```

**Important implementation note (TMR-3):** `pickSchool` runs **once**, at
the moment a round completes, using a seed derived from `dayNumber` (so it's
reproducible if the page reloads the same day) — the chosen school is then
written into `lastPlayed` and read back on subsequent views, never
recomputed. This mirrors the toddler game's DPS-4 same-day-same-result
invariant; re-rolling the school on every results-screen view would look
like a bug ("wait, it said Yale a second ago").

## 5. localStorage Schema

Own namespaced key, `cupofiq.puzzle.v1` — separate from the toddler game's
`cupofiq.v1` (NFR-S5: separate mode-specific state, not shared):

```json
{
  "schemaVersion": 1,
  "accuracyStreak": 4,
  "bestStreak": 11,
  "lastPlayed": {
    "dayNumber": 96,
    "difficulty": "medium",
    "isSpecialDay": false,
    "correct": true,
    "seconds": 14,
    "tier": "tier2",
    "school": "Northwestern",
    "puzzleId": "sneaky-discount-01"
  }
}
```

- Lock check (mirrors LCK-1): `lastPlayed.dayNumber === dayNumber(now)`.
- `accuracyStreak` increments on correct, resets to 0 on incorrect (STK-1/2).
- `bestStreak` never decreases (STK-3).
- In-progress state (selected-but-not-confirmed answer, running timer) is
  never persisted — a same-day reload restarts the timer from zero and does
  not count as an attempt (LCK-2), same accepted-loophole spirit as the
  toddler game's sign-off #9.
- Private-mode fallback identical to NFR-7: no localStorage → game still
  runs, no lock, no streak persistence, share still works from the same
  session.

## 6. Component Breakdown

| Module | Responsibility |
|---|---|
| `src/landing.ts` | Root route: renders the two-icon chooser, routes to `/dino/` or `/puzzle/`. No persistence (LND-3). |
| `src/puzzle/main.ts` | Boot: read state, compute day, route to puzzle screen or comeback screen |
| `src/puzzle/puzzle.ts` | State machine: `idle → awaiting_answer → locked_in → results` |
| `src/puzzle/puzzle-daily.ts` | `todaysPuzzle`, `pickDifficulty`, `isSpecialDay` — pure, fully unit-tested (§3) |
| `src/puzzle/banner.ts` | `computeTier`, `pickSchool` — pure, fully unit-tested (§4) |
| `src/puzzle/progress.ts` | localStorage read/write, schema migration, streak rules — pure core, tested |
| `src/puzzle/timer.ts` | Stopwatch: starts on mount (skipped entirely on special days), stops on lock-in |
| `src/puzzle/share.ts` | `buildShareText(result)`, `share()` — Web Share → clipboard fallback, same pattern as toddler `share.ts` |
| `src/puzzle/screens/play.ts` | Puzzle prompt, answer selection, "Lock it in" confirm (ANS-3) |
| `src/puzzle/screens/results.ts` | Recap, explanation (always shown), banner, streak, share/copy |
| `src/puzzle/screens/comeback.ts` | Come-back card: today's result recap, "new puzzle tomorrow," share controls |
| `content/puzzles.json` | Regular-day puzzles, keyed by difficulty |
| `content/puzzles-1percent.json` | Weekly special pool |
| `content/schools.json` | Tier → school name arrays (§4), plus the separate Sunday-fail pool |
| `assets/landing/` | `icon-badge.webp` (corner mark), inline SVG for the two mode-chooser icons (no separate files — inlined in `landing.ts` for zero extra requests) |

## 7. Answer Flow — implementation notes

- **Select-then-confirm (ANS-3):** tapping a choice highlights it but does
  not submit; a separate "Lock it in" button commits the answer and stops
  the (invisible) timer. Prevents a mis-tap from burning the day's one
  attempt.
- **One attempt only (ANS-1):** once locked in, the play screen is
  replaced by the reveal moment, then results; there is no path back to
  `awaiting_answer` for that puzzle that day.
- **Timer: tracked, never shown (ANS-2, revised 2026-08-15).** `timer.ts`
  still starts on mount and stops on lock-in exactly as before — the value
  feeds `computeTier()` (§4) — but no component ever renders it. This
  applies uniformly now, including regular (non-special) days; the earlier
  design only hid it on the weekly special. Visual review showed a visible
  stopwatch reads as test-taking pressure, which works against the
  "this should be fun" goal running through the whole mode.
- **Reveal is deliberately minimal (TMR-5).** `screens/reveal.ts` renders
  only the full-size pennant and a short correct/incorrect word — no tier
  name, no numeric time, no difficulty label. It auto-advances to
  `results.ts` after a short pause (duration TBD — likely 1.5–2.5s, shorter
  than the toddler game's 4–8s hatch celebration since there's no
  dance/confetti sequence to run through on a typical result).

## 8. Explanations

*(Revised 2026-08-15 — was: always rendered unconditionally.)* Every
puzzle's `explanation` field (CNT-1) is available on the results screen
behind a single "Show the trick" tap, collapsed by default (EXP-1). This is
a decluttering change only — the explanation is never harder to reach than
one tap, never gated behind re-solving or any cost. No visual distinction
in *how* it reads based on correctness once expanded; same "here's the
clever reasoning" framing either way (EXP-2). Diagram support
(EXP-3) is Phase 2 — MVP explanations are text-only, matching the
text-only puzzle content decision.

## 9. Asset Plan

**Reused from the toddler project, unchanged:** palette (cream/brown/tan/
green), rounded font stack, motion language (gentle bob/lift on hover,
respects `prefers-reduced-motion`).

**Landing page (built, `landing-page.html` prototype):**
- Corner mark: `icon-badge.webp`, a crop of the existing Cup of IQ logo
  (cup + steam + puzzle piece, no wordmark), 46px circle, subtle steam-bob
  motion — reuses brand asset rather than inventing a new one.
- Toddler-mode icon: inline SVG, stacked counting blocks (numerals 1/2/3
  visible on the block faces — this is the *only* visible text anywhere on
  the page, and it's illustrating the counting concept itself, not a text
  label per LND-1a).
- Puzzle-mode icon: inline SVG, graduation cap with tassel, brand green
  accent on the tassel to tie back to the palette.
- No heading, no tagline, no button captions (LND-1a) — accessible names
  provided via `aria-label` for screen readers only.

**Puzzle screens (Phase 1, to design):** text-only puzzle cards, same
`--card`/`--card-line` treatment as the toddler game's patches. No new
illustration work needed for MVP — the visual budget goes toward Phase 2's
diagram-renderer library instead (seating-circle, clock-face, etc., per
requirements-puzzle.md's parking lot).

**Banners: felt pennant design (built, `pennant-banner.html` prototype).**
Result-screen banners render as a wool-felt-textured pennant — a genuine
design upgrade from the earlier "plain text badge" placeholder, developed
from a reference photo of a real (licensed) team pennant. Explicitly
scoped to stay on the safe side of the IP line discussed in §1:

- **Shape:** generic pennant/flag silhouette (grommet-edge left side,
  pointed right tip) — a product category, not owned by any school or
  brand.
- **Texture:** procedural wool/felt grain via an SVG `feTurbulence` filter,
  tinted to match each pennant's base color. No fabric photo/texture asset
  needed — stays consistent with the zero-dependency, all-static-files
  architecture (§1).
- **Construction details:** dashed stitched border (inset, tier-accent
  color) and a column of grommet circles down the left edge, both pulled
  from the reference photo's real construction, not from any specific
  school's branding.
- **Color:** each school entry in `content/schools.json` gets a color pair
  (base felt color + accent/stitch color) matching that school's
  well-known real colors (e.g. Yale navy/gold, Michigan blue/maize).
  Colors alone are much lower trademark risk than logos or wordmark
  typography — same reasoning as using school names in plain text.
- **Typography — two-tier, deliberately mixed:** the school name renders in
  a bold **collegiate-style serif** (a generic varsity/letterman look —
  candidates: Bevan, Alfa Slab One, or Playfair Display, all free/
  open-licensed Google Fonts with no tie to any specific school) to read as
  "pennant-like." The supporting line beneath it (e.g. "IS CALLING," "NICE
  WORK") stays in Cup of IQ's own rounded brand font, keeping one foot
  clearly in the product's own voice rather than fully impersonating
  official merchandise.
- **What's deliberately excluded:** any school's actual mascot artwork,
  official seal, or the specific proprietary lettering/logo treatment of
  their real wordmark (§1). Generic collegiate *style*, never a specific
  school's registered mark.
- **Per-tier variation:** Tier 1 and a solved Sunday special get the
  richest treatment (brightest colors, confetti); the fail tiers (both the
  regular weekday fail and the separate, gentler Sunday-fail pool per
  WKS-4) use a deliberately muted, low-saturation felt color regardless of
  which school name lands — the joke stays gentle, never visually harsh.

## 10. Sharing Implementation

```ts
// puzzle/share.ts — regular day output:
// Cup of IQ · Puzzle  Day 96
// 🔢 Medium — solved in 14s
// Northwestern is calling. 🎓
// 🔥 4-day streak
// https://cupofiq.com/puzzle

// special-day output:
// Cup of IQ · Puzzle  Day 98 · 💯 1% Club Sunday
// Solved it, untimed.
// Yale is calling. 🎓
// 🔥 5-day streak
// https://cupofiq.com/puzzle
```

Same mechanism as the toddler game: `navigator.share()` when available,
clipboard + toast fallback, always-visible Copy button. No PII beyond what
the player appends themselves.

## 11. Content Validation (build-time test)

Mirrors the toddler project's content test pattern:

- Every puzzle: unique `id`, non-empty `explanation`, exactly one correct
  choice (multiple-choice) or non-empty `answer` + `acceptedAlternates`
  (free-text), `difficulty` and `category` within the enum (CNT-2).
- `content/puzzles-1percent.json` entries are all `difficulty: "1percent"`
  and don't appear in the regular pools.
- `content/schools.json` has all five tiers (`tier1`..`tier4`, `fail`) plus
  `sundayFail`, each non-empty.
- *(Should-have, not launch-blocking, CNT-3)* Where feasible, an automated
  arithmetic check for math-flavored puzzles — the sample doc's own
  "Movie Theater" question needed hand-correcting, which is exactly the
  class of bug this would catch for free going forward.

---

## Not yet designed (next steps)

- Actual visual layout of the play/results screens (the landing page and
  the pennant banner component are the only pieces mocked up so far)
- Pennant refinements: fringe/tassel detail at the tip, rounded vs. sharp
  corners, size variants for results screen vs. share-image use, and final
  font pick from the Bevan/Alfa Slab One/Playfair Display shortlist (§9)
- Vitest test list (mirrors tasks.md's Phase 1 structure for the toddler
  game — daily selection, banner tiers, streak rules, content validation)
- Exact confetti/celebration treatment for a Tier-1 or Sunday-solved result
- Full ranked school-name list finalization (tiers 1-4 + both fail pools),
  each paired with its felt/accent color — content-writing task, not a
  design decision