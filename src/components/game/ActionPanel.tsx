import type { Dispatch } from "react";
import { TAR_PIT_EXIT_FEE, getHabitat, getSpace } from "../../game/board";
import { getCard } from "../../game/cards";
import {
  buildableProperties,
  canBuildExhibit,
  canBuildNest,
} from "../../game/reducer";
import type { GameAction, GameState } from "../../game/types";
import { getPropertyLabel } from "../../game/board";
import { habitatArtUrl } from "../../lib/habitatArt";
import { DinoIcon, SpaceIcon } from "../dino/DinoArt";

type ActionPanelProps = {
  state: GameState;
  dispatch: Dispatch<GameAction>;
  rolling?: boolean;
};

export function ActionPanel({ state, dispatch, rolling = false }: ActionPanelProps) {
  const buildable = buildableProperties(state, state.activePlayer);
  const pendingCard = state.pendingCard
    ? getCard(state.pendingCard.deck, state.pendingCard.cardId)
    : null;

  const buyPos = state.playerStates[state.activePlayer]?.position ?? 0;
  const buySpace = getSpace(buyPos);
  const buyHabitat = buySpace.propertyKey ? getHabitat(buySpace.propertyKey) : undefined;
  const buyArt = buyHabitat ? habitatArtUrl(buyHabitat.id) : null;

  return (
    <section className="panel action-panel park-hq">
      <h2 className="panel-title">
        <span className="panel-icon" aria-hidden="true">
          🏕️
        </span>
        Ranger HQ
      </h2>

      <p className="status-message">{state.message}</p>

      {pendingCard && (
        <div
          className={`card-draw card-draw--${state.pendingCard?.deck === "fossil" ? "fossil" : "park"}`}
        >
          <div className="card-draw-art">
            <SpaceIcon
              kind={state.pendingCard?.deck === "fossil" ? "fossil_find" : "park_event"}
              size={40}
            />
          </div>
          <p className="card-draw-text">{pendingCard.text}</p>
        </div>
      )}

      {state.phase === "finished" ? (
        <div className="winner-banner">
          <span className="winner-trophy" aria-hidden="true">
            🏆
          </span>
          <p>{state.message}</p>
        </div>
      ) : (
        <div className="action-buttons">
          {state.turnPhase === "roll" && (
            <button
              type="button"
              className="btn-primary btn-roll"
              disabled={rolling}
              onClick={() => dispatch({ type: "ROLL_DICE" })}
            >
              <span className="btn-icon">🎲</span>
              {rolling ? "Rolling…" : "Roll the dice!"}
            </button>
          )}
          {state.turnPhase === "buy_prompt" && buyHabitat && (
            <div className="habitat-buy-preview">
              {buyArt ? (
                <img src={buyArt} alt={buyHabitat.name} />
              ) : (
                <DinoIcon habitatId={buyHabitat.id} size={48} />
              )}
              <div>
                <strong>{buyHabitat.name}</strong>
                <span>
                  ${buyHabitat.price} · {buySpace.label}
                </span>
              </div>
            </div>
          )}

          {state.turnPhase === "buy_prompt" && (
            <>
              <button type="button" className="btn-primary" onClick={() => dispatch({ type: "BUY_PROPERTY" })}>
                <span className="btn-icon">🛒</span>
                Buy this habitat
              </button>
              <button type="button" className="btn-secondary" onClick={() => dispatch({ type: "PASS_BUY" })}>
                Pass for now
              </button>
            </>
          )}
          {state.turnPhase === "pay_prompt" && (
            <button type="button" className="btn-primary btn-pay" onClick={() => dispatch({ type: "PAY_PENDING" })}>
              <span className="btn-icon">💵</span>
              Pay ${state.pendingPayment?.amount ?? 0}
            </button>
          )}
          {state.turnPhase === "card_prompt" && (
            <button type="button" className="btn-primary" onClick={() => dispatch({ type: "RESOLVE_CARD" })}>
              <span className="btn-icon">📜</span>
              Do what the card says
            </button>
          )}
          {state.turnPhase === "tar_pit_choice" && (
            <>
              <button type="button" className="btn-primary" onClick={() => dispatch({ type: "TAR_PIT_PAY" })}>
                Pay ${TAR_PIT_EXIT_FEE} to escape
              </button>
              <button
                type="button"
                className="btn-secondary"
                disabled={rolling}
                onClick={() => dispatch({ type: "TAR_PIT_ROLL" })}
              >
                Roll for doubles
              </button>
              {(state.playerStates[state.activePlayer]?.getOutOfTarPitCards ?? 0) > 0 && (
                <button type="button" className="btn-secondary" onClick={() => dispatch({ type: "USE_GET_OUT_CARD" })}>
                  Use Get Out card
                </button>
              )}
            </>
          )}
          {state.turnPhase === "build" && (
            <>
              {buildable.map((key) => (
                <span key={key} className="build-group">
                  {canBuildNest(state, state.activePlayer, key) && (
                    <button
                      type="button"
                      className="btn-build"
                      onClick={() => dispatch({ type: "BUILD_NEST", propertyKey: key })}
                    >
                      🥚 Nest — {getPropertyLabel(key)}
                    </button>
                  )}
                  {canBuildExhibit(state, state.activePlayer, key) && (
                    <button
                      type="button"
                      className="btn-build btn-build-exhibit"
                      onClick={() => dispatch({ type: "BUILD_EXHIBIT", propertyKey: key })}
                    >
                      🏛️ Exhibit — {getPropertyLabel(key)}
                    </button>
                  )}
                </span>
              ))}
              <button type="button" className="btn-secondary" onClick={() => dispatch({ type: "END_BUILD" })}>
                End turn
              </button>
            </>
          )}
          <button
            type="button"
            className="btn-ghost"
            onClick={() => dispatch({ type: "DECLARE_NET_WORTH_WINNER" })}
          >
            ⏱ Time&apos;s up — count scores
          </button>
        </div>
      )}
    </section>
  );
}
