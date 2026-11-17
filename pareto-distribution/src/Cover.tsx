// Reel cover: THE PARETO DISTRIBUTION · explained in 2 minutes · the 10 customer-group bars (exact 80/20 shares) with
// the top two orange, and "TOP 20% = 80% OF SALES", @curious_datascientist.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop, Grade, Grain, Vignette } from "./components/Backdrop";
import { DECILES } from "./data";
import { AVG, FEW, MANY } from "./scenes/S1Hook";
import { alpha, glowText, HANDLE, theme } from "./theme";

const C = theme.colors;

export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Backdrop a={C.orange} b={C.violet} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.03em" }}>
      <div style={{ fontSize: 96, color: C.text }}>THE</div>
      <div style={{ marginTop: 14, fontSize: 176, background: `linear-gradient(90deg, ${FEW}, ${AVG})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 30px ${alpha(FEW, 0.45)})` }}>PARETO</div>
      <div style={{ marginTop: 10, fontSize: 92, color: C.text }}>DISTRIBUTION</div>
      <div style={{ marginTop: 30, fontSize: 50, fontWeight: 700, color: C.text, letterSpacing: "0.01em" }}>
        explained in <span style={{ color: C.yellow, textShadow: glowText(C.yellow, 0.5) }}>2 minutes</span>
      </div>
    </div>
    <div style={{ position: "absolute", left: 90, top: 900, width: 900, height: 560, boxSizing: "border-box", borderRadius: 36, background: "linear-gradient(180deg, rgba(26,40,98,0.9), rgba(14,24,64,0.9))", border: `2px solid ${C.edge}` }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 950, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 52, color: C.text }}>
      <span style={{ color: FEW, textShadow: glowText(FEW, 0.5) }}>20%</span> OF CUSTOMERS
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1020, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 52, color: C.text }}>
      = <span style={{ color: FEW, textShadow: glowText(FEW, 0.5) }}>80%</span> OF SALES
    </div>
    {DECILES.map((d, k) => {
      const h = Math.max(6, (d / 75) * 250);
      const c = k < 2 ? FEW : MANY;
      return <div key={k} style={{ position: "absolute", left: 175 + k * 76, top: 1400 - h, width: 56, height: h, borderRadius: "8px 8px 2px 2px", background: alpha(c, k < 2 ? 0.75 : 0.45), border: `3px solid ${c}`, boxSizing: "border-box", boxShadow: k < 2 ? `0 0 20px ${alpha(FEW, 0.5)}` : "none" }} />;
    })}
    <div style={{ position: "absolute", left: 140, top: 1402, width: 800, height: 4, background: alpha(C.text, 0.4) }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 1516, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 36, color: C.text }}>
      <span style={{ color: C.cyan }}>@</span>
      {HANDLE.slice(1)}
    </div>
    <Grade />
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
