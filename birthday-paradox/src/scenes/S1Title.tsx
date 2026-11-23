// SCENE 1 — TITLE CARD FROM FRAME 0: PARADOX #1 pill, THE BIRTHDAY PARADOX, "23 people → 50%" teaser with 23 people
// (two glowing), the four chips (why your gut is wrong · the maths · simulation · real life) by ~1.5 s, glowing as
// named; SAVE THIS ONE.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Bookmark } from "../components/Guide";
import { Guy, HOT } from "../components/BKit";
import { Pill, Pop, Txt } from "../components/L";
import { ease } from "../components/Motion";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

export const S1Title: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s1");
  const chips = [
    { t: "WHY YOUR GUT IS WRONG", c: C.red, at: s.cueS(1, "gut") },
    { t: "THE MATHS", c: C.cyan, at: s.cueS(1, "maths") },
    { t: "SIMULATION", c: C.green, at: s.cueS(1, "simulation,") },
    { t: "REAL LIFE", c: C.violet, at: s.cueS(1, "real") },
  ];
  return (
    <AbsoluteFill>
      <Pop x={540} y={250} at={0}>
        <Pill color={HOT} size={36} solid>PARADOX #1</Pill>
      </Pop>
      <Pop x={540} y={390} at={3}>
        <Txt size={96}>THE BIRTHDAY</Txt>
      </Pop>
      <Pop x={540} y={500} at={6}>
        <Txt size={124} color={HOT} glow>PARADOX</Txt>
      </Pop>
      <div style={{ position: "absolute", left: 140, right: 140, top: 610, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10 }}>
        {Array.from({ length: 23 }, (_, i) => {
          const p = ease(frame, [8 + i, 12 + i], [0, 1]);
          const hot = i === 5 || i === 16;
          return (
            <div key={i} style={{ opacity: p, transform: `scale(${p})` }}>
              <Guy size={58} color={hot ? HOT : alpha(C.text, 0.55)} glow={hot && frame > 34} />
            </div>
          );
        })}
      </div>
      <Pop x={540} y={890} at={30}>
        <Txt size={52}>
          23 people → <span style={{ color: HOT }}>50%</span> chance of a match
        </Txt>
      </Pop>
      <div style={{ position: "absolute", left: 60, right: 60, top: 990, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 14 }}>
        {chips.map((k, i) => {
          const on = ease(frame, [k.at, k.at + 8], [0, 1]);
          const p = ease(frame, [20 + i * 4, 28 + i * 4], [0, 1]);
          return (
            <div key={k.t} style={{ opacity: p, transform: `scale(${(0.6 + 0.4 * p) * (1 + on * 0.06)})`, padding: "12px 24px", borderRadius: 999, background: alpha(k.c, 0.12 + on * 0.16), border: `3px solid ${k.c}`, boxShadow: `0 0 ${10 + on * 24}px ${alpha(k.c, 0.3 + on * 0.4)}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 32, color: C.text, whiteSpace: "nowrap" }}>{k.t}</div>
          );
        })}
      </div>
      <Pop x={540} y={1300} at={s.cueS(1, "Save") - 4}>
        <Pill color={C.green} size={32}>
          <Bookmark size={34} color={C.green} />
          SAVE THIS ONE
        </Pill>
      </Pop>
    </AbsoluteFill>
  );
};
