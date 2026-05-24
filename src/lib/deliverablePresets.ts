import { matchPresetId } from "./matchPresetId";

/**
 * What artifacts the agent produces this run.
 *
 * Prompt: `Deliverable: print-and-play` or `VITE_GAME_DELIVERABLE=rules-only`
 */
export const DELIVERABLE_MANIFEST = [
  {
    id: "rules-only",
    summary: "RULES.md, BALANCE.md, PLAYTEST.md — no generated assets or playable build required.",
    promptHints: ["rules only", "design doc", "no code", "no print"],
  },
  {
    id: "print-and-play",
    summary: "Rules plus SVG components under assets/print/ (cards, boards, tokens).",
    promptHints: ["print and play", "print-and-play", "pnp", "svg", "printable"],
  },
  {
    id: "digital-web",
    summary: "Playable Vite/React prototype under src/ plus RULES.md.",
    promptHints: ["digital", "web game", "playable", "prototype", "browser"],
  },
] as const;

export type DeliverableId = (typeof DELIVERABLE_MANIFEST)[number]["id"];

export const DELIVERABLE_IDS = DELIVERABLE_MANIFEST.map((e) => e.id);

export function matchDeliverableId(input: string): DeliverableId | null {
  return matchPresetId(input, DELIVERABLE_MANIFEST);
}
