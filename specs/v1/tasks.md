# Cup of IQ — Tasks (v2, 2026-07-08 · updated 2026-08-03 · updated 2026-08-10)

Each task = one focused coding session, one PR. Requirement IDs refer to `requirements.md` (v2). Feel/timing reference: `prototype/prototype-l1.html` + design.md §7b.

## Phase −1 — Parent sign-offs (blockers before Phase 1 code)

- [x] Sign-offs #1–8 — **all approved by parent, 2026-07-07**
- [x] Sign-offs #9–11 (swarm.md review) — reload loophole, no pre-round grown-ups panel, ~30 dinos with repeats — **accepted 2026-07-07**
- [x] Sign-offs #12–16 (learning-review.md + prototyping session) — developmental ladder, follow-the-tracks L1, number-word audio in MVP, progressive reveal, discovery framing / prompts / missions — **approved 2026-07-08**
- [x] Set `LAUNCH_DATE` on go-live day — **set to 2026-08-03; immutable from here**
- [x] **BLOCKER:** Verify availability and purchase cupofiq.com — **done (Porkbun, ~$11/yr, DNS + TLS live)**
- [x] Sign-off #17 — grown-ups entry becomes a plain tap, replacing the 2 s long-press — **approved 2026-08-03**
- [x] Sign-off #18 — replays return, first-attempt-only scoring — **approved 2026-08-03**
- [x] Sign-off #19 — retitle accuracy ladder off dino-species names; perfect rounds get a child-facing roar bonus — **approved 2026-08-10**

## Phase 0 — Repo, tooling, hosting

- [x] Init repo: Vite vanilla-ts template
- [x] Add Vitest; pin `TZ=America/New_York`
- [x] GitHub Actions workflow: push to `main` → install → test → build → deploy to GitHub Pages
- [x] Point cupofiq.com at Pages
- [x] Commit spec files, prototype, mockups
- [ ] Upload `logo.webp` to `public/` (binary — GitHub web UI, the MCP connector is text-only)
- [ ] Commit a `package-lock.json` and switch the workflow's `npm install` to `npm ci`
- [ ] Add `assets/STYLE.md` art-direction doc **before the first image** (design.md §9)
- [ ] Note: `.github/workflows/deploy.yml` still has its "move me" staging comment at the top even though it now lives at the real path — harmless, but worth deleting the comment block next time that file is touched

## Phase 1 — Toddler Numbers MVP (ships at Level 1 "Tracks")

**Logic core (pure, tested first):** all done (DPS, BRD, PRG, share — see git history).

- [x] `content/dinos.json` grown to **34 entries** (added plesiosaurus, liopleurodon, ichthyosaurus, pterodactylus) — more species spaces out the DPS-2 repeat cycle further (sign-off #11 still accepts repeats)
- [x] `content/titles.json` retitled off dino-species names — Roar-some / Trailblazer / Egg hunter / Hatch day, same thresholds (sign-off #19)

**Audio (new in v2):**
- [ ] **Record the hatchling voice**: number words one–ten + "rawr" (parent or kid, squeaky dino voice); trim, normalize, export mono `.m4a` ≤ 25 KB each; commit to `public/voice/` + `manifest.json` (AUD-3, design.md §9)
- [ ] **Record `rawr-big.m4a`** — a louder/longer take of the same roar, for the perfect-round bonus (AUD-6, sign-off #19). Code already wired and ships with a graceful fallback to `rawr.m4a` until this exists — not a blocker, just a nice-to-have follow-up recording session
- [x] `feedback.ts`: `sayNumber(v)` / `rawr(big?)` from the manifest; lazy-load after first paint; unlock audio context on first tap; cut-off-not-queue on rapid taps; sound-off respected (AUD-1, AUD-4, AUD-5, AUD-6)

**Game screen:**
- [x] `board.ts`, trail overlay, progressive reveal, game state machine — all shipped
- [x] `screens/celebration.ts`: perfect-round roar bonus — enlarged shake + "RAWRRR!" burst text + bonus rawr audio, before the standard dance (CEL-2 exception, sign-off #19)
- [ ] **Parked (2026-08-03):** trail segments currently point *toward* the next patch rather than retrospectively — deliberately deferred, not hurting play

**Grown-up surfaces:**
- [x] `screens/results.ts`, share/copy, `screens/comeback.ts`, `screens/grownups.ts` — all shipped
- [ ] Static OG tags + `og-image.png` 1200×630 (SHR-6)

**Ship gate:**
- [ ] Perf pass: ≤ 300 KB gzipped initial; voice files verified lazy-loaded post-first-paint; playable < 2 s on throttled fast-3G (NFR-2)
- [ ] Privacy pass: DevTools network tab shows own-origin static requests only; no cookies; no speech APIs (NFR-3, SHR-5, AUD-3)
- [ ] Manual on-device checklist: **include the perfect-round roar bonus** — does the enlarged shake read as "roar" to a toddler, is the burst text legible mid-motion, does it feel like a treat rather than a judgment on the non-perfect days
- [ ] Placeholder art OK to ship; real art tracked in Phase 2

## Phase 2 — Polish

- [ ] Final hand-drawn art per `assets/STYLE.md`: L1 scene, egg SVGs for L2+, dino illustrations (now 34)
- [ ] Final CC0/home-recorded sfx set, quiet defaults (design.md §9)
- [ ] `content/missions.json` (≥ 14 entries) + counting-mission chip on the comeback card (MSN-1)
- [ ] **Two-scatter round (idea, needs sign-off).** Unchanged from prior note — see git history
- [ ] Animation quality pass: crack layers, dance loop, perfect-round confetti **and the new roar beat** (once real art lands, consider giving the roar an actual open-mouth art state rather than the current scale/shake stand-in)
- [ ] Add-to-homescreen: manifest + icons; optional minimal service worker
- [ ] Optional off-by-default voice line "Not that one yet!" — parent decision
- [ ] `funFact` display on results for the grown-up to read aloud

## Phase 3 — Mode 2 scaffolding (Letters) — only when he's ready

- [ ] Promote `/` to a two-big-buttons mode chooser; Numbers moves to `/numbers/` (design.md §10)
- [ ] Extract genuinely-shared modules as they're touched
- [ ] `content/letters.json` + letters board
- [ ] Grown-ups panel gains per-mode level pickers

## Phase 4 — Content pipeline for the long haul

- [ ] Grow `dinos.json` further in batches as parent time allows
- [ ] Grow `prompts.json` / `missions.json` alongside
- [ ] Batch art workflow using `assets/STYLE.md`
- [ ] Revisit (don't pre-build): per-day OG images
- [ ] Parking lot review with parent: word-game mode design; SAT/adult modes remain parked
- [ ] Success check-in (sign-off #16 metric): did the ritual stick 30 mornings? Is he counting real things unprompted? Is maintenance under ~1 hr/month?
