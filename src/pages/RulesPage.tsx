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
    <main className="shell">
      <h1>Rules</h1>
      <div className="panel rules-body">{text}</div>
      <Link className="btn secondary" to="/">
        Home
      </Link>
    </main>
  );
}
