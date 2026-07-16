import { describe, expect, it } from 'vitest';
import titlesJson from '../content/titles.json';
import { buildShareText, titleFor, type TitleDef } from './share';

const titles = titlesJson as TitleDef[];

describe('titleFor (SHR-1) \u2014 every tier positive', () => {
  it('0 wrong \u2192 T-Rex', () => expect(titleFor(0, titles).id).toBe('t-rex'));
  it('1 wrong \u2192 Triceratops', () => expect(titleFor(1, titles).id).toBe('triceratops'));
  it('2\u20133 wrong \u2192 Stegosaurus', () => {
    expect(titleFor(2, titles).id).toBe('stegosaurus');
    expect(titleFor(3, titles).id).toBe('stegosaurus');
  });
  it('4+ wrong \u2192 Brontosaurus', () => {
    expect(titleFor(4, titles).id).toBe('brontosaurus');
    expect(titleFor(12, titles).id).toBe('brontosaurus');
  });
});

describe('buildShareText (SHR-3)', () => {
  const base = { dayNumber: 14, dinoName: 'Baby Stegosaurus' };

  it('L1 carries the tracks line and the star on a perfect round', () => {
    const txt = buildShareText({ ...base, level: 1, wrongTaps: 0, title: titleFor(0, titles) });
    expect(txt).toBe(
      'Cup of IQ \ud83e\udd5a Day 14\n' +
        'We followed the tracks \u2014 Baby Stegosaurus hatched!\n' +
        '\ud83e\udd96 T-Rex round \u2014 0 wrong taps \u2b50\n' +
        'https://cupofiq.com',
    );
  });

  it('L2+ omits the tracks line (design.md \u00a78)', () => {
    const txt = buildShareText({ ...base, level: 3, wrongTaps: 2, title: titleFor(2, titles) });
    expect(txt).toContain('Baby Stegosaurus hatched!');
    expect(txt).not.toContain('followed the tracks');
  });

  it('singular for one wrong tap, and no star', () => {
    const txt = buildShareText({ ...base, level: 1, wrongTaps: 1, title: titleFor(1, titles) });
    expect(txt).toContain('1 wrong tap');
    expect(txt).not.toContain('1 wrong taps');
    expect(txt).not.toContain('\u2b50');
  });

  it('always ends with the product URL', () => {
    const txt = buildShareText({ ...base, level: 2, wrongTaps: 5, title: titleFor(5, titles) });
    expect(txt.endsWith('https://cupofiq.com')).toBe(true);
  });
});
