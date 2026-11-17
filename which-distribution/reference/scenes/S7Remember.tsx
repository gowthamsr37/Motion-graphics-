// SCENE 7 — REMEMBER. WAITING TIME → UNTIL THE NEXT EVENT → RANDOM, STEADY RATE.
// Then the pair: POISSON counts the events · EXPONENTIAL measures the gaps between them.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CurveIcon, RecapFlow } from "../components/Explain";
import { DotsIcon, GapIcon, Stopwatch } from "../components/Exp";
import { SceneTitle } from "../components/Kit";
import { useSpr } from "../components/Motion";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { GAP, LONG, RATE, SHORT } from "./S1Hook";

const C = theme.colors;

const PairCard: React.FC<{ x: number; at: number; title: string; line: string; color: string; icon: React.ReactNode }> = ({ x, at, title, line, color, icon }) => {
  const spr = useSpr();
  const p = spr(at - 6, theme.spring.bouncy);
  if (p <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: x, top: 1150, width: 420, height: 200, transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, p), [0, 1], [0.7, 1])})`, opacity: Math.min(1, p * 2), boxSizing: "border-box", borderRadius: 28, background: `linear-gradient(180deg, ${alpha(color, 0.2)}, rgba(14,24,64,0.92))`, border: `3px solid ${color}`, boxShadow: `0 0 26px ${alpha(color, 0.3)}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
      <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 38, color, textShadow: glowText(color, 0.4) }}>{title}</div>
      <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.1em", color: C.text, whiteSpace: "nowrap" }}>{line}</div>
      {icon}
    </div>
  );
};

export const S7Remember: React.FC = () => {
  useCurrentFrame();
  const s = useScene("s7");
  return (
    <AbsoluteFill>
      <SceneTitle label="REMEMBER" pill="EXPONENTIAL DISTRIBUTION" color={GAP} at={2} pillAt={s.sent(0).from} />
      <RecapFlow
        y0={540}
        gap={160}
        size={36}
        items={[
          { t: "MEASURES WAITING TIME", c: GAP, at: s.cueS(0, "waiting"), icon: <Stopwatch size={52} color={GAP} frac={0.3} /> },
          { t: "UNTIL THE NEXT EVENT", c: LONG, at: s.cueS(0, "next"), icon: <GapIcon color={LONG} w={110} /> },
          { t: "RANDOM, STEADY RATE", c: RATE, at: s.cueS(0, "random"), icon: <CurveIcon color={SHORT} f={(u) => Math.exp(-u * 3.5)} w={100} h={46} /> },
        ]}
      />
      <PairCard x={300} at={s.cueS(1, "Poisson")} title="POISSON" line="COUNTS THE EVENTS" color={RATE} icon={<DotsIcon color={GAP} w={200} />} />
      <PairCard x={780} at={s.cueS(1, "Exponential")} title="EXPONENTIAL" line="MEASURES THE GAPS" color={GAP} icon={<GapIcon color={LONG} w={200} />} />
    </AbsoluteFill>
  );
};
