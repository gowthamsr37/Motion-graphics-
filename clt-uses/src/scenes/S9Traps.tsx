// SCENE 9 — TWO INTERVIEW TRAPS. 1 IT'S ABOUT AVERAGES, NOT THE DATA (individual values stay skewed: a skewed icon stays
// skewed) · 2 IT NEEDS INDEPENDENCE + ENOUGH DATA (~30 for mild skew, far more for heavy tails like incomes).
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { CurveIcon } from "../components/Explain";
import { SceneTitle } from "../components/Kit";
import { useSpr } from "../components/Motion";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

const Trap: React.FC<{ y: number; at: number; n: number; c: string; head: string; body: React.ReactNode; icon: React.ReactNode }> = ({ y, at, n, c, head, body, icon }) => {
  const spr = useSpr();
  const p = spr(at - 6, theme.spring.bouncy);
  if (p <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: 90, top: y, width: 900, height: 300, boxSizing: "border-box", borderRadius: 30, background: `linear-gradient(90deg, ${alpha(c, 0.18)}, rgba(14,24,64,0.9) 55%)`, border: `3px solid ${c}`, opacity: Math.min(1, p * 2), transform: `translateX(${(1 - Math.min(1, p)) * 60}px) scale(${interpolate(Math.min(1, p), [0, 1], [0.94, 1])})`, padding: "26px 34px", display: "flex", gap: 26 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 38, color: C.text }}>
          <span style={{ width: 54, height: 54, borderRadius: 27, background: c, color: C.ink, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 30 }}>{n}</span>
          {head}
        </div>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 30, lineHeight: 1.3, color: C.dim }}>{body}</div>
      </div>
      <div style={{ alignSelf: "center" }}>{icon}</div>
    </div>
  );
};

export const S9Traps: React.FC = () => {
  const s = useScene("s9");
  return (
    <AbsoluteFill>
      <SceneTitle label="TWO INTERVIEW TRAPS" color={C.orange} at={2} />
      <Trap y={430} at={s.sent(1).from} n={1} c={C.orange} head="AVERAGES, NOT THE DATA" body={<>Individual values <span style={{ color: C.orange }}>stay skewed</span>. Only the averages become a bell.</>} icon={<CurveIcon color={C.orange} f={(x) => Math.max(0, x * 4 * Math.exp(-x * 7) * 2.2)} w={180} h={90} />} />
      <Trap y={790} at={s.sent(2).from} n={2} c={C.cyan} head="INDEPENDENT + ENOUGH DATA" body={<>About <span style={{ color: C.cyan }}>30</span> for mild skew. <span style={{ color: C.cyan }}>Far more</span> for heavy tails like incomes.</>} icon={<CurveIcon color={C.cyan} f={(x) => Math.exp(-((x - 0.5) ** 2) / 0.02)} w={180} h={90} />} />
    </AbsoluteFill>
  );
};
