// SCENE 2 — HOOK: "hours of theory → never build anything" (a progress bar of video lectures stuck at 0 projects); then
// the project card: PREDICT FLAT PRICES IN BANGALORE · FOLLOW ALONG, with a laptop doodle.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Computer } from "../components/Doodles";
import { Icon, Panel, Pill, Pop, Txt } from "../components/D2";
import { ease } from "../components/Motion";
import { theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

export const S2Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s2");
  const P2 = s.sent(1).from;
  const hrs = Math.round(ease(frame, [4, P2 - 10], [0, 40]));
  const top = 1 - ease(frame, [P2 - 8, P2], [0, 1]);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", inset: 0, opacity: top }}>
        <Pop x={540} y={330} at={2}>
          <Txt size={50}>most beginners…</Txt>
        </Pop>
        <Pop x={540} y={600} at={6}>
          <Panel w={900} h={330} color={C.red}>
            <Txt size={34} color={C.dim} font="body">hours of theory watched</Txt>
            <Txt size={90} font="mono" color={C.text}>{hrs} hrs</Txt>
            <Txt size={44}>projects built: <span style={{ color: C.red }}>0</span></Txt>
          </Panel>
        </Pop>
      </div>
      {frame >= P2 - 8 ? (
        <AbsoluteFill style={{ opacity: 1 - top }}>
          <Pop x={540} y={300} at={P2}>
            <Txt size={46} font="body">today: one real project</Txt>
          </Pop>
          <Pop x={540} y={660} at={P2 + 4}>
            <Panel w={920} h={500} color={C.orange}>
              <Icon size={200}>
                <Computer x={100} y={100} s={190} at={P2 + 4} />
              </Icon>
              <Txt size={60}>PREDICT FLAT PRICES</Txt>
              <Txt size={54} color={C.orange} glow>in Bangalore</Txt>
            </Panel>
          </Pop>
          <Pop x={540} y={1030} at={s.cueS(1, "Follow") - 4}>
            <Pill color={C.green} size={44} solid>FOLLOW ALONG</Pill>
          </Pop>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
