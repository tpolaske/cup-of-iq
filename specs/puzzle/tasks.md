# Cup of IQ — Puzzle Mode Tasks (v2, 2026-09-23)

Each task = one focused coding session, one PR. Requirement IDs refer to
`specs/puzzle/requirements.md`. Design reference: `specs/puzzle/design.md`.
Mockup reference: `mockups/puzzle/landing-page.html`,
`mockups/puzzle/puzzle-screens.html`.

## Phase −1 — Parent sign-offs (blockers before Phase 1 code)

- [x] All puzzle-mode product decisions resolved through brainstorming —
  see `requirements.md`'s "Resolved" sections (2026-08-14/15). Nothing
  outstanding; remaining work below is build, content, and one open
  architecture question (code-sharing boundary, see design.md and the
  2026-08-15 discussion — resolve before Phase 1 logic-core work starts,
  since it affects where `daily.ts`'s date math actually lives).
- [x] **v2 redesign resolved** (2026-09-23, sign-offs #13–#17): moved from
  one randomized-difficulty puzzle/day to a fixed three-question round
  (easy/medium/hard), new correctness-driven tier algorithm, perfect-day
  streak, Sunday special folded into the round as a binary
  accepted/waitlisted outcome. `requirements.md` and `design.md` are
  updated; task list below reflects v2 throughout. Nothing further to
  decide before continuing Phase 0/1 build work.

## Phase 0 — Foundation shared with the toddler app

- [ ] **Resolve the code-sharing boundary** (design.md, new §12): create
  `src/shared/daily.ts` (dayNumber, posMod, mulberry32), `src/shared/share.ts`
  (Web Share → clipboard mechanism only), `src/shared/storage.ts` (safe
  JSON read/write wrapper for localStorage). Migrate the toddler app's
  existing `daily.ts` date-math to import from `shared/` rather than
  duplicate it — this is a refactor of working code, so it needs the
  toddler test suite green before and after, not just new puzzle tests.
- [ ] Build `src/landing.ts` — root route two-icon chooser (LND-1..3),
  wire to `/dino/` and `/puzzle/`. Reference: `mockups/puzzle/landing-page.html`.
- [ ] Upload `icon-badge.webp` to `mockups/puzzle/` (binary — GitHub web
  UI, connector is text-only)
- [ ] `content/puzzles.json` (with non-empty `easy`/`medium`/`hard` arrays
  — every day now draws from all three at once, §3), `content/puzzles-1percent.json`,
  `content/schools.json` (`tier1`..`tier4`, `fail` — no `sundayFail`, §4):
  empty/skeleton structure matching the schema in design.md §3/§4, so
  content-validation tests can run before real content exists
- [ ] Vitest config: confirm `src/shared/**/*.test.ts` runs alongside both
  `src/dino/**/*.test.ts` and `src/puzzle/**/*.test.ts` under one `npm test`
  — no separate test command per mode, one green/red signal for the whole
  repo

## Phase 1 — Puzzle Mode MVP

**Logic core (pure, tested first):**

- [ ] `puzzle-daily.ts`: `isSpecialDay`, `todaysRound` (three fixed-order
  draws — easy/medium/hard, hard swapped for the `1percent` pool and
  flagged untimed on Sundays) + determinism tests — same day loaded twice
  → identical round, in the same order (PZL-2/3/4)
- [ ] `banner.ts`: `computeWeekdayTier` against the new correctness/total-
  time table (TMR-1) + tests for every branch: 3/3 under/over the time
  cutoff, 2/3 with/without Q3 correct, 1/3, 0/3
- [ ] `banner.ts`: `computeSundayOutcome` — 3/3 → `accepted`, anything else
  → `waitlisted` (TMR-2)
- [ ] `banner.ts`: `pickSchool` seeded-random determinism test — same
  `dayNumber` → same school every time, including that `accepted` and
  `waitlisted` both draw from the `tier1` pool (TMR-3/TMR-3a)
- [ ] `progress.ts`: schema v2 read/write (§5, `questions[]` array +
  `totalSeconds` + `outcome`), perfect-day-only `accuracyStreak`/
  `bestStreak` rules (STK-1..4, no partial-credit carve-out), private-mode
  fallback (NFR-S4)
- [ ] Content-validation test (CNT-2): unique ids, exactly one correct
  choice, non-empty explanations, difficulty/category enums,
  `1percent`-tier puzzles live only in the special pool, and
  `easy`/`medium`/`hard` pools are each non-empty (every day now draws
  from all three)
- [ ] `content/schools.json` validation: all tiers present (`tier1`..`tier4`,
  `fail`), each non-empty — no `sundayFail` pool anymore

**Screens:**

- [ ] `screens/play.ts` — Q1→Q2→Q3 prompt + choice selection within one
  round, per-question silent timer start/stop (skipped for Sunday's Q3),
  no visible clock anywhere (ANS-2), single round-level "Lock it in" shown
  once all three are answered (ANS-3)
- [ ] `screens/reveal.ts` — full pennant + a per-question correct/incorrect
  summary (e.g. three check/x marks) only, auto-advance to results after a
  short pause (TMR-5; exact duration still TBD, start around 2s and tune
  by feel)
- [ ] `screens/results.ts` — **per-question breakdown**: prompt, answer,
  correct/incorrect, difficulty word, collapsed "Show the trick" per
  question (RES-1/1a, EXP-1), plus the round's compact pennant badge,
  streak + tomorrow line (RES-2), share/copy
- [ ] `screens/comeback.ts` — LCK-1 pattern: today's round recap
  (per-question breakdown still visible), no replay affordance, share
  controls

**Sharing:**

- [ ] `puzzle/share.ts` — `buildShareText` for weekday, Sunday-accepted,
  and Sunday-waitlisted output (design.md §10), using `shared/share.ts`
  for the actual Web Share/clipboard mechanism

**Ship gate:**

- [ ] Perf/privacy pass (NFR-S1/S2) — same bar as the toddler app: no
  analytics, no third-party requests, static files only
- [ ] Manual on-device checklist: does "Show the trick" feel discoverable
  without being pushed on you; does the reveal→results timing feel right;
  does the pennant read clearly at phone width; does an easy question ever
  feel like it needs the (now-hidden) timer back; does moving between
  Q1/Q2/Q3 before locking in feel natural, not fiddly; does a Sunday
  Waitlisted result read as "so close," not as a harsh fail
- [ ] **Full regression pass on both modes** — not just Puzzle mode's new
  tests passing, but the toddler app's existing suite still green after
  the Phase 0 `shared/` extraction. This is the one place a Puzzle-mode
  change could silently break the toddler app; treat any PR touching
  `src/shared/` with extra scrutiny regardless of which mode motivated it.

## Phase 2 — Polish

- [ ] Diagram-renderer library (seating-circle, clock-face, number-tiles,
  logic-grid, dice/cards, simple chart) — per the parking-lot item in
  requirements.md
- [ ] Confetti/celebration treatment for Tier-1 and Sunday-accepted results
- [ ] Pennant refinements: fringe/tassel detail, final collegiate-font
  pick (Bevan/Alfa Slab One/Playfair Display shortlist)
- [ ] Full ranked school list + color pairs, all five tiers (`tier1`..
  `tier4`, `fail`) finalized, plus the distinct muted Waitlisted felt
  treatment (design.md §9) — no separate `sundayFail` pool

## Phase 3 — Content pipeline for the long haul

- [ ] Grow `puzzles.json` in batches, keeping `easy`/`medium`/`hard` at
  roughly balanced depth — every day now draws from all three pools at
  once (v2), so an imbalanced pool (e.g. deep `easy`, thin `hard`) causes
  `hard` to repeat far more often than the others. Use
  `sample-questions-reference.md` as the tone/calibration guide, not a
  literal source
- [ ] Grow `puzzles-1percent.json` alongside — this pool feeds Sunday's Q3
  specifically now and likely needs the highest effort-per-entry, budget
  accordingly
- [ ] *(Should-have, CNT-3)* Explore automated arithmetic self-checking
  for math-flavored puzzles, to catch the class of bug the sample doc's
  own "Movie Theater" question had
- [ ] Performance metrics page (categories/difficulty breakdown) — parked,
  revisit once enough play history accumulates to make it meaningful
