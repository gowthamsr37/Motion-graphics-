// Original documentary score + sea ambience + foley kit, synthesized from scratch (deterministic, no samples).
// Reads src/timeline.json so the score's sections land on the narration.
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

let seed = 1497;
const rand = () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const noise = () => rand() * 2 - 1;
const lp = (k) => { let y = 0; return (x) => (y += k * (x - y)); };
const hp = (k) => { let y = 0, px = 0; return (x) => { y = k * (y + x - px); px = x; return y; }; };
const env = (t, a, d) => Math.min(1, t / a) * Math.exp(-t / d);

function wav(name, L, R = L, peak = 0.89) {
  const n = L.length, buf = Buffer.alloc(44 + n * 4);
  buf.write("RIFF", 0); buf.writeUInt32LE(36 + n * 4, 4); buf.write("WAVE", 8); buf.write("fmt ", 12);
  buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write("data", 36); buf.writeUInt32LE(n * 4, 40);
  let m = 0;
  for (let i = 0; i < n; i++) m = Math.max(m, Math.abs(L[i]), Math.abs(R[i]));
  const g = m > 0 ? peak / m : 1;
  for (let i = 0; i < n; i++) {
    buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i] * g)) * 32767), 44 + i * 4);
    buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i] * g)) * 32767), 46 + i * 4);
  }
  writeFileSync(join(OUT, name), buf);
}
const mono = (dur, fn) => { const b = new Float32Array(Math.ceil(dur * SR)); for (let i = 0; i < b.length; i++) b[i] = fn(i / SR, i); return b; };

// ---------------- foley ----------------
wav("parchment.wav", (() => { const f = hp(0.9), g = lp(0.3); return mono(0.9, (t) => g(f(noise())) * (0.4 + 0.6 * Math.abs(Math.sin(t * 23 + Math.sin(t * 7) * 3))) * Math.sin(Math.PI * t / 0.9)); })());
wav("creak.wav", (() => { let ph = 0; const f = lp(0.08); return mono(1.4, (t) => { const fr = 70 + 40 * Math.sin(t * 2.3) + 15 * Math.sin(t * 9); ph += fr / SR; const pulse = (ph % 1) < 0.08 ? 1 : 0; return f(pulse * (0.6 + 0.4 * noise())) * Math.sin(Math.PI * t / 1.4) * 4; }); })());
wav("whoosh.wav", (() => { const f = lp(0.04); return mono(1.0, (t) => f(noise()) * Math.sin(Math.PI * Math.min(1, t / 1.0)) ** 2 * 2.5); })());
wav("quill.wav", (() => { const b = new Float32Array(Math.ceil(1.2 * SR)); let t = 0; while (t < 1.05) { const s0 = Math.round(t * SR), len = 0.03 + rand() * 0.08, f = hp(0.97); for (let i = 0; i < len * SR; i++) b[s0 + i] += f(noise()) * Math.sin(Math.PI * i / (len * SR)) * (0.5 + rand() * 0.5); t += len + rand() * 0.04; } return b; })());
wav("thud.wav", mono(1.6, (t) => Math.sin(TAU * (42 + 50 * Math.exp(-t * 14)) * t) * env(t, 0.004, 0.5) + noise() * env(t, 0.001, 0.02) * 0.3));
wav("seeds.wav", (() => { const b = new Float32Array(Math.ceil(1.0 * SR)); for (let k = 0; k < 26; k++) { const s0 = Math.round((0.02 + Math.pow(rand(), 1.6) * 0.8) * SR), f = 2200 + rand() * 2600; for (let i = 0; i < 0.025 * SR; i++) b[s0 + i] += Math.sin(TAU * f * i / SR) * Math.exp(-i / SR / 0.004) * (0.4 + rand() * 0.6); } return b; })());
wav("chime.wav", mono(2.4, (t) => [880, 1318.5, 1760].reduce((a, f, i) => a + Math.sin(TAU * f * t) * env(t, 0.002, 0.9 - i * 0.2) / (i + 1), 0)));
wav("coin.wav", mono(0.9, (t) => (Math.sin(TAU * 2637 * t) * 0.5 + Math.sin(TAU * 3951 * t) * 0.35 + Math.sin(TAU * 5274 * t) * 0.2) * env(t, 0.001, 0.18) + noise() * env(t, 0.0005, 0.006)));
wav("coins.wav", (() => { const b = new Float32Array(Math.ceil(1.6 * SR)); for (let k = 0; k < 16; k++) { const s0 = Math.round((k * 0.06 + rand() * 0.04) * SR), f = 2300 + rand() * 1800; for (let i = 0; i < 0.4 * SR; i++) { const tt = i / SR; b[s0 + i] += (Math.sin(TAU * f * tt) + Math.sin(TAU * f * 1.5 * tt) * 0.5) * env(tt, 0.001, 0.09) * 0.4; } } return b; })());
wav("seal.wav", (() => { const f = lp(0.25); return mono(0.8, (t) => Math.sin(TAU * (90 + 80 * Math.exp(-t * 30)) * t) * env(t, 0.002, 0.12) + f(noise()) * env(t, 0.001, 0.04)); })());
wav("drum.wav", (() => { const f = lp(0.2); return mono(2.2, (t) => Math.sin(TAU * (55 + 60 * Math.exp(-t * 9)) * t) * env(t, 0.005, 0.7) * 1.2 + f(noise()) * env(t, 0.001, 0.06) * 0.6); })());
wav("wind.wav", (() => { const f = lp(0.012), g = lp(0.03); return mono(3.5, (t) => (f(noise()) * 3 + g(noise()) * 0.8 * Math.sin(t * 2.1)) * Math.sin(Math.PI * t / 3.5) ** 1.5); })());
wav("swell.wav", (() => { const f = lp(0.02); let ph1 = 0, ph2 = 0; return mono(4.5, (t) => { ph1 += TAU * 73.4 / SR; ph2 += TAU * 110 / SR; const e = Math.min(1, t / 2.2) ** 2 * Math.exp(-Math.max(0, t - 2.2) / 0.8); return (Math.sin(ph1) * 0.6 + Math.sin(ph2) * 0.4 + f(noise()) * 1.5) * e; }); })());

// ---------------- sea ambience (whole piece) ----------------
const DUR = TL.total, N = Math.ceil(DUR * SR);
{
  const L = new Float32Array(N), R = new Float32Array(N);
  const fl = lp(0.02), fr = lp(0.02), hl = lp(0.2), hr = lp(0.2);
  for (let i = 0; i < N; i++) {
    const t = i / SR;
    const wave = 0.35 + 0.65 * Math.max(0, Math.sin(TAU * t / 7.3) * 0.6 + Math.sin(TAU * t / 11.1 + 1) * 0.4);
    const wave2 = 0.35 + 0.65 * Math.max(0, Math.sin(TAU * t / 8.1 + 2) * 0.6 + Math.sin(TAU * t / 12.7) * 0.4);
    L[i] = (fl(noise()) * 2.2 + (hl(noise()) - 0) * 0.15 * wave) * wave;
    R[i] = (fr(noise()) * 2.2 + (hr(noise()) - 0) * 0.15 * wave2) * wave2;
    const g = Math.min(1, t / 2) * Math.min(1, (DUR - t) / 2);
    L[i] *= g; R[i] *= g;
  }
  wav("sea.wav", L, R, 0.5);
}

// ---------------- score: D minor, documentary ----------------
const L = new Float32Array(N), R = new Float32Array(N);
const add = (t0, dur, pan, fn) => {
  const s0 = Math.round(t0 * SR), n = Math.round(dur * SR);
  const gl = Math.cos(((pan + 1) * Math.PI) / 4), gr = Math.sin(((pan + 1) * Math.PI) / 4);
  for (let i = 0; i < n && s0 + i < N; i++) { if (s0 + i < 0) continue; const v = fn(i / SR); L[s0 + i] += v * gl; R[s0 + i] += v * gr; }
};
const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
const TBL = 4096, SAW = new Float32Array(TBL);
for (let i = 0; i < TBL; i++) { let v = 0; for (let k = 1; k <= 12; k++) v += Math.sin((TAU * k * i) / TBL) / k; SAW[i] = v * 0.55; }
const saw = (ph) => SAW[Math.floor((ph / TAU) * TBL) & (TBL - 1)];

const strings = (t0, dur, notes, amp, att = 2, rel = 2.5, bright = 0.04) => notes.forEach((m, ni) => {
  for (let v = 0; v < 3; v++) {
    const f = mtof(m) * (1 + (v - 1) * 0.0018), filt = lp(bright);
    let ph = rand() * TAU; const vib = 4.5 + rand();
    add(t0, dur + rel, ((ni / Math.max(1, notes.length - 1)) * 2 - 1) * 0.5 + (v - 1) * 0.15, (t) => {
      ph += (TAU * f * (1 + 0.0025 * Math.sin(TAU * vib * t))) / SR;
      const e = Math.min(1, t / att) * (t > dur ? Math.max(0, 1 - (t - dur) / rel) : 1);
      return filt(saw(ph)) * e * amp * 0.3;
    });
  }
});
// Karplus-Strong pluck (harp / oud colour)
const pluck = (t0, m, amp, pan, dur = 3) => {
  const f = mtof(m), period = Math.round(SR / f), buf = new Float32Array(period);
  for (let i = 0; i < period; i++) buf[i] = noise();
  let idx = 0;
  add(t0, dur, pan, (t) => { const a = buf[idx], b = buf[(idx + 1) % period]; buf[idx] = (a + b) * 0.4985; idx = (idx + 1) % period; return a * amp * Math.min(1, (dur - t) / 0.3); });
};
const frame = (t0, amp) => { const f = lp(0.15); add(t0, 0.9, 0, (t) => Math.sin(TAU * (68 + 40 * Math.exp(-t * 18)) * t) * env(t, 0.003, 0.28) * amp + f(noise()) * env(t, 0.001, 0.03) * amp * 0.5); };
const drone = (t0, dur, m, amp) => { let p1 = 0, p2 = 0; add(t0, dur, 0, (t) => { p1 += TAU * mtof(m) / SR; p2 += TAU * mtof(m + 7) / SR; const e = Math.min(1, t / 3) * Math.min(1, (dur - t) / 3); return (Math.sin(p1) + Math.sin(p2) * 0.35 + Math.sin(p1 * 2) * 0.15) * e * amp * (1 + 0.12 * Math.sin(TAU * 0.09 * t)); }); };

// Chord path: Dm – Bb – Gm – A (i – VI – iv – V), 8 s each; brighter (F – C) in the Portugal section.
const CH = { Dm: [50, 57, 62, 65], Bb: [46, 53, 58, 62], Gm: [43, 50, 55, 58], A: [45, 52, 57, 61], F: [41, 48, 53, 57], C: [48, 55, 60, 64] };
const prog1 = ["Dm", "Bb", "Gm", "A"], prog2 = ["Dm", "F", "C", "A"];
const BAR = 8;
const s3 = sc("s3").start, s4 = sc("s4").start, s5 = sc("s5").start, title = sent("s5", 4) + 2.3;
drone(0, DUR, 38, 0.1);
for (let t = 0, k = 0; t < title - 0.5; t += BAR, k++) {
  const name = (t >= s4 && t < s5 ? prog2 : prog1)[k % 4];
  const amp = t < sent("s1", 1) ? 0.05 : t < s3 ? 0.07 : 0.085;
  strings(t, Math.min(BAR, title - t), CH[name], amp);
  // harp arpeggio, gently rising
  if (t >= sent("s1", 1) - 1) {
    const notes = CH[name].map((m) => m + 12);
    for (let j = 0; j < 8; j++) pluck(t + j * (BAR / 8), notes[(j * 3) % 4] + (j > 4 ? 12 : 0), 0.16, j % 2 ? 0.35 : -0.35);
  }
  // frame drum pulse from the spice chain onward (the journey)
  if (t >= s3) for (let j = 0; j < 8; j++) { frame(t + j, j % 4 === 0 ? 0.5 : 0.25); if (t >= s5 && j % 2) frame(t + j + 0.5, 0.18); }
}
// title swell: open D major chord, harp flourish
strings(title, DUR - title - 2, [38, 50, 57, 62, 66, 69], 0.11, 1.5, 3, 0.06);
for (let j = 0; j < 10; j++) pluck(title + j * 0.09, [62, 66, 69, 74, 78, 81, 86, 81, 78, 74][j], 0.2, (j / 9) * 1.4 - 0.7, 4);
frame(title, 0.8);
for (let i = 0; i < N; i++) { const t = i / SR, g = Math.min(1, t / 1.5) * Math.min(1, (DUR - t) / 2.5); L[i] *= g; R[i] *= g; }
wav("score.wav", L, R);
console.log(`score ${DUR.toFixed(1)}s`);
