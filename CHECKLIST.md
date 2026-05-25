# Ship / playtest checklist

## Spec

- [x] GAME_SPEC.md matches brief and presets
- [x] COMPONENTS.md lists every physical and digital asset
- [x] ASSUMPTIONS.md updated if inputs were incomplete

## Rules (single source)

- [x] RULES.md is complete and player-facing only
- [x] If digital-web: `public/RULES.md` matches root RULES.md

## Print-and-play (SVG only)

- [x] All art is SVG under `assets/print/`
- [x] Card/board dimensions documented in COMPONENTS.md
- [x] Generated files in `assets/print/generated/` (not committed)

## Digital web

- [x] `npm run typecheck` passes
- [x] Happy path playable at `/play`
- [x] Hot-seat turn flow works (v1 default)
- [x] Multiplayer stub documented if `VITE_GAME_MULTIPLAYER=true`

## Balance

- [x] BALANCE.md notes updated after playtests
- [x] `npm run balance:sim` run when simulation exists

## Fun / casual

- [x] No commercial licensing blockers required — personal and casual use

## Remaining for human playtest

- [ ] Classroom playtest per PLAYTEST.md
