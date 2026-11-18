// Reel cover: CONFIDENCE INTERVALS · explained simply · "52% ± 3%: WHAT DOES IT MEAN?" with the 49–55% range on a
// line and an INTERVIEW-READY tag, @curious_datascientist.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop, Grade, Grain, Vignette } from "./components/Backdrop";
import { type Line, lx } from "./components/CI";
import { EST, RANGE, TRUE } from "./scenes/S1Hook";
import { alpha, glowText, HANDLE, theme } from "./theme";

const C = theme.colors;
const G: Line = { x0: 190, x1: 890, vmin: 44, vmax: 60 };

export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Backdrop a={C.cyan} b={C.violet} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 290, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.03em" }}>
      <div style={{ fontSize: 124, background: `linear-gradient(90deg, ${EST}, ${RANGE})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 30px ${alpha(RANGE, 0.45)})` }}>CONFIDENCE</div>
      <div style={{ marginTop: 14, fontSize: 124, color: C.text }}>INTERVALS</div>
      <div style={{ marginTop: 34, fontSize: 50, fontWeight: 700, color: C.text, letterSpacing: "0.01em" }}>
        explained <span style={{ color: C.yellow, textShadow: glowText(C.yellow, 0.5) }}>simply</span>
      </div>
    </div>
    <div style={{ position: "absolute", left: 90, top: 860, width: 900, height: 560, boxSizing: "border-box", borderRadius: 36, background: "linear-gradient(180deg, rgba(26,40,98,0.9), rgba(14,24,64,0.9))", border: `2px solid ${C.edge}` }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 900, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 112, lineHeight: 1, color: C.text, textShadow: glowText(EST, 0.4) }}>
      52% <span style={{ color: RANGE, textShadow: glowText(RANGE, 0.6) }}>± 3%</span>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1040, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 46, color: C.text }}>
      WHAT DOES IT <span style={{ color: C.yellow, textShadow: glowText(C.yellow, 0.5) }}>MEAN?</span>
    </div>
    <div style={{ position: "absolute", left: G.x0 - 10, top: 1260, width: G.x1 - G.x0 + 20, height: 4, background: alpha(C.text, 0.4) }} />
    {[44, 49, 52, 55, 60].map((t) => (
      <div key={t} style={{ position: "absolute", left: lx(G, t), top: 1300, transform: "translate(-50%, -50%)", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 26, color: t === 49 || t === 55 ? RANGE : C.dim }}>{t}%</div>
    ))}
    <div style={{ position: "absolute", left: lx(G, 49), top: 1193, width: lx(G, 55) - lx(G, 49), height: 14, borderRadius: 7, background: RANGE, boxShadow: `0 0 16px ${alpha(RANGE, 0.6)}` }} />
    {[49, 55].map((t) => <div key={t} style={{ position: "absolute", left: lx(G, t) - 3, top: 1179, width: 6, height: 42, borderRadius: 3, background: RANGE }} />)}
    <div style={{ position: "absolute", left: lx(G, 52) - 16, top: 1184, width: 32, height: 32, borderRadius: 16, background: EST, border: `3px solid ${C.text}`, boxShadow: `0 0 16px ${EST}` }} />
    <div style={{ position: "absolute", left: 540, top: 1360, transform: "translate(-50%, -50%)", padding: "8px 22px", borderRadius: 999, background: alpha(TRUE, 0.16), border: `2px solid ${TRUE}`, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.16em", color: C.text, whiteSpace: "nowrap" }}>+ INTERVIEW-READY DEFINITION</div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1516, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 36, color: C.text }}>
      <span style={{ color: C.cyan }}>@</span>
      {HANDLE.slice(1)}
    </div>
    <Grade />
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
