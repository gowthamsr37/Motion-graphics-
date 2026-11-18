// SCENE 2 — THE DEFINITION: use data to decide REAL OR CHANCE · ASSUME nothing's going on · too SURPRISING? reject it.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { DefCard } from "../components/Explain";
import { SceneTitle } from "../components/Kit";
import { Pop } from "../components/Motion";
import { theme } from "../theme";
import { useScene } from "../timing";
import { ALT, DATA, LINE, NULLC } from "./S1Hook";

const C = theme.colors;

export const S2Definition: React.FC = () => {
  useCurrentFrame();
  const s = useScene("s2");
  const doneAt = s.duration - 28;
  return (
    <AbsoluteFill>
      <SceneTitle label="THE DEFINITION" pill="IN SIMPLE WORDS" color={DATA} at={2} pillAt={s.sent(0).from} />
      <DefCard
        y0={560}
        gap={160}
        doneAt={doneAt}
        size={36}
        rows={[
          { pre: "data decides: ", key: "REAL OR CHANCE?", c: DATA, at: s.cueS(1, "decide") },
          { pre: "first, ", key: "ASSUME NOTHING'S GOING ON", c: NULLC, at: s.cueS(2, "assume") },
          { pre: "too ", key: "SURPRISING?", post: " reject that", c: ALT, at: s.cueS(3, "surprising") },
        ]}
      />
      <Pop at={doneAt} x={540} y={1110} from="up" dist={14} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 26, letterSpacing: "0.18em", color: C.text, whiteSpace: "nowrap" }}>
          THAT&apos;S <span style={{ color: LINE }}>HYPOTHESIS TESTING</span>
        </div>
      </Pop>
    </AbsoluteFill>
  );
};
