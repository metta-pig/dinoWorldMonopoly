import type { ReactNode } from "react";
import type { Biome } from "../../game/types";

type IconProps = { size?: number; className?: string };

const defaultSize = 28;

export function DinoIcon({
  habitatId,
  size = defaultSize,
  className,
}: IconProps & { habitatId?: string }) {
  switch (habitatId) {
    case "parasaurolophus-pond":
      return <Parasaurolophus size={size} className={className} />;
    case "pteranodon-marsh":
      return <Pteranodon size={size} className={className} />;
    case "velociraptor-dunes":
      return <Velociraptor size={size} className={className} />;
    case "ankylosaur-ridge":
      return <Ankylosaur size={size} className={className} />;
    case "stego-meadow":
      return <Stegosaurus size={size} className={className} />;
    case "triceratops-grove":
      return <Triceratops size={size} className={className} />;
    case "brachiosaurus-heights":
      return <Brachiosaurus size={size} className={className} />;
    case "spinosaurus-bay":
      return <Spinosaurus size={size} className={className} />;
    case "trex-valley":
      return <TRex size={size} className={className} />;
    default:
      return null;
  }
}

export function SpaceIcon({
  kind,
  size = defaultSize,
  className,
}: IconProps & { kind: string }) {
  switch (kind) {
    case "hatchery":
      return <GoldenEgg size={size} className={className} />;
    case "fossil_find":
      return <FossilBone size={size} className={className} />;
    case "park_event":
      return <ParkTent size={size} className={className} />;
    case "fee":
      return <TicketBooth size={size} className={className} />;
    case "route":
      return <Footprints size={size} className={className} />;
    case "tar_pit":
      return <TarPit size={size} className={className} />;
    case "free_digging":
      return <ShovelDig size={size} className={className} />;
    case "ranger":
      return <RangerBadge size={size} className={className} />;
    default:
      return null;
  }
}

function SvgWrap({
  size,
  className,
  children,
  viewBox = "0 0 32 32",
}: IconProps & { children: ReactNode; viewBox?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

function Parasaurolophus({ size, className }: IconProps) {
  return (
    <SvgWrap size={size} className={className}>
      <ellipse cx="16" cy="22" rx="10" ry="5" fill="#52b788" />
      <path d="M8 20 Q14 8 22 18 L20 22 Q14 16 10 22 Z" fill="#95d5b2" />
      <path d="M22 12 Q28 6 30 10 L26 14 Q24 10 22 12" fill="#40916c" stroke="#2d6a4f" strokeWidth="0.5" />
      <circle cx="12" cy="16" r="1.2" fill="#1b4332" />
    </SvgWrap>
  );
}

function Pteranodon({ size, className }: IconProps) {
  return (
    <SvgWrap size={size} className={className}>
      <path d="M4 18 L16 10 L28 18 L22 14 L16 16 L10 14 Z" fill="#74c69d" />
      <path d="M14 16 L16 8 L18 16 Z" fill="#b7e4c7" />
      <circle cx="16" cy="12" r="1" fill="#1b4332" />
    </SvgWrap>
  );
}

function Velociraptor({ size, className }: IconProps) {
  return (
    <SvgWrap size={size} className={className}>
      <path d="M6 24 L14 10 L20 14 L18 22 L10 26 Z" fill="#f4a261" />
      <path d="M18 14 L26 8 L24 16 Z" fill="#e76f51" />
      <circle cx="14" cy="14" r="1.2" fill="#1b4332" />
      <path d="M8 22 L4 26 L8 24" fill="#e9c46a" />
    </SvgWrap>
  );
}

function Ankylosaur({ size, className }: IconProps) {
  return (
    <SvgWrap size={size} className={className}>
      <ellipse cx="16" cy="20" rx="11" ry="6" fill="#e9c46a" />
      <circle cx="10" cy="16" r="2" fill="#f4a261" />
      <circle cx="14" cy="14" r="1.5" fill="#f4a261" />
      <circle cx="18" cy="15" r="1.5" fill="#f4a261" />
      <path d="M6 18 Q4 14 8 12" fill="#d4a373" stroke="#bc6c25" strokeWidth="0.5" />
    </SvgWrap>
  );
}

function Stegosaurus({ size, className }: IconProps) {
  return (
    <SvgWrap size={size} className={className}>
      <ellipse cx="16" cy="22" rx="10" ry="5" fill="#52b788" />
      <path d="M12 18 L13 8 L14 18 M16 17 L16 6 L17 17 M18 18 L19 9 L20 18" fill="#2d6a4f" />
      <circle cx="10" cy="18" r="1.2" fill="#1b4332" />
    </SvgWrap>
  );
}

function Triceratops({ size, className }: IconProps) {
  return (
    <SvgWrap size={size} className={className}>
      <ellipse cx="16" cy="20" rx="9" ry="5" fill="#74c69d" />
      <path d="M8 18 L6 12 L10 16 M24 18 L26 12 L22 16 M14 14 L16 8 L18 14" fill="#40916c" />
      <circle cx="12" cy="17" r="1" fill="#1b4332" />
    </SvgWrap>
  );
}

function Brachiosaurus({ size, className }: IconProps) {
  return (
    <SvgWrap size={size} className={className}>
      <ellipse cx="14" cy="22" rx="8" ry="4" fill="#95d5b2" />
      <path d="M18 20 L22 6 L24 8 L20 20 Z" fill="#52b788" />
      <circle cx="22" cy="8" r="2" fill="#74c69d" />
      <circle cx="21" cy="7.5" r="0.8" fill="#1b4332" />
    </SvgWrap>
  );
}

function Spinosaurus({ size, className }: IconProps) {
  return (
    <SvgWrap size={size} className={className}>
      <path d="M6 24 L16 12 L24 22 L20 24 L14 18 L8 24 Z" fill="#4895ef" />
      <path d="M16 12 L18 4 L20 12 M17 10 L19 6" fill="#1d3557" />
      <circle cx="14" cy="16" r="1" fill="#1b4332" />
    </SvgWrap>
  );
}

function TRex({ size, className }: IconProps) {
  return (
    <SvgWrap size={size} className={className}>
      <path d="M8 24 L16 10 L24 20 L20 24 L14 18 L10 24 Z" fill="#e63946" />
      <path d="M20 14 L28 10 L26 18 L22 16 Z" fill="#ffb703" />
      <circle cx="14" cy="16" r="1.5" fill="#fff" />
      <circle cx="14.5" cy="16" r="0.7" fill="#1b4332" />
      <path d="M10 20 L6 22 L8 24" fill="#fff" stroke="#1b4332" strokeWidth="0.3" />
    </SvgWrap>
  );
}

function GoldenEgg({ size, className }: IconProps) {
  return (
    <SvgWrap size={size} className={className}>
      <ellipse cx="16" cy="18" rx="8" ry="10" fill="#ffd166" />
      <ellipse cx="14" cy="14" rx="3" ry="4" fill="#ffe8a1" opacity="0.7" />
      <path d="M10 26 Q16 28 22 26" stroke="#bc6c25" strokeWidth="1" fill="none" />
    </SvgWrap>
  );
}

function FossilBone({ size, className }: IconProps) {
  return (
    <SvgWrap size={size} className={className}>
      <path
        d="M10 20 Q8 14 12 10 Q16 8 20 10 Q24 14 22 20 Q20 24 16 24 Q12 24 10 20"
        fill="#d4a373"
        stroke="#bc6c25"
        strokeWidth="0.8"
      />
      <circle cx="12" cy="14" r="2" fill="#faedcd" />
      <circle cx="20" cy="14" r="2" fill="#faedcd" />
    </SvgWrap>
  );
}

function ParkTent({ size, className }: IconProps) {
  return (
    <SvgWrap size={size} className={className}>
      <path d="M6 24 L16 8 L26 24 Z" fill="#e07a7a" />
      <path d="M16 8 L16 24" stroke="#9d0208" strokeWidth="0.8" />
      <rect x="13" y="20" width="6" height="4" fill="#6a040f" />
    </SvgWrap>
  );
}

function TicketBooth({ size, className }: IconProps) {
  return (
    <SvgWrap size={size} className={className}>
      <rect x="8" y="14" width="16" height="10" rx="1" fill="#4a4e69" />
      <rect x="10" y="10" width="12" height="6" rx="1" fill="#9a8c98" />
      <rect x="14" y="18" width="4" height="6" fill="#ffd166" />
    </SvgWrap>
  );
}

function Footprints({ size, className }: IconProps) {
  return (
    <SvgWrap size={size} className={className}>
      <ellipse cx="12" cy="20" rx="3" ry="4" fill="#6c584c" transform="rotate(-20 12 20)" />
      <ellipse cx="20" cy="14" rx="3" ry="4" fill="#6c584c" transform="rotate(15 20 14)" />
      <ellipse cx="14" cy="10" rx="2.5" ry="3.5" fill="#a98467" transform="rotate(-10 14 10)" />
    </SvgWrap>
  );
}

function TarPit({ size, className }: IconProps) {
  return (
    <SvgWrap size={size} className={className}>
      <ellipse cx="16" cy="20" rx="12" ry="6" fill="#3d405b" />
      <ellipse cx="16" cy="18" rx="8" ry="3" fill="#1a1a2e" opacity="0.6" />
      <circle cx="12" cy="17" r="1.5" fill="#6c757d" opacity="0.5" />
      <circle cx="18" cy="19" r="1" fill="#6c757d" opacity="0.5" />
    </SvgWrap>
  );
}

function ShovelDig({ size, className }: IconProps) {
  return (
    <SvgWrap size={size} className={className}>
      <rect x="14" y="6" width="4" height="14" rx="1" fill="#bc6c25" />
      <path d="M10 22 L22 22 L20 26 L12 26 Z" fill="#6c584c" />
      <ellipse cx="16" cy="24" rx="6" ry="2" fill="#a98467" />
    </SvgWrap>
  );
}

function RangerBadge({ size, className }: IconProps) {
  return (
    <SvgWrap size={size} className={className}>
      <path d="M16 4 L20 8 L28 10 L22 16 L24 24 L16 20 L8 24 L10 16 L4 10 L12 8 Z" fill="#ffd166" stroke="#bc6c25" strokeWidth="0.8" />
      <circle cx="16" cy="14" r="4" fill="#e63946" />
      <text x="16" y="16" textAnchor="middle" fontSize="5" fill="#fff" fontWeight="bold">!</text>
    </SvgWrap>
  );
}

export function BiomeBadge({ biome, className }: { biome: Biome; className?: string }) {
  const labels: Record<Biome, string> = {
    swamp: "Swamp",
    desert: "Desert",
    forest: "Forest",
    ice: "Ice Zone",
  };
  return <span className={`biome-badge biome-${biome} ${className ?? ""}`}>{labels[biome]}</span>;
}

export function shortHabitatName(fullName: string): string {
  const map: Record<string, string> = {
    "Parasaurolophus Pond": "Parasaur Pond",
    "Pteranodon Marsh": "Pteranodon Marsh",
    "Velociraptor Dunes": "Raptor Dunes",
    "Ankylosaur Ridge": "Ankylosaur Ridge",
    "Stego Meadow": "Stego Meadow",
    "Triceratops Grove": "Triceratops Grove",
    "Brachiosaurus Heights": "Brachio Heights",
    "Spinosaurus Bay": "Spino Bay",
    "T-Rex Valley": "T-Rex Valley",
    "Northern Migration Route": "North Trail",
    "Eastern Migration Route": "East Trail",
  };
  return map[fullName] ?? fullName;
}

export function shortSpaceLabel(kind: string, fullLabel: string): string {
  if (kind === "hatchery") return "Hatchery";
  if (kind === "fossil_find") return "Fossil Find";
  if (kind === "park_event") return "Park Event";
  if (kind === "fee") return "Visitor Fee";
  if (kind === "tar_pit") return "Tar Pit";
  if (kind === "free_digging") return "Free Dig";
  if (kind === "ranger") return "Ranger!";
  return shortHabitatName(fullLabel);
}
