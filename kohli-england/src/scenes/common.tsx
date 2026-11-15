import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CLAMP } from "../components/Motion";
import { theme } from "../theme";

export const useAt = (start: number, config: { damping: number; stiffness: number; mass: number } = theme.spring.snappy) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - start, fps, config });
};

// Plates flip one after another, starting at `start`.
export const useFlip = (start: number, stagger = 2) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (i: number) => spring({ frame: frame - start - i * stagger, fps, config: theme.spring.flip });
};

// A board row sliding into its slot: fade + travel + settle, always together.
export const Reveal: React.FC<{ at: number; x?: number; y?: number; style?: React.CSSProperties; children: React.ReactNode }> = ({ at, x = -40, y = 0, style, children }) => {
  const p = useAt(at, theme.spring.snappy);
  return (
    <div
      style={{
        opacity: interpolate(p, [0, 0.5], [0, 1], CLAMP),
        transform: `translate(${interpolate(p, [0, 1], [x, 0])}px, ${interpolate(p, [0, 1], [y, 0])}px) scale(${interpolate(p, [0, 1], [0.97, 1])})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// Painted arrow (fonts on old boards had no arrow glyph either).
export const Arrow: React.FC<{ w: number; color?: string }> = ({ w, color = theme.colors.creamDim }) => (
  <svg width={w} height={w * 0.5} viewBox="0 0 100 50" style={{ flex: "none" }}>
    <path d="M4 25 H84 M66 8 L90 25 L66 42" fill="none" stroke={color} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Divider: React.FC<{ y: number; on?: number }> = ({ y, on = 1 }) => (
  <div style={{ position: "absolute", left: 40, right: 40, top: y, height: 2, background: theme.colors.panelEdge, transform: `scaleX(${on})`, transformOrigin: "0% 50%" }} />
);
