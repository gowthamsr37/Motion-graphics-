// 2D building blocks. Every entrance is a spring on 2–3 properties; every exit is a faster eased curve.
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CLAMP, theme } from "../theme";

type Spring = { damping: number; stiffness: number; mass: number };

export const useTime = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
};

// Spring progress from time `a` (seconds), and a quick exit ending at `b`.
export const useWin = (a: number, b = Infinity, cfg: Spring = theme.spring.snappy, exitLen = 0.3) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const inP = spring({ frame: frame - Math.round(a * fps), fps, config: cfg });
  const outP = b === Infinity ? 0 : interpolate(t, [b - exitLen, b], [0, 1], { easing: theme.ease.in, ...CLAMP });
  return { t, inP, outP, vis: t >= a && t < b };
};

export const ease = (t: number, a: number, b: number, e = theme.ease.out) => interpolate(t, [a, b], [0, 1], { easing: e, ...CLAMP });

// Rise: fade + travel + settle, staggered by `delay`.
export const Rise: React.FC<{ a: number; b?: number; delay?: number; dy?: number; dx?: number; cfg?: Spring; style?: React.CSSProperties; children: React.ReactNode }> = ({ a, b = Infinity, delay = 0, dy = 34, dx = 0, cfg, style, children }) => {
  const { inP, outP, vis } = useWin(a + delay, b, cfg);
  if (!vis && outP >= 1) return null;
  if (inP <= 0.001) return null;
  return (
    <div
      style={{
        opacity: Math.min(1, inP * 1.8) * (1 - outP),
        transform: `translate(${(1 - inP) * dx}px, ${(1 - inP) * dy - outP * 18}px) scale(${0.965 + 0.035 * inP})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// Wipe: a line of type revealed by a mask sliding up, like a broadcast super.
export const Wipe: React.FC<{ a: number; b?: number; delay?: number; style?: React.CSSProperties; children: React.ReactNode }> = ({ a, b = Infinity, delay = 0, style, children }) => {
  const { inP, outP } = useWin(a + delay, b, theme.spring.smooth, 0.25);
  if (inP <= 0.001 || outP >= 1) return null;
  return (
    <div style={{ overflow: "hidden", paddingBottom: 6, ...style }}>
      <div style={{ transform: `translateY(${(1 - inP) * 105 - outP * 105}%)`, opacity: Math.min(1, inP * 3) }}>{children}</div>
    </div>
  );
};

export const shadow = "0 2px 18px rgba(0,0,0,0.65), 0 1px 3px rgba(0,0,0,0.8)";

export const Kicker: React.FC<{ children: React.ReactNode; color?: string; size?: number; style?: React.CSSProperties }> = ({ children, color = theme.colors.dim, size = 24, style }) => (
  <div style={{ fontFamily: theme.fonts.body, fontWeight: 600, fontSize: size, letterSpacing: "0.2em", textTransform: "uppercase", color, textShadow: shadow, ...style }}>{children}</div>
);

export const Display: React.FC<{ children: React.ReactNode; size: number; color?: string; weight?: number; style?: React.CSSProperties; glow?: boolean }> = ({ children, size, color = theme.colors.white, weight = 800, style, glow }) => (
  <div
    style={{
      fontFamily: theme.fonts.display,
      fontWeight: weight,
      fontSize: size,
      lineHeight: 0.92,
      letterSpacing: "-0.01em",
      color,
      fontVariantNumeric: "tabular-nums",
      textShadow: glow ? `0 0 40px ${theme.colors.goldGlow}, 0 0 90px rgba(246,188,69,0.25), ${shadow}` : shadow,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Note: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; size?: number }> = ({ children, style, size = 21 }) => (
  <div style={{ fontFamily: theme.fonts.body, fontWeight: 500, fontSize: size, lineHeight: 1.35, color: theme.colors.faint, letterSpacing: "0.02em", textShadow: shadow, ...style }}>{children}</div>
);

// A dark glass panel (no backdrop blur: it is expensive in headless rendering).
export const Panel: React.FC<{ style?: React.CSSProperties; children: React.ReactNode }> = ({ style, children }) => (
  <div
    style={{
      background: "linear-gradient(180deg, rgba(10,17,28,0.80), rgba(6,10,18,0.70))",
      border: `1.5px solid ${theme.colors.glassEdge}`,
      borderRadius: 26,
      boxShadow: "0 24px 60px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)",
      ...style,
    }}
  >
    {children}
  </div>
);

export const fmt = (v: number, d = 1) => v.toFixed(d);

// Horizontal bar on an honest 0–max scale, with optional reference tick.
export const HBar: React.FC<{ value: number; max: number; width: number; height?: number; color: string; fill: number; refAt?: number; refLabel?: string; track?: boolean }> = ({ value, max, width, height = 26, color, fill, refAt, refLabel, track = true }) => {
  const w = (Math.max(0, value) / max) * width * fill;
  return (
    <div style={{ position: "relative", width, height }}>
      {track && <div style={{ position: "absolute", inset: 0, borderRadius: height / 2, background: "rgba(246,242,232,0.10)", boxShadow: "inset 0 0 0 1px rgba(246,242,232,0.12)" }} />}
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: w, borderRadius: height / 2, background: `linear-gradient(90deg, ${color}cc, ${color})`, boxShadow: `0 0 24px ${color}55` }} />
      {refAt !== undefined && (
        <>
          <div style={{ position: "absolute", left: (refAt / max) * width - 1.5, top: -10, bottom: -10, width: 3, background: theme.colors.ice, boxShadow: `0 0 12px ${theme.colors.iceGlow}` }} />
          {refLabel && <div style={{ position: "absolute", left: (refAt / max) * width, top: height + 12, transform: "translateX(-50%)", fontFamily: theme.fonts.body, fontWeight: 600, fontSize: 19, letterSpacing: "0.14em", color: theme.colors.ice, whiteSpace: "nowrap", textShadow: shadow }}>{refLabel}</div>}
        </>
      )}
    </div>
  );
};

// Simple line icons drawn in theme colours (never emoji).
export const Icon: React.FC<{ kind: "moon" | "drop" | "sun" | "bat" | "ball" | "pitch" | "cloud" | "coin" | "trophy"; size?: number; color?: string }> = ({ kind, size = 34, color = theme.colors.white }) => {
  const sw = 2.2;
  const p = { fill: "none", stroke: color, strokeWidth: sw, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" style={{ flex: "none", filter: "drop-shadow(0 1px 4px rgba(0,0,0,0.6))" }}>
      {kind === "moon" && <path d="M21 5a11 11 0 1 0 6 15A9 9 0 0 1 21 5z" {...p} />}
      {kind === "drop" && <path d="M16 4c5 7 8 11 8 15a8 8 0 0 1-16 0c0-4 3-8 8-15z" {...p} />}
      {kind === "sun" && (
        <g {...p}>
          <circle cx="16" cy="16" r="6" />
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i / 8) * Math.PI * 2;
            return <line key={i} x1={16 + Math.cos(a) * 10} y1={16 + Math.sin(a) * 10} x2={16 + Math.cos(a) * 13.5} y2={16 + Math.sin(a) * 13.5} />;
          })}
        </g>
      )}
      {kind === "bat" && <path d="M22 4l6 6-12 12-4 1-3-3 1-4z M9 20l-5 5 3 3 5-5" {...p} />}
      {kind === "ball" && (
        <g {...p}>
          <circle cx="16" cy="16" r="11" />
          <path d="M9 8c4 5 4 11 0 16 M23 8c-4 5-4 11 0 16" />
        </g>
      )}
      {kind === "pitch" && <path d="M11 3h10l3 26H8z M9 9h14 M9 23h14" {...p} />}
      {kind === "cloud" && <path d="M9 24h15a5 5 0 0 0 0-10 7 7 0 0 0-13-2 6 6 0 0 0-2 12z" {...p} />}
      {kind === "coin" && (
        <g {...p}>
          <circle cx="16" cy="16" r="11" />
          <circle cx="16" cy="16" r="7" />
        </g>
      )}
      {kind === "trophy" && <path d="M10 5h12v6a6 6 0 0 1-12 0z M10 7H5a4 4 0 0 0 5 5 M22 7h5a4 4 0 0 1-5 5 M16 17v5 M11 27h10 M13 22h6v5h-6z" {...p} />}
    </svg>
  );
};
