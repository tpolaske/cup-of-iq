# Cup of IQ — Requirements (v2, 2026-07-08)

## Product Vision

Cup of IQ is a free, ad-free, dead-simple daily ritual: one puzzle per day, every day, for a growing kid — starting as a dino-tracking counting game for a 2.5-year-old. It is equally a cute family morning moment and a real skill-builder; neither excuses the other, and as of v2 the skill-building is grounded in early-numeracy research (see `learning-review.md`).

Each morning at Level 1, the page shows a nest with today's egg and, scattered below it, three patches of dino footprints — one print, two prints, three prints, in mixed-up positions. The child taps the patches from fewest prints to most. Each correct tap stamps the patch, **draws a dotted trail one step closer to the nest**, makes the egg jiggle and crack a little more (eyes peek out at step two!), and a squeaky **hatchling voice speaks the number word** ("One!"). The last step lands at the nest and the day's dinosaur — a surprise species, deterministic from the date — hatches: *"You found her! A baby stegosaurus!"*, followed by a short dance. The story is coherent on purpose: **follow the tracks, find the egg.** Counting is what builds the path. That surprise is the reason he asks to play tomorrow.

Wrong taps get a warm, wordless wobble and a soft "hmm?" — no penalty feeling, no limit on retries, and after three misses on the same target the correct patch begins a slow, patient bounce. Higher levels graduate along a developmental ladder: footprints paired with numerals, then numerals alone on speckled eggs — carrying the same child from age 2.5 to roughly 6 (see BRD-1).

It is strictly once a day. After the celebration, the results screen shows a grown-up-facing dino title based on accuracy (0 wrong = T-Rex round, 1 = Triceratops, 2–3 = Stegosaurus, 4+ = Brontosaurus — every tier positive), one small rotating **parent prompt** ("Try together: count his fingers to 3 today"), and a one-tap share/copy of a plain-text result. Reopening the page later that day shows only a gentle card with today's hatched dino, "new egg tomorrow," and (Phase 2) a real-world **counting mission** ("find 3 spoons at breakfast") that gives the "AGAIN!" energy somewhere to go — off-screen, with real objects. There is no replay, no collection shelf, no leaderboard, no accounts, no chat, no timers.

Progression is the parent's own design: three perfect rounds (zero wrong taps) at a level advance the child to the next level, always effective tomorrow, never mid-ritual. A hidden grown-ups panel can override the level at any time. Letters, shapes, and an eventual real word game are future modes. The whole thing is static files and localStorage: no backend, no cost, no maintenance burden, built by one parent for one kid first.

**Disagreements log:** Claude proposed replayable-with-first-attempt-counting; parent chose strict once-a-day — resolved with the static-dino "come back tomorrow" card. Claude proposed a dino collection shelf; parent chose leaner — dropped. Parent proposed SAT/adult modes; Claude pushed back — parked. Parent proposed ABCs as Level 3; moved to Mode 2 (Letters). Parent proposed dino titles per accuracy; adopted, grown-up-facing only. **v2 additions:** parent proposed per-tap hatches with a 5-dino dance party; revised to a progressive reveal of one dino after the learning review flagged content cost and reward-overload (per-tap *progress*, not per-tap *jackpots*). Claude proposed footprints printed on eggs; parent flagged the broken metaphor ("footprints opening an egg doesn't make sense"); resolved as tracks-on-the-ground drawn into a trail — the fiction now matches the mechanic. Original numerals-first L1 replaced by the quantity-first developmental ladder per `learning-review.md`.

---

## Decisions — ✅ all signed off by parent

**#1–11 signed off 2026-07-07** (see git history / swarm.md): stack, wrong-tap feedback, local-midnight days, static OG image, come-back-card dino, ~~level ladder~~ *(superseded by #12)*, launch-date-on-go-live-day, title ladder, reload loophole accepted, no grown-ups panel before first round, ~30 dinos with open repeats.

**#12–16 signed off 2026-07-08** (from `learning-review.md` R1–R8 and the prototyping session):

12. **Developmental level ladder (supersedes #6).** L1 "Tracks" = quantities 1–3, three targets. L2 "Tracks + numbers" = footprints AND numerals together, 1–5, five targets. L3 "Numbers" = numerals only 1–5 (the original L1). L4 = numerals 6–10. L5 = numerals 1–10, ten targets. L6+ deliberately undefined. Full board specs in BRD-1.
13. **L1 mechanic: follow the tracks.** Footprint patches are scattered on the ground (never spatially ordered start-to-nest); correct taps in fewest-to-most order draw a dotted trail toward the nest. The quantities must be the only way to know the next step — the trail is the reward for counting, not a substitute for it.
14. **Number-word audio ships in MVP.** On each correct tap a recorded "hatchling voice" (squeaky, childlike, Land-Before-Time-adjacent) speaks the number word. Parent-produced recording; **no text-to-speech in the product** (the prototype's TTS is a stand-in only). The wrong-tap voice line ("not that one yet") remains deferred to Phase 2 — that one is decoration; this one is curriculum.
15. **Progressive reveal (supersedes single final reveal).** The day's one egg advances a crack stage with each correct tap (final stage = hatch). One species per day, identical for every player, is preserved; the 5-species-per-day variant is rejected.
16. **Discovery framing + parent prompt (MVP) + counting mission (Phase 2).** Celebration copy is revelation ("You found her!"), never prize language; no stars/trophies on child-facing surfaces. Results screen shows one rotating parent prompt. The comeback card gains a daily real-world counting mission in Phase 2. Success metric (advisory): the ritual sticks 30 consecutive mornings; he counts real things unprompted within 3 months; maintenance stays under ~1 hour/month.

Remaining pre-build blocker: **purchase cupofiq.com** (tasks.md Phase −1). `LAUNCH_DATE` is set on go-live day.

---

## 1. Daily Puzzle Selection (DPS)

- **DPS-1** WHEN the page loads, THE SYSTEM SHALL compute `dayNumber` as the number of device-local calendar days since the launch date, plus one, using no network call. WHEN the current date precedes the launch date, THE SYSTEM SHALL clamp `dayNumber` to 1 (a negative or zero value would otherwise produce a negative array index in DPS-2 and break the board).
- **DPS-2** WHEN `dayNumber` is computed, THE SYSTEM SHALL select the day's dinosaur as `dinos[(dayNumber - 1) % dinos.length]` from `content/dinos.json` checked into the repo, using a positive-modulo helper. The list MAY be shorter than 365 entries; species repeating on a cycle is accepted per sign-off #11.
- **DPS-3** WHEN the board is built for level *L* on day *N*, THE SYSTEM SHALL derive the assignment of values to layout slots from a seeded PRNG with seed `N * 100 + L`, so every device at the same level sees the identical arrangement that day.
- **DPS-4** WHEN the same day and level are loaded twice (including after refresh), THE SYSTEM SHALL produce an identical board, dinosaur, title thresholds, parent prompt, and (Phase 2) counting mission.
- **DPS-5** THE SYSTEM SHALL make zero requests to any non-static endpoint; the daily puzzle SHALL be fully determined by the date and files in the repo.

## 2. Board Content per Level (BRD)

- **BRD-1** THE SYSTEM SHALL build the board from `boardSpecForLevel(level)` (design.md §3) according to this ladder:

| Level | Name (grown-ups panel) | Targets | Target face | Values | Layout | Min target size |
|---|---|---|---|---|---|---|
| 1 | Tracks | 3 footprint patches | 1 / 2 / 3 footprints, no numerals | [1, 2, 3] | `scatter3` + nest scene | **≥ 100 px** |
| 2 | Tracks + numbers | 5 eggs | numeral AND matching footprints | [1..5] | `quincunx5` | ≥ 88 px |
| 3 | Numbers | 5 eggs | numeral only | [1..5] | `quincunx5` | ≥ 88 px |
| 4 | Bigger numbers | 5 eggs | numeral only | [6..10] | `quincunx5` | ≥ 88 px |
| 5 | All numbers | 10 eggs | numeral only | [1..10] | `grid10` | ≥ 64 px |

- **BRD-2** WHEN the level is 1, THE SYSTEM SHALL render the nest with the day's egg at the top of the scene and the three patches at fixed scatter-slot positions (design.md §7b); the daily shuffle (DPS-3) SHALL assign quantities to slots.
- **BRD-3** THE scatter-slot geometry SHALL be arranged such that the correct tap order is never inferable from spatial position alone (no assignment of quantities to slots may produce a visually straight or monotonic bottom-to-top path). The counting is the puzzle; the trail is the reward.
- **BRD-4** WHEN the level is 2, each egg SHALL display the numeral and, beneath it, the matching count of small footprints, so the symbol and the quantity are always seen together.
- **BRD-5** WHEN a level beyond 5 is requested (corrupt storage), THE SYSTEM SHALL clamp to level 5.

## 3. Core Tap Sequence (TAP)

- **TAP-1** WHEN a new day's puzzle opens, THE SYSTEM SHALL display the level's targets (BRD-1) bearing their values in the daily arrangement; the round target starts at the lowest value and advances by one per correct tap.
- **TAP-2** THE SYSTEM SHALL render every target at no less than the minimum size in BRD-1, with adjacent targets separated by ≥ 12 px (L1: ≥ 24 px between patches).
- **TAP-3** WHEN the child taps the target bearing the lowest un-completed value, THE SYSTEM SHALL begin the stamp/crack feedback within 100 ms and mark that value complete.
- **TAP-4** WHEN a target is completed, THE SYSTEM SHALL keep it visibly completed (stamped prints / cracked egg) and non-interactive for the rest of the round.
- **TAP-5** THE SYSTEM SHALL require no reading, no timers, and no drag gestures anywhere in the toddler play loop; single taps only.
- **TAP-6** WHILE any animation is playing, THE SYSTEM SHALL still register taps on other targets (no input lockout longer than 150 ms).

## 4. Trail and Progressive Reveal (TRL)

- **TRL-1** WHEN the Nth correct tap occurs at Level 1, THE SYSTEM SHALL fade in (≈ 600 ms) the Nth dotted trail segment, connecting the previous waypoint (or the start, for N = 1) to the tapped patch; the final segment SHALL terminate at the nest.
- **TRL-2** WHEN a correct tap occurs at any level, THE SYSTEM SHALL advance the day-egg's reveal stage per this table, with a gentle nest/egg jiggle (≤ 450 ms):

| Board size | After tap 1 | 2 | 3 | 4 | 5 … 9 | final tap |
|---|---|---|---|---|---|---|
| 3 targets (L1) | crack A | crack B + eyes peek | **hatch** | — | — | — |
| 5 targets (L2–L4) | crack A | crack A grows | crack B | eyes peek | — | **hatch** |
| 10 targets (L5) | stages spread evenly: crack A after 2, crack B after 5, peek after 8 | | | | | **hatch** |

- **TRL-3** WHEN a patch is correctly tapped, its footprints SHALL darken ("stamped") with a brief pop (≈ 450 ms scale 1 → 1.18 → 1); stamped patches satisfy TAP-4.
- **TRL-4** THE reveal SHALL always complete in-round: the hatch occurs on the final correct tap regardless of `wrongTaps` (REV/CEL unchanged in spirit — one identical child-facing outcome).

## 5. Number-Word Audio (AUD)

- **AUD-1** WHEN a correct tap occurs, THE SYSTEM SHALL play the recorded number word matching the tapped value, starting within 150 ms; concurrent playback SHALL cut off the previous word rather than queue.
- **AUD-2** WHEN a correct tap occurs, THE SYSTEM SHALL also display the number word visually (word bubble, ≈ 1.4 s pop-and-fade) so muted play remains fully equivalent (FBK-5).
- **AUD-3** THE number-word audio SHALL be recorded human voice ("hatchling voice": pitched-up, playful, childlike), produced by the parent and checked into the repo as static files; THE SYSTEM SHALL NOT use speech synthesis, and SHALL make no network requests for audio (NFR-3).
- **AUD-4** THE SYSTEM SHALL initialize/unlock the audio context on the first tap gesture (iOS/Android requirement), and SHALL lazy-load audio after first paint so NFR-2's first-render budget is unaffected.
- **AUD-5** WHEN the hatch occurs, THE SYSTEM SHALL play the celebratory hatchling "rawr" — identical every day and at every accuracy (CEL-2).

## 6. Incorrect-Tap Feedback (FBK)

- **FBK-1** WHEN the child taps a target out of order, THE SYSTEM SHALL play a gentle side-to-side wobble (≤ 600 ms) and a soft two-note "hmm?" chime, and SHALL return the target to its idle state.
- **FBK-2** WHEN an incorrect tap occurs, THE SYSTEM SHALL NOT display any text, red color, buzzer, X mark, or score visible to the child, and SHALL NOT reset completed targets, regress the trail or reveal stage, or block further taps.
- **FBK-3** WHEN 3 consecutive incorrect taps occur while the same value is the target, THE SYSTEM SHALL make the correct target perform a slow, gentle bounce every 4 seconds until it is tapped.
- **FBK-4** THE SYSTEM SHALL count each incorrect tap into `wrongTaps` without surfacing the count until the results screen.
- **FBK-5** WHEN the device is muted, all feedback SHALL remain fully understandable from animation alone.

## 7. Completion, Reveal, and Celebration (REV / CEL)

- **REV-1** WHEN the final target is tapped correctly, THE SYSTEM SHALL complete the hatch within 1 second, revealing the day's dinosaur emerging from the day egg (shell pieces visible).
- **REV-2** THE SYSTEM SHALL reveal the identical dinosaur species to every player on the same `dayNumber`, regardless of level or accuracy.
- **REV-3** WHEN the reveal begins, THE SYSTEM SHALL use discovery framing: "You found her!" / "Look who was inside!" plus the friendly display name ("A baby stegosaurus!"). Prize language ("You win!", stars, trophies, applause tracks) SHALL NOT appear on child-facing surfaces.
- **CEL-1** WHEN the reveal completes, THE SYSTEM SHALL play a dancing-dino animation of 4–8 seconds with a cheerful sound.
- **CEL-2** THE SYSTEM SHALL play the identical child-facing celebration regardless of `wrongTaps`; accuracy SHALL alter only grown-up-facing surfaces.
- **CEL-3** WHEN the celebration ends, THE SYSTEM SHALL transition automatically to the results screen with no tap required.

## 8. Stats, Sharing, and Parent Prompts (SHR / PRM)

- **SHR-1** WHEN the results screen renders, THE SYSTEM SHALL show: today's dinosaur, `wrongTaps`, the dino title per the ladder (0 → T-Rex; 1 → Triceratops; 2–3 → Stegosaurus; 4+ → Brontosaurus), and current level.
- **SHR-2** WHEN `wrongTaps` is 0, THE SYSTEM SHALL show distinct perfect-round treatment on grown-up surfaces only: confetti burst, ⭐ badge, and progress toward level-up (e.g., "2 of 3 perfect days").
- **SHR-3** WHEN the share button is tapped and the Web Share API is available, THE SYSTEM SHALL invoke the native share sheet with a plain-text result including: product name, day number, dinosaur, title, wrong-tap count, and https://cupofiq.com. At Level 1 the text MAY include the story line "We followed the tracks."
- **SHR-4** WHEN the Web Share API is unavailable, THE SYSTEM SHALL copy the same text to the clipboard and confirm with a brief "Copied!" toast; a separate always-visible Copy button SHALL do the same.
- **SHR-5** THE SYSTEM SHALL transmit nothing anywhere except via the user-invoked share sheet or clipboard; share text SHALL contain no name, age, or other PII beyond what the parent chooses to append themselves.
- **SHR-6** WHEN the shared link is unfurled by a messaging app, the page SHALL present static OG title, description, and image tags producing an attractive preview.
- **PRM-1** WHEN the results screen renders, THE SYSTEM SHALL show one grown-up-facing prompt selected deterministically as `prompts[(dayNumber - 1) % prompts.length]` from `content/prompts.json` (e.g., "Try together: count his fingers to 3 today").

## 9. Once-a-Day Lock and Missions (LCK / MSN)

- **LCK-1** WHEN today's round has already been completed on this device, THE SYSTEM SHALL show the come-back card instead of the game: today's dino pictured statically, a warm "New egg tomorrow" message, and the share/copy controls for today's result.
- **LCK-2** THE come-back card SHALL contain no replay affordance and no interactive toy elements.
- **LCK-3** WHEN the device-local date changes to a new day, THE SYSTEM SHALL present the new day's puzzle on next load with no residual lock.
- **LCK-4** WHEN a round is in progress and the page is reloaded the same day, THE SYSTEM SHALL restart that day's round from the beginning (in-progress state is not persisted), and this SHALL not count as a completed day. (Accepted per sign-off #9.)
- **MSN-1** *(Phase 2)* WHEN the come-back card renders, THE SYSTEM SHALL show the day's real-world counting mission selected as `missions[(dayNumber - 1) % missions.length]` from `content/missions.json` (e.g., "Today's mission: find 3 spoons at breakfast 🥄🥄🥄"), matched to the child's current level range where practical.

## 10. Progression and Levels (PRG)

- **PRG-1** WHEN a round completes with `wrongTaps` = 0, THE SYSTEM SHALL increment `perfectsAtLevel`.
- **PRG-2** WHEN `perfectsAtLevel` reaches 3, THE SYSTEM SHALL set `level = level + 1` (capped at level 5) and reset `perfectsAtLevel` to 0, effective the next day; today's completed round SHALL be unaffected.
- **PRG-3** WHEN a level-up is earned, THE SYSTEM SHALL announce it only on grown-up-facing surfaces (results screen and come-back card: "Tracks + numbers starts tomorrow!").
- **PRG-4** WHEN the grown-ups panel sets a level manually, THE SYSTEM SHALL apply it from the next un-played round and reset `perfectsAtLevel` to 0.
- **PRG-5** A non-perfect round SHALL never decrease `level` or `perfectsAtLevel`.

## 11. Grown-Ups Panel (GRN)

- **GRN-1** WHEN the "For grown-ups" control on the results screen or come-back card is pressed and held for 2 continuous seconds, THE SYSTEM SHALL open the grown-ups panel; a plain tap SHALL do nothing. There is deliberately no panel entry point on the game screen; the first-ever round runs on defaults (Level 1, sound on) per sign-off #10.
- **GRN-2** THE panel SHALL offer exactly: level picker showing the five levels by their plain-language names from BRD-1, sound on/off, reset-all-progress (with confirm), and a privacy note stating that all data lives on this device.
- **GRN-3** WHEN reset is confirmed, THE SYSTEM SHALL clear the app's localStorage namespace and reload to a fresh state.

## 12. Non-Functional (NFR)

- **NFR-1 (toddler usability)** All child-facing interactions SHALL work with imprecise single taps; no hover, double-tap, drag, or text comprehension required; target sizes and gaps per BRD-1/TAP-2.
- **NFR-2 (performance)** First playable render SHALL occur within 2 s on a mid-range phone over fast 3G; total initial transfer including today's dino image SHALL be ≤ 300 KB gzipped. Each dino image SHALL be WebP and ≤ 60 KB. Audio files SHALL be lazy-loaded after first paint; each ≤ 25 KB (see design.md §9), so the number-word set does not count against the first-render budget.
- **NFR-3 (privacy / no PII)** THE SYSTEM SHALL set no cookies, load no analytics, fonts, or third-party scripts, and make no network requests other than fetching its own static assets. Voice audio is static files in the repo — never a speech API.
- **NFR-4 (cost / hosting)** THE SYSTEM SHALL deploy as static files to free hosting; recurring cost SHALL be the domain name only; deploying SHALL require nothing beyond `git push`.
- **NFR-5 (simplicity guardrails)** THE SYSTEM SHALL contain no database, backend, accounts, login, CMS, feed, chat, leaderboard, collection screen, timer, or ad — permanently.
- **NFR-6 (maintenance)** Adding a new daily dinosaur SHALL require only appending one JSON entry and one image; adding a prompt or mission SHALL require only appending one string; adding a future mode SHALL require only a new route and content file.
- **NFR-7 (resilience)** WHEN localStorage is unavailable (private browsing), THE SYSTEM SHALL still run today's round normally and degrade gracefully: no lock, no level persistence, share still works.
