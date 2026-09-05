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

A shrinking line-segment diagram (1,000 → 500 → 250 → …) after each simulated question would sell the "cutting in half" insight far better than the number alone.

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
