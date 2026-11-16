// Synthesises every sound in the Reel: a 100 BPM score that follows the story (read from src/timeline.json)
// and a small SFX kit. No samples, no downloads: everything is maths, seeded, so rebuilds are identical.
// Usage: node scripts/gen-audio.mjs   → public/sfx/*.wav
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "public", "sfx");
fs.mkdirSync(OUT, { recursive: true });
const SR = 48000;
const TL = JSON.parse(fs.readFileSync(path.join(ROOT, "src", "timeline.json"), "utf8"));

/* ---------- utilities ---------- */
const rng = (seed) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const stereo = (sec) => [new Float32Array(Math.ceil(sec * SR)), new Float32Array(Math.ceil(sec * SR))];
const midi = (m) => 440 * Math.pow(2, (m - 69) / 12);

function writeWav(name, [L, R], peak = 0.89) {
  let m = 1e-9;
  for (let i = 0; i < L.length; i++) m = Math.max(m, Math.abs(L[i]), Math.abs(R[i]));
  const g = peak / m;
  const n = L.length;
  const buf = Buffer.alloc(44 + n * 4);
  buf.write("RIFF", 0); buf.writeUInt32LE(36 + n * 4, 4); buf.write("WAVE", 8);
  buf.write("fmt ", 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22);
  buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34);
  buf.write("data", 36); buf.writeUInt32LE(n * 4, 40);
  for (let i = 0; i < n; i++) {
    buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i] * g)) * 32767), 44 + i * 4);
    buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i] * g)) * 32767), 46 + i * 4);
  }
  fs.writeFileSync(path.join(OUT, name), buf);
}

// state-variable filter (Chamberlin), returns a per-sample processor
const svf = () => {
  let lo = 0, bp = 0;
  return (x, fc, q = 0.7) => {
    const f = 2 * Math.sin((Math.PI * Math.min(fc, SR / 6)) / SR);
    const hi = x - lo - bp / q;
    bp += f * hi;
    lo += f * bp;
    return { lo, bp, hi };
  };
};

// add a mono voice into a stereo buffer at time t with pan (-1..1)
const put = (bus, t, mono, pan = 0, gain = 1) => {
  const i0 = Math.round(t * SR);
  const gl = Math.cos(((pan + 1) * Math.PI) / 4) * gain, gr = Math.sin(((pan + 1) * Math.PI) / 4) * gain;
  for (let i = 0; i < mono.length; i++) {
    const j = i0 + i;
    if (j < 0 || j >= bus[0].length) continue;
    bus[0][j] += mono[i] * gl;
    bus[1][j] += mono[i] * gr;
  }
};

// Schroeder-style reverb (4 combs + 2 allpasses per side)
function reverb([L, R], mix = 0.25, size = 1) {
  const proc = (x, off) => {
    const combs = [1557, 1617, 1491, 1422].map((d) => ({ b: new Float32Array(Math.round((d + off) * size)), i: 0, f: 0 }));
    const aps = [556, 441].map((d) => ({ b: new Float32Array(d + off), i: 0 }));
    const y = new Float32Array(x.length);
    for (let n = 0; n < x.length; n++) {
      let s = 0;
      for (const c of combs) {
        const o = c.b[c.i];
        c.f = o * 0.8 + c.f * 0.2;
        c.b[c.i] = x[n] + c.f * 0.84;
        c.i = (c.i + 1) % c.b.length;
        s += o;
      }
      s *= 0.25;
      for (const a of aps) {
        const o = a.b[a.i];
        const v = s + o * 0.5;
        a.b[a.i] = v;
        a.i = (a.i + 1) % a.b.length;
        s = o - v * 0.5;
      }
      y[n] = x[n] * (1 - mix) + s * mix;
    }
    return y;
  };
  return [proc(L, 0), proc(R, 23)];
}

/* ---------- instruments (mono generators) ---------- */
const R0 = rng(7);
const noise = () => R0() * 2 - 1;

function kick(vel = 1) {
  const n = Math.round(0.45 * SR), o = new Float32Array(n);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    ph += (2 * Math.PI * (44 + 120 * Math.exp(-t * 32))) / SR;
    o[i] = Math.tanh(1.4 * Math.sin(ph) * Math.exp(-t * 6.5)) * vel + noise() * Math.exp(-t * 500) * 0.25 * vel;
  }
  return o;
}
function clap(vel = 1) {
  const n = Math.round(0.3 * SR), o = new Float32Array(n), f = svf();
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    let env = 0;
    for (const d of [0, 0.011, 0.022]) if (t >= d) env = Math.max(env, Math.exp(-(t - d) * 180));
    env = Math.max(env, t > 0.022 ? 0.35 * Math.exp(-(t - 0.022) * 16) : 0);
    o[i] = f(noise(), 1500, 1.1).bp * env * 1.6 * vel + Math.sin(2 * Math.PI * 185 * t) * Math.exp(-t * 35) * 0.25 * vel;
  }
  return o;
}
function hat(vel = 1, open = false) {
  const n = Math.round((open ? 0.32 : 0.07) * SR), o = new Float32Array(n), f = svf();
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    o[i] = f(noise(), 7600, 0.8).hi * Math.exp(-t * (open ? 11 : 75)) * 0.5 * vel;
  }
  return o;
}
function bass(freq, dur, vel = 1) {
  const n = Math.round((dur + 0.08) * SR), o = new Float32Array(n);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    ph += (2 * Math.PI * freq * (1 + 0.5 * Math.exp(-t * 60))) / SR;
    const env = Math.min(1, t / 0.006) * (t < dur ? Math.exp(-t * 1.6) : Math.exp(-dur * 1.6) * Math.exp(-(t - dur) * 60));
    o[i] = Math.tanh(1.8 * Math.sin(ph) + 0.25 * Math.sin(2 * ph)) * env * vel;
  }
  return o;
}
function pad(freqs, dur, vel = 1, bright = 1500) {
  const n = Math.round((dur + 0.9) * SR), o = new Float32Array(n), f = svf();
  const phs = freqs.flatMap((fr) => [fr * 0.996, fr, fr * 1.004]).map((fr) => ({ fr, p: R0() * 6.28 }));
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    let s = 0;
    for (const v of phs) {
      v.p += (2 * Math.PI * v.fr) / SR;
      for (let h = 1; h <= 5; h++) s += Math.sin(v.p * h) / h;
    }
    const env = Math.min(1, t / 0.45) * (t < dur ? 1 : Math.exp(-(t - dur) * 4.5));
    o[i] = f(s / phs.length, bright, 0.6).lo * env * vel;
  }
  return o;
}
function pluck(freq, vel = 1) {
  const n = Math.round(0.7 * SR), o = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SR, w = 2 * Math.PI * freq * t;
    o[i] = (Math.sin(w) + 0.35 * Math.sin(2 * w) * Math.exp(-t * 14) + 0.12 * Math.sin(3 * w) * Math.exp(-t * 22)) * Math.exp(-t * 7) * Math.min(1, t / 0.003) * vel;
  }
  return o;
}

/* ---------- the score ---------- */
const BEAT = 60 / TL.bpm, STEP = BEAT / 4, BAR = BEAT * 4;
const sc = Object.fromEntries(TL.scenes.map((s) => [s.id, s]));
const tok = (id, prefix, nth = 0) => {
  const s = sc[id];
  const hits = s.tokens.filter((t) => t.t.toLowerCase().replace(/[^a-z0-9.%]/g, "").startsWith(prefix.toLowerCase()));
  const h = hits[nth] ?? hits[0];
  return s.vo.at + (h ? h.s : 0);
};
const end = (id) => sc[id].start + sc[id].duration;
const TOTAL = TL.total;

// level per time: 0 pad only, 1 heartbeat, 2 groove, 3 groove+clap+arp, 4 full drop, -1 breakdown (pad + plucks)
const sections = [
  [0, "hook", 1],
  [sc.proof.start, "proof", 2],
  [sc.formats.start, "formats", 3],
  [sc.dubai.start, "dubai", 3],
  [sc.after.start, "after", 4],
  [sc.tests.start, "tests", -1],
  [tok("tests", "bat"), "tests2", 2],
  [sc.ipl.start, "ipl", 4],
  [sc.verdict.start, "verdict", 0],
  [tok("verdict", "no.") , "resolve", 3],
  [TOTAL - BAR * 0.75, "outro", 0],
];
const levelAt = (t) => {
  let l = 0;
  for (const [s, , lv] of sections) if (t >= s - 1e-6) l = lv;
  return l;
};
// silence the drums right before big reveals so the hit lands in a gap
const mutes = [
  [tok("answer", "won") + 0.25, tok("answer", "50.9")],
  [tok("verdict", "no.") - BEAT * 0.75, tok("verdict", "no.")],
  [sc.tests.start, tok("tests", "bat") - STEP],
];
const muted = (t) => mutes.some(([a, b]) => t >= a && t < b);

// D minor: Dm – Bb – F – C
const CHORDS = [
  { root: 38, notes: [50, 53, 57, 62] },
  { root: 34, notes: [46, 50, 53, 58] },
  { root: 41, notes: [53, 57, 60, 65] },
  { root: 36, notes: [48, 52, 55, 60] },
];
const drums = stereo(TOTAL + 2), keys = stereo(TOTAL + 2), low = stereo(TOTAL + 2);
const RH = rng(42);
const nBars = Math.ceil(TOTAL / BAR) + 1;
for (let b = 0; b < nBars; b++) {
  const ch = CHORDS[b % 4];
  const t0 = b * BAR;
  if (t0 >= TOTAL) break;
  // pad on every bar except the very end, brighter when the groove is up
  const lv0 = levelAt(t0 + 0.01);
  put(keys, t0, pad(ch.notes.map(midi), BAR, 0.16, lv0 >= 3 ? 2400 : 1300), 0, 1);
  for (let s = 0; s < 16; s++) {
    const t = t0 + s * STEP;
    if (t >= TOTAL - 0.05) break;
    const lv = levelAt(t), m = muted(t);
    if (!m) {
      if (lv === 1 && (s === 0 || s === 8)) put(drums, t, kick(0.8));
      if (lv >= 2) {
        if (s === 0 || s === 10 || (lv >= 4 && s === 7)) put(drums, t, kick(1));
        if (s % 2 === 0) put(drums, t, hat(s % 4 === 0 ? 0.55 : 0.35), 0.25);
        if (lv >= 4 && s % 2 === 1) put(drums, t, hat(0.22), -0.25);
        if (lv >= 4 && s === 14) put(drums, t, hat(0.4, true), 0.3);
        if ([0, 6, 10].includes(s)) put(low, t, bass(midi(ch.root), s === 10 ? STEP * 6 : STEP * 5, 0.75));
      }
      if (lv >= 3 && (s === 4 || s === 12)) put(drums, t, clap(0.85), 0.05);
      // hat roll into the next bar on every 4th bar
      if (lv >= 3 && b % 4 === 3 && s >= 12) put(drums, t + STEP / 2, hat(0.25), 0.2);
    }
    // arp / plucks
    if ((lv >= 3 && s % 2 === 0) || (lv === -1 && s % 4 === 0)) {
      const seq = [0, 2, 1, 3, 2, 1, 3, 2];
      const note = ch.notes[seq[(s / 2) % 8]] + 12;
      put(keys, t, pluck(midi(note), lv === -1 ? 0.22 : 0.13 + RH() * 0.04), (s % 4 === 0 ? -0.35 : 0.35));
    }
  }
}
// sub drone under the hook, and a long last chord
put(low, 0, bass(midi(38), sc.proof.start - 0.1, 0.35));
put(keys, TOTAL - BAR * 0.75, pad(CHORDS[0].notes.map(midi), BAR * 0.6, 0.2, 1800));

// riser into the "next World Cups" drop
{
  const len = BAR, t0 = sc.after.start - len, n = Math.round(len * SR), o = new Float32Array(n), f = svf();
  for (let i = 0; i < n; i++) {
    const u = i / n;
    o[i] = f(noise(), 300 + 6000 * u * u, 1.2).bp * u * u * 0.6;
  }
  put(drums, t0, o, 0, 1);
}

const wet = reverb(keys, 0.32, 1.1);
const mix = stereo(TOTAL + 2);
for (let i = 0; i < mix[0].length; i++) {
  for (const c of [0, 1]) mix[c][i] = Math.tanh((drums[c][i] * 0.9 + wet[c][i] * 0.75 + low[c][i] * 0.8) * 0.9);
}
writeWav("music.wav", mix, 0.85);

/* ---------- SFX kit ---------- */
const mono2 = (o) => [o, o];
const env = (t, a, d) => Math.min(1, t / a) * Math.exp(-t * d);

function whoosh(len, lo, hi, gain = 1) {
  const n = Math.round(len * SR), L = new Float32Array(n), R = new Float32Array(n), f1 = svf(), f2 = svf();
  for (let i = 0; i < n; i++) {
    const u = i / n, fc = lo + (hi - lo) * Math.sin(Math.PI * u);
    const e = Math.sin(Math.PI * Math.pow(u, 0.7)) ** 2;
    const x = noise();
    L[i] = f1(x, fc, 1.6).bp * e * gain * (1 - u * 0.6);
    R[i] = f2(x, fc * 1.05, 1.6).bp * e * gain * (0.4 + u * 0.6);
  }
  return [L, R];
}
writeWav("whoosh.wav", whoosh(0.5, 350, 2600));
writeWav("whip.wav", whoosh(0.24, 600, 4200));

function metal(f0, len, decay = 3) {
  const n = Math.round(len * SR), o = new Float32Array(n);
  const parts = [[1, 1, 1], [2.76, 0.5, 1.6], [5.4, 0.3, 2.4], [8.93, 0.18, 3.5]];
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    let s = 0;
    for (const [r, a, k] of parts) s += Math.sin(2 * Math.PI * f0 * r * t) * a * Math.exp(-t * decay * k);
    o[i] = s * Math.min(1, t / 0.001);
  }
  return o;
}
{
  // coin flick: thumb click + ring + spinning shimmer
  const len = 1.1, n = Math.round(len * SR), o = new Float32Array(n);
  const ring = metal(2380, len, 2.6);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    o[i] = ring[i] * 0.55 * (0.75 + 0.25 * Math.sin(2 * Math.PI * 19 * t)) + noise() * Math.exp(-t * 900) * 0.6;
  }
  writeWav("coin-flick.wav", mono2(o));
}
{
  // coin landing: three bounces settling into a rattle
  const len = 1.2, o = new Float32Array(Math.round(len * SR));
  [[0, 1], [0.16, 0.55], [0.27, 0.32], [0.34, 0.18], [0.39, 0.1]].forEach(([t, a]) => {
    const m = metal(2150 + t * 400, 0.8, 4.5);
    const i0 = Math.round(t * SR);
    for (let i = 0; i < m.length && i0 + i < o.length; i++) o[i0 + i] += m[i] * a + (i < 200 ? noise() * a * 0.4 * (1 - i / 200) : 0);
  });
  writeWav("coin-land.wav", mono2(o));
}
{
  // impact: sub drop + noise body + click
  const len = 1.6, n = Math.round(len * SR), o = new Float32Array(n), f = svf();
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    ph += (2 * Math.PI * (34 + 70 * Math.exp(-t * 9))) / SR;
    o[i] = Math.tanh(2 * Math.sin(ph) * Math.exp(-t * 2.6)) * 0.9 + f(noise(), 900, 0.7).lo * Math.exp(-t * 7) * 0.8 + noise() * Math.exp(-t * 300) * 0.3;
  }
  writeWav("impact.wav", mono2(o));
}
{
  const n = Math.round(0.03 * SR), o = new Float32Array(n), f = svf();
  for (let i = 0; i < n; i++) { const t = i / SR; o[i] = f(noise(), 3200, 2).bp * Math.exp(-t * 260) + Math.sin(2 * Math.PI * 1800 * t) * Math.exp(-t * 300) * 0.4; }
  writeWav("tick.wav", mono2(o));
}
{
  const n = Math.round(0.12 * SR), o = new Float32Array(n);
  let ph = 0;
  for (let i = 0; i < n; i++) { const t = i / SR; ph += (2 * Math.PI * (220 + 800 * Math.exp(-t * 55))) / SR; o[i] = Math.sin(ph) * env(t, 0.002, 30); }
  writeWav("pop.wav", mono2(o));
}
{
  // tally: ticks that speed up then settle (for counters)
  const len = 1.7, o = new Float32Array(Math.round(len * SR));
  let t = 0, k = 0;
  while (t < len - 0.05) {
    const u = t / len;
    const gap = 0.035 + 0.11 * Math.pow(u, 2.2);
    const n = Math.round(0.02 * SR), f = svf(), i0 = Math.round(t * SR);
    for (let i = 0; i < n && i0 + i < o.length; i++) o[i0 + i] += f(noise(), 2600 + (k % 2) * 700, 2.2).bp * Math.exp(-(i / SR) * 300) * (1 - u * 0.4);
    t += gap; k++;
  }
  writeWav("tally.wav", mono2(o));
}
{
  // tile flip: soft card snap
  const n = Math.round(0.09 * SR), o = new Float32Array(n), f = svf();
  for (let i = 0; i < n; i++) { const t = i / SR; o[i] = f(noise(), 1900, 1).bp * Math.exp(-t * 120) + Math.sin(2 * Math.PI * 240 * t) * Math.exp(-t * 60) * 0.4; }
  writeWav("tile.wav", mono2(o));
}
{
  // stamp: heavy thud + paper crack + short room
  const len = 0.9, n = Math.round(len * SR), o = new Float32Array(n), f = svf();
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    ph += (2 * Math.PI * (48 + 70 * Math.exp(-t * 25))) / SR;
    o[i] = Math.sin(ph) * Math.exp(-t * 9) + f(noise(), 2200, 0.9).bp * Math.exp(-t * 45) * 1.3;
  }
  writeWav("stamp.wav", reverb(mono2(o), 0.18, 0.6));
}
{
  // ding: bright two-tone bell for the "real edge"
  const len = 1.6, n = Math.round(len * SR), o = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    o[i] = (Math.sin(2 * Math.PI * 1318.5 * t) + 0.6 * Math.sin(2 * Math.PI * 1975.5 * t) * Math.exp(-t * 1.5) + 0.25 * Math.sin(2 * Math.PI * 3951 * t) * Math.exp(-t * 6)) * env(t, 0.002, 2.4);
  }
  writeWav("ding.wav", reverb(mono2(o), 0.3));
}
{
  // buzz: low wrong-answer buzzer
  const len = 0.42, n = Math.round(len * SR), o = new Float32Array(n), f = svf();
  for (let i = 0; i < n; i++) {
    const t = i / SR, sq = Math.sign(Math.sin(2 * Math.PI * 92 * t)) + 0.5 * Math.sign(Math.sin(2 * Math.PI * 138 * t));
    o[i] = f(sq, 900, 0.7).lo * Math.min(1, t / 0.01) * (t > len - 0.06 ? (len - t) / 0.06 : 1) * 0.7;
  }
  writeWav("buzz.wav", mono2(o));
}
{
  // crack: dry earth splitting (sparse sharp crackles)
  const len = 1.4, o = new Float32Array(Math.round(len * SR)), R = rng(99);
  for (let k = 0; k < 70; k++) {
    const t = Math.pow(R(), 0.8) * (len - 0.1), a = 0.25 + R() * 0.75, i0 = Math.round(t * SR), f = svf(), fc = 900 + R() * 3500;
    for (let i = 0; i < 0.025 * SR && i0 + i < o.length; i++) o[i0 + i] += f(noise(), fc, 1.5).bp * Math.exp(-(i / SR) * 220) * a;
  }
  writeWav("crack.wav", reverb(mono2(o), 0.12, 0.5));
}
{
  // reverse swell into the verdict
  const len = 1.3, n = Math.round(len * SR), o = new Float32Array(n), f = svf();
  for (let i = 0; i < n; i++) { const u = i / n; o[i] = f(noise(), 2500 + 5000 * u, 0.7).hi * Math.pow(u, 3) * (u > 0.97 ? (1 - u) / 0.03 : 1); }
  writeWav("swell.wav", mono2(o));
}
console.log("music + sfx written to", OUT);
