// Sound kit for the series, synthesised from scratch (no samples, deterministic, no copyright issues).
// public/audio/sfx/*.wav: one-shots the formats place on their events.
// public/audio/music/m0..m5.wav: 22 s plucked loops in different keys, tempos and moods.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SR = 48000, TAU = Math.PI * 2;
let seed = 11;
const rand = () => { seed = (seed + 0x6d2b79f5) | 0; let x = Math.imul(seed ^ (seed >>> 15), 1 | seed); x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x; return ((x ^ (x >>> 14)) >>> 0) / 4294967296; };
const noise = () => rand() * 2 - 1;
const buf = (sec) => [new Float32Array(Math.ceil(sec * SR)), new Float32Array(Math.ceil(sec * SR))];
function add([L, R], t0, dur, pan, fn) {
  const s0 = Math.round(t0 * SR), n = Math.round(dur * SR);
  const gl = Math.cos(((pan + 1) * Math.PI) / 4), gr = Math.sin(((pan + 1) * Math.PI) / 4);
  for (let i = 0; i < n; i++) { const k = s0 + i; if (k >= L.length) break; if (k < 0) continue; const v = fn(i / SR); L[k] += v * gl; R[k] += v * gr; }
}
function save(path, [L, R], peak) {
  let m = 0; for (const a of [L, R]) for (const v of a) m = Math.max(m, Math.abs(v));
  const g = m > 0 ? peak / m : 1, n = L.length, b = Buffer.alloc(44 + n * 4);
  b.write("RIFF", 0); b.writeUInt32LE(36 + n * 4, 4); b.write("WAVE", 8); b.write("fmt ", 12); b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(2, 22);
  b.writeUInt32LE(SR, 24); b.writeUInt32LE(SR * 4, 28); b.writeUInt16LE(4, 32); b.writeUInt16LE(16, 34); b.write("data", 36); b.writeUInt32LE(n * 4, 40);
  for (let i = 0; i < n; i++) { b.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i] * g)) * 32767), 44 + i * 4); b.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i] * g)) * 32767), 46 + i * 4); }
  mkdirSync(dirname(path), { recursive: true }); writeFileSync(path, b);
}
const nf = (name) => { const map = { C: -9, Db: -8, D: -7, Eb: -6, E: -5, F: -4, Gb: -3, G: -2, Ab: -1, A: 0, Bb: 1, B: 2 }; const m = name.match(/^([A-G]b?)(\d)$/); return 440 * 2 ** ((map[m[1]] + (Number(m[2]) - 4) * 12) / 12); };

// ---------- SFX ----------
const SFX = join(ROOT, "public", "audio", "sfx");
{ const b = buf(0.5); let lp = 0, bp = 0; add(b, 0, 0.45, 0, (t) => { const d = 0.45, k = 0.02 + 0.25 * Math.sin((Math.PI * t) / d); lp += k * (noise() - lp); bp += 0.5 * (lp - bp); return (lp - bp) * Math.sin((Math.PI * t) / d) ** 2; }); save(join(SFX, "whoosh.wav"), b, 0.7); }
{ const b = buf(0.3); let ph = 0; add(b, 0, 0.25, 0, (t) => { ph += (TAU * (900 - 1800 * t)) / SR; return Math.sin(ph) * Math.exp(-t * 22) * Math.min(1, t / 0.002); }); save(join(SFX, "pop.wav"), b, 0.6); }
{ const b = buf(0.2); let p1 = 0, p2 = 0, lp = 0; add(b, 0, 0.15, 0, (t) => { p1 += (TAU * 1150) / SR; p2 += (TAU * 2400) / SR; lp += 0.4 * (noise() - lp); return (Math.sin(p1) * 0.7 + Math.sin(p2) * 0.35) * Math.exp(-t * 70) + lp * Math.exp(-t * 200) * 0.8; }); save(join(SFX, "tock.wav"), b, 0.7); }
{ const b = buf(0.25); let lp = 0; add(b, 0, 0.2, 0, (t) => { const x = noise(); lp += 0.3 * (x - lp); return lp * Math.exp(-t * 30) * 2 + Math.sin(TAU * 140 * t) * Math.exp(-t * 35) * 0.6; }); save(join(SFX, "paper.wav"), b, 0.55); }
{ const b = buf(0.2); let ph = 0; add(b, 0, 0.15, 0, (t) => { ph += (TAU * (170 - 300 * t)) / SR; return Math.sin(ph) * Math.exp(-t * 40); }); save(join(SFX, "thud.wav"), b, 0.5); }
{ const b = buf(1.6); for (const [f, a] of [[1318.5, 1], [1975.5, 0.5], [2637, 0.25]]) { let ph = 0; add(b, 0, 1.5, 0, (t) => { ph += (TAU * f) / SR; return Math.sin(ph) * a * Math.exp(-t * 3) * Math.min(1, t / 0.003); }); } save(join(SFX, "ding.wav"), b, 0.55); }
{ const b = buf(1.2); let lp = 0; add(b, 0, 1.1, 0.1, (t) => { const x = noise(); lp += 0.7 * (x - lp); return (x - lp) * (0.5 + 0.5 * Math.abs(Math.sin(TAU * 7 * t))) * Math.min(1, t / 0.03, (1.1 - t) / 0.08); }); save(join(SFX, "scribble.wav"), b, 0.35); }
{ // success: bright arpeggio + shimmer
  const b = buf(2.2); [nf("C5"), nf("E5"), nf("G5"), nf("C6")].forEach((f, i) => { let ph = 0; add(b, i * 0.07, 1.8, (i - 1.5) * 0.3, (t) => { ph += (TAU * f) / SR; return (Math.sin(ph) + 0.3 * Math.sin(2 * ph)) * Math.exp(-t * 2.2) * Math.min(1, t / 0.004) * 0.5; }); });
  let hp = 0, prev = 0; add(b, 0.05, 1.8, 0, (t) => { const x = noise(); hp = 0.9 * (hp + x - prev); prev = x; return hp * Math.exp(-t * 2.5) * 0.12; }); save(join(SFX, "success.wav"), b, 0.7);
}
{ // cheer: crowd swell
  const b = buf(3.2);
  for (const pan of [-0.6, 0, 0.6]) { let a = 0, c = 0, d = 0; add(b, 0, 3.1, pan, (t) => { const x = noise(); a += 0.18 * (x - a); c += 0.04 * (a - c); d += 0.5 * ((a - c) - d); return d * Math.min(1, t / 0.25) * Math.exp(-Math.max(0, t - 0.5) * 1.1) * (1 + 0.3 * Math.sin(TAU * (3 + pan) * t)); }); }
  save(join(SFX, "cheer.wav"), b, 0.6);
}
{ // riser: rising filtered noise + tone into a hit
  const b = buf(1.6); let lp = 0, ph = 0; add(b, 0, 1.5, 0, (t) => { lp += (0.01 + 0.2 * (t / 1.5) ** 2) * (noise() - lp); ph += (TAU * (200 + 600 * (t / 1.5) ** 2)) / SR; return (lp * 1.5 + Math.sin(ph) * 0.15) * (t / 1.5) ** 2; }); save(join(SFX, "riser.wav"), b, 0.5);
}
{ const b = buf(0.6); add(b, 0, 0.5, 0, (t) => Math.sin(TAU * (45 * t + (110 * (1 - Math.exp(-t * 30))) / 30)) * Math.exp(-t * 6) * Math.min(1, t / 0.002)); save(join(SFX, "boom.wav"), b, 0.8); }
{ const b = buf(0.5); let ph = 0; add(b, 0, 0.45, 0, (t) => { ph += (TAU * (520 - 260 * t)) / SR; return (Math.sin(ph) + 0.3 * Math.sin(3 * ph)) * Math.exp(-t * 6) * Math.min(1, t / 0.01); }); save(join(SFX, "sad.wav"), b, 0.4); }

// ---------- MUSIC ----------
function pluck(b, t0, f, amp, pan = 0, dur = 1.6, damp = 0.996) {
  const len = Math.round(SR / f), wt = new Float32Array(len); for (let i = 0; i < len; i++) wt[i] = noise();
  let idx = 0, lp = 0;
  add(b, t0, dur, pan, (t) => { const a = wt[idx], c = wt[(idx + 1) % len]; wt[idx] = damp * 0.5 * (a + c); idx = (idx + 1) % len; lp += 0.5 * (a - lp); return lp * amp * Math.min(1, (dur - t) / 0.2); });
}
function pad(b, t0, dur, freqs, amp) { for (const f of freqs) for (const d of [0.996, 1.004]) { let ph = rand() * TAU; add(b, t0, dur, d < 1 ? -0.3 : 0.3, (t) => { ph += (TAU * f * d) / SR; return (Math.sin(ph) + 0.2 * Math.sin(2 * ph)) * Math.min(1, t / 0.6) * Math.min(1, (dur - t) / 0.6) * amp; }); } }
function kick(b, t0, amp) { add(b, t0, 0.4, 0, (t) => Math.sin(TAU * (45 * t + (110 * (1 - Math.exp(-t * 30))) / 30)) * Math.exp(-t * 7) * amp * Math.min(1, t / 0.002)); }
function clap(b, t0, amp) { for (const dt of [0, 0.011, 0.022]) { let lp = 0; add(b, t0 + dt, 0.18, 0, (t) => { const x = noise(); lp += 0.35 * (x - lp); return (x - lp) * Math.exp(-t * (dt < 0.02 ? 60 : 18)) * amp; }); } }
function shaker(b, t0, amp) { let lp = 0; add(b, t0, 0.07, 0.35, (t) => { const x = noise(); lp += 0.6 * (x - lp); return (x - lp) * Math.exp(-t * 55) * amp; }); }
function piano(b, t0, f, vel, pan = 0, dur = 3) {
  const parts = Array.from({ length: 6 }, (_, k) => ({ f: (k + 1) * f * Math.sqrt(1 + 0.00035 * (k + 1) ** 2), a: vel / (k + 1) ** 1.3, d: 0.6 + 0.7 * k, ph: 0 }));
  add(b, t0, dur, pan, (t) => { let v = 0; for (const p of parts) { p.ph += (TAU * p.f) / SR; v += Math.sin(p.ph) * p.a * Math.exp(-t * p.d); } return v * Math.min(1, t / 0.004) * Math.min(1, (dur - t) / 0.3); });
}
const LEN = 22;
const TRACKS = [
  { bpm: 100, inst: "pluck", prog: [["C3","G3","C4","E4","G4"],["G2","D3","G3","B3","D4"],["A2","E3","A3","C4","E4"],["F2","C3","F3","A3","C4"]] }, // bright pop
  { bpm: 84, inst: "piano", prog: [["A2","E3","A3","C4","E4"],["F2","C3","F3","A3","C4"],["C3","G3","C4","E4","G4"],["G2","D3","G3","B3","D4"]] }, // reflective piano
  { bpm: 112, inst: "pluck", prog: [["D3","A3","D4","F4","A4"],["Bb2","F3","Bb3","D4","F4"],["F2","C3","F3","A3","C4"],["C3","G3","C4","E4","G4"]] }, // driving minor
  { bpm: 92, inst: "pluck", prog: [["G2","D3","G3","B3","D4"],["E2","B2","E3","G3","B3"],["C3","G3","C4","E4","G4"],["D3","A3","D4","Gb4","A4"]] }, // warm major
  { bpm: 76, inst: "piano", prog: [["E2","B2","E3","G3","B3"],["C3","G3","C4","E4","G4"],["G2","D3","G3","B3","D4"],["D3","A3","D4","Gb4","A4"]] }, // emotional slow
  { bpm: 120, inst: "pluck", prog: [["F2","C3","F3","A3","C4"],["G2","D3","G3","B3","D4"],["E2","B2","E3","G3","B3"],["A2","E3","A3","C4","E4"]] }, // upbeat
];
const arp = [0, 2, 3, 4, 3, 2, 1, 2];
TRACKS.forEach((tr, ti) => {
  seed = 100 + ti;
  const b = buf(LEN), BEAT = 60 / tr.bpm, BAR = BEAT * 4;
  for (let tb = 0, bar = 0; tb < LEN; tb += BAR, bar++) {
    const c = tr.prog[bar % 4].map(nf), groove = tb >= BAR * 2; // first two bars light, then the groove
    for (let s = 0; s < 8; s++) {
      const ts = tb + (s * BEAT) / 2; if (ts >= LEN) break;
      if (tr.inst === "pluck") pluck(b, ts, c[arp[s]], s === 0 ? 0.5 : 0.34, ((s % 3) - 1) * 0.4);
      else if (s % 2 === 0 || groove) piano(b, ts, c[arp[s]] * 2, s === 0 ? 0.32 : 0.2, ((s % 3) - 1) * 0.3);
      if (groove && tr.inst === "pluck") shaker(b, ts + BEAT / 4, 0.05);
    }
    if (groove) for (let k = 0; k < 4; k++) { const tk = tb + k * BEAT; if (tk < LEN) { kick(b, tk, tr.inst === "piano" ? (k % 2 ? 0 : 0.3) : k % 2 ? 0.35 : 0.5); if (k % 2 && tr.inst === "pluck") clap(b, tk, 0.15); } }
    pad(b, tb, Math.min(BAR, LEN - tb), [c[0] * 2, c[2], c[3]], tr.inst === "piano" ? 0.05 : 0.035);
  }
  save(join(ROOT, "public", "audio", "music", `m${ti}.wav`), b, 0.6);
});
console.log("audio kit written");

// clank: metal plates (inharmonic partials + noise)
{
  seed = 77;
  const b = buf(0.9);
  for (const [f, a, d] of [[523, 1, 7], [1371, 0.6, 9], [2489, 0.4, 12], [3720, 0.25, 15], [187, 0.7, 10]]) { let ph = rand() * TAU; add(b, 0, 0.85, 0, (t) => { ph += (TAU * f) / SR; return Math.sin(ph) * a * Math.exp(-t * d) * Math.min(1, t / 0.001); }); }
  let lp = 0; add(b, 0, 0.1, 0, (t) => { lp += 0.5 * (noise() - lp); return lp * Math.exp(-t * 60) * 1.2; });
  save(join(ROOT, "public", "audio", "sfx", "clank.wav"), b, 0.7);
}
