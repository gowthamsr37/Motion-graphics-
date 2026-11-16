import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { CLAMP } from "./Motion";

// Deterministic pseudo-random, so every render of a frame is identical.
export const rng = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

// Fine scratches and scuffs — the board has been out in the weather for a century.
export const Scratches: React.FC<{ w: number; h: number; seed: number; count?: number; opacity?: number }> = ({ w, h, seed, count = 40, opacity = 0.09 }) => {
  const lines = useMemo(() => {
    const r = rng(seed);
    return Array.from({ length: count }).map(() => {
      const x = r() * w;
      const y = r() * h;
      const len = 12 + r() * 90;
      const a = (r() - 0.5) * 0.9 + (r() > 0.7 ? Math.PI / 2 : 0);
      return { x1: x, y1: y, x2: x + Math.cos(a) * len, y2: y + Math.sin(a) * len, wdt: 0.6 + r() * 1.2 };
    });
  }, [w, h, seed, count]);
  return (
    <svg width={w} height={h} style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity }}>
      {lines.map((l, i) => (
        <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={theme.colors.cream} strokeWidth={l.wdt} strokeLinecap="round" />
      ))}
    </svg>
  );
};

const WOOD = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='540' height='540'%3E%3Cfilter id='w'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.003 0.11' numOctaves='3' seed='11'/%3E%3CfeColorMatrix values='0 0 0 0 0.93 0 0 0 0 0.89 0 0 0 0 0.80 0 0 0 0.16 -0.02'/%3E%3C/filter%3E%3Crect width='540' height='540' filter='url(%23w)'/%3E%3C/svg%3E")`;

// Layer 1: the scoreboard face — painted green-black timber, plank seams, and stadium floodlights beyond.
export const Backdrop: React.FC<{ lights: number }> = ({ lights }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const drift = Math.sin(frame / 90) * 30;
  return (
    <AbsoluteFill style={{ background: theme.colors.board, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${theme.colors.boardGreen} 0%, ${theme.colors.board} 70%)` }} />
      <AbsoluteFill style={{ backgroundImage: WOOD, backgroundSize: "540px 540px", opacity: 0.9 }} />
      <AbsoluteFill
        style={{
          backgroundImage: `repeating-linear-gradient(180deg, transparent 0px, transparent 138px, ${theme.colors.black}66 138px, ${theme.colors.black}66 140px, ${theme.colors.seam} 140px, ${theme.colors.seam} 141px)`,
        }}
      />
      {/* floodlight glows beyond the board */}
      {[
        { x: -260 + drift, y: -420, c: theme.colors.amberGlow, o: 0.55 },
        { x: width - 520 - drift, y: -460, c: theme.colors.amberGlow, o: 0.45 },
        { x: width / 2 - 520, y: height - 700, c: theme.colors.greenGlow, o: 0.18 },
      ].map((g, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: g.x,
            top: g.y,
            width: 1040,
            height: 1040,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${g.c} 0%, transparent 60%)`,
            opacity: g.o * lights,
          }}
        />
      ))}
      <Scratches w={width} h={height} seed={3} count={70} opacity={0.06} />
    </AbsoluteFill>
  );
};

export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const noise = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        backgroundImage: noise,
        backgroundSize: "220px",
        backgroundPosition: `${(frame * 7) % 220}px ${(frame * 13) % 220}px`,
        opacity: 0.1,
        mixBlendMode: "overlay",
      }}
    />
  );
};

export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{ pointerEvents: "none", background: `radial-gradient(ellipse 85% 70% at 50% 45%, transparent 50%, ${theme.colors.shadow} 100%)` }}
  />
);

// Opening blackout with a scoreboard-light flicker, and the closing fade.
export const Blackout: React.FC<{ flickerEnd: number; fadeLength: number }> = ({ flickerEnd, fadeLength }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const flick = frame < flickerEnd ? [1, 1, 0.35, 0.9, 0.15, 0.6, 0.05, 0.25, 0][Math.min(8, Math.floor((frame / flickerEnd) * 9))] : 0;
  const fade = interpolate(frame, [durationInFrames - fadeLength, durationInFrames - 1], [0, 1], { easing: theme.ease.in, ...CLAMP });
  return <AbsoluteFill style={{ background: theme.colors.black, opacity: Math.max(flick, fade), pointerEvents: "none" }} />;
};
