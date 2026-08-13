// celebration.ts — hatch reveal + dance (REV-1..3, CEL-1..3, AUD-5).
// Discovery framing, never prize language; identical regardless of accuracy
// except confetti, size, and the roar beat below — all signed-off perfect-round
// treatment (SHR-2, CEL-2 sign-off #19/#20).
import { dinoBadgeColor, type Dino } from '../daily';
import * as feedback from '../feedback';

const CONFETTI_COLORS = ['#9CBF7B', '#E8B84B', '#D98E73', '#8FB8D9', '#C9A0C6'];

export function showCelebration(root: HTMLElement, dino: Dino, perfect: boolean, onDone: () => void): void {
  root.innerHTML = '';
  const party = document.createElement('div');
  party.className = 'party';

  const pop = document.createElement('div');
  pop.className = 'party-pop';
  const dinoEl = document.createElement('div');
  // sign-off #20 — perfect rounds render the dino larger for the whole
  // celebration, not just the momentary roar pulse.
  dinoEl.className = perfect ? 'party-dino perfect' : 'party-dino';
  const img = document.createElement('img');
  img.src = '/' + dino.image;
  img.alt = dino.displayName;
  img.addEventListener('error', () => {
    // Real art lands in Phase 2; until then, sign-off #22 gives each species a
    // stable badge color so the daily change is actually visible — otherwise
    // every dino falls back to one of only two emoji (🦕/🦖).
    const d = document.createElement('div');
    d.className = 'dino-emoji';
    d.style.background = dinoBadgeColor(dino.id);
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
  feedback.rawr(perfect); // AUD-5/6 — perfect rounds get the bonus "rawr-big" clip

  window.setTimeout(() => {
    if (perfect) {
      // Sign-off #19 — the one accuracy-driven beat on the child-facing screen:
      // a big scale/shake "roar" pulse + burst text, then settle into the normal
      // dance (still at the enlarged #20 size). Carries fully muted (FBK-5).
      dinoEl.classList.add('roar');
      const burst = document.createElement('div');
      burst.className = 'roar-burst';
      burst.textContent = 'RAWRRR!';
      party.appendChild(burst);
      window.setTimeout(() => {
        dinoEl.classList.remove('roar');
        dinoEl.classList.add('dance');
      }, 750);
    } else {
      dinoEl.classList.add('dance'); // popin, then dance
    }
  }, 700);

  window.setTimeout(onDone, 4500); // CEL-1 (4–8 s) → CEL-3 auto-transition
}
