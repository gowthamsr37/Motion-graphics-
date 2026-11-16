// Shared motion + typography primitives.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CLAMP, theme } from "../theme";

type SpringCfg = { damping: number; stiffness: number; mass: number };

export const useSpring = (delay: number, config: SpringCfg = theme.spring.smooth) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config });
};

// Exit progress 0→1 over `len` frames starting at `at` (fast, eased in).
export const useExit = (at: number | undefined, len = 9) => {
  const frame = useCurrentFrame();
  if (at === undefined) return 0;
  return interpolate(frame, [at, at + len], [0, 1], { easing: theme.ease.in, ...CLAMP });
};

// Premium entrance: opacity + rise + scale, with a faster exit.
export const Rise: React.FC<{
  delay: number;
  out?: number;
  dy?: number;
  scale?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
  config?: SpringCfg;
}> = ({ delay, out, dy = 36, scale = 0.94, style, children, config = theme.spring.smooth }) => {
  const p = useSpring(delay, config);
  const e = useExit(out);
  return (
    <div
      style={{
        opacity: p * (1 - e),
        transform: `translateY(${interpolate(p, [0, 1], [dy, 0]) - e * 26}px) scale(${interpolate(p, [0, 1], [scale, 1])})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// Headline: words stagger in. Words wrapped in *asterisks* get the accent colour.
export const Headline: React.FC<{
  text: string;
  delay: number;
  out?: number;
  size?: number;
  accent?: string;
  top: number;
  per?: number;
  lineHeight?: number;
  width?: number;
}> = ({ text, delay, out, size = 96, accent = theme.colors.orange, top, per = 3, lineHeight = 1.0, width = 940 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = useExit(out);
  const lines = text.split("\n");
  let k = 0;
  return (
    <div style={{ position: "absolute", top, left: (1080 - width) / 2, width, textAlign: "center", opacity: 1 - e, transform: `translateY(${-e * 30}px)` }}>
      {lines.map((ln, li) => (
        <div key={li} style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", columnGap: size * 0.24, lineHeight }}>
          {ln.split(" ").map((w, wi) => {
            const i = k++;
            const p = spring({ frame: frame - delay - i * per, fps, config: theme.spring.snappy });
            const hot = w.startsWith("*");
            const word = w.replace(/\*/g, "");
            return (
              <span
                key={wi}
                style={{
                  display: "inline-block",
                  fontFamily: theme.fonts.display,
                  fontWeight: 800,
                  fontSize: size,
                  letterSpacing: "0.01em",
                  color: hot ? accent : theme.colors.ink,
                  textShadow: hot ? `0 0 40px ${accent}66, 0 4px 24px rgba(0,0,0,0.55)` : "0 4px 24px rgba(0,0,0,0.6)",
                  opacity: p,
                  transform: `translateY(${interpolate(p, [0, 1], [size * 0.42, 0])}px) scale(${interpolate(p, [0, 1], [0.9, 1])})`,
                }}
              >
                {word}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

// Small mono pill: "HYPOTHETICAL", "EXAGGERATED FOR VISIBILITY"…
export const Tag: React.FC<{ children: React.ReactNode; color?: string; dashed?: boolean; size?: number; style?: React.CSSProperties }> = ({
  children,
  color = theme.colors.cyan,
  dashed = false,
  size = 22,
  style,
}) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      padding: `${size * 0.42}px ${size * 0.8}px`,
      borderRadius: 999,
      border: `2px ${dashed ? "dashed" : "solid"} ${color}`,
      background: "rgba(3, 7, 18, 0.66)",
      color,
      fontFamily: theme.fonts.mono,
      fontWeight: 700,
      fontSize: size,
      letterSpacing: "0.08em",
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {children}
  </div>
);

// Scientific notation with real superscripts (no reliance on font superscript glyphs).
export const Sci: React.FC<{ m: string; e: string; unit?: string }> = ({ m, e, unit }) => (
  <span style={{ whiteSpace: "nowrap" }}>
    {m} × 10<sup style={{ fontSize: "0.58em", verticalAlign: "0.85em", lineHeight: 0 }}>{e}</sup>
    {unit ? <span style={{ marginLeft: "0.3em" }}>{unit}</span> : null}
  </span>
);

// SVG arrow with draw-on progress.
export const Arrow: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  p?: number;
  color?: string;
  width?: number;
  head?: number;
  glow?: boolean;
  dashed?: boolean;
  opacity?: number;
}> = ({ x1, y1, x2, y2, p = 1, color = theme.colors.orange, width = 10, head = 30, glow = true, dashed = false, opacity = 1 }) => {
  if (p <= 0.001) return null;
  const ex = x1 + (x2 - x1) * p, ey = y1 + (y2 - y1) * p;
  const a = Math.atan2(ey - y1, ex - x1);
  const len = Math.hypot(ex - x1, ey - y1);
  const h = Math.min(head, len * 0.6);
  const bx = ex - Math.cos(a) * h * 0.8, by = ey - Math.sin(a) * h * 0.8;
  const pts = [
    [ex, ey],
    [ex - Math.cos(a - 0.5) * h, ey - Math.sin(a - 0.5) * h],
    [ex - Math.cos(a + 0.5) * h, ey - Math.sin(a + 0.5) * h],
  ]
    .map((q) => q.join(","))
    .join(" ");
  return (
    <g opacity={opacity} style={glow ? { filter: `drop-shadow(0 0 12px ${color})` } : undefined}>
      <line x1={x1} y1={y1} x2={bx} y2={by} stroke={color} strokeWidth={width} strokeLinecap="round" strokeDasharray={dashed ? `${width * 1.6} ${width * 1.4}` : undefined} />
      <polygon points={pts} fill={color} />
    </g>
  );
};

// ---------- finishing layers ----------
export const Grade: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill style={{ backgroundColor: "#0B2A5A", mixBlendMode: "soft-light", opacity: 0.2 }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.42) 0%, transparent 13%, transparent 62%, rgba(0,0,0,0.38) 82%, rgba(0,0,0,0.55) 100%)" }} />
  </AbsoluteFill>
);

export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const noise = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='240' height='240' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E")`;
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        backgroundImage: noise,
        backgroundSize: "240px",
        backgroundPosition: `${(frame * 37) % 240}px ${(frame * 71) % 240}px`,
        opacity: 0.07,
        mixBlendMode: "overlay",
      }}
    />
  );
};

export const Vignette: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none", background: "radial-gradient(ellipse 75% 62% at 50% 46%, transparent 55%, rgba(0,0,0,0.5) 100%)" }} />
);

// Rounded card frame for panels.
export const Card: React.FC<{ x: number; y: number; w: number; h: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ x, y, w, h, children, style }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      borderRadius: 22,
      overflow: "hidden",
      boxShadow: `0 30px 70px -20px rgba(0,0,0,0.75), inset 0 0 0 1.5px ${theme.colors.panelEdge}`,
      ...style,
    }}
  >
    {children}
  </div>
);
