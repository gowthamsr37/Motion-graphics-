// SCENE 2 — HOOK: "1 in 1,000 people" (a row of 1,000-person blocks with one red); the test "99% accurate" → POSITIVE
// stamp; "chance you're really sick?"; COMMENT YOUR GUESS.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { HOT } from "../components/BKit";
import { SICK } from "../components/People";
import { Panel, Pill, Pop, Txt } from "../components/L";
import { ease } from "../components/Motion";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

export const S2Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s2");
  const TEST = s.sent(1).from;
  const POS = s.cueS(1, "positive.");
  const Q = s.sent(2).from;
  return (
    <AbsoluteFill>
      <Pop x={540} y={260} at={s.sent(0).from - 4}>
        <Txt size={52}>a rare disease: <span style={{ color: SICK }}>1 in 1,000</span></Txt>
      </Pop>
      <div style={{ position: "absolute", left: 140, top: 330, width: 800, display: "grid", gridTemplateColumns: "repeat(40, 1fr)", gap: 3 }}>
        {Array.from({ length: 1000 }, (_, i) => (
          <div key={i} style={{ aspectRatio: "1", borderRadius: "50%", background: i === 517 ? SICK : alpha(C.text, 0.3), opacity: ease(frame, [s.sent(0).from + i * 0.03, s.sent(0).from + 4 + i * 0.03], [0, 1]), transform: i === 517 ? "scale(1.8)" : undefined, boxShadow: i === 517 ? `0 0 10px ${SICK}` : undefined }} />
        ))}
      </div>
      <Pop x={540} y={950} at={TEST - 4}>
        <Panel w={900} h={200} color={C.green} style={{ flexDirection: "row", gap: 30 }}>
          <Txt size={44}>test: <span style={{ color: C.green }}>99% accurate</span></Txt>
          <div style={{ opacity: ease(frame, [POS - 4, POS + 2], [0, 1]), transform: `rotate(-6deg) scale(${ease(frame, [POS - 4, POS + 4], [1.6, 1])})` }}>
            <Pill color={C.red} size={40} solid>POSITIVE</Pill>
          </div>
        </Panel>
      </Pop>
      <Pop x={540} y={1150} at={Q - 2}>
        <Txt size={50}>chance you&apos;re <span style={{ color: C.yellow }}>really sick</span>?</Txt>
      </Pop>
      <Pop x={540} y={1270} at={s.cueS(2, "Comment") - 4}>
        <div style={{ transform: `scale(${1 + Math.abs(Math.sin(frame / 8)) * 0.04})` }}>
          <Pill color={HOT} size={40} solid>COMMENT YOUR GUESS</Pill>
        </div>
      </Pop>
    </AbsoluteFill>
  );
};
