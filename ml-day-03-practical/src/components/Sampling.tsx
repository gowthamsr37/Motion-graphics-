// Props for sampling videos: seeded normal draws, dots scattered in a circle, a soup pot, a spoon and a light bulb.
import React from "react";
import { alpha, theme } from "../theme";
import { rng } from "./Motion";

const C = theme.colors;

// n draws from Normal(mu, sd), deterministic for a seed (Box–Muller)
export const normals = (seed: number, n: number, mu: number, sd: number) => {
  const r = rng(seed);
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    const u = Math.max(1e-9, r());
    const v = r();
    out.push(mu + sd * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v));
  }
  return out;
};
export const meanOf = (a: number[]) => a.reduce((x, y) => x + y, 0) / a.length;

// n points spread evenly inside a circle of radius r (sunflower layout), centred on 0,0
export const discPoints = (n: number, r: number) =>
  Array.from({ length: n }, (_, i) => {
    const rr = r * Math.sqrt((i + 0.5) / n);
    const a = i * 2.39996323;
    return { x: Math.cos(a) * rr, y: Math.sin(a) * rr };
  });

// a stable pseudo-random pick of k of n indices
export const pick = (n: number, k: number, seed: number) => {
  const r = rng(seed);
  const idx = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx.slice(0, k);
};

export const PotGlyph: React.FC<{ size: number; color?: string; steam?: number }> = ({ size, color = C.violet, steam = 0 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block", overflow: "visible", filter: `drop-shadow(0 0 10px ${alpha(color, 0.5)})` }}>
    {[30, 50, 70].map((x, i) => (
      <path key={i} d={`M${x} 30 q -6 -8 0 -16 q 6 -8 0 -16`} fill="none" stroke={alpha("#F3F7FF", 0.5)} strokeWidth={3.5} strokeLinecap="round" transform={`translate(0 ${Math.sin(steam + i) * 2})`} />
    ))}
    <rect x={10} y={38} width={80} height={10} rx={5} fill={color} />
    <path d="M16 48 H84 V78 Q84 92 70 92 H30 Q16 92 16 78 Z" fill={alpha(color, 0.35)} stroke={color} strokeWidth={5} />
    <path d="M18 56 Q50 50 82 56" fill="none" stroke={C.orange} strokeWidth={5} opacity={0.8} />
    <path d="M6 54 H16 M84 54 H94" stroke={color} strokeWidth={6} strokeLinecap="round" />
  </svg>
);

export const SpoonGlyph: React.FC<{ size: number; color?: string }> = ({ size, color = C.cyan }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block", overflow: "visible", filter: `drop-shadow(0 0 10px ${alpha(color, 0.5)})` }}>
    <ellipse cx={34} cy={40} rx={22} ry={16} fill={alpha(color, 0.35)} stroke={color} strokeWidth={5} transform="rotate(-30 34 40)" />
    <ellipse cx={34} cy={41} rx={13} ry={8} fill={alpha(C.orange, 0.7)} transform="rotate(-30 34 41)" />
    <path d="M52 52 L90 82" stroke={color} strokeWidth={8} strokeLinecap="round" />
  </svg>
);

export const BulbGlyph: React.FC<{ size: number; on: number }> = ({ size, on }) => {
  const glass = on > 0.5 ? C.orange : "#4B5578";
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block", overflow: "visible", filter: on > 0.05 ? `drop-shadow(0 0 ${18 * on}px ${alpha(C.orange, 0.9 * on)})` : undefined }}>
      <path d="M50 8 C28 8 16 24 16 40 C16 54 26 62 32 70 V78 H68 V70 C74 62 84 54 84 40 C84 24 72 8 50 8 Z" fill={alpha(glass, 0.25 + 0.45 * on)} stroke={glass} strokeWidth={5} />
      <path d="M40 58 L46 42 L50 52 L54 42 L60 58" fill="none" stroke={on > 0.5 ? "#FFF3D6" : "#6B7699"} strokeWidth={4} strokeLinejoin="round" />
      <rect x={33} y={80} width={34} height={7} rx={3} fill="#8C97BD" />
      <rect x={36} y={89} width={28} height={7} rx={3} fill="#8C97BD" />
    </svg>
  );
};
