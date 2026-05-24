import { matchPresetId } from "./matchPresetId";

/**
 * Game family presets — drive mechanics templates, default components, and digital UI shape.
 *
 * Prompt: `Game type: card-party` or `VITE_GAME_TYPE=board-abstract`
 */
export const GAME_TYPE_MANIFEST = [
  {
    id: "board-abstract",
    category: "board",
    summary: "Grid or graph, pieces, clear win condition — chess-like or modern abstract.",
    defaultPlayers: "2",
    defaultDurationMin: 30,
    promptHints: ["abstract board", "grid game", "perfect information", "board abstract"],
  },
  {
    id: "board-area-control",
    category: "board",
    summary: "Map, territories, influence — area majority or conflict.",
    defaultPlayers: "2-4",
    defaultDurationMin: 45,
    promptHints: ["area control", "territory", "map control", "influence"],
  },
  {
    id: "board-roll-move",
    category: "board",
    summary: "Track or path, dice/cards drive movement and events — keep scope tight in v1.",
    defaultPlayers: "2-6",
    defaultDurationMin: 45,
    promptHints: ["roll and move", "track game", "monopoly-style", "race"],
  },
  {
    id: "card-deck-builder",
    category: "card",
    summary: "Start deck, buy/trash cards, engine building.",
    defaultPlayers: "1-4",
    defaultDurationMin: 45,
    promptHints: ["deck builder", "deckbuilding", "engine", "buy cards"],
  },
  {
    id: "card-trick-taking",
    category: "card",
    summary: "Follow suit, win tricks, optional bidding.",
    defaultPlayers: "3-5",
    defaultDurationMin: 30,
    promptHints: ["trick taking", "tricks", "follow suit", "hearts-style"],
  },
  {
    id: "card-party",
    category: "card",
    summary: "Hand management, judging, prompts — casual group play.",
    defaultPlayers: "4-10",
    defaultDurationMin: 20,
    promptHints: ["party cards", "hand size", "judge", "apples to apples"],
  },
  {
    id: "party-social",
    category: "party",
    summary: "Hidden roles, voting, teams — social deduction or team bluffing.",
    defaultPlayers: "6-12",
    defaultDurationMin: 30,
    promptHints: ["social deduction", "hidden role", "mafia", "werewolf", "voting"],
  },
  {
    id: "ttrpg-one-shot",
    category: "ttrpg",
    summary: "Single-session module: scenes, NPCs, clocks — not full campaign tooling.",
    defaultPlayers: "3-5",
    defaultDurationMin: 120,
    promptHints: ["one shot", "ttrpg", "rpg module", "scene", "clocks"],
  },
  {
    id: "digital-arcade",
    category: "digital",
    summary: "Digital-only reflex or puzzle loop — no print components.",
    defaultPlayers: "1",
    defaultDurationMin: 10,
    promptHints: ["arcade", "digital only", "puzzle game", "high score"],
  },
] as const;

export type GameTypeId = (typeof GAME_TYPE_MANIFEST)[number]["id"];

export const GAME_TYPE_IDS = GAME_TYPE_MANIFEST.map((e) => e.id);

export function matchGameTypeId(input: string): GameTypeId | null {
  return matchPresetId(input, GAME_TYPE_MANIFEST);
}
