import type { CSSProperties, ReactNode } from "react";
import type { DinoTokenKind } from "../../lib/explorers";

type DinoPlayPieceProps = {
  kind: DinoTokenKind;
  accent: string;
  name: string;
  size?: number;
  isActive?: boolean;
  onBoard?: boolean;
  className?: string;
};

type PieceArtProps = { accent: string; size: number };

function darken(hex: string, pct: number): string {
  const n = hex.replace("#", "");
  const r = Math.max(0, parseInt(n.slice(0, 2), 16) * (1 - pct));
  const g = Math.max(0, parseInt(n.slice(2, 4), 16) * (1 - pct));
  const b = Math.max(0, parseInt(n.slice(4, 6), 16) * (1 - pct));
  return `rgb(${r | 0}, ${g | 0}, ${b | 0})`;
}

function lighten(hex: string, pct: number): string {
  const n = hex.replace("#", "");
  const r = Math.min(255, parseInt(n.slice(0, 2), 16) + (255 - parseInt(n.slice(0, 2), 16)) * pct);
  const g = Math.min(255, parseInt(n.slice(2, 4), 16) + (255 - parseInt(n.slice(2, 4), 16)) * pct);
  const b = Math.min(255, parseInt(n.slice(4, 6), 16) + (255 - parseInt(n.slice(4, 6), 16)) * pct);
  return `rgb(${r | 0}, ${g | 0}, ${b | 0})`;
}

function PieceCanvas({ size, children }: { size: number; children: ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <ellipse cx="20" cy="36.5" rx="13" ry="2.8" fill="rgba(0,0,0,0.16)" />
      {children}
    </svg>
  );
}

/** Parasaurolophus — curved head crest, duck bill, four legs, long tail. */
function ParasaurPiece({ accent, size }: PieceArtProps) {
  const dark = darken(accent, 0.28);
  const light = lighten(accent, 0.35);
  return (
    <PieceCanvas size={size}>
      {/* tail */}
      <path d="M6 24 Q2 22 3 19 Q4 17 8 20 L10 23 Z" fill={dark} />
      {/* hind legs */}
      <path d="M12 28 L11 33 L14 33 L15 28 Z" fill={dark} />
      <path d="M17 28 L16 33 L19 33 L20 28 Z" fill={dark} />
      {/* body */}
      <ellipse cx="19" cy="24" rx="9" ry="5.5" fill={accent} />
      <ellipse cx="19" cy="25.5" rx="7" ry="3" fill={light} opacity="0.55" />
      {/* front legs */}
      <path d="M22 28 L21 33 L24 33 L25 28 Z" fill={accent} />
      <path d="M26 27 L25.5 32 L28 32 L28.5 27 Z" fill={accent} />
      {/* neck */}
      <path d="M24 22 Q27 18 28 14 L26 14 Q25 18 23 21 Z" fill={accent} />
      {/* head & bill */}
      <path d="M28 14 Q32 13 34 15 Q35 16 33 17 L28 16 Z" fill={light} />
      <path d="M28 14 Q27 13 27 15 Q27 16 28 16 Z" fill={accent} />
      {/* signature crest */}
      <path
        d="M27 13 Q26 6 30 4 Q34 3 35 8 Q36 12 32 13 Q29 14 27 13 Z"
        fill={dark}
        stroke={darken(accent, 0.4)}
        strokeWidth="0.4"
      />
      <path d="M28 12 Q29 8 32 7 Q33 9 31 11 Z" fill={light} opacity="0.45" />
      {/* eye */}
      <circle cx="30" cy="14.5" r="1.1" fill="#fff" />
      <circle cx="30.3" cy="14.5" r="0.55" fill="#1b4332" />
    </PieceCanvas>
  );
}

/** Velociraptor — lean hunter, stiff tail, sickle claw, snout. */
function RaptorPiece({ accent, size }: PieceArtProps) {
  const dark = darken(accent, 0.25);
  const light = lighten(accent, 0.3);
  return (
    <PieceCanvas size={size}>
      {/* tail */}
      <path d="M5 22 Q2 20 4 17 L8 19 L12 21 L10 23 Z" fill={dark} />
      <path d="M8 19 L12 21" stroke={dark} strokeWidth="0.6" opacity="0.5" />
      {/* back leg */}
      <path d="M13 26 L12 33 L15 33 L16 26 Z" fill={dark} />
      {/* body */}
      <path d="M12 21 Q16 17 22 18 Q26 19 27 23 Q26 27 20 27 Q14 27 12 21 Z" fill={accent} />
      <path d="M15 22 Q19 20 23 21 Q22 24 18 24 Q15 24 15 22 Z" fill={light} opacity="0.5" />
      {/* raised leg + sickle claw */}
      <path d="M20 26 L18 32 L21 32 L22 26 Z" fill={accent} />
      <path d="M18 32 L16 34 L18 33 Z" fill="#fff9ef" stroke={dark} strokeWidth="0.5" />
      {/* arm */}
      <path d="M22 20 L24 23 L22 23 Z" fill={dark} />
      {/* neck & head */}
      <path d="M24 18 Q28 14 31 15 Q33 16 32 18 L28 20 Q25 20 24 18 Z" fill={accent} />
      <path d="M31 15 Q34 14 35 16 Q35 17 33 17 L31 16 Z" fill={light} />
      {/* jaw */}
      <path d="M32 17 Q34 18 33 19 L31 18 Z" fill={dark} opacity="0.7" />
      {/* eye */}
      <circle cx="30" cy="16" r="1.2" fill="#fff" />
      <circle cx="30.4" cy="16" r="0.6" fill="#1b4332" />
      {/* feather hints */}
      <path d="M18 19 L17 17 M20 18 L19 16" stroke={dark} strokeWidth="0.8" strokeLinecap="round" />
    </PieceCanvas>
  );
}

/** Triceratops — frill, three horns, stocky body, beak. */
function TriceratopsPiece({ accent, size }: PieceArtProps) {
  const dark = darken(accent, 0.28);
  const light = lighten(accent, 0.32);
  return (
    <PieceCanvas size={size}>
      {/* tail stub */}
      <path d="M7 24 Q5 23 6 21 L9 22 Z" fill={dark} />
      {/* legs */}
      <path d="M11 28 L10 33 L13 33 L14 28 Z" fill={dark} />
      <path d="M16 28 L15 33 L18 33 L19 28 Z" fill={dark} />
      <path d="M22 28 L21 33 L24 33 L25 28 Z" fill={accent} />
      <path d="M26 28 L25 33 L28 33 L29 28 Z" fill={accent} />
      {/* body */}
      <ellipse cx="19" cy="24" rx="10" ry="6" fill={accent} />
      <ellipse cx="19" cy="25.5" rx="7.5" ry="3.2" fill={light} opacity="0.5" />
      {/* frill */}
      <path
        d="M24 20 Q28 12 34 14 Q36 18 34 22 Q30 24 26 22 Q24 22 24 20 Z"
        fill={dark}
        stroke={darken(accent, 0.38)}
        strokeWidth="0.5"
      />
      <path d="M26 20 Q29 15 32 16 Q33 18 30 20 Z" fill={light} opacity="0.35" />
      {/* head */}
      <ellipse cx="27" cy="21" rx="4" ry="3.2" fill={accent} />
      {/* beak */}
      <path d="M30 21 Q34 21 34 22.5 Q33 23.5 30 22.5 Z" fill={light} />
      {/* horns */}
      <path d="M26 18 L25 13 L27 17 Z" fill="#fff9ef" stroke={dark} strokeWidth="0.4" />
      <path d="M29 17 L29 11 L30.5 17 Z" fill="#fff9ef" stroke={dark} strokeWidth="0.4" />
      <path d="M32 19 L34 16 L32.5 19.5 Z" fill="#fff9ef" stroke={dark} strokeWidth="0.4" />
      {/* eyes */}
      <circle cx="27.5" cy="20" r="0.9" fill="#fff" />
      <circle cx="27.8" cy="20" r="0.45" fill="#1b4332" />
    </PieceCanvas>
  );
}

/** Stegosaurus — back plates, spiked tail, tiny head. */
function StegoPiece({ accent, size }: PieceArtProps) {
  const dark = darken(accent, 0.28);
  const light = lighten(accent, 0.32);
  const plate = lighten(accent, 0.15);
  return (
    <PieceCanvas size={size}>
      {/* tail + thagomizer spikes */}
      <path d="M5 23 Q3 22 4 20 L8 21 L10 22 L9 24 Z" fill={dark} />
      <path d="M4 20 L2 18 L4 19 Z" fill={dark} />
      <path d="M4 21 L2 22 L4 22.5 Z" fill={dark} />
      <path d="M5 22 L3 24 L5 23.5 Z" fill={dark} />
      {/* legs */}
      <path d="M12 28 L11 33 L14 33 L15 28 Z" fill={dark} />
      <path d="M17 28 L16 33 L19 33 L20 28 Z" fill={dark} />
      <path d="M22 28 L21 33 L24 33 L25 28 Z" fill={accent} />
      <path d="M26 27 L25.5 32 L28 32 L28.5 27 Z" fill={accent} />
      {/* body */}
      <ellipse cx="18" cy="24" rx="10" ry="5.5" fill={accent} />
      <ellipse cx="18" cy="25.5" rx="7" ry="2.8" fill={light} opacity="0.5" />
      {/* back plates */}
      <path d="M12 19 L13 10 L15 19 Z" fill={plate} stroke={dark} strokeWidth="0.4" />
      <path d="M15 18 L16.5 8 L18 18 Z" fill={plate} stroke={dark} strokeWidth="0.4" />
      <path d="M18 19 L19 11 L21 19 Z" fill={plate} stroke={dark} strokeWidth="0.4" />
      <path d="M21 20 L22 13 L23.5 20 Z" fill={plate} stroke={dark} strokeWidth="0.4" />
      {/* neck & small head */}
      <path d="M24 22 Q26 20 27 18 L25 18 Q24 20 23 22 Z" fill={accent} />
      <ellipse cx="28" cy="18" rx="2.2" ry="1.8" fill={accent} />
      <path d="M29 18 Q31 18 31 19 Q30 19.8 29 19 Z" fill={light} />
      <circle cx="28.5" cy="17.8" r="0.7" fill="#fff" />
      <circle cx="28.7" cy="17.8" r="0.35" fill="#1b4332" />
    </PieceCanvas>
  );
}

export function DinoPlayPiece({
  kind,
  accent,
  name,
  size = 36,
  isActive = false,
  onBoard = false,
  className,
}: DinoPlayPieceProps) {
  const dino =
    kind === "parasaur" ? (
      <ParasaurPiece accent={accent} size={size} />
    ) : kind === "raptor" ? (
      <RaptorPiece accent={accent} size={size} />
    ) : kind === "triceratops" ? (
      <TriceratopsPiece accent={accent} size={size} />
    ) : (
      <StegoPiece accent={accent} size={size} />
    );

  return (
    <div
      className={`dino-play-piece ${onBoard ? "dino-play-piece--on-board" : ""} ${isActive ? "dino-play-piece--active" : ""} ${className ?? ""}`}
      title={name}
      aria-label={`${name}'s dino piece`}
      style={{ "--piece-accent": accent } as CSSProperties}
    >
      {dino}
    </div>
  );
}
