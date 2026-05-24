import { matchPresetId } from "./matchPresetId";

/**
 * Who the game is for — shapes tone of GAME_SPEC.md and PLAYTEST.md.
 *
 * Prompt: `Audience: classroom` or `VITE_GAME_AUDIENCE=pitch`
 */
export const AUDIENCE_MANIFEST = [
  {
    id: "hobby",
    summary: "Fast iteration, informal voice, playtest-first.",
    promptHints: ["hobby", "indie", "home brew", "playtest"],
  },
  {
    id: "pitch",
    summary: "Hook, comparables, component cost band, unique selling point.",
    promptHints: ["pitch", "publisher", "sell sheet", "market"],
  },
  {
    id: "classroom",
    summary: "Learning objectives, reading level, time box, facilitation notes.",
    promptHints: ["classroom", "education", "students", "teaching"],
  },
  {
    id: "internal",
    summary: "Scrappy prototype OK; assumptions and shortcuts explicit.",
    promptHints: ["internal", "team", "prototype", "draft"],
  },
] as const;

export type AudienceId = (typeof AUDIENCE_MANIFEST)[number]["id"];

export const AUDIENCE_IDS = AUDIENCE_MANIFEST.map((e) => e.id);

export function matchAudienceId(input: string): AudienceId | null {
  return matchPresetId(input, AUDIENCE_MANIFEST);
}
