// Reel cover: 12 DISTRIBUTIONS · EVERY DATA SCIENTIST MUST KNOW · THE COMPLETE CHEAT SHEET chip · the twelve mini cards
// in a 3 × 4 grid · SAVE THIS bookmark, @curious_datascientist.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop, Grade, Grain, Vignette } from "./components/Backdrop";
import { BONUS, Bookmark, COUNTS, DIST, MEAS, MiniCard, TEST } from "./components/Guide";
import { alpha, glowText, HANDLE, theme } from "./theme";

const C = theme.colors;
const grad = `linear-gradient(90deg, ${COUNTS}, ${MEAS}, ${TEST})`;

export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Backdrop a={C.cyan} b={C.violet} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 170, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.03em" }}>
      <div style={{ fontSize: 200, lineHeight: 0.92, color: C.yellow, textShadow: glowText(C.yellow, 0.55) }}>12</div>
      <div style={{ marginTop: 6, fontSize: 96, whiteSpace: "nowrap" }}>
        <span style={{ background: grad, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 26px ${alpha(MEAS, 0.45)})` }}>DISTRIBUTIONS</span>
      </div>
      <div style={{ marginTop: 22, fontSize: 54, color: C.text, letterSpacing: "-0.01em" }}>EVERY DATA SCIENTIST</div>
      <div style={{ marginTop: 8, fontSize: 54, color: C.text, letterSpacing: "-0.01em" }}>
        MUST <span style={{ color: C.yellow, textShadow: glowText(C.yellow, 0.5) }}>KNOW</span>
      </div>
    </div>
    <div style={{ position: "absolute", left: 540, top: 728, transform: "translate(-50%, -50%)", padding: "10px 28px", borderRadius: 999, background: alpha(C.text, 0.08), border: `2px solid ${alpha(C.text, 0.35)}`, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 26, letterSpacing: "0.2em", color: C.text, whiteSpace: "nowrap" }}>
      THE COMPLETE CHEAT SHEET
    </div>
    {DIST.map((d, i) => (
      <MiniCard key={d.kind} d={d} x={230 + (i % 3) * 310} y={850 + Math.floor(i / 3) * 148} w={290} h={132} p={1} />
    ))}
    <div style={{ position: "absolute", left: 540, top: 1478, transform: "translate(-50%, -50%)", display: "flex", alignItems: "center", gap: 16, padding: "12px 30px", borderRadius: 999, background: alpha(BONUS, 0.2), border: `3px solid ${BONUS}`, boxShadow: `0 0 28px ${alpha(BONUS, 0.45)}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 38, color: C.text, whiteSpace: "nowrap" }}>
      <Bookmark size={40} color={BONUS} />
      SAVE THIS FOR LATER
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1566, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 36, color: C.text }}>
      <span style={{ color: C.cyan }}>@</span>
      {HANDLE.slice(1)}
    </div>
    <Grade />
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
