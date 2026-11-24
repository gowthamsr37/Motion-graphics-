// SCENE 4 — STEP 2, DATA COLLECTION. Three listing sources (SITE A · SITE B · BROKER SHEET) with gaps: "price: —" on half,
// ASKING PRICE ≠ SOLD PRICE → do: combine sources · note what each one measures.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Chip, Row, StepScene } from "../components/StepScene";
import { Txt } from "../components/D2";
import { theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

export const S4Collect: React.FC = () => {
  const s = useScene("s4");
  const P = s.sent(1).from;
  return (
    <AbsoluteFill>
      <StepScene
        i={1}
        termAt={s.cueS(0, "data")}
        headAt={s.cueS(0, "never")}
        head={<>the data is <span style={{ color: C.red }}>never in one place</span></>}
        probAt={P - 4}
        problem={
          <>
            <Row>
              <Chip c={C.cyan} at={s.cueS(1, "Listings")}>SITE A</Chip>
              <Chip c={C.violet} at={s.cueS(1, "Listings") + 4}>SITE B</Chip>
              <Chip c={C.orange} at={s.cueS(1, "Listings") + 8}>BROKER SHEET</Chip>
            </Row>
            <Txt size={40} style={{ marginTop: 8 }}>half have <span style={{ color: C.red }}>no price</span></Txt>
            <Row>
              <Chip c={C.yellow} at={s.cueS(1, "asking")}>ASKING PRICE</Chip>
              <Txt size={50} color={C.red}>≠</Txt>
              <Chip c={C.green} at={s.cueS(1, "sold")}>SOLD PRICE</Chip>
            </Row>
          </>
        }
        fixAt={s.sent(2).from - 4}
        fixes={[
          { t: "combine the sources", at: s.cueS(2, "combine") },
          { t: "note what each one really measures", at: s.cueS(2, "note") },
        ]}
      />
    </AbsoluteFill>
  );
};
