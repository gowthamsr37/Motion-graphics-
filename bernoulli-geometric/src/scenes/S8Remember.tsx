// SCENE 8 — REMEMBER. BERNOULLI: ONE TRY, YES OR NO → GEOMETRIC: TRIES UNTIL THE FIRST YES → AVERAGE WAIT = 1 ÷ CHANCE.
import React from "react";
import { AbsoluteFill } from "remotion";
import { RecapFlow } from "../components/Explain";
import { SceneTitle } from "../components/Kit";
import { useScene } from "../timing";
import { AVG, TRY, YES } from "./S1Hook";

export const S8Remember: React.FC = () => {
  const s = useScene("s8");
  return (
    <AbsoluteFill>
      <SceneTitle label="REMEMBER" pill="BERNOULLI & GEOMETRIC" color={YES} at={2} pillAt={s.sent(0).from} />
      <RecapFlow
        y0={600}
        gap={180}
        size={32}
        items={[
          { t: "BERNOULLI: ONE TRY, YES OR NO", c: YES, at: s.cueS(0, "Bernoulli") },
          { t: "GEOMETRIC: TRIES UNTIL FIRST YES", c: TRY, at: s.cueS(1, "Geometric") },
          { t: "AVERAGE WAIT = 1 ÷ CHANCE", c: AVG, at: s.cueS(1, "average") },
        ]}
      />
    </AbsoluteFill>
  );
};
