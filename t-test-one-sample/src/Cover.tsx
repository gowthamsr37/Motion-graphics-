// Reel cover: FORMULA · CALCULATION · t TABLE tag · THE ONE-SAMPLE t-TEST explained step by step · SAME −2, DIFFERENT
// ANSWER? with the bottle, z = −2 → REJECT vs t = −2 → FAIL TO REJECT (df 8), + INTERVIEW-READY DEFINITION, handle.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop, Grade, Grain, Vignette } from "./components/Backdrop";
import { BB, SE, TAIL } from "./components/TKit";
import { Bottle, CLAIM, MEAN } from "./components/ZKit";
import { alpha, glowText, HANDLE, theme } from "./theme";

const C = theme.colors;

const Row: React.FC<{ test: string; c: string; detail: string; verdict: string; vc: string }> = ({ test, c, detail, verdict, vc }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 24px", borderRadius: 20, background: "rgba(10,18,52,0.9)", border: `2px solid ${alpha(c, 0.7)}`, whiteSpace: "nowrap" }}>
    <span style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 34, color: c }}>{test}</span>
    <span style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 28, color: C.text }}>{detail}</span>
    <span style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: vc }}>{verdict}</span>
  </div>
);

export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Backdrop a={C.cyan} b={C.violet} />
    <div style={{ position: "absolute", left: 540, top: 290, transform: "translate(-50%, -50%)", padding: "10px 26px", borderRadius: 999, background: alpha(SE, 0.18), border: `2px solid ${SE}`, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 26, letterSpacing: "0.2em", color: C.text, whiteSpace: "nowrap" }}>FORMULA · CALCULATION · t TABLE</div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 350, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.03em" }}>
      <div style={{ fontSize: 78, color: C.text }}>THE ONE-SAMPLE</div>
      <div style={{ fontSize: 200, background: `linear-gradient(90deg, ${CLAIM}, ${MEAN})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 30px ${alpha(MEAN, 0.5)})` }}>
        <span style={{ fontStyle: "italic" }}>t</span>-TEST
      </div>
      <div style={{ marginTop: 18, fontSize: 48, fontWeight: 700, color: C.text }}>
        explained <span style={{ color: C.yellow, textShadow: glowText(C.yellow, 0.5) }}>step by step</span>
      </div>
    </div>
    <div style={{ position: "absolute", left: 90, top: 790, width: 900, height: 560, boxSizing: "border-box", borderRadius: 36, background: "linear-gradient(180deg, rgba(26,40,98,0.9), rgba(14,24,64,0.9))", border: `2px solid ${C.edge}` }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 830, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 46, color: C.text }}>
      SAME −2, <span style={{ color: TAIL, textShadow: glowText(TAIL, 0.5) }}>DIFFERENT ANSWER</span>
      <span style={{ color: C.yellow }}>?</span>
    </div>
    <div style={{ position: "absolute", left: 140, top: 930 }}>
      <Bottle w={140} level={0.86} mark={0.9} label="200" />
    </div>
    <div style={{ position: "absolute", left: 330, top: 980, display: "flex", flexDirection: "column", gap: 22 }}>
      <Row test="z" c={CLAIM} detail="−2 vs ±1.96" verdict="REJECT" vc={TAIL} />
      <Row test="t" c={BB} detail="−2 vs ±2.306" verdict="FAIL TO REJECT" vc={SE} />
      <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.16em", color: C.dim, paddingLeft: 10 }}>9 BOTTLES · SIGMA UNKNOWN · df 8</div>
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
