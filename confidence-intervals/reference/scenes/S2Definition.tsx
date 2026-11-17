// SCENE 2 — A REMINDER: a probability distribution shows HOW LIKELY · each POSSIBLE VALUE is · to pick one, ask:
// WHAT AM I MEASURING?
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { BarsIcon, DefCard } from "../components/Explain";
import { SceneTitle } from "../components/Kit";
import { Pop } from "../components/Motion";
import { theme } from "../theme";
import { useScene } from "../timing";
import { BONUS, COUNTS, MEAS, TEST } from "./S1Hook";

const C = theme.colors;

export const S2Definition: React.FC = () => {
  useCurrentFrame();
  const s = useScene("s2");
  const doneAt = s.duration - 28;
  return (
    <AbsoluteFill>
      <SceneTitle label="FIRST, A REMINDER" pill="IN SIMPLE WORDS" color={COUNTS} at={2} pillAt={s.sent(0).from} />
      <DefCard
        y0={560}
        gap={160}
        doneAt={doneAt}
        size={36}
        rows={[
          { pre: "Shows ", key: "HOW LIKELY", c: COUNTS, at: s.cueS(1, "how"), icon: <BarsIcon color={COUNTS} vals={[2, 5, 8, 6, 3, 1]} w={110} h={50} /> },
          { pre: "each ", key: "POSSIBLE VALUE", post: " is", c: MEAS, at: s.cueS(1, "possible") },
          { pre: "ask: ", key: "WHAT AM I MEASURING?", c: TEST, at: s.cueS(2, "what") },
        ]}
      />
      <Pop at={doneAt} x={540} y={1110} from="up" dist={14} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 26, letterSpacing: "0.18em", color: C.text, whiteSpace: "nowrap" }}>
          ONE QUESTION, <span style={{ color: BONUS }}>ONE SHAPE</span>
        </div>
      </Pop>
    </AbsoluteFill>
  );
};
