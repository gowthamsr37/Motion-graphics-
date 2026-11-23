// Reel cover (stats house style, navy): WHY THE CASINO NEVER LOSES? in big type, the roulette wheel with the green zero
// glowing, "THE SECRET: 2.7%", THE LAW OF LARGE NUMBERS, SAVE THIS, @curious_datascientist (all inside the 3:4 grid crop).
import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop, Grade, Grain, Vignette } from "./components/Backdrop";
import { Wheel } from "./components/Casino";
import { Bookmark } from "./components/Guide";
import { alpha, glowText, HANDLE, theme } from "./theme";

const C = theme.colors;

export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Backdrop a={C.green} b={C.violet} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 290, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.0 }}>
      <div style={{ fontSize: 104, color: C.text }}>WHY THE CASINO</div>
      <div style={{ fontSize: 128, background: `linear-gradient(90deg, ${C.green}, ${C.yellow})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 24px ${alpha(C.green, 0.5)})` }}>
        NEVER LOSES<span style={{ WebkitTextFillColor: C.yellow }}>?</span>
      </div>
    </div>
    <div style={{ position: "absolute", left: 540, top: 880, transform: "translate(-50%, -50%)", filter: `drop-shadow(0 0 50px ${alpha(C.green, 0.4)})` }}>
      <Wheel r={230} rot={-8} ball={8} zeroGlow={1} />
    </div>
    <div style={{ position: "absolute", left: 830, top: 690, transform: "translate(-50%, -50%) rotate(8deg)", padding: "12px 26px", borderRadius: 20, background: C.green, boxShadow: `0 0 30px ${alpha(C.green, 0.7)}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.ink, lineHeight: 1, textAlign: "center" }}>
      THE SECRET:
      <div style={{ fontSize: 66 }}>2.7%</div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1160, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 58, letterSpacing: "0.02em", background: `linear-gradient(90deg, ${C.cyan}, ${C.violet}, ${C.orange})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>THE LAW OF LARGE NUMBERS</div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1250, textAlign: "center", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 38, color: C.text }}>
      short term: <span style={{ color: C.red }}>luck</span> · long term: <span style={{ color: C.green, textShadow: glowText(C.green, 0.4) }}>maths</span>
    </div>
    <div style={{ position: "absolute", left: 540, top: 1400, transform: "translate(-50%, -50%)", display: "flex", alignItems: "center", gap: 14, padding: "10px 30px", borderRadius: 999, background: alpha(C.green, 0.2), border: `3px solid ${C.green}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 32, color: C.text, whiteSpace: "nowrap" }}>
      <Bookmark size={34} color={C.green} />
      SAVE THIS ONE
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1490, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 38, color: C.text }}>
      <span style={{ color: C.cyan }}>@</span>
      {HANDLE.slice(1)}
    </div>
    <Grade />
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
