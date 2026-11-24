// SCENE 3 — STEP 1: DEFINE THE PROBLEM. Step bar (1). Card: PREDICT → price of a flat (Rs lakh) → it's a NUMBER →
// REGRESSION; SUCCESS = off by under Rs 5 lakh on average (target meter).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { ease } from "../components/Motion";
import { Panel, Pill, Pop, Txt } from "../components/D2";
import { StepBar } from "../components/Steps";
import { theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

export const S3Define: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s3");
  return (
    <AbsoluteFill>
      <StepBar cur={0} at={s.sent(0).from - 6} />
      <Pop x={540} y={420} at={s.sent(0).from}>
        <Txt size={70}>define the <span style={{ color: C.cyan }}>problem</span></Txt>
      </Pop>
      <Pop x={540} y={640} at={s.sent(1).from}>
        <Panel w={960} h={260} color={C.cyan}>
          <Txt size={32} color={C.dim} font="body" style={{ letterSpacing: "0.12em" }}>WHAT DO WE PREDICT?</Txt>
          <Txt size={56}>the price of a flat, in <span style={{ color: C.cyan }}>Rs lakh</span></Txt>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <Txt size={36} font="body">a number →</Txt>
            <div style={{ opacity: ease(frame, [s.cueS(1, "regression") - 2, s.cueS(1, "regression") + 6], [0, 1]) }}>
              <Pill color={C.cyan} size={34} solid>REGRESSION</Pill>
            </div>
          </div>
        </Panel>
      </Pop>
      <Pop x={540} y={1000} at={s.sent(2).from}>
        <Panel w={960} h={300} color={C.green}>
          <Txt size={32} color={C.dim} font="body" style={{ letterSpacing: "0.12em" }}>HOW DO WE JUDGE SUCCESS?</Txt>
          <Txt size={50}>off by <span style={{ color: C.green }}>under Rs 5 lakh</span></Txt>
          <Txt size={36} font="body">on average</Txt>
        </Panel>
      </Pop>
    </AbsoluteFill>
  );
};
