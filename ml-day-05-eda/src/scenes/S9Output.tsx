// SCENE 9 — THE OUTPUT OF EDA: "not pretty charts" (a chart card struck out) → A LIST OF DECISIONS: use the median ·
// split villas · drop tiny groups · adjust for time (each on its word) + QUESTIONS FOR THE BUSINESS.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Panel, Pill, Pop, Txt } from "../components/D2";
import { ease } from "../components/Motion";
import { theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const D = [
  { t: "use the median", w: "median,", c: C.cyan },
  { t: "split the villas", w: "split", c: C.violet },
  { t: "drop tiny groups", w: "drop", c: C.yellow },
  { t: "adjust for time", w: "adjust", c: C.red },
];

export const S9Output: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s9");
  const DEC = s.cueS(0, "decisions:");
  return (
    <AbsoluteFill>
      <Pop x={540} y={260} at={s.sent(0).from - 4}>
        <Txt size={50}>the output of EDA isn&apos;t</Txt>
      </Pop>
      <Pop x={540} y={350} at={s.cueS(0, "pretty") - 4}>
        <div style={{ position: "relative" }}>
          <Txt size={60} color={C.dim}>pretty charts</Txt>
          <div style={{ position: "absolute", left: -10, right: -10, top: "52%", height: 7, borderRadius: 4, background: C.red, transform: `scaleX(${ease(frame, [s.cueS(0, "charts.") + 4, s.cueS(0, "charts.") + 12], [0, 1])}) rotate(-4deg)`, transformOrigin: "left center" }} />
        </div>
      </Pop>
      <Pop x={540} y={720} at={DEC - 4}>
        <Panel w={960} h={520} color={C.green} style={{ alignItems: "flex-start", padding: "0 50px", gap: 22 }}>
          <Txt size={40} color={C.green}>it&apos;s a list of DECISIONS</Txt>
          {D.map((d, i) => (
            <div key={d.t} style={{ display: "flex", alignItems: "center", gap: 18, opacity: ease(frame, [s.cueS(0, d.w) - 4, s.cueS(0, d.w) + 4], [0, 1]) }}>
              <div style={{ width: 50, height: 50, borderRadius: 25, background: d.c, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 26, color: C.ink }}>{i + 1}</div>
              <Txt size={46}>{d.t}</Txt>
            </div>
          ))}
        </Panel>
      </Pop>
      <Pop x={540} y={1110} at={s.sent(1).from - 2}>
        <Pill color={C.yellow} size={40}>+ QUESTIONS FOR THE BUSINESS</Pill>
      </Pop>
    </AbsoluteFill>
  );
};
