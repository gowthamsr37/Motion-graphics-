// Visual kit for the law-of-large-numbers reel: a European roulette wheel (37 pockets, single green zero), a coin,
// a casino chip, a car, a star, a convergence graph of the running share of heads, and the seeded coin data.
import React from "react";
import { interpolate } from "remotion";
import { alpha, theme } from "../theme";

const C = theme.colors;
export const RED = "#EF4444";
export const FELT = "#10B981";

// European wheel order (clockwise from 0)
const ORDER = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];

export const Wheel: React.FC<{ r: number; rot?: number; ball?: number; zeroGlow?: number; dimReds?: number }> = ({ r, rot = 0, ball, zeroGlow = 0, dimReds = 0 }) => {
  const n = 37;
  const step = 360 / n;
  const pocket = (i: number, r0: number, r1: number) => {
    const a0 = ((i * step - step / 2 - 90) * Math.PI) / 180;
    const a1 = ((i * step + step / 2 - 90) * Math.PI) / 180;
    const p = (a: number, rr: number) => `${r + Math.cos(a) * rr} ${r + Math.sin(a) * rr}`;
    return `M${p(a0, r0)} L${p(a0, r1)} A${r1} ${r1} 0 0 1 ${p(a1, r1)} L${p(a1, r0)} A${r0} ${r0} 0 0 0 ${p(a0, r0)} Z`;
  };
  const ba = ball !== undefined ? ((ball - 90) * Math.PI) / 180 : 0;
  return (
    <svg width={r * 2} height={r * 2} viewBox={`0 0 ${r * 2} ${r * 2}`} style={{ overflow: "visible", display: "block" }}>
      <circle cx={r} cy={r} r={r} fill="#3B2412" stroke="#D4A24C" strokeWidth={r * 0.04} />
      <g transform={`rotate(${rot} ${r} ${r})`}>
        {ORDER.map((num, i) => {
          const green = num === 0;
          const red = !green && i % 2 === 1;
          const fill = green ? FELT : red ? RED : "#111827";
          return (
            <path key={i} d={pocket(i, r * 0.6, r * 0.93)} fill={fill} opacity={red ? 1 - dimReds * 0.0 : 1} stroke="#D4A24C" strokeWidth={1.2} style={green && zeroGlow > 0 ? { filter: `drop-shadow(0 0 ${14 * zeroGlow}px ${FELT})` } : undefined} />
          );
        })}
        {ORDER.map((num, i) => {
          const a = ((i * step - 90) * Math.PI) / 180;
          const rr = r * 0.8;
          return (
            <text key={`t${i}`} x={r + Math.cos(a) * rr} y={r + Math.sin(a) * rr} fill="#FFFFFF" fontFamily={theme.fonts.display} fontWeight={800} fontSize={r * 0.075} textAnchor="middle" dominantBaseline="central" transform={`rotate(${i * step} ${r + Math.cos(a) * rr} ${r + Math.sin(a) * rr})`}>
              {num}
            </text>
          );
        })}
        {zeroGlow > 0 ? <path d={pocket(0, r * 0.6, r * 0.93)} fill="none" stroke="#FFFFFF" strokeWidth={4 * zeroGlow} /> : null}
      </g>
      <circle cx={r} cy={r} r={r * 0.6} fill="#5B3A1E" stroke="#D4A24C" strokeWidth={3} />
      <circle cx={r} cy={r} r={r * 0.42} fill="#7A5230" />
      {[0, 90, 180, 270].map((d) => (
        <rect key={d} x={r - r * 0.03} y={r - r * 0.4} width={r * 0.06} height={r * 0.8} rx={r * 0.03} fill="#D4A24C" transform={`rotate(${d / 2 + rot * 1.0} ${r} ${r})`} />
      ))}
      <circle cx={r} cy={r} r={r * 0.09} fill="#F5D27A" />
      {ball !== undefined ? <circle cx={r + Math.cos(ba) * r * 0.97} cy={r + Math.sin(ba) * r * 0.97} r={r * 0.045} fill="#FFFFFF" style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,0.8))" }} /> : null}
    </svg>
  );
};

export const Coin: React.FC<{ size: number; flip?: number; face?: "H" | "T" }> = ({ size, flip = 0, face = "H" }) => {
  const sy = Math.abs(Math.cos(flip * Math.PI));
  const showH = Math.cos(flip * Math.PI) >= 0 ? face === "H" : face !== "H";
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible", display: "block" }}>
      <g transform={`translate(50 50) scale(1 ${Math.max(0.06, sy)}) translate(-50 -50)`}>
        <circle cx={50} cy={50} r={46} fill="#F5C542" stroke="#B7791F" strokeWidth={5} />
        <circle cx={50} cy={50} r={36} fill="none" stroke="#B7791F" strokeWidth={2.5} />
        <text x={50} y={52} textAnchor="middle" dominantBaseline="central" fontFamily={theme.fonts.display} fontWeight={800} fontSize={40} fill="#7C4A03">{showH ? "H" : "T"}</text>
      </g>
    </svg>
  );
};

export const Chip: React.FC<{ size: number; color?: string; label?: string }> = ({ size, color = RED, label = "100" }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block" }}>
    <circle cx={50} cy={50} r={47} fill={color} />
    {Array.from({ length: 8 }, (_, i) => (
      <rect key={i} x={45} y={3} width={10} height={16} fill="#FFFFFF" transform={`rotate(${i * 45} 50 50)`} />
    ))}
    <circle cx={50} cy={50} r={32} fill="#FFFFFF" />
    <circle cx={50} cy={50} r={28} fill={color} />
    <text x={50} y={51} textAnchor="middle" dominantBaseline="central" fontFamily={theme.fonts.display} fontWeight={800} fontSize={22} fill="#FFFFFF">{label}</text>
  </svg>
);

export const Car: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size * 0.6} viewBox="0 0 100 60" style={{ display: "block" }}>
    <path d="M10 40 L16 24 Q19 18 26 18 H64 Q70 18 75 24 L84 34 Q94 36 94 44 V48 H6 V44 Q6 40 10 40 Z" fill={color} />
    <path d="M24 24 H44 V34 H18 Z M50 24 H66 L74 34 H50 Z" fill="rgba(5,10,31,0.6)" />
    <circle cx={26} cy={48} r={8} fill="#111827" stroke="#E5E7EB" strokeWidth={3} />
    <circle cx={74} cy={48} r={8} fill="#111827" stroke="#E5E7EB" strokeWidth={3} />
  </svg>
);

export const Star: React.FC<{ size: number; color?: string; fill?: number }> = ({ size, color = C.yellow, fill = 1 }) => {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const a = (Math.PI / 5) * i - Math.PI / 2;
    const rr = i % 2 ? 20 : 46;
    return `${50 + Math.cos(a) * rr},${50 + Math.sin(a) * rr}`;
  }).join(" ");
  const id = `st${Math.round(fill * 100)}`;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block" }}>
      <defs>
        <linearGradient id={id}>
          <stop offset={fill} stopColor={color} />
          <stop offset={fill} stopColor={alpha(color, 0.18)} />
        </linearGradient>
      </defs>
      <polygon points={pts} fill={`url(#${id})`} stroke={color} strokeWidth={3} strokeLinejoin="round" />
    </svg>
  );
};

// ---- coin data: mulberry32(222211); cumulative heads after n flips (10 → 7, 100 → 54, 1,000 → 508, 10,000 → 5,010)
const mul = (a: number) => () => {
  a |= 0;
  a = (a + 0x6d2b79f5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
export const RUN: { n: number; p: number }[] = (() => {
  const r = mul(222211);
  let h = 0;
  const out: { n: number; p: number }[] = [];
  let next = 1;
  for (let i = 1; i <= 10000; i++) {
    if (r() < 0.5) h++;
    if (i >= next) {
      out.push({ n: i, p: (h / i) * 100 });
      next = Math.max(i + 1, Math.round(i * 1.04));
    }
  }
  if (out[out.length - 1].n !== 10000) out.push({ n: 10000, p: (h / 10000) * 100 });
  return out;
})();

// convergence graph: x = log10(n) 0..4, y = % heads; `upTo` = log10 of the last n drawn
export const RunGraph: React.FC<{ x: number; y: number; w: number; h: number; upTo: number; ymin?: number; ymax?: number }> = ({ x, y, w, h, upTo, ymin = 20, ymax = 80 }) => {
  const X = (n: number) => x + (Math.log10(n) / 4) * w;
  const Y = (p: number) => y + h - ((Math.min(ymax, Math.max(ymin, p)) - ymin) / (ymax - ymin)) * h;
  const pts = RUN.filter((d) => Math.log10(d.n) <= upTo + 1e-9);
  return (
    <g>
      <line x1={x} y1={y + h} x2={x + w} y2={y + h} stroke={alpha(C.text, 0.5)} strokeWidth={3} />
      <line x1={x} y1={y} x2={x} y2={y + h} stroke={alpha(C.text, 0.5)} strokeWidth={3} />
      <line x1={x} y1={Y(50)} x2={x + w} y2={Y(50)} stroke={C.green} strokeWidth={4} strokeDasharray="14 12" />
      {[1, 10, 100, 1000, 10000].map((n) => (
        <text key={n} x={X(n)} y={y + h + 40} textAnchor="middle" fontFamily={theme.fonts.body} fontWeight={700} fontSize={26} fill={C.dim}>
          {n.toLocaleString("en-IN")}
        </text>
      ))}
      {[30, 50, 70].map((p) => (
        <text key={p} x={x - 16} y={Y(p)} textAnchor="end" dominantBaseline="central" fontFamily={theme.fonts.body} fontWeight={700} fontSize={26} fill={p === 50 ? C.green : C.dim}>
          {p}%
        </text>
      ))}
      {pts.length > 1 ? <polyline points={pts.map((d) => `${X(d.n)},${Y(d.p)}`).join(" ")} fill="none" stroke={C.cyan} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 8px ${C.cyan})` }} /> : null}
    </g>
  );
};
export const graphX = (x: number, w: number, n: number) => x + (Math.log10(n) / 4) * w;
export const graphY = (y: number, h: number, p: number, ymin = 20, ymax = 80) => y + h - ((p - ymin) / (ymax - ymin)) * h;
export const lerpLog = (t: number, a: number, b: number) => interpolate(t, [0, 1], [a, b], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
