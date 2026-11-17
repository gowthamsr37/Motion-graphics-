// Original score + sound design, synthesized from scratch (no samples, deterministic).
// Reads src/timeline.json and mirrors each scene's beat maths, so every hit lands on its frame.
// Writes public/audio/score.wav and public/audio/sfx.wav (48 kHz stereo).
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
  return voF(id) + Math.round(hits[nth].s * FPS);
};
const at = (id, f) => (fromF(id) + f) / FPS;
const S = (id) => fromF(id) / FPS;
const E = (id) => (fromF(id) + durF(id)) / FPS;

// ---------- events (mirror the scene files) ----------
const s3cd0 = durF("s3") - Math.round(3.3 * FPS) + 4;
const s6 = { but: W("s6", "But"), est: W("s6", "estimated"), three: W("s6", "three"), pts: W("s6", "points.") };
// floodlights come on when time-of-day passes ~0.52 (between "But"-10 → 0.33 and "estimated" → 0.66)
const lightsOn = at("s6", Math.round(s6.but - 10 + (s6.est - (s6.but - 10)) * 0.55));
const s9land = W("s9", "winner.") - 4;
const landT = (() => { const g = 9.81, h0 = 0.95, rest = 0.0125 + 0.0055; return Math.sqrt((2 * (h0 - rest)) / g); })();
const ev = {
  freeze: at("s1", W("s1", "toss")), resume: at("s1", W("s1", "Let's") + 2), ipl: at("s1", W("s1", "IPL") - 2),
  bars: ["fifty-four", "forty-nine", "fifty", "fifty-one"].map((w) => at("s2", W("s2", w))),
  dew3: at("s3", W("s3", "dew")), toss3: at("s3", W("s3", "toss") - 14), won3: at("s3", W("s3", "toss") + 16), choice: at("s3", W("s3", "Would") - 4),
  cd: [0, 1, 2].map((i) => at("s3", s3cd0 + Math.round(i * 0.95 * FPS))),
  bowl: at("s4", W("s4", "fifty-five")), bat: at("s4", W("s4", "forty-five")), corr: at("s4", W("s4", "But")),
  wait: S("s5"), y24: at("s5", W("s5", "forty-four")), y25: at("s5", W("s5", "sixty-one")), sim: at("s5", W("s5", "change") + 2 + 8),
  s6day: at("s6", W("s6", "daytime")), lights: lightsOn, s6three: at("s6", s6.three), dew: at("s6", s6.pts - 8),
  s7four: at("s7", W("s7", "four")), d1: at("s7", W("s7", "five")), d3: at("s7", W("s7", "pitch")), d5: at("s7", W("s7", "completely")),
  b1: at("s7", W("s7", "five") + 4), b5: at("s7", W("s7", "completely") + 16),
  cuts8: ["It's", "And", "pitch,", "weather,", "match", "conditions."].map((w) => at("s8", W("s8", w))),
  usually: at("s9", W("s9", "Usually,")), cond9: at("s9", W("s9", "conditions,")), toss9: at("s9", W("s9", "toss", 1)), land: at("s9", s9land) + 0.15 + landT,
  landCut: at("s9", s9land), beyond: at("s9", W("s9", "Beyond")), loop: E("s9") - 1.05,
};

// ---------- dsp utils ----------
let seed = 7151;
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
function pad(L, R, t0, dur, freqs, amp, att = 1.5, rel = 2) {
  freqs.forEach((f, ni) => {
    for (const det of [0.997, 1.0, 1.004]) {
      let p1 = rand() * TAU, p2 = rand() * TAU;
      add(L, R, t0, dur + rel, (ni % 2 ? 0.4 : -0.4), (t) => {
        p1 += (TAU * f * det) / SR; p2 += (TAU * f * det * 2) / SR;
        const env = Math.min(1, t / att) * (t > dur ? Math.max(0, 1 - (t - dur) / rel) : 1);
        return (Math.sin(p1) + 0.2 * Math.sin(p2)) * env * amp * 0.12 * (1 + 0.08 * Math.sin(TAU * 0.3 * t + ni));
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
function piano(L, R, t0, f, vel = 0.5, pan = 0, dur = 3) {
  const B = 0.00035;
  const parts = Array.from({ length: 8 }, (_, k) => ({ f: (k + 1) * f * Math.sqrt(1 + B * (k + 1) ** 2), a: vel / (k + 1) ** 1.3, d: 0.6 + 0.65 * k, ph: 0 }));
  add(L, R, t0, dur, pan, (t) => {
    let v = 0;
    for (const p of parts) { p.ph += (TAU * p.f) / SR; v += Math.sin(p.ph) * p.a * Math.exp(-t * p.d); }
    return v * Math.min(1, t / 0.004) * Math.min(1, (dur - t) / 0.3);
  });
}
function timpani(L, R, t0, f, amp, pan = 0) {
  let ph = 0, lp = 0;
  add(L, R, t0, 2.4, pan, (t) => {
    ph += (TAU * f * (1 - 0.08 * Math.min(1, t * 6))) / SR;
    lp += 0.08 * (noise() - lp);
    return (Math.sin(ph) * Math.exp(-t * 2.0) + lp * Math.exp(-t * 18) * 1.5) * amp;
  });
}
function sub(L, R, t0, amp, f0 = 62, f1 = 34, decay = 2.6) {
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
  add(L, R, t0, dur, 0, (t) => { const k = t / dur; lp += (0.01 + 0.3 * k * k) * (noise() - lp); ph += (TAU * (180 + 900 * k * k)) / SR; return (lp * 1.4 + Math.sin(ph) * 0.25) * k * k * amp; });
}
function reverseSwell(L, R, t0, dur, amp) { // reverse-cymbal into a hit at t0+dur
  let hp = 0, prev = 0;
  add(L, R, t0, dur, 0, (t) => { const x = noise(); hp = 0.85 * (hp + x - prev); prev = x; return hp * (t / dur) ** 3 * amp; });
}
function whoosh(L, R, t0, dur, amp, pan = 0) {
  let lp = 0, bp = 0;
  add(L, R, t0, dur, pan, (t) => { const k = t / dur; lp += (0.02 + 0.3 * Math.sin(Math.PI * k)) * (noise() - lp); bp += 0.08 * (lp - bp); return (lp - bp) * Math.sin(Math.PI * k) ** 1.6 * amp; });
}
function tick(L, R, t0, amp, f = 2400, pan = 0) { add(L, R, t0, 0.06, pan, (t) => (Math.sin(TAU * f * t) * 0.6 + noise() * 0.35) * Math.exp(-t * 140) * amp); }
function clack(L, R, t0, amp, pan = 0) { // crisp mechanical data hit
  let lp = 0;
  add(L, R, t0, 0.18, pan, (t) => { lp += 0.5 * (noise() - lp); return (Math.sin(TAU * 1250 * t) * Math.exp(-t * 60) * 0.6 + Math.sin(TAU * 180 * t) * Math.exp(-t * 35) * 0.8 + lp * Math.exp(-t * 120) * 0.6) * amp; });
}
function pop(L, R, t0, amp, f0 = 900, pan = 0) { let ph = 0; add(L, R, t0, 0.2, pan, (t) => { ph += (TAU * (f0 * (0.45 + 0.55 * Math.exp(-t * 40)))) / SR; return Math.sin(ph) * Math.exp(-t * 22) * amp; }); }
function thump(L, R, t0, amp, f = 70, pan = 0, dec = 18) {
  let ph = 0, lp = 0;
  add(L, R, t0, 0.5, pan, (t) => { ph += (TAU * f * (1 - 0.35 * Math.min(1, t * 8))) / SR; lp += 0.2 * (noise() - lp); return (Math.sin(ph) * Math.exp(-t * dec) + lp * Math.exp(-t * 60) * 0.7) * amp; });
}
// metal: an inharmonic coin ring
const COIN = [[2350, 0.5, 6], [3960, 0.35, 9], [5480, 0.25, 12], [7300, 0.15, 16], [1180, 0.2, 5]];
const ring = (t, decay) => COIN.reduce((s, [fr, g, d]) => s + Math.sin(TAU * fr * t) * g * Math.exp(-t * d * decay), 0);
function coinFlick(L, R, t0, amp, spin = 1.2) {
  let lp = 0;
  add(L, R, t0, spin, 0.1, (t) => { lp += 0.6 * (noise() - lp); const click = t < 0.01 ? (noise() - lp) * 1.2 : 0; const wob = 0.55 + 0.45 * Math.sin(TAU * 16 * t); return (click + ring(t, 0.6) * 0.55 * wob * Math.min(1, t / 0.004)) * amp; });
}
function spinShimmer(L, R, t0, dur, amp, rate = 3.2) { // the ringing flutter of a spinning coin
  add(L, R, t0, dur, 0, (t) => { const wob = 0.5 + 0.5 * Math.sin(TAU * rate * 2 * t); return ring(t % 0.5, 1.6) * 0.12 * wob * Math.min(1, t / 0.2) * Math.min(1, (dur - t) / 0.2) * amp; });
}
function coinLand(L, R, t0, amp) { // thud + bounces + an Euler's-disk rattle that speeds up and stops
  let lp = 0;
  add(L, R, t0, 0.35, 0, (t) => { lp += 0.3 * (noise() - lp); return (Math.sin(TAU * (160 - 60 * t) * t) * Math.exp(-t * 28) * 0.9 + lp * Math.exp(-t * 60) * 0.5 + ring(t, 1.2) * 0.55) * amp; });
  for (const [dt, a] of [[0.17, 0.5], [0.24, 0.3]]) add(L, R, t0 + dt, 0.4, 0, (t) => ring(t, 1.6) * a * amp);
  let tt = 0.32, period = 0.07, k = 0;
  while (tt < 1.6 && period > 0.006) {
    const a = 0.32 * Math.exp(-k / 22);
    add(L, R, t0 + tt, 0.06, 0, (t) => ring(t, 4) * a * amp);
    tt += period; period *= 0.93; k++;
  }
  add(L, R, t0 + tt, 1.6, 0, (t) => ring(t, 0.9) * 0.25 * amp); // final settle ring
}
function crowd(L, R, t0, dur, amp, att = 0.8, rel = 0.8) {
  for (const [B, c2] of [[L, 0], [R, 1]]) {
    let b1 = 0, b2 = 0, b3 = 0, b4 = 0, fl = 0;
    const s0 = smp(t0), n = smp(dur);
    for (let i = 0; i < n && s0 + i < B.length; i++) {
      const t = i / SR, x = noise();
      b1 += 0.07 * (x - b1); b2 += 0.07 * (b1 - b2); b3 += 0.3 * (x - b3); b4 += 0.02 * (b3 - b4);
      fl += 0.0015 * (noise() - fl);
      const env = Math.min(1, t / att) * Math.min(1, (dur - t) / rel);
      B[s0 + i] += ((b1 - b2 * 0.6) * 1.2 + (b3 - b4) * 0.18) * (1 + 6 * fl) * env * amp * (c2 ? 1.04 : 0.96);
    }
  }
}
function cheer(L, R, t0, dur, amp) {
  for (const B of [L, R]) {
    let b1 = 0, b2 = 0, b3 = 0, b4 = 0, fl = 0;
    const s0 = smp(t0), n = smp(dur);
    for (let i = 0; i < n && s0 + i < B.length; i++) {
      const t = i / SR, x = noise();
      b1 += 0.09 * (x - b1); b2 += 0.09 * (b1 - b2); b3 += 0.35 * (x - b3); b4 += 0.02 * (b3 - b4); fl += 0.0015 * (noise() - fl);
      const env = t < 0.4 ? t / 0.4 : Math.exp(-(t - 0.4) * 1.4);
      B[s0 + i] += ((b2 - b4 * 0.3) * 1.4 + (b3 - b4) * 0.35) * env * (1 + 6 * fl) * amp;
    }
  }
}
function wind(L, R, t0, dur, amp) {
  let lp = 0, lp2 = 0;
  add(L, R, t0, dur, 0, (t) => { lp += 0.004 * (noise() - lp); lp2 += 0.04 * (noise() - lp2); const env = Math.min(1, t / 1) * Math.min(1, (dur - t) / 1); return (lp * 9 + lp2 * 0.6) * env * amp * (0.7 + 0.3 * Math.sin(TAU * 0.2 * t)); });
}
function crackle(L, R, t0, dur, amp) { // dry soil crackling
  for (let t = 0; t < dur; t += 0.02 + rand() * 0.08) {
    const a = amp * (0.3 + rand() * 0.7), pan = rand() * 1.4 - 0.7;
    add(L, R, t0 + t, 0.03, pan, (tt) => noise() * Math.exp(-tt * 300) * a);
  }
}
function droplets(L, R, t0, dur, amp) {
  for (let t = 0; t < dur; t += 0.12 + rand() * 0.35) {
    const f = 1200 + rand() * 1600, a = amp * (0.4 + rand() * 0.6), pan = rand() * 1.4 - 0.7;
    add(L, R, t0 + t, 0.2, pan, (tt) => Math.sin(TAU * (f + 2200 * tt) * tt) * Math.exp(-tt * 38) * a);
  }
}
function floodOn(L, R, t0, amp) { // relay clunk + the rising hum of lamps striking
  thump(L, R, t0, amp * 0.9, 90, 0, 14);
  add(L, R, t0 + 0.05, 2.6, 0, (t) => { const env = Math.min(1, t / 1.2) * Math.min(1, (2.6 - t) / 0.8); return (Math.sin(TAU * 100 * t) * 0.5 + Math.sin(TAU * 200 * t) * 0.25 + noise() * 0.05) * env * amp * 0.35; });
}
function ballBounce(L, R, t0, amp) { // leather on a hard pitch
  let lp = 0;
  add(L, R, t0, 0.3, 0, (t) => { lp += 0.4 * (noise() - lp); return (Math.sin(TAU * 260 * t) * Math.exp(-t * 40) * 0.8 + lp * Math.exp(-t * 90) * 0.9) * amp; });
}
function shutter(L, R, t0, amp) {
  add(L, R, t0, 0.05, 0.2, (t) => noise() * Math.exp(-t * 200) * amp);
  add(L, R, t0 + 0.045, 0.05, 0.2, (t) => noise() * Math.exp(-t * 150) * amp * 0.8);
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
  const fo = smp(0.35);
  for (let i = N - fo; i < N; i++) { const g = (N - i) / fo; L[i] *= g; R[i] *= g; }
  writeFileSync(join(OUT, name), wavStereo(L, R));
  console.log(name, "written");
};

// ======================= SCORE =======================
{
  const L = new Float32Array(N), R = new Float32Array(N);
  const Dm = ch("D3", "F3", "A3"), Dm_lo = ch("D2", "A2", "D3", "F3"), Bb = ch("Bb2", "D3", "F3"), F = ch("F2", "C3", "F3", "A3"), C = ch("C3", "E3", "G3"), Gm = ch("G2", "D3", "G3", "Bb3"), A = ch("A2", "C#3", "E3");
  // S1 — suspense and curiosity; everything holds its breath on the freeze
  sub(L, R, 0, 0.7, 70, 30, 1.6);
  timpani(L, R, 0, note("D2"), 0.45);
  drone(L, R, 0, ev.freeze - 0.1, note("D1"), 0.2, 0.05, 0.15);
  strings(L, R, 0.02, ev.freeze - 0.1, Dm_lo, 0.22, 0.3, 0.12, 0.05);
  for (let t = 0.6; t < ev.freeze - 0.2; t += 0.75) heartbeat(L, R, t, 0.3);
  reverseSwell(L, R, ev.freeze - 0.5, 0.5, 0.25);
  strings(L, R, ev.freeze, ev.resume - ev.freeze, ch("A4", "D5", "E5"), 0.12, 0.6, 0.4, 0.04, 6); // suspended shimmer
  drone(L, R, ev.freeze, ev.resume - ev.freeze, note("D2"), 0.12, 0.3, 0.3);
  riser(L, R, ev.resume - 0.6, E("s1") - ev.resume + 0.6, 0.3);
  // S2 — the numbers: a curious staccato pulse
  pad(L, R, S("s2"), E("s2") - S("s2"), Dm, 0.5, 0.4, 0.6);
  for (let t = S("s2") + 0.2, k = 0; t < E("s2") - 0.2; t += 0.32, k++) piano(L, R, t, [note("D4"), note("A4"), note("F4"), note("A4")][k % 4], 0.06, ((k % 3) - 1) * 0.35, 0.8);
  for (let t = S("s2") + 0.2; t < E("s2"); t += 1.28) timpani(L, R, t, note("D2"), 0.1);
  // S3 — you are the captain: ticking anticipation, building
  drone(L, R, S("s3"), E("s3") - S("s3"), note("D1"), 0.18, 1, 0.3);
  strings(L, R, S("s3") + 0.2, ev.choice - S("s3"), Bb, 0.22, 2, 0.4, 0.045);
  strings(L, R, ev.choice, E("s3") - ev.choice, ch("C#3", "E3", "A3", "C#4"), 0.3, 0.4, 0.2, 0.06, 5);
  riser(L, R, ev.cd[0] - 0.4, E("s3") - ev.cd[0] + 0.3, 0.32);
  // S4 — reveal: a firm hit, then a thoughtful groove
  sub(L, R, S("s4"), 0.6, 60, 34, 2.2);
  timpani(L, R, S("s4"), note("D2"), 0.45);
  pad(L, R, S("s4"), ev.corr - S("s4"), F, 0.5, 0.3, 0.6);
  for (let t = S("s4") + 0.3, k = 0; t < ev.corr; t += 0.3, k++) piano(L, R, t, [note("F4"), note("C5"), note("A4"), note("C5")][k % 4], 0.06, ((k % 3) - 1) * 0.3, 0.8);
  pad(L, R, ev.corr, E("s4") - ev.corr, Gm, 0.5, 0.4, 0.4);
  // S5 — "But wait": dramatic transition, then tension over the swing
  reverseSwell(L, R, ev.wait - 0.45, 0.45, 0.4);
  sub(L, R, ev.wait, 1.0, 80, 28, 1.4);
  crash(L, R, ev.wait, 0.25, 1.6);
  strings(L, R, ev.wait + 0.3, ev.sim - ev.wait, ch("D3", "F3", "Bb3", "D4"), 0.26, 1.2, 0.5, 0.05, 7);
  for (let t = ev.wait + 1; t < ev.sim; t += 0.8) heartbeat(L, R, t, 0.22);
  pad(L, R, ev.sim - 0.4, E("s5") - ev.sim + 0.4, Dm_lo, 0.45, 0.6, 0.6);
  // S6 — the day-night experiment: atmospheric, evolving
  pad(L, R, S("s6"), ev.lights - S("s6"), ch("F3", "A3", "C4", "E4"), 0.55, 1.5, 1.5);
  pad(L, R, ev.lights - 0.5, E("s6") - ev.lights + 0.5, ch("D3", "F3", "A3", "C4"), 0.55, 1.5, 1.2);
  strings(L, R, ev.lights, E("s6") - ev.lights, ch("D2", "A2", "F3"), 0.22, 2.5, 1, 0.04);
  for (let t = S("s6") + 0.5, k = 0; t < E("s6") - 0.5; t += 0.6, k++) piano(L, R, t, [note("A4"), note("E5"), note("C5"), note("G5")][k % 4] * (t > ev.lights ? 0.8909 : 1), 0.04, ((k % 2) - 0.5) * 0.6, 1.6);
  // S7 — Test pitch: deep, low, patient
  drone(L, R, S("s7"), E("s7") - S("s7"), note("A1"), 0.2, 1, 0.5);
  strings(L, R, S("s7"), E("s7") - S("s7"), ch("A2", "E3", "C4"), 0.2, 1.5, 0.6, 0.04);
  timpani(L, R, ev.s7four - 0.05, note("A1"), 0.35);
  for (const t of [ev.d1, ev.d3, ev.d5]) timpani(L, R, t - 0.05, note("E2"), 0.25);
  // S8 — the lesson: warm, building
  pad(L, R, S("s8"), E("s8") - S("s8"), F, 0.5, 0.5, 0.6);
  for (let t = S("s8") + 0.2, k = 0; t < E("s8"); t += 0.25, k++) piano(L, R, t, [note("F4"), note("A4"), note("C5"), note("F5")][k % 4] * (k > 24 ? 1.122 : 1), 0.055, ((k % 3) - 1) * 0.3, 0.7);
  strings(L, R, S("s8") + 1, E("s8") - S("s8"), ch("F3", "A3", "C4", "F4"), 0.24, 3, 0.3, 0.05);
  // S9 — reflective resolution, then a held breath for the loop
  strings(L, R, S("s9"), ev.landCut - S("s9"), ch("Bb2", "F3", "Bb3", "D4"), 0.3, 1.5, 0.5, 0.05);
  pad(L, R, S("s9"), ev.landCut - S("s9"), Bb, 0.45, 1, 0.6);
  for (let t = S("s9") + 0.6, k = 0; t < ev.toss9; t += 0.5, k++) piano(L, R, t, [note("D5"), note("F5"), note("Bb4"), note("C5")][k % 4], 0.06, 0.2, 1.8);
  pad(L, R, ev.toss9 - 0.2, ev.landCut - ev.toss9, ch("C3", "F3", "A3", "C4"), 0.5, 0.6, 0.4);
  strings(L, R, ev.beyond - 0.6, ev.loop - ev.beyond + 0.4, ch("F2", "C3", "F3", "A3", "C4"), 0.36, 0.8, 0.4, 0.06);
  timpani(L, R, ev.beyond - 0.05, note("F2"), 0.4);
  [["F4", 0], ["A4", 0.18], ["C5", 0.36], ["F5", 0.9]].forEach(([nt, dt]) => piano(L, R, ev.beyond + dt, note(nt), 0.14, 0.1, 2.6));
  drone(L, R, ev.loop, E("s9") - ev.loop, note("D1"), 0.2, 0.05, 0.05); // the opening's drone returns for the loop
  finish(L, R, 0.88, "score.wav", 0.32);
}

// ======================= SFX =======================
{
  const L = new Float32Array(N), R = new Float32Array(N);
  // stadium ambience through the night-stadium scenes
  crowd(L, R, 0, E("s4"), 0.06, 0.2, 0.5);
  crowd(L, R, S("s3"), E("s3") - S("s3"), 0.05, 1, 0.5); // louder at pitch level
  crowd(L, R, S("s5"), E("s5") - S("s5"), 0.025, 0.5, 0.8);
  crowd(L, R, S("s6"), E("s6") - S("s6") - 1.5, 0.035, 1, 1.5);
  crowd(L, R, S("s9"), E("s9") - S("s9"), 0.055, 0.5, 0.3);
  // S1 — coin spinning, freeze, resume
  coinFlick(L, R, 0.0, 0.5, 1.0);
  spinShimmer(L, R, 0.05, ev.freeze - 0.05, 0.8);
  thump(L, R, ev.freeze, 0.45, 110, 0, 12);
  add(L, R, ev.freeze, 0.6, 0, (t) => ring(t, 0.4) * 0.12 * Math.exp(-t * 3)); // a held glint on the freeze
  pop(L, R, ev.ipl, 0.18, 760);
  spinShimmer(L, R, ev.resume, E("s1") - ev.resume, 0.6);
  whoosh(L, R, ev.resume + 0.1, E("s1") - ev.resume, 0.45);
  // S2 — crisp mechanical reveals
  whoosh(L, R, S("s2") - 0.1, 0.5, 0.3);
  ev.bars.forEach((t, i) => { clack(L, R, t - 0.03, 0.45, (i - 1.5) * 0.2); for (let k = 0; k < 6; k++) tick(L, R, t + k * 0.06, 0.08 * (1 - k / 6), 2600 - k * 120); });
  // S3 — captain: a clock ticking, the toss, the choice, the countdown
  for (let t = S("s3") + 0.5; t < ev.cd[0]; t += 0.5) tick(L, R, t, 0.06, 1500, 0);
  droplets(L, R, ev.dew3, 1.2, 0.05);
  coinFlick(L, R, ev.toss3, 0.4, 0.9);
  add(L, R, ev.toss3 + 1.0, 0.4, 0, (t) => ring(t, 2) * 0.2); // caught
  cheer(L, R, ev.won3 - 0.1, 2.2, 0.06);
  whoosh(L, R, ev.choice - 0.1, 0.5, 0.35, -0.3);
  whoosh(L, R, ev.choice + 0.08, 0.5, 0.35, 0.3);
  ev.cd.forEach((t) => { clack(L, R, t - 0.02, 0.5); tick(L, R, t + 0.02, 0.2, 1800); });
  for (let t = ev.cd[0]; t < E("s3") - 0.1; t += 0.24) tick(L, R, t + 0.12, 0.05, 2200, 0.2);
  // S4 — reveal
  whoosh(L, R, S("s4") - 0.1, 0.5, 0.35);
  clack(L, R, ev.bowl - 0.03, 0.45); clack(L, R, ev.bat - 0.03, 0.45);
  whoosh(L, R, ev.corr - 0.1, 0.6, 0.3);
  // S5 — "But wait", the bars, the coin, the simulation
  add(L, R, ev.wait, 0.25, 0, (t) => noise() * Math.exp(-t * 20) * 0.5); // hard cut
  clack(L, R, ev.y24 - 0.03, 0.5, -0.3); clack(L, R, ev.y25 - 0.03, 0.5, 0.3);
  spinShimmer(L, R, at("s5", W("s5", "In") + 4), ev.sim - at("s5", W("s5", "In") + 4), 0.45, 1.4);
  for (let i = 0; i < 48; i++) tick(L, R, ev.sim + (i * 1.4) / FPS, 0.07, 1900 + (i % 7) * 120, ((i % 5) - 2) * 0.25);
  // S6 — time-lapse air, the floodlights striking, dew forming
  wind(L, R, S("s6"), ev.lights - S("s6") + 1, 0.04);
  whoosh(L, R, S("s6") + 0.2, 2.5, 0.2);
  floodOn(L, R, ev.lights, 0.35);
  whoosh(L, R, ev.dew - 0.7, 0.8, 0.3);
  droplets(L, R, ev.dew, E("s6") - ev.dew, 0.08);
  // S7 — environmental: wind over the square, soil, the ball
  wind(L, R, S("s7"), E("s7") - S("s7"), 0.06);
  crackle(L, R, ev.d3, 0.8, 0.05);
  crackle(L, R, ev.d5, 1.4, 0.09);
  ballBounce(L, R, ev.b1 + 0.95 * 0.5, 0.5);
  ballBounce(L, R, ev.b5 + 0.95 * 0.5, 0.55);
  // S8 — montage: a shutter on every cut
  ev.cuts8.forEach((t) => shutter(L, R, t - 0.02, 0.18));
  droplets(L, R, ev.cuts8[5], E("s8") - ev.cuts8[5], 0.05);
  // S9 — the coin falls and lands; the loop flicks it back up
  spinShimmer(L, R, S("s9"), ev.landCut - S("s9"), 0.5, 2.4);
  whoosh(L, R, ev.landCut - 0.05, 0.5, 0.3);
  coinLand(L, R, ev.land, 0.75);
  cheer(L, R, ev.land + 0.05, 3.0, 0.035);
  coinFlick(L, R, ev.loop, 0.45, 1.0);
  spinShimmer(L, R, ev.loop + 0.05, E("s9") - ev.loop, 0.8);
  finish(L, R, 0.82, "sfx.wav", 0.16);
}
console.log(JSON.stringify({ freeze: ev.freeze.toFixed(2), lights: ev.lights.toFixed(2), land: ev.land.toFixed(2), loop: ev.loop.toFixed(2) }));
