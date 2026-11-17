// SCENE 7 — REMEMBER. A BELL WITH FATTER TAILS → FOR SMALL SAMPLES → BIGGER SAMPLE: CLOSER TO NORMAL.
import React from "react";
import { AbsoluteFill } from "remotion";
import { CurveIcon, RecapFlow } from "../components/Explain";
import { SceneTitle } from "../components/Kit";
import { npdf, tpdf } from "../components/TDist";
import { useScene } from "../timing";
import { NC, SAMPLE, TAIL, TC } from "./S1Hook";

export const S7Remember: React.FC = () => {
  const s = useScene("s7");
  return (
    <AbsoluteFill>
      <SceneTitle label="REMEMBER" pill="THE t-DISTRIBUTION" color={TC} at={2} pillAt={s.sent(0).from} />
      <RecapFlow
        y0={600}
        gap={180}
        size={34}
        items={[
          { t: "A BELL WITH FATTER TAILS", c: TAIL, at: s.cueS(0, "bell"), icon: <CurveIcon color={TAIL} f={(u) => tpdf((u - 0.5) * 8, 1.5) / 0.4} w={100} h={50} /> },
          { t: "FOR SMALL SAMPLES", c: SAMPLE, at: s.cueS(0, "small"), icon: <div style={{ display: "flex", gap: 6 }}>{[0, 1, 2, 3, 4].map((i) => <div key={i} style={{ width: 12, height: 12, borderRadius: 6, background: SAMPLE }} />)}</div> },
          { t: "BIGGER SAMPLE: NEAR NORMAL", c: NC, at: s.cueS(1, "bigger"), icon: <CurveIcon color={NC} f={(u) => npdf((u - 0.5) * 8) / 0.4} w={100} h={50} /> },
        ]}
      />
    </AbsoluteFill>
  );
};
