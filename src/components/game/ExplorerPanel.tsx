import type { CSSProperties } from "react";
import type { GameState } from "../../game/types";
import { explorerForPlayer } from "../../lib/explorers";
import { DinoPlayPiece } from "../dino/DinoPlayPiece";

type ExplorerPanelProps = {
  state: GameState;
};

export function ExplorerPanel({ state }: ExplorerPanelProps) {
  return (
    <section className="panel explorer-panel">
      <h2 className="panel-title">
        <span className="panel-icon" aria-hidden="true">
          🧭
        </span>
        Park Explorers
      </h2>
      <ul className="explorer-cards">
        {state.players.map((id, idx) => {
          const p = state.playerStates[id];
          if (!p) return null;
          const explorer = explorerForPlayer(id, idx);
          const isActive = id === state.activePlayer;
          return (
            <li
              key={id}
              className={`explorer-card ${isActive ? "is-active" : ""} ${p.bankrupt ? "is-out" : ""}`}
              style={{ "--explorer-accent": explorer.accent } as CSSProperties}
            >
              <DinoPlayPiece
                kind={explorer.dinoToken}
                accent={explorer.accent}
                name={p.name}
                size={48}
                isActive={isActive && !p.bankrupt}
              />
              <div className="explorer-info">
                <strong className="explorer-name">{p.name}</strong>
                <span className="explorer-title">{explorer.title}</span>
                <span className="explorer-cash">
                  <span className="cash-label">Dino Bucks</span>
                  <span className="cash-amount">${p.cash}</span>
                </span>
                {p.inTarPit && <span className="status-chip tar-pit">Stuck in Tar Pit!</span>}
                {p.bankrupt && <span className="status-chip out">Out of the park</span>}
                {isActive && !p.bankrupt && (
                  <span className="status-chip turn">Your turn!</span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
