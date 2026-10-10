# Cup of IQ — Puzzle Mode Design (v2 draft, 2026-09-23)

*Companion to `design.md` (toddler dino mode) and `requirements.md`.
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
SVG scene geometry, no audio, text-only for MVP per requirements.md
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
                    ┌───────────────────────────────────┐
                    │  index.html (static landing router) │
                    │  root "/" — two-icon chooser        │
                    │  no persistence, always shown       │
                    └───┬───────────────┬──────────┘
                            │                   │
                     "/dino/"             "/puzzle/"
                            │                   │
              (existing toddler app)   ┌────────▼─────────┐
                                        │ main.ts — decide      │
                                        │ today's screen        │
                                        │  played today? ─yes─► │
                                        │   comeback            │
                                        │       │ no            │
                                        │       ▼               │
                                        │  puzzle.ts (state      │
                                        │  machine)              │
                                        └──┬─────────┬────────┘
                                           │         │
                                    daily.ts   progress.ts
                                 (dayNumber,   (localStorage,
                                  fixed 3-Q     streak rules)
                                  round pick)         │
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

**States:** *(revised 2026-09-23, requirements.md sign-off #13/#14)*
`idle → answering_round → locked_in → reveal → results`, plus the
standalone `comeback` screen (post-completion). `answering_round` now
covers all of the day's questions at once (three Mon–Sat, one on Sundays) — the player moves Q1→Q2→Q3 within a
single screen/step sequence, with nothing submitted until the round-level
"Lock it in" (ANS-3) fires. A `reveal` state runs after lock-in — a brief,
standalone pennant moment (full-size pennant, a per-question
correct/incorrect summary, nothing else) that auto-advances into `results`.
This brings Puzzle mode's state shape closer to the toddler game's
`celebration → results` pattern than the v1 single-question design did,
just quieter (no dance loop, no confetti unless it's a Tier-1/Sunday-
acceptance result).

## 3. Daily Round Selection

*Rewritten 2026-09-23 (requirements.md sign-off #13/#17) — replaces the v1
randomized-single-difficulty pick with a fixed three-question round.*

```ts
// puzzle-daily.ts

export type Difficulty = 'easy' | 'medium' | 'hard' | '1percent';
export type Slot = 'q1' | 'q2' | 'q3' | 'special';

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
  return now.getDay() === 0; // Sunday, device-local — PZL-3
}

export interface RoundQuestion {
  slot: Slot;
  difficulty: Difficulty;
  puzzle: Puzzle;
  timed: boolean; // false only for Sunday's special question (ANS-2)
}

// PZL-2/PZL-3: Mon–Sat is a fixed three-question round — Q1 easy, Q2 medium,
// Q3 hard. Sunday is a single untimed 1percent question (sign-off #23).
export function todaysRound(dayNumber: number, now: Date, content: PuzzleContent): RoundQuestion[] {
  if (isSpecialDay(now)) {
    const special = content.onePercent[posMod(dayNumber, content.onePercent.length)];
    return [{ slot: 'special', difficulty: '1percent', puzzle: special, timed: false }];
  }
  const q1 = content.byDifficulty.easy[posMod(dayNumber, content.byDifficulty.easy.length)];
  const q2 = content.byDifficulty.medium[posMod(dayNumber, content.byDifficulty.medium.length)];
  const q3 = content.byDifficulty.hard[posMod(dayNumber, content.byDifficulty.hard.length)];
  return [
    { slot: 'q1', difficulty: 'easy',   puzzle: q1, timed: true },
    { slot: 'q2', difficulty: 'medium', puzzle: q2, timed: true },
    { slot: 'q3', difficulty: 'hard',   puzzle: q3, timed: true },
  ];
}
```

Same determinism guarantee as the toddler game (PZL-4/DPS-4): same
`dayNumber` + same content files → same three-question round, same
special-question status on Sundays, every time, every device, no network
call. There is no more `pickDifficulty`/weighted-PRNG step — every
Mon–Sat day always draws from all three difficulty pools, in the same fixed
order, and Sunday draws only from the `1percent` pool (sign-off #23).

**Capture once (PZL-6, sign-off #20):** `main.ts` computes `dayNumber`, the
Sunday flag, and `todaysRound(...)` exactly once at boot and passes those
values through the whole round — never re-reading the clock at lock-in. A
round started before midnight and locked in after it is saved against the
day it started.

**Pool-length rule (sign-offs #21/#23):** Sundays skip the `easy`,
`medium`, and `hard` pools, and the Sunday-only `1percent` pool steps by 7
days between draws, so a pool whose length is a multiple of 7 would strand
part of it (e.g. a 35-question `hard` pool would never show 5 of its
questions, and a 70-question `easy` pool would never show 10). No pool
length may be a multiple of 7; the content test (§11) enforces it.

## 4. Correctness & Banner Tiers

*Rewritten 2026-09-23 (requirements.md sign-off #15/#17) — replaces the v1
per-difficulty speed-band table entirely. Weekday tiers now key off how
many of the three answers were correct, with total time as a 3/3
tiebreaker and Q3 (hard) weighted above a straight fraction. Sunday
collapses to a binary outcome instead of a tier.*

```ts
// banner.ts

export type WeekdayTier = 'tier1' | 'tier2' | 'tier3' | 'tier4' | 'fail';
export type SundayOutcome = 'accepted' | 'waitlisted';

export interface RoundResult {
  q1Correct: boolean;
  q2Correct: boolean;
  q3Correct: boolean; // the "hard" slot (Mon–Sat only)
  totalSeconds: number; // single round timer, stopped at Lock it in (ANS-4); Mon–Sat only — Sundays have no timer
}

const TIER1_TOTAL_SECONDS = 30; // provisional, TMR-1 — expect to retune after real play

// TMR-1 — Mon–Sat only. Correctness drives the tier; total time is a
// 3/3 tiebreaker only; Q3 correctness outweighs a straight fraction at 2/3.
export function computeWeekdayTier(r: RoundResult): WeekdayTier {
  const correctCount = [r.q1Correct, r.q2Correct, r.q3Correct].filter(Boolean).length;
  if (correctCount === 3) {
    return r.totalSeconds <= TIER1_TOTAL_SECONDS ? 'tier1' : 'tier2';
  }
  if (correctCount === 2) {
    return r.q3Correct ? 'tier2' : 'tier3';
  }
  if (correctCount === 1) return 'tier4';
  return 'fail';
}

// TMR-2 — Sunday only. Binary on the single untimed 1% question (sign-off #23).
// No Tier 2/3/4/Fail on Sundays.
export function computeSundayOutcome(specialCorrect: boolean): SundayOutcome {
  return specialCorrect ? 'accepted' : 'waitlisted';
}

// TMR-3/TMR-3a — a Sunday outcome maps onto the *same* school pools as the
// weekday tiers: 'accepted' → tier1 pool, 'waitlisted' → tier1 pool too
// (the "so close" joke), never a separate sundayFail pool.
export function pickSchool(
  tier: WeekdayTier | 'accepted' | 'waitlisted',
  seed: number,
  schools: SchoolContent
): string {
  const poolKey = tier === 'accepted' || tier === 'waitlisted' ? 'tier1' : tier;
  const pool = schools[poolKey];
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
like a bug ("wait, it said Yale a second ago"). Note there is no more
`sundayFail` school pool — Waitlisted reuses `tier1`'s names (TMR-3a).

## 5. localStorage Schema

Own namespaced key, `cupofiq.puzzle.v2` — separate from the toddler game's
`cupofiq.v1` (NFR-S5: separate mode-specific state, not shared). Schema
version bumped from the old single-puzzle shape; a v1→v2 migration just
drops the old `lastPlayed` shape rather than trying to translate it (one
day of stale "last played" state isn't worth preserving):

```json
{
  "schemaVersion": 2,
  "accuracyStreak": 4,
  "bestStreak": 11,
  "lastPlayed": {
    "dayNumber": 96,
    "isSpecialDay": false,
    "questions": [
      { "slot": "q1", "difficulty": "easy",   "puzzleId": "shape-seq-04",     "correct": true  },
      { "slot": "q2", "difficulty": "medium", "puzzleId": "sneaky-discount-01", "correct": true  },
      { "slot": "q3", "difficulty": "hard",   "puzzleId": "seating-logic-02", "correct": false }
    ],
    "totalSeconds": 27,
    "outcome": "tier2",
    "school": "Northwestern"
  }
}
```

There are no per-question times since sign-off #18 — only the round's
`totalSeconds`. On a Sunday (sign-off #23) `isSpecialDay` is `true`,
`questions` holds a single entry (`slot: "special"`, `difficulty:
"1percent"`), `outcome` is `"accepted"` or `"waitlisted"` instead of a
weekday tier, and `totalSeconds` is omitted (no timer runs).
`lastPlayed.dayNumber` is the day the round *started* (PZL-6).

- Lock check (mirrors LCK-1): `lastPlayed.dayNumber === dayNumber(now)`.
- `accuracyStreak` increments only on a perfect result — weekday 3/3 or
  Sunday `"accepted"` — and resets to 0 on anything else, including
  `"waitlisted"` (STK-1/2, no partial-credit carve-out).
- `bestStreak` never decreases (STK-3).
- A day with no completed round never touches `accuracyStreak` (STK-5,
  sign-off #19) — only a completed round can increment or reset it.
- In-progress state (any selected-but-not-confirmed answers, the running
  round timer) is never persisted — a same-day reload restarts the whole
  round (and its timer) from the beginning and does not count as an
  attempt (LCK-2), same accepted-loophole spirit as the toddler game's
  sign-off #9.
- Private-mode fallback identical to NFR-7: no localStorage → game still
  runs, no lock, no streak persistence, share still works from the same
  session.

## 6. Component Breakdown

| Module | Responsibility |
|---|---|
| `src/landing.ts` | Root route: renders the two-icon chooser, routes to `/dino/` or `/puzzle/`. No persistence (LND-3). |
| `src/puzzle/main.ts` | Boot: read state, compute day, route to round screen or comeback screen |
| `src/puzzle/puzzle.ts` | State machine: `idle → answering_round → locked_in → reveal → results` |
| `src/puzzle/puzzle-daily.ts` | `todaysRound`, `isSpecialDay` — pure, fully unit-tested (§3) |
| `src/puzzle/banner.ts` | `computeWeekdayTier`, `computeSundayOutcome`, `pickSchool` — pure, fully unit-tested (§4) |
| `src/puzzle/progress.ts` | localStorage read/write (schema v2, §5), schema migration, perfect-day streak rules — pure core, tested |
| `src/puzzle/timer.ts` | Single round stopwatch: starts when the round first renders, pauses while the page is hidden, stops at "Lock it in" (ANS-4); never starts on Sundays |
| `src/puzzle/share.ts` | `buildShareText(result)`, `share()` — Web Share → clipboard fallback, same pattern as toddler `share.ts` |
| `src/puzzle/screens/play.ts` | Q1→Q2→Q3 prompt + answer selection with free back/forward navigation and editable answers (Sunday: the single special question, no timer), round-level "Lock it in" confirm (ANS-3) |
| `src/puzzle/screens/reveal.ts` | Full pennant + per-question correct/incorrect summary, auto-advances to results (TMR-5) |
| `src/puzzle/screens/results.ts` | Per-question breakdown (RES-1), banner, streak, share/copy |
| `src/puzzle/screens/comeback.ts` | Come-back card: today's round recap, "new round tomorrow," share controls |
| `content/puzzles.json` | Regular-day puzzles, keyed by difficulty — every Mon–Sat now draws from all three (`easy`/`medium`/`hard`) at once |
| `content/puzzles-1percent.json` | Sunday special-question pool (one question per Sunday) |
| `content/schools.json` | Tier → school name arrays (§4): `tier1`..`tier4`, `fail`. No separate Sunday pool — Waitlisted reuses `tier1` (TMR-3a). |
| `assets/landing/` | `icon-badge.webp` (corner mark), inline SVG for the two mode-chooser icons (no separate files — inlined in `landing.ts` for zero extra requests) |

## 7. Answer Flow — implementation notes

- **Select-then-round-level-confirm (ANS-3, revised 2026-09-23, sign-off
  #14):** tapping a choice on Q1, Q2, or Q3 highlights it but does not
  submit anything; the player can move between all three questions freely
  before locking in. A single "Lock it in" button, shown once all three
  are answered, commits the whole round at once and stops the round timer.
  This replaced a per-question confirm specifically
  to avoid leaking Q1's correctness before Q2/Q3 are answered, on top of
  the original fat-finger protection.
- **One attempt per round (ANS-1):** once locked in, the play screen is
  replaced by the reveal moment, then results; there is no path back to
  `answering_round` for that day.
- **Timer: one round stopwatch, never shown (ANS-2/ANS-4, sign-off #18).**
  `timer.ts` starts when the round first renders and stops when "Lock it
  in" is tapped; changing answers or navigating between questions neither
  resets nor stops it. It pauses while the page is hidden
  (`visibilitychange`). On Sundays (sign-off #23) the round is a single
  untimed question, so the timer never starts and no `totalSeconds` is
  recorded (§4). No component ever renders the readout. A visible stopwatch was
  found to read as test-taking pressure, which works against the "this
  should be fun" goal running through the whole mode.
- **Reveal is deliberately minimal (TMR-5).** `screens/reveal.ts` renders
  only the full-size pennant and a short per-question correct/incorrect
  summary (e.g. three check/x marks) — no tier name, no numeric time, no
  difficulty label. It auto-advances to `results.ts` after a short pause
  (duration TBD — likely 1.5–2.5s, shorter than the toddler game's 4–8s
  hatch celebration since there's no dance/confetti sequence to run
  through on a typical result).

## 8. Explanations

Every question's `explanation` field (CNT-1) is available on the results
screen behind its own "Show the trick" tap, collapsed by default (EXP-1) —
now one such control per question in the per-question breakdown (RES-1),
not a single explanation for the day. The explanation is never harder to
reach than one tap, never gated behind re-solving or any cost. No visual
distinction in *how* it reads based on correctness once expanded; same
"here's the clever reasoning" framing either way (EXP-2), for all three
questions including Sunday's special. Diagram support (EXP-3) is Phase 2 —
MVP explanations are text-only, matching the text-only puzzle content
decision.

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
requirements.md's parking lot).

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
- **Per-tier variation:** *(revised 2026-09-23)* Weekday Tier 1 and a
  Sunday "accepted" result get the richest treatment (brightest colors,
  confetti). Weekday Fail uses a deliberately muted, low-saturation felt
  color — the joke stays gentle, never visually harsh. Sunday's
  **Waitlisted** outcome reuses the Tier 1 school names (TMR-3a) but gets
  its own *muted* felt treatment, distinct from both the vivid Tier 1
  acceptance look and the weekday Fail color — visually it should read as
  "so close," not "you failed." There is no longer a separate
  `sundayFail` school pool (WKS-4 retired).

## 10. Sharing Implementation

```ts
// puzzle/share.ts — weekday output:
// Cup of IQ · Puzzle  Day 96
// 2/3 correct
// Northwestern is calling. 🎓
// 🔥 4-day streak
// https://cupofiq.com/puzzle

// Sunday, accepted (solved the 1% question):
// Cup of IQ · Puzzle  Day 98 · 💯 Sunday special
// Solved the 1% question — accepted!
// Yale is calling. 🎓
// 🔥 5-day streak
// https://cupofiq.com/puzzle

// Sunday, waitlisted (a waitlist always resets the streak, so no streak line):
// Cup of IQ · Puzzle  Day 98 · 💯 Sunday special
// The 1% question got me — waitlisted
// Princeton has put you on the waitlist. 😅
// https://cupofiq.com/puzzle
```

Same mechanism as the toddler game: `navigator.share()` when available,
clipboard + toast fallback, always-visible Copy button. No PII beyond what
the player appends themselves.

## 11. Content Validation (build-time test)

Mirrors the toddler project's content test pattern:

- Every puzzle: unique `id`, non-empty `explanation`, `answerFormat` is
  `multipleChoice` with exactly one correct choice (MVP is multiple-choice
  only, sign-off #22), `difficulty` and `category` within the enum (CNT-2).
- `content/puzzles.json` has non-empty `easy`, `medium`, and `hard` pools —
  every Mon–Sat draws from all three now, so an empty or thin pool in any one
  of them breaks that day's round, not just a rare randomized pick (PZL-2).
- `easy`, `medium`, `hard`, and `1percent` pool lengths are **not multiples
  of 7** (sign-offs #21/#23): Sundays skip the first three pools and the
  Sunday-only `1percent` pool steps by 7, so a multiple-of-7 length leaves
  part of a pool unreachable.
- `content/puzzles-1percent.json` entries are all `difficulty: "1percent"`
  and don't appear in the regular pools.
- `content/schools.json` has all five tiers — `tier1`..`tier4`, `fail` —
  each non-empty. *(Revised 2026-09-23: no separate `sundayFail` pool
  anymore — Waitlisted reuses `tier1`, TMR-3a.)*
- *(Should-have, not launch-blocking, CNT-3)* Where feasible, an automated
  arithmetic check for math-flavored puzzles — the sample doc's own
  "Movie Theater" question needed hand-correcting, which is exactly the
  class of bug this would catch for free going forward.

## 12. Code-Sharing Boundary & Test Strategy (new, 2026-08-15)

This section exists because "how tightly should the two modes couple?"
turned out to need a real answer, not just NFR-S5's one-liner. Short
version: **share a small number of genuinely-identical pure functions;
share nothing about rendering, state, or content shape.** Longer version
below, including why this is also the right call for regression safety,
which was the actual thing motivating the question.

### The shape argument

The two modes aren't just reskins of each other — they have different
interaction shapes. Toddler mode is a real-time tap loop with animated
board state, a seeded shuffle, audio, no timer, and replay support. Puzzle
mode is a single select-then-confirm decision, a silent timer, and a
reveal→results sequence. Trying to share a state machine or a rendering
layer between them would mean bending one mode's natural shape to fit the
other's, or building a generic abstraction neither actually needs — the
exact "build the engine" trap CLAUDE.md already warns against, just
arriving from a different direction (mode count instead of feature count).
*(Note: Puzzle mode's v2 three-question round, §3, is still a single
select-then-confirm decision at the round level — the shape argument holds
unchanged, just "one decision" now covers three answers instead of one.)*

### What's actually identical (worth sharing)

Three things are the *same algorithm*, not just similar-looking code:

- **Date math** — `dayNumber()`, the positive-modulo helper, and the
  mulberry32 PRNG. Both modes need "what day is it, deterministically,
  with a pre-launch clamp" and "a seeded random source." This is pure,
  well-tested-once logic with zero UI attached.
- **Share/clipboard mechanics** — `navigator.share()` → clipboard fallback
  → toast. The *text* each mode builds is entirely different; the
  plumbing that sends it is identical.
- **Safe localStorage read/write** — the try/catch pattern that lets both
  modes degrade gracefully in private browsing (NFR-7/NFR-S4). Not the
  schema — just the "don't throw if storage is unavailable" wrapper.

These move to `src/shared/daily.ts`, `src/shared/share.ts`,
`src/shared/storage.ts`. Everything else — board/puzzle rendering, state
machines, content schemas, progress/streak rules, the banner-tier
algorithm — stays mode-specific, even where the two modes end up with
similarly-*shaped* code (e.g. both have a "results screen" module, but
they don't share one).

### Why less sharing is actually the safer choice for regressions

This is the counter-intuitive part worth stating plainly: **a bigger
shared surface doesn't reduce regression risk, it relocates and
concentrates it.** Every function moved into `shared/` becomes a function
that both modes' test suites must jointly protect forever — a change made
to fix a Puzzle mode bug can silently break the toddler app, and vice
versa, with no compiler error to catch it, only a test (or a real user)
noticing. Keeping the shared surface to exactly three small, pure,
thoroughly-tested modules means:

- The blast radius of "what could a shared-code change break" stays small
  and enumerable — you can name the three files.
- Each mode's own logic (the majority of the code) only needs its own
  tests to reason about, since it doesn't depend on anything the other
  mode is simultaneously changing.
- This is a solo/small-team project — the usual argument *for* heavier
  sharing (avoiding duplicate maintenance across a large team) doesn't
  apply here the way it would at a company. A little duplication between
  two modes maintained by the same person(s) is cheap; a shared abstraction
  that has to serve two different interaction models is not.

### Test suite structure

One `npm test` run, three test populations, same CI gate:

```
src/shared/daily.test.ts     — dayNumber, posMod, mulberry32
src/shared/share.test.ts     — share/clipboard fallback logic
src/shared/storage.test.ts   — safe read/write, private-mode fallback
src/dino/**/*.test.ts        — toddler mode, unchanged
src/puzzle/**/*.test.ts      — puzzle mode, new
```

The practical rule for `tasks.md`: **any PR touching `src/shared/` runs
the full suite, not just the tests for whichever mode motivated the
change**, and gets treated with extra scrutiny regardless of which mode's
work it was filed under. The Phase 0 task that migrates the toddler app's
existing date math into `shared/` is explicitly a refactor of working
code, not new code — it needs the toddler suite green before and after,
same bar as any other change that touches shipped behavior.

---

## Not yet designed (next steps)

- Actual visual layout of the play/results screens (the landing page and
  the pennant banner component are the only pieces mocked up so far)
- Pennant refinements: fringe/tassel detail at the tip, rounded vs. sharp
  corners, size variants for results screen vs. share-image use, and final
  font pick from the Bevan/Alfa Slab One/Playfair Display shortlist (§9)
- Exact confetti/celebration treatment for a Tier-1 or Sunday-accepted result
- Full ranked school-name list finalization (tiers 1-4 + the fail pool),
  each paired with its felt/accent color, plus the distinct muted
  Waitlisted felt treatment (§9) — content-writing task, not a design
  decision
- Per-question breakdown layout on the results screen (RES-1) — three
  prompt/answer/explanation rows plus the round banner; not mocked up yet