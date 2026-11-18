// SCENE 6 — THE 4 STEPS. 1 STATE H0 AND H1 · 2 PICK A SIGNIFICANCE LEVEL: 5% light up on their words; 3 CALCULATE THE
// p-VALUE · 4 DECIDE wait as dim placeholders (they play out in the next scene).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { SceneTitle } from "../components/Kit";
import { ease, useSpr } from "../components/Motion";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { ALT, DATA, LINE, NULLC } from "./S1Hook";

const C = theme.colors;

export const StepCard: React.FC<{ y: number; n: number; t: React.ReactNode; c: string; at: number | null }> = ({ y, n, t, c, at }) => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const ghost = ease(frame, [4, 14], [0, 1]);
  const p = at === null ? 0 : spr(at - 6, theme.spring.bouncy);
  const lit = p > 0.01;
  return (
    <div style={{ position: "absolute", left: 90, top: y, width: 900, height: 140, transform: `translateY(-50%) scale(${lit ? 0.96 + 0.04 * Math.min(1, p) : 1})`, opacity: lit ? 1 : ghost * 0.55, boxSizing: "border-box", borderRadius: 28, background: lit ? `linear-gradient(90deg, ${alpha(c, 0.22)}, rgba(14,24,64,0.92) 60%)` : "transparent", border: lit ? `3px solid ${c}` : `3px dashed ${alpha(C.text, 0.25)}`, boxShadow: lit ? `0 0 26px ${alpha(c, 0.3)}` : "none", display: "flex", alignItems: "center", gap: 26, paddingLeft: 32 }}>
      <div style={{ width: 64, height: 64, borderRadius: 32, flexShrink: 0, background: lit ? c : alpha(C.text, 0.15), display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 34, color: lit ? C.ink : C.dim }}>{n}</div>
      <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: lit ? C.text : C.dim, whiteSpace: "nowrap", textShadow: lit ? glowText(c, 0.25) : undefined }}>{t}</div>
    </div>
  );
};

export const S6Steps: React.FC = () => {
  const s = useScene("s6");
  return (
    <AbsoluteFill>
      <SceneTitle label="THE 4 STEPS" color={LINE} at={2} />
      <StepCard y={520} n={1} c={NULLC} at={s.cueS(1, "One:")} t={<>STATE <span style={{ color: NULLC }}>H0</span> AND <span style={{ color: ALT }}>H1</span></>} />
      <StepCard y={690} n={2} c={LINE} at={s.cueS(1, "Two:")} t={<>PICK A LEVEL: <span style={{ color: LINE }}>5%</span></>} />
      <StepCard y={860} n={3} c={DATA} at={null} t="CALCULATE THE p-VALUE" />
      <StepCard y={1030} n={4} c={ALT} at={null} t="DECIDE" />
    </AbsoluteFill>
  );
};
