// SCENE 4 — 10,000 PEOPLE: the 100×100 crowd fills in; on "10 people" the 10 sick dots grow red; on "catches" each gets
// a check → 10 TRUE POSITIVES counter.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Crowd, SICK } from "../components/People";
import { Pill, Pop, Txt } from "../components/L";
import { ease } from "../components/Motion";
import { theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

export const S4Crowd: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s4");
  const P = s.cueS(0, "10,000");
  const SICKW = s.cueS(1, "10");
  const CATCH = s.cueS(2, "catches");
  return (
    <AbsoluteFill>
      <Pop x={540} y={250} at={P - 6}>
        <Txt size={58}>picture <span style={{ color: C.cyan }}>10,000 people</span></Txt>
      </Pop>
      <div style={{ position: "absolute", left: 140, top: 320 }}>
        <Crowd size={800} show={ease(frame, [P - 4, P + 30], [0, 1])} sick={ease(frame, [SICKW - 4, SICKW + 10], [0, 1])} />
      </div>
      <Pop x={540} y={1180} at={SICKW - 2}>
        <Txt size={46}>1 in 1,000 → <span style={{ color: SICK }}>10 are sick</span></Txt>
      </Pop>
      <Pop x={540} y={1290} at={CATCH}>
        <Pill color={C.green} size={44} solid>10 TRUE POSITIVES</Pill>
      </Pop>
    </AbsoluteFill>
  );
};
