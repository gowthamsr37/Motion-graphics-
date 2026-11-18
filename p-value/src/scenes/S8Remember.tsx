// SCENE 8 — REMEMBER. HOW SURPRISING IS YOUR DATA? (if nothing's going on) → SMALL p = SURPRISING →
// NOT THE CHANCE THE NULL IS TRUE.
import React from "react";
import { AbsoluteFill } from "remotion";
import { RecapFlow } from "../components/Explain";
import { SceneTitle } from "../components/Kit";
import { theme } from "../theme";
import { useScene } from "../timing";
import { NULLC, PV } from "./S1Hook";

const C = theme.colors;

export const S8Remember: React.FC = () => {
  const s = useScene("s8");
  return (
    <AbsoluteFill>
      <SceneTitle label="REMEMBER" pill="THE p-VALUE" color={PV} at={2} pillAt={s.sent(0).from} />
      <RecapFlow
        y0={600}
        gap={180}
        size={34}
        items={[
          { t: "HOW SURPRISING IS YOUR DATA?", c: NULLC, at: s.cueS(0, "surprising") },
          { t: "SMALL p = SURPRISING", c: PV, at: s.cueS(1, "Small") },
          { t: "NOT THE CHANCE THE NULL IS TRUE", c: C.red, at: s.cueS(1, "not") },
        ]}
      />
    </AbsoluteFill>
  );
};
