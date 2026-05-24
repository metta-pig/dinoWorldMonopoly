# Preset reference

Manifests (source of truth): `src/lib/gameTypePresets.ts`, `deliverablePresets.ts`, `audiencePresets.ts`, `artDirectionPresets.ts`.

## Prompt shorthand

```
Game type: card-party
Deliverable: print-and-play
Audience: classroom
Art: flat-vector
Players: 4-8, Duration: 20 min
```

## Environment (digital shell)

```bash
VITE_GAME_TYPE=party-social
VITE_GAME_DELIVERABLE=digital-web
VITE_GAME_AUDIENCE=hobby
VITE_GAME_MULTIPLAYER=false   # hot-seat; true = shared-state experiments
VITE_GAME_TITLE="My Game"
```

## v1 game families

| Id | Family |
|----|--------|
| `board-abstract` | Board |
| `board-area-control` | Board |
| `board-roll-move` | Board |
| `card-deck-builder` | Card |
| `card-trick-taking` | Card |
| `card-party` | Card |
| `party-social` | Party |
| `ttrpg-one-shot` | TTRPG light |
| `digital-arcade` | Digital-only |

## Deliverables

| Id | Output |
|----|--------|
| `rules-only` | RULES.md, BALANCE.md, PLAYTEST.md |
| `print-and-play` | Above + SVG in `assets/print/` |
| `digital-web` | Above optional + `src/` prototype |

## Rules

- **Single player-facing file:** `RULES.md` at repo root only.
- For in-app rules viewer: sync copy to `public/RULES.md` when `digital-web` is in scope.

## Art

Agent may use **image generation** for card faces; compose into **SVG** templates when possible.

## Multiplayer

- **v1 default:** hot-seat (one device).
- **Later:** `VITE_GAME_MULTIPLAYER=true` + `src/game/multiplayer.ts` shared-state stub.

## Licensing

Casual / for fun — no commercial licensing workflow in the template.
