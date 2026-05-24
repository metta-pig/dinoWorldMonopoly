import { Link } from "react-router-dom";
import { getGameTitle, getPresetSummary } from "../lib/gameConfig";
import { getMultiplayerMode } from "../game/multiplayer";

export default function HomePage() {
  return (
    <main className="shell">
      <h1>{getGameTitle()}</h1>
      <p className="meta">{getPresetSummary()} · {getMultiplayerMode()}</p>
      <div className="panel">
        <p>
          Template shell. Run <code>@game-build</code> with presets and a{" "}
          <code>game-input/brief.md</code> to replace mechanics, rules, and
          assets.
        </p>
        <div className="btn-row">
          <Link className="btn" to="/play">
            Play prototype
          </Link>
          <Link className="btn secondary" to="/rules">
            Read RULES.md
          </Link>
        </div>
      </div>
    </main>
  );
}
