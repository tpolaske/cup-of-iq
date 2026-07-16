// board.ts — renders targets per BoardSpec (design.md §6, §7b). Thin DOM layer;
// game.ts owns the rules. Geometry and timings mirror prototype/prototype-l1.html.
import type { BoardSpec, RevealStage } from './daily';

export interface BoardHandles {
  complete(value: number): void; // TAP-4 / TRL-3
  wobble(value: number): void; // FBK-1
  hint(value: number): void; // FBK-3
  clearHint(): void;
  drawTrailSegment(n: number): void; // TRL-1 (L1 only)
  advanceReveal(stage: RevealStage): void; // TRL-2
  showWord(word: string): void; // AUD-2
  showHmm(): void; // FBK-1
}

const SCENE_W = 336;
const SCENE_H = 452;
// Scatter slots A/B/C and nest anchor, scene units (design.md §7b).
const SCATTER_SLOTS = [
  { x: 240, y: 212 },
  { x: 86, y: 300 },
  { x: 234, y: 384 },
];
const NEST = { x: 172, y: 112 };
const PATCH_W = 104;
const PATCH_H = 96;
// Quincunx egg centers: 92×104 eggs (≥ 88 px, BRD-1), rows 128 px apart → ≥ 24 px vertical gaps.
const QUINCUNX = [
  { x: 70, y: 72 },
  { x: 266, y: 72 },
  { x: 168, y: 200 },
  { x: 70, y: 328 },
  { x: 266, y: 328 },
];
const EGG_W = 92;
const EGG_H = 104;

function printGlyph(cx: number, cy: number, s = 1): string {
  const e = (dx: number, dy: number, rx: number, ry: number) =>
    `<ellipse cx="${cx + dx * s}" cy="${cy + dy * s}" rx="${rx * s}" ry="${ry * s}"/>`;
  return `<g>${e(0, 0, 8, 9.6)}${e(-6.2, -10.4, 3, 4.4)}${e(0, -13.2, 3, 4.8)}${e(6.2, -10.4, 3, 4.4)}</g>`;
}

// Footprint placements inside a patch, per count (prototype geometry).
const PATCH_LAYOUTS: Record<number, [number, number, number][]> = {
  1: [[52, 52, 1.3]],
  2: [
    [36, 38, 1.075],
    [66, 62, 1.075],
  ],
  3: [
    [30, 34, 1],
    [66, 46, 1],
    [38, 66, 1],
  ],
};

function patchSVG(count: number): string {
  const layout = PATCH_LAYOUTS[count] ?? PATCH_LAYOUTS[3];
  const prints = layout.map(([x, y, s]) => printGlyph(x, y, s)).join('');
  return `<svg width="100%" height="100%" viewBox="0 0 ${PATCH_W} ${PATCH_H}">
    <ellipse cx="52" cy="50" rx="50" ry="42" fill="#F5EDDD"/>
    <g class="prints" fill="#9DB289">${prints}</g>
  </svg>`;
}

// Egg face for L2+ (BRD-1/BRD-4): huge numeral; L2 adds the matching prints row.
function eggSVG(value: number, withPrints: boolean): string {
  let prints = '';
  if (withPrints) {
    const s = 0.3;
    const gap = 15;
    const x0 = 52 - ((value - 1) * gap) / 2;
    let g = '';
    for (let i = 0; i < value; i++) g += printGlyph(x0 + i * gap, 92, s);
    prints = `<g fill="#5F7F49">${g}</g>`;
  }
  return `<svg width="100%" height="100%" viewBox="0 0 104 120">
    <path d="M52 6 C77 6 91 35 91 66 C91 95 74 112 52 112 C30 112 13 95 13 66 C13 35 27 6 52 6 Z" fill="#FFFDF7" stroke="#E8DCC8" stroke-width="4"/>
    <text x="52" y="${withPrints ? 74 : 82}" text-anchor="middle" font-size="${withPrints ? 42 : 48}" font-weight="800" fill="#4A4038">${value}</text>
    ${prints}
  </svg>`;
}

// Day-egg reveal layers (TRL-2), shared by the L1 nest scene and the L2+ header egg.
function revealEggInner(): string {
  return `
    <path d="M75 8 C99 8 112 36 112 66 C112 94 96 108 75 108 C54 108 38 94 38 66 C38 36 51 8 75 8 Z" fill="#FFFDF7" stroke="#E8DCC8" stroke-width="4"/>
    <path data-layer="crackA" d="M58 44 L67 54 L61 66 L70 76" fill="none" stroke="#B7A182" stroke-width="3" stroke-linecap="round" style="display:none"/>
    <path data-layer="crackA2" d="M70 76 L63 86 L69 94" fill="none" stroke="#B7A182" stroke-width="3" stroke-linecap="round" style="display:none"/>
    <path data-layer="crackB" d="M92 38 L84 50 L93 60 L85 74" fill="none" stroke="#B7A182" stroke-width="3" stroke-linecap="round" style="display:none"/>
    <g data-layer="peek" style="display:none">
      <ellipse cx="75" cy="62" rx="17" ry="12" fill="#5C4A3A"/>
      <circle cx="69" cy="60" r="4" fill="#9CBF7B"/><circle cx="81" cy="60" r="4" fill="#9CBF7B"/>
      <circle cx="69" cy="60" r="1.8" fill="#3F3A33"/><circle cx="81" cy="60" r="1.8" fill="#3F3A33"/>
      <circle cx="69.6" cy="59.3" r=".7" fill="#FFF"/><circle cx="81.6" cy="59.3" r=".7" fill="#FFF"/>
    </g>`;
}

// L1 nest scene: sand mound, twig arcs, day egg with reveal layers (prototype geometry).
function nestSceneSVG(): string {
  return `<svg width="150" height="128" viewBox="0 0 150 128">
    <ellipse cx="75" cy="112" rx="58" ry="14" fill="#D9C1A0"/>
    <path d="M20 108 Q40 96 75 96 Q110 96 130 108" fill="none" stroke="#B79A72" stroke-width="5" stroke-linecap="round"/>
    <path d="M28 114 Q50 104 75 104 Q100 104 122 114" fill="none" stroke="#C9AD84" stroke-width="4" stroke-linecap="round"/>
    <g>${revealEggInner()}</g>
  </svg>`;
}

// L2+ header egg (no nest): the same reveal layers above the board (design.md §7b, L2 note).
function dayEggSVG(): string {
  return `<svg width="72" height="94" viewBox="33 3 84 110">${revealEggInner()}</svg>`;
}

// Stages are cumulative: showing `peek` also shows every crack before it.
const REVEAL_CUMULATIVE: Record<Exclude<RevealStage, 'hatch'>, string[]> = {
  crackA: ['crackA'],
  crackA2: ['crackA', 'crackA2'],
  crackB: ['crackA', 'crackA2', 'crackB'],
  peek: ['crackA', 'crackA2', 'crackB', 'peek'],
};

export function mountBoard(
  root: HTMLElement,
  spec: BoardSpec,
  assignment: number[],
  onTap: (value: number) => void,
): BoardHandles {
  root.innerHTML = '';
  const scene = document.createElement('div');
  scene.className = spec.layout === 'scatter3' ? 'scene' : 'scene-eggs';
  root.appendChild(scene);

  const valueEl = new Map<number, HTMLElement>();
  const trail: SVGLineElement[] = [];
  let revealHost: HTMLElement | null = null;

  const word = document.createElement('div');
  word.className = 'word-bub';
  scene.appendChild(word);

  const attachTap = (el: HTMLElement, value: number) => {
    el.addEventListener('pointerdown', () => {
      if (el.dataset.done) return; // TAP-4: completed targets are inert
      onTap(value);
    });
  };

  if (spec.layout === 'scatter3') {
    // Trail overlay under the patches. Segment endpoints are computed from the
    // slot centers *after* the daily shuffle — never hardcoded (design.md §7b).
    const slotOfValue = new Map<number, { x: number; y: number }>();
    assignment.forEach((v, i) => slotOfValue.set(v, SCATTER_SLOTS[i]));
    const waypoints = [...spec.values].sort((a, b) => a - b).map((v) => slotOfValue.get(v)!);
    waypoints.push(NEST);

    const NS = 'http://www.w3.org/2000/svg';
    const overlay = document.createElementNS(NS, 'svg');
    overlay.setAttribute('viewBox', `0 0 ${SCENE_W} ${SCENE_H}`);
    overlay.setAttribute('class', 'trail');
    for (let i = 0; i < waypoints.length - 1; i++) {
      const line = document.createElementNS(NS, 'line');
      line.setAttribute('x1', String(waypoints[i].x));
      line.setAttribute('y1', String(waypoints[i].y));
      line.setAttribute('x2', String(waypoints[i + 1].x));
      line.setAttribute('y2', String(waypoints[i + 1].y));
      line.setAttribute('stroke', '#C9B694');
      line.setAttribute('stroke-width', '4');
      line.setAttribute('stroke-dasharray', '2 12');
      line.setAttribute('stroke-linecap', 'round');
      line.style.opacity = '0';
      line.style.transition = 'opacity .6s ease'; // TRL-1
      overlay.appendChild(line);
      trail.push(line);
    }
    scene.appendChild(overlay);

    const nest = document.createElement('div');
    nest.className = 'nest';
    nest.innerHTML = nestSceneSVG();
    scene.appendChild(nest);
    revealHost = nest;

    assignment.forEach((v, i) => {
      const slot = SCATTER_SLOTS[i];
      const patch = document.createElement('div');
      patch.className = 'patch';
      patch.style.left = `${slot.x - PATCH_W / 2}px`;
      patch.style.top = `${slot.y - PATCH_H / 2}px`;
      patch.style.animationDelay = `${i * 0.35}s`;
      patch.innerHTML = patchSVG(v);
      attachTap(patch, v);
      scene.appendChild(patch);
      valueEl.set(v, patch);
    });
  } else {
    const dayEgg = document.createElement('div');
    dayEgg.className = 'day-egg';
    dayEgg.innerHTML = dayEggSVG();
    scene.appendChild(dayEgg);
    revealHost = dayEgg;

    const board = document.createElement('div');
    board.className = spec.layout === 'quincunx5' ? 'board5' : 'board10';
    scene.appendChild(board);

    assignment.forEach((v, i) => {
      const target = document.createElement('div');
      target.className = 'egg-target';
      target.innerHTML = eggSVG(v, spec.face === 'prints+numeral');
      if (spec.layout === 'quincunx5') {
        const c = QUINCUNX[i];
        target.style.left = `${c.x - EGG_W / 2}px`;
        target.style.top = `${c.y - EGG_H / 2}px`;
      }
      target.style.animationDelay = `${(i % 3) * 0.35}s`;
      attachTap(target, v);
      board.appendChild(target);
      valueEl.set(v, target);
    });
  }

  const hmm = document.createElement('div');
  hmm.className = 'hmm';
  hmm.textContent = 'hmm?';
  scene.appendChild(hmm);

  const el = (v: number) => valueEl.get(v);

  return {
    complete(v) {
      const e = el(v);
      if (!e) return;
      e.dataset.done = '1';
      e.classList.remove('hint', 'wob');
      e.classList.add('done'); // stamp pop (TRL-3)
      e.querySelectorAll<SVGGElement>('.prints').forEach((g) => {
        g.style.fill = '#5F7F49';
      });
    },
    wobble(v) {
      const e = el(v);
      if (!e || e.dataset.done) return;
      e.classList.remove('wob');
      void e.offsetWidth; // restart the animation
      e.classList.add('wob');
    },
    hint(v) {
      const e = el(v);
      if (e && !e.dataset.done) e.classList.add('hint');
    },
    clearHint() {
      valueEl.forEach((e) => e.classList.remove('hint'));
    },
    drawTrailSegment(n) {
      const line = trail[n - 1];
      if (line) line.style.opacity = '1';
    },
    advanceReveal(stage) {
      if (!revealHost || stage === 'hatch') return;
      for (const name of REVEAL_CUMULATIVE[stage]) {
        const layer = revealHost.querySelector<SVGElement>(`[data-layer="${name}"]`);
        if (layer) layer.style.display = 'block';
      }
      revealHost.classList.remove('jiggle');
      void revealHost.offsetWidth;
      revealHost.classList.add('jiggle'); // ≤ 450 ms (TRL-2)
    },
    showWord(w) {
      word.textContent = w;
      word.classList.remove('pop');
      void word.offsetWidth;
      word.classList.add('pop'); // 1.4 s pop-rise-fade (AUD-2)
    },
    showHmm() {
      hmm.style.opacity = '1';
      window.setTimeout(() => {
        hmm.style.opacity = '0';
      }, 700); // FBK-1
    },
  };
}
