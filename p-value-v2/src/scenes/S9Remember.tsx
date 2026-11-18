// SCENE 9 — REMEMBER. HOW SURPRISING IS MY DATA? (if nothing special were going on) → SMALL p = SURPRISING →
// BELOW 0.05 = SIGNIFICANT.
import React from "react";
import { AbsoluteFill } from "remotion";
import { RecapFlow } from "../components/Explain";
import { SceneTitle } from "../components/Kit";
import { useScene } from "../timing";
import { EXT, LINE, NULLC, PV } from "./S1Hook";

export const S9Remember: React.FC = () => {
  const s = useScene("s9");
  return (
    <AbsoluteFill>
      <SceneTitle label="REMEMBER" pill="THE p-VALUE" color={PV} at={2} pillAt={s.sent(0).from} />
      <RecapFlow
        y0={600}
        gap={180}
        size={34}
        items={[
          { t: "HOW SURPRISING IS MY DATA?", c: NULLC, at: s.cueS(0, "surprising") },
          { t: "SMALL p = SURPRISING", c: EXT, at: s.cueS(1, "Small") },
          { t: "BELOW 0.05 = SIGNIFICANT", c: LINE, at: s.cueS(1, "Below") },
        ]}
      />
    </AbsoluteFill>
  );
};
