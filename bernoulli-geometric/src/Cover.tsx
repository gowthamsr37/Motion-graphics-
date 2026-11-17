// Reel cover: BERNOULLI & GEOMETRIC · explained in 2 minutes · left: the two Bernoulli bars (0 = 5/6, 1 = 1/6);
// right: the geometric staircase for "rolls until the first six", @curious_datascientist.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop, Grade, Grain, Vignette } from "./components/Backdrop";
import { Die } from "./components/Prob";
import { GEO } from "./scenes/GeoBars";
import { NO, TRY, YES } from "./scenes/S1Hook";
import { alpha, glowText, HANDLE, theme } from "./theme";

const C = theme.colors;

export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Backdrop a={C.green} b={C.cyan} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 320, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.03em" }}>
      <div style={{ fontSize: 132, background: `linear-gradient(90deg, ${YES}, ${TRY})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 30px ${alpha(YES, 0.45)})` }}>BERNOULLI</div>
      <div style={{ marginTop: 14, fontSize: 92, color: C.text }}>
        &amp; <span style={{ color: TRY }}>GEOMETRIC</span>
      </div>
      <div style={{ marginTop: 34, fontSize: 50, fontWeight: 700, color: C.text, letterSpacing: "0.01em" }}>
        explained in <span style={{ color: C.yellow, textShadow: glowText(C.yellow, 0.5) }}>2 minutes</span>
      </div>
    </div>
    <div style={{ position: "absolute", left: 90, top: 860, width: 900, height: 600, boxSizing: "border-box", borderRadius: 36, background: "linear-gradient(180deg, rgba(26,40,98,0.9), rgba(14,24,64,0.9))", border: `2px solid ${C.edge}` }} />
    <div style={{ position: "absolute", left: 540, top: 950, transform: "translate(-50%, -50%)" }}>
      <Die value={6} size={110} color={YES} glow={1} />
    </div>
    {/* Bernoulli: two bars */}
    <div style={{ position: "absolute", left: 140, top: 1060, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.14em", color: YES }}>ONE TRY</div>
    {[
      { h: 250, c: NO, k: "0" },
      { h: 50, c: YES, k: "1" },
    ].map((b, i) => (
      <React.Fragment key={b.k}>
        <div style={{ position: "absolute", left: 160 + i * 110, top: 1360 - b.h, width: 80, height: b.h, borderRadius: "10px 10px 3px 3px", background: alpha(b.c, 0.6), border: `3px solid ${b.c}`, boxSizing: "border-box" }} />
        <div style={{ position: "absolute", left: 200 + i * 110, top: 1392, transform: "translate(-50%, -50%)", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 30, color: b.c }}>{b.k}</div>
      </React.Fragment>
    ))}
    <div style={{ position: "absolute", left: 420, top: 1100, width: 3, height: 300, background: alpha("#F3F7FF", 0.15) }} />
    {/* geometric: the staircase */}
    <div style={{ position: "absolute", left: 470, top: 1060, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.14em", color: TRY }}>TRIES UNTIL THE FIRST SIX</div>
    {GEO.slice(0, 10).map((g, i) => {
      const h = (g / GEO[0]) * 250;
      return <div key={i} style={{ position: "absolute", left: 470 + i * 48, top: 1360 - h, width: 38, height: h, borderRadius: "8px 8px 2px 2px", background: alpha(i === 0 ? YES : TRY, 0.55), border: `3px solid ${i === 0 ? YES : TRY}`, boxSizing: "border-box" }} />;
    })}
    <div style={{ position: "absolute", left: 140, top: 1362, width: 800, height: 4, background: alpha(C.text, 0.4) }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 1516, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 36, color: C.text }}>
      <span style={{ color: C.cyan }}>@</span>
      {HANDLE.slice(1)}
    </div>
    <Grade />
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
