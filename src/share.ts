// share.ts — pure share-text builder (SHR-1..4). No DOM here; ui.ts owns the
// share sheet and clipboard.

export interface TitleDef {
  id: string;
  label: string;
  emoji: string;
  maxWrong: number | null; // null = catch-all last rung
}

// SHR-1 — first rung whose ceiling covers the wrong-tap count; ladder is
// ordered ascending in content/titles.json (enforced by content.test.ts).
export function titleFor(wrongTaps: number, titles: readonly TitleDef[]): TitleDef {
  return titles.find((t) => t.maxWrong === null || wrongTaps <= t.maxWrong) ?? titles[titles.length - 1];
}

export interface ShareInput {
  dayNumber: number;
  level: number;
  dinoName: string;
  wrongTaps: number;
  title: TitleDef;
}

// SHR-3 — plain-text result. L1 carries the story line; L2+ omits it.
export function buildShareText(o: ShareInput): string {
  const hatched = o.level === 1
    ? `We followed the tracks — ${o.dinoName} hatched!`
    : `${o.dinoName} hatched!`;
  const taps = `${o.wrongTaps} wrong tap${o.wrongTaps === 1 ? '' : 's'}`;
  const star = o.wrongTaps === 0 ? ' ⭐' : '';
  return `Cup of IQ 🥚 Day ${o.dayNumber}\n${hatched}\n${o.title.emoji} ${o.title.label} — ${taps}${star}\nhttps://cupofiq.com`;
}
