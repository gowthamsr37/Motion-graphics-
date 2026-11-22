// SCENE 6 — TYPE 2: UNSUPERVISED (clustering). Header; "NO answers · the machine finds the structure"; a scatter of a
// shop's customers (visits per month × spend per visit) appears grey; on "three groups" the dots take colours and
// rings: BARGAIN HUNTERS (many visits, low spend), LOYAL REGULARS (middle), BIG SPENDERS (few visits, high spend);
// on "Nobody named" a "named by the machine" note, then the CLUSTERING pill.
import React from "react";
import { AbsoluteFill, interpolateColors, useCurrentFrame } from "remotion";
import { Header, Layer, Sketch } from "../components/NB";
import { Pill, Pop, T2, Txt } from "../components/D2";
import { ease } from "../components/Motion";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
// plot box
const X0 = 170, X1 = 950, Y0 = 560, Y1 = 1150;
const rnd = (seed: number) => {
  let t = seed;
  return () => {
    t = (t + 0x6d2b79f5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
};
export const GROUPS = [
  { cx: 810, cy: 1050, rx: 120, ry: 65, c: C.cyan, t: "BARGAIN HUNTERS", lx: 490, ly: 1100 },
  { cx: 560, cy: 860, rx: 110, ry: 70, c: C.green, t: "LOYAL REGULARS", lx: 835, ly: 840 },
  { cx: 310, cy: 680, rx: 100, ry: 60, c: C.orange, t: "BIG SPENDERS", lx: 565, ly: 640 },
];
const r = rnd(9);
export const DOTS = GROUPS.flatMap((g, gi) =>
  Array.from({ length: 12 }, () => {
    const a = r() * Math.PI * 2;
    const d = Math.sqrt(r()) * 0.8;
    return { x: g.cx + Math.cos(a) * g.rx * d, y: g.cy + Math.sin(a) * g.ry * d, g: gi, k: r() };
  }),
);

export const S6Unsup: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s6");
  const NO = s.cueS(0, "No");
  const PLOT = s.sent(1).from;
  const THREE = s.cueS(2, "three");
  const names = [s.cueS(2, "bargain"), s.cueS(2, "loyal"), s.cueS(2, "big")];
  const NOBODY = s.sent(3).from;
  const CL = s.cueS(3, "clustering.");
  const tint = ease(frame, [THREE, THREE + 12], [0, 1]);
  return (
    <AbsoluteFill>
      <Header text="type 2 · unsupervised learning" at={s.sent(0).from - 4} color={T2} y={230} />
      <Pop x={540} y={360} at={NO - 4}>
        <Txt size={54}>
          <span style={{ color: C.red }}>NO</span> answers. No labels.
        </Txt>
      </Pop>
      <Pop x={540} y={440} at={s.cueS(0, "structure") - 6}>
        <Txt size={38} color={C.dim} font="body">the machine finds the structure itself</Txt>
      </Pop>
      {/* axes */}
      <Layer>
        <Sketch s={{ k: "line", x1: X0, y1: Y1, x2: X1, y2: Y1 }} at={PLOT - 4} dur={10} o={{ color: C.dim, width: 4, seed: 3 }} />
        <Sketch s={{ k: "line", x1: X0, y1: Y1, x2: X0, y2: Y0 }} at={PLOT - 4} dur={10} o={{ color: C.dim, width: 4, seed: 4 }} />
        {DOTS.map((d, i) => {
          const at = PLOT + 4 + Math.round(d.k * 40);
          const p = ease(frame, [at, at + 6], [0, 1]);
          const col = interpolateColors(tint, [0, 1], [C.dim, GROUPS[d.g].c]);
          return <circle key={i} cx={d.x} cy={d.y} r={13 * p} fill={col} style={{ filter: tint > 0 ? `drop-shadow(0 0 ${8 * tint}px ${GROUPS[d.g].c})` : undefined }} />;
        })}
        {GROUPS.map((g, i) => (
          <Sketch key={i} s={{ k: "ellipse", x: g.cx, y: g.cy, w: g.rx * 2 + 50, h: g.ry * 2 + 50 }} at={names[i] - 6} dur={12} o={{ color: g.c, width: 4, seed: 30 + i }} />
        ))}
      </Layer>
      <Pop x={560} y={1195} at={PLOT + 2}>
        <Txt size={30} font="body" color={C.dim}>visits per month →</Txt>
      </Pop>
      <div style={{ position: "absolute", left: X0 - 40, top: (Y0 + Y1) / 2, transform: "translate(-50%, -50%) rotate(-90deg)", opacity: ease(frame, [PLOT + 2, PLOT + 10], [0, 1]), fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 30, color: C.dim, whiteSpace: "nowrap" }}>spend per visit →</div>
      {GROUPS.map((g, i) => (
        <Pop key={g.t} x={g.lx} y={g.ly} at={names[i] - 2}>
          <div style={{ padding: "6px 16px", borderRadius: 12, background: "rgba(5,10,31,0.85)", border: `2px solid ${alpha(g.c, 0.9)}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 28, color: g.c, whiteSpace: "nowrap" }}>{g.t}</div>
        </Pop>
      ))}
      <Pop x={540} y={1290} at={NOBODY} out={CL - 8}>
        <Txt size={36} font="body">nobody named them: <span style={{ color: T2 }}>the machine found them</span></Txt>
      </Pop>
      <Pop x={540} y={1290} at={CL - 4}>
        <Pill color={T2} size={46} solid>CLUSTERING</Pill>
      </Pop>
    </AbsoluteFill>
  );
};
