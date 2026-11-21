// Reel cover: FORMULA · CALCULATION · t TABLE tag · THE t-TEST explained step by step · DOES BRAND B REALLY LAST
// LONGER? with two batteries (7 h vs 10 h), the filled-in formula = 3 and a t TABLE df 8: 2.306 chip, + INTERVIEW-READY
// DEFINITION, @curious_datascientist.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop, Grade, Grain, Vignette } from "./components/Backdrop";
import { BatteryGlyph } from "./components/Prob";
import { BA, BB, SE, TAIL, TFormula } from "./components/TKit";
import { alpha, glowText, HANDLE, theme } from "./theme";

const C = theme.colors;

export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Backdrop a={C.cyan} b={C.violet} />
    <div style={{ position: "absolute", left: 540, top: 290, transform: "translate(-50%, -50%)", padding: "10px 26px", borderRadius: 999, background: alpha(SE, 0.18), border: `2px solid ${SE}`, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 26, letterSpacing: "0.2em", color: C.text, whiteSpace: "nowrap" }}>FORMULA · CALCULATION · t TABLE</div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 350, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.03em" }}>
      <div style={{ fontSize: 80, color: C.text }}>THE</div>
      <div style={{ fontSize: 210, background: `linear-gradient(90deg, ${BA}, ${BB})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 30px ${alpha(BB, 0.5)})` }}>
        <span style={{ fontStyle: "italic" }}>t</span>-TEST
      </div>
      <div style={{ marginTop: 18, fontSize: 48, fontWeight: 700, color: C.text }}>
        explained <span style={{ color: C.yellow, textShadow: glowText(C.yellow, 0.5) }}>step by step</span>
      </div>
    </div>
    <div style={{ position: "absolute", left: 90, top: 790, width: 900, height: 560, boxSizing: "border-box", borderRadius: 36, background: "linear-gradient(180deg, rgba(26,40,98,0.9), rgba(14,24,64,0.9))", border: `2px solid ${C.edge}` }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 830, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 44, color: C.text }}>
      DOES BRAND B <span style={{ color: BB, textShadow: glowText(BB, 0.5) }}>REALLY</span> LAST LONGER<span style={{ color: C.yellow }}>?</span>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 920, display: "flex", justifyContent: "center", gap: 90 }}>
      {[
        { n: "A", c: BA, h: 7, l: 7 / 12 },
        { n: "B", c: BB, h: 10, l: 10 / 12 },
      ].map((b) => (
        <div key={b.n} style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <BatteryGlyph size={100} color={b.c} level={b.l} />
          <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 36, color: C.text, lineHeight: 1.1 }}>
            BRAND {b.n}
            <br />
            <span style={{ fontFamily: theme.fonts.mono, color: b.c }}>{b.h} h</span>
          </div>
        </div>
      ))}
    </div>
    <div style={{ position: "absolute", left: 540, top: 1140, transform: "translate(-50%, -50%)" }}>
      <TFormula size={42} gap="10 − 7" sp="2.5" inner="1/5 + 1/5" result="3" />
    </div>
    <div style={{ position: "absolute", left: 540, top: 1290, transform: "translate(-50%, -50%)", display: "flex", alignItems: "center", gap: 14, padding: "10px 24px", borderRadius: 999, background: alpha(TAIL, 0.18), border: `2px solid ${TAIL}`, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 30, color: C.text, whiteSpace: "nowrap" }}>
      <span style={{ fontFamily: theme.fonts.body, fontSize: 20, letterSpacing: "0.16em", color: TAIL }}>t TABLE · df 8</span> 2.306
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
