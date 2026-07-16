// comeback.ts — the once-a-day card (LCK-1/2): static dino, no replay
// affordance, no interactive toy elements. Counting mission arrives in Phase 2.
import type { Dino } from '../daily';
import { attachLongPress, copyText, shareResult } from '../ui';

export interface ComebackOpts {
  dino: Dino;
  shareText: string | null; // null in private mode — no stored result to share (NFR-7)
  onGrownups: () => void;
}

export function showComeback(root: HTMLElement, o: ComebackOpts): void {
  root.innerHTML = '';
  const el = document.createElement('div');
  el.className = 'comeback';

  const pic = document.createElement('div');
  pic.className = 'comeback-dino';
  const img = document.createElement('img');
  img.src = '/' + o.dino.image;
  img.alt = o.dino.displayName;
  img.addEventListener('error', () => {
    const d = document.createElement('div');
    d.className = 'dino-emoji';
    d.textContent = o.dino.emoji;
    img.replaceWith(d);
  });
  pic.appendChild(img);

  const title = document.createElement('div');
  title.className = 'res-title';
  title.textContent = `${o.dino.displayName} hatched today!`;

  const sub = document.createElement('div');
  sub.className = 'res-sub';
  sub.textContent = 'New egg tomorrow 🥚';

  el.append(pic, title, sub);

  if (o.shareText) {
    const text = o.shareText;
    const btns = document.createElement('div');
    btns.className = 'btn-row';
    btns.append(
      pbtn('Share', () => void shareResult(text)),
      pbtn('Copy', () => void copyText(text)),
    );
    el.appendChild(btns);
  }

  const grown = document.createElement('button');
  grown.className = 'grown-link';
  grown.textContent = 'For grown-ups (press and hold)';
  attachLongPress(grown, 2000, o.onGrownups); // GRN-1: panel entry lives here too
  el.appendChild(grown);

  root.appendChild(el);
}

function pbtn(label: string, onClick: () => void): HTMLButtonElement {
  const b = document.createElement('button');
  b.className = 'pbtn';
  b.textContent = label;
  b.addEventListener('click', onClick);
  return b;
}
