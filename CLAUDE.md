# Cup of IQ

Daily dino-tracking counting game for one toddler. Static site, no backend, built by one parent, designed to last 5 years at ~1 hr/month maintenance. **The specs are the source of truth — read before coding:**

- `requirements.md` — EARS requirements + every parent sign-off. Cite requirement IDs (DPS-1, TRL-2, …) in code comments and PRs.
- `design.md` — architecture; §3 code is normative; §7b is the full Level 1 implementation spec.
- `tasks.md` — the backlog. **One task = one PR.**
- `learning-review.md` — why the design is shaped this way. Don't re-litigate settled decisions.
- `prototype/prototype-l1.html` — open it in a browser first; it is the timing/feel source of truth. Throwaway code: never import from it.

# Commands

```bash
npm run dev              # Vite dev server
npm test                 # Vitest — TZ is pinned in config; don't remove it
npm test -- -t "name"    # prefer single tests over the full suite
npm run build            # output must stay ≤ 300 KB gzipped incl. today's dino
```

# Hard rules

- **Zero runtime dependencies.** Vite + Vitest are dev-only. No frameworks, no animation libraries (CSS keyframes only), no date libraries.
- **No network calls except our own static assets.** No analytics, fonts, cookies, or third-party scripts (NFR-3).
- **No speech synthesis, ever** (AUD-3). Voice = recorded files in `public/voice/` resolved through `manifest.json`.
- **Never add:** backend, accounts, CMS, feed, chat, leaderboard, collection screen, timers, ads (NFR-5). If a task seems to need one, the task is wrong — stop and ask.
- **`LAUNCH_DATE` is immutable** once the first real result is shared. Changing it renumbers every day and reshuffles every board.
- **Child-facing surfaces:** no reading required to play, no red/X/buzzer, no prize language, no stars or trophies. Accuracy appears only on grown-up surfaces (FBK-2, REV-3, CEL-2).
- **Don't build the engine.** Shared modules get extracted when Mode 2 actually lands, not before (design.md §10).

# Code style

- Vanilla TypeScript, kebab-case filenames, modules export `mount(el, props)`-style functions.
- Pure logic lives in `daily.ts` / `progress.ts` and is fully unit-tested. DOM code stays thin; the manual on-device checklist covers it.
- Content budgets are enforced by the content-validation test: dino images WebP ≤ 60 KB, voice files ≤ 25 KB. Keep the test strict.

# Gotchas (each already bit us in review)

- JS `%` preserves sign — always use `posMod()`. `dayNumber` clamps to 1 pre-launch. Don't "simplify" either one.
- `Math.round` in `dayNumber` is deliberate: it absorbs DST's 23/25-hour days. Not a bug.
- Audio unlocks on the first tap gesture, never on page load — iOS/Android requirement (AUD-4).
- Private browsing: no localStorage → no lock → the comeback card never shows. This is correct behavior, do not fix it (NFR-7).
- L1 trail segment endpoints are computed from the daily shuffle at round start — never hardcoded (BRD-3).
- The scatter-slot geometry must never let spatial position reveal tap order (BRD-3). The counting is the puzzle.

# Workflow

1. Pick one unchecked task from `tasks.md`.
2. Plan before touching multiple files; skip the plan for one-line fixes.
3. Logic first with tests, DOM after. `npm test` green before every commit.
4. PR description cites the requirement IDs the change implements.
5. **When Claude gets something wrong, fix it AND add the rule to this file in the same PR.** This file is the project's memory — it should get smarter every week.
