# Cup of IQ — Design (v2, 2026-07-08 · amended 2026-08-03 · amended 2026-08-10 · amended 2026-08-29)

*v2 incorporates `learning-review.md` R1–R8 and the prototyping session of 2026-07-08 (sign-offs #12–16). The stack (§1) and architecture shape (§2) are unchanged. 2026-08-03: §3 `LAUNCH_DATE` is now real; §6 grown-ups entry is a plain tap (sign-off #17). 2026-08-10: §4 `titles.json` retitled off dino-species names; §6/§7b add the perfect-round roar bonus (sign-off #19). 2026-08-29: §3/§6/§7b add the `scatter5` layout for the new Level 2 "Tracks (more)" (sign-off #24); level cap raised from 5 to 6 throughout.*

## 1. Tech stack decision ⚠️ (parent sign-off #1)

**Chosen: plain HTML + plain CSS + vanilla TypeScript, bundled by Vite. No UI framework. Content as JSON in the repo. GitHub Pages hosting deployed by GitHub Actions. Vitest for logic tests.**

Unchanged from prior versions — see git history for the full rationale and candidates-weighed table.

## 2. Architecture overview

Unchanged. `main.ts` routes to `game.ts` (state machine) or the comeback screen; `daily.ts`/`progress.ts`/`share.ts`/`feedback.ts` are the pure/thin-DOM modules underneath. **Game states:** `idle → awaiting_tap ⇄ (target_correct | target_incorrect) → complete → celebration → results`, plus `comeback`.

## 3. Daily algorithms and board specs

Unchanged — see git history for `dayNumber`, `seededShuffle`, `boardSeed`. **`boardSpecForLevel(level)` now covers 6 levels (sign-off #24):** level 2 returns `{ targets: 5, values: [1..5], face: 'footprints', layout: 'scatter5', minTargetPx: 88 }` — otherwise identical in shape to level 1's spec, just swapping `scatter3`→`scatter5` and 3→5 values. Levels 3–6 are the former levels 2–5, unchanged in content, just shifted up one.

## 4. Content schemas

`content/dinos.json` — append an entry + drop one image to add a day (NFR-6). Now 34 entries (30 launch dinos + plesiosaurus, liopleurodon, ichthyosaurus, pterodactylus added 2026-08-10); repeats still accepted per sign-off #11, just spaced further apart:

```json
[
  {
    "id": "stegosaurus",
    "displayName": "Baby Stegosaurus",
    "emoji": "🦕",
    "image": "img/dinos/stegosaurus.webp",
    "funFact": "Plates like leaves on its back!"
  }
]
```

`content/titles.json` — the accuracy ladder ⚠️ (sign-off #8, retitled #19), grown-up-facing only (CEL-2): four rungs at the same thresholds as v1 (0/1/2–3/4+), now named independently of any dino species — `roar` / `trailblazer` / `egg-hunter` / `hatch-day` — since the hatched species (DPS-2) already tells its own daily-surprise story and doesn't need a second, accuracy-driven dino name competing with it:

```json
[
  { "id": "roar", "label": "Roar-some round", "emoji": "🦖", "maxWrong": 0 },
  { "id": "trailblazer", "label": "Trailblazer round", "emoji": "🐾", "maxWrong": 1 },
  { "id": "egg-hunter", "label": "Egg hunter round", "emoji": "🥚", "maxWrong": 3 },
  { "id": "hatch-day", "label": "Hatch day round", "emoji": "🎉", "maxWrong": null }
]
```

`content/prompts.json`, `content/missions.json` — unchanged, see git history.

`public/voice/manifest.json` — maps values/events to audio files. Now 12 entries: number words 1–10, `rawr`, and (new, sign-off #19) `rawr-big` — the perfect-round bonus clip:

```json
{ "1": "voice/one.m4a", "2": "voice/two.m4a", "3": "voice/three.m4a",
  "…": "…", "10": "voice/ten.m4a", "rawr": "voice/rawr.m4a", "rawr-big": "voice/rawr-big.m4a" }
```

A Vitest content test enforces: unique dino ids, images exist and are WebP ≤ 60 KB, title ladder ordered and exhaustive (now checking the sign-off #19 ids), prompts/missions non-empty, every value in every `boardSpecForLevel().values` has a voice file ≤ 25 KB.

## 5. localStorage schema

Unchanged — see git history. `titleId` in `lastPlayed` is still just an opaque string; nothing in `progress.ts` depends on its literal value, so the sign-off #19 rename required no schema or migration change.

## 6. Component breakdown

Vanilla-TS "components" are modules exporting `mount(el, props)`-style functions; kebab-case filenames per CLAUDE.md.

| Module | Responsibility (recent changes in **bold**) |
|---|---|
| `src/main.ts` | Boot: read state, compute day, route to game or comeback screen |
| `src/game.ts` | State machine; owns `{ target, wrongTaps, missStreak, revealStage }` |
| `src/board.ts` | Renders targets per `BoardSpec`; layouts `scatter3`/`scatter5`/`quincunx5`/`grid10` |
| `src/daily.ts` | `dayNumber`, `boardSeed`, `seededShuffle`, `todaysDino`, `boardSpecForLevel`, `todaysPrompt`, `todaysMission` — pure, fully unit-tested |
| `src/progress.ts` | localStorage read/write, schema migration, level-up rules (cap 6, sign-off #24) |
| `src/feedback.ts` | Plays stamp/crack/wobble/hint/hatch animations + sfx; `sayNumber(v)` and **`rawr(big?)`** via the voice manifest — **`rawr(true)` is the perfect-round bonus (AUD-6), trying the dedicated `rawr-big` clip and falling back to the standard `rawr` clip if it isn't recorded yet (sign-off #19)**; lazy-loads audio after first paint; unlocks audio context on first tap (AUD-4) |
| `src/ui.ts` | Shared DOM helpers: toast, share/copy, `grownupsLink()` |
| `src/share.ts` | `buildShareText(result)`, `share()` with Web Share → clipboard fallback |
| `src/screens/results.ts` | Results: dino, accuracy title, wrong taps, perfect treatment, parent prompt, share/copy, grown-ups control |
| `src/screens/celebration.ts` | Hatch reveal + dance (REV, CEL-1..3, AUD-5). **Perfect rounds get an extra beat first: `.party-dino.roar` (enlarged scale/shake, ~750 ms) plus a "RAWRRR!" burst-text overlay and the bonus rawr audio, then the class swaps to `.dance` for the remainder of CEL-1's window (sign-off #19).** |
| `src/screens/comeback.ts` | Come-back card (LCK-1): static dino, share controls, Play again (LCK-5) |
| `src/screens/grownups.ts` | Panel: 6-level picker (sign-off #24), sound toggle, reset-with-confirm, privacy note |
| `content/` | `dinos.json` (34), **`titles.json` (retitled #19)**, `prompts.json`, `missions.json` |
| `public/img`, `public/sfx`, `public/voice` | Static assets. `voice/manifest.json` now lists 12 keys incl. the optional `rawr-big` |
| `prototype/prototype-l1.html`, `mockups/*.svg` | Reference implementation + spec screenshots (§11). Not shipped. |

## 7. Incorrect-tap feedback design ⚠️ (sign-off #2)

Unchanged: wobble + patient hint (Option C). See git history.

## 7b. Levels 1–2 "Follow the tracks" family — implementation spec

Scene geometry, reveal layers, and the base interaction/timing table for **Level 1** are unchanged — see git history for the full table. **New row (sign-off #19):**

| Event | Response | Timing |
|---|---|---|
| Celebration, perfect round only | dino scale/shake "roar" pulse (`.roar` class) + "RAWRRR!" burst text (`.roar-burst`) + bonus rawr audio (`feedback.rawr(true)`) | ~750 ms, plays immediately after the 600 ms popin and *before* the dance loop starts; non-perfect rounds skip straight to the dance (sign-off #19) |

Implementation detail: `celebration.ts` calls `feedback.rawr(perfect)` once up front (so the audio and the visual popin land together), then on the same 700 ms timer that used to just add `.dance`, perfect rounds add `.roar` first and swap to `.dance` 750 ms later; non-perfect rounds go straight to `.dance` as before. The overall celebration still fits CEL-1's 4–8 s window (implementation uses the existing 4500 ms auto-transition). This roar bonus applies identically at Level 2 — it's driven by `wrongTaps === 0` on the recorded round, not by level.

### L2 "Tracks (more)" — `scatter5` geometry (sign-off #24)

L2 is L1 with five footprint patches instead of three, at the ≥88 px sizing already used by the numeral levels. Same mechanic in every other respect: same-order tap requirement, same wobble/hint/audio/stamp behavior (§7 unchanged), same nest + progressive-hatch scene, same discovery framing. It reuses the 5-target row of TRL-2's reveal-stage table (crack A → crack A grows → crack B → eyes peek → hatch) unchanged — that table already governs the day-egg by tap count, not by target face type, so no new reveal logic is needed for the footprint-faced version.

The scene canvas grows to accommodate five patches: **336×560** (was 336×452 at L1), nest unchanged at `left: 50%, top: 2px`, same 150×128 art, same internal trail-anchor point at local `(172, 112)`. Patch art is the existing L1 footprint-count SVGs (1–5 print variants; the 4- and 5-print faces are new art in the same style, see §9), scaled to **88×81** (was 104×96) to hit the ≥88 px minimum.

Reference slot positions (top-left corner, patch is 88×81), arranged in a loose zigzag so the fixed geometry itself doesn't hint an order — exact pixels to be confirmed in a `prototype-l2.html` duplicate of the L1 reference prototype before implementation:

| Slot | left | top | center |
|---|---|---|---|
| A | 28 | 150 | (72, 190) |
| B | 210 | 130 | (254, 170) |
| C | 40 | 280 | (84, 320) |
| D | 220 | 320 | (264, 360) |
| E | 100 | 460 | (144, 500) |

As at L1, DPS-3's daily seeded shuffle assigns the five quantities to these five fixed slots; the trail (TRL-1) fades in four dotted segments connecting the slot centers in ascending value order, with the final (4th) segment terminating at the nest anchor `(172, 112)` — same fade-in and terminate-at-nest behavior as L1's three-segment trail, just one segment longer.

### L3 "Tracks + numbers" note *(formerly L2, per sign-off #24)*

Unchanged in content or behavior — see git history. Only the level number shifted, from 2 to 3.

## 8. Sharing implementation

```ts
// share.ts — L1 output (title now from the sign-off #19 ladder):
// Cup of IQ 🥚 Day 14
// We followed the tracks — Baby Stegosaurus hatched!
// 🦖 Roar-some round — 0 wrong taps ⭐
// https://cupofiq.com
// (L2+ omits the tracks line)
```

Otherwise unchanged — see git history for Web Share/clipboard fallback and OG tags.

## 9. Asset plan

Look, palette, egg/scene art, and sfx plan unchanged — see git history.

- **Dinos:** 512 px transparent WebP, ≤ 60 KB per image. Now **34 species**, one image each; style locked by `assets/STYLE.md` written before the first image.
- **Footprint patches (sign-off #24):** L1 shipped with 1-, 2-, and 3-print SVG faces. L2 needs 4- and 5-print variants in the same style — **new art, not yet drawn** — plus all five re-exported/re-scaled to the 88×81 footprint-patch size (see §7b).
- **Voice (MVP):** the hatchling voice — number words "one" through "ten" plus "rawr" (11 files), **plus a 12th, optional file: `rawr-big.m4a`** (sign-off #19) — a louder/longer take of the same "rawr," for the perfect-round bonus. Same production notes (mono `.m4a`, ≤ 25 KB, quiet room, trimmed, normalized). Until it's recorded, `feedback.rawr(true)` falls back to the standard `rawr.m4a` automatically — the feature ships now, the extra recording is a follow-up, not a blocker.
- **Animation:** CSS transforms/keyframes only. New keyframe `roar` (scale/rotate pulse, ~750 ms) drives `.party-dino.roar`; reuses the existing `wordpop` keyframe for the `.roar-burst` text so no new keyframe was needed there.

## 10. Seams for future modes (design for, don't build)

Unchanged — see git history.

## 11. Reference implementation & mockups

Unchanged — see git history. The roar bonus (sign-off #19) postdates the mockups; no new mockup was made since it's a small animation/timing change on an existing screen, not a new layout — revisit if the Phase 2 art pass wants a dedicated open-mouth art state instead of the current scale/shake stand-in.
