import type { ExplorerDef } from "../../lib/explorers";

type AvatarProps = { explorer: ExplorerDef; size?: number; className?: string };

export function ExplorerAvatar({ explorer, size = 48, className }: AvatarProps) {
  const skin = "#f4c99a";
  const hairColors: Record<ExplorerDef["avatarId"], string> = {
    riley: "#5c4033",
    sam: "#1a1a2e",
    jordan: "#8b4513",
    alex: "#d4a373",
  };
  const hatColors: Record<ExplorerDef["avatarId"], string> = {
    riley: "#2d6a4f",
    sam: "#e63946",
    jordan: "#457b9d",
    alex: "#ffb703",
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={`explorer-avatar ${className ?? ""}`}
      aria-hidden="true"
    >
      <circle cx="24" cy="24" r="22" fill={explorer.accent} opacity="0.25" />
      <circle cx="24" cy="24" r="20" fill="#fff9ef" stroke={explorer.accent} strokeWidth="2" />
      {/* Hat */}
      <ellipse cx="24" cy="16" rx="14" ry="4" fill={hatColors[explorer.avatarId]} />
      <rect x="14" y="10" width="20" height="8" rx="2" fill={hatColors[explorer.avatarId]} />
      {/* Face */}
      <circle cx="24" cy="26" r="10" fill={skin} />
      <circle cx="20" cy="25" r="1.5" fill="#2c1810" />
      <circle cx="28" cy="25" r="1.5" fill="#2c1810" />
      <path d="M20 30 Q24 33 28 30" stroke="#c9184a" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      {/* Hair peek */}
      <path d="M16 22 Q18 18 22 20" fill={hairColors[explorer.avatarId]} />
      {/* Badge */}
      <circle cx="34" cy="34" r="6" fill={explorer.accent} />
      <text x="34" y="36" textAnchor="middle" fontSize="7" fill="#fff" fontWeight="bold">
        ★
      </text>
    </svg>
  );
}

export function ExplorerToken({
  explorer,
  size = 16,
  className,
}: {
  explorer: ExplorerDef;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={`explorer-token ${className ?? ""}`}
      style={{
        width: size,
        height: size,
        background: explorer.accent,
        borderColor: "#fff",
      }}
      title={explorer.name}
    />
  );
}
