/**
 * Monte Carlo / batch balance stub.
 *
 * Extend per game: import rules from src/game/, run N iterations,
 * print distribution of scores, lengths, and win rates.
 */

const ITERATIONS = 10_000;

type SimResult = {
  iterations: number;
  avgTurns: number;
  p95Turns: number;
};

function runStubSimulation(): SimResult {
  const turns: number[] = [];
  for (let i = 0; i < ITERATIONS; i++) {
    // Placeholder: random walk until "win" — replace with real reducer sim.
    let t = 0;
    while (t < 200 && Math.random() > 0.02) {
      t++;
    }
    turns.push(t);
  }
  turns.sort((a, b) => a - b);
  const sum = turns.reduce((a, b) => a + b, 0);
  const p95 = turns[Math.floor(turns.length * 0.95)] ?? 0;
  return {
    iterations: ITERATIONS,
    avgTurns: sum / turns.length,
    p95Turns: p95,
  };
}

const result = runStubSimulation();
console.log("Balance simulation (stub)");
console.log(JSON.stringify(result, null, 2));
console.log(
  "\nWire this script to src/game/reducer.ts once mechanics are defined.",
);
