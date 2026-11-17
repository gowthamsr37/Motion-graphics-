// Reel cover: CONFIDENCE INTERVALS · explained in 2 minutes · 12 of the simulated 95% ranges around the true average
// (one misses), "32 ± 2 MIN", @curious_datascientist.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop, Grade, Grain, Vignette } from "./components/Backdrop";
import { Interval, type Line, lx, SURVEYS, TRUE_MEAN } from "./components/CI";
import { MISS, RANGE, SAMPLE, TRUE } from "./scenes/S1Hook";
import { alpha, glowText, HANDLE, theme } from "./theme";

const C = theme.colors;
const G: Line = { x0: 170, x1: 910, vmin: 27, vmax: 37 };
const PICK = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Backdrop a={C.cyan} b={C.violet} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.03em" }}>
      <div style={{ fontSize: 124, background: `linear-gradient(90deg, ${SAMPLE}, ${RANGE})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 30px ${alpha(RANGE, 0.45)})` }}>CONFIDENCE</div>
      <div style={{ marginTop: 14, fontSize: 124, color: C.text }}>INTERVALS</div>
      <div style={{ marginTop: 34, fontSize: 50, fontWeight: 700, color: C.text, letterSpacing: "0.01em" }}>
        explained in <span style={{ color: C.yellow, textShadow: glowText(C.yellow, 0.5) }}>2 minutes</span>
      </div>
    </div>
    <div style={{ position: "absolute", left: 90, top: 860, width: 900, height: 600, boxSizing: "border-box", borderRadius: 36, background: "linear-gradient(180deg, rgba(26,40,98,0.9), rgba(14,24,64,0.9))", border: `2px solid ${C.edge}` }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 900, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 48, color: C.text }}>
      32 <span style={{ color: RANGE, textShadow: glowText(RANGE, 0.5) }}>± 2</span> MIN
    </div>
    <div style={{ position: "absolute", left: lx(G, TRUE_MEAN) - 2, top: 990, width: 4, height: 410, background: TRUE, boxShadow: `0 0 12px ${TRUE}` }} />
    {PICK.map((k, i) => {
      const v = SURVEYS[k];
      return <Interval key={k} g={G} y={1010 + i * 33} m={v.m} lo={v.lo} hi={v.hi} p={1} color={v.hit ? RANGE : MISS} dot={v.hit ? C.text : MISS} thick={6} />;
    })}
    <div style={{ position: "absolute", left: 0, right: 0, top: 1516, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 36, color: C.text }}>
      <span style={{ color: C.cyan }}>@</span>
      {HANDLE.slice(1)}
    </div>
    <Grade />
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
