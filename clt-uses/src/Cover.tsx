// Reel cover = the title card: THE CENTRAL LIMIT THEOREM · 5 REAL-WORLD USES, the five use tiles (polls, A/B tests,
// factories, insurance, machine learning) over a faint bell, SAVE THIS FOR YOUR INTERVIEW, @curious_datascientist.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop, Grade, Grain, Vignette } from "./components/Backdrop";
import { FnCurve } from "./components/Curve";
import { Bookmark } from "./components/Guide";
import { USES } from "./components/Uses";
import { alpha, HANDLE, theme } from "./theme";

const C = theme.colors;
const POS = [[210, 960], [540, 960], [870, 960], [375, 1160], [705, 1160]];

export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Backdrop a={C.cyan} b={C.orange} />
    <FnCurve g={{ x0: 140, x1: 940, vmin: -3.4, vmax: 3.4, base: 780, h: 320 }} f={(v) => Math.exp(-(v * v) / 2)} fmax={1} color={C.violet} fill={0.08} width={4} opacity={0.5} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 330, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.02 }}>
      <div style={{ fontSize: 60, color: C.text, whiteSpace: "nowrap" }}>THE CENTRAL LIMIT THEOREM</div>
      <div style={{ marginTop: 16, fontSize: 84, whiteSpace: "nowrap", background: `linear-gradient(90deg, ${C.cyan}, ${C.violet}, ${C.orange})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 26px ${alpha(C.violet, 0.5)})` }}>5 REAL-WORLD USES</div>
    </div>
    {USES.map((u, i) => (
      <div key={u.n} style={{ position: "absolute", left: POS[i][0], top: POS[i][1], transform: "translate(-50%, -50%)", width: 300, height: 170, boxSizing: "border-box", borderRadius: 26, background: `linear-gradient(180deg, ${alpha(u.c, 0.26)}, rgba(14,24,64,0.94))`, border: `3px solid ${u.c}`, boxShadow: `0 0 22px ${alpha(u.c, 0.4)}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
        <u.Icon size={72} color={u.c} />
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: u.title.length > 12 ? 26 : 30, color: C.text, whiteSpace: "nowrap" }}>{u.title}</div>
      </div>
    ))}
    <div style={{ position: "absolute", left: 540, top: 1360, transform: "translate(-50%, -50%)", display: "flex", alignItems: "center", gap: 14, padding: "10px 28px", borderRadius: 999, background: alpha(C.green, 0.2), border: `3px solid ${C.green}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: C.text, whiteSpace: "nowrap" }}>
      <Bookmark size={32} color={C.green} />
      SAVE THIS FOR YOUR INTERVIEW
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1450, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 36, color: C.text }}>
      <span style={{ color: C.cyan }}>@</span>
      {HANDLE.slice(1)}
    </div>
    <Grade />
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
