/** Procedural kid-friendly SFX via Web Audio API (no external files). */

let audioCtx: AudioContext | null = null;

function ctx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === "suspended") {
    void audioCtx.resume();
  }
  return audioCtx;
}

/** Call once on first user gesture so sounds can play. */
export function unlockAudio(): void {
  const c = ctx();
  if (c.state === "suspended") {
    void c.resume();
  }
}

function tone(
  frequency: number,
  duration: number,
  type: OscillatorType = "sine",
  gain = 0.12,
  when = 0,
): void {
  const c = ctx();
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.value = frequency;
  g.gain.setValueAtTime(gain, c.currentTime + when);
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + when + duration);
  osc.connect(g);
  g.connect(c.destination);
  osc.start(c.currentTime + when);
  osc.stop(c.currentTime + when + duration + 0.05);
}

function noiseBurst(duration: number, gain = 0.08): void {
  const c = ctx();
  const bufferSize = c.sampleRate * duration;
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }
  const src = c.createBufferSource();
  src.buffer = buffer;
  const g = c.createGain();
  g.gain.value = gain;
  const filter = c.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 1200;
  src.connect(filter);
  filter.connect(g);
  g.connect(c.destination);
  src.start();
}

/** Dice rattling on felt. */
export function playDiceRoll(): void {
  unlockAudio();
  for (let i = 0; i < 8; i++) {
    noiseBurst(0.04, 0.06);
    tone(180 + Math.random() * 400, 0.03, "square", 0.04, i * 0.05);
  }
}

/** Coins / purchase / collect cash. */
export function playChaChing(): void {
  unlockAudio();
  tone(880, 0.08, "sine", 0.1, 0);
  tone(1320, 0.12, "sine", 0.09, 0.06);
  tone(1760, 0.15, "triangle", 0.07, 0.1);
}

/** Friendly T-Rex roar when visiting the king of the park. */
export function playTrexRoar(): void {
  unlockAudio();
  const c = ctx();
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(220, c.currentTime);
  osc.frequency.exponentialRampToValueAtTime(90, c.currentTime + 0.35);
  osc.frequency.exponentialRampToValueAtTime(140, c.currentTime + 0.55);
  g.gain.setValueAtTime(0.14, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.7);
  const filter = c.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 600;
  osc.connect(filter);
  filter.connect(g);
  g.connect(c.destination);
  osc.start();
  osc.stop(c.currentTime + 0.75);
  noiseBurst(0.2, 0.05);
}

/** Short win fanfare. */
export function playWinFanfare(): void {
  unlockAudio();
  [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.2, "triangle", 0.1, i * 0.12));
}
