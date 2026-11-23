// SCENE 8 — THE KEY IS THE HOST: host card "KNOWS where the car is · NEVER opens it"; "his choice isn't random → it
// gives you INFORMATION" → NOT 50-50.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { ease } from "../components/Motion";
import { Guy, HOT } from "../components/BKit";
import { Panel, Pill, Pop, Txt } from "../components/L";
import { theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

export const S8Key: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s8");
  return (
    <AbsoluteFill>
      <Pop x={540} y={250} at={s.sent(0).from - 4}>
        <Txt size={56}>the key is <span style={{ color: HOT }}>the host</span></Txt>
      </Pop>
      <Pop x={540} y={560} at={s.cueS(0, "knows") - 6}>
        <Panel w={960} h={380} color={HOT} style={{ flexDirection: "row", gap: 40 }}>
          <Guy size={160} color={HOT} />
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <Txt size={48}>he <span style={{ color: C.green }}>KNOWS</span> where the car is</Txt>
            <Txt size={48} style={{ opacity: ease(frame, [s.cueS(0, "never") - 4, s.cueS(0, "never") + 4], [0, 1]) }}>he <span style={{ color: C.red }}>NEVER</span> opens it</Txt>
          </div>
        </Panel>
      </Pop>
      <Pop x={540} y={900} at={s.sent(1).from - 2}>
        <Txt size={44} font="body">his choice isn&apos;t random →</Txt>
      </Pop>
      <Pop x={540} y={1000} at={s.cueS(1, "information.") - 4}>
        <Pill color={C.cyan} size={54} solid>IT GIVES YOU INFORMATION</Pill>
      </Pop>
      <Pop x={540} y={1150} at={s.cueS(1, "50-50.") - 6}>
        <Txt size={60}>so it&apos;s <span style={{ color: C.red }}>NOT</span> 50-50</Txt>
      </Pop>
    </AbsoluteFill>
  );
};
