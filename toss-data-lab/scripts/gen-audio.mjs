// Original lo-fi "lab" score + UI sound kit, synthesized from scratch (no samples, deterministic).
// Reads src/timeline.json so the music's sections and breaks land on the same frames the visuals use.
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

let seed = 1701;
const rand = () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const noise = () => rand() * 2 - 1;

function wav(name, L, R = L) {
  const n = L.length, buf = Buffer.alloc(44 + n * 4);
  buf.write("RIFF", 0); buf.writeUInt32LE(36 + n * 4, 4); buf.write("WAVE", 8); buf.write("fmt ", 12);
  buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write("data", 36); buf.writeUInt32LE(n * 4, 40);
  let m = 0;
  for (let i = 0; i < n; i++) m = Math.max(m, Math.abs(L[i]), Math.abs(R[i]));
  const g = m > 0 ? 0.89 / m : 1;
  for (let i = 0; i < n; i++) {
    buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i] * g)) * 32767), 44 + i * 4);
    buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i] * g)) * 32767), 46 + i * 4);
  }
  writeFileSync(join(OUT, name), buf);
}

// Render fn(t) into a mono buffer.
const mono = (dur, fn) => {
  const b = new Float32Array(Math.ceil(dur * SR));
  for (let i = 0; i < b.length; i++) b[i] = fn(i / SR, i);
  return b;
};
const env = (t, a, d) => Math.min(1, t / a) * Math.exp(-t / d);
const lp = (k) => { let y = 0; return (x) => (y += k * (x - y)); };

// ---------------- SFX kit ----------------
// keyboard typing burst (~1.4 s of mechanical clicks)
{
  const b = new Float32Array(Math.ceil(1.5 * SR));
  let t = 0.02;
  while (t < 1.35) {
    const s0 = Math.round(t * SR), f = 1800 + rand() * 1600, a = 0.5 + rand() * 0.5, f2 = lp(0.5);
    for (let i = 0; i < 0.03 * SR; i++) {
      const tt = i / SR;
      b[s0 + i] += (f2(noise()) * 0.7 + Math.sin(TAU * f * tt) * 0.3) * a * Math.exp(-tt / 0.006);
    }
    t += 0.05 + rand() * 0.07;
  }
  wav("type.wav", b);
}
wav("whoosh.wav", (() => { const f = lp(0.05); return mono(0.6, (t) => f(noise()) * Math.sin(Math.PI * Math.min(1, t / 0.6)) ** 2 * 2); })());
wav("flick.wav", mono(0.25, (t) => Math.sin(TAU * (2600 + 1800 * Math.exp(-t * 40)) * t) * env(t, 0.001, 0.05) + noise() * env(t, 0.0005, 0.01) * 0.6));
wav("land.wav", mono(0.9, (t) => (Math.sin(TAU * 3150 * t) * 0.5 + Math.sin(TAU * 4720 * t) * 0.3 + Math.sin(TAU * 140 * t) * 0.8 * Math.exp(-t * 30)) * env(t, 0.001, 0.22)));
wav("blip.wav", mono(0.18, (t) => Math.sin(TAU * 1320 * t) * env(t, 0.002, 0.045)));
wav("blip2.wav", mono(0.22, (t) => Math.sin(TAU * (t < 0.06 ? 990 : 1480) * t) * env(t, 0.002, 0.07)));
wav("pop.wav", mono(0.25, (t) => Math.sin(TAU * (220 + 600 * Math.exp(-t * 35)) * t) * env(t, 0.001, 0.06)));
wav("count.wav", mono(1.3, (t) => { const k = Math.floor(t * (30 - t * 12)); return Math.sin(TAU * (1500 + (k % 3) * 220) * t) * Math.exp(-((t * (30 - t * 12)) % 1) * 18) * 0.5 * Math.min(1, (1.3 - t) * 4); }));
wav("rise.wav", mono(0.9, (t) => { const f = 300 * Math.pow(4, t / 0.9); return (Math.sin(TAU * f * t * 0.5) * 0.6 + Math.sin(TAU * f * t) * 0.3) * Math.sin(Math.PI * t / 0.9) ** 2; }));
wav("cascade.wav", (() => { const b = new Float32Array(Math.ceil(1.6 * SR)); for (let k = 0; k < 18; k++) { const s0 = Math.round(k * 0.07 * SR), f = 660 * Math.pow(2, (k % 6) / 6 + Math.floor(k / 6) * 0.25); for (let i = 0; i < 0.2 * SR; i++) b[s0 + i] += Math.sin(TAU * f * i / SR) * env(i / SR, 0.002, 0.05) * 0.5; } return b; })());
wav("drop.wav", mono(1.4, (t) => Math.sin(TAU * (45 + 90 * Math.exp(-t * 8)) * t) * env(t, 0.003, 0.45) + noise() * env(t, 0.001, 0.02) * 0.4 + Math.sin(TAU * 880 * t) * env(t, 0.002, 0.3) * 0.15));
wav("chime.wav", mono(1.8, (t) => [523.25, 659.25, 783.99, 1046.5].reduce((a, f, i) => a + Math.sin(TAU * f * Math.max(0, t - i * 0.06)) * env(Math.max(0, t - i * 0.06), 0.003, 0.5) * (t >= i * 0.06 ? 1 : 0), 0) * 0.4));
wav("alert.wav", mono(0.5, (t) => (Math.sin(TAU * 440 * t) + Math.sin(TAU * 466 * t)) * 0.4 * (t < 0.12 ? env(t, 0.003, 0.1) : env(t - 0.16, 0.003, 0.12) * (t > 0.16 ? 1 : 0))));
wav("sweep.wav", (() => { let ph = 0; return mono(0.8, (t) => { ph += TAU * (200 + 1800 * (t / 0.8) ** 2) / SR; return Math.sin(ph) * Math.sin(Math.PI * t / 0.8) * 0.5; }); })());
wav("fall.wav", (() => { let ph = 0; return mono(1.0, (t) => { ph += TAU * (900 * Math.pow(0.25, t)) / SR; return Math.sin(ph) * Math.sin(Math.PI * t) * 0.5; }); })());
wav("buzz.wav", (() => { const f = lp(0.2); return mono(0.35, (t) => f(Math.sign(Math.sin(TAU * 110 * t))) * env(t, 0.005, 0.15)); })());
wav("stamp.wav", (() => { const f = lp(0.3); return mono(1.2, (t) => Math.sin(TAU * (60 + 120 * Math.exp(-t * 25)) * t) * env(t, 0.001, 0.25) + f(noise()) * env(t, 0.001, 0.05) * 1.2); })());
wav("end.wav", mono(2.5, (t) => [261.63, 392.0, 523.25, 659.25].reduce((a, f) => a + Math.sin(TAU * f * t) * env(t, 0.01, 0.9), 0) * 0.3));

// ---------------- score ----------------
const DUR = TL.total, N = Math.ceil(DUR * SR);
const L = new Float32Array(N), R = new Float32Array(N);
const BPM = 86, beat = 60 / BPM, bar = beat * 4;
const add = (t0, dur, pan, fn) => {
  const s0 = Math.round(t0 * SR), n = Math.round(dur * SR);
  const gl = Math.cos(((pan + 1) * Math.PI) / 4), gr = Math.sin(((pan + 1) * Math.PI) / 4);
  for (let i = 0; i < n && s0 + i < N; i++) { if (s0 + i < 0) continue; const v = fn(i / SR); L[s0 + i] += v * gl; R[s0 + i] += v * gr; }
};
const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
// Am9 – Fmaj7 – Cmaj7 – G6 (voicings in MIDI), bass roots
const CH = [[57, 60, 64, 67, 71], [53, 57, 60, 64, 69], [48, 55, 59, 64, 67], [55, 59, 62, 64, 71]];
const ROOTS = [33, 29, 36, 31];

const groovyStart = sc("s2").start;
const breakAt = sent("s10", 3) - 0.1; // "We fail to reject the null." — the groove drops out
const resolveAt = sent("s10", 5) - 0.2; // CTA — a single held chord to close
const darkFrom = sc("s7").start, darkTo = sc("s9").start;

const rhodes = (t0, m, vel, pan, dur) => {
  const f = mtof(m);
  add(t0, dur + 0.6, pan, (t) => {
    const mod = Math.sin(TAU * f * 2 * t) * 1.2 * Math.exp(-t * 3);
    const e = Math.min(1, t / 0.006) * Math.exp(-t * 0.9) * (t > dur ? Math.max(0, 1 - (t - dur) / 0.6) : 1);
    return (Math.sin(TAU * f * t + mod) * 0.8 + Math.sin(TAU * f * 2.001 * t) * 0.08) * e * vel * (1 + 0.08 * Math.sin(TAU * 4.5 * t));
  });
};
const pad = (t0, dur, notes, amp) => notes.forEach((m, i) => {
  const f = mtof(m + 12);
  const f1 = lp(0.03);
  add(t0, dur + 1.5, (i / (notes.length - 1)) * 1.2 - 0.6, (t) => {
    const e = Math.min(1, t / 1.2) * (t > dur ? Math.max(0, 1 - (t - dur) / 1.5) : 1);
    return f1(((t * f) % 1) * 2 - 1 + (((t * f * 1.004) % 1) * 2 - 1)) * e * amp;
  });
});
const kick = (t0, a) => add(t0, 0.4, 0, (t) => Math.sin(TAU * (48 + 80 * Math.exp(-t * 30)) * t) * env(t, 0.002, 0.14) * a);
const hat = (t0, a, pan) => { const f = lp(0.9); let p = 0; add(t0, 0.08, pan, (t) => { const x = noise(); const h = x - p; p = f(x); return h * env(t, 0.0005, 0.018) * a; }); };
const snare = (t0, a) => { const f = lp(0.35); add(t0, 0.3, 0.05, (t) => (f(noise()) * env(t, 0.001, 0.07) + Math.sin(TAU * 190 * t) * env(t, 0.001, 0.04) * 0.5) * a); };
const bass = (t0, m, dur, a) => { const f = mtof(m); add(t0, dur, 0, (t) => (Math.sin(TAU * f * t) + Math.sin(TAU * f * 2 * t) * 0.15) * Math.min(1, t / 0.01) * Math.min(1, (dur - t) / 0.05) * a); };

const nBars = Math.ceil(DUR / bar);
for (let k = 0; k < nBars; k++) {
  const t0 = k * bar;
  if (t0 >= resolveAt) break;
  const c = k % 4;
  const inBreak = t0 + bar > breakAt;
  const dark = t0 >= darkFrom && t0 < darkTo;
  const shift = dark ? -2 : 0; // darker colour for the pitfalls: drop the voicing a tone
  // pads always
  pad(t0, bar, CH[c].slice(0, 4).map((m) => m + shift), t0 < groovyStart ? 0.05 : 0.035);
  if (inBreak) continue;
  // rhodes comp: chord on 1, an arpeggio fragment on the "and" of 2 and 4
  CH[c].forEach((m, i) => rhodes(t0 + i * 0.012, m + shift, 0.09, (i - 2) * 0.2, beat * 1.6));
  [1.5, 3.5].forEach((b, j) => rhodes(t0 + b * beat, CH[c][(j * 2 + k) % 5] + 12 + shift, 0.05, j ? 0.4 : -0.4, beat * 0.7));
  if (t0 < groovyStart) continue;
  bass(t0, ROOTS[c] + 12 + shift, beat * 1.8, 0.28);
  bass(t0 + beat * 2.5, ROOTS[c] + 12 + shift, beat * 1.2, 0.22);
  kick(t0, 0.55); kick(t0 + beat * 2.5, 0.4);
  snare(t0 + beat, 0.16); snare(t0 + beat * 3, 0.16);
  for (let h = 0; h < 8; h++) hat(t0 + h * beat * 0.5 + (h % 2 ? 0.018 : 0), h % 2 ? 0.07 : 0.12, h % 2 ? 0.3 : -0.2);
}
// break: a low drone under "fail to reject", then the closing chord
add(breakAt, resolveAt - breakAt + 0.5, 0, (t) => Math.sin(TAU * 55 * t) * Math.min(1, t / 0.6) * Math.min(1, (resolveAt - breakAt + 0.5 - t) / 0.5) * 0.12);
pad(resolveAt, DUR - resolveAt - 1.6, [48, 55, 59, 64, 67], 0.045);
[48, 55, 60, 64, 67, 71].forEach((m, i) => rhodes(resolveAt + i * 0.09, m, 0.1, (i - 2.5) * 0.25, 3));
// gentle tape-style fade at the very end
for (let i = 0; i < N; i++) { const t = i / SR; const g = Math.min(1, t / 0.8) * Math.min(1, (DUR - t) / 1.5); L[i] *= g; R[i] *= g; }
wav("score.wav", L, R);
console.log(`score ${DUR.toFixed(1)}s, ${nBars} bars at ${BPM} BPM`);
