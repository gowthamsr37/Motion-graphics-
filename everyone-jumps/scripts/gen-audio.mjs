// Original score + sound design, synthesized from scratch (no samples, deterministic).
// Reads src/timeline.json and mirrors the scene beat maths, so every hit lands on the same frame
// as the visual it belongs to. Writes public/audio/score.wav and public/audio/sfx.wav (48 kHz stereo).
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "audio");
mkdirSync(OUT, { recursive: true });
const TL = JSON.parse(readFileSync(join(ROOT, "src", "timeline.json"), "utf8"));
const SR = 48000, FPS = 30, TAU = Math.PI * 2;
const DUR = TL.total;
const N = Math.ceil(DUR * SR);

// ---------- timeline helpers (mirror src/timing.ts) ----------
const sc = (id) => TL.scenes.find((s) => s.id === id);
const fromF = (id) => Math.round(sc(id).start * FPS);
const durF = (id) => Math.round((sc(id).start + sc(id).duration) * FPS) - fromF(id);
const voF = (id) => Math.round((sc(id).vo.at - sc(id).start) * FPS);
const norm = (w) => w.toLowerCase().replace(/[^a-z0-9]/g, "");
const W = (id, p, nth = 0) => {
  const ws = sc(id).vo.words;
  const ex = ws.filter((w) => norm(w.w) === norm(p));
  const hits = ex.length ? ex : ws.filter((w) => norm(w.w).startsWith(norm(p)));
  return voF(id) + Math.round(hits[nth].s * FPS); // frame relative to scene
};
const at = (id, relF) => (fromF(id) + relF) / FPS; // seconds absolute
const S = (id) => fromF(id) / FPS;
const E = (id) => (fromF(id) + durF(id)) / FPS;

// ---------- story events (mirror the scene files) ----------
const PEAK = Math.sqrt(2 * 9.81 * 0.3) / 9.81, AIR = 2 * PEAK;
const s1cut = W("s1", "Earth") + 2;
const s1slot = Math.floor((durF("s1") - s1cut) / 4);
const s2 = { grid: W("s2", "counting") + 4, f3: W("s2", "Three"), f2: W("s2", "Two"), f1: W("s2", "One"), fj: W("s2", "Jump") };
const slowT = (frame) => { let t = PEAK; for (let f = 8; f < frame; f++) t += Math.min(1, Math.max(0.3, 0.3 + (0.7 * (f - 62)) / 22)) / FPS; return t; };
let s5land = 0; for (let f = 0; f < 200; f++) if (slowT(f) >= AIR) { s5land = f; break; }
const ev = {
  open: 0,
  cut: at("s1", s1cut),
  cities: [0, 1, 2, 3].map((i) => at("s1", s1cut + i * s1slot - 6)),
  silence: E("s1") - 0.45,
  grid: at("s2", s2.grid),
  f3: at("s2", s2.f3), f2: at("s2", s2.f2), f1: at("s2", s2.f1), fj: at("s2", s2.fj),
  freeze: at("s2", s2.fj + Math.round(PEAK * FPS)),
  toEarth: at("s3", 20),
  shake: at("s3", W("s3", "shake")), quake: at("s3", W("s3", "earthquake")), orbit: at("s3", W("s3", "knock")),
  reveal: at("s4", W("s4", "Surprisingly")),
  nothing: at("s4", W("s4", "nothing")),
  bB: at("s4", W("s4", "We") - 8), pushA: at("s4", W("s4", "push")), pushB: at("s4", W("s4", "pushes")), takeB: at("s4", W("s4", "pushes") + 7),
  bC: at("s4", W("s4", "So") - 4), row1: at("s4", W("s4", "planet")), row2: at("s4", W("s4", "but")), call: at("s4", W("s4", "ten") - 2), trillion: at("s4", W("s4", "trillion") - 2),
  bD: at("s4", W("s4", "Even") - 6), takeD: at("s4", W("s4", "spot") + 6), landD: at("s4", W("s4", "spot") + 6 + Math.round((AIR / 0.45) * FPS)), shift: at("s4", W("s4", "shift")), atom: at("s4", W("s4", "atom")),
  bE: at("s4", W("s4", "spread") - 8), spread: at("s4", W("s4", "spread")), cancel: at("s4", W("s4", "cancel")),
  s5: S("s5"), land: at("s5", s5land), noise: at("s5", W("s5", "noise") - 2), vib: at("s5", W("s5", "vibrations") - 2),
  cmp: at("s5", W("s5", "But") - 6), quake5: at("s5", W("s5", "But") - 6 + 12), neq: at("s5", W("s5", "nothing")),
  carry: at("s5", W("s5", "No") - 8), no1: at("s5", W("s5", "No") + 5), no2: at("s5", W("s5", "tsunami") + 1), no3: at("s5", W("s5", "change") + 1),
  s6: S("s6"), l1: at("s6", W("s6", "8.3") - 2), l2: at("s6", W("s6", "One") - 2), l3: at("s6", W("s6", "And") - 2), massive: at("s6", W("s6", "massive")), q: at("s6", W("s6", "what") - 4),
};

// ---------- dsp utils ----------
let seed = 9137;
const rand = () => { seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const noise = () => rand() * 2 - 1;
const smp = (t) => Math.round(t * SR);
function wavStereo(L, R) {
  const n = L.length, buf = Buffer.alloc(44 + n * 4);
  buf.write("RIFF", 0); buf.writeUInt32LE(36 + n * 4, 4); buf.write("WAVE", 8); buf.write("fmt ", 12);
  buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write("data", 36); buf.writeUInt32LE(n * 4, 40);
  for (let i = 0; i < n; i++) {
    buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i])) * 32767), 44 + i * 4);
    buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i])) * 32767), 46 + i * 4);
  }
  return buf;
}
function add(L, R, t0, dur, pan, fn) {
  const s0 = smp(t0), n = smp(dur);
  const gl = Math.cos(((pan + 1) * Math.PI) / 4), gr = Math.sin(((pan + 1) * Math.PI) / 4);
  for (let i = 0; i < n; i++) {
    const k = s0 + i;
    if (k >= L.length) break;
    if (k < 0) continue;
    const v = fn(i / SR);
    L[k] += v * gl; R[k] += v * gr;
  }
}
const TBL = 4096, SAW = new Float32Array(TBL);
for (let i = 0; i < TBL; i++) { let v = 0; for (let k = 1; k <= 14; k++) v += Math.sin((TAU * k * i) / TBL) / k; SAW[i] = v * 0.55; }
const saw = (ph) => SAW[Math.floor((ph / TAU) * TBL) & (TBL - 1)];
const note = (name) => {
  const map = { C: -9, "C#": -8, Db: -8, D: -7, "D#": -6, Eb: -6, E: -5, F: -4, "F#": -3, G: -2, "G#": -1, Ab: -1, A: 0, Bb: 1, B: 2 };
  const m = name.match(/^([A-G][#b]?)(\d)$/);
  return 440 * 2 ** ((map[m[1]] + (Number(m[2]) - 4) * 12) / 12);
};
const ch = (...names) => names.map(note);

// ---------- instruments ----------
function strings(L, R, t0, dur, freqs, amp, att = 1.2, rel = 1.5, bright = 0.05, trem = 0) {
  freqs.forEach((f, ni) => {
    for (let v = 0; v < 4; v++) {
      const det = 1 + (v - 1.5) * 0.0018;
      const pan = ((ni / Math.max(1, freqs.length - 1)) * 2 - 1) * 0.55 + (v % 2 ? 0.15 : -0.15);
      let ph = rand() * TAU, lp = 0;
      const vib = 4.4 + rand() * 0.9, trph = rand() * TAU;
      add(L, R, t0, dur + rel, pan, (t) => {
        ph += (TAU * f * det * (1 + 0.0025 * Math.sin(TAU * vib * t))) / SR;
        lp += bright * (saw(ph) - lp);
        const env = Math.min(1, t / att) * (t > dur ? Math.max(0, 1 - (t - dur) / rel) : 1);
        const tr = trem ? 0.55 + 0.45 * Math.sin(TAU * trem * t + trph) : 1;
        return lp * env * amp * 0.24 * tr;
      });
    }
  });
}
function pad(L, R, t0, dur, freqs, amp, att = 1.5, rel = 2) { // soft sine/tri pad for the wonder sections
  freqs.forEach((f, ni) => {
    for (const det of [0.997, 1.0, 1.004]) {
      let p1 = rand() * TAU, p2 = rand() * TAU;
      add(L, R, t0, dur + rel, (ni % 2 ? 0.35 : -0.35) * (det - 1) * 250, (t) => {
        p1 += (TAU * f * det) / SR; p2 += (TAU * f * det * 2) / SR;
        const env = Math.min(1, t / att) * (t > dur ? Math.max(0, 1 - (t - dur) / rel) : 1);
        return (Math.sin(p1) + 0.18 * Math.sin(p2)) * env * amp * 0.12 * (1 + 0.08 * Math.sin(TAU * 0.3 * t + ni));
      });
    }
  });
}
function drone(L, R, t0, dur, f, amp, att = 2, rel = 2) {
  let p1 = 0, p2 = 0;
  add(L, R, t0, dur + rel, 0, (t) => {
    p1 += (TAU * f) / SR; p2 += (TAU * f * 2.003) / SR;
    const env = Math.min(1, t / att) * (t > dur ? Math.max(0, 1 - (t - dur) / rel) : 1);
    return (Math.sin(p1) * 0.8 + Math.sin(p2) * 0.25) * env * amp * (1 + 0.15 * Math.sin(TAU * 0.13 * t));
  });
}
function piano(L, R, t0, f, vel = 0.5, pan = 0, dur = 3.5) {
  const B = 0.00035;
  const parts = Array.from({ length: 8 }, (_, k) => ({ f: (k + 1) * f * Math.sqrt(1 + B * (k + 1) ** 2), a: vel / (k + 1) ** 1.3, d: 0.6 + 0.65 * k, ph: 0 }));
  add(L, R, t0, dur, pan, (t) => {
    let v = 0;
    for (const p of parts) { p.ph += (TAU * p.f) / SR; v += Math.sin(p.ph) * p.a * Math.exp(-t * p.d); }
    return v * Math.min(1, t / 0.004) * Math.min(1, (dur - t) / 0.3);
  });
}
function bell(L, R, t0, f, amp, pan = 0) { // glassy chime for reveals
  const parts = [[1, 1, 1.2], [2.76, 0.45, 2.2], [5.4, 0.25, 3.5], [8.93, 0.12, 5]];
  add(L, R, t0, 4, pan, (t) => parts.reduce((s, [m, g, d]) => s + Math.sin(TAU * f * m * t) * g * Math.exp(-t * d), 0) * amp * Math.min(1, t / 0.002));
}
function timpani(L, R, t0, f, amp, pan = 0) {
  let ph = 0, lp = 0;
  add(L, R, t0, 2.4, pan, (t) => {
    ph += (TAU * f * (1 - 0.08 * Math.min(1, t * 6))) / SR;
    lp += 0.08 * (noise() - lp);
    return (Math.sin(ph) * Math.exp(-t * 2.0) + lp * Math.exp(-t * 18) * 1.5) * amp;
  });
}
function sub(L, R, t0, amp, f0 = 62, f1 = 34, decay = 2.6) { // cinematic sub drop
  let ph = 0;
  add(L, R, t0, 3, 0, (t) => { ph += (TAU * (f1 + (f0 - f1) * Math.exp(-t * 5))) / SR; return Math.sin(ph) * Math.exp(-t * decay) * amp * Math.min(1, t / 0.003); });
}
function crash(L, R, t0, amp, dec = 1.5) {
  for (const pan of [-0.45, 0.45]) {
    let hp = 0, prev = 0;
    add(L, R, t0, 3.4, pan, (t) => { const x = noise(); hp = 0.9 * (hp + x - prev); prev = x; return hp * Math.exp(-t * dec) * amp * Math.min(1, t / 0.004); });
  }
}
function heartbeat(L, R, t0, amp) {
  for (const [dt, a] of [[0, 1], [0.19, 0.65]]) {
    let ph = 0;
    add(L, R, t0 + dt, 0.4, 0, (t) => { ph += (TAU * (58 - 18 * t)) / SR; return Math.sin(ph) * Math.exp(-t * 12) * amp * a; });
  }
}
function riser(L, R, t0, dur, amp) {
  let lp = 0, ph = 0;
  add(L, R, t0, dur, 0, (t) => {
    const k = t / dur;
    lp += (0.01 + 0.3 * k * k) * (noise() - lp);
    ph += (TAU * (180 + 900 * k * k)) / SR;
    return (lp * 1.4 + Math.sin(ph) * 0.25) * k * k * amp;
  });
}
function whoosh(L, R, t0, dur, amp, pan = 0, up = true) {
  let lp = 0, bp = 0;
  add(L, R, t0, dur, pan, (t) => {
    const k = t / dur;
    const c = up ? 0.02 + 0.3 * Math.sin(Math.PI * k) : 0.3 - 0.27 * k;
    lp += c * (noise() - lp); bp += 0.08 * (lp - bp);
    return (lp - bp) * Math.sin(Math.PI * k) ** 1.6 * amp;
  });
}
function tick(L, R, t0, amp, f = 2400, pan = 0) {
  add(L, R, t0, 0.06, pan, (t) => (Math.sin(TAU * f * t) * 0.6 + noise() * 0.35) * Math.exp(-t * 140) * amp);
}
function pop(L, R, t0, amp, f0 = 900, pan = 0) {
  let ph = 0;
  add(L, R, t0, 0.2, pan, (t) => { ph += (TAU * (f0 * (0.45 + 0.55 * Math.exp(-t * 40)))) / SR; return Math.sin(ph) * Math.exp(-t * 22) * amp; });
}
function thump(L, R, t0, amp, f = 70, pan = 0, dec = 18) {
  let ph = 0, lp = 0;
  add(L, R, t0, 0.5, pan, (t) => {
    ph += (TAU * f * (1 - 0.35 * Math.min(1, t * 8))) / SR; lp += 0.2 * (noise() - lp);
    return (Math.sin(ph) * Math.exp(-t * dec) + lp * Math.exp(-t * 60) * 0.7) * amp;
  });
}
function rumble(L, R, t0, dur, amp, rate = 0.6) {
  let lp1 = 0, lp2 = 0, ph = 0;
  add(L, R, t0, dur, 0, (t) => {
    lp1 += 0.012 * (noise() - lp1); lp2 += 0.012 * (lp1 - lp2); ph += (TAU * 38) / SR;
    const env = Math.sin(Math.PI * Math.min(1, t / dur)) ** 0.7;
    return (lp2 * 9 + Math.sin(ph) * 0.25) * env * amp * (0.8 + 0.2 * Math.sin(TAU * rate * t));
  });
}
function crowd(L, R, t0, dur, amp, att = 0.6, rel = 0.8) { // distant crowd murmur
  for (const [B, c2] of [[L, 0], [R, 1]]) {
    let b1 = 0, b2 = 0, fl = 0;
    const s0 = smp(t0), n = smp(dur);
    for (let i = 0; i < n && s0 + i < B.length; i++) {
      const t = i / SR, x = noise();
      b1 += 0.07 * (x - b1); b2 += 0.07 * (b1 - b2); fl += 0.002 * (noise() - fl);
      const env = Math.min(1, t / att) * Math.min(1, (dur - t) / rel);
      B[s0 + i] += (b1 - b2 * 0.6) * (1 + 7 * fl) * env * amp * (c2 ? 1.05 : 0.95);
    }
  }
}
function shout(L, R, t0, amp) { // a crowd's collective "hup!" — short voiced burst
  for (let v = 0; v < 26; v++) {
    const f = 140 + rand() * 180, dt = rand() * 0.07, pan = rand() * 1.6 - 0.8;
    let ph = rand() * TAU, lp = 0;
    add(L, R, t0 + dt, 0.42, pan, (t) => {
      ph += (TAU * f * (1 + 0.25 * Math.exp(-t * 12))) / SR;
      lp += 0.25 * (saw(ph) - lp);
      return lp * Math.min(1, t / 0.02) * Math.exp(-t * 7) * amp * 0.12;
    });
  }
}
function shimmer(L, R, t0, dur, amp) {
  ch("A5", "E6", "A6", "C#7").forEach((f, i) => {
    let ph = rand() * TAU;
    add(L, R, t0, dur, i % 2 ? 0.5 : -0.5, (t) => {
      ph += (TAU * f * (1 + 0.003 * Math.sin(TAU * 5 * t + i))) / SR;
      const env = Math.min(1, t / 0.3) * Math.min(1, (dur - t) / 0.8);
      return Math.sin(ph) * env * amp * 0.25 * (0.6 + 0.4 * Math.sin(TAU * (3 + i) * t));
    });
  });
}
function landing(L, R, t0, amp) { // 1000s of feet: dense cluster of low thumps, pitched down for slow motion
  for (let i = 0; i < 90; i++) thump(L, R, t0 + Math.abs(noise()) * 0.18 * (rand() < 0.8 ? 0.4 : 1), amp * (0.25 + 0.3 * rand()), 52 + rand() * 40, rand() * 1.6 - 0.8, 12);
  sub(L, R, t0, amp * 1.4, 70, 28, 1.6);
  // grit + dust
  let lp = 0;
  add(L, R, t0 + 0.02, 1.2, 0, (t) => { lp += 0.1 * (noise() - lp); return lp * Math.exp(-t * 4) * amp * 0.5; });
}

function reverb(X, wet, delaysMs, shift) {
  const Y = new Float32Array(X.length);
  for (const d of delaysMs.map((m) => Math.round(((m + shift) * SR) / 1000))) {
    const buf = new Float32Array(d); let idx = 0, lp = 0;
    for (let i = 0; i < X.length; i++) { const o = buf[idx]; lp = o * 0.55 + lp * 0.45; buf[idx] = X[i] + lp * 0.84; idx = (idx + 1) % d; Y[i] += o / delaysMs.length; }
  }
  for (const [ms, g] of [[5.0, 0.7], [1.7, 0.7]]) {
    const d = Math.round((ms * SR) / 1000); const buf = new Float32Array(d); let idx = 0;
    for (let i = 0; i < Y.length; i++) { const b = buf[idx]; const v = -g * Y[i] + b; buf[idx] = Y[i] + g * v; idx = (idx + 1) % d; Y[i] = v; }
  }
  for (let i = 0; i < X.length; i++) X[i] = X[i] * (1 - wet) + Y[i] * wet * 2.2;
}
const finish = (L, R, peak, name, wet = 0.3) => {
  if (wet) { reverb(L, wet, [31.7, 37.1, 41.1, 47.3], 0); reverb(R, wet, [31.7, 37.1, 41.1, 47.3], 1.3); }
  for (let i = 0; i < N; i++) { L[i] = Math.tanh(L[i] * 1.1); R[i] = Math.tanh(R[i] * 1.1); }
  let m = 0;
  for (let i = 0; i < N; i++) m = Math.max(m, Math.abs(L[i]), Math.abs(R[i]));
  for (let i = 0; i < N; i++) { L[i] *= peak / m; R[i] *= peak / m; }
  const fo = smp(0.6);
  for (let i = N - fo; i < N; i++) { const g = (N - i) / fo; L[i] *= g; R[i] *= g; }
  writeFileSync(join(OUT, name), wavStereo(L, R));
  console.log(name, "written");
};

// ======================= SCORE =======================
{
  const L = new Float32Array(N), R = new Float32Array(N);
  const Dm = ch("D3", "F3", "A3"), Dm_lo = ch("D2", "A2", "D3", "F3"), Bb = ch("Bb2", "D3", "F3"), F = ch("F2", "C3", "F3", "A3"), C = ch("C3", "E3", "G3"), Gm = ch("G2", "D3", "G3", "Bb3"), A = ch("A2", "C#3", "E3");
  // S1 — impact, suspense pulse, then a breath of silence
  sub(L, R, 0, 0.9, 70, 30, 1.4);
  timpani(L, R, 0, note("D2"), 0.55);
  strings(L, R, 0.02, ev.silence - 0.1, Dm_lo, 0.26, 0.25, 0.35, 0.05);
  drone(L, R, 0, ev.silence - 0.2, note("D1"), 0.22, 0.05, 0.3);
  for (let t = 0.75; t < ev.silence - 0.3; t += 0.78) heartbeat(L, R, t, 0.34);
  // S2 — the countdown build
  drone(L, R, S("s2"), ev.freeze - S("s2"), note("D1"), 0.2, 0.8, 0.05);
  strings(L, R, S("s2") + 0.1, ev.f3 - S("s2"), Dm, 0.2, 1.6, 0.4, 0.05);
  for (let t = S("s2") + 0.4; t < ev.f3 - 0.2; t += 0.55) tick(L, R, t, 0.12, 1800, 0);
  for (const [t, f] of [[ev.f3, "D2"], [ev.f2, "D2"], [ev.f1, "A1"]]) { timpani(L, R, t - 0.06, note(f), 0.6); sub(L, R, t - 0.06, 0.42, 60, 40, 4); }
  strings(L, R, ev.f3 - 0.06, ev.f2 - ev.f3, ch("D3", "F3", "A3", "D4"), 0.26, 0.05, 0.2, 0.07);
  strings(L, R, ev.f2 - 0.06, ev.f1 - ev.f2, ch("D3", "G3", "Bb3", "D4"), 0.28, 0.05, 0.2, 0.07);
  strings(L, R, ev.f1 - 0.06, ev.fj - ev.f1, ch("C#3", "E3", "A3", "C#4"), 0.3, 0.05, 0.1, 0.08);
  riser(L, R, ev.f1, ev.fj - ev.f1, 0.4);
  sub(L, R, ev.fj + 0.08, 1.0, 80, 28, 1.3);
  crash(L, R, ev.fj + 0.08, 0.3, 1.8);
  strings(L, R, ev.fj, ev.freeze - ev.fj + 0.05, ch("D3", "F#3", "A3", "D4", "F#4"), 0.6, 0.01, 0.15, 0.1);
  // freeze → suspended shimmer hangs in the air
  shimmer(L, R, ev.freeze, ev.toEarth + 1.4 - ev.freeze, 0.5);
  // S3 — suspense under the questions
  drone(L, R, ev.toEarth - 0.4, E("s3") - ev.toEarth + 0.5, note("D1"), 0.2, 1.0, 0.3);
  strings(L, R, ev.toEarth - 0.2, E("s3") - ev.toEarth, ch("D3", "F3", "Bb3"), 0.2, 1.0, 0.4, 0.05, 7);
  for (const t of [ev.shake, ev.quake, ev.orbit]) { timpani(L, R, t - 0.08, note("D2"), 0.42); sub(L, R, t - 0.08, 0.32, 55, 35, 3); }
  riser(L, R, ev.orbit + 0.4, ev.reveal - ev.orbit - 0.4, 0.3);
  // S4 — the reveal: warm wonder, a light piano arpeggio
  bell(L, R, ev.reveal, note("A5"), 0.22, 0.2);
  bell(L, R, ev.nothing, note("D6"), 0.16, -0.2);
  const prog4 = [[ev.reveal, ev.bB, F], [ev.bB, ev.bC, Bb], [ev.bC, ev.trillion, Dm_lo], [ev.trillion, ev.bD, C], [ev.bD, ev.landD, Gm], [ev.landD, ev.bE, Bb], [ev.bE, E("s4") + 0.3, F]];
  for (const [a, b, c] of prog4) pad(L, R, a, b - a + 0.2, c, 0.55, 0.5, 0.8);
  const arp = (t0, t1, chord, step, vel, oct = 2) => { for (let t = t0, k = 0; t < t1 - 0.05; t += step, k++) piano(L, R, t, chord[k % chord.length] * oct, vel, ((k % 3) - 1) * 0.35, 1.2); };
  arp(ev.reveal + 0.9, ev.bB, ch("F3", "A3", "C4", "F4"), 0.3, 0.07);
  arp(ev.bB, ev.bC, ch("Bb2", "D3", "F3", "Bb3"), 0.3, 0.07);
  arp(ev.bC, ev.trillion, ch("D3", "F3", "A3", "D4"), 0.3, 0.075);
  arp(ev.trillion, ev.bD, ch("C3", "E3", "G3", "C4"), 0.3, 0.075);
  arp(ev.landD, ev.bE, ch("Bb2", "D3", "F3", "Bb3"), 0.3, 0.07);
  arp(ev.bE, E("s4"), ch("F3", "A3", "C4", "F4"), 0.3, 0.08);
  for (let t = ev.reveal + 0.9; t < E("s4"); t += 1.2) timpani(L, R, t, note("F2"), 0.12);
  // S5 — landing: drop out for the slow-motion impact, then carry on
  drone(L, R, S("s5"), ev.land - S("s5") + 0.3, note("D1"), 0.25, 0.3, 0.4);
  shimmer(L, R, S("s5"), ev.land - S("s5") + 0.2, 0.25);
  pad(L, R, ev.land + 0.6, ev.cmp - ev.land - 0.4, F, 0.45, 1.2, 0.6);
  arp(ev.land + 1.4, ev.cmp, ch("F3", "A3", "C4", "F4"), 0.3, 0.06);
  pad(L, R, ev.cmp, ev.carry - ev.cmp, Dm_lo, 0.45, 0.6, 0.6);
  arp(ev.cmp, ev.carry, ch("D3", "F3", "A3", "D4"), 0.3, 0.065);
  pad(L, R, ev.carry, E("s5") - ev.carry + 0.2, F, 0.5, 0.6, 0.6);
  arp(ev.carry, E("s5"), ch("F3", "A3", "C4", "F4"), 0.25, 0.08);
  for (let t = ev.carry; t < E("s5"); t += 1.0) timpani(L, R, t, note("F2"), 0.14);
  // S6 — resolution swell, final chord, a question left hanging
  strings(L, R, S("s6"), ev.massive - S("s6"), ch("F2", "C3", "F3", "A3", "C4"), 0.42, 2.5, 0.8, 0.05);
  strings(L, R, ev.massive - 0.1, ev.q - ev.massive + 0.3, ch("Bb2", "F3", "Bb3", "D4", "F4"), 0.46, 0.6, 1.0, 0.06);
  timpani(L, R, ev.massive - 0.1, note("F2"), 0.45);
  bell(L, R, ev.massive, note("F5"), 0.14, 0.3);
  pad(L, R, ev.q - 0.2, E("s6") - ev.q, ch("F3", "C4", "G4", "A4"), 0.5, 0.8, 1.6);
  [["C5", 0], ["F5", 0.32], ["G5", 0.64], ["A5", 1.1]].forEach(([nt, dt]) => piano(L, R, ev.q + dt, note(nt), 0.16, 0.15, 3.2));
  finish(L, R, 0.88, "score.wav", 0.34);
}

// ======================= SFX =======================
{
  const L = new Float32Array(N), R = new Float32Array(N);
  // space ambience bed (very low)
  rumble(L, R, 0, DUR, 0.05, 0.1);
  // S1
  for (let i = 0; i < 26; i++) tick(L, R, 0.1 + 1.2 * (i / 26) ** 1.6, 0.18, 2900 - i * 30, 0.2);
  ev.cities.forEach((t, i) => whoosh(L, R, t - 0.02, 0.32, 0.55, i % 2 ? 0.4 : -0.4));
  crowd(L, R, ev.cut - 0.2, ev.silence - ev.cut + 0.1, 0.07, 0.3, 0.25);
  // S2
  whoosh(L, R, S("s2"), 1.6, 0.35, 0.2);
  whoosh(L, R, ev.grid - 0.1, 0.45, 0.5, -0.2);
  crowd(L, R, ev.grid, ev.freeze - ev.grid, 0.09, 0.8, 0.05);
  for (const t of [ev.f3, ev.f2, ev.f1]) tick(L, R, t, 0.35, 1500);
  shout(L, R, ev.fj + 0.02, 0.7);
  whoosh(L, R, ev.fj - 0.05, 0.5, 0.75, 0, true);
  // freeze: a reversed swell into a hard stop
  { let lp = 0; add(L, R, ev.freeze - 0.35, 0.36, 0, (t) => { const k = t / 0.36; lp += (0.02 + 0.4 * k) * (noise() - lp); return lp * k ** 2.5 * 0.8; }); }
  thump(L, R, ev.freeze, 0.5, 90, 0, 10);
  // S3
  whoosh(L, R, ev.toEarth - 0.2, 0.7, 0.45);
  rumble(L, R, ev.quake - 0.05, 1.8, 0.22, 3);
  whoosh(L, R, ev.orbit + 0.4, 1.4, 0.35, 0.5, false);
  // S4
  whoosh(L, R, ev.bB - 0.2, 0.9, 0.4);
  whoosh(L, R, ev.pushA, 0.35, 0.3, -0.3, false);
  whoosh(L, R, ev.pushB, 0.35, 0.3, 0.3);
  thump(L, R, ev.takeB - 0.05, 0.28, 80);
  thump(L, R, ev.takeB + AIR, 0.32, 70);
  whoosh(L, R, ev.bC - 0.15, 0.8, 0.38);
  pop(L, R, ev.row1, 0.25, 700); pop(L, R, ev.row2, 0.25, 600); pop(L, R, ev.call, 0.3, 1100, 0.4);
  whoosh(L, R, ev.bD - 0.15, 0.7, 0.32);
  { let ph = 0; add(L, R, ev.takeD, ev.landD - ev.takeD + 0.4, 0, (t) => { ph += (TAU * 42) / SR; return Math.sin(ph) * Math.sin(Math.PI * Math.min(1, t / (ev.landD - ev.takeD))) * 0.12; }); } // the recoil "breath"
  thump(L, R, ev.landD, 0.35, 60, 0, 10);
  pop(L, R, ev.shift, 0.22, 800); bell(L, R, ev.atom, note("E6"), 0.08, 0.2);
  for (let i = 0; i < 14; i++) tick(L, R, ev.spread + (i * 1.5) / FPS, 0.12, 2000 + i * 40, ((i % 5) - 2) * 0.3);
  pop(L, R, ev.cancel + 0.2, 0.3, 500);
  // S5
  { let lp = 0; add(L, R, ev.s5, ev.land - ev.s5, 0, (t) => { lp += 0.03 * (noise() - lp); return lp * (t / (ev.land - ev.s5)) ** 2 * 0.45; }); } // slow-motion air
  landing(L, R, ev.land, 0.3);
  crowd(L, R, ev.land + 0.1, ev.cmp - ev.land, 0.1, 0.1, 0.5);
  pop(L, R, ev.noise, 0.2, 900, -0.3); pop(L, R, ev.vib, 0.2, 760, -0.3);
  whoosh(L, R, ev.cmp - 0.15, 0.6, 0.4);
  for (let t = ev.cmp + 0.2; t < ev.quake5; t += 0.09) tick(L, R, t + rand() * 0.05, 0.05, 1200 + rand() * 900, -0.5);
  for (let t = ev.cmp + 0.2; t < ev.carry - 0.3; t += 0.11) tick(L, R, t + rand() * 0.05, 0.04, 1300 + rand() * 900, -0.5); // scattered tiny taps (left card)
  rumble(L, R, ev.quake5, 2.4, 0.26, 2.2); // one quake (right card)
  pop(L, R, ev.neq, 0.3, 650);
  whoosh(L, R, ev.carry - 0.15, 0.8, 0.38);
  for (const t of [ev.no1, ev.no2, ev.no3]) { tick(L, R, t, 0.25, 1600); pop(L, R, t + 0.01, 0.18, 520); }
  // S6
  whoosh(L, R, ev.s6, 5.2, 0.38, 0, true);
  for (const t of [ev.l1, ev.l2, ev.l3]) pop(L, R, t + 0.05, 0.16, 640);
  finish(L, R, 0.8, "sfx.wav", 0.18);
}
console.log(JSON.stringify({ cut: ev.cut.toFixed(2), fj: ev.fj.toFixed(2), freeze: ev.freeze.toFixed(2), reveal: ev.reveal.toFixed(2), land: ev.land.toFixed(2), massive: ev.massive.toFixed(2) }));
