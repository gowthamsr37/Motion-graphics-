import React from "react";
import { interpolate } from "remotion";
import { theme } from "../theme";
import { CLAMP } from "./Motion";

export type Point = { year: number; value: number; color: string; glow: string };

// Calendar-year average line chart, drawn on the board. Values are plotted on a true linear scale.
export const LineChart: React.FC<{
  w: number;
  h: number;
  points: Point[];
  reveal: number[]; // 0..1 per point (point i's segment draws in as reveal[i] goes 0→1)
  slots: number; // how many year positions the x-axis has (animate 4 → 5 to extend the axis)
  yMax?: number;
  threshold?: { value: number; on: number; label: string };
  labelOn?: number[];
}> = ({ w, h, points, reveal, slots, yMax = 80, threshold, labelOn }) => {
  const pad = { l: 70, r: 40, t: 56, b: 64 };
  const inset = 64; // keep the first/last points (and their labels) clear of the axis
  const iw = w - pad.l - pad.r - inset * 2;
  const ih = h - pad.t - pad.b;
  const x = (i: number) => pad.l + inset + (slots <= 1 ? 0 : (i * iw) / (slots - 1));
  // Label below a point that is a dip, above otherwise.
  const below = (i: number) => {
    const v = points[i].value;
    const prev = points[i - 1]?.value;
    const next = reveal[i + 1] > 0 ? points[i + 1]?.value : undefined;
    return prev !== undefined && v < prev && (next === undefined || v <= next);
  };
  const y = (v: number) => pad.t + ih * (1 - v / yMax);
  const grid = [0, 20, 40, 60, 80].filter((g) => g <= yMax);
  return (
    <svg width={w} height={h} style={{ overflow: "visible" }}>
      {grid.map((g) => (
        <g key={g}>
          <line x1={pad.l} x2={w - pad.r} y1={y(g)} y2={y(g)} stroke={theme.colors.creamFaint} strokeWidth={g === 0 ? 2 : 1} strokeDasharray={g === 0 ? undefined : "4 8"} />
          <text x={pad.l - 16} y={y(g) + 8} textAnchor="end" fontFamily={theme.fonts.body} fontWeight={500} fontSize={22} fill={theme.colors.creamDim}>
            {g}
          </text>
        </g>
      ))}
      {threshold && (
        <g opacity={threshold.on}>
          <line x1={pad.l} x2={w - pad.r} y1={y(threshold.value)} y2={y(threshold.value)} stroke={theme.colors.red} strokeWidth={3} strokeDasharray="14 10" />
          <text x={w - pad.r} y={y(threshold.value) - 12} textAnchor="end" fontFamily={theme.fonts.body} fontWeight={600} fontSize={22} letterSpacing="2" fill={theme.colors.red}>
            {threshold.label}
          </text>
        </g>
      )}
      {points.map((p, i) => {
        const r = Math.min(1, Math.max(0, reveal[i] ?? 0));
        if (r <= 0) return null;
        const prev = points[i - 1];
        const len = prev ? Math.hypot(x(i) - x(i - 1), y(p.value) - y(prev.value)) : 0;
        return (
          <g key={p.year}>
            {prev && (
              <line
                x1={x(i - 1)}
                y1={y(prev.value)}
                x2={x(i)}
                y2={y(p.value)}
                stroke={p.color}
                strokeWidth={6}
                strokeLinecap="round"
                strokeDasharray={len}
                strokeDashoffset={len * (1 - interpolate(r, [0, 0.8], [0, 1], CLAMP))}
                style={{ filter: `drop-shadow(0 0 6px ${p.glow})` }}
              />
            )}
            <circle cx={x(i)} cy={y(p.value)} r={11 * interpolate(r, [0.6, 1], [0, 1], CLAMP)} fill={p.color} stroke={theme.colors.board} strokeWidth={3} style={{ filter: `drop-shadow(0 0 10px ${p.glow})` }} />
            <text
              x={x(i)}
              y={y(p.value) + (below(i) ? 50 : -24)}
              textAnchor="middle"
              fontFamily={theme.fonts.display}
              fontSize={44}
              fill={p.color}
              opacity={interpolate(labelOn?.[i] ?? r, [0.7, 1], [0, 1], CLAMP)}
            >
              {p.value.toFixed(2)}
            </text>
          </g>
        );
      })}
      {points.map((p, i) =>
        i < Math.round(slots) ? (
          <text
            key={`x${p.year}`}
            x={x(i)}
            y={h - 18}
            textAnchor="middle"
            fontFamily={theme.fonts.body}
            fontWeight={600}
            fontSize={26}
            letterSpacing="1"
            fill={(reveal[i] ?? 0) > 0.3 ? theme.colors.cream : theme.colors.creamFaint}
            opacity={interpolate(slots - i, [0, 1], [0, 1], CLAMP)}
          >
            {p.year}
          </text>
        ) : null,
      )}
    </svg>
  );
};
