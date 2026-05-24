---
name: game-build
disable-model-invocation: false
description: >-
  Designs and builds tabletop and digital games from presets: game type (board,
  card, party, ttrpg one-shot, digital arcade), deliverable track (rules-only,
  print-and-play SVG, playable web), and audience (hobby, pitch, classroom).
  Produces GAME_SPEC.md, COMPONENTS.md, a single RULES.md, BALANCE.md, PLAYTEST.md,
  and CHECKLIST.md. Use when the user mentions game build, board game, card game,
  print-and-play, game prototype, or drops materials under game-input/. Start each
  game in a dedicated repo spun from game-builder-template—not the upstream template
  unless maintaining the template itself.
---

# Game build (team template)

## Preconditions

- **Per-game delivery:** Workspace should be a **dedicated repository** created from `game-builder-template` (see **New repository** below)—one repo per game.
- **Template maintenance:** If the user is **improving the upstream template** for everyone, skip new-repo spin-up.
- Prefer materials under `game-input/` (see `game-input/README.md`). If the user only chats a concept, capture it in `game-input/brief.md` or list gaps in `ASSUMPTIONS.md`.

## New repository (per game)

1. On GitHub: **Use this template** → create `my-game-name`.
2. Clone locally; `npm install`; `cp .env.example .env`.
3. Set presets in `.env` and/or `game-input/*.txt`.
4. Open the **clone** in Cursor (not the upstream template) before changing mechanics.

CLI sibling clone:

```bash
cd ~/projects
git clone <template-url> my-game-name
cd my-game-name
npm install && cp .env.example .env
```

## Presets (resolve first)

Read `game-input/game-type.txt`, `deliverable.txt`, `audience.txt`, `art-direction.txt` when present; else parse the user message. Manifests:

| Preset | File |
|--------|------|
| Game type | `src/lib/gameTypePresets.ts` |
| Deliverable | `src/lib/deliverablePresets.ts` |
| Audience | `src/lib/audiencePresets.ts` |
| Art direction | `src/lib/artDirectionPresets.ts` |

Set `VITE_GAME_*` in `.env` / `.env.example` when **digital-web** is in scope. Document choices in `GAME_SPEC.md` and `PRESETS.md` summary table.

**Deliverable tracks** (can combine in one run if the user asks):

| Track | Required outputs |
|-------|------------------|
| `rules-only` | `RULES.md`, `BALANCE.md`, `PLAYTEST.md`, `GAME_SPEC.md`, `COMPONENTS.md` |
| `print-and-play` | Above + SVG only under `assets/print/generated/` from `assets/print/templates/` |
| `digital-web` | Above + `src/game/` rules module + UI at `/play`; sync `public/RULES.md` from root `RULES.md` |

## Rules (single file)

- **Only** `RULES.md` at repo root is player-facing rules.
- When `digital-web` is active: after editing `RULES.md`, copy the same content to `public/RULES.md` for the in-app viewer (derived mirror, not a second source of truth).
- Do **not** add PDF/HTML rule exports in v1.

## Print-and-play (SVG only)

- No PDF layout engines; output **SVG** only.
- Start from `assets/print/templates/*.svg`; write generated files to `assets/print/generated/`.
- Record sizes and counts in `COMPONENTS.md`.

## Card / board art (image generation)

When the brief requests art or presets imply illustrated faces:

1. Resolve **art direction** preset (`flat-vector`, `pixel`, etc.).
2. Use the **image generation** tool for card faces, tokens, or box art as needed.
3. Prefer embedding into SVG (`<image>`) or redrawing as simple SVG paths for print; keep source prompts in `BALANCE.md` or `ASSUMPTIONS.md` for reproducibility.
4. Placeholders are OK for v1 if generation is skipped—use labeled geometric placeholders in SVG.

## Digital web

- Keep rules in **`src/game/`** (pure TypeScript, no React in reducer).
- UI in `src/pages/` — minimal happy path first.
- **v1 multiplayer:** implement **hot-seat** (pass-the-device). Document `src/game/multiplayer.ts` stub; only wire shared-state / network when `VITE_GAME_MULTIPLAYER=true` and the user explicitly wants it.
- `digital-arcade` may use canvas/Phaser later; v1 can stay React + simple state.

## Balance

- Maintain designer notes in `BALANCE.md`.
- Extend `scripts/balance-sim.ts` to simulate `src/game/reducer.ts` when mechanics exist; run `npm run balance:sim`.
- Always update `PLAYTEST.md` with human playtest scenarios—automation does not replace table tests.

## Audience tone

| Id | Emphasis |
|----|----------|
| `hobby` | Fast, friendly rules; iteration notes |
| `pitch` | Hook, comparables, component cost band |
| `classroom` | Objectives, reading level, facilitator steps in PLAYTEST.md |
| `internal` | Explicit shortcuts in ASSUMPTIONS.md |

## Licensing

Games are **casual / for fun**—no commercial licensing section required in v1.

## Workflow

1. **Ingest** — `game-input/brief.md` + preset txt files; note content warnings and player count.
2. **Spec** — Update `GAME_SPEC.md`, `COMPONENTS.md`, `ASSUMPTIONS.md`.
3. **Mechanics** — Core loop, turn order, win/lose, edge cases; sketch in `BALANCE.md`.
4. **Rules** — Write `RULES.md` (clear, numbered, examples).
5. **Branch by deliverable**
   - print-and-play → SVG components + art
   - digital-web → reducer + `/play` + sync `public/RULES.md`
6. **Balance** — Playtest plan + run or extend `balance-sim.ts`.
7. **Checklist** — Complete `CHECKLIST.md`.

## Quality gates

- Player count and duration match the brief.
- No contradictory rules between `RULES.md` and `GAME_SPEC.md`.
- `npm run typecheck` passes when `digital-web` is in scope.
- SVG viewBoxes match COMPONENTS.md dimensions.

## Non-goals (v1)

- Store/mobile binaries, Tabletop Simulator mods, manufacturing quotes
- Full campaign TTRPG tooling (only one-shot modules)
- Commercial licensing packs

## Reference

See `.cursor/skills/game-build/reference.md` for mechanic checklists and `.cursor/skills/game-build/examples.md` for sample prompts.
