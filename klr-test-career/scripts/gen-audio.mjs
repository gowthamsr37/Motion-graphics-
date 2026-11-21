// Original score + crowd + scoreboard SFX, synthesized from scratch (no samples, deterministic).
// Reads src/timeline.json so every musical hit lands on the same frames the visuals use.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "audio");
mkdirSync(OUT, { recursive: true });
const TL = JSON.parse(readFileSync(join(ROOT, "src", "timeline.json"), "utf8"));
const SR = 48000;
const FPS = 30;
const TAU = Math.PI * 2;
const DUR = TL.total;
const N = Math.ceil(DUR * SR);

// ---------- timeline helpers (mirror src/timing.ts) ----------
const sc = (id) => TL.scenes.find((s) => s.id === id);
const fromF = (id) => Math.round(sc(id).start * FPS);
const durF = (id) => Math.round((sc(id).start + sc(id).duration) * FPS) - fromF(id);
const voF = (id) => Math.round((sc(id).vo.at - sc(id).start) * FPS);
const norm = (w) => w.toLowerCase().replace(/[^a-z0-9]/g, "");
const word = (id, prefix, fb) => {
  const w = sc(id).vo.words.find((x) => norm(x.w).startsWith(norm(prefix)));
  return (fromF(id) + voF(id) + Math.round((w ? w.s : fb) * FPS)) / FPS;
};
const sent = (id, i) => (fromF(id) + voF(id) + Math.round(sc(id).vo.segments[i].s * FPS)) / FPS;
const sentEnd = (id, i) => (fromF(id) + voF(id) + Math.round(sc(id).vo.segments[i].e * FPS)) / FPS;
const S = (id) => fromF(id) / FPS;
const E = (id) => (fromF(id) + durF(id)) / FPS;
const f = (n) => n / FPS;
// ---------- story events (mirror src/scenes/Story.tsx beats) ----------
const ev = {
  runs1: word("s1", "136", 2.78),
  sena: sent("s1", 2),
  countries: word("s1", "countries", 15.48),
  gold: sent("s2", 2),
  crash2: word("s2", "crash", 13.78),
  again: word("s2", "again", 14.64),
  seven: sent("s3", 2),
  n199: word("s3", "199", 13.04),
  cliff: sent("s4", 0),
  dropped: word("s4", "dropped", 13.14),
  lords: word("s5", "lord", 2.36),
  middle: sent("s5", 2),
  since: sent("s6", 1),
  n55: word("s6", "55", 7.42),
  yet: sent("s7", 2),
  runs8: sent("s8", 0),
  brand: sent("s8", 2) - f(8),
};

// ---------- dsp utils ----------
let seed = 4242;
const rand = () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const noise = () => rand() * 2 - 1;
const smp = (t) => Math.round(t * SR);

function wavStereo(L, R) {
  const n = L.length;
  const buf = Buffer.alloc(44 + n * 4);
  buf.write("RIFF", 0); buf.writeUInt32LE(36 + n * 4, 4); buf.write("WAVE", 8); buf.write("fmt ", 12);
  buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write("data", 36); buf.writeUInt32LE(n * 4, 40);
  for (let i = 0; i < n; i++) {
    buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i])) * 32767), 44 + i * 4);
    buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i])) * 32767), 46 + i * 4);
  }
  return buf;
}
const wavMono = (M) => wavStereo(M, M);
const normalize = (bufs, peak) => {
  let m = 0;
  for (const b of bufs) for (const v of b) m = Math.max(m, Math.abs(v));
  if (m > 0) for (const b of bufs) for (let i = 0; i < b.length; i++) b[i] *= peak / m;
};

// Render fn(t) into stereo at t0 with equal-power pan (-1..1).
function add(L, R, t0, dur, pan, fn) {
  const s0 = smp(t0), n = smp(dur);
  const gl = Math.cos(((pan + 1) * Math.PI) / 4), gr = Math.sin(((pan + 1) * Math.PI) / 4);
  for (let i = 0; i < n; i++) {
    const k = s0 + i;
    if (k >= L.length) break;
    const v = fn(i / SR);
    if (k >= 0) { L[k] += v * gl; R[k] += v * gr; }
  }
}

// Band-limited saw wavetable (fast, no aliasing below ~20 kHz for our ranges).
const TBL = 4096;
const SAW = new Float32Array(TBL);
for (let i = 0; i < TBL; i++) { let v = 0; for (let k = 1; k <= 14; k++) v += Math.sin((TAU * k * i) / TBL) / k; SAW[i] = v * 0.55; }
const saw = (ph) => SAW[Math.floor((ph / TAU) * TBL) & (TBL - 1)];

// ---------- instruments ----------
function piano(L, R, t0, f, vel = 0.5, pan = 0, dur = 4.5) {
  const B = 0.00035;
  const parts = Array.from({ length: 8 }, (_, k) => ({ f: (k + 1) * f * Math.sqrt(1 + B * (k + 1) ** 2), a: vel / (k + 1) ** 1.25, d: 0.55 + 0.6 * k, ph: 0 }));
  add(L, R, t0, dur, pan, (t) => {
    let v = 0;
    for (const p of parts) { p.ph += (TAU * p.f) / SR; v += Math.sin(p.ph) * p.a * Math.exp(-t * p.d); }
    const hammer = t < 0.012 ? noise() * 0.08 * vel * (1 - t / 0.012) : 0;
    return (v * Math.min(1, t / 0.004) + hammer) * Math.min(1, (dur - t) / 0.3);
  });
}

function strings(L, R, t0, dur, freqs, amp, att = 1.2, rel = 1.5, bright = 0.06) {
  freqs.forEach((f, ni) => {
    for (let v = 0; v < 4; v++) {
      const det = 1 + (v - 1.5) * 0.0016;
      const pan = ((ni / Math.max(1, freqs.length - 1)) * 2 - 1) * 0.5 + (v % 2 ? 0.15 : -0.15);
      let ph = rand() * TAU, lp = 0;
      const vib = 4.6 + rand() * 0.8;
      add(L, R, t0, dur + rel, pan, (t) => {
        ph += (TAU * f * det * (1 + 0.0028 * Math.sin(TAU * vib * t))) / SR;
        lp += bright * (saw(ph) - lp);
        const env = Math.min(1, t / att) * (t > dur ? Math.max(0, 1 - (t - dur) / rel) : 1);
        return lp * env * amp * 0.25;
      });
    }
  });
}

function drone(L, R, t0, dur, f, amp, att = 2, rel = 2) {
  let p1 = 0, p2 = 0;
  add(L, R, t0, dur + rel, 0, (t) => {
    p1 += (TAU * f) / SR; p2 += (TAU * f * 2.002) / SR;
    const env = Math.min(1, t / att) * (t > dur ? Math.max(0, 1 - (t - dur) / rel) : 1);
    return (Math.sin(p1) * 0.8 + Math.sin(p2) * 0.25) * env * amp * (1 + 0.15 * Math.sin(TAU * 0.11 * t));
  });
}

function timpani(L, R, t0, f, amp, pan = 0) {
  let ph = 0, lp = 0;
  add(L, R, t0, 2.2, pan, (t) => {
    ph += (TAU * f * (1 - 0.08 * Math.min(1, t * 6))) / SR;
    lp += 0.08 * (noise() - lp);
    return (Math.sin(ph) * Math.exp(-t * 2.2) + lp * Math.exp(-t * 18) * 1.5) * amp;
  });
}

function timpRoll(L, R, t0, dur, f, amp) {
  for (let t = 0; t < dur; t += 0.07) timpani(L, R, t0 + t, f, amp * (0.15 + 0.85 * (t / dur) ** 2) * (0.8 + 0.2 * rand()), (rand() - 0.5) * 0.3);
}

function crash(L, R, t0, amp) {
  let hp = 0, prev = 0;
  for (const pan of [-0.4, 0.4]) {
    add(L, R, t0, 3.2, pan, (t) => { const x = noise(); hp = 0.92 * (hp + x - prev); prev = x; return hp * Math.exp(-t * 1.6) * amp * Math.min(1, t / 0.004); });
  }
}

function brassHit(L, R, t0, freqs, amp, dur = 2.4) {
  freqs.forEach((f, ni) => {
    for (const det of [0.997, 1.003]) {
      let ph = rand() * TAU, lp = 0;
      add(L, R, t0, dur, (ni / Math.max(1, freqs.length - 1)) * 1.2 - 0.6, (t) => {
        ph += (TAU * f * det) / SR;
        const cut = 0.04 + 0.22 * Math.exp(-t * 2.5);
        lp += cut * (saw(ph) - lp);
        return lp * amp * 0.35 * Math.min(1, t / 0.03) * Math.exp(-t * 0.9);
      });
    }
  });
}

function heartbeat(L, R, t0, amp) {
  for (const [dt, a] of [[0, 1], [0.18, 0.7]]) {
    let ph = 0;
    add(L, R, t0 + dt, 0.35, 0, (t) => { ph += (TAU * (62 - 20 * t)) / SR; return Math.sin(ph) * Math.exp(-t * 14) * amp * a; });
  }
}


// ---------- the score: a light, curious explainer groove ----------
const ML = new Float32Array(N), MR = new Float32Array(N);
const n = (name) => {
  const map = { C: -9, "C#": -8, D: -7, "D#": -6, E: -5, F: -4, "F#": -3, G: -2, "G#": -1, A: 0, Bb: 1, B: 2 };
  const m = name.match(/^([A-G][#b]?)(\d)$/);
  return 440 * 2 ** ((map[m[1]] + (Number(m[2]) - 4) * 12) / 12);
};
const ch = (...names) => names.map(n);
const Dm = ch("D3", "F3", "A3"), A = ch("A2", "C#3", "E3"), D = ch("D3", "F#3", "A3", "D4"), Bm = ch("B2", "D3", "F#3"), G = ch("G2", "B2", "D3"), Em = ch("E3", "G3", "B3");
function groove(t0, t1, chords, step, vel, timp = 0.12) {
  if (t1 <= t0) return;
  const len = (t1 - t0) / chords.length;
  chords.forEach((c, i) => strings(ML, MR, t0 + i * len, len + 0.3, c, 0.36, 0.3, 0.5, 0.08));
  for (let t = t0 + 0.05, k = 0; t < t1 - 0.05; t += step, k++) {
    const chord = chords[Math.min(chords.length - 1, Math.floor((t - t0) / len))];
    piano(ML, MR, t, chord[k % chord.length] * 2, vel, ((k % 3) - 1) * 0.3, 0.6);
    if (timp && k % 4 === 0) timpani(ML, MR, t, n(k % 8 === 0 ? "D2" : "A1"), timp);
  }
}
// S1: Wellington — a lift on 136, a proud swell on the SENA record
drone(ML, MR, 0, ev.runs1 + 0.4, n("D1"), 0.2, 0.3, 0.5);
strings(ML, MR, 0.05, ev.runs1, Bm, 0.28, 0.8, 0.3, 0.05);
brassHit(ML, MR, ev.runs1, ch("D3", "F#3", "A3", "D4"), 0.45, 1.6);
groove(ev.runs1 + 0.2, E("s1"), [D, A, Bm, G], 0.27, 0.08, 0.1);
brassHit(ML, MR, ev.countries, ch("D3", "F#3", "A3", "D4", "F#4"), 0.45, 1.6);
// S2: the line — curious, then the three-word arc
groove(S("s2"), E("s2"), [Bm, G, D, A], 0.3, 0.075, 0.08);
timpani(ML, MR, ev.crash2, n("A1"), 0.35);
brassHit(ML, MR, ev.again, ch("D3", "F#3", "A3", "D4"), 0.3, 1.0);
// S3: the rise — bright and driving
groove(S("s3"), ev.n199 - 0.2, [D, A, G, D], 0.24, 0.09, 0.12);
strings(ML, MR, ev.n199, E("s3") - ev.n199 + 0.3, ch("B2", "D3", "F#3"), 0.34, 0.2, 0.6, 0.06);
timpani(ML, MR, ev.n199, n("B1"), 0.4);
// S4: the crash — the groove falls away into a dark drone
drone(ML, MR, S("s4"), E("s4") - S("s4") + 0.3, n("B0"), 0.24, 0.4, 0.6);
strings(ML, MR, S("s4"), E("s4") - S("s4"), ch("B2", "D3", "F3"), 0.3, 1.0, 0.6, 0.04);
timpRoll(ML, MR, ev.dropped - 1.4, 1.4, n("B1"), 0.26);
timpani(ML, MR, ev.dropped, n("B1"), 0.55);
// S5: the comeback — the pulse returns
groove(S("s5"), E("s5"), [Em, G, D, A], 0.27, 0.08, 0.1);
[ev.lords].forEach((t) => brassHit(ML, MR, t, ch("D3", "F#3", "A3", "D4"), 0.32, 1.0));
// S6: the renaissance — the biggest lift of the film
groove(S("s6"), E("s6"), [D, A, Bm, G], 0.23, 0.095, 0.13);
strings(ML, MR, ev.since, E("s6") - ev.since + 0.3, D, 0.42, 0.6, 0.6, 0.09);
brassHit(ML, MR, ev.n55, ch("D3", "F#3", "A3", "D4", "F#4"), 0.6, 2.0);
crash(ML, MR, ev.n55, 0.24);
// S7: the paradox — light and curious
groove(S("s7"), E("s7"), [G, D, Em, A], 0.3, 0.075, 0.08);
// S8: resolve
strings(ML, MR, S("s8"), E("s8") - S("s8"), ch("D3", "F#3", "A3", "D4", "F#4"), 0.44, 0.6, 1.4, 0.09);
groove(S("s8"), ev.brand, [D, Bm, G, A], 0.4, 0.06, 0.05);
[["D3", 0], ["A3", 0.06], ["F#4", 0.12], ["D5", 0.7]].forEach(([nt, dt]) => piano(ML, MR, ev.brand + dt, n(nt), 0.28, 0.1, 4));

// Schroeder reverb on the score for a cinematic room.
function reverb(X, wet, delaysMs, seedShift) {
  const Y = new Float32Array(X.length);
  for (const d of delaysMs.map((m) => Math.round(((m + seedShift) * SR) / 1000))) {
    const buf = new Float32Array(d); let idx = 0, lp = 0;
    for (let i = 0; i < X.length; i++) { const out = buf[idx]; lp = out * 0.6 + lp * 0.4; buf[idx] = X[i] + lp * 0.8; idx = (idx + 1) % d; Y[i] += out / delaysMs.length; }
  }
  for (const [ms, g] of [[5.0, 0.7], [1.7, 0.7]]) {
    const d = Math.round((ms * SR) / 1000); const buf = new Float32Array(d); let idx = 0;
    for (let i = 0; i < Y.length; i++) { const b = buf[idx]; const v = -g * Y[i] + b; buf[idx] = Y[i] + g * v; idx = (idx + 1) % d; Y[i] = v; }
  }
  for (let i = 0; i < X.length; i++) X[i] = X[i] * (1 - wet) + Y[i] * wet * 2.2;
}
reverb(ML, 0.32, [29.7, 37.1, 41.1, 43.7], 0);
reverb(MR, 0.32, [29.7, 37.1, 41.1, 43.7], 1.3);
for (let i = 0; i < N; i++) { ML[i] = Math.tanh(ML[i] * 1.2); MR[i] = Math.tanh(MR[i] * 1.2); }
for (let i = Math.max(0, N - smp(0.8)); i < N; i++) { const g = (N - i) / smp(0.8); ML[i] *= g; MR[i] *= g; }
normalize([ML, MR], 0.89);
writeFileSync(join(OUT, "score.wav"), wavStereo(ML, MR));

// ---------- crowd: distant ambience bed for the whole film ----------
{
  const L = new Float32Array(N), R = new Float32Array(N);
  for (const [B, ch2] of [[L, 0], [R, 1]]) {
    let lp1 = 0, lp2 = 0, hp = 0;
    const ph = [rand() * TAU, rand() * TAU, rand() * TAU];
    for (let i = 0; i < N; i++) {
      const t = i / SR;
      const x = noise();
      lp1 += 0.12 * (x - lp1); lp2 += 0.12 * (lp1 - lp2); hp += 0.02 * (lp2 - hp);
      const mod = 0.6 + 0.2 * Math.sin(TAU * 0.07 * t + ph[0]) + 0.12 * Math.sin(TAU * 0.19 * t + ph[1]) + 0.08 * Math.sin(TAU * 0.43 * t + ph[2] + ch2);
      B[i] = (lp2 - hp) * mod;
    }
  }
  normalize([L, R], 0.5);
  writeFileSync(join(OUT, "crowd-ambience.wav"), wavStereo(L, R));
}
// ---------- crowd: cheers (roar = band-limited noise with many-voice flutter) ----------
function cheer(name, dur, attack, peakAt, decay = 0.9) {
  const L = new Float32Array(smp(dur)), R = new Float32Array(smp(dur));
  for (const B of [L, R]) {
    let b1 = 0, b2 = 0, b3 = 0, b4 = 0, fl = 0;
    for (let i = 0; i < B.length; i++) {
      const t = i / SR;
      const x = noise();
      b1 += 0.09 * (x - b1); b2 += 0.09 * (b1 - b2); // ~600 Hz body
      b3 += 0.35 * (x - b3); b4 += 0.02 * (b3 - b4); // ~2 kHz shouts
      fl += 0.0015 * (noise() - fl); // slow flutter of many voices
      const env = t < peakAt ? Math.min(1, t / attack) : Math.exp(-(t - peakAt) * decay);
      B[i] = ((b2 - b4 * 0.3) * 1.4 + (b3 - b4) * 0.35) * env * (1 + 6 * fl);
    }
  }
  normalize([L, R], 0.8);
  writeFileSync(join(OUT, name), wavStereo(L, R));
}
cheer("cheer-big.wav", 5.5, 0.35, 1.6);
cheer("cheer-soft.wav", 4.0, 0.5, 0.9);
cheer("cheer-short.wav", 1.6, 0.12, 0.3, 3.2); // a quick, contained crowd reaction

// ---------- scoreboard SFX ----------
function mono(name, dur, fn, peak = 0.9) {
  const M = new Float32Array(smp(dur));
  const st = {};
  for (let i = 0; i < M.length; i++) M[i] = fn(i / SR, st);
  normalize([M], peak);
  writeFileSync(join(OUT, name), wavMono(M));
}
mono("clunk.wav", 0.6, (t, s) => { // heavy timber-and-iron scoreboard clunk
  s.p = (s.p || 0) + (TAU * (72 - 30 * t)) / SR; s.lp = (s.lp || 0) + 0.18 * (noise() - (s.lp || 0));
  return Math.sin(s.p) * Math.exp(-t * 9) + s.lp * Math.exp(-t * 40) * 1.4 + (t > 0.03 && t < 0.06 ? noise() * 0.25 * Math.exp(-(t - 0.03) * 80) : 0);
});
mono("flip.wav", 0.16, (t, s) => { // tin plate turning over
  s.p = (s.p || 0) + (TAU * (240 - 100 * t)) / SR; s.lp = (s.lp || 0) + 0.5 * (noise() - (s.lp || 0));
  return Math.sin(s.p) * Math.exp(-t * 45) * 0.8 + s.lp * Math.exp(-t * 70) * 0.7 + (t > 0.03 && t < 0.045 ? noise() * 0.4 : 0);
});
mono("click-low.wav", 0.12, (t, s) => { // low, precise mechanical click
  s.p = (s.p || 0) + (TAU * 165) / SR;
  return Math.sin(s.p) * Math.exp(-t * 55) + (t < 0.003 ? noise() * 0.6 : 0);
});
mono("slide.wav", 0.55, (t, s) => { // panel dropping along its rail
  s.lp = (s.lp || 0) + 0.03 * (noise() - (s.lp || 0)); s.p = (s.p || 0) + (TAU * 58) / SR;
  const env = Math.sin(Math.PI * Math.min(1, t / 0.42)) * (t < 0.42 ? 1 : 0);
  const thunk = t > 0.4 ? Math.sin(s.p) * Math.exp(-(t - 0.4) * 30) * 0.9 : 0;
  return s.lp * env * 3 + thunk;
}, 0.8);
mono("tick.wav", 0.05, (t) => (Math.sin(TAU * 2600 * t) * 0.6 + noise() * 0.4) * Math.exp(-t * 160), 0.6);
mono("tock.wav", 0.06, (t) => (Math.sin(TAU * 1700 * t) * 0.6 + noise() * 0.3) * Math.exp(-t * 130), 0.55);
mono("boom.wav", 2.2, (t, s) => { // low-frequency transition impact
  s.p = (s.p || 0) + (TAU * (48 - 18 * Math.min(1, t))) / SR; s.lp = (s.lp || 0) + 0.05 * (noise() - (s.lp || 0));
  return Math.sin(s.p) * Math.exp(-t * 2.2) + s.lp * Math.exp(-t * 10) * 0.8;
});
mono("final-click.wav", 1.4, (t, s) => { // one authentic last click with a short tail
  s.p = (s.p || 0) + (TAU * 190) / SR; s.lp = (s.lp || 0) + 0.3 * (noise() - (s.lp || 0));
  return Math.sin(s.p) * Math.exp(-t * 30) + s.lp * Math.exp(-t * 60) + Math.sin(TAU * 950 * t) * Math.exp(-t * 6) * 0.06;
});
mono("relay.wav", 0.08, (t) => (noise() * 0.5 + Math.sin(TAU * 900 * t) * 0.5) * Math.exp(-t * 90), 0.5);
cheer("cheer-roar.wav", 7.0, 0.22, 1.5, 0.45); // the winning-boundary roar
mono("bat.wav", 0.25, (t, s) => { // willow on leather
  s.a = (s.a || 0) + (TAU * 920) / SR; s.b = (s.b || 0) + (TAU * 1650) / SR; s.c = (s.c || 0) + (TAU * 140) / SR;
  s.h = (s.h || 0) + 0.6 * (noise() - (s.h || 0));
  return (noise() - s.h) * Math.exp(-t * 160) * 1.2 + Math.sin(s.a) * Math.exp(-t * 55) * 0.8 + Math.sin(s.b) * Math.exp(-t * 70) * 0.5 + Math.sin(s.c) * Math.exp(-t * 30) * 0.5;
});
{
  // tape-rewind: rising noise sweep with a fast flip rattle
  const M = new Float32Array(smp(0.6));
  let lp = 0;
  for (let i = 0; i < M.length; i++) { const t = i / M.length; lp += (0.03 + 0.4 * t * t) * (noise() - lp); M[i] = lp * Math.sin(Math.PI * t) * 1.2; }
  for (let t = 0; t < 0.58; t += 0.025 - 0.012 * (t / 0.58)) { const s0 = smp(t); for (let k = 0; k < smp(0.012) && s0 + k < M.length; k++) M[s0 + k] += noise() * 0.5 * Math.exp(-k / 90); }
  normalize([M], 0.85);
  writeFileSync(join(OUT, "rewind.wav"), wavMono(M));
}
// Flip rattle for the spinning digits: a plate turn every ~40 ms.
function rattle(name, dur, accel) {
  const M = new Float32Array(smp(dur));
  let t = 0;
  while (t < dur) {
    const s0 = smp(t), len = smp(0.03);
    let p = 0, lp = 0;
    const a = 0.5 + 0.5 * rand();
    for (let i = 0; i < len && s0 + i < M.length; i++) {
      const tt = i / SR; p += (TAU * (300 + 200 * rand())) / SR; lp += 0.5 * (noise() - lp);
      M[s0 + i] += (Math.sin(p) * 0.5 + lp * 0.6) * Math.exp(-tt * 120) * a;
    }
    const prog = t / dur;
    t += accel ? 0.02 + 0.09 * Math.abs(prog - 0.5) * 2 : 0.04 + 0.01 * rand();
  }
  normalize([M], 0.8);
  writeFileSync(join(OUT, name), wavMono(M));
}
{
  // a soft air whoosh for each delivery
  const M = new Float32Array(smp(0.5));
  let lp = 0, bp = 0;
  for (let i = 0; i < M.length; i++) { const t = i / M.length; lp += (0.02 + 0.25 * Math.sin(Math.PI * t)) * (noise() - lp); bp += 0.1 * (lp - bp); M[i] = (lp - bp) * Math.sin(Math.PI * t) ** 1.5; }
  normalize([M], 0.7);
  writeFileSync(join(OUT, "whoosh.wav"), wavMono(M));
}
mono("stamp.wav", 0.5, (t, s) => { // a heavy rubber stamp / board slam
  s.p = (s.p || 0) + (TAU * (85 - 40 * t)) / SR; s.lp = (s.lp || 0) + 0.25 * (noise() - (s.lp || 0));
  return Math.sin(s.p) * Math.exp(-t * 14) + s.lp * Math.exp(-t * 50) * 1.2;
}, 0.9);
mono("buzz.wav", 0.32, (t) => (Math.sign(Math.sin(TAU * 110 * t)) * 0.35 + Math.sin(TAU * 220 * t) * 0.25) * Math.min(1, t / 0.01) * Math.exp(-t * 6), 0.6);
mono("fill.wav", 0.7, (t, s) => { // a rising "filling" sweep for the gauges
  s.p = (s.p || 0) + (TAU * (220 + 500 * t)) / SR; s.lp = (s.lp || 0) + 0.1 * (noise() - (s.lp || 0));
  return (Math.sin(s.p) * 0.4 + s.lp * 0.5) * Math.sin(Math.PI * Math.min(1, t / 0.7));
}, 0.6);
cheer("crowd-groan.wav", 2.4, 0.2, 0.5, 1.6); // a deflated crowd
rattle("rattle-count.wav", 0.9, true); // the score counter climbing to 250
console.log(`audio written (${DUR.toFixed(1)}s). events:`, Object.fromEntries(Object.entries(ev).map(([k, v]) => [k, Array.isArray(v) ? v.map((x) => x.toFixed(2)) : v.toFixed(2)])));
