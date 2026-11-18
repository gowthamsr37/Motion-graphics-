// Original score and sound design, synthesised from scratch (no samples, deterministic), timed from the same
// beats the pictures use. Writes public/audio/music.wav (ducked under the narration) and public/audio/sfx.wav
// (effects + crowd). Run: npx tsx scripts/gen-audio.ts
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { B, FACE, FREEZE, OMEGA0, RETOSS } from "../src/beats";
import { E, S, TOTAL, voCues, W } from "../src/timing";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "audio");
mkdirSync(OUT, { recursive: true });
const SR = 48000;
const TAU = Math.PI * 2;
const N = Math.ceil(TOTAL * SR);

// ---------- dsp kit ----------
let seed = 20261117;
const rand = () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const noise = () => rand() * 2 - 1;
const smp = (t: number) => Math.round(t * SR);
type Tr = { L: Float32Array; R: Float32Array };
const track = (): Tr => ({ L: new Float32Array(N), R: new Float32Array(N) });
const add = (tr: Tr, t0: number, dur: number, pan: number, fn: (t: number) => number) => {
  const s0 = smp(t0);
  const n = smp(dur);
  const gl = Math.cos(((pan + 1) * Math.PI) / 4);
  const gr = Math.sin(((pan + 1) * Math.PI) / 4);
  for (let i = 0; i < n; i++) {
    const k = s0 + i;
    if (k >= N) break;
    const v = fn(i / SR);
    if (k >= 0) {
      tr.L[k] += v * gl;
      tr.R[k] += v * gr;
    }
  }
};
const TBL = 4096;
const SAW = new Float32Array(TBL);
for (let i = 0; i < TBL; i++) {
  let v = 0;
  for (let k = 1; k <= 16; k++) v += Math.sin((TAU * k * i) / TBL) / k;
  SAW[i] = v * 0.55;
}
const saw = (ph: number) => SAW[Math.floor((ph / TAU) * TBL) & (TBL - 1)];
const NOTE: Record<string, number> = { C: -9, "C#": -8, Db: -8, D: -7, "D#": -6, Eb: -6, E: -5, F: -4, "F#": -3, Gb: -3, G: -2, "G#": -1, Ab: -1, A: 0, "A#": 1, Bb: 1, B: 2 };
const n = (name: string) => {
  const m = name.match(/^([A-G][#b]?)(-?\d)$/)!;
  return 440 * Math.pow(2, (NOTE[m[1]] + (Number(m[2]) - 4) * 12) / 12);
};
const ch = (...names: string[]) => names.map(n);
const env = (t: number, att: number, dur: number, rel: number) => Math.min(1, t / Math.max(1e-4, att)) * (t > dur ? Math.max(0, 1 - (t - dur) / rel) : 1);

// ---------- instruments ----------
const strings = (tr: Tr, t0: number, dur: number, freqs: number[], amp: number, att = 1.0, rel = 1.4, bright = 0.06) =>
  freqs.forEach((f, ni) => {
    for (let v = 0; v < 3; v++) {
      const det = 1 + (v - 1) * 0.0022;
      const pan = ((ni / Math.max(1, freqs.length - 1)) * 2 - 1) * 0.55 + (v - 1) * 0.15;
      let ph = rand() * TAU;
      let lp = 0;
      const vib = 4.4 + rand();
      add(tr, t0, dur + rel, pan, (t) => {
        ph += (TAU * f * det * (1 + 0.0025 * Math.sin(TAU * vib * t))) / SR;
        lp += bright * (saw(ph) - lp);
        return lp * env(t, att, dur, rel) * amp * 0.26;
      });
    }
  });
const pad = (tr: Tr, t0: number, dur: number, freqs: number[], amp: number, att = 1.5, rel = 2) => strings(tr, t0, dur, freqs, amp, att, rel, 0.025);
const sub = (tr: Tr, t0: number, dur: number, f: number, amp: number, att = 0.02, rel = 0.3) => {
  let ph = 0;
  add(tr, t0, dur + rel, 0, (t) => {
    ph += (TAU * f) / SR;
    return Math.sin(ph) * env(t, att, dur, rel) * amp;
  });
};
const pluck = (tr: Tr, t0: number, f: number, amp: number, pan = 0, dur = 1.6, damp = 0.996) => {
  const L = Math.max(2, Math.round(SR / f));
  const buf = new Float32Array(L);
  for (let i = 0; i < L; i++) buf[i] = noise();
  let idx = 0;
  let lp = 0;
  add(tr, t0, dur, pan, (t) => {
    const a = buf[idx];
    const b = buf[(idx + 1) % L];
    buf[idx] = ((a + b) / 2) * damp;
    idx = (idx + 1) % L;
    lp += 0.5 * (a - lp);
    return lp * amp * Math.min(1, (dur - t) / 0.05);
  });
};
const bell = (tr: Tr, t0: number, f: number, amp: number, pan = 0, dur = 2.5) => {
  let pc = 0;
  let pm = 0;
  add(tr, t0, dur, pan, (t) => {
    pm += (TAU * f * 3.5) / SR;
    pc += (TAU * f) / SR + (Math.sin(pm) * 2.2 * Math.exp(-t * 3) * TAU * f * 3.5) / SR / 6;
    return Math.sin(pc) * Math.exp(-t * 1.6) * amp * Math.min(1, t / 0.002);
  });
};
const piano = (tr: Tr, t0: number, f: number, vel = 0.5, pan = 0, dur = 4) => {
  const parts = Array.from({ length: 8 }, (_, k) => ({ f: (k + 1) * f * Math.sqrt(1 + 0.00035 * (k + 1) ** 2), a: vel / (k + 1) ** 1.3, d: 0.5 + 0.6 * k, ph: 0 }));
  add(tr, t0, dur, pan, (t) => {
    let v = 0;
    for (const p of parts) {
      p.ph += (TAU * p.f) / SR;
      v += Math.sin(p.ph) * p.a * Math.exp(-t * p.d);
    }
    return v * Math.min(1, t / 0.004) * Math.min(1, (dur - t) / 0.3);
  });
};
const kick = (tr: Tr, t0: number, amp: number) => {
  let ph = 0;
  add(tr, t0, 0.5, 0, (t) => {
    ph += (TAU * (48 + 110 * Math.exp(-t * 28))) / SR;
    return Math.sin(ph) * Math.exp(-t * 7) * amp + (t < 0.004 ? noise() * 0.3 * amp : 0);
  });
};
const hat = (tr: Tr, t0: number, amp: number, open = false, pan = 0.2) => {
  let hp = 0;
  let prev = 0;
  add(tr, t0, open ? 0.35 : 0.08, pan, (t) => {
    const x = noise();
    hp = 0.6 * (hp + x - prev);
    prev = x;
    return hp * Math.exp(-t * (open ? 10 : 60)) * amp;
  });
};
const snare = (tr: Tr, t0: number, amp: number) => {
  let ph = 0;
  let lp = 0;
  add(tr, t0, 0.4, -0.05, (t) => {
    ph += (TAU * (190 - 40 * t)) / SR;
    const x = noise();
    lp += 0.5 * (x - lp);
    return (Math.sin(ph) * Math.exp(-t * 25) * 0.6 + (x - lp * 0.5) * Math.exp(-t * 14) * 0.7) * amp;
  });
};
const timpani = (tr: Tr, t0: number, f: number, amp: number, pan = 0) => {
  let ph = 0;
  let lp = 0;
  add(tr, t0, 2.4, pan, (t) => {
    ph += (TAU * f * (1 - 0.06 * Math.min(1, t * 6))) / SR;
    lp += 0.08 * (noise() - lp);
    return (Math.sin(ph) * Math.exp(-t * 2.0) + lp * Math.exp(-t * 18) * 1.5) * amp;
  });
};
const roll = (tr: Tr, t0: number, dur: number, f: number, amp: number) => {
  for (let t = 0; t < dur; t += 0.065) timpani(tr, t0 + t, f, amp * (0.12 + 0.88 * (t / dur) ** 2) * (0.8 + 0.2 * rand()), (rand() - 0.5) * 0.3);
};
const cymbal = (tr: Tr, t0: number, amp: number, swell = 0) => {
  for (const pan of [-0.45, 0.45]) {
    let hp = 0;
    let prev = 0;
    add(tr, t0 - swell, swell + 3.5, pan, (t) => {
      const x = noise();
      hp = 0.93 * (hp + x - prev);
      prev = x;
      const e = t < swell ? (t / swell) ** 3 : Math.exp(-(t - swell) * 1.3);
      return hp * e * amp;
    });
  }
};
const riser = (tr: Tr, t0: number, dur: number, amp: number, f0 = 300, f1 = 3000) => {
  let lp = 0;
  let bp = 0;
  let ph = 0;
  add(tr, t0, dur + 0.05, 0, (t) => {
    const u = Math.min(1, t / dur);
    const fc = f0 * Math.pow(f1 / f0, u);
    const k = Math.min(0.9, (TAU * fc) / SR);
    const x = noise();
    lp += k * (x - lp);
    bp += k * (lp - bp);
    ph += (TAU * (f0 * 0.5) * Math.pow(f1 / f0, u * 0.6)) / SR;
    return ((lp - bp) * 1.6 + Math.sin(ph) * 0.15) * u * u * amp;
  });
};
const boom = (tr: Tr, t0: number, amp: number) => {
  let ph = 0;
  let lp = 0;
  add(tr, t0, 3.2, 0, (t) => {
    ph += (TAU * (32 + 70 * Math.exp(-t * 9))) / SR;
    lp += 0.04 * (noise() - lp);
    return (Math.sin(ph) * Math.exp(-t * 1.6) + lp * 3 * Math.exp(-t * 6)) * amp;
  });
};

// Schroeder reverb
const reverb = (X: Float32Array, wet: number, shift: number) => {
  const Y = new Float32Array(X.length);
  const combs = [29.7, 37.1, 41.1, 43.7, 47.3].map((m) => Math.round(((m + shift) * SR) / 1000));
  for (const d of combs) {
    const buf = new Float32Array(d);
    let idx = 0;
    let lp = 0;
    for (let i = 0; i < X.length; i++) {
      const out = buf[idx];
      lp = out * 0.55 + lp * 0.45;
      buf[idx] = X[i] + lp * 0.84;
      idx = (idx + 1) % d;
      Y[i] += out / combs.length;
    }
  }
  for (const [ms, g] of [
    [5.0, 0.7],
    [1.7, 0.7],
  ]) {
    const d = Math.round((ms * SR) / 1000);
    const buf = new Float32Array(d);
    let idx = 0;
    for (let i = 0; i < Y.length; i++) {
      const b = buf[idx];
      const v = -g * Y[i] + b;
      buf[idx] = Y[i] + g * v;
      idx = (idx + 1) % d;
      Y[i] = v;
    }
  }
  for (let i = 0; i < X.length; i++) X[i] = X[i] * (1 - wet) + Y[i] * wet * 2.4;
};
const wav = (tr: Tr, file: string, peak: number) => {
  let m = 0;
  for (const b of [tr.L, tr.R]) for (const v of b) m = Math.max(m, Math.abs(v));
  const g = m > 0 ? peak / m : 1;
  const buf = Buffer.alloc(44 + N * 4);
  buf.write("RIFF", 0);
  buf.writeUInt32LE(36 + N * 4, 4);
  buf.write("WAVE", 8);
  buf.write("fmt ", 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(2, 22);
  buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * 4, 28);
  buf.writeUInt16LE(4, 32);
  buf.writeUInt16LE(16, 34);
  buf.write("data", 36);
  buf.writeUInt32LE(N * 4, 40);
  for (let i = 0; i < N; i++) {
    buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, tr.L[i] * g)) * 32767), 44 + i * 4);
    buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, tr.R[i] * g)) * 32767), 46 + i * 4);
  }
  writeFileSync(join(OUT, file), buf);
  console.log(`${file}: gain ${g.toFixed(3)}`);
};

// ====================================================================================== MUSIC
const M = track();
const BPM = 100;
const beat = 60 / BPM;
// S1 — tension, the freeze, the drop
{
  const s2 = S("s2");
  pad(M, 0, B.s1.freeze + 0.05, ch("D2", "A2", "D3", "E3"), 0.5, 0.15, 0.08);
  sub(M, 0, B.s1.freeze, n("D1"), 0.32, 0.05, 0.05);
  riser(M, 0.6, B.s1.freeze - 0.6, 0.35, 400, 6000);
  // the drop: dark pulse under the stat and the title
  boom(M, B.s1.stat - 0.02, 0.9);
  for (let t = B.s1.stat; t < s2 - 0.3; t += beat / 2) {
    const k = Math.round((t - B.s1.stat) / (beat / 2));
    sub(M, t, beat * 0.4, n(k % 8 === 6 ? "F1" : "D1") * 2, 0.28, 0.005, 0.08);
    if (k % 2 === 0) kick(M, t, 0.5);
  }
  pad(M, B.s1.stat, B.s1.title - B.s1.stat, ch("D3", "F3", "A3"), 0.35, 0.3, 0.6);
  strings(M, B.s1.title - 0.05, s2 - B.s1.title, ch("Bb2", "D3", "F3", "Bb3"), 0.5, 0.08, 0.6, 0.09);
  riser(M, B.s1.go, s2 - B.s1.go, 0.5, 300, 7000);
  cymbal(M, s2, 0.22, 0.0);
}
// S2 — energetic discovery: a driving groove; each pillar landing is a hit
{
  const a = S("s2");
  const e = E("s2");
  const prog = [ch("D3", "F3", "A3"), ch("Bb2", "D3", "F3"), ch("F2", "A2", "C3"), ch("C3", "E3", "G3")];
  const bass = ["D2", "Bb1", "F1", "C2"];
  let k = 0;
  for (let t = a; t < e - 0.2; t += beat / 2, k++) {
    const bar = Math.floor(k / 8) % 4;
    if (k % 2 === 0) kick(M, t, 0.55);
    if (k % 4 === 2) snare(M, t, 0.18);
    hat(M, t + (k % 2 ? 0 : beat / 4), 0.12, k % 8 === 7);
    sub(M, t, beat * 0.42, n(bass[bar]) * (k % 4 === 3 ? 2 : 1), 0.3, 0.005, 0.06);
    const chord = prog[bar];
    pluck(M, t, chord[k % 3] * 2, 0.32, (k % 3) - 1, 0.9);
    if (k % 8 === 0) pad(M, t, beat * 4, chord, 0.3, 0.4, 0.6);
  }
  B.s2.rise.forEach(([, land], i) => {
    timpani(M, land - 0.02, n("D2"), 0.35);
    bell(M, land, n(["A5", "F5", "G5", "A5"][i]), 0.16, (i - 1.5) * 0.4);
  });
  cymbal(M, e - 0.6, 0.18, 1.2);
}
// S3 — suspense: strip down, tick, heartbeat under the decision
{
  const a = S("s3");
  const e = E("s3");
  pad(M, a, e - a, ch("D2", "A2", "E3", "F3"), 0.45, 1.2, 0.6);
  sub(M, a, e - a, n("D1"), 0.2, 1.5, 0.5);
  for (let t = B.s3.choose; t < B.s3.think; t += beat) pluck(M, t, n("A4"), 0.12, 0.3, 0.4, 0.98);
  pad(M, B.s3.lights + 0.3, B.s3.dew - B.s3.lights, ch("A3", "D4", "E4"), 0.25, 1.2, 1.5); // the lights: a lift
  riser(M, B.s3.think, e - B.s3.think, 0.25, 200, 2500);
}
// S4 — the reveal: groove in half time, then everything stops for the warning
{
  const a = S("s4");
  const e = E("s4");
  const prog = [ch("D3", "F3", "A3"), ch("G2", "Bb2", "D3"), ch("Bb2", "D3", "F3"), ch("A2", "C#3", "E3")];
  let k = 0;
  for (let t = a + 0.05; t < B.s4.doubt; t += beat, k++) {
    const bar = Math.floor(k / 4) % 4;
    if (k % 2 === 0) kick(M, t, 0.45);
    if (k % 4 === 2) snare(M, t, 0.14);
    hat(M, t + beat / 2, 0.09);
    sub(M, t, beat * 0.8, n(["D2", "G1", "Bb1", "A1"][bar]), 0.28, 0.01, 0.1);
    if (k % 4 === 0) pad(M, t, beat * 4, prog[bar], 0.32, 0.3, 0.5);
  }
  pad(M, B.s4.doubt, B.s4.stamp - B.s4.doubt, ch("D3", "G3", "A3"), 0.32, 0.6, 0.2);
  boom(M, B.s4.stamp - 0.02, 0.55);
  strings(M, B.s4.stamp, e - B.s4.stamp, ch("D2", "A2", "D3", "F3"), 0.42, 0.05, 0.8, 0.07);
}
// S5 — surprise: pizzicato curiosity, a rise into 61%, a hanging question
{
  const a = S("s5");
  const e = E("s5");
  const pizz = ["D4", "F4", "A4", "F4", "E4", "G4", "Bb4", "G4"];
  let k = 0;
  for (let t = a + 0.2; t < B.s5.same - 0.2; t += beat / 2, k++) pluck(M, t, n(pizz[k % 8]), 0.26, k % 2 ? 0.35 : -0.35, 0.5, 0.985);
  pad(M, a, B.s5.same - a, ch("D3", "A3", "C4"), 0.28, 1, 0.6);
  for (let t = a; t < B.s5.same; t += beat) if (Math.round((t - a) / beat) % 2 === 0) kick(M, t, 0.3);
  riser(M, B.s5.y25, B.s5.v25 - B.s5.y25, 0.4, 300, 5000);
  boom(M, B.s5.v25 - 0.02, 0.5);
  strings(M, B.s5.v25, B.s5.same - B.s5.v25, ch("Bb2", "D3", "F3", "A3"), 0.42, 0.05, 0.5, 0.08);
  pad(M, B.s5.same, e - B.s5.same, ch("E3", "A3", "B3", "D4"), 0.4, 0.4, 0.8); // unresolved, suspended
  sub(M, B.s5.why, e - B.s5.why, n("E1"), 0.25, 0.3, 0.6);
}
// S6 — cinematic wonder: warm pad, a bell arpeggio that quickens with the time-lapse, a swell for the lights
{
  const a = S("s6");
  const e = E("s6");
  const chords = [ch("F2", "C3", "E3", "A3"), ch("D2", "A2", "E3", "F3"), ch("Bb1", "F2", "D3", "A3"), ch("C2", "G2", "E3", "G3")];
  const seg = (e - a) / 4;
  chords.forEach((c, i) => strings(M, a + i * seg, seg + 0.2, c, 0.42, 1.2, 1.2, 0.05));
  const [l0, l1] = B.s6.lapse;
  let t = a + 0.6;
  let k = 0;
  while (t < B.s6.down) {
    const c = chords[Math.min(3, Math.floor((t - a) / seg))];
    bell(M, t, c[(k % 3) + 1] * 4, 0.12, ((k % 5) - 2) * 0.3, 1.8);
    const speed = t < l0 ? 1 : t < l1 ? 1 + 2.5 * ((t - l0) / (l1 - l0)) : 3.5;
    t += beat / speed;
    k++;
  }
  riser(M, B.s6.lights - 1.6, 1.6, 0.35, 200, 4000);
  cymbal(M, B.s6.lights, 0.2);
  timpani(M, B.s6.lights, n("F2"), 0.4);
  strings(M, B.s6.lights, B.s6.down - B.s6.lights + 0.4, ch("F3", "A3", "C4", "E4"), 0.36, 0.1, 1.2, 0.08);
  for (let i = 0; i < 10; i++) bell(M, B.s6.down + 0.3 + i * 0.22, n(["C6", "E6", "A6", "G6", "E6", "C6", "D6", "A5", "C6", "E6"][i]), 0.06, (i % 2 ? 0.5 : -0.5), 2);
  boom(M, B.s6.reveal - 0.02, 0.35);
  pad(M, B.s6.reveal, e - B.s6.reveal, ch("F2", "C3", "A3", "D4"), 0.4, 0.2, 0.8);
}
// S7 — educational, immersive: a mallet pulse over a calm bed
{
  const a = S("s7");
  const e = E("s7");
  const notes = ["D4", "A4", "F4", "A4", "C4", "G4", "E4", "G4"];
  let k = 0;
  for (let t = a + 0.1; t < e - 0.4; t += beat / 2, k++) pluck(M, t, n(notes[k % 8]), 0.2, (k % 2) * 0.4 - 0.2, 0.7, 0.97);
  pad(M, a, e - a, ch("D2", "A2", "F3", "C4"), 0.35, 0.8, 0.6);
  for (let t = a; t < e - 0.4; t += beat) if (Math.round((t - a) / beat) % 2 === 0) kick(M, t, 0.25);
  timpani(M, B.s7.reveal - 0.02, n("D2"), 0.35);
  bell(M, B.s7.reveal, n("A5"), 0.14);
  riser(M, e - 1.1, 1.1, 0.3, 300, 6000);
}
// S8 — montage: a hit on every cut, then a steady bed under the diagram
{
  const a = S("s8");
  const e = E("s8");
  const [m0, m1] = B.s8.montage;
  for (let i = 0; i < 8; i++) {
    const t = m0 + ((m1 - m0) * i) / 7;
    kick(M, t, 0.55);
    if (i % 2) snare(M, t, 0.16);
    sub(M, t, 0.35, n(["D2", "D2", "F2", "D2", "Bb1", "C2", "D2", "D2"][i]), 0.28);
  }
  strings(M, a, m1 - a, ch("D3", "F3", "A3", "D4"), 0.32, 0.4, 0.3, 0.07);
  pad(M, B.s8.nodes[0], e - B.s8.nodes[0], ch("Bb2", "F3", "A3", "D4"), 0.38, 0.4, 0.8);
  [B.s8.nodes[0], B.s8.nodes[0] + 0.25, B.s8.nodes[0] + 0.5, B.s8.nodes[0] + 0.75].forEach((t, i) => bell(M, t, n(["D5", "F5", "A5", "D6"][i]), 0.1, (i - 1.5) * 0.3, 1.2));
  bell(M, B.s8.nodes[3], n("A5"), 0.14);
}
// S9 — resolution: chords that finally resolve, a timpani roll into the landing, a warm brand chord
{
  const a = S("s9");
  const b = B.s9;
  const prog: [number, number[]][] = [
    [a, ch("D2", "A2", "D3", "F3")],
    [b.values, ch("Bb1", "F2", "D3", "F3")],
    [b.line1, ch("G1", "D2", "Bb2", "D3")],
    [b.line2, ch("A1", "E2", "C#3", "E3")],
    [b.linesOut - 0.4, ch("Bb1", "F2", "D3", "F3")],
    [b.fall, ch("C2", "G2", "E3", "G3")],
  ];
  prog.forEach(([t, c], i) => strings(M, t, (prog[i + 1]?.[0] ?? b.land) - t + 0.2, c, 0.31, 0.6, 0.6, 0.06));
  [[b.values, "D4"], [b.line1, "Bb3"], [b.line2, "C#4"], [b.linesOut, "D4"]].forEach(([t, nt]) => piano(M, t as number, n(nt as string), 0.3, 0.1, 3.5));
  roll(M, b.fall + 0.6, b.land - b.fall - 0.6, n("D2"), 0.32);
  boom(M, b.land - 0.01, 0.45);
  strings(M, b.land, TOTAL - b.land - 0.4, ch("D2", "A2", "D3", "F#3", "A3", "D4"), 0.5, 0.1, 0.5, 0.08); // the major resolve
  [["D4", 0], ["F#4", 0.08], ["A4", 0.16], ["D5", 0.7]].forEach(([nt, dt]) => piano(M, b.lockup + (dt as number), n(nt as string), 0.3, 0.1, 4));
  for (let i = 0; i < 6; i++) bell(M, b.lockup + 0.4 + i * 0.3, n(["A5", "D6", "F#6", "A6", "F#6", "D6"][i]), 0.05, (i % 2 ? 0.5 : -0.5), 2);
  // the loop: a quiet drone returns under the re-toss, so the cut back to frame one is seamless
  pad(M, b.retoss - 0.3, TOTAL - b.retoss + 0.6, ch("D2", "A2", "D3", "E3"), 0.4, 0.5, 0.01);
  sub(M, b.retoss, TOTAL - b.retoss + 0.2, n("D1"), 0.32, 0.4, 0.01);
}
reverb(M.L, 0.3, 0);
reverb(M.R, 0.3, 1.3);
// duck under the narration (about −12 dB with 150 ms ramps)
{
  const g = new Float32Array(N).fill(1);
  const ramp = 0.15;
  for (const c of voCues) {
    const a = c.from - 0.06;
    const b = c.from + c.duration + 0.1;
    for (let i = Math.max(0, smp(a - ramp)); i < Math.min(N, smp(b + ramp)); i++) {
      const t = i / SR;
      const u = t < a ? (t - (a - ramp)) / ramp : t > b ? 1 - (t - b) / ramp : 1;
      g[i] = Math.min(g[i], 1 - 0.74 * Math.max(0, Math.min(1, u)));
    }
  }
  for (let i = 0; i < N; i++) {
    M.L[i] = Math.tanh(M.L[i] * 1.1) * g[i];
    M.R[i] = Math.tanh(M.R[i] * 1.1) * g[i];
  }
}
wav(M, "music.wav", 0.8);

// ====================================================================================== SFX
const X = track();
const COIN: [number, number, number][] = [
  [2350, 0.5, 6],
  [3960, 0.35, 9],
  [5480, 0.25, 12],
  [7300, 0.15, 16],
  [1180, 0.25, 5],
];
const ring = (t: number, partials: [number, number, number][], decay: number) => partials.reduce((s, [fr, g, d]) => s + Math.sin(TAU * fr * t) * g * Math.exp(-t * d * decay), 0);
// Coin in slow motion: an airy metallic shimmer whose glints follow the coin's actual rotation.
const spin = (t0: number, t1: number, flipAt: (t: number) => number, amp: number, pan = 0) => {
  let lp = 0;
  let bp = 0;
  const parts = COIN.map(([f, g]) => ({ f: f * 0.5, g, ph: rand() * TAU }));
  add(X, t0, t1 - t0, pan, (tt) => {
    const t = t0 + tt;
    const glint = Math.pow(Math.abs(Math.cos(flipAt(t))), 6);
    let v = 0;
    for (const p of parts) {
      p.ph += (TAU * p.f) / SR;
      v += Math.sin(p.ph) * p.g;
    }
    const x = noise();
    lp += 0.08 * (x - lp);
    bp += 0.02 * (lp - bp);
    return (v * 0.18 * (0.25 + glint) + (lp - bp) * 0.9 * (0.3 + 0.7 * glint)) * amp;
  });
};
// opening spin (decelerating into the freeze)
spin(0, B.s1.freeze + 0.15, (t) => (t < FREEZE ? FACE - (OMEGA0 / (2 * FREEZE)) * (FREEZE - t) ** 2 : FACE), 0.55);
// the freeze: a big struck-metal ring with a low body
add(X, B.s1.stat - 0.03, 4, 0, (t) => ring(t, [[180, 0.6, 0.9], [462, 0.5, 1.2], [831, 0.4, 1.6], [1320, 0.3, 2.2], [2010, 0.22, 3], [3170, 0.15, 4]], 1) * 0.6 * Math.min(1, t / 0.002));
add(X, B.s1.stat - 0.03, 0.08, 0, (t) => noise() * Math.exp(-t * 60) * 0.8);
// time restarts: the coin flicks away
add(X, B.s1.go, 1.2, 0.2, (t) => ring(t, COIN, 1.4) * 0.35 * (0.6 + 0.4 * Math.sin(TAU * 14 * t)));
riser(X, B.s1.go + 0.1, 0.9, 0.18, 800, 6000);
// pillar rises: a soft mechanical rumble rising in pitch, a clunk when each locks in
B.s2.rise.forEach(([a0, b0]) => {
  let ph = 0;
  add(X, a0, b0 - a0 + 0.1, 0, (t) => {
    const u = Math.min(1, t / (b0 - a0));
    ph += (TAU * (60 + 140 * u)) / SR;
    return (Math.sin(ph) * 0.4 + noise() * 0.12) * Math.sin(Math.PI * Math.min(1, u * 1.05)) * 0.45;
  });
  add(X, b0 - 0.03, 0.5, 0, (t) => (Math.sin(TAU * 90 * t) * Math.exp(-t * 18) + noise() * Math.exp(-t * 70) * 0.5) * 0.7);
});
add(X, B.s2.ref[0], 1.2, 0, (t) => Math.sin(TAU * (900 + 300 * t) * t) * Math.exp(-t * 3) * 0.08 * Math.min(1, t / 0.2)); // the 50% line: a thin shimmer
// floodlights: each tower strikes with a heavy contactor clunk, then the ballasts hum up
const lightsOn = (t0: number, pan: number) => {
  add(X, t0, 0.6, pan, (t) => (Math.sin(TAU * (70 - 30 * t) * t) * Math.exp(-t * 14) * 0.9 + noise() * Math.exp(-t * 50) * 0.6) * 0.8);
  add(X, t0 + 0.05, 3.0, pan, (t) => {
    const e = Math.min(1, t / 1.2) * Math.exp(-Math.max(0, t - 1.4) * 1.5);
    return (Math.sin(TAU * 100 * t) * 0.5 + Math.sin(TAU * 200 * t) * 0.25 + Math.sin(TAU * 300 * t) * 0.12) * e * 0.12;
  });
};
[0, 0.42, 0.84, 1.26].forEach((d, i) => lightsOn(B.s3.lights + d, [-0.6, 0.6, -0.3, 0.3][i]));
[0, 0.3, 0.6, 0.9].forEach((d, i) => lightsOn(B.s6.lights + d, [-0.6, 0.6, -0.3, 0.3][i]));
// a drop of dew
const drip = (t0: number, f: number, amp: number, pan = 0) => add(X, t0, 0.25, pan, (t) => Math.sin(TAU * (f + 1400 * t) * t) * Math.exp(-t * 32) * amp);
drip(B.s3.dew + 0.2, 1500, 0.25, -0.3);
drip(B.s3.dew + 0.5, 1800, 0.18, 0.3);
// the countdown: soft ticks on each number, a heartbeat underneath
const span = B.s3.end - B.s3.think;
for (let i = 0; i < 3; i++) add(X, B.s3.think + (i * span) / 3, 0.2, 0, (t) => (Math.sin(TAU * 1700 * t) * 0.6 + noise() * 0.3) * Math.exp(-t * 45) * 0.45);
for (let t = B.s3.choose + 0.2; t < B.s3.end; t += 0.82) {
  const k = Math.min(1, (t - B.s3.choose) / (B.s3.end - B.s3.choose));
  for (const [dt, a] of [
    [0, 1],
    [0.17, 0.65],
  ]) {
    let ph = 0;
    add(X, t + dt, 0.35, 0, (tt) => {
      ph += (TAU * (58 - 18 * tt)) / SR;
      return Math.sin(ph) * Math.exp(-tt * 13) * a * (0.35 + 0.65 * k) * 0.9;
    });
  }
}
// bat on ball (split screen): the top-half bowler's deliveries and the bottom-half drive
const batCrack = (t0: number, amp: number, pan = 0) => {
  add(X, t0, 0.5, pan, (t) => (ring(t, [[1050, 0.6, 22], [1620, 0.4, 30], [2400, 0.3, 40], [720, 0.4, 18]], 1) + noise() * Math.exp(-t * 120) * 0.8) * amp);
};
const cheer = (t0: number, dur: number, amp: number) => {
  for (const pan of [-0.5, 0.5]) {
    let b1 = 0;
    let b2 = 0;
    let fl = 0;
    add(X, t0, dur, pan, (t) => {
      const x = noise();
      b1 += 0.09 * (x - b1);
      b2 += 0.09 * (b1 - b2);
      fl += 0.0015 * (noise() - fl);
      const e = Math.min(1, t / 0.25) * Math.exp(-Math.max(0, t - 0.5) * 1.6);
      return b2 * 1.6 * e * (1 + 6 * fl) * amp;
    });
  }
};
for (let k = -2; k < 4; k++) {
  const t = B.s4.bowlBar + 0.1 + k * 4.6 + 1.2;
  if (t > S("s4") + 0.2 && t < E("s4") - 0.5) {
    add(X, t - 0.38, 0.2, -0.2, (tt) => (Math.sin(TAU * 160 * tt) * 0.5 + noise() * 0.4) * Math.exp(-tt * 40) * 0.3); // the ball pitching
    batCrack(t, 0.55, -0.15);
    cheer(t + 0.05, 2.2, 0.35);
  }
}
batCrack(B.s4.shot + 0.62, 0.5, 0.15);
cheer(B.s4.shot + 0.68, 2.0, 0.3);
add(X, B.s4.bowlBar + 0.05, 1.0, 0, (t) => Math.sin(TAU * (300 + 500 * t) * t) * Math.exp(-t * 2.5) * 0.08); // bar fills
add(X, B.s4.batBar + 0.05, 1.0, 0, (t) => Math.sin(TAU * (300 + 400 * t) * t) * Math.exp(-t * 2.5) * 0.08);
add(X, B.s4.stamp - 0.02, 0.6, 0, (t) => (Math.sin(TAU * 60 * t) * Math.exp(-t * 9) + noise() * Math.exp(-t * 35) * 0.5) * 0.7); // the stamp
// two seasons: the coin turning, tiles dropping in, a fair coin re-run
const turn = (t0: number, amp: number) => spin(t0, t0 + 0.9, (t) => (t - t0) * 9, amp, 0);
turn(B.s5.y25 - 0.2, 0.3);
turn(B.s5.same - 0.15, 0.35);
const tiles = (t0: number, count: number, amp: number, pan: number) => {
  for (let i = 0; i < count; i += 2) add(X, t0 + (i / count) * 1.1, 0.04, pan, (t) => Math.sin(TAU * (2200 + 600 * rand()) * t) * Math.exp(-t * 120) * amp);
};
tiles(B.s5.v24, 71, 0.12, -0.4);
tiles(B.s5.v25, 70, 0.12, 0.4);
for (let t = B.s5.same + 0.35; t < B.s5.why; t += 0.28) add(X, t, 0.12, 0, (tt) => ring(tt, COIN, 3) * 0.12);
// day-night: dew sparkles at grass level
for (let i = 0; i < 9; i++) drip(B.s6.down + 0.8 + i * 0.27 + rand() * 0.1, 1300 + rand() * 900, 0.12, rand() * 1.2 - 0.6);
// Test pitch: the ball pitching (true on day 1; low then steep on day 5), the surface cracking
const thock = (t0: number, amp: number) => add(X, t0, 0.3, 0, (t) => (Math.sin(TAU * (210 - 60 * t) * t) * Math.exp(-t * 30) + noise() * Math.exp(-t * 90) * 0.6) * amp);
thock(S("s7") + 0.9 + 0.62 * 2.7, 0.5);
thock(B.s7.bounce - 0.15 + 0.62 * 1.3, 0.45);
thock(B.s7.bounce + 1.05 + 0.62 * 1.3, 0.55);
const cracks = (t0: number, count: number, amp: number) => {
  for (let c = 0; c < count; c++) {
    const at = t0 + c * 0.13 + rand() * 0.06;
    let lp = 0;
    add(X, at, 0.18, rand() - 0.5, (t) => {
      const x = noise();
      lp += 0.45 * (x - lp);
      return (x - lp) * Math.exp(-t * 32) * amp * (rand() < 0.3 ? 1.4 : 0.8);
    });
  }
};
cracks(B.s7.day3, 4, 0.35);
cracks(B.s7.day5, 8, 0.5);
// montage cuts: a whoosh into each shot
const whoosh = (t0: number, dur: number, amp: number) => {
  let lp = 0;
  let bp = 0;
  add(X, t0 - dur * 0.7, dur, rand() - 0.5, (t) => {
    const u = t / dur;
    const k = 0.03 + 0.3 * Math.sin(Math.PI * u);
    const x = noise();
    lp += k * (x - lp);
    bp += 0.02 * (lp - bp);
    return (lp - bp) * Math.sin(Math.PI * u) ** 2 * amp;
  });
};
for (let i = 1; i < 8; i++) whoosh(B.s8.montage[0] + ((B.s8.montage[1] - B.s8.montage[0]) * i) / 7, 0.45, 0.35);
whoosh(S("s2"), 0.6, 0.4);
whoosh(S("s6"), 0.7, 0.35);
whoosh(S("s7"), 0.5, 0.3);
// diagram nodes: soft clicks
[0, 0.25, 0.5, 0.75].forEach((d) => add(X, B.s8.nodes[0] + d, 0.06, 0, (t) => Math.sin(TAU * 1300 * t) * Math.exp(-t * 90) * 0.25));
// the verdict: the coin falls, lands, wobbles and settles with a click; then the re-toss that loops
{
  const b = B.s9;
  spin(b.fall, b.land, (t) => (t - b.fall) * 10, 0.4);
  add(X, b.land - 0.005, 1.4, 0, (t) => {
    const thud = Math.sin(TAU * (150 - 70 * t) * t) * Math.exp(-t * 26) * 0.9 + noise() * Math.exp(-t * 80) * 0.5;
    // bounces at 0.26 s and 0.52 s, then a wobble whose rattle speeds up as it settles
    const hops = [0.26, 0.52].reduce((a, t0, i) => a + (t > t0 ? ring(t - t0, COIN, 1.5) * 0.5 * Math.pow(0.55, i + 1) : 0), 0);
    let wob = 0;
    if (t > 0.55) {
      const s = t - 0.55;
      const rate = 9 + 30 * s * s;
      wob = ring((s * rate) % 1 / rate, COIN, 2.5) * 0.25 * Math.exp(-s * 2.2);
    }
    return thud + ring(t, COIN, 1.2) * 0.55 + hops + wob;
  });
  add(X, b.land + 1.25, 0.25, 0, (t) => (ring(t, COIN, 4) * 0.7 + noise() * Math.exp(-t * 200) * 0.4) * 0.9); // the final click
  // re-toss: a flick, and the spin accelerating back to the opening frame
  add(X, b.retoss, 0.05, 0, (t) => noise() * Math.exp(-t * 90) * 0.5);
  spin(b.retoss, TOTAL, (t) => {
    const tau = TOTAL - t;
    return FACE - (OMEGA0 / (2 * FREEZE)) * FREEZE ** 2 - OMEGA0 * tau + (OMEGA0 / (2 * RETOSS)) * tau * tau;
  }, 0.55);
}
// crowd bed: quiet by day, fuller under lights, almost nothing in the close-ups
{
  const level = (t: number) => {
    const sc = t < S("s2") ? 0.25 : t < S("s3") ? 0.5 : t < S("s4") ? 0.35 + 0.45 * Math.min(1, Math.max(0, (t - B.s3.lights) / 2)) : t < S("s5") ? 0.85 : t < S("s6") ? 0.3 : t < S("s7") ? 0.45 + 0.4 * Math.min(1, Math.max(0, (t - B.s6.lights) / 2)) - 0.35 * Math.min(1, Math.max(0, (t - B.s6.down) / 1.5)) : t < S("s8") ? 0.45 : t < S("s9") ? 0.6 : 0.25;
    return sc;
  };
  for (const [Bf, chn] of [
    [X.L, 0],
    [X.R, 1],
  ] as const) {
    let lp1 = 0;
    let lp2 = 0;
    let hp = 0;
    const ph = [rand() * TAU, rand() * TAU, rand() * TAU];
    for (let i = 0; i < N; i++) {
      const t = i / SR;
      const x = noise();
      lp1 += 0.12 * (x - lp1);
      lp2 += 0.12 * (lp1 - lp2);
      hp += 0.02 * (lp2 - hp);
      const mod = 0.6 + 0.2 * Math.sin(TAU * 0.07 * t + ph[0]) + 0.12 * Math.sin(TAU * 0.19 * t + ph[1]) + 0.08 * Math.sin(TAU * 0.43 * t + ph[2] + chn);
      Bf[i] += (lp2 - hp) * mod * level(t) * 0.55;
    }
  }
}
reverb(X.L, 0.12, 0.7);
reverb(X.R, 0.12, 2.1);
wav(X, "sfx.wav", 0.8);
console.log(`audio: ${TOTAL.toFixed(2)} s`);
void W;
