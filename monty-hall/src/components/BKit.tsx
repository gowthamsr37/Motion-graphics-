// Visual kit for the birthday paradox: a person glyph, a pairs web (every node linked to every other), the probability
// curve P(n) = 1 − ∏(365−i)/365, and a seeded 1,000-room simulation (mulberry32(8): 507 rooms with a shared birthday).
import React from "react";
import { alpha, theme } from "../theme";

const C = theme.colors;
export const HOT = "#FF8A00"; // the paradox series accent (orange)

export const Guy: React.FC<{ size: number; color: string; glow?: boolean }> = ({ size, color, glow }) => (
  <svg width={size} height={size * 1.2} viewBox="0 0 58 70" style={{ display: "block", filter: glow ? `drop-shadow(0 0 10px ${color})` : undefined }}>
    <circle cx={29} cy={18} r={14} fill={color} />
    <path d="M5 70 Q5 36 29 36 Q53 36 53 70 Z" fill={color} />
  </svg>
);

export const pBday = (n: number) => {
  let q = 1;
  for (let i = 0; i < n; i++) q *= (365 - i) / 365;
  return 1 - q;
};

// n nodes on a circle; links drawn up to `links` (0..all); node glyphs
export const PairWeb: React.FC<{ n: number; r: number; links: number; color?: string; nodeColor?: string; nodeR?: number }> = ({ n, r, links, color = HOT, nodeColor = C.text, nodeR = 12 }) => {
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    return [r + 20 + Math.cos(a) * r, r + 20 + Math.sin(a) * r];
  });
  const pairs: [number, number][] = [];
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) pairs.push([i, j]);
  const k = Math.round(links * pairs.length);
  return (
    <svg width={2 * r + 40} height={2 * r + 40} viewBox={`0 0 ${2 * r + 40} ${2 * r + 40}`} style={{ display: "block", overflow: "visible" }}>
      {pairs.slice(0, k).map(([i, j], m) => (
        <line key={m} x1={pts[i][0]} y1={pts[i][1]} x2={pts[j][0]} y2={pts[j][1]} stroke={color} strokeWidth={n > 10 ? 1.6 : 4} opacity={n > 10 ? 0.55 : 0.9} />
      ))}
      {pts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r={nodeR} fill={nodeColor} stroke={C.bg} strokeWidth={3} />
      ))}
    </svg>
  );
};

const mul = (a: number) => () => {
  a |= 0;
  a = (a + 0x6d2b79f5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
export const ROOMS: boolean[] = (() => {
  const r = mul(8);
  const out: boolean[] = [];
  for (let k = 0; k < 1000; k++) {
    const s = new Set<number>();
    let hit = false;
    for (let i = 0; i < 23; i++) {
      const d = Math.floor(r() * 365);
      if (s.has(d)) hit = true;
      s.add(d);
    }
    out.push(hit);
  }
  return out;
})();

export const Curve: React.FC<{ x: number; y: number; w: number; h: number; upTo: number; marks: { n: number; at: number; frame: number }[] }> = ({ x, y, w, h, upTo, marks }) => {
  const N = 70;
  const X = (n: number) => x + (n / N) * w;
  const Y = (p: number) => y + h - p * h;
  const pts: string[] = [];
  for (let n = 1; n <= Math.max(1, Math.min(N, upTo)); n++) pts.push(`${X(n)},${Y(pBday(n))}`);
  return (
    <g>
      <line x1={x} y1={y + h} x2={x + w} y2={y + h} stroke={alpha(C.text, 0.5)} strokeWidth={3} />
      <line x1={x} y1={y} x2={x} y2={y + h} stroke={alpha(C.text, 0.5)} strokeWidth={3} />
      <line x1={x} y1={Y(0.5)} x2={x + w} y2={Y(0.5)} stroke={alpha(C.text, 0.3)} strokeWidth={2} strokeDasharray="10 10" />
      {[0, 10, 20, 30, 40, 50, 60, 70].map((n) => (
        <text key={n} x={X(n)} y={y + h + 40} textAnchor="middle" fontFamily={theme.fonts.body} fontWeight={700} fontSize={26} fill={C.dim}>{n}</text>
      ))}
      {[0, 50, 100].map((p) => (
        <text key={p} x={x - 16} y={Y(p / 100)} textAnchor="end" dominantBaseline="central" fontFamily={theme.fonts.body} fontWeight={700} fontSize={26} fill={C.dim}>{p}%</text>
      ))}
      {pts.length > 1 ? <polyline points={pts.join(" ")} fill="none" stroke={HOT} strokeWidth={7} strokeLinejoin="round" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 8px ${HOT})` }} /> : null}
      {marks.map((m) => {
        if (m.frame < m.at) return null;
        const p = pBday(m.n);
        return (
          <g key={m.n}>
            <line x1={X(m.n)} y1={Y(p)} x2={X(m.n)} y2={y + h} stroke={C.yellow} strokeWidth={3} strokeDasharray="6 6" />
            <circle cx={X(m.n)} cy={Y(p)} r={13} fill={C.yellow} stroke={C.bg} strokeWidth={3} />
            <text x={X(m.n) + (m.n > 50 ? -18 : 18)} y={Y(p) + (m.n > 50 ? 44 : 40)} textAnchor={m.n > 50 ? "end" : "start"} fontFamily={theme.fonts.display} fontWeight={800} fontSize={36} fill={C.text}>
              {m.n}: {m.n === 23 ? (p * 100).toFixed(1) : Math.round(p * 100)}%
            </text>
          </g>
        );
      })}
    </g>
  );
};
