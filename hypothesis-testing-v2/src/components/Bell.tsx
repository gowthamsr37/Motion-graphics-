// The normal curve, drawn from its formula: φ(z) = exp(−z²/2) / √(2π).
// A Bell maps data values onto x (vmin..vmax → x0..x1) and keeps the area constant: the peak height scales with 1/σ.
import React from "react";
import { alpha, theme } from "../theme";

const C = theme.colors;
export const pdf = (z: number) => Math.exp(-(z * z) / 2) / Math.sqrt(2 * Math.PI);
// share of a normal distribution within ±k standard deviations (68.27%, 95.45%, 99.73%)
export const within = (k: number) => {
  // erf via Abramowitz–Stegun 7.1.26
  const x = k / Math.SQRT2;
  const t = 1 / (1 + 0.3275911 * x);
  const y = 1 - (((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t) * Math.exp(-x * x);
  return y;
};

export type BellGeo = { x0: number; x1: number; vmin: number; vmax: number; base: number; peakH: number; sigmaRef: number };
export const vx = (g: BellGeo, v: number) => g.x0 + ((v - g.vmin) / (g.vmax - g.vmin)) * (g.x1 - g.x0);
export const curveY = (g: BellGeo, mu: number, sigma: number, v: number) => g.base - (pdf((v - mu) / sigma) / pdf(0)) * g.peakH * (g.sigmaRef / sigma);

const pts = (g: BellGeo, mu: number, sigma: number, a: number, b: number, n = 120) => {
  const out: [number, number][] = [];
  for (let i = 0; i <= n; i++) {
    const v = a + ((b - a) * i) / n;
    out.push([vx(g, v), curveY(g, mu, sigma, v)]);
  }
  return out;
};

export type Band = { a: number; b: number; color: string; opacity?: number };

export const Bell: React.FC<{ g: BellGeo; mu: number; sigma: number; p?: number; color?: string; fill?: number; bands?: Band[]; width?: number; dashed?: boolean }> = ({ g, mu, sigma, p = 1, color = C.cyan, fill = 0.14, bands = [], width = 6, dashed }) => {
  const line = pts(g, mu, sigma, g.vmin, g.vmax);
  const d = line.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const area = `${d} L${vx(g, g.vmax)} ${g.base} L${vx(g, g.vmin)} ${g.base} Z`;
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }}>
      {fill > 0 ? <path d={area} fill={alpha(color, fill * p)} /> : null}
      {bands.map((bd, i) => {
        const a = Math.max(g.vmin, bd.a);
        const b = Math.min(g.vmax, bd.b);
        if (b <= a) return null;
        const bp = pts(g, mu, sigma, a, b, 80);
        const bdPath = `M${vx(g, a)} ${g.base} ${bp.map(([x, y]) => `L${x.toFixed(1)} ${y.toFixed(1)}`).join(" ")} L${vx(g, b)} ${g.base} Z`;
        return <path key={i} d={bdPath} fill={alpha(bd.color, bd.opacity ?? 0.45)} />;
      })}
      <path d={d} stroke={color} strokeWidth={width} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={dashed ? "0.012 0.01" : 1} strokeDashoffset={dashed ? 0 : 1 - p} style={{ filter: `drop-shadow(0 0 8px ${alpha(color, 0.7)})` }} />
    </svg>
  );
};

// an axis line with tick labels
export const Axis: React.FC<{ g: BellGeo; ticks: { v: number; label: string; color?: string; big?: boolean }[]; p?: number; y?: number }> = ({ g, ticks, p = 1, y }) => {
  const yy = y ?? g.base;
  return (
    <>
      <div style={{ position: "absolute", left: g.x0 - 10, top: yy - 2, width: (g.x1 - g.x0 + 20) * p, height: 4, borderRadius: 2, background: alpha(C.text, 0.35) }} />
      {ticks.map((t) => (
        <React.Fragment key={t.v}>
          <div style={{ position: "absolute", left: vx(g, t.v) - 1.5, top: yy + 2, width: 3, height: 12, background: alpha(C.text, 0.5), opacity: p }} />
          <div style={{ position: "absolute", left: vx(g, t.v), top: yy + 34, transform: "translate(-50%, -50%)", opacity: p, fontFamily: t.big ? theme.fonts.mono : theme.fonts.body, fontWeight: 800, fontSize: t.big ? 28 : 22, letterSpacing: t.big ? "-0.02em" : "0.04em", color: t.color ?? C.dim, whiteSpace: "nowrap" }}>{t.label}</div>
        </React.Fragment>
      ))}
    </>
  );
};
