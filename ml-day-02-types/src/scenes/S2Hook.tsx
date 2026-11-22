// SCENE 2 — HOOK: three jobs as cards, each landing on its sentence (house = predict a flat's price, cart = split a
// shop's customers into groups, robot dog = teach it to walk), each with a pulsing "TYPE ?" tag; then "each one learns
// in a completely different way" and "by the end, you'll match them instantly" with a countdown ring.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Cart, House, RobotDog } from "../components/Doodles";
import { Icon, Panel, Pop, Txt } from "../components/D2";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
export const JOBS = [
  { y: 430, t: ["Predict the", "price of a flat"], sub: "Rs ?? lakh", I: House },
  { y: 720, t: ["Split customers", "into groups"], sub: "a shop's buyers", I: Cart },
  { y: 1010, t: ["Teach a robot", "dog to walk"], sub: "nobody shows it how", I: RobotDog },
];

export const JobCard: React.FC<{ i: number; at: number; tag?: React.ReactNode }> = ({ i, at, tag }) => {
  const j = JOBS[i];
  return (
    <Pop x={540} y={j.y} at={at}>
      <Panel w={940} h={240} color={C.edgeHi} style={{ flexDirection: "row", justifyContent: "flex-start", gap: 30, padding: "0 36px" }}>
        <Icon size={170}>
          <j.I x={85} y={85} s={160} at={at - 2} />
        </Icon>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
          <Txt size={44}>{j.t[0]}</Txt>
          <Txt size={44}>{j.t[1]}</Txt>
          <Txt size={30} color={C.dim} font="body" weight={700}>{j.sub}</Txt>
        </div>
        {tag}
      </Panel>
    </Pop>
  );
};

export const S2Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s2");
  const at = [s.cueS(0, "Predict"), s.cueS(0, "Split"), s.cueS(0, "Teach")];
  const pulse = 1 + Math.abs(Math.sin(frame / 9)) * 0.08;
  return (
    <AbsoluteFill>
      <Pop x={540} y={250} at={s.sent(0).from - 4}>
        <Txt size={64} color={C.yellow} glow>3 JOBS</Txt>
      </Pop>
      {JOBS.map((_, i) => (
        <JobCard
          key={i}
          i={i}
          at={at[i] - 6}
          tag={
            <div style={{ transform: `scale(${pulse})`, width: 120, height: 120, borderRadius: 60, border: `3px dashed ${C.yellow}`, background: alpha(C.yellow, 0.1), display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 70, color: C.yellow }}>?</div>
          }
        />
      ))}
      <Pop x={540} y={1215} at={s.sent(1).from}>
        <Txt size={50}>
          3 <span style={{ color: C.orange }}>completely different</span> ways to learn
        </Txt>
      </Pop>
      <Pop x={540} y={1310} at={s.sent(2).from}>
        <Txt size={40} color={C.dim} font="body">match them by the end of this reel</Txt>
      </Pop>
    </AbsoluteFill>
  );
};
