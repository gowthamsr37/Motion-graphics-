// SCENE 7 — THE CURVE: P(at least one shared birthday) vs group size 1..70 draws itself; markers land on their words:
// 10 → 12%, 23 → 50%, 40 → 89%, 57 → 99%.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Curve, HOT } from "../components/BKit";
import { Pop, Txt } from "../components/L";
import { ease } from "../components/Motion";
import { theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

export const S7Curve: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s7");
  const marks = [
    { n: 10, at: s.cueS(1, "10") },
    { n: 23, at: s.cueS(1, "23") },
    { n: 40, at: s.cueS(1, "40") },
    { n: 57, at: s.cueS(1, "57") },
  ];
  const upTo = ease(frame, [s.sent(0).from, marks[3].at + 10], [1, 70], (t) => t);
  return (
    <AbsoluteFill>
      <Pop x={540} y={260} at={s.sent(0).from - 4}>
        <Txt size={60}>
          watch it <span style={{ color: HOT }}>climb</span>
        </Txt>
      </Pop>
      <div style={{ position: "absolute", left: 150, top: 380, fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 28, color: C.dim }}>chance of a shared birthday</div>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <Curve x={150} y={440} w={820} h={700} upTo={upTo} marks={marks.map((m) => ({ ...m, frame }))} />
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1210, textAlign: "center", fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 30, color: C.dim }}>people in the room →</div>
    </AbsoluteFill>
  );
};
