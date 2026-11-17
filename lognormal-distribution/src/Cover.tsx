// Reel cover: THE LOG-NORMAL DISTRIBUTION · explained in 2 minutes · a skewed curve (normal scale) → arrow → a bell
// (log scale), @curious_datascientist.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop, Grade, Grain, Vignette } from "./components/Backdrop";
import { CurveIcon } from "./components/Explain";
import { Arrow } from "./components/Icons";
import { bell, skew } from "./scenes/S2Definition";
import { GROW, LOG, RAW } from "./scenes/S1Hook";
import { alpha, glowText, HANDLE, theme } from "./theme";

const C = theme.colors;

export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Backdrop a={C.orange} b={C.violet} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.03em" }}>
      <div style={{ fontSize: 96, color: C.text }}>THE</div>
      <div style={{ marginTop: 14, fontSize: 128, background: `linear-gradient(90deg, ${RAW}, ${LOG})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 30px ${alpha(LOG, 0.45)})`, whiteSpace: "nowrap" }}>LOG-NORMAL</div>
      <div style={{ marginTop: 10, fontSize: 92, color: C.text }}>DISTRIBUTION</div>
      <div style={{ marginTop: 30, fontSize: 50, fontWeight: 700, color: C.text, letterSpacing: "0.01em" }}>
        explained in <span style={{ color: C.yellow, textShadow: glowText(C.yellow, 0.5) }}>2 minutes</span>
      </div>
    </div>
    <div style={{ position: "absolute", left: 90, top: 900, width: 900, height: 560, boxSizing: "border-box", borderRadius: 36, background: "linear-gradient(180deg, rgba(26,40,98,0.9), rgba(14,24,64,0.9))", border: `2px solid ${C.edge}` }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 960, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 44, color: C.text }}>
      SKEWED? <span style={{ color: GROW, textShadow: glowText(GROW, 0.5) }}>TAKE THE LOG.</span>
    </div>
    <div style={{ position: "absolute", left: 150, top: 1110 }}>
      <CurveIcon color={RAW} f={skew} w={300} h={200} />
      <div style={{ marginTop: 16, textAlign: "center", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.14em", color: RAW }}>NORMAL SCALE</div>
    </div>
    <div style={{ position: "absolute", left: 492, top: 1190 }}>
      <Arrow size={96} color={GROW} />
    </div>
    <div style={{ position: "absolute", left: 630, top: 1110 }}>
      <CurveIcon color={LOG} f={bell} w={300} h={200} />
      <div style={{ marginTop: 16, textAlign: "center", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.14em", color: LOG }}>LOG SCALE</div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1516, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 36, color: C.text }}>
      <span style={{ color: C.cyan }}>@</span>
      {HANDLE.slice(1)}
    </div>
    <Grade />
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
