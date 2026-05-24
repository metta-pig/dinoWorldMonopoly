import type { AudienceId } from "./audiencePresets";
import { matchAudienceId } from "./audiencePresets";
import type { DeliverableId } from "./deliverablePresets";
import { matchDeliverableId } from "./deliverablePresets";
import type { GameTypeId } from "./gameTypePresets";
import { matchGameTypeId } from "./gameTypePresets";

export type ResolvedGamePresets = {
  gameType: GameTypeId;
  deliverable: DeliverableId;
  audience: AudienceId;
  multiplayer: boolean;
};

const DEFAULTS: ResolvedGamePresets = {
  gameType: "board-abstract",
  deliverable: "digital-web",
  audience: "hobby",
  multiplayer: false,
};

function readEnv(key: string): string | undefined {
  const v = import.meta.env[key];
  return typeof v === "string" && v.trim() ? v.trim() : undefined;
}

/** Apply preset ids to documentElement for CSS hooks and store resolved ids on window for devtools. */
export function applyGamePresetsFromEnv(): ResolvedGamePresets {
  const gameType =
    matchGameTypeId(readEnv("VITE_GAME_TYPE") ?? "") ?? DEFAULTS.gameType;
  const deliverable =
    matchDeliverableId(readEnv("VITE_GAME_DELIVERABLE") ?? "") ??
    DEFAULTS.deliverable;
  const audience =
    matchAudienceId(readEnv("VITE_GAME_AUDIENCE") ?? "") ?? DEFAULTS.audience;
  const multiplayer = readEnv("VITE_GAME_MULTIPLAYER") === "true";

  const root = document.documentElement;
  root.dataset.gameType = gameType;
  root.dataset.deliverable = deliverable;
  root.dataset.audience = audience;
  root.dataset.multiplayer = multiplayer ? "true" : "false";

  const resolved: ResolvedGamePresets = {
    gameType,
    deliverable,
    audience,
    multiplayer,
  };

  (
    window as Window & { __GAME_PRESETS__?: ResolvedGamePresets }
  ).__GAME_PRESETS__ = resolved;

  return resolved;
}

export function getResolvedGamePresets(): ResolvedGamePresets {
  return (
    (window as Window & { __GAME_PRESETS__?: ResolvedGamePresets })
      .__GAME_PRESETS__ ?? DEFAULTS
  );
}
