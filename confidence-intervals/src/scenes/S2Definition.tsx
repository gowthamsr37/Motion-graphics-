// SCENE 2 — THE DEFINITION: A RANGE (not one number) · likely contains THE TRUE AVERAGE · with a CONFIDENCE LEVEL (95%).
// Then the example range 30 to 34 minutes on a number line.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Axis, Interval, type Line } from "../components/CI";
import { DefCard } from "../components/Explain";
import { SceneTitle } from "../components/Kit";
import { ease, Pop, useSpr } from "../components/Motion";
import { glowText, theme } from "../theme";
import { useScene } from "../timing";
import { RANGE, SAMPLE, TRUE } from "./S1Hook";

const C = theme.colors;
const G: Line = { x0: 190, x1: 890, vmin: 28, vmax: 36 };

export const S2Definition: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s2");
  const RNG = s.cueS(2, "range:");
  const LEVEL = s.sent(3).from;
  return (
    <AbsoluteFill>
      <SceneTitle label="THE DEFINITION" pill="IN SIMPLE WORDS" color={RANGE} at={2} pillAt={s.sent(0).from} />
      <DefCard
        y0={540}
        gap={150}
        doneAt={s.duration - 28}
        size={36}
        rows={[
          { pre: "a ", key: "RANGE", post: ", not one number", c: RANGE, at: s.cueS(1, "range"), icon: <div style={{ width: 100, height: 6, borderRadius: 3, background: RANGE, boxShadow: `0 0 10px ${RANGE}` }} /> },
          { pre: "likely contains ", key: "THE TRUE AVERAGE", c: TRUE, at: s.cueS(1, "true") },
          { pre: "with a ", key: "CONFIDENCE LEVEL", post: " (95%)", c: SAMPLE, at: LEVEL },
        ]}
      />
      {frame >= RNG - 6 ? (
        <>
          <Axis g={G} y={1110} ticks={[28, 30, 32, 34, 36]} p={ease(frame, [RNG - 6, RNG + 6], [0, 1])} hi={{ 30: RANGE, 34: RANGE }} />
          <Interval g={G} y={1040} m={32} lo={30} hi={34} p={spr(RNG + 2, theme.spring.smooth)} color={RANGE} />
          <Pop at={RNG + 10} x={540} y={980} from="up" dist={10}>
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 36, color: C.text, whiteSpace: "nowrap" }}>
              <span style={{ color: RANGE, textShadow: glowText(RANGE, 0.5) }}>30 TO 34</span> MINUTES
            </div>
          </Pop>
        </>
      ) : null}
    </AbsoluteFill>
  );
};
