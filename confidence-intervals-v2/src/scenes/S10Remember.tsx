// SCENE 10 — REMEMBER. A RANGE, NOT ONE NUMBER → ESTIMATE ± MARGIN OF ERROR → LIKELY HOLDS THE TRUE VALUE.
import React from "react";
import { AbsoluteFill } from "remotion";
import { RecapFlow } from "../components/Explain";
import { SceneTitle } from "../components/Kit";
import { useScene } from "../timing";
import { EST, RANGE, TRUE } from "./S1Hook";

export const S10Remember: React.FC = () => {
  const s = useScene("s10");
  return (
    <AbsoluteFill>
      <SceneTitle label="REMEMBER" pill="CONFIDENCE INTERVALS" color={RANGE} at={2} pillAt={s.sent(0).from} />
      <RecapFlow
        y0={600}
        gap={180}
        size={36}
        items={[
          { t: "A RANGE, NOT ONE NUMBER", c: RANGE, at: s.cueS(0, "interval") },
          { t: "ESTIMATE ± MARGIN OF ERROR", c: EST, at: s.cueS(0, "estimate,") },
          { t: "LIKELY HOLDS THE TRUE VALUE", c: TRUE, at: s.cueS(1, "likely") },
        ]}
      />
    </AbsoluteFill>
  );
};
