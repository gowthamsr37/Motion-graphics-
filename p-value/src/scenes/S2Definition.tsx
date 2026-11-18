// SCENE 2 — THE DEFINITION: the chance of results AT LEAST AS EXTREME as yours · IF NOTHING SPECIAL is going on ·
// small p = SURPRISING by luck alone.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { DefCard } from "../components/Explain";
import { SceneTitle } from "../components/Kit";
import { Pop } from "../components/Motion";
import { theme } from "../theme";
import { useScene } from "../timing";
import { EXT, NULLC, PV } from "./S1Hook";

const C = theme.colors;

export const S2Definition: React.FC = () => {
  useCurrentFrame();
  const s = useScene("s2");
  const doneAt = s.duration - 28;
  return (
    <AbsoluteFill>
      <SceneTitle label="THE DEFINITION" pill="IN SIMPLE WORDS" color={PV} at={2} pillAt={s.sent(0).from} />
      <DefCard
        y0={560}
        gap={160}
        doneAt={doneAt}
        size={34}
        rows={[
          { pre: "chance of results ", key: "AT LEAST AS EXTREME", c: EXT, at: s.cueS(1, "chance") },
          { pre: "if ", key: "NOTHING SPECIAL", post: " is going on", c: NULLC, at: s.cueS(1, "nothing") },
          { pre: "small p: ", key: "SURPRISING", post: " by luck alone", c: PV, at: s.cueS(2, "small") },
        ]}
      />
      <Pop at={doneAt} x={540} y={1110} from="up" dist={14} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 26, letterSpacing: "0.18em", color: C.text, whiteSpace: "nowrap" }}>
          THAT&apos;S THE <span style={{ color: PV }}>p-VALUE</span>
        </div>
      </Pop>
    </AbsoluteFill>
  );
};
