// SCENE 5 — THE HEALTHY CROWD: "9,990 healthy"; on "1% of them" the 101 false-positive dots light orange across the grid,
// counter to ~100; "100 healthy people told they're sick" → FALSE POSITIVES.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Crowd, FALSE, N_FP } from "../components/People";
import { Pill, Pop, Txt } from "../components/L";
import { ease } from "../components/Motion";
import { theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

export const S5Healthy: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s5");
  const ONE = s.sent(1).from;
  const fp = ease(frame, [ONE + 10, ONE + 40], [0, 1]);
  return (
    <AbsoluteFill>
      <Pop x={540} y={250} at={s.cueS(0, "9,990") - 6}>
        <Txt size={54}><span style={{ color: C.green }}>9,990</span> are healthy</Txt>
      </Pop>
      <div style={{ position: "absolute", left: 140, top: 320 }}>
        <Crowd size={800} sick={1} fp={fp} />
      </div>
      <Pop x={540} y={1180} at={ONE}>
        <Txt size={46}>
          test is wrong for <span style={{ color: FALSE }}>1%</span> → <span style={{ color: FALSE, fontFamily: theme.fonts.mono }}>{Math.round(N_FP * fp)}</span> people
        </Txt>
      </Pop>
      <Pop x={540} y={1290} at={s.cueS(2, "false") - 4}>
        <Pill color={FALSE} size={44} solid>~100 FALSE POSITIVES</Pill>
      </Pop>
    </AbsoluteFill>
  );
};
