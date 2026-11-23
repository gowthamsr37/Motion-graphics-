// SCENE 6 — THE RESULT. A bar "chance everyone is different" starts at 100% and shrinks step by step as the 22
// fractions multiply in (each only a little below 1) to 49.3%; then 100 − 49.3 = 50.7% AT LEAST ONE MATCH.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { HOT } from "../components/BKit";
import { Panel, Pop, Txt } from "../components/L";
import { ease } from "../components/Motion";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

export const S6Result: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s6");
  const MUL = s.cueS(0, "multiply");
  const ALL = s.sent(1).from;
  const R = s.sent(2).from;
  const k = Math.floor(ease(frame, [MUL, ALL + 50], [0, 22], (t) => t));
  let q = 1;
  for (let i = 1; i <= k; i++) q *= (365 - i) / 365;
  const frac = k >= 1 ? `× ${365 - k}/365` : "";
  return (
    <AbsoluteFill>
      <Pop x={540} y={260} at={s.sent(0).from - 4}>
        <Txt size={42} font="body">
          each fraction is just <span style={{ color: C.yellow }}>a little below 1</span>…
        </Txt>
      </Pop>
      <Pop x={540} y={340} at={MUL - 4}>
        <Txt size={42} font="body">
          …but multiply <span style={{ color: HOT }}>22 of them</span>
        </Txt>
      </Pop>
      <Pop x={540} y={620} at={MUL - 2}>
        <Panel w={960} h={330} color={C.cyan}>
          <Txt size={30} color={C.dim} font="body" style={{ letterSpacing: "0.12em" }}>CHANCE EVERYONE IS DIFFERENT</Txt>
          <Txt size={110} color={C.cyan} glow font="mono">{(q * 100).toFixed(1)}%</Txt>
          <div style={{ width: 860, height: 34, borderRadius: 17, background: alpha(C.text, 0.12), overflow: "hidden" }}>
            <div style={{ width: `${q * 100}%`, height: "100%", background: C.cyan, boxShadow: `0 0 16px ${C.cyan}` }} />
          </div>
          <Txt size={30} font="mono" color={C.dim}>{frac}</Txt>
        </Panel>
      </Pop>
      <Pop x={540} y={980} at={R - 4}>
        <Txt size={56} font="mono">
          100 − 49.3 = <span style={{ color: HOT }}>50.7%</span>
        </Txt>
      </Pop>
      <Pop x={540} y={1140} at={s.cueS(2, "that's") - 4}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 64, color: C.text, textShadow: glowText(HOT, 0.4), whiteSpace: "nowrap" }}>
          AT LEAST ONE <span style={{ color: HOT }}>MATCH</span>
        </div>
      </Pop>
    </AbsoluteFill>
  );
};
