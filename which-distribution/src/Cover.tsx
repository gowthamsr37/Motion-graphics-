// Reel cover (v2): WHICH DISTRIBUTION? · explained in 2 minutes · THE CHEAT SHEET: all twelve shapes in a 3 × 4 grid
// coloured by family (counts cyan, measurements violet, testing orange, bonus green), @curious_datascientist.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop, Grade, Grain, Vignette } from "./components/Backdrop";
import { Shape } from "./components/Pick";
import { ALL, BONUS, COUNTS, MEAS, TEST } from "./scenes/S1Hook";
import { alpha, glowText, HANDLE, theme } from "./theme";

const C = theme.colors;

export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Backdrop a={C.cyan} b={C.violet} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 250, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.03em" }}>
      <div style={{ fontSize: 104, color: C.text }}>WHICH</div>
      <div style={{ marginTop: 12, fontSize: 104, whiteSpace: "nowrap" }}>
        <span style={{ background: `linear-gradient(90deg, ${COUNTS}, ${MEAS}, ${TEST})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 30px ${alpha(MEAS, 0.45)})` }}>DISTRIBUTION</span>
        <span style={{ color: C.yellow, textShadow: glowText(C.yellow, 0.5) }}>?</span>
      </div>
      <div style={{ marginTop: 26, fontSize: 48, fontWeight: 700, color: C.text, letterSpacing: "0.01em" }}>
        explained in <span style={{ color: C.yellow, textShadow: glowText(C.yellow, 0.5) }}>2 minutes</span>
      </div>
    </div>
    <div style={{ position: "absolute", left: 90, top: 690, width: 900, height: 780, boxSizing: "border-box", borderRadius: 36, background: "linear-gradient(180deg, rgba(26,40,98,0.9), rgba(14,24,64,0.9))", border: `2px solid ${C.edge}` }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 726, textAlign: "center", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 26, letterSpacing: "0.22em", color: BONUS }}>THE COMPLETE CHEAT SHEET</div>
    {ALL.map((c, i) => {
      const x = 250 + (i % 3) * 290;
      const y = 860 + Math.floor(i / 3) * 150;
      return (
        <div key={c.name} style={{ position: "absolute", left: x, top: y, transform: "translate(-50%, -50%)", width: 266, height: 132, boxSizing: "border-box", borderRadius: 20, background: alpha(c.c, 0.1), border: `3px solid ${alpha(c.c, 0.75)}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <Shape kind={c.kind} w={150} h={50} color={c.c} />
          <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: c.name.length > 9 ? 20 : 24, color: C.text }}>{c.name === "t" ? "t-DIST" : c.name}</div>
        </div>
      );
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
