// ADAPT: keep instruments, section styles, SFX kit and mastering; rewrite the ev/sections timing for this video's scenes.
// Original score + SFX kit, synthesized from scratch (no samples, deterministic).
// Reads src/timeline.json so the arrangement changes and musical hits land on the same moments the visuals use.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "audio");
mkdirSync(OUT, { recursive: true });
const TL = JSON.parse(readFileSync(join(ROOT, "src", "timeline.json"), "utf8"));
const SR = 48000;
const TAU = Math.PI * 2;
const DUR = TL.total;
const N = Math.ceil(DUR * SR);

// ---------- timeline helpers (mirror src/timing.ts, in seconds) ----------
const sc = (id) => TL.scenes.find((s) => s.id === id);
const S = (id) => sc(id).start;
const E = (id) => sc(id).start + sc(id).duration;
const sent = (id, i) => sc(id).vo.at + sc(id).vo.segments[i].s;
const sentEnd = (id, i) => sc(id).vo.at + sc(id).vo.segments[i].e;
const norm = (w) => w.toLowerCase().replace(/[^a-z0-9]/g, "");
const cueS = (id, i, tok) => {
  const g = sc(id).vo.segments[i];
  const w = sc(id).vo.captions.flatMap((c) => c.words).find((x) => norm(x.w) === norm(tok) && x.s >= g.s - 0.3 && x.s <= g.e + 0.3);
  if (!w) throw new Error(`${id}: ${tok}`);
  return sc(id).vo.at + w.s;
};

const ev = {
  allData: 0.05, // the title card lands at frame 0
  sameType: sent("s1", 1),
  quiz: sent("s11", 0), // the poll prompt
  tease: sent("s11", 1),
  follow: sent("s11", 2),
  acc1: cueS("s4", 3, "out."), // RULES come out
  acc2: cueS("s6", 5, "tiny."), // the line fits
  acc3: sent("s10", 1), // save this
};

// ---------- dsp utils ----------
let seed = 2024;
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
const normalize = (bufs, peak) => {
  let m = 0;
  for (const b of bufs) for (const v of b) m = Math.max(m, Math.abs(v));
  if (m > 0) for (const b of bufs) for (let i = 0; i < b.length; i++) b[i] *= peak / m;
};
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
const TBL = 4096;
const SAW = new Float32Array(TBL);
for (let i = 0; i < TBL; i++) { let v = 0; for (let k = 1; k <= 16; k++) v += Math.sin((TAU * k * i) / TBL) / k; SAW[i] = v * 0.55; }
const saw = (ph) => SAW[Math.floor((ph / TAU) * TBL) & (TBL - 1)];
const note = (name) => {
  const map = { C: -9, "C#": -8, Db: -8, D: -7, "D#": -6, Eb: -6, E: -5, F: -4, "F#": -3, G: -2, "G#": -1, Ab: -1, A: 0, Bb: 1, B: 2 };
  const m = name.match(/^([A-G][#b]?)(\d)$/);
  return 440 * 2 ** ((map[m[1]] + (Number(m[2]) - 4) * 12) / 12);
};

// ---------- instruments ----------
function kick(L, R, t, amp = 1) {
  let ph = 0;
  add(L, R, t, 0.45, 0, (x) => {
    ph += (TAU * (46 + 110 * Math.exp(-x * 28))) / SR;
    return (Math.sin(ph) * Math.exp(-x * 7.5) + (x < 0.004 ? noise() * 0.5 : 0)) * amp;
  });
}
function clap(L, R, t, amp = 1) {
  let bp = 0, lp = 0;
  add(L, R, t, 0.3, 0.05, (x) => {
    const n = noise();
    lp += 0.45 * (n - lp); bp = n - lp; // crude high-pass
    const env = [0, 0.011, 0.022].reduce((a, d) => a + (x >= d ? Math.exp(-(x - d) * (d === 0.022 ? 18 : 90)) : 0), 0);
    return bp * env * amp * 0.5;
  });
}
function hat(L, R, t, amp = 1, open = false) {
  let lp = 0;
  add(L, R, t, open ? 0.25 : 0.06, 0.25, (x) => {
    const n = noise();
    lp += 0.6 * (n - lp);
    return (n - lp) * Math.exp(-x * (open ? 14 : 70)) * amp * 0.35;
  });
}
function bassNote(L, R, t, f, dur, amp = 1) {
  let p1 = 0, p2 = 0, lp = 0, lp2 = 0;
  add(L, R, t, dur, 0, (x) => {
    p1 += (TAU * f) / SR; p2 += (TAU * f * 0.5) / SR;
    const cut = 0.035 + 0.08 * Math.exp(-x * 16);
    lp += cut * (saw(p1) - lp); lp2 += cut * (lp - lp2);
    const env = Math.min(1, x / 0.006) * Math.min(1, (dur - x) / 0.03);
    return (lp2 * 1.4 + Math.sin(p2) * 0.55) * env * amp * 0.5;
  });
}
function pluck(L, R, t, f, amp = 1, pan = 0, bright = 1) {
  let p = 0, p2 = 0, lp = 0;
  add(L, R, t, 0.7, pan, (x) => {
    p += (TAU * f) / SR; p2 += (TAU * f * 1.006) / SR;
    const cut = (0.03 + 0.4 * Math.exp(-x * 22)) * bright;
    lp += Math.min(0.9, cut) * ((saw(p) + saw(p2)) * 0.5 - lp);
    return lp * Math.exp(-x * 6) * Math.min(1, x / 0.003) * amp * 0.38;
  });
}
function marimba(L, R, t, f, amp = 1, pan = 0) {
  add(L, R, t, 1.0, pan, (x) => (Math.sin(TAU * f * x) * Math.exp(-x * 7) + Math.sin(TAU * f * 3.98 * x) * 0.25 * Math.exp(-x * 26) + Math.sin(TAU * f * 10.1 * x) * 0.08 * Math.exp(-x * 60)) * Math.min(1, x / 0.002) * amp * 0.4);
}
function bell(L, R, t, f, amp = 1, pan = 0, dur = 2.2) {
  add(L, R, t, dur, pan, (x) => [1, 2.76, 5.4, 8.93].reduce((a, k, i) => a + Math.sin(TAU * f * k * x) * Math.exp(-x * (1.6 + i * 2.4)) / (i + 1), 0) * Math.min(1, x / 0.002) * amp * 0.3);
}
function pad(L, R, t, dur, freqs, amp = 1, att = 0.6, rel = 0.8, bright = 0.05) {
  freqs.forEach((f, ni) => {
    for (let v = 0; v < 3; v++) {
      const det = 1 + (v - 1) * 0.004;
      const pan = (ni / Math.max(1, freqs.length - 1) - 0.5) * 0.9 + (v - 1) * 0.2;
      let ph = rand() * TAU, lp = 0;
      add(L, R, t, dur + rel, pan, (x) => {
        ph += (TAU * f * det) / SR;
        lp += bright * (saw(ph) - lp);
        const env = Math.min(1, x / att) * (x > dur ? Math.max(0, 1 - (x - dur) / rel) : 1);
        return lp * env * amp * 0.16;
      });
    }
  });
}
function lead(L, R, t, f0, f1, dur, amp = 1) {
  // smooth gliding sine lead (continuous = no steps)
  let ph = 0;
  add(L, R, t, dur, 0.1, (x) => {
    const k = x / dur;
    const f = f0 * (f1 / f0) ** (k * k * (3 - 2 * k));
    ph += (TAU * f * (1 + 0.004 * Math.sin(TAU * 5.5 * x))) / SR;
    const env = Math.min(1, x / 0.08) * Math.min(1, (dur - x) / 0.25);
    return (Math.sin(ph) + 0.18 * Math.sin(2 * ph)) * env * amp * 0.22;
  });
}
function riser(L, R, t, dur, amp = 1) {
  let lp = 0, ph = 0;
  add(L, R, t, dur, 0, (x) => {
    const k = x / dur;
    lp += (0.01 + 0.5 * k * k) * (noise() - lp);
    ph += (TAU * (180 + 900 * k * k)) / SR;
    return (lp * 0.8 + Math.sin(ph) * 0.15) * k * k * amp;
  });
}
function impact(L, R, t, amp = 1) {
  let ph = 0, lp = 0, hp = 0, prev = 0;
  add(L, R, t, 2.6, 0, (x) => {
    ph += (TAU * (38 + 70 * Math.exp(-x * 9))) / SR;
    const n = noise(); lp += 0.06 * (n - lp); hp = 0.94 * (hp + n - prev); prev = n;
    return (Math.sin(ph) * Math.exp(-x * 2.4) * 1.1 + lp * Math.exp(-x * 5) * 0.8 + hp * Math.exp(-x * 2.2) * 0.25) * amp;
  });
}
function crash(L, R, t, amp = 1) {
  let hp = 0, prev = 0;
  for (const pan of [-0.5, 0.5]) add(L, R, t, 2.8, pan, (x) => { const n = noise(); hp = 0.9 * (hp + n - prev); prev = n; return hp * Math.exp(-x * 1.7) * Math.min(1, x / 0.003) * amp * 0.3; });
}

// ---------- the score: LO-FI STUDY BEAT for the notebook look (82 BPM, swung, jazzy 7ths, vinyl crackle) ----------
const BPM = 82;
const BEAT = 60 / BPM;
const BAR = BEAT * 4;
const SWING = BEAT * 0.12;
const CH = {
  Fmaj7: { root: note("F2"), keys: ["A3", "C4", "E4", "F4"].map(note) },
  Em7: { root: note("E2"), keys: ["G3", "B3", "D4", "E4"].map(note) },
  Dm7: { root: note("D2"), keys: ["F3", "A3", "C4", "E4"].map(note) },
  Cmaj7: { root: note("C2"), keys: ["E3", "G3", "B3", "D4"].map(note) },
};
const PROG = ["Fmaj7", "Em7", "Dm7", "Cmaj7"];
const chordAt = (t) => CH[PROG[Math.floor(t / BAR) % 4]];
// soft electric piano: sine + a little 2nd/3rd harmonic, slow tremolo, gentle decay
function keys(L, R, t, freqs, dur, amp = 1) {
  freqs.forEach((f, i) => {
    const pan = (i / (freqs.length - 1) - 0.5) * 0.6;
    add(L, R, t + i * 0.018, dur + 0.6, pan, (x) => {
      const env = Math.min(1, x / 0.012) * Math.exp(-x * 0.9) * (x > dur ? Math.max(0, 1 - (x - dur) / 0.6) : 1);
      const trem = 1 + 0.12 * Math.sin(TAU * 4.2 * x);
      return (Math.sin(TAU * f * x) + 0.28 * Math.sin(TAU * 2 * f * x) * Math.exp(-x * 3) + 0.06 * Math.sin(TAU * 3 * f * x) * Math.exp(-x * 6)) * env * trem * amp * 0.24;
    });
  });
}
function brush(L, R, t, amp = 1) {
  let lp = 0, lp2 = 0;
  add(L, R, t, 0.32, -0.1, (x) => {
    const n = noise();
    lp += 0.35 * (n - lp); lp2 += 0.05 * (lp - lp2);
    return (lp - lp2) * (Math.exp(-x * 13) + 0.25 * Math.exp(-x * 4)) * amp * 0.4;
  });
}
// dark, soft lo-fi hat: high-passed noise, then smoothed
function softHat(L, R, t, amp = 1) {
  let lp = 0, sm = 0;
  add(L, R, t, 0.08, 0.3, (x) => {
    const n = noise();
    lp += 0.5 * (n - lp);
    sm += 0.35 * (n - lp - sm);
    return sm * Math.exp(-x * 60) * amp * 0.3;
  });
}
function subBass(L, R, t, f, dur, amp = 1) {
  add(L, R, t, dur, 0, (x) => (Math.sin(TAU * f * x) + 0.2 * Math.sin(TAU * 2 * f * x)) * Math.min(1, x / 0.02) * Math.min(1, (dur - x) / 0.08) * Math.exp(-x * 0.8) * amp * 0.42);
}

const ML = new Float32Array(N), MR = new Float32Array(N);
const sections = [
  // [from, to, style]
  [0, S("s2"), "title"], // keys + music box from frame 0
  [S("s2"), S("s4"), "intro"], // keys, crackle, light hats
  [S("s4"), S("s10"), "groove"], // full lo-fi beat under the explanation
  [S("s10"), ev.quiz, "build"], // groove + music-box melody
  [ev.quiz, DUR - 0.6, "groove"], // poll, teaser, end card
];
const styleAt = (t) => (sections.find(([a, b]) => t >= a && t < b) || [0, 0, "none"])[2];

// keys: one voicing per bar, plus a soft re-strike on beat 3 when grooving
for (let b = 0; b * BAR < DUR; b++) {
  const t = b * BAR;
  const st = styleAt(t + 0.01);
  const c = chordAt(t);
  keys(ML, MR, t, c.keys, BAR * 0.95, st === "title" ? 1.0 : 0.9);
  if (st === "groove" || st === "build") keys(ML, MR, t + BEAT * 2.5 + SWING, c.keys.slice(1), BEAT * 1.2, 0.45);
}
// drums + bass on a swung 8th grid
for (let k = 0; k * (BEAT / 2) < DUR; k++) {
  const off = k % 2 === 1;
  const t = k * (BEAT / 2) + (off ? SWING : 0);
  const st = styleAt(t);
  const pos = k % 8; // 8ths in a bar
  const c = chordAt(t);
  if (st === "intro") {
    if (off) softHat(ML, MR, t, 0.35);
  } else if (st === "groove" || st === "build") {
    if (pos === 0 || pos === 5) kick(ML, MR, t, 0.55);
    if (pos === 2 || pos === 6) brush(ML, MR, t, 0.8);
    softHat(ML, MR, t, off ? 0.45 : 0.22);
    if (pos === 0) subBass(ML, MR, t, c.root, BEAT * 1.6, 0.9);
    if (pos === 4) subBass(ML, MR, t, c.root * 1.5, BEAT * 1.2, 0.7);
    if (st === "build" && (pos === 1 || pos === 3 || pos === 7)) bell(ML, MR, t, c.keys[(k >> 1) % 4] * 2, 0.22, (k % 3) - 1, 1.2);
  }
}
// title card: a soft music-box arpeggio from frame 0 (no impact: the notebook look is calm)
[0, 0.16, 0.32, 0.48].forEach((d, i) => bell(ML, MR, ev.allData + d, [note("C5"), note("E5"), note("A5"), note("C6")][i], 0.55, (i - 1.5) * 0.3, 1.8));
// accents: little music-box phrases on the key moments
[0, 0.12, 0.24].forEach((d, i) => bell(ML, MR, ev.acc1 + d, [note("E5"), note("G5"), note("C6")][i], 0.5, (i - 1) * 0.4, 1.4));
[0, 0.1, 0.2, 0.3].forEach((d, i) => bell(ML, MR, ev.acc2 + d, [note("C5"), note("E5"), note("G5"), note("C6")][i], 0.5, (i - 1.5) * 0.3, 1.6));
[0, 0.12].forEach((d, i) => bell(ML, MR, ev.acc3 + d, [note("A5"), note("C6")][i], 0.45, (i - 0.5) * 0.4, 1.4));
// poll prompt: a bright music-box stinger
[0, 0.09, 0.18, 0.27].forEach((d, i) => bell(ML, MR, ev.quiz + d, [note("E5"), note("G5"), note("B5"), note("E6")][i], 0.6, (i - 1.5) * 0.3, 1.6));
// ending: resolve on Fmaj7 with a last arpeggio
const endT = DUR - 2.2;
keys(ML, MR, endT, CH.Fmaj7.keys, 1.8, 1.0);
[0, 0.1, 0.2, 0.3].forEach((d, i) => bell(ML, MR, endT + d, [note("F5"), note("A5"), note("C6"), note("E6")][i], 0.5, (i - 1.5) * 0.3, 2.0));
// vinyl crackle + tape hiss over everything
{
  let lp = 0, pop = 0;
  for (let i = 0; i < N; i++) {
    lp += 0.02 * (noise() - lp);
    if (rand() < 0.00035) pop = (rand() * 2 - 1) * 0.5;
    pop *= 0.82;
    ML[i] += lp * 0.05 + pop * 0.12;
    MR[i] += lp * 0.05 + pop * 0.1;
  }
}

// gentle sidechain pump from the kicks + room reverb + soft clip
function reverb(X, wet, delaysMs, shift) {
  const Y = new Float32Array(X.length);
  for (const d of delaysMs.map((m) => Math.round(((m + shift) * SR) / 1000))) {
    const buf = new Float32Array(d); let idx = 0, lp = 0;
    for (let i = 0; i < X.length; i++) { const o = buf[idx]; lp = o * 0.55 + lp * 0.45; buf[idx] = X[i] + lp * 0.78; idx = (idx + 1) % d; Y[i] += o / delaysMs.length; }
  }
  for (const [ms, g] of [[5.0, 0.7], [1.7, 0.7]]) {
    const d = Math.round((ms * SR) / 1000); const buf = new Float32Array(d); let idx = 0;
    for (let i = 0; i < Y.length; i++) { const b = buf[idx]; const v = -g * Y[i] + b; buf[idx] = Y[i] + g * v; idx = (idx + 1) % d; Y[i] = v; }
  }
  for (let i = 0; i < X.length; i++) X[i] = X[i] * (1 - wet) + Y[i] * wet * 2;
}
reverb(ML, 0.18, [29.7, 37.1, 41.1, 43.7], 0);
reverb(MR, 0.18, [29.7, 37.1, 41.1, 43.7], 1.3);
for (let i = 0; i < N; i++) { ML[i] = Math.tanh(ML[i] * 1.1); MR[i] = Math.tanh(MR[i] * 1.1); }
for (let i = Math.max(0, N - smp(0.6)); i < N; i++) { const g = (N - i) / smp(0.6); ML[i] *= g; MR[i] *= g; }
normalize([ML, MR], 0.89);
writeFileSync(join(OUT, "score.wav"), wavStereo(ML, MR));

// ---------- SFX kit ----------
function sfx(name, dur, fn, peak = 0.9, stereo = 0) {
  const L = new Float32Array(smp(dur)), R = new Float32Array(smp(dur));
  const st = {};
  for (let i = 0; i < L.length; i++) {
    const v = fn(i / SR, st);
    L[i] = v * (1 - stereo * 0.3); R[i] = v * (1 + stereo * 0.3);
  }
  normalize([L, R], peak);
  writeFileSync(join(OUT, name), wavStereo(L, R));
}
sfx("whoosh.wav", 0.55, (t, s) => { const k = t / 0.55; s.lp = (s.lp || 0) + (0.02 + 0.3 * Math.sin(Math.PI * k)) * (noise() - (s.lp || 0)); s.bp = (s.bp || 0) + 0.1 * (s.lp - (s.bp || 0)); return (s.lp - s.bp) * Math.sin(Math.PI * k) ** 1.4; }, 0.7);
sfx("whip.wav", 0.32, (t, s) => { const k = t / 0.32; s.lp = (s.lp || 0) + (0.05 + 0.6 * k) * (noise() - (s.lp || 0)); return s.lp * Math.sin(Math.PI * k) ** 0.8 * (1 - k * 0.3); }, 0.75);
sfx("pop.wav", 0.16, (t, s) => { s.p = (s.p || 0) + (TAU * (900 * Math.exp(-t * 30) + 280)) / SR; return Math.sin(s.p) * Math.exp(-t * 32); }, 0.7);
sfx("click.wav", 0.06, (t) => (Math.sin(TAU * 2400 * t) * 0.5 + noise() * 0.5) * Math.exp(-t * 140), 0.6);
sfx("tick.wav", 0.07, (t) => (Math.sin(TAU * 1900 * t) * 0.7 + noise() * 0.3) * Math.exp(-t * 110), 0.6);
sfx("beep.wav", 0.22, (t) => Math.sin(TAU * 880 * t) * Math.exp(-t * 14) * Math.min(1, t / 0.003), 0.6);
sfx("beep-hi.wav", 0.35, (t) => (Math.sin(TAU * 1320 * t) + 0.3 * Math.sin(TAU * 2640 * t)) * Math.exp(-t * 9) * Math.min(1, t / 0.003), 0.65);
[0, 2, 4, 5, 7].forEach((st, i) => {
  const f = note("C5") * 2 ** (st / 12);
  sfx(`blip${i + 1}.wav`, 0.4, (t) => (Math.sin(TAU * f * t) + 0.35 * Math.sin(TAU * f * 2 * t) * Math.exp(-t * 20)) * Math.exp(-t * 9) * Math.min(1, t / 0.002), 0.7);
});
[0, 4, 7].forEach((st, i) => {
  const f = note("F4") * 2 ** (st / 12);
  sfx(`step${i + 1}.wav`, 0.9, (t) => (Math.sin(TAU * f * t) * Math.exp(-t * 6) + Math.sin(TAU * f * 3.98 * t) * 0.3 * Math.exp(-t * 24)) * Math.min(1, t / 0.002), 0.7);
});
sfx("hop.wav", 0.25, (t, s) => { s.p = (s.p || 0) + (TAU * (300 + 600 * Math.min(1, t / 0.12))) / SR; return Math.sin(s.p) * Math.exp(-t * 14); }, 0.55);
sfx("flip.wav", 0.18, (t, s) => { s.lp = (s.lp || 0) + 0.35 * (noise() - (s.lp || 0)); return s.lp * (Math.exp(-t * 60) + (t > 0.05 ? Math.exp(-(t - 0.05) * 80) * 0.6 : 0)); }, 0.6);
sfx("shuffle.wav", 0.9, (t, s) => { s.lp = (s.lp || 0) + 0.45 * (noise() - (s.lp || 0)); const burst = Math.exp(-((t * 34) % 1) * 7); return s.lp * burst * Math.sin(Math.PI * Math.min(1, t / 0.9)); }, 0.55);
sfx("stamp.wav", 0.7, (t, s) => { s.p = (s.p || 0) + (TAU * (90 + 60 * Math.exp(-t * 30))) / SR; s.b = (s.b || 0) + (TAU * 150) / SR; return Math.sin(s.p) * Math.exp(-t * 9) + Math.sign(Math.sin(s.b)) * 0.12 * Math.exp(-t * 6) * (t > 0.04 ? 1 : 0) + (t < 0.01 ? noise() * 0.6 : 0); }, 0.8);
sfx("ding.wav", 1.8, (t) => [1, 2.76, 5.4].reduce((a, k, i) => a + Math.sin(TAU * note("E6") * k * t) * Math.exp(-t * (2 + i * 3)) / (i + 1), 0) * Math.min(1, t / 0.002), 0.6);
sfx("sparkle.wav", 1.0, (t, s) => { if (!s.n) { s.n = Array.from({ length: 9 }, (_, i) => ({ at: i * 0.07 + rand() * 0.03, f: 2200 + rand() * 2600 })); } return s.n.reduce((a, x) => a + (t >= x.at ? Math.sin(TAU * x.f * (t - x.at)) * Math.exp(-(t - x.at) * 16) : 0), 0) * 0.4; }, 0.45, 0.5);
sfx("glide.wav", 1.6, (t, s) => { const k = t / 1.6; s.p = (s.p || 0) + (TAU * (330 * 2 ** (k * k * (3 - 2 * k) * 1.0))) / SR; return (Math.sin(s.p) + 0.2 * Math.sin(2 * s.p)) * Math.min(1, t / 0.1) * Math.min(1, (1.6 - t) / 0.3) * 0.6; }, 0.55);
sfx("chime.wav", 1.6, (t) => [1, 2.0, 3.01].reduce((a, k, i) => a + Math.sin(TAU * note("A5") * k * t) * Math.exp(-t * (2.5 + i * 2)) / (i + 1.5), 0), 0.5);
sfx("riser.wav", 1.3, (t, s) => { const k = t / 1.3; s.lp = (s.lp || 0) + (0.01 + 0.5 * k * k) * (noise() - (s.lp || 0)); return s.lp * k * k; }, 0.6);
sfx("impact.wav", 1.8, (t, s) => { s.p = (s.p || 0) + (TAU * (40 + 80 * Math.exp(-t * 10))) / SR; s.lp = (s.lp || 0) + 0.06 * (noise() - (s.lp || 0)); return Math.sin(s.p) * Math.exp(-t * 3) + s.lp * Math.exp(-t * 6); }, 0.85);
sfx("tada.wav", 1.8, (t) => ["F4", "A4", "C5", "F5"].reduce((a, n, i) => a + (t > i * 0.05 ? Math.sin(TAU * note(n) * (t - i * 0.05)) * Math.exp(-(t - i * 0.05) * 2.2) : 0), 0) * Math.min(1, t / 0.004), 0.7, 0.4);
sfx("button.wav", 0.25, (t, s) => { s.p = (s.p || 0) + (TAU * (520 + 700 * Math.min(1, t / 0.05))) / SR; return Math.sin(s.p) * Math.exp(-t * 18) + (t < 0.004 ? noise() * 0.5 : 0); }, 0.6);
sfx("door.wav", 0.6, (t, s) => { s.p = (s.p || 0) + (TAU * (210 + 90 * Math.sin(t * 9))) / SR; s.lp = (s.lp || 0) + 0.05 * (noise() - (s.lp || 0)); return (Math.sign(Math.sin(s.p)) * 0.08 + s.lp * 1.2) * Math.sin(Math.PI * Math.min(1, t / 0.6)); }, 0.4);
sfx("glitch.wav", 0.5, (t, s) => { const seg = Math.floor(t * 40); if (s.seg !== seg) { s.seg = seg; s.f = 200 + rand() * 1600; s.on = rand() > 0.35; } s.p = (s.p || 0) + (TAU * s.f) / SR; return s.on ? Math.sign(Math.sin(s.p)) * 0.35 * (1 - t / 0.5) : 0; }, 0.5);
sfx("confetti.wav", 1.2, (t, s) => { if (!s.n) s.n = Array.from({ length: 26 }, () => ({ at: rand() * 0.9, f: 1500 + rand() * 3000 })); return s.n.reduce((a, x) => a + (t >= x.at && t < x.at + 0.03 ? noise() * Math.exp(-(t - x.at) * 120) : 0), 0) * 0.6; }, 0.4, 0.6);

sfx("clink.wav", 0.6, (t) => (Math.sin(TAU * 2637 * t) * 0.6 + Math.sin(TAU * 3951 * t) * 0.35 + Math.sin(TAU * 5274 * t) * 0.18) * Math.exp(-t * 9) * Math.min(1, t / 0.001), 0.5, 0.3);

// ---------- notebook SFX: pencil, paper, marker ----------
const strokes = (len, n) => Array.from({ length: n }, (_, i) => ({ a: (i / n) * len + rand() * 0.02, d: 0.05 + rand() * 0.07, g: 0.6 + rand() * 0.4 }));
for (const [name, len, n] of [["scribble.wav", 0.7, 7], ["scribble-short.wav", 0.32, 3]]) {
  const st0 = strokes(len, n);
  sfx(name, len + 0.1, (t, s) => {
    const n0 = noise();
    s.l1 = (s.l1 || 0) + 0.55 * (n0 - (s.l1 || 0)); s.l2 = (s.l2 || 0) + 0.12 * (s.l1 - (s.l2 || 0));
    const band = s.l1 - s.l2; // ~2–6 kHz scratch
    const env = st0.reduce((acc, k) => acc + (t >= k.a && t < k.a + k.d ? Math.sin((Math.PI * (t - k.a)) / k.d) * k.g : 0), 0);
    return band * env * (0.7 + 0.3 * noise());
  }, 0.55);
}
sfx("page.wav", 0.8, (t, s) => {
  const k = t / 0.8;
  s.lp = (s.lp || 0) + (0.04 + 0.25 * Math.sin(Math.PI * k)) * (noise() - (s.lp || 0));
  s.lp2 = (s.lp2 || 0) + 0.02 * (s.lp - (s.lp2 || 0));
  const crinkle = rand() < 0.004 ? noise() * 2 : 0;
  const flap = t > 0.55 ? Math.sin(TAU * 90 * (t - 0.55)) * Math.exp(-(t - 0.55) * 30) * 0.8 : 0;
  return ((s.lp - s.lp2) * Math.sin(Math.PI * k) ** 1.2 * 1.6 + crinkle * Math.sin(Math.PI * k) + flap);
}, 0.6, 0.4);
sfx("tap.wav", 0.09, (t) => (Math.sin(TAU * 1700 * t) * 0.6 + Math.sin(TAU * 820 * t) * 0.5 + noise() * 0.4 * Math.exp(-t * 300)) * Math.exp(-t * 70), 0.5);
sfx("marker.wav", 0.36, (t, s) => {
  const k = t / 0.36;
  s.l1 = (s.l1 || 0) + 0.3 * (noise() - (s.l1 || 0)); s.l2 = (s.l2 || 0) + 0.06 * (s.l1 - (s.l2 || 0));
  s.p = (s.p || 0) + (TAU * (2100 + 500 * k)) / SR;
  return ((s.l1 - s.l2) * 1.4 + Math.sin(s.p) * 0.05) * Math.sin(Math.PI * k) ** 0.7;
}, 0.5);
sfx("sticky.wav", 0.18, (t, s) => {
  s.lp = (s.lp || 0) + 0.25 * (noise() - (s.lp || 0));
  return s.lp * Math.exp(-t * 40) * 1.4 + Math.sin(TAU * 140 * t) * Math.exp(-t * 35) * 0.5;
}, 0.55);

console.log(`audio written (${DUR.toFixed(1)}s). events:`, Object.fromEntries(Object.entries(ev).map(([k, v]) => [k, v.toFixed(2)])));
