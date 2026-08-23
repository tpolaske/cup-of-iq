# Cup of IQ — Puzzle Mode Tasks (v1, 2026-08-15)

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
- [ ] `content/puzzles.json`, `content/puzzles-1percent.json`,
  `content/schools.json`: empty/skeleton structure matching the schema in
  design.md §3/§4, so content-validation tests can run before real content
  exists
- [ ] Vitest config: confirm `src/shared/**/*.test.ts` runs alongside both
  `src/dino/**/*.test.ts` and `src/puzzle/**/*.test.ts` under one `npm test`
  — no separate test command per mode, one green/red signal for the whole
  repo

## Phase 1 — Puzzle Mode MVP

**Logic core (pure, tested first):**

- [ ] `puzzle-daily.ts`: `isSpecialDay`, `pickDifficulty` (weighted PRNG)
  + tests, including a distribution sanity check over many simulated days
  (PZL-2)
- [ ] `puzzle-daily.ts`: `todaysPuzzle` (positive-modulo cycling per pool)
  + determinism tests — same day loaded twice → identical puzzle (PZL-3/4)
- [ ] `banner.ts`: `computeTier` against the time-band table (TMR-1/2) +
  tests for every band boundary, both edges inclusive/exclusive
- [ ] `banner.ts`: `pickSchool` seeded-random determinism test — same
  `dayNumber` → same school every time (TMR-3)
- [ ] `progress.ts`: schema v1 read/write, `accuracyStreak`/`bestStreak`
  rules (STK-1..4), private-mode fallback (NFR-S4)
- [ ] Content-validation test (CNT-2): unique ids, exactly one correct
  choice, non-empty explanations, difficulty/category enums,
  `1percent`-tier puzzles live only in the special pool
- [ ] `content/schools.json` validation: all tiers present (`tier1`..`tier4`,
  `fail`, `sundayFail`), each non-empty

**Screens:**

- [ ] `screens/play.ts` — prompt, choices, select-then-confirm (ANS-3),
  silent timer start/stop wired to `computeTier` input, no visible clock
  anywhere (ANS-2)
- [ ] `screens/reveal.ts` *(new screen, not in the original design)* — full
  pennant + correct/incorrect word only, auto-advance to results after a
  short pause (TMR-5; exact duration still TBD, start around 2s and tune
  by feel)
- [ ] `screens/results.ts` — recap, compact pennant badge + plain
  difficulty word (RES-1/1a), collapsed "Show the trick" (EXP-1), streak +
  tomorrow line (RES-2), share/copy
- [ ] `screens/comeback.ts` — LCK-1 pattern: today's result recap, no
  replay affordance, share controls

**Sharing:**

- [ ] `puzzle/share.ts` — `buildShareText` for regular-day and
  special-day output (design.md §10), using `shared/share.ts` for the
  actual Web Share/clipboard mechanism

**Ship gate:**

- [ ] Perf/privacy pass (NFR-S1/S2) — same bar as the toddler app: no
  analytics, no third-party requests, static files only
- [ ] Manual on-device checklist: does "Show the trick" feel discoverable
  without being pushed on you; does the reveal→results timing feel right;
  does the pennant read clearly at phone width; does an easy-tier puzzle
  ever feel like it needs the (now-hidden) timer back
- [ ] **Full regression pass on both modes** — not just Puzzle mode's new
  tests passing, but the toddler app's existing suite still green after
  the Phase 0 `shared/` extraction. This is the one place a Puzzle-mode
  change could silently break the toddler app; treat any PR touching
  `src/shared/` with extra scrutiny regardless of which mode motivated it.

## Phase 2 — Polish

- [ ] Diagram-renderer library (seating-circle, clock-face, number-tiles,
  logic-grid, dice/cards, simple chart) — per the parking-lot item in
  requirements.md
- [ ] Confetti/celebration treatment for Tier-1 and Sunday-solved results
- [ ] Pennant refinements: fringe/tassel detail, final collegiate-font
  pick (Bevan/Alfa Slab One/Playfair Display shortlist)
- [ ] Full ranked school list + color pairs, all five tiers +
  `sundayFail`, finalized

## Phase 3 — Content pipeline for the long haul

- [ ] Grow `puzzles.json` in batches by category/difficulty, using
  `sample-questions-reference.md` as the tone/calibration guide, not a
  literal source
- [ ] Grow `puzzles-1percent.json` alongside — this pool likely needs the
  highest effort-per-entry, budget accordingly
- [ ] *(Should-have, CNT-3)* Explore automated arithmetic self-checking
  for math-flavored puzzles, to catch the class of bug the sample doc's
  own "Movie Theater" question had
- [ ] Performance metrics page (categories/difficulty breakdown) — parked,
  revisit once enough play history accumulates to make it meaningful
