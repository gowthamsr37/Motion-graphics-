// General curve kit (from the Pareto Reel on): plot any density f(v) over a value axis, with a draw sweep, shaded
// bands, a dashed variant, an axis with labelled ticks, and a vertical marker line. Reused by the log-normal, t and
// chi-square Reels.
import React from "react";
import { interpolate } from "remotion";
import { alpha, glowText, theme } from "../theme";

const C = theme.colors;

// x0/x1: pixel range; vmin/vmax: value range; base: baseline y; h: pixel height of fmax
export type Geo = { x0: number; x1: number; vmin: number; vmax: number; base: number; h: number };
export const gx = (g: Geo, v: number) => g.x0 + ((v - g.vmin) / (g.vmax - g.vmin)) * (g.x1 - g.x0);
export const gy = (g: Geo, f: number, fmax: number) => g.base - Math.min(1.08, f / fmax) * g.h;

export type Band = { a: number; b: number; color: string; opacity?: number; p?: number };

const pathOf = (g: Geo, f: (v: number) => number, fmax: number, a: number, b: number, n: number) =>
  Array.from({ length: n + 1 }, (_, i) => {
    const v = a + ((b - a) * i) / n;
    return `${i ? "L" : "M"}${gx(g, v).toFixed(1)} ${gy(g, f(v), fmax).toFixed(1)}`;
  }).join(" ");

let uid = 0;
export const FnCurve: React.FC<{
  g: Geo;
  f: (v: number) => number;
  fmax: number;
  p?: number; // draw progress, left → right
  from?: number; // value where the curve starts (default vmin)
  color?: string;
  color2?: string;
  fill?: number;
  width?: number;
  dashed?: boolean;
  bands?: Band[];
  opacity?: number;
  samples?: number;
}> = ({ g, f, fmax, p = 1, from, color = C.cyan, color2, fill = 0.14, width = 6, dashed, bands = [], opacity = 1, samples = 220 }) => {
  const id = React.useMemo(() => `fc${uid++}`, []);
  if (p <= 0.001) return null;
  const a = from ?? g.vmin;
  const end = a + (g.vmax - a) * Math.min(1, p);
  const n = Math.max(8, Math.round(samples * Math.min(1, p)));
  const d = pathOf(g, f, fmax, a, end, n);
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", left: 0, top: 0, opacity, overflow: "visible", pointerEvents: "none" }}>
      <defs>
        <linearGradient id={`${id}g`} x1={g.x0} x2={g.x1} y1="0" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={color} />
          <stop offset="1" stopColor={color2 ?? color} />
        </linearGradient>
        <filter id={`${id}b`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>
      {fill > 0 ? <path d={`${d} L${gx(g, end).toFixed(1)} ${g.base} L${gx(g, a).toFixed(1)} ${g.base} Z`} fill={`url(#${id}g)`} opacity={fill} /> : null}
      {bands.map((b, i) => {
        const bp = b.p ?? 1;
        if (bp <= 0.001) return null;
        const s = Math.max(a, b.a);
        const e = Math.min(end, s + (b.b - s) * Math.min(1, bp));
        if (e <= s) return null;
        return <path key={i} d={`${pathOf(g, f, fmax, s, e, 80)} L${gx(g, e).toFixed(1)} ${g.base} L${gx(g, s).toFixed(1)} ${g.base} Z`} fill={alpha(b.color, b.opacity ?? 0.55)} stroke={b.color} strokeWidth={2} />;
      })}
      <path d={d} fill="none" stroke={`url(#${id}g)`} strokeWidth={width + 8} strokeLinecap="round" opacity={0.35} filter={`url(#${id}b)`} strokeDasharray={dashed ? "14 12" : undefined} />
      <path d={d} fill="none" stroke={`url(#${id}g)`} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={dashed ? "14 12" : undefined} />
    </svg>
  );
};

export type Tick = { v: number; label: string; color?: string; big?: boolean };
export const ValueAxis: React.FC<{ g: Geo; ticks: Tick[]; p?: number; label?: string; labelColor?: string }> = ({ g, ticks, p = 1, label, labelColor = C.dim }) => (
  <>
    <div style={{ position: "absolute", left: g.x0 - 10, top: g.base + 1, width: (g.x1 - g.x0 + 20) * p, height: 4, borderRadius: 2, background: alpha(C.text, 0.4) }} />
    {ticks.map((t) => (
      <div key={`${t.v}${t.label}`} style={{ position: "absolute", left: gx(g, t.v), top: g.base + 30, transform: "translate(-50%, -50%)", opacity: p, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: t.big ? 28 : 22, color: t.color ?? C.dim, whiteSpace: "nowrap" }}>{t.label}</div>
    ))}
    {label ? <div style={{ position: "absolute", left: 0, right: 0, top: g.base + 66, textAlign: "center", opacity: p, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.18em", color: labelColor }}>{label}</div> : null}
  </>
);

// a vertical marker that rises from the baseline to y = top; label sits above it (or to the side)
export const Marker: React.FC<{ x: number; base: number; top: number; p: number; color: string; label?: React.ReactNode; side?: "up" | "left" | "right"; size?: number }> = ({ x, base, top, p, color, label, side = "up", size = 28 }) => {
  if (p <= 0.001) return null;
  const k = Math.min(1, p);
  const y = base - (base - top) * k;
  return (
    <>
      <div style={{ position: "absolute", left: x - 3, top: y, width: 6, height: base - y, background: color, borderRadius: 3, boxShadow: `0 0 14px ${color}` }} />
      {label ? (
        <div
          style={{
            position: "absolute",
            left: side === "up" ? x : side === "right" ? x + 16 : x - 16,
            top: side === "up" ? top - 30 : top + 6,
            transform: side === "up" ? "translate(-50%, -50%)" : side === "right" ? "translateY(-50%)" : "translate(-100%, -50%)",
            opacity: interpolate(k, [0.4, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            fontFamily: theme.fonts.display,
            fontWeight: 800,
            fontSize: size,
            color,
            textShadow: glowText(color, 0.4),
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </div>
      ) : null}
    </>
  );
};

// a small rounded badge (percentages on charts)
export const Badge: React.FC<{ x: number; y: number; p: number; color: string; children: React.ReactNode; size?: number }> = ({ x, y, p, color, children, size = 30 }) =>
  p > 0.01 ? (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, p), [0, 1], [0.5, 1])})`, opacity: Math.min(1, p * 2), padding: "6px 16px", borderRadius: 14, background: "#0A1440", border: `3px solid ${color}`, boxShadow: `0 0 18px ${alpha(color, 0.4)}`, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: size, color: C.text, whiteSpace: "nowrap" }}>{children}</div>
  ) : null;

// a horizontal bracket over [x0, x1] at y, opening downward, with a label above
export const Bracket: React.FC<{ x0: number; x1: number; y: number; p: number; color: string; label?: React.ReactNode; size?: number; down?: boolean }> = ({ x0, x1, y, p, color, label, size = 30, down }) => {
  if (p <= 0.001) return null;
  const k = Math.min(1, p);
  return (
    <>
      <div style={{ position: "absolute", left: x0, top: down ? y - 18 : y, width: (x1 - x0) * k, height: 18, boxSizing: "border-box", borderTop: down ? "none" : `5px solid ${color}`, borderBottom: down ? `5px solid ${color}` : "none", borderLeft: `5px solid ${color}`, borderRight: k > 0.9 ? `5px solid ${color}` : "none", borderRadius: down ? "0 0 6px 6px" : "6px 6px 0 0" }} />
      {label ? <div style={{ position: "absolute", left: (x0 + x1) / 2, top: down ? y + 24 : y - 26, transform: `translate(-50%, -50%) scale(${interpolate(k, [0, 1], [0.6, 1])})`, opacity: Math.min(1, k * 2), fontFamily: theme.fonts.display, fontWeight: 800, fontSize: size, color: C.text, whiteSpace: "nowrap" }}>{label}</div> : null}
    </>
  );
};
