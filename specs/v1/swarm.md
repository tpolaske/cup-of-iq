# Cup of IQ — Specification Swarm Review (swarm.md)

*Date: 2026-07-07 · Inputs: CLAUDE.md, requirements.md, design.md, playback.md, tasks.md, domain-research.md · Agents: Product Manager, Staff Architect, CEO · Synthesized by: Project Manager*

---

## Verdict

**APPROVE WITH MINOR CHANGES.** All three agents independently reached the same conclusion: the spec is buildable as written, internally consistent, and unusually disciplined for a solo project. No architectural rework is needed. Four issues should be fixed in the spec before Phase 1 code, and two blockers (domain, launch date) must clear before anything ships.

---

## 1. Product Manager Agent — findings

### Strengths
- The requirements are testable EARS-style statements with stable IDs, and playback.md gives an unambiguous ground truth for "feel" — the state names even match across all documents. Traceability from tasks → requirement IDs is already in place.
- The disagreements log in the Product Vision is a standout practice: it records what was proposed, rejected, and why, which will prevent re-litigating scope in six months.
- Child-facing vs. grown-up-facing surfaces are cleanly separated everywhere (CEL-2, PRG-3, titles), and the "every tier positive" title ladder is well designed.

### Issues
- **PM-1 (Medium) — No grown-ups panel access before the first round.** GRN-1 places the panel entry only on the results screen and the come-back card. On a fresh device, neither exists yet, so a parent cannot set the starting level, mute sound, or read the privacy note before the child's first-ever round. Playback.md confirms the idle screen has "no menu, no banner, no button." **Recommendation:** allow the same 2-second long-press on the "Cup of IQ 🥚 Day N" header on the game screen (invisible to a tapping toddler, discoverable by a parent), or accept the gap explicitly.
- **PM-2 (Medium) — Reload-to-retry undermines level-up integrity.** LCK-4 restarts an in-progress round on reload with wrongTaps reset. Combined with PRG-1 (perfect rounds drive level-up), a parent can refresh mid-round to manufacture perfect days. Since the parent is the only adversary and also the beneficiary, this may be acceptable — but it should be an explicit sign-off (#9), not an accident. Alternative: hold wrongTaps for the day in `sessionStorage` (survives reload, dies with the tab, keeps the "not persisted" spirit).
- **PM-3 (Low) — Content repeat cadence is undecided.** DPS-2's modulo means 30 launch dinos repeat monthly. Likely invisible to a 2.5-year-old, and family-thread shares still differ by day number — but decide it openly (see CEO-2).
- **PM-4 (Low) — Comeback card in private mode.** Under NFR-7 (no localStorage), LCK-1's share controls have no stored result to share. Resolved implicitly — no lock means no comeback card ever shows — but worth one sentence in design.md §5 so nobody "fixes" it later.
- **PM-5 (Info) — Minor inconsistency in design.md §5.** The example state shows `perfectsAtLevel: 2` alongside a `lastPlayed` describing the 3-of-3 level-up morning from playback.md; after that round it would be reset to 0 with `leveledUp: true`. Cosmetic; fix the example.

---

## 2. Staff Architect Agent — findings

### Strengths
- The stack decision (§1) is the right call and, more importantly, is *argued*, with rejected candidates and a documented zero-build escape hatch. The dependency surface (Vite + Vitest, zero runtime deps) matches the 5-year-maintenance goal.
- Pure-function core (`daily.ts`, `progress.ts`) with a thin DOM layer is exactly the shape that keeps this testable without an E2E framework. The seeded mulberry32 + `boardSeed = day*100 + level` design cleanly satisfies DPS-3/DPS-4.
- The "seams, don't build" section (§10) plus CLAUDE.md's "Don't do this" list is strong protection against the most likely failure mode: the maintainer's own future cleverness.

### Issues
- **ARCH-1 (High) — Pre-launch / negative dayNumber is a runtime bug.** If the page is visited before `LAUNCH_DATE` (dev, staging, or a real user finding the DNS early), `dayNumber ≤ 0` and `dinos[(day - 1) % dinos.length]` evaluates a negative index — JS modulo preserves sign — returning `undefined` and breaking the board. **Fix:** clamp in `daily.ts` (`day = Math.max(1, day)` or wrap with a positive-modulo helper `((n % m) + m) % m`) and add a unit test for `now < LAUNCH_DATE`. One line, but it's the kind of bug that ships silently.
- **ARCH-2 (Medium) — NFR-2's 300 KB budget is threatened by the dino PNGs.** A 512 px transparent PNG routinely weighs 100–300 KB alone. **Fix:** specify WebP (with PNG fallback only if needed), set a per-image weight budget (~40–60 KB), and move the image-weight content test from Phase 4 up into Phase 1's content-validation test so the budget is enforced from dino #1.
- **ARCH-3 (Medium) — DST tests will be flaky unless the timezone is pinned.** tasks.md rightly demands DST-boundary tests for `dayNumber`, but CI runs in UTC and dev machines don't. **Fix:** set `TZ=America/New_York` (or matrix a few zones) in the Vitest config / Actions workflow. Also note that `Math.round` over local-midnight diffs is the correct technique for 23/25-hour days — keep it and say why in a comment.
- **ARCH-4 (Low) — Level → number-range mapping is implied, not specified.** Design.md's worked example shuffles `[1..5]`; L2 must shuffle `[6..10]` and L3 `[1..10]`. Trivial, but make `daily.ts` (or `board.ts`) own a `numbersForLevel(level)` function with tests so TAP-1 is pinned down.
- **ARCH-5 (Low) — Deployment details worth pre-deciding.** GitHub Pages + custom domain: commit the `CNAME` file into `public/` so deploys don't drop it; Vite `base` stays `/` with a custom domain. iOS audio requires a user gesture before playback — the first egg tap qualifies, but initialize/unlock audio on that first tap, not on page load.
- **ARCH-6 (Info) — Accepted risks, correctly accepted.** Timezone travel shifting dayNumber, localStorage clearing defeating LCK-1, and no offline support in MVP are all noted or implied and are proportionate for a private family ritual. No action.

---

## 3. CEO Agent — findings

### Strengths
- Vision discipline is exceptional. "Low cost and low maintenance over impressiveness" appears as a decision rule, not a slogan, and it demonstrably shaped the stack, the static OG image call, and the parked SAT/adult modes. The product has a defined *ending* to each session (the comeback card) — rare and correct for a kids' product.
- Zero recurring cost beyond the domain, zero data collection (NFR-3, SHR-5), no third-party scripts: the privacy story is airtight by construction, which also neutralizes COPPA-class concerns since nothing is collected from anyone, let alone children.
- The share text is a genuinely good growth loop for the intended scale (family threads), borrowed from Wordle without the parts that don't fit.

### Issues
- **CEO-1 (Blocker) — The brand rests on an unverified domain.** domain-research.md itself warns DNS checks aren't definitive. Every document, the share text, and the OG tags hardcode cupofiq.com. **Action: verify and purchase on a registrar this week, before any further identity work.** Grab .co/.app defensively only if cheap; skip otherwise — this is a family project, not a startup.
- **CEO-2 (Medium) — Content runway is the real long-term cost.** The scarce resource here isn't hosting, it's parent hours producing ~365 consistent illustrations. Decide now between: (a) launch with 30 and openly accept monthly repeats (a toddler will not mind; novelty can come from batches added over time), or (b) commit to the Phase 4 batch-art pipeline early. Recommendation: (a), with `assets/STYLE.md` written before the *first* image so batch 2 matches batch 1.
- **CEO-3 (Low) — Define what "success" means so the project can end well.** Suggested: the ritual sticks for 30 consecutive mornings and the maintenance burden stays under ~1 hour/month. Writing this down prevents both premature feature-adding and guilt-driven over-investment.
- **CEO-4 (Low) — Launch date is a placeholder in a load-bearing constant.** Sign-off #7 is already flagged; note that changing `LAUNCH_DATE` after launch renumbers every day and reshuffles every board, so it must be final before the first real share goes out.

---

## 4. Project Manager — synthesis

### Consensus
All three agents approve the spec. Nobody proposed adding scope; two agents independently praised the guardrails against it. The spec's weaknesses are edge cases and undecided details, not design flaws.

### Consolidated issue list (by severity)

| # | Severity | Issue | Owner action | Touches |
|---|---|---|---|---|
| 1 | Blocker | Domain unverified/unpurchased | Verify + buy cupofiq.com on a registrar | tasks.md Phase −1 |
| 2 | Blocker | Launch date placeholder | Pick final date; treat as immutable post-launch | Sign-off #7 |
| 3 | High | Negative dayNumber before launch breaks dino lookup | Clamp/positive-modulo in `daily.ts` + test | DPS-1, DPS-2 |
| 4 | Medium | No grown-ups panel access before first round | Add long-press on game-screen header, or sign off the gap | GRN-1 |
| 5 | Medium | Reload resets wrongTaps → level-up integrity | New sign-off #9: accept, or sessionStorage for wrongTaps | LCK-4, PRG-1 |
| 6 | Medium | Dino image weight vs. 300 KB budget | WebP, ~50 KB/image budget, move weight test to Phase 1 | NFR-2 |
| 7 | Medium | DST tests flaky without pinned TZ | Set TZ in Vitest/CI config | DPS-1 tests |
| 8 | Medium | Content repeat cadence undecided | Decide: openly repeat 30, grow in batches (recommended) | DPS-2, Phase 4 |
| 9 | Low | numbersForLevel unspecified | Add pure function + tests | TAP-1 |
| 10 | Low | CNAME/audio-unlock deploy details | Note in design.md §1/§9 | NFR-4, FBK |
| 11 | Low | Private-mode comeback/share note | One sentence in design.md §5 | NFR-7, LCK-1 |
| 12 | Info | perfectsAtLevel example inconsistency | Fix example JSON | design.md §5 |

### Proposed spec edits
1. requirements.md: add **sign-off #9** (reload-resets-round accepted or mitigated) and a sentence to DPS-1: "WHEN the current date precedes the launch date, THE SYSTEM SHALL treat dayNumber as 1."
2. design.md §3: add the positive-modulo guard and `numbersForLevel`; §9: image format = WebP with per-image weight budget; §5: private-mode note; fix example JSON.
3. tasks.md Phase 1: move image-weight validation up from Phase 4; add "pin TZ in CI"; Phase −1: add the two new decisions to the sign-off checklist.

### Recommended sequence
1. This week: resolve blockers 1–2 and the four Medium decisions (all are parent decisions, not code).
2. Apply the spec edits above (~1 hour of editing).
3. Proceed to Phase 0 exactly as written in tasks.md. No other changes recommended.

### Open questions for the parent (decisions, not tasks)
- Accept or mitigate the reload-to-retry loophole? (Issue 5)
- Grown-ups access from the game screen, or accept first-morning defaults? (Issue 4)
- Launch with 30 dinos and open repeats? (Issue 8)
- Final launch date? (Issue 2)
