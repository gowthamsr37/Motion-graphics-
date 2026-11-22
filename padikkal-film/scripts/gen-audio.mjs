// Original beat + SFX, synthesized from scratch (no samples, deterministic).
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
  then1: sent("s1", 2),
  s2: S("s2"), a2: word("s2", "167", 2.86), c2: word("s2", "80", 5.62),
  s3: S("s3"), pad3: word("s3", "72", 8.48),
  s4: S("s4"), galle4: word("s4", "167", 8.98),
  s5: S("s5"), pad5: word("s5", "128", 11.32),
  s6: S("s6"), breaks6: word("s6", "breaks", 10.5),
  s7: S("s7"), three7: sent("s7", 1) + 2.9,
  end: DUR,
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



// ---------- the score: a quiet piano film score that builds ----------
const ML = new Float32Array(N), MR = new Float32Array(N);
const DL = new Float32Array(N), DR = new Float32Array(N);
const n = (name) => {
  const map = { C: -9, "C#": -8, D: -7, "D#": -6, E: -5, F: -4, "F#": -3, G: -2, "G#": -1, A: 0, Bb: 1, B: 2 };
  const m = name.match(/^([A-G][#b]?)(\d)$/);
  return 440 * 2 ** ((map[m[1]] + (Number(m[2]) - 4) * 12) / 12);
};
const ch = (...names) => names.map(n);
const BEAT = 60 / 84;
const Am = { pad: ch("A2", "E3", "A3", "C4"), arp: ch("A3", "C4", "E4", "A4"), root: n("A1") };
const F = { pad: ch("F2", "C3", "F3", "A3"), arp: ch("F3", "A3", "C4", "F4"), root: n("F1") };
const Cm = { pad: ch("C3", "G3", "C4", "E4"), arp: ch("C4", "E4", "G4", "C5"), root: n("C2") };
const G = { pad: ch("G2", "D3", "G3", "B3"), arp: ch("G3", "B3", "D4", "G4"), root: n("G1") };
const PROG = [Am, F, Cm, G];
function kick(t0, amp = 0.8) { add(DL, DR, t0, 0.5, 0, (t) => Math.sin(TAU * (42 * t + (90 * (1 - Math.exp(-t * 28))) / 28)) * Math.exp(-t * 6) * amp * Math.min(1, t / 0.002)); }
function sub(t0, dur, fr, amp = 0.45) { let ph = 0; add(DL, DR, t0, dur, 0, (t) => { ph += (TAU * fr) / SR; return Math.sin(ph) * amp * Math.min(1, t / 0.02) * Math.min(1, (dur - t) / 0.1); }); }
function shaker(t0, amp = 0.06) { let lp = 0; add(DL, DR, t0, 0.08, 0.3, (t) => { const x = noise(); lp += 0.5 * (x - lp); return (x - lp) * Math.exp(-t * 50) * amp; }); }
// a section on its own beat grid: level 0 = piano only, 1 = + pulse, 2 = + kick and shaker
function section(t0, t1, level, bright = 0.06) {
  const BAR = BEAT * 4;
  for (let bar = 0, tb = t0; tb < t1 - 0.05; bar++, tb += BAR) {
    const c = PROG[bar % 4];
    const end = Math.min(t1, tb + BAR);
    strings(ML, MR, tb, end - tb, c.pad, level === 0 ? 0.18 : 0.26, 0.6, 0.6, bright);
    for (let s = 0; s < 8; s++) {
      const t = tb + s * (BEAT / 2);
      if (t >= t1 - 0.05) break;
      piano(ML, MR, t, c.arp[(s * (s % 2 ? 3 : 1)) % 4] * (level === 2 && s % 4 === 3 ? 2 : 1), 0.12 + 0.03 * level, ((s % 4) - 1.5) * 0.25, 1.6);
      if (level >= 1 && s % 2 === 0) sub(t, BEAT * 0.9, c.root, 0.18 + 0.06 * level);
      if (level >= 2 && (s === 0 || s === 4)) kick(t, 0.65);
      if (level >= 2) shaker(t + BEAT / 4, 0.05);
    }
  }
}
const hit = (t, amp = 1) => { kick(t, 0.9 * amp); sub(t, 1.6, n("A1"), 0.45 * amp); crash(ML, MR, t, 0.14 * amp); };

section(0.05, ev.then1, 0, 0.04);
hit(ev.then1, 1);
section(ev.then1, ev.s3, 1);
section(ev.s3, ev.s4, 1);
section(ev.s4, ev.galle4, 1);
hit(ev.galle4, 0.8);
section(ev.galle4, ev.s5, 2);
section(ev.s5, ev.s6, 1, 0.05);
section(ev.s6, ev.breaks6, 1);
hit(ev.breaks6, 0.7);
section(ev.breaks6, ev.s7, 2);
section(ev.s7, ev.three7, 1, 0.08);
hit(ev.three7, 1.1);
strings(ML, MR, ev.three7, ev.end - ev.three7, ch("A2", "E3", "A3", "C#4", "E4"), 0.4, 0.3, 1.6, 0.09);
[["A3", 0], ["E4", 0.1], ["A4", 0.2], ["C#5", 0.9]].forEach(([nt, dt]) => piano(ML, MR, ev.three7 + 1.2 + dt, n(nt), 0.26, 0.1, 5));

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


reverb(ML, 0.3, [29.7, 37.1, 41.1, 43.7], 0);
reverb(MR, 0.3, [29.7, 37.1, 41.1, 43.7], 1.3);
for (let i = 0; i < N; i++) { ML[i] = Math.tanh((ML[i] + DL[i]) * 1.1); MR[i] = Math.tanh((MR[i] + DR[i]) * 1.1); }
for (let i = Math.max(0, N - smp(1.0)); i < N; i++) { const g = (N - i) / smp(1.0); ML[i] *= g; MR[i] *= g; }
normalize([ML, MR], 0.89);
writeFileSync(join(OUT, "score.wav"), wavStereo(ML, MR));

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

// ---------- film SFX ----------
function monoW(name, dur, fn, peak = 0.85) {
  const M = new Float32Array(smp(dur)); const st = {};
  for (let i = 0; i < M.length; i++) M[i] = fn(i / SR, st);
  normalize([M], peak); writeFileSync(join(OUT, name), wavMono(M));
}
{
  const M = new Float32Array(smp(0.6)); let lp = 0, bp = 0;
  for (let i = 0; i < M.length; i++) { const t = i / M.length; lp += (0.02 + 0.45 * t * t) * (noise() - lp); bp += 0.15 * (lp - bp); M[i] = (lp - bp) * Math.sin(Math.PI * t) ** 1.3 * 1.3; }
  normalize([M], 0.7); writeFileSync(join(OUT, "swoosh.wav"), wavMono(M));
}
monoW("whip.wav", 0.22, (t, s) => { s.lp = (s.lp || 0) + (0.05 + 0.6 * Math.sin(Math.PI * t / 0.22)) * (noise() - (s.lp || 0)); return s.lp * Math.sin(Math.PI * t / 0.22); }, 0.6);
monoW("pen.wav", 0.9, (t, s) => { s.lp = (s.lp || 0) + 0.3 * (noise() - (s.lp || 0)); return (noise() - s.lp) * 0.4 * (0.6 + 0.4 * Math.sin(TAU * 23 * t)) * Math.sin(Math.PI * Math.min(1, t / 0.9)); }, 0.45);
monoW("tick.wav", 0.06, (t) => (Math.sin(TAU * 2300 * t) * 0.6 + noise() * 0.3) * Math.exp(-t * 140), 0.6);
{
  const M = new Float32Array(smp(1.2)); let k = 0;
  for (let t = 0; t < 1.05; t += 0.07 + 0.002 * k * k) { const s0 = smp(t); for (let i = 0; i < smp(0.03) && s0 + i < M.length; i++) M[s0 + i] += (Math.sin(TAU * (k % 2 ? 1700 : 2300) * i / SR) * 0.6) * Math.exp(-i / SR * 140); k++; }
  normalize([M], 0.6); writeFileSync(join(OUT, "ticks.wav"), wavMono(M));
}
monoW("impact.wav", 1.6, (t, s) => { s.p = (s.p || 0) + (TAU * (50 + 70 * Math.exp(-t * 18))) / SR; s.lp = (s.lp || 0) + 0.2 * (noise() - (s.lp || 0)); return Math.tanh(Math.sin(s.p) * 1.6) * Math.exp(-t * 3) + (noise() - s.lp) * Math.exp(-t * 26) * 0.6 + s.lp * Math.exp(-t * 5) * 0.2; }, 0.9);
monoW("slam.wav", 0.5, (t, s) => { s.p = (s.p || 0) + (TAU * (80 + 140 * Math.exp(-t * 35))) / SR; s.lp = (s.lp || 0) + 0.35 * (noise() - (s.lp || 0)); return Math.sin(s.p) * Math.exp(-t * 9) + (noise() - s.lp) * Math.exp(-t * 40) * 0.7; }, 0.85);
monoW("pop.wav", 0.14, (t, s) => { s.p = (s.p || 0) + (TAU * (820 - 420 * t / 0.14)) / SR; return Math.sin(s.p) * Math.exp(-t * 36); }, 0.55);
monoW("rise.wav", 1.6, (t, s) => { const p = t / 1.6; s.p = (s.p || 0) + (TAU * (220 + 700 * p * p)) / SR; s.lp = (s.lp || 0) + (0.02 + 0.3 * p) * (noise() - (s.lp || 0)); return (Math.sin(s.p) * 0.3 + s.lp * 0.7) * p * p * (p > 0.96 ? (1 - p) / 0.04 : 1); }, 0.6);
{
  const M = new Float32Array(smp(0.9));
  [0, 0.04, 0.09, 0.15, 0.2, 0.28].forEach((t0, k) => { const s0 = smp(t0); let lp = 0; for (let i = 0; i < smp(0.12) && s0 + i < M.length; i++) { const x = noise(); lp += 0.5 * (x - lp); M[s0 + i] += ((x - lp) * 1.2 + Math.sin(TAU * (1800 + 400 * k) * i / SR) * 0.4) * Math.exp(-i / smp(0.025)) * Math.pow(0.82, k); } });
  normalize([M], 0.75); writeFileSync(join(OUT, "crack.wav"), wavMono(M));
}
cheer("crowd.wav", 3.6, 0.4, 0.9, 1.1);

console.log(`audio written (${DUR.toFixed(1)}s)`);
