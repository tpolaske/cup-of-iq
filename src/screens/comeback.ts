// comeback.ts — the once-a-day card (LCK-1): today's dino, statically, and
// "new egg tomorrow". The day still OPENS here rather than on the board — the
// ritual is unchanged; replaying is a deliberate extra tap (LCK-5).
import { dinoBadgeColor, type Dino } from '../daily';
import { copyText, grownupsLink, shareResult } from '../ui';

export interface ComebackOpts {
  dino: Dino;
  shareText: string | null; // null in private mode — no stored result to share (NFR-7)
  onGrownups: () => void;
  onReplay: () => void;
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
    // Sign-off #22 — same interim badge-color treatment as celebration.ts,
    // until real per-species art lands (Phase 2).
    const d = document.createElement('div');
    d.className = 'dino-emoji';
    d.style.background = dinoBadgeColor(o.dino.id);
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

  // LCK-5 — same dino, fresh tracks. Nothing is recorded or shared.
  const again = document.createElement('div');
  again.className = 'btn-row';
  again.appendChild(pbtn('🥚 Play again', o.onReplay));
  el.appendChild(again);

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

  el.appendChild(grownupsLink(o.onGrownups));

  root.appendChild(el);
}

function pbtn(label: string, onClick: () => void): HTMLButtonElement {
  const b = document.createElement('button');
  b.className = 'pbtn';
  b.textContent = label;
  b.addEventListener('click', onClick);
  return b;
}
