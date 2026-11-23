// SCENE 10 — REMEMBER THIS. "Everyone vs everyone → the pairs explode → coincidences become likely" (3 steps, with a
// growing pair count 10 → 45 → 253 → 2,415); the lottery note (repeats are expected); SAVE THIS + test it in your group chat.
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
  const steps = [
    { t: "everyone vs everyone", at: s.cueS(0, "everyone") },
    { t: "the pairs explode", at: s.cueS(0, "pairs") },
    { t: "coincidences become likely", at: s.cueS(0, "coincidences") },
  ];
  const LOT = s.sent(1).from;
  const SAVE = s.cueS(2, "Save");
  return (
    <AbsoluteFill>
      <Pop x={540} y={250} at={s.sent(0).from - 4}>
        <Txt size={62} color={C.yellow} glow>REMEMBER THIS</Txt>
      </Pop>
      {steps.map((k, i) => (
        <Pop key={k.t} x={540} y={400 + i * 130} at={k.at - 4}>
          <Panel w={860} h={104} color={[C.cyan, HOT, C.green][i]} style={{ flexDirection: "row", gap: 18 }}>
            <Txt size={34} color={[C.cyan, HOT, C.green][i]}>{i + 1}</Txt>
            <Txt size={44}>{k.t}</Txt>
          </Panel>
        </Pop>
      ))}
      <Pop x={540} y={850} at={steps[1].at + 6}>
        <Txt size={34} font="mono" color={C.dim}>
          5 → 10 · 10 → 45 · 23 → <span style={{ color: HOT }}>253</span> · 70 → 2,415 pairs
        </Txt>
      </Pop>
      <Pop x={540} y={1000} at={LOT - 4}>
        <Txt size={38} font="body">
          lottery numbers &quot;repeating&quot;? <span style={{ color: C.yellow }}>expected</span>
        </Txt>
      </Pop>
      <Pop x={540} y={1160} at={SAVE - 4}>
        <Pill color={C.green} size={42}>
          <Bookmark size={42} color={C.green} />
          SAVE THIS
        </Pill>
      </Pop>
      <Pop x={540} y={1270} at={s.cueS(2, "test") - 2}>
        <Txt size={36} font="body">
          test it in your next <span style={{ color: HOT }}>group chat</span>
        </Txt>
      </Pop>
    </AbsoluteFill>
  );
};
