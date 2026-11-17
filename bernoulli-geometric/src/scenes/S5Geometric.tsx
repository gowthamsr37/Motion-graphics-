// SCENE 5 — GEOMETRIC, THE DEFINITION: counts the TRIES · until the FIRST SUCCESS. Then the link: exponential measures
// waiting TIME; geometric counts waiting TRIES.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { DefCard } from "../components/Explain";
import { Stopwatch } from "../components/Exp";
import { SceneTitle } from "../components/Kit";
import { useSpr } from "../components/Motion";
import { Die } from "../components/Prob";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";
import { NO, TRY, YES } from "./S1Hook";

const C = theme.colors;

export const S5Geometric: React.FC = () => {
  useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s5");
  const LIKE = s.cueS(2, "Like");
  const COUNTS = s.cueS(2, "counts");
  const doneAt = s.sent(2).from - 4;
  const card = (at: number, x: number, title: string, line: string, color: string, icon: React.ReactNode) => {
    const p = spr(at - 6, theme.spring.bouncy);
    if (p <= 0.001) return null;
    return (
      <div style={{ position: "absolute", left: x, top: 1010, width: 420, height: 230, transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, p), [0, 1], [0.7, 1])})`, opacity: Math.min(1, p * 2), boxSizing: "border-box", borderRadius: 28, background: `linear-gradient(180deg, ${alpha(color, 0.2)}, rgba(14,24,64,0.92))`, border: `3px solid ${color}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
        {icon}
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 34, color }}>{title}</div>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.12em", color: C.text }}>{line}</div>
      </div>
    );
  };
  return (
    <AbsoluteFill>
      <SceneTitle label="GEOMETRIC" pill="IN SIMPLE WORDS" color={TRY} at={2} pillAt={s.sent(0).from} />
      <DefCard
        y0={560}
        gap={160}
        doneAt={doneAt}
        size={38}
        rows={[
          { pre: "Counts the ", key: "TRIES", c: TRY, at: s.cueS(1, "tries"), icon: <div style={{ display: "flex", gap: 6 }}>{[3, 1, 5].map((v, i) => <Die key={i} value={v} size={34} color={NO} />)}</div> },
          { pre: "until the ", key: "FIRST SUCCESS", c: YES, at: s.cueS(1, "first"), icon: <Die value={6} size={44} color={YES} glow={0.8} /> },
        ]}
      />
      {card(LIKE, 300, "EXPONENTIAL", "WAITING TIME", NO, <Stopwatch size={60} color={NO} frac={0.3} />)}
      {card(COUNTS, 780, "GEOMETRIC", "WAITING TRIES", TRY, <div style={{ display: "flex", gap: 6 }}>{[3, 1, 5, 6].map((v, i) => <Die key={i} value={v} size={40} color={v === 6 ? YES : TRY} />)}</div>)}
    </AbsoluteFill>
  );
};
