// puzzle/screens/play.ts — the play screen (design.md §2, ANS-3).
// Thin DOM layer over pure pieces: renderPlay (state → HTML), actionFromDataset
// (click → action) and applyPlayAction (action → session call). Only showPlay
// touches the DOM. Shows no timer and no difficulty labels (ANS-2).

import type { PlayView } from '../boot';
import type { SessionState } from '../puzzle';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string);
}

export function renderPlay(st: SessionState): string {
  const n = st.questions.length;
  const i = st.currentIndex;
  const q = st.questions[i];
  const chosen = st.answers[i];
  const multi = n > 1;

  const bars = multi
    ? `<div class="pz-bars" aria-hidden="true">${st.questions
        .map((_, k) => `<span class="pz-bar${st.answers[k] !== null ? ' is-done' : ''}${k === i ? ' is-current' : ''}"></span>`)
        .join('')}</div>`
    : '';

  const choices = q.puzzle.choices
    .map(
      (text, k) =>
        `<button type="button" class="pz-choice${chosen === k ? ' is-selected' : ''}" data-act="choose" data-val="${k}" aria-pressed="${chosen === k}">` +
        `<span class="pz-letter" aria-hidden="true">${LETTERS[k] ?? k + 1}</span><span class="pz-choice-text">${escapeHtml(text)}</span></button>`,
    )
    .join('');

  const nav = multi
    ? `<button type="button" class="pz-btn pz-nav" data-act="goto" data-val="${i - 1}" aria-label="Previous question"${i === 0 ? ' disabled' : ''}>&larr;</button>`
    : '';
  const next = multi
    ? `<button type="button" class="pz-btn pz-nav" data-act="goto" data-val="${i + 1}" aria-label="Next question"${i === n - 1 ? ' disabled' : ''}>&rarr;</button>`
    : '';

  const label = multi ? `Question ${i + 1} of ${n}` : 'Sunday special';
  return (
    `<div class="pz-screen pz-play">` +
    `<div class="pz-hd"><span>Cup of IQ · Day ${st.dayNumber}</span><span>${label}</span></div>` +
    bars +
    `<div class="pz-card"><p class="pz-prompt">${escapeHtml(q.puzzle.prompt)}</p></div>` +
    `<div class="pz-choices">${choices}</div>` +
    `<div class="pz-actions">${nav}<button type="button" class="pz-btn pz-primary pz-lock" data-act="lock"${st.allAnswered ? '' : ' disabled'}>Lock it in</button>${next}</div>` +
    `<p class="pz-hint">${st.allAnswered ? "Once locked in, answers can't change." : multi ? 'Answer all three to lock in.' : 'Pick an answer to lock in.'}</p>` +
    `</div>`
  );
}

export type PlayAction =
  | { type: 'choose'; choice: number }
  | { type: 'goto'; index: number }
  | { type: 'lock' };

export function actionFromDataset(act: string | undefined, val: string | undefined): PlayAction | null {
  const n = val === undefined ? NaN : Number(val);
  if (act === 'choose' && Number.isInteger(n)) return { type: 'choose', choice: n };
  if (act === 'goto' && Number.isInteger(n)) return { type: 'goto', index: n };
  if (act === 'lock') return { type: 'lock' };
  return null;
}

// Returns true when the screen should re-render. After a successful lock-in the
// boot controller swaps in the reveal, so this screen must not redraw over it.
export function applyPlayAction(view: PlayView, a: PlayAction): boolean {
  const s = view.session;
  if (a.type === 'choose') s.select(s.getState().currentIndex, a.choice);
  else if (a.type === 'goto') s.goTo(a.index);
  else view.onLockIn();
  return s.getState().phase === 'answering_round';
}

export function showPlay(root: HTMLElement, view: PlayView): void {
  const draw = () => {
    root.innerHTML = renderPlay(view.session.getState());
  };
  // Assigned (not added) so the next screen replaces it by reassigning onclick.
  root.onclick = (e) => {
    const el = (e.target as HTMLElement).closest<HTMLElement>('[data-act]');
    if (!el || el.hasAttribute('disabled')) return;
    const a = actionFromDataset(el.dataset.act, el.dataset.val);
    if (a && applyPlayAction(view, a)) draw();
  };
  draw();
}
