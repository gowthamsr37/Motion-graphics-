// River cross-section: average depth 3 ft (trapezoid mean of the profile = 3.04 ft), shallowest 1 ft, deepest 8 ft.
import React from "react";
import { useCurrentFrame } from "remotion";
import { alpha, theme } from "../theme";
import { Person } from "./Icons";

const C = theme.colors;
export const PROFILE: [number, number][] = [
  [0, 1.0], [0.06, 1.1], [0.16, 1.3], [0.28, 1.6], [0.38, 2.2], [0.46, 5.0], [0.52, 8.0],
  [0.6, 8.0], [0.67, 5.5], [0.73, 2.8], [0.84, 1.7], [0.94, 1.1], [1.0, 1.0],
];

export type RiverGeo = { x0: number; x1: number; surface: number; ft: number };
export const depthAt = (f: number) => {
  for (let i = 0; i < PROFILE.length - 1; i++) {
    const [a, da] = PROFILE[i];
    const [b, db] = PROFILE[i + 1];
    if (f >= a && f <= b) return da + ((f - a) / (b - a)) * (db - da);
  }
  return 1;
};

export const River: React.FC<{ g: RiverGeo; p: number; avg: number; personX?: number; personIn?: number; worried?: boolean; deepGlow?: number }> = ({
  g,
  p,
  avg,
  personX,
  personIn = 0,
  worried = false,
  deepGlow = 0,
}) => {
  const frame = useCurrentFrame();
  const W = g.x1 - g.x0;
  const X = (f: number) => g.x0 + f * W;
  const Y = (d: number) => g.surface + d * g.ft;
  const bed = PROFILE.map(([f, d]) => `${X(f).toFixed(1)} ${Y(d).toFixed(1)}`);
  const ground = `M${g.x0 - 60} ${g.surface - 20} L${g.x0} ${g.surface} L${bed.join(" L")} L${g.x1} ${g.surface} L${g.x1 + 60} ${g.surface - 20} L${g.x1 + 60} ${Y(9.6)} L${g.x0 - 60} ${Y(9.6)} Z`;
  const water = `M${X(0)} ${g.surface} L${bed.join(" L")} L${X(1)} ${g.surface} Z`;
  const wave = Array.from({ length: 23 })
    .map((_, i) => {
      const x = g.x0 + (i / 22) * W;
      return `${i ? "L" : "M"}${x.toFixed(1)} ${(g.surface + Math.sin(i * 0.9 + frame / 6) * 3).toFixed(1)}`;
    })
    .join(" ");
  const px = personX ?? X(0.18);
  const pf = (px - g.x0) / W;
  return (
    <>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible", opacity: p }}>
        <defs>
          <linearGradient id="riverWater" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#38BDF8" stopOpacity={0.55} />
            <stop offset="1" stopColor="#1E3A8A" stopOpacity={0.85} />
          </linearGradient>
        </defs>
        <path d={ground} fill="#1A1A46" stroke={alpha(C.text, 0.25)} strokeWidth={3} />
      </svg>
      {personIn > 0.01 ? (
        <div style={{ position: "absolute", left: px - 72, top: Y(depthAt(pf)) - 286, opacity: personIn * p, transform: `translateY(${(1 - personIn) * 40}px)` }}>
          <Person height={290} shirt="#60A5FA" skin={C.skin[1]} hair={C.hair[0]} smile={worried ? -0.6 : 0.5} blink={frame % 70 > 66} />
        </div>
      ) : null}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible", opacity: p }}>
        <path d={water} fill="url(#riverWater)" />
        {deepGlow > 0.01 ? <path d={water} fill={alpha(C.orange, 0.0)} stroke={alpha(C.orange, 0.9 * deepGlow)} strokeWidth={5} strokeDasharray="10 8" /> : null}
        <path d={wave} stroke="#BAE6FD" strokeWidth={4} fill="none" opacity={0.8} />
        {avg > 0.01 ? (
          <>
            <line x1={g.x0} y1={Y(3)} x2={g.x0 + W * avg} y2={Y(3)} stroke={C.cyan} strokeWidth={5} strokeDasharray="12 10" style={{ filter: `drop-shadow(0 0 6px ${C.cyan})` }} />
          </>
        ) : null}
      </svg>
    </>
  );
};
