// SCENE 6 — STEP 4: EXPLORE. Step bar (4). Three mini charts land on their sentences: price vs area (rising dots +
// trend), near IT parks vs far (two bars), building age vs price (gently falling); each with a one-line finding.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Panel, Pop, Txt } from "../components/D2";
import { StepBar } from "../components/Steps";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const dots = Array.from({ length: 18 }, (_, i) => [20 + i * 15 + ((i * 37) % 11), 150 - i * 7 - ((i * 53) % 23)]);

export const S6Explore: React.FC = () => {
  const s = useScene("s6");
  const cards = [
    { t: "bigger flats → pricier", c: C.cyan, at: s.cueS(1, "Bigger"), chart: (
      <svg width={300} height={170}>
        <line x1={10} y1={160} x2={300} y2={160} stroke={alpha(C.text, 0.4)} strokeWidth={3} />
        {dots.map((d, i) => <circle key={i} cx={d[0]} cy={d[1]} r={6} fill={C.cyan} />)}
        <line x1={20} y1={150} x2={290} y2={25} stroke={C.yellow} strokeWidth={4} />
      </svg>) },
    { t: "near IT parks → pricier", c: C.violet, at: s.cueS(1, "IT"), chart: (
      <svg width={300} height={170}>
        <line x1={10} y1={160} x2={300} y2={160} stroke={alpha(C.text, 0.4)} strokeWidth={3} />
        <rect x={50} y={30} width={80} height={130} rx={8} fill={C.violet} />
        <rect x={170} y={80} width={80} height={80} rx={8} fill={alpha(C.violet, 0.45)} />
      </svg>) },
    { t: "older → a little cheaper", c: C.orange, at: s.cueS(1, "Older"), chart: (
      <svg width={300} height={170}>
        <line x1={10} y1={160} x2={300} y2={160} stroke={alpha(C.text, 0.4)} strokeWidth={3} />
        <polyline points="20,50 80,60 140,72 200,80 280,95" fill="none" stroke={C.orange} strokeWidth={6} />
      </svg>) },
  ];
  return (
    <AbsoluteFill>
      <StepBar cur={3} at={0} />
      <Pop x={540} y={420} at={s.sent(0).from}>
        <Txt size={70}>explore the <span style={{ color: C.green }}>data</span></Txt>
      </Pop>
      {cards.map((k, i) => (
        <Pop key={k.t} x={540} y={640 + i * 250} at={k.at - 6}>
          <Panel w={960} h={220} color={k.c} style={{ flexDirection: "row", gap: 40 }}>
            {k.chart}
            <Txt size={42}>{k.t}</Txt>
          </Panel>
        </Pop>
      ))}
    </AbsoluteFill>
  );
};
