// Reel cover: THE EXPONENTIAL DISTRIBUTION · explained in 2 minutes · the waiting-time curve (average 15 min) with the
// short waits shaded green, a stopwatch, @curious_datascientist.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop, Grade, Grain, Vignette } from "./components/Backdrop";
import { ExpCurve, type ExpGeo, MinAxis, Stopwatch } from "./components/Exp";
import { GAP, RATE, SHORT } from "./scenes/S1Hook";
import { alpha, glowText, HANDLE, theme } from "./theme";

const C = theme.colors;
const G: ExpGeo = { x0: 160, x1: 920, tmax: 60, base: 1350, h: 300 };

export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Backdrop a={C.cyan} b={C.violet} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.03em" }}>
      <div style={{ fontSize: 96, color: C.text }}>THE</div>
      <div style={{ marginTop: 14, fontSize: 118, background: `linear-gradient(90deg, ${GAP}, ${RATE})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 30px ${alpha(RATE, 0.45)})`, whiteSpace: "nowrap" }}>EXPONENTIAL</div>
      <div style={{ marginTop: 10, fontSize: 92, color: C.text }}>DISTRIBUTION</div>
      <div style={{ marginTop: 30, fontSize: 50, fontWeight: 700, color: C.text, letterSpacing: "0.01em" }}>
        explained in <span style={{ color: C.yellow, textShadow: glowText(C.yellow, 0.5) }}>2 minutes</span>
      </div>
    </div>
    <div style={{ position: "absolute", left: 90, top: 900, width: 900, height: 560, boxSizing: "border-box", borderRadius: 36, background: "linear-gradient(180deg, rgba(26,40,98,0.9), rgba(14,24,64,0.9))", border: `2px solid ${C.edge}` }} />
    <div style={{ position: "absolute", left: 140, top: 940, display: "flex", alignItems: "center", gap: 14 }}>
      <Stopwatch size={56} color={GAP} frac={0.35} />
      <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.16em", color: GAP }}>WAITING TIME · AVERAGE 15 MIN</div>
    </div>
    <ExpCurve g={G} color={GAP} bands={[{ a: 0, b: 15, color: SHORT, opacity: 0.45 }]} />
    <MinAxis g={G} ticks={[0, 15, 30, 45, 60]} label="" hi={{ 15: RATE }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 1516, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 36, color: C.text }}>
      <span style={{ color: C.cyan }}>@</span>
      {HANDLE.slice(1)}
    </div>
    <Grade />
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
