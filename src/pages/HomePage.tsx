import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { getGameTitle } from "../lib/gameConfig";
import { EXPLORER_ROSTER } from "../lib/explorers";
import { ExplorerAvatar } from "../components/dino/ExplorerAvatar";

export default function HomePage() {
  return (
    <div className="home-app">
      <header className="home-hero">
        <img
          src="/assets/dino-world-hero.png"
          alt="Kid explorers at the gates of Dino World Park"
          className="home-hero-img"
        />
        <div className="home-hero-overlay">
          <img
            src="/assets/dino-world-park-logo.png"
            alt=""
            className="home-logo"
          />
          <h1>{getGameTitle()}</h1>
          <p className="home-tagline">
            A prehistoric park adventure for ages 7–10. Buy habitats, hatch nests,
            and become the top park ranger!
          </p>
          <div className="btn-row home-cta">
            <Link className="btn-primary btn-lg" to="/play">
              🎲 Start playing
            </Link>
            <Link className="btn-secondary btn-lg" to="/rules">
              📖 How to play
            </Link>
          </div>
        </div>
      </header>

      <section className="home-features panel">
        <h2>Meet your explorers</h2>
        <div className="home-explorers">
          {EXPLORER_ROSTER.map((e) => (
            <article key={e.id} className="home-explorer-card" style={{ "--explorer-accent": e.accent } as CSSProperties}>
              <ExplorerAvatar explorer={e} size={64} />
              <h3>{e.name}</h3>
              <p>{e.title}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-features panel">
        <h2>What you&apos;ll do</h2>
        <ul className="home-steps">
          <li>
            <span className="step-icon">🎲</span>
            <strong>Roll &amp; explore</strong> — tour a 20-space park board
          </li>
          <li>
            <span className="step-icon">🦕</span>
            <strong>Buy habitats</strong> — from $1 Swamp ponds to $5 T-Rex Valley
          </li>
          <li>
            <span className="step-icon">🥚</span>
            <strong>Build nests &amp; exhibits</strong> — grow your dino empire
          </li>
          <li>
            <span className="step-icon">🏆</span>
            <strong>Win the park</strong> — last explorer standing takes the prize
          </li>
        </ul>
      </section>
    </div>
  );
}
