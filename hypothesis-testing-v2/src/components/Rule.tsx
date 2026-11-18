// Shared rule helpers for bell-curve scenes: the 1 / 2 / 3 SD colours, SD tick labels, non-overlapping band rings
// and a bracket with a label pill (drawn under an axis).
import React from "react";
import { interpolate } from "remotion";
import { type Band, type BellGeo, vx } from "./Bell";
import { alpha, theme } from "../theme";

const C = theme.colors;
export const SD_COL = [C.cyan, C.violet, C.green];
export const SD_TICKS = [-3, -2, -1, 0, 1, 2, 3].map((v) => ({ v, label: v === 0 ? "MEAN" : `${v > 0 ? "+" : "-"}${Math.abs(v)} SD` }));

// non-overlapping rings: [-1,1] cyan, the 1–2 SD ring violet, the 2–3 SD ring green; each sweeps out from the centre
export const ruleBands = (p: number[]): Band[] => {
  const out: Band[] = [];
  p.forEach((q, k) => {
    if (q <= 0.001) return;
    const inner = k;
    const outer = k + q;
    if (k === 0) out.push({ a: -outer, b: outer, color: SD_COL[0], opacity: 0.5 });
    else {
      out.push({ a: -outer, b: -inner, color: SD_COL[k], opacity: 0.45 });
      out.push({ a: inner, b: outer, color: SD_COL[k], opacity: 0.45 });
    }
  });
  return out;
};

export const Bracket: React.FC<{ g: BellGeo; a: number; b: number; y: number; p: number; color: string; label: string }> = ({ g, a, b, y, p, color, label }) => {
  if (p <= 0.001) return null;
  const xa = vx(g, a);
  const xb = vx(g, b);
  const mid = (xa + xb) / 2;
  const half = ((xb - xa) / 2) * p;
  return (
    <>
      <div style={{ position: "absolute", left: mid - half, top: y - 2.5, width: half * 2, height: 5, borderRadius: 3, background: color, boxShadow: `0 0 10px ${alpha(color, 0.6)}` }} />
      <div style={{ position: "absolute", left: mid - half - 2.5, top: y - 16, width: 5, height: 32, borderRadius: 3, background: color }} />
      <div style={{ position: "absolute", left: mid + half - 2.5, top: y - 16, width: 5, height: 32, borderRadius: 3, background: color }} />
      <div style={{ position: "absolute", left: mid, top: y, transform: `translate(-50%, -50%) scale(${interpolate(p, [0, 1], [0.6, 1])})`, opacity: Math.min(1, p * 2), padding: "3px 16px", borderRadius: 999, background: "#0A1440", border: `3px solid ${color}`, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 28, color: C.text, whiteSpace: "nowrap" }}>{label}</div>
    </>
  );
};


// a horizontal arrow from value a to value b at height y (growing with p), with a label chip above its middle
export const Span: React.FC<{ g: BellGeo; a: number; b: number; y: number; p: number; color: string; label: string; labelP?: number }> = ({ g, a, b, y, p, color, label, labelP }) => {
  if (p <= 0.001) return null;
  const xa = vx(g, a);
  const xb = xa + (vx(g, b) - xa) * p;
  const dir = Math.sign(vx(g, b) - xa) || 1;
  const lp = labelP ?? p;
  return (
    <>
      <div style={{ position: "absolute", left: Math.min(xa, xb), top: y - 3, width: Math.abs(xb - xa), height: 6, borderRadius: 3, background: color, boxShadow: `0 0 10px ${alpha(color, 0.6)}` }} />
      <svg width={30} height={30} viewBox="-15 -15 30 30" style={{ position: "absolute", left: xb - 15, top: y - 15, overflow: "visible" }}>
        <path d={dir > 0 ? "M-8 -11 L8 0 L-8 11 Z" : "M8 -11 L-8 0 L8 11 Z"} fill={color} />
      </svg>
      <div style={{ position: "absolute", left: (xa + vx(g, b)) / 2, top: y - 34, transform: `translate(-50%, -50%) scale(${interpolate(lp, [0, 1], [0.6, 1])})`, opacity: Math.min(1, lp * 2), padding: "2px 14px", borderRadius: 12, background: color, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 30, color: C.ink, whiteSpace: "nowrap" }}>{label}</div>
    </>
  );
};
