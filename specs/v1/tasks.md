# Cup of IQ — Tasks (v2, 2026-07-08 · last updated 2026-07-31)

Each task = one focused coding session, one PR. Requirement IDs refer to `requirements.md` (v2). Feel/timing reference: `prototype/prototype-l1.html` + design.md §7b.

**Status: LIVE at https://cupofiq.com since 2026-07-31.** Phase 0 complete; Phase 1 code complete and deployed; the remaining Phase 1 items are the recorded voice, the OG image, and the three ship-gate passes.

**Owner key** — the repo is maintained from a work machine with no terminal, so who can do a task is a real constraint:

- 👤 **Parent only.** Browser-based or a decision: binary uploads (the connector's file API is text-only), anything under `.github/workflows/` (the connector app is denied the Workflows scope — writes 403), anything needing a terminal, and every judgment call.
- 🤖 **Claude can push** via the GitHub MCP connector: any text file outside `.github/workflows/`.

## Phase −1 — Parent sign-offs (blockers before Phase 1 code)

- [x] Sign-offs #1–8 — **all approved by parent, 2026-07-07**
- [x] Sign-offs #9–11 (swarm.md review) — reload loophole, no pre-round grown-ups panel, ~30 dinos with repeats — **accepted 2026-07-07**
- [x] Sign-offs #12–16 (learning-review.md + prototyping session) — developmental ladder, follow-the-tracks L1, number-word audio in MVP, progressive reveal, discovery framing / prompts / missions — **approved 2026-07-08**
- [x] ~~**BLOCKER:** purchase cupofiq.com~~ — **bought on Porkbun 2026-07-31**, ~$11/yr, auto-renew + 2FA on, free email forwarding to a personal address. The only recurring cost of the project
- [ ] 👤 decision / 🤖 push — Set `LAUNCH_DATE` in `src/daily.ts` on go-live morning: his first real round = Day 1. Immutable once the first real result is shared. **Until then the pre-launch clamp pins every day to Day 1, so the once-a-day lock never releases** (reset via the grown-ups panel to replay)

## Phase 0 — Repo, tooling, hosting ✅ complete 2026-07-31

- [x] Init repo: Vite vanilla-ts, `index.html` + `src/main.ts` + `src/styles.css` (NFR-4)
- [x] Vitest added; `TZ=America/New_York` pinned in `vite.config.ts` and the Actions workflow so DST tests are deterministic
- [x] GitHub Actions workflow: push to `main` → install → test → build → deploy to Pages
- [x] cupofiq.com pointed at Pages: four A records + `www` CNAME at Porkbun, Pages source = GitHub Actions, custom domain set, **Enforce HTTPS on**. `public/CNAME` committed so deploys never drop it
- [x] Specs committed under `specs/v1/`, plus `CLAUDE.md`, `prototype/prototype-l1.html`, `mockups/*.svg` (prototype + mockups excluded from the build)
- [x] `assets/STYLE.md` art-direction doc written before the first image (design.md §9)

## Phase 0.5 — Live-site punch list (new 2026-07-31)

Small things the deploy surfaced. None block play.

- [ ] 👤 Upload `logo.webp` to `public/` via the GitHub web UI (Add file → Upload files). Favicon and link-preview image are 404 until this lands. **Binary — connector cannot do this**
- [ ] 👤 `.github/workflows/deploy.yml`: bump `node-version: 20` → `24` (kills the deprecation warning on every run)
- [ ] 👤 `.github/workflows/deploy.yml`: delete the stale "⚠️ Move me" comment block at the top — it rode along in the rename and now gives obsolete instructions
- [ ] 👤 Commit a `package-lock.json`, then switch `npm install` → `npm ci` for reproducible builds. Needs a terminal; a browser Codespace on the free tier is the no-local-install route
- [ ] 👤 Optional cleanup: delete the leftover root `CNAME` (a coming-soon artifact — Actions deploys use `public/CNAME`; the root copy is ignored and only confuses)
- [x] 🤖 Fun facts replaced with the parent-supplied set — species-matched where a matching species exists, general facts distributed across the rest (2026-07-31)
- [ ] 🤖 Fact-check three parent-supplied claims before the first family share: T. rex's bite "enough to crush a car" (popular exaggeration), Microraptor as "smallest known adult dinosaur" (contested), Argentinosaurus at 130 ft / 15 elephants (top of the estimate range)
- [ ] 👤 decision — General facts currently appear under a dino they aren't about. Accept, or split into `content/facts.json` rotating independently of species?

## Phase 1 — Toddler Numbers MVP (ships at Level 1 "Tracks")

**Logic core (pure, tested first):** ✅ complete
- [x] `daily.ts`: `dayNumber` w/ local-midnight math + tests incl. DST boundaries AND the pre-launch clamp (DPS-1)
- [x] `daily.ts`: mulberry32 + `seededShuffle` + `boardSeed`; determinism tests (DPS-3, DPS-4)
- [x] `daily.ts`: `pickDaily` (dino + prompt) w/ positive-modulo helper + tests (DPS-2, PRM-1)
- [x] `daily.ts`: `boardSpecForLevel(1..5)` incl. `revealAfterTap` stage tables + clamp test for level > 5 (BRD-1, BRD-5, TRL-2)
- [x] `content/dinos.json` (30) + `titles.json` + `prompts.json`; content-validation test. **Asset-existence checks are gated behind `STRICT_ASSETS=1`** — flip that on in CI once art and voice are committed; weight budgets are always enforced
- [x] `progress.ts`: schema v1 read/write, private-mode fallback (NFR-7), lock check (LCK-1, LCK-3), level-up capped at 5 + manual override + tests (PRG-1..5)
- [x] `share.ts`: `buildShareText` + tests for all four titles and the L1 "We followed the tracks" line (SHR-1, SHR-3)

**Audio:**
- [ ] 👤 **Record the hatchling voice** — number words one–ten + "rawr" (parent or kid, squeaky dino voice); trim, normalize, export mono `.m4a` ≤ 25 KB each; upload to `public/voice/` (AUD-3, design.md §9). **The highest-value item left: this is curriculum, not decoration.** Binary — parent only
- [x] `feedback.ts`: `sayNumber(v)` / `rawr()` from the manifest; lazy-load after first paint; unlock audio context on first tap; cut-off-not-queue; sound-off respected (AUD-1, AUD-4, AUD-5). *Silent until the recordings land; the word bubble carries it meanwhile (AUD-2/FBK-5)*

**Game screen:** ✅ complete
- [x] `board.ts`: face renderer + layouts `scatter3` / `quincunx5` / `grid10`; sizes and gaps per BRD-1/TAP-2
- [x] `board.ts`: trail overlay — endpoints computed from slot centers after the daily shuffle (TRL-1, BRD-3)
- [x] `board.ts`/`game.ts`: progressive reveal — crackA/crackB/peek layers, `advanceReveal(stage)`, nest jiggle (TRL-2)
- [x] `game.ts`: state machine with `revealStage` in round state (TAP-3..6)
- [x] Correct-tap stamp + word bubble (TRL-3, AUD-2)
- [x] Incorrect-tap wobble + hint bounce after 3 consecutive misses (FBK-1..3, FBK-5)
- [x] Hatch → celebration → auto-results, discovery copy, confetti only when perfect (REV-1..3, CEL-1..3)

**Grown-up surfaces:**
- [x] `screens/results.ts`: dino, title, wrong taps, perfect treatment, level-up progress, parent prompt (SHR-1/2, PRG-3, PRM-1)
- [x] Share (Web Share) + Copy fallback + toast (SHR-3, SHR-4)
- [x] `screens/comeback.ts`: static dino card, no replay affordance, share controls (LCK-1, LCK-2)
- [x] `screens/grownups.ts`: 2 s long-press gate, 5-level picker, sound toggle, reset-with-confirm, privacy note (GRN-1..3)
- [ ] 👤 Static OG tags + `og-image.png` 1200×630 (SHR-6) — tags are in `index.html`; the image is a binary upload

**Ship gate:**
- [ ] 👤 Perf pass: ≤ 300 KB gzipped initial incl. today's dino; voice lazy-loaded post-first-paint; playable < 2 s on throttled fast-3G (NFR-2)
- [ ] 👤 Privacy pass: DevTools network tab shows own-origin static requests only; no cookies; no speech APIs (NFR-3, SHR-5, AUD-3)
- [ ] 👤 Manual on-device checklist (real phone + real toddler): footprints countable by a small finger; trail reads as "path to the egg"; number word lands with the tap; wobble reads friendly; peek-eyes moment lands; celebration length right; share sheet opens; comeback card ends the "AGAIN!" negotiation; compare feel against `prototype/prototype-l1.html`
- [x] Placeholder art shipping — dino images fall back to the emoji via `img.onerror`; real art tracked in Phase 2

## Phase 2 — Polish

- [ ] 👤 Final hand-drawn art per `assets/STYLE.md`: L1 scene (nest, egg reveal layers, patches, trail), egg SVGs for L2+, first 30 dino illustrations
- [ ] 👤 Final CC0/home-recorded sfx set, quiet defaults (design.md §9)
- [ ] 🤖 `content/missions.json` (≥ 14 entries) + counting-mission chip on the comeback card (MSN-1)
- [ ] 🤖 Animation quality pass: crack layers, dance loop, perfect-round confetti
- [ ] 🤖 Add-to-homescreen: manifest + icons (👤 icon files); optional minimal service worker (keep tiny; skip if it adds churn)
- [ ] 👤 decision — Optional off-by-default voice line "Not that one yet!" (deferred Option B)
- [x] `funFact` displayed on results for the grown-up to read aloud — shipped in Phase 1

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
