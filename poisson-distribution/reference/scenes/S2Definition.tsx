// SCENE 2 — THE DEFINITION: counts the SUCCESSES · in a FIXED NUMBER of tries · each try: TWO OUTCOMES ·
// the SAME CHANCE every time.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { DefCard } from "../components/Explain";
import { SceneTitle } from "../components/Kit";
import { Mark, Pop } from "../components/Motion";
import { theme } from "../theme";
import { useScene } from "../timing";
import { AVGC, BARS, FAIL, SUCC } from "./S1Hook";

const C = theme.colors;

export const S2Definition: React.FC = () => {
  useCurrentFrame();
  const s = useScene("s2");
  const doneAt = s.duration - 28;
  const at = [s.cueS(1, "successes"), s.cueS(1, "fixed"), s.cueS(2, "two"), s.cueS(3, "same")];
  return (
    <AbsoluteFill>
      <SceneTitle label="THE DEFINITION" pill="IN SIMPLE WORDS" color={BARS} at={2} pillAt={s.sent(0).from} />
      <DefCard
        y0={540}
        gap={150}
        doneAt={doneAt}
        size={38}
        rows={[
          { pre: "Counts the ", key: "SUCCESSES", c: SUCC, at: at[0], icon: <div style={{ display: "flex", gap: 2 }}>{[0, 1, 2].map((i) => <Mark key={i} kind="check" at={at[0] + i * 4} size={36} color={SUCC} width={8} />)}</div> },
          { pre: "in a ", key: "FIXED NUMBER", post: " of tries", c: AVGC, at: at[1], icon: <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 28, color: AVGC, whiteSpace: "nowrap" }}>n = 10</div> },
          { pre: "each try: ", key: "TWO OUTCOMES", c: FAIL, at: at[2], icon: <div style={{ display: "flex", gap: 10 }}><Mark kind="check" at={at[2]} size={38} color={SUCC} width={8} /><Mark kind="cross" at={at[2] + 4} size={38} color={FAIL} width={8} /></div> },
          { pre: "the ", key: "SAME CHANCE", post: " every time", c: BARS, at: at[3], icon: <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 28, color: BARS, whiteSpace: "nowrap" }}>p = 1/2</div> },
        ]}
      />
      <Pop at={doneAt} x={540} y={1150} from="up" dist={14} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 26, letterSpacing: "0.18em", color: C.text, whiteSpace: "nowrap" }}>
          THAT&apos;S THE <span style={{ color: BARS }}>BINOMIAL DISTRIBUTION</span>
        </div>
      </Pop>
    </AbsoluteFill>
  );
};
