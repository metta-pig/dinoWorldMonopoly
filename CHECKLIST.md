# Ship / playtest checklist

## Spec

- [ ] GAME_SPEC.md matches brief and presets
- [ ] COMPONENTS.md lists every physical and digital asset
- [ ] ASSUMPTIONS.md updated if inputs were incomplete

## Rules (single source)

- [ ] RULES.md is complete and player-facing only
- [ ] If digital-web: `public/RULES.md` matches root RULES.md

## Print-and-play (SVG only)

- [ ] All art is SVG under `assets/print/`
- [ ] Card/board dimensions documented in COMPONENTS.md
- [ ] Generated files in `assets/print/generated/` (not committed)

## Digital web

- [ ] `npm run typecheck` passes
- [ ] Happy path playable at `/play`
- [ ] Hot-seat turn flow works (v1 default)
- [ ] Multiplayer stub documented if `VITE_GAME_MULTIPLAYER=true`

## Balance

- [ ] BALANCE.md notes updated after playtests
- [ ] `npm run balance:sim` run when simulation exists

## Fun / casual

- [ ] No commercial licensing blockers required — personal and casual use
