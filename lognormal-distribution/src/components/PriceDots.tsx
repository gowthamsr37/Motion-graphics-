// The 100 house prices as a dot plot that can morph between a normal (linear) price scale and a log scale.
// m = 0: linear bins of 20 lakh (0–260), 3 dots per row → skewed right. m = 1: log10 bins of 0.1 (5 to 500 lakh),
// 2 dots per row → a symmetric bell. Each dot glides from its linear slot to its log slot (staggered).
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { ease } from "./Motion";
import { MU10, PRICES, SD10 } from "../data";
import { alpha, theme } from "../theme";

const C = theme.colors;
export type DotGeo = { x0: number; x1: number; base: number; dot: number };
export const LIN_MAX = 260;
export const LOG_MIN = Math.log10(5);
export const LOG_MAX = Math.log10(500);
export const linX = (g: DotGeo, v: number) => g.x0 + (v / LIN_MAX) * (g.x1 - g.x0);
export const logX = (g: DotGeo, v: number) => g.x0 + ((Math.log10(v) - LOG_MIN) / (LOG_MAX - LOG_MIN)) * (g.x1 - g.x0);

const slots = (keyOf: (v: number) => number) => {
  const c: Record<number, number> = {};
  return PRICES.map((v) => {
    const k = keyOf(v);
    c[k] = (c[k] ?? 0) + 1;
    return { k, i: c[k] - 1 };
  });
};
const LIN = slots((v) => Math.floor(v / 20));
const LOG = slots((v) => Math.floor((Math.log10(v) - LOG_MIN) / 0.1 + 1e-9));

export const dotPos = (g: DotGeo, j: number, m: number) => {
  const step = g.dot + 2;
  const lw = (g.x1 - g.x0) / 13;
  const gw = (g.x1 - g.x0) / 20;
  const a = LIN[j];
  const b = LOG[j];
  const ax = g.x0 + a.k * lw + (lw - 3 * step + 2) / 2 + (a.i % 3) * step + g.dot / 2;
  const ay = g.base - g.dot / 2 - 2 - Math.floor(a.i / 3) * step;
  const bx = g.x0 + b.k * gw + (gw - 2 * step + 2) / 2 + (b.i % 2) * step + g.dot / 2;
  const by = g.base - g.dot / 2 - 2 - Math.floor(b.i / 2) * step;
  return { x: interpolate(m, [0, 1], [ax, bx]), y: interpolate(m, [0, 1], [ay, by]) };
};

// the expected bell over the log bins, in pixels (100 dots, bins of 0.1, 2 per row)
export const bellY = (g: DotGeo, x: number) => {
  const l = LOG_MIN + ((x - g.x0) / (g.x1 - g.x0)) * (LOG_MAX - LOG_MIN);
  const pdf = Math.exp(-(((l - MU10) / SD10) ** 2) / 2) / (SD10 * Math.sqrt(2 * Math.PI));
  const count = 100 * 0.1 * pdf;
  return g.base - 2 - (count / 2) * (g.dot + 2);
};

export const PriceDots: React.FC<{ g: DotGeo; at: number; morphAt?: number; hiRight?: number; color?: string; color2?: string; stagger?: number }> = ({ g, at, morphAt, hiRight, color = C.orange, color2 = C.violet, stagger = 0.6 }) => {
  const frame = useCurrentFrame();
  return (
    <>
      {PRICES.map((v, j) => {
        const t = at + j * stagger;
        const d = ease(frame, [t, t + 8], [0, 1], theme.ease.in);
        if (d <= 0.001) return null;
        const m = morphAt === undefined ? 0 : ease(frame, [morphAt + (j % 20) * 0.6, morphAt + 22 + (j % 20) * 0.6], [0, 1], theme.ease.inOut);
        const p = dotPos(g, j, m);
        const far = hiRight !== undefined && frame >= hiRight && v >= 100 && m < 0.5;
        const c = m > 0.5 ? color2 : far ? C.orange : color;
        return <div key={j} style={{ position: "absolute", left: p.x - g.dot / 2, top: interpolate(d, [0, 1], [g.base - 420, p.y - g.dot / 2]), width: g.dot, height: g.dot, borderRadius: g.dot / 2, background: c, boxShadow: far ? `0 0 10px ${C.orange}` : `0 0 5px ${alpha(c, 0.7)}`, opacity: Math.min(1, d * 2) }} />;
      })}
    </>
  );
};

// axis that cross-fades between the linear and the log tick sets
export const MorphAxis: React.FC<{ g: DotGeo; m: number; p?: number; label?: [string, string] }> = ({ g, m, p = 1, label = ["PRICE (LAKH RUPEES)", "PRICE (LAKH RUPEES), LOG SCALE"] }) => (
  <>
    <div style={{ position: "absolute", left: g.x0 - 10, top: g.base + 1, width: (g.x1 - g.x0 + 20) * p, height: 4, borderRadius: 2, background: alpha(C.text, 0.4) }} />
    {[0, 50, 100, 150, 200, 250].map((v) => (
      <div key={`l${v}`} style={{ position: "absolute", left: linX(g, v), top: g.base + 30, transform: "translate(-50%, -50%)", opacity: p * (1 - m), fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 22, color: C.dim }}>{v}</div>
    ))}
    {[5, 50, 500].map((v) => (
      <div key={`g${v}`} style={{ position: "absolute", left: logX(g, v), top: g.base + 30, transform: "translate(-50%, -50%)", opacity: p * m, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 26, color: C.violet }}>{v}</div>
    ))}
    {[0, 1].map((i) => (
      <div key={i} style={{ position: "absolute", left: 0, right: 0, top: g.base + 66, textAlign: "center", opacity: p * (i ? m : 1 - m), fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.16em", color: i ? C.violet : C.dim }}>{label[i]}</div>
    ))}
  </>
);
