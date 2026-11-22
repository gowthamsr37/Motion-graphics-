// Original filmy score + Bollywood sound kit, synthesized from scratch (deterministic, no samples).
// Dhol/tabla groove with a sitar-like pluck and strings; drama stings, "dhin" hits for the triple zooms,
// an interval fanfare, curtain swishes, a crash, applause. Sections follow src/timeline.json.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "audio");
mkdirSync(OUT, { recursive: true });
const TL = JSON.parse(readFileSync(join(ROOT, "src", "timeline.json"), "utf8"));
const SR = 48000, TAU = Math.PI * 2;
const sc = (id) => TL.scenes.find((s) => s.id === id);
const line = (id, i) => sc(id).vo.at + sc(id).vo.segments[i].s;
let seed = 1999;
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
const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);

// ---- instruments shared by kit and score ----
const dholLow = (t, a = 1) => Math.sin(TAU * (70 + 90 * Math.exp(-t * 22)) * t) * env(t, 0.002, 0.22) * a;
const dholHigh = (t, a = 1) => { return (Math.sin(TAU * 420 * t) * 0.5 + Math.sin(TAU * 640 * t) * 0.3) * env(t, 0.001, 0.05) * a; };
const tablaNa = (t, a = 1) => (Math.sin(TAU * 520 * t) + Math.sin(TAU * 1040 * t) * 0.4 + Math.sin(TAU * 1590 * t) * 0.2) * env(t, 0.001, 0.12) * a;
const tablaGe = (t, a = 1) => Math.sin(TAU * (90 + 60 * Math.exp(-t * 5) + 25 * Math.min(1, t * 6)) * t) * env(t, 0.003, 0.3) * a; // bayan with pitch bend

// ---- kit ----
wav("dhin.wav", (() => { const f = lp(0.2); return mono(1.2, (t) => tablaGe(t, 1.2) + dholLow(t, 0.8) + Math.sin(TAU * 196 * t) * env(t, 0.002, 0.4) * 0.5 + f(noise()) * env(t, 0.001, 0.03) * 0.6); })());
wav("sting.wav", (() => { const notes = [62, 65, 69, 74]; return mono(2.2, (t) => notes.reduce((a, m, i) => { const f = mtof(m); return a + (Math.sin(TAU * f * t) + Math.sin(TAU * f * 2.003 * t) * 0.3) * Math.min(1, t / 0.02) * Math.exp(-t * 1.4) * 0.25; }, 0) + dholLow(t, 0.8)); })());
wav("boom.wav", (() => { const f = lp(0.12); return mono(2.4, (t) => Math.sin(TAU * (38 + 70 * Math.exp(-t * 7)) * t) * env(t, 0.004, 0.8) * 1.2 + f(noise()) * env(t, 0.001, 0.25) + Math.sin(TAU * 146.8 * t) * env(t, 0.01, 0.9) * 0.3); })());
wav("crash.wav", (() => { const f = lp(0.15); let ph = 0; return mono(2.6, (t) => { ph += TAU * (420 * Math.pow(0.15, t)) / SR; return Math.sin(ph) * env(t, 0.01, 0.9) * 0.5 + Math.sin(TAU * (34 + 60 * Math.exp(-t * 6)) * t) * env(t, 0.003, 0.9) + f(noise()) * env(t, 0.001, 0.3) * 1.1; }); })());
wav("stamp.wav", (() => { const f = lp(0.3); return mono(1.0, (t) => Math.sin(TAU * (60 + 120 * Math.exp(-t * 25)) * t) * env(t, 0.001, 0.22) + f(noise()) * env(t, 0.001, 0.05) * 1.2); })());
wav("curtain.wav", (() => { const f = lp(0.06), g = lp(0.3); return mono(1.4, (t) => (f(noise()) * 2 + g(noise()) * 0.3) * Math.sin(Math.PI * t / 1.4) ** 1.5); })());
wav("whoosh.wav", (() => { const f = lp(0.05); return mono(0.6, (t) => f(noise()) * Math.sin(Math.PI * t / 0.6) ** 2 * 2.5); })());
wav("pop.wav", mono(0.25, (t) => Math.sin(TAU * (260 + 700 * Math.exp(-t * 40)) * t) * env(t, 0.001, 0.05)));
wav("tick.wav", mono(0.12, (t) => tablaNa(t, 0.6)));
wav("coins.wav", (() => { const b = new Float32Array(Math.ceil(1.4 * SR)); for (let k = 0; k < 12; k++) { const s0 = Math.round((k * 0.06 + rand() * 0.03) * SR), f = 2300 + rand() * 1800; for (let i = 0; i < 0.4 * SR; i++) { const tt = i / SR; b[s0 + i] += Math.sin(TAU * f * tt) * env(tt, 0.001, 0.09) * 0.4; } } return b; })());
wav("rise.wav", mono(1.2, (t) => (Math.sin(TAU * 200 * Math.pow(3, t / 1.2) * t) * 0.5) * Math.sin(Math.PI * t / 1.2) ** 2));
wav("fall.wav", (() => { let ph = 0; return mono(1.0, (t) => { ph += TAU * 900 * Math.pow(0.25, t) / SR; return Math.sin(ph) * Math.sin(Math.PI * t) * 0.5; }); })());
wav("clock.wav", mono(1.6, (t) => [0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2].reduce((a, s, i) => a + (t >= s ? Math.sin(TAU * (i % 2 ? 1900 : 1500) * (t - s)) * env(t - s, 0.001, 0.02) : 0), 0)));
wav("win.wav", (() => { const notes = [62, 66, 69, 74, 78]; return mono(2.4, (t) => notes.reduce((a, m, i) => { const s = i * 0.08; return t < s ? a : a + Math.sin(TAU * mtof(m) * (t - s)) * env(t - s, 0.005, 0.7) * 0.3; }, 0)); })());
wav("interval.wav", (() => { const notes = [[62, 0], [66, 0.18], [69, 0.36], [74, 0.6]]; return mono(2.6, (t) => notes.reduce((a, [m, s]) => { if (t < s) return a; const tt = t - s, f = mtof(m); let v = 0; for (let k = 1; k <= 6; k++) v += Math.sin(TAU * f * k * tt) / k; return a + v * env(tt, 0.02, s === 0.6 ? 1.2 : 0.3) * 0.25; }, 0) + (t > 0.6 ? dholLow(t - 0.6) : 0)); })());
wav("applause.wav", (() => { const L = new Float32Array(Math.ceil(3.5 * SR)); for (let k = 0; k < 600; k++) { const s0 = Math.round(rand() * 3.0 * SR), f = lp(0.4 + rand() * 0.4); for (let i = 0; i < 0.02 * SR; i++) L[s0 + i] += f(noise()) * Math.exp(-i / SR / 0.004) * 0.5; } for (let i = 0; i < L.length; i++) { const t = i / SR; L[i] *= Math.min(1, t / 0.4) * Math.min(1, (3.5 - t) / 1.2); } return L; })());

// ---- score: D Bhairav-flavoured (D Eb F# G A Bb C#), dhol/tabla groove ----
const DUR = TL.total, N = Math.ceil(DUR * SR);
const L = new Float32Array(N), R = new Float32Array(N);
const add = (t0, dur, pan, fn) => { const s0 = Math.round(t0 * SR), n = Math.round(dur * SR), gl = Math.cos(((pan + 1) * Math.PI) / 4), gr = Math.sin(((pan + 1) * Math.PI) / 4); for (let i = 0; i < n && s0 + i < N; i++) { if (s0 + i < 0) continue; const v = fn(i / SR); L[s0 + i] += v * gl; R[s0 + i] += v * gr; } };
// sitar-ish: Karplus-Strong with a buzzy bridge (soft clip) + sympathetic shimmer
const sitar = (t0, m, amp, pan, dur = 1.6, bend = 0) => {
  const f0 = mtof(m), period = Math.round(SR / f0), buf = new Float32Array(period); for (let i = 0; i < period; i++) buf[i] = noise();
  let idx = 0;
  add(t0, dur, pan, (t) => { const a = buf[idx], b = buf[(idx + 1) % period]; buf[idx] = (a + b) * 0.4992; idx = (idx + 1) % period; const v = Math.tanh(a * 2.2); return (v + Math.sin(TAU * f0 * 2 * (1 + bend * Math.min(1, t * 3)) * t) * 0.15 * Math.exp(-t * 2)) * amp * Math.min(1, (dur - t) / 0.2); });
};
const tanpura = (t0, dur, amp) => [50, 57, 62, 38].forEach((m, i) => { const f = mtof(m); add(t0, dur, (i - 1.5) * 0.3, (t) => { let v = 0; for (let k = 1; k <= 8; k++) v += Math.sin(TAU * f * k * t + Math.sin(t * 0.7 + k)) / (k * (1 + 0.3 * Math.sin(t * 0.5 + k))); return v * amp * 0.18 * Math.min(1, t / 2) * Math.min(1, (dur - t) / 2); }); });
const strings = (t0, dur, notes, amp) => notes.forEach((m, ni) => { const f = mtof(m), fl = lp(0.05); add(t0, dur + 1.2, (ni / Math.max(1, notes.length - 1)) - 0.5, (t) => fl(((t * f) % 1) * 2 - 1 + (((t * f * 1.004) % 1) * 2 - 1)) * Math.min(1, t / 1.0) * (t > dur ? Math.max(0, 1 - (t - dur) / 1.2) : 1) * amp); });
const SCALE = [62, 63, 66, 67, 69, 70, 73, 74];
const BPM = 100, beat = 60 / BPM, bar = beat * 4;
tanpura(0, DUR, 0.5);
const quiet = (t) => (t > sc("s5").start - 0.2 && t < sc("s5").start + 2.4) || (t > line("s5", 0) + 1.6 && t < line("s5", 0) + 4.5);
for (let k = 0, t = 0; t < DUR - 2; k++, t += bar) {
  const inIntro = t < line("s1", 2) - 0.5;
  const dark = t >= line("s5", 0) && t < sc("s6").start;
  const lift = t >= sc("s6").start && t < sc("s7").start;
  const ending = t >= sc("s8").start;
  if (quiet(t) || quiet(t + bar * 0.5)) continue;
  // strings pad: i – bII colour – V
  const prog = dark ? [[50, 53, 57], [51, 55, 58], [49, 52, 57], [50, 53, 57]] : [[50, 54, 57], [51, 55, 58], [50, 54, 57], [49, 52, 57]];
  strings(t, bar, prog[k % 4].map((m) => m + 12), dark ? 0.05 : lift || ending ? 0.06 : 0.035);
  // sitar phrase: a short motif walking the scale
  const motif = [0, 2, 3, 4, 3, 2, 1, 0];
  if (!dark) for (let j = 0; j < (inIntro ? 4 : 8); j++) sitar(t + j * beat / 2, SCALE[(motif[j] + (k % 2) * 2) % 8] + (j === 7 ? 12 : 0), 0.18, j % 2 ? 0.25 : -0.25, 1.2, j === 3 ? 0.03 : 0);
  if (inIntro) continue;
  // dhol: dha . dhin dha | . dha dhin .   (bhangra-lite on 8ths)
  const pat = dark ? [1, 0, 0, 0, 1, 0, 0, 0] : [1, 0, 2, 1, 0, 1, 2, 0];
  pat.forEach((h, j) => { const tt = t + j * beat / 2; if (h === 1) add(tt, 0.5, 0, (x) => dholLow(x, 0.7)); if (h === 2) add(tt, 0.3, 0.2, (x) => dholHigh(x, 0.5)); });
  if (!dark) for (let j = 0; j < 16; j++) { const tt = t + j * beat / 4; add(tt, 0.2, j % 2 ? 0.3 : -0.3, (x) => tablaNa(x, j % 4 === 0 ? 0.22 : 0.1)); if (j % 8 === 6) add(tt, 0.4, -0.1, (x) => tablaGe(x, 0.35)); }
}
for (let i = 0; i < N; i++) { const t = i / SR, g = Math.min(1, t / 0.8) * Math.min(1, (DUR - t) / 1.8); L[i] *= g; R[i] *= g; }
wav("score.wav", L, R);
console.log(`score ${DUR.toFixed(1)}s`);
