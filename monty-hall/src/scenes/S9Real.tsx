// SCENE 9 — REAL LIFE: NEW INFO → UPDATE YOUR ODDS (don't freeze on your first guess); three tiles: doctors reading
// test results · spam filters · data scientists; BAYESIAN THINKING.
import React from "react";
import { AbsoluteFill } from "remotion";
import { HOT } from "../components/Doors";
import { Panel, Pill, Pop, Txt } from "../components/L";
import { theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

export const S9Real: React.FC = () => {
  const s = useScene("s9");
  const tiles = [
    { t: "DOCTORS", d: "reading test results", c: C.red, at: s.cueS(1, "doctors") },
    { t: "SPAM FILTERS", d: "learning from new emails", c: C.green, at: s.cueS(1, "spam") },
    { t: "DATA SCIENTISTS", d: "updating predictions", c: C.violet, at: s.cueS(1, "data") },
  ];
  return (
    <AbsoluteFill>
      <Pop x={540} y={250} at={s.sent(0).from - 4}>
        <Txt size={50}>not just game shows</Txt>
      </Pop>
      <Pop x={540} y={400} at={s.cueS(0, "update") - 4}>
        <Panel w={960} h={200} color={HOT}>
          <Txt size={50}>new info → <span style={{ color: HOT }}>update your odds</span></Txt>
          <Txt size={34} font="body" color={C.dim}>don&apos;t freeze on your first guess</Txt>
        </Panel>
      </Pop>
      {tiles.map((k, i) => (
        <Pop key={k.t} x={540} y={640 + i * 170} at={k.at - 6}>
          <Panel w={860} h={140} color={k.c} style={{ flexDirection: "row", gap: 24 }}>
            <Txt size={44} color={k.c}>{k.t}</Txt>
            <Txt size={34} font="body">{k.d}</Txt>
          </Panel>
        </Pop>
      ))}
      <Pop x={540} y={1210} at={s.cueS(1, "Bayesian") - 4}>
        <Pill color={C.cyan} size={54} solid>BAYESIAN THINKING</Pill>
      </Pop>
    </AbsoluteFill>
  );
};
