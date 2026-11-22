// SCENE 1 — TITLE CARD FROM FRAME 0. "100 DAYS OF ML" pill + DAY 2 / 100; "The 3 Types of Machine Learning" pops in by
// ~0.5 s; three type cards (flash cards = SUPERVISED, clusters = UNSUPERVISED, robot dog = REINFORCEMENT) land by ~1.5 s
// and each glows as it is named; the checklist (how each learns · where it's used · how to pick) is on screen by ~2.3 s
// and ticks as it is said.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Clusters, Flashcards, RobotDog } from "../components/Doodles";
import { Icon, Panel, Pill, Pop, T1, T2, T3, Txt } from "../components/D2";
import { Check, Layer, Sketch } from "../components/NB";
import { ease } from "../components/Motion";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const ITEMS = ["How each one learns", "Where it's used", "How to pick the right one"];

export const S1Title: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s1");
  const named = [s.cueS(1, "Supervised,"), s.cueS(1, "unsupervised"), s.cueS(1, "reinforcement:")];
  const ticks = [s.cueS(1, "learns,"), s.cueS(1, "used,"), s.cueS(1, "pick")];
  const cards = [
    { x: 190, t: "SUPERVISED", c: T1, I: Flashcards },
    { x: 540, t: "UNSUPERVISED", c: T2, I: Clusters },
    { x: 890, t: "REINFORCEMENT", c: T3, I: RobotDog },
  ];
  return (
    <AbsoluteFill>
      <Pop x={330} y={250} at={0}>
        <Pill color={C.violet} size={30}>100 DAYS OF ML</Pill>
      </Pop>
      <Pop x={800} y={250} at={3}>
        <Txt size={56} color={C.yellow} glow>
          DAY 2 <span style={{ color: C.dim, fontSize: 36 }}>/ 100</span>
        </Txt>
      </Pop>
      <Pop x={540} y={400} at={4}>
        <Txt size={96} style={{ textAlign: "center" }}>The 3 Types of</Txt>
      </Pop>
      <Pop x={540} y={515} at={9}>
        <Txt size={106} color={C.cyan} style={{ background: `linear-gradient(90deg, ${C.cyan}, ${C.violet}, ${C.orange})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 22px ${alpha(C.violet, 0.5)})`, textShadow: "none" }}>
          Machine Learning
        </Txt>
      </Pop>
      {cards.map((k, i) => {
        const on = ease(frame, [named[i], named[i] + 8], [0, 1]);
        return (
          <Pop key={k.t} x={k.x} y={790} at={16 + i * 6}>
            <Panel w={320} h={290} color={k.c} style={{ transform: `scale(${1 + on * 0.06})`, boxShadow: `0 0 ${20 + on * 40}px ${alpha(k.c, 0.25 + on * 0.4)}` }}>
              <Icon size={150}>
                <k.I x={75} y={75} s={150} at={-100} />
              </Icon>
              <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 26, color: k.c, textShadow: glowText(k.c, 0.4 + on * 0.4), whiteSpace: "nowrap" }}>{k.t}</div>
            </Panel>
          </Pop>
        );
      })}
      <Pop x={170} y={1010} at={34} anchor="left">
        <Txt size={34} color={C.dim} font="body">In this one:</Txt>
      </Pop>
      <Layer>
        {ITEMS.map((_, i) => (
          <React.Fragment key={i}>
            <Sketch s={{ k: "rect", x: 178, y: 1055 + i * 100, w: 52, h: 52 }} at={38 + i * 4} dur={5} o={{ color: C.text, width: 3.5, seed: 70 + i }} />
            <Check x={206} y={1081 + i * 100} s={50} at={ticks[i]} />
          </React.Fragment>
        ))}
      </Layer>
      {ITEMS.map((t, i) => (
        <Pop key={t} x={262} y={1081 + i * 100} at={40 + i * 4} anchor="left">
          <Txt size={50} font="body">{t}</Txt>
        </Pop>
      ))}
    </AbsoluteFill>
  );
};
