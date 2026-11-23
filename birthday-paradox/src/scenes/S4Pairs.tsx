// SCENE 4 — WHY YOUR GUT IS WRONG. Left card: "someone shares MY birthday?" ≈ 6% (one person linked to 22 others);
// right card: "ANY two share?" — the 23-node web fills with all 253 links; then 5 friends → 10 pairs (small web),
// "every new person pairs with everyone"; 253 CHANCES FOR A MATCH.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { HOT, PairWeb } from "../components/BKit";
import { Panel, Pill, Pop, Txt } from "../components/L";
import { ease } from "../components/Motion";
import { theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

const Star: React.FC<{ n: number; r: number; p: number }> = ({ n, r, p }) => {
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    return [r + 20 + Math.cos(a) * r, r + 20 + Math.sin(a) * r];
  });
  return (
    <svg width={2 * r + 40} height={2 * r + 40}>
      {pts.slice(1, 1 + Math.round(p * (n - 1))).map((q, i) => (
        <line key={i} x1={pts[0][0]} y1={pts[0][1]} x2={q[0]} y2={q[1]} stroke={C.yellow} strokeWidth={2.5} opacity={0.8} />
      ))}
      {pts.map((q, i) => (
        <circle key={i} cx={q[0]} cy={q[1]} r={i === 0 ? 14 : 9} fill={i === 0 ? C.yellow : C.text} />
      ))}
    </svg>
  );
};

export const S4Pairs: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s4");
  const MY = s.cueS(0, "my");
  const SIX = s.sent(1).from;
  const ANY = s.sent(2).from;
  const P253 = s.cueS(2, "253");
  const FIVE = s.sent(3).from;
  const CH = s.sent(4).from;
  const top = 1 - ease(frame, [FIVE - 8, FIVE], [0, 1]);
  return (
    <AbsoluteFill>
      <Pop x={540} y={240} at={s.sent(0).from - 4}>
        <Txt size={54}>
          your brain asks the <span style={{ color: C.red }}>wrong question</span>
        </Txt>
      </Pop>
      <div style={{ position: "absolute", inset: 0, opacity: top }}>
        <Pop x={290} y={640} at={MY - 8}>
          <Panel w={470} h={620} color={C.yellow}>
            <Txt size={34} font="body">does someone share</Txt>
            <Txt size={50} color={C.yellow}>MY birthday?</Txt>
            <Star n={23} r={150} p={ease(frame, [MY, MY + 30], [0, 1])} />
            <Txt size={30} color={C.dim} font="body">22 links</Txt>
            <Txt size={60} style={{ opacity: ease(frame, [SIX - 2, SIX + 6], [0, 1]) }}>≈ 6%</Txt>
          </Panel>
        </Pop>
        <Pop x={790} y={640} at={ANY - 6}>
          <Panel w={470} h={620} color={HOT}>
            <Txt size={34} font="body">do ANY two people</Txt>
            <Txt size={50} color={HOT}>share one?</Txt>
            <PairWeb n={23} r={150} links={ease(frame, [ANY + 10, P253 + 10], [0, 1])} nodeR={9} />
            <Txt size={30} color={C.dim} font="body">every pair counts</Txt>
            <Txt size={60} style={{ opacity: ease(frame, [P253 - 4, P253 + 4], [0, 1]) }}>
              <span style={{ color: HOT }}>253</span> pairs
            </Txt>
          </Panel>
        </Pop>
      </div>
      {frame >= FIVE - 8 ? (
        <AbsoluteFill style={{ opacity: 1 - top }}>
          <Pop x={540} y={400} at={FIVE}>
            <Txt size={46} font="body">
              5 friends = <span style={{ color: HOT }}>10 pairs</span>
            </Txt>
          </Pop>
          <Pop x={540} y={700} at={FIVE + 4}>
            <PairWeb n={5} r={190} links={ease(frame, [FIVE + 6, FIVE + 50], [0, 1])} nodeR={30} />
          </Pop>
          <Pop x={540} y={1000} at={s.cueS(3, "Every")}>
            <Txt size={38} font="body" color={C.dim}>each new person pairs with everyone already there</Txt>
          </Pop>
          <Pop x={540} y={1180} at={CH - 4}>
            <Pill color={HOT} size={50} solid>253 CHANCES FOR A MATCH</Pill>
          </Pop>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
