// SCENE 6 — STEP 4: THREE PLOTS. Step bar (4). Three chart cards land on their names: PRICE vs AREA (scatter + trend),
// AVG PRICE BY AREA OF THE CITY (bars: Koramangala · Whitefield · HSR · Hebbal · E-City, tallest highlighted),
// PRICE HISTOGRAM; finding line "price climbs with size · Koramangala costs the most".
import React from "react";
import { AbsoluteFill } from "remotion";
import { Panel, Pop, Txt } from "../components/D2";
import { JargonTag, StepBar } from "../components/Steps";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const dots = Array.from({ length: 22 }, (_, i) => [16 + i * 12 + ((i * 37) % 9), 150 - i * 5.5 - ((i * 53) % 21)]);
const BARS = [
  { n: "Koramangala", v: 1.0 },
  { n: "Whitefield", v: 0.78 },
  { n: "HSR", v: 0.86 },
  { n: "Hebbal", v: 0.7 },
  { n: "E-City", v: 0.48 },
];
const HIST = [2, 5, 9, 14, 12, 8, 5, 3, 2, 1];

export const S6Plots: React.FC = () => {
  const s = useScene("s6");
  const cards = [
    { t: "PRICE vs SIZE", c: C.cyan, at: s.cueS(1, "versus"), el: (
      <svg width={300} height={170}><line x1={8} y1={162} x2={300} y2={162} stroke={alpha(C.text, 0.4)} strokeWidth={3} /><line x1={8} y1={0} x2={8} y2={162} stroke={alpha(C.text, 0.4)} strokeWidth={3} />{dots.map((d, i) => <circle key={i} cx={d[0]} cy={d[1]} r={5.5} fill={C.cyan} />)}<line x1={16} y1={150} x2={290} y2={30} stroke={C.yellow} strokeWidth={4} /></svg>) },
    { t: "AVG PRICE BY AREA", c: C.violet, at: s.cueS(1, "Average"), el: (
      <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 170 }}>
        {BARS.map((b, i) => (
          <div key={b.n} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{ width: 46, height: 130 * b.v, borderRadius: 6, background: i === 0 ? C.yellow : alpha(C.violet, 0.8) }} />
            <div style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 14, color: C.dim, whiteSpace: "nowrap" }}>{b.n}</div>
          </div>
        ))}
      </div>) },
    { t: "PRICE HISTOGRAM", c: C.orange, at: s.cueS(1, "histogram"), el: (
      <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 160 }}>
        {HIST.map((h, i) => <div key={i} style={{ width: 26, height: h * 10, background: C.orange, borderRadius: 4 }} />)}
      </div>) },
  ];
  return (
    <AbsoluteFill>
      <StepBar cur={3} at={0} />
      <JargonTag i={3} at={s.cueS(0, "exploratory")} />
      <Pop x={540} y={440} at={s.sent(0).from}>
        <Txt size={62}>make <span style={{ color: C.green }}>3 plots</span> first</Txt>
      </Pop>
      {cards.map((k, i) => (
        <Pop key={k.t} x={540} y={620 + i * 235} at={k.at - 6}>
          <Panel w={960} h={215} color={k.c} style={{ flexDirection: "row", gap: 40 }}>
            <div style={{ width: 320, display: "flex", justifyContent: "center" }}>{k.el}</div>
            <Txt size={40}>{k.t}</Txt>
          </Panel>
        </Pop>
      ))}
      <Pop x={540} y={1330} at={s.sent(2).from - 2}>
        <Txt size={34} font="body">
          price climbs with size · <span style={{ color: C.yellow }}>Koramangala</span> costs the most
        </Txt>
      </Pop>
    </AbsoluteFill>
  );
};
