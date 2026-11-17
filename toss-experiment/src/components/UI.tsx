// Brand primitives — League Gothic headlines, Oswald labels, cream on night navy, coin gold.
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CLAMP, theme } from "../theme";

type SpringCfg = { damping: number; stiffness: number; mass: number };
const C = theme.colors;

export const useSpring = (delay: number, config: SpringCfg = theme.spring.smooth) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config });
};

export const useExit = (at: number | undefined, len = 9) => {
  const frame = useCurrentFrame();
  if (at === undefined) return 0;
  return interpolate(frame, [at, at + len], [0, 1], { easing: theme.ease.in, ...CLAMP });
};

export const Rise: React.FC<{ delay: number; out?: number; dy?: number; scale?: number; style?: React.CSSProperties; children: React.ReactNode; config?: SpringCfg }> = ({
  delay,
  out,
  dy = 34,
  scale = 0.94,
  style,
  children,
  config = theme.spring.smooth,
}) => {
  const p = useSpring(delay, config);
  const e = useExit(out);
  if (p <= 0.001) return null;
  return (
    <div style={{ opacity: p * (1 - e), transform: `translateY(${interpolate(p, [0, 1], [dy, 0]) - e * 24}px) scale(${interpolate(p, [0, 1], [scale, 1])})`, ...style }}>{children}</div>
  );
};

// League Gothic headline; words wrapped in *asterisks* take the accent colour. Staggered by word.
export const Headline: React.FC<{ text: string; delay: number; out?: number; size?: number; top: number; accent?: string; per?: number; width?: number; align?: "center" | "left"; left?: number; lineHeight?: number }> = ({
  text,
  delay,
  out,
  size = 104,
  top,
  accent = C.gold,
  per = 3,
  width = 940,
  align = "center",
  left,
  lineHeight = 0.98,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = useExit(out);
  let k = 0;
  return (
    <div style={{ position: "absolute", top, left: left ?? (1080 - width) / 2, width, textAlign: align, opacity: 1 - e, transform: `translateY(${-e * 26}px)` }}>
      {text.split("\n").map((ln, li) => (
        <div key={li} style={{ display: "flex", justifyContent: align === "center" ? "center" : "flex-start", flexWrap: "wrap", columnGap: size * 0.2, lineHeight }}>
          {ln.split(" ").map((w, wi) => {
            const i = k++;
            const p = spring({ frame: frame - delay - i * per, fps, config: theme.spring.snappy });
            const hot = w.startsWith("*");
            return (
              <span
                key={wi}
                style={{
                  display: "inline-block",
                  fontFamily: theme.fonts.display,
                  fontSize: size,
                  letterSpacing: "0.01em",
                  color: hot ? accent : C.cream,
                  textShadow: hot ? `0 0 34px ${accent}66, 0 4px 22px rgba(0,0,0,0.6)` : "0 4px 22px rgba(0,0,0,0.65)",
                  opacity: p,
                  transform: `translateY(${interpolate(p, [0, 1], [size * 0.4, 0])}px)`,
                }}
              >
                {w.replace(/\*/g, "")}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export const Kicker: React.FC<{ children: React.ReactNode; color?: string; size?: number; style?: React.CSSProperties }> = ({ children, color = C.gold, size = 26, style }) => (
  <div style={{ fontFamily: theme.fonts.body, fontWeight: 600, fontSize: size, letterSpacing: "0.26em", color, textTransform: "uppercase", ...style }}>{children}</div>
);

export const Tag: React.FC<{ children: React.ReactNode; color?: string; dashed?: boolean; size?: number; style?: React.CSSProperties }> = ({ children, color = C.cream, dashed, size = 20, style }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: `${size * 0.36}px ${size * 0.75}px`,
      borderRadius: 6,
      border: `1.5px ${dashed ? "dashed" : "solid"} ${color}`,
      background: "rgba(5, 8, 14, 0.7)",
      color,
      fontFamily: theme.fonts.body,
      fontWeight: 600,
      fontSize: size,
      letterSpacing: "0.16em",
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {children}
  </div>
);

export const Source: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ fontFamily: theme.fonts.body, fontWeight: 400, fontSize: 19, letterSpacing: "0.06em", color: C.creamDim, ...style }}>{children}</div>
);

// Genuine photograph with a slow Ken Burns move and an honest credit line.
export const Photo: React.FC<{
  src: string;
  x: number;
  y: number;
  w: number;
  h: number;
  from: number;
  dur: number;
  credit?: string;
  caption?: string;
  zoom?: [number, number];
  pan?: [number, number];
  focus?: string;
  style?: React.CSSProperties;
  radius?: number;
}> = ({ src, x, y, w, h, from, dur, credit, caption, zoom = [1.04, 1.14], pan = [0, -20], focus = "50% 50%", style, radius = 18 }) => {
  const frame = useCurrentFrame();
  const k = interpolate(frame, [from, from + dur], [0, 1], { ...CLAMP, easing: theme.ease.inOut });
  const sc = zoom[0] + (zoom[1] - zoom[0]) * k;
  const px = pan[0] + (pan[1] - pan[0]) * k;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, overflow: "hidden", borderRadius: radius, boxShadow: `0 30px 70px -24px rgba(0,0,0,0.8), inset 0 0 0 1.5px ${C.panelEdge}`, ...style }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: focus, transform: `scale(${sc}) translateX(${px}px)`, filter: "saturate(1.05) contrast(1.04)" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 58%, rgba(0,0,0,0.72) 100%)" }} />
      {caption ? (
        <div style={{ position: "absolute", left: 22, bottom: credit ? 46 : 20, right: 22, fontFamily: theme.fonts.body, fontWeight: 600, fontSize: 22, letterSpacing: "0.14em", color: C.cream }}>{caption}</div>
      ) : null}
      {credit ? <div style={{ position: "absolute", left: 22, bottom: 18, right: 22, fontFamily: theme.fonts.body, fontSize: 15, letterSpacing: "0.04em", color: C.creamDim }}>{credit}</div> : null}
    </div>
  );
};

export const Grade: React.FC<{ warm?: number }> = ({ warm = 0 }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill style={{ backgroundColor: warm > 0 ? "#3a2408" : "#0b1a33", mixBlendMode: "soft-light", opacity: 0.22 + Math.abs(warm) * 0.1 }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, transparent 15%, transparent 62%, rgba(0,0,0,0.42) 80%, rgba(0,0,0,0.6) 100%)" }} />
  </AbsoluteFill>
);

export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const noise = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='240' height='240' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E")`;
  return <AbsoluteFill style={{ pointerEvents: "none", backgroundImage: noise, backgroundSize: "240px", backgroundPosition: `${(frame * 37) % 240}px ${(frame * 71) % 240}px`, opacity: 0.075, mixBlendMode: "overlay" }} />;
};

export const Vignette: React.FC<{ k?: number }> = ({ k = 0.55 }) => (
  <AbsoluteFill style={{ pointerEvents: "none", background: `radial-gradient(ellipse 78% 64% at 50% 46%, transparent 52%, rgba(0,0,0,${k}) 100%)` }} />
);

// Flash/cut helper for hard transitions.
export const Flash: React.FC<{ at: number; color?: string; len?: number; peak?: number }> = ({ at, color = "#fff6e0", len = 7, peak = 0.7 }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame - at, [-1, 0, len], [0, peak, 0], CLAMP);
  if (o <= 0) return null;
  return <AbsoluteFill style={{ background: color, opacity: o, pointerEvents: "none" }} />;
};
