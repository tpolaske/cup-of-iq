# Cup of IQ — Tasks (v2, 2026-07-08 · updated 2026-08-03 · updated 2026-08-10)

Each task = one focused coding session, one PR. Requirement IDs refer to `requirements.md` (v2). Feel/timing reference: `prototype/prototype-l1.html` + design.md §7b.

## Phase −1 — Parent sign-offs (blockers before Phase 1 code)

- [x] Sign-offs #1–16 — **approved 2026-07-07/08** (see git history)
- [x] Sign-off #17 — grown-ups entry becomes a plain tap — **approved 2026-08-03**
- [x] Sign-off #18 — replays return, first-attempt-only scoring — **approved 2026-08-03**
- [x] Sign-off #19 — retitle accuracy ladder off dino-species names; perfect rounds get a child-facing roar bonus — **approved 2026-08-10**
- [x] Sign-off #20 — perfect-round dino renders bigger for the whole celebration — **approved 2026-08-10**
- [x] Sign-off #21 — L2–L5 completed eggs slide into an ordered bottom tray instead of just changing color in place — **approved 2026-08-10**

## Phase 0 — Repo, tooling, hosting

- [x] Init repo, Vitest + pinned TZ, Actions workflow, custom domain, spec files committed
- [ ] Upload `logo.webp` to `public/` (binary — GitHub web UI, the MCP connector is text-only)
- [ ] Commit a `package-lock.json` and switch the workflow's `npm install` to `npm ci`
- [ ] Add `assets/STYLE.md` art-direction doc **before the first image** (design.md §9)
- [ ] `.github/workflows/deploy.yml` still has a leftover "move me" staging comment at the top — harmless, delete next time that file is touched

## Phase 1 — Toddler Numbers MVP (ships at Level 1 "Tracks")

**Logic core, content, audio wiring:** all done — see git history.

- [x] `content/dinos.json` grown to 34 entries; `content/titles.json` retitled (sign-off #19)
- [ ] **Record the hatchling voice**: number words one–ten + "rawr" + the bonus `rawr-big.m4a` (sign-off #19); trim, normalize, export mono `.m4a` ≤ 25 KB each; commit to `public/voice/` + `manifest.json`. Code already ships with a graceful fallback until this is recorded — not a blocker.

**Game screen:**
- [x] `board.ts`, trail overlay, progressive reveal, game state machine
- [x] `screens/celebration.ts`: perfect-round roar bonus + bigger dino size (CEL-2 exceptions, sign-offs #19/#20)
- [x] **`board.ts`: L2–L5 collected-numbers tray** — a completed egg FLIP-animates out of the board into an ordered bottom tray so what's left on the board is what's left to do; L5's board also moved off live CSS Grid onto fixed slots so completing one egg can't reflow the others (sign-off #21)
- [ ] **Parked (2026-08-03):** trail segments currently point *toward* the next patch rather than retrospectively — deliberately deferred, not hurting play

**Grown-up surfaces:** all shipped — see git history.
- [ ] Static OG tags + `og-image.png` 1200×630 (SHR-6)

**Ship gate:**
- [ ] Perf pass, privacy pass (NFR-2, NFR-3, SHR-5, AUD-3)
- [ ] Manual on-device checklist — **add:** does the tray read clearly at L2/L3/L4/L5 on the real phone (especially the L5 tray with 10 small slots — the geometry there was sized on paper, not tested on-device yet); does the roar/size bonus feel like a treat, not a judgment on non-perfect days
- [ ] Placeholder art OK to ship; real art tracked in Phase 2

## Phase 2 — Polish

- [ ] Final hand-drawn art per `assets/STYLE.md`
- [ ] Final CC0/home-recorded sfx set
- [ ] `content/missions.json` (≥ 14 entries) + counting-mission chip (MSN-1)
- [ ] **Two-scatter round (idea, needs sign-off).** See git history
- [ ] Animation quality pass, incl. real open-mouth art for the roar bonus once art lands (currently a scale/shake stand-in, sign-off #19)
- [ ] Add-to-homescreen manifest + icons
- [ ] Optional off-by-default voice line "Not that one yet!"
- [ ] `funFact` display on results

## Phase 3 — Mode 2 scaffolding (Letters) — only when he's ready

Unchanged — see git history.

## Phase 4 — Content pipeline for the long haul

Unchanged — see git history.
