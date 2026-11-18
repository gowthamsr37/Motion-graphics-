// SCENE 7 — REMEMBER. ASSUME NOTHING'S GOING ON → HOW SURPRISING IS THE DATA? → REALLY SURPRISING: REJECT.
import React from "react";
import { AbsoluteFill } from "remotion";
import { RecapFlow } from "../components/Explain";
import { SceneTitle } from "../components/Kit";
import { useScene } from "../timing";
import { ALT, DATA, NULLC } from "./S1Hook";

export const S7Remember: React.FC = () => {
  const s = useScene("s7");
  return (
    <AbsoluteFill>
      <SceneTitle label="REMEMBER" pill="HYPOTHESIS TESTING" color={DATA} at={2} pillAt={s.sent(0).from} />
      <RecapFlow
        y0={600}
        gap={180}
        size={34}
        items={[
          { t: "ASSUME NOTHING'S GOING ON", c: NULLC, at: s.cueS(0, "assume") },
          { t: "HOW SURPRISING IS THE DATA?", c: DATA, at: s.cueS(0, "surprising") },
          { t: "REALLY SURPRISING? REJECT IT", c: ALT, at: s.cueS(1, "reject") },
        ]}
      />
    </AbsoluteFill>
  );
};
