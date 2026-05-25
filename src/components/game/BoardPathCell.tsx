import type { CSSProperties } from "react";
import type { PathEdge } from "../../game/board";

type BoardPathCellProps = {
  edge: PathEdge;
  style?: CSSProperties;
};

function TrailFootprints({ edge }: { edge: PathEdge }) {
  const rotate = edge === "left" ? -90 : edge === "right" ? 90 : edge === "top" ? 180 : 0;

  return (
    <svg
      className="board-path-feet"
      viewBox="0 0 32 32"
      aria-hidden="true"
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <ellipse cx="10" cy="18" rx="2.2" ry="3" fill="#8b6914" opacity="0.55" transform="rotate(-15 10 18)" />
      <ellipse cx="16" cy="14" rx="2.2" ry="3" fill="#8b6914" opacity="0.55" transform="rotate(10 16 14)" />
      <ellipse cx="22" cy="18" rx="2.2" ry="3" fill="#8b6914" opacity="0.55" transform="rotate(-8 22 18)" />
    </svg>
  );
}

export function BoardPathCell({ edge, style }: BoardPathCellProps) {
  return (
    <div
      className={`board-cell board-path board-path--${edge}`}
      style={style}
      aria-hidden="true"
    >
      <div className="board-path-surface">
        <span className="board-path-line" />
        <TrailFootprints edge={edge} />
      </div>
    </div>
  );
}
