import type { CSSProperties } from "react";
import { boardGridPosition } from "../../game/board";
import type { GameState, PlayerId } from "../../game/types";
import { explorerForPlayer } from "../../lib/explorers";
import { DinoPlayPiece } from "../dino/DinoPlayPiece";

/** Offset stacked pieces along the same facing direction (toward top of tile). */
const STACK_OFFSETS: { x: string; y: string }[] = [
  { x: "0%", y: "0%" },
  { x: "-20%", y: "-12%" },
  { x: "20%", y: "-12%" },
  { x: "0%", y: "-22%" },
];

type BoardTokenLayerProps = {
  state: GameState;
  displayPositions: Record<PlayerId, number>;
};

export function BoardTokenLayer({ state, displayPositions }: BoardTokenLayerProps) {
  const playersBySpace = state.players.reduce<Record<number, PlayerId[]>>((acc, pid) => {
    const p = state.playerStates[pid];
    if (!p || p.bankrupt) return acc;
    const space = displayPositions[pid] ?? p.position;
    acc[space] = [...(acc[space] ?? []), pid];
    return acc;
  }, {});

  return (
    <div className="board-token-layer" aria-label="Player dino pieces on the board">
      {Object.entries(playersBySpace).flatMap(([spaceIndex, playerIds]) => {
        const idx = Number(spaceIndex);
        const { row, col } = boardGridPosition(idx);

        return playerIds.map((pid, stackIndex) => {
          const playerIdx = state.players.indexOf(pid);
          const explorer = explorerForPlayer(pid, playerIdx);
          const offset = STACK_OFFSETS[stackIndex] ?? STACK_OFFSETS[0]!;
          const isActive = pid === state.activePlayer;

          return (
            <div
              key={pid}
              className="board-token-slot"
              style={
                {
                  gridRow: row + 1,
                  gridColumn: col + 1,
                  "--stack-x": offset.x,
                  "--stack-y": offset.y,
                } as CSSProperties
              }
            >
              <DinoPlayPiece
                kind={explorer.dinoToken}
                accent={explorer.accent}
                name={state.playerStates[pid]?.name ?? explorer.name}
                isActive={isActive}
                onBoard
              />
            </div>
          );
        });
      })}
    </div>
  );
}
