import React from "react";
import { interpolate } from "remotion";
import { cumulative } from "../data";
import { theme } from "../theme";
import { CLAMP } from "./Motion";

// Cumulative runs across the 16 innings of IPL 2016, on a true linear 0–1000 scale.
// `drawn` is how many innings are drawn (fractional = the next segment is mid-draw).
export const RunsChart: React.FC<{
  w: number;
  h: number;
  drawn: number;
  labels: { innings: number; text: string; color: string; on: number; dy?: number }[];
  centuries?: number[];
  duck?: number;
  compact?: boolean;
}> = ({ w, h, drawn, labels, centuries = [], duck, compact = false }) => {
  const pad = { l: compact ? 64 : 76, r: 36, t: compact ? 26 : 40, b: compact ? 40 : 58 };
  const iw = w - pad.l - pad.r;
  const ih = h - pad.t - pad.b;
  const x = (i: number) => pad.l + ((i - 1) / 15) * iw; // innings 1..16
  const y = (v: number) => pad.t + ih * (1 - v / 1000);
  const grid = compact ? [0, 500, 1000] : [0, 250, 500, 750, 1000];
  const full = Math.floor(drawn);
  const frac = drawn - full;
  const pts: [number, number][] = [[x(1), y(0)]];
  for (let i = 1; i <= Math.min(16, full); i++) pts.push([x(i), y(cumulative[i - 1])]);
  if (full < 16 && frac > 0) {
    const [px, py] = pts[pts.length - 1];
    const nx = x(full + 1);
    const ny = y(cumulative[full]);
    pts.push([px + (nx - px) * frac, py + (ny - py) * frac]);
  }
  const path = pts.map(([a, b], i) => `${i === 0 ? "M" : "L"}${a.toFixed(1)},${b.toFixed(1)}`).join(" ");
  return (
    <svg width={w} height={h} style={{ overflow: "visible" }}>
      {grid.map((g) => (
        <g key={g}>
          <line x1={pad.l} x2={w - pad.r} y1={y(g)} y2={y(g)} stroke={theme.colors.creamFaint} strokeWidth={g === 0 ? 2 : 1} strokeDasharray={g === 0 ? undefined : "4 8"} />
          <text x={pad.l - 14} y={y(g) + 7} textAnchor="end" fontFamily={theme.fonts.body} fontWeight={500} fontSize={compact ? 18 : 21} fill={theme.colors.creamDim}>
            {g}
          </text>
        </g>
      ))}
      {!compact &&
        Array.from({ length: 16 }).map((_, i) => (
          <text key={i} x={x(i + 1)} y={h - 22} textAnchor="middle" fontFamily={theme.fonts.body} fontWeight={500} fontSize={18} fill={i + 1 <= drawn ? theme.colors.creamDim : theme.colors.creamFaint}>
            {i + 1}
          </text>
        ))}
      {!compact && (
        <text x={w - pad.r} y={h - 2} textAnchor="end" fontFamily={theme.fonts.body} fontWeight={600} fontSize={16} letterSpacing="3" fill={theme.colors.creamDim}>
          INNINGS
        </text>
      )}
      <path d={path} fill="none" stroke={theme.colors.cream} strokeWidth={compact ? 4 : 5} strokeLinejoin="round" strokeLinecap="round" />
      {cumulative.map((v, i) => {
        const inn = i + 1;
        if (inn > drawn) return null;
        const isC = centuries.includes(inn);
        const isD = duck === inn;
        const r = isC || isD ? (compact ? 7 : 10) : compact ? 3.5 : 5;
        const col = isD ? theme.colors.red : isC ? theme.colors.amber : theme.colors.cream;
        const glow = isD ? theme.colors.redGlow : isC ? theme.colors.amberGlow : "transparent";
        return <circle key={inn} cx={x(inn)} cy={y(v)} r={r} fill={col} stroke={theme.colors.board} strokeWidth={2} style={{ filter: `drop-shadow(0 0 8px ${glow})` }} />;
      })}
      {labels.map((l) => (
        <text
          key={`${l.innings}-${l.text}`}
          x={x(l.innings)}
          y={y(cumulative[l.innings - 1]) + (l.dy ?? -22)}
          textAnchor={l.innings >= 15 ? "end" : "middle"}
          fontFamily={theme.fonts.display}
          fontSize={compact ? 40 : 50}
          fill={l.color}
          opacity={interpolate(l.on, [0, 1], [0, 1], CLAMP)}
        >
          {l.text}
        </text>
      ))}
    </svg>
  );
};
