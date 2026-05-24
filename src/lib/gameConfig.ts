import { getResolvedGamePresets } from "./applyGamePresets";

/** Human-readable label for the shell UI. Override per game repo in GAME_SPEC.md title. */
export function getGameTitle(): string {
  return import.meta.env.VITE_GAME_TITLE?.trim() || "Untitled game";
}

export function getPresetSummary(): string {
  const p = getResolvedGamePresets();
  return `${p.gameType} · ${p.deliverable} · ${p.audience}${
    p.multiplayer ? " · multiplayer" : " · hot-seat"
  }`;
}
