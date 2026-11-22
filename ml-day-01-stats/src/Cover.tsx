// Reel cover: the statistics house cover layout on the deep PLUM ML background (so ML covers stand apart from the navy
// statistics covers in the grid). DAY 1 / 100 pill, WHAT IS MACHINE LEARNING? with the house gradient, the robot,
// the four everyday-ML icons on house tiles, the hook "you use it 12× a day", SAVE THIS, @curious_datascientist.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Grade, Grain, Vignette } from "./components/Backdrop";
import { Envelope, MapPin, PhoneFace, PlayBtn, Robot } from "./components/Doodles";
import { Bookmark } from "./components/Guide";
import { Layer } from "./components/NB";
import { alpha, glowText, HANDLE, theme } from "./theme";

const C = theme.colors;
// ML-series cover colours, from ml-trailer (videos keep the house navy; covers use these)
const ML = { bg: "#12051F", bg2: "#240A3D", glowA: "#D946EF", glowB: "#F97316", ink: "#FDF4FF" };
const DONE = -200;

const MLBackdrop: React.FC = () => (
  <AbsoluteFill style={{ background: `radial-gradient(120% 75% at 50% 30%, ${ML.bg2} 0%, ${ML.bg} 58%, #07020D 100%)` }}>
    <div style={{ position: "absolute", width: 1500, height: 1500, left: -700, top: -520, borderRadius: "50%", background: `radial-gradient(circle, ${alpha(ML.glowA, 0.3)} 0%, ${alpha(ML.glowA, 0.08)} 38%, transparent 62%)` }} />
    <div style={{ position: "absolute", width: 1500, height: 1500, right: -720, bottom: -420, borderRadius: "50%", background: `radial-gradient(circle, ${alpha(ML.glowB, 0.24)} 0%, ${alpha(ML.glowB, 0.06)} 40%, transparent 62%)` }} />
    <AbsoluteFill style={{ backgroundImage: `radial-gradient(${alpha("#F5C2FF", 0.14)} 1.6px, transparent 1.9px)`, backgroundSize: "54px 54px", WebkitMaskImage: "radial-gradient(ellipse 70% 55% at 50% 45%, black 20%, transparent 78%)", maskImage: "radial-gradient(ellipse 70% 55% at 50% 45%, black 20%, transparent 78%)" }} />
  </AbsoluteFill>
);

const ICONS = [PhoneFace, Envelope, PlayBtn, MapPin];
const LABELS = ["FACE UNLOCK", "SPAM FILTER", "VIDEO PICKS", "TRAFFIC"];
const TINTS = [C.cyan, C.orange, "#F0ABFC", C.green];

export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: ML.bg }}>
    <MLBackdrop />
    <div style={{ position: "absolute", left: 540, top: 270, transform: "translate(-50%, -50%)", padding: "10px 30px", borderRadius: 999, background: alpha(ML.glowA, 0.2), border: `2px solid ${ML.glowA}`, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 28, letterSpacing: "0.24em", color: ML.ink, whiteSpace: "nowrap" }}>100 DAYS OF ML · DAY 1</div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 330, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1.02, letterSpacing: "-0.03em" }}>
      <div style={{ fontSize: 96, color: ML.ink }}>WHAT IS</div>
      <div style={{ fontSize: 124, background: `linear-gradient(90deg, ${C.cyan}, #F0ABFC, ${ML.glowB})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 28px ${alpha(ML.glowA, 0.55)})` }}>MACHINE</div>
      <div style={{ fontSize: 124, background: `linear-gradient(90deg, ${C.cyan}, #F0ABFC, ${ML.glowB})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 28px ${alpha(ML.glowA, 0.55)})` }}>
        LEARNING<span style={{ color: C.yellow, WebkitTextFillColor: C.yellow }}>?</span>
      </div>
    </div>
    <Layer>
      <Robot x={540} y={830} s={200} at={DONE} />
    </Layer>
    <div style={{ position: "absolute", left: 0, right: 0, top: 960, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 52, color: ML.ink }}>
      You use it <span style={{ color: C.yellow, textShadow: glowText(C.yellow, 0.6) }}>12× a day</span>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1036, textAlign: "center", fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 34, color: alpha(ML.ink, 0.85) }}>but do you know what it actually is?</div>
    {ICONS.map((Ic, i) => (
      <div key={i} style={{ position: "absolute", left: 160 + i * 253, top: 1220, width: 230, height: 190, transform: "translate(-50%, -50%)", boxSizing: "border-box", borderRadius: 24, background: `linear-gradient(180deg, ${alpha(TINTS[i], 0.16)}, rgba(18,5,31,0.9))`, border: `2px solid ${alpha(TINTS[i], 0.75)}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
        <svg width={110} height={110} viewBox="0 0 110 110" style={{ overflow: "visible" }}>
          <Ic x={55} y={55} s={104} at={DONE} />
        </svg>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 19, letterSpacing: "0.12em", color: ML.ink, whiteSpace: "nowrap" }}>{LABELS[i]}</div>
      </div>
    ))}
    <div style={{ position: "absolute", left: 540, top: 1420, transform: "translate(-50%, -50%)", display: "flex", alignItems: "center", gap: 14, padding: "10px 30px", borderRadius: 999, background: alpha(C.green, 0.18), border: `3px solid ${C.green}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: ML.ink, whiteSpace: "nowrap" }}>
      <Bookmark size={32} color={C.green} />
      SAVE THIS FOR DAY 1
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1500, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 36, color: ML.ink }}>
      <span style={{ color: "#F0ABFC" }}>@</span>
      {HANDLE.slice(1)}
    </div>
    <Grade />
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
