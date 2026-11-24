// SCENE 5 — STEP 3, DATA CLEANING. "Where most of your time goes"; messy chips: "2 BHK" · "2bhk" · "two bedroom" (= same),
// sq ft vs sq m, the same flat posted by 3 brokers → do: standardise everything · remove duplicates · flag the suspicious.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Chip, Row, StepScene } from "../components/StepScene";
import { Txt } from "../components/D2";
import { theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

export const S5Clean: React.FC = () => {
  const s = useScene("s5");
  const P = s.sent(1).from;
  return (
    <AbsoluteFill>
      <StepScene
        i={2}
        termAt={s.cueS(0, "data")}
        headAt={s.cueS(0, "most")}
        head={<>where <span style={{ color: C.orange }}>most of your time</span> goes</>}
        probAt={P - 4}
        problem={
          <>
            <Row>
              <Chip c={C.orange} at={P}>&quot;2 BHK&quot;</Chip>
              <Chip c={C.orange} at={P + 6}>&quot;2bhk&quot;</Chip>
              <Chip c={C.orange} at={P + 12}>&quot;two bedroom&quot;</Chip>
            </Row>
            <Txt size={30} font="body" color={C.dim}>all the same thing</Txt>
            <Row>
              <Chip c={C.cyan} at={s.cueS(1, "Area")}>1,200 sq ft</Chip>
              <Txt size={40}>vs</Txt>
              <Chip c={C.cyan} at={s.cueS(1, "Area") + 8}>111 sq m</Chip>
            </Row>
            <Row>
              <Chip c={C.red} at={s.cueS(1, "same", 1)}>SAME FLAT × 3 BROKERS</Chip>
            </Row>
          </>
        }
        fixAt={s.sent(2).from - 4}
        fixes={[
          { t: "standardise units + spellings", at: s.cueS(2, "standardise") },
          { t: "remove duplicates · flag suspicious rows", at: s.cueS(2, "remove") },
        ]}
      />
    </AbsoluteFill>
  );
};
