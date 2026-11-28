// Type 1 / Type 2 error kit: the normal CDF, the null-vs-alternative curves with the α (false alarm), β (miss) and
// power areas around a decision threshold, the 2×2 outcome grid, and the smoke-alarm / flame icons.
// Numbers (one-sided test, effect = 2.5 standard errors): threshold 1.645 → α 5%, β 19.6%, power 80.4%;
// stricter 2.326 → α 1%, β 43.1%; 4× the data (SE halves, threshold 1.163) → α 1%, β 0.4%.
import React from "react";
import { interpolate } from "remotion";
import { FnCurve, type Geo, gx } from "./Curve";
import { Mark, useSpr } from "./Motion";
import { alpha, glowText, theme } from "../theme";

const C = theme.colors;
export const T1C = C.orange; // Type 1: false alarm
export const T2C = C.violet; // Type 2: miss
export const OKC = C.green; // a correct decision
export const NULLC = C.cyan; // the null (nothing going on)
export const EFFECT = 2.5;

export const npdf = (x: number) => Math.exp(-(x * x) / 2) / Math.sqrt(2 * Math.PI);
// standard normal CDF (Abramowitz & Stegun 7.1.26, |error| < 1.5e-7)
export const Phi = (x: number) => {
  const t = 1 / (1 + 0.3275911 * (Math.abs(x) / Math.SQRT2));
  const y = 1 - ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-(x * x) / 2);
  return x >= 0 ? 0.5 * (1 + y) : 0.5 * (1 - y);
};
export const alphaAt = (c: number, sd: number) => 1 - Phi(c / sd);
export const betaAt = (c: number, sd: number) => Phi((c - EFFECT) / sd);
export const pct = (v: number) => (v >= 0.0095 ? `${Math.round(v * 100)}%` : `${(v * 100).toFixed(1)}%`);

export const ErrCurves: React.FC<{
  g: Geo;
  c: number;
  sd: number;
  nullP?: number;
  altP?: number;
  alphaP?: number;
  betaP?: number;
  powerP?: number;
  lineP?: number;
}> = ({ g, c, sd, nullP = 1, altP = 1, alphaP = 0, betaP = 0, powerP = 0, lineP = 0 }) => {
  const f0 = (v: number) => npdf(v / sd) / sd;
  const f1 = (v: number) => npdf((v - EFFECT) / sd) / sd;
  const fmax = 0.8;
  const line = Math.min(1, lineP);
  return (
    <>
      <FnCurve g={g} f={f1} fmax={fmax} p={altP} color={T2C} fill={0.06} bands={[
        { a: g.vmin, b: c, color: T2C, opacity: 0.5, p: betaP },
        { a: c, b: g.vmax, color: OKC, opacity: 0.25, p: powerP },
      ]} />
      <FnCurve g={g} f={f0} fmax={fmax} p={nullP} color={NULLC} fill={0.06} bands={[{ a: c, b: g.vmax, color: T1C, opacity: 0.65, p: alphaP }]} />
      {line > 0.001 ? <div style={{ position: "absolute", left: gx(g, c) - 3, top: g.base - 360 * line, width: 6, height: 360 * line, borderRadius: 3, background: C.text, boxShadow: `0 0 12px ${alpha(C.text, 0.7)}` }} /> : null}
    </>
  );
};

// 2×2 grid. cols = the truth, rows = the decision. cells[r][c] = { t, sub, color, err }.
export type Cell = { t: string; sub?: string; color: string; err: boolean };
export const Grid: React.FC<{ y: number; cols: string[]; rows: string[]; cells: Cell[][]; headAt: number; cellAt: number[][]; colHead?: string; rowHead?: string; cell?: number; dim?: number[][] }> = ({ y, cols, rows, cells, headAt, cellAt, colHead = "THE TRUTH", rowHead = "YOUR DECISION", cell = 300, dim }) => {
  const spr = useSpr();
  const head = spr(headAt, theme.spring.smooth);
  const gap = 18;
  const left = 540 - cell - gap / 2 + 70;
  return (
    <>
      <div style={{ position: "absolute", left: left, width: cell * 2 + gap, top: y - 120, textAlign: "center", opacity: Math.min(1, head * 2), fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.2em", color: NULLC }}>{colHead}</div>
      {cols.map((t, i) => (
        <div key={t} style={{ position: "absolute", left: left + i * (cell + gap), width: cell, top: y - 70, textAlign: "center", opacity: Math.min(1, head * 2), fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: C.text, whiteSpace: "nowrap" }}>{t}</div>
      ))}
      <div style={{ position: "absolute", left: left - 205, top: y + cell + gap / 2, transform: "translate(-50%, -50%) rotate(-90deg)", opacity: Math.min(1, head * 2), fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.2em", color: C.dim, whiteSpace: "nowrap" }}>{rowHead}</div>
      {rows.map((t, r) => (
        <div key={t} style={{ position: "absolute", left: left - 22, top: y + r * (cell + gap) + cell / 2, transform: "translate(-100%, -50%)", opacity: Math.min(1, head * 2), textAlign: "right", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 28, lineHeight: 1.1, color: C.text, whiteSpace: "pre" }}>{t}</div>
      ))}
      {cells.map((row, r) =>
        row.map((k, c) => {
          const p = spr(cellAt[r][c], theme.spring.bouncy);
          const d = dim?.[r]?.[c] ?? 0;
          return (
            <div key={`${r}${c}`} style={{ position: "absolute", left: left + c * (cell + gap), top: y + r * (cell + gap), width: cell, height: cell, boxSizing: "border-box", borderRadius: 28, border: p > 0.01 ? `4px solid ${k.err ? k.color : alpha(k.color, 0.7)}` : `3px dashed ${alpha(C.text, 0.2)}`, background: p > 0.01 ? alpha(k.color, k.err ? 0.24 : 0.1) : "transparent", boxShadow: p > 0.01 && k.err ? `0 0 26px ${alpha(k.color, 0.4)}` : "none", opacity: 1 - d * 0.6 }}>
              {p > 0.01 ? (
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, transform: `scale(${interpolate(Math.min(1, p), [0, 1], [0.6, 1])})`, opacity: Math.min(1, p * 2) }}>
                  {k.err ? null : <Mark kind="check" at={cellAt[r][c] + 2} size={70} color={OKC} width={10} />}
                  <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: k.err ? 46 : 32, color: k.err ? C.text : OKC, textShadow: k.err ? glowText(k.color, 0.5) : undefined, whiteSpace: "nowrap" }}>{k.t}</div>
                  {k.sub ? <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.12em", color: k.color, whiteSpace: "nowrap" }}>{k.sub}</div> : null}
                </div>
              ) : null}
            </div>
          );
        }),
      )}
    </>
  );
};

export const SmokeAlarm: React.FC<{ size: number; ring?: number; color?: string }> = ({ size, ring = 0, color = C.text }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block", overflow: "visible" }}>
    {ring > 0
      ? [0, 1, 2].map((i) => {
          const k = (ring + i / 3) % 1;
          return (
            <g key={i} opacity={(1 - k) * 0.9}>
              <path d={`M${18 - k * 14} ${30 - k * 6} Q${10 - k * 16} 50 ${18 - k * 14} ${70 + k * 6}`} fill="none" stroke={T1C} strokeWidth={5} strokeLinecap="round" />
              <path d={`M${82 + k * 14} ${30 - k * 6} Q${90 + k * 16} 50 ${82 + k * 14} ${70 + k * 6}`} fill="none" stroke={T1C} strokeWidth={5} strokeLinecap="round" />
            </g>
          );
        })
      : null}
    <circle cx={50} cy={50} r={30} fill={alpha(color, 0.16)} stroke={color} strokeWidth={5} />
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <circle key={i} cx={50 + 15 * Math.cos((i * Math.PI) / 3)} cy={50 + 15 * Math.sin((i * Math.PI) / 3)} r={3} fill={color} />
    ))}
    <circle cx={50} cy={50} r={5} fill={ring > 0 ? T1C : alpha(color, 0.5)} />
  </svg>
);

export const Flame: React.FC<{ size: number; flick?: number }> = ({ size, flick = 0 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block", overflow: "visible", filter: `drop-shadow(0 0 18px ${alpha(C.orange, 0.7)})` }}>
    <path d={`M50 ${8 + flick * 4} C 70 30, 84 46, 80 66 C 77 84, 63 94, 50 94 C 37 94, 23 84, 20 66 C 17 48, 34 40, 38 24 C 44 36, 46 40, 50 ${8 + flick * 4} Z`} fill={alpha(C.orange, 0.55)} stroke={C.orange} strokeWidth={4} strokeLinejoin="round" />
    <path d="M50 52 C 60 62, 64 70, 62 78 C 60 86, 55 90, 50 90 C 45 90, 40 86, 38 78 C 36 70, 42 64, 50 52 Z" fill={alpha(C.yellow, 0.75)} />
  </svg>
);
