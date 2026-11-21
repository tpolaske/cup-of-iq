import { describe, expect, it } from 'vitest';
import schoolsJson from '../../content/schools.json';
import { nameFontSize, pennantSvg, splitName } from './pennant';
import type { School, SchoolContent } from './types';

const yale: School = { name: 'Yale', base: '#00356B', accent: '#FFFFFF' };

describe('pennantSvg', () => {
  it('is an accessible svg in the school colors with an uppercase name', () => {
    const svg = pennantSvg(yale, 290, 'a');
    expect(svg).toContain('role="img"');
    expect(svg).toContain('aria-label="Yale pennant"');
    expect(svg).toContain('fill="#00356B"');
    expect(svg).toContain('>YALE<');
    expect(svg).toContain('width="290"');
  });

  it('escapes names and falls back on bad colors', () => {
    const svg = pennantSvg({ name: 'A&M <x>', base: 'red', accent: 'nope' }, 100, 'b');
    expect(svg).toContain('A&amp;M &lt;X&gt;');
    expect(svg).not.toContain('<x>');
    expect(svg).toContain('fill="#4A382B"');
    expect(svg).toContain('fill="#FFFFFF"');
  });

  it('gives each pennant unique defs ids so several can share a page', () => {
    const a = pennantSvg(yale);
    const b = pennantSvg(yale);
    const id = (s: string) => /id="fg([^"]+)"/.exec(s)?.[1];
    expect(id(a)).not.toBe(id(b));
    expect(a).toContain(`url(#fg${id(a)})`);
  });

  it('splits long names over two lines and shrinks the font to fit', () => {
    expect(splitName('YALE')).toEqual(['YALE']);
    expect(splitName('CENTRAL CONNECTICUT STATE')).toEqual(['CENTRAL', 'CONNECTICUT STATE']);
    expect(splitName('UNIVERSITYOFSOMETHING')).toEqual(['UNIVERSITYOFSOMETHING']);
    expect(nameFontSize(['YALE'])).toBe(26);
    expect(nameFontSize(['CENTRAL', 'CONNECTICUT STATE'])).toBeLessThan(26);
    const svg = pennantSvg({ name: 'Central Connecticut State', base: '#0033A0', accent: '#FFFFFF' }, 290, 'c');
    expect(svg.match(/<text /g)).toHaveLength(2);
  });

  it('renders all 24 real schools with a legible font size (>= 14)', () => {
    const pools = Object.values(schoolsJson as unknown as SchoolContent).flat();
    expect(pools).toHaveLength(24);
    for (const s of pools) {
      const svg = pennantSvg(s, 290, 'x');
      expect(svg).toContain('<text');
      expect(nameFontSize(splitName(s.name.toUpperCase()))).toBeGreaterThanOrEqual(14);
    }
  });
});
