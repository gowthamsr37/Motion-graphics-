// Props for probability videos, flat SVG in theme colours: Die (pips 1–6), Coin (H / T), weather glyphs, Battery.
import React from "react";
import { alpha, theme } from "../theme";

const C = theme.colors;
const PIPS: Record<number, [number, number][]> = {
  1: [[50, 50]],
  2: [[28, 28], [72, 72]],
  3: [[26, 26], [50, 50], [74, 74]],
  4: [[28, 28], [72, 28], [28, 72], [72, 72]],
  5: [[26, 26], [74, 26], [50, 50], [26, 74], [74, 74]],
  6: [[28, 24], [72, 24], [28, 50], [72, 50], [28, 76], [72, 76]],
};

export const Die: React.FC<{ value: number; size: number; color?: string; glow?: number; pip?: string }> = ({ value, size, color = C.cyan, glow = 0, pip }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block", overflow: "visible", filter: glow > 0 ? `drop-shadow(0 0 ${12 * glow}px ${alpha(color, 0.8)})` : undefined }}>
    <rect x={4} y={4} width={92} height={92} rx={22} fill="#EEF4FF" stroke={color} strokeWidth={6} />
    <rect x={10} y={10} width={80} height={36} rx={16} fill="#FFFFFF" opacity={0.5} />
    {(PIPS[Math.max(1, Math.min(6, Math.round(value)))] ?? []).map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r={9} fill={pip ?? C.ink} />
    ))}
  </svg>
);

// a coin seen face-on; squash (0..1) fakes the flip (scaleX = cos)
export const Coin: React.FC<{ side: "H" | "T"; size: number; squash?: number }> = ({ side, size, squash = 1 }) => {
  const col = side === "H" ? C.cyan : C.violet;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block", overflow: "visible", transform: `scaleX(${Math.max(0.06, Math.abs(squash))})`, filter: `drop-shadow(0 0 10px ${alpha(col, 0.6)})` }}>
      <circle cx={50} cy={50} r={46} fill={alpha(col, 0.3)} stroke={col} strokeWidth={6} />
      <circle cx={50} cy={50} r={36} fill="none" stroke={alpha(col, 0.6)} strokeWidth={3} strokeDasharray="4 5" />
      <text x={50} y={51} textAnchor="middle" dominantBaseline="central" fontFamily={theme.fonts.display} fontWeight={800} fontSize={44} fill="#F3F7FF">
        {side}
      </text>
    </svg>
  );
};

export const SunGlyph: React.FC<{ size: number; color?: string }> = ({ size, color = C.orange }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block", overflow: "visible", filter: `drop-shadow(0 0 8px ${alpha(color, 0.7)})` }}>
    <circle cx={50} cy={50} r={20} fill={color} />
    {Array.from({ length: 8 }, (_, i) => {
      const a = (i / 8) * Math.PI * 2;
      return <line key={i} x1={50 + Math.cos(a) * 30} y1={50 + Math.sin(a) * 30} x2={50 + Math.cos(a) * 42} y2={50 + Math.sin(a) * 42} stroke={color} strokeWidth={7} strokeLinecap="round" />;
    })}
  </svg>
);

export const CloudGlyph: React.FC<{ size: number; color?: string; rain?: boolean }> = ({ size, color = C.violet, rain }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block", overflow: "visible", filter: `drop-shadow(0 0 8px ${alpha(color, 0.6)})` }}>
    <path d="M26 64 Q10 64 12 50 Q14 38 28 40 Q32 22 50 24 Q66 24 70 40 Q88 38 88 52 Q88 64 74 64 Z" fill={alpha(color, 0.35)} stroke={color} strokeWidth={6} strokeLinejoin="round" />
    {rain
      ? [30, 50, 70].map((x, i) => <line key={i} x1={x} y1={74} x2={x - 6} y2={90} stroke={C.cyan} strokeWidth={6} strokeLinecap="round" />)
      : null}
  </svg>
);

export const BatteryGlyph: React.FC<{ size: number; color?: string; level?: number }> = ({ size, color = C.green, level = 0.7 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block", overflow: "visible", filter: `drop-shadow(0 0 8px ${alpha(color, 0.6)})` }}>
    <rect x={8} y={28} width={76} height={44} rx={10} fill="none" stroke={color} strokeWidth={6} />
    <rect x={86} y={40} width={8} height={20} rx={3} fill={color} />
    <rect x={16} y={36} width={60 * level} height={28} rx={5} fill={color} />
  </svg>
);

// a tiny bar chart (heights 0..1) drawn in its own box
export const MiniBars: React.FC<{ w: number; h: number; vals: number[]; color: string; hi?: number[]; hiColor?: string; p?: number }> = ({ w, h, vals, color, hi = [], hiColor = C.orange, p = 1 }) => {
  const n = vals.length;
  const bw = w / n;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: "block", overflow: "visible" }}>
      {vals.map((v, i) => (
        <rect key={i} x={i * bw + bw * 0.12} y={h - v * h * p} width={bw * 0.76} height={v * h * p} rx={Math.min(6, bw * 0.2)} fill={alpha(hi.includes(i) ? hiColor : color, 0.6)} stroke={hi.includes(i) ? hiColor : color} strokeWidth={2.5} />
      ))}
      <line x1={-4} y1={h + 1.5} x2={w + 4} y2={h + 1.5} stroke={alpha("#F3F7FF", 0.4)} strokeWidth={3} />
    </svg>
  );
};
