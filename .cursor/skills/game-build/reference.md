# Game build reference

## Mechanic checklist by game type

### Board (abstract / area / roll-move)

- [ ] Board topology defined (grid, graph, track)
- [ ] Setup placement and starting resources
- [ ] Action economy per turn (how many actions?)
- [ ] Kingmaking / runaway leader mitigations

### Card (deck-builder / trick-taking / party)

- [ ] Deck composition and shuffle rules
- [ ] Hand size, draw timing, discard
- [ ] Hidden information boundaries
- [ ] Tie-breakers for tricks or judging

### Party social

- [ ] Role distribution and reveal timing
- [ ] Vote resolution and ties
- [ ] Player elimination (if any) and spectator rules

### TTRPG one-shot

- [ ] Scene framing and goals per scene
- [ ] NPC roster (motivation, leverage)
- [ ] Clocks or progress tracks
- [ ] Safety/tools (lines/veils) when content is sensitive

### Digital arcade

- [ ] Input map and frame loop
- [ ] Score / fail states
- [ ] Difficulty curve over time

## SVG print

- Bleed: optional 3 mm; safe text 4 mm from trim
- Prefer vector text as `<text>` or paths for crisp print
- Name files `card-{id}-front.svg` consistently

## Balance simulation

Pattern for `scripts/balance-sim.ts`:

1. Import `gameReducer`, `initialGameState`
2. Seed RNG for reproducibility (`seed` flag)
3. Run N games with random legal actions or heuristic bots
4. Log win rate by seat, game length distribution, stalemate rate

## Multiplayer roadmap

| Mode | v1 | Later |
|------|----|-------|
| Hot-seat | Default | Polish UI handoff |
| Shared-state | Stub in `multiplayer.ts` | BroadcastChannel or WebSocket room |

## Accessibility

- Color-blind-safe palettes in SVG (don't rely on color alone)
- Minimum font size on cards (pt/mm noted in COMPONENTS.md)
- Keyboard path for digital UI controls
