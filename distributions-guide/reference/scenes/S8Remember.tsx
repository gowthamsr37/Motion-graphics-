// SCENE 8 — REMEMBER. SPLIT USERS AT RANDOM → SHOW TWO VERSIONS → LET A HYPOTHESIS TEST DECIDE → PLAN THE SIZE,
// DON'T PEEK.
import React from "react";
import { AbsoluteFill } from "remotion";
import { AC, BC, NULLC, PV } from "../components/AB";
import { RecapFlow } from "../components/Explain";
import { SceneTitle } from "../components/Kit";
import { useScene } from "../timing";

export const S8Remember: React.FC = () => {
  const s = useScene("s8");
  return (
    <AbsoluteFill>
      <SceneTitle label="REMEMBER" pill="A/B TESTING" color={BC} at={2} pillAt={s.sent(0).from} />
      <RecapFlow
        y0={560}
        gap={160}
        size={34}
        items={[
          { t: "SPLIT USERS AT RANDOM", c: NULLC, at: s.cueS(0, "split") },
          { t: "SHOW TWO VERSIONS", c: BC, at: s.cueS(0, "show") },
          { t: "LET A HYPOTHESIS TEST DECIDE", c: PV, at: s.cueS(0, "hypothesis") },
          { t: "PLAN THE SIZE. DON'T PEEK.", c: AC, at: s.cueS(1, "Plan") },
        ]}
      />
    </AbsoluteFill>
  );
};
