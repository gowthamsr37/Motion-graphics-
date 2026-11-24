// Confidence-interval kit: a minutes number line, an interval bar (centre dot + whiskers), and 20 simulated surveys
// (100 orders each from a population with true mean 32 min, SD 10; seed 3 checked: exactly 1 of 20 ranges misses).
import React from "react";
import { interpolate } from "remotion";
import { rng } from "./Motion";
import { alpha, theme } from "../theme";

const C = theme.colors;
export const TRUE_MEAN = 32;
export type Line = { x0: number; x1: number; vmin: number; vmax: number };
export const lx = (g: Line, v: number) => g.x0 + ((v - g.vmin) / (g.vmax - g.vmin)) * (g.x1 - g.x0);

export const SURVEYS = (() => {
  const r = rng(3);
  const gauss = () => {
    const u = 1 - r();
    const v = r();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };
  return Array.from({ length: 20 }, () => {
    const xs = Array.from({ length: 100 }, () => TRUE_MEAN + 10 * gauss());
    const m = xs.reduce((a, b) => a + b, 0) / 100;
    const sd = Math.sqrt(xs.reduce((a, b) => a + (b - m) ** 2, 0) / 99);
    const se = sd / 10;
    return { m, lo: m - 1.96 * se, hi: m + 1.96 * se, hit: Math.abs(m - TRUE_MEAN) <= 1.96 * se };
  });
})();

export const Axis: React.FC<{ g: Line; y: number; ticks: number[]; p?: number; label?: string; hi?: Record<number, string> }> = ({ g, y, ticks, p = 1, label = "DELIVERY TIME (MINUTES)", hi = {} }) => (
  <>
    <div style={{ position: "absolute", left: g.x0 - 10, top: y, width: (g.x1 - g.x0 + 20) * p, height: 4, borderRadius: 2, background: alpha(C.text, 0.4) }} />
    {ticks.map((t) => (
      <React.Fragment key={t}>
        <div style={{ position: "absolute", left: lx(g, t) - 1.5, top: y - 8, width: 3, height: 20, background: alpha(C.text, 0.4), opacity: p }} />
        <div style={{ position: "absolute", left: lx(g, t), top: y + 32, transform: "translate(-50%, -50%)", opacity: p, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 24, color: hi[t] ?? C.dim }}>{t}</div>
      </React.Fragment>
    ))}
    {label ? <div style={{ position: "absolute", left: 0, right: 0, top: y + 66, textAlign: "center", opacity: p, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.18em", color: C.dim }}>{label}</div> : null}
  </>
);

// an interval: whiskers from lo to hi (drawn outward from the centre with p), a centre dot
export const Interval: React.FC<{ g: Line; y: number; m: number; lo: number; hi: number; p: number; color: string; dot?: string; thick?: number }> = ({ g, y, m, lo, hi, p, color, dot, thick = 8 }) => {
  if (p <= 0.001) return null;
  const k = Math.min(1, p);
  const a = interpolate(k, [0, 1], [m, lo]);
  const b = interpolate(k, [0, 1], [m, hi]);
  return (
    <>
      <div style={{ position: "absolute", left: lx(g, a), top: y - thick / 2, width: lx(g, b) - lx(g, a), height: thick, borderRadius: thick / 2, background: color, boxShadow: `0 0 12px ${alpha(color, 0.6)}` }} />
      <div style={{ position: "absolute", left: lx(g, a) - 2, top: y - thick * 1.6, width: 4, height: thick * 3.2, borderRadius: 2, background: color }} />
      <div style={{ position: "absolute", left: lx(g, b) - 2, top: y - thick * 1.6, width: 4, height: thick * 3.2, borderRadius: 2, background: color }} />
      <div style={{ position: "absolute", left: lx(g, m) - thick * 1.1, top: y - thick * 1.1, width: thick * 2.2, height: thick * 2.2, borderRadius: thick * 1.1, background: dot ?? C.text, boxShadow: `0 0 10px ${dot ?? C.text}` }} />
    </>
  );
};
