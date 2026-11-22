// The 100 Days of ML cover, shared by every episode. Built for the Instagram profile grid, which shows only the middle
// 1080×1440 of a reel cover (y 240 to 1680) at about 1/3 phone width. So the series name and the day number are the
// two biggest things on the card, both inside that crop:
//   1. a solid series banner "100 DAYS OF ML" (dark text on a bright fill),
//   2. a giant "DAY n" with a 100-dot progress strip (the day's dot lit),
//   3. the topic, then the art, then the handle.
// Only the deep-plum ML background differs from the statistics covers.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Grade, Grain, Vignette } from "./Backdrop";
import { alpha, glowText, HANDLE, theme } from "../theme";

const C = theme.colors;
export const ML = { bg: "#12051F", bg2: "#240A3D", glowA: "#D946EF", glowB: "#F97316", ink: "#FDF4FF", pink: "#F0ABFC" };
export const ML_GRAD = `linear-gradient(90deg, ${C.cyan}, ${ML.pink}, ${ML.glowB})`;

export const MLBackdrop: React.FC = () => (
  <AbsoluteFill style={{ background: `radial-gradient(120% 75% at 50% 30%, ${ML.bg2} 0%, ${ML.bg} 58%, #07020D 100%)` }}>
    <div style={{ position: "absolute", width: 1500, height: 1500, left: -700, top: -520, borderRadius: "50%", background: `radial-gradient(circle, ${alpha(ML.glowA, 0.3)} 0%, ${alpha(ML.glowA, 0.08)} 38%, transparent 62%)` }} />
    <div style={{ position: "absolute", width: 1500, height: 1500, right: -720, bottom: -420, borderRadius: "50%", background: `radial-gradient(circle, ${alpha(ML.glowB, 0.24)} 0%, ${alpha(ML.glowB, 0.06)} 40%, transparent 62%)` }} />
    <AbsoluteFill style={{ backgroundImage: `radial-gradient(${alpha("#F5C2FF", 0.12)} 1.6px, transparent 1.9px)`, backgroundSize: "54px 54px", WebkitMaskImage: "radial-gradient(ellipse 70% 55% at 50% 45%, black 20%, transparent 78%)", maskImage: "radial-gradient(ellipse 70% 55% at 50% 45%, black 20%, transparent 78%)" }} />
  </AbsoluteFill>
);

// 100 dots in 2 rows of 50: done days filled, today's day glowing yellow, the rest faint
const Progress: React.FC<{ day: number; y: number }> = ({ day, y }) => {
  const cols = 50;
  const gap = 19;
  const w = (cols - 1) * gap;
  return (
    <svg width={1080} height={2 * gap} viewBox={`0 0 1080 ${2 * gap}`} style={{ position: "absolute", left: 0, top: y }}>
      {Array.from({ length: 100 }, (_, i) => {
        const cx = 540 - w / 2 + (i % cols) * gap;
        const cy = gap / 2 + Math.floor(i / cols) * gap;
        const n = i + 1;
        const today = n === day;
        const done = n < day;
        return <circle key={i} cx={cx} cy={cy} r={today ? 9 : 6} fill={today ? C.yellow : done ? ML.pink : alpha(ML.ink, 0.16)} style={today ? { filter: `drop-shadow(0 0 10px ${C.yellow})` } : undefined} />;
      })}
    </svg>
  );
};

export const MLCover: React.FC<{
  day: number;
  topic: React.ReactNode; // the topic lines (already sized), drawn in the house gradient
  hook?: React.ReactNode; // one short line under the topic
  art?: React.ReactNode; // the picture, centred around y = 1420
}> = ({ day, topic, hook, art }) => (
  <AbsoluteFill style={{ background: ML.bg }}>
    <MLBackdrop />
    {/* 1. series banner: dark text on a bright fill, full width, inside the grid crop */}
    <div
      style={{
        position: "absolute",
        left: 50,
        right: 50,
        top: 268,
        height: 150,
        borderRadius: 28,
        background: `linear-gradient(90deg, ${ML.pink}, #FDBA74)`,
        boxShadow: `0 0 50px ${alpha(ML.glowA, 0.55)}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: theme.fonts.display,
        fontWeight: 800,
        fontSize: 96,
        letterSpacing: "-0.02em",
        color: "#1A0526",
        whiteSpace: "nowrap",
      }}
    >
      100 DAYS OF ML
    </div>
    {/* 2. the day, as big as the grid allows */}
    <div style={{ position: "absolute", left: 0, right: 0, top: 430, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.04em", whiteSpace: "nowrap" }}>
      <span style={{ fontSize: 210, color: ML.ink, textShadow: "0 6px 30px rgba(0,0,0,0.6)" }}>DAY </span>
      <span style={{ fontSize: 330, color: C.yellow, textShadow: glowText(C.yellow, 0.9) }}>{day}</span>
    </div>
    <Progress day={day} y={770} />
    {/* 3. the topic */}
    <div style={{ position: "absolute", left: 0, right: 0, top: 870, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1.0, whiteSpace: "nowrap", letterSpacing: "-0.03em" }}>
      <div style={{ display: "inline-block", background: ML_GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 22px ${alpha(ML.glowA, 0.5)})` }}>{topic}</div>
    </div>
    {hook ? <div style={{ position: "absolute", left: 0, right: 0, top: 1262, textAlign: "center", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 44, color: ML.ink, whiteSpace: "nowrap" }}>{hook}</div> : null}
    {art}
    <div style={{ position: "absolute", left: 0, right: 0, top: 1590, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 40, color: ML.ink }}>
      <span style={{ color: ML.pink }}>@</span>
      {HANDLE.slice(1)}
    </div>
    <Grade />
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
