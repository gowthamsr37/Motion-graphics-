// Synthesizes the music bed and SFX kit as 16-bit mono WAVs.
// No downloads, fully deterministic (seeded noise).
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SR = 44100;
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "audio");
mkdirSync(OUT, { recursive: true });

// Section lengths come from src/timeline.json (written by scripts/gen-voice.py).
const TIMELINE = JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), "..", "src", "timeline.json"), "utf8"));
const BPM = TIMELINE.bpm;
const bars = (key) => TIMELINE.sections[key].beats / 4;
const BARS = { intro: bars("hook"), seasons: bars("seasons"), tally: bars("tally"), outro: bars("outro") };
const BEAT = 60 / BPM;
const BAR = BEAT * 4;
const SEASONS_AT = BARS.intro;
const TALLY_AT = SEASONS_AT + BARS.seasons;
const OUTRO_AT = TALLY_AT + BARS.tally;
const TOTAL_BARS = OUTRO_AT + BARS.outro;
const DUR = TOTAL_BARS * BAR;

// ---------- utils ----------
let seed = 1337;
const rand = () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const noise = () => rand() * 2 - 1;
const S = (sec) => Math.round(sec * SR);
const TAU = 2 * Math.PI;

function wav(samples) {
  const n = samples.length;
  const buf = Buffer.alloc(44 + n * 2);
  buf.write("RIFF", 0);
  buf.writeUInt32LE(36 + n * 2, 4);
  buf.write("WAVE", 8);
  buf.write("fmt ", 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write("data", 36);
  buf.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    buf.writeInt16LE(Math.round(s * 32767), 44 + i * 2);
  }
  return buf;
}

// Render fn(t) into buf starting at startSec for durSec (fn may keep state; called in order).
function add(buf, startSec, durSec, fn) {
  const s0 = S(startSec);
  const n = S(durSec);
  for (let i = 0; i < n; i++) {
    const idx = s0 + i;
    if (idx >= buf.length) break;
    const v = fn(i / SR);
    if (idx >= 0) buf[idx] += v;
  }
}

// Band-limited saw (no aliasing).
const bsaw = (ph, nh) => {
  let v = 0;
  for (let k = 1; k <= nh; k++) v += Math.sin(k * ph) / k;
  return v * 0.6;
};

function normalize(buf, peak) {
  let m = 0;
  for (const v of buf) m = Math.max(m, Math.abs(v));
  if (m > 0) for (let i = 0; i < buf.length; i++) buf[i] *= peak / m;
  return buf;
}

// ---------- instruments ----------
function kick(buf, t0, amp = 1) {
  let ph = 0;
  add(buf, t0, 0.45, (t) => {
    const f = 46 + 110 * Math.exp(-t * 30);
    ph += (TAU * f) / SR;
    const click = t < 0.004 ? noise() * 0.35 * (1 - t / 0.004) : 0;
    return amp * (Math.sin(ph) * Math.exp(-t * 7) + click);
  });
}

function clap(buf, t0, amp = 1) {
  let lp = 0;
  let hp = 0;
  add(buf, t0, 0.3, (t) => {
    let env = 0;
    for (const b of [0, 0.011, 0.022]) if (t >= b) env = Math.max(env, Math.exp(-(t - b) * 180));
    if (t >= 0.022) env = Math.max(env, 0.55 * Math.exp(-(t - 0.022) * 16));
    lp += 0.35 * (noise() - lp);
    hp += 0.06 * (lp - hp);
    return amp * (lp - hp) * env * 1.8;
  });
}

function hat(buf, t0, amp, decay) {
  let lp = 0;
  add(buf, t0, decay * 6, (t) => {
    const x = noise();
    lp += 0.5 * (x - lp);
    return amp * (x - lp) * Math.exp(-t / decay);
  });
}

function bassNote(buf, t0, f, dur, amp) {
  let ph = 0;
  let lp = 0;
  add(buf, t0, dur, (t) => {
    ph += (TAU * f) / SR;
    const cutoff = 0.06 + 0.22 * Math.exp(-t * 16);
    lp += cutoff * (bsaw(ph, 8) - lp);
    const env = Math.min(1, t / 0.004) * Math.exp(-t * 4) * Math.min(1, (dur - t) / 0.02);
    return amp * lp * env;
  });
}

function pluck(buf, t0, f, amp) {
  let ph = 0;
  add(buf, t0, 0.6, (t) => {
    ph += (TAU * f) / SR;
    const env = Math.min(1, t / 0.003) * Math.exp(-t * 7);
    return amp * (Math.sin(ph) + 0.35 * Math.sin(2 * ph) + 0.12 * Math.sin(3 * ph)) * env;
  });
}

function padChord(buf, t0, dur, freqs, amp, attack = 0.06, release = 0.1) {
  for (const f of freqs) {
    for (const d of [0.996, 1.004]) {
      let ph = rand() * TAU;
      add(buf, t0, dur, (t) => {
        ph += (TAU * f * d) / SR;
        const env = Math.min(1, t / attack) * Math.min(1, Math.max(0, (dur - t) / release));
        return amp * bsaw(ph, 5) * env;
      });
    }
  }
}

function riser(buf, t0, dur, amp) {
  let lp = 0;
  add(buf, t0, dur, (t) => {
    const p = t / dur;
    lp += (0.02 + 0.5 * p * p) * (noise() - lp);
    return amp * lp * p * p;
  });
}

// ---------- score ----------
const CH = {
  Am: { bass: 55.0, pad: [220.0, 261.63, 329.63], arp: [440.0, 523.25, 659.25, 880.0] },
  F: { bass: 43.65, pad: [174.61, 220.0, 261.63], arp: [349.23, 440.0, 523.25, 698.46] },
  C: { bass: 65.41, pad: [196.0, 261.63, 329.63], arp: [392.0, 523.25, 659.25, 783.99] },
  G: { bass: 49.0, pad: [196.0, 246.94, 293.66], arp: [392.0, 493.88, 587.33, 783.99] },
};
const PROG = ["Am", "F", "C", "G"];
const chordAt = (b) => {
  if (b === 0) return CH.F;
  if (b === 1) return CH.G;
  if (b === TALLY_AT - 1) return CH.G; // lead into the tally downbeat
  if (b < TALLY_AT) return CH[PROG[(b - SEASONS_AT) % 4]];
  if (b < OUTRO_AT) return CH[PROG[(b - TALLY_AT) % 4]];
  return b === OUTRO_AT ? CH.Am : CH.F;
};
const grooveBar = (b) => b >= SEASONS_AT && b < OUTRO_AT;

const N = S(DUR);
const drums = new Float32Array(N);
const tonal = new Float32Array(N); // gets sidechained to the kick
const fx = new Float32Array(N);
const kicks = [];

for (let b = 0; b < TOTAL_BARS; b++) {
  const t0 = b * BAR;
  const ch = chordAt(b);
  const last = b === TOTAL_BARS - 1;
  padChord(tonal, t0, BAR + (last ? 0 : 0.05), ch.pad, b === 0 ? 0.05 : 0.07, b === 0 ? 0.6 : 0.06, last ? BAR * 0.9 : 0.1);

  if (grooveBar(b)) {
    for (let k = 0; k < 4; k++) {
      const tb = t0 + k * BEAT;
      kick(drums, tb, 0.95);
      kicks.push(tb);
      if (k % 2 === 1) clap(drums, tb, 0.42);
      hat(drums, tb + BEAT / 2, 0.22, 0.05);
      hat(drums, tb + BEAT / 4, 0.07, 0.02);
      hat(drums, tb + (3 * BEAT) / 4, 0.07, 0.02);
      bassNote(tonal, tb + BEAT / 2, ch.bass * 2, BEAT * 0.42, 0.55);
    }
    const pattern = [0, 1, 2, 3, 2, 1, 2, 3];
    pattern.forEach((n, e) => pluck(tonal, t0 + (e * BEAT) / 2, ch.arp[n], b >= TALLY_AT ? 0.075 : 0.06));
  }
}

// Intro build (bar 1): clap roll 8ths → 16ths + riser.
for (let i = 0; i < 12; i++) {
  const t = BAR + (i < 4 ? (i * BEAT) / 2 : 2 * BEAT + ((i - 4) * BEAT) / 4);
  clap(drums, t, 0.15 + (0.35 * i) / 11);
}
riser(fx, BAR, BAR, 0.35);
kick(drums, BAR, 0.6);

// Build into the tally (last season bar): riser + 16th roll on the last beat.
riser(fx, (TALLY_AT - 0.5) * BAR, BAR / 2, 0.35);
for (let i = 0; i < 4; i++) clap(drums, (TALLY_AT - 0.25) * BAR + (i * BEAT) / 4, 0.25 + i * 0.08);

// Outro: low A drone under the last two bars.
{
  let ph = 0;
  const len = BARS.outro * BAR;
  add(tonal, OUTRO_AT * BAR, len, (t) => {
    ph += (TAU * 55) / SR;
    return 0.25 * Math.sin(ph) * Math.min(1, t / 0.05) * Math.max(0, 1 - t / len);
  });
}

// Sidechain: duck the tonal layer on every kick.
const duck = new Float32Array(N).fill(1);
for (const tk of kicks) {
  const s0 = S(tk);
  const n = S(BEAT);
  for (let i = 0; i < n && s0 + i < N; i++) duck[s0 + i] = Math.min(duck[s0 + i], 1 - 0.55 * Math.exp(-(i / SR) * 9));
}

// Gentle lowpass on the tonal layer to keep it warm.
{
  let lp = 0;
  for (let i = 0; i < N; i++) {
    lp += 0.28 * (tonal[i] - lp);
    tonal[i] = lp;
  }
}

const mix = new Float32Array(N);
for (let i = 0; i < N; i++) mix[i] = drums[i] * 0.8 + tonal[i] * duck[i] + fx[i];
for (let i = 0; i < N; i++) mix[i] = Math.tanh(mix[i] * 1.1);
// Fade the last 0.4s to match the visual fade to black.
for (let i = Math.max(0, N - S(0.4)); i < N; i++) mix[i] *= (N - i) / S(0.4);
writeFileSync(join(OUT, "track.wav"), wav(normalize(mix, 0.89)));

// ---------- SFX ----------
{
  // whoosh — swept noise
  const out = new Float32Array(S(0.42));
  let lp = 0;
  for (let i = 0; i < out.length; i++) {
    const t = i / out.length;
    const env = Math.sin(Math.PI * Math.pow(t, 0.6)) ** 2;
    lp += (0.04 + 0.3 * Math.sin(Math.PI * t)) * (noise() - lp);
    out[i] = lp * env;
  }
  writeFileSync(join(OUT, "whoosh.wav"), wav(normalize(out, 0.9)));
}
{
  // impact — sub drop + noise crack
  const out = new Float32Array(S(1.6));
  let ph = 0;
  let lp = 0;
  for (let i = 0; i < out.length; i++) {
    const t = i / SR;
    ph += (TAU * (32 + 40 * Math.exp(-t * 6))) / SR;
    lp += 0.2 * (noise() - lp);
    out[i] = Math.sin(ph) * Math.exp(-t * 2.4) + lp * Math.exp(-t * 14) * 0.9 + (t < 0.005 ? noise() * 0.6 : 0);
  }
  writeFileSync(join(OUT, "impact.wav"), wav(normalize(out, 0.95)));
}
{
  // clack — a tin number plate dropped onto its hook: woody thock + bright rattle
  const out = new Float32Array(S(0.18));
  let ph = 0;
  let lp = 0;
  for (let i = 0; i < out.length; i++) {
    const t = i / SR;
    ph += (TAU * (210 - 90 * t)) / SR;
    lp += 0.45 * (noise() - lp);
    const rattle = t > 0.035 && t < 0.05 ? 0.5 : 0;
    out[i] = Math.sin(ph) * Math.exp(-t * 38) * 0.9 + lp * (Math.exp(-t * 60) + rattle * Math.exp(-(t - 0.035) * 90)) * 0.7;
  }
  writeFileSync(join(OUT, "clack.wav"), wav(normalize(out, 0.9)));
}
{
  // tick — tiny bright blip
  const out = new Float32Array(S(0.06));
  let ph = 0;
  for (let i = 0; i < out.length; i++) {
    const t = i / SR;
    ph += (TAU * 2100) / SR;
    out[i] = (Math.sin(ph) * 0.8 + noise() * 0.15) * Math.exp(-t * 70);
  }
  writeFileSync(join(OUT, "tick.wav"), wav(normalize(out, 0.8)));
}
{
  // shimmer — staggered high bell partials
  const out = new Float32Array(S(2));
  [1760, 2093, 2637, 3520].forEach((f, k) => {
    let ph = 0;
    const start = S(0.03 * k);
    for (let i = start; i < out.length; i++) {
      const t = (i - start) / SR;
      ph += (TAU * f * (1 + 0.002 * Math.sin(TAU * 5 * t))) / SR;
      out[i] += Math.sin(ph) * Math.min(1, t / 0.01) * Math.exp(-t * 2.4) * (1 - k * 0.15);
    }
  });
  writeFileSync(join(OUT, "shimmer.wav"), wav(normalize(out, 0.8)));
}

console.log(`audio written to ${OUT} (track ${DUR.toFixed(2)}s, ${TOTAL_BARS} bars @ ${BPM} BPM)`);
