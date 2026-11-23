// SCENE 3 — THE ANSWER: 50.7% counts up huge with a coin; then 70 people → 99.9% "almost certain".
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { HOT } from "../components/BKit";
import { Panel, Pop, Txt } from "../components/L";
import { ease } from "../components/Motion";
import { glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

export const S3Answer: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s3");
  const N = s.cueS(0, "50.7%.");
  const SEV = s.sent(1).from;
  const v = ease(frame, [N - 14, N + 6], [0, 50.7]);
  const v2 = ease(frame, [s.cueS(1, "99.9%.") - 14, s.cueS(1, "99.9%.") + 4], [50.7, 99.9]);
  return (
    <AbsoluteFill>
      <Pop x={540} y={300} at={s.sent(0).from - 4}>
        <Txt size={46} color={C.dim} font="body" style={{ letterSpacing: "0.12em" }}>THE REAL ANSWER</Txt>
      </Pop>
      <div style={{ position: "absolute", left: 0, right: 0, top: 380, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 260, color: HOT, textShadow: glowText(HOT, 0.8), opacity: ease(frame, [N - 16, N - 10], [0, 1]) }}>{v.toFixed(1)}%</div>
      <Pop x={540} y={760} at={s.cueS(0, "coin")}>
        <Txt size={52}>basically a <span style={{ color: C.yellow }}>coin flip</span></Txt>
      </Pop>
      <Pop x={540} y={1050} at={SEV - 4}>
        <Panel w={900} h={260} color={C.red}>
          <Txt size={40} font="body">with 70 people</Txt>
          <Txt size={110} color={C.red} glow>{(frame >= SEV ? v2 : 50.7).toFixed(1)}%</Txt>
        </Panel>
      </Pop>
    </AbsoluteFill>
  );
};
