import { describe, expect, it } from 'vitest';
import titlesJson from '../content/titles.json';
import { buildShareText, titleFor, type TitleDef } from './share';

const titles = titlesJson as TitleDef[];

describe('titleFor (SHR-1) — every tier positive (sign-off #19)', () => {
  it('0 wrong → Roar-some', () => expect(titleFor(0, titles).id).toBe('roar'));
  it('1 wrong → Trailblazer', () => expect(titleFor(1, titles).id).toBe('trailblazer'));
  it('2–3 wrong → Egg hunter', () => {
    expect(titleFor(2, titles).id).toBe('egg-hunter');
    expect(titleFor(3, titles).id).toBe('egg-hunter');
  });
  it('4+ wrong → Hatch day', () => {
    expect(titleFor(4, titles).id).toBe('hatch-day');
    expect(titleFor(12, titles).id).toBe('hatch-day');
  });
});

describe('buildShareText (SHR-3)', () => {
  const base = { dayNumber: 14, dinoName: 'Baby Stegosaurus' };

  it('L1 carries the tracks line and the star on a perfect round', () => {
    const txt = buildShareText({ ...base, level: 1, wrongTaps: 0, title: titleFor(0, titles) });
    expect(txt).toBe(
      'Cup of IQ 🥚 Day 14\n' +
        'We followed the tracks — Baby Stegosaurus hatched!\n' +
        '🦖 Roar-some round — 0 wrong taps ⭐\n' +
        'https://cupofiq.com',
    );
  });

  it('L2 "Tracks (more)" also carries the tracks line (sign-off #24)', () => {
    const txt = buildShareText({ ...base, level: 2, wrongTaps: 1, title: titleFor(1, titles) });
    expect(txt).toContain('We followed the tracks');
  });

  it('L3+ omits the tracks line (design.md §8, sign-off #24)', () => {
    const txt = buildShareText({ ...base, level: 3, wrongTaps: 2, title: titleFor(2, titles) });
    expect(txt).toContain('Baby Stegosaurus hatched!');
    expect(txt).not.toContain('followed the tracks');
  });

  it('singular for one wrong tap, and no star', () => {
    const txt = buildShareText({ ...base, level: 1, wrongTaps: 1, title: titleFor(1, titles) });
    expect(txt).toContain('1 wrong tap');
    expect(txt).not.toContain('1 wrong taps');
    expect(txt).not.toContain('⭐');
  });

  it('always ends with the product URL', () => {
    const txt = buildShareText({ ...base, level: 2, wrongTaps: 5, title: titleFor(5, titles) });
    expect(txt.endsWith('https://cupofiq.com')).toBe(true);
  });
});
