// SCENE 2 — THE INTERVIEW DEFINITION. "The p-value is the PROBABILITY of getting results AT LEAST AS EXTREME as yours,
// ASSUMING THE NULL HYPOTHESIS IS TRUE." + IN PLAIN WORDS: if nothing special were going on, how surprising is my data?
import React from "react";
import { AbsoluteFill } from "remotion";
import { SceneTitle } from "../components/Kit";
import { InterviewCard } from "../components/Simple";
import { theme } from "../theme";
import { useScene } from "../timing";
import { EXT, NULLC, PV } from "./S1Hook";

const C = theme.colors;

export const S2Definition: React.FC = () => {
  const s = useScene("s2");
  const D = s.sent(1).from;
  return (
    <AbsoluteFill>
      <SceneTitle label="THE DEFINITION" color={C.yellow} at={2} />
      <InterviewCard
        at={s.sent(0).from}
        y={560}
        h={760}
        size={58}
        chunks={[
          { t: "The p-value is", at: D },
          { t: "the probability", at: s.cueS(1, "probability"), hi: PV },
          { t: "of getting results", at: s.cueS(1, "getting") },
          { t: "at least as extreme as yours,", at: s.cueS(1, "extreme"), hi: EXT },
          { t: "assuming the null hypothesis is true.", at: s.cueS(1, "assuming"), hi: NULLC },
        ]}
        note={{
          label: "IN PLAIN WORDS",
          text: (
            <>
              If <span style={{ color: NULLC }}>nothing special</span> were going on, how <span style={{ color: EXT }}>surprising</span> would my data be?
            </>
          ),
          at: s.sent(2).from,
          c: C.yellow,
        }}
      />
    </AbsoluteFill>
  );
};
