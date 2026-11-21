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
          { t: "A two-sample t-test is a hypothesis test", at: D },
          { t: "that checks whether the means", at: s.cueS(1, "means"), hi: BB },
          { t: "of two independent groups", at: s.cueS(1, "independent"), hi: BA },
          { t: "are significantly different,", at: s.cueS(1, "significantly"), hi: TAIL },
          { t: "when the population standard deviations are unknown.", at: s.cueS(1, "standard"), hi: SE },
        ]}
        note={{ label: "IN PLAIN WORDS", at: s.cueS(1, "unknown.") + 20, c: TAIL, text: <>Is the gap between two group averages <span style={{ color: TAIL }}>too big to be luck</span>?</> }}
      />
    </AbsoluteFill>
  );
};
