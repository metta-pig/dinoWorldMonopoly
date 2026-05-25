# Dino World Monopoly — project state

Living handoff doc for humans and agents. Update this when major features land or polish priorities shift.

**Last updated:** 2026-05-24  
**Status:** Playable digital v1 + design docs complete; classroom playtest not yet run; UI/UX polish in progress.

---

## One-liner

Kid-friendly Monopoly-style roll-and-move (ages 7–10): 20-space board, 9 dino habitats, small-dollar economy ($1–$5), hot-seat web app at `/play`, print-and-play SVG track in parallel.

---

## Presets (`.env`)

| Variable | Current value |
|----------|---------------|
| `VITE_GAME_TYPE` | `board-roll-move` |
| `VITE_GAME_DELIVERABLE` | `digital-web` (+ print assets) |
| `VITE_GAME_AUDIENCE` | `classroom` |
| `VITE_GAME_TITLE` | Dino World Monopoly |
| `VITE_GAME_MULTIPLAYER` | `false` (hot-seat only) |

Applied at boot via `applyGamePresetsFromEnv()` in `src/main.tsx`.

---

## Doc map (source of truth)

| Need | File |
|------|------|
| Design intent, board layout, win condition | `GAME_SPEC.md` |
| Player-facing rules only | `RULES.md` → sync to `public/RULES.md` for web |
| Physical + digital component list | `COMPONENTS.md` |
| Economy, rent tables, sim notes | `BALANCE.md` |
| Design decisions when brief was open | `ASSUMPTIONS.md` |
| Ship checklist | `CHECKLIST.md` |
| Classroom playtest script | `PLAYTEST.md` |
| **This file** — implementation snapshot & polish queue | `PROJECT_STATE.md` |

Do not duplicate full rules or balance tables here; link to the files above.

---

## Architecture

```
src/
├── game/           # Pure rules — no React
│   ├── types.ts    # GameState, GameAction, TurnPhase, etc.
│   ├── board.ts    # 20 spaces, habitats, routes, constants, grid layout
│   ├── cards.ts    # Fossil Find + Park Event decks (8 each)
│   ├── reducer.ts  # gameReducer + build helpers
│   └── multiplayer.ts  # hot-seat vs shared-state stub
├── pages/
│   ├── HomePage.tsx    # Landing + explorer roster
│   ├── PlayPage.tsx    # Main game shell
│   └── RulesPage.tsx   # Renders public/RULES.md
├── components/
│   ├── game/       # GameBoard, ActionPanel, ExplorerPanel, SetupScreen, DiceRoller
│   └── dino/       # DinoArt (SVG icons), ExplorerAvatar
├── hooks/
│   └── useGameFeedback.ts  # SFX on log/position/win changes
└── lib/
    ├── explorers.ts    # Riley, Sam, Jordan, Alex
    ├── habitatArt.ts   # PNG paths for 9 habitats
    ├── gameSounds.ts   # Web Audio SFX
    └── *Presets.ts     # Template preset manifests
```

**State management:** `useReducer(gameReducer)` in `PlayPage.tsx`. No persistence — refresh resets the game.

**Turn flow (`TurnPhase`):** `roll` → (move resolve) → `buy_prompt` | `pay_prompt` | `card_prompt` | `tar_pit_choice` → `build` → `ended` → next player.

---

## Game engine — implemented

All logic lives in `src/game/reducer.ts` (~950 lines). Key behaviors:

| Feature | Status | Notes |
|---------|--------|-------|
| 2–4 player start | ✅ | `START` action; default explorer names from roster |
| Roll 2d6, move clockwise | ✅ | 900 ms roll animation in UI before dispatch |
| Hatchery +$2 on pass/land | ✅ | |
| Buy or pass (no auction) | ✅ | |
| Visit fees (habitats + routes) | ✅ | Full biome doubles base rent; routes scale 1/2 |
| Nest ($1, max 2) + Exhibit ($3) | ✅ | Even building enforced across biome |
| Fossil Find / Park Event cards | ✅ | 8+8 cards; deck reshuffle when empty |
| Get Out of Tar Pit card | ✅ | Kept in hand; `USE_GET_OUT_CARD` |
| Tar Pit ($1 or doubles) | ✅ | No 3-turn wait |
| Ranger Outpost → Tar Pit | ✅ | No Hatchery bonus on the way |
| Visitor Center Fee ($2) | ✅ | |
| Bankruptcy | ✅ | Assets return to bank |
| Win (last standing) | ✅ | |
| Classroom time limit | ✅ | `DECLARE_NET_WORTH_WINNER` ghost button in ActionPanel |
| Doubles = extra roll | ❌ | Off in v1; optional adult rule in RULES.md only |
| Auctions, mortgaging, trading | ❌ | Out of scope v1 |

**Exported helpers:** `canBuildNest`, `canBuildExhibit`, `buildableProperties`.

**Constants** (`board.ts`): `STARTING_CASH=12`, `HATCHERY_BONUS=2`, `NEST_COST=1`, `EXHIBIT_COST=3`, `MAX_NESTS=2`, `TAR_PIT_EXIT_FEE=1`.

---

## Digital UI — implemented

### Routes

| Path | Page |
|------|------|
| `/` | Home — hero, CTAs, explorer cards, how-to steps |
| `/play` | Full game |
| `/rules` | Markdown rules viewer |

### Play screen layout

- **Left:** `GameBoard` — 9×9 CSS grid, 20 spaces clockwise, center logo + dice, habitat PNG thumbs with SVG fallbacks, explorer tokens on spaces, biome badges, ownership markers.
- **Right sidebar:** `ExplorerPanel` (cash, status chips), `ActionPanel` (Ranger HQ — all turn actions), event log (“Park news”).

### Setup

- `SetupScreen`: pick 2/3/4 explorers, hot-seat hint, starts with default names (Riley, Sam, Jordan, Alex).

### Polish already in place

- Dino World theme (`src/dino-theme.css` + `src/index.css`) — Fredoka/Nunito, jungle gradient, wood panels.
- Dice roll animation + Web Audio (`gameSounds.ts`): dice, cha-ching, T-Rex roar on space 18, win fanfare.
- Habitat buy preview with art in ActionPanel.
- Card draw UI with deck-specific styling.

### Known UI gaps / polish queue

Use this section as the working backlog when continuing polish:

- [ ] **Responsive layout** — board + sidebar may be tight on small tablets/phones; test breakpoints.
- [ ] **Property portfolio view** — no dedicated panel listing what each explorer owns (only board markers).
- [ ] **Nest/exhibit visuals on board** — improvements may be icon-only or minimal; verify clarity for kids.
- [ ] **Route purchase UI** — buy flow works but no route-specific art preview (habitats have PNGs; routes use icons).
- [ ] **Custom player names** — setup uses fixed roster names only; no rename input.
- [ ] **Game persistence** — no localStorage / resume.
- [ ] **Accessibility pass** — color contrast, focus states, screen reader labels on board cells.
- [ ] **Rules page styling** — functional; could match park theme more closely.
- [ ] **Print board generation** — SVG templates exist under `assets/print/templates/`; full generated board not committed (gitignored `assets/print/generated/`).
- [ ] **Classroom playtest** — human session per `PLAYTEST.md` not logged yet.

---

## Art & assets

### Committed raster (digital)

| Asset | Path |
|-------|------|
| Hero illustration | `public/assets/dino-world-hero.png` |
| Park logo | `public/assets/dino-world-park-logo.png` |
| Habitat art (×9) | `public/assets/habitats/<habitat-id>.png` |

Mapped in `src/lib/habitatArt.ts`. Board falls back to inline SVG dino icons (`DinoArt.tsx`) if PNG fails.

### SVG (code-drawn)

- Space icons, biome badges, explorer avatars — all ease in `DinoArt.tsx`, `ExplorerAvatar.tsx`.
- Print templates: `assets/print/templates/board.svg`, `card-front.svg`, `card-back.svg`.

### Explorers

| ID | Name | Title | Accent |
|----|------|-------|--------|
| p1 | Riley | Egg Scout | `#ff8c42` |
| p2 | Sam | Fossil Finder | `#e63946` |
| p3 | Jordan | Nest Builder | `#2a9d8f` |
| p4 | Alex | Park Ranger | `#457b9d` |

---

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Vite dev server → http://localhost:5173 |
| `npm run typecheck` | Strict TS (passing as of last update) |
| `npm run build` | Production build |
| `npm run balance:sim` | Monte Carlo bot sim (`scripts/balance-sim.ts`) |
| `npm run print:habitats` | Generate habitat deed SVGs with embedded PNG (`scripts/generate-habitat-print.ts`) |

---

## Multiplayer

v1 is **hot-seat only** — one device, pass when turn ends. `src/game/multiplayer.ts` stubs `shared-state` mode for future BroadcastChannel/WebSocket; not wired up.

---

## Verification checklist (quick smoke test)

1. `npm run typecheck` — must pass before calling digital done.
2. `/` loads hero + Start playing link.
3. `/play` → choose 2 explorers → roll → land on habitat → buy/pass works.
4. Land on owned habitat → pay prompt.
5. Draw card on Fossil Find / Park Event space → resolve.
6. Build nest when owning full biome → even-building enforced.
7. Ranger Outpost / Tar Pit flow.
8. Play until bankruptcy or use “Time's up — count scores”.

Digital items in `PLAYTEST.md` are implementation-complete; classroom human playtest is the main open item on `CHECKLIST.md`.

---

## Git / branch notes

Large in-progress revamp on working tree (not necessarily committed): game engine, themed UI, habitat PNGs, explorer characters, sound, print script. Treat uncommitted assets under `public/assets/` as part of the current digital deliverable.

---

## How to continue polish (for agents)

1. Read this file first, then skim `GAME_SPEC.md` + `ASSUMPTIONS.md` if rules questions arise.
2. Run `npm run dev` and exercise `/play` for any UI change.
3. Rule changes → update `reducer.ts` / `board.ts` / `cards.ts`, then sync `RULES.md` + `public/RULES.md`, and note in `BALANCE.md` if economy shifts.
4. After rule changes, run `npm run balance:sim`.
5. Update **Known UI gaps / polish queue** above when items ship or new ones appear.
