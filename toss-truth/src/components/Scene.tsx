// Scene wrapper: whip in from the right, slow push-in while it plays, quick whip out to the left,
// plus camera shakes on big hits.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CLAMP, theme } from "../theme";

export const Scene: React.FC<{ children: React.ReactNode; shakes?: number[]; noEnter?: boolean; noExit?: boolean }> = ({ children, shakes = [], noEnter, noExit }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const inU = noEnter ? 1 : interpolate(frame, [0, 9], [0, 1], { easing: theme.ease.out, ...CLAMP });
  const outU = noExit ? 0 : interpolate(frame, [durationInFrames - 7, durationInFrames], [0, 1], { easing: theme.ease.in, ...CLAMP });
  const x = (1 - inU) * 160 - outU * 200;
  const blur = (1 - inU) * 14 + outU * 12;
  const push = 1 + 0.03 * (frame / durationInFrames);
  let sx = 0;
  let sy = 0;
  for (const s of shakes) {
    const t = frame - s;
    if (t < 0 || t > 14) continue;
    const a = 14 * Math.exp(-t / 4);
    sx += Math.sin(t * 2.7) * a;
    sy += Math.cos(t * 3.3) * a * 0.7;
  }
  return (
    <AbsoluteFill style={{ opacity: Math.min(inU * 1.6, 1) * (1 - outU), transform: `translate(${x + sx}px, ${sy}px) scale(${push})`, filter: blur > 0.3 ? `blur(${blur}px)` : undefined }}>
      {children}
    </AbsoluteFill>
  );
};

// absolutely positioned, horizontally centred block
export const At: React.FC<{ y: number; children: React.ReactNode; x?: number; w?: number; style?: React.CSSProperties }> = ({ y, x = 60, w = 960, children, style }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, display: "flex", flexDirection: "column", alignItems: "center", ...style }}>{children}</div>
);
