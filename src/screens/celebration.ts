// celebration.ts — hatch reveal + dance (REV-1..3, CEL-1..3, AUD-5).
// Discovery framing, never prize language; identical regardless of accuracy
// except confetti, which is the signed-off perfect-round treatment.
import type { Dino } from '../daily';
import * as feedback from '../feedback';

const CONFETTI_COLORS = ['#9CBF7B', '#E8B84B', '#D98E73', '#8FB8D9', '#C9A0C6'];

export function showCelebration(root: HTMLElement, dino: Dino, perfect: boolean, onDone: () => void): void {
  root.innerHTML = '';
  const party = document.createElement('div');
  party.className = 'party';

  const pop = document.createElement('div');
  pop.className = 'party-pop';
  const dinoEl = document.createElement('div');
  dinoEl.className = 'party-dino';
  const img = document.createElement('img');
  img.src = '/' + dino.image;
  img.alt = dino.displayName;
  img.addEventListener('error', () => {
    // Real art lands in Phase 2; the emoji is the placeholder (tasks.md ship gate).
    const d = document.createElement('div');
    d.className = 'dino-emoji';
    d.textContent = dino.emoji;
    img.replaceWith(d);
  });
  dinoEl.appendChild(img);
  pop.appendChild(dinoEl);

  const line = document.createElement('div');
  line.className = 'party-line';
  line.textContent = 'You found her!'; // REV-3 discovery framing
  const sub = document.createElement('div');
  sub.className = 'party-sub';
  sub.textContent = `A ${dino.displayName.toLowerCase()}!`;
  party.append(pop, line, sub);

  if (perfect) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    for (let i = 0; i < 26; i++) {
      const piece = document.createElement('div');
      piece.style.left = `${4 + Math.random() * 92}%`;
      piece.style.background = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
      piece.style.animation = `fall ${1.7 + Math.random() * 1.4}s linear ${Math.random() * 1.2}s forwards`;
      confetti.appendChild(piece);
    }
    party.appendChild(confetti);
  }

  root.appendChild(party);
  feedback.rawr(); // AUD-5
  window.setTimeout(() => dinoEl.classList.add('dance'), 700); // popin, then dance
  window.setTimeout(onDone, 4500); // CEL-1 (4–8 s) → CEL-3 auto-transition
}
