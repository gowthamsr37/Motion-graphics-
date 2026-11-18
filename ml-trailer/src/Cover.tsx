// Reel cover for the 100 DAYS OF MACHINE LEARNING series: a deep PLUM background (ML covers only; the statistics
// covers stay navy) with magenta and orange glows, NEW SERIES tag, 100 DAYS OF / MACHINE LEARNING, a neural network,
// COMING SOON, @curious_datascientist.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Grade, Grain, Vignette } from "./components/Backdrop";
import { ML, NeuralNet } from "./components/ML";
import { alpha, glowText, HANDLE, theme } from "./theme";

const C = theme.colors;

export const MLBackdrop: React.FC = () => (
  <AbsoluteFill style={{ background: `radial-gradient(120% 75% at 50% 30%, ${ML.bg2} 0%, ${ML.bg} 58%, #07020D 100%)` }}>
    <div style={{ position: "absolute", width: 1500, height: 1500, left: -700, top: -520, borderRadius: "50%", background: `radial-gradient(circle, ${alpha(ML.glowA, 0.3)} 0%, ${alpha(ML.glowA, 0.08)} 38%, transparent 62%)` }} />
    <div style={{ position: "absolute", width: 1500, height: 1500, right: -720, bottom: -420, borderRadius: "50%", background: `radial-gradient(circle, ${alpha(ML.glowB, 0.24)} 0%, ${alpha(ML.glowB, 0.06)} 40%, transparent 62%)` }} />
    <AbsoluteFill style={{ backgroundImage: `radial-gradient(${alpha("#F5C2FF", 0.14)} 1.6px, transparent 1.9px)`, backgroundSize: "54px 54px", WebkitMaskImage: "radial-gradient(ellipse 70% 55% at 50% 45%, black 20%, transparent 78%)", maskImage: "radial-gradient(ellipse 70% 55% at 50% 45%, black 20%, transparent 78%)" }} />
  </AbsoluteFill>
);

export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: ML.bg }}>
    <MLBackdrop />
    <div style={{ position: "absolute", left: 540, top: 250, transform: "translate(-50%, -50%)", padding: "10px 28px", borderRadius: 999, background: alpha(ML.glowA, 0.2), border: `2px solid ${ML.glowA}`, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 28, letterSpacing: "0.24em", color: ML.ink, whiteSpace: "nowrap" }}>NEW SERIES</div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.03em" }}>
      <div style={{ fontSize: 250, lineHeight: 0.95, color: C.yellow, textShadow: glowText(C.yellow, 0.6) }}>100</div>
      <div style={{ marginTop: 4, fontSize: 76, letterSpacing: "0.06em", color: ML.ink }}>DAYS OF</div>
      <div style={{ marginTop: 18, fontSize: 112, background: `linear-gradient(90deg, ${C.cyan}, #F0ABFC, ${ML.glowB})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 28px ${alpha(ML.glowA, 0.55)})` }}>MACHINE</div>
      <div style={{ fontSize: 112, background: `linear-gradient(90deg, ${C.cyan}, #F0ABFC, ${ML.glowB})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 28px ${alpha(ML.glowA, 0.55)})` }}>LEARNING</div>
    </div>
    <NeuralNet x={540} y={1150} w={640} h={330} at={-300} colors={[C.cyan, "#F0ABFC", "#F0ABFC", ML.glowB]} />
    <div style={{ position: "absolute", left: 540, top: 1410, transform: "translate(-50%, -50%)", padding: "14px 40px", borderRadius: 999, background: alpha(C.yellow, 0.16), border: `3px solid ${C.yellow}`, boxShadow: `0 0 30px ${alpha(C.yellow, 0.4)}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 46, letterSpacing: "0.04em", color: C.yellow, whiteSpace: "nowrap" }}>COMING SOON</div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1530, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 36, color: ML.ink }}>
      <span style={{ color: "#F0ABFC" }}>@</span>
      {HANDLE.slice(1)}
    </div>
    <Grade />
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
