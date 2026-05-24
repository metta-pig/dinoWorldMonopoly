import { matchPresetId } from "./matchPresetId";

/**
 * Visual style for SVG print assets and generated card art (image tool).
 *
 * Prompt: `Art: flat-vector` or note in game-input/brief.md
 */
export const ART_DIRECTION_MANIFEST = [
  {
    id: "minimal",
    summary: "Simple shapes, limited palette, typography-forward cards.",
    promptHints: ["minimal", "simple", "clean lines"],
  },
  {
    id: "flat-vector",
    summary: "Bold flat illustration, clear silhouettes for small card size.",
    promptHints: ["flat", "vector", "bold color", "illustration"],
  },
  {
    id: "pixel",
    summary: "Retro pixel art, limited resolution aesthetic.",
    promptHints: ["pixel", "8-bit", "retro game art"],
  },
  {
    id: "sketch",
    summary: "Hand-drawn sketch lines, playful prototype feel.",
    promptHints: ["sketch", "hand drawn", "doodle"],
  },
] as const;

export type ArtDirectionId = (typeof ART_DIRECTION_MANIFEST)[number]["id"];

export function matchArtDirectionId(input: string): ArtDirectionId | null {
  return matchPresetId(input, ART_DIRECTION_MANIFEST);
}
