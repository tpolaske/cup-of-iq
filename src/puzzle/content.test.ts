import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

// Puzzle-bank validation (requirements CNT-1..CNT-3, sign-offs #21/#22).
// Runs on every CI build, so a malformed question can never reach production.

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const readJson = (rel: string) => JSON.parse(readFileSync(path.join(root, rel), 'utf8')) as unknown;

const CATEGORIES = ['brain-teaser', 'clever-math', 'sat-style', 'logic', 'developer-logic'];

interface Puzzle {
  id: string;
  category: string;
  difficulty: string;
  title?: string;
  prompt: string;
  answerFormat: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
}

const main = readJson('content/puzzles.json') as Record<string, Puzzle[]>;
const one = (readJson('content/puzzles-1percent.json') as { onePercent: Puzzle[] }).onePercent;
const pools: Record<string, Puzzle[]> = { easy: main.easy, medium: main.medium, hard: main.hard, '1percent': one };
const all = Object.values(pools).flat();

// Authoring targets (question-bank-target). Reported, not enforced, until go-live.
const TARGET: Record<string, number> = { easy: 71, medium: 55, hard: 36, '1percent': 10 };

describe('puzzle content: pools', () => {
  it('has exactly the four expected pools, all non-empty', () => {
    expect(Object.keys(main).sort()).toEqual(['easy', 'hard', 'medium']);
    for (const [name, pool] of Object.entries(pools)) expect(pool.length, name).toBeGreaterThan(0);
  });

  it('no pool length is a multiple of 7 (weekly-cycle collision, sign-off #21)', () => {
    for (const [name, pool] of Object.entries(pools)) expect(pool.length % 7, name).not.toBe(0);
  });

  it('each question sits in the pool matching its difficulty', () => {
    for (const [name, pool] of Object.entries(pools)) for (const p of pool) expect(p.difficulty, p.id).toBe(name);
  });

  it('reports progress toward the go-live targets', () => {
    const gap = Object.fromEntries(Object.entries(TARGET).map(([k, t]) => [k, `${pools[k].length}/${t}`]));
    console.info('question bank progress:', gap);
  });
});

describe('puzzle content: every question', () => {
  it('ids are unique and well-formed', () => {
    const ids = all.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const p of all) expect(p.id, p.id).toMatch(/^(easy|medium|hard|1percent)-\d{3}$/);
  });

  it('category is in the sign-off #21 enum (1% Club is a difficulty, never a category)', () => {
    for (const p of all) expect(CATEGORIES, p.id).toContain(p.category);
  });

  it('is multiple choice with exactly 4 distinct, non-empty choices and one valid answer', () => {
    for (const p of all) {
      expect(p.answerFormat, p.id).toBe('multipleChoice');
      expect(p.choices, p.id).toHaveLength(4);
      expect(new Set(p.choices.map((c) => c.trim().toLowerCase())).size, p.id).toBe(4);
      for (const c of p.choices) expect(c.trim().length, p.id).toBeGreaterThan(0);
      expect(Number.isInteger(p.correctIndex), p.id).toBe(true);
      expect(p.correctIndex, p.id).toBeGreaterThanOrEqual(0);
      expect(p.correctIndex, p.id).toBeLessThan(4);
    }
  });

  it('has a prompt and a real explanation', () => {
    for (const p of all) {
      expect(p.prompt.trim().length, p.id).toBeGreaterThan(10);
      expect(p.explanation.trim().length, p.id).toBeGreaterThan(20);
    }
  });

  it('never refers to answers by letter (choices get reordered)', () => {
    for (const p of all) {
      expect(`${p.prompt}\n${p.explanation}`, p.id).not.toMatch(/\b(option|choice|answer) [A-D]\b|The answer is [A-D]\)/i);
      for (const c of p.choices) expect(c, p.id).not.toMatch(/\b(all|none|both|neither) of the above\b/i);
    }
  });

  it('is plain text: no markdown emphasis, headings, tables or fences (UI renders pre-wrap)', () => {
    for (const p of all) {
      const t = `${p.prompt}\n${p.explanation}`;
      expect(t, p.id).not.toMatch(/\*\*|^#{1,6} |^\|.*\|\s*$|^> |```/m);
    }
  });

  it('answer positions are not skewed (no position holds > 35% of the bank)', () => {
    for (let i = 0; i < 4; i++) {
      const share = all.filter((p) => p.correctIndex === i).length / all.length;
      expect(share, `position ${i}`).toBeLessThan(0.35);
    }
  });
});
