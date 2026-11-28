// SCENE 1 — HOOK FROM FRAME 0 (with the series strip "100 DAYS OF ML · DAY 5 · EDA" visible from frame 0): four dataset
// cards with IDENTICAL stats (mean x 9 · mean y 7.50 · variance 11 · correlation 0.816) and a "?" where the plot will
// be; "SAME NUMBERS." then "NOW LOOK."
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Panel, Pill, Pop, Txt } from "../components/D2";
import { ease } from "../components/Motion";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
export const SET_C = [C.cyan, C.green, C.orange, C.violet];

export const SeriesStrip: React.FC = () => (
  <div style={{ position: "absolute", left: 0, right: 0, top: 200, display: "flex", justifyContent: "center", gap: 14 }}>
    <Pill color={C.violet} size={26}>100 DAYS OF ML</Pill>
    <Pill color={C.yellow} size={26}>DAY 5 · EDA</Pill>
  </div>
);

export const S1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s1");
  const LOOK = s.sent(1).from;
  return (
    <AbsoluteFill>
      <SeriesStrip />
      <Pop x={540} y={320} at={0}>
        <Txt size={50}>4 datasets. <span style={{ color: C.yellow }}>identical stats.</span></Txt>
      </Pop>
      {SET_C.map((c, i) => (
        <Pop key={i} x={i % 2 ? 790 : 290} y={i < 2 ? 590 : 990} at={4 + i * 4}>
          <Panel w={470} h={360} color={c} style={{ gap: 8 }}>
            <Txt size={30} color={c}>DATASET {i + 1}</Txt>
            {[["average", "7.50"], ["variance", "4.12"], ["correlation", "0.816"]].map(([k, v], j) => (
              <div key={k} style={{ width: 380, display: "flex", justifyContent: "space-between", padding: "6px 14px", borderRadius: 10, background: alpha(C.text, 0.06), fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 28, color: C.text, opacity: ease(frame, [s.cueS(0, ["average,", "spread,", "correlation."][j]) - 4, s.cueS(0, ["average,", "spread,", "correlation."][j]) + 4], [0, 1]) }}>
                <span style={{ color: C.dim }}>{k}</span>
                <span>{v}</span>
              </div>
            ))}
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 60, color: C.yellow, opacity: ease(frame, [LOOK - 6, LOOK], [0, 1]) }}>?</div>
          </Panel>
        </Pop>
      ))}
      <Pop x={540} y={1290} at={s.cueS(1, "Same") - 2}>
        <Pill color={C.yellow} size={44} solid>SAME NUMBERS. NOW LOOK.</Pill>
      </Pop>
    </AbsoluteFill>
  );
};
