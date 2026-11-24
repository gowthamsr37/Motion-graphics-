// SCENE 1 — TITLE CARD FROM FRAME 0: PARADOX #4, THE FALSE POSITIVE PARADOX, a "TEST: POSITIVE" card with "99% accurate"
// and a big "9%?", four chips (99% accurate · usually wrong · 10,000 people · why doctors retest), SAVE THIS ONE.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Bookmark } from "../components/Guide";
import { HOT } from "../components/BKit";
import { Panel, Pill, Pop, Txt } from "../components/L";
import { ease } from "../components/Motion";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

export const S1Title: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s1");
  const chips = [
    { t: "99% ACCURATE TEST", c: C.green, at: s.cueS(1, "99%") },
    { t: "USUALLY WRONG", c: C.red, at: s.cueS(1, "wrong,") },
    { t: "10,000 PEOPLE", c: C.cyan, at: s.cueS(1, "10,000") },
    { t: "WHY DOCTORS RETEST", c: C.violet, at: s.cueS(1, "retest.") },
  ];
  return (
    <AbsoluteFill>
      <Pop x={540} y={240} at={0}>
        <Pill color={HOT} size={36} solid>PARADOX #4</Pill>
      </Pop>
      <Pop x={540} y={370} at={3}>
        <Txt size={88}>THE FALSE POSITIVE</Txt>
      </Pop>
      <Pop x={540} y={480} at={6}>
        <Txt size={120} color={HOT} glow>PARADOX</Txt>
      </Pop>
      <Pop x={540} y={720} at={10}>
        <Panel w={760} h={280} color={C.red} style={{ flexDirection: "row", gap: 40 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
            <Txt size={28} color={C.dim} font="body" style={{ letterSpacing: "0.14em" }}>TEST RESULT</Txt>
            <Txt size={66} color={C.red} glow>POSITIVE</Txt>
            <Txt size={30} font="body">test is <span style={{ color: C.green }}>99% accurate</span></Txt>
          </div>
          <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 120, color: C.yellow, opacity: ease(frame, [24, 32], [0, 1]) }}>9%?</div>
        </Panel>
      </Pop>
      <div style={{ position: "absolute", left: 60, right: 60, top: 1000, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 14 }}>
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
