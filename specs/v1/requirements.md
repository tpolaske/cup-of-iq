# Cup of IQ — Requirements (v2, 2026-07-08 · GRN-1 and LCK amended 2026-08-03 · titles & celebration amended 2026-08-10 · SHR-7 added 2026-08-15 · rawr-big budget carve-out 2026-08-28 · L2 "Tracks (more)" inserted 2026-08-29)

## Product Vision

Cup of IQ is a free, ad-free, dead-simple daily ritual: one puzzle per day, every day, for a growing kid — starting as a dino-tracking counting game for a 2.5-year-old. It is equally a cute family morning moment and a real skill-builder; neither excuses the other, and as of v2 the skill-building is grounded in early-numeracy research (see `learning-review.md`).

Each morning at Level 1, the page shows a nest with today's egg and, scattered below it, three patches of dino footprints — one print, two prints, three prints, in mixed-up positions. The child taps the patches from fewest prints to most. Each correct tap stamps the patch, **draws a dotted trail one step closer to the nest**, makes the egg jiggle and crack a little more (eyes peek out at step two!), and a squeaky **hatchling voice speaks the number word** ("One!"). The last step lands at the nest and the day's dinosaur — a surprise species, deterministic from the date — hatches: *"You found her! A baby stegosaurus!"*, followed by a short dance. The story is coherent on purpose: **follow the tracks, find the egg.** Counting is what builds the path. That surprise is the reason he asks to play tomorrow. A perfect round (zero wrong taps) earns one extra, child-facing beat at the very end: the hatched dino rears back for a big, mouth-open **ROAR** before settling into the regular dance — the one place accuracy is allowed to show up on the child's side of the screen (sign-off #19).

Wrong taps get a warm, wordless wobble and a soft "hmm?" — no penalty feeling, no limit on retries, and after three misses on the same target the correct patch begins a slow, patient bounce. Higher levels graduate along a developmental ladder: footprints paired with numerals, then numerals alone on speckled eggs — carrying the same child from age 2.5 to roughly 6 (see BRD-1).

The *day* is what happens once. After the celebration, the results screen shows a grown-up-facing accuracy title from a small positive ladder in `content/titles.json` — no longer named after dino species (sign-off #19), since the *hatched* dinosaur already changes every day on its own (DPS-2) and a second, accuracy-driven dino name next to it read as confusing rather than fun — one small rotating **parent prompt** ("Try together: count his fingers to 3 today"), and a one-tap share/copy of a plain-text result. Reopening the page later that day still lands on a gentle card with today's hatched dino, "new egg tomorrow," and (Phase 2) a real-world **counting mission** ("find 3 spoons at breakfast"). From there a **Play again** button runs the round as many times as he likes — fresh scatter each time, same dinosaur, and nothing recorded: only the first round of the day counts, is scored, or is shared. The scarcity that matters is the *new egg*, not the tapping. There is no collection shelf, no leaderboard, no accounts, no chat, no timers.

Progression is the parent's own design: three perfect rounds (zero wrong taps) at a level advance the child to the next level, always effective tomorrow, never mid-ritual. A quiet grown-ups panel, tucked at the bottom of the grown-up-facing screens, can override the level at any time. Letters, shapes, and an eventual real word game are future modes. The whole thing is static files and localStorage: no backend, no cost, no maintenance burden, built by one parent for one kid first.

**Disagreements log:** Claude proposed replayable-with-first-attempt-counting; parent chose strict once-a-day — resolved with the static-dino "come back tomorrow" card. *(Reversed 2026-08-03 as #18, after the kid actually asked: replays return, with first-attempt-only scoring — the original Claude proposal.)* Claude proposed a dino collection shelf; parent chose leaner — dropped. Parent proposed SAT/adult modes; Claude pushed back — parked. Parent proposed ABCs as Level 3; moved to Mode 2 (Letters). Parent proposed dino titles per accuracy; adopted, grown-up-facing only. *(Reversed 2026-08-10 as #19: the accuracy ladder is retitled off dino-species names — pairing a fixed species name to an accuracy tier read as a second, competing "which dino" story next to the real daily-hatch dino. A perfect round instead gets a child-facing bonus beat — a big roar — rather than a special species name.)* **v2 additions:** parent proposed per-tap hatches with a 5-dino dance party; revised to a progressive reveal of one dino after the learning review flagged content cost and reward-overload. Claude proposed footprints printed on eggs; parent flagged the broken metaphor; resolved as tracks-on-the-ground drawn into a trail. Original numerals-first L1 replaced by the quantity-first developmental ladder per `learning-review.md`. **Post-launch:** Claude spec'd a 2 s long-press to gate the grown-ups panel; parent found it unusable on the phone the game actually runs on — resolved as a plain tap (#17). *(Claude briefly proposed removing the standard rawr entirely, perfect-round-only audio — parent reconsidered after Claude surfaced that this contradicted #19's own "identical celebration except one carve-out" reasoning already on record; #19's original design stands, formalized further as #23.)*

---

## Decisions — ✅ all signed off by parent

**#1–11 signed off 2026-07-07** (see git history / swarm.md): stack, wrong-tap feedback, local-midnight days, static OG image, come-back-card dino, ~~level ladder~~ *(superseded by #12)*, launch-date-on-go-live-day, title ladder, reload loophole accepted, no grown-ups panel before first round, ~30 dinos with open repeats.

**#12–16 signed off 2026-07-08** (from `learning-review.md` R1–R8 and the prototyping session):

12. **Developmental level ladder (supersedes #6; ladder extended by #24).** L1 "Tracks" = quantities 1–3, three targets. L2 "Tracks + numbers" = footprints AND numerals together, 1–5, five targets. L3 "Numbers" = numerals only 1–5. L4 = numerals 6–10. L5 = numerals 1–10, ten targets. L6+ deliberately undefined. *(Superseded by #24: a new "Tracks (more)" level was inserted between the original L1 and L2, shifting everything from the original L2 onward up by one — see BRD-1 for the current, six-level table.)* Full board specs in BRD-1.
13. **L1 mechanic: follow the tracks.** Footprint patches are scattered on the ground; correct taps in fewest-to-most order draw a dotted trail toward the nest.
14. **Number-word audio ships in MVP.** On each correct tap a recorded "hatchling voice" speaks the number word. Parent-produced recording; **no text-to-speech in the product**.
15. **Progressive reveal (supersedes single final reveal).** The day's one egg advances a crack stage with each correct tap (final stage = hatch). One species per day, identical for every player, is preserved.
16. **Discovery framing + parent prompt (MVP) + counting mission (Phase 2).** Celebration copy is revelation ("You found her!"), never prize language; no stars/trophies on child-facing surfaces. Success metric (advisory): the ritual sticks 30 consecutive mornings; he counts real things unprompted within 3 months; maintenance stays under ~1 hour/month.

**#17–18 signed off 2026-08-03** (from first-week use on the real device):

17. **Grown-ups entry is a plain tap (supersedes the long-press in GRN-1).** The 2 s continuous press proved unusable one-handed on a phone. **Accepted risk:** a child can tap in and change the level; the change applies from the next round and is reversible in seconds.
18. **Replays return, first attempt only (reverses the original once-a-day resolution).** A "Play again" control on both the results screen and the come-back card runs the round again with a fresh scatter and the same dinosaur, recording nothing. **What is preserved:** one species per day, one recorded result, one shared result, level-up driven only by first attempts. **What is given up:** the come-back card no longer ends the "AGAIN!" negotiation by itself; screen time is no longer bounded by the app.

**#19 signed off 2026-08-10** (parent request, after more real play):

19. **Retitle the accuracy ladder; add a perfect-round roar bonus.** `content/titles.json` labels no longer borrow dino-species names (was T-Rex/Triceratops/Stegosaurus/Brontosaurus by wrong-tap count) — that read as a second, competing "which dino" idea sitting next to the real daily-hatch dino. New ladder, same thresholds, still every tier positive, grown-up-facing only (unchanged from #8): **Roar-some round** (0 wrong), **Trailblazer round** (1), **Egg hunter round** (2–3), **Hatch day round** (4+). Separately, CEL-2's "identical celebration" rule gains its first carve-out: a perfect round (`wrongTaps === 0`) plays one extra beat — the hatched dino rears back for a big, mouth-open ROAR (enlarged scale/shake animation + a louder recorded "rawr," falling back to the standard rawr clip until the bonus one is recorded) — before settling into the normal dance. Every other child-facing element (species, discovery copy, dance length, timing) stays identical regardless of accuracy.

**#23 signed off 2026-08-28** (parent request, after testing the perfect-round roar):

23. **`rawr-big` gets a real recording and its own size budget; #19's design reaffirmed.** The perfect-round bonus clip is now `public/voice/Rawr-Pop.m4a` (65 KB) rather than the placeholder `rawr-big.m4a` name. Because the file is a multi-second celebratory roar rather than a one-word number clip, NFR-2's shared 25 KB voice budget is split: number words and the standard `rawr` stay ≤ 25 KB; `rawr-big` gets its own ≤ 70 KB ceiling. Along the way, the parent considered dropping the standard rawr entirely (perfect-round-only audio) as a stronger differentiation for the "Play again" habit; on review this would have quietly re-opened the exact scoreboard concern #19 already weighed and intentionally limited to one small, contained exception. #19's original design stands: AUD-5/AUD-6/CEL-2 behavior is unchanged — standard rawr plays every round (including every replay per #18), swapped for `rawr-big` only when `wrongTaps === 0`.

**#24 signed off 2026-08-29** (parent request):

24. **New level inserted between Tracks and Tracks + numbers.** L2 "Tracks (more)" is identical to L1 in every respect — footprint-only patches, no numerals, `scatter` layout in the nest scene, same wobble/hint/trail/audio behavior — except it has **5 targets (values 1–5)** instead of 3, and uses **≥ 88 px** target sizing (not L1's ≥ 100 px), matching the sizing already used at the numeral levels. The former L2–L5 (Tracks + numbers, Numbers, Bigger numbers, All numbers) shift to L3–L6; the ladder now runs six levels instead of five. Full board specs in the updated BRD-1.

Launch: cupofiq.com purchased and live; `LAUNCH_DATE` set to 2026-08-03 and now immutable (sign-off #7).

---

## 1. Daily Puzzle Selection (DPS)

- **DPS-1** WHEN the page loads, THE SYSTEM SHALL compute `dayNumber` as the number of device-local calendar days since the launch date, plus one, using no network call. WHEN the current date precedes the launch date, THE SYSTEM SHALL clamp `dayNumber` to 1.
- **DPS-2** WHEN `dayNumber` is computed, THE SYSTEM SHALL select the day's dinosaur as `dinos[(dayNumber - 1) % dinos.length]` from `content/dinos.json` checked into the repo, using a positive-modulo helper. The list MAY be shorter than 365 entries; species repeating on a cycle is accepted per sign-off #11.
- **DPS-3** WHEN the board is built for the day's first round at level *L* on day *N*, THE SYSTEM SHALL derive the assignment of values to layout slots from a seeded PRNG with seed `N * 100 + L`. Replays (LCK-5) SHALL use a different seed per attempt and are exempt.
- **DPS-4** WHEN the same day and level are loaded twice (including after refresh), THE SYSTEM SHALL produce an identical first-round board, dinosaur, title thresholds, parent prompt, and (Phase 2) counting mission.
- **DPS-5** THE SYSTEM SHALL make zero requests to any non-static endpoint; the daily puzzle SHALL be fully determined by the date and files in the repo.

## 2. Board Content per Level (BRD)

- **BRD-1** THE SYSTEM SHALL build the board from `boardSpecForLevel(level)` (design.md §3) according to this ladder:

| Level | Name (grown-ups panel) | Targets | Target face | Values | Layout | Min target size |
|---|---|---|---|---|---|---|
| 1 | Tracks | 3 footprint patches | 1 / 2 / 3 footprints, no numerals | [1, 2, 3] | `scatter3` + nest scene | **≥ 100 px** |
| 2 | Tracks (more) | 5 footprint patches | 1–5 footprints, no numerals | [1..5] | `scatter5` + nest scene | ≥ 88 px |
| 3 | Tracks + numbers | 5 eggs | numeral AND matching footprints | [1..5] | `quincunx5` | ≥ 88 px |
| 4 | Numbers | 5 eggs | numeral only | [1..5] | `quincunx5` | ≥ 88 px |
| 5 | Bigger numbers | 5 eggs | numeral only | [6..10] | `quincunx5` | ≥ 88 px |
| 6 | All numbers | 10 eggs | numeral only | [1..10] | `grid10` | ≥ 64 px |

- **BRD-2** WHEN the level is 1 or 2, THE SYSTEM SHALL render the nest with the day's egg at the top of the scene and the patches (three at L1, five at L2) at fixed scatter-slot positions (design.md §7b); the shuffle SHALL assign quantities to slots.
- **BRD-3** THE scatter-slot geometry (L1 and L2) SHALL be arranged such that the correct tap order is never inferable from spatial position alone.
- **BRD-4** WHEN the level is 3, each egg SHALL display the numeral and, beneath it, the matching count of small footprints.
- **BRD-5** WHEN a level beyond 6 is requested (corrupt storage), THE SYSTEM SHALL clamp to level 6.

## 3. Core Tap Sequence (TAP)

- **TAP-1** WHEN a round opens, THE SYSTEM SHALL display the level's targets (BRD-1) bearing their values in that round's arrangement; the round target starts at the lowest value and advances by one per correct tap.
- **TAP-2** THE SYSTEM SHALL render every target at no less than the minimum size in BRD-1, with adjacent targets separated by ≥ 12 px (L1: ≥ 24 px between patches).
- **TAP-3** WHEN the child taps the target bearing the lowest un-completed value, THE SYSTEM SHALL begin the stamp/crack feedback within 100 ms and mark that value complete.
- **TAP-4** WHEN a target is completed, THE SYSTEM SHALL keep it visibly completed and non-interactive for the rest of the round.
- **TAP-5** THE SYSTEM SHALL require no reading, no timers, and no drag gestures anywhere in the toddler play loop; single taps only.
- **TAP-6** WHILE any animation is playing, THE SYSTEM SHALL still register taps on other targets (no input lockout longer than 150 ms).

## 4. Trail and Progressive Reveal (TRL)

- **TRL-1** WHEN the Nth correct tap occurs at Level 1, THE SYSTEM SHALL fade in (≈ 600 ms) the Nth dotted trail segment.
- **TRL-2** WHEN a correct tap occurs at any level, THE SYSTEM SHALL advance the day-egg's reveal stage per this table, with a gentle nest/egg jiggle (≤ 450 ms):

| Board size | After tap 1 | 2 | 3 | 4 | 5 … 9 | final tap |
|---|---|---|---|---|---|---|
| 3 targets (L1) | crack A | crack B + eyes peek | **hatch** | — | — | — |
| 5 targets (L2–L5) | crack A | crack A grows | crack B | eyes peek | — | **hatch** |
| 10 targets (L6) | stages spread evenly: crack A after 2, crack B after 5, peek after 8 | | | | | **hatch** |

- **TRL-3** WHEN a patch is correctly tapped, its footprints SHALL darken ("stamped") with a brief pop (≈ 450 ms scale 1 → 1.18 → 1); stamped patches satisfy TAP-4.
- **TRL-4** THE reveal SHALL always complete in-round: the hatch occurs on the final correct tap regardless of `wrongTaps`.

## 5. Number-Word Audio (AUD)

- **AUD-1** WHEN a correct tap occurs, THE SYSTEM SHALL play the recorded number word matching the tapped value, starting within 150 ms; concurrent playback SHALL cut off the previous word rather than queue.
- **AUD-2** WHEN a correct tap occurs, THE SYSTEM SHALL also display the number word visually (word bubble, ≈ 1.4 s pop-and-fade) so muted play remains fully equivalent (FBK-5).
- **AUD-3** THE number-word audio SHALL be recorded human voice, produced by the parent and checked into the repo as static files; THE SYSTEM SHALL NOT use speech synthesis, and SHALL make no network requests for audio (NFR-3).
- **AUD-4** THE SYSTEM SHALL initialize/unlock the audio context on the first tap gesture, and SHALL lazy-load audio after first paint.
- **AUD-5** WHEN the hatch occurs, THE SYSTEM SHALL play the celebratory hatchling "rawr" for every round, at every accuracy and on every replay (CEL-2); WHEN the recorded round is perfect, THE SYSTEM SHALL play the bonus "rawr-big" variant instead (AUD-6, sign-off #19).
- **AUD-6** *(sign-off #19, asset finalized #23)* WHEN the bonus rawr plays, THE SYSTEM SHALL attempt the dedicated `rawr-big` recording (`Rawr-Pop.m4a`) and SHALL fall back to the standard `rawr` clip if the bonus file is not committed.

## 6. Incorrect-Tap Feedback (FBK)

- **FBK-1** WHEN the child taps a target out of order, THE SYSTEM SHALL play a gentle side-to-side wobble (≤ 600 ms) and a soft two-note "hmm?" chime, and SHALL return the target to its idle state.
- **FBK-2** WHEN an incorrect tap occurs, THE SYSTEM SHALL NOT display any text, red color, buzzer, X mark, or score visible to the child, and SHALL NOT reset completed targets, regress the trail or reveal stage, or block further taps.
- **FBK-3** WHEN 3 consecutive incorrect taps occur while the same value is the target, THE SYSTEM SHALL make the correct target perform a slow, gentle bounce every 4 seconds until it is tapped.
- **FBK-4** THE SYSTEM SHALL count each incorrect tap into `wrongTaps` without surfacing the count until the results screen. On a replay the count SHALL be discarded (LCK-5).
- **FBK-5** WHEN the device is muted, all feedback SHALL remain fully understandable from animation alone — including the perfect-round roar beat (sign-off #19), which carries via the enlarged shake + burst text with no audio required.

## 7. Completion, Reveal, and Celebration (REV / CEL)

- **REV-1** WHEN the final target is tapped correctly, THE SYSTEM SHALL complete the hatch within 1 second, revealing the day's dinosaur emerging from the day egg (shell pieces visible).
- **REV-2** THE SYSTEM SHALL reveal the identical dinosaur species to every player on the same `dayNumber`, regardless of level, accuracy, or attempt number.
- **REV-3** WHEN the reveal begins, THE SYSTEM SHALL use discovery framing: "You found her!" / "Look who was inside!" plus the friendly display name. Prize language SHALL NOT appear on child-facing surfaces.
- **CEL-1** WHEN the reveal completes, THE SYSTEM SHALL play a dancing-dino animation of 4–8 seconds with a cheerful sound.
- **CEL-2** THE SYSTEM SHALL play the identical child-facing celebration regardless of `wrongTaps` or attempt number, with one exception (sign-off #19): WHEN the recorded `wrongTaps` is 0, THE SYSTEM SHALL additionally play a brief bonus beat — an enlarged roar animation plus the bonus "rawr-big" sound (AUD-6) — before the standard dance begins. Accuracy SHALL alter no other child-facing element.
- **CEL-3** WHEN the celebration ends, THE SYSTEM SHALL transition automatically to the results screen with no tap required.

## 8. Stats, Sharing, and Parent Prompts (SHR / PRM)

- **SHR-1** WHEN the results screen renders, THE SYSTEM SHALL show the day's **recorded first attempt**: today's dinosaur, `wrongTaps`, the accuracy title per the ladder in `content/titles.json` (sign-off #19), and the level played. A replay SHALL NOT change any of these.
- **SHR-2** WHEN the recorded `wrongTaps` is 0, THE SYSTEM SHALL show distinct perfect-round treatment on grown-up surfaces only: confetti burst, ⭐ badge, and progress toward level-up.
- **SHR-3** WHEN the share button is tapped and the Web Share API is available, THE SYSTEM SHALL invoke the native share sheet with a plain-text result including: product name, day number, dinosaur, title, wrong-tap count, and https://cupofiq.com. At Level 1 the text MAY include the story line "We followed the tracks."
- **SHR-4** WHEN the Web Share API is unavailable, THE SYSTEM SHALL copy the same text to the clipboard and confirm with a brief "Copied!" toast; a separate always-visible Copy button SHALL do the same.
- **SHR-5** THE SYSTEM SHALL transmit nothing anywhere except via the user-invoked share sheet or clipboard.
- **SHR-6** WHEN the shared link is unfurled by a messaging app, the page SHALL present static OG title, description, and image tags producing an attractive preview.
- **SHR-7** *(added 2026-08-15, drafted alongside Puzzle mode's spec)* WHEN the results screen renders after the day's first (recorded) round, THE SYSTEM SHALL show a short, permanent line noting that a new dinosaur species arrives tomorrow — e.g. "🥚 Tomorrow: a new dinosaur to find!" — distinct from same-day replays (LCK-5), which reuse today's already-hatched species rather than a new one. Always shown, no dismiss action, no first-time-only logic, no new localStorage state. (Originally scoped as a fix for "no once-a-day context before the first round"; adapted here since sign-off #18 already made replays — not a hard lock — the actual current behavior.)
- **PRM-1** WHEN the results screen renders, THE SYSTEM SHALL show one grown-up-facing prompt selected deterministically as `prompts[(dayNumber - 1) % prompts.length]` from `content/prompts.json`.

## 9. Once-a-Day Lock, Replays, and Missions (LCK / MSN)

- **LCK-1** WHEN today's round has already been completed on this device, THE SYSTEM SHALL open on the come-back card rather than the board.
- **LCK-2** THE come-back card SHALL contain no interactive elements other than the share/copy controls, the grown-ups control, and the Play again control (LCK-5).
- **LCK-3** WHEN the device-local date changes to a new day, THE SYSTEM SHALL present the new day's puzzle on next load with no residual lock.
- **LCK-4** WHEN a round is in progress and the page is reloaded the same day, THE SYSTEM SHALL restart that round from the beginning, and this SHALL not count as a completed day. (Accepted per sign-off #9.)
- **LCK-5** *(sign-off #18)* WHEN the Play again control is pressed, THE SYSTEM SHALL run a further round at the current level with a freshly shuffled arrangement and the same dinosaur, and SHALL record nothing. Replays SHALL be indistinguishable from the first round to the child (CEL-2, including the perfect-round roar bonus if the replay itself is perfect — the bonus is a per-round celebration, not a once-a-day one).
- **MSN-1** *(Phase 2)* WHEN the come-back card renders, THE SYSTEM SHALL show the day's real-world counting mission from `content/missions.json`.

## 10. Progression and Levels (PRG)

- **PRG-1** WHEN the day's **first** round completes with `wrongTaps` = 0, THE SYSTEM SHALL increment `perfectsAtLevel`. Replays SHALL never increment it (LCK-5).
- **PRG-2** WHEN `perfectsAtLevel` reaches 3, THE SYSTEM SHALL set `level = level + 1` (capped at level 6) and reset `perfectsAtLevel` to 0, effective the next day.
- **PRG-3** WHEN a level-up is earned, THE SYSTEM SHALL announce it only on grown-up-facing surfaces.
- **PRG-4** WHEN the grown-ups panel sets a level manually, THE SYSTEM SHALL apply it from the next un-played round and reset `perfectsAtLevel` to 0.
- **PRG-5** A non-perfect round SHALL never decrease `level` or `perfectsAtLevel`.

## 11. Grown-Ups Panel (GRN)

- **GRN-1** WHEN the "For grown-ups" control is tapped, THE SYSTEM SHALL open the grown-ups panel (plain tap per sign-off #17).
- **GRN-2** THE panel SHALL offer exactly: level picker, sound on/off, reset-all-progress (with confirm), and a privacy note.
- **GRN-3** WHEN reset is confirmed, THE SYSTEM SHALL clear the app's localStorage namespace and reload to a fresh state.

## 12. Non-Functional (NFR)

- **NFR-1 (toddler usability)** All child-facing interactions SHALL work with imprecise single taps; no hover, double-tap, drag, or text comprehension required.
- **NFR-2 (performance)** First playable render SHALL occur within 2 s on a mid-range phone over fast 3G; total initial transfer ≤ 300 KB gzipped. Each dino image SHALL be WebP and ≤ 60 KB. Audio files SHALL be lazy-loaded after first paint; number-word and standard-rawr clips ≤ 25 KB each. The perfect-round bonus `rawr-big` clip gets its own ≤ 70 KB budget instead (sign-off #23) — it is a longer celebratory beat, not a one-word tap sound, and the real recording (`Rawr-Pop.m4a`) does not fit the 25 KB tap-sound ceiling.
- **NFR-3 (privacy / no PII)** THE SYSTEM SHALL set no cookies, load no analytics, fonts, or third-party scripts, and make no network requests other than fetching its own static assets.
- **NFR-4 (cost / hosting)** THE SYSTEM SHALL deploy as static files to free hosting.
- **NFR-5 (simplicity guardrails)** THE SYSTEM SHALL contain no database, backend, accounts, login, CMS, feed, chat, leaderboard, collection screen, timer, or ad — permanently.
- **NFR-6 (maintenance)** Adding a new daily dinosaur SHALL require only appending one JSON entry and one image.
- **NFR-7 (resilience)** WHEN localStorage is unavailable, THE SYSTEM SHALL still run today's round normally and degrade gracefully.
