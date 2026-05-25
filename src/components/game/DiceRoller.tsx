import { useEffect, useState } from "react";

type DiceRollerProps = {
  values: [number, number] | null;
  rolling: boolean;
};

/** CSS 3D die — face values 1–6. */
function DieCube({ value, rolling, spinOffset = 0 }: { value?: number; rolling: boolean; spinOffset?: number }) {
  const [spin, setSpin] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!rolling) return;
    const id = window.setInterval(() => {
      setSpin({
        x: Math.random() * 720,
        y: Math.random() * 720,
      });
    }, 70);
    return () => window.clearInterval(id);
  }, [rolling]);

  const settled = value ? FACE_ROTATIONS[value] : { x: 0, y: 0 };
  const transform = rolling
    ? `rotateX(${spin.x + spinOffset}deg) rotateY(${spin.y}deg)`
    : `rotateX(${settled.x}deg) rotateY(${settled.y}deg)`;

  return (
    <div className={`die-cube-scene ${rolling ? "die-cube-scene--rolling" : "die-cube-scene--settled"}`}>
      <div className="die-cube" style={{ transform }}>
        <div className="die-face die-face--1">
          <span className="pip" />
        </div>
        <div className="die-face die-face--2">
          <span className="pip" />
          <span className="pip" />
        </div>
        <div className="die-face die-face--3">
          <span className="pip" />
          <span className="pip" />
          <span className="pip" />
        </div>
        <div className="die-face die-face--4">
          <span className="pip" />
          <span className="pip" />
          <span className="pip" />
          <span className="pip" />
        </div>
        <div className="die-face die-face--5">
          <span className="pip" />
          <span className="pip" />
          <span className="pip" />
          <span className="pip" />
          <span className="pip" />
        </div>
        <div className="die-face die-face--6">
          <span className="pip" />
          <span className="pip" />
          <span className="pip" />
          <span className="pip" />
          <span className="pip" />
          <span className="pip" />
        </div>
      </div>
    </div>
  );
}

/** Standard die orientations (rotateX, rotateY) to show face toward camera. */
const FACE_ROTATIONS: Record<number, { x: number; y: number }> = {
  1: { x: 0, y: 0 },
  2: { x: 0, y: -90 },
  3: { x: -90, y: 0 },
  4: { x: 90, y: 0 },
  5: { x: 0, y: 90 },
  6: { x: 180, y: 0 },
};

export function DiceRoller({ values, rolling }: DiceRollerProps) {
  const total = values ? values[0] + values[1] : null;

  return (
    <div className="dice-roller" aria-live="polite" aria-label={rolling ? "Rolling dice" : total ? `Rolled ${total}` : "Dice"}>
      <DieCube value={values?.[0]} rolling={rolling} spinOffset={0} />
      <span className="dice-roller-plus" aria-hidden="true">
        +
      </span>
      <DieCube value={values?.[1]} rolling={rolling} spinOffset={45} />
      {total !== null && !rolling && (
        <div className="dice-roller-total">
          <span className="dice-roller-eq">=</span>
          <span className="dice-roller-sum">{total}</span>
          <span className="dice-roller-label">spaces</span>
        </div>
      )}
      {rolling && <p className="dice-roller-status">Rolling…</p>}
    </div>
  );
}
