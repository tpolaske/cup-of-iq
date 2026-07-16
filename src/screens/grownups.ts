// grownups.ts — the long-press-gated panel (GRN-1..3): level picker with
// plain-language names, sound toggle, reset-with-confirm, privacy note.

export interface GrownupsOpts {
  level: number;
  sound: boolean;
  levelNames: string[];
  onSetLevel: (level: number) => void;
  onToggleSound: (on: boolean) => void;
  onReset: () => void;
}

export function openGrownups(o: GrownupsOpts): void {
  const overlay = document.createElement('div');
  overlay.className = 'overlay';

  const panel = document.createElement('div');
  panel.className = 'panel';

  const heading = document.createElement('h2');
  heading.textContent = 'For grown-ups';
  panel.appendChild(heading);

  const note = document.createElement('p');
  note.className = 'panel-note';
  note.textContent = 'Level changes apply from the next round.'; // PRG-4
  panel.appendChild(note);

  let current = o.level;
  const list = document.createElement('div');
  o.levelNames.forEach((name, i) => {
    const b = document.createElement('button');
    b.className = 'lvl' + (i + 1 === current ? ' current' : '');
    b.textContent = `Level ${i + 1} — ${name}`;
    b.addEventListener('click', () => {
      current = i + 1;
      o.onSetLevel(current);
      list.querySelectorAll('.lvl').forEach((btn, j) => btn.classList.toggle('current', j + 1 === current));
    });
    list.appendChild(b);
  });
  panel.appendChild(list);

  const soundRow = document.createElement('label');
  soundRow.className = 'row';
  const soundLabel = document.createElement('span');
  soundLabel.textContent = 'Sound';
  const sound = document.createElement('input');
  sound.type = 'checkbox';
  sound.checked = o.sound;
  sound.addEventListener('change', () => o.onToggleSound(sound.checked));
  soundRow.append(soundLabel, sound);
  panel.appendChild(soundRow);

  const reset = document.createElement('button');
  reset.className = 'pbtn danger';
  reset.textContent = 'Reset all progress';
  reset.addEventListener('click', () => {
    if (confirm('Reset all progress on this device?')) o.onReset(); // GRN-3
  });
  panel.appendChild(reset);

  const privacy = document.createElement('p');
  privacy.className = 'privacy';
  privacy.textContent = 'All of Cup of IQ\u2019s data lives on this device — nothing is ever sent anywhere.'; // GRN-2
  panel.appendChild(privacy);

  const close = document.createElement('button');
  close.className = 'pbtn';
  close.textContent = 'Close';
  close.addEventListener('click', () => overlay.remove());
  panel.appendChild(close);

  overlay.appendChild(panel);
  overlay.addEventListener('pointerdown', (e) => {
    if (e.target === overlay) overlay.remove();
  });
  document.body.appendChild(overlay);
}
