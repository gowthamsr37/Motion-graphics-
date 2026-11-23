// SCENE 1 — TITLE CARD FROM FRAME 0: PARADOX #3, THE MONTY HALL PROBLEM, three doors, "STICK or SWITCH?", chips
// (the game · the answer · 3 easy ways · 1,000-game test), SAVE THIS ONE.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Bookmark } from "../components/Guide";
import { Door, HOT } from "../components/Doors";
import { Pill, Pop, Txt } from "../components/L";
import { ease } from "../components/Motion";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

export const S1Title: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s1");
  const chips = [
    { t: "THE GAME", c: HOT, at: s.cueS(1, "game,") },
    { t: "THE ANSWER", c: C.red, at: s.cueS(1, "answer") },
    { t: "3 EASY WAYS", c: C.cyan, at: s.cueS(1, "3") },
    { t: "1,000 GAMES", c: C.green, at: s.cueS(1, "1,000-game") },
  ];
  return (
    <AbsoluteFill>
      <Pop x={540} y={240} at={0}>
        <Pill color={HOT} size={36} solid>PARADOX #3</Pill>
      </Pop>
      <Pop x={540} y={370} at={3}>
        <Txt size={92}>THE MONTY HALL</Txt>
      </Pop>
      <Pop x={540} y={480} at={6}>
        <Txt size={120} color={HOT} glow>PROBLEM</Txt>
      </Pop>
      <div style={{ position: "absolute", left: 0, right: 0, top: 580, display: "flex", justifyContent: "center", gap: 30 }}>
        {[1, 2, 3].map((n, i) => (
          <div key={n} style={{ opacity: ease(frame, [8 + i * 4, 14 + i * 4], [0, 1]), transform: `translateY(${(1 - ease(frame, [8 + i * 4, 16 + i * 4], [0, 1])) * 40}px)` }}>
            <Door n={n} w={200} />
          </div>
        ))}
      </div>
      <Pop x={540} y={950} at={24}>
        <Txt size={58}>
          <span style={{ color: C.cyan }}>STICK</span> or <span style={{ color: HOT }}>SWITCH</span>?
        </Txt>
      </Pop>
      <div style={{ position: "absolute", left: 60, right: 60, top: 1040, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 14 }}>
        {chips.map((k, i) => {
          const on = ease(frame, [k.at, k.at + 8], [0, 1]);
          const p = ease(frame, [20 + i * 4, 28 + i * 4], [0, 1]);
          return (
            <div key={k.t} style={{ opacity: p, transform: `scale(${(0.6 + 0.4 * p) * (1 + on * 0.06)})`, padding: "12px 24px", borderRadius: 999, background: alpha(k.c, 0.12 + on * 0.16), border: `3px solid ${k.c}`, boxShadow: `0 0 ${10 + on * 24}px ${alpha(k.c, 0.3 + on * 0.4)}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 32, color: C.text, whiteSpace: "nowrap" }}>{k.t}</div>
          );
        })}
      </div>
      <Pop x={540} y={1310} at={s.cueS(1, "Save") - 4}>
        <Pill color={C.green} size={32}>
          <Bookmark size={34} color={C.green} />
          SAVE THIS ONE
        </Pill>
      </Pop>
    </AbsoluteFill>
  );
};
