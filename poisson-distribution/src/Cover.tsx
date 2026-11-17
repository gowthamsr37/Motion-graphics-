// Reel cover: THE POISSON DISTRIBUTION · explained in 2 minutes · customers-per-hour bars (average 4) with a clock.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop, Grade, Grain, Vignette } from "./components/Backdrop";
import { ClockGlyph } from "./components/Icons";
import { CountBars, poisDist } from "./components/Pois";
import { EVT, HI, RATE } from "./scenes/S1Hook";
import { alpha, glowText, HANDLE, theme } from "./theme";

const C = theme.colors;

export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Backdrop a={C.cyan} b={C.violet} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.03em" }}>
      <div style={{ fontSize: 96, color: C.text }}>THE</div>
      <div style={{ marginTop: 14, fontSize: 176, background: `linear-gradient(90deg, ${EVT}, ${RATE})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 30px ${alpha(RATE, 0.45)})` }}>POISSON</div>
      <div style={{ marginTop: 10, fontSize: 92, color: C.text }}>DISTRIBUTION</div>
      <div style={{ marginTop: 30, fontSize: 50, fontWeight: 700, color: C.text, letterSpacing: "0.01em" }}>
        explained in <span style={{ color: C.yellow, textShadow: glowText(C.yellow, 0.5) }}>2 minutes</span>
      </div>
    </div>
    <div style={{ position: "absolute", left: 90, top: 900, width: 900, height: 560, boxSizing: "border-box", borderRadius: 36, background: "linear-gradient(180deg, rgba(26,40,98,0.9), rgba(14,24,64,0.9))", border: `2px solid ${C.edge}` }} />
    <div style={{ position: "absolute", left: 140, top: 940, display: "flex", alignItems: "center", gap: 14 }}>
      <ClockGlyph size={56} color={RATE} />
      <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.16em", color: RATE }}>CUSTOMERS PER HOUR · AVERAGE 4</div>
    </div>
    <CountBars vals={poisDist(4, 11)} x0={150} x1={930} base={1360} h={300} scaleMax={0.2} color={EVT} hi={{ 3: HI, 4: HI }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 1516, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 36, color: C.text }}>
      <span style={{ color: C.cyan }}>@</span>
      {HANDLE.slice(1)}
    </div>
    <Grade />
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
