// SCENE 7 — HOW ODD WAS MONTE CARLO? 26 in a row ≈ 1 in 66 million (huge counter); a row of 25 black balls + "?" with
// "next spin: black still 48.6%"; RARE STREAKS HAPPEN · THEY DON'T CHANGE THE ODDS.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { HOT } from "../components/BKit";
import { Pill, Pop, Txt } from "../components/L";
import { ease } from "../components/Motion";
import { glowText, theme } from "../theme";
import { useScene } from "../timing";
import { Ball } from "./Bits";

const C = theme.colors;

export const S7Odds: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s7");
  const M = s.cueS(0, "66");
  const AFT = s.sent(1).from;
  const P = s.cueS(1, "48.6%");
  const RARE = s.cueS(1, "Rare");
  const v = Math.round(ease(frame, [M - 16, M + 6], [0, 66]));
  return (
    <AbsoluteFill>
      <Pop x={540} y={250} at={s.sent(0).from - 4}>
        <Txt size={48}>26 in a row?</Txt>
      </Pop>
      <div style={{ position: "absolute", left: 0, right: 0, top: 320, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 120, color: HOT, textShadow: glowText(HOT, 0.7), opacity: ease(frame, [M - 16, M - 10], [0, 1]), whiteSpace: "nowrap" }}>1 in {v} million</div>
      <div style={{ position: "absolute", left: 120, right: 120, top: 560, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10 }}>
        {Array.from({ length: 25 }, (_, i) => (
          <Ball key={i} c="B" size={60} p={ease(frame, [AFT + i, AFT + i + 4], [0, 1])} />
        ))}
        <div style={{ width: 60, height: 60, borderRadius: 30, border: `4px dashed ${C.yellow}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 34, color: C.yellow, opacity: ease(frame, [AFT + 26, AFT + 30], [0, 1]) }}>?</div>
      </div>
      <Pop x={540} y={900} at={P - 8}>
        <Txt size={52}>
          next spin, black: <span style={{ color: C.yellow }}>still 48.6%</span>
        </Txt>
      </Pop>
      <Pop x={540} y={1090} at={RARE - 4}>
        <Pill color={C.violet} size={42}>RARE STREAKS HAPPEN</Pill>
      </Pop>
      <Pop x={540} y={1210} at={s.cueS(1, "change") - 4}>
        <Pill color={HOT} size={42} solid>THEY DON&apos;T CHANGE THE ODDS</Pill>
      </Pop>
    </AbsoluteFill>
  );
};
