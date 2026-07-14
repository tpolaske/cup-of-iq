# Cup of IQ — Learning Science Review (learning-review.md)

*Date: 2026-07-08 · Author: Product Manager (with "toddler teacher" consult) · Inputs: requirements.md, design.md, the two interactive prototypes, and external research on early-numeracy development, Montessori toddler methods, and educational-app design*

---

## Verdict

**The architecture is right; the Level 1 content is aimed ~18–24 months ahead of a 2.5-year-old.** The daily ritual, the wordless no-penalty feedback, and the parent-lap co-play are strongly supported by the research — better supported, in fact, than most commercial "educational" apps. But the core task (recognize numerals 1–5 and order them ascending) sits at the top of the early-numeracy ladder, not the bottom. The fix is a content change to the level ladder, not an architectural change: **start with quantities (dots), pair quantities with numerals next, and make today's numerals-only board Level 3.** One new feature (number-word audio) moves from "polish" to "core learning mechanic."

---

## 1. What the research says

### 1a. How number sense actually develops (the ladder)

Early numeracy is a staircase with a well-documented order. Approximate ages vary by child, but the *sequence* doesn't:

| Skill | Typical emergence | What it looks like |
|---|---|---|
| Rote counting (saying "1, 2, 3…" as a chant) | ~2 | Often out of order, skipped numbers; it's a song, not math |
| **Subitizing 1–3** (instantly seeing "three-ness" without counting) | **2–4** | Glances at 3 dots and knows it's three |
| **One-to-one correspondence** (one number word per object) | **~2 begins; solid 3–4** | Touches each cracker: "one, two, three" |
| Cardinality (the last number said = how many there are) | ~4 | Counts 6 blocks, answers "six" when asked how many |
| **Numeral recognition** (the squiggle "3" has a name) | **3–4** | Points at "3" and says "three" |
| **Numeral → quantity mapping** (the squiggle "3" *means* ●●●) | **4–5** | Hands you 3 crayons when shown "3" |
| Ordering numerals (ascending sequence of symbols) | 4–5+ | Arranges 1–5 correctly |

**Implication:** our current L1 (tap numerals 1–5 in ascending order) requires the *last two rows* of this table. A typical 2.5-year-old is living in rows 1–3. The likely Day-1 experience as spec'd: he taps randomly, the hint bounce does all the work, and he learns "tap the bouncing egg" — which is a fine game, but the learning target is missed. The game would effectively begin working *for real* around age 4.

### 1b. What Montessori adds (the toddler-teacher consult)

Distilled from Montessori toddler-curriculum sources, as a teacher would put it to us:

1. **Concrete before abstract — always.** Children learn quantity with tangible/visible things (rods, beads, counters, objects) before ever meeting the written symbol. "Only once they grasp the concept in the concrete do we introduce the abstract number symbols." A numeral on an egg is pure abstraction; dots (or tiny dino footprints) on an egg is quantity made visible.
2. **Isolation of difficulty.** One new challenge at a time. Five brand-new symbols at once violates this; three quantities (1–3, the subitizing range) honors it. Montessori materials routinely start at 1–3 before 1–10.
3. **Control of error.** The material tells the child, gently and immediately, when something is off — no adult correction, no shame. *Our wobble is exactly this. Keep it precisely as designed.*
4. **Repetition is the mechanism.** Toddlers repeat an activity until an internal construction completes, then move on by themselves. A strict once-per-day lock is adult-friendly but developmentally unusual — one round is a very small dose of practice.
5. **Intrinsic over extrinsic reward.** Montessori avoids stickers, prizes, and applause; the deep reward is "I did it myself." Celebration isn't forbidden — delight is fine — but the reward shouldn't become the point, and it should never differentiate performance in front of the child (our CEL-2 already gets this right).
6. **The adult is a guide, not a corrector.** The best moments are shared: counting aloud together, naming together. Design *for the lap*, not for the solo child.

### 1c. What educational-app research adds

The dominant framework (Hirsh-Pasek, Zosh et al., *Putting Education in "Educational" Apps*) says an app is educational only when it supports four pillars, and a 2021 study of 100 top "educational" apps found most fail at them:

| Pillar | Meaning | Cup of IQ today |
|---|---|---|
| **Active** | Minds-on effort, not passive tapping | ✅ Mostly — but if the hint bounce carries a too-hard task, tapping becomes passive |
| **Engaged** | Staying in the learning flow; no distracting bells/whistles | ✅ Strong (no ads, no menus) — ⚠️ celebration length/flash must not overwhelm the 20 seconds of actual learning |
| **Meaningful** | Connects to what the child already knows | ⚠️ Weakest pillar: bare numerals connect to nothing a 2.5-year-old knows; quantities do |
| **Socially interactive** | Learning with a responsive human | ✅ Our superpower: lap-play ritual, fun-fact read-alouds, family share loop |

Also relevant: AAP guidance for ages 2–5 emphasizes small amounts of high-quality media **co-viewed with a parent** — a 90-second daily round with a parent is close to a best-case screen-time pattern. The once-a-day lock is defensible on these grounds; see R6 for the tension with Montessori repetition and the proposed valve.

---

## 2. Prototype review against the research

### What the current design gets right (don't touch)

- **Wobble + no penalty + retry forever (FBK-1/2):** textbook control of error. The soft "hmm?" with no red/X/buzzer is exactly what a Montessori teacher would spec.
- **Identical child-facing celebration regardless of accuracy (CEL-2):** protects the child from performance judgment; accuracy stays a grown-up concern. Rare and correct.
- **One puzzle, zero menus, nothing else on screen:** isolation of the activity; supports the "engaged" pillar.
- **The ritual + comeback card:** predictable daily rhythm is deeply Montessori (order, routine) and the defined ending protects both the ritual and screen-time limits.
- **Parent-lap design (fun facts read aloud, share to family):** the social pillar most apps miss.

### Where the research pushes back

- **P1 — The core task is developmentally early (High).** Numeral ordering is a 4–5-year-old skill. As-is, Day 1 risks either frustration or hint-carried pseudo-play. (§1a)
- **P2 — Symbols before quantities inverts Montessori's core sequence (High).** There is no quantity anywhere in the game today; the numeral is the only content. (§1b-1)
- **P3 — Five new symbols at once (Medium).** Violates isolation of difficulty; the subitizing-friendly starting set is 1–3. (§1b-2)
- **P4 — No number words spoken (Medium).** The tap is the perfect moment to bind act → quantity → word ("Two!"). Voice was deferred to Phase 2 as a *comfort* feature ("not that one yet"); number-word audio is a different thing — it's a *learning* feature, arguably the highest-value audio in the app.
- **P5 — The per-tap dance-party variant cuts both ways (Medium).** The instinct (reward every correct tap) is right for this age; the implementation (5 species hatch + long party) risks the "engaged" pillar — the reward spectacle can swamp the 20 seconds of thinking — and quintuples content cost (5 species/day turns a 30-dino runway into 6 days). Keep per-tap *progress*, not per-tap *jackpots*.
- **P6 — Once-a-day vs. repetition (Medium, a real tradeoff).** Montessori says repetition is how the construction happens; AAP/ritual logic says keep the dose small. Both are right. The valve: give the "AGAIN!" energy a *real-world* target (see R6) — Montessori sources are unanimous that counting stairs, spoons, and crackers is the best toddler math there is.

---

## 3. Recommendations

### R1 (High) — Rebuild the level ladder developmentally; architecture unchanged

The level system already exists (PRG, GRN level picker, `numbersForLevel()`); we're re-aiming its content:

| New level | Board | Skill targeted | Roughly |
|---|---|---|---|
| **L1 "Footprints"** | **3 eggs** showing **1 / 2 / 3 dino footprints** (dots), no numerals. Tap fewest → most. | Subitizing, quantity ordering, one-to-one | 2–3 yrs |
| **L2 "Footprints + numbers"** | 5 eggs, **numeral AND matching footprints together** (1–5). Tap in order. | Numeral↔quantity binding | 3–4 yrs |
| **L3 "Numbers"** | 5 eggs, numerals only, 1–5 *(today's L1)* | Numeral recognition + ordering | 4–5 yrs |
| **L4** | numerals 6–10 *(today's L2)* | | 5+ |
| **L5** | numerals 1–10, ten eggs *(today's L3)* | | 5–6 |

Code impact is small: `numbersForLevel()` gains two rows; `board.ts` gets an egg-face renderer that can draw footprints, footprints+numeral, or numeral. The 3-perfect-days auto-level-up and the grown-ups override work unchanged — and the ladder now carries him from 2.5 to ~6 instead of starting at 4. Sign-off #6's "L4+ undefined" simply becomes "L6+ undefined."

### R2 (High) — Add number-word audio on correct taps to MVP

On each correct tap, a warm recorded voice says the number word ("One!" … "Three!"), ideally in the parent's own recorded voice (a 5-minute recording session, on-brand for a family project). This binds symbol → quantity → word at the exact moment of action, invites the child to echo it aloud (one-to-one correspondence practice), and cues the parent to count along. Muted-device play stays fully functional per FBK-5. The *deferred* Phase-2 voice line ("not that one yet") stays deferred — that one is decoration; this one is curriculum.

### R3 (Medium) — Per-tap reward = progressive reveal of ONE dino, not five hatches

Synthesis of the dance-party prototype instinct with the content budget and the "engaged" pillar: each correct tap visibly advances **one** hatch — e.g., the day's egg (or nest) cracks further with each success, a snout pokes out at 3, the dino bursts free on the last tap. Every tap still pays off; anticipation builds toward one meaningful surprise; REV-2 (one species/day, identical for all) and the 30-dino runway survive intact. Keep the finale dance — 4–8 s per CEL-1, then results, no lingering party.

### R4 (Medium) — Design the celebration as *discovery*, not *prize*

Small framing shifts, consistent with Montessori's intrinsic-motivation stance: the hatch is "look who was inside!" (revelation) rather than "you win!" (reward). No applause tracks, no stars/trophies on child-facing surfaces (already spec'd — hold that line), the display name spoken/shown as a naming moment ("A stegosaurus!"). The child's takeaway should be "I opened it myself."

### R5 (Medium) — Lean harder into the lap: parent prompt on results

One quiet grown-up-facing line on the results screen ("Try together: count his fingers to 3 today" / rotate a few), plus the existing fun fact. Cost: a strings array. Benefit: converts the app's strongest pillar (social) into an explicit daily nudge, and extends learning past the screen — which is where toddler math actually lives.

### R6 (Medium) — Keep the once-a-day lock; give "AGAIN!" a real-world mission

Hold sign-off: strict once-a-day stays (screen-time, ritual, the comeback card's proven negotiation-ending power). Add to the comeback card a tiny **counting mission** for the day: "Today's mission: find 3 spoons at breakfast 🥄🥄🥄." Repetition happens — off-screen, with real objects, exactly as Montessori prescribes — and tomorrow's egg stays special. (Phase 2 item; content is a 30-line JSON list.)

### R7 (Low) — Board sizing for L1

Three eggs at ≥ 100 px with generous gaps (even bigger than TAP-2's 88 px) for 2.5-year-old motor precision; the 5-egg quincunx starts at L2.

### R8 (Low) — Success metric, revisited

Adopt CEO-3's dormant suggestion with a learning lens: the product works if (a) the ritual sticks 30 mornings, and (b) the parent observes him counting *real things* unprompted within 3 months. (b) is the actual mission.

---

## 4. Is a completely new direction warranted?

**No — the vessel is right; re-aim the cargo.** The considered alternative was a pure quantity game with no numerals at all (tap groups of dinos smallest-to-biggest, fully Montessori-toddler). It was rejected as a *replacement* because R1's ladder already contains it as Level 1, and the numeral levels give the product 3+ years of headroom the pure-quantity game lacks. The daily-egg ritual, the once-a-day scarcity, the share loop, and the static-file architecture all survive contact with the research unchanged — that's unusual, and worth protecting from over-correction.

## 5. Spec impact if adopted (parent sign-off needed)

- requirements.md: TAP-1 rewrites (level content), new FBK/REV lines for number-word audio and progressive reveal; sign-off #6 ladder replaced; new sign-offs for R1–R3.
- design.md: §3 `numbersForLevel` → returns board *spec* (count + face type + values); §9 adds number-word recordings (~10 tiny files) and egg-face art (footprint variants); §7 unchanged.
- tasks.md: Phase 1 gains egg-face renderer + audio tasks; Phase 2 gains counting-mission card + parent prompts.
- Prototype: re-aim the interactive mockup to L1 "Footprints" and the progressive single-dino reveal.

## 6. Sources (paraphrased throughout)

- Hirsh-Pasek, Zosh, Golinkoff et al., "Putting Education in 'Educational' Apps," *Psych. Science in the Public Interest* (four pillars); Meyer et al. 2021 follow-up study of 100 apps.
- Montessori concrete-to-abstract math progression: Inspire Kids Montessori; NAMC teacher-training blog; The Montessori-Minded Mom; montessori-theory.com; Montessori in Real Life (toddler one-to-one correspondence activities).
- Early-numeracy milestones: Child Development Authority (subitizing/verbal counting/symbolic stages); ScienceInsights & Lovevery (one-to-one correspondence and numeral-quantity timing); Gelman & Gallistel counting principles.
- Montessori intrinsic motivation / control of error: The Montessori Notebook (Simone Davies); montessori.org; AMS control-of-error definition.
