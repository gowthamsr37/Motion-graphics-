// SCENE 2 — THE TEXTBOOK DEFINITION on the INTERVIEW ANSWER card, phrase by phrase, plus IN PLAIN WORDS.
import React from "react";
import { AbsoluteFill } from "remotion";
import { SceneTitle } from "../components/Kit";
import { InterviewCard } from "../components/Simple";
import { CLAIM, MEAN, SE, TAIL } from "../components/ZKit";
import { theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

export const S2Definition: React.FC = () => {
  const s = useScene("s2");
  const D = s.sent(1).from;
  return (
    <AbsoluteFill>
      <SceneTitle label="THE TEXTBOOK DEFINITION" color={C.yellow} at={2} />
      <InterviewCard
        at={s.sent(0).from}
        y={540}
        h={800}
        size={46}
        chunks={[
          { t: "A z-test is a hypothesis test", at: D },
          { t: "that checks whether a sample mean", at: s.cueS(1, "sample"), hi: MEAN },
          { t: "is significantly different", at: s.cueS(1, "significantly"), hi: TAIL },
          { t: "from a population mean,", at: s.cueS(1, "population"), hi: CLAIM },
          { t: "when the population standard deviation is known.", at: s.cueS(1, "standard"), hi: SE },
        ]}
        note={{ label: "IN PLAIN WORDS", at: s.cueS(1, "known.") + 24, c: TAIL, text: <>Is the gap between our average and the claim <span style={{ color: TAIL }}>too big to be chance</span>?</> }}
      />
    </AbsoluteFill>
  );
};
