// progress.ts — localStorage schema v1 read/write, once-a-day lock, level-up
// rules (PRG, LCK, GRN-3, NFR-7). Pure core: storage is injected for tests.

export const STORAGE_KEY = 'cupofiq.v1';

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface LastPlayed {
  dayNumber: number;
  levelPlayed: number;
  wrongTaps: number;
  dinoId: string;
  titleId: string;
  leveledUp: boolean;
}

export interface AppState {
  schemaVersion: 1;
  level: number;
  perfectsAtLevel: number;
  // `sound` is a small addition for the GRN-2 sound toggle; optional-on-read so
  // any pre-existing v1 payload loads unchanged — still schemaVersion 1.
  sound: boolean;
  lastPlayed: LastPlayed | null;
}

export function defaultState(): AppState {
  return { schemaVersion: 1, level: 1, perfectsAtLevel: 0, sound: true, lastPlayed: null };
}

// NFR-7 — private browsing throws on access; the game then runs stateless.
export function safeStorage(): StorageLike | null {
  try {
    const s = window.localStorage;
    const probe = '__cupofiq_probe__';
    s.setItem(probe, '1');
    s.removeItem(probe);
    return s;
  } catch {
    return null;
  }
}

function clampInt(v: unknown, lo: number, hi: number, dflt: number): number {
  return typeof v === 'number' && Number.isFinite(v)
    ? Math.min(hi, Math.max(lo, Math.round(v)))
    : dflt;
}

function validLastPlayed(v: unknown): v is LastPlayed {
  if (typeof v !== 'object' || v === null) return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.dayNumber === 'number' &&
    typeof o.levelPlayed === 'number' &&
    typeof o.wrongTaps === 'number' &&
    typeof o.dinoId === 'string' &&
    typeof o.titleId === 'string' &&
    typeof o.leveledUp === 'boolean'
  );
}

export function load(storage: StorageLike | null): AppState {
  if (!storage) return defaultState();
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const p = JSON.parse(raw) as Record<string, unknown>;
    if (!p || p.schemaVersion !== 1) return defaultState(); // future: migration lives here
    return {
      schemaVersion: 1,
      level: clampInt(p.level, 1, 5, 1), // BRD-5: corrupt storage clamps
      perfectsAtLevel: clampInt(p.perfectsAtLevel, 0, 2, 0),
      sound: typeof p.sound === 'boolean' ? p.sound : true,
      lastPlayed: validLastPlayed(p.lastPlayed) ? p.lastPlayed : null,
    };
  } catch {
    return defaultState();
  }
}

export function save(storage: StorageLike | null, state: AppState): void {
  if (!storage) return;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage vanished mid-session (private mode edge) — run stateless (NFR-7).
  }
}

// LCK-1 — the lock check.
export function playedToday(state: AppState, day: number): boolean {
  return state.lastPlayed?.dayNumber === day;
}

export interface RoundInput {
  dayNumber: number;
  levelPlayed: number;
  wrongTaps: number;
  dinoId: string;
  titleId: string;
}

// PRG-1/2/5 — a perfect round increments the counter; at 3 the level advances
// (capped at 5, effective tomorrow) and the counter resets. Nothing ever
// decreases on a non-perfect round.
export function recordRound(state: AppState, r: RoundInput): AppState {
  const perfect = r.wrongTaps === 0;
  let perfects = state.perfectsAtLevel + (perfect ? 1 : 0);
  let level = state.level;
  let leveledUp = false;
  if (perfect && perfects >= 3) {
    if (level < 5) {
      level += 1;
      leveledUp = true;
    }
    perfects = 0;
  }
  return { ...state, level, perfectsAtLevel: perfects, lastPlayed: { ...r, leveledUp } };
}

// PRG-4 — manual override applies from the next un-played round; resets the counter.
export function setLevel(state: AppState, level: number): AppState {
  return { ...state, level: clampInt(level, 1, 5, state.level), perfectsAtLevel: 0 };
}

// GRN-3 — clear the namespace; caller reloads to a fresh state.
export function resetAll(storage: StorageLike | null): void {
  if (!storage) return;
  try {
    storage.removeItem(STORAGE_KEY);
  } catch {
    // nothing to clear
  }
}
