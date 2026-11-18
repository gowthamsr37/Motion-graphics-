// SCENE 3 — TWO HYPOTHESES. NULL (H0): nothing's going on, the coin is fair (cyan). ALTERNATIVE (H1): something is
// going on, the coin favours heads (orange).
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { SceneTitle } from "../components/Kit";
import { useSpr } from "../components/Motion";
import { Coin } from "../components/Prob";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { ALT, DATA, NULLC } from "./S1Hook";

const C = theme.colors;

const Card: React.FC<{ y: number; p: number; tag: string; title: string; line1: string; line2: string; color: string; coins: ("H" | "T")[] }> = ({ y, p, tag, title, line1, line2, color, coins }) =>
  p > 0.001 ? (
    <div style={{ position: "absolute", left: 540, top: y, width: 880, height: 260, transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, p), [0, 1], [0.8, 1])})`, opacity: Math.min(1, p * 2), boxSizing: "border-box", borderRadius: 32, background: `linear-gradient(90deg, ${alpha(color, 0.2)}, rgba(14,24,64,0.94) 70%)`, border: `4px solid ${color}`, boxShadow: `0 0 30px ${alpha(color, 0.3)}` }}>
      <div style={{ position: "absolute", left: 36, top: 30, display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ padding: "6px 18px", borderRadius: 12, background: color, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 30, color: C.ink }}>{tag}</div>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 44, color, textShadow: glowText(color, 0.4) }}>{title}</div>
      </div>
      <div style={{ position: "absolute", left: 36, top: 112, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 36, color: C.text }}>{line1}</div>
      <div style={{ position: "absolute", left: 36, top: 168, fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 30, color: C.dim }}>{line2}</div>
      <div style={{ position: "absolute", right: 36, top: 110, display: "flex", gap: 8 }}>
        {coins.map((c, i) => <Coin key={i} side={c} size={58} />)}
      </div>
    </div>
  ) : null;

export const S3Hypotheses: React.FC = () => {
  const spr = useSpr();
  const s = useScene("s3");
  return (
    <AbsoluteFill>
      <SceneTitle label="TWO HYPOTHESES" color={DATA} at={2} />
      <Card y={650} p={spr(s.sent(1).from - 4, theme.spring.bouncy)} tag="H0" title="THE NULL" line1="Nothing's going on" line2="The coin is fair" color={NULLC} coins={["H", "T"]} />
      <Card y={960} p={spr(s.sent(2).from - 4, theme.spring.bouncy)} tag="H1" title="THE ALTERNATIVE" line1="Something is going on" line2="The coin favours heads" color={ALT} coins={["H", "H"]} />
    </AbsoluteFill>
  );
};
