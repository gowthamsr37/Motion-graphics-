// Reel cover: EVERY DISTRIBUTION YOU NEED · the complete cheat sheet · the twelve mini cards in a 3 × 4 grid ·
// SAVE THIS bookmark, @curious_datascientist.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop, Grade, Grain, Vignette } from "./components/Backdrop";
import { BONUS, Bookmark, COUNTS, DIST, MEAS, MiniCard, TEST } from "./components/Guide";
import { alpha, glowText, HANDLE, theme } from "./theme";

const C = theme.colors;

export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Backdrop a={C.cyan} b={C.violet} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 250, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.03em" }}>
      <div style={{ fontSize: 84, color: C.text }}>EVERY</div>
      <div style={{ marginTop: 8, fontSize: 112, background: `linear-gradient(90deg, ${COUNTS}, ${MEAS}, ${TEST})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 30px ${alpha(MEAS, 0.45)})`, whiteSpace: "nowrap" }}>DISTRIBUTION</div>
      <div style={{ marginTop: 8, fontSize: 84, color: C.text }}>YOU NEED</div>
      <div style={{ marginTop: 30, fontSize: 46, fontWeight: 700, color: C.text, letterSpacing: "0.01em" }}>
        the complete <span style={{ color: C.yellow, textShadow: glowText(C.yellow, 0.5) }}>cheat sheet</span>
      </div>
    </div>
    {DIST.map((d, i) => (
      <MiniCard key={d.kind} d={d} x={230 + (i % 3) * 310} y={830 + Math.floor(i / 3) * 150} w={290} h={134} p={1} />
    ))}
    <div style={{ position: "absolute", left: 540, top: 1470, transform: "translate(-50%, -50%)", display: "flex", alignItems: "center", gap: 16, padding: "12px 30px", borderRadius: 999, background: alpha(BONUS, 0.2), border: `3px solid ${BONUS}`, boxShadow: `0 0 28px ${alpha(BONUS, 0.45)}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 38, color: C.text, whiteSpace: "nowrap" }}>
      <Bookmark size={40} color={BONUS} />
      SAVE THIS
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1560, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 36, color: C.text }}>
      <span style={{ color: C.cyan }}>@</span>
      {HANDLE.slice(1)}
    </div>
    <Grade />
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
