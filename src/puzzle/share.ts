// puzzle/share.ts — pure share-text builder (SHR-1/2, STK-4, design.md §10).
// No DOM here; the screens own the share sheet and clipboard via
// shared/share.ts (shareOrCopy / copyToClipboard).

import { bannerLine } from './banner';
import type { LastPlayed } from './progress';

export const SHARE_URL = 'https://cupofiq.com/puzzle';

// Go-live decision (2026-10-27): the streak line only appears at 2+, so a
// missing streak never reads as a scolding. A Sunday Waitlisted result carries
// no streak line either (it always resets the streak, STK-2).
export const MIN_STREAK_TO_SHARE = 2;

// `streak` is the streak AFTER this round (PuzzleState.accuracyStreak).
export function buildShareText(round: LastPlayed, streak: number): string {
  const lines: string[] = [];

  if (round.isSpecialDay) {
    lines.push(`Cup of IQ · Puzzle  Day ${round.dayNumber} · 💯 Sunday special`);
    lines.push(
      round.outcome === 'accepted'
        ? 'Solved the 1% question — accepted!'
        : 'The 1% question got me — waitlisted',
    );
  } else {
    const correct = round.questions.filter((q) => q.correct).length;
    lines.push(`Cup of IQ · Puzzle  Day ${round.dayNumber}`);
    lines.push(`${correct}/${round.questions.length} correct`);
  }

  lines.push(bannerLine(round.outcome, round.school));

  if (round.outcome !== 'waitlisted' && streak >= MIN_STREAK_TO_SHARE) {
    lines.push(`🔥 ${streak}-day streak`);
  }

  lines.push(SHARE_URL);
  return lines.join('\n');
}
