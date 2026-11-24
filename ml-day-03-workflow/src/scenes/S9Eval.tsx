// SCENE 9 — STEP 7: EVALUATE, THEN DEPLOY. Step bar (7). The exam: 2,000 hidden flats; average miss Rs 4L vs target
// Rs 5L → PASSED stamp; then deploy: a phone app "Rs 71L estimate" + a MONITOR / RETRAIN every few months loop.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { PhoneFace } from "../components/Doodles";
import { Icon, Panel, Pill, Pop, Txt } from "../components/D2";
import { ease } from "../components/Motion";
import { StepBar } from "../components/Steps";
import { theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

export const S9Eval: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s9");
  const EX = s.sent(1).from;
  const FOUR = s.cueS(1, "4");
  const PASS = s.cueS(1, "Passed!");
  const DEP = s.sent(2).from;
  const top = 1 - ease(frame, [DEP - 8, DEP], [0, 1]);
  return (
    <AbsoluteFill>
      <StepBar cur={6} at={0} />
      <Pop x={540} y={420} at={s.sent(0).from}>
        <Txt size={64}>evaluate, then <span style={{ color: C.green }}>deploy</span></Txt>
      </Pop>
      <div style={{ position: "absolute", inset: 0, opacity: top }}>
        <Pop x={540} y={580} at={EX}>
          <Txt size={40} font="body">the exam: <span style={{ color: C.yellow }}>2,000 hidden flats</span></Txt>
        </Pop>
        <div style={{ position: "absolute", left: 0, right: 0, top: 660, display: "flex", justifyContent: "center", gap: 30 }}>
          <div style={{ opacity: ease(frame, [FOUR - 4, FOUR + 4], [0, 1]) }}>
            <Panel w={420} h={260} color={C.green}>
              <Txt size={30} color={C.dim} font="body">model&apos;s miss</Txt>
              <Txt size={90} color={C.green} glow>Rs 4L</Txt>
            </Panel>
          </div>
          <div style={{ opacity: ease(frame, [FOUR + 10, FOUR + 18], [0, 1]) }}>
            <Panel w={420} h={260} color={C.cyan}>
              <Txt size={30} color={C.dim} font="body">target</Txt>
              <Txt size={90} color={C.cyan}>Rs 5L</Txt>
            </Panel>
          </div>
        </div>
        <Pop x={540} y={1060} at={PASS - 4}>
          <div style={{ transform: "rotate(-6deg)" }}>
            <Pill color={C.green} size={70} solid>PASSED!</Pill>
          </div>
        </Pop>
      </div>
      {frame >= DEP - 8 ? (
        <AbsoluteFill style={{ opacity: 1 - top }}>
          <Pop x={300} y={800} at={DEP}>
            <Panel w={440} h={480} color={C.violet}>
              <Icon size={200}>
                <PhoneFace x={100} y={100} s={190} at={DEP} />
              </Icon>
              <Txt size={32} font="body">in an app:</Txt>
              <Txt size={50} color={C.violet}>Rs 71L estimate</Txt>
            </Panel>
          </Pop>
          <Pop x={790} y={800} at={s.cueS(2, "watching") - 4}>
            <Panel w={440} h={480} color={C.orange}>
              <Txt size={40}>keep watching</Txt>
              <Txt size={56} color={C.orange} glow>RETRAIN</Txt>
              <Txt size={32} font="body">every few months</Txt>
              <Txt size={28} font="body" color={C.dim}>(prices change)</Txt>
            </Panel>
          </Pop>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
