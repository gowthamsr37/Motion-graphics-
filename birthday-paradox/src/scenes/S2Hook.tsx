// SCENE 2 — HOOK: a cricket field (oval, pitch) with 22 players + 1 umpire popping in (counter to 23); "same birthday?";
// the gut guess 23/365 ≈ 6%; COMMENT YOUR GUESS pill.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Guy, HOT } from "../components/BKit";
import { Pill, Pop, Txt } from "../components/L";
import { ease } from "../components/Motion";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const POS = Array.from({ length: 23 }, (_, i) => {
  if (i === 22) return [540, 610];
  const a = (i / 22) * Math.PI * 2;
  const rr = i % 2 ? 290 : 200;
  return [540 + Math.cos(a) * rr * 1.25, 610 + Math.sin(a) * rr * 0.78];
});

export const S2Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s2");
  const P22 = s.cueS(0, "22");
  const UMP = s.cueS(0, "umpire.");
  const Q = s.sent(1).from;
  const GUESS = s.sent(2).from;
  const COM = s.cueS(2, "Comment");
  const count = Math.min(23, Math.floor(ease(frame, [P22 - 4, UMP + 4], [0, 23], (t) => t)));
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, opacity: ease(frame, [0, 10], [0, 1]) }}>
        <ellipse cx={540} cy={610} rx={460} ry={300} fill={alpha(C.green, 0.12)} stroke={alpha(C.green, 0.7)} strokeWidth={4} />
        <rect x={515} y={530} width={50} height={160} rx={6} fill={alpha("#D9B77A", 0.35)} stroke={alpha("#D9B77A", 0.8)} strokeWidth={2} />
      </svg>
      {POS.map((p, i) => {
        const on = i < count;
        return (
          <div key={i} style={{ position: "absolute", left: p[0], top: p[1], transform: `translate(-50%, -60%) scale(${on ? 1 : 0})`, transition: "none" }}>
            <Guy size={46} color={i === 22 ? C.yellow : C.text} />
          </div>
        );
      })}
      <Pop x={540} y={250} at={P22 - 4}>
        <Txt size={64} font="mono" color={C.text}>
          {count} <span style={{ fontFamily: theme.fonts.body, fontSize: 40, color: C.dim }}>people</span>
        </Txt>
      </Pop>
      <Pop x={540} y={1000} at={Q - 4}>
        <Txt size={60}>
          same <span style={{ color: HOT }}>birthday</span>?
        </Txt>
      </Pop>
      <Pop x={540} y={1120} at={GUESS - 2}>
        <Txt size={42} font="body">
          gut guess: 23 ÷ 365 ≈ <span style={{ color: C.yellow }}>6%</span>
        </Txt>
      </Pop>
      <Pop x={540} y={1260} at={COM - 4}>
        <div style={{ transform: `scale(${1 + Math.abs(Math.sin(frame / 8)) * 0.04})` }}>
          <Pill color={HOT} size={40} solid>COMMENT YOUR GUESS</Pill>
        </div>
      </Pop>
    </AbsoluteFill>
  );
};
