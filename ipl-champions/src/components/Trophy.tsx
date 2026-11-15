import React from "react";
import { theme } from "../theme";

// A generic championship cup drawn in SVG, in the hero gold.
export const Trophy: React.FC<{ size: number; glow?: number; style?: React.CSSProperties }> = ({ size, glow = 1, style }) => {
  const c = theme.colors;
  const id = `cup-${Math.round(size)}`;
  const star = Array.from({ length: 10 })
    .map((_, i) => {
      const r = i % 2 === 0 ? 15 : 6.5;
      const a = (Math.PI / 5) * i - Math.PI / 2;
      return `${100 + r * Math.cos(a)},${74 + r * Math.sin(a)}`;
    })
    .join(" ");
  return (
    <svg
      viewBox="0 0 200 240"
      width={size}
      height={size * 1.2}
      style={{
        overflow: "visible",
        filter: glow > 0 ? `drop-shadow(0 0 ${size * 0.18 * glow}px ${c.glow}) drop-shadow(0 0 ${size * 0.06 * glow}px ${c.glow})` : undefined,
        ...style,
      }}
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={c.primaryLight} />
          <stop offset="0.45" stopColor={c.primary} />
          <stop offset="1" stopColor={c.primaryDark} />
        </linearGradient>
      </defs>
      <path d="M46 40 H27 C14 40 10 53 13 65 C18 87 33 99 54 105" fill="none" stroke={`url(#${id})`} strokeWidth="10" strokeLinecap="round" />
      <path d="M154 40 H173 C186 40 190 53 187 65 C182 87 167 99 146 105" fill="none" stroke={`url(#${id})`} strokeWidth="10" strokeLinecap="round" />
      <path d="M40 22 H160 V62 C160 112 132 140 100 144 C68 140 40 112 40 62 Z" fill={`url(#${id})`} />
      <rect x="33" y="15" width="134" height="13" rx="6.5" fill={c.primaryLight} />
      <path d="M58 36 C58 80 69 110 90 127" stroke={c.white} strokeOpacity="0.42" strokeWidth="7" fill="none" strokeLinecap="round" />
      <polygon points={star} fill={c.primaryLight} opacity="0.95" />
      <path d="M90 143 H110 L106 178 H94 Z" fill={`url(#${id})`} />
      <ellipse cx="100" cy="160" rx="15" ry="5.5" fill={c.primaryLight} />
      <path d="M70 178 H130 L139 204 H61 Z" fill={`url(#${id})`} />
      <rect x="52" y="204" width="96" height="18" rx="4" fill={c.primaryDark} />
    </svg>
  );
};
