// SCENE 4 — THE INTERVIEW DEFINITION. "A confidence interval is a RANGE OF VALUES, calculated from a sample, that is
// likely to contain the TRUE POPULATION VALUE." + CONFIDENCE LEVEL (e.g. 95%): how reliable the method is.
import React from "react";
import { AbsoluteFill } from "remotion";
import { SceneTitle } from "../components/Kit";
import { InterviewCard } from "../components/Simple";
import { theme } from "../theme";
import { useScene } from "../timing";
import { EST, RANGE, TRUE } from "./S1Hook";

const C = theme.colors;

export const S4Definition: React.FC = () => {
  const s = useScene("s4");
  const D = s.sent(1).from;
  return (
    <AbsoluteFill>
      <SceneTitle label="THE DEFINITION" color={C.yellow} at={2} />
      <InterviewCard
        at={s.sent(0).from}
        y={560}
        h={720}
        size={54}
        chunks={[
          { t: "A confidence interval is", at: D },
          { t: "a range of values,", at: s.cueS(1, "range"), hi: RANGE },
          { t: "calculated from a sample,", at: s.cueS(1, "calculated"), hi: EST },
          { t: "that is likely to contain", at: s.cueS(1, "likely") },
          { t: "the true population value.", at: s.cueS(1, "true"), hi: TRUE },
        ]}
        note={{
          label: "CONFIDENCE LEVEL (LIKE 95%)",
          text: (
            <>
              how <span style={{ color: C.yellow }}>reliable</span> that method is
            </>
          ),
          at: s.sent(2).from,
          c: C.yellow,
        }}
      />
    </AbsoluteFill>
  );
};
