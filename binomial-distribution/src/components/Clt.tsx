// Exact distributions for the Central Limit Theorem demos, plus a drawn radical sign (√ isn't in the bundled fonts).
import React from "react";
import { alpha } from "../theme";


// P(sum = s) for n fair dice, s = n … 6n (repeated convolution)
export const diceSumDist = (n: number) => {
  let d = [1];
  for (let k = 0; k < n; k++) {
    const nx = new Array(d.length + 5).fill(0);
    d.forEach((p, i) => {
      for (let f = 0; f < 6; f++) nx[i + f] += p / 6;
    });
    d = nx;
  }
  return d; // index i ↔ sum n + i ↔ average (n + i) / n
};

const lnFact = (k: number) => {
  let s = 0;
  for (let i = 2; i <= k; i++) s += Math.log(i);
  return s;
};
// density of the mean of n exponential waiting times with mean mu (Gamma(shape n, scale mu / n))
export const meanOfExpPdf = (n: number, mu: number, x: number) => {
  if (x <= 0) return 0;
  const th = mu / n;
  return Math.exp((n - 1) * Math.log(x) - x / th - lnFact(n - 1) - n * Math.log(th));
};

export const DICE_SD = Math.sqrt(35 / 12); // 1.708, the SD of one fair dice

// a filled area chart from points (x px, value 0..1) inside a box
export const AreaChart: React.FC<{ x0: number; x1: number; base: number; h: number; xs: number[]; vals: number[]; color: string; p?: number; fill?: number; width?: number }> = ({ x0, x1, base, h, xs, vals, color, p = 1, fill = 0.3, width = 5 }) => {
  const max = Math.max(...vals);
  const pts = xs.map((x, i) => [x0 + x * (x1 - x0), base - (vals[i] / max) * h * p] as const);
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }}>
      <path d={`${d} L${x1} ${base} L${x0} ${base} Z`} fill={alpha(color, fill)} />
      <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 8px ${alpha(color, 0.7)})` }} />
    </svg>
  );
};

// bars from values (heights scaled to the max) across x0..x1
export const BarChart: React.FC<{ x0: number; x1: number; base: number; h: number; vals: number[]; color: string; p?: number; gap?: number }> = ({ x0, x1, base, h, vals, color, p = 1, gap = 0.16 }) => {
  const max = Math.max(...vals);
  const bw = (x1 - x0) / vals.length;
  return (
    <>
      {vals.map((v, i) => {
        const hh = (v / max) * h * p;
        return <div key={i} style={{ position: "absolute", left: x0 + i * bw + bw * gap * 0.5, top: base - hh, width: bw * (1 - gap), height: hh, borderRadius: Math.min(8, bw * 0.25), background: alpha(color, 0.5), border: `2px solid ${color}`, boxSizing: "border-box" }} />;
      })}
    </>
  );
};

export const Radical: React.FC<{ children: React.ReactNode; color: string; size: number }> = ({ children, color, size }) => (
  <span style={{ display: "inline-flex", alignItems: "stretch" }}>
    <svg width={size * 0.6} height={size * 1.15} viewBox="0 0 30 58" style={{ display: "block", overflow: "visible" }}>
      <path d="M2 34 L9 30 L16 54 L28 2" stroke={color} strokeWidth={4} fill="none" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
    <span style={{ borderTop: `${Math.max(3, size * 0.07)}px solid ${color}`, paddingLeft: 4, paddingRight: 2, lineHeight: 1.1 }}>{children}</span>
  </span>
);

