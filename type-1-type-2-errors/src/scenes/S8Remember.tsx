// SCENE 8 — REMEMBER. TYPE 1 = FALSE ALARM → TYPE 2 = A MISS → STRICTER: TRADE ONE FOR THE OTHER → MORE DATA HELPS BOTH.
import React from "react";
import { AbsoluteFill } from "remotion";
import { OKC, T1C, T2C } from "../components/Errors";
import { RecapFlow } from "../components/Explain";
import { SceneTitle } from "../components/Kit";
import { theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

export const S8Remember: React.FC = () => {
  const s = useScene("s8");
  return (
    <AbsoluteFill>
      <SceneTitle label="REMEMBER" pill="TYPE 1 & TYPE 2" color={T1C} at={2} pillAt={s.sent(0).from} />
      <RecapFlow
        y0={560}
        gap={160}
        size={34}
        items={[
          { t: "TYPE 1 = FALSE ALARM", c: T1C, at: s.cueS(0, "Type") },
          { t: "TYPE 2 = A MISS", c: T2C, at: s.cueS(0, "Type", 1) },
          { t: "STRICTER: TRADE ONE FOR THE OTHER", c: C.cyan, at: s.cueS(1, "Stricter") },
          { t: "MORE DATA HELPS BOTH", c: OKC, at: s.cueS(1, "more") },
        ]}
      />
    </AbsoluteFill>
  );
};
