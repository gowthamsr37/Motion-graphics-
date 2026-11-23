// SCENE 4 — WAY 1: YOUR FIRST PICK. Door 1 gets a cyan 1/3 box; doors 2+3 share an orange 2/3 bracket; the host opens 3
// (goat) and the whole 2/3 slides onto door 2.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Door, HOT } from "../components/Doors";
import { Pill, Pop, Txt } from "../components/L";
import { ease } from "../components/Motion";
import { theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const X = [230, 540, 850];

export const S4Way1: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s4");
  const THIRD = s.cueS(1, "1");
  const TWO = s.sent(2).from;
  const OPEN = s.cueS(2, "opens");
  const MOVE = s.cueS(2, "moves");
  const op = ease(frame, [OPEN, OPEN + 14], [0, 1]);
  const mv = ease(frame, [MOVE - 6, MOVE + 14], [0, 1]);
  const bl = interpolate(mv, [0, 1], [X[1] - 150, X[1] - 150]);
  const bw = interpolate(mv, [0, 1], [X[2] - X[1] + 300, 300]);
  return (
    <AbsoluteFill>
      <Pop x={540} y={240} at={s.sent(0).from - 4}>
        <Pill color={C.cyan} size={40}>WAY 1 · YOUR FIRST PICK</Pill>
      </Pop>
      {X.map((x, i) => (
        <div key={i} style={{ position: "absolute", left: x, top: 640, transform: "translate(-50%, -50%)" }}>
          <Door n={i + 1} w={230} prize={i === 1 ? "car" : "goat"} open={i === 2 ? op : 0} hl={i === 0 ? C.cyan : undefined} />
        </div>
      ))}
      <div style={{ position: "absolute", left: X[0] - 150, top: 860, width: 300, opacity: ease(frame, [THIRD - 4, THIRD + 4], [0, 1]), textAlign: "center" }}>
        <div style={{ height: 8, borderRadius: 4, background: C.cyan, boxShadow: `0 0 12px ${C.cyan}` }} />
        <Txt size={80} color={C.cyan} glow style={{ marginTop: 10 }}>1/3</Txt>
      </div>
      <div style={{ position: "absolute", left: bl, top: 860, width: bw, opacity: ease(frame, [TWO - 4, TWO + 4], [0, 1]), textAlign: "center" }}>
        <div style={{ height: 8, borderRadius: 4, background: HOT, boxShadow: `0 0 12px ${HOT}` }} />
        <Txt size={80} color={HOT} glow style={{ marginTop: 10 }}>2/3</Txt>
      </div>
      <Pop x={540} y={1120} at={s.cueS(1, "never") - 4} out={TWO - 6}>
        <Txt size={42} font="body">your pick stays 1/3, forever</Txt>
      </Pop>
      <Pop x={540} y={1120} at={OPEN}>
        <Txt size={42} font="body">
          host removes a goat → <span style={{ color: HOT }}>all 2/3 lands on door 2</span>
        </Txt>
      </Pop>
    </AbsoluteFill>
  );
};
