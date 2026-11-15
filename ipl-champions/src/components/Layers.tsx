import React from "react";
import { AbsoluteFill, interpolate, interpolateColors, useCurrentFrame, useVideoConfig } from "remotion";
import { seasons } from "../data";
import { theme } from "../theme";
import { framesPerBar, sections } from "../timing";
import { CLAMP } from "./Motion";

type Tint = { start: number; a: string; b: string };

// Background tint follows the story: gold/indigo for intro & tally, team colors per season.
const tintSchedule = (fps: number): Tint[] => {
  const s = sections(fps);
  const bar = framesPerBar(fps);
  const neutral = { a: theme.colors.primary, b: theme.colors.accent };
  return [
    { start: s.intro.from, ...neutral },
    ...seasons.map((season, i) => ({
      start: s.seasons.from + i * bar,
      a: theme.teams[season.winner].color,
      b: theme.teams[season.winner].alt,
    })),
    { start: s.tally.from, ...neutral },
  ];
};

const useTint = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const keys = tintSchedule(fps);
  const lead = Math.round(fps / 8); // start shifting just before the cut
  let k = 0;
  while (k + 1 < keys.length && frame >= keys[k + 1].start - lead) k++;
  const prev = keys[Math.max(0, k - 1)];
  const cur = keys[k];
  const p = k === 0 ? 1 : interpolate(frame, [cur.start - lead, cur.start + fps / 3], [0, 1], { easing: theme.ease.inOut, ...CLAMP });
  return {
    a: interpolateColors(p, [0, 1], [prev.a, cur.a]),
    b: interpolateColors(p, [0, 1], [prev.b, cur.b]),
  };
};

// Layer 1: drifting gradient mesh + faint dot grid. Never a flat background.
export const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const { a, b } = useTint();
  const d1 = Math.sin(frame / 55) * 70;
  const d2 = Math.cos(frame / 70) * 60;
  const d3 = Math.sin(frame / 90) * 40;
  return (
    <AbsoluteFill style={{ background: theme.colors.bg, overflow: "hidden" }}>
      <AbsoluteFill
        style={{ background: `linear-gradient(180deg, ${theme.colors.bgAlt} 0%, ${theme.colors.bg} 70%)` }}
      />
      <div
        style={{
          position: "absolute",
          width: 1500,
          height: 1500,
          borderRadius: "50%",
          top: -720 + d3,
          left: -420 + d1,
          opacity: 0.34,
          background: `radial-gradient(circle, ${a} 0%, transparent 62%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1300,
          height: 1300,
          borderRadius: "50%",
          bottom: -700,
          right: -380 - d2,
          opacity: 0.3,
          background: `radial-gradient(circle, ${b} 0%, transparent 64%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          borderRadius: "50%",
          top: 120 - d3,
          right: 260 + d1 * 0.5,
          opacity: 0.12,
          background: `radial-gradient(circle, ${a} 0%, transparent 66%)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(${theme.colors.line} 1.4px, transparent 1.6px)`,
          backgroundSize: "36px 36px",
          backgroundPosition: `${frame * 0.2}px 0px`,
          opacity: 0.55,
          maskImage: "radial-gradient(ellipse at 50% 45%, black 20%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 45%, black 20%, transparent 75%)",
        }}
      />
    </AbsoluteFill>
  );
};

// Layer 4: color grade — unifies everything under one warm night look.
export const Grade: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill style={{ backgroundColor: theme.colors.primary, mixBlendMode: "soft-light", opacity: 0.12 }} />
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${theme.colors.shadow} 0%, transparent 12%, transparent 80%, ${theme.colors.shadow} 100%)`,
        opacity: 0.55,
      }}
    />
  </AbsoluteFill>
);

// Layer 5a: procedural film grain, no asset file.
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
        opacity: 0.09,
        mixBlendMode: "overlay",
      }}
    />
  );
};

// Layer 5b: vignette, topmost.
export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background: `radial-gradient(ellipse at center, transparent 58%, ${theme.colors.vignette} 100%)`,
    }}
  />
);

// Final fade to black over the last few frames.
export const FadeOut: React.FC<{ length: number }> = ({ length }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const o = interpolate(frame, [durationInFrames - length, durationInFrames - 1], [0, 1], { easing: theme.ease.in, ...CLAMP });
  return <AbsoluteFill style={{ background: theme.colors.black, opacity: o, pointerEvents: "none" }} />;
};
