// puzzle/screens/reveal.ts — the reveal (TMR-5, design.md §2). Deliberately
// minimal: the full-size pennant plus a check/x per question. No tier name, no
// score, no time, no difficulty label — those live on the results screen. It
// auto-advances after a short pause; a quiet Continue button lets anyone skip
// the wait (and keeps the timed advance from being the only way forward).

import type { RevealView } from '../boot';
import { pennantSvg } from '../pennant';
import { escapeHtml } from './play';

export const REVEAL_MS = 2400; // design.md: 1.5–2.5 s

const CHECK = '<svg aria-hidden="true" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
const CROSS = '<svg aria-hidden="true" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';

export function renderReveal(view: RevealView): string {
  const { round } = view;
  const sunday = round.isSpecialDay;
  const marks = round.questions
    .map((q, i) => {
      const who = sunday ? 'The 1% question' : `Question ${i + 1}`;
      const word = q.correct ? 'correct' : 'not this time';
      return `<li class="pz-mark ${q.correct ? 'is-right' : 'is-wrong'}">${q.correct ? CHECK : CROSS}<span class="pz-sr">${who}: ${word}</span></li>`;
    })
    .join('');
  return (
    `<div class="pz-screen pz-reveal">` +
    `<div class="pz-hd"><span>Cup of IQ · Day ${round.dayNumber}</span><span>Locked in</span></div>` +
    `<div class="pz-reveal-body">${pennantSvg(view.school)}` +
    `<ul class="pz-marks" aria-label="${escapeHtml(sunday ? 'Your answer' : 'Your answers')}">${marks}</ul></div>` +
    `<button type="button" class="pz-btn pz-quiet" data-act="continue">Continue</button>` +
    `</div>`
  );
}

export function showReveal(root: HTMLElement, view: RevealView, delayMs: number = REVEAL_MS): void {
  root.innerHTML = renderReveal(view);
  let done = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const go = () => {
    if (done) return;
    done = true;
    if (timer !== undefined) clearTimeout(timer);
    root.onclick = null;
    view.onDone();
  };
  root.onclick = (e) => {
    if ((e.target as HTMLElement).closest('[data-act="continue"]')) go();
  };
  timer = setTimeout(go, delayMs);
}
