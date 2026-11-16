// Kinetic type: slams, rises, staggered words, counters, labels.
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CLAMP, theme } from "../theme";

const C = theme.colors;

type Common = { at: number; out?: number; style?: React.CSSProperties; children: React.ReactNode };

// exit helper: fast (8 frames) fade + lift + blur
export const useExit = (out?: number) => {
  const frame = useCurrentFrame();
  if (out === undefined) return { o: 1, y: 0, b: 0 };
  const u = interpolate(frame, [out, out + 8], [0, 1], { easing: theme.ease.in, ...CLAMP });
  return { o: 1 - u, y: -36 * u, b: 8 * u };
};

// Big hit: drops in from 1.7× with blur, settles with a slam spring.
export const Slam: React.FC<Common> = ({ at, out, style, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: theme.spring.slam });
  const o = interpolate(frame, [at, at + 4], [0, 1], CLAMP);
  const x = useExit(out);
  const s = interpolate(p, [0, 1], [1.7, 1]);
  const blur = interpolate(p, [0, 0.7], [14, 0], CLAMP) + x.b;
  if (frame < at) return null;
  return <div style={{ opacity: o * x.o, transform: `translateY(${x.y}px) scale(${s})`, filter: blur > 0.3 ? `blur(${blur}px)` : undefined, ...style }}>{children}</div>;
};

// Workhorse entrance: fade + rise + scale.
export const Rise: React.FC<Common & { dist?: number }> = ({ at, out, style, children, dist = 48 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: theme.spring.smooth });
  const x = useExit(out);
  if (frame < at) return null;
  return (
    <div style={{ opacity: Math.min(1, p * 1.4) * x.o, transform: `translateY(${interpolate(p, [0, 1], [dist, 0]) + x.y}px) scale(${interpolate(p, [0, 1], [0.94, 1])})`, filter: x.b > 0.3 ? `blur(${x.b}px)` : undefined, ...style }}>
      {children}
    </div>
  );
};

// Staggered words, each popping up on its own.
export const Words: React.FC<{ text: string; at: number | number[]; out?: number; size: number; color?: string; per?: number; accent?: Record<string, string>; style?: React.CSSProperties; font?: "display" | "body"; weight?: number; gap?: number; lineHeight?: number }> = ({ text, at, out, size, color = C.ink, per = 3, accent = {}, style, font = "display", weight = 400, gap, lineHeight = 1.02 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const x = useExit(out);
  const words = text.split(" ");
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: gap ?? Math.round(size * 0.24), rowGap: 0, opacity: x.o, transform: `translateY(${x.y}px)`, filter: x.b > 0.3 ? `blur(${x.b}px)` : undefined, ...style }}>
      {words.map((w, i) => {
        const start = Array.isArray(at) ? at[Math.min(i, at.length - 1)] : at + i * per;
        const p = spring({ frame: frame - start, fps, config: theme.spring.snappy });
        const key = w.replace(/[^A-Za-z0-9?%]/g, "");
        return (
          <span key={i} style={{ display: "inline-block", fontFamily: theme.fonts[font], fontWeight: weight, fontSize: size, lineHeight, color: accent[key] ?? color, opacity: frame < start ? 0 : Math.min(1, p * 1.5), transform: `translateY(${interpolate(p, [0, 1], [size * 0.35, 0])}px) scale(${interpolate(p, [0, 1], [0.85, 1])})` }}>
            {w}
          </span>
        );
      })}
    </div>
  );
};

export const Label: React.FC<{ children: React.ReactNode; size?: number; color?: string; spacing?: string; weight?: number; style?: React.CSSProperties }> = ({ children, size = 26, color = C.inkDim, spacing = "0.18em", weight = 800, style }) => (
  <span style={{ fontFamily: theme.fonts.body, fontWeight: weight, fontSize: size, letterSpacing: spacing, color, textTransform: "uppercase", ...style }}>{children}</span>
);

export const Display: React.FC<{ children: React.ReactNode; size: number; color?: string; glow?: string; style?: React.CSSProperties }> = ({ children, size, color = C.ink, glow, style }) => (
  <span style={{ fontFamily: theme.fonts.display, fontSize: size, lineHeight: 1, color, textShadow: glow ? `0 0 50px ${glow}, 0 0 110px ${glow}` : `0 6px 30px ${C.shadow}`, fontVariantNumeric: "tabular-nums", ...style }}>{children}</span>
);

// eased number between two frames
export const count = (frame: number, from: number, to: number, target: number, start = 0) =>
  interpolate(frame, [from, to], [start, target], { easing: theme.ease.out, ...CLAMP });

export const Card: React.FC<{ style?: React.CSSProperties; children?: React.ReactNode; glow?: string; edge?: string }> = ({ style, children, glow, edge }) => (
  <div style={{ background: `linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.025))`, border: `2px solid ${edge ?? C.cardEdge}`, borderRadius: 28, boxShadow: glow ? `0 0 60px ${glow}, inset 0 0 40px rgba(255,255,255,0.03)` : `0 30px 60px -20px rgba(0,0,0,0.6)`, backdropFilter: "blur(6px)", ...style }}>
    {children}
  </div>
);
