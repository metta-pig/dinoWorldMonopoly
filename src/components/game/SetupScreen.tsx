import type { Dispatch } from "react";
import type { GameAction } from "../../game/types";
import { EXPLORER_ROSTER, defaultExplorerNames } from "../../lib/explorers";
import { ExplorerAvatar } from "../dino/ExplorerAvatar";

type SetupScreenProps = {
  dispatch: Dispatch<GameAction>;
};

export function SetupScreen({ dispatch }: SetupScreenProps) {
  return (
    <section className="setup-screen">
      <div className="setup-hero">
        <img
          src="/assets/dino-world-hero.png"
          alt="Kid explorers welcome you to Dino World Park"
          className="setup-hero-img"
        />
        <div className="setup-hero-copy">
          <h2>Welcome to the Park!</h2>
          <p>
            Pick your team of explorers, then roll around the board buying dino habitats,
            building nests, and collecting Dino Bucks.
          </p>
        </div>
      </div>

      <div className="panel setup-panel">
        <h2 className="panel-title">Choose your expedition</h2>
        <p className="setup-hint">Hot-seat mode — pass the tablet when your turn ends.</p>
        <div className="player-count-grid">
          {([2, 3, 4] as const).map((n) => (
            <button
              key={n}
              type="button"
              className="player-count-card"
              onClick={() =>
                dispatch({
                  type: "START",
                  playerCount: n,
                  names: defaultExplorerNames(n),
                })
              }
            >
              <span className="player-count-num">{n}</span>
              <span className="player-count-label">Explorers</span>
              <div className="player-count-avatars">
                {EXPLORER_ROSTER.slice(0, n).map((e) => (
                  <ExplorerAvatar key={e.id} explorer={e} size={36} />
                ))}
              </div>
              <span className="player-count-cta">Start adventure →</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
