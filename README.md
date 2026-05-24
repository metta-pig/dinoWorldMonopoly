# Game builder template

Cursor agent template for designing and prototyping games: **board**, **card**, **party**, **TTRPG one-shots**, and **digital arcade** — with presets for deliverable track (rules / print-and-play SVG / playable web) and audience.

## Quick start

```bash
npm install
cp .env.example .env
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) — stub prototype at `/play`, rules mirror at `/rules`.

## Cursor skill

In a **dedicated game repo** (clone from this template):

```
@game-build

Game type: card-party
Deliverable: print-and-play
Audience: hobby
```

See `PRESETS.md` and `.cursor/skills/game-build/examples.md`.

## Per-game repository

Do not pile multiple games into the upstream template. Use **GitHub → Use this template** (or `git clone`) per game, then `game-input/brief.md` for that title only.

## Presets

| Env | Purpose |
|-----|---------|
| `VITE_GAME_TYPE` | Mechanics family |
| `VITE_GAME_DELIVERABLE` | `rules-only`, `print-and-play`, `digital-web` |
| `VITE_GAME_AUDIENCE` | `hobby`, `pitch`, `classroom`, `internal` |
| `VITE_GAME_MULTIPLAYER` | `false` = hot-seat (v1); `true` = shared-state experiments |

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Digital shell |
| `npm run typecheck` | Strict TS |
| `npm run balance:sim` | Monte Carlo stub (`scripts/balance-sim.ts`) |

## Rules

Single player-facing file: **`RULES.md`** at repo root. For the in-app viewer, keep **`public/RULES.md`** in sync when shipping `digital-web`.

## Licensing

Casual / for fun — no commercial licensing workflow in the template.

## Upstream

Publish as **`game-builder-template`** on GitHub and enable **Template repository** so new games use **Use this template**.
