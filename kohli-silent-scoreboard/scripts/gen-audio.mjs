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
const voF = (id) => Math.round((sc(id).vo.at - sc(id).start) * FPS);
const norm = (w) => w.toLowerCase().replace(/[^a-z0-9]/g, "");
const word = (id, prefix, fb) => {
  const w = sc(id).vo.words.find((x) => norm(x.w).startsWith(norm(prefix)));
  return (fromF(id) + voF(id) + Math.round((w ? w.s : fb) * FPS)) / FPS;
};
const sent = (id, i) => (fromF(id) + voF(id) + Math.round(sc(id).vo.segments[i].s * FPS)) / FPS;
const sentEnd = (id, i) => (fromF(id) + voF(id) + Math.round(sc(id).vo.segments[i].e * FPS)) / FPS;
const S = (id) => sc(id).start;
const E = (id) => sc(id).start + sc(id).duration;
const ev = {
  land: (fromF("s1") + voF("s1")) / FPS,
  nobody: sent("s2", 1),
  years: [word("s3", "68", 1.6), word("s3", "19", 3.6), word("s3", "28", 6.6), word("s3", "26", 9.6)],
  hundred: sentEnd("s6", 1) + 2 / FPS, // the hit: in the pause after "…against Afghanistan"
  spinStart: word("s6", "drought", 8.0) - 6 / FPS,
  spinEnd: word("s6", "over", 9.2) + 4 / FPS,
  until: word("s7", "until", 3.0),
  runs186: word("s7", "186", 6.2),
  climb: word("s8", "climbed", 2.2),
  brand: sent("s9", 3) - 4 / FPS,
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

// ---------- the score ----------
const ML = new Float32Array(N), MR = new Float32Array(N);
const n = (name) => {
  const map = { C: -9, "C#": -8, D: -7, "D#": -6, E: -5, F: -4, "F#": -3, G: -2, "G#": -1, A: 0, Bb: 1, B: 2 };
  const m = name.match(/^([A-G][#b]?)(\d)$/);
  return 440 * 2 ** ((map[m[1]] + (Number(m[2]) - 4) * 12) / 12);
};
const ch = (...names) => names.map(n);

// S1 — suspense: heartbeat pulse, low drone, silence when 1021 lands, then a thin high harmonic.
drone(ML, MR, 0, E("s1") + 0.5, n("D1"), 0.22, 0.6, 2);
for (let t = 0.15; t < E("s1") - 0.3; t += 0.83) heartbeat(ML, MR, t, t < ev.land ? 0.55 : 0.32);
strings(ML, MR, ev.land + 0.4, E("s1") - ev.land - 0.2, ch("A5"), 0.18, 2.0, 1.5, 0.12);
// S2 — warm, restrained: Dmaj7 strings + piano arpeggio; dims to D minor at "Nobody knew…"
strings(ML, MR, S("s2"), ev.nobody - S("s2"), ch("D3", "F#3", "A3", "C#4"), 0.55, 1.5, 1.2);
[["D4", 0], ["F#4", 0.62], ["A4", 1.24], ["C#5", 1.86], ["A4", 2.6], ["F#4", 3.2]].forEach(([nt, dt]) => piano(ML, MR, S("s2") + 0.3 + dt, n(nt), 0.32, 0.2));
strings(ML, MR, ev.nobody, E("s2") - ev.nobody + 0.5, ch("D3", "F3", "A3"), 0.5, 1.4, 1.4);
piano(ML, MR, ev.nobody + 0.2, n("A4"), 0.3, -0.2);
piano(ML, MR, ev.nobody + 1.1, n("F4"), 0.28, -0.2);
// S3 — the decline: one chord and one falling piano note per year, in step with the board clicks.
const yearChords = [ch("D3", "F3", "A3"), ch("Bb2", "D3", "F3"), ch("G2", "Bb2", "D3"), ch("A2", "C#3", "E3")];
const yearBass = ["D2", "Bb1", "G1", "A1"];
const yearNotes = ["A4", "F4", "E4", "D4"];
ev.years.forEach((t, i) => {
  const end = i < 3 ? ev.years[i + 1] : E("s3");
  strings(ML, MR, t - 0.2, end - t + 0.2, yearChords[i], 0.5, 1.0, 1.2);
  drone(ML, MR, t - 0.2, end - t + 0.2, n(yearBass[i]), 0.16, 0.8, 1.0);
  piano(ML, MR, t + 0.05, n(yearNotes[i]), 0.4, 0);
});
strings(ML, MR, S("s3"), ev.years[0] - S("s3"), ch("D3", "A3"), 0.35, 0.8, 0.8);
// S4 — sparse: low drone and lonely piano under the clock; near-silence before the twist.
drone(ML, MR, S("s4"), E("s4") - S("s4") - 0.8, n("D2"), 0.2, 1.2, 0.6);
strings(ML, MR, S("s4"), E("s4") - S("s4") - 0.9, ch("D3", "A3"), 0.3, 2.0, 0.6);
[0.6, 3.0, 5.4].forEach((dt, i) => piano(ML, MR, S("s4") + dt, n(["D4", "C4", "Bb3"][i]), 0.3, 0.1));
// S5 — the twist: harmony lifts Bb → C → D(sus), a rising string line.
strings(ML, MR, S("s5") + 0.1, 3.2, ch("Bb2", "D3", "F3"), 0.5, 0.6, 0.8);
strings(ML, MR, S("s5") + 3.3, 3.2, ch("C3", "E3", "G3"), 0.5, 0.6, 0.8);
strings(ML, MR, S("s5") + 6.5, E("s5") - S("s5") - 6.5, ch("D3", "G3", "A3"), 0.55, 0.8, 1.0);
strings(ML, MR, S("s5") + 2.0, E("s5") - S("s5") - 2.0, ch("A4"), 0.22, 3.5, 1.0, 0.1);
[["F4", 0.4], ["A4", 1.0], ["C5", 3.6], ["E5", 4.2], ["D5", 6.8], ["F#5", 7.6]].forEach(([nt, dt]) => piano(ML, MR, S("s5") + dt, n(nt), 0.3, 0.25));
// S6 — the breakthrough: crescendo on A into a full D-major hit on "unbeaten 122", then motion.
strings(ML, MR, S("s6"), ev.hundred - S("s6"), ch("A2", "E3", "A3", "C#4"), 0.65, ev.hundred - S("s6"), 0.15, 0.09);
timpRoll(ML, MR, ev.hundred - 2.0, 2.0, n("A1"), 0.35);
brassHit(ML, MR, ev.hundred, ch("D3", "F#3", "A3", "D4"), 0.9);
timpani(ML, MR, ev.hundred, n("D2"), 0.9);
crash(ML, MR, ev.hundred, 0.22);
strings(ML, MR, ev.hundred, E("s6") - ev.hundred + 0.6, ch("D3", "F#3", "A3", "D4", "F#4"), 0.75, 0.3, 1.5, 0.1);
for (let t = ev.hundred + 0.4; t < E("s6") - 0.4; t += 0.36) piano(ML, MR, t, n(["D5", "A4", "F#4", "A4"][Math.round((t - ev.hundred) / 0.36) % 4]), 0.18, 0.3, 1.5);
timpani(ML, MR, ev.spinEnd, n("D2"), 0.6);
crash(ML, MR, ev.spinEnd, 0.1);
// S7 — reflective, then warmth on the 186.
strings(ML, MR, S("s7"), ev.until - S("s7"), ch("B2", "D3", "F#3"), 0.45, 1.2, 1.0);
strings(ML, MR, ev.until, ev.runs186 - ev.until, ch("G2", "B2", "D3"), 0.5, 1.0, 0.8);
strings(ML, MR, ev.runs186 - 0.1, E("s7") - ev.runs186 + 0.8, ch("D3", "F#3", "A3", "D4"), 0.7, 0.5, 1.5, 0.09);
timpani(ML, MR, ev.runs186, n("D2"), 0.55);
[["B4", 0.4], ["F#4", 1.2], ["G4", ev.until - S("s7") + 0.2], ["A4", ev.until - S("s7") + 1.2]].forEach(([nt, dt]) => piano(ML, MR, S("s7") + dt, n(nt), 0.3, 0));
[["D5", 0], ["A4", 0.5], ["F#5", 1.0]].forEach(([nt, dt]) => piano(ML, MR, ev.runs186 + dt, n(nt), 0.3, 0.2));
// S8 — emotional peak: D – A – Bm – G with a piano melody, controlled.
const s8c = [ch("D3", "F#3", "A3", "D4"), ch("A2", "C#3", "E3", "A3"), ch("B2", "D3", "F#3", "B3"), ch("G2", "B2", "D3", "G3")];
const s8len = (E("s8") - S("s8")) / 4;
s8c.forEach((c, i) => strings(ML, MR, S("s8") + i * s8len, s8len + 0.2, c, 0.55, i === 0 ? 1.4 : 0.5, 0.8, 0.085));
["D2", "A1", "B1", "G1"].forEach((b, i) => drone(ML, MR, S("s8") + i * s8len, s8len, n(b), 0.18, 0.4, 0.6));
[["F#5", 0.2], ["E5", 0.9], ["D5", 1.6], ["E5", s8len + 0.2], ["C#5", s8len + 0.9], ["A4", s8len + 1.6], ["B4", 2 * s8len + 0.2], ["D5", 2 * s8len + 0.9], ["F#5", 2 * s8len + 1.6], ["G5", 3 * s8len + 0.2], ["F#5", 3 * s8len + 1.0]].forEach(([nt, dt]) => piano(ML, MR, S("s8") + dt, n(nt), 0.36, 0.15));
timpani(ML, MR, ev.climb, n("D2"), 0.4);
// S9 — reflective piano resolution, quiet ending.
strings(ML, MR, S("s9"), E("s9") - S("s9") - 1.0, ch("D3", "A3"), 0.35, 1.5, 2.0);
[["D3", "A3", "F#4", 0.3], ["B2", "F#3", "D4", 2.4], ["G2", "D3", "B3", 4.4], ["D3", "A3", "F#4", ev.brand - S("s9")]].forEach(([a, b, c, dt]) => {
  [a, b, c].forEach((nt, k) => piano(ML, MR, S("s9") + dt + k * 0.05, n(nt), 0.3 - k * 0.05, (k - 1) * 0.3, 5));
});
piano(ML, MR, ev.brand + 0.9, n("A5"), 0.18, 0.3, 4);

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
for (let i = Math.max(0, N - smp(1.2)); i < N; i++) { const g = (N - i) / smp(1.2); ML[i] *= g; MR[i] *= g; }
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
function cheer(name, dur, attack, peakAt) {
  const L = new Float32Array(smp(dur)), R = new Float32Array(smp(dur));
  for (const B of [L, R]) {
    let b1 = 0, b2 = 0, b3 = 0, b4 = 0, fl = 0;
    for (let i = 0; i < B.length; i++) {
      const t = i / SR;
      const x = noise();
      b1 += 0.09 * (x - b1); b2 += 0.09 * (b1 - b2); // ~600 Hz body
      b3 += 0.35 * (x - b3); b4 += 0.02 * (b3 - b4); // ~2 kHz shouts
      fl += 0.0015 * (noise() - fl); // slow flutter of many voices
      const env = t < peakAt ? Math.min(1, t / attack) : Math.exp(-(t - peakAt) * 0.9);
      B[i] = ((b2 - b4 * 0.3) * 1.4 + (b3 - b4) * 0.35) * env * (1 + 6 * fl);
    }
  }
  normalize([L, R], 0.8);
  writeFileSync(join(OUT, name), wavStereo(L, R));
}
cheer("cheer-big.wav", 5.5, 0.35, 1.6);
cheer("cheer-soft.wav", 4.0, 0.5, 0.9);

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
rattle("rattle-hook.wav", Math.max(0.2, ev.land - 0.05), false);
rattle("rattle-spin.wav", Math.max(0.3, ev.spinEnd - ev.spinStart), true);

console.log(`audio written (${DUR.toFixed(1)}s). events:`, Object.fromEntries(Object.entries(ev).map(([k, v]) => [k, Array.isArray(v) ? v.map((x) => x.toFixed(2)) : v.toFixed(2)])));
