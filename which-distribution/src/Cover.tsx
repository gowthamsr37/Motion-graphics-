// Reel cover: WHICH DISTRIBUTION? · explained in 2 minutes · a 3 × 2 cheat-sheet grid of the six shapes, @curious_datascientist.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop, Grade, Grain, Vignette } from "./components/Backdrop";
import { type Kind, Shape } from "./components/Pick";
import { BIM, BIM2, BIN, EXP, NOR, NOR2, POI, UNI } from "./scenes/S1Hook";
import { alpha, glowText, HANDLE, theme } from "./theme";

const C = theme.colors;
const GRID: { kind: Kind; name: string; c: string; c2?: string }[] = [
  { kind: "uniform", name: "UNIFORM", c: UNI },
  { kind: "binomial", name: "BINOMIAL", c: BIN },
  { kind: "poisson", name: "POISSON", c: POI },
  { kind: "exp", name: "EXPONENTIAL", c: EXP },
  { kind: "normal", name: "NORMAL", c: NOR, c2: NOR2 },
  { kind: "bimodal", name: "BIMODAL", c: BIM, c2: BIM2 },
];

export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Backdrop a={C.cyan} b={C.violet} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.03em" }}>
      <div style={{ fontSize: 110, color: C.text }}>WHICH</div>
      <div style={{ marginTop: 14, fontSize: 118, whiteSpace: "nowrap" }}>
        <span style={{ background: `linear-gradient(90deg, ${C.cyan}, ${C.violet})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 30px ${alpha(C.violet, 0.45)})` }}>DISTRIBUTION</span>
        <span style={{ color: C.yellow, textShadow: glowText(C.yellow, 0.5) }}>?</span>
      </div>
      <div style={{ marginTop: 30, fontSize: 50, fontWeight: 700, color: C.text, letterSpacing: "0.01em" }}>
        explained in <span style={{ color: C.yellow, textShadow: glowText(C.yellow, 0.5) }}>2 minutes</span>
      </div>
    </div>
    <div style={{ position: "absolute", left: 90, top: 820, width: 900, height: 640, boxSizing: "border-box", borderRadius: 36, background: "linear-gradient(180deg, rgba(26,40,98,0.9), rgba(14,24,64,0.9))", border: `2px solid ${C.edge}` }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 862, textAlign: "center", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.22em", color: C.green }}>THE CHEAT SHEET</div>
    {GRID.map((g, i) => {
      const x = 250 + (i % 3) * 290;
      const y = 1040 + Math.floor(i / 3) * 250;
      return (
        <div key={g.name} style={{ position: "absolute", left: x, top: y, transform: "translate(-50%, -50%)", width: 260, height: 210, boxSizing: "border-box", borderRadius: 24, background: alpha(g.c, 0.1), border: `3px solid ${alpha(g.c, 0.75)}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
          <Shape kind={g.kind} w={180} h={86} color={g.c} color2={g.c2} />
          <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: g.name.length > 9 ? 24 : 28, color: C.text }}>{g.name}</div>
        </div>
      );
    })}
    <div style={{ position: "absolute", left: 0, right: 0, top: 1516, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 36, color: C.text }}>
      <span style={{ color: C.cyan }}>@</span>
      {HANDLE.slice(1)}
    </div>
    <Grade />
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
