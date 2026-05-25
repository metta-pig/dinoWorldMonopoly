import { useEffect, useRef, useState } from "react";
import { BOARD_SIZE } from "../game/board";
import type { GameState, PlayerId } from "../game/types";

const STEP_MS = 175;

/** Step clockwise around the board — same travel direction every time. */
export function movementPath(from: number, to: number): number[] {
  if (from === to) return [from];

  const path: number[] = [from];
  let current = from;
  const steps = (to - from + BOARD_SIZE) % BOARD_SIZE;

  for (let i = 0; i < steps; i++) {
    current = (current + 1) % BOARD_SIZE;
    path.push(current);
  }

  return path;
}

/** Counter-clockwise path for explicit “go back” moves (short reverse only). */
export function movementPathBackward(from: number, to: number): number[] {
  if (from === to) return [from];

  const path: number[] = [from];
  let current = from;
  const steps = (from - to + BOARD_SIZE) % BOARD_SIZE;

  for (let i = 0; i < steps; i++) {
    current = (current - 1 + BOARD_SIZE) % BOARD_SIZE;
    path.push(current);
  }

  return path;
}

/** Pick path that matches how the player actually moved on the track. */
export function movementPathForMove(from: number, to: number): number[] {
  const forward = (to - from + BOARD_SIZE) % BOARD_SIZE;
  const backward = (from - to + BOARD_SIZE) % BOARD_SIZE;
  if (backward > 0 && backward < forward && backward <= 6) {
    return movementPathBackward(from, to);
  }
  return movementPath(from, to);
}

type AnimatingPlayer = {
  path: number[];
  stepIndex: number;
};

/**
 * Returns board positions for display, stepping through spaces when a player moves.
 */
export function useAnimatedPositions(state: GameState): Record<PlayerId, number> {
  const [display, setDisplay] = useState<Record<PlayerId, number>>({});
  const displayRef = useRef<Record<PlayerId, number>>({});
  const animatingRef = useRef<Map<PlayerId, AnimatingPlayer>>(new Map());
  const prevTargetRef = useRef<Record<PlayerId, number>>({});

  useEffect(() => {
    displayRef.current = display;
  }, [display]);

  const positionKey = state.players
    .map((id) => {
      const p = state.playerStates[id];
      return p && !p.bankrupt ? `${id}:${p.position}` : `${id}:x`;
    })
    .join("|");

  useEffect(() => {
    const timers: ReturnType<typeof setInterval>[] = [];

    for (const pid of state.players) {
      const p = state.playerStates[pid];
      if (!p || p.bankrupt) {
        continue;
      }

      const target = p.position;
      const prevTarget = prevTargetRef.current[pid];

      if (prevTarget === undefined) {
        prevTargetRef.current[pid] = target;
        setDisplay((d) => ({ ...d, [pid]: target }));
        continue;
      }

      if (target === prevTarget || animatingRef.current.has(pid)) {
        continue;
      }

      prevTargetRef.current[pid] = target;
      const from = displayRef.current[pid] ?? prevTarget;
      const path = movementPathForMove(from, target);

      if (path.length <= 1) {
        setDisplay((d) => ({ ...d, [pid]: target }));
        continue;
      }

      animatingRef.current.set(pid, { path, stepIndex: 1 });
      setDisplay((d) => ({ ...d, [pid]: path[1]! }));

      const timer = setInterval(() => {
        const anim = animatingRef.current.get(pid);
        if (!anim) {
          clearInterval(timer);
          return;
        }

        anim.stepIndex += 1;
        if (anim.stepIndex >= anim.path.length) {
          clearInterval(timer);
          animatingRef.current.delete(pid);
          setDisplay((d) => ({ ...d, [pid]: target }));
          return;
        }

        setDisplay((d) => ({ ...d, [pid]: anim.path[anim.stepIndex]! }));
      }, STEP_MS);

      timers.push(timer);
    }

    return () => {
      for (const t of timers) {
        clearInterval(t);
      }
    };
  }, [positionKey]); // eslint-disable-line react-hooks/exhaustive-deps -- keyed on positions only

  return display;
}
