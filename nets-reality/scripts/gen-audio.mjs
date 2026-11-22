// Nets Reality: shot schedule + music and SFX, synthesised from scratch (no samples, deterministic).
// Writes src/schedule.json (the visuals read it) and public/audio/{music,sfx}.wav.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const FPS = 30, SR = 48000, TAU = Math.PI * 2;
const TOTAL_F = 570;

// ---------- schedule (frames) ----------
const IN_F = 8; // ball travel from bowler to bat
const exp = { bowl: 46, hit: 46 + IN_F, land: 46 + IN_F + 34 };
const shots = [];
let t = 150, g = 15;
for (let k = 0; k < 45; k++) { shots.push({ bowl: t, hit: t + IN_F, land: t + IN_F + 14 }); t += Math.round(g); g = Math.max(2, g * 0.9); }
const lastHit = shots[shots.length - 1].hit;
const fin = { bowl: lastHit + 26, hit: lastHit + 26 + IN_F, land: lastHit + 26 + IN_F + 38 };
const endCard = fin.land + 40;
const schedule = { total: TOTAL_F, inF: IN_F, exp, shots, fin, endCard, panel2: 118 };
writeFileSync(join(ROOT, "src", "schedule.json"), JSON.stringify(schedule, null, 1));

// ---------- dsp ----------
const N = Math.ceil((TOTAL_F / FPS) * SR);
let seed = 7;
const rand = () => { seed = (seed + 0x6d2b79f5) | 0; let x = Math.imul(seed ^ (seed >>> 15), 1 | seed); x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x; return ((x ^ (x >>> 14)) >>> 0) / 4294967296; };
const noise = () => rand() * 2 - 1;
const sec = (f) => f / FPS;
function add(L, R, t0, dur, pan, fn) {
  const s0 = Math.round(t0 * SR), n = Math.round(dur * SR);
  const gl = Math.cos(((pan + 1) * Math.PI) / 4), gr = Math.sin(((pan + 1) * Math.PI) / 4);
  for (let i = 0; i < n; i++) { const k = s0 + i; if (k >= L.length) break; if (k < 0) continue; const v = fn(i / SR); L[k] += v * gl; R[k] += v * gr; }
}
function wav(L, R) {
  const n = L.length, b = Buffer.alloc(44 + n * 4);
  b.write("RIFF", 0); b.writeUInt32LE(36 + n * 4, 4); b.write("WAVE", 8); b.write("fmt ", 12); b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(2, 22);
  b.writeUInt32LE(SR, 24); b.writeUInt32LE(SR * 4, 28); b.writeUInt16LE(4, 32); b.writeUInt16LE(16, 34); b.write("data", 36); b.writeUInt32LE(n * 4, 40);
  for (let i = 0; i < n; i++) { b.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i])) * 32767), 44 + i * 4); b.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i])) * 32767), 46 + i * 4); }
  return b;
}
const normalize = (arrs, peak) => { let m = 0; for (const a of arrs) for (const v of a) m = Math.max(m, Math.abs(v)); for (const a of arrs) for (let i = 0; i < a.length; i++) a[i] *= peak / m; };
const nf = (name) => { const map = { C: -9, D: -7, E: -5, F: -4, G: -2, A: 0, B: 2 }; const m = name.match(/^([A-G])(\d)$/); return 440 * 2 ** ((map[m[1]] + (Number(m[2]) - 4) * 12) / 12); };

// Karplus-Strong plucked string (warm, ukulele/guitar-like)
function pluck(L, R, t0, f, amp, pan = 0, dur = 1.6, damp = 0.996) {
  const len = Math.round(SR / f), buf = new Float32Array(len);
  for (let i = 0; i < len; i++) buf[i] = noise();
  let idx = 0, lp = 0;
  add(L, R, t0, dur, pan, (tt) => { const a = buf[idx], b2 = buf[(idx + 1) % len]; const v = damp * 0.5 * (a + b2); buf[idx] = v; idx = (idx + 1) % len; lp += 0.5 * (a - lp); return lp * amp * Math.min(1, (dur - tt) / 0.2); });
}
function pad(L, R, t0, dur, freqs, amp) {
  for (const f of freqs) for (const d of [0.996, 1.004]) { let ph = rand() * TAU; add(L, R, t0, dur, d < 1 ? -0.3 : 0.3, (tt) => { ph += (TAU * f * d) / SR; const env = Math.min(1, tt / 0.6) * Math.min(1, (dur - tt) / 0.6); return (Math.sin(ph) + 0.2 * Math.sin(2 * ph)) * env * amp; }); }
}
function kick(L, R, t0, amp) { add(L, R, t0, 0.4, 0, (tt) => Math.sin(TAU * (45 * tt + (110 * (1 - Math.exp(-tt * 30))) / 30)) * Math.exp(-tt * 7) * amp * Math.min(1, tt / 0.002)); }
function clap(L, R, t0, amp) { for (const dt of [0, 0.011, 0.022]) { let lp = 0; add(L, R, t0 + dt, 0.18, 0, (tt) => { const x = noise(); lp += 0.35 * (x - lp); return (x - lp) * Math.exp(-tt * (dt < 0.02 ? 60 : 18)) * amp; }); } }
function shaker(L, R, t0, amp) { let lp = 0; add(L, R, t0, 0.07, 0.35, (tt) => { const x = noise(); lp += 0.6 * (x - lp); return (x - lp) * Math.exp(-tt * 55) * amp; }); }

// ---------- music: bright plucked loop, C G Am F at 100 BPM ----------
const ML = new Float32Array(N), MR = new Float32Array(N);
const BEAT = 60 / 100, BAR = BEAT * 4;
const PROG = [["C3", "G3", "C4", "E4", "G4"], ["G2", "D3", "G3", "B3", "D4"], ["A2", "E3", "A3", "C4", "E4"], ["F2", "C3", "F3", "A3", "C4"]];
const silenceFrom = sec(fin.bowl) - 0.15, silenceTo = sec(fin.hit); // the held breath before the last ball
const resume = sec(fin.hit);
const endT = TOTAL_F / FPS;
const arpOrder = [0, 2, 3, 4, 3, 2, 1, 2];
function bars(from, to, level) {
  for (let tb = from, bar = 0; tb < to - 0.01; tb += BAR, bar++) {
    const c = PROG[bar % 4].map(nf);
    for (let s = 0; s < 8; s++) {
      const ts = tb + s * BEAT / 2; if (ts >= to) break;
      pluck(ML, MR, ts, c[arpOrder[s]], s === 0 ? 0.5 : 0.36, ((s % 3) - 1) * 0.4);
      if (level >= 1) shaker(ML, MR, ts + BEAT / 4, 0.05);
    }
    if (level >= 1) for (let b = 0; b < 4; b++) { const tk = tb + b * BEAT; if (tk < to) { kick(ML, MR, tk, b % 2 ? 0.35 : 0.5); if (b % 2) clap(ML, MR, tk, 0.16); } }
    pad(ML, MR, tb, Math.min(BAR, to - tb), [c[0] * 2, c[2], c[3]], level >= 2 ? 0.05 : 0.03);
  }
}
// level 0 (piano-light) for the expectation, the groove kicks in when reality starts
const groove = sec(schedule.panel2);
bars(0, groove, 0);
bars(groove, silenceFrom, 1);
bars(resume, endT - 0.6, 2);
// ending: last big chord + fade
pluck(ML, MR, endT - 2.4, nf("C3"), 0.6, -0.2, 2.4); pluck(ML, MR, endT - 2.4, nf("E4"), 0.4, 0.2, 2.4);
for (let i = 0; i < ML.length; i++) { const tt = i / SR; const fade = Math.min(1, Math.max(0, (endT - tt) / 1.2)); ML[i] *= fade; MR[i] *= fade; }
normalize([ML, MR], 0.55);

// ---------- SFX ----------
const SL = new Float32Array(N), SR_ = new Float32Array(N);
function tock(t0, amp) { // willow on leather
  let p1 = 0, p2 = 0, lp = 0;
  add(SL, SR_, t0, 0.12, -0.2, (tt) => { p1 += (TAU * 1150) / SR; p2 += (TAU * 2400) / SR; lp += 0.4 * (noise() - lp); return (Math.sin(p1) * 0.7 + Math.sin(p2) * 0.35) * Math.exp(-tt * 70) * amp + lp * Math.exp(-tt * 200) * amp * 0.8; });
}
function whoosh(t0, dur, amp, pan = 0) { let lp = 0, bp = 0; add(SL, SR_, t0, dur, pan, (tt) => { const k = 0.02 + 0.25 * Math.sin((Math.PI * tt) / dur); lp += k * (noise() - lp); bp += 0.5 * (lp - bp); return (lp - bp) * Math.sin((Math.PI * tt) / dur) ** 2 * amp; }); }
function thud(t0, amp, pan) { let ph = 0; add(SL, SR_, t0, 0.12, pan, (tt) => { ph += (TAU * (170 - 300 * tt)) / SR; return Math.sin(ph) * Math.exp(-tt * 40) * amp; }); }
function cheer(t0, dur, amp) {
  for (const pan of [-0.6, 0, 0.6]) { let a = 0, b = 0, c = 0; add(SL, SR_, t0, dur, pan, (tt) => { const x = noise(); a += 0.18 * (x - a); b += 0.04 * (a - b); c += 0.5 * ((a - b) - c); const env = Math.min(1, tt / 0.25) * Math.exp(-Math.max(0, tt - 0.5) * 1.1); return c * env * amp * (1 + 0.3 * Math.sin(TAU * (3 + pan) * tt)); }); }
  for (let v = 0; v < 18; v++) { const f0 = 300 + rand() * 500, st = rand() * 0.6, d = 0.6 + rand() * 1.2; let ph = 0; add(SL, SR_, t0 + st, d, rand() * 1.6 - 0.8, (tt) => { ph += (TAU * f0 * (1 + 0.25 * Math.sin(Math.PI * tt / d)) * (1 + 0.01 * Math.sin(TAU * 6 * tt))) / SR; return (Math.sin(ph) + 0.3 * Math.sin(3 * ph)) * Math.sin(Math.PI * tt / d) ** 2 * amp * 0.06; }); }
  // a whistle
  { let ph = 0; add(SL, SR_, t0 + 0.2, 0.9, 0.3, (tt) => { ph += (TAU * (2200 + 500 * Math.min(1, tt * 4) - 300 * Math.max(0, tt - 0.5))) / SR; return Math.sin(ph) * Math.sin(Math.PI * tt / 0.9) * amp * 0.12; }); }
}
function pencil(t0, dur, amp) { let lp = 0; add(SL, SR_, t0, dur, 0.1, (tt) => { const x = noise(); lp += 0.7 * (x - lp); return (x - lp) * amp * (0.5 + 0.5 * Math.abs(Math.sin(TAU * 7 * tt))) * Math.min(1, tt / 0.03, (dur - tt) / 0.05); }); }

pencil(sec(16), 0.6, 0.05); whoosh(sec(0), 0.35, 0.25);
tock(sec(exp.hit), 0.55); whoosh(sec(exp.hit), sec(exp.land - exp.hit), 0.14, 0.4); cheer(sec(exp.land), 2.4, 0.5);
pencil(sec(schedule.panel2), 0.6, 0.05);
shots.forEach((s, i) => { tock(sec(s.hit), 0.32 - i * 0.003); thud(sec(s.land), 0.18, (rand() - 0.5) * 0.4); });
tock(sec(fin.hit), 0.75); whoosh(sec(fin.hit), sec(fin.land - fin.hit), 0.18, 0.5); cheer(sec(fin.land) - 0.1, 3.4, 0.8); kick(SL, SR_, sec(fin.hit), 0.6);
whoosh(sec(endCard) - 0.15, 0.4, 0.22);
normalize([SL, SR_], 0.8);

mkdirSync(join(ROOT, "public", "audio"), { recursive: true });
writeFileSync(join(ROOT, "public", "audio", "music.wav"), wav(ML, MR));
writeFileSync(join(ROOT, "public", "audio", "sfx.wav"), wav(SL, SR_));
console.log(JSON.stringify({ lastHit, fin, endCard }));
