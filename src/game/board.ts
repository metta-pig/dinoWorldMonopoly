import type { Biome, BoardSpace, HabitatDef } from "./types";

export const STARTING_CASH = 12;
export const HATCHERY_BONUS = 2;
export const NEST_COST = 1;
export const EXHIBIT_COST = 3;
export const TAR_PIT_EXIT_FEE = 1;
export const VISITOR_CENTER_FEE = 2;
export const ROUTE_PRICE = 4;
export const ROUTE_RENT_ONE = 1;
export const ROUTE_RENT_BOTH = 2;
export const MAX_NESTS = 2;
export const TAR_PIT_INDEX = 9;
export const HATCHERY_INDEX = 0;
export const BOARD_SIZE = 20;
/** UI grid — 7×7 gives a continuous track with only 4 trail cells between corners. */
export const BOARD_GRID_SIZE = 7;

export const BIOME_LABELS: Record<Biome, string> = {
  swamp: "Swamp",
  desert: "Desert",
  forest: "Forest",
  ice: "Ice",
};

export const BIOME_COLORS: Record<Biome, string> = {
  swamp: "#2d6a4f",
  desert: "#e07a2f",
  forest: "#40916c",
  ice: "#4895ef",
};

export const HABITATS: HabitatDef[] = [
  {
    id: "parasaurolophus-pond",
    name: "Parasaurolophus Pond",
    biome: "swamp",
    price: 1,
    baseRent: 1,
    nestRent: 2,
    exhibitRent: 5,
  },
  {
    id: "pteranodon-marsh",
    name: "Pteranodon Marsh",
    biome: "swamp",
    price: 1,
    baseRent: 1,
    nestRent: 2,
    exhibitRent: 5,
  },
  {
    id: "velociraptor-dunes",
    name: "Velociraptor Dunes",
    biome: "desert",
    price: 2,
    baseRent: 1,
    nestRent: 2,
    exhibitRent: 6,
  },
  {
    id: "ankylosaur-ridge",
    name: "Ankylosaur Ridge",
    biome: "desert",
    price: 2,
    baseRent: 1,
    nestRent: 2,
    exhibitRent: 6,
  },
  {
    id: "stego-meadow",
    name: "Stego Meadow",
    biome: "forest",
    price: 2,
    baseRent: 1,
    nestRent: 2,
    exhibitRent: 6,
  },
  {
    id: "triceratops-grove",
    name: "Triceratops Grove",
    biome: "forest",
    price: 2,
    baseRent: 1,
    nestRent: 2,
    exhibitRent: 7,
  },
  {
    id: "brachiosaurus-heights",
    name: "Brachiosaurus Heights",
    biome: "forest",
    price: 3,
    baseRent: 1,
    nestRent: 2,
    exhibitRent: 8,
  },
  {
    id: "spinosaurus-bay",
    name: "Spinosaurus Bay",
    biome: "ice",
    price: 4,
    baseRent: 1,
    nestRent: 2,
    exhibitRent: 8,
  },
  {
    id: "trex-valley",
    name: "T-Rex Valley",
    biome: "ice",
    price: 5,
    baseRent: 2,
    nestRent: 3,
    exhibitRent: 10,
  },
];

export const ROUTES = [
  { key: "route-north", name: "Northern Migration Route", price: ROUTE_PRICE, spaceIndex: 5 },
  { key: "route-east", name: "Eastern Migration Route", price: ROUTE_PRICE, spaceIndex: 15 },
] as const;

export const BOARD_SPACES: BoardSpace[] = [
  { index: 0, kind: "hatchery", label: "Hatchery" },
  {
    index: 1,
    kind: "habitat",
    label: "Parasaurolophus Pond",
    propertyKey: "parasaurolophus-pond",
  },
  { index: 2, kind: "fossil_find", label: "Fossil Find" },
  {
    index: 3,
    kind: "habitat",
    label: "Pteranodon Marsh",
    propertyKey: "pteranodon-marsh",
  },
  { index: 4, kind: "fee", label: "Visitor Center Fee", feeAmount: VISITOR_CENTER_FEE },
  {
    index: 5,
    kind: "route",
    label: "Northern Migration Route",
    propertyKey: "route-north",
  },
  {
    index: 6,
    kind: "habitat",
    label: "Velociraptor Dunes",
    propertyKey: "velociraptor-dunes",
  },
  { index: 7, kind: "park_event", label: "Park Event" },
  {
    index: 8,
    kind: "habitat",
    label: "Ankylosaur Ridge",
    propertyKey: "ankylosaur-ridge",
  },
  { index: 9, kind: "tar_pit", label: "Tar Pit" },
  { index: 10, kind: "free_digging", label: "Free Digging" },
  {
    index: 11,
    kind: "habitat",
    label: "Stego Meadow",
    propertyKey: "stego-meadow",
  },
  { index: 12, kind: "fossil_find", label: "Fossil Find" },
  {
    index: 13,
    kind: "habitat",
    label: "Triceratops Grove",
    propertyKey: "triceratops-grove",
  },
  {
    index: 14,
    kind: "habitat",
    label: "Brachiosaurus Heights",
    propertyKey: "brachiosaurus-heights",
  },
  {
    index: 15,
    kind: "route",
    label: "Eastern Migration Route",
    propertyKey: "route-east",
  },
  {
    index: 16,
    kind: "habitat",
    label: "Spinosaurus Bay",
    propertyKey: "spinosaurus-bay",
  },
  { index: 17, kind: "park_event", label: "Park Event" },
  {
    index: 18,
    kind: "habitat",
    label: "T-Rex Valley",
    propertyKey: "trex-valley",
  },
  { index: 19, kind: "ranger", label: "Ranger Outpost" },
];

export function getHabitat(id: string): HabitatDef | undefined {
  return HABITATS.find((h) => h.id === id);
}

export function getSpace(index: number): BoardSpace {
  const space = BOARD_SPACES[index % BOARD_SIZE];
  if (!space) {
    throw new Error(`Invalid board index: ${index}`);
  }
  return space;
}

export function getPropertyPrice(propertyKey: string): number {
  const habitat = getHabitat(propertyKey);
  if (habitat) {
    return habitat.price;
  }
  const route = ROUTES.find((r) => r.key === propertyKey);
  return route?.price ?? 0;
}

export function getPropertyLabel(propertyKey: string): string {
  const habitat = getHabitat(propertyKey);
  if (habitat) {
    return habitat.name;
  }
  const route = ROUTES.find((r) => r.key === propertyKey);
  return route?.name ?? propertyKey;
}

export function habitatsInBiome(biome: Biome): HabitatDef[] {
  return HABITATS.filter((h) => h.biome === biome);
}

/** Grid coords for board UI (7×7), clockwise from Hatchery at bottom-right. */
export function boardGridPosition(index: number): { row: number; col: number } {
  const last = BOARD_GRID_SIZE - 1;
  const corners: Record<number, { row: number; col: number }> = {
    0: { row: last, col: last },
    5: { row: last, col: 0 },
    10: { row: 0, col: 0 },
    15: { row: 0, col: last },
  };
  if (index in corners) {
    return corners[index]!;
  }
  if (index >= 1 && index <= 4) {
    return { row: last, col: last - index };
  }
  if (index >= 6 && index <= 9) {
    return { row: last - (index - 5), col: 0 };
  }
  if (index >= 11 && index <= 14) {
    return { row: 0, col: index - 10 };
  }
  if (index >= 16 && index <= 19) {
    return { row: index - 15, col: last };
  }
  const mid = Math.floor(BOARD_GRID_SIZE / 2);
  return { row: mid, col: mid };
}

export type PathEdge = "bottom" | "top" | "left" | "right";

/** Trail connector cells that link each side of the board loop (7×7 layout). */
export function pathEdgeAt(row: number, col: number): PathEdge | null {
  const last = BOARD_GRID_SIZE - 1;
  if (row === last && col === 1) return "bottom";
  if (row === 1 && col === 0) return "left";
  if (row === 0 && col === last - 1) return "top";
  if (row === last - 1 && col === last) return "right";
  return null;
}

export function isPathConnector(row: number, col: number): boolean {
  return pathEdgeAt(row, col) !== null;
}

/** Which side of the board loop a space sits on. */
export function boardEdgeForSpace(index: number): PathEdge {
  const { row, col } = boardGridPosition(index);
  const last = BOARD_GRID_SIZE - 1;
  if (row === last) return "bottom";
  if (col === 0) return "left";
  if (row === 0) return "top";
  return "right";
}

/**
 * All play pieces face the same screen direction (toward the top).
 * Art is drawn facing right (+X); -90° rotates every piece to face up.
 */
export const BOARD_PIECE_ROTATION = -90;
