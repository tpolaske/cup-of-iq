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
