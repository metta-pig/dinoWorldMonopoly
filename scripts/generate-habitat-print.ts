/**
 * Generates print-ready habitat deed SVGs with embedded artwork.
 * Run: npx tsx scripts/generate-habitat-print.ts
 */
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { BIOME_LABELS, BIOME_COLORS, HABITATS } from "../src/game/board.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const ART_DIR = join(ROOT, "public/assets/habitats");
const OUT_DIR = join(ROOT, "assets/print/generated");

mkdirSync(OUT_DIR, { recursive: true });

for (const h of HABITATS) {
  const pngPath = join(ART_DIR, `${h.id}.png`);
  let imageTag = "";
  try {
    const b64 = readFileSync(pngPath).toString("base64");
    imageTag = `<image href="data:image/png;base64,${b64}" x="4" y="20" width="55.5" height="44" preserveAspectRatio="xMidYMid slice" clip-path="url(#art-clip)"/>`;
  } catch {
    imageTag = `<ellipse cx="31.75" cy="42" rx="18" ry="12" fill="#ffd166" opacity="0.4"/>`;
  }

  const biome = BIOME_LABELS[h.biome].toUpperCase();
  const header = BIOME_COLORS[h.biome];
  const visitLine = `Visit: $${h.baseRent} / $${h.baseRent * 2} set · Nest $${h.nestRent} · Exhibit $${h.exhibitRent}`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 63.5 88" width="63.5mm" height="88mm">
  <defs>
    <clipPath id="art-clip"><rect x="4" y="20" width="55.5" height="44" rx="3"/></clipPath>
  </defs>
  <rect width="63.5" height="88" fill="${header}"/>
  <rect y="0" width="63.5" height="16" fill="#1b4332" opacity="0.9"/>
  <text x="31.75" y="7" text-anchor="middle" fill="#ffd166" font-size="5" font-family="Fredoka, system-ui, sans-serif" font-weight="700">${biome}</text>
  <text x="31.75" y="13" text-anchor="middle" fill="#fff" font-size="4" font-family="Nunito, system-ui, sans-serif">${h.name}</text>
  ${imageTag}
  <rect x="4" y="66" width="55.5" height="18" fill="#fff9ef" rx="2" opacity="0.95"/>
  <text x="31.75" y="74" text-anchor="middle" fill="#2c1810" font-size="5.5" font-family="Fredoka, system-ui, sans-serif" font-weight="700">Price $${h.price}</text>
  <text x="31.75" y="80" text-anchor="middle" fill="#5c4d3c" font-size="2.8" font-family="Nunito, system-ui, sans-serif">${visitLine}</text>
</svg>`;

  writeFileSync(join(OUT_DIR, `habitat-${h.id}.svg`), svg);
  console.log("Wrote habitat-" + h.id + ".svg");
}

console.log("Done —", HABITATS.length, "habitat deed cards with embedded art.");
