# Cup of IQ — Puzzle Mode Design (v2 draft, 2026-09-23)

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
covers all three questions at once — the player moves Q1→Q2→Q3 within a
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
export type Slot = 'q1' | 'q2' | 'q3';

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
  timed: boolean; // false only for Sunday's Q3 (ANS-2)
}

// PZL-2/PZL-3: fixed order every day — Q1 easy, Q2 medium, Q3 hard
// (Q3 becomes the 1percent pool, untimed, on Sundays).
export function todaysRound(dayNumber: number, now: Date, content: PuzzleContent): RoundQuestion[] {
  const q1 = content.byDifficulty.easy[posMod(dayNumber, content.byDifficulty.easy.length)];
  const q2 = content.byDifficulty.medium[posMod(dayNumber, content.byDifficulty.medium.length)];
  const sunday = isSpecialDay(now);
  const q3Pool = sunday ? content.onePercent : content.byDifficulty.hard;
  const q3 = q3Pool[posMod(dayNumber, q3Pool.length)];
  return [
    { slot: 'q1', difficulty: 'easy',   puzzle: q1, timed: true },
    { slot: 'q2', difficulty: 'medium', puzzle: q2, timed: true },
    { slot: 'q3', difficulty: sunday ? '1percent' : 'hard', puzzle: q3, timed: !sunday },
  ];
}
```

Same determinism guarantee as the toddler game (PZL-4/DPS-4): same
`dayNumber` + same content files → same three-question round, same
special-question status on Sundays, every time, every device, no network
call. There is no more `pickDifficulty`/weighted-PRNG step — every day
always draws from all three difficulty pools, in the same fixed order.

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
  q3Correct: boolean; // the "hard" slot, or Sunday's untimed special
  totalSeconds: number; // Q1+Q2 elapsed, plus Q3 only when timed (ANS-2)
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

// TMR-2 — Sunday only. Binary: 3/3 (including the untimed special Q3) or
// anything less. No Tier 2/3/4/Fail on Sundays.
export function computeSundayOutcome(r: RoundResult): SundayOutcome {
  return r.q1Correct && r.q2Correct && r.q3Correct ? 'accepted' : 'waitlisted';
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
      { "slot": "q1", "difficulty": "easy",   "puzzleId": "shape-seq-04",     "correct": true,  "seconds": 6 },
      { "slot": "q2", "difficulty": "medium", "puzzleId": "sneaky-discount-01", "correct": true,  "seconds": 11 },
      { "slot": "q3", "difficulty": "hard",   "puzzleId": "seating-logic-02", "correct": false, "seconds": 22 }
    ],
    "totalSeconds": 17,
    "outcome": "tier2",
    "school": "Northwestern"
  }
}
```

On a Sunday, `outcome` is `"accepted"` or `"waitlisted"` instead of a
weekday tier, `questions[2].difficulty` is `"1percent"`, and
`questions[2].seconds` is omitted/ignored (untimed, ANS-2) — `totalSeconds`
reflects Q1+Q2 only that day.

- Lock check (mirrors LCK-1): `lastPlayed.dayNumber === dayNumber(now)`.
- `accuracyStreak` increments only on a perfect result — weekday 3/3 or
  Sunday `"accepted"` — and resets to 0 on anything else, including
  `"waitlisted"` (STK-1/2, no partial-credit carve-out).
- `bestStreak` never decreases (STK-3).
- In-progress state (any selected-but-not-confirmed answers, running
  per-question timers) is never persisted — a same-day reload restarts the
  whole round (and all three timers) from the beginning and does not count
  as an attempt (LCK-2), same accepted-loophole spirit as the toddler
  game's sign-off #9.
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
| `src/puzzle/timer.ts` | Per-question stopwatch: starts on each question's mount (skipped entirely for Sunday's Q3), stops when that question's answer is selected |
| `src/puzzle/share.ts` | `buildShareText(result)`, `share()` — Web Share → clipboard fallback, same pattern as toddler `share.ts` |
| `src/puzzle/screens/play.ts` | Q1→Q2→Q3 prompt + answer selection within one round, round-level "Lock it in" confirm (ANS-3) |
| `src/puzzle/screens/reveal.ts` | Full pennant + per-question correct/incorrect summary, auto-advances to results (TMR-5) |
| `src/puzzle/screens/results.ts` | Per-question breakdown (RES-1), banner, streak, share/copy |
| `src/puzzle/screens/comeback.ts` | Come-back card: today's round recap, "new round tomorrow," share controls |
| `content/puzzles.json` | Regular-day puzzles, keyed by difficulty — every day now draws from all three (`easy`/`medium`/`hard`) at once |
| `content/puzzles-1percent.json` | Sunday Q3 special pool |
| `content/schools.json` | Tier → school name arrays (§4): `tier1`..`tier4`, `fail`. No separate Sunday pool — Waitlisted reuses `tier1` (TMR-3a). |
| `assets/landing/` | `icon-badge.webp` (corner mark), inline SVG for the two mode-chooser icons (no separate files — inlined in `landing.ts` for zero extra requests) |

## 7. Answer Flow — implementation notes

- **Select-then-round-level-confirm (ANS-3, revised 2026-09-23, sign-off
  #14):** tapping a choice on Q1, Q2, or Q3 highlights it but does not
  submit anything; the player can move between all three questions freely
  before locking in. A single "Lock it in" button, shown once all three
  are answered, commits the whole round at once and stops any still-running
  per-question timers. This replaced a per-question confirm specifically
  to avoid leaking Q1's correctness before Q2/Q3 are answered, on top of
  the original fat-finger protection.
- **One attempt per round (ANS-1):** once locked in, the play screen is
  replaced by the reveal moment, then results; there is no path back to
  `answering_round` for that day.
- **Timer: tracked per-question, never shown (ANS-2).** `timer.ts` starts
  a fresh stopwatch when each question mounts and stops it the moment that
  question's answer is selected — no component ever renders any of the
  three readouts. Sunday's Q3 (the special) never starts a timer at all
  and contributes nothing to `totalSeconds` (§4). A visible stopwatch was
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

// Sunday, accepted:
// Cup of IQ · Puzzle  Day 98 · 💯 Sunday special
// 3/3 — accepted!
// Yale is calling. 🎓
// 🔥 5-day streak
// https://cupofiq.com/puzzle

// Sunday, waitlisted:
// Cup of IQ · Puzzle  Day 98 · 💯 Sunday special
// 2/3 — so close
// Princeton has put you on the waitlist. 😅
// 🔥 0-day streak
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
- `content/puzzles.json` has non-empty `easy`, `medium`, and `hard` pools —
  every day draws from all three now, so an empty or thin pool in any one
  of them breaks that day's round, not just a rare randomized pick (PZL-2).
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