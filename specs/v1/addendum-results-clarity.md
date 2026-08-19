# Addendum — Toddler Mode Results Screen Clarity (2026-08-15)

*Small addition to `requirements.md` (toddler dino mode), resolving swarm.md
PM-1 ("no grown-ups panel access before first round" / no parent context
before first play) with a simpler fix than originally proposed. Paste into
`requirements.md` §8 near SHR-1, and note as resolved in a future swarm
pass.*

## Decision

Considered a one-time onboarding modal after the landing-page tap
("first-time popup explaining the concept"). Rejected in favor of a
**permanent, always-shown line on the results screen** instead:

- Simpler to build — no new localStorage flag, no "has this parent seen
  it" state, nothing to reset if progress is cleared.
- Doubles as the daily return-hook, not just a one-time explainer — closer
  to how Wordle-style games always show "come back tomorrow," every day,
  not only on day one.
- Closes a real gap: today, "New egg tomorrow" messaging only exists on
  the **comeback card** (LCK-1) — shown only if the parent reopens the app
  *after* already completing the round. The results screen immediately
  after finishing has no such line at all. A parent who finishes the round
  and closes the tab currently never sees it.

## New requirement

- **SHR-7** WHEN the results screen renders, THE SYSTEM SHALL show a short,
  permanent line making the once-a-day ritual explicit — e.g. "🥚 New
  dinosaur hatches tomorrow." No dismiss action, no first-time-only logic,
  no new localStorage state — it always shows, every day, same as the
  parent prompt (PRM-1) it sits alongside.

## Placement

Same visual area as the existing dino/title/wrong-taps info (RES-1 in the
toddler spec's §8), small and quiet — not a banner, not bolded, doesn't
compete with the parent prompt (PRM-1) or share controls for attention.

## Not adopted

- A one-time modal/popup after the landing-page tap, before the first
  round — rejected per the reasoning above.
- A "first results screen only" version of this line — rejected in favor
  of always-on, since the ongoing daily-return value outweighs the small
  cost of one extra line every day.