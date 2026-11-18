// Reel cover: THE p-VALUE · explained simply · "9 HEADS IN 10: RIGGED OR LUCK?" over the coin row, a p = 0.01 pill and
// an INTERVIEW-READY tag, @curious_datascientist.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop, Grade, Grain, Vignette } from "./components/Backdrop";
import { Coin } from "./components/Prob";
import { EXT, FLIPS, LINE, NULLC, PPill, PV } from "./scenes/S1Hook";
import { alpha, glowText, HANDLE, theme } from "./theme";

const C = theme.colors;

export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Backdrop a={C.violet} b={C.orange} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 280, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.03em" }}>
      <div style={{ fontSize: 96, color: C.text }}>THE</div>
      <div style={{ marginTop: 6, fontSize: 168, background: `linear-gradient(90deg, ${PV}, ${EXT})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 30px ${alpha(PV, 0.45)})` }}>
        <span style={{ fontStyle: "italic" }}>p</span>-VALUE
      </div>
      <div style={{ marginTop: 30, fontSize: 50, fontWeight: 700, color: C.text, letterSpacing: "0.01em" }}>
        explained <span style={{ color: C.yellow, textShadow: glowText(C.yellow, 0.5) }}>simply</span>
      </div>
    </div>
    <div style={{ position: "absolute", left: 90, top: 860, width: 900, height: 580, boxSizing: "border-box", borderRadius: 36, background: "linear-gradient(180deg, rgba(26,40,98,0.9), rgba(14,24,64,0.9))", border: `2px solid ${C.edge}` }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 900, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 48, color: C.text }}>
      9 HEADS IN 10: <span style={{ color: EXT, textShadow: glowText(EXT, 0.5) }}>RIGGED</span> OR <span style={{ color: NULLC, textShadow: glowText(NULLC, 0.5) }}>LUCK</span>
      <span style={{ color: C.yellow }}>?</span>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 990, display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap", padding: "0 200px" }}>
      {FLIPS.map((f, i) => <Coin key={i} side={f} size={100} />)}
    </div>
    <div style={{ position: "absolute", left: 540, top: 1300, transform: "translate(-50%, -50%)" }}>
      <PPill v="0.01" size={60} />
    </div>
    <div style={{ position: "absolute", left: 540, top: 1400, transform: "translate(-50%, -50%)", padding: "8px 22px", borderRadius: 999, background: alpha(LINE, 0.16), border: `2px solid ${LINE}`, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.16em", color: C.text, whiteSpace: "nowrap" }}>+ INTERVIEW-READY DEFINITION</div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1530, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 36, color: C.text }}>
      <span style={{ color: C.cyan }}>@</span>
      {HANDLE.slice(1)}
    </div>
    <Grade />
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
