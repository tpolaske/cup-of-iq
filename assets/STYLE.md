# Cup of IQ — Art Direction (STYLE.md)

Written before the first image so batch 2 matches batch 1 (swarm.md CEO-2, design.md §9).

## Look

Warm, hand-drawn, storybook. Thick soft outlines, warm pastels, cream backgrounds. Baby-proportioned dinos: big eyes with a white highlight, round bodies, short limbs, friendly expressions — never scary teeth. Reference proportions: the baby stegosaurus in `prototype/prototype-l1.html`.

## Palette anchors

| Use | Hex |
|---|---|
| Cream (background) | `#FEFBF8` |
| Brown (wordmark, text) | `#6E5340` |
| Soft brown | `#9B8672` |
| Tan | `#B7A182` |
| Green (dino body) | `#9CBF7B` |
| Footprints (idle → stamped) | `#9DB289` → `#5F7F49` |
| Trail | `#C9B694` |
| Eggshell (fill / outline) | `#FFFDF7` / `#E8DCC8` |

## Dino images (`content/dinos.json`)

- 512×512, transparent background, **WebP ≤ 60 KB** (NFR-2; enforced by `src/content.test.ts`)
- One species per file, centered, standing; optional soft-ellipse shadow
- Filename = dino id: `public/img/dinos/<id>.webp`

## Per-image checklist

- [ ] Transparent background, no stray pixels
- [ ] Reads at 96 px (comeback card) and 190 px (celebration)
- [ ] Exported WebP ≤ 60 KB
- [ ] Filename matches the dino id exactly

## Voice files (`public/voice/`)

See design.md §9: number words one–ten + "rawr", squeaky hatchling voice, mono AAC `.m4a`, ≤ 25 KB per file, paths per `public/voice/manifest.json`.
