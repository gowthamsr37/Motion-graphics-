// 100 Days of Machine Learning kit: the ML-series cover palette (deep plum, so ML covers never look like the navy
// statistics covers), a layered neural-network graphic with travelling pulses, a roadmap row, and small icons.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { ease, useSpr } from "./Motion";
import { alpha, glowText, theme } from "../theme";

const C = theme.colors;

// ML-series cover colours (videos keep the house navy; covers use these)
export const ML = {
  bg: "#12051F",
  bg2: "#240A3D",
  glowA: "#D946EF", // magenta
  glowB: "#F97316", // orange
  ink: "#FDF4FF",
};

// ---------- neural network ----------
const LAYERS = [3, 5, 5, 2];
export const NeuralNet: React.FC<{ x: number; y: number; w: number; h: number; at: number; colors?: string[]; pulse?: boolean; scale?: number }> = ({ x, y, w, h, at, colors = [C.cyan, C.violet, C.violet, C.orange], pulse = true }) => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const pos = LAYERS.map((n, li) =>
    Array.from({ length: n }, (_, k) => ({ x: x - w / 2 + (li / (LAYERS.length - 1)) * w, y: y - ((n - 1) / 2) * (h / 4.4) + k * (h / 4.4) })),
  );
  const edges: { a: { x: number; y: number }; b: { x: number; y: number }; li: number; k: number }[] = [];
  pos.slice(0, -1).forEach((layer, li) => layer.forEach((a, ai) => pos[li + 1].forEach((b, bi) => edges.push({ a, b, li, k: ai * 7 + bi }))));
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }}>
      {edges.map((e, i) => {
        const p = ease(frame, [at + 6 + e.li * 8, at + 18 + e.li * 8], [0, 1]);
        if (p <= 0) return null;
        const xe = e.a.x + (e.b.x - e.a.x) * p;
        const ye = e.a.y + (e.b.y - e.a.y) * p;
        const t = ((frame - at) / 34 + e.k * 0.137) % 1;
        return (
          <g key={i}>
            <line x1={e.a.x} y1={e.a.y} x2={xe} y2={ye} stroke={alpha(C.text, 0.18)} strokeWidth={2.5} />
            {pulse && p >= 1 && frame > at + 40 ? <circle cx={e.a.x + (e.b.x - e.a.x) * t} cy={e.a.y + (e.b.y - e.a.y) * t} r={4} fill={colors[e.li + 1]} opacity={0.85} /> : null}
          </g>
        );
      })}
      {pos.map((layer, li) =>
        layer.map((n, k) => {
          const p = spr(at + li * 8 + k * 2, theme.spring.pop);
          if (p <= 0.01) return null;
          const glow = 0.5 + 0.5 * Math.sin((frame - at) / 9 + li + k);
          return (
            <g key={`${li}${k}`} transform={`translate(${n.x} ${n.y}) scale(${Math.min(1.15, p)})`}>
              <circle r={22} fill={alpha(colors[li], 0.28 + 0.15 * glow)} stroke={colors[li]} strokeWidth={5} />
              <circle r={7} fill={colors[li]} />
            </g>
          );
        }),
      )}
    </svg>
  );
};

// ---------- roadmap row ----------
export const RoadRow: React.FC<{ y: number; days: string; name: string; topics: string; c: string; at: number; next: number; h?: number }> = ({ y, days, name, topics, c, at, next, h = 156 }) => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const ghost = ease(frame, [4, 14], [0, 1]);
  const p = spr(at - 6, theme.spring.bouncy);
  const hot = frame >= at - 4 && frame < next;
  return (
    <>
      <div style={{ position: "absolute", left: 90, top: y - h / 2, width: 900, height: h, boxSizing: "border-box", borderRadius: 28, background: p > 0.01 ? `linear-gradient(90deg, ${alpha(c, hot ? 0.26 : 0.14)}, rgba(14,24,64,0.92) 62%)` : "transparent", border: p > 0.01 ? `3px solid ${hot ? c : alpha(c, 0.55)}` : `3px dashed ${alpha(C.text, 0.18)}`, boxShadow: hot ? `0 0 30px ${alpha(c, 0.4)}` : "none", opacity: Math.max(ghost * 0.6, Math.min(1, p * 2)), transform: `translateX(${(1 - Math.min(1, p)) * -40}px) scale(${hot ? 1.02 : 1})` }} />
      {p > 0.01 ? (
        <>
          <div style={{ position: "absolute", left: 122, top: y, transform: "translateY(-50%)", opacity: Math.min(1, p * 2), width: 190, textAlign: "center", padding: "10px 0", borderRadius: 16, background: alpha(c, 0.22), border: `2px solid ${c}`, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 26, color: C.text, whiteSpace: "nowrap" }}>
            <div style={{ fontFamily: theme.fonts.body, fontSize: 15, letterSpacing: "0.2em", color: c }}>DAYS</div>
            {days}
          </div>
          <div style={{ position: "absolute", left: 340, top: y - 34, transform: "translateY(-50%)", opacity: Math.min(1, p * 2), fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text, textShadow: hot ? glowText(c, 0.5) : undefined, whiteSpace: "nowrap" }}>{name}</div>
          <div style={{ position: "absolute", left: 340, top: y + 24, width: 620, transform: "translateY(-50%)", opacity: Math.min(1, p * 2), fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 25, lineHeight: 1.25, color: C.dim }}>{topics}</div>
        </>
      ) : null}
    </>
  );
};

// ---------- icons ----------
export const Envelope: React.FC<{ w: number; color: string }> = ({ w, color }) => (
  <svg width={w} height={w * 0.7} viewBox="0 0 100 70" style={{ display: "block", overflow: "visible" }}>
    <rect x={3} y={3} width={94} height={64} rx={8} fill={alpha(color, 0.22)} stroke={color} strokeWidth={4} />
    <path d="M5 8 L50 40 L95 8" fill="none" stroke={color} strokeWidth={4} strokeLinejoin="round" />
  </svg>
);

export const ImageIcon: React.FC<{ w: number; color: string }> = ({ w, color }) => (
  <svg width={w} height={w * 0.8} viewBox="0 0 100 80" style={{ display: "block", overflow: "visible" }}>
    <rect x={3} y={3} width={94} height={74} rx={10} fill={alpha(color, 0.18)} stroke={color} strokeWidth={4} />
    <circle cx={30} cy={26} r={8} fill={color} />
    <path d="M8 70 L38 40 L56 56 L70 44 L92 70 Z" fill={alpha(color, 0.5)} stroke={color} strokeWidth={3} strokeLinejoin="round" />
  </svg>
);

export const UserIcon: React.FC<{ w: number; color: string }> = ({ w, color }) => (
  <svg width={w} height={w} viewBox="0 0 100 100" style={{ display: "block", overflow: "visible" }}>
    <circle cx={50} cy={34} r={18} fill={alpha(color, 0.25)} stroke={color} strokeWidth={5} />
    <path d="M16 90 C18 64 34 56 50 56 C66 56 82 64 84 90 Z" fill={alpha(color, 0.25)} stroke={color} strokeWidth={5} strokeLinejoin="round" />
    <path d="M70 18 L92 40 M92 18 L70 40" stroke={C.red} strokeWidth={6} strokeLinecap="round" />
  </svg>
);

export const BellIcon: React.FC<{ size: number; color: string; ring?: number }> = ({ size, color, ring = 0 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block", overflow: "visible", transform: `rotate(${Math.sin(ring * Math.PI * 6) * 14 * (1 - ring)}deg)`, transformOrigin: "50% 10%", filter: `drop-shadow(0 0 14px ${alpha(color, 0.6)})` }}>
    <path d="M50 10 C30 10 22 28 22 46 L22 64 L12 76 L88 76 L78 64 L78 46 C78 28 70 10 50 10 Z" fill={alpha(color, 0.3)} stroke={color} strokeWidth={6} strokeLinejoin="round" />
    <path d="M40 84 C42 92 58 92 60 84" fill="none" stroke={color} strokeWidth={6} strokeLinecap="round" />
  </svg>
);

export const Chip: React.FC<{ t: string; c: string; p: number; size?: number }> = ({ t, c, p, size = 26 }) =>
  p > 0.001 ? (
    <div style={{ opacity: Math.min(1, p * 2), transform: `scale(${interpolate(Math.min(1, p), [0, 1], [0.6, 1])})`, padding: "10px 22px", borderRadius: 999, background: alpha(c, 0.18), border: `2px solid ${c}`, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: size, letterSpacing: "0.1em", color: C.text, whiteSpace: "nowrap" }}>{t}</div>
  ) : null;
