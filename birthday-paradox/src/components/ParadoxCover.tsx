// Probability Paradoxes series cover, shared by every episode. Grid-readable: a "PROBABILITY PARADOX #n" banner, the
// puzzle in giant type, a big counter-intuitive number, the art, and the handle — all inside the middle 1080×1440 crop.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Grade, Grain, Vignette } from "./Backdrop";
import { alpha, glowText, HANDLE, theme } from "../theme";

export type PPal = { bg: string; bg2: string; deep: string; glow: string; ink: string; banner: string; bannerText: string; hot: string; dim: string };
export const PPALS: Record<string, PPal> = {
  acid: { bg: "#0A0A0A", bg2: "#1F1F1F", deep: "#000", glow: "#C6FF00", ink: "#FFFFFF", banner: "#C6FF00", bannerText: "#0A0A0A", hot: "#C6FF00", dim: "#A3A3A3" },
  red: { bg: "#2B0000", bg2: "#7A0010", deep: "#120000", glow: "#FF3B3B", ink: "#FFFFFF", banner: "#FFFFFF", bannerText: "#7A0010", hot: "#FFD60A", dim: "#FFC9C9" },
  violet: { bg: "#160A33", bg2: "#3B1C8C", deep: "#07021A", glow: "#A78BFA", ink: "#FFFFFF", banner: "#FDE047", bannerText: "#1E0B4D", hot: "#FDE047", dim: "#D8CCFF" },
  orange: { bg: "#1A0A00", bg2: "#5C2400", deep: "#0A0300", glow: "#FF8A00", ink: "#FFFFFF", banner: "#FF8A00", bannerText: "#1A0A00", hot: "#FF8A00", dim: "#FFD8B0" },
  pink: { bg: "#1A0014", bg2: "#5E0A4C", deep: "#0A0008", glow: "#FF4FD8", ink: "#FFFFFF", banner: "#00F0FF", bannerText: "#14001A", hot: "#00F0FF", dim: "#FFC2F2" },
  teal: { bg: "#001A1A", bg2: "#004D4D", deep: "#000A0A", glow: "#2DD4BF", ink: "#FFFFFF", banner: "#FF5C7A", bannerText: "#1A0008", hot: "#FF5C7A", dim: "#B2F5EA" },
};
export const PARADOX_PAL = "acid";

export const ParadoxCover: React.FC<{ n: number; lines: React.ReactNode; big: React.ReactNode; sub?: React.ReactNode; art?: React.ReactNode; pal?: string }> = ({ n, lines, big, sub, art, pal }) => {
  const P = PPALS[pal ?? PARADOX_PAL];
  return (
    <AbsoluteFill style={{ background: `radial-gradient(120% 75% at 50% 35%, ${P.bg2} 0%, ${P.bg} 58%, ${P.deep} 100%)` }}>
      <div style={{ position: "absolute", width: 1300, height: 1300, left: -400, top: 200, borderRadius: "50%", background: `radial-gradient(circle, ${alpha(P.glow, 0.18)} 0%, transparent 62%)` }} />
      <div style={{ position: "absolute", left: 50, right: 50, top: 270, height: 130, borderRadius: 26, background: P.banner, boxShadow: `0 0 50px ${alpha(P.glow, 0.45)}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 18, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 64, color: P.bannerText, whiteSpace: "nowrap", letterSpacing: "-0.01em" }}>
        PARADOX <span style={{ fontSize: 88 }}>#{n}</span>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 450, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 92, lineHeight: 1.02, letterSpacing: "-0.03em", color: P.ink, whiteSpace: "nowrap" }}>{lines}</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 820, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 250, lineHeight: 1, color: P.hot, textShadow: glowText(P.hot, 0.8), whiteSpace: "nowrap" }}>{big}</div>
      {sub ? <div style={{ position: "absolute", left: 0, right: 0, top: 1100, textAlign: "center", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 46, color: P.dim, whiteSpace: "nowrap" }}>{sub}</div> : null}
      {art}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1580, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 40, color: P.ink }}>
        <span style={{ color: P.hot }}>@</span>
        {HANDLE.slice(1)}
      </div>
      <Grade />
      <Grain />
      <Vignette />
    </AbsoluteFill>
  );
};
