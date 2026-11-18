// Reel cover: HYPOTHESIS TESTING · explained in 2 minutes · "9 HEADS IN 10: RIGGED OR LUCK?" with the coin row and
// the H0 / H1 chips, @curious_datascientist.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop, Grade, Grain, Vignette } from "./components/Backdrop";
import { Coin } from "./components/Prob";
import { ALT, FLIPS, NULLC } from "./scenes/S1Hook";
import { alpha, glowText, HANDLE, theme } from "./theme";

const C = theme.colors;

export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Backdrop a={C.cyan} b={C.orange} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.03em" }}>
      <div style={{ fontSize: 126, background: `linear-gradient(90deg, ${NULLC}, ${ALT})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 30px ${alpha(ALT, 0.45)})` }}>HYPOTHESIS</div>
      <div style={{ marginTop: 14, fontSize: 126, color: C.text }}>TESTING</div>
      <div style={{ marginTop: 34, fontSize: 50, fontWeight: 700, color: C.text, letterSpacing: "0.01em" }}>
        explained in <span style={{ color: C.yellow, textShadow: glowText(C.yellow, 0.5) }}>2 minutes</span>
      </div>
    </div>
    <div style={{ position: "absolute", left: 90, top: 860, width: 900, height: 600, boxSizing: "border-box", borderRadius: 36, background: "linear-gradient(180deg, rgba(26,40,98,0.9), rgba(14,24,64,0.9))", border: `2px solid ${C.edge}` }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 910, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 48, color: C.text }}>
      9 HEADS IN 10: <span style={{ color: ALT, textShadow: glowText(ALT, 0.5) }}>RIGGED</span> OR <span style={{ color: NULLC, textShadow: glowText(NULLC, 0.5) }}>LUCK</span>
      <span style={{ color: C.yellow }}>?</span>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1010, display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap", padding: "0 200px" }}>
      {FLIPS.map((f, i) => <Coin key={i} side={f} size={110} />)}
    </div>
    {[
      { t: "H0  NOTHING'S GOING ON", c: NULLC, x: 310 },
      { t: "H1  SOMETHING IS", c: ALT, x: 770 },
    ].map((k) => (
      <div key={k.t} style={{ position: "absolute", left: k.x, top: 1370, transform: "translate(-50%, -50%)", padding: "10px 22px", borderRadius: 999, background: alpha(k.c, 0.18), border: `3px solid ${k.c}`, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 24, color: C.text, whiteSpace: "pre" }}>{k.t}</div>
    ))}
    <div style={{ position: "absolute", left: 0, right: 0, top: 1516, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 36, color: C.text }}>
      <span style={{ color: C.cyan }}>@</span>
      {HANDLE.slice(1)}
    </div>
    <Grade />
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
