// puzzle/types.ts — shared type definitions for puzzle mode (design.md §3–§5).

export type Difficulty = 'easy' | 'medium' | 'hard' | '1percent';
export type Category = 'brain-teaser' | 'clever-math' | 'sat-style' | 'logic' | 'developer-logic';
export type Slot = 'q1' | 'q2' | 'q3' | 'special';

// CNT-1 — MVP is multiple-choice only (sign-off #22).
export interface Puzzle {
  id: string;
  category: Category;
  difficulty: Difficulty;
  title?: string; // authoring aid only; never shown to players
  prompt: string;
  answerFormat: 'multipleChoice';
  choices: string[];
  correctIndex: number;
  explanation: string;
}

export interface PuzzleContent {
  byDifficulty: { easy: Puzzle[]; medium: Puzzle[]; hard: Puzzle[] };
  onePercent: Puzzle[];
}

export type WeekdayTier = 'tier1' | 'tier2' | 'tier3' | 'tier4' | 'fail';
export type SundayOutcome = 'accepted' | 'waitlisted';
export type Outcome = WeekdayTier | SundayOutcome;

// Pennant colors (design.md §9): base = felt color, accent = stitching/text.
export interface School {
  name: string;
  base: string; // #RRGGBB
  accent: string; // #RRGGBB
}

// No sundayFail pool — Waitlisted reuses tier1 (TMR-3a).
export type SchoolContent = Record<WeekdayTier, School[]>;
