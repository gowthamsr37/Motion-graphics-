// SCENE 2 — THE TEXTBOOK DEFINITION on the INTERVIEW ANSWER card, plus IN PLAIN WORDS on screen.
import React from "react";
import { AbsoluteFill } from "remotion";
import { SceneTitle } from "../components/Kit";
import { InterviewCard } from "../components/Simple";
import { BA, BB, SE, TAIL } from "../components/TKit";
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
        size={44}
        chunks={[
          { t: "A one-sample t-test is a hypothesis test", at: D },
          { t: "that checks whether a sample mean", at: s.cueS(1, "sample"), hi: BB },
          { t: "is significantly different", at: s.cueS(1, "significantly"), hi: TAIL },
          { t: "from a claimed population mean,", at: s.cueS(1, "claimed"), hi: BA },
          { t: "when the population standard deviation is unknown.", at: s.cueS(1, "standard"), hi: SE },
        ]}
        note={{ label: "IN PLAIN WORDS", at: s.cueS(1, "unknown.") + 20, c: TAIL, text: <>Same question as the z-test, but <span style={{ color: TAIL }}>without knowing sigma</span>.</> }}
      />
    </AbsoluteFill>
  );
};
