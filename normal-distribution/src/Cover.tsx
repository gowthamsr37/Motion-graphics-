// Reel cover: WHAT IS THE NORMAL DISTRIBUTION? · explained in 2 minutes · the bell with its 68 / 95 / 99.7 bands.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop, Grade, Grain, Vignette } from "./components/Backdrop";
import { Axis, Bell, type BellGeo } from "./components/Bell";
import { Bracket, ruleBands, SD_COL, SD_TICKS } from "./scenes/S5Rule";
import { alpha, glowText, HANDLE, theme } from "./theme";

const C = theme.colors;
const G: BellGeo = { x0: 130, x1: 950, vmin: -3.6, vmax: 3.6, base: 1170, peakH: 250, sigmaRef: 1 };

export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Backdrop a={C.cyan} b={C.violet} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.03em" }}>
      <div style={{ fontSize: 84, color: C.text }}>WHAT IS THE</div>
      <div style={{ marginTop: 18, fontSize: 132, background: `linear-gradient(90deg, ${C.cyan}, ${C.violet})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 30px ${alpha(C.violet, 0.45)})` }}>NORMAL</div>
      <div style={{ marginTop: 6, fontSize: 98, color: C.text }}>DISTRIBUTION?</div>
      <div style={{ marginTop: 30, fontSize: 50, fontWeight: 700, color: C.text, letterSpacing: "0.01em" }}>
        explained in <span style={{ color: C.yellow, textShadow: glowText(C.yellow, 0.5) }}>2 minutes</span>
      </div>
    </div>

    <div style={{ position: "absolute", left: 90, top: 860, width: 900, height: 600, boxSizing: "border-box", borderRadius: 36, background: "linear-gradient(180deg, rgba(26,40,98,0.9), rgba(14,24,64,0.9))", border: `2px solid ${C.edge}` }} />
    <Bell g={G} mu={0} sigma={1} color={C.text} fill={0.08} width={5} bands={ruleBands([1, 1, 1])} />
    <Axis g={G} ticks={SD_TICKS} />
    {["68%", "95%", "99.7%"].map((l, k) => (
      <Bracket key={l} g={G} a={-(k + 1)} b={k + 1} y={1266 + k * 62} p={1} color={SD_COL[k]} label={l} />
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
