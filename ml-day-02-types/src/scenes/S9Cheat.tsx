// SCENE 9 — THE CHEAT SHEET (save moment). Three house rows, each landing on its sentence: question → TYPE → what it
// does (Have the right answers? SUPERVISED · predicts | No answers? UNSUPERVISED · finds patterns | Trial & reward?
// REINFORCEMENT · learns actions), with its doodle; then the SAVE THIS bookmark pill: "you'll use it all 100 days".
import React from "react";
import { AbsoluteFill } from "remotion";
import { Clusters, Flashcards, RobotDog } from "../components/Doodles";
import { Bookmark } from "../components/Guide";
import { Icon, Panel, Pill, Pop, T1, T2, T3, Txt } from "../components/D2";
import { theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

export const S9Cheat: React.FC = () => {
  const s = useScene("s9");
  const rows = [
    { q: "Have the right answers?", t: "SUPERVISED", d: "it predicts", c: T1, I: Flashcards, at: s.sent(1).from, dAt: s.cueS(1, "predicts.") },
    { q: "No answers?", t: "UNSUPERVISED", d: "it finds patterns", c: T2, I: Clusters, at: s.sent(2).from, dAt: s.cueS(2, "patterns.") },
    { q: "Trial and reward?", t: "REINFORCEMENT", d: "it learns actions", c: T3, I: RobotDog, at: s.sent(3).from, dAt: s.cueS(3, "actions.") },
  ];
  const SAVE = s.cueS(4, "Save");
  return (
    <AbsoluteFill>
      <Pop x={540} y={260} at={s.sent(0).from - 4}>
        <Txt size={72} color={C.yellow} glow>THE CHEAT SHEET</Txt>
      </Pop>
      {rows.map((r, i) => (
        <Pop key={r.t} x={540} y={490 + i * 270} at={r.at - 6}>
          <Panel w={960} h={240} color={r.c} style={{ flexDirection: "row", justifyContent: "flex-start", gap: 28, padding: "0 34px" }}>
            <Icon size={160}>
              <r.I x={80} y={80} s={160} at={-100} />
            </Icon>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Txt size={36} font="body" color={C.dim} weight={700}>{r.q}</Txt>
              <Txt size={60} color={r.c} glow>{r.t}</Txt>
              <Pop x={0} y={20} at={r.dAt - 4} anchor="left" style={{ position: "relative" }}>
                <Txt size={38}>→ {r.d}</Txt>
              </Pop>
            </div>
          </Panel>
        </Pop>
      ))}
      <Pop x={540} y={1300} at={SAVE - 4}>
        <Pill color={C.green} size={40}>
          <Bookmark size={40} color={C.green} />
          SAVE THIS · you&apos;ll use it all 100 days
        </Pill>
      </Pop>
    </AbsoluteFill>
  );
};
