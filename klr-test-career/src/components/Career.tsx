// KL Rahul's Test career as a timeline: one bar per innings, the 10-innings average as a line above.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import data from "../data/innings.json";
import { theme } from "../theme";
import { CLAMP } from "./Motion";

const C = theme.colors;
export const AMBER = C.amber;
type Inn = { i: number; date: string; runs: number; out: number; home: boolean; host: string; pos: number | null; roll: number | null };
export const INN = data as Inn[];
export const idxOf = (pred: (x: Inn) => boolean) => INN.findIndex(pred);
export const lastIdx = (pred: (x: Inn) => boolean) => {
  for (let k = INN.length - 1; k >= 0; k--) if (pred(INN[k])) return k;
  return -1;
};
// the two years out of the side: a visible break in the timeline
const GAP_AFTER = lastIdx((x) => x.date < "2021-01-01");

export type Callout = { i: number; text: string; at: number; color?: string; dy?: number; side?: "left" | "right" };
export type Band = { from: number; to: number; color: string; at: number; label?: string };

export const Timeline: React.FC<{ w: number; h: number; draw?: number; lineDraw?: number; bands?: Band[]; callouts?: Callout[]; gapAt?: number; dimOutside?: Band }> = ({ w, h, draw = 1, lineDraw = 1, bands = [], callouts = [], gapAt = -1, dimOutside }) => {
  const frame = useCurrentFrame();
  const L = 70, R = 20;
  const lineTop = 40, lineH = h * 0.3;
  const barTop = lineTop + lineH + 50, barH = h - barTop - 58;
  const gapW = 34;
  const n = INN.length;
  const step = (w - L - R - gapW) / n;
  const X = (k: number) => L + k * step + (k > GAP_AFTER ? gapW : 0);
  const BY = (r: number) => barTop + barH * (1 - Math.min(200, r) / 200);
  const LY = (a: number) => lineTop + lineH * (1 - Math.min(70, a) / 70);
  const shown = Math.floor(n * draw);
  const lineShown = Math.floor(n * lineDraw);
  const years: { y: string; k: number }[] = [];
  INN.forEach((x, k) => {
    const y = x.date.slice(0, 4);
    if (!years.find((q) => q.y === y) && ["2015", "2017", "2019", "2021", "2023", "2025"].includes(y)) years.push({ y, k });
  });
  const pts = INN.slice(0, lineShown).filter((x) => x.roll !== null).map((x) => `${(X(x.i) + step / 2).toFixed(1)},${LY(x.roll as number).toFixed(1)}`);
  const gapO = gapAt >= 0 ? interpolate(frame, [gapAt, gapAt + 12], [0, 1], CLAMP) : 0;
  return (
    <svg width={w} height={h} style={{ overflow: "visible" }}>
      {/* line chart axis */}
      {[0, 20, 40, 60].map((v) => (
        <g key={`l${v}`}>
          <line x1={L} x2={w - R} y1={LY(v)} y2={LY(v)} stroke={C.panelEdge} strokeWidth={1} />
          <text x={L - 10} y={LY(v) + 7} textAnchor="end" fontFamily={theme.fonts.display} fontSize={20} fill={C.creamDim}>
            {v}
          </text>
        </g>
      ))}
      <text x={L} y={lineTop - 14} fontFamily={theme.fonts.body} fontWeight={600} fontSize={15} letterSpacing="0.18em" fill={AMBER}>
        AVERAGE, LAST 10 INNINGS
      </text>
      {/* bar chart axis */}
      {[0, 100, 200].map((v) => (
        <g key={`b${v}`}>
          <line x1={L} x2={w - R} y1={BY(v)} y2={BY(v)} stroke={v === 0 ? C.creamDim : C.panelEdge} strokeWidth={v === 0 ? 2 : 1} strokeDasharray={v === 100 ? "5 6" : undefined} />
          <text x={L - 10} y={BY(v) + 7} textAnchor="end" fontFamily={theme.fonts.display} fontSize={20} fill={C.creamDim}>
            {v}
          </text>
        </g>
      ))}
      <text x={w - R} y={barTop - 14} textAnchor="end" fontFamily={theme.fonts.body} fontWeight={600} fontSize={15} letterSpacing="0.18em" fill={C.cream}>
        RUNS IN EACH INNINGS
      </text>
      {/* highlight bands */}
      {bands.map((b, k) => {
        const o = interpolate(frame, [b.at, b.at + 12], [0, 1], CLAMP);
        const x1 = X(b.from) - 3, x2 = X(b.to) + step + 3;
        return (
          <g key={`band${k}`} opacity={o}>
            <rect x={x1} y={lineTop - 6} width={x2 - x1} height={h - lineTop - 46} rx={6} fill={b.color} opacity={0.14} />
            <rect x={x1} y={lineTop - 6} width={x2 - x1} height={h - lineTop - 46} rx={6} fill="none" stroke={b.color} strokeWidth={2} opacity={0.6} />
            {b.label && (
              <text x={(x1 + x2) / 2} y={h - 6} textAnchor="middle" fontFamily={theme.fonts.display} fontSize={26} fill={b.color}>
                {b.label}
              </text>
            )}
          </g>
        );
      })}
      {/* bars */}
      {INN.slice(0, shown).map((x) => {
        const col = x.runs >= 100 ? AMBER : x.runs >= 50 ? C.cream : "rgba(237,228,204,0.42)";
        const dim = dimOutside ? (x.i < dimOutside.from || x.i > dimOutside.to ? 1 - 0.7 * interpolate(frame, [dimOutside.at, dimOutside.at + 12], [0, 1], CLAMP) : 1) : 1;
        return <rect key={x.i} x={X(x.i) + 0.6} y={BY(Math.max(1.5, x.runs))} width={Math.max(1.5, step - 1.6)} height={BY(0) - BY(Math.max(1.5, x.runs))} fill={col} opacity={dim} style={x.runs >= 100 ? { filter: `drop-shadow(0 0 4px ${C.amberGlow})` } : undefined} />;
      })}
      {/* rolling average */}
      {pts.length > 1 && <polyline points={pts.join(" ")} fill="none" stroke={AMBER} strokeWidth={4} strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 6px ${C.amberGlow})` }} />}
      {/* the two years out */}
      <g opacity={gapO}>
        <line x1={X(GAP_AFTER) + step + gapW / 2} x2={X(GAP_AFTER) + step + gapW / 2} y1={lineTop} y2={BY(0)} stroke={C.red} strokeWidth={3} strokeDasharray="6 6" />
        <text x={X(GAP_AFTER) + step + gapW / 2} y={BY(0) + 52} textAnchor="middle" fontFamily={theme.fonts.display} fontSize={22} fill={C.red}>
          2 YEARS OUT
        </text>
      </g>
      {/* year ticks */}
      {years.map((y) => (
        <text key={y.y} x={X(y.k)} y={BY(0) + 26} fontFamily={theme.fonts.display} fontSize={22} fill={C.creamDim}>
          {y.y}
        </text>
      ))}
      {/* callouts */}
      {callouts.map((c, k) => {
        const o = interpolate(frame, [c.at, c.at + 8], [0, 1], CLAMP);
        const x = X(c.i) + step / 2;
        const top = BY(INN[c.i].runs) - 12;
        const ty = Math.min(top - 30, barTop + 10) - (c.dy ?? 0);
        const anchor = c.side === "left" ? "end" : c.side === "right" ? "start" : "middle";
        return (
          <g key={`c${k}`} opacity={o}>
            <line x1={x} x2={x} y1={ty + 8} y2={top} stroke={c.color ?? C.cream} strokeWidth={2} />
            <circle cx={x} cy={top + 6} r={5} fill={c.color ?? C.cream} />
            <text x={x + (c.side === "left" ? -6 : c.side === "right" ? 6 : 0)} y={ty} textAnchor={anchor} fontFamily={theme.fonts.display} fontSize={28} fill={c.color ?? C.cream} style={{ paintOrder: "stroke" }} stroke={C.board} strokeWidth={5}>
              {c.text}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

/* a cricket ball icon for counting hundreds */
export const Ball: React.FC<{ size: number; lit: number }> = ({ size, lit }) => (
  <svg width={size} height={size} viewBox="0 0 40 40">
    <circle cx={20} cy={20} r={17} fill={lit > 0.5 ? "#B3261E" : C.plateHi} stroke={lit > 0.5 ? "#6E140F" : C.panelEdge} strokeWidth={2} />
    <path d="M9 9 C16 16 16 24 9 31 M31 9 C24 16 24 24 31 31" fill="none" stroke={lit > 0.5 ? "#F4E6D0" : C.panelEdge} strokeWidth={1.6} strokeDasharray="2.5 2" />
  </svg>
);
