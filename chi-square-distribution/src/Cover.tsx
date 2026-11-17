// Reel cover: THE CHI-SQUARE DISTRIBUTION · explained in 2 minutes · "IS THIS DICE FAIR?" over the 5-df curve with the
// fair zone (green) and the 5% tail (orange), @curious_datascientist.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop, Grade, Grain, Vignette } from "./components/Backdrop";
import { CRIT95 } from "./components/Chi";
import { FnCurve, type Geo } from "./components/Curve";
import { Die } from "./components/Prob";
import { chi5 } from "./scenes/S6Verdict";
import { FAIR, GAP, OBSC } from "./scenes/S1Hook";
import { alpha, glowText, HANDLE, theme } from "./theme";

const C = theme.colors;
const G: Geo = { x0: 150, x1: 930, vmin: 0, vmax: 22, base: 1390, h: 300 };

export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Backdrop a={C.cyan} b={C.orange} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.03em" }}>
      <div style={{ fontSize: 96, color: C.text }}>THE</div>
      <div style={{ marginTop: 14, fontSize: 126, background: `linear-gradient(90deg, ${OBSC}, ${GAP})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 30px ${alpha(GAP, 0.45)})`, whiteSpace: "nowrap" }}>CHI-SQUARE</div>
      <div style={{ marginTop: 10, fontSize: 92, color: C.text }}>DISTRIBUTION</div>
      <div style={{ marginTop: 30, fontSize: 50, fontWeight: 700, color: C.text, letterSpacing: "0.01em" }}>
        explained in <span style={{ color: C.yellow, textShadow: glowText(C.yellow, 0.5) }}>2 minutes</span>
      </div>
    </div>
    <div style={{ position: "absolute", left: 90, top: 900, width: 900, height: 560, boxSizing: "border-box", borderRadius: 36, background: "linear-gradient(180deg, rgba(26,40,98,0.9), rgba(14,24,64,0.9))", border: `2px solid ${C.edge}` }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 950, display: "flex", justifyContent: "center", alignItems: "center", gap: 24, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 48, color: C.text }}>
      <Die value={6} size={64} color={GAP} glow={0.8} />
      <span>
        IS THIS DICE <span style={{ color: FAIR, textShadow: glowText(FAIR, 0.5) }}>FAIR</span>
        <span style={{ color: C.yellow }}>?</span>
      </span>
    </div>
    <FnCurve g={G} f={chi5} fmax={0.16} color={OBSC} fill={0.08} bands={[{ a: 0, b: CRIT95, color: FAIR, opacity: 0.4 }, { a: CRIT95, b: 22, color: GAP, opacity: 0.7 }]} />
    <div style={{ position: "absolute", left: 140, top: 1392, width: 800, height: 4, background: alpha(C.text, 0.4) }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 1516, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 36, color: C.text }}>
      <span style={{ color: C.cyan }}>@</span>
      {HANDLE.slice(1)}
    </div>
    <Grade />
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
