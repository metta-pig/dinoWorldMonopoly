/** Pure game types — no React imports. */

export type PlayerId = string;

export type GamePhase = "setup" | "playing" | "finished";

export type Biome = "swamp" | "desert" | "forest" | "ice";

export type SpaceKind =
  | "hatchery"
  | "habitat"
  | "fossil_find"
  | "park_event"
  | "fee"
  | "route"
  | "tar_pit"
  | "free_digging"
  | "ranger";

export type TurnPhase =
  | "roll"
  | "buy_prompt"
  | "pay_prompt"
  | "card_prompt"
  | "tar_pit_choice"
  | "build"
  | "ended";

export type PropertyKey = string;

export interface HabitatDef {
  id: string;
  name: string;
  biome: Biome;
  price: number;
  baseRent: number;
  nestRent: number;
  exhibitRent: number;
}

export interface BoardSpace {
  index: number;
  kind: SpaceKind;
  label: string;
  propertyKey?: PropertyKey;
  feeAmount?: number;
}

export interface PropertyState {
  ownerId: PlayerId | null;
  nests: number;
  hasExhibit: boolean;
}

export interface PlayerState {
  id: PlayerId;
  name: string;
  cash: number;
  position: number;
  inTarPit: boolean;
  bankrupt: boolean;
  getOutOfTarPitCards: number;
}

export interface PendingPayment {
  toPlayerId: PlayerId | "bank";
  amount: number;
  reason: string;
}

export interface GameState {
  phase: GamePhase;
  turnPhase: TurnPhase;
  activePlayer: PlayerId;
  players: PlayerId[];
  playerStates: Record<PlayerId, PlayerState>;
  properties: Record<PropertyKey, PropertyState>;
  fossilDeck: string[];
  fossilDiscard: string[];
  parkDeck: string[];
  parkDiscard: string[];
  lastRoll: [number, number] | null;
  pendingCard: { deck: "fossil" | "park"; cardId: string } | null;
  pendingPayment: PendingPayment | null;
  message: string;
  log: string[];
  winner: PlayerId | null;
}

export type GameAction =
  | { type: "START"; playerCount: 2 | 3 | 4; names?: string[] }
  | { type: "ROLL_DICE" }
  | { type: "BUY_PROPERTY" }
  | { type: "PASS_BUY" }
  | { type: "PAY_PENDING" }
  | { type: "BUILD_NEST"; propertyKey: PropertyKey }
  | { type: "BUILD_EXHIBIT"; propertyKey: PropertyKey }
  | { type: "END_BUILD" }
  | { type: "TAR_PIT_PAY" }
  | { type: "TAR_PIT_ROLL" }
  | { type: "USE_GET_OUT_CARD" }
  | { type: "RESOLVE_CARD" }
  | { type: "DECLARE_NET_WORTH_WINNER" };
