// puzzle/timer.ts — single round stopwatch (design.md §7, ANS-2/ANS-4).
// Pure core: the clock is injected so pause/resume math is unit-testable.
// The readout is never rendered anywhere — it only feeds the tier algorithm.

export interface RoundTimer {
  start(): void; // idempotent — starts once, when the round first renders
  pause(): void; // page hidden
  resume(): void; // page visible again
  stop(): number | null; // Lock it in → elapsed seconds (null if never started / untimed)
  readonly running: boolean;
}

// `timed: false` (Sunday) makes every call a no-op and stop() return null, so
// no totalSeconds is ever recorded (design §4/§5).
export function createRoundTimer(timed: boolean, now: () => number = () => performance.now()): RoundTimer {
  let started = false;
  let stopped = false;
  let running = false;
  let accumulatedMs = 0;
  let lastStart = 0;

  const settle = () => {
    if (running) {
      accumulatedMs += Math.max(0, now() - lastStart);
      running = false;
    }
  };

  return {
    start() {
      if (!timed || started || stopped) return;
      started = true;
      running = true;
      lastStart = now();
    },
    pause() {
      if (!timed || stopped) return;
      settle();
    },
    resume() {
      if (!timed || !started || stopped || running) return;
      running = true;
      lastStart = now();
    },
    stop() {
      if (!timed || !started) return null;
      if (!stopped) {
        settle();
        stopped = true;
      }
      return accumulatedMs / 1000;
    },
    get running() {
      return running;
    },
  };
}

interface VisibilityTarget {
  readonly hidden: boolean;
  addEventListener(type: 'visibilitychange', listener: () => void): void;
  removeEventListener(type: 'visibilitychange', listener: () => void): void;
}

// ANS-4 — pause while the page is hidden (tab backgrounded / screen locked).
// Returns a detach function. Call after timer.start().
export function pauseWhileHidden(timer: RoundTimer, doc: VisibilityTarget): () => void {
  const onChange = () => (doc.hidden ? timer.pause() : timer.resume());
  doc.addEventListener('visibilitychange', onChange);
  return () => doc.removeEventListener('visibilitychange', onChange);
}
