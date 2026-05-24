import { useReducer } from "react";
import { Link } from "react-router-dom";
import { gameReducer, initialGameState } from "../game/reducer";
import { getMultiplayerMode } from "../game/multiplayer";

export default function PlayPage() {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);
  const mode = getMultiplayerMode();

  return (
    <main className="shell">
      <h1>Play</h1>
      <p className="meta">
        Phase: {state.phase} · Active: {state.activePlayer} · {mode}
      </p>
      <div className="panel">
        {state.phase === "setup" ? (
          <button
            type="button"
            onClick={() =>
              dispatch({
                type: "START",
                playerIds: ["p1", "p2"],
              })
            }
          >
            Start 2-player hot-seat
          </button>
        ) : (
          <button type="button" onClick={() => dispatch({ type: "PASS_TURN" })}>
            Pass turn ({mode})
          </button>
        )}
      </div>
      <Link className="btn secondary" to="/">
        Home
      </Link>
    </main>
  );
}
