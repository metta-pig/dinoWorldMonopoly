import { useCallback, useReducer, useState } from "react";
import { Link } from "react-router-dom";
import { ActionPanel } from "../components/game/ActionPanel";
import { ExplorerPanel } from "../components/game/ExplorerPanel";
import { GameBoard } from "../components/game/GameBoard";
import { SetupScreen } from "../components/game/SetupScreen";
import { gameReducer, initialGameState } from "../game/reducer";
import type { GameAction } from "../game/types";
import { getMultiplayerMode } from "../game/multiplayer";
import { explorerForPlayer } from "../lib/explorers";
import { playChaChing, playDiceRoll, unlockAudio } from "../lib/gameSounds";
import { useGameFeedback } from "../hooks/useGameFeedback";

const ROLL_ANIM_MS = 900;

export default function PlayPage() {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);
  const [rolling, setRolling] = useState(false);
  const mode = getMultiplayerMode();
  const activeIdx = state.players.indexOf(state.activePlayer);
  const activeExplorer =
    state.phase === "playing" || state.phase === "finished"
      ? explorerForPlayer(state.activePlayer, activeIdx)
      : null;

  useGameFeedback(state);

  const rollWithAnimation = useCallback(
    (action: GameAction) => {
      if (rolling) return;
      unlockAudio();
      playDiceRoll();
      setRolling(true);
      window.setTimeout(() => {
        dispatch(action);
        setRolling(false);
      }, ROLL_ANIM_MS);
    },
    [rolling],
  );

  const handleDispatch = useCallback(
    (action: GameAction) => {
      if (action.type === "ROLL_DICE" || action.type === "TAR_PIT_ROLL") {
        rollWithAnimation(action);
        return;
      }
      if (action.type === "BUY_PROPERTY") {
        unlockAudio();
        playChaChing();
      }
      dispatch(action);
    },
    [rollWithAnimation],
  );

  return (
    <div className="park-app">
      <header className="park-header">
        <div className="park-header-brand">
          <img src="/assets/dino-world-park-logo.png" alt="" className="park-header-logo" />
          <div>
            <h1>Dino World Monopoly</h1>
            <p className="park-subtitle">
              {mode}
              {state.phase === "setup"
                ? " · Choose your explorers"
                : activeExplorer
                  ? ` · ${activeExplorer.name}'s turn`
                  : ""}
            </p>
          </div>
        </div>
        <Link className="btn-secondary park-home-link" to="/">
          ← Park entrance
        </Link>
      </header>

      {state.phase === "setup" ? (
        <SetupScreen dispatch={dispatch} />
      ) : (
        <div className="park-layout">
          <div className="park-board-col">
            <GameBoard state={state} rolling={rolling} />
          </div>
          <aside className="park-sidebar">
            <ExplorerPanel state={state} />
            <ActionPanel state={state} dispatch={handleDispatch} rolling={rolling} />
            <section className="panel log-panel">
              <h2 className="panel-title">
                <span className="panel-icon" aria-hidden="true">
                  📋
                </span>
                Park news
              </h2>
              <ul className="event-log">
                {[...state.log].reverse().map((line, i) => (
                  <li key={`${line}-${i}`}>{line}</li>
                ))}
              </ul>
            </section>
          </aside>
        </div>
      )}
    </div>
  );
}
