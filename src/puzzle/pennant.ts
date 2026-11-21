// puzzle/pennant.ts — the felt pennant (from the signed-off v3 mockup): felt
// grain, fold sheen, stitched edge, dark pole with grommets. Pure: returns an
// SVG string. The school name is shrunk, or split over two lines, to fit.

import { escapeHtml } from './screens/play';
import type { School } from './types';

let counter = 0;

function darken(hex: string, amount: number): string {
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m) return '#2B2B2B';
  const n = parseInt(m[1], 16);
  const ch = (shift: number) => Math.round(((n >> shift) & 255) * (1 - amount)).toString(16).padStart(2, '0');
  return `#${ch(16)}${ch(8)}${ch(0)}`;
}

function safeColor(c: string, fallback: string): string {
  return /^#[0-9a-f]{6}$/i.test(c) ? c : fallback;
}

// Best split into at most two lines by word, minimising the longest line.
export function splitName(upper: string): string[] {
  const words = upper.split(/\s+/).filter(Boolean);
  if (upper.length <= 14 || words.length < 2) return [upper];
  let best: string[] = [upper];
  let bestMax = upper.length;
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(' ');
    const b = words.slice(i).join(' ');
    const m = Math.max(a.length, b.length);
    if (m < bestMax) {
      bestMax = m;
      best = [a, b];
    }
  }
  return best;
}

export function nameFontSize(lines: string[]): number {
  const longest = Math.max(...lines.map((l) => l.length), 1);
  const room = lines.length === 1 ? 244 : 200; // text must clear the narrowing tip
  return Math.min(26, Math.floor(room / (longest * 0.66)));
}

export function pennantSvg(school: School, width = 290, uid: string = String(++counter)): string {
  const height = Math.round((width * 160) / 380);
  const base = safeColor(school.base, '#4A382B');
  const accent = safeColor(school.accent, '#FFFFFF');
  const pole = darken(base, 0.5);
  const lines = splitName(school.name.toUpperCase());
  const fs = nameFontSize(lines);
  const first = lines.length === 1 ? 86 + fs * 0.35 : 80 - fs * 0.15;
  const texts = lines
    .map((l, i) => `<text x="46" y="${(first + i * fs * 1.08).toFixed(1)}" font-size="${fs}" font-family="Liberation Serif, Georgia, serif" font-weight="700" fill="${accent}">${escapeHtml(l)}</text>`)
    .join('');
  const grommets = [20, 50, 80, 110, 140]
    .map((y) => `<circle cx="7.5" cy="${y}" r="4.2" fill="url(#gm${uid})"/><circle cx="7.5" cy="${y}" r="4.2" fill="none" stroke="#2B2B2B" stroke-width=".6"/>`)
    .join('');
  const tri = '0,4 0,156 356,80';
  return (
    `<svg class="pz-pennant" role="img" aria-label="${escapeHtml(school.name)} pennant" width="${width}" height="${height}" viewBox="0 0 380 160">` +
    `<defs>` +
    `<filter id="fg${uid}" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed="11" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.14 0" result="g"/><feComposite in="g" in2="SourceGraphic" operator="over"/></filter>` +
    `<linearGradient id="fs${uid}" x1="10%" y1="0%" x2="90%" y2="100%"><stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.16"/><stop offset="45%" stop-color="#FFFFFF" stop-opacity="0.02"/><stop offset="100%" stop-color="#000000" stop-opacity="0.14"/></linearGradient>` +
    `<radialGradient id="gm${uid}" cx="35%" cy="32%" r="70%"><stop offset="0%" stop-color="#EDEDED"/><stop offset="45%" stop-color="#9A9A9A"/><stop offset="100%" stop-color="#4A4A4A"/></radialGradient>` +
    `</defs>` +
    `<polygon points="${tri}" fill="${base}"/>` +
    `<polygon points="${tri}" fill="url(#fs${uid})"/>` +
    `<polygon points="${tri}" fill="${base}" filter="url(#fg${uid})" opacity="0.9"/>` +
    `<polyline points="0,4 356,80 0,156" fill="none" stroke="${pole}" stroke-width="5" stroke-linejoin="round" opacity=".5"/>` +
    `<polyline points="0,4 356,80 0,156" fill="none" stroke="#F5F0E6" stroke-width="2.5" stroke-linejoin="round"/>` +
    `<rect x="0" y="4" width="15" height="152" fill="${pole}"/><rect x="13" y="4" width="2.5" height="152" fill="#F5F0E6" opacity=".85"/>` +
    `<g>${grommets}</g>${texts}</svg>`
  );
}
