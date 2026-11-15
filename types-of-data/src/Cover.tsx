// Reel cover: TYPES OF DATA · EXPLAINED IN 2 MINUTES, over the colour-coded tree.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop, Grade, Grain, Vignette } from "./components/Backdrop";
import { Orb, Pill } from "./components/Nodes";
import { alpha, glowText, theme } from "./theme";

const C = theme.colors;
const LEAVES = [
  { l: "Discrete", c: C.cyan, x: 175 },
  { l: "Continuous", c: C.green, x: 410 },
  { l: "Nominal", c: C.violet, x: 670 },
  { l: "Ordinal", c: C.orange, x: 905 },
];

export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Backdrop a={C.cyan} b={C.violet} />
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      {[
        { a: [540, 1010], b: [290, 1160], c: C.cyan },
        { a: [540, 1010], b: [790, 1160], c: C.violet },
        { a: [290, 1200], b: [175, 1330], c: C.cyan },
        { a: [290, 1200], b: [410, 1330], c: C.green },
        { a: [790, 1200], b: [670, 1330], c: C.violet },
        { a: [790, 1200], b: [905, 1330], c: C.orange },
      ].map((w, i) => (
        <path key={i} d={`M${w.a[0]} ${w.a[1]} C${w.a[0]} ${(w.a[1] + w.b[1]) / 2} ${w.b[0]} ${(w.a[1] + w.b[1]) / 2} ${w.b[0]} ${w.b[1]}`} stroke={w.c} strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.85} />
      ))}
    </svg>
    <div style={{ position: "absolute", left: 540 - 60, top: 950 - 60 }}>
      <Orb size={120} label="DATA" />
    </div>
    <div style={{ position: "absolute", left: 290, top: 1180, transform: "translate(-50%, -50%)" }}>
      <Pill label="NUMERICAL" color={C.cyan} size={30} glow={0.5} />
    </div>
    <div style={{ position: "absolute", left: 790, top: 1180, transform: "translate(-50%, -50%)" }}>
      <Pill label="CATEGORICAL" color={C.violet} size={30} glow={0.5} />
    </div>
    {LEAVES.map((k) => (
      <div key={k.l} style={{ position: "absolute", left: k.x, top: 1352, transform: "translate(-50%, -50%)", padding: "10px 18px", borderRadius: 999, border: `2px solid ${k.c}`, background: alpha(k.c, 0.16), fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 28, color: C.text, whiteSpace: "nowrap" }}>
        {k.l}
      </div>
    ))}
    <div style={{ position: "absolute", left: 0, right: 0, top: 380, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 0.98, letterSpacing: "-0.03em" }}>
      <div style={{ fontSize: 150, color: C.text }}>TYPES OF</div>
      <div style={{ fontSize: 196, background: `linear-gradient(90deg, ${C.cyan}, ${C.violet})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 30px ${alpha(C.cyan, 0.45)})` }}>DATA</div>
      <div style={{ marginTop: 34, fontSize: 52, fontWeight: 700, color: C.text, letterSpacing: "0.01em" }}>
        explained in <span style={{ color: C.yellow, textShadow: glowText(C.yellow, 0.5) }}>2 minutes</span>
      </div>
    </div>
    <Grade />
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
