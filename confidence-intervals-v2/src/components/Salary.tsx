// The running example: monthly salaries in a city (₹ thousand), right-skewed (log-normal, median ₹30K, σ_log 0.75,
// mean ≈ ₹39.7K). 140 random samples of 30 people, seeded, and their averages.
import React from "react";
import { Rupee } from "./Icons";
import { meanOf, normals } from "./Sampling";
import { alpha, theme } from "../theme";

const C = theme.colors;
export const MEDIAN = 30;
export const SIG = 0.75;
export const TRUE_MEAN = MEDIAN * Math.exp((SIG * SIG) / 2); // 39.7
export const POP_SD = TRUE_MEAN * Math.sqrt(Math.exp(SIG * SIG) - 1); // 34.5
const SEED = 8000;
export const salaries = (i: number, n = 30) => normals(SEED + i, n, 0, 1).map((z) => MEDIAN * Math.exp(SIG * z));
export const NSAMP = 140;
export const SAMPLES = Array.from({ length: NSAMP }, (_, i) => salaries(i));
export const AVGS = SAMPLES.map(meanOf);

// standard normal CDF (Abramowitz–Stegun 7.1.26)
export const Phi = (x: number) => {
  const s = x < 0 ? -1 : 1;
  const a = Math.abs(x) / Math.SQRT2;
  const t = 1 / (1 + 0.3275911 * a);
  const y = 1 - ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-a * a);
  return 0.5 * (1 + s * y);
};
// share of the population in each ₹10K bin, 0–160
export const POP_BINS = Array.from({ length: 16 }, (_, b) => {
  const lo = b * 10;
  const hi = lo + 10;
  return Phi(Math.log(hi / MEDIAN) / SIG) - (lo === 0 ? 0 : Phi(Math.log(lo / MEDIAN) / SIG));
});

// the population panel: x 140..940 maps ₹0K..₹160K
export const PX0 = 140;
export const PX1 = 940;
export const PMAX = 160;
export const px = (k: number) => PX0 + (Math.min(PMAX, Math.max(0, k)) / PMAX) * (PX1 - PX0);
// the averages panel (zoomed): ₹20K..₹68K
export const AX0 = 140;
export const AX1 = 940;
export const AMIN = 20;
export const AMAX = 68;
export const ax = (k: number) => AX0 + ((k - AMIN) / (AMAX - AMIN)) * (AX1 - AX0);

export const PopBars: React.FC<{ base: number; h: number; p?: number[]; color: string; dim?: number }> = ({ base, h, p, color, dim = 1 }) => {
  const max = Math.max(...POP_BINS);
  const bw = (PX1 - PX0) / POP_BINS.length;
  return (
    <>
      {POP_BINS.map((v, i) => {
        const q = p ? p[i] : 1;
        const hh = (v / max) * h * q;
        return <div key={i} style={{ position: "absolute", left: PX0 + i * bw + 3, top: base - hh, width: bw - 6, height: hh, borderRadius: "8px 8px 2px 2px", background: alpha(color, 0.5 * dim), border: `2px solid ${alpha(color, dim)}`, boxSizing: "border-box" }} />;
      })}
    </>
  );
};

// ₹40K style label (₹ is drawn: it isn't in the bundled fonts)
export const K: React.FC<{ v: number; size: number; color: string }> = ({ v, size, color }) => (
  <span style={{ display: "inline-flex", alignItems: "center", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: size, color, whiteSpace: "nowrap" }}>
    <Rupee size={size * 0.9} color={color} />
    {Math.round(v)}K
  </span>
);

export const AxisLabels: React.FC<{ base: number; vals: number[]; at: (k: number) => number; p?: number }> = ({ base, vals, at, p = 1 }) => (
  <>
    {vals.map((v) => (
      <div key={v} style={{ position: "absolute", left: at(v), top: base + 28, transform: "translate(-50%, -50%)", opacity: p }}>
        <K v={v} size={20} color={C.dim} />
      </div>
    ))}
  </>
);
