// SCENE 7 — REMEMBER. A RANGE, NOT ONE NUMBER → AVERAGE ± MARGIN → MORE DATA, NARROWER RANGE.
import React from "react";
import { AbsoluteFill } from "remotion";
import { RecapFlow } from "../components/Explain";
import { SceneTitle } from "../components/Kit";
import { useScene } from "../timing";
import { RANGE, SAMPLE, TRUE } from "./S1Hook";

export const S7Remember: React.FC = () => {
  const s = useScene("s7");
  return (
    <AbsoluteFill>
      <SceneTitle label="REMEMBER" pill="CONFIDENCE INTERVALS" color={RANGE} at={2} pillAt={s.sent(0).from} />
      <RecapFlow
        y0={600}
        gap={180}
        size={36}
        items={[
          { t: "A RANGE, NOT ONE NUMBER", c: RANGE, at: s.cueS(0, "range") },
          { t: "AVERAGE ± MARGIN", c: SAMPLE, at: s.cueS(1, "Average,") },
          { t: "MORE DATA, NARROWER RANGE", c: TRUE, at: s.cueS(1, "More") },
        ]}
      />
    </AbsoluteFill>
  );
};
