// Small pieces specific to the Outliers video: Indian number formatting, scene titles, café lamps, fences,
// glyphs for the "real but rare" examples and the stamp.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Rupee } from "./Icons";
import { ease, useSpr } from "./Motion";
import { Pill } from "./Nodes";
import { alpha, glowText, theme } from "../theme";

const C = theme.colors;

// 10036000 → "1,00,36,000" (Indian digit grouping: last three, then pairs)
export const inr = (n: number) => {
  const s = Math.round(n).toString();
  if (s.length <= 3) return s;
  const last3 = s.slice(-3);
  const rest = s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return `${rest},${last3}`;
};

// ₹ amount in mono, rupee drawn as SVG (the font subsets have no ₹)
export const Money: React.FC<{ v: number | string; size: number; color?: string; weight?: number }> = ({ v, size, color = C.text, weight = 800 }) => (
  <span style={{ display: "inline-flex", alignItems: "center", fontFamily: theme.fonts.mono, fontWeight: weight, fontSize: size, color, whiteSpace: "nowrap", letterSpacing: "-0.02em" }}>
    <Rupee size={size * 0.92} color={color} />
    {typeof v === "number" ? inr(v) : v}
  </span>
);

// Small-caps scene label with an optional pill under it (sits in the header band, 240–480)
export const SceneTitle: React.FC<{ label: string; pill?: string; color: string; at: number; pillAt?: number }> = ({ label, pill, color, at, pillAt }) => {
  const spr = useSpr();
  const a = spr(at, theme.spring.smooth);
  const b = spr(pillAt ?? at + 6, theme.spring.bouncy);
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 282, textAlign: "center", transform: `translateY(-50%) translateY(${(1 - a) * 20}px)`, opacity: Math.min(1, a * 1.5), fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 26, letterSpacing: "0.24em", color: C.dim, whiteSpace: "nowrap" }}>
        {label}
      </div>
      {pill && b > 0.001 ? (
        <div style={{ position: "absolute", left: 540, top: 372, transform: `translate(-50%, -50%) scale(${interpolate(b, [0, 1], [0.5, 1])})`, opacity: Math.min(1, b * 2) }}>
          <Pill label={pill} color={color} size={38} glow={0.6} />
        </div>
      ) : null}
    </>
  );
};

// Hanging café pendant lamp
export const Lamp: React.FC<{ x: number; top: number; len: number; p: number; glow: number }> = ({ x, top, len, p, glow }) => (
  <svg width={120} height={len + 80} viewBox={`-60 0 120 ${len + 80}`} style={{ position: "absolute", left: x - 60, top, overflow: "visible", opacity: p }}>
    <line x1={0} y1={0} x2={0} y2={len * p} stroke={alpha(C.text, 0.35)} strokeWidth={3} />
    <g transform={`translate(0 ${len * p})`}>
      <path d="M-34 34 C-34 8 -18 0 0 0 C18 0 34 8 34 34 Z" fill="#2B3A86" stroke={alpha(C.yellow, 0.5)} strokeWidth={2} />
      <ellipse cx={0} cy={36} rx={14} ry={7} fill={C.yellow} opacity={0.6 + glow * 0.4} />
      <ellipse cx={0} cy={60} rx={70} ry={40} fill={alpha(C.yellow, 0.1 * glow)} />
    </g>
  </svg>
);

// Picket fence marker (for the IQR fence rule): dashed post from y0 to y1, pickets on top, value label above them
export const Fence: React.FC<{ x: number; y0: number; y1: number; p: number; color: string; label: string }> = ({ x, y0, y1, p, color, label }) => {
  if (p <= 0.001) return null;
  return (
    <>
      <div style={{ position: "absolute", left: x - 2, top: y0, height: (y1 - y0) * p, borderLeft: `4px dashed ${alpha(color, 0.85)}` }} />
      <svg width={64} height={70} viewBox="0 0 64 70" style={{ position: "absolute", left: x - 32, top: y0 - 70, opacity: p, transform: `scale(${interpolate(p, [0, 1], [0.4, 1])})`, transformOrigin: "50% 100%", overflow: "visible", filter: `drop-shadow(0 0 8px ${alpha(color, 0.6)})` }}>
        {[6, 26, 46].map((px) => (
          <path key={px} d={`M${px} 70 L${px} 16 L${px + 6} 6 L${px + 12} 16 L${px + 12} 70 Z`} fill={alpha(color, 0.9)} />
        ))}
        <rect x={0} y={30} width={64} height={7} rx={2} fill={color} />
        <rect x={0} y={52} width={64} height={7} rx={2} fill={color} />
      </svg>
      <div style={{ position: "absolute", left: x, top: y0 - 98, transform: "translate(-50%, -50%)", opacity: p, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 32, color, textShadow: glowText(color, 0.4) }}>{label}</div>
    </>
  );
};

// A rubber stamp that slams in, rotated
export const Stamp: React.FC<{ at: number; x: number; y: number; color: string; children: React.ReactNode; rot?: number; size?: number }> = ({ at, x, y, color, children, rot = -6, size = 40 }) => {
  const frame = useCurrentFrame();
  const p = ease(frame, [at, at + 7], [0, 1], theme.ease.in);
  if (frame < at) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${interpolate(p, [0, 1], [2.2, 1])})`, opacity: Math.min(1, p * 1.6), padding: "10px 26px", borderRadius: 14, border: `5px solid ${color}`, background: alpha("#060B2A", 0.82), fontFamily: theme.fonts.display, fontWeight: 800, fontSize: size, letterSpacing: "0.04em", color, whiteSpace: "nowrap", boxShadow: `0 0 30px ${alpha(color, 0.35)}`, zIndex: 20 }}>
      {children}
    </div>
  );
};

type G = { size: number; color: string };
export const SpikeGlyph: React.FC<G> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block", overflow: "visible" }}>
    {[14, 30, 46, 78].map((x, i) => (
      <rect key={x} x={x} y={[70, 64, 72, 66][i]} width={12} height={100 - [70, 64, 72, 66][i] - 6} rx={3} fill={alpha(color, 0.55)} />
    ))}
    <rect x={62} y={12} width={12} height={82} rx={3} fill={color} />
  </svg>
);
export const CardGlyph: React.FC<G> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block", overflow: "visible" }}>
    <rect x={6} y={22} width={80} height={54} rx={9} fill="none" stroke={color} strokeWidth={7} />
    <rect x={6} y={34} width={80} height={10} fill={color} />
    <rect x={18} y={56} width={24} height={7} rx={3} fill={color} />
  </svg>
);
export const TrashGlyph: React.FC<G> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block", overflow: "visible" }}>
    <rect x={18} y={20} width={64} height={9} rx={4} fill={color} />
    <rect x={40} y={10} width={20} height={10} rx={3} fill={color} />
    <path d="M24 34 L30 90 L70 90 L76 34 Z" fill="none" stroke={color} strokeWidth={7} strokeLinejoin="round" />
    {[40, 50, 60].map((x) => (
      <line key={x} x1={x} y1={44} x2={x} y2={80} stroke={color} strokeWidth={5} strokeLinecap="round" />
    ))}
  </svg>
);
export const FormGlyph: React.FC<G> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block", overflow: "visible" }}>
    <rect x={16} y={8} width={68} height={84} rx={9} fill="none" stroke={color} strokeWidth={7} />
    {[30, 48, 66].map((y) => (
      <line key={y} x1={30} y1={y} x2={70} y2={y} stroke={color} strokeWidth={6} strokeLinecap="round" />
    ))}
  </svg>
);
export const TrendGlyph: React.FC<G> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block", overflow: "visible" }}>
    <path d="M10 86 L90 18" stroke={color} strokeWidth={8} strokeLinecap="round" />
    {[
      [20, 74],
      [38, 64],
      [56, 46],
      [74, 36],
    ].map(([x, y]) => (
      <circle key={x} cx={x} cy={y} r={7} fill={color} />
    ))}
  </svg>
);
export const BarsGlyph: React.FC<G> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block", overflow: "visible" }}>
    {[10, 30, 50, 70].map((x, i) => (
      <rect key={x} x={x} y={i === 3 ? 8 : 80} width={16} height={i === 3 ? 84 : 12} rx={3} fill={color} />
    ))}
  </svg>
);
