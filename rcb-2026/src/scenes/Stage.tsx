// Dark broadcast stage: deep navy, a slow red/gold light sweep, fine diagonal grid; and a red-gold slash wipe between scenes.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../theme";

export const Stage: React.FC = () => {
  const frame = useCurrentFrame();
  const x = 50 + Math.sin(frame / 140) * 25;
  const y = 30 + Math.cos(frame / 190) * 10;
  return (
    <AbsoluteFill style={{ background: "#0A0D1A" }}>
      <AbsoluteFill style={{ background: `radial-gradient(60% 40% at ${x}% ${y}%, rgba(232,40,59,0.22) 0%, rgba(232,40,59,0) 70%)` }} />
      <AbsoluteFill style={{ background: `radial-gradient(50% 35% at ${100 - x}% ${100 - y}%, rgba(201,162,39,0.12) 0%, rgba(201,162,39,0) 70%)` }} />
      <AbsoluteFill style={{ opacity: 0.06, backgroundImage: "repeating-linear-gradient(135deg, #fff 0 1px, transparent 1px 34px)" }} />
    </AbsoluteFill>
  );
};

export const Wipe: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const u = (frame - (at - 8)) / 16;
  if (u < 0 || u > 1) return null;
  const x = interpolate(u, [0, 1], [-1600, 1400], { easing: theme.ease.inOut });
  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 60 }}>
      <div style={{ position: "absolute", left: x, top: -400, width: 900, height: 2800, background: "#0A0D1A", transform: "skewX(-18deg)" }} />
      <div style={{ position: "absolute", left: x + 900, top: -400, width: 26, height: 2800, background: "#E8283B", transform: "skewX(-18deg)" }} />
      <div style={{ position: "absolute", left: x + 930, top: -400, width: 10, height: 2800, background: "#C9A227", transform: "skewX(-18deg)" }} />
    </AbsoluteFill>
  );
};
