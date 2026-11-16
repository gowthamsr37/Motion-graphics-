// Reel cover: WHAT IS A PROBABILITY DISTRIBUTION? · explained in 2 minutes · two-dice bars (discrete) next to a curve
// with a shaded area (continuous).
import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop, Grade, Grain, Vignette } from "./components/Backdrop";
import { Bell, type BellGeo } from "./components/Bell";
import { Die, MiniBars } from "./components/Prob";
import { CONT, DISC, PROB } from "./scenes/S1Hook";
import { alpha, glowText, HANDLE, theme } from "./theme";

const C = theme.colors;
const TRI = [1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1].map((v) => v / 6);
const G: BellGeo = { x0: 570, x1: 930, vmin: -3.2, vmax: 3.2, base: 1330, peakH: 250, sigmaRef: 1 };

export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Backdrop a={C.cyan} b={C.violet} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 290, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.03em" }}>
      <div style={{ fontSize: 84, color: C.text }}>WHAT IS A</div>
      <div style={{ marginTop: 16, fontSize: 122, background: `linear-gradient(90deg, ${DISC}, ${PROB})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 30px ${alpha(PROB, 0.45)})` }}>PROBABILITY</div>
      <div style={{ marginTop: 6, fontSize: 96, color: C.text }}>DISTRIBUTION?</div>
      <div style={{ marginTop: 30, fontSize: 50, fontWeight: 700, color: C.text, letterSpacing: "0.01em" }}>
        explained in <span style={{ color: C.yellow, textShadow: glowText(C.yellow, 0.5) }}>2 minutes</span>
      </div>
    </div>

    <div style={{ position: "absolute", left: 90, top: 880, width: 900, height: 580, boxSizing: "border-box", borderRadius: 36, background: "linear-gradient(180deg, rgba(26,40,98,0.9), rgba(14,24,64,0.9))", border: `2px solid ${C.edge}` }} />
    <div style={{ position: "absolute", left: 140, top: 930, display: "flex", gap: 14 }}>
      <Die value={3} size={70} color={DISC} />
      <Die value={4} size={70} color={DISC} />
    </div>
    <div style={{ position: "absolute", left: 130, top: 1080 }}>
      <MiniBars w={380} h={250} vals={TRI} color={DISC} hi={[5]} hiColor={PROB} />
    </div>
    <div style={{ position: "absolute", left: G.x0 - 6, top: G.base - 2, width: G.x1 - G.x0 + 12, height: 3, background: alpha(C.text, 0.35) }} />
    <Bell g={G} mu={0} sigma={1} color={CONT} fill={0.15} width={5} bands={[{ a: -1, b: 1, color: PROB, opacity: 0.6 }]} />
    <div style={{ position: "absolute", left: 320, top: 1390, transform: "translateX(-50%)", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.2em", color: DISC }}>DISCRETE</div>
    <div style={{ position: "absolute", left: 750, top: 1390, transform: "translateX(-50%)", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.2em", color: CONT }}>CONTINUOUS</div>

    <div style={{ position: "absolute", left: 0, right: 0, top: 1516, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 36, color: C.text }}>
      <span style={{ color: C.cyan }}>@</span>
      {HANDLE.slice(1)}
    </div>
    <Grade />
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
