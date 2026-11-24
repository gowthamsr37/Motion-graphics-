// SCENE 8 — STEP 6, MODEL TRAINING. A score meter shooting to 99% "too good"; the culprit column DAYS ON MARKET
// (only known after it sells) flagged → DATA LEAKAGE; remove it → an honest score (88%).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Chip, Row, StepScene } from "../components/StepScene";
import { Txt } from "../components/D2";
import { ease } from "../components/Motion";
import { theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

export const S8Train: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s8");
  const TOO = s.cueS(0, "Too");
  const DAYS = s.cueS(1, "days");
  const LEAK = s.cueS(1, "leakage.");
  const REM = s.cueS(1, "Remove");
  const score = frame < REM ? ease(frame, [s.cueS(0, "amazingly") - 6, TOO], [40, 99]) : ease(frame, [REM, REM + 20], [99, 88]);
  return (
    <AbsoluteFill>
      <StepScene
        i={5}
        termAt={s.cueS(0, "model")}
        headAt={s.cueS(0, "amazingly") - 4}
        head={<>the model scores amazingly. <span style={{ color: C.red }}>too well.</span></>}
        probAt={TOO - 2}
        problem={
          <>
            <Txt size={90} font="mono" color={frame < REM ? C.red : C.green} glow>{Math.round(score)}%</Txt>
            <Row>
              <Chip c={C.dim} at={DAYS - 10}>AREA</Chip>
              <Chip c={C.dim} at={DAYS - 8}>BEDS</Chip>
              <Chip c={C.red} at={DAYS - 2} strike={frame >= REM}>DAYS ON MARKET</Chip>
            </Row>
            <Txt size={32} font="body" style={{ opacity: ease(frame, [DAYS + 6, DAYS + 14], [0, 1]) }}>only known <span style={{ color: C.red }}>after</span> the flat sells</Txt>
            <Txt size={46} color={C.red} glow style={{ opacity: ease(frame, [LEAK - 4, LEAK + 4], [0, 1]) }}>DATA LEAKAGE</Txt>
          </>
        }
        probH={460}
        fixAt={REM - 4}
        fixes={[
          { t: "remove the leaky column", at: REM },
          { t: "get an honest score", at: s.cueS(1, "honest") },
        ]}
      />
    </AbsoluteFill>
  );
};
