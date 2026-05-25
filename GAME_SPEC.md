# Game spec

| Field | Value |
|-------|-------|
| Title | Dino World Monopoly (working title — original IP) |
| Game type | `board-roll-move` |
| Deliverable | `digital-web` + `print-and-play` |
| Audience | `classroom` |
| Players | 2–4 |
| Duration | ~30–40 min |
| Ages | 7–10 |
| Multiplayer (digital) | hot-seat (v1) |

## Elevator pitch

Roll the dice, tour a prehistoric park, buy habitats, collect visit fees, and build nests and exhibits before your rivals go extinct — a kid-sized property game with friendly dinos and no auctions.

## Core loop

1. Roll two dice and move your explorer token clockwise around the park track.
2. Land on an empty habitat → choose to **buy** it or **pass** (no auction).
3. Land on another player’s habitat → pay the **visit fee** (rent).
4. On your turn, after moving, you may **build nests** or an **exhibit** on habitats you fully own within a biome.
5. Draw **Fossil Find** or **Park Event** cards on marked spaces.
6. Run out of cash and assets → **bankrupt**; last explorer standing wins.

## Board layout (20 spaces)

| # | Space | Type |
|---|-------|------|
| 0 | Hatchery | Start — collect $2 when passing or landing |
| 1 | Parasaurolophus Pond | Swamp habitat ($1) |
| 2 | Fossil Find | Draw Fossil Find card |
| 3 | Pteranodon Marsh | Swamp habitat ($1) |
| 4 | Visitor Center Fee | Pay $2 to the bank |
| 5 | Northern Migration Route | Route ($4) |
| 6 | Velociraptor Dunes | Desert habitat ($2) |
| 7 | Park Event | Draw Park Event card |
| 8 | Ankylosaur Ridge | Desert habitat ($2) |
| 9 | Tar Pit | Jail / Just Visiting |
| 10 | Free Digging | Rest space — nothing happens |
| 11 | Stego Meadow | Forest habitat ($2) |
| 12 | Fossil Find | Draw Fossil Find card |
| 13 | Triceratops Grove | Forest habitat ($2) |
| 14 | Brachiosaurus Heights | Forest habitat ($3) |
| 15 | Eastern Migration Route | Route ($4) |
| 16 | Spinosaurus Bay | Ice habitat ($4) |
| 17 | Park Event | Draw Park Event card |
| 18 | T-Rex Valley | Ice habitat ($5) |
| 19 | Ranger Outpost | Go directly to Tar Pit (space 9) |

**Biome color groups:** Swamp (2), Desert (2), Forest (3), Ice (2) — 9 habitats total.

## Win condition

When all but one player are bankrupt, the remaining player wins. If multiple players remain when time runs out in a classroom session, highest **net worth** (cash + habitat/route sale prices) wins.

## Edge cases

- **Unowned habitat, no cash:** player must pass; property stays with the bank.
- **Cannot pay visit fee:** player is bankrupt; habitats and routes return to the bank (improvements removed).
- **Tar Pit:** pay $1 to leave on your turn, or roll doubles; Get Out of Tar Pit card may be saved and played.
- **Ranger Outpost:** go to Tar Pit; do **not** collect Hatchery bonus if you pass Hatchery on the way.
- **Deck empty:** reshuffle the discard pile.

## Out of scope (v1)

- Auctions, player trading, mortgaging
- Online / network multiplayer
- Doubles = extra roll (optional adult rule in RULES.md)
- Utilities (Power Station / Visitor Tram)
- More than two Migration Routes

## Components summary

See COMPONENTS.md.
