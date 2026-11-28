// EDA charts: Anscombe's quartet (the real 1973 data: every set has mean x 9, mean y 7.50, var x 11, r 0.816), a
// right-skewed price histogram with mean vs median markers, a price histogram with spikes, a two-cloud scatter, bar groups
// with counts, and a rising time line.
import React from "react";
import { alpha, theme } from "../theme";

const C = theme.colors;
export const ANSCOMBE: [number, number][][] = [
  [[10, 8.04], [8, 6.95], [13, 7.58], [9, 8.81], [11, 8.33], [14, 9.96], [6, 7.24], [4, 4.26], [12, 10.84], [7, 4.82], [5, 5.68]],
  [[10, 9.14], [8, 8.14], [13, 8.74], [9, 8.77], [11, 9.26], [14, 8.1], [6, 6.13], [4, 3.1], [12, 9.13], [7, 7.26], [5, 4.74]],
  [[10, 7.46], [8, 6.77], [13, 12.74], [9, 7.11], [11, 7.81], [14, 8.84], [6, 6.08], [4, 5.39], [12, 8.15], [7, 6.42], [5, 5.73]],
  [[8, 6.58], [8, 5.76], [8, 7.71], [8, 8.84], [8, 8.47], [8, 7.04], [8, 5.25], [19, 12.5], [8, 5.56], [8, 7.91], [8, 6.89]],
];

export const Scatter: React.FC<{ pts: [number, number][]; w: number; h: number; p?: number; color: string; line?: number }> = ({ pts, w, h, p = 1, color, line = 0 }) => {
  const X = (x: number) => 16 + ((x - 3) / 17) * (w - 32);
  const Y = (y: number) => h - 16 - ((y - 2) / 12) * (h - 32);
  const n = Math.round(p * pts.length);
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
      <line x1={10} y1={h - 10} x2={w - 6} y2={h - 10} stroke={alpha(C.text, 0.35)} strokeWidth={2} />
      <line x1={10} y1={6} x2={10} y2={h - 10} stroke={alpha(C.text, 0.35)} strokeWidth={2} />
      {line > 0 ? <line x1={X(3)} y1={Y(3 + 0.5 * 3)} x2={X(3 + 17 * line)} y2={Y(3 + 0.5 * (3 + 17 * line))} stroke={C.yellow} strokeWidth={3} strokeDasharray="8 6" /> : null}
      {pts.slice(0, n).map(([x, y], i) => (
        <circle key={i} cx={X(x)} cy={Y(y)} r={w < 300 ? 6 : 8} fill={color} />
      ))}
    </svg>
  );
};

// right-skewed histogram (price in lakh), optional spike at 100L, mean + median markers
export const Hist: React.FC<{ w: number; h: number; p?: number; marks?: number; spike?: number }> = ({ w, h, p = 1, marks = 0, spike = 0 }) => {
  const bins = [6, 14, 22, 26, 20, 14, 9, 6, 4, 3, 2, 2, 1, 1, 1, 0.6, 0.5, 0.4, 0.3, 0.3];
  const bw = (w - 20) / bins.length;
  const max = 30;
  const xOf = (lakh: number) => 10 + (lakh / 400) * (w - 20);
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
      {bins.map((b, i) => {
        const isSpike = spike > 0 && i === 4;
        const v = isSpike ? b + 22 * spike : b;
        const bh = ((v * p) / (max + 22 * spike)) * (h - 40);
        return <rect key={i} x={10 + i * bw + 2} y={h - 20 - bh} width={bw - 4} height={bh} rx={3} fill={isSpike ? C.orange : alpha(C.cyan, 0.85)} />;
      })}
      <line x1={10} y1={h - 20} x2={w - 10} y2={h - 20} stroke={alpha(C.text, 0.4)} strokeWidth={2} />
      {marks > 0 ? (
        <>
          <line x1={xOf(85)} y1={10} x2={xOf(85)} y2={h - 20} stroke={C.green} strokeWidth={4} opacity={marks} />
          <line x1={xOf(120)} y1={10} x2={xOf(120)} y2={h - 20} stroke={C.red} strokeWidth={4} strokeDasharray="8 6" opacity={marks} />
        </>
      ) : null}
    </svg>
  );
};
