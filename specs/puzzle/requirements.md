# Cup of IQ — Puzzle Mode Requirements (v1 draft, 2026-08-14)

*Companion to the existing `requirements.md` (toddler dino mode). Same product,
same repo, same no-backend static-files architecture — a second mode reached
from a shared landing page. Draft synthesized from a brainstorming session;
several items are flagged ⚠️ and need a parent decision before Phase 1 code,
in the same spirit as the dino project's sign-off list.*

## Product Vision

Puzzle mode is a free, ad-free, one-puzzle-a-day brain-health ritual for teens
and adults — the "grown-up" counterpart to the dino counting game, reached
from the same landing page. Where the toddler game is Montessori-gentle and
judgment-free, Puzzle mode is deliberately a little sharper-edged: original
puzzles
in the spirit of *The 1% Club* (deceptively simple, "ohhh!" insight), SAT-style
math reasoning, and Wonderlic-style quick logic — never actual questions from
those copyrighted tests, only the format and flavor. Solve fast and you get a
funny, escalating "which school wants you" banner; solve slow (or wrong) and
you get a joke banner instead. Once a week, a special untimed "1% Club"
puzzle offers a guaranteed shot at the top tier if you get it right. A
Wordle-style accuracy streak keeps the ritual sticky. No accounts, no
backend, no ads, no studying-for-a-test feeling — the goal every day is
"ohhh, that's clever," not "I should review my algebra."

**Disagreements log:** Claude flagged that the "wrong answer" school tier
uses real universities as a running joke (well-worn genre, low legal/ethical
risk for a private app, but worth naming) — parent confirmed keeping real
schools throughout, including the fail tier, as-is (2026-08-14). Claude
proposed scaling speed thresholds per-question (`parSeconds` per puzzle);
parent chose a simpler shared per-difficulty time-band table instead — less
content overhead, easier to tune globally. Visual diagrams (seating circles,
clocks, logic grids) were considered for MVP and deferred to Phase 2 in
favor of a text-only launch.

---

## Decisions — ✅ signed off in brainstorming (2026-08-14)

1. **Landing page split.** One repo/domain; root route becomes a two-icon
   mode chooser (toddler vs. Puzzle), per the routing seam already planned in
   the toddler project's design.md §10.
2. **Puzzle categories (3, MVP):** Brain Teaser / Insight (1% Club-style),
   Verbal Reasoning (SAT-style), Numeric/Logic (Wonderlic-style). All
   **originally written** — no real SAT, Wonderlic, or 1% Club show
   questions are used or closely mimicked.
3. **Answer format follows category** — multiple-choice for verbal/numeric,
   free-text-with-fuzzy-match permitted for insight riddles where a
   multiple-choice would give away the trick.
4. **One puzzle per day**, difficulty-tiered (easy / medium / hard), chosen
   deterministically by date — same DPS-style architecture as the dino game.
5. **Difficulty is randomized day-to-day** (not escalating through the
   week) — deterministic per device via a seeded PRNG, not truly random.
6. **Weekly "1% Club" special**, one fixed day a week, drawn from its own
   content pool, **timer off**. Correct answer = automatic top-tier banner.
7. **Difficulty badge is author-estimated**, never a live/global stat — the
   product has no backend to measure real solve rates (same reasoning as
   NFR-3/NFR-5 in the toddler spec).
8. **Speed-tiered "school" banner**, 4 correct-answer tiers + 1 fail tier,
   time bands scaled per difficulty (table in §4). Banner school is
   **randomly selected within the earned tier**, not fixed per tier.
9. **Streak is accuracy-based** (Wordle-style): breaks on a wrong answer.
10. **Explanations always shown** on the results screen, right or wrong —
    the material teaches, it doesn't just grade.
11. **One attempt per puzzle per day** (assumed — see ⚠️ open item #1 below;
    follows from the timer/banner mechanic, needs explicit confirmation).
12. **Visuals (diagrams) deferred to Phase 2.** MVP ships text-only
    questions; a reusable diagram-renderer library (seating-circle,
    clock-face, number-tiles, logic-grid, etc.) is scoped as future work
    rather than one-off hand-drawn SVGs per question.

### ✅ Resolved (2026-08-14)

1. **One attempt per puzzle, no retries — confirmed.**
2. **Weekly 1% Club special lands on Sunday — confirmed.**
3. **Interaction pattern: select-then-confirm ("Lock it in" button) —
   decided.** Reasoning: since attempts are one-shot (#1), protecting
   against a fat-finger costing the whole day's attempt outweighs the extra
   tap. Instant-lock would fit a retry-friendly game better; it doesn't fit
   this one.

### ✅ Resolved (2026-08-14, continued)

4. **Difficulty weighting: weighted toward easy**, keeps the daily puzzle
   approachable most of the time; medium/hard show up less often.
5. **1% Club wrong-answer treatment: a separate, gentler fail pool**,
   distinct from the regular weekday miss — an untimed swing-and-miss at the
   week's hardest puzzle gets softer copy than a rushed timed miss.
6. **Mode-chooser icons: stacked counting blocks (1/2/3) for toddler mode,
   graduation cap for Puzzle mode.** Landed here after visually comparing
   several directions (egg+footprint, plush dino, single footprint, crayon
   mid-drawing-a-numeral) — see LND-1 for the final call and reasoning.
7. **School list tone: keep real universities throughout, including the
   fail tier — confirmed as-is.**

All seven open items are now resolved. Two more small landing-page
decisions were made during visual iteration and are captured in §10: the
page carries **no visible text at all** except the numerals on the counting
blocks themselves (LND-1a), and the **chooser always shows on load** — no
"remember last mode" persistence (LND-3).

Remaining work is design (§ below) and content authoring, not further
product decisions.

---

## 1. Daily Puzzle Selection (PZL)

- **PZL-1** WHEN the page loads, THE SYSTEM SHALL compute `dayNumber` using
  the identical local-midnight algorithm as the toddler mode (`daily.ts`,
  shared/reused function), including the pre-launch clamp to Day 1.
- **PZL-2** WHEN `dayNumber` is computed, THE SYSTEM SHALL derive the
  device-local day-of-week. IF it is Sunday, THE SYSTEM SHALL select today's
  puzzle from `content/puzzles-1percent.json`; OTHERWISE it SHALL select a
  difficulty tier via a seeded PRNG (`difficultySeed(dayNumber)`, mulberry32)
  weighted toward easy — draft split **easy 50% / medium 35% / hard 15%**
  (provisional, like the time bands in §4; tune after real play).
- **PZL-3** WHEN a difficulty tier is chosen, THE SYSTEM SHALL select that
  day's puzzle as `pool[(dayNumber) % pool.length]` from the matching tier's
  array in `content/puzzles.json`, using a positive-modulo helper (same
  pattern as `todaysDino`). Small pools repeating on a cycle is accepted,
  same as the dino roster.
- **PZL-4** WHEN the same day is loaded twice, THE SYSTEM SHALL produce an
  identical puzzle, difficulty, and (if applicable) special-day status —
  same determinism guarantee as DPS-4.
- **PZL-5** THE SYSTEM SHALL make zero network requests; puzzle selection is
  fully determined by the date and files in the repo.

## 2. Content Schema (CNT)

**Reference:** `sample-questions-reference.md` (saved alongside this doc) —
the parent's original question-design brief, with the 5-tier difficulty
ladder (Easy → Medium-Easy → Medium-Hard → Hard → 1% Club), worked examples
for each tier, the "make it visual" principle (informs the Phase 2 diagram
work), and the category mix in §7 (Brain Teasers / Clever Math / SAT-Style /
Wonderlic-Style / 1% Club). Treat it as the tone/shape/difficulty-calibration
reference for writing new puzzles — not a literal source to copy from
verbatim, since even the sample questions in it are originals meant to be
rewritten fresh for each real entry, not reused as-is indefinitely.

- **CNT-1** Each puzzle entry SHALL include: `id`, `category`
  (`brain-teaser` | `clever-math` | `sat-style` | `wonderlic-style`),
  `difficulty` (`easy` | `medium` | `hard` | `1percent`), `prompt`,
  `answerFormat` (`multipleChoice` | `freeText`), the correct answer
  (`choices[]` + `correctIndex` for multiple-choice, or `answer` +
  `acceptedAlternates[]` for free-text), and `explanation`.
- **CNT-2** THE SYSTEM SHALL validate content at build/test time (Vitest, same
  pattern as the dino content test): unique ids, exactly one correct choice
  per multiple-choice question, non-empty explanation, `difficulty` and
  `category` within the enum, every `1percent`-tier puzzle living in the
  dedicated special pool.
- **CNT-3** *(should-have, not launch-blocking)* WHERE a puzzle's answer is
  independently computable (arithmetic word problems), content authoring
  SHOULD include enough structure for an automated check to catch
  answer/explanation mismatches before they ship — the kind of error a
  human reviewer can miss (see Disagreements log precedent: an early sample
  question's arithmetic didn't actually work out and needed correcting by
  hand).

## 3. Answer Flow (ANS)

- **ANS-1** THE SYSTEM SHALL allow exactly one attempt per puzzle per day
  (confirmed 2026-08-14); once an answer is locked in, THE SYSTEM SHALL show
  results immediately and SHALL NOT allow changing the answer.
- **ANS-2** *(revised 2026-08-15 — was: visible stopwatch on regular days,
  hidden on special days)* THE SYSTEM SHALL track elapsed time silently on
  every puzzle, every day, including the weekly special — but SHALL NEVER
  display a running clock, countdown, or numeric timer anywhere in the
  play or reveal UI. The timing exists only to compute the banner tier
  (§4); showing it was found to add test-taking pressure that worked
  against the "this should be fun" goal. Difficulty context (not raw time)
  may appear on the results screen only, after the fact (RES-1a).
- **ANS-3** THE SYSTEM SHALL require the player to select an answer and then
  separately confirm ("Lock it in") before submitting (confirmed
  2026-08-14), to avoid an accidental tap consuming the day's one attempt.
- **ANS-4** *(revised 2026-08-15)* THE SYSTEM SHALL stop the silent timer at
  the moment of confirmation, not at selection — same instant as before,
  just no visible readout tied to it.

## 4. Timing & Banner Tiers (TMR)

- **TMR-1** THE SYSTEM SHALL evaluate correct-answer speed against a
  per-difficulty time-band table (draft values below; explicitly provisional,
  expect to retune after real play — same spirit as the toddler game's
  animation timings):

| Difficulty | Tier 1 (top) | Tier 2 | Tier 3 | Tier 4 (slow) |
|---|---|---|---|---|
| Easy | 0–5s | 5–15s | 15–20s | 20s+ |
| Medium | 0–10s | 10–30s | 30–40s | 40s+ |
| Hard | 0–15s | 15–45s | 45–60s | 60s+ |
| 1% Club | untimed — correct = automatic Tier 1 | — | — | — |

- **TMR-2** WHEN the answer is incorrect, THE SYSTEM SHALL assign the Fail
  tier regardless of time elapsed.
- **TMR-3** WHEN a tier is assigned, THE SYSTEM SHALL randomly select one
  school name from that tier's pool (below) using a seeded random draw, and
  SHALL persist the chosen school in `lastPlayed` at the moment of
  completion — it SHALL NOT be re-rolled on subsequent views of the same
  day's results (preserves the same-day-same-result invariant, PZL-4).

| Tier | Schools |
|---|---|
| 1 (top) | Harvard, Stanford, Princeton, MIT, Yale |
| 2 | Brown, Northwestern, Vanderbilt, Notre Dame, USC |
| 3 | Michigan, Florida, Tulane, UNC, Villanova |
| 4 (slow) | Providence, UConn, Fairfield, Pepperdine |
| Fail | Coastal Carolina, Central Connecticut State, Cape Cod CC, Arizona State, Ole Miss |

- **TMR-4** THE SYSTEM SHALL display the banner as a short, warm line (e.g.
  "Yale is calling. 🎓") rather than a bare school name, so a Fail-tier
  result reads as a joke, not an insult.
- **TMR-5** *(new 2026-08-15)* WHEN an answer is confirmed (ANS-3), THE
  SYSTEM SHALL first show a brief, standalone **reveal** screen — the
  pennant (full size) plus a short correct/incorrect word, and nothing
  else: no tier name, no school subtitle beyond the pennant's own text, no
  numeric time. THE SYSTEM SHALL auto-advance from reveal to the results
  screen after a short pause (exact duration TBD in design, expect shorter
  than the toddler game's 4–8s hatch celebration since there's no
  dance/confetti sequence to run — a quieter moment). The fuller context
  (tier-appropriate difficulty word, compact pennant badge, explanation)
  lives on the results screen that follows, not on reveal itself — see
  RES-1a.

## 5. Explanations & Feedback (EXP)

- **EXP-1** *(revised 2026-08-15 — was: always displayed)* THE SYSTEM SHALL
  make the puzzle's explanation available on the results screen via a
  single tap ("Show the trick"), collapsed by default rather than
  force-expanded. The explanation is never gated behind anything more
  costly than one tap (no re-solving, no ads, no delay) — this is a
  decluttering change, not a reduction in how accessible the learning
  content is.
- **EXP-2** THE explanation SHALL be framed as revealing the "aha" — the
  clever reasoning, not a correction of the player.
- **EXP-3** *(Phase 2)* WHERE a puzzle has an associated diagram, the
  explanation SHALL reuse it to illustrate the reasoning visually.

## 6. Results & Sharing (RES / SHR)

- **RES-1** *(revised 2026-08-15)* WHEN the results screen renders, THE
  SYSTEM SHALL show: the puzzle prompt, the player's answer,
  correct/incorrect status, a **compact pennant badge** (small pennant icon
  + school name + short line, e.g. "Nice work" — not the full-size pennant,
  which is reserved for the reveal moment per TMR-5), the explanation
  (collapsed by default, EXP-1), and current accuracy streak. Raw elapsed
  time is never shown (ANS-2).
- **RES-1a** *(new 2026-08-15)* THE SYSTEM SHALL show a short, plain
  difficulty word near the pennant badge (e.g. "Medium puzzle") — context,
  not a mechanic explainer. THE SYSTEM SHALL NOT state the actual time
  thresholds (no "under 10s gets top tier" language) — keeping the exact
  banner mechanic a little mysterious was judged more fun than fully
  transparent.
- **RES-2** WHEN the results screen renders, THE SYSTEM SHALL also show a
  short, permanent line pairing the once-a-day cadence with the streak —
  e.g. "🔥 New puzzle tomorrow — keep the streak going." Always shown, not
  first-time-only; no dismiss action, no extra localStorage state. Mirrors
  the equivalent decision for the toddler mode (see
  `toddler-results-clarity-addendum.md`, SHR-7) — kept consistent across
  both modes since a parent may use both, even though Puzzle mode's adult
  audience needs the reminder less (the daily-puzzle genre is already
  familiar from Wordle-adjacent games). Cheap to include since the streak
  it's paired with is already rendered per RES-1.
- **SHR-1** WHEN the share button is tapped, THE SYSTEM SHALL build
  plain-text share content including: product name, day number, category,
  correct/incorrect + time (or "1% Club — solved it" for the special), the
  school banner line, current streak, and https://cupofiq.com/puzzle.
  Mechanism (Web Share API → clipboard fallback) matches SHR-3/SHR-4 in the
  toddler spec.
- **SHR-2** Share text SHALL contain no PII beyond what the player chooses
  to add themselves.

## 7. Once-a-Day Lock (LCK)

- **LCK-1** WHEN today's puzzle has already been completed on this device,
  THE SYSTEM SHALL show a come-back card instead of the puzzle: today's
  result (correct/incorrect, banner, explanation still visible), a "new
  puzzle tomorrow" message, and share/copy controls — same pattern as the
  toddler mode's comeback card (LCK-1..4 in requirements.md).
- **LCK-2** In-progress state (selected-but-not-locked-in answer, running
  timer) SHALL NOT persist across reload; a reload before confirming
  restarts that day's timer from zero. This SHALL NOT count as a completed
  attempt.

## 8. Streaks (STK)

- **STK-1** WHEN a round completes correctly, THE SYSTEM SHALL increment
  `accuracyStreak`.
- **STK-2** WHEN a round completes incorrectly, THE SYSTEM SHALL reset
  `accuracyStreak` to 0.
- **STK-3** THE SYSTEM SHALL separately track `bestStreak`, which SHALL
  never decrease.
- **STK-4** THE current streak SHALL be shown on the results screen and
  included in share text (STK-2's reset means a broken-streak share simply
  omits or shows "streak: 0" rather than hiding the stat).

## 9. Weekly "1% Club" Special (WKS)

- **WKS-1** THE SYSTEM SHALL designate **Sunday** (device-local, confirmed
  2026-08-14) as the 1% Club day.
- **WKS-2** On that day, THE SYSTEM SHALL select the puzzle from
  `content/puzzles-1percent.json` using the same positive-modulo cycling as
  PZL-3, and SHALL display no timer (ANS-2).
- **WKS-3** WHEN the 1% Club answer is correct, THE SYSTEM SHALL assign
  Tier 1 automatically, regardless of how long it took.
- **WKS-4** WHEN the 1% Club answer is incorrect, THE SYSTEM SHALL assign a
  dedicated **Sunday Fail** tier — a separate, gentler pool from the regular
  weekday Fail tier (TMR-3), reflecting that an untimed miss on the week's
  hardest puzzle deserves softer treatment than a rushed weekday miss.
  Content for this pool (school names + copy tone) is a content-writing task,
  not a further product decision.

## 10. Landing Page / Mode Chooser (LND)

- **LND-1** THE root route SHALL present two large, icon-based options with
  no text-only fallback required to understand them: **stacked counting
  blocks (numerals 1/2/3 visible on the blocks) for toddler mode, a
  graduation cap for Puzzle mode** (finalized 2026-08-14, after visual
  iteration — superseds the earlier egg/footprint and dino-plush drafts).
  A small cup-icon mark (cropped from the Cup of IQ logo, no wordmark) sits
  in the corner as a persistent brand anchor.
- **LND-1a** Other than the numerals appearing as part of the counting-block
  icon itself (they're the *content* being illustrated, not a text label),
  THE root route SHALL contain no visible words — no heading, no tagline,
  no button captions. Accessible names for screen readers are still
  required (`aria-label` on each button) even though nothing is visually
  rendered as text.
- **LND-2** THE SYSTEM SHALL NOT gate mode selection behind an age input,
  login, or verification of any kind — pure self-select, consistent with
  NFR-3/NFR-5 (no accounts, no data collection) in the toddler spec.
- **LND-3** THE chooser SHALL be shown every time the root route loads —
  confirmed 2026-08-14. No "remember last mode" persistence; every visit to
  cupofiq.com starts at the two-icon chooser, regardless of device or
  history.

## 11. Non-Functional (NFR)

Puzzle mode inherits the toddler project's non-functional constraints
directly — same repo, same principles, same architecture:

- **NFR-S1** No backend, no database, no accounts, no analytics, no
  third-party scripts, no cookies (mirrors NFR-3/NFR-5).
- **NFR-S2** Static files only, deployed via the existing GitHub Pages
  pipeline; recurring cost stays the domain only (mirrors NFR-4).
- **NFR-S3** Adding a new puzzle SHALL require appending one JSON entry —
  no code change (mirrors NFR-6).
- **NFR-S4** WHEN localStorage is unavailable (private browsing), THE
  SYSTEM SHALL still run today's puzzle normally, with no lock and no
  streak persistence (mirrors NFR-7).
- **NFR-S5** Shared modules (`daily.ts`'s date math, `share.ts`'s
  share/clipboard logic, `progress.ts`'s localStorage patterns) SHOULD be
  reused or lightly generalized rather than reimplemented — but genuinely
  mode-specific logic (banner tiers, puzzle rendering) stays separate.
  Same "extract only when truly shared, no generic engine" discipline as
  design.md §10.

---

## Not yet scoped (parking lot)

- Visual diagram renderer library (seating-circle, clock-face, number-tiles,
  logic-grid, dice/cards, simple chart) — Phase 2, per decision #12.
- Automated arithmetic self-check tooling for math questions (CNT-3) —
  nice-to-have, not launch-blocking.
- Larger puzzle bank / community or licensed sourcing beyond hand-written
  originals — revisit once the hand-written pace is understood, same as the
  dino art pipeline's Phase 4.
- Full ranked school list bike-shedding (which specific schools land in
  which tier) — quick fun pass, not a structural decision.
- **Performance metrics page** (new 2026-08-15): a stats view showing which
  categories (brain-teaser / clever-math / sat-style / wonderlic-style) and
  difficulty tiers a player performs best/worst on. Genuinely useful and a
  natural fit once enough history accumulates in `progress.ts`'s local
  data, but adds real scope (a new screen, richer localStorage schema
  beyond the current single `lastPlayed` snapshot) — deliberately deferred
  rather than designed now, same "don't build ahead of need" instinct as
  the rest of this project.