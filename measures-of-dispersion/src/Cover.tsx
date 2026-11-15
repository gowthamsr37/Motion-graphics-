// Reel cover: MEASURES OF DISPERSION · explained in 2 minutes, two bell curves (same average, different spread) and the page handle.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop, Grade, Grain, Vignette } from "./components/Backdrop";
import { alpha, BAT_A, BAT_B, glowText, HANDLE, theme } from "./theme";

const C = theme.colors;
const AX = 1300;
const X0 = 110;
const X1 = 970;
const MID = 540;
const bell = (s: number, peak: number) => {
  const pts: string[] = [];
  for (let x = X0; x <= X1; x += 5) pts.push(`${x === X0 ? "M" : "L"}${x} ${(AX - peak * Math.exp(-(((x - MID) / s) ** 2) / 2)).toFixed(1)}`);
  return pts.join(" ");
};

export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Backdrop a={C.cyan} b={C.violet} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 330, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.03em" }}>
      <div style={{ fontSize: 100, color: C.text }}>MEASURES OF</div>
      <div style={{ marginTop: 14, fontSize: 136, background: `linear-gradient(90deg, ${C.cyan}, ${C.violet})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 30px ${alpha(C.cyan, 0.45)})` }}>DISPERSION</div>
      <div style={{ marginTop: 34, fontSize: 52, fontWeight: 700, color: C.text, letterSpacing: "0.01em" }}>
        explained in <span style={{ color: C.yellow, textShadow: glowText(C.yellow, 0.5) }}>2 minutes</span>
      </div>
    </div>
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <line x1={X0 - 10} y1={AX} x2={X1 + 10} y2={AX} stroke={alpha(C.text, 0.35)} strokeWidth={4} strokeLinecap="round" />
      <line x1={MID} y1={AX + 8} x2={MID} y2={AX - 400} stroke={alpha(C.text, 0.55)} strokeWidth={3} strokeDasharray="8 8" />
      <path d={`${bell(250, 150)} L${X1} ${AX} L${X0} ${AX} Z`} fill={alpha(BAT_B, 0.14)} />
      <path d={bell(250, 150)} stroke={BAT_B} strokeWidth={7} fill="none" style={{ filter: `drop-shadow(0 0 10px ${alpha(BAT_B, 0.7)})` }} />
      <path d={`${bell(55, 380)} L${X1} ${AX} L${X0} ${AX} Z`} fill={alpha(BAT_A, 0.14)} />
      <path d={bell(55, 380)} stroke={BAT_A} strokeWidth={7} fill="none" style={{ filter: `drop-shadow(0 0 10px ${alpha(BAT_A, 0.7)})` }} />
    </svg>
    <div style={{ position: "absolute", left: 0, right: 0, top: AX + 46, display: "flex", justifyContent: "center", gap: 14 }}>
      {[
        { l: "Range", c: C.cyan },
        { l: "Variance", c: C.green },
        { l: "Std Dev", c: C.violet },
      ].map((k) => (
        <div key={k.l} style={{ padding: "10px 20px", borderRadius: 999, border: `2px solid ${k.c}`, background: alpha(k.c, 0.16), fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 30, color: C.text }}>
          {k.l}
        </div>
      ))}
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: AX + 150, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 36, color: C.text }}>
      <span style={{ color: C.cyan }}>@</span>
      {HANDLE.slice(1)}
    </div>
    <Grade />
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
