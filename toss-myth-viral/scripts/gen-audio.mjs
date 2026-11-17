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
  slam1: sent("s1", 2) + f(40),
  s2: S("s2"),
  drop3: sent("s3", 2),
  s5: S("s5"),
  thirty: word("s5", "30", 16.0) + f(16),
  vanished: word("s6", "vanished", 0.3),
  bars: sent("s6", 1),
  v57: word("s7", "57", 5.0),
  s9: S("s9"),
  v9: sent("s9", 1),
  myth: sent("s9", 2),
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



// ---------- the score: a modern 100 BPM beat, with drops on the reveals ----------
const ML = new Float32Array(N), MR = new Float32Array(N); // melodic (gets reverb)
const DL = new Float32Array(N), DR = new Float32Array(N); // drums + sub (dry)
const n = (name) => {
  const map = { C: -9, "C#": -8, D: -7, "D#": -6, E: -5, F: -4, "F#": -3, G: -2, "G#": -1, A: 0, Bb: 1, B: 2 };
  const m = name.match(/^([A-G][#b]?)(\d)$/);
  return 440 * 2 ** ((map[m[1]] + (Number(m[2]) - 4) * 12) / 12);
};
const ch = (...names) => names.map(n);
const BEAT = 60 / 100, BAR = BEAT * 4, S16 = BEAT / 4;
// i–VI–III–VII in D minor
const PROG = [
  { root: n("D2"), pad: ch("D3", "F3", "A3"), arp: ch("D4", "F4", "A4", "D5") },
  { root: n("Bb1"), pad: ch("Bb2", "D3", "F3"), arp: ch("Bb3", "D4", "F4", "Bb4") },
  { root: n("F2"), pad: ch("F3", "A3", "C4"), arp: ch("F4", "A4", "C5", "F5") },
  { root: n("C2"), pad: ch("C3", "E3", "G3"), arp: ch("C4", "E4", "G4", "C5") },
];
function kick(t0, amp = 0.95) {
  add(DL, DR, t0, 0.5, 0, (t) => Math.sin(TAU * (44 * t + (100 * (1 - Math.exp(-t * 30))) / 30)) * Math.exp(-t * 6.5) * amp * Math.min(1, t / 0.002) + (t < 0.004 ? noise() * 0.3 * amp : 0));
}
function clap(t0, amp = 0.5) {
  let lp = 0, ph = 0;
  add(DL, DR, t0, 0.32, 0, (t) => {
    const x = noise(); lp += 0.25 * (x - lp);
    ph += (TAU * 190) / SR;
    const burst = [0, 0.011, 0.022].reduce((a, d) => a + (t >= d ? Math.exp(-(t - d) * 120) : 0), 0) * 0.5 + Math.exp(-t * 16);
    return ((x - lp) * burst * 0.9 + Math.sin(ph) * Math.exp(-t * 30) * 0.4) * amp;
  });
}
function hat(t0, amp = 0.16, open = false, pan = 0.25) {
  let lp = 0;
  add(DL, DR, t0, open ? 0.3 : 0.06, pan, (t) => { const x = noise(); lp += 0.6 * (x - lp); return (x - lp) * Math.exp(-t * (open ? 12 : 70)) * amp; });
}
function sub(t0, dur, fr, amp = 0.55) {
  let ph = 0;
  add(DL, DR, t0, dur, 0, (t) => { ph += (TAU * fr * (1 + 0.6 * Math.exp(-t * 40))) / SR; return Math.tanh(Math.sin(ph) * 1.6) * amp * Math.min(1, t / 0.005) * Math.min(1, (dur - t) / 0.05) * Math.exp(-t * 0.9); });
}
function pluck(t0, fr, amp = 0.14, pan = 0) {
  let ph = rand() * TAU, lp = 0;
  add(ML, MR, t0, 0.5, pan, (t) => { ph += (TAU * fr) / SR; lp += (0.05 + 0.4 * Math.exp(-t * 18)) * (saw(ph) - lp); return lp * Math.exp(-t * 7) * amp * Math.min(1, t / 0.003); });
}
function riserNoise(t0, dur, amp = 0.25) {
  let lp = 0;
  add(ML, MR, t0, dur, 0, (t) => { const p = t / dur; lp += (0.01 + 0.5 * p * p) * (noise() - lp); return lp * p * p * amp; });
}
// one section of the arrangement, on its own bar grid starting at t0
function section(t0, t1, kind) {
  for (let bar = 0, tb = t0; tb < t1 - 0.05; bar++, tb += BAR) {
    const c = PROG[bar % 4];
    const barEnd = Math.min(t1, tb + BAR);
    strings(ML, MR, tb, barEnd - tb, kind === "half" ? c.pad.map((x) => x / 2) : c.pad, kind === "pulse" ? 0.22 : 0.3, 0.25, 0.4, 0.07);
    for (let s = 0; s < 16; s++) {
      const t = tb + s * S16;
      if (t >= t1 - 0.02) break;
      const beatPos = s / 4;
      if (kind === "pulse") {
        if (s === 0 || s === 8) kick(t, 0.8);
        if (s % 4 === 2) hat(t, 0.08);
        if (s === 0) sub(t, Math.min(BAR, t1 - t), c.root, 0.45);
      } else if (kind === "half") {
        if (s === 0 || s === 10) kick(t, 0.85);
        if (s === 8) clap(t, 0.5);
        if (s % 2 === 0) hat(t, s % 4 === 0 ? 0.1 : 0.06);
        if (s === 0) sub(t, Math.min(BAR, t1 - t), c.root, 0.5);
        if (s % 4 === 0) pluck(t, c.arp[(s / 4) % 4] / 2, 0.1, -0.2);
      } else {
        const full = kind === "full";
        if (s === 0 || s === 8 || (full && (s === 6 || s === 11))) kick(t, s === 0 ? 1 : 0.85);
        if (s === 4 || s === 12) clap(t, 0.55);
        if (full ? true : s % 2 === 0) hat(t, s % 4 === 2 ? 0.17 : 0.09, full && s === 14);
        if (s === 0 || (full && s === 10)) sub(t, Math.min(s === 0 ? BEAT * 2.4 : BEAT * 1.4, t1 - t), c.root, 0.55);
        if (s % 2 === 0) pluck(t, c.arp[(s / 2) % 4], full ? 0.14 : 0.1, ((s % 4) - 1.5) * 0.3);
      }
      void beatPos;
    }
  }
}
const hitAt = (t, amp = 1) => { kick(t, amp); sub(t, 1.2, n("D2"), 0.55 * amp); crash(ML, MR, t, 0.22 * amp); };

// arrangement
hitAt(0.0, 1);
section(0.02, ev.slam1, "pulse");
hitAt(ev.slam1, 0.9);
section(ev.slam1, ev.drop3 - 0.3, "groove");
riserNoise(ev.drop3 - 2.2, 2.0, 0.22);
hitAt(ev.drop3, 1);
section(ev.drop3, ev.s5, "full");
section(ev.s5, ev.vanished, "half");
hitAt(ev.thirty, 0.7);
section(ev.bars - 0.05, ev.v57 - 0.25, "groove");
riserNoise(ev.v57 - 1.6, 1.4, 0.2);
hitAt(ev.v57, 1);
section(ev.v57, ev.s9, "full");
section(ev.s9, ev.v9 - 0.25, "pulse");
riserNoise(ev.v9 - 2.0, 1.8, 0.2);
hitAt(ev.v9, 0.85);
section(ev.v9, ev.myth - 0.4, "groove");
riserNoise(ev.myth - 1.6, 1.2, 0.24);
hitAt(ev.myth, 1.1);
section(ev.myth, ev.end - 0.6, "full");

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

reverb(ML, 0.28, [29.7, 37.1, 41.1, 43.7], 0);
reverb(MR, 0.28, [29.7, 37.1, 41.1, 43.7], 1.3);
// silence windows before each drop (the "breath" before the reveal) and after "Then it vanished"
const gaps = [[ev.drop3 - 0.3, ev.drop3], [ev.v57 - 0.25, ev.v57], [ev.v9 - 0.25, ev.v9], [ev.myth - 0.4, ev.myth], [ev.vanished, ev.bars - 0.05]];
const gate = (t) => { for (const [a, b] of gaps) { if (t > a && t < b) return Math.max(0, 1 - Math.min(t - a, b - t) / 0.03) * 0 + (t - a < 0.03 ? 1 - (t - a) / 0.03 : 0); } return 1; };
for (let i = 0; i < N; i++) {
  const g = gate(i / SR);
  ML[i] = Math.tanh((ML[i] + DL[i] * 1.0) * 1.1) * g;
  MR[i] = Math.tanh((MR[i] + DR[i] * 1.0) * 1.1) * g;
}
for (let i = Math.max(0, N - smp(0.8)); i < N; i++) { const g = (N - i) / smp(0.8); ML[i] *= g; MR[i] *= g; }
normalize([ML, MR], 0.89);
writeFileSync(join(OUT, "score.wav"), wavStereo(ML, MR));

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
// ---------- coin & story SFX ----------
function ring(t, partials, decay) { // inharmonic metal ring
  return partials.reduce((s, [fr, g, d]) => s + Math.sin(TAU * fr * t) * g * Math.exp(-t * d * decay), 0);
}
const COIN = [[2350, 0.5, 6], [3960, 0.35, 9], [5480, 0.25, 12], [7300, 0.15, 16], [1180, 0.2, 5]];
mono("coin-flick.wav", 0.9, (t, s) => { // thumbnail flick, then the spinning ring
  s.lp = (s.lp || 0) + 0.6 * (noise() - (s.lp || 0));
  const click = t < 0.01 ? (noise() - s.lp) * 1.2 : 0;
  const wob = 0.55 + 0.45 * Math.sin(TAU * 18 * t);
  return click + ring(t, COIN, 1) * 0.6 * wob * Math.min(1, t / 0.004);
}, 0.8);
mono("coin-land.wav", 1.2, (t, s) => { // lands on the board: thud + settling ring
  s.p = (s.p || 0) + (TAU * (140 - 60 * t)) / SR; s.lp = (s.lp || 0) + 0.3 * (noise() - (s.lp || 0));
  const thud = Math.sin(s.p) * Math.exp(-t * 28) * 0.9 + s.lp * Math.exp(-t * 60) * 0.6;
  const chatter = [0, 0.11, 0.19, 0.25, 0.29].reduce((a, t0, i) => a + (t > t0 ? ring(t - t0, COIN, 1.6) * 0.5 * Math.pow(0.7, i) : 0), 0);
  return thud + chatter;
}, 0.85);
{
  // many flips in a row: quick ticks that speed up then settle (the simulation)
  const M = new Float32Array(smp(3.4));
  let t = 0, k = 0;
  while (t < 3.2) {
    const s0 = smp(t);
    for (let i = 0; i < smp(0.05) && s0 + i < M.length; i++) M[s0 + i] += ring(i / SR, COIN, 3) * 0.35 * (0.6 + 0.4 * rand());
    k++;
    t += Math.max(0.035, 0.16 * Math.exp(-k / 8));
  }
  for (let i = 0; i < M.length; i++) M[i] *= Math.min(1, (M.length - i) / smp(0.6));
  normalize([M], 0.7);
  writeFileSync(join(OUT, "flips-run.wav"), wavMono(M));
}
mono("dew.wav", 1.6, (t, s) => { // soft droplets
  s.lp = (s.lp || 0) + 0.02 * (noise() - (s.lp || 0));
  let v = s.lp * 0.6 * Math.sin(Math.PI * Math.min(1, t / 1.6));
  for (const [t0, fr] of [[0.05, 1400], [0.32, 1750], [0.6, 1250], [0.85, 1900], [1.15, 1550]]) if (t > t0) v += Math.sin(TAU * (fr + 900 * (t - t0)) * (t - t0)) * Math.exp(-(t - t0) * 40) * 0.5;
  return v;
}, 0.6);
{
  // dry cracking earth for the Test pitch
  const M = new Float32Array(smp(2.6));
  for (let c = 0; c < 9; c++) {
    const t0 = 0.1 + c * 0.26 + rand() * 0.08;
    const s0 = smp(t0);
    let lp = 0;
    for (let i = 0; i < smp(0.18) && s0 + i < M.length; i++) { const x = noise(); lp += 0.45 * (x - lp); M[s0 + i] += (x - lp) * Math.exp(-i / smp(0.03)) * (rand() < 0.3 ? 1.4 : 0.8); }
  }
  normalize([M], 0.7);
  writeFileSync(join(OUT, "cracks.wav"), wavMono(M));
}


// ---------- reel SFX ----------
{
  // swoosh: a filtered noise sweep for the coin wipes
  const M = new Float32Array(smp(0.7)); let lp = 0, bp = 0;
  for (let i = 0; i < M.length; i++) { const t = i / M.length; lp += (0.02 + 0.5 * t * t) * (noise() - lp); bp += 0.15 * (lp - bp); M[i] = (lp - bp) * Math.sin(Math.PI * t) ** 1.2 * 1.4; }
  normalize([M], 0.75); writeFileSync(join(OUT, "swoosh.wav"), wavMono(M));
}
mono("impact.wav", 1.6, (t, s) => { // cinematic hit: sub thump + noise crack + tail
  s.p = (s.p || 0) + (TAU * (55 + 70 * Math.exp(-t * 18))) / SR; s.lp = (s.lp || 0) + 0.2 * (noise() - (s.lp || 0));
  return Math.tanh(Math.sin(s.p) * 1.8) * Math.exp(-t * 3.2) + (noise() - s.lp) * Math.exp(-t * 22) * 0.8 + s.lp * Math.exp(-t * 5) * 0.25;
}, 0.9);
mono("hit.wav", 0.35, (t, s) => { // short punchy text slam
  s.p = (s.p || 0) + (TAU * (90 + 120 * Math.exp(-t * 40))) / SR; s.lp = (s.lp || 0) + 0.3 * (noise() - (s.lp || 0));
  return Math.sin(s.p) * Math.exp(-t * 14) + (noise() - s.lp) * Math.exp(-t * 45) * 0.6;
}, 0.8);
{
  // tick-run: a counter spinning up (fast ticks that slow down)
  const M = new Float32Array(smp(1.4)); let t = 0, k = 0;
  while (t < 1.3) { const s0 = smp(t); for (let i = 0; i < smp(0.02) && s0 + i < M.length; i++) M[s0 + i] += (Math.sin(TAU * 2400 * i / SR) * 0.6 + noise() * 0.4) * Math.exp(-i / SR * 220); k++; t += 0.03 + 0.0018 * k * k / 6; }
  normalize([M], 0.6); writeFileSync(join(OUT, "tick-run.wav"), wavMono(M));
}
mono("servo.wav", 0.9, (t, s) => { // needle swing
  s.p = (s.p || 0) + (TAU * (180 + 260 * Math.sin(Math.PI * Math.min(1, t / 0.7)))) / SR;
  return (Math.sin(s.p) * 0.5 + Math.sin(s.p * 2.01) * 0.2) * Math.sin(Math.PI * Math.min(1, t / 0.9)) * 0.8;
}, 0.5);
mono("ding.wav", 1.4, (t) => [[1568, 1], [2349, 0.5], [3136, 0.3]].reduce((a, [fr, g]) => a + Math.sin(TAU * fr * t) * g * Math.exp(-t * 4), 0) * Math.min(1, t / 0.002), 0.55);
mono("shimmer.wav", 1.2, (t) => [1760, 2217, 2637, 3520].reduce((a, fr, i) => a + Math.sin(TAU * fr * t + i) * Math.exp(-Math.max(0, t - i * 0.06) * 3) * (t > i * 0.06 ? 1 : 0), 0) * 0.3, 0.45);
mono("pop.wav", 0.12, (t, s) => { s.p = (s.p || 0) + (TAU * (900 - 500 * t / 0.12)) / SR; return Math.sin(s.p) * Math.exp(-t * 40); }, 0.6);
mono("riser.wav", 2.4, (t, s) => { // pitch-rising tension
  const p = t / 2.4; s.p = (s.p || 0) + (TAU * (200 + 900 * p * p)) / SR; s.lp = (s.lp || 0) + (0.02 + 0.3 * p) * (noise() - (s.lp || 0));
  return (Math.sin(s.p) * 0.35 + s.lp * 0.8) * p * p * (p > 0.97 ? (1 - p) / 0.03 : 1);
}, 0.7);
mono("tape-stop.wav", 0.8, (t, s) => { // a beat grinding to a halt
  const fr = 110 * Math.max(0.05, 1 - t / 0.75) ** 1.5; s.p = (s.p || 0) + (TAU * fr) / SR; s.q = (s.q || 0) + (TAU * fr * 3.01) / SR;
  return (Math.tanh(Math.sin(s.p) * 2) * 0.8 + Math.sin(s.q) * 0.2) * Math.max(0, 1 - t / 0.8);
}, 0.8);
mono("glitch.wav", 0.5, (t) => (Math.floor(t * 60) % 2 ? noise() * 0.7 : Math.sign(Math.sin(TAU * 330 * t)) * 0.4) * (Math.floor(t * 23) % 3 ? 1 : 0) * Math.max(0, 1 - t / 0.5), 0.5);

console.log(`audio written (${DUR.toFixed(1)}s). events:`, Object.fromEntries(Object.entries(ev).map(([k, v]) => [k, Array.isArray(v) ? v.map((x) => x.toFixed(2)) : v.toFixed(2)])));
