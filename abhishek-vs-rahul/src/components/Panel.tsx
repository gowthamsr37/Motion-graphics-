import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { Scratches } from "./Board";
import { CLAMP } from "./Motion";

const Screw: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <span
    style={{
      position: "absolute",
      left: x - 6,
      top: y - 6,
      width: 12,
      height: 12,
      borderRadius: 12,
      background: `radial-gradient(circle at 35% 30%, ${theme.colors.creamDim}, ${theme.colors.board} 70%)`,
      boxShadow: `0 1px 0 ${theme.colors.panelEdge}`,
    }}
  />
);

// Scoreboard panel. Opens like a shutter dropping from its top rail (heavy spring), closes upward.
export const Panel: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  delay?: number;
  closeAt?: number; // frame (scene-relative) to close, optional
  seed?: number;
  glow?: string; // edge light colour for milestones
  glowOn?: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ x, y, w, h, delay = 0, closeAt, seed = 1, glow, glowOn = 0, children, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const open = spring({ frame: frame - delay, fps, config: theme.spring.heavy });
  const close = closeAt === undefined ? 0 : interpolate(frame, [closeAt, closeAt + Math.round(fps / 3)], [0, 1], { easing: theme.ease.in, ...CLAMP });
  const s = Math.max(0.02, interpolate(open, [0, 1], [0.02, 1]) * (1 - close));
  const content = interpolate(open, [0.55, 0.95], [0, 1], CLAMP) * (1 - close);
  if (open <= 0.001) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        transformOrigin: "50% 0%",
        transform: `scaleY(${s})`,
        opacity: interpolate(open, [0, 0.15], [0, 1], CLAMP) * (1 - close * 0.6),
        borderRadius: 10,
        background: `linear-gradient(180deg, ${theme.colors.panelHi} 0%, ${theme.colors.panel} 55%, ${theme.colors.board} 100%)`,
        boxShadow: [
          `inset 0 2px 0 ${theme.colors.panelEdge}`,
          `inset 0 0 0 2px ${theme.colors.panelEdge}`,
          `0 18px 40px -12px ${theme.colors.shadow}`,
          glow ? `0 0 ${36 * glowOn}px ${glow}` : "",
        ]
          .filter(Boolean)
          .join(", "),
        overflow: "hidden",
        ...style,
      }}
    >
      <Scratches w={w} h={h} seed={seed} count={Math.round((w * h) / 9000)} opacity={0.07} />
      <Screw x={14} y={14} />
      <Screw x={w - 14} y={14} />
      <Screw x={14} y={h - 14} />
      <Screw x={w - 14} y={h - 14} />
      <div style={{ position: "absolute", inset: 0, opacity: content }}>{children}</div>
    </div>
  );
};

// Painted board lettering.
export const Lettering: React.FC<{ size: number; color?: string; font?: "display" | "body"; weight?: number; spacing?: string; style?: React.CSSProperties; children: React.ReactNode }> = ({
  size,
  color = theme.colors.cream,
  font = "display",
  weight = 600,
  spacing,
  style,
  children,
}) => (
  <span
    style={{
      fontFamily: font === "display" ? theme.fonts.display : theme.fonts.body,
      fontWeight: font === "display" ? 400 : weight,
      fontSize: size,
      lineHeight: 1,
      letterSpacing: spacing ?? (font === "body" ? "0.12em" : "0.02em"),
      color,
      textShadow: `0 1px 0 ${theme.colors.black}80`,
      ...style,
    }}
  >
    {children}
  </span>
);

// Status lamp: an old scoreboard bulb behind coloured glass.
export const Lamp: React.FC<{ color: string; glow: string; on: number; size?: number }> = ({ color, glow, on, size = 26 }) => (
  <span
    style={{
      display: "inline-block",
      width: size,
      height: size,
      borderRadius: size,
      flex: "none",
      background: on > 0.05 ? `radial-gradient(circle at 35% 30%, ${theme.colors.white}cc 0%, ${color} 45%, ${color} 100%)` : theme.colors.plate,
      opacity: 0.35 + 0.65 * on,
      boxShadow: `inset 0 0 0 2px ${theme.colors.panelEdge}, 0 0 ${size * 1.1 * on}px ${glow}`,
    }}
  />
);
