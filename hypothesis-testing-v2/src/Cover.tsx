// Reel cover: HYPOTHESIS TESTING · explained simply · the chips packet "50 g" claimed vs "48 g" measured with
// "CHEATING OR CHANCE?", H0 / H1 chips, an INTERVIEW-READY tag, @curious_datascientist.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop, Grade, Grain, Vignette } from "./components/Backdrop";
import { ALT, DATA, LINE, NULLC, Packet } from "./scenes/S1Hook";
import { alpha, glowText, HANDLE, theme } from "./theme";

const C = theme.colors;

const Side: React.FC<{ x: number; top: string; label: string; c: string }> = ({ x, top, label, c }) => (
  <div style={{ position: "absolute", left: x, top: 1010, transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
    <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.18em", color: c }}>{top}</div>
    <Packet w={150} label={label} color={c} />
  </div>
);

const HChip: React.FC<{ h: string; t: string; c: string }> = ({ h, t, c }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 22px", borderRadius: 999, background: alpha(c, 0.16), border: `2px solid ${c}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: C.text, whiteSpace: "nowrap" }}>
    <span style={{ color: c }}>{h}</span>
    {t}
  </div>
);

export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Backdrop a={C.violet} b={C.orange} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 270, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.03em" }}>
      <div style={{ fontSize: 132, background: `linear-gradient(90deg, ${NULLC}, ${DATA})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 30px ${alpha(NULLC, 0.4)})` }}>HYPOTHESIS</div>
      <div style={{ marginTop: 8, fontSize: 150, background: `linear-gradient(90deg, ${DATA}, ${ALT})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 30px ${alpha(ALT, 0.4)})` }}>TESTING</div>
      <div style={{ marginTop: 30, fontSize: 50, fontWeight: 700, color: C.text, letterSpacing: "0.01em" }}>
        explained <span style={{ color: C.yellow, textShadow: glowText(C.yellow, 0.5) }}>simply</span>
      </div>
    </div>
    <div style={{ position: "absolute", left: 90, top: 820, width: 900, height: 620, boxSizing: "border-box", borderRadius: 36, background: "linear-gradient(180deg, rgba(26,40,98,0.9), rgba(14,24,64,0.9))", border: `2px solid ${C.edge}` }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 870, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 52, color: C.text }}>
      <span style={{ color: ALT, textShadow: glowText(ALT, 0.5) }}>CHEATING</span> OR <span style={{ color: NULLC, textShadow: glowText(NULLC, 0.5) }}>CHANCE</span>
      <span style={{ color: C.yellow }}>?</span>
    </div>
    <Side x={330} top="CLAIMED" label="50 g" c={C.yellow} />
    <div style={{ position: "absolute", left: 540, top: 1130, transform: "translate(-50%, -50%)", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 54, color: C.dim }}>vs</div>
    <Side x={750} top="MEASURED" label="48 g" c={DATA} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 1320, display: "flex", justifyContent: "center", gap: 20 }}>
      <HChip h="H0" t="no effect" c={NULLC} />
      <HChip h="H1" t="real effect" c={ALT} />
    </div>
    <div style={{ position: "absolute", left: 540, top: 1490, transform: "translate(-50%, -50%)", padding: "8px 22px", borderRadius: 999, background: alpha(LINE, 0.16), border: `2px solid ${LINE}`, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.16em", color: C.text, whiteSpace: "nowrap" }}>+ INTERVIEW-READY DEFINITION</div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1570, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 36, color: C.text }}>
      <span style={{ color: C.cyan }}>@</span>
      {HANDLE.slice(1)}
    </div>
    <Grade />
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
