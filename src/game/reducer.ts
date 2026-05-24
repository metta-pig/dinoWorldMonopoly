import type { GameAction, GameState, PlayerId } from "./types";

export const initialGameState: GameState = {
  phase: "setup",
  activePlayer: "p1",
  players: [],
  data: {},
  winner: null,
};

/** Replace with real rules when implementing a specific game. */
export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START": {
      const players = action.playerIds;
      return {
        phase: "playing",
        activePlayer: players[0] ?? "p1",
        players,
        data: { turn: 1 },
        winner: null,
      };
    }
    case "PASS_TURN": {
      if (state.phase !== "playing" || state.players.length === 0) {
        return state;
      }
      const idx = state.players.indexOf(state.activePlayer);
      const next = state.players[(idx + 1) % state.players.length] as PlayerId;
      return { ...state, activePlayer: next };
    }
    case "CUSTOM":
      return {
        ...state,
        data: { ...state.data, ...action.payload },
      };
    default:
      return state;
  }
}
