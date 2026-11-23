// SCENE 8 — EVERYDAY TRAPS, one panel per sentence: THREE BOYS → "girl next?" still ≈ 50-50 · CAPTION LOST 5 TOSSES
// → "due to win?" the coin doesn't care · LOTTERY: avoiding last week's numbers → same chance as any.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Guy, HOT } from "../components/BKit";
import { Panel, Pop, Txt } from "../components/L";
import { ease } from "../components/Motion";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

const Row: React.FC<{ y: number; at: number; ans: number; c: string; icon: React.ReactNode; q: string; a: string }> = ({ y, at, ans, c, icon, q, a }) => {
  const frame = useCurrentFrame();
  return (
    <Pop x={540} y={y} at={at - 6}>
      <Panel w={980} h={250} color={c} style={{ flexDirection: "row", justifyContent: "flex-start", gap: 30, padding: "0 34px" }}>
        <div style={{ width: 200, display: "flex", justifyContent: "center" }}>{icon}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Txt size={40}>{q}</Txt>
          <Txt size={40} color={c} style={{ opacity: ease(frame, [ans - 4, ans + 6], [0, 1]) }}>{a}</Txt>
        </div>
      </Panel>
    </Pop>
  );
};

export const S8Life: React.FC = () => {
  const s = useScene("s8");
  return (
    <AbsoluteFill>
      <Pop x={540} y={250} at={s.sent(0).from - 4}>
        <Txt size={58}>
          it fools us <span style={{ color: HOT }}>everywhere</span>
        </Txt>
      </Pop>
      <Row y={480} at={s.sent(1).from} ans={s.cueS(1, "still")} c={C.cyan} q="3 boys → a girl next?" a="still ≈ 50-50"
        icon={<div style={{ display: "flex", gap: 6 }}>{[0, 1, 2].map((i) => <Guy key={i} size={50} color={C.cyan} />)}<Guy size={50} color={alpha(C.text, 0.3)} /></div>} />
      <Row y={780} at={s.sent(2).from} ans={s.cueS(2, "coin")} c={C.yellow} q="lost 5 tosses → due to win?" a="the coin doesn't care"
        icon={<div style={{ display: "flex", gap: 6 }}>{[0, 1, 2, 3, 4].map((i) => <div key={i} style={{ width: 30, height: 30, borderRadius: 15, background: C.red }} />)}</div>} />
      <Row y={1080} at={s.sent(3).from} ans={s.cueS(3, "exactly")} c={C.violet} q="avoid last week's numbers?" a="exactly as likely as any"
        icon={<div style={{ display: "flex", gap: 6 }}>{["07", "19", "33"].map((n) => <div key={n} style={{ width: 56, height: 56, borderRadius: 28, background: C.violet, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 24, color: C.ink }}>{n}</div>)}</div>} />
    </AbsoluteFill>
  );
};
