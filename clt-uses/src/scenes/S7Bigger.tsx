// SCENE 7 — MORE PEOPLE, SMALLER MARGIN. Two bells on the same axis: n = 1,000 (±3%) and n = 4,000 (±1.5%, twice as narrow);
// 4× THE PEOPLE = HALF THE MARGIN.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FnCurve, Geo, gx, ValueAxis } from "../components/Curve";
import { SceneTitle } from "../components/Kit";
import { ease, Pop } from "../components/Motion";
import { Tag } from "../components/Nodes";
import { bell, USES } from "../components/Uses";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const U = USES[0];
const G1: Geo = { x0: 140, x1: 940, vmin: 46.5, vmax: 57.5, base: 760, h: 220 };
const G2: Geo = { ...G1, base: 1140, h: 330 };

const Row: React.FC<{ g: Geo; sd: number; m: number; n: string; pm: string; c: string; p: number }> = ({ g, sd, m, n, pm, c, p }) => (
  <>
    <FnCurve g={g} f={bell(52, sd)} fmax={1} color={c} fill={0.12} width={5} p={p} bands={[{ a: 52 - m, b: 52 + m, color: C.green, opacity: 0.35 }]} />
    <ValueAxis g={g} ticks={[49, 52, 55].map((v) => ({ v, label: `${v}%` }))} p={Math.min(1, p * 2)} />
    <div style={{ position: "absolute", left: 150, top: g.base - g.h + 10, opacity: Math.min(1, p * 2), fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 34, color: C.text, whiteSpace: "nowrap" }}>
      n = {n}
      <div style={{ fontFamily: theme.fonts.mono, fontSize: 40, color: C.green }}>{pm}</div>
    </div>
    <div style={{ position: "absolute", left: gx(g, 52 - m), width: gx(g, 52 + m) - gx(g, 52 - m), top: g.base - 6, height: 6, background: C.green, opacity: Math.min(1, p * 2), borderRadius: 3 }} />
  </>
);

export const S7Bigger: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s7");
  const FOUR = s.cueS(0, "4");
  const K = s.cueS(0, "4,000");
  return (
    <AbsoluteFill>
      <SceneTitle label="WANT A SMALLER MARGIN?" color={U.c} at={2} />
      <Row g={G1} sd={1.58} m={3.1} n="1,000" pm="± 3%" c={U.c} p={ease(frame, [4, 24], [0, 1])} />
      <Row g={G2} sd={0.79} m={1.55} n="4,000" pm="± 1.5%" c={C.yellow} p={ease(frame, [K - 6, K + 16], [0, 1])} />
      <Pop at={FOUR - 4} x={540} y={400} from="up" dist={12} cfg={theme.spring.bouncy}>
        <div style={{ padding: "8px 26px", borderRadius: 999, background: alpha(C.yellow, 0.16), border: `3px solid ${C.yellow}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 36, color: C.text, whiteSpace: "nowrap" }}>ASK 4× AS MANY PEOPLE</div>
      </Pop>
      <Pop at={s.cueS(0, "halves") - 2} x={540} y={1270} from="up" dist={14} cfg={theme.spring.bouncy}>
        <Tag color={C.green} size={30}>
          4× THE PEOPLE = HALF THE MARGIN
        </Tag>
      </Pop>
    </AbsoluteFill>
  );
};
