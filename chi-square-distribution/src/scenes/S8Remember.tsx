// SCENE 8 — REMEMBER. COMPARES SEEN vs EXPECTED COUNTS → SMALL SCORE: COULD BE LUCK → DEEP IN THE TAIL: SOMETHING REAL.
import React from "react";
import { AbsoluteFill } from "remotion";
import { RecapFlow } from "../components/Explain";
import { SceneTitle } from "../components/Kit";
import { useScene } from "../timing";
import { FAIR, GAP, OBSC } from "./S1Hook";

export const S8Remember: React.FC = () => {
  const s = useScene("s8");
  return (
    <AbsoluteFill>
      <SceneTitle label="REMEMBER" pill="CHI-SQUARE DISTRIBUTION" color={GAP} at={2} pillAt={s.sent(0).from} />
      <RecapFlow
        y0={600}
        gap={180}
        size={32}
        items={[
          { t: "COMPARES SEEN vs EXPECTED COUNTS", c: OBSC, at: s.cueS(0, "compares") },
          { t: "SMALL SCORE: COULD BE LUCK", c: FAIR, at: s.cueS(1, "small") },
          { t: "DEEP IN THE TAIL: SOMETHING REAL", c: GAP, at: s.cueS(1, "deep") },
        ]}
      />
    </AbsoluteFill>
  );
};
