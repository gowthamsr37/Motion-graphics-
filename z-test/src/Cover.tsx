// Reel cover: FULL CALCULATION tag · THE Z-TEST · "200 ml claimed, 198 measured: is the company cheating you?" with the
// bottle, the filled-in formula = −2, a Z TABLE 0.0228 chip, + INTERVIEW-READY DEFINITION, @curious_datascientist.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop, Grade, Grain, Vignette } from "./components/Backdrop";
import { Bottle, CLAIM, Formula, MEAN, SE, TAIL } from "./components/ZKit";
import { alpha, glowText, HANDLE, theme } from "./theme";

const C = theme.colors;

export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Backdrop a={C.violet} b={C.orange} />
    <div style={{ position: "absolute", left: 540, top: 290, transform: "translate(-50%, -50%)", padding: "10px 26px", borderRadius: 999, background: alpha(SE, 0.18), border: `2px solid ${SE}`, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 26, letterSpacing: "0.2em", color: C.text, whiteSpace: "nowrap" }}>FORMULA · CALCULATION · Z TABLE</div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 350, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.03em" }}>
      <div style={{ fontSize: 80, color: C.text }}>THE</div>
      <div style={{ fontSize: 210, background: `linear-gradient(90deg, ${CLAIM}, ${MEAN})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 30px ${alpha(MEAN, 0.5)})` }}>Z-TEST</div>
      <div style={{ marginTop: 18, fontSize: 48, fontWeight: 700, color: C.text }}>
        explained <span style={{ color: C.yellow, textShadow: glowText(C.yellow, 0.5) }}>step by step</span>
      </div>
    </div>
    <div style={{ position: "absolute", left: 90, top: 790, width: 900, height: 560, boxSizing: "border-box", borderRadius: 36, background: "linear-gradient(180deg, rgba(26,40,98,0.9), rgba(14,24,64,0.9))", border: `2px solid ${C.edge}` }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 830, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 44, color: C.text }}>
      IS THE COMPANY <span style={{ color: TAIL, textShadow: glowText(TAIL, 0.5) }}>CHEATING</span> YOU<span style={{ color: C.yellow }}>?</span>
    </div>
    <div style={{ position: "absolute", left: 150, top: 920 }}>
      <Bottle w={150} level={0.86} mark={0.9} label="200" />
    </div>
    <div style={{ position: "absolute", left: 360, top: 960, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 26 }}>
      <Formula size={50} xb="198" mu="200" sig="10" n="100" result="−2" />
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 24px", borderRadius: 999, background: alpha(TAIL, 0.18), border: `2px solid ${TAIL}`, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 32, color: C.text, whiteSpace: "nowrap" }}>
        <span style={{ fontFamily: theme.fonts.body, fontSize: 20, letterSpacing: "0.16em", color: TAIL }}>Z TABLE</span> 0.0228
      </div>
    </div>
    <div style={{ position: "absolute", left: 540, top: 1420, transform: "translate(-50%, -50%)", padding: "8px 22px", borderRadius: 999, background: alpha(C.yellow, 0.16), border: `2px solid ${C.yellow}`, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.16em", color: C.text, whiteSpace: "nowrap" }}>+ INTERVIEW-READY DEFINITION</div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1500, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 36, color: C.text }}>
      <span style={{ color: C.cyan }}>@</span>
      {HANDLE.slice(1)}
    </div>
    <Grade />
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
