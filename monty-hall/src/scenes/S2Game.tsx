// SCENE 2 — THE GAME: three doors (car behind 2, goats behind 1 and 3 — shown as a "1 car · 2 goats" legend); you pick
// door 1 (YOU tag); the host opens door 3 → goat; "SWITCH TO DOOR 2?" with STICK / SWITCH buttons; COMMENT YOUR ANSWER.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Car } from "../components/Casino";
import { Door, Goat, HOT } from "../components/Doors";
import { Pill, Pop, Txt } from "../components/L";
import { ease } from "../components/Motion";
import { theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

export const S2Game: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s2");
  const CAR = s.cueS(0, "car.");
  const GOATS = s.cueS(0, "goats.");
  const PICK = s.sent(1).from;
  const OPEN = s.cueS(2, "opens");
  const ASK = s.sent(3).from;
  const COM = s.cueS(3, "Comment");
  return (
    <AbsoluteFill>
      <Pop x={540} y={240} at={s.sent(0).from - 4}>
        <Txt size={48}>a game show · 3 doors</Txt>
      </Pop>
      <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center", gap: 40, opacity: ease(frame, [CAR - 6, CAR], [0, 1]) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}><Car size={110} color={C.yellow} /><Txt size={36} font="body">× 1</Txt></div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, opacity: ease(frame, [GOATS - 6, GOATS], [0, 1]) }}><Goat size={90} /><Txt size={36} font="body">× 2</Txt></div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 500, display: "flex", justifyContent: "center", gap: 30 }}>
        {[1, 2, 3].map((n) => (
          <Door key={n} n={n} w={230} prize={n === 2 ? "car" : "goat"} open={n === 3 ? ease(frame, [OPEN, OPEN + 14], [0, 1]) : 0} hl={n === 1 && frame >= PICK ? C.cyan : undefined}
            tag={n === 1 && frame >= PICK ? <Pill color={C.cyan} size={28} solid>YOU</Pill> : n === 3 && frame >= OPEN ? <Pill color={C.dim} size={24}>HOST OPENS</Pill> : undefined} />
        ))}
      </div>
      <Pop x={540} y={1000} at={ASK - 4}>
        <Txt size={54}>
          switch to <span style={{ color: HOT }}>door 2</span>?
        </Txt>
      </Pop>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1070, display: "flex", justifyContent: "center", gap: 30, opacity: ease(frame, [ASK + 10, ASK + 18], [0, 1]) }}>
        <Pill color={C.cyan} size={48}>STICK</Pill>
        <Pill color={HOT} size={48}>SWITCH</Pill>
      </div>
      <Pop x={540} y={1260} at={COM - 4}>
        <div style={{ transform: `scale(${1 + Math.abs(Math.sin(frame / 8)) * 0.04})` }}>
          <Pill color={HOT} size={40} solid>COMMENT YOUR ANSWER</Pill>
        </div>
      </Pop>
    </AbsoluteFill>
  );
};
