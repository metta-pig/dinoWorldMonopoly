/**
 * Monte Carlo balance sim for Dino World Monopoly.
 * Heuristic bots: buy if affordable, pay when prompted, random build, end turn.
 */

import {
  buildableProperties,
  canBuildExhibit,
  canBuildNest,
  gameReducer,
  initialGameState,
} from "../src/game/reducer";
import type { GameAction, GameState } from "../src/game/types";

const ITERATIONS = 2000;
const MAX_TURNS = 500;

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

function pickAction(state: GameState, rng: () => number): GameAction | null {
  switch (state.turnPhase) {
    case "roll":
      return { type: "ROLL_DICE" };
    case "buy_prompt":
      return rng() > 0.25 ? { type: "BUY_PROPERTY" } : { type: "PASS_BUY" };
    case "pay_prompt":
      return { type: "PAY_PENDING" };
    case "card_prompt":
      return { type: "RESOLVE_CARD" };
    case "tar_pit_choice":
      return rng() > 0.5 ? { type: "TAR_PIT_PAY" } : { type: "TAR_PIT_ROLL" };
    case "build": {
      const buildable = buildableProperties(state, state.activePlayer);
      for (const key of buildable) {
        if (canBuildNest(state, state.activePlayer, key) && rng() > 0.4) {
          return { type: "BUILD_NEST", propertyKey: key };
        }
        if (canBuildExhibit(state, state.activePlayer, key) && rng() > 0.6) {
          return { type: "BUILD_EXHIBIT", propertyKey: key };
        }
      }
      return { type: "END_BUILD" };
    }
    default:
      return null;
  }
}

function runGame(seed: number): { turns: number; winner: string | null } {
  const rng = seededRandom(seed);
  let state = gameReducer(initialGameState, { type: "START", playerCount: 2 });
  let turns = 0;

  while (state.phase === "playing" && turns < MAX_TURNS) {
    const action = pickAction(state, rng) ?? { type: "END_BUILD" as const };
    state = gameReducer(state, action);
    if (action.type === "END_BUILD" || action.type === "ROLL_DICE") {
      turns++;
    }
    if (state.phase === "finished") {
      break;
    }
  }

  if (state.phase === "playing") {
    state = gameReducer(state, { type: "DECLARE_NET_WORTH_WINNER" });
  }

  return { turns, winner: state.winner };
}

const turns: number[] = [];
const wins: Record<string, number> = { p1: 0, p2: 0, none: 0 };

for (let i = 0; i < ITERATIONS; i++) {
  const result = runGame(i + 1);
  turns.push(result.turns);
  if (result.winner) {
    wins[result.winner] = (wins[result.winner] ?? 0) + 1;
  } else {
    wins.none = (wins.none ?? 0) + 1;
  }
}

turns.sort((a, b) => a - b);
const sum = turns.reduce((a, b) => a + b, 0);
const p95 = turns[Math.floor(turns.length * 0.95)] ?? 0;

console.log("Dino World Monopoly balance simulation");
console.log(
  JSON.stringify(
    {
      iterations: ITERATIONS,
      avgTurns: sum / turns.length,
      p95Turns: p95,
      winRate: wins,
      targetP95Under: 120,
    },
    null,
    2,
  ),
);
