// Reel cover: THE CENTRAL LIMIT THEOREM · explained in 2 minutes · a flat dice distribution turning into the bell of averages.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop, Grade, Grain, Vignette } from "./components/Backdrop";
import { AreaChart, BarChart, diceSumDist } from "./components/Clt";
import { Arrow } from "./components/Icons";
import { Die } from "./components/Prob";
import { MEANS, RAW } from "./scenes/S1Hook";
import { alpha, glowText, HANDLE, theme } from "./theme";

const C = theme.colors;
const D30 = diceSumDist(30);

export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Backdrop a={C.green} b={C.cyan} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 290, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.03em" }}>
      <div style={{ fontSize: 90, color: C.text }}>THE CENTRAL</div>
      <div style={{ marginTop: 14, fontSize: 104, color: C.text }}>LIMIT</div>
      <div style={{ marginTop: 14, fontSize: 132, background: `linear-gradient(90deg, ${MEANS}, ${RAW})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 30px ${alpha(MEANS, 0.45)})` }}>THEOREM</div>
      <div style={{ marginTop: 30, fontSize: 50, fontWeight: 700, color: C.text, letterSpacing: "0.01em" }}>
        explained in <span style={{ color: C.yellow, textShadow: glowText(C.yellow, 0.5) }}>2 minutes</span>
      </div>
    </div>
    <div style={{ position: "absolute", left: 90, top: 900, width: 900, height: 560, boxSizing: "border-box", borderRadius: 36, background: "linear-gradient(180deg, rgba(26,40,98,0.9), rgba(14,24,64,0.9))", border: `2px solid ${C.edge}` }} />
    <div style={{ position: "absolute", left: 150, top: 960, display: "flex", gap: 10 }}>
      <Die value={2} size={60} color={RAW} />
      <Die value={5} size={60} color={RAW} />
    </div>
    <BarChart x0={140} x1={440} base={1330} h={150} vals={[1, 1, 1, 1, 1, 1]} color={RAW} gap={0.18} />
    <div style={{ position: "absolute", left: 130, top: 1331, width: 320, height: 3, background: alpha(C.text, 0.4) }} />
    <div style={{ position: "absolute", left: 470, top: 1210 }}>
      <Arrow size={70} color={C.text} />
    </div>
    <AreaChart x0={580} x1={940} base={1330} h={300} xs={D30.map((_, k) => k / (D30.length - 1))} vals={D30} color={MEANS} />
    <div style={{ position: "absolute", left: 570, top: 1331, width: 380, height: 3, background: alpha(C.text, 0.4) }} />
    <div style={{ position: "absolute", left: 290, top: 1390, transform: "translateX(-50%)", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.16em", color: RAW, whiteSpace: "nowrap" }}>ONE DICE</div>
    <div style={{ position: "absolute", left: 760, top: 1390, transform: "translateX(-50%)", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.16em", color: MEANS, whiteSpace: "nowrap" }}>AVERAGES OF 30</div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1516, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 36, color: C.text }}>
      <span style={{ color: C.cyan }}>@</span>
      {HANDLE.slice(1)}
    </div>
    <Grade />
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
