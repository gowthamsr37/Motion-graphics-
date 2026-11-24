// SCENE 3 — STEP 1, PROBLEM DEFINITION. Manager's chat bubble "Predict flat prices." → real problem: a vague ask
// (FOR WHOM? buyers · sellers · a bank — HOW ACCURATE?) → do: ask questions first · agree on success: within Rs 8 lakh.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Chip, Row, StepScene } from "../components/StepScene";
import { Txt } from "../components/D2";
import { theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

export const S3Problem: React.FC = () => {
  const s = useScene("s3");
  const P = s.sent(1).from;
  return (
    <AbsoluteFill>
      <StepScene
        i={0}
        termAt={s.cueS(0, "problem")}
        headAt={s.cueS(0, "manager")}
        head={<>manager: <span style={{ color: C.yellow }}>&quot;predict flat prices.&quot;</span> that&apos;s it.</>}
        probAt={P - 4}
        problem={
          <>
            <Txt size={44}>a <span style={{ color: C.red }}>vague</span> ask</Txt>
            <Txt size={34} font="body" color={C.dim}>prices for whom?</Txt>
            <Row>
              <Chip c={C.cyan} at={s.cueS(1, "Buyers,")}>BUYERS</Chip>
              <Chip c={C.violet} at={s.cueS(1, "sellers,")}>SELLERS</Chip>
              <Chip c={C.orange} at={s.cueS(1, "bank?")}>A BANK</Chip>
            </Row>
            <Txt size={38} style={{ marginTop: 10 }}>how accurate is <span style={{ color: C.yellow }}>good enough?</span></Txt>
          </>
        }
        fixAt={s.sent(2).from - 4}
        fixes={[
          { t: "ask questions before you build", at: s.cueS(2, "ask") },
          { t: "agree on success: within Rs 8 lakh", at: s.cueS(2, "agree") },
        ]}
      />
    </AbsoluteFill>
  );
};
