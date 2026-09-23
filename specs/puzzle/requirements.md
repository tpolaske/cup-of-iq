# Cup of IQ — Puzzle Mode Requirements (v2 draft, 2026-09-23)

*Companion to the existing `requirements.md` (toddler dino mode). Same product,
same repo, same no-backend static-files architecture — a second mode reached
from a shared landing page. Draft synthesized from a brainstorming session;
several items are flagged ⚠️ and need a parent decision before Phase 1 code,
in the same spirit as the dino project's sign-off list.*

## Product Vision

Puzzle mode is a free, ad-free, daily brain-health ritual for teens and
adults — the "grown-up" counterpart to the dino counting game, reached from
the same landing page. Where the toddler game is Montessori-gentle and
judgment-free, Puzzle mode is deliberately a little sharper-edged: original
puzzles
in the spirit of *The 1% Club* (deceptively simple, "ohhh!" insight), SAT-style
math reasoning, and Wonderlic-style quick logic — never actual questions from
those copyrighted tests, only the format and flavor. **As of v2, each day is a
three-question round** — one easy, one medium, one hard, in that fixed order —
answered and locked in together, then revealed all at once against a
"which school wants you" banner. Solve the round well and fast and you get a
funny, escalating banner; solve slowly, partially, or wrong and you get a
gentler (or jokier) one instead. Every Sunday, the hard slot becomes a
special, untimed, extra-tricky question with its own binary outcome —
acceptance or waitlist. A Wordle-style perfect-day streak keeps the ritual
sticky. No accounts, no backend, no ads, no studying-for-a-test feeling —
the goal every day is "ohhh, that's clever," not "I should review my
algebra."

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

### ✅ Resolved (2026-09-23 — v2: three-question daily round)

13. **Three-question fixed-order round (supersedes #4, #5).** Puzzle mode
    moves from one randomized-difficulty puzzle/day to three questions/day in
    a fixed order — Q1 easy, Q2 medium, Q3 hard — every day. No more
    per-day randomized single-tier selection; content authoring instead
    needs roughly balanced-depth pools across all three difficulties
    simultaneously, since every day draws from all three at once.
14. **Single end-of-round lock-in (refines #3 / ANS-3).** All three answers
    are selected first; one "Lock it in" confirms the whole round at once,
    not per-question — keeps the one-shot-attempt spirit of #3/#11 without
    three separate confirms, and avoids an early question's result leaking
    before the later ones are answered.
15. **New tier algorithm (supersedes #8 / TMR-1).** Correctness now drives
    the tier, with total time as a tiebreaker only at 3/3, and the hard (Q3)
    question weighted more heavily than a straight fraction would give it.
    Full table in §4 (revised TMR-1/TMR-2).
16. **Streak = perfect-day only (revises #9 / STK-1/STK-2).** The accuracy
    streak now increments only on a true 3/3 day (including a 3/3 Sunday);
    anything less — including a Sunday Waitlist outcome — resets it to 0.
    `bestStreak` is unaffected either way.
17. **Sunday special folded into the round (supersedes #6, WKS-1–4).** The
    weekly special is no longer a standalone puzzle/page. Instead, Sunday's
    Q3 slot becomes an extra-hard, untimed, 1%-Club-style question; Q1/Q2
    stay timed as normal. The outcome is binary rather than tiered: 3/3 =
    automatic Tier 1 ("acceptance"); anything less than 3/3 = **Waitlisted**,
    drawn from the existing Tier-1 school pool for the "so close" joke
    (e.g. "Princeton has put you on the waitlist 😅"). There is no
    Tier 2/3/4/Fail breakdown on Sundays, and the old WKS-4 "separate
    gentler fail pool" concept is retired — Waitlisted is the only
    non-acceptance outcome, and it breaks the streak like any other
    non-perfect day (no special carve-out).

---

## 1. Daily Puzzle Selection (PZL)

- **PZL-1** WHEN the page loads, THE SYSTEM SHALL compute `dayNumber` using
  the identical local-midnight algorithm as the toddler mode (`daily.ts`,
  shared/reused function), including the pre-launch clamp to Day 1.
- **PZL-2** *(revised 2026-09-23, sign-off #13)* WHEN `dayNumber` is
  computed, THE SYSTEM SHALL build today's round as exactly three
  questions in a fixed order: Q1 from the `easy` pool, Q2 from the `medium`
  pool, Q3 from the `hard` pool — each drawn as
  `pool[dayNumber % pool.length]` from `content/puzzles.json`, using a
  positive-modulo helper (same pattern as `todaysDino`). There is no
  per-day randomized difficulty-tier selection; every day always has all
  three difficulties present. Small pools repeating on a cycle is accepted,
  same as the dino roster.
- **PZL-3** *(revised 2026-09-23, sign-off #17)* WHEN `dayNumber` is
  computed, THE SYSTEM SHALL derive the device-local day-of-week. IF it is
  Sunday, THE SYSTEM SHALL draw Q3 from `content/puzzles-1percent.json`
  (same positive-modulo cycling) instead of the regular `hard` pool, and
  SHALL flag that question as untimed (see ANS-2, TMR §4). Q1 and Q2 are
  drawn from the regular `easy`/`medium` pools as on any other day.
- **PZL-4** WHEN the same day is loaded twice, THE SYSTEM SHALL produce an
  identical round (all three questions, in the same order), and, on
  Sundays, identical special-question status — same determinism guarantee
  as DPS-4.
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

### Question Spectrum (guide)

A quick-reference spectrum for the tone and shape of each category, roughly
ordered from most straightforward to most deceptive:

🟢 **Quick Brain Teasers**
→ pattern recognition, simple logic

🔵 **Clever Math**
→ percentages, ratios, rates, equations

🟣 **SAT-style Reasoning**
→ algebra, functions, data analysis, geometry

🟠 **Logic/Puzzle**
→ deduction, ordering, probability

🔴 **1% Club**
→ deceptively simple questions where the way you think about the problem is
the challenge

⚫ **Developer Logic**
→ algorithms, debugging, data structures, systems thinking — no code
required, but developers have an edge

> **Open question:** this spectrum doesn't map 1:1 onto the `category` enum in
> CNT-1 below (`wonderlic-style` vs. `Logic/Puzzle`; `1% Club` shown here as a
> category rather than only a difficulty tier; `Developer Logic` isn't in the
> enum at all yet). Reconcile before this becomes the literal schema — see
> disagreements log / needs a sign-off.

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

- **ANS-1** *(revised 2026-09-23, sign-off #14)* THE SYSTEM SHALL allow
  exactly one attempt per round per day; once the round is locked in, THE
  SYSTEM SHALL show results immediately and SHALL NOT allow changing any of
  the three answers.
- **ANS-2** *(revised 2026-09-23)* THE SYSTEM SHALL track elapsed time
  silently for each question, every day — but SHALL NEVER display a
  running clock, countdown, or numeric timer anywhere in the play or reveal
  UI. On Sundays, Q3 (the special question, PZL-3) is untimed: THE SYSTEM
  SHALL NOT start or accumulate a timer for that question, and it
  contributes nothing to the total-time check in TMR-1. Timing exists only
  to compute the banner tier (§4); showing it was found to add
  test-taking pressure that worked against the "this should be fun" goal.
  Difficulty context (not raw time) may appear on the results screen only,
  after the fact (RES-1a).
- **ANS-3** *(revised 2026-09-23, sign-off #14)* THE SYSTEM SHALL require
  the player to answer all three questions and then separately confirm
  ("Lock it in") once for the whole round before submitting — not a
  per-question confirm — to avoid an accidental tap consuming the day's
  one attempt, and to avoid revealing an early question's correctness
  before the later two are answered.
- **ANS-4** THE SYSTEM SHALL stop each question's silent timer the moment
  that question's answer is selected (or, on Sunday's untimed Q3, not run
  a timer at all) — the round-level "Lock it in" tap does not retroactively
  extend any individual question's elapsed time.

## 4. Correctness & Banner Tiers (TMR)

*Rewritten 2026-09-23 (sign-off #15/#17) — supersedes the v1 per-difficulty
speed-band design entirely. Weekdays now key primarily off how many of the
three questions were correct, with total time as a 3/3 tiebreaker and Q3
(the hard question) weighted more than a straight fraction; Sunday collapses
to a binary acceptance/waitlist outcome. §5's "school pools" table is
unchanged and still shared by both paths.*

- **TMR-1** *(Mon–Sat)* WHEN a round is locked in on a non-Sunday, THE
  SYSTEM SHALL assign the banner tier as follows (values provisional,
  expect to retune after real play — same spirit as the toddler game's
  animation timings):

| Result | Tier |
|---|---|
| 3/3 correct, total time (Q1+Q2+Q3) ≤ 30s | **Tier 1** |
| 3/3 correct, total time > 30s | Tier 2 |
| 2/3 correct, Q3 (hard) among the correct answers | Tier 2 |
| 2/3 correct, Q3 missed | Tier 3 |
| 1/3 correct | Tier 4 |
| 0/3 correct | Fail |

- **TMR-2** *(Sunday — sign-off #17)* WHEN a round is locked in on a
  Sunday, THE SYSTEM SHALL ignore the Mon–Sat table above entirely and
  assign a binary outcome instead: 3/3 correct (including the untimed
  special Q3, ANS-2) SHALL yield **Tier 1 ("acceptance")**; any other
  result (0, 1, or 2 correct) SHALL yield **Waitlisted**, a distinct
  non-tiered outcome. There is no Sunday Tier 2/3/4/Fail.
- **TMR-3** WHEN a Mon–Sat tier (Tier 1–4 or Fail) is assigned, THE SYSTEM
  SHALL randomly select one school name from that tier's pool (§ below)
  using a seeded random draw, and SHALL persist the chosen school in
  `lastPlayed` at the moment of completion — it SHALL NOT be re-rolled on
  subsequent views of the same day's results (preserves the
  same-day-same-result invariant, PZL-4).
- **TMR-3a** *(Sunday — sign-off #17)* WHEN the Sunday outcome is
  **Waitlisted**, THE SYSTEM SHALL draw the displayed school from the same
  **Tier 1** pool (§ below) rather than a separate pool, for the "so close"
  joke (e.g. "Princeton has put you on the waitlist 😅"). A Sunday
  **Tier 1 acceptance** also draws from the Tier 1 pool as usual. This
  retires the old WKS-4 "separate gentler fail pool" concept — Waitlisted
  is the only non-acceptance Sunday outcome.

| Tier | Schools |
|---|---|
| 1 (top) | Harvard, Stanford, Princeton, MIT, Yale |
| 2 | Brown, Northwestern, Vanderbilt, Notre Dame, USC |
| 3 | Michigan, Florida, Tulane, UNC, Villanova |
| 4 (slow) | Providence, UConn, Fairfield, Pepperdine |
| Fail | Coastal Carolina, Central Connecticut State, Cape Cod CC, Arizona State, Ole Miss |

- **TMR-4** THE SYSTEM SHALL display the banner as a short, warm line (e.g.
  "Yale is calling. 🎓" / "Princeton has put you on the waitlist 😅")
  rather than a bare school name, so a Fail-tier or Waitlisted result reads
  as a joke, not an insult.
- **TMR-5** WHEN a round is confirmed (ANS-3), THE SYSTEM SHALL first show
  a brief, standalone **reveal** screen — the pennant (full size) plus a
  short per-question correct/incorrect summary (e.g. three check/x marks),
  and nothing else: no tier name, no school subtitle beyond the pennant's
  own text, no numeric time. THE SYSTEM SHALL auto-advance from reveal to
  the results screen after a short pause (exact duration TBD in design,
  expect shorter than the toddler game's 4–8s hatch celebration since
  there's no dance/confetti sequence to run — a quieter moment). The fuller
  context (tier-appropriate difficulty word, compact pennant badge,
  per-question explanations) lives on the results screen that follows, not
  on reveal itself — see RES-1/RES-1a.

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

- **RES-1** *(revised 2026-09-23, sign-off #13/#15)* WHEN the results
  screen renders, THE SYSTEM SHALL show: a **per-question breakdown** for
  all three questions (prompt, the player's answer, correct/incorrect
  status, and an explanation collapsed by default per EXP-1), the round's
  **compact pennant badge** (small pennant icon + school name + short line,
  e.g. "Nice work" — not the full-size pennant, which is reserved for the
  reveal moment per TMR-5), and current (perfect-day) streak. Raw elapsed
  time is never shown (ANS-2) for any question, including the untimed
  Sunday special.
- **RES-1a** THE SYSTEM SHALL show a short, plain difficulty word next to
  each question in the breakdown (e.g. "Medium," "Hard," or, on Sunday,
  something like "Special") — context, not a mechanic explainer. THE
  SYSTEM SHALL NOT state the actual tier rule (no "3/3 under 30s gets top
  tier" language) — keeping the exact banner mechanic a little mysterious
  was judged more fun than fully transparent.
- **RES-2** WHEN the results screen renders, THE SYSTEM SHALL also show a
  short, permanent line pairing the once-a-day cadence with the streak —
  e.g. "🔥 New round tomorrow — keep the streak going." Always shown, not
  first-time-only; no dismiss action, no extra localStorage state. Mirrors
  the equivalent decision for the toddler mode (see
  `toddler-results-clarity-addendum.md`, SHR-7) — kept consistent across
  both modes since a parent may use both, even though Puzzle mode's adult
  audience needs the reminder less (the daily-puzzle genre is already
  familiar from Wordle-adjacent games). Cheap to include since the streak
  it's paired with is already rendered per RES-1.
- **SHR-1** *(revised 2026-09-23)* WHEN the share button is tapped, THE
  SYSTEM SHALL build plain-text share content including: product name, day
  number, score (e.g. "2/3" or, on a Sunday acceptance, "3/3 — accepted!"),
  the school/waitlist banner line, current streak, and
  https://cupofiq.com/puzzle. Mechanism (Web Share API → clipboard
  fallback) matches SHR-3/SHR-4 in the toddler spec.
- **SHR-2** Share text SHALL contain no PII beyond what the player chooses
  to add themselves.

## 7. Once-a-Day Lock (LCK)

- **LCK-1** WHEN today's round has already been completed on this device,
  THE SYSTEM SHALL show a come-back card instead of the round: today's
  result (per-question breakdown, banner, explanations still visible), a
  "new round tomorrow" message, and share/copy controls — same pattern as
  the toddler mode's comeback card (LCK-1..4 in requirements.md).
- **LCK-2** In-progress state (any selected-but-not-locked-in answers,
  running per-question timers) SHALL NOT persist across reload; a reload
  before confirming restarts that day's round (and all three timers) from
  the beginning. This SHALL NOT count as a completed attempt.

## 8. Streaks (STK)

- **STK-1** *(revised 2026-09-23, sign-off #16)* WHEN a round completes
  with a **perfect result** — 3/3 correct on a weekday, or a 3/3 Sunday
  acceptance — THE SYSTEM SHALL increment `accuracyStreak`.
- **STK-2** *(revised 2026-09-23, sign-off #16)* WHEN a round completes
  with any other result — 0/3, 1/3, or 2/3 on a weekday, or a Sunday
  Waitlisted outcome — THE SYSTEM SHALL reset `accuracyStreak` to 0. There
  is no partial-credit carve-out: only a true perfect day keeps the streak
  alive.
- **STK-3** THE SYSTEM SHALL separately track `bestStreak`, which SHALL
  never decrease.
- **STK-4** THE current streak SHALL be shown on the results screen and
  included in share text (STK-2's reset means a broken-streak share simply
  omits or shows "streak: 0" rather than hiding the stat).

## 9. Weekly "1% Club" Special (WKS)

*Rewritten 2026-09-23 (sign-off #17) — the special is no longer a
standalone puzzle/page; it is folded into the regular three-question round
as Sunday's Q3 slot. See PZL-3 (selection), ANS-2 (untimed), and TMR-2/3a
(binary acceptance/waitlist outcome) for the mechanics; this section now
just anchors the day-of-week rule.*

- **WKS-1** THE SYSTEM SHALL designate **Sunday** (device-local) as the
  special day, per PZL-3.
- **WKS-2** *(superseded by TMR-2/TMR-3a)* ~~Standalone 1% Club
  tiering~~ — retired. Sunday's outcome is binary (acceptance/Waitlisted),
  not tiered; see TMR-2.

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
- **NFR-S3** Adding a new puzzle SHALL require appending one JSON entry to
  the relevant difficulty pool — no code change (mirrors NFR-6).
- **NFR-S4** WHEN localStorage is unavailable (private browsing), THE
  SYSTEM SHALL still run today's round normally, with no lock and no
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
