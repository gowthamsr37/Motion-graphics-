// SCENE 10 — REMEMBER THIS: card "A POSITIVE RESULT DEPENDS ON: how RARE the thing is + how ACCURATE the test is";
// SAVE THIS; send it to someone who panics over every test result.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Bookmark } from "../components/Guide";
import { HOT } from "../components/BKit";
import { Panel, Pill, Pop, Txt } from "../components/L";
import { theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

export const S10Rule: React.FC = () => {
  const s = useScene("s10");
  return (
    <AbsoluteFill>
      <Pop x={540} y={250} at={s.sent(0).from - 4}>
        <Txt size={62} color={C.yellow} glow>REMEMBER THIS</Txt>
      </Pop>
      <Pop x={540} y={620} at={s.cueS(0, "positive") - 4}>
        <Panel w={960} h={460} color={HOT}>
          <Txt size={40} font="body" color={C.dim}>a positive result depends on</Txt>
          <Txt size={66}>how <span style={{ color: HOT }}>RARE</span> it is</Txt>
          <Txt size={44} color={C.dim}>not just</Txt>
          <Txt size={66}>how <span style={{ color: C.green }}>ACCURATE</span> the test is</Txt>
        </Panel>
      </Pop>
      <Pop x={540} y={1020} at={s.cueS(1, "Save") - 4}>
        <Pill color={C.green} size={42}>
          <Bookmark size={42} color={C.green} />
          SAVE THIS
        </Pill>
      </Pop>
      <Pop x={540} y={1140} at={s.cueS(1, "send") - 2}>
        <Txt size={36} font="body">send it to someone who <span style={{ color: C.yellow }}>panics over every test</span></Txt>
      </Pop>
    </AbsoluteFill>
  );
};
