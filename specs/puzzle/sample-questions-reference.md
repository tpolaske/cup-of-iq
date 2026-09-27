# Brain Challenge App — Question Design

## 1. Product Concept

The app is inspired by the fun, surprising questions from *The 1% Club*, while borrowing useful characteristics from SAT and Wonderlic-style cognitive testing.

The goal is **not** to recreate the SAT or Wonderlic. Instead, the app should contain original questions that test reasoning, math, logic, pattern recognition, and problem-solving in a quick, entertaining format.

The ideal experience is:

> **"Can you solve this quickly if you solve super fast = prestigious school aka 1% **

The question should feel approachable, but the solution should often contain an **"aha!" moment**.

---

## 2. What Makes the Questions Different?

### The 1% Club influence

The strongest inspiration should be the feeling of discovery:

- Questions look simple at first.
- The obvious answer may be wrong.
- The challenge comes from noticing a subtle relationship or reframing the problem.
- Questions should be fun to discuss with friends and family.
- Explanations should reveal the trick or "aha!" moment.

### SAT influence

SAT-style questions provide a useful foundation for:

- Algebra
- Percentages
- Ratios
- Rates
- Functions
- Data analysis
- Geometry
- Word problems
- Translating real-world situations into mathematics

The SAT is more academic than *The 1% Club*, so the app should borrow the **reasoning style and mathematical concepts**, not copy SAT questions.

### Wonderlic influence

Wonderlic-style cognitive testing provides inspiration for:

- Numerical reasoning
- Verbal reasoning
- Sequences
- Logic
- Deduction
- Analogies
- Spatial reasoning
- Short, varied questions

Wonderlic is generally closer to the app's quick cognitive-question format than the SAT.

---

# 3. Core Design Principle: Make It Visual

Whenever a visual can make a question easier to understand or more fun, use one.

Examples:

| Question Type | Useful Visualization |
|---|---|
| Seating/order | Circular seating diagram |
| Number sequence | Number tiles and arrows |
| Spatial reasoning | 3D object |
| Data | Simple chart |
| Time | Clock face |
| Probability | Dice, cards, or balls |
| Logic | Grid |
| Calendar | Mini calendar |
| Rates | Distance/time diagram |
| Geometry | Diagram |
| Pattern recognition | Shapes |
| Deduction | Boxes and objects |

The explanation should also use the visual when possible.

The goal is to make the app feel more like a **game/show** than a textbook.

---

# 4. Recommended Difficulty Structure

## 🟢 Easy

Questions should be quickly understandable and solvable with basic reasoning.

Examples:
- Simple sequences
- Basic percentages
- Straightforward patterns
- Easy deduction

## 🟡 Medium-Easy

The concept is still approachable, but there is a small trick or extra step.

Examples:
- Multi-step percentages
- Simple rates
- Basic seating/order
- Slightly less obvious patterns

## 🟠 Medium-Hard

The user needs to think carefully and avoid an intuitive mistake.

Examples:
- Average rate/pace
- Systems of equations
- More complicated sequences
- Mixture problems
- Multi-step logic

## 🔴 Hard

The question should require multiple steps or a strong insight.

Examples:
- Complex deduction
- Probability
- Challenging algebra
- Multi-condition logic
- Non-obvious mathematical relationships

## 💯 1% Club

These should be the most surprising questions.

The mathematics itself can be simple. The difficulty comes from:

- Wording
- Perspective
- Hidden assumptions
- Pattern recognition
- Lateral thinking
- A counterintuitive result

The best 1% questions should make someone say:

> **"Ohhh! I was thinking about it completely wrong."**

---

# 5. Example Questions

## 🟢 EASY — The Missing Number

### Question

Look at this sequence:

**2 → 6 → 12 → 20 → 30 → ?**

What number should come next?

A) 36  
B) 40  
C) 42  
D) 44

### Answer

**C) 42**

### Explanation

Look at the differences:

- 2 → 6 = +4
- 6 → 12 = +6
- 12 → 20 = +8
- 20 → 30 = +10

The increments increase by 2 each time.

So the next increase is +12:

**30 + 12 = 42**

There is another way to see the pattern:

- 1 × 2 = 2
- 2 × 3 = 6
- 3 × 4 = 12
- 4 × 5 = 20
- 5 × 6 = 30
- 6 × 7 = **42**

---

# 🟡 MEDIUM-EASY — The Dinner Party

### Question

Five friends are sitting around a circular table.

- Alex is sitting directly opposite Ben.
- Cara is sitting immediately to Alex's right.
- David is sitting immediately to Ben's right.

Who must be sitting opposite Cara?

A) Alex  
B) Ben  
C) David  
D) Emma

### Answer

**D) Emma**

### Explanation

This question is much easier to understand with a visual.

Imagine the five seats arranged around a circle:

```text
                 ALEX
                  ●

          CARA           EMMA
           ●               ●

                 DAVID
                   ●

                  BEN
                   ●
```

The important relationship is that Cara and Emma occupy opposite positions.

Therefore:

**Cara ↔ Emma**

The answer is **D) Emma**.

### App Design Note

For questions like this, the diagram should be part of the question itself. The user should not have to mentally construct the table from a paragraph.

---

# 🟠 MEDIUM-HARD — The Weird Clock

### Question

A clock shows **3:15**.

Without looking at a clock, which answer is closest to the angle between the hour hand and minute hand?

A) 0°  
B) 7.5°  
C) 15°  
D) 22.5°

### Answer

**B) 7.5°**

### Explanation

The obvious answer might be 0° because both hands appear to point near the 3.

But the hour hand moves continuously.

At exactly 3:00, the hour hand points directly at 3.

By 3:15, it has moved one-quarter of the distance from 3 toward 4.

Each hour represents:

**30°**

One-quarter of 30° is:

**30 ÷ 4 = 7.5°**

Therefore the angle is:

**7.5°**

### Why This Is a Good App Question

This is a good example of a question that is mathematical but still feels like a puzzle.

It tests whether the user notices that the hour hand doesn't stay fixed.

---

# 🔴 HARD — The Three Boxes

### Question

You have three boxes:

- **BOX 1:** Apples
- **BOX 2:** Oranges
- **BOX 3:** Apples & Oranges

However, **every label is wrong**.

You may reach into one box and take out exactly one piece of fruit without looking inside.

Which box should you choose to determine the contents of all three boxes?

A) Box 1  
B) Box 2  
C) Box 3  
D) It is impossible

### Answer

**C) Box 3**

### Explanation

The key is that **every label is wrong**.

Therefore, the box labeled **"Apples & Oranges" cannot contain both types of fruit**.

It must contain either:

- Only apples, or
- Only oranges.

So Box 3 gives us the most information.

Suppose you pull out an apple.

Then Box 3 must contain:

**🍎 Apples only**

Now consider Box 2, labeled "Oranges."

That label is wrong, so Box 2 cannot contain only oranges.

It also cannot be the apples-only box because Box 3 is already apples-only.

Therefore Box 2 must be:

**🍎 + 🍊 Apples & Oranges**

That leaves Box 1:

**🍊 Oranges only**

One fruit tells us everything.

---

# 💯 1% CLUB — The Three Ball Boxes

### Question

A man has three boxes.

Each box contains either:

- Only red balls
- Only blue balls
- A mixture of red and blue balls

The boxes are labeled:

- **RED**
- **BLUE**
- **MIXED**

The man tells you:

> Every single label is wrong.

You are allowed to pull **one ball from one box**.

You pull out a **red ball**.

You now know exactly what is inside all three boxes.

Which box did you pull the ball from?

A) RED  
B) BLUE  
C) MIXED  
D) You still can't know

### Answer

**C) MIXED**

### Explanation

The box labeled **MIXED** cannot actually be mixed because every label is wrong.

Therefore it must contain either:

**Only red** or **only blue**.

You pulled out a red ball.

Therefore the MIXED-labeled box must contain:

**🔴 Red only**

Now look at the box labeled BLUE.

Its label is wrong, so it cannot contain only blue.

It also cannot contain only red because we already identified the red-only box.

Therefore it must contain:

**🔴🔵 Mixed**

That leaves the box labeled RED.

It must contain:

**🔵 Blue only**

So the final arrangement is:

| Label | Actual Contents |
|---|---|
| MIXED | 🔴 Red only |
| BLUE | 🔴🔵 Mixed |
| RED | 🔵 Blue only |

The answer is **C) MIXED**.

### Why This Is a 1% Club Question

The math is extremely simple.

The difficulty comes from recognizing that the statement **"every label is wrong"** gives you much more information than it initially appears to.

---

# 6. Additional SAT-Like Examples

These questions lean more heavily toward SAT-style mathematical reasoning while still being designed to feel like games or brain challenges.

---

## 🟡 MEDIUM-EASY — The Pizza Problem

### Question

A pizza is cut into 8 equal slices.

Tom eats **25% of the pizza**.

Sarah eats **50% of what remains**.

How many slices are left?

A) 2  
B) 3  
C) 4  
D) 5

### Answer

**B) 3**

### Explanation

25% of 8 slices is:

**8 × 0.25 = 2 slices**

So 6 slices remain.

Sarah eats 50% of those 6:

**6 ÷ 2 = 3**

So:

**6 − 3 = 3 slices**

---

## 🟠 MEDIUM-HARD — The Sneaky Discount

### Question

A store increases the price of a $100 jacket by **20%**, then puts the jacket on sale for **20% off**.

What is the final price?

A) $96  
B) $100  
C) $104  
D) $120

### Answer

**A) $96**

### Explanation

First increase the price by 20%:

**$100 × 1.20 = $120**

Then take 20% off the new price:

**$120 × 0.80 = $96**

The final price is:

**$96**

### The Trick

A 20% increase followed by a 20% decrease does **not** return you to the original price.

The second percentage is being applied to a different amount.

---

## 🟠 MEDIUM-HARD — The Growing Pattern

### Question

A sequence follows this rule:

**3, 7, 15, 31, 63, ?**

What comes next?

A) 95  
B) 111  
C) 127  
D) 129

### Answer

**C) 127**

### Explanation

Each number is multiplied by 2 and then increased by 1:

**3 × 2 + 1 = 7**

**7 × 2 + 1 = 15**

**15 × 2 + 1 = 31**

**31 × 2 + 1 = 63**

Therefore:

**63 × 2 + 1 = 127**

---

## 🔴 HARD — The Movie Theater

### Question

A movie theater sells:

- Adult tickets: **$12**
- Child tickets: **$8**

A group buys **7 tickets for $68**.

How many adult tickets did they buy?

A) 2  
B) 3  
C) 4  
D) 5

### Answer

**A) 2**

### Explanation

Let:

- A = adult tickets
- C = child tickets

There are 7 tickets total:

**A + C = 7**

The total cost is $68:

**12A + 8C = 68**

If there are 2 adult tickets, there are 5 child tickets:

**2 × $12 = $24**

**5 × $8 = $40**

**$24 + $40 = $64**

This reveals that the original question as written does **not** produce $68.

### Important Quality-Control Note

This is exactly the kind of error the app's question-generation system must catch.

To make the question valid, change the total to **$64**.

Then:

**2 adult + 5 child = $64**

So the corrected question's answer is:

**A) 2**

This is an important product principle: **every generated question needs automated and/or human validation before reaching users.**

---

## 🔴 HARD — The Mixture Problem

### Question

A container holds 10 liters of a drink that is **30% juice**.

How many liters of pure juice must be added to make the mixture **50% juice**?

A) 2  
B) 3  
C) 4  
D) 5

### Answer

**C) 4 liters**

### Explanation

Initially there are:

**10 × 30% = 3 liters of juice**

Let x = liters of pure juice added.

After adding x liters:

- Total liquid = **10 + x**
- Juice = **3 + x**

We want the final mixture to be 50% juice:

**(3 + x) / (10 + x) = 0.50**

Multiply both sides:

**3 + x = 5 + 0.5x**

Therefore:

**0.5x = 2**

**x = 4**

So the answer is:

**4 liters**

---

# 6b. Additional Question Bank — Batch 2 (Draft, 2026-08-23)

*Drafted for parent review — same format and difficulty structure as above. Mix leans into the visual guidance from §3 and rounds out categories (analogy/verbal, spatial, calendar, probability, logic grid) that Batch 1 was light on.*

---

## 🟢 EASY — The Odd One Out

### Question

Three of these four words are related. Which one doesn't belong?

A) Whisper  
B) Shout  
C) Mumble  
D) Sprint

### Answer

**D) Sprint**

### Explanation

Whisper, shout, and mumble are all ways of **speaking** — they describe volume or clarity of voice.

Sprint is a way of **running**, not speaking.

It's the only word that isn't a "manner of speaking" verb.

### App Design Note

A quick verbal/analogy question like this is a good palate-cleanser between math-heavy questions — no visual needed, answerable in a few seconds, and it rounds out the Wonderlic-style category (§7).

---

## 🟢 EASY — The Missing Shape

### Question

Look at this sequence of shapes:

```
●  ▲  ●  ▲  ●  ▲  ?
```

What comes next?

A) ●  
B) ▲  
C) ■  
D) ★

### Answer

**A) ●**

### Explanation

The shapes alternate strictly in pairs: circle, triangle, circle, triangle…

The sequence has completed three full pairs (●▲ ●▲ ●▲), so the next shape restarts the pattern:

**●**

### App Design Note

Render this as actual shape tiles rather than text characters (per §3's "Pattern recognition → Shapes" row) so it reads instantly rather than requiring the user to parse symbols.

---

## 🟡 MEDIUM-EASY — The Calendar Riddle

### Question

Today is a Wednesday.

What day of the week will it be **17 days** from today?

A) Thursday  
B) Friday  
C) Saturday  
D) Sunday

### Answer

**C) Saturday**

### Explanation

A week repeats every 7 days, so only the remainder matters:

**17 ÷ 7 = 2 remainder 3**

Three days after Wednesday:

**Wednesday → Thursday → Friday → Saturday**

### App Design Note

Show a small mini-calendar or a 7-day strip with today circled and a counter ticking forward, per §3's "Time → Clock face" / calendar row — this turns modular arithmetic into something you can see rather than calculate.

---

## 🟡 MEDIUM-EASY — The Train Platforms

### Question

A train travels at a constant **60 mph**.

How far does it travel in **45 minutes**?

A) 30 miles  
B) 40 miles  
C) 45 miles  
D) 60 miles

### Answer

**C) 45 miles**

### Explanation

45 minutes is **3/4 of an hour**.

**60 mph × 3/4 = 45 miles**

### App Design Note

A simple distance/time diagram (a track with a marker sliding 3/4 of the way along a 60-mile ruler) makes the fraction-of-an-hour step visual instead of purely arithmetic.

---

## 🟠 MEDIUM-HARD — The Average Speed Trap

### Question

A car drives from Town A to Town B at **60 mph**, then immediately drives back from Town B to Town A at **30 mph**.

What is the car's **average speed** for the whole round trip?

A) 40 mph  
B) 45 mph  
C) 50 mph  
D) 60 mph

### Answer

**A) 40 mph**

### Explanation

The intuitive (wrong) answer is to average the two speeds: (60 + 30) ÷ 2 = 45 mph.

But average speed is **total distance ÷ total time**, not an average of speeds — and the car spends *more time* at the slower speed.

Pick a convenient distance, say 60 miles each way:

- Trip there: 60 miles ÷ 60 mph = **1 hour**
- Trip back: 60 miles ÷ 30 mph = **2 hours**

Total distance: **120 miles**
Total time: **3 hours**

**120 ÷ 3 = 40 mph**

### Why This Is a Good App Question

This is a classic "obvious answer is wrong" trap in the spirit of §2's 1% Club influence, but it's grounded in a real SAT/Wonderlic-style rate concept — a good bridge question between the two influences described in §2.

---

## 🟠 MEDIUM-HARD — The Balance Scale

### Question

You have a two-pan balance scale and **8 identical-looking coins**. Exactly **one coin is fake** and slightly lighter than the rest.

What is the **minimum number of weighings** needed to guarantee finding the fake coin?

A) 1  
B) 2  
C) 3  
D) 4

### Answer

**B) 2**

### Explanation

Split the 8 coins into three groups: 3, 3, and 2.

**Weighing 1:** Put 3 coins on each side.

- If they balance, the fake is in the remaining 2 coins.
- If one side is lighter, the fake is among those 3.

**Weighing 2:**

- If narrowed to 2 coins, weigh them directly against each other — the lighter one is fake.
- If narrowed to 3 coins, weigh any 2 of them — if they balance, the third is fake; if not, the lighter one is fake.

Every branch resolves within 2 weighings.

### App Design Note

This one benefits enormously from a visual balance-scale diagram (§3's "Logic → Grid" row, adapted) showing the groups on each side — without it, the branching logic is hard to hold in your head via text alone.

---

## 🔴 HARD — The Card Draw

### Question

A standard 52-card deck is shuffled. You draw **one card**.

What is the probability that the card is **either a face card (Jack, Queen, King) or a Heart**?

A) 22/52  
B) 25/52  
C) 28/52  
D) 31/52

### Answer

**A) 22/52**

### Explanation

There are **12 face cards** (3 per suit × 4 suits) and **13 Hearts**.

If we just add them, we double-count the face cards that are also Hearts (Jack, Queen, King of Hearts = 3 cards).

Use the "either/or" rule — add the two groups, then subtract the overlap:

**12 + 13 − 3 = 22**

So the probability is:

**22/52**

### App Design Note

A simple 4×13 card grid with the face cards and the Hearts column each highlighted in a different color, with the 3-card overlap shown in a third color, turns the inclusion-exclusion principle into something visible instead of a formula to memorize (§3's "Probability → Dice, cards, or balls" row).

---

## 🔴 HARD — The Elevator Logic

### Question

Four coworkers — Priya, Jordan, Sam, and Lee — work on four different floors: 2, 5, 8, and 10 (not necessarily in that order).

- Priya works on a higher floor than Jordan.
- Sam works on floor 5.
- Lee does not work on the top floor.
- Jordan works on floor 2.

What floor does Priya work on?

A) Floor 2  
B) Floor 5  
C) Floor 8  
D) Floor 10

### Answer

**D) Floor 10**

### Explanation

From the clues:

- Jordan = floor 2.
- Sam = floor 5.
- That leaves floors 8 and 10 for Priya and Lee.
- Lee does not work on the top floor (10), so Lee = floor 8.
- Therefore Priya = **floor 10**.

Priya-higher-than-Jordan is automatically satisfied and mainly serves to confirm the arrangement, not to derive it.

### App Design Note

Render this as a small elevator shaft / building diagram with four floor slots that fill in as each clue is applied (§3's "Deduction → Boxes and objects" row) — watching the grid resolve floor-by-floor is more satisfying than reading four bullet clues.

---

## 💯 1% CLUB — The 28-Day Months

### Question

How many months of the year have **28 days**?

A) 1  
B) 4  
C) 11  
D) 12

### Answer

**D) 12**

### Explanation

The intuitive answer is 1 (thinking only of February).

But every month has **at least** 28 days — February has exactly 28 (or 29), and every other month has 28 days *plus a few more*.

So all **12 months** have 28 days; February is just the only one that stops there.

### Why This Is a 1% Club Question

The wording exploits an unstated assumption — that "has 28 days" means "has exactly 28 days." Once you reread it literally, the trick is obvious. This is the purest form of §4's "the math is simple, the difficulty is in the wording" 1% Club style.

---

## 💯 1% CLUB — The Farmer's Sheep

### Question

A farmer has **17 sheep**. All but **9** die.

How many sheep does the farmer have left?

A) 8  
B) 9  
C) 17  
D) 0

### Answer

**B) 9**

### Explanation

"All but 9 die" means **9 survive** — that's what the phrase describes directly.

The instinct to compute 17 − 9 = 8 quietly answers a different question ("how many died") instead of the one asked ("how many are left").

Sheep count doesn't matter here — 17 is a decoy.

### Why This Is a 1% Club Question

This tests careful reading over calculation, exactly per §4's 1% Club guidance ("the mathematics itself can be simple… the difficulty comes from wording"). It pairs well with "The 28-Day Months" as a two-question set that trains "reread before you calculate."

---

# 6c. Developer Logic — Worked Examples (Batch 3, draft)

*Drafted for parent review — worked examples for the new ⚫ Developer Logic category (requirements.md §2's Question Spectrum). The rule for this category, same as it was pitched: don't ask anyone to write or read code — ask a reasoning question where programming concepts give a solver an edge, but a non-programmer can still get there by thinking it through.*

---

## 🟢 EASY — The Swap Bug

### Question

A developer wants to swap the values of two variables, `x` and `y`. They write:

```
x = 10
y = 20
x = y
y = x
```

What are the values of `x` and `y` after these lines run?

A) x = 10, y = 20  
B) x = 20, y = 10  
C) x = 20, y = 20  
D) x = 10, y = 10

### Answer

**C) x = 20, y = 20**

### Explanation

`x = y` overwrites `x`'s original value (10) with `y`'s value (20) — so `x` is now 20, and the original 10 is gone for good.

Then `y = x` just assigns `y` to whatever `x` currently is — which is now also 20.

So both variables end up **20**. The real swap needs a temporary holding spot:

```
temp = x
x = y
y = temp
```

### App Design Note

No visual needed here — the four lines of "code" are really just a sequence of assignments, readable by anyone regardless of programming background. This is a good opener for the category since it proves the "no code experience required" promise immediately.

---

## 🟢 EASY — The Robot's Path

### Question

A robot starts at a point and follows these moves in order:

**Forward 3 → Turn right → Forward 2 → Turn right → Forward 3 → Turn right → Forward 2**

Where does the robot end up, relative to where it started?

A) 5 spaces from the start  
B) 1 space east of the start  
C) Exactly back at the start  
D) 1 space south of the start

### Answer

**C) Exactly back at the start**

### Explanation

Each "turn right" rotates the robot 90°, so the four moves trace the four sides of a rectangle: 3 forward, turn, 2 forward, turn, 3 forward (back the other way), turn, 2 forward (back to start).

Since a rectangle's opposite sides are equal, the path closes exactly where it began.

### App Design Note

This is a strong candidate for the Phase 2 diagram library (a simple grid with an arrow tracing the path) — visualizing "the robot walks a rectangle" makes the answer obvious in a way the text description doesn't.

---

## 🟡 MEDIUM-EASY — The Ticket Pile

### Question

A kitchen puts incoming order tickets on a spike, one on top of the other. When the kitchen has time, it grabs the **top ticket first** — never one from partway down the pile.

Orders come in, in this order: **A, B, C, D**.

The kitchen then pulls two tickets off the spike. Which two orders come out, and in what order?

A) A, then B  
B) B, then C  
C) D, then C  
D) C, then D

### Answer

**C) D, then C**

### Explanation

Every new ticket goes on top, so after A, B, C, D are placed, D is sitting on top of the pile.

The kitchen always takes the top ticket — so it pulls **D first, then C**.

This behavior — the last thing added is the first thing removed — is what programmers call a **stack**. The question never uses that word, but the logic is identical to how a stack works.

### App Design Note

A simple vertical "spike" diagram with tickets stacking and un-stacking would make this instantly readable, and doubles nicely as a teaching moment for the explanation.

---

## 🟡 MEDIUM-EASY — The Traffic Light

### Question

A traffic light repeats this cycle, in order, forever:

**Green → Yellow → Red → Green → Yellow → Red → …**

Right now, the light is **Yellow**. What color will it be after **17** more changes?

A) Green  
B) Yellow  
C) Red  
D) Impossible to tell

### Answer

**A) Green**

### Explanation

The cycle repeats every 3 changes, so only the remainder of 17 ÷ 3 matters:

**17 ÷ 3 = 5 remainder 2**

So we only need to count 2 steps forward from Yellow:

**Yellow → Red (1 step) → Green (2 steps)**

After 17 changes, the light is back to **Green**.

### App Design Note

A small 3-position circular diagram (green/yellow/red arranged in a triangle with a pointer that advances one step at a time) makes this kind of modular-arithmetic question visual instead of something the solver has to track purely by counting in their head.

---

## 🟠 MEDIUM-HARD — The Guessing Game

### Question

You need to find one specific person out of **1,000 people** standing in a line, **sorted alphabetically by last name**. You can only ask someone, "Is the person I'm looking for earlier or later in the line than you?"

What's the smartest strategy?

A) Start at the front and ask each person in turn  
B) Start at the back and ask each person in turn  
C) Start in the middle and eliminate half the remaining line each time  
D) Ask every tenth person

### Answer

**C) Start in the middle and eliminate half the remaining line each time**

### Explanation

Because the line is sorted, asking the person in the middle tells you which half your target is in — instantly discarding the other 500 people.

Repeating this, each question cuts the remaining group in half again: 500 → 250 → 125 → …

This takes roughly **log₂(1000) ≈ 10 questions** — instead of up to 1,000 asking one at a time.

Programmers call this **binary search**, but the trick works purely from the fact that the line is sorted — no programming knowledge required to see why it's faster.

### App Design Note

A shrinking line-segment diagram (1,000 → 500 → 125 → …) after each simulated question would sell the "cutting in half" insight far better than the number alone.

---

## 🟠 MEDIUM-HARD — The Phone Book Lookup

### Question

You have a phone book with **10 million names**, and you want to know whether "Tom Smith" is in it as fast as possible.

Which approach finds the answer fastest?

A) Check every name one at a time from the start  
B) Keep the names sorted and repeatedly split the search in half  
C) Use an index that jumps straight to where "Tom Smith" would be, in one step  
D) Pick names at random and hope to get lucky

### Answer

**C) Use an index that jumps straight to where "Tom Smith" would be, in one step**

### Explanation

Checking one at a time (A) could take up to 10 million steps. Splitting in half repeatedly (B) — binary search — is much faster, around 24 steps, but still takes several steps.

An index built specifically to jump straight to a name's location (what programmers call a **hash-based lookup**) can answer in roughly **one step**, regardless of how many names are in the book.

### App Design Note

This pairs naturally with "The Guessing Game" above as a two-question set showing two different flavors of "smart lookup" — the binary-search question rewards *sorted data*, this one rewards *pre-organized data*. Consider placing them back-to-back in the pool.

---

## 🔴 HARD — The Light Switches

### Question

There are **100 light switches** in a row, all starting **OFF**. You make 100 passes:

- Pass 1: flip every switch.
- Pass 2: flip every 2nd switch.
- Pass 3: flip every 3rd switch.
- …
- Pass 100: flip only switch #100.

After all 100 passes, which switches are ON?

A) None of them  
B) All of them  
C) Only the perfect-square-numbered switches (1, 4, 9, 16, 25…)  
D) Only the prime-numbered switches

### Answer

**C) Only the perfect-square-numbered switches**

### Explanation

A switch gets flipped once for every number that evenly divides its position. Switch #12, for example, gets flipped on passes 1, 2, 3, 4, 6, and 12 — six flips, which is an even number, so it ends up back OFF.

Switch #16 gets flipped on passes 1, 2, 4, 8, and 16 — five flips, an odd number, so it ends up ON.

Most numbers pair their divisors up evenly (like 3 and 4 for 12), giving an even flip count. Perfect squares are the exception — their square root pairs with itself (4×4 for 16) rather than with a different number, leaving one divisor unpaired and the total flip count odd.

So only the perfect squares — **1, 4, 9, 16, 25, 36, 49, 64, 81, 100** — stay ON.

### App Design Note

This is a genuinely hard question and earns its 🔴 tier — a row of 100 small switch icons that visibly flip as you simulate a few passes (even just the first 4-5) would help a solver notice the divisor-pairing pattern instead of needing to hold it all in their head.

---

## 🔴 HARD — The Busy Host

### Question

A restaurant has 1,000 tables. Every time a customer asks whether a table is free, the host walks down the list of tables **from #1 onward** until finding an open one.

The restaurant suddenly gets very busy — 10,000 customers ask in a row. What's the smartest fix?

A) Hire more hosts to do the same walk-through faster  
B) Have the host check tables in a random order instead  
C) Have the host keep a running, always-up-to-date list of which tables are currently free  
D) Ask customers to wait longer between requests

### Answer

**C) Have the host keep a running, always-up-to-date list of which tables are currently free**

### Explanation

The real problem isn't the number of customers — it's that the host **repeats the same table-by-table walk from scratch** for every single question, redoing work that a smarter setup would only need to do once.

If the host instead keeps a running list that updates the moment a table opens or fills, answering "is anything free?" becomes instant, no matter how many times it's asked.

Programmers call this idea **caching** — keeping a precomputed answer ready instead of recalculating it every time — but the insight ("stop redoing the same work over and over") holds with zero programming background.

### App Design Note

A little animated queue of customers hitting a slow "walk the whole restaurant" host vs. a fast "check the list" host would make the before/after contrast land quickly — a good use of the Phase 2 diagram library once it exists.

---

## 💯 1% CLUB — The Never-Ending Sequence

### Question

Start with the number **6** and repeat this rule:

- If the number is even, divide it by 2.
- If the number is odd, multiply it by 3 and add 1.

What eventually happens?

A) It eventually reaches 0  
B) It eventually reaches 1, then cycles 1 → 4 → 2 → 1 forever  
C) It gets stuck at 6 forever  
D) It grows larger forever

### Answer

**B) It eventually reaches 1, then cycles 1 → 4 → 2 → 1 forever**

### Explanation

Following the rule from 6: **6 → 3 → 10 → 5 → 16 → 8 → 4 → 2 → 1**, and from there it loops **1 → 4 → 2 → 1** forever.

Here's the twist that makes this a genuine 1% Club question: this always seems to happen, for every starting number anyone has ever tried — but **no one has ever mathematically proven it happens for every possible number**. It's a real, unsolved question in mathematics, known as the Collatz conjecture.

So the question has a clean, checkable answer for this specific starting number, while quietly introducing the solver to a problem that has stumped mathematicians for decades.

### Why This Is a 1% Club Question

The insight isn't a trick of wording like the other 1% Club examples — it's the reveal that a simple-looking pattern anyone can compute by hand is secretly one of math's most famous open problems. That gap between "I can do this in 30 seconds" and "nobody on Earth can prove this always works" is exactly the "ohhh" moment this category is built around.

---

# 6d. SAT-Style Reasoning & 1% Club — Worked Examples (Batch 4, draft)

*Drafted for parent review — filling out the two thinnest categories in the spectrum. SAT-style leans into algebra, functions, geometry, and data reasoning (never real SAT questions, just the format); 1% Club rounds out the weekly-special pool (WKS-1/WKS-2) with a wider mix of wording tricks, math-based counterintuitives, and pure lateral-thinking riddles than Batches 1–2 had.*

---

## 🟢 EASY — The Rectangle's Perimeter

### Question

A rectangular garden is **12 meters long** and **7 meters wide**.

What is its perimeter?

A) 19 meters  
B) 38 meters  
C) 84 meters  
D) 42 meters

### Answer

**B) 38 meters**

### Explanation

Perimeter is the distance all the way around:

**2 × (length + width) = 2 × (12 + 7) = 2 × 19 = 38 meters**

---

## 🟢 EASY — The Function Machine

### Question

A function is defined as **f(x) = 2x + 3**.

What is **f(5)**?

A) 8  
B) 10  
C) 13  
D) 16

### Answer

**C) 13**

### Explanation

Plug 5 in for x:

**f(5) = 2(5) + 3 = 10 + 3 = 13**

---

## 🟡 MEDIUM-EASY — The Sales Report

### Question

A small shop sold **40 items in January** and **52 items in February**.

By what percent did sales increase?

A) 12%  
B) 20%  
C) 23%  
D) 30%

### Answer

**D) 30%**

### Explanation

The increase is **52 − 40 = 12 items**.

Percent increase is the change divided by the *original* amount:

**12 ÷ 40 = 0.30 = 30%**

### App Design Note

A simple two-bar chart (January vs. February) per §3's "Data → Simple chart" row would let a solver see the jump before doing any arithmetic.

---

## 🟡 MEDIUM-EASY — The Missing Angle

### Question

A triangle has two angles measuring **54°** and **61°**.

What is the measure of the third angle?

A) 55°  
B) 65°  
C) 115°  
D) 125°

### Answer

**B) 65°**

### Explanation

Every triangle's angles add up to 180°:

**180 − 54 − 61 = 65°**

---

## 🟠 MEDIUM-HARD — The Trail Mix Blend

### Question

Peanuts cost **$3 per pound** and cashews cost **$5 per pound**.

A shopper buys **10 pounds total** of a peanut-cashew blend for **$38**.

How many pounds of cashews did they buy?

A) 2  
B) 3  
C) 4  
D) 6

### Answer

**C) 4**

### Explanation

Let p = pounds of peanuts, c = pounds of cashews.

**p + c = 10**

**3p + 5c = 38**

From the first equation, p = 10 − c. Substitute:

**3(10 − c) + 5c = 38**

**30 − 3c + 5c = 38**

**2c = 8**

**c = 4**

So the shopper bought **4 pounds of cashews** (and 6 pounds of peanuts).

---

## 🟠 MEDIUM-HARD — The Function Chain

### Question

Let **f(x) = x²** and **g(x) = x + 3**.

What is **f(g(2))**?

A) 7  
B) 10  
C) 16  
D) 25

### Answer

**D) 25**

### Explanation

Work from the inside out. First find g(2):

**g(2) = 2 + 3 = 5**

Then plug that result into f:

**f(5) = 5² = 25**

The trap is computing f(2) and g(2) separately and adding or multiplying them — function composition only works inside-out, one step at a time.

---

## 🔴 HARD — The Fence Problem

### Question

A farmer has **40 meters of fencing** and wants to build a rectangular pen using all of it, enclosing the **largest possible area**.

What is the largest area they can enclose?

A) 75 m²  
B) 84 m²  
C) 96 m²  
D) 100 m²

### Answer

**D) 100 m²**

### Explanation

With 40 meters of fencing, the length and width must add up to 20 meters (since perimeter = 2 × (l + w) = 40).

Try a few options: 9 × 11 = 99 m². 8 × 12 = 96 m². 10 × 10 = 100 m².

For a fixed perimeter, a rectangle's area is always largest when it's a **square** — the closer the two sides are to equal, the more area you get. So the farmer should make a 10-by-10 square pen for **100 m²**.

### App Design Note

This is a good Phase 2 diagram candidate — a slider or a few side-by-side rectangle outlines (9×11, 8×12, 10×10) with their areas labeled would let a solver *see* the square winning rather than trusting the rule.

---

## 💯 1% CLUB — The Nine Count

### Question

How many times does the digit **9** appear when you write out every number from **1 to 100**?

A) 10  
B) 11  
C) 19  
D) 20

### Answer

**D) 20**

### Explanation

Count the two ways a 9 can show up separately.

As the **units digit**: 9, 19, 29, 39, 49, 59, 69, 79, 89, 99 — that's **10** appearances.

As the **tens digit**: 90 through 99 — that's another **10** appearances.

**10 + 10 = 20**

### Why This Is a 1% Club Question

The instinctive answer is 10 — most people count only the "…9" pattern (9, 19, 29…) and forget the entire 90–99 block also contributes a 9 in the tens place. The math is just counting; the trap is only looking in one place.

---

## 💯 1% CLUB — The Crowded Room

### Question

How many people need to be in a room before there's a **better than 50% chance** that two of them share the same birthday (ignore leap years)?

A) 183  
B) 366  
C) 57  
D) 23

### Answer

**D) 23**

### Explanation

The intuitive guess is close to half of 365 — but the real driver isn't the number of *people*, it's the number of *pairs* of people, and that grows much faster.

With 23 people, there are **23 × 22 ÷ 2 = 253 possible pairs** to compare. It only takes one matching pair among all 253 to succeed, and that's already enough to push the odds past 50%.

### Why This Is a 1% Club Question

This is the famous "birthday paradox" — it isn't really a paradox, just a case where our intuition tracks the wrong quantity (people instead of pairs). Once you reframe it around pairs, the surprising number stops being surprising.

---

## 💯 1% CLUB — Two Fathers, Two Sons

### Question

Two fathers and two sons go fishing together. They catch exactly **three fish**, and each person goes home with **one whole fish** — none split, none thrown back.

How is this possible?

A) One fish was unusually large and got counted twice  
B) There were only three people: a grandfather, his son, and his grandson  
C) One person didn't take a fish  
D) It's a trick question — it's actually impossible

### Answer

**B) There were only three people: a grandfather, his son, and his grandson**

### Explanation

"Two fathers and two sons" sounds like four separate people — but a grandfather, father, and son form a group where the middle person is **both** a father (to the son) and a son (to the grandfather).

So "two fathers" = grandfather + father, and "two sons" = father + son — only **three actual people**, which matches the three fish exactly.

### Why This Is a 1% Club Question

The entire trick lives in how you first parse the sentence. Once you see that one person can hold two roles at once, the arithmetic (3 people, 3 fish) is trivial.

---

## 💯 1% CLUB — The Rope Around the Earth

### Question

A rope is wrapped snugly around the Earth's equator (about 40,000 km long). If you add just **1 extra meter** to the rope and lift it evenly off the ground all the way around, roughly how high off the ground would the rope float?

A) A fraction of a millimeter  
B) About 16 centimeters  
C) About 6 meters  
D) It couldn't lift off the ground at all

### Answer

**B) About 16 centimeters**

### Explanation

Circumference relates to radius by **C = 2πr**. Adding a small amount to the circumference increases the radius by that amount divided by 2π — no matter how big the circle already is:

**1 meter ÷ (2 × π) ≈ 0.159 meters ≈ 16 cm**

The Earth's enormous size cancels out of the math completely; only the extra 1 meter matters.

### Why This Is a 1% Club Question

The gut reaction is "the Earth is gigantic, so one extra meter spread around it should do basically nothing." The reveal — that the planet's size is irrelevant to the answer — is the purest kind of "ohhh, I was thinking about this completely wrong."

---

## 💯 1% CLUB — The House With Four Southern Walls

### Question

A man builds a house where **all four walls face south**. A bear walks past his window.

What color is the bear?

A) Brown  
B) Black  
C) White  
D) Not enough information

### Answer

**C) White**

### Explanation

The only place on Earth where *every* direction you face is south is the **North Pole**. A bear near the North Pole is a polar bear — white.

### Why This Is a 1% Club Question

There's no math here at all — the entire puzzle is realizing the premise (all four walls facing south) pins down one specific location on the planet, and the rest follows automatically once you place it.

---

## 💯 1% CLUB — The Tenth Flip

### Question

You flip a fair coin **9 times in a row** and get heads every single time.

What is the probability the **10th flip** will also be heads?

A) Very low — it's "due" for tails  
B) Exactly 50%  
C) About 1 in 1,000  
D) Exactly 0%

### Answer

**B) Exactly 50%**

### Explanation

Each coin flip is independent — the coin has no memory of what happened before it. No matter how long a streak has run, the next flip is still a fresh 50/50 event.

(Getting 9 heads in a row *was* a big coincidence in hindsight — about a 1-in-512 chance — but that's a fact about the 9 flips that already happened, not a force acting on the 10th one.)

### Why This Is a 1% Club Question

This is the classic "gambler's fallacy" — the instinct that a streak makes the opposite outcome more "due" is one of the most common intuition errors there is, and it stays counterintuitive even once you know the math cold.

---

# 6e. Additional Question Bank — Batch 5 (Draft, easy-skewed)

*Drafted for parent review — deliberately all 🟢 Easy, 2 per non-1%-Club category, to shore up the thinnest tier now that puzzle mode draws one Easy + one Medium + one Hard every single day (v2 three-question round). Each question's category is tagged in its header for easier conversion into `content/puzzles.json` later.*

---

## 🟢 EASY [Brain Teasers] — The Letter Pattern

### Question

Look at this sequence of letters:

**A → C → E → G → ?**

What letter comes next?

A) H  
B) I  
C) J  
D) F

### Answer

**B) I**

### Explanation

The sequence skips one letter each time: A (skip B) → C (skip D) → E (skip F) → G (skip H) → **I**.

---

## 🟢 EASY [Brain Teasers] — The Weight Comparison

### Question

- A weighs more than B.
- C weighs less than B.

Who is the lightest?

A) A  
B) B  
C) C  
D) Can't tell

### Answer

**C) C**

### Explanation

Put it in order: **C < B < A**.

C is lighter than B, and B is already lighter than A — so C is the lightest of the three, with no extra steps needed.

---

## 🟢 EASY [Clever Math] — The Coffee Change

### Question

A coffee costs **$3.25**. You pay with a **$5 bill**.

How much change do you get back?

A) $1.25  
B) $1.50  
C) $1.75  
D) $2.25

### Answer

**C) $1.75**

### Explanation

**$5.00 − $3.25 = $1.75**

---

## 🟢 EASY [Clever Math] — The Half Off

### Question

A shirt costs **$40**. It's on sale for **half off**.

What's the sale price?

A) $15  
B) $20  
C) $25  
D) $30

### Answer

**B) $20**

### Explanation

Half off means 50% off:

**$40 × 0.50 = $20**

---

## 🟢 EASY [SAT-Style Reasoning] — The Substitution

### Question

If **x = 4**, what is **3x − 2**?

A) 8  
B) 10  
C) 12  
D) 14

### Answer

**B) 10**

### Explanation

**3(4) − 2 = 12 − 2 = 10**

---

## 🟢 EASY [SAT-Style Reasoning] — The Average Score

### Question

A student scores **80, 90, and 100** on three tests.

What is their average score?

A) 85  
B) 88  
C) 90  
D) 95

### Answer

**C) 90**

### Explanation

Add the scores and divide by how many there are:

**(80 + 90 + 100) ÷ 3 = 270 ÷ 3 = 90**

### App Design Note

A simple three-bar chart per §3's "Data → Simple chart" row would let a solver visually "level out" the bars to see the average before calculating it.

---

## 🟢 EASY [Logic/Puzzle] — The Locked Door

### Question

A prize is hidden in one of three boxes: **A, B, or C**.

You're told:

- The prize is **not** in Box A.
- The prize is **not** in Box C.

Which box has the prize?

A) Box A  
B) Box B  
C) Box C  
D) Not enough information

### Answer

**B) Box B**

### Explanation

With only three boxes and the prize ruled out of two of them (A and C), the only one left is **Box B**.

---

## 🟢 EASY [Logic/Puzzle] — The Three Pets

### Question

Max, Nora, and Priya each own exactly one pet — a cat, a dog, or a fish.

- Max doesn't own the fish.
- Nora doesn't own the cat.
- Priya owns the dog.

What pet does Max own?

A) Cat  
B) Dog  
C) Fish  
D) Can't tell

### Answer

**A) Cat**

### Explanation

Priya already has the dog, so the cat and fish are split between Max and Nora.

Max doesn't own the fish — so Max must own the **cat**. (That leaves the fish for Nora, which also fits her clue: she doesn't own the cat.)

### App Design Note

A tiny 3-person × 3-pet grid, per §3's "Logic → Grid" row, would let a solver check off clues as they read them rather than holding all three names and pets in their head at once — good early practice for the harder multi-clue logic-grid questions later (e.g. "The Elevator Logic").

---

## 🟢 EASY [Developer Logic] — The Countdown

### Question

A program starts at **5**. As long as the number is at least 1, it prints the number, then subtracts 1.

What is the **last** number this program prints?

A) 5  
B) 0  
C) 1  
D) It never stops

### Answer

**C) 1**

### Explanation

The program prints: **5, 4, 3, 2, 1** — then checks again, sees the number is now 0 (less than 1), and stops.

The trap is assuming the count keeps going down to 0 and prints that too — but the check happens *before* printing, so 0 is never printed.

---

## 🟢 EASY [Developer Logic] — The Four Flips

### Question

A light switch starts **OFF**. You flip it **4 times in a row**.

What state is it in at the end?

A) ON  
B) OFF  
C) Impossible to tell  
D) It depends on how fast you flip it

### Answer

**B) OFF**

### Explanation

Track it flip by flip: OFF → ON → OFF → ON → **OFF**.

Every pair of flips cancels out and returns to the starting state, so an even number of flips (4) always ends up back where it began.

### App Design Note

This is a nice "gentle preview" of the divisor-parity idea behind the harder "Light Switches" question already in the bank (§6c) — worth considering placing them a few weeks apart in the rotation so the harder one feels like a callback rather than a repeat.

---

# 6f. Additional Question Bank — Batch 6 (Draft, toward the 170 target)

*Drafted for parent review — one Easy + one Medium + one Hard per category (Brain Teasers, Clever Math, SAT-Style Reasoning, Logic/Puzzle, Developer Logic), 15 questions total, working toward the 170-question target (70 easy / 55 medium / 35 hard / 10 1% Club, 1% Club pool already complete). **First batch labeled directly against the production 3-tier schema** — "Medium" replaces the old "Medium-Easy"/"Medium-Hard" split from Batches 1–4, since the 70/55/35 target confirms the schema going forward is the flat 3-tier one. Earlier batches aren't being relabeled retroactively; see requirements.md's open-question note.*

---

## 🟢 EASY [Brain Teasers] — The Odd Number

### Question

Which number doesn't belong?

**2, 4, 6, 9, 8**

A) 2  
B) 6  
C) 9  
D) 8

### Answer

**C) 9**

### Explanation

2, 4, 6, and 8 are all even. **9** is the only odd number in the group.

---

## 🟡 MEDIUM [Brain Teasers] — The Height Order

### Question

- Amy is taller than Ben.
- Ben is taller than Cara.
- Dana is shorter than Cara.

Who is the shortest?

A) Amy  
B) Ben  
C) Cara  
D) Dana

### Answer

**D) Dana**

### Explanation

Chain the clues together: **Amy > Ben > Cara > Dana**.

Dana is shorter than Cara, who is already the shortest of the first three named — so Dana is shortest overall.

---

## 🔴 HARD [Brain Teasers] — The Two Ropes

### Question

You have two ropes. Each one takes **exactly 60 minutes** to burn completely, but neither burns at a steady rate along its length (some sections burn faster than others).

Using only these two ropes and a lighter, how can you measure exactly **45 minutes**?

A) Light one rope at both ends; when it finishes, light the second rope at one end  
B) Light both ropes at one end each, at the same time  
C) Light one rope at both ends and the other rope at one end, at the same time; when the first rope finishes, light the second end of the second rope  
D) It can't be done without a clock

### Answer

**C) Light one rope at both ends and the other rope at one end, at the same time; when the first rope finishes, light the second end of the second rope**

### Explanation

Light **Rope A at both ends** and **Rope B at one end**, simultaneously.

Rope A always takes exactly **half its total time to burn from both ends at once** — 30 minutes — no matter how unevenly it burns, because two flames consuming it together always finish in half the single-end time.

The moment Rope A finishes (30 minutes in), light the **second end of Rope B**. Rope B already has 30 minutes of unevenly-distributed burn time left; lighting its other end now means those two flames finish it in half of that remaining time — **15 more minutes**.

**30 + 15 = 45 minutes.**

### App Design Note

A visual timeline showing both ropes burning (with flame markers moving from both ends where lit) would make the "two flames = half the time, regardless of unevenness" insight click much faster than the text explanation alone.

---

## 🟢 EASY [Clever Math] — The Sales Tax

### Question

An item costs **$20** before tax. Sales tax is **5%**.

What's the total cost?

A) $20.50  
B) $21.00  
C) $21.50  
D) $25.00

### Answer

**B) $21.00**

### Explanation

**$20 × 1.05 = $21.00**

---

## 🟡 MEDIUM [Clever Math] — The Recipe Ratio

### Question

A recipe calls for **2 cups of flour for every 3 cups of sugar**.

If you use **9 cups of sugar**, how many cups of flour do you need?

A) 4  
B) 5  
C) 6  
D) 7

### Answer

**C) 6**

### Explanation

The ratio is **2 : 3** (flour : sugar). Scale it up so the sugar side becomes 9:

**3 × 3 = 9**, so multiply the flour side by 3 too: **2 × 3 = 6**

You need **6 cups of flour**.

---

## 🔴 HARD [Clever Math] — The Two Pipes

### Question

Pipe A can fill a pool in **6 hours** by itself. Pipe B can fill the same pool in **3 hours** by itself.

If both pipes run together, how long will it take to fill the pool?

A) 1.5 hours  
B) 2 hours  
C) 4.5 hours  
D) 9 hours

### Answer

**B) 2 hours**

### Explanation

The tempting-but-wrong answer is to average 6 and 3 to get 4.5 hours — but rates add, not times.

Pipe A fills **1/6 of the pool per hour**; Pipe B fills **1/3 per hour**. Together:

**1/6 + 1/3 = 1/6 + 2/6 = 3/6 = 1/2 of the pool per hour**

Filling the whole pool at that combined rate takes **2 hours**.

---

## 🟢 EASY [SAT-Style Reasoning] — The Linear Equation

### Question

Solve for x: **2x + 5 = 15**

A) 4  
B) 5  
C) 6  
D) 10

### Answer

**B) 5**

### Explanation

**2x = 15 − 5 = 10**, so **x = 10 ÷ 2 = 5**

---

## 🟡 MEDIUM [SAT-Style Reasoning] — The Sum and Difference

### Question

The sum of two numbers is **15**. One number is **3 more** than the other.

What are the two numbers?

A) 5 and 10  
B) 6 and 9  
C) 7 and 8  
D) 4 and 11

### Answer

**B) 6 and 9**

### Explanation

Let the smaller number be x. Then the other is x + 3.

**x + (x + 3) = 15**

**2x + 3 = 15**

**2x = 12, so x = 6**

The two numbers are **6 and 9**.

---

## 🔴 HARD [SAT-Style Reasoning] — The Leaning Ladder

### Question

A **15-foot ladder** leans against a wall, with its base **9 feet** from the wall.

How high up the wall does the ladder reach?

A) 6 feet  
B) 10 feet  
C) 12 feet  
D) 13 feet

### Answer

**C) 12 feet**

### Explanation

The ladder, the wall, and the ground form a right triangle, with the ladder as the hypotenuse. Use the Pythagorean theorem:

**height² + 9² = 15²**

**height² = 225 − 81 = 144**

**height = √144 = 12 feet**

### App Design Note

A simple right-triangle diagram (ladder, wall, ground labeled with the two known lengths) per §3's "Geometry → Diagram" row helps a solver see which sides are which before reaching for the formula.

---

## 🟢 EASY [Logic/Puzzle] — The Feathers and Steel

### Question

Which is heavier: **1,000 grams of feathers** or **1 kilogram of steel**?

A) The feathers  
B) The steel  
C) They weigh the same  
D) Not enough information

### Answer

**C) They weigh the same**

### Explanation

**1 kilogram = 1,000 grams** — so 1,000 grams of feathers and 1 kilogram of steel are exactly the same weight. Only their *volume* and density differ, not their weight.

---

## 🟡 MEDIUM [Logic/Puzzle] — The Four Drinks

### Question

Jax, Kim, Lee, and Mo each prefer a different drink: **coffee, tea, juice, or water**.

- Jax doesn't like coffee or tea.
- Kim likes juice.
- Lee doesn't like water.
- Mo likes coffee.

What drink does Jax prefer?

A) Coffee  
B) Tea  
C) Juice  
D) Water

### Answer

**D) Water**

### Explanation

Kim already has juice, and Mo already has coffee, leaving tea and water for Jax and Lee.

Jax doesn't like coffee or tea — so Jax must have **water**. (That leaves tea for Lee, which fits: Lee just doesn't like water.)

### App Design Note

A 4-person × 4-drink grid (per §3's "Logic → Grid" row) is a natural next step up in complexity from "The Three Pets" (§6e) — same mechanic, one more person and one more option.

---

## 🔴 HARD [Logic/Puzzle] — The Impossible Statement

### Question

Alex and Bo are two people. One of them **always tells the truth**; the other **always lies**. You don't know which is which.

Alex says: **"I am the liar."**

What can you conclude?

A) Alex is the liar  
B) Alex is the truth-teller  
C) The statement leads to a contradiction either way — it couldn't actually have been said under the puzzle's own rules  
D) Bo is the liar

### Answer

**C) The statement leads to a contradiction either way — it couldn't actually have been said under the puzzle's own rules**

### Explanation

Test both possibilities:

If Alex is the **truth-teller**, then "I am the liar" would have to be true — meaning Alex is the liar. Contradiction.

If Alex is the **liar**, then "I am the liar" would have to be false — meaning Alex is *not* the liar. Contradiction.

Neither assignment survives — the statement is self-defeating, so a strict truth-teller/liar couldn't consistently say it in the first place.

---

## 🟢 EASY [Developer Logic] — The Reversed List

### Question

A program takes the list **[1, 2, 3]** and reverses it.

What is the **first** item printed from the reversed list?

A) 1  
B) 2  
C) 3  
D) It depends on the programming language

### Answer

**C) 3**

### Explanation

Reversing **[1, 2, 3]** gives **[3, 2, 1]** — so the first item is **3**.

---

## 🟡 MEDIUM [Developer Logic] — The First Match

### Question

A program checks numbers **in order** and stops at the first one greater than 50, from this list:

**12, 34, 45, 61, 22, 78**

Which number does it return?

A) 78  
B) 61  
C) 45  
D) 22

### Answer

**B) 61**

### Explanation

Checking in the list's own order: 12 (no), 34 (no), 45 (no), **61 (yes — stop here)**.

The trap is assuming it returns the *largest* number over 50 (78) — but the program stops at the *first* one it finds, and 78 comes later in the list, so it's never reached.

---

## 🔴 HARD [Developer Logic] — The Recursive Countdown

### Question

A function is defined as: **count(n)** — if n is 0 or less, stop; otherwise print n, then call **count(n − 2)**.

If you call **count(7)**, what is the **last** number printed before it stops?

A) 7  
B) 0  
C) 1  
D) -1

### Answer

**C) 1**

### Explanation

Trace it step by step:

**count(7)** → print 7 → **count(5)** → print 5 → **count(3)** → print 3 → **count(1)** → print 1 → **count(-1)** → -1 is ≤ 0, so it stops without printing.

The last number actually printed is **1** — the trap is assuming it counts down to exactly 0, but stepping by 2 from an odd start skips right past it.

---

# 6g. Additional Question Bank — Batch 7 (Draft, toward the 170 target)

*Drafted for parent review — same structure as Batch 6: one Easy + one Medium + one Hard per category, 15 questions total, continuing to build toward 70/55/35 (easy/medium/hard).*

---

## 🟢 EASY [Brain Teasers] — The Vowel Count

### Question

How many vowels (A, E, I, O, U) are in the word **ELEPHANT**?

A) 2  
B) 3  
C) 4  
D) 5

### Answer

**B) 3**

### Explanation

Spelling it out: **E-L-E-P-H-A-N-T**. The vowels are **E, E, A** — three total.

---

## 🟡 MEDIUM [Brain Teasers] — The Siblings' Ages

### Question

Sam is twice as old as his sister Mia. **In 4 years, Sam will be 20.**

How old is Mia right now?

A) 6  
B) 7  
C) 8  
D) 10

### Answer

**C) 8**

### Explanation

If Sam will be 20 in 4 years, Sam is **16 now**.

Sam is twice Mia's age, so Mia is **16 ÷ 2 = 8**.

---

## 🔴 HARD [Brain Teasers] — The Three Switches

### Question

Outside a closed room, there are **three switches**. Exactly one of them controls a lightbulb inside the room. You may flip the switches however you like, but you may only **enter the room and look at the bulb once**.

How can you determine, with certainty, which switch controls the bulb?

A) It's impossible with only one look  
B) Flip each switch on and off quickly, then enter and see which one left a smell  
C) Turn one switch on for a few minutes, then turn it off and turn a second switch on; the bulb's state and warmth (on / off-but-warm / off-and-cold) tell you which switch is which  
D) Flip all three on, then enter — whichever bulb is on is the answer

### Answer

**C) Turn one switch on for a few minutes, then turn it off and turn a second switch on; the bulb's state and warmth (on / off-but-warm / off-and-cold) tell you which switch is which**

### Explanation

Turn **Switch 1** on and leave it for a few minutes (long enough to warm up a bulb), then turn it **off** and immediately turn **Switch 2** on. Now go look:

- If the bulb is **on** → it's **Switch 2**.
- If the bulb is **off but warm** → it was recently on, so it's **Switch 1**.
- If the bulb is **off and cold** → it was never on at all, so it's **Switch 3**.

One look gives you three distinguishable outcomes instead of just two (on/off), because heat gives you a third piece of information.

---

## 🟢 EASY [Clever Math] — The Movie Tickets

### Question

Two movie tickets cost **$9 each**. Popcorn costs **$6** total.

What's the total cost?

A) $15  
B) $18  
C) $24  
D) $30

### Answer

**C) $24**

### Explanation

**2 × $9 = $18** for tickets, plus **$6** for popcorn:

**$18 + $6 = $24**

---

## 🟡 MEDIUM [Clever Math] — The Simple Interest

### Question

You deposit **$1,000** in an account earning **5% simple interest per year**.

How much interest will you have earned after **2 years**?

A) $50  
B) $100  
C) $105  
D) $110

### Answer

**B) $100**

### Explanation

Simple interest doesn't compound — it's the same amount each year:

**$1,000 × 0.05 × 2 years = $100**

---

## 🔴 HARD [Clever Math] — The Three Workers

### Question

Worker A can finish a job alone in **6 days**. Worker B alone in **12 days**. Worker C alone in **4 days**.

If all three work together, how long will the job take?

A) 1.5 days  
B) 2 days  
C) 2.5 days  
D) 4 days

### Answer

**B) 2 days**

### Explanation

Add their rates (jobs per day), using a common denominator of 12:

**1/6 + 1/12 + 1/4 = 2/12 + 1/12 + 3/12 = 6/12 = 1/2 job per day**

At half a job per day, the whole job takes **2 days**.

---

## 🟢 EASY [SAT-Style Reasoning] — The Coordinate Distance

### Question

A point is located at **(3, 4)** on a coordinate grid.

How far is this point from the origin, (0, 0)?

A) 4  
B) 5  
C) 6  
D) 7

### Answer

**B) 5**

### Explanation

Use the distance formula (really just the Pythagorean theorem):

**√(3² + 4²) = √(9 + 16) = √25 = 5**

---

## 🟡 MEDIUM [SAT-Style Reasoning] — The Quadratic Roots

### Question

What are the solutions to **x² − 5x + 6 = 0**?

A) x = 1, 6  
B) x = 2, 3  
C) x = -2, -3  
D) x = 2, 6

### Answer

**B) x = 2, 3**

### Explanation

Factor the quadratic: you need two numbers that multiply to 6 and add to -5 — that's **-2 and -3**.

**x² − 5x + 6 = (x − 2)(x − 3) = 0**

So **x = 2** or **x = 3**.

---

## 🔴 HARD [SAT-Style Reasoning] — The Father and Son

### Question

A father is currently **3 times as old** as his son. **In 12 years, the father will be twice as old** as his son.

How old is the son right now?

A) 8  
B) 10  
C) 12  
D) 14

### Answer

**C) 12**

### Explanation

Let the son's current age be x, so the father is 3x.

In 12 years: **3x + 12 = 2(x + 12)**

**3x + 12 = 2x + 24**

**x = 12**

Check: the father is 36 now; in 12 years, father = 48, son = 24, and 48 is indeed twice 24. ✓

---

## 🟢 EASY [Logic/Puzzle] — The Coin Sequences

### Question

You flip a fair coin **3 times** in a row.

How many different possible sequences of heads/tails are there?

A) 3  
B) 6  
C) 8  
D) 9

### Answer

**C) 8**

### Explanation

Each flip has 2 possible outcomes, and there are 3 flips:

**2 × 2 × 2 = 8**

---

## 🟡 MEDIUM [Logic/Puzzle] — The Four Cards

### Question

Four cards — red, blue, green, and yellow — lie face down in a row, positions 1 through 4.

- The red card is not in position 1 or position 4.
- The blue card is immediately to the left of the green card.
- The yellow card is in position 4.

What position is the red card in?

A) 1  
B) 2  
C) 3  
D) 4

### Answer

**C) 3**

### Explanation

Yellow is fixed at position 4. Red can't be in 1 or 4, so red is in 2 or 3.

Try red in position 2: that leaves positions 1 and 3 for blue and green — but they aren't next to each other, so blue can't be "immediately left of" green there. Contradiction.

So red must be in **position 3**, leaving positions 1 and 2 for blue and green: blue in 1, green in 2 — which are adjacent, satisfying the clue.

### App Design Note

A simple 4-slot card row (per §3's "Deduction → Boxes and objects" row) that fills in as each clue is applied would make this easier to track than reading the clues as pure text.

---

## 🔴 HARD [Logic/Puzzle] — The Census Taker

### Question

A census taker asks a woman for her three children's ages. She says: **"The product of their ages is 36, and the sum of their ages is my house number."**

The census taker looks at the house number and says he still can't determine the ages. She adds: **"The oldest one has red hair."**

Now the census taker knows the ages. What are the three ages?

A) 1, 6, 6  
B) 2, 2, 9  
C) 3, 3, 4  
D) 2, 3, 6

### Answer

**B) 2, 2, 9**

### Explanation

List every way three positive whole ages can multiply to 36, along with each set's sum:

1,1,36 (38) · 1,2,18 (21) · 1,3,12 (16) · 1,4,9 (14) · **1,6,6 (13)** · **2,2,9 (13)** · 2,3,6 (11) · 3,3,4 (10)

Every sum is unique **except 13**, which two different triples share: {1, 6, 6} and {2, 2, 9}. That's exactly why knowing the house number (the sum) wasn't enough for the census taker — his house number must be 13, and it's genuinely ambiguous between those two options.

The final clue — "the **oldest** one" (singular) — rules out {1, 6, 6}, where two children are tied for oldest at age 6. That leaves **{2, 2, 9}**.

---

## 🟢 EASY [Developer Logic] — The Boolean Flip

### Question

A variable starts as **True**. It gets flipped (negated) **3 times** in a row.

What is its value at the end?

A) True  
B) False  
C) Impossible to tell  
D) It depends on the starting value

### Answer

**B) False**

### Explanation

Track it: True → False → True → **False**.

An **odd** number of flips always ends up opposite to where it started; an even number always returns to the original value.

---

## 🟡 MEDIUM [Developer Logic] — The Cache Eviction

### Question

A cache holds the **3 most recently looked-up items**, most recent at the front: **[banana, cherry, date]**.

A lookup for **"apple"** happens next — it's not in the cache, so it gets fetched and placed at the front. Since the cache only holds 3 items, the oldest (last) item is removed.

What does the cache contain after this lookup?

A) [apple, banana, cherry, date]  
B) [apple, banana, cherry]  
C) [banana, cherry, date, apple]  
D) [apple, date, cherry]

### Answer

**B) [apple, banana, cherry]**

### Explanation

Adding "apple" to the front gives **[apple, banana, cherry, date]** — but that's 4 items, one too many.

The oldest item (the last one, "date") gets evicted, leaving **[apple, banana, cherry]**.

---

## 🔴 HARD [Developer Logic] — The Deadlock

### Question

Alex is holding flour; Bo is holding eggs — both needed to bake a cake. Alex won't hand over the flour until he gets the eggs first. Bo won't hand over the eggs until he gets the flour first. Neither budges.

What is this situation called, and how is it typically resolved?

A) A race condition — solved by having them act in a random order  
B) A deadlock — solved by having one side yield and go first  
C) An infinite loop — solved by adding a counter that stops it  
D) A memory leak — solved by cleaning up unused resources

### Answer

**B) A deadlock — solved by having one side yield and go first**

### Explanation

This is a classic **deadlock**: two sides are each waiting on the other, and neither will make the first move, so nothing ever happens.

The only way out is for one side to **break the symmetry** — someone has to hand something over first, on trust, before getting anything back. Neither more time nor more patience fixes it; only one side yielding does.

---

# 7. The Overall Question Mix

A strong version of the app could combine these categories:

### 🧠 Brain Teasers
- Patterns
- Sequences
- Deduction
- Ordering
- Lateral thinking

### 🔢 Clever Math
- Percentages
- Ratios
- Rates
- Averages
- Probability
- Functions

### 🎓 SAT-Style Reasoning
- Algebra
- Advanced math
- Data analysis
- Geometry
- Word problems

### ⚡ Wonderlic-Style Reasoning
- Numerical reasoning
- Verbal reasoning
- Analogies
- Logic
- Short cognitive challenges

### 💯 1% Club
- Deceptive wording
- Hidden assumptions
- Counterintuitive logic
- "Obvious answer" traps
- Lateral thinking
- Questions where the insight matters more than the calculation

---

# 8. The Golden Rule

The app should **never feel like studying**.

The user should feel like they're playing a game with their friends.

The ideal reaction after seeing the answer is:

> **"Ohhhh, that's clever."**

Not:

> "I guess I need to study more algebra."

That distinction should guide the question-writing, visuals, explanations, difficulty system, and overall product experience.
