// Reel cover: THE BINOMIAL DISTRIBUTION · explained in 2 minutes · the 10-guess bars with right/wrong marks.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop, Grade, Grain, Vignette } from "./components/Backdrop";
import { Mark } from "./components/Motion";
import { BARS, FAIL, SUCC } from "./scenes/S1Hook";
import { binom } from "./scenes/S4Test";
import { alpha, glowText, HANDLE, theme } from "./theme";

const C = theme.colors;
const B = binom(10, 0.5);
const MAX = Math.max(...B);

export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Backdrop a={C.violet} b={C.green} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.03em" }}>
      <div style={{ fontSize: 96, color: C.text }}>THE</div>
      <div style={{ marginTop: 14, fontSize: 164, background: `linear-gradient(90deg, ${BARS}, ${SUCC})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 30px ${alpha(BARS, 0.45)})` }}>BINOMIAL</div>
      <div style={{ marginTop: 10, fontSize: 92, color: C.text }}>DISTRIBUTION</div>
      <div style={{ marginTop: 30, fontSize: 50, fontWeight: 700, color: C.text, letterSpacing: "0.01em" }}>
        explained in <span style={{ color: C.yellow, textShadow: glowText(C.yellow, 0.5) }}>2 minutes</span>
      </div>
    </div>
    <div style={{ position: "absolute", left: 90, top: 900, width: 900, height: 560, boxSizing: "border-box", borderRadius: 36, background: "linear-gradient(180deg, rgba(26,40,98,0.9), rgba(14,24,64,0.9))", border: `2px solid ${C.edge}` }} />
    <div style={{ position: "absolute", left: 160, top: 950, display: "flex", gap: 12 }}>
      {[true, true, false, true, true, true, false, true, false, true].map((ok, i) => (
        <Mark key={i} kind={ok ? "check" : "cross"} at={-30} size={44} color={ok ? SUCC : FAIL} width={9} />
      ))}
    </div>
    {B.map((v, k) => {
      const h = (v / MAX) * 300;
      return <div key={k} style={{ position: "absolute", left: 150 + k * 71 + 6, top: 1360 - h, width: 59, height: h, borderRadius: "8px 8px 2px 2px", background: alpha(k === 7 ? SUCC : BARS, 0.55), border: `3px solid ${k === 7 ? SUCC : BARS}`, boxSizing: "border-box" }} />;
    })}
    <div style={{ position: "absolute", left: 140, top: 1361, width: 800, height: 3, background: alpha(C.text, 0.4) }} />
    <div style={{ position: "absolute", left: 150 + 7 * 71 + 35, top: 1360 - (B[7] / MAX) * 300 - 30, transform: "translate(-50%, -50%)", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 26, color: C.text }}>7?</div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1516, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 36, color: C.text }}>
      <span style={{ color: C.cyan }}>@</span>
      {HANDLE.slice(1)}
    </div>
    <Grade />
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
