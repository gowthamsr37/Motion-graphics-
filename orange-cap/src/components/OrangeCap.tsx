import React from "react";
import { theme } from "../theme";

// A cricket cap in Orange Cap orange, drawn in SVG (side view: panelled dome + peak).
export const OrangeCap: React.FC<{ size: number; glow?: number; style?: React.CSSProperties }> = ({ size, glow = 1, style }) => {
  const c = theme.colors;
  const id = `cap-${Math.round(size)}`;
  return (
    <svg
      viewBox="0 0 220 140"
      width={size}
      height={size * (140 / 220)}
      style={{
        overflow: "visible",
        filter: glow > 0 ? `drop-shadow(0 0 ${size * 0.12 * glow}px ${c.capGlow}) drop-shadow(0 0 ${size * 0.04 * glow}px ${c.capGlow})` : undefined,
        ...style,
      }}
    >
      <defs>
        <linearGradient id={`${id}-dome`} x1="0" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor={c.capLight} />
          <stop offset="0.5" stopColor={c.cap} />
          <stop offset="1" stopColor={c.capDark} />
        </linearGradient>
        <linearGradient id={`${id}-peak`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c.cap} />
          <stop offset="1" stopColor={c.capDark} />
        </linearGradient>
      </defs>
      {/* peak */}
      <path d="M138 96 C168 90 204 94 216 104 C206 114 168 116 128 108 Z" fill={`url(#${id}-peak)`} />
      {/* dome */}
      <path d="M22 104 C18 52 52 18 100 16 C146 14 176 46 178 104 Z" fill={`url(#${id}-dome)`} />
      {/* panel seams */}
      <path d="M100 16 C84 40 76 72 74 104" fill="none" stroke={c.capDark} strokeOpacity="0.55" strokeWidth="2.5" />
      <path d="M100 16 C118 42 128 72 132 104" fill="none" stroke={c.capDark} strokeOpacity="0.55" strokeWidth="2.5" />
      {/* band + button + highlight */}
      <path d="M22 96 L178 96 L178 106 L22 106 Z" fill={c.capDark} opacity="0.85" />
      <circle cx="100" cy="16" r="6" fill={c.capDark} />
      <path d="M44 84 C44 56 62 36 88 28" fill="none" stroke={c.white} strokeOpacity="0.4" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
};
