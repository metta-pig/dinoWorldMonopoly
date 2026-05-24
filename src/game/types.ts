/** Pure game types — no React imports. */

export type PlayerId = string;

export type GamePhase = "setup" | "playing" | "finished";

export type GameState = {
  phase: GamePhase;
  activePlayer: PlayerId;
  players: PlayerId[];
  /** Designer-defined payload (board, hands, score, etc.) */
  data: Record<string, unknown>;
  winner: PlayerId | null;
};

export type GameAction =
  | { type: "START"; playerIds: PlayerId[] }
  | { type: "PASS_TURN" }
  | { type: "CUSTOM"; payload: Record<string, unknown> };
