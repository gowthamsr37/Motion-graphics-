// SCENE 10 — REMEMBER THIS: "RANDOM EVENTS HAVE NO MEMORY" big card, "the past doesn't make anything due"; SAVE THIS;
// "send it to the friend who says 'this time I'm due'".
import React from "react";
import { AbsoluteFill } from "remotion";
import { Bookmark } from "../components/Guide";
import { Coin } from "../components/Casino";
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
      <Pop x={540} y={620} at={s.cueS(0, "random") - 4}>
        <Panel w={960} h={480} color={HOT}>
          <Coin size={150} face="H" />
          <Txt size={62}>random events</Txt>
          <Txt size={70} color={HOT} glow>HAVE NO MEMORY</Txt>
          <Txt size={36} font="body">the past doesn&apos;t make anything due</Txt>
        </Panel>
      </Pop>
      <Pop x={540} y={1060} at={s.cueS(1, "Save") - 4}>
        <Pill color={C.green} size={42}>
          <Bookmark size={42} color={C.green} />
          SAVE THIS
        </Pill>
      </Pop>
      <Pop x={540} y={1180} at={s.cueS(1, "send") - 2}>
        <Txt size={36} font="body">
          send it to the friend who says <span style={{ color: C.yellow }}>&quot;this time I&apos;m due&quot;</span>
        </Txt>
      </Pop>
    </AbsoluteFill>
  );
};
