// Number lines of runs for the two batters (the running example).
import React from "react";
import { interpolate } from "remotion";
import { alpha, BAT_A, BAT_B, theme } from "../theme";
import { useSpr } from "./Motion";

const C = theme.colors;
export const A_SCORES = [33, 39, 41, 47]; // mean 40, range 14, variance 25, SD 5
export const B_SCORES = [5, 35, 45, 75]; // mean 40, range 70, variance 625, SD 25
export type Scale = { lo: number; hi: number; x0: number; x1: number };
export const FULL: Scale = { lo: 0, hi: 80, x0: 160, x1: 940 };
export const sx = (sc: Scale, v: number) => sc.x0 + ((v - sc.lo) / (sc.hi - sc.lo)) * (sc.x1 - sc.x0);

export const Axis: React.FC<{ sc: Scale; y: number; p: number; step: number; labels?: boolean; labelEvery?: number }> = ({ sc, y, p, step, labels = true, labelEvery = 1 }) => {
  const ticks: number[] = [];
  for (let v = sc.lo; v <= sc.hi + 1e-6; v += step) ticks.push(v);
  return (
    <>
      <div style={{ position: "absolute", left: sc.x0 - 20, top: y - 2, width: (sc.x1 - sc.x0 + 40) * p, height: 4, borderRadius: 2, background: alpha(C.text, 0.35) }} />
      {ticks.map((v, i) => (
        <React.Fragment key={v}>
          <div style={{ position: "absolute", left: sx(sc, v) - 1.5, top: y - 9, width: 3, height: 18, background: alpha(C.text, 0.45), opacity: p }} />
          {labels && i % labelEvery === 0 ? (
            <div style={{ position: "absolute", left: sx(sc, v), top: y + 30, transform: "translate(-50%, -50%)", fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 24, color: C.dim, opacity: p }}>{v}</div>
          ) : null}
        </React.Fragment>
      ))}
    </>
  );
};

export const ScoreDot: React.FC<{ x: number; y: number; at: number; who: "A" | "B"; label?: string; ring?: string; dim?: number; r?: number; labelDx?: number; labelDy?: number }> = ({ x, y, at, who, label, ring, dim = 1, r = 19, labelDx = 0, labelDy = 0 }) => {
  const spr = useSpr();
  const p = spr(at, theme.spring.pop);
  if (p <= 0.001) return null;
  const col = who === "A" ? BAT_A : BAT_B;
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: x - r,
          top: y - r,
          width: r * 2,
          height: r * 2,
          borderRadius: r,
          background: col,
          boxShadow: `0 0 18px ${alpha(col, 0.7)}${ring ? `, 0 0 0 5px ${ring}` : ""}`,
          transform: `scale(${p}) translateY(${(1 - p) * -30}px)`,
          opacity: dim,
          zIndex: 3,
        }}
      />
      {label ? (
        <div style={{ position: "absolute", left: x + labelDx, top: y - r - 26 + labelDy, transform: `translate(-50%, -50%) scale(${interpolate(p, [0, 1], [0.6, 1])})`, opacity: Math.min(1, p * 2) * dim, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 30, color: C.text }}>
          {label}
        </div>
      ) : null}
    </>
  );
};

// A bracket under a row from x0 to x1, drawn by p.
export const Bracket: React.FC<{ x0: number; x1: number; y: number; p: number; color: string; h?: number }> = ({ x0, x1, y, p, color, h = 18 }) => (
  <div
    style={{
      position: "absolute",
      left: Math.min(x0, x1),
      top: y,
      width: Math.abs(x1 - x0),
      height: h,
      borderLeft: `5px solid ${color}`,
      borderRight: `5px solid ${color}`,
      borderBottom: `5px solid ${color}`,
      borderRadius: "0 0 10px 10px",
      clipPath: `inset(0 ${(1 - p) * 50}% 0 ${(1 - p) * 50}%)`,
      filter: `drop-shadow(0 0 8px ${alpha(color, 0.7)})`,
    }}
  />
);

// Batter name chip.
export const BatterChip: React.FC<{ who: "A" | "B" }> = ({ who }) => {
  const col = who === "A" ? BAT_A : BAT_B;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 14px 6px 8px", borderRadius: 999, background: alpha(col, 0.14), border: `2px solid ${alpha(col, 0.7)}`, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.18em", color: C.text, whiteSpace: "nowrap" }}>
      <span style={{ width: 30, height: 30, borderRadius: 15, background: col, color: C.ink, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontSize: 18, letterSpacing: 0 }}>{who}</span>
      BATTER {who}
    </div>
  );
};

// keep the labels of near-identical scores apart (A's 39 and 41 are 2 runs apart)
export const labelNudge = (who: "A" | "B", v: number) => (who === "A" && v === 39 ? -16 : who === "A" && v === 41 ? 16 : 0);
export const labelLift = (who: "A" | "B", v: number) => (who === "A" && (v === 39 || v === 41) ? -36 : 0);
