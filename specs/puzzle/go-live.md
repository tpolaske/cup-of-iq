# Cup of IQ — Puzzle Mode Go-Live Checklist

*Created 2026-10-26. The shortest path from today to "puzzle mode is live at
cupofiq.com." This is a **filtered view** of `tasks.md` (Phases 0–1) plus the
decisions and risks that only matter at launch. `tasks.md` stays the full
backlog; when an item here changes status, update both.*

**Status key:** `[x]` done and merged · `[~]` built, awaiting review/merge/manual step · `[ ]` not started

**Go-live definition:** a visitor to `cupofiq.com` sees the two-icon chooser;
`/puzzle/` serves the daily round (Mon–Sat three questions, Sunday one 1% Club
question) with banner, streak, share, and once-a-day lock; `/dino/` still works
exactly as before. All tests green, privacy/perf bar met.

**Launching with the current bank** (decided 2026-10-26): 32 easy / 32 medium /
23 hard / 10 1% Club. Growing toward 71/55/36/10 is post-launch (see §G).

---

## A. Content & assets

- [x] Shared-module extraction — `src/shared/{daily,share,storage}.ts`, toddler suite green before/after (PR #2, merged)
- [~] Question bank → JSON (`content/puzzles.json`, `content/puzzles-1percent.json`) + content-validation test. Branch `phase0-puzzle-content-json`. **Manual step:** upload `puzzles.json` to that branch via the GitHub web UI, then open the PR. Two wrong questions were fixed in conversion (Dinner Party, Movie Theater) — review the Dinner Party rewrite.
- [~] `content/schools.json` first pass — 24 schools from the signed-off table (requirements TMR table) with felt/stitch color pairs, validated for legibility. **Review:** colors are best-effort real school colors; Cape Cod CC's are a placeholder. Full ranked list stays Phase 2.
- [x] `icon-badge.webp` uploaded to `mockups/puzzle/`
- [ ] Production copy of the icon to the landing page's asset path (binary — GitHub web UI)

## B. Puzzle logic — pure, fully unit-tested (`src/puzzle/`)

- [~] `types.ts`, `puzzle-daily.ts` (todaysRound, isSpecialDay, buildContent), `banner.ts` (weekday tier, Sunday outcome, pickSchool, findSchool), `timer.ts` (+ pause-while-hidden) — branch `phase1-puzzle-logic`
- [ ] `progress.ts` — schema v2 (`cupofiq.puzzle.v2`), lock check, perfect-day streak rules (STK-1..5), best streak, v1 drop-migration, private-mode fallback
- [ ] `share.ts` — `buildShareText` for weekday, Sunday accepted, Sunday waitlisted (uses `shared/share.ts`)
- [ ] `puzzle.ts` — state machine `idle → answering_round → locked_in → reveal → results`

## C. Screens & app shell

- [ ] `main.ts` — capture dayNumber / Sunday flag / round once at boot (PZL-6); route to play or come-back
- [ ] `screens/play.ts` — Q1→Q3 with free navigation, editable answers, "Lock it in"; Sunday single question, no timer
- [ ] `screens/reveal.ts` — full pennant + per-question ✓/✗, auto-advance (TMR-5)
- [ ] `screens/results.ts` — per-question breakdown, "Show the trick" explanations, banner, streak, share/copy
- [ ] `screens/comeback.ts` — today's recap, "new round tomorrow", share
- [ ] Pennant renderer (felt look from `content/schools.json` colors; muted treatment for Waitlisted) and puzzle styles

## D. Routing & the toddler move (highest-risk step — do last)

- [ ] `src/landing.ts` — two-icon chooser (LND-1..3), reference `mockups/puzzle/landing-page.html`
- [ ] Vite multi-page config (landing, dino, puzzle); move toddler code into `src/dino/`; keep `CNAME` in `public/`
- [ ] Confirm the GitHub Pages deploy workflow still builds and serves all three pages
- [ ] Toddler suite green before **and** after the move

## E. Launch gates

- [ ] Privacy/perf pass (no analytics, no third-party requests, static only; budgets from NFR-S1/S2)
- [ ] On-device checklist (30 s Tier 1 cutoff feel, "Show the trick" discoverability, reveal timing, pennant legibility at phone width, Waitlisted reads as "so close")
- [ ] Full regression on both modes
- [ ] All content/schools/validation tests green on CI

## F. Spec hygiene (small, but avoids confusion mid-build)

- [ ] `requirements.md` still describes the pre-#23 Sunday (Q1 + Q2 + special Q3, "3/3 correct") and free-text answers in places (PZL-3, ANS-2, TMR-2, WKS). `design.md` and `tasks.md` are already updated for sign-offs #22/#23. Sync requirements to match. **Code follows #23: Sunday = one untimed 1% question.**
- [ ] Check off completed Phase 0 items in `tasks.md`

## G. Post-launch (not blocking)

- Grow the bank: easy 32→71, medium 32→55, hard 23→36 (keep every pool non-multiple-of-7). 1% Club is at target (10); one entry ("Three Ball Boxes") repeats the hard "Three Boxes" trick — consider swapping.
- Phase 2 polish: diagram renderer, confetti for Tier 1 / Sunday accepted, pennant fringe detail, full ranked school list.
- Phase 3: automated arithmetic self-check for math questions (CNT-3) — it would have caught both conversion defects.

---

## Decisions still needed from Tom

1. **Dino share link** — toddler share text currently links the bare `https://cupofiq.com`, which will become the chooser. Point it at `/dino/` or leave it?
2. **Share copy** for a Sunday Waitlisted result and a zero-streak result (STK-4 says show "streak: 0" or omit).
3. **Day counter** — recommendation: leave `LAUNCH_DATE` (Aug 3) alone. Both modes share it; puzzle mode simply starts at whatever day it ships. A reset would restart the dino cycle and renumber its boards.

## Known launch risks

- **Bookmarks / home-screen icon:** anyone who saved `cupofiq.com` for the dino game will land on the chooser after §D. Re-save at `/dino/`.
- **Growing a pool changes future days' questions** (index = day mod pool length). Safe for completed days — `lastPlayed` stores puzzle ids — but expect a one-time reshuffle of upcoming rounds each time a pool grows. Add questions in batches, not daily.
- **Small pools repeat sooner:** hard repeats every 23 days, easy/medium every ~32.
- **Any change to `src/shared/` touches both modes** — review with extra care (design §12).
