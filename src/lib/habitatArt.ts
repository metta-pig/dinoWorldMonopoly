/** Habitat illustration paths (generated flat-vector art). */

export const HABITAT_ART: Record<string, string> = {
  "parasaurolophus-pond": "/assets/habitats/parasaurolophus-pond.png",
  "pteranodon-marsh": "/assets/habitats/pteranodon-marsh.png",
  "velociraptor-dunes": "/assets/habitats/velociraptor-dunes.png",
  "ankylosaur-ridge": "/assets/habitats/ankylosaur-ridge.png",
  "stego-meadow": "/assets/habitats/stego-meadow.png",
  "triceratops-grove": "/assets/habitats/triceratops-grove.png",
  "brachiosaurus-heights": "/assets/habitats/brachiosaurus-heights.png",
  "spinosaurus-bay": "/assets/habitats/spinosaurus-bay.png",
  "trex-valley": "/assets/habitats/trex-valley.png",
};

export function habitatArtUrl(habitatId: string | undefined): string | null {
  if (!habitatId) return null;
  return HABITAT_ART[habitatId] ?? null;
}
