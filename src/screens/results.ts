// results.ts — grown-up-facing results (SHR-1/2, PRM-1, PRG-3). Accuracy lives
// here only; the child-facing celebration is identical at every accuracy (CEL-2).
// Stats shown are always the day's recorded first attempt, never a replay.
import type { Dino } from '../daily';
import type { TitleDef } from '../share';
import { copyText, grownupsLink, shareResult } from '../ui';

export interface ResultsOpts {
  dino: Dino;
  wrongTaps: number;
  title: TitleDef;
  level: number;
  levelName: string;
  perfectsAtLevel: number;
  leveledUp: boolean;
  nextLevelName: string | null;
  prompt: string;
  shareText: string;
  onGrownups: () => void;
  onReplay: () => void;
}

export function showResults(root: HTMLElement, o: ResultsOpts): void {
  root.innerHTML = '';
  const el = document.createElement('div');
  el.className = 'results';

  const perfect = o.wrongTaps === 0;

  const title = document.createElement('div');
  title.className = 'res-title';
  title.textContent = `${o.title.emoji} ${o.title.label}!${perfect ? ' ⭐' : ''}`;

  const sub = document.createElement('div');
  sub.className = 'res-sub';
  sub.textContent = `${o.dino.displayName} found — ${o.wrongTaps} wrong tap${o.wrongTaps === 1 ? '' : 's'} · Level ${o.level} (${o.levelName})`;

  el.append(title, sub);

  if (o.leveledUp && o.nextLevelName) {
    const up = document.createElement('div');
    up.className = 'res-sub res-up';
    up.textContent = `Level up! “${o.nextLevelName}” starts tomorrow 🎉`;
    el.appendChild(up);
  } else if (perfect) {
    const prog = document.createElement('div');
    prog.className = 'res-sub';
    prog.textContent = `Perfect round — ${o.perfectsAtLevel} of 3 perfect days at this level`;
    el.appendChild(prog);
  }

  const fact = document.createElement('div');
  fact.className = 'card';
  fact.textContent = `${o.dino.emoji} ${o.dino.funFact}`;

  const prompt = document.createElement('div');
  prompt.className = 'card';
  prompt.textContent = o.prompt;

  el.append(fact, prompt);

  // LCK-5 — replays are for fun only: nothing above changes when he plays again.
  const again = document.createElement('div');
  again.className = 'btn-row';
  again.appendChild(pbtn('🥚 Play again', o.onReplay));
  el.appendChild(again);

  const btns = document.createElement('div');
  btns.className = 'btn-row';
  btns.append(
    pbtn('Share', () => void shareResult(o.shareText)),
    pbtn('Copy', () => void copyText(o.shareText)),
  );
  el.appendChild(btns);

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
