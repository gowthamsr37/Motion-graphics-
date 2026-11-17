// Cheat-sheet kit (v2): one Shape component that draws all twelve distributions of the series (bars grow, curves
// sweep), the family colours, and a CheatRow (question → name + mini shape) used by the family scenes.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { ease, useSpr } from "./Motion";
import { alpha, glowText, theme } from "../theme";

const C = theme.colors;

export type Kind = "uniform" | "bernoulli" | "binomial" | "geometric" | "poisson" | "normal" | "exp" | "lognormal" | "pareto" | "t" | "chisq" | "bimodal";

const choose = (n: number, k: number) => {
  let r = 1;
  for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i;
  return r;
};
const pois = (l: number, k: number) => {
  let p = Math.exp(-l);
  for (let i = 1; i <= k; i++) p *= l / i;
  return p;
};
const bell = (u: number, m: number, s: number) => Math.exp(-((u - m) ** 2) / (2 * s * s));

export const BARS: Partial<Record<Kind, number[]>> = {
  uniform: [1, 1, 1, 1, 1, 1].map((v) => v * 0.62),
  bernoulli: [5 / 6, 1 / 6],
  binomial: Array.from({ length: 11 }, (_, k) => choose(10, k) / 1024),
  geometric: Array.from({ length: 10 }, (_, k) => Math.pow(5 / 6, k) / 6),
  poisson: Array.from({ length: 13 }, (_, k) => pois(4, k)),
};
export const CURVES: Partial<Record<Kind, (u: number) => number>> = {
  normal: (u) => bell(u, 0.5, 0.14),
  exp: (u) => Math.exp(-u * 4.5),
  lognormal: (u) => {
    const x = Math.max(1e-3, u * 3.2);
    const z = Math.log(x / 0.9) / 0.55;
    return Math.min(1, (Math.exp(-(z * z) / 2) / x) * 0.62);
  },
  pareto: (u) => Math.pow(0.05 / (u + 0.05), 1.3),
  t: (u) => Math.pow(1 + ((u - 0.5) / 0.1) ** 2 / 2, -1.5),
  chisq: (u) => {
    const x = u * 14;
    return (x * Math.exp(-x / 2)) / 0.7358;
  },
  bimodal: (u) => Math.max(0, 0.95 * bell(u, 0.27, 0.085) + 1.0 * bell(u, 0.75, 0.09)),
};

// a shape drawn in a w × h box; p = draw progress
export const Shape: React.FC<{ kind: Kind; w: number; h: number; color: string; p?: number; color2?: string; axis?: boolean }> = ({ kind, w, h, color, p = 1, color2, axis = true }) => {
  const vals = BARS[kind];
  if (vals) {
    const max = Math.max(...vals, kind === "uniform" ? 1 : 0);
    const bw = w / vals.length;
    return (
      <svg width={w} height={h + 6} viewBox={`0 0 ${w} ${h + 6}`} style={{ display: "block", overflow: "visible" }}>
        {vals.map((v, i) => {
          const g = ease(p, [i / vals.length / 2, i / vals.length / 2 + 0.5], [0, 1]);
          const bh = (v / max) * h * g;
          const c = kind === "bernoulli" ? (i ? C.green : C.orange) : color;
          const fr = kind === "bernoulli" ? 0.42 : 0.72; // two bars only: keep them bar-shaped, not blocks
          return <rect key={i} x={i * bw + (bw * (1 - fr)) / 2} y={h - bh} width={bw * fr} height={Math.max(0, bh)} rx={Math.min(8, bw * 0.15)} fill={alpha(c, 0.5)} stroke={c} strokeWidth={Math.max(2, Math.min(3, w / 60))} />;
        })}
        {axis ? <line x1={-6} y1={h + 2} x2={w + 6} y2={h + 2} stroke={alpha("#F3F7FF", 0.45)} strokeWidth={3} /> : null}
      </svg>
    );
  }
  const f = CURVES[kind] ?? CURVES.normal!;
  const n = 90;
  const end = Math.max(1, Math.round(n * Math.min(1, p)));
  const pts = Array.from({ length: end + 1 }, (_, i) => [(i / n) * w, h - Math.min(1, f(i / n)) * h * 0.96] as const);
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const xe = pts[pts.length - 1][0];
  const gid = `g${kind}${w}${h}`;
  return (
    <svg width={w} height={h + 6} viewBox={`0 0 ${w} ${h + 6}`} style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id={gid} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={color} />
          <stop offset="1" stopColor={color2 ?? color} />
        </linearGradient>
      </defs>
      {p > 0.01 ? (
        <>
          <path d={`${d} L${xe.toFixed(1)} ${h} L0 ${h} Z`} fill={`url(#${gid})`} opacity={0.3} />
          <path d={d} fill="none" stroke={`url(#${gid})`} strokeWidth={Math.max(3, w / 110)} strokeLinejoin="round" strokeLinecap="round" />
        </>
      ) : null}
      {axis ? <line x1={-6} y1={h + 2} x2={w + 6} y2={h + 2} stroke={alpha("#F3F7FF", 0.45)} strokeWidth={3} /> : null}
    </svg>
  );
};

// one cheat-sheet row: the question (left) lands on `at`, the name + mini shape land on `nameAt`
export const CheatRow: React.FC<{ y: number; q: string; name: string; kind: Kind; color: string; at: number; nameAt: number; h?: number; qSize?: number; nameSize?: number }> = ({ y, q, name, kind, color, at, nameAt, h = 112, qSize = 26, nameSize = 38 }) => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const ghost = ease(frame, [6, 16], [0, 1]);
  const p = spr(at - 6, theme.spring.bouncy);
  const n = spr(nameAt - 4, theme.spring.pop);
  const hot = frame >= nameAt - 4 && frame < nameAt + 24;
  return (
    <>
      <div style={{ position: "absolute", left: 90, top: y - h / 2, width: 900, height: h, boxSizing: "border-box", borderRadius: 24, background: p > 0.01 ? `linear-gradient(90deg, rgba(14,24,64,0.92) 45%, ${alpha(color, 0.18)})` : "transparent", border: p > 0.01 ? `3px solid ${n > 0.5 ? color : alpha(color, 0.45)}` : `3px dashed ${alpha("#F3F7FF", 0.18)}`, boxShadow: hot ? `0 0 26px ${alpha(color, 0.45)}` : "none", opacity: Math.max(ghost * 0.55, Math.min(1, p * 2)), transform: `translateX(${(1 - Math.min(1, p)) * -40}px)` }} />
      {p > 0.01 ? <div style={{ position: "absolute", left: 120, top: y, transform: "translateY(-50%)", opacity: Math.min(1, p * 2), width: 410, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: qSize, color: C.text, lineHeight: 1.15 }}>{q}</div> : null}
      {n > 0.01 ? (
        <div style={{ position: "absolute", left: 556, top: y, transform: `translateY(-50%) scale(${interpolate(Math.min(1, n), [0, 1], [1.4, 1])})`, transformOrigin: "left center", opacity: Math.min(1, n * 2), fontFamily: theme.fonts.display, fontWeight: 800, fontSize: name.length > 9 ? nameSize * 0.82 : nameSize, color, textShadow: glowText(color, 0.45), whiteSpace: "nowrap" }}>{name}</div>
      ) : null}
      {n > 0.01 ? (
        <div style={{ position: "absolute", left: 860, top: y - 26, opacity: Math.min(1, n * 2) }}>
          <Shape kind={kind} w={104} h={46} color={color} p={Math.min(1, n)} axis={false} />
        </div>
      ) : null}
    </>
  );
};
