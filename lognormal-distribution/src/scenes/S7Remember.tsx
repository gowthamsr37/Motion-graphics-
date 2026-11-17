// SCENE 7 — REMEMBER. POSITIVE VALUES → SKEWED TO THE RIGHT → TAKE THE LOG: A NORMAL BELL.
import React from "react";
import { AbsoluteFill } from "remotion";
import { CurveIcon, RecapFlow } from "../components/Explain";
import { SceneTitle } from "../components/Kit";
import { theme } from "../theme";
import { useScene } from "../timing";
import { bell, skew } from "./S2Definition";
import { LOG, RAW, ZERO } from "./S1Hook";

export const S7Remember: React.FC = () => {
  const s = useScene("s7");
  return (
    <AbsoluteFill>
      <SceneTitle label="REMEMBER" pill="LOG-NORMAL DISTRIBUTION" color={LOG} at={2} pillAt={s.sent(0).from} />
      <RecapFlow
        y0={600}
        gap={180}
        size={38}
        items={[
          { t: "POSITIVE VALUES", c: ZERO, at: s.cueS(0, "positive,"), icon: <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 34, color: ZERO }}>&gt; 0</div> },
          { t: "SKEWED TO THE RIGHT", c: RAW, at: s.cueS(0, "skewed"), icon: <CurveIcon color={RAW} f={skew} w={100} h={50} /> },
          { t: "LOGS: A NORMAL BELL", c: LOG, at: s.cueS(1, "logs,"), icon: <CurveIcon color={LOG} f={bell} w={100} h={50} /> },
        ]}
      />
    </AbsoluteFill>
  );
};
