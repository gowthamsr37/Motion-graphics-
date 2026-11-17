// Reel cover: THE UNIFORM DISTRIBUTION · explained in 2 minutes · six equal dice bars (discrete) and a flat rectangle (continuous).
import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop, Grade, Grain, Vignette } from "./components/Backdrop";
import { Die } from "./components/Prob";
import { CONT, DISC } from "./scenes/S1Hook";
import { alpha, glowText, HANDLE, theme } from "./theme";

const C = theme.colors;

export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Backdrop a={C.cyan} b={C.green} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.03em" }}>
      <div style={{ fontSize: 96, color: C.text }}>THE</div>
      <div style={{ marginTop: 14, fontSize: 168, background: `linear-gradient(90deg, ${DISC}, ${CONT})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 30px ${alpha(CONT, 0.45)})` }}>UNIFORM</div>
      <div style={{ marginTop: 10, fontSize: 92, color: C.text }}>DISTRIBUTION</div>
      <div style={{ marginTop: 30, fontSize: 50, fontWeight: 700, color: C.text, letterSpacing: "0.01em" }}>
        explained in <span style={{ color: C.yellow, textShadow: glowText(C.yellow, 0.5) }}>2 minutes</span>
      </div>
    </div>
    <div style={{ position: "absolute", left: 90, top: 900, width: 900, height: 560, boxSizing: "border-box", borderRadius: 36, background: "linear-gradient(180deg, rgba(26,40,98,0.9), rgba(14,24,64,0.9))", border: `2px solid ${C.edge}` }} />
    {Array.from({ length: 6 }, (_, i) => (
      <React.Fragment key={i}>
        <div style={{ position: "absolute", left: 140 + i * 62, top: 1110, width: 52, height: 220, borderRadius: "8px 8px 2px 2px", background: alpha(DISC, 0.5), border: `3px solid ${DISC}`, boxSizing: "border-box" }} />
        <div style={{ position: "absolute", left: 140 + i * 62 + 4, top: 1350 }}>
          <Die value={i + 1} size={44} color={DISC} />
        </div>
      </React.Fragment>
    ))}
    <div style={{ position: "absolute", left: 590, top: 1110, width: 340, height: 220, borderRadius: "10px 10px 2px 2px", background: alpha(CONT, 0.3), border: `4px solid ${CONT}`, boxSizing: "border-box" }} />
    <div style={{ position: "absolute", left: 130, top: 1331, width: 390, height: 3, background: alpha(C.text, 0.4) }} />
    <div style={{ position: "absolute", left: 570, top: 1331, width: 380, height: 3, background: alpha(C.text, 0.4) }} />
    <div style={{ position: "absolute", left: 325, top: 980, transform: "translateX(-50%)", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.16em", color: DISC, whiteSpace: "nowrap" }}>DISCRETE</div>
    <div style={{ position: "absolute", left: 760, top: 980, transform: "translateX(-50%)", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.16em", color: CONT, whiteSpace: "nowrap" }}>CONTINUOUS</div>
    <div style={{ position: "absolute", left: 760, top: 1360, transform: "translateX(-50%)", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 24, color: C.dim, whiteSpace: "nowrap" }}>0 … 10 min</div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1516, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 36, color: C.text }}>
      <span style={{ color: C.cyan }}>@</span>
      {HANDLE.slice(1)}
    </div>
    <Grade />
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
