// Original warm "storybook" score + UI/foley kit, synthesized (deterministic). Sections follow src/timeline.json:
// gentle piano groove → darker hush for the crash → lift for the result → tension for the twist → resolve.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "audio");
mkdirSync(OUT, { recursive: true });
const TL = JSON.parse(readFileSync(join(ROOT, "src", "timeline.json"), "utf8"));
const SR = 48000, TAU = Math.PI * 2;
const sc = (id) => TL.scenes.find((s) => s.id === id);
const sent = (id, i) => sc(id).vo.at + sc(id).vo.segments[i].s;
let seed = 2026;
const rand = () => { seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const noise = () => rand() * 2 - 1;
const lp = (k) => { let y = 0; return (x) => (y += k * (x - y)); };
const env = (t, a, d) => Math.min(1, t / a) * Math.exp(-t / d);
function wav(name, L, R = L, peak = 0.89) {
  const n = L.length, buf = Buffer.alloc(44 + n * 4);
  buf.write("RIFF", 0); buf.writeUInt32LE(36 + n * 4, 4); buf.write("WAVE", 8); buf.write("fmt ", 12);
  buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write("data", 36); buf.writeUInt32LE(n * 4, 40);
  let m = 0; for (let i = 0; i < n; i++) m = Math.max(m, Math.abs(L[i]), Math.abs(R[i]));
  const g = m > 0 ? peak / m : 1;
  for (let i = 0; i < n; i++) { buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i] * g)) * 32767), 44 + i * 4); buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i] * g)) * 32767), 46 + i * 4); }
  writeFileSync(join(OUT, name), buf);
}
const mono = (dur, fn) => { const b = new Float32Array(Math.ceil(dur * SR)); for (let i = 0; i < b.length; i++) b[i] = fn(i / SR); return b; };

// ---- kit ----
wav("pop.wav", mono(0.25, (t) => Math.sin(TAU * (260 + 700 * Math.exp(-t * 40)) * t) * env(t, 0.001, 0.05)));
wav("whoosh.wav", (() => { const f = lp(0.05); return mono(0.6, (t) => f(noise()) * Math.sin(Math.PI * t / 0.6) ** 2 * 2.5); })());
wav("tick.wav", mono(0.12, (t) => Math.sin(TAU * 1800 * t) * env(t, 0.001, 0.02)));
wav("coin.wav", mono(0.9, (t) => (Math.sin(TAU * 2637 * t) * 0.5 + Math.sin(TAU * 3951 * t) * 0.35) * env(t, 0.001, 0.2)));
wav("coins.wav", (() => { const b = new Float32Array(Math.ceil(1.4 * SR)); for (let k = 0; k < 12; k++) { const s0 = Math.round((k * 0.06 + rand() * 0.03) * SR), f = 2300 + rand() * 1800; for (let i = 0; i < 0.4 * SR; i++) { const tt = i / SR; b[s0 + i] += Math.sin(TAU * f * tt) * env(tt, 0.001, 0.09) * 0.4; } } return b; })());
wav("sparkle.wav", (() => { const b = new Float32Array(Math.ceil(1.6 * SR)); [1046.5, 1318.5, 1568, 2093, 2637].forEach((f, k) => { const s0 = Math.round(k * 0.06 * SR); for (let i = 0; i < 1.2 * SR; i++) b[s0 + i] += Math.sin(TAU * f * i / SR) * env(i / SR, 0.002, 0.35) * 0.3; }); return b; })());
wav("count.wav", mono(1.3, (t) => { const r = 30 - t * 14; return Math.sin(TAU * 1500 * t) * Math.exp(-((t * r) % 1) * 18) * 0.5 * Math.min(1, (1.3 - t) * 4); }));
wav("rise.wav", mono(1.0, (t) => (Math.sin(TAU * 220 * Math.pow(3, t) * t) * 0.5) * Math.sin(Math.PI * t) ** 2));
wav("fall.wav", (() => { let ph = 0; return mono(1.0, (t) => { ph += TAU * 900 * Math.pow(0.25, t) / SR; return Math.sin(ph) * Math.sin(Math.PI * t) * 0.5; }); })());
wav("thud.wav", mono(1.0, (t) => Math.sin(TAU * (50 + 70 * Math.exp(-t * 18)) * t) * env(t, 0.003, 0.3)));
wav("boom.wav", (() => { const f = lp(0.1); return mono(2.0, (t) => Math.sin(TAU * (40 + 60 * Math.exp(-t * 8)) * t) * env(t, 0.004, 0.6) + f(noise()) * env(t, 0.001, 0.15) * 0.8); })());
wav("crash.wav", (() => { const f = lp(0.15); let ph = 0; return mono(2.2, (t) => { ph += TAU * (300 * Math.pow(0.2, t)) / SR; return Math.sin(ph) * env(t, 0.01, 0.8) * 0.6 + Math.sin(TAU * (35 + 50 * Math.exp(-t * 6)) * t) * env(t, 0.003, 0.7) + f(noise()) * env(t, 0.001, 0.2) * 0.9; }); })());
wav("stamp.wav", (() => { const f = lp(0.3); return mono(1.0, (t) => Math.sin(TAU * (60 + 120 * Math.exp(-t * 25)) * t) * env(t, 0.001, 0.22) + f(noise()) * env(t, 0.001, 0.05) * 1.2); })());
wav("chime.wav", mono(1.6, (t) => [880, 1318.5].reduce((a, f, i) => a + Math.sin(TAU * f * t) * env(t, 0.002, 0.6) / (i + 1), 0)));
wav("phone.wav", mono(1.6, (t) => ((t % 0.5) < 0.35 && t < 1.4 ? (Math.sin(TAU * 1400 * t) + Math.sin(TAU * 1750 * t)) * 0.3 * (Math.sin(TAU * 20 * t) > 0 ? 1 : 0.2) : 0)));
wav("hmm.wav", mono(0.8, (t) => Math.sin(TAU * (180 - 40 * t) * t) * Math.sin(Math.PI * t / 0.8) * 0.5 * (1 + 0.3 * Math.sin(TAU * 6 * t))));
wav("tension.wav", mono(2.0, (t) => (Math.sin(TAU * 110 * t) + Math.sin(TAU * 116.5 * t)) * Math.min(1, t / 0.4) * Math.exp(-Math.max(0, t - 1) * 2) * 0.4));

// ---- score ----
const DUR = TL.total, N = Math.ceil(DUR * SR);
const L = new Float32Array(N), R = new Float32Array(N);
const add = (t0, dur, pan, fn) => { const s0 = Math.round(t0 * SR), n = Math.round(dur * SR), gl = Math.cos(((pan + 1) * Math.PI) / 4), gr = Math.sin(((pan + 1) * Math.PI) / 4); for (let i = 0; i < n && s0 + i < N; i++) { if (s0 + i < 0) continue; const v = fn(i / SR); L[s0 + i] += v * gl; R[s0 + i] += v * gr; } };
const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
const piano = (t0, m, vel, pan, dur = 2.5) => { const f = mtof(m), B = 0.0004; const parts = Array.from({ length: 6 }, (_, k) => ({ f: (k + 1) * f * Math.sqrt(1 + B * (k + 1) ** 2), a: vel / (k + 1) ** 1.3, d: 0.7 + 0.7 * k })); add(t0, dur, pan, (t) => { let v = 0; for (const p of parts) v += Math.sin(TAU * p.f * t) * p.a * Math.exp(-t * p.d); return v * Math.min(1, t / 0.004) * Math.min(1, (dur - t) / 0.2); }); };
const pad = (t0, dur, notes, amp) => notes.forEach((m, i) => { const f = mtof(m), fl = lp(0.03); add(t0, dur + 1, (i / (notes.length - 1)) - 0.5, (t) => fl(((t * f) % 1) * 2 - 1 + (((t * f * 1.005) % 1) * 2 - 1)) * Math.min(1, t / 1) * (t > dur ? Math.max(0, 1 - (t - dur)) : 1) * amp); });
const kick = (t0, a) => add(t0, 0.35, 0, (t) => Math.sin(TAU * (50 + 80 * Math.exp(-t * 30)) * t) * env(t, 0.002, 0.12) * a);
const snap = (t0, a) => { const f = lp(0.5); add(t0, 0.2, 0.1, (t) => f(noise()) * env(t, 0.001, 0.04) * a); };
const shaker = (t0, a, pan) => { const f = lp(0.95); let p = 0; add(t0, 0.06, pan, (t) => { const x = noise(); const h = x - p; p = f(x); return h * env(t, 0.001, 0.015) * a; }); };
const bass = (t0, m, dur, a) => add(t0, dur, 0, (t) => Math.sin(TAU * mtof(m) * t) * Math.min(1, t / 0.01) * Math.min(1, (dur - t) / 0.05) * a);
// C – G – Am – F at 92 BPM
const BPM = 92, beat = 60 / BPM, bar = beat * 4;
const CH = [[60, 64, 67, 72], [55, 59, 62, 67], [57, 60, 64, 69], [53, 57, 60, 65]], ROOTS = [36, 31, 33, 29];
const DARK = [[57, 60, 64], [53, 57, 60], [52, 55, 59], [50, 53, 57]], DROOTS = [33, 29, 28, 26];
const crashA = sent("s5", 0) - 0.3, crashB = sc("s6").start, twistA = sc("s7").start, endA = sc("s8").start;
for (let k = 0, t = 0; t < DUR - 2; k++, t += bar) {
  const c = k % 4;
  const dark = t + bar > crashA && t < crashB;
  const twist = t >= twistA && t < endA;
  const intro = t < sent("s1", 2);
  const chord = dark ? DARK[c] : CH[c];
  pad(t, bar, chord.map((m) => m - 12), dark ? 0.05 : 0.03);
  if (dark) { bass(t, DROOTS[c], bar * 0.95, 0.25); piano(t, chord[0] + 12, 0.12, 0, 3); continue; }
  // piano: chord on 1, broken notes on the off-beats
  chord.forEach((m, i) => piano(t + i * 0.015, m, 0.1, (i - 1.5) * 0.2));
  [1.5, 2.5, 3.5].forEach((b, j) => piano(t + b * beat, chord[(j + k) % 4] + 12, 0.07, j % 2 ? 0.3 : -0.3, 1.5));
  if (intro) continue;
  bass(t, ROOTS[c], beat * 1.9, 0.26); bass(t + beat * 2.5, ROOTS[c] + (twist ? 1 : 0), beat * 1.4, 0.2);
  kick(t, 0.5); kick(t + beat * 2.5, 0.35); snap(t + beat, 0.25); snap(t + beat * 3, 0.25);
  for (let h = 0; h < 8; h++) shaker(t + h * beat / 2 + (h % 2 ? 0.02 : 0), h % 2 ? 0.08 : 0.12, h % 2 ? 0.3 : -0.3);
}
for (let i = 0; i < N; i++) { const t = i / SR, g = Math.min(1, t / 0.5) * Math.min(1, (DUR - t) / 1.5); L[i] *= g; R[i] *= g; }
wav("score.wav", L, R);
console.log(`score ${DUR.toFixed(1)}s`);
