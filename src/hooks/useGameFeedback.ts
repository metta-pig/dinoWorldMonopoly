import { useEffect, useRef } from "react";
import type { GameState } from "../game/types";
import { playChaChing, playTrexRoar, playWinFanfare, unlockAudio } from "../lib/gameSounds";

/**
 * Plays SFX when game state changes (roll, purchases, T-Rex landing, win).
 */
export function useGameFeedback(state: GameState): void {
  const prev = useRef({
    lastRoll: null as [number, number] | null,
    logLen: 0,
    phase: state.phase,
    position: -1,
    activePlayer: "",
  });

  useEffect(() => {
    const p = state.playerStates[state.activePlayer];
    const pos = p?.position ?? -1;

    if (state.log.length > prev.current.logLen) {
      const newest = state.log[state.log.length - 1] ?? "";
      if (newest.includes("bought") || newest.includes("Hatchery (+$")) {
        playChaChing();
      }
      if (newest.includes("paid $") && newest.includes("visit fee")) {
        playChaChing();
      }
    }

    if (
      pos === 18 &&
      (prev.current.position !== 18 || prev.current.activePlayer !== state.activePlayer) &&
      state.phase === "playing"
    ) {
      playTrexRoar();
    }

    if (state.phase === "finished" && prev.current.phase !== "finished") {
      playWinFanfare();
    }

    prev.current = {
      lastRoll: state.lastRoll,
      logLen: state.log.length,
      phase: state.phase,
      position: pos,
      activePlayer: state.activePlayer,
    };
  }, [state]);

  useEffect(() => {
    const unlock = () => unlockAudio();
    window.addEventListener("pointerdown", unlock, { once: true });
    return () => window.removeEventListener("pointerdown", unlock);
  }, []);
}
