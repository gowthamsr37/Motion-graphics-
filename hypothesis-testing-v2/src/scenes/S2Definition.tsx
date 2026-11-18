// SCENE 2 — THE TEXTBOOK (INTERVIEW) DEFINITION. "Hypothesis testing is a statistical method that uses SAMPLE DATA to
// DECIDE BETWEEN TWO COMPETING CLAIMS about a population: THE NULL HYPOTHESIS and THE ALTERNATIVE HYPOTHESIS."
// + IN PLAIN WORDS: is the pattern in the data real, or just chance?
import React from "react";
import { AbsoluteFill } from "remotion";
import { SceneTitle } from "../components/Kit";
import { InterviewCard } from "../components/Simple";
import { theme } from "../theme";
import { useScene } from "../timing";
import { ALT, DATA, LINE, NULLC } from "./S1Hook";

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
          { t: "Hypothesis testing is a statistical method", at: D },
          { t: "that uses sample data", at: s.cueS(1, "sample"), hi: DATA },
          { t: "to decide between two competing claims", at: s.cueS(1, "decide"), hi: LINE },
          { t: "about a population:", at: s.cueS(1, "population:") },
          { t: "the null hypothesis", at: s.cueS(1, "null"), hi: NULLC },
          { t: "and the alternative hypothesis.", at: s.cueS(1, "alternative"), hi: ALT },
        ]}
        note={{
          label: "IN PLAIN WORDS",
          text: (
            <>
              Is the pattern in the data <span style={{ color: ALT }}>real</span>, or just <span style={{ color: NULLC }}>chance</span>?
            </>
          ),
          at: s.sent(2).from,
          c: C.yellow,
        }}
      />
    </AbsoluteFill>
  );
};
