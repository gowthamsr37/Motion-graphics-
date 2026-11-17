// SCENE 2 — THE DEFINITION: chi-square measures how far SEEN counts are from EXPECTED counts · the chi-square
// distribution shows how big that gap gets JUST BY LUCK.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { DefCard } from "../components/Explain";
import { SceneTitle } from "../components/Kit";
import { Pop } from "../components/Motion";
import { Die } from "../components/Prob";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";
import { EXP, FAIR, GAP, OBSC } from "./S1Hook";

const C = theme.colors;
const mini = (
  <div style={{ position: "relative", width: 110, height: 52 }}>
    {[6, 8, 5, 9, 4, 10].map((v, i) => <div key={i} style={{ position: "absolute", left: i * 18, bottom: 0, width: 13, height: v * 5, borderRadius: 3, background: alpha(OBSC, 0.7) }} />)}
    <div style={{ position: "absolute", left: -4, right: -4, bottom: 34, borderTop: `3px dashed ${EXP}` }} />
  </div>
);

export const S2Definition: React.FC = () => {
  useCurrentFrame();
  const s = useScene("s2");
  const doneAt = s.duration - 28;
  return (
    <AbsoluteFill>
      <SceneTitle label="THE DEFINITION" pill="IN SIMPLE WORDS" color={GAP} at={2} pillAt={s.sent(0).from} />
      <DefCard
        y0={600}
        gap={180}
        doneAt={doneAt}
        size={36}
        rows={[
          { pre: "the gap: ", key: "SEEN vs EXPECTED", c: OBSC, at: s.cueS(1, "measures"), icon: mini },
          { pre: "how big it gets ", key: "JUST BY LUCK", c: FAIR, at: s.cueS(2, "luck."), icon: <Die value={6} size={52} color={FAIR} /> },
        ]}
      />
      <Pop at={doneAt} x={540} y={1050} from="up" dist={14} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 26, letterSpacing: "0.18em", color: C.text, whiteSpace: "nowrap" }}>
          THAT&apos;S THE <span style={{ color: GAP }}>CHI-SQUARE DISTRIBUTION</span>
        </div>
      </Pop>
    </AbsoluteFill>
  );
};
