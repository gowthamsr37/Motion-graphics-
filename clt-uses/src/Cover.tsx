// Reel cover = the title card: HOW CAN 1,000 PEOPLE PREDICT AN ELECTION? · THE CENTRAL LIMIT THEOREM IN REAL LIFE, the big
// ELECTION POLLS tile (the detailed example), + A/B TESTS · FACTORIES · INSURANCE · ML, SAVE THIS, @curious_datascientist.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop, Grade, Grain, Vignette } from "./components/Backdrop";
import { FnCurve } from "./components/Curve";
import { Bookmark } from "./components/Guide";
import { USES } from "./components/Uses";
import { alpha, glowText, HANDLE, theme } from "./theme";

const C = theme.colors;
const P = USES[0];

export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Backdrop a={C.cyan} b={C.orange} />
    <FnCurve g={{ x0: 140, x1: 940, vmin: -3.4, vmax: 3.4, base: 980, h: 300 }} f={(v) => Math.exp(-(v * v) / 2)} fmax={1} color={C.violet} fill={0.08} width={4} opacity={0.45} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.04 }}>
      <div style={{ fontSize: 74, color: C.text, whiteSpace: "nowrap" }}>
        HOW CAN <span style={{ color: P.c, textShadow: glowText(P.c, 0.6) }}>1,000 PEOPLE</span>
      </div>
      <div style={{ fontSize: 74, color: C.text, whiteSpace: "nowrap" }}>
        PREDICT AN ELECTION<span style={{ color: C.yellow }}>?</span>
      </div>
      <div style={{ marginTop: 20, fontSize: 38, whiteSpace: "nowrap", background: `linear-gradient(90deg, ${C.cyan}, ${C.violet}, ${C.orange})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>THE CENTRAL LIMIT THEOREM IN REAL LIFE</div>
    </div>
    <div style={{ position: "absolute", left: 540, top: 820, transform: "translate(-50%, -50%)", width: 660, height: 230, boxSizing: "border-box", borderRadius: 32, background: `linear-gradient(180deg, ${alpha(P.c, 0.3)}, rgba(14,24,64,0.94))`, border: `4px solid ${P.c}`, boxShadow: `0 0 34px ${alpha(P.c, 0.5)}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 28 }}>
      <P.Icon size={130} color={P.c} />
      <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 64, color: C.text, lineHeight: 1 }}>
        52% <span style={{ color: C.green }}>± 3%</span>
        <div style={{ fontFamily: theme.fonts.body, fontSize: 24, letterSpacing: "0.16em", color: P.c, marginTop: 10 }}>WHERE DOES THE ± COME FROM?</div>
      </div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1010, textAlign: "center", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.2em", color: C.dim }}>+ 4 MORE PLACES IT&apos;S USED</div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1060, display: "flex", justifyContent: "center", gap: 18 }}>
      {USES.slice(1).map((u) => (
        <div key={u.n} style={{ width: 200, height: 150, boxSizing: "border-box", borderRadius: 22, background: `linear-gradient(180deg, ${alpha(u.c, 0.2)}, rgba(14,24,64,0.92))`, border: `3px solid ${alpha(u.c, 0.85)}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <u.Icon size={64} color={u.c} />
          <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 22, color: C.text, whiteSpace: "nowrap" }}>{u.short}</div>
        </div>
      ))}
    </div>
    <div style={{ position: "absolute", left: 540, top: 1330, transform: "translate(-50%, -50%)", display: "flex", alignItems: "center", gap: 14, padding: "10px 28px", borderRadius: 999, background: alpha(C.green, 0.2), border: `3px solid ${C.green}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: C.text, whiteSpace: "nowrap" }}>
      <Bookmark size={32} color={C.green} />
      SAVE THIS ONE
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1420, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 36, color: C.text }}>
      <span style={{ color: C.cyan }}>@</span>
      {HANDLE.slice(1)}
    </div>
    <Grade />
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
