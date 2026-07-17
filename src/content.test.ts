import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

// Content-validation test (design.md \u00a74, NFR-2, NFR-6, AUD-3).
// Binary assets can't land through the text-only MCP connector, so *existence*
// is only enforced when STRICT_ASSETS=1 \u2014 flip that on in CI once the art and
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
    expect(dinos.length).toBeGreaterThanOrEqual(30);
    const ids = dinos.map((d) => d.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const d of dinos) {
      expect(d.id).toMatch(/^[a-z0-9-]+$/);
      expect(d.displayName.trim().length).toBeGreaterThan(0);
      expect(d.emoji.trim().length).toBeGreaterThan(0);
      expect(d.image).toMatch(/^img\/dinos\/[a-z0-9-]+\.webp$/);
      expect(d.funFact.trim().length).toBeGreaterThan(0);
    }
  });

  it('title ladder is exactly the signed-off ladder, ordered, exhaustive (SHR-1)', () => {
    expect(titles.map((t) => t.id)).toEqual(['t-rex', 'triceratops', 'stegosaurus', 'brontosaurus']);
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

  it('voice manifest covers values 1\u201310 plus rawr (AUD-3)', () => {
    for (const key of ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'rawr']) {
      expect(manifest[key], `manifest missing "${key}"`).toMatch(/^voice\/[a-z]+\.m4a$/);
    }
  });

  it('asset weight budgets: images \u2264 60 KB, voice \u2264 25 KB (NFR-2)', () => {
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
    for (const f of Object.values(manifest)) check(f, 25 * 1024);

    expect(overweight).toEqual([]);
    if (process.env.STRICT_ASSETS === '1') {
      expect(missing).toEqual([]);
    } else if (missing.length > 0) {
      console.warn(
        `[content] ${missing.length} asset(s) not yet committed (expected pre-art):`,
        missing.slice(0, 5).join(', '),
        missing.length > 5 ? '\u2026' : '',
      );
    }
  });
});
