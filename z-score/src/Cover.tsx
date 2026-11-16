// Reel cover: WHAT IS A Z-SCORE? · explained in 2 minutes · Maths 80 vs Science 70 placed on one z-axis (0.5 vs 2).
import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop, Grade, Grain, Vignette } from "./components/Backdrop";
import { Axis, Bell, type BellGeo, curveY, vx } from "./components/Bell";
import { Crown } from "./components/Icons";
import { SUBJ } from "./scenes/S1Hook";
import { alpha, glowText, HANDLE, theme } from "./theme";

const C = theme.colors;
const G: BellGeo = { x0: 130, x1: 950, vmin: -3.6, vmax: 3.6, base: 1300, peakH: 270, sigmaRef: 1 };

export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Backdrop a={C.green} b={C.violet} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.03em" }}>
      <div style={{ fontSize: 100, color: C.text }}>WHAT IS A</div>
      <div style={{ marginTop: 18, fontSize: 166, background: `linear-gradient(90deg, ${C.green}, ${C.cyan})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 30px ${alpha(C.green, 0.45)})` }}>Z-SCORE?</div>
      <div style={{ marginTop: 30, fontSize: 52, fontWeight: 700, color: C.text, letterSpacing: "0.01em" }}>
        explained in <span style={{ color: C.yellow, textShadow: glowText(C.yellow, 0.5) }}>2 minutes</span>
      </div>
    </div>

    <div style={{ position: "absolute", left: 90, top: 880, width: 900, height: 560, boxSizing: "border-box", borderRadius: 36, background: "linear-gradient(180deg, rgba(26,40,98,0.9), rgba(14,24,64,0.9))", border: `2px solid ${C.edge}` }} />
    <Bell g={G} mu={0} sigma={1} color={C.text} fill={0.07} width={5} />
    <Axis g={G} ticks={[-3, -2, -1, 0, 1, 2, 3].map((v) => ({ v, label: v === 0 ? "0" : `${v > 0 ? "+" : "-"}${Math.abs(v)}`, big: true }))} />
    {[
      { z: 0.5, label: "MATHS 80", c: SUBJ.maths, up: 95 },
      { z: 2, label: "SCIENCE 70", c: SUBJ.science, up: 120 },
    ].map((m) => {
      const y = curveY(G, 0, 1, m.z);
      return (
        <React.Fragment key={m.label}>
          <div style={{ position: "absolute", left: vx(G, m.z) - 3, top: y, height: G.base - y, width: 6, background: m.c, borderRadius: 3 }} />
          <div style={{ position: "absolute", left: vx(G, m.z) - 18, top: y - 18, width: 36, height: 36, borderRadius: 18, background: m.c, boxShadow: `0 0 20px ${m.c}` }} />
          <div style={{ position: "absolute", left: vx(G, m.z), top: y - m.up, transform: "translate(-50%, -50%)", padding: "6px 18px", borderRadius: 16, background: "#0A1440", border: `3px solid ${m.c}`, textAlign: "center", whiteSpace: "nowrap" }}>
            <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.14em", color: m.c }}>{m.label}</div>
            <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 34, color: C.text }}>z = {m.z}</div>
          </div>
        </React.Fragment>
      );
    })}
    <div style={{ position: "absolute", left: vx(G, 2) - 34, top: curveY(G, 0, 1, 2) - 240 }}>
      <Crown size={68} color={C.yellow} />
    </div>

    <div style={{ position: "absolute", left: 0, right: 0, top: 1500, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 36, color: C.text }}>
      <span style={{ color: C.cyan }}>@</span>
      {HANDLE.slice(1)}
    </div>
    <Grade />
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
