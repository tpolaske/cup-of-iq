// main.ts — boot: read state, compute the day, route to game or comeback
// (design.md §2). Everything below here is pure functions + a thin DOM layer.
import './styles.css';
import dinosJson from '../content/dinos.json';
import titlesJson from '../content/titles.json';
import promptsJson from '../content/prompts.json';
import { boardSeed, boardSpecForLevel, dayNumber, pickDaily, seededShuffle, type Dino } from './daily';
import * as progress from './progress';
import * as feedback from './feedback';
import { playRound } from './game';
import { showCelebration } from './screens/celebration';
import { showResults } from './screens/results';
import { showComeback } from './screens/comeback';
import { openGrownups } from './screens/grownups';
import { buildShareText, titleFor, type TitleDef } from './share';

const dinos = dinosJson as Dino[];
const titles = titlesJson as TitleDef[];
const prompts = promptsJson as string[];

const LEVEL_NAMES = ['Tracks', 'Tracks + numbers', 'Numbers', 'Bigger numbers', 'All numbers']; // BRD-1

const storage = progress.safeStorage(); // null in private mode → stateless round (NFR-7)
let state = progress.load(storage);
feedback.setSound(state.sound);

const day = dayNumber(); // DPS-1
const dino = pickDaily(day, dinos); // DPS-2 / REV-2: same species everywhere today
const prompt = pickDaily(day, prompts); // PRM-1

// Replay counter (LCK-5, sign-off #18). 0 = the day's real round — the only one
// recorded, scored, or shared. Resets on reload, so the first replay after a
// refresh repeats the morning's arrangement. Harmless.
let attempt = 0;

const hdr = document.getElementById('hdr')!;
const story = document.getElementById('story')!;
const app = document.getElementById('app')!;
hdr.textContent = `Cup of IQ 🥚 Day ${day}`;

const levelName = (l: number): string => LEVEL_NAMES[Math.min(Math.max(l, 1), 5) - 1];

function grownupsOpts() {
  return {
    level: state.level,
    sound: state.sound,
    levelNames: LEVEL_NAMES,
    onSetLevel: (l: number) => {
      state = progress.setLevel(state, l); // PRG-4: applies from the next round
      progress.save(storage, state);
    },
    onToggleSound: (on: boolean) => {
      state = { ...state, sound: on };
      progress.save(storage, state);
      feedback.setSound(on);
    },
    onReset: () => {
      progress.resetAll(storage); // GRN-3
      location.reload();
    },
  };
}

function shareTextFromLast(): string | null {
  const lp = state.lastPlayed;
  if (!lp) return null;
  const d = dinos.find((x) => x.id === lp.dinoId) ?? dino;
  const t = titles.find((x) => x.id === lp.titleId) ?? titleFor(lp.wrongTaps, titles);
  return buildShareText({
    dayNumber: lp.dayNumber,
    level: lp.levelPlayed,
    dinoName: d.displayName,
    wrongTaps: lp.wrongTaps,
    title: t,
  });
}

function renderComeback(): void {
  story.textContent = '';
  showComeback(app, {
    dino,
    shareText: shareTextFromLast(),
    onGrownups: () => openGrownups(grownupsOpts()),
    onReplay: () => runRound(false), // LCK-5
  });
}

function renderResults(): void {
  const lp = state.lastPlayed;
  if (!lp) {
    renderComeback();
    return;
  }
  // Always the recorded first attempt: replays never overwrite lastPlayed, so
  // the title, the wrong-tap count, and the share text stay the morning's.
  const t = titles.find((x) => x.id === lp.titleId) ?? titleFor(lp.wrongTaps, titles);
  showResults(app, {
    dino,
    wrongTaps: lp.wrongTaps,
    title: t,
    level: lp.levelPlayed,
    levelName: levelName(lp.levelPlayed),
    perfectsAtLevel: state.perfectsAtLevel,
    leveledUp: lp.leveledUp,
    nextLevelName: lp.leveledUp ? levelName(state.level) : null, // PRG-3
    prompt,
    shareText: shareTextFromLast() ?? '',
    onGrownups: () => openGrownups(grownupsOpts()),
    onReplay: () => runRound(false), // LCK-5
  });
}

// `record` is true only for the day's first round. A replay runs the identical
// play loop and celebration — the child sees no difference (CEL-2) — but writes
// nothing: no wrongTaps, no perfectsAtLevel, no level-up, no lock change.
function runRound(record: boolean): void {
  const level = state.level;
  const spec = boardSpecForLevel(level); // BRD-1
  const assignment = seededShuffle(spec.values, boardSeed(day, level, attempt)); // DPS-3
  story.textContent = level === 1 ? 'Follow the footprints to the egg!' : 'Tap the eggs in counting order!';
  playRound(app, spec, assignment, (outcome) => {
    if (record) {
      const t = titleFor(outcome.wrongTaps, titles);
      state = progress.recordRound(state, {
        dayNumber: day,
        levelPlayed: level,
        wrongTaps: outcome.wrongTaps,
        dinoId: dino.id,
        titleId: t.id,
      }); // PRG-1/2 + sets the LCK-1 lock
      progress.save(storage, state);
    }
    attempt++;
    story.textContent = '';
    showCelebration(app, dino, outcome.wrongTaps === 0, renderResults); // REV / CEL
  });
}

if (progress.playedToday(state, day)) {
  renderComeback(); // LCK-1 — the day still opens on the card, not the board
} else {
  runRound(true);
}

// AUD-4 — lazy-load voice after first paint so the first-render budget is untouched.
requestAnimationFrame(() => {
  window.setTimeout(() => {
    void feedback.preloadVoice();
  }, 0);
});
