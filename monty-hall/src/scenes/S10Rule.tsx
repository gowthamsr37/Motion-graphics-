// SCENE 10 — REMEMBER THIS: ALWAYS SWITCH · 2/3 beats 1/3; SAVE THIS; try it with three cups and a coin.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Bookmark } from "../components/Guide";
import { HOT } from "../components/Doors";
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
      <Pop x={540} y={580} at={s.cueS(0, "switch.") - 6}>
        <Panel w={960} h={420} color={HOT}>
          <Txt size={88} color={HOT} glow>ALWAYS SWITCH</Txt>
          <Txt size={60}>
            <span style={{ color: HOT }}>2/3</span> beats <span style={{ color: C.cyan }}>1/3</span>
          </Txt>
        </Panel>
      </Pop>
      <Pop x={540} y={980} at={s.cueS(1, "Save") - 4}>
        <Pill color={C.green} size={42}>
          <Bookmark size={42} color={C.green} />
          SAVE THIS
        </Pill>
      </Pop>
      <Pop x={540} y={1100} at={s.cueS(1, "try") - 2}>
        <Txt size={38} font="body">try it on a friend: <span style={{ color: C.yellow }}>3 cups + a coin</span></Txt>
      </Pop>
    </AbsoluteFill>
  );
};
