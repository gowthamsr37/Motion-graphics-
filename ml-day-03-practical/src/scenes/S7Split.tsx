// SCENE 7 — STEP 5, TRAIN-TEST SPLIT. A timeline of sales 2022 → 2025 with a rising price line; WRONG: shuffled random
// split (old + new mixed); RIGHT: train on the past, test on the most recent months.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { StepScene } from "../components/StepScene";
import { Txt } from "../components/D2";
import { ease } from "../components/Motion";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

export const S7Split: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s7");
  const P = s.cueS(0, "trap:");
  const RIGHT = s.sent(1).from;
  const mix = 1 - ease(frame, [RIGHT, RIGHT + 14], [0, 1]);
  return (
    <AbsoluteFill>
      <StepScene
        i={4}
        termAt={s.cueS(0, "train-test")}
        headAt={s.cueS(0, "trap:")}
        head={<>the trap: <span style={{ color: C.red }}>mixing old and new sales</span></>}
        probAt={P}
        problem={
          <>
            <div style={{ display: "flex", gap: 4, width: 860 }}>
              {Array.from({ length: 36 }, (_, i) => {
                const test = mix > 0.5 ? (i * 7) % 5 === 0 : i >= 29;
                return <div key={i} style={{ flex: 1, height: 70 + i * 3, alignSelf: "flex-end", borderRadius: 4, background: test ? C.yellow : alpha(C.cyan, 0.75) }} />;
              })}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", width: 860, fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 24, color: C.dim }}>
              <span>2022</span><span>2023</span><span>2024</span><span>2025</span>
            </div>
            <Txt size={36}>
              <span style={{ color: C.cyan }}>■ train</span> &nbsp; <span style={{ color: C.yellow }}>■ test</span> &nbsp;·&nbsp; {mix > 0.5 ? <span style={{ color: C.red }}>random mix (wrong)</span> : <span style={{ color: C.green }}>latest months</span>}
            </Txt>
          </>
        }
        fixAt={RIGHT - 2}
        fixes={[
          { t: "prices keep rising, so…", at: RIGHT },
          { t: "test on the most recent months", at: s.cueS(1, "recent") },
        ]}
      />
    </AbsoluteFill>
  );
};
