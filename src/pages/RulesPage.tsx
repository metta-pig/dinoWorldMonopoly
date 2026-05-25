import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function RulesPage() {
  const [text, setText] = useState<string>("Loading RULES.md…");

  useEffect(() => {
    fetch("/RULES.md")
      .then((r) => (r.ok ? r.text() : Promise.reject()))
      .then(setText)
      .catch(() =>
        setText(
          "RULES.md not found in public/. Copy or symlink RULES.md to public/RULES.md for in-app viewing, or read the file in the repo root.",
        ),
      );
  }, []);

  return (
    <main className="shell rules-page">
      <header className="rules-page-header">
        <h1>How to play</h1>
        <p className="meta">Dino World Monopoly — rules for explorers and park rangers</p>
      </header>
      <div className="panel rules-body">{text}</div>
      <div className="btn-row rules-page-actions">
        <Link className="btn-primary" to="/play">
          🎲 Start playing
        </Link>
        <Link className="btn-secondary" to="/">
          ← Park entrance
        </Link>
      </div>
    </main>
  );
}
