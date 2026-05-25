import type { CSSProperties } from "react";
import {
  BIOME_COLORS,
  BOARD_GRID_SIZE,
  BOARD_SPACES,
  boardGridPosition,
  getHabitat,
  pathEdgeAt,
} from "../../game/board";
import type { GameState } from "../../game/types";
import { explorerForPlayer } from "../../lib/explorers";
import { habitatArtUrl } from "../../lib/habitatArt";
import {
  BiomeBadge,
  DinoIcon,
  SpaceIcon,
  shortSpaceLabel,
} from "../dino/DinoArt";
import { BoardPathCell } from "./BoardPathCell";
import { BoardTokenLayer } from "./BoardTokenLayer";
import { DiceRoller } from "./DiceRoller";
import { useAnimatedPositions } from "../../hooks/useAnimatedPositions";

type GameBoardProps = {
  state: GameState;
  rolling: boolean;
};

function HabitatArt({ habitatId }: { habitatId: string }) {
  const url = habitatArtUrl(habitatId);
  if (!url) {
    return <DinoIcon habitatId={habitatId} size={26} />;
  }
  return (
    <img
      src={url}
      alt=""
      className="habitat-art-thumb"
      onError={(e) => {
        e.currentTarget.style.display = "none";
        e.currentTarget.nextElementSibling?.classList.remove("habitat-art-fallback--hidden");
      }}
    />
  );
}

export function GameBoard({ state, rolling }: GameBoardProps) {
  const active = state.playerStates[state.activePlayer];
  const displayPositions = useAnimatedPositions(state);
  const showDice = rolling || state.lastRoll !== null;
  const innerLast = BOARD_GRID_SIZE - 2;
  const centerAnchor = Math.floor(BOARD_GRID_SIZE / 2);

  return (
    <div className="board-frame">
      <div
        className="board-frame-inner"
        style={{ "--board-grid-size": BOARD_GRID_SIZE } as CSSProperties}
      >
        <div className="board-grid" aria-label="Dino World Park game board">
          {Array.from({ length: BOARD_GRID_SIZE * BOARD_GRID_SIZE }).map((_, i) => {
            const row = Math.floor(i / BOARD_GRID_SIZE);
            const col = i % BOARD_GRID_SIZE;
            const gridStyle = { gridRow: row + 1, gridColumn: col + 1 } as const;

            if (row >= 1 && row <= innerLast && col >= 1 && col <= innerLast) {
              if (row === centerAnchor && col === centerAnchor) {
                return (
                  <div
                    key="board-center"
                    className="board-cell board-center"
                    style={{ gridRow: "2 / -2", gridColumn: "2 / -2" }}
                  >
                    <div className="board-center-scenery" aria-hidden="true">
                      <span className="board-center-fern board-center-fern--l" />
                      <span className="board-center-fern board-center-fern--r" />
                    </div>
                    <img
                      src="/assets/dino-world-park-logo.png"
                      alt="Dino World Park"
                      className="board-logo"
                    />
                    {showDice && (
                      <DiceRoller
                        values={rolling ? null : state.lastRoll}
                        rolling={rolling}
                      />
                    )}
                  </div>
                );
              }
              return null;
            }

            const space = BOARD_SPACES.find((s) => {
              const pos = boardGridPosition(s.index);
              return pos.row === row && pos.col === col;
            });

            if (!space) {
              const pathEdge = pathEdgeAt(row, col);
              if (pathEdge) {
                return <BoardPathCell key={`path-${row}-${col}`} edge={pathEdge} style={gridStyle} />;
              }
              return null;
            }

            const habitat = space.propertyKey ? getHabitat(space.propertyKey) : undefined;
            const prop = space.propertyKey ? state.properties[space.propertyKey] : undefined;
            const isActive = active?.position === space.index;
            const biomeClass = habitat ? `biome-tile-${habitat.biome}` : `space-tile-${space.kind}`;

            return (
              <div
                key={space.index}
                className={`board-cell board-space ${biomeClass} ${isActive ? "active-space" : ""}`}
                style={{
                  ...gridStyle,
                  ...(habitat
                    ? {
                        background: `linear-gradient(180deg, ${BIOME_COLORS[habitat.biome]} 0%, ${BIOME_COLORS[habitat.biome]}cc 48%, #fff9ef 48%)`,
                      }
                    : {}),
                }}
                title={space.label}
              >
                <div className="space-icon-wrap">
                  {habitat ? (
                    <>
                      <HabitatArt habitatId={habitat.id} />
                      <span className="habitat-art-fallback habitat-art-fallback--hidden">
                        <DinoIcon habitatId={habitat.id} size={26} />
                      </span>
                    </>
                  ) : (
                    <SpaceIcon kind={space.kind} size={26} />
                  )}
                </div>
                {habitat && <BiomeBadge biome={habitat.biome} className="space-biome-tag" />}
                <span className="space-label">{shortSpaceLabel(space.kind, space.label)}</span>
                {habitat && <span className="space-price">${habitat.price}</span>}
                {prop?.ownerId && (
                  <span
                    className="owner-flag"
                    style={{
                      background: explorerForPlayer(
                        prop.ownerId,
                        state.players.indexOf(prop.ownerId),
                      ).accent,
                    }}
                  />
                )}
                <div className="space-improvements">
                  {prop && prop.nests > 0 && (
                    <span className="nest-pips" title={`${prop.nests} nest(s)`}>
                      {"🥚".repeat(prop.nests)}
                    </span>
                  )}
                  {prop?.hasExhibit && (
                    <span className="exhibit-pip" title="Exhibit">
                      🏛️
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <BoardTokenLayer state={state} displayPositions={displayPositions} />
      </div>
    </div>
  );
}
