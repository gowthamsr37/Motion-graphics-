// SCENE 2 — BERNOULLI, THE DEFINITION: ONE TRY · TWO OUTCOMES (success or failure) · success = 1, failure = 0 ·
// needs THE CHANCE OF SUCCESS.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { DefCard } from "../components/Explain";
import { SceneTitle } from "../components/Kit";
import { Mark, Pop } from "../components/Motion";
import { Die } from "../components/Prob";
import { theme } from "../theme";
import { useScene } from "../timing";
import { AVG, NO, TRY, YES } from "./S1Hook";

const C = theme.colors;

export const S2Bernoulli: React.FC = () => {
  useCurrentFrame();
  const s = useScene("s2");
  const doneAt = s.duration - 28;
  const TWO = s.cueS(1, "two");
  return (
    <AbsoluteFill>
      <SceneTitle label="BERNOULLI" pill="IN SIMPLE WORDS" color={YES} at={2} pillAt={s.sent(0).from} />
      <DefCard
        y0={540}
        gap={150}
        doneAt={doneAt}
        size={36}
        rows={[
          { pre: "", key: "ONE TRY", c: TRY, at: s.cueS(1, "one"), icon: <Die value={6} size={58} color={TRY} /> },
          { pre: "", key: "TWO OUTCOMES", c: NO, at: TWO, icon: <div style={{ display: "flex", gap: 14 }}><Mark kind="check" at={TWO + 6} size={36} color={YES} width={8} /><Mark kind="cross" at={TWO + 10} size={36} color={NO} width={8} /></div> },
          { pre: "success = ", key: "1", post: ",  failure = 0", c: YES, at: s.cueS(2, "success"), icon: <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 32, color: YES }}>1 / 0</div> },
          { pre: "needs ", key: "THE CHANCE OF SUCCESS", c: AVG, at: s.cueS(3, "chance") },
        ]}
      />
      <Pop at={doneAt} x={540} y={1150} from="up" dist={14} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 26, letterSpacing: "0.18em", color: C.text, whiteSpace: "nowrap" }}>
          THAT&apos;S THE <span style={{ color: YES }}>BERNOULLI DISTRIBUTION</span>
        </div>
      </Pop>
    </AbsoluteFill>
  );
};
