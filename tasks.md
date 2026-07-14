# Cup of IQ — Tasks (v2, 2026-07-08)

Each task = one focused coding session, one PR. Requirement IDs refer to `requirements.md` (v2). Feel/timing reference: `prototype/prototype-l1.html` + design.md §7b.

## Phase −1 — Parent sign-offs (blockers before Phase 1 code)

- [x] Sign-offs #1–8 — **all approved by parent, 2026-07-07**
- [x] Sign-offs #9–11 (swarm.md review) — reload loophole, no pre-round grown-ups panel, ~30 dinos with repeats — **accepted 2026-07-07**
- [x] Sign-offs #12–16 (learning-review.md + prototyping session) — developmental ladder, follow-the-tracks L1, number-word audio in MVP, progressive reveal, discovery framing / prompts / missions — **approved 2026-07-08**
- [ ] Set `LAUNCH_DATE` on go-live day: on the morning of the first real round, set it to that date and push (his first morning = Day 1). No deadline — just immutable once the first real result is shared
- [ ] **BLOCKER:** Verify availability and purchase cupofiq.com on a registrar this week (guide: `domain-setup-guide.md`); every doc, the share text, and the OG tags hardcode this domain. The only time-sensitive item

## Phase 0 — Repo, tooling, hosting

- [ ] Init repo: Vite vanilla-ts template, strip boilerplate to `index.html` + empty `src/main.ts` + `src/styles.css` (NFR-4)
- [ ] Add Vitest; one placeholder test; `npm test` green; pin `TZ=America/New_York` in the Vitest config and Actions workflow so DST tests are deterministic (CI runs UTC otherwise)
- [ ] GitHub Actions workflow: push to `main` → install → test → build → deploy to GitHub Pages
- [ ] Point cupofiq.com at Pages: commit `CNAME` file into `public/` (so deploys never drop it) + HTTPS; verify live "hello egg" page (the coming-soon site from `domain-setup-guide.md` may already occupy the repo — the Vite build replaces it)
- [ ] Commit `CLAUDE.md`, `requirements.md`, `design.md`, `playback.md`, `learning-review.md`, `swarm.md`, this file, **`prototype/prototype-l1.html`**, **`mockups/*.svg`** (prototype + mockups excluded from the Vite build)
- [ ] Add `assets/STYLE.md` art-direction doc **before the first image** (design.md §9)

## Phase 1 — Toddler Numbers MVP (ships at Level 1 "Tracks")

**Logic core (pure, tested first):**
- [ ] `daily.ts`: `dayNumber` w/ local-midnight math + tests incl. DST boundaries AND the pre-launch clamp (`now < LAUNCH_DATE` → Day 1) (DPS-1)
- [ ] `daily.ts`: mulberry32 + `seededShuffle` + `boardSeed`; determinism tests (DPS-3, DPS-4)
- [ ] `daily.ts`: `todaysDino` + `todaysPrompt` (+ `todaysMission` stub) w/ positive-modulo helper + tests (DPS-2, PRM-1)
- [ ] `daily.ts`: **`boardSpecForLevel(1..5)`** per BRD-1 incl. `revealAfterTap` stage tables + clamp test for level > 5 (BRD-1, BRD-5, TRL-2)
- [ ] `content/dinos.json` (first 30, text-only OK) + `titles.json` + **`prompts.json` (≥ 10 strings)**; content-validation test: unique ids, ladder exhaustive, images exist WebP ≤ 60 KB, prompts non-empty, **voice manifest covers values 1–10 + rawr, each file ≤ 25 KB** (NFR-2, AUD-3)
- [ ] `progress.ts`: schema v1 read/write, private-mode fallback (NFR-7), lock check (LCK-1, LCK-3), level-up rules capped at 5 + manual override + tests (PRG-1..5)
- [ ] `share.ts`: `buildShareText` + tests for all four titles **and the L1 "We followed the tracks" line** (SHR-1, SHR-3)

**Audio (new in v2):**
- [ ] **Record the hatchling voice**: number words one–ten + "rawr" (parent or kid, squeaky dino voice); trim, normalize, export mono `.m4a` ≤ 25 KB each; commit to `public/voice/` + `manifest.json` (AUD-3, design.md §9)
- [ ] `feedback.ts`: `sayNumber(v)` / `rawr()` from the manifest; lazy-load after first paint; unlock audio context on first tap; cut-off-not-queue on rapid taps; sound-off respected (AUD-1, AUD-4, AUD-5)

**Game screen:**
- [ ] `board.ts`: face renderer (`prints` / `prints+numeral` / `numeral`) + layouts `scatter3` (nest scene, patch slots per design.md §7b geometry), `quincunx5`, `grid10`; sizes/gaps per BRD-1/TAP-2 (BRD-1..4, NFR-1)
- [ ] `board.ts`: **trail overlay** — segment endpoints computed from slot centers after the daily shuffle (never hardcoded); segment N fades in 600 ms on Nth correct tap (TRL-1, BRD-3)
- [ ] `board.ts`/`game.ts`: **progressive reveal** — day egg with toggleable layers (crackA/crackB/peek), `advanceReveal(stage)` per `revealAfterTap`, nest jiggle ≤ 450 ms (TRL-2)
- [ ] `game.ts`: state machine `idle → awaiting_tap → … → results` w/ `revealStage` in round state (TAP-3..6)
- [ ] Correct-tap stamp: prints darken + 450 ms pop; word bubble 1.4 s (TRL-3, AUD-2)
- [ ] Incorrect-tap wobble + soft chime, no child-visible penalty; hint bounce after 3 consecutive misses (FBK-1..3, FBK-5)
- [ ] Hatch on final tap ≤ 1 s → celebration: dino popin + shell halves, dance 4–8 s, "rawr", confetti only when perfect, **discovery copy ("You found her!")**, auto-transition to results (REV-1..3, CEL-1..3)

**Grown-up surfaces:**
- [ ] `screens/results.ts`: dino, title, wrong taps, perfect treatment + level-up progress + **parent prompt** (SHR-1, SHR-2, PRG-3, PRM-1)
- [ ] Share button (Web Share) + Copy fallback + toast (SHR-3, SHR-4)
- [ ] `screens/comeback.ts`: static dino card, no replay affordance, share controls (LCK-1, LCK-2)
- [ ] `screens/grownups.ts`: 2 s long-press gate, **5-level picker with plain-language names (BRD-1)**, sound toggle, reset-with-confirm, privacy note (GRN-1..3)
- [ ] Static OG tags + `og-image.png` 1200×630 (SHR-6)

**Ship gate:**
- [ ] Perf pass: ≤ 300 KB gzipped initial incl. today's dino; voice files verified lazy-loaded post-first-paint; playable < 2 s on throttled fast-3G (NFR-2)
- [ ] Privacy pass: DevTools network tab shows own-origin static requests only; no cookies; no speech APIs (NFR-3, SHR-5, AUD-3)
- [ ] Manual on-device checklist (real phone + real toddler): footprints countable by a small finger; trail reads as "path to the egg"; number word lands with the tap; wobble reads friendly; peek-eyes moment lands; celebration length right; share sheet opens; comeback card ends the "AGAIN!" negotiation; compare feel against `prototype/prototype-l1.html`
- [ ] Placeholder art OK to ship; real art tracked in Phase 2

## Phase 2 — Polish

- [ ] Final hand-drawn art per `assets/STYLE.md`: L1 scene (nest, egg reveal layers, patches, trail), egg SVGs for L2+, first 30 dino illustrations
- [ ] Final CC0/home-recorded sfx set, quiet defaults (design.md §9)
- [ ] **`content/missions.json` (≥ 14 entries) + counting-mission chip on the comeback card** (MSN-1)
- [ ] Animation quality pass: crack layers, dance loop, perfect-round confetti
- [ ] Add-to-homescreen: manifest + icons; optional minimal service worker (keep tiny; skip if it adds churn)
- [ ] Optional off-by-default voice line "Not that one yet!" (deferred Option B) — parent decision
- [ ] `funFact` display on results for the grown-up to read aloud

## Phase 3 — Mode 2 scaffolding (Letters) — only when he's ready

- [ ] Promote `/` to a two-big-buttons mode chooser; Numbers moves to `/numbers/` (design.md §10)
- [ ] Extract genuinely-shared modules as they're touched: `daily`, `progress` (namespaced keys), `share`, `feedback` — no engine abstraction
- [ ] `content/letters.json` + letters board (A–E first); reuse reveal-and-celebrate pattern
- [ ] Grown-ups panel gains per-mode level pickers

## Phase 4 — Content pipeline for the long haul

- [ ] Grow `dinos.json` in batches as parent time allows — repeats via the DPS-2 modulo are accepted (sign-off #11). Document the add-a-dino workflow in CLAUDE.md
- [ ] Grow `prompts.json` / `missions.json` alongside (each is one string/object per entry)
- [ ] Batch art workflow using `assets/STYLE.md` for visual consistency
- [ ] Revisit (don't pre-build): per-day OG images — only if sharing proves popular
- [ ] Parking lot review with parent: word-game mode design; SAT/adult modes remain parked unless deliberately revived
- [ ] Success check-in (sign-off #16 metric): did the ritual stick 30 mornings? Is he counting real things unprompted? Is maintenance under ~1 hr/month?
