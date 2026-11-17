// Reel cover: THE CENTRAL LIMIT THEOREM · explained in 2 minutes · skewed salaries → the bell of averages.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop, Grade, Grain, Vignette } from "./components/Backdrop";
import { Bell, type BellGeo } from "./components/Bell";
import { Arrow } from "./components/Icons";
import { POP_BINS } from "./components/Salary";
import { AVG, RAW } from "./scenes/S1Hook";
import { alpha, glowText, HANDLE, theme } from "./theme";

const C = theme.colors;
const G: BellGeo = { x0: 590, x1: 930, vmin: -3.2, vmax: 3.2, base: 1330, peakH: 290, sigmaRef: 1 };
const MAXB = Math.max(...POP_BINS);

export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Backdrop a={C.green} b={C.orange} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 290, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.03em" }}>
      <div style={{ fontSize: 90, color: C.text }}>THE CENTRAL</div>
      <div style={{ marginTop: 14, fontSize: 104, color: C.text }}>LIMIT</div>
      <div style={{ marginTop: 14, fontSize: 132, background: `linear-gradient(90deg, ${AVG}, ${C.cyan})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 30px ${alpha(AVG, 0.45)})` }}>THEOREM</div>
      <div style={{ marginTop: 30, fontSize: 50, fontWeight: 700, color: C.text, letterSpacing: "0.01em" }}>
        explained in <span style={{ color: C.yellow, textShadow: glowText(C.yellow, 0.5) }}>2 minutes</span>
      </div>
    </div>
    <div style={{ position: "absolute", left: 90, top: 900, width: 900, height: 560, boxSizing: "border-box", borderRadius: 36, background: "linear-gradient(180deg, rgba(26,40,98,0.9), rgba(14,24,64,0.9))", border: `2px solid ${C.edge}` }} />
    {POP_BINS.slice(0, 12).map((v, i) => {
      const h = (v / MAXB) * 280;
      return <div key={i} style={{ position: "absolute", left: 140 + i * 30 + 2, top: 1330 - h, width: 26, height: h, borderRadius: "6px 6px 2px 2px", background: alpha(RAW, 0.5), border: `2px solid ${RAW}`, boxSizing: "border-box" }} />;
    })}
    <div style={{ position: "absolute", left: 130, top: 1331, width: 380, height: 3, background: alpha(C.text, 0.4) }} />
    <div style={{ position: "absolute", left: 510, top: 1180 }}>
      <Arrow size={60} color={C.text} />
    </div>
    <Bell g={G} mu={0} sigma={1} color={AVG} fill={0.3} width={5} />
    <div style={{ position: "absolute", left: G.x0 - 10, top: 1331, width: G.x1 - G.x0 + 20, height: 3, background: alpha(C.text, 0.4) }} />
    <div style={{ position: "absolute", left: 320, top: 1390, transform: "translateX(-50%)", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.16em", color: RAW, whiteSpace: "nowrap" }}>SKEWED DATA</div>
    <div style={{ position: "absolute", left: 760, top: 1390, transform: "translateX(-50%)", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.16em", color: AVG, whiteSpace: "nowrap" }}>ITS SAMPLE AVERAGES</div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1516, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 36, color: C.text }}>
      <span style={{ color: C.cyan }}>@</span>
      {HANDLE.slice(1)}
    </div>
    <Grade />
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
