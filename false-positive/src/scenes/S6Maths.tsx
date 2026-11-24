// SCENE 6 — DO THE MATHS: all positives = 10 true (red) + ~100 false (orange) ≈ 110, drawn as a stacked bar of 110
// figures; then 10 ÷ 110 = 9%.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { HOT } from "../components/BKit";
import { FALSE, SICK } from "../components/People";
import { Panel, Pop, Txt } from "../components/L";
import { ease } from "../components/Motion";
import { glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

export const S6Maths: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s6");
  const T10 = s.cueS(0, "10");
  const F100 = s.cueS(0, "100");
  const DIV = s.sent(1).from;
  return (
    <AbsoluteFill>
      <Pop x={540} y={250} at={s.sent(0).from - 4}>
        <Txt size={54}>count <span style={{ color: C.yellow }}>all the positives</span></Txt>
      </Pop>
      <div style={{ position: "absolute", left: 140, top: 340, width: 800, display: "grid", gridTemplateColumns: "repeat(11, 1fr)", gap: 10 }}>
        {Array.from({ length: 110 }, (_, i) => {
          const sick = i < 10;
          const at = sick ? T10 - 4 + i : F100 - 6 + (i - 10) * 0.4;
          return <div key={i} style={{ aspectRatio: "1", borderRadius: "50%", background: sick ? SICK : FALSE, opacity: ease(frame, [at, at + 4], [0, 1]), boxShadow: sick ? `0 0 12px ${SICK}` : undefined }} />;
        })}
      </div>
      <Pop x={540} y={1110} at={F100}>
        <Txt size={46}>
          <span style={{ color: SICK }}>10 true</span> + <span style={{ color: FALSE }}>~100 false</span> ≈ 110
        </Txt>
      </Pop>
      <Pop x={540} y={1260} at={DIV}>
        <Panel w={900} h={170} color={HOT} style={{ flexDirection: "row", gap: 30 }}>
          <Txt size={56} font="mono">10 ÷ 110 =</Txt>
          <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 90, color: HOT, textShadow: glowText(HOT, 0.7), opacity: ease(frame, [s.cueS(1, "9%.") - 4, s.cueS(1, "9%.") + 4], [0, 1]) }}>9%</div>
        </Panel>
      </Pop>
    </AbsoluteFill>
  );
};
