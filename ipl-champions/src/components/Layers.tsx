import React from "react";
import { AbsoluteFill, interpolate, interpolateColors, useCurrentFrame, useVideoConfig } from "remotion";
import { seasons } from "../data";
import { theme } from "../theme";
import { seasonSlots, sections } from "../timing";
import { CLAMP } from "./Motion";

type Tint = { start: number; color: string };

// Background glow follows the story: scoreboard yellow for hook/tally/outro, the winner's color per season.
const tintSchedule = (fps: number): Tint[] => {
  const s = sections(fps);
  const slots = seasonSlots(fps);
  return [
    { start: s.hook.from, color: theme.colors.primary },
    ...seasons.map((season, i) => ({ start: s.seasons.from + slots[i].from, color: theme.teams[season.winner].color })),
    { start: s.tally.from, color: theme.colors.primary },
  ];
};

const useTint = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const keys = tintSchedule(fps);
  const lead = Math.round(fps / 8);
  let k = 0;
  while (k + 1 < keys.length && frame >= keys[k + 1].start - lead) k++;
  const prev = keys[Math.max(0, k - 1)];
  const cur = keys[k];
  const p = k === 0 ? 1 : interpolate(frame, [cur.start - lead, cur.start + fps / 3], [0, 1], { easing: theme.ease.inOut, ...CLAMP });
  return interpolateColors(p, [0, 1], [prev.color, cur.color]);
};

// Layer 1: the scoreboard itself — black boards with plank seams, lit by a drifting team-color glow.
export const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const tint = useTint();
  const d1 = Math.sin(frame / 55) * 60;
  const d2 = Math.cos(frame / 70) * 50;
  return (
    <AbsoluteFill style={{ background: theme.colors.board, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${theme.colors.boardAlt} 0%, ${theme.colors.board} 55%)` }} />
      <div
        style={{
          position: "absolute",
          width: 1500,
          height: 1500,
          borderRadius: "50%",
          left: -210 + d1,
          top: 0 + d2,
          opacity: 0.3,
          background: `radial-gradient(circle, ${tint} 0%, transparent 60%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1300,
          height: 1300,
          borderRadius: "50%",
          right: -600 - d2,
          bottom: -500,
          opacity: 0.16,
          background: `radial-gradient(circle, ${tint} 0%, transparent 62%)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `repeating-linear-gradient(180deg, transparent 0px, transparent 158px, ${theme.colors.seam} 158px, ${theme.colors.seam} 160px)`,
        }}
      />
    </AbsoluteFill>
  );
};

// Layer 4: color grade.
export const Grade: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill style={{ backgroundColor: theme.colors.primary, mixBlendMode: "soft-light", opacity: 0.1 }} />
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${theme.colors.shadow} 0%, transparent 9%, transparent 85%, ${theme.colors.shadow} 100%)`,
        opacity: 0.6,
      }}
    />
  </AbsoluteFill>
);

// Layer 5a: procedural film grain.
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

// Layer 5b: vignette.
export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background: `radial-gradient(ellipse 80% 65% at center, transparent 55%, ${theme.colors.vignette} 100%)`,
    }}
  />
);

export const FadeOut: React.FC<{ length: number }> = ({ length }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const o = interpolate(frame, [durationInFrames - length, durationInFrames - 1], [0, 1], { easing: theme.ease.in, ...CLAMP });
  return <AbsoluteFill style={{ background: theme.colors.black, opacity: o, pointerEvents: "none" }} />;
};
