// game.ts — the round state machine (design.md §2):
// idle → awaiting_tap ⇄ (target_correct | target_incorrect) → complete.
// Celebration/results are separate screens; main.ts wires them via onComplete.
import type { BoardSpec } from './daily';
import { mountBoard } from './board';
import * as feedback from './feedback';

const WORDS = ['', 'One!', 'Two!', 'Three!', 'Four!', 'Five!', 'Six!', 'Seven!', 'Eight!', 'Nine!', 'Ten!'];

export interface RoundOutcome {
  wrongTaps: number;
}

export function playRound(
  root: HTMLElement,
  spec: BoardSpec,
  assignment: number[],
  onComplete: (outcome: RoundOutcome) => void,
): void {
  const order = [...spec.values].sort((a, b) => a - b); // TAP-1: ascending values
  let idx = 0;
  let wrongTaps = 0;
  let missStreak = 0;
  let finished = false;

  const board = mountBoard(root, spec, assignment, (value) => {
    if (finished) return;
    feedback.unlockAudio(); // AUD-4: first gesture unlocks audio
    const target = order[idx];

    if (value === target) {
      missStreak = 0;
      board.complete(value); // TAP-3/4, TRL-3
      board.clearHint();
      feedback.sayNumber(value); // AUD-1
      board.showWord(WORDS[value] ?? String(value)); // AUD-2
      const n = idx + 1;
      // TRL-1 — L1 and L2 both draw a trail (sign-off #24: L2 is identical to
      // L1's mechanic, just with 5 targets instead of 3).
      if (spec.layout === 'scatter3' || spec.layout === 'scatter5') board.drawTrailSegment(n);
      const stage = spec.revealAfterTap[n];
      if (stage && stage !== 'hatch') board.advanceReveal(stage); // TRL-2
      idx += 1;
      if (idx >= order.length) {
        finished = true;
        window.setTimeout(() => onComplete({ wrongTaps }), 700); // pause, then hatch (REV-1)
      }
    } else {
      wrongTaps += 1; // FBK-4: counted, never surfaced to the child
      missStreak += 1;
      board.wobble(value); // FBK-1
      board.showHmm();
      feedback.playHmm();
      if (missStreak >= 3) board.hint(target); // FBK-3: patient bounce until tapped
    }
  });

  void board; // handles are owned by the tap closure above
}
