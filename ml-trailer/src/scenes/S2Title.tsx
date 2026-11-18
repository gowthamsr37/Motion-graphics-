// SCENE 2 — TITLE. 100 (rolling up from 1) DAYS OF / MACHINE LEARNING with a burst, then
// three promise chips: 1 TOPIC A DAY · EXPLAINED SIMPLY · ZERO TO REAL PROJECTS.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Chip } from "../components/ML";
import { Burst, ease, useSpr } from "../components/Motion";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

export const S2Title: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s2");
  const HUND = s.cueS(0, "100");
  const ML = s.cueS(0, "Machine");
  const ONE = s.sent(1).from;
  const EXPL = s.cueS(1, "Explained");
  const ZERO = s.cueS(1, "zero");
  const t1 = spr(HUND - 6, theme.spring.pop);
  const t2 = spr(ML - 4, theme.spring.pop);
  const n = Math.round(interpolate(ease(frame, [HUND - 6, HUND + 16], [0, 1], theme.ease.out), [0, 1], [1, 100]));
  return (
    <AbsoluteFill>
      {t1 > 0.001 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 470, textAlign: "center", transform: `translateY(-50%) scale(${interpolate(Math.min(1, t1), [0, 1], [1.5, 1])})`, opacity: Math.min(1, t1 * 2), fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1, whiteSpace: "nowrap" }}>
          <span style={{ fontSize: 230, color: C.yellow, textShadow: glowText(C.yellow, 0.6), fontVariantNumeric: "tabular-nums" }}>{n}</span>
          <div style={{ marginTop: 4, fontSize: 70, letterSpacing: "0.08em", color: C.text }}>DAYS OF</div>
        </div>
      ) : null}
      {t2 > 0.001 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 790, textAlign: "center", transform: `translateY(-50%) scale(${interpolate(Math.min(1, t2), [0, 1], [1.4, 1])})`, opacity: Math.min(1, t2 * 2), fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1.0, letterSpacing: "-0.02em" }}>
          <div style={{ fontSize: 116, background: `linear-gradient(90deg, ${C.cyan}, ${C.violet}, ${C.orange})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 26px ${alpha(C.violet, 0.5)})` }}>MACHINE</div>
          <div style={{ fontSize: 116, background: `linear-gradient(90deg, ${C.cyan}, ${C.violet}, ${C.orange})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 26px ${alpha(C.violet, 0.5)})` }}>LEARNING</div>
        </div>
      ) : null}
      <Burst at={ML} x={540} y={790} color={C.violet} count={26} radius={420} seed={12} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1040, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <Chip t="1 TOPIC A DAY" c={C.cyan} p={spr(ONE - 4, theme.spring.pop)} size={28} />
        <Chip t="EXPLAINED SIMPLY" c={C.violet} p={spr(EXPL - 4, theme.spring.pop)} size={28} />
        <Chip t="ZERO TO REAL PROJECTS" c={C.orange} p={spr(ZERO - 4, theme.spring.pop)} size={28} />
      </div>
    </AbsoluteFill>
  );
};
