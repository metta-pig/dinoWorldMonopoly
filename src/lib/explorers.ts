/** Kid-friendly explorer characters for hot-seat play. */

export type DinoTokenKind = "parasaur" | "raptor" | "triceratops" | "stego";

export type ExplorerDef = {
  id: string;
  name: string;
  title: string;
  accent: string;
  avatarId: "riley" | "sam" | "jordan" | "alex";
  dinoToken: DinoTokenKind;
};

export const EXPLORER_ROSTER: ExplorerDef[] = [
  {
    id: "p1",
    name: "Riley",
    title: "Egg Scout",
    accent: "#ff8c42",
    avatarId: "riley",
    dinoToken: "parasaur",
  },
  {
    id: "p2",
    name: "Sam",
    title: "Fossil Finder",
    accent: "#e63946",
    avatarId: "sam",
    dinoToken: "raptor",
  },
  {
    id: "p3",
    name: "Jordan",
    title: "Nest Builder",
    accent: "#2a9d8f",
    avatarId: "jordan",
    dinoToken: "triceratops",
  },
  {
    id: "p4",
    name: "Alex",
    title: "Park Ranger",
    accent: "#457b9d",
    avatarId: "alex",
    dinoToken: "stego",
  },
];

export function explorerForPlayer(_playerId: string, playerIndex: number): ExplorerDef {
  return EXPLORER_ROSTER[playerIndex] ?? EXPLORER_ROSTER[0]!;
}

export function defaultExplorerNames(count: 2 | 3 | 4): string[] {
  return EXPLORER_ROSTER.slice(0, count).map((e) => e.name);
}
