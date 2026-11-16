// Reel cover: POPULATION vs SAMPLE · explained in 2 minutes · a big violet population circle with a few cyan dots picked
// into a small sample circle.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop, Grade, Grain, Vignette } from "./components/Backdrop";
import { discPoints, pick } from "./components/Sampling";
import { POP, SAMP } from "./scenes/S1Hook";
import { alpha, glowText, HANDLE, theme } from "./theme";

const C = theme.colors;
const PTS = discPoints(220, 200);
const PICKS = new Set(pick(220, 18, 7));
const SPTS = discPoints(18, 62);

export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Backdrop a={C.violet} b={C.cyan} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.03em" }}>
      <div style={{ fontSize: 118, color: POP, filter: `drop-shadow(0 0 24px ${alpha(POP, 0.45)})` }}>POPULATION</div>
      <div style={{ marginTop: 10, fontSize: 64, color: C.dim }}>vs</div>
      <div style={{ marginTop: 10, fontSize: 150, background: `linear-gradient(90deg, ${SAMP}, ${C.green})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 30px ${alpha(SAMP, 0.45)})` }}>SAMPLE</div>
      <div style={{ marginTop: 30, fontSize: 52, fontWeight: 700, color: C.text, letterSpacing: "0.01em" }}>
        explained in <span style={{ color: C.yellow, textShadow: glowText(C.yellow, 0.5) }}>2 minutes</span>
      </div>
    </div>
    <div style={{ position: "absolute", left: 90, top: 900, width: 900, height: 540, boxSizing: "border-box", borderRadius: 36, background: "linear-gradient(180deg, rgba(26,40,98,0.9), rgba(14,24,64,0.9))", border: `2px solid ${C.edge}` }} />
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", left: 0, top: 0 }}>
      <circle cx={360} cy={1170} r={225} fill={alpha(POP, 0.1)} stroke={POP} strokeWidth={4} />
      {PTS.map((p, i) => (
        <circle key={i} cx={360 + p.x} cy={1170 + p.y} r={6.5} fill={PICKS.has(i) ? alpha(SAMP, 0.25) : alpha("#B9A8FF", 0.75)} />
      ))}
      <circle cx={800} cy={1170} r={95} fill={alpha(SAMP, 0.14)} stroke={SAMP} strokeWidth={4} style={{ filter: `drop-shadow(0 0 12px ${SAMP})` }} />
      {SPTS.map((p, i) => (
        <circle key={i} cx={800 + p.x} cy={1170 + p.y} r={8} fill={SAMP} />
      ))}
      <path d="M600 1170 L680 1170" stroke={C.text} strokeWidth={6} strokeLinecap="round" />
      <path d="M668 1156 L686 1170 L668 1184" fill="none" stroke={C.text} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1516, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 36, color: C.text }}>
      <span style={{ color: C.cyan }}>@</span>
      {HANDLE.slice(1)}
    </div>
    <Grade />
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
