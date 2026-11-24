// Exponential kit: density, seeded waiting times, and a curve chart (minutes on x) with shaded bands and a minutes axis.
// The curve is drawn relative to its own start t0, so a shifted copy shows "no memory".
import React from "react";
import { rng } from "./Motion";
import { alpha, theme } from "../theme";

const C = theme.colors;

export const expPdf = (t: number, mean: number) => (t < 0 ? 0 : Math.exp(-t / mean) / mean);
export const expCdf = (t: number, mean: number) => (t < 0 ? 0 : 1 - Math.exp(-t / mean));
// inverse-CDF draws: -mean · ln(1 − u)
export const expSamples = (mean: number, n: number, seed: number) => {
  const r = rng(seed);
  return Array.from({ length: n }, () => -mean * Math.log(1 - r()));
};

// h = height of the curve at its start (t = t0)
export type ExpGeo = { x0: number; x1: number; tmax: number; base: number; h: number };
export const tx = (g: ExpGeo, t: number) => g.x0 + (t / g.tmax) * (g.x1 - g.x0);
export const ey = (g: ExpGeo, t: number, mean: number, t0 = 0) => g.base - Math.exp(-(t - t0) / mean) * g.h;

export type ExpBand = { a: number; b: number; color: string; p?: number; opacity?: number };

const path = (g: ExpGeo, mean: number, t0: number, a: number, b: number) => {
  const n = Math.max(2, Math.round((b - a) * 3));
  return Array.from({ length: n + 1 }, (_, i) => {
    const t = a + ((b - a) * i) / n;
    return `${i ? "L" : "M"}${tx(g, t).toFixed(1)} ${ey(g, t, mean, t0).toFixed(1)}`;
  }).join(" ");
};

// p: how much of the curve is drawn (left → right); bands fill left → right with their own p
export const ExpCurve: React.FC<{ g: ExpGeo; mean?: number; t0?: number; p?: number; color?: string; width?: number; fill?: number; bands?: ExpBand[]; dashed?: boolean; opacity?: number }> = ({
  g,
  mean = 15,
  t0 = 0,
  p = 1,
  color = C.cyan,
  width = 6,
  fill = 0.12,
  bands = [],
  dashed,
  opacity = 1,
}) => {
  if (p <= 0.001) return null;
  const tEnd = t0 + (g.tmax - t0) * Math.min(1, p);
  const d = path(g, mean, t0, t0, tEnd);
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", left: 0, top: 0, opacity, overflow: "visible" }}>
      <defs>
        <filter id={`eglow${t0}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>
      {fill > 0 ? <path d={`${d} L${tx(g, tEnd).toFixed(1)} ${g.base} L${tx(g, t0).toFixed(1)} ${g.base} Z`} fill={alpha(color, fill)} /> : null}
      {bands.map((b, i) => {
        const bp = b.p ?? 1;
        if (bp <= 0.001) return null;
        const a = Math.max(t0, b.a);
        const e = Math.min(tEnd, a + (b.b - a) * Math.min(1, bp));
        if (e <= a) return null;
        return <path key={i} d={`${path(g, mean, t0, a, e)} L${tx(g, e).toFixed(1)} ${g.base} L${tx(g, a).toFixed(1)} ${g.base} Z`} fill={alpha(b.color, b.opacity ?? 0.55)} stroke={b.color} strokeWidth={2} />;
      })}
      <path d={d} fill="none" stroke={color} strokeWidth={width + 8} strokeLinecap="round" opacity={0.35} filter={`url(#eglow${t0})`} strokeDasharray={dashed ? "14 12" : undefined} />
      <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={dashed ? "14 12" : undefined} />
    </svg>
  );
};

// a minutes axis under the chart: baseline, tick labels and a caption
export const MinAxis: React.FC<{ g: ExpGeo; ticks: number[]; p?: number; label?: string; hi?: Record<number, string> }> = ({ g, ticks, p = 1, label = "MINUTES UNTIL THE NEXT CUSTOMER", hi = {} }) => (
  <>
    <div style={{ position: "absolute", left: g.x0 - 10, top: g.base + 1, width: (g.x1 - g.x0 + 20) * p, height: 4, borderRadius: 2, background: alpha(C.text, 0.4) }} />
    {ticks.map((t) => (
      <div key={t} style={{ position: "absolute", left: tx(g, t), top: g.base + 30, transform: "translate(-50%, -50%)", opacity: p, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 24, color: hi[t] ?? C.dim }}>{t}</div>
    ))}
    {label ? <div style={{ position: "absolute", left: 0, right: 0, top: g.base + 66, textAlign: "center", opacity: p, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.18em", color: C.dim }}>{label}</div> : null}
  </>
);

// a small stopwatch with a sweeping hand (frac = 0..1 of one turn)
export const Stopwatch: React.FC<{ size: number; color: string; frac?: number }> = ({ size, color, frac = 0 }) => {
  const a = frac * Math.PI * 2;
  return (
    <svg width={size} height={size * 1.12} viewBox="0 0 100 112" style={{ display: "block", overflow: "visible" }}>
      <rect x={42} y={0} width={16} height={10} rx={3} fill={color} />
      <line x1={50} y1={10} x2={50} y2={18} stroke={color} strokeWidth={6} />
      <circle cx={50} cy={64} r={42} fill={alpha(color, 0.16)} stroke={color} strokeWidth={7} />
      {[0, 1, 2, 3].map((k) => (
        <line key={k} x1={50 + 34 * Math.sin((k * Math.PI) / 2)} y1={64 - 34 * Math.cos((k * Math.PI) / 2)} x2={50 + 28 * Math.sin((k * Math.PI) / 2)} y2={64 - 28 * Math.cos((k * Math.PI) / 2)} stroke={color} strokeWidth={4} strokeLinecap="round" />
      ))}
      <line x1={50} y1={64} x2={50 + 30 * Math.sin(a)} y2={64 - 30 * Math.cos(a)} stroke={C.text} strokeWidth={6} strokeLinecap="round" />
      <circle cx={50} cy={64} r={6} fill={C.text} />
    </svg>
  );
};

// a gap icon: two dots joined by a bracket (for "measures the gaps")
export const GapIcon: React.FC<{ color: string; w?: number }> = ({ color, w = 120 }) => (
  <svg width={w} height={50} viewBox={`0 0 ${w} 50`} style={{ display: "block", overflow: "visible" }}>
    <line x1={0} y1={40} x2={w} y2={40} stroke={alpha("#F3F7FF", 0.45)} strokeWidth={3} />
    <circle cx={14} cy={40} r={8} fill={C.cyan} />
    <circle cx={w - 14} cy={40} r={8} fill={C.cyan} />
    <path d={`M14 24 L14 14 L${w - 14} 14 L${w - 14} 24`} fill="none" stroke={color} strokeWidth={5} strokeLinejoin="round" />
  </svg>
);

// dots on a line (for "counts the events")
export const DotsIcon: React.FC<{ color: string; w?: number }> = ({ color, w = 120 }) => (
  <svg width={w} height={50} viewBox={`0 0 ${w} 50`} style={{ display: "block", overflow: "visible" }}>
    <line x1={0} y1={40} x2={w} y2={40} stroke={alpha("#F3F7FF", 0.45)} strokeWidth={3} />
    {[0.12, 0.3, 0.42, 0.75, 0.9].map((u, i) => <circle key={i} cx={u * w} cy={40} r={8} fill={color} />)}
  </svg>
);
