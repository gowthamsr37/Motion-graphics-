// The 100 Days of ML cover, shared by every episode. Built for the Instagram profile grid, which shows only the middle
// 1080×1440 of a reel cover (y 240 to 1680) at about 1/3 phone width. So the series name and the day number are the
// two biggest things on the card, both inside that crop:
//   1. a solid series banner "100 DAYS OF ML" (dark text on a bright fill),
//   2. a giant "DAY n" with a 100-dot progress strip (the day's dot lit),
//   3. the topic, then the art, then the handle.
// Colours: PALS / ML_PAL (the series cover colour). Only the cover differs from the statistics look.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Grade, Grain, Vignette } from "./Backdrop";
import { alpha, glowText, HANDLE, theme } from "../theme";

const C = theme.colors;
export type CoverPal = { bg: string; bg2: string; deep: string; glowA: string; glowB: string; ink: string; accent: string; banner: string; bannerText: string; num: string; topic: string; panel: string };
export const PALS: Record<string, CoverPal> = {
  plum: { bg: "#12051F", bg2: "#240A3D", deep: "#07020D", glowA: "#D946EF", glowB: "#F97316", ink: "#FDF4FF", accent: "#F0ABFC", banner: "linear-gradient(90deg, #F0ABFC, #FDBA74)", bannerText: "#1A0526", num: C.yellow, topic: `linear-gradient(90deg, ${C.cyan}, #F0ABFC, #F97316)`, panel: "rgba(18,5,31,0.9)" },
  emerald: { bg: "#03211A", bg2: "#0A4A38", deep: "#010D0A", glowA: "#10B981", glowB: "#FACC15", ink: "#F0FDF4", accent: "#6EE7B7", banner: "linear-gradient(90deg, #FACC15, #FDE68A)", bannerText: "#1A1400", num: "#FACC15", topic: "linear-gradient(90deg, #FFFFFF, #A7F3D0)", panel: "rgba(2,26,20,0.9)" },
  black: { bg: "#0B0B0D", bg2: "#1D1D22", deep: "#000000", glowA: "#FFD60A", glowB: "#FFD60A", ink: "#FFFFFF", accent: "#FFD60A", banner: "#FFD60A", bannerText: "#0B0B0D", num: "#FFD60A", topic: "linear-gradient(90deg, #FFFFFF, #FFFFFF)", panel: "rgba(16,16,20,0.92)" },
  royal: { bg: "#08206E", bg2: "#1546C4", deep: "#030D33", glowA: "#60A5FA", glowB: "#F97316", ink: "#FFFFFF", accent: "#FDBA74", banner: "#FFFFFF", bannerText: "#0A1F66", num: "#FB923C", topic: "linear-gradient(90deg, #FFFFFF, #FED7AA)", panel: "rgba(6,22,80,0.9)" },
  crimson: { bg: "#3A0710", bg2: "#8B1A2B", deep: "#14020A", glowA: "#F43F5E", glowB: "#F59E0B", ink: "#FFF7ED", accent: "#FCD34D", banner: "#FFFFFF", bannerText: "#5B0B18", num: "#FCD34D", topic: "linear-gradient(90deg, #FFFFFF, #FDE68A)", panel: "rgba(40,5,12,0.9)" },
  teal: { bg: "#042F2E", bg2: "#0F766E", deep: "#011413", glowA: "#2DD4BF", glowB: "#FB7185", ink: "#F0FDFA", accent: "#5EEAD4", banner: "#FB7185", bannerText: "#2A0A10", num: "#FB7185", topic: "linear-gradient(90deg, #FFFFFF, #99F6E4)", panel: "rgba(2,30,28,0.9)" },
  charcoal: { bg: "#121519", bg2: "#262C33", deep: "#050607", glowA: "#22D3EE", glowB: "#22D3EE", ink: "#FFFFFF", accent: "#22D3EE", banner: "#22D3EE", bannerText: "#04141A", num: "#22D3EE", topic: "linear-gradient(90deg, #FFFFFF, #FFFFFF)", panel: "rgba(18,21,25,0.92)" },
  sunset: { bg: "#8A2E0C", bg2: "#EA580C", deep: "#3B0A02", glowA: "#FDBA74", glowB: "#F43F5E", ink: "#FFFFFF", accent: "#FDE047", banner: "#FFFFFF", bannerText: "#7C2D12", num: "#FDE047", topic: "linear-gradient(90deg, #FFFFFF, #FEF3C7)", panel: "rgba(60,14,4,0.88)" },
  lime: { bg: "#1E0B3A", bg2: "#4C1D95", deep: "#0B0418", glowA: "#A3E635", glowB: "#8B5CF6", ink: "#FFFFFF", accent: "#A3E635", banner: "#A3E635", bannerText: "#13200A", num: "#A3E635", topic: "linear-gradient(90deg, #FFFFFF, #D9F99D)", panel: "rgba(20,8,40,0.9)" },
  cream: { bg: "#FFF4DE", bg2: "#FFFFFF", deep: "#EBD9B4", glowA: "#FDE68A", glowB: "#FDA4AF", ink: "#141414", accent: "#E11D48", banner: "#141414", bannerText: "#FFD60A", num: "#E11D48", topic: "linear-gradient(90deg, #141414, #141414)", panel: "rgba(255,255,255,0.9)" },
  magenta: { bg: "#4A0430", bg2: "#A21656", deep: "#1A0110", glowA: "#F472B6", glowB: "#FDE047", ink: "#FFFFFF", accent: "#FDE047", banner: "#FFFFFF", bannerText: "#6B0F3A", num: "#FDE047", topic: "linear-gradient(90deg, #FFFFFF, #FBCFE8)", panel: "rgba(40,3,26,0.9)" },
  ocean: { bg: "#083B57", bg2: "#0891B2", deep: "#021826", glowA: "#67E8F9", glowB: "#FDE047", ink: "#FFFFFF", accent: "#FDE047", banner: "#FDE047", bannerText: "#082F49", num: "#FDE047", topic: "linear-gradient(90deg, #FFFFFF, #CFFAFE)", panel: "rgba(4,30,46,0.9)" },
};
export const ML_PAL = "ocean"; // the series cover colour (one place to change it)
export const usePal = (name?: string): CoverPal => PALS[name ?? ML_PAL] ?? PALS[ML_PAL];
// legacy names (the plum set)
export const ML = { bg: PALS.plum.bg, bg2: PALS.plum.bg2, glowA: PALS.plum.glowA, glowB: PALS.plum.glowB, ink: PALS.plum.ink, pink: PALS.plum.accent };
export const ML_GRAD = PALS.plum.topic;

export const MLBackdrop: React.FC<{ P?: CoverPal }> = ({ P = PALS.plum }) => (
  <AbsoluteFill style={{ background: `radial-gradient(120% 75% at 50% 30%, ${P.bg2} 0%, ${P.bg} 58%, ${P.deep} 100%)` }}>
    <div style={{ position: "absolute", width: 1500, height: 1500, left: -700, top: -520, borderRadius: "50%", background: `radial-gradient(circle, ${alpha(P.glowA, 0.3)} 0%, ${alpha(P.glowA, 0.08)} 38%, transparent 62%)` }} />
    <div style={{ position: "absolute", width: 1500, height: 1500, right: -720, bottom: -420, borderRadius: "50%", background: `radial-gradient(circle, ${alpha(P.glowB, 0.24)} 0%, ${alpha(P.glowB, 0.06)} 40%, transparent 62%)` }} />
    <AbsoluteFill style={{ backgroundImage: `radial-gradient(${alpha("#F5C2FF", 0.12)} 1.6px, transparent 1.9px)`, backgroundSize: "54px 54px", WebkitMaskImage: "radial-gradient(ellipse 70% 55% at 50% 45%, black 20%, transparent 78%)", maskImage: "radial-gradient(ellipse 70% 55% at 50% 45%, black 20%, transparent 78%)" }} />
  </AbsoluteFill>
);

// 100 dots in 2 rows of 50: done days filled, today's day glowing yellow, the rest faint
const Progress: React.FC<{ day: number; y: number; P: CoverPal }> = ({ day, y, P }) => {
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
        return <circle key={i} cx={cx} cy={cy} r={today ? 9 : 6} fill={today ? P.num : done ? P.accent : alpha(P.ink, 0.18)} style={today ? { filter: `drop-shadow(0 0 10px ${P.num})` } : undefined} />;
      })}
    </svg>
  );
};

export const MLCover: React.FC<{
  day: number;
  topic: React.ReactNode; // the topic lines (already sized), drawn in the house gradient
  hook?: React.ReactNode; // one short line under the topic
  art?: React.ReactNode; // the picture, centred around y = 1420
  hookY?: number;
  pal?: string;
}> = ({ day, topic, hook, art, hookY, pal }) => {
  const P = usePal(pal);
  return (
  <AbsoluteFill style={{ background: P.bg }}>
    <MLBackdrop P={P} />
    {/* 1. series banner: dark text on a bright fill, full width, inside the grid crop */}
    <div
      style={{
        position: "absolute",
        left: 50,
        right: 50,
        top: 268,
        height: 150,
        borderRadius: 28,
        background: P.banner,
        boxShadow: `0 0 50px ${alpha(P.glowA, 0.5)}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: theme.fonts.display,
        fontWeight: 800,
        fontSize: 96,
        letterSpacing: "-0.02em",
        color: P.bannerText,
        whiteSpace: "nowrap",
      }}
    >
      100 DAYS OF ML
    </div>
    {/* 2. the day, as big as the grid allows */}
    <div style={{ position: "absolute", left: 0, right: 0, top: 430, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.04em", whiteSpace: "nowrap" }}>
      <span style={{ fontSize: 210, color: P.ink, textShadow: P.ink === "#141414" ? "none" : "0 6px 30px rgba(0,0,0,0.6)" }}>DAY </span>
      <span style={{ fontSize: 330, color: P.num, textShadow: glowText(P.num, 0.9) }}>{day}</span>
    </div>
    <Progress day={day} y={770} P={P} />
    {/* 3. the topic */}
    <div style={{ position: "absolute", left: 0, right: 0, top: 870, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1.0, whiteSpace: "nowrap", letterSpacing: "-0.03em" }}>
      <div style={{ display: "inline-block", background: P.topic, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 22px ${alpha(P.glowA, 0.45)})` }}>{topic}</div>
    </div>
    {hook ? <div style={{ position: "absolute", left: 0, right: 0, top: hookY ?? 1262, textAlign: "center", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 44, color: P.ink, whiteSpace: "nowrap" }}>{hook}</div> : null}
    {art}
    <div style={{ position: "absolute", left: 0, right: 0, top: 1590, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 40, color: P.ink }}>
      <span style={{ color: P.accent }}>@</span>
      {HANDLE.slice(1)}
    </div>
    <Grade />
    <Grain />
    <Vignette />
  </AbsoluteFill>
  );
};
