// Reel cover: THE t-DISTRIBUTION · explained in 2 minutes · the t-curve (df = 4, violet, fat orange tails) over the
// dashed normal, "SMALL SAMPLE? FATTER TAILS.", @curious_datascientist.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop, Grade, Grain, Vignette } from "./components/Backdrop";
import { FnCurve, type Geo } from "./components/Curve";
import { npdf, tpdf } from "./components/TDist";
import { NC, TAIL, TC } from "./scenes/S1Hook";
import { alpha, glowText, HANDLE, theme } from "./theme";

const C = theme.colors;
const G: Geo = { x0: 150, x1: 930, vmin: -4.5, vmax: 4.5, base: 1380, h: 300 };

export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Backdrop a={C.cyan} b={C.violet} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.03em" }}>
      <div style={{ fontSize: 96, color: C.text }}>THE</div>
      <div style={{ marginTop: 14, fontSize: 138, background: `linear-gradient(90deg, ${NC}, ${TC})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 30px ${alpha(TC, 0.45)})`, whiteSpace: "nowrap" }}>t-DISTRIBUTION</div>
      <div style={{ marginTop: 34, fontSize: 50, fontWeight: 700, color: C.text, letterSpacing: "0.01em" }}>
        explained in <span style={{ color: C.yellow, textShadow: glowText(C.yellow, 0.5) }}>2 minutes</span>
      </div>
    </div>
    <div style={{ position: "absolute", left: 90, top: 860, width: 900, height: 600, boxSizing: "border-box", borderRadius: 36, background: "linear-gradient(180deg, rgba(26,40,98,0.9), rgba(14,24,64,0.9))", border: `2px solid ${C.edge}` }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 920, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 44, color: C.text }}>
      SMALL SAMPLE? <span style={{ color: TAIL, textShadow: glowText(TAIL, 0.5) }}>FATTER TAILS.</span>
    </div>
    <FnCurve g={G} f={npdf} fmax={0.4} color={NC} fill={0} dashed width={4} />
    <FnCurve g={G} f={(x) => tpdf(x, 2.5)} fmax={0.4} color={TC} fill={0.14} bands={[{ a: -4.5, b: -2.3, color: TAIL, opacity: 0.6 }, { a: 2.3, b: 4.5, color: TAIL, opacity: 0.6 }]} />
    <div style={{ position: "absolute", left: 140, top: 1382, width: 800, height: 4, background: alpha(C.text, 0.4) }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 1516, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 36, color: C.text }}>
      <span style={{ color: C.cyan }}>@</span>
      {HANDLE.slice(1)}
    </div>
    <Grade />
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
