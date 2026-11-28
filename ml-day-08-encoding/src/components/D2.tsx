// Day 2 layout helpers in the house look: Pop (anything that springs in at a frame and can leave), Txt (house text),
// Panel (house card with a coloured edge), Pill (tag), Fade (a group that fades out at a frame).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { ease, useSpr } from "./Motion";
import { alpha, glowText, theme } from "../theme";

const C = theme.colors;
export const T1 = C.cyan; // supervised
export const T2 = C.orange; // unsupervised
export const T3 = C.violet; // reinforcement

export const Pop: React.FC<{ x: number; y: number; at: number; out?: number; children: React.ReactNode; anchor?: "center" | "left"; rise?: number; style?: React.CSSProperties }> = ({ x, y, at, out, children, anchor = "center", rise = 24, style }) => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const p = spr(at, theme.spring.snappy);
  const e = out !== undefined ? ease(frame, [out, out + 8], [0, 1]) : 0;
  if (p <= 0.001 || e >= 0.999) return null;
  const k = Math.min(1, p);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(${anchor === "center" ? "-50%" : "0"}, -50%) translateY(${(1 - k) * rise}px) scale(${interpolate(k, [0, 1], [0.86, 1])})`, opacity: Math.min(1, p * 2) * (1 - e), ...style }}>
      {children}
    </div>
  );
};

export const Txt: React.FC<{ size?: number; color?: string; weight?: number; font?: "display" | "body" | "mono"; glow?: boolean; children: React.ReactNode; style?: React.CSSProperties }> = ({ size = 44, color = C.text, weight = 800, font = "display", glow, children, style }) => (
  <div style={{ fontFamily: theme.fonts[font], fontWeight: weight, fontSize: size, color, lineHeight: 1.1, whiteSpace: "nowrap", letterSpacing: font === "display" ? "-0.01em" : undefined, textShadow: glow ? glowText(color, 0.5) : "0 2px 10px rgba(0,0,0,0.5)", ...style }}>{children}</div>
);

export const Panel: React.FC<{ w: number; h: number; color: string; children?: React.ReactNode; style?: React.CSSProperties }> = ({ w, h, color, children, style }) => (
  <div style={{ width: w, height: h, boxSizing: "border-box", borderRadius: 26, background: `linear-gradient(180deg, ${alpha(color, 0.15)}, rgba(14,24,64,0.92))`, border: `3px solid ${alpha(color, 0.85)}`, boxShadow: `0 0 26px ${alpha(color, 0.25)}, 0 18px 40px -20px rgba(0,0,0,0.8)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, ...style }}>{children}</div>
);

export const Pill: React.FC<{ color: string; size?: number; children: React.ReactNode; solid?: boolean }> = ({ color, size = 30, children, solid }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: `${size * 0.3}px ${size * 0.8}px`, borderRadius: 999, background: solid ? color : alpha(color, 0.16), border: `3px solid ${color}`, boxShadow: `0 0 20px ${alpha(color, 0.4)}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: size, letterSpacing: "0.04em", color: solid ? C.ink : C.text, whiteSpace: "nowrap" }}>{children}</div>
);

export const Fade: React.FC<{ out: number; children: React.ReactNode; dur?: number }> = ({ out, children, dur = 10 }) => {
  const frame = useCurrentFrame();
  const e = ease(frame, [out, out + dur], [0, 1]);
  if (e >= 0.999) return null;
  return <AbsoluteFill style={{ opacity: 1 - e }}>{children}</AbsoluteFill>;
};

// an svg box that hosts a doodle at its centre
export const Icon: React.FC<{ size: number; children: React.ReactNode }> = ({ size, children }) => (
  <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: "visible", display: "block" }}>
    {children}
  </svg>
);
