import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

// Content-validation test (design.md §4, NFR-2, NFR-6, AUD-3).
// Binary assets can't land through the text-only MCP connector, so *existence*
// is only enforced when STRICT_ASSETS=1 — flip that on in CI once the art and
// voice recordings are committed. Weight budgets are always enforced for any
// file that does exist.

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = (rel: string) => JSON.parse(readFileSync(path.join(root, rel), 'utf8')) as unknown;

interface DinoRow {
  id: string;
  displayName: string;
  emoji: string;
  image: string;
  funFact: string;
}
interface TitleRow {
  id: string;
  label: string;
  emoji: string;
  maxWrong: number | null;
}

const dinos = readJson('content/dinos.json') as DinoRow[];
const titles = readJson('content/titles.json') as TitleRow[];
const prompts = readJson('content/prompts.json') as string[];
const manifest = readJson('public/voice/manifest.json') as Record<string, string>;

describe('content validity', () => {
  it('dino ids are unique and every entry is complete (NFR-6)', () => {
    // Roster is intentionally trimmed to the 13 species with real art
    // (parent decision, 2026-08-13) — the daily rotation cycles only these
    // until Phase 4 batches more illustrations into content/dinos.json.
    // The original ~30-launch-dino target lives on in content/dinos-upcoming.json.
    expect(dinos.length).toBeGreaterThanOrEqual(10);
    const ids = dinos.map((d) => d.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const d of dinos) {
      expect(d.id).toMatch(/^[a-z0-9-]+$/);
      expect(d.displayName.trim().length).toBeGreaterThan(0);
      expect(d.emoji.trim().length).toBeGreaterThan(0);
      // .webp is preferred (smaller at the same quality) but .png is accepted
      // too — the real budget enforcement is the weight-check test below, not
      // the file extension (parent decision, 2026-08-12).
      expect(d.image).toMatch(/^img\/dinos\/[a-z0-9-]+\.(webp|png)$/);
      expect(d.funFact.trim().length).toBeGreaterThan(0);
    }
  });

  it('title ladder is exactly the signed-off ladder, ordered, exhaustive (SHR-1, sign-off #19)', () => {
    expect(titles.map((t) => t.id)).toEqual(['roar', 'trailblazer', 'egg-hunter', 'hatch-day']);
    expect(titles.map((t) => t.maxWrong)).toEqual([0, 1, 3, null]);
    for (const t of titles) {
      expect(t.label.trim().length).toBeGreaterThan(0);
      expect(t.emoji.trim().length).toBeGreaterThan(0);
    }
  });

  it('at least 10 non-empty parent prompts (PRM-1)', () => {
    expect(prompts.length).toBeGreaterThanOrEqual(10);
    for (const p of prompts) expect(p.trim().length).toBeGreaterThan(0);
  });

  it('voice manifest covers values 1–10 plus rawr (AUD-3)', () => {
    for (const key of ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'rawr']) {
      expect(manifest[key], `manifest missing "${key}"`).toMatch(/^voice\/[a-zA-Z-]+\.m4a$/);
    }
  });

  it('voice manifest includes the perfect-round bonus rawr-big (AUD-6, sign-off #19/#23)', () => {
    expect(manifest['rawr-big'], 'manifest missing "rawr-big"').toMatch(/^voice\/[a-zA-Z-]+\.m4a$/);
  });

  it('asset weight budgets: images ≤ 60 KB, voice ≤ 25 KB, rawr-big ≤ 70 KB (NFR-2, sign-off #23)', () => {
    const missing: string[] = [];
    const overweight: string[] = [];
    const check = (rel: string, budget: number) => {
      const p = path.join(root, 'public', rel);
      if (!existsSync(p)) {
        missing.push(rel);
        return;
      }
      if (statSync(p).size > budget) overweight.push(`${rel} (${statSync(p).size} B > ${budget} B)`);
    };
    for (const d of dinos) check(d.image, 60 * 1024);
    for (const [key, f] of Object.entries(manifest)) {
      // sign-off #23: the perfect-round bonus roar (rawr-big) is a longer
      // celebratory clip, not a one-word tap sound — it gets its own, larger
      // budget rather than being squeezed under the number-word ceiling.
      check(f, key === 'rawr-big' ? 70 * 1024 : 25 * 1024);
    }

    expect(overweight).toEqual([]);
    if (process.env.STRICT_ASSETS === '1') {
      expect(missing).toEqual([]);
    } else if (missing.length > 0) {
      console.warn(
        `[content] ${missing.length} asset(s) not yet committed (expected pre-art):`,
        missing.slice(0, 5).join(', '),
        missing.length > 5 ? '…' : '',
      );
    }
  });
});
