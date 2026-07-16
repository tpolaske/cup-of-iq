// feedback.ts — recorded-voice playback (AUD-1..5). The sfx set (crack-pop,
// "hmm?" marimba, fanfare) is Phase 2; animations fully carry muted play per
// FBK-5, so every call here is safe to no-op.

let soundOn = true;
let manifest: Record<string, string> | null = null;
let current: HTMLAudioElement | null = null;
let unlocked = false;
const cache = new Map<string, HTMLAudioElement>();

export function setSound(on: boolean): void {
  soundOn = on;
  if (!on && current) current.pause();
}

// AUD-4 — lazy-load after first paint so NFR-2's first-render budget is unaffected.
export async function preloadVoice(): Promise<void> {
  try {
    const res = await fetch('/voice/manifest.json');
    if (res.ok) manifest = (await res.json()) as Record<string, string>;
  } catch {
    manifest = null; // word bubbles keep the play fully understandable (AUD-2)
  }
}

// AUD-4 — iOS/Android require the first play() inside a user gesture. game.ts
// calls this on every tap; sayNumber() itself also runs inside the tap handler.
export function unlockAudio(): void {
  unlocked = true;
}

function play(key: string): void {
  if (!soundOn || !unlocked || !manifest) return;
  const src = manifest[key];
  if (!src) return;
  try {
    if (current) {
      current.pause();
      current.currentTime = 0; // AUD-1: cut off, never queue
    }
    let audio = cache.get(src);
    if (!audio) {
      audio = new Audio('/' + src);
      cache.set(src, audio);
    }
    current = audio;
    audio.currentTime = 0;
    void audio.play().catch(() => {
      // Voice file not recorded/committed yet, or autoplay blocked — silent no-op.
    });
  } catch {
    // no-op
  }
}

export function sayNumber(value: number): void {
  play(String(value)); // AUD-1
}

export function rawr(): void {
  play('rawr'); // AUD-5
}

export function playHmm(): void {
  // Soft "hmm?" two-note chime lands with the Phase 2 sfx set (FBK-1);
  // the wobble + text carry the feedback until then (FBK-5).
}
