# Components

## Physical (print-and-play)

| Component | Count | File / template | Size |
|-----------|-------|-----------------|------|
| Game board | 1 | `assets/print/generated/board-dino-world.svg` | 400 × 400 mm (foldable A2) |
| Habitat deed cards | 9 | `assets/print/generated/habitat-*.svg` | 63.5 × 88 mm |
| Fossil Find cards | 8 | `assets/print/generated/card-fossil-find.svg` (sheet) | 63.5 × 88 mm each |
| Park Event cards | 8 | `assets/print/generated/card-park-event.svg` (sheet) | 63.5 × 88 mm each |
| Get Out of Tar Pit cards | 4 | Included on Fossil Find sheet | 63.5 × 88 mm |
| Dino Bucks ($1) | 40 | `assets/print/generated/money-1.svg` | 45 × 22 mm |
| Dino Bucks ($2) | 40 | `assets/print/generated/money-2.svg` | 45 × 22 mm |
| Dino Bucks ($5) | 40 | `assets/print/generated/money-5.svg` | 45 × 22 mm |
| Explorer tokens | 4 | Cut from `assets/print/generated/tokens.svg` | 20 mm circle |
| Nest markers | 32 | Green triangles on tokens sheet | 12 mm |
| Exhibit markers | 16 | Gold squares on tokens sheet | 12 mm |
| Two dice | 2 | Use standard dice | — |

**Starting bank (per player, 2–4 players):** $12 in $1 / $2 / $5 bills (see BALANCE.md).

## Digital-only

| Asset | Location |
|-------|----------|
| Rules engine | `src/game/reducer.ts`, `src/game/board.ts`, `src/game/cards.ts` |
| Play UI | `src/pages/PlayPage.tsx` |
| In-app rules mirror | `public/RULES.md` (synced from root `RULES.md`) |

## Print specs (SVG only)

- Card size: 63.5 × 88 mm — `viewBox="0 0 63.5 88"`
- Board: 400 × 400 mm outer — `viewBox="0 0 400 400"`
- Safe text margin: 4 mm from trim; optional 3 mm bleed for professional print
- **Art direction:** flat-vector — bold biome colors + dino silhouettes; biome label + icon shape (not color alone) for color-blind safety
- Minimum card body text: 8 pt equivalent (~2.8 mm cap height)
- Generated output: `assets/print/generated/` (gitignored locally)

## Biome colors (print + digital)

| Biome | Fill | Label |
|-------|------|-------|
| Swamp | `#2d6a4f` | SWAMP |
| Desert | `#e07a2f` | DESERT |
| Forest | `#40916c` | FOREST |
| Ice | `#4895ef` | ICE |
