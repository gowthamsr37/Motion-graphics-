// SCENE 1 — HOOK FROM FRAME 0 (series strip "100 DAYS OF ML · DAY 6 · FEATURES" visible from frame 0): a model card
// "BANGALORE FLAT PRICE MODEL · ACCURACY 99%" with a glowing meter; on "useless" a red USELESS stamp; "can you spot why?"
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Panel, Pill, Pop, Txt } from "../components/D2";
import { ease } from "../components/Motion";
import { theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

export const SeriesStrip: React.FC = () => (
  <div style={{ position: "absolute", left: 0, right: 0, top: 200, display: "flex", justifyContent: "center", gap: 14 }}>
    <Pill color={C.violet} size={26}>100 DAYS OF ML</Pill>
    <Pill color={C.yellow} size={26}>DAY 6 · FEATURES</Pill>
  </div>
);

export const S1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s1");
  const USE = s.cueS(1, "useless.");
  const acc = ease(frame, [2, 40], [0, 99]);
  return (
    <AbsoluteFill>
      <SeriesStrip />
      <Pop x={540} y={620} at={0}>
        <Panel w={900} h={560} color={C.green}>
          <Txt size={32} color={C.dim} font="body" style={{ letterSpacing: "0.14em" }}>BANGALORE FLAT PRICE MODEL</Txt>
          <Txt size={200} font="mono" color={C.green} glow>{Math.round(acc)}%</Txt>
          <Txt size={44}>accuracy</Txt>
          <div style={{ width: 700, height: 26, borderRadius: 13, background: "rgba(255,255,255,0.1)" }}>
            <div style={{ width: `${acc}%`, height: "100%", borderRadius: 13, background: C.green, boxShadow: `0 0 16px ${C.green}` }} />
          </div>
        </Panel>
      </Pop>
      <Pop x={540} y={640} at={USE - 2}>
        <div style={{ transform: `rotate(-10deg) scale(${ease(frame, [USE - 2, USE + 6], [1.8, 1])})` }}>
          <Pill color={C.red} size={90} solid>USELESS</Pill>
        </div>
      </Pop>
      <Pop x={540} y={1080} at={s.cueS(1, "spot") - 4}>
        <Txt size={58}>can you <span style={{ color: C.yellow }}>spot why?</span></Txt>
      </Pop>
    </AbsoluteFill>
  );
};
