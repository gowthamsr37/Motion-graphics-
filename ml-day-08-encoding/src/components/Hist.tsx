// Histograms for the Skewness video. Bin counts are the data: mode, median and mean are computed from them,
// so every marker on screen is exact. Bins are numbered 1..n; a bin's centre is its value.
import React from "react";
import { interpolate } from "remotion";
import { alpha, glowText, theme } from "../theme";

const C = theme.colors;

// right-skewed (bins 1..12): n = 63, mode 3, median 4 (the 32nd value), mean 311 / 63 = 4.94
export const RIGHT = [2, 10, 13, 10, 7, 5, 4, 3, 3, 2, 2, 2];
// left-skewed: the mirror image → mode 10, median 9, mean 13 − 4.94 = 8.06
export const LEFT = [...RIGHT].reverse();
// symmetric (12 bins, centred on 6.5): mode = median = mean = 6.5
export const SYM = [1, 3, 5, 8, 11, 13, 13, 11, 8, 5, 3, 1];

export const histStats = (counts: number[]) => {
  const n = counts.reduce((a, b) => a + b, 0);
  const mean = counts.reduce((a, c, i) => a + c * (i + 1), 0) / n;
  const max = Math.max(...counts);
  const modes = counts.map((c, i) => (c === max ? i + 1 : 0)).filter(Boolean);
  const mode = modes.reduce((a, b) => a + b, 0) / modes.length; // a tie between neighbours → their midpoint
  const medianAt = (k: number) => {
    let cum = 0;
    for (let i = 0; i < counts.length; i++) {
      cum += counts[i];
      if (cum >= k) return i + 1;
    }
    return counts.length;
  };
  const median = n % 2 ? medianAt((n + 1) / 2) : (medianAt(n / 2) + medianAt(n / 2 + 1)) / 2;
  return { n, mean, mode, median };
};

export type Geo = { x0: number; bw: number; gap: number; base: number; maxH: number; maxC: number };
export const binX = (g: Geo, v: number) => g.x0 + (v - 1) * (g.bw + g.gap) + g.bw / 2;

// bars; `tail` colours the bins from that index on (0-based), `tailLeft` colours bins up to that index
export const Bars: React.FC<{ g: Geo; counts: number[]; p?: number[] | number; color: string; tailColor?: string; tail?: number; tailLeft?: number; dim?: number }> = ({ g, counts, p = 1, color, tailColor, tail, tailLeft, dim = 1 }) => (
  <>
    {counts.map((c, i) => {
      const pi = Array.isArray(p) ? p[i] ?? 1 : p;
      const h = (c / g.maxC) * g.maxH * pi;
      const isTail = tailColor && ((tail !== undefined && i >= tail) || (tailLeft !== undefined && i <= tailLeft));
      const col = isTail ? tailColor! : color;
      return <div key={i} style={{ position: "absolute", left: g.x0 + i * (g.bw + g.gap), top: g.base - h, width: g.bw, height: h, borderRadius: `${Math.min(10, g.bw / 4)}px ${Math.min(10, g.bw / 4)}px 2px 2px`, background: col.startsWith("#") ? `linear-gradient(180deg, ${alpha(col, 0.95)}, ${alpha(col, 0.3)})` : col, opacity: dim, boxShadow: isTail ? `0 0 12px ${alpha(col, 0.45)}` : "none" }} />;
    })}
  </>
);

// a vertical marker with a label chip on top
export const Marker: React.FC<{ x: number; top: number; base: number; label: string; color: string; p: number; labelY?: number; small?: boolean }> = ({ x, top, base, label, color, p, labelY, small }) => {
  if (p <= 0.001) return null;
  const ly = labelY ?? top - 24;
  return (
    <>
      <div style={{ position: "absolute", left: x - 2.5, top: top + (base - top) * (1 - p), height: (base - top) * p, borderLeft: `5px solid ${color}`, filter: `drop-shadow(0 0 6px ${alpha(color, 0.8)})` }} />
      <div style={{ position: "absolute", left: x, top: ly, transform: `translate(-50%, -50%) scale(${interpolate(p, [0, 1], [0.5, 1])})`, opacity: p, padding: small ? "3px 10px" : "5px 14px", borderRadius: 12, background: alpha("#060B2A", 0.9), border: `2px solid ${color}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: small ? 18 : 24, color, textShadow: glowText(color, 0.3), whiteSpace: "nowrap" }}>{label}</div>
    </>
  );
};
