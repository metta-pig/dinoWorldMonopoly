# Print assets (SVG only)

| Path | Purpose |
|------|---------|
| `templates/card-front.svg` | Card frame — duplicate per card id |
| `templates/card-back.svg` | Shared back |
| `templates/board.svg` | Board or mat |
| `generated/` | Agent output (gitignored) |

## Card art

When the brief asks for illustration, the agent uses the **image generation** tool, then traces or embeds into SVG (or references exported PNG inside SVG `<image>` only if SVG paths are impractical — prefer pure SVG for v1).

## Dimensions

Default poker card: 63.5 × 88 mm. Templates use mm units in `viewBox` where possible.
