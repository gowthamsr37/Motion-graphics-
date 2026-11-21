// Z-test kit: colour code (claim = cyan, sample mean = violet, standard error = green, tail / reject = orange),
// drawn glyphs the Latin font subset lacks (sigma, x-bar), the juice Bottle, the Formula with value slots and
// highlights, the ZTable excerpt with row / column / cell highlights, the 5-step tracker and the standard normal geo.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Radical } from "./Clt";
import { ease, useSpr } from "./Motion";
import { npdf } from "./TDist";
import type { Geo } from "./Curve";
import { alpha, glowBox, glowText, theme } from "../theme";

const C = theme.colors;
export const CLAIM = C.cyan;
export const MEAN = C.violet;
export const SE = C.green;
export const TAIL = C.orange;

export const Phi = (z: number) => {
  // standard normal CDF (Abramowitz–Stegun 7.1.26 on erf), accurate to ~1e-7
  const t = 1 / (1 + 0.3275911 * Math.abs(z / Math.SQRT2));
  const y = 1 - ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-(z * z) / 2);
  return z >= 0 ? 0.5 * (1 + y) : 0.5 * (1 - y);
};

// lower-case sigma, drawn (the fonts are Latin-only)
export const Sigma: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 62 62" style={{ display: "inline-block", verticalAlign: "-0.02em", overflow: "visible" }}>
    <circle cx={26} cy={38} r={18} fill="none" stroke={color} strokeWidth={7} />
    <path d="M26 20 H60" stroke={color} strokeWidth={7} strokeLinecap="round" />
  </svg>
);

export const XBar: React.FC<{ color: string }> = ({ color }) => (
  <span style={{ position: "relative", display: "inline-block", color }}>
    <span style={{ position: "absolute", left: "0.06em", right: "0.06em", top: "0.08em", height: "0.08em", borderRadius: 4, background: color }} />
    x
  </span>
);

// a juice bottle: liquid level animates to `level` (0–1 of the body), dashed claim line at `mark`
export const Bottle: React.FC<{ w: number; level: number; mark?: number; color?: string; label?: string }> = ({ w, level, mark, color = C.orange, label }) => {
  const frame = useCurrentFrame();
  const top = 70, bot = 280;
  const y = bot - (bot - top) * level;
  const wave = Math.sin(frame / 6) * 2.5;
  return (
    <svg width={w} height={w * 1.9} viewBox="0 0 160 304" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <clipPath id="bottleClip">
          <path d="M58 10 H102 V40 Q102 52 124 66 Q140 78 140 100 V270 Q140 294 116 294 H44 Q20 294 20 270 V100 Q20 78 36 66 Q58 52 58 40 Z" />
        </clipPath>
      </defs>
      <g clipPath="url(#bottleClip)">
        <path d={`M0 ${y} Q40 ${y - wave} 80 ${y} T160 ${y} V310 H0 Z`} fill={alpha(color, 0.8)} />
      </g>
      <path d="M58 10 H102 V40 Q102 52 124 66 Q140 78 140 100 V270 Q140 294 116 294 H44 Q20 294 20 270 V100 Q20 78 36 66 Q58 52 58 40 Z" fill="none" stroke="rgba(230,240,255,0.85)" strokeWidth={5} strokeLinejoin="round" />
      <rect x={52} y={0} width={56} height={16} rx={5} fill={C.cyan} />
      {mark !== undefined ? <line x1={4} x2={156} y1={bot - (bot - top) * mark} y2={bot - (bot - top) * mark} stroke={C.text} strokeWidth={4} strokeDasharray="10 8" /> : null}
      {label ? (
        <text x={80} y={196} textAnchor="middle" fontFamily={theme.fonts.display} fontWeight={800} fontSize={30} fill={C.text}>
          {label}
        </text>
      ) : null}
    </svg>
  );
};

// the z-test formula; slots show symbols until a value is given; hi* glow the numerator / denominator boxes
export const Formula: React.FC<{
  size: number;
  xb?: React.ReactNode;
  mu?: React.ReactNode;
  sig?: React.ReactNode;
  n?: React.ReactNode;
  hiTop?: number;
  hiBot?: number;
  result?: React.ReactNode;
}> = ({ size, xb, mu, sig, n, hiTop = 0, hiBot = 0, result }) => {
  const box = (k: number, c: string): React.CSSProperties => ({ padding: `${size * 0.08}px ${size * 0.25}px`, borderRadius: 18, background: alpha(c, 0.18 * k), boxShadow: k > 0.01 ? glowBox(c, 0.6 * k) : "none", border: `2px solid ${alpha(c, 0.8 * k)}` });
  const mono: React.CSSProperties = { fontFamily: theme.fonts.mono, fontWeight: 800 };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: size * 0.3, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: size, color: C.text, whiteSpace: "nowrap" }}>
      <span style={{ fontStyle: "italic" }}>z</span>
      <span>=</span>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ ...box(hiTop, MEAN), display: "flex", alignItems: "center", gap: size * 0.22 }}>
          {xb !== undefined ? <span style={{ ...mono, color: MEAN }}>{xb}</span> : <XBar color={MEAN} />}
          <span>−</span>
          {mu !== undefined ? <span style={{ ...mono, color: CLAIM }}>{mu}</span> : <span style={{ color: CLAIM }}>µ</span>}
        </div>
        <div style={{ width: "100%", height: Math.max(4, size * 0.07), borderRadius: 3, background: C.text, margin: `${size * 0.1}px 0` }} />
        <div style={{ ...box(hiBot, SE), display: "flex", alignItems: "center", gap: size * 0.2 }}>
          {sig !== undefined ? <span style={{ ...mono, color: SE }}>{sig}</span> : <Sigma size={size} color={SE} />}
          <span>/</span>
          <Radical color={C.text} size={size * 0.9}>
            {n !== undefined ? <span style={{ ...mono, color: C.text }}>{n}</span> : <span style={{ fontStyle: "italic" }}>n</span>}
          </Radical>
        </div>
      </div>
      {result !== undefined ? (
        <>
          <span>=</span>
          <span style={{ ...mono, color: TAIL, textShadow: glowText(TAIL, 0.6) }}>{result}</span>
        </>
      ) : null}
    </div>
  );
};

// z-table excerpt (area to the LEFT of z)
export const ZROWS = [-2.1, -2.0, -1.9, -1.8];
export const ZCOLS = [0, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07];
export const zcell = (r: number, c: number) => Phi(Math.round((r - ZCOLS[c]) * 100) / 100).toFixed(4);

export const ZTable: React.FC<{ x: number; y: number; p: number; row?: number; col?: number; cell?: [number, number]; rowP?: number; colP?: number; cellP?: number; color?: string }> = ({ x, y, p, row, col, cell, rowP = 0, colP = 0, cellP = 0, color = TAIL }) => {
  const cw = 104, rh = 58, hw = 110;
  const W = hw + cw * ZCOLS.length;
  const H = rh * (ZROWS.length + 1);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: W, height: H, transform: `translateX(-50%) translateY(${(1 - p) * 20}px)`, opacity: Math.min(1, p * 1.5), borderRadius: 18, overflow: "hidden", background: "rgba(10,18,52,0.95)", border: `2px solid ${alpha(C.text, 0.2)}` }}>
      {/* header row */}
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: rh, background: alpha(C.text, 0.08) }} />
      <div style={{ position: "absolute", left: 0, top: 0, width: hw, height: H, background: alpha(C.text, 0.08) }} />
      {row !== undefined ? <div style={{ position: "absolute", left: 0, top: rh * (row + 1), width: hw + (W - hw) * rowP, height: rh, background: alpha(color, 0.28), borderTop: `2px solid ${color}`, borderBottom: `2px solid ${color}` }} /> : null}
      {col !== undefined ? <div style={{ position: "absolute", left: hw + cw * col, top: 0, width: cw, height: rh + (H - rh) * colP, background: alpha(color, 0.28), borderLeft: `2px solid ${color}`, borderRight: `2px solid ${color}` }} /> : null}
      <div style={{ position: "absolute", left: 0, top: 0, width: hw, height: rh, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontStyle: "italic", fontSize: 30, color: C.dim }}>z</div>
      {ZCOLS.map((c, j) => (
        <div key={j} style={{ position: "absolute", left: hw + cw * j, top: 0, width: cw, height: rh, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 24, color: col === j && colP > 0.5 ? color : C.dim }}>{c.toFixed(2)}</div>
      ))}
      {ZROWS.map((r, i) => (
        <React.Fragment key={i}>
          <div style={{ position: "absolute", left: 0, top: rh * (i + 1), width: hw, height: rh, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 26, color: row === i && rowP > 0.5 ? color : C.dim }}>{r.toFixed(1)}</div>
          {ZCOLS.map((_, j) => {
            const hot = cell && cell[0] === i && cell[1] === j ? cellP : 0;
            return (
              <div key={j} style={{ position: "absolute", left: hw + cw * j, top: rh * (i + 1), width: cw, height: rh, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 23, letterSpacing: "-0.04em", color: hot > 0.3 ? C.ink : alpha(C.text, 0.82), background: hot > 0.01 ? alpha(color, hot) : "transparent", transform: `scale(${1 + 0.18 * hot})`, borderRadius: 10, boxShadow: hot > 0.3 ? glowBox(color, hot) : "none", zIndex: hot > 0 ? 2 : 1 }}>
                {zcell(r, j)}
              </div>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
};

// the standard normal curve geometry and density (used by S4, S7, S8, S9 and the quiz)
export const zf = (v: number) => npdf(v);
export const ZFMAX = npdf(0);
export const zGeo = (base: number, h: number, x0 = 120, x1 = 960): Geo => ({ x0, x1, vmin: -3.6, vmax: 3.6, base, h });

// 5-step tracker in the header band: done = green check, active = glowing
export const STEPS = ["HYPOTHESES", "ALPHA", "FORMULA", "Z TABLE", "DECIDE"];
export const StepTracker: React.FC<{ active: number }> = ({ active }) => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const k = spr(2, theme.spring.smooth);
  const glow = ease(frame, [0, 14], [0, 1]);
  return (
    <div style={{ position: "absolute", left: 90, top: 250, width: 900, display: "flex", gap: 10, opacity: Math.min(1, k * 2) }}>
      {STEPS.map((t, i) => {
        const done = i < active;
        const on = i === active;
        const c = done ? SE : on ? C.yellow : alpha(C.text, 0.3);
        return (
          <div key={t} style={{ flex: 1, height: 64, boxSizing: "border-box", borderRadius: 16, border: `2px solid ${c}`, background: on ? alpha(C.yellow, 0.14 * glow) : done ? alpha(SE, 0.12) : "transparent", boxShadow: on ? `0 0 ${18 * glow}px ${alpha(C.yellow, 0.4)}` : "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 17, letterSpacing: "0.06em", color: on ? C.text : done ? SE : C.dim, transform: on ? `scale(${interpolate(glow, [0, 1], [0.94, 1])})` : undefined }}>
            {done ? (
              <svg width={20} height={20} viewBox="0 0 20 20" style={{ display: "block" }}>
                <path d="M3 10 L8 15 L17 4" fill="none" stroke={SE} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <span style={{ fontFamily: theme.fonts.mono, fontSize: 20 }}>{i + 1}</span>
            )}
            {t}
          </div>
        );
      })}
    </div>
  );
};
