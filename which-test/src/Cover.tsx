// Reel cover: THE CHEAT SHEET tag · WHICH TEST SHOULD I USE? · four test tiles with their mini diagrams
// (z / t, ANOVA, chi-square, paired t) · SAVE THIS FOR YOUR INTERVIEW · @curious_datascientist.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop, Grade, Grain, Vignette } from "./components/Backdrop";
import { Bookmark } from "./components/Guide";
import { CAT, G1, G2, G3, TestViz, type VizKind } from "./components/Tests";
import { alpha, glowText, HANDLE, theme } from "./theme";

const C = theme.colors;

const Tile: React.FC<{ x: number; y: number; t: string; kind: VizKind; c: string }> = ({ x, y, t, kind, c }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%, -50%)", width: 410, height: 210, boxSizing: "border-box", borderRadius: 28, background: `linear-gradient(180deg, ${alpha(c, 0.2)}, rgba(14,24,64,0.94))`, border: `3px solid ${c}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
    <TestViz kind={kind} w={300} h={107} color={c} p={1} tiny />
    <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 44, color: C.text, textShadow: glowText(c, 0.4) }}>{t}</div>
  </div>
);

export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Backdrop a={C.cyan} b={C.orange} />
    <div style={{ position: "absolute", left: 540, top: 300, transform: "translate(-50%, -50%)", padding: "10px 26px", borderRadius: 999, background: alpha(G3, 0.18), border: `2px solid ${G3}`, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 26, letterSpacing: "0.2em", color: C.text, whiteSpace: "nowrap" }}>THE CHEAT SHEET</div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 370, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.03em" }}>
      <div style={{ fontSize: 150, background: `linear-gradient(90deg, ${G1}, ${G2}, ${CAT})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 30px ${alpha(G2, 0.45)})` }}>WHICH TEST</div>
      <div style={{ marginTop: 14, fontSize: 96, color: C.text }}>
        SHOULD I USE<span style={{ color: C.yellow, textShadow: glowText(C.yellow, 0.6) }}>?</span>
      </div>
    </div>
    <Tile x={318} y={850} t="z / t-TEST" kind="z" c={G1} />
    <Tile x={762} y={850} t="PAIRED t" kind="paired" c={G2} />
    <Tile x={318} y={1084} t="ANOVA" kind="anova" c={G3} />
    <Tile x={762} y={1084} t="CHI-SQUARE" kind="chiInd" c={CAT} />
    <div style={{ position: "absolute", left: 540, top: 1300, transform: "translate(-50%, -50%)", display: "flex", alignItems: "center", gap: 16, padding: "12px 30px", borderRadius: 999, background: alpha(G3, 0.2), border: `3px solid ${G3}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 34, color: C.text, whiteSpace: "nowrap" }}>
      <Bookmark size={38} color={G3} />
      SAVE THIS FOR YOUR INTERVIEW
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
