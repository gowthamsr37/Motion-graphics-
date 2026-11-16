// Reel cover: SKEWNESS · explained in 2 minutes · three mini histograms (left skew · symmetric · right skew) with mean / median lines.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop, Grade, Grain, Vignette } from "./components/Backdrop";
import { Bars, binX, type Geo, histStats, LEFT, RIGHT, SYM } from "./components/Hist";
import { alpha, glowText, HANDLE, kindColor, theme } from "./theme";

const C = theme.colors;
const O = C.orange;
const COLS = [
  { x: 230, label: "LEFT", col: "#60A5FA", counts: LEFT, tailLeft: 5, tail: undefined as number | undefined },
  { x: 540, label: "SYMMETRIC", col: "#E4EEFF", counts: SYM, tailLeft: undefined as number | undefined, tail: undefined as number | undefined },
  { x: 850, label: "RIGHT", col: O, counts: RIGHT, tailLeft: undefined as number | undefined, tail: 6 },
];

export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Backdrop a={O} b={C.cyan} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 330, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.03em" }}>
      <div style={{ fontSize: 100, color: C.text }}>WHAT IS</div>
      <div style={{ marginTop: 14, fontSize: 142, transform: "skewX(-10deg)", background: `linear-gradient(90deg, ${C.cyan}, ${C.violet})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 30px ${alpha(C.violet, 0.45)})` }}>SKEWNESS?</div>
      <div style={{ marginTop: 30, fontSize: 52, fontWeight: 700, color: C.text, letterSpacing: "0.01em" }}>
        explained in <span style={{ color: C.yellow, textShadow: glowText(C.yellow, 0.5) }}>2 minutes</span>
      </div>
    </div>

    <div style={{ position: "absolute", left: 90, top: 1000, width: 900, height: 430, boxSizing: "border-box", borderRadius: 36, background: "linear-gradient(180deg, rgba(26,40,98,0.9), rgba(14,24,64,0.9))", border: `2px solid ${C.edge}` }} />
    {COLS.map((c) => {
      const g: Geo = { x0: c.x - 120, bw: 16, gap: 4, base: 1290, maxH: 200, maxC: 13 };
      const st = histStats(c.counts);
      return (
        <React.Fragment key={c.label}>
          <div style={{ position: "absolute", left: c.x, top: 1050, transform: "translate(-50%, -50%)", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 28, color: c.col, textShadow: glowText(c.col, 0.35), whiteSpace: "nowrap" }}>{c.label}</div>
          <div style={{ position: "absolute", left: c.x - 124, top: 1292, width: 248, height: 3, background: alpha(C.text, 0.35) }} />
          <Bars g={g} counts={c.counts} color={alpha("#E4EEFF", 0.75)} tailColor={c.tail !== undefined || c.tailLeft !== undefined ? c.col : undefined} tail={c.tail} tailLeft={c.tailLeft} />
          <div style={{ position: "absolute", left: binX(g, st.median) - 2, top: 1070, height: 220, borderLeft: `4px solid ${kindColor.median}` }} />
          <div style={{ position: "absolute", left: binX(g, st.mean) - 2, top: 1070, height: 220, borderLeft: `4px dashed ${kindColor.mean}` }} />
        </React.Fragment>
      );
    })}
    <div style={{ position: "absolute", left: 0, right: 0, top: 1360, display: "flex", justifyContent: "center", gap: 30, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.16em", color: C.dim }}>
      <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ width: 34, borderTop: `4px dashed ${kindColor.mean}` }} /> MEAN
      </span>
      <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ width: 34, borderTop: `4px solid ${kindColor.median}` }} /> MEDIAN
      </span>
    </div>

    <div style={{ position: "absolute", left: 0, right: 0, top: 1500, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 36, color: C.text }}>
      <span style={{ color: C.cyan }}>@</span>
      {HANDLE.slice(1)}
    </div>
    <Grade />
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
