// SCENE 2 — HOOK: "everyone thinks ML = picking the perfect algorithm"; an iceberg: the tip MODEL TRAINING ~10% above the
// waterline, below it the 90%: define · collect · clean · explore · split · evaluate · deploy; then the project card:
// PREDICT FLAT PRICES IN PUNE (house doodle).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { House } from "../components/Doodles";
import { Icon, Panel, Pop, Txt } from "../components/D2";
import { ease } from "../components/Motion";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

export const S2Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s2");
  const TEN = s.cueS(1, "10%");
  const NINETY = s.cueS(1, "90%?");
  const PROJ = s.sent(2).from;
  const below = ease(frame, [NINETY - 4, NINETY + 20], [0, 1]);
  const ice = 1 - ease(frame, [PROJ - 8, PROJ], [0, 1]);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", inset: 0, opacity: ice }}>
        <Pop x={540} y={250} at={s.sent(0).from - 4}>
          <Txt size={44} font="body">
            everyone thinks ML = <span style={{ color: C.yellow }}>the perfect algorithm</span>
          </Txt>
        </Pop>
        <svg width={1080} height={1200} viewBox="0 0 1080 1200" style={{ position: "absolute", left: 0, top: 300, opacity: ease(frame, [s.sent(1).from - 6, s.sent(1).from + 4], [0, 1]) }}>
          <rect x={0} y={260} width={1080} height={900} fill={alpha(C.cyan, 0.08)} />
          <line x1={0} y1={260} x2={1080} y2={260} stroke={C.cyan} strokeWidth={4} strokeDasharray="16 10" />
          <polygon points="540,70 660,260 420,260" fill="#E0F2FE" />
          <polygon points="420,260 660,260 900,560 760,900 320,900 180,560" fill={alpha("#BAE6FD", 0.2 + 0.75 * below)} stroke={alpha("#E0F2FE", 0.6)} strokeWidth={3} />
        </svg>
        <Pop x={800} y={440} at={TEN - 2}>
          <Txt size={44}>model training</Txt>
        </Pop>
        <Pop x={800} y={510} at={TEN + 2}>
          <Txt size={60} color={C.yellow} glow>~10%</Txt>
        </Pop>
        <div style={{ position: "absolute", left: 0, right: 0, top: 640, opacity: below, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <Txt size={110} color={C.ink} style={{ textShadow: "none" }}>90%</Txt>
          {["define the problem", "collect + clean the data", "explore + split", "evaluate + deploy"].map((t) => (
            <Txt key={t} size={40} color={C.ink} style={{ textShadow: "none" }}>{t}</Txt>
          ))}
        </div>
      </div>
      {frame >= PROJ - 8 ? (
        <AbsoluteFill style={{ opacity: 1 - ice }}>
          <Pop x={540} y={300} at={PROJ}>
            <Txt size={44} font="body" color={C.dim}>one project, step by step</Txt>
          </Pop>
          <Pop x={540} y={640} at={PROJ + 4}>
            <Panel w={900} h={460} color={C.orange}>
              <Icon size={200}>
                <House x={100} y={100} s={190} at={PROJ + 4} />
              </Icon>
              <Txt size={64}>PREDICT FLAT PRICES</Txt>
              <Txt size={48} color={C.orange} glow>in Pune</Txt>
            </Panel>
          </Pop>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
