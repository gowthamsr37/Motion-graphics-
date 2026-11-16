// A worked z-score example on a bell curve (used by Maths and Science): MEAN / SD chips, the curve, YOUR score marker,
// the difference arrow, SD brackets under the axis, the equation and the z pill. All beats are passed in as frames.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Axis, Bell, type BellGeo, curveY, vx } from "../components/Bell";
import { ease, Pop, useSpr } from "../components/Motion";
import { Pill } from "../components/Nodes";
import { Bracket, Span } from "../components/Rule";
import { alpha, glowText, kindColor, theme } from "../theme";

const C = theme.colors;

export type WorkedProps = {
  g: BellGeo;
  mu: number;
  sd: number;
  x: number;
  color: string;
  ticks: number[];
  tMean: number;
  tSD: number;
  tScore: number;
  tMinus: number;
  tDiff: number;
  tDivide: number;
  tResult: number;
  hops: number;
  zText: string;
};

export const Worked: React.FC<WorkedProps> = ({ g, mu, sd, x, color, ticks, tMean, tSD, tScore, tMinus, tDiff, tDivide, tResult, hops, zText }) => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const draw = ease(frame, [4, 24], [0, 1], theme.ease.inOut);
  const score = spr(tScore - 4, theme.spring.pop);
  const yScore = curveY(g, mu, sd, x);
  const yTop = curveY(g, mu, sd, mu);
  const hot = (v: number) => (v === mu && frame >= tMean - 2) || (v === x && frame >= tScore - 2);
  const diff = x - mu;
  const zP = spr(tResult + 4, theme.spring.pop);
  const eq = [spr(tMinus - 2, theme.spring.snappy), spr(tDivide - 2, theme.spring.snappy), spr(tResult - 2, theme.spring.pop)];

  return (
    <>
      <Pop at={tMean - 4} x={330} y={480} from="left" dist={20} cfg={theme.spring.bouncy}>
        <Pill label={`MEAN ${mu}`} color={kindColor.mean} size={32} glow={0.4} />
      </Pop>
      <Pop at={tSD - 4} x={750} y={480} from="right" dist={20} cfg={theme.spring.bouncy}>
        <Pill label={`SD ${sd}`} color={kindColor.sd} size={32} glow={0.4} />
      </Pop>
      <Bell g={g} mu={mu} sigma={sd} p={draw} color={color} fill={0.16} width={5} />
      <Axis g={g} p={ease(frame, [6, 20], [0, 1])} ticks={ticks.map((v) => ({ v, label: `${v}`, big: hot(v), color: v === mu && hot(v) ? kindColor.mean : v === x && hot(v) ? C.text : undefined }))} />
      {/* the mean line */}
      <div style={{ position: "absolute", left: vx(g, mu) - 2, top: yTop - 20, height: (g.base - yTop + 20) * ease(frame, [tMean - 4, tMean + 10], [0, 1]), borderLeft: `4px dashed ${alpha("#F3F7FF", 0.75)}` }} />
      {/* your score */}
      {score > 0.01 ? (
        <>
          <div style={{ position: "absolute", left: vx(g, x) - 3, top: g.base - (g.base - yScore) * score, width: 6, height: (g.base - yScore) * score, background: C.text, borderRadius: 3, boxShadow: `0 0 10px ${alpha("#F3F7FF", 0.7)}` }} />
          <div style={{ position: "absolute", left: vx(g, x) - 16, top: yScore - 16, width: 32, height: 32, borderRadius: 16, background: C.text, transform: `scale(${score})`, boxShadow: `0 0 18px ${alpha("#F3F7FF", 0.9)}` }} />
          <div style={{ position: "absolute", left: vx(g, x) + 30, top: yScore - 30, transform: `translate(0, -50%) scale(${interpolate(score, [0, 1], [0.6, 1])})`, transformOrigin: "left center", opacity: Math.min(1, score * 2), padding: "4px 18px", borderRadius: 999, background: "#0A1440", border: `3px solid ${C.text}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: C.text, whiteSpace: "nowrap" }}>
            YOU: <span style={{ fontFamily: theme.fonts.mono }}>{x}</span>
          </div>
        </>
      ) : null}
      {/* the difference */}
      <Span g={g} a={mu} b={x} y={g.base - 40} p={ease(frame, [tMinus - 2, tMinus + 12], [0, 1], theme.ease.inOut)} labelP={spr(tDiff - 3, theme.spring.pop)} color={C.green} label={`+${diff}`} />
      {/* SD units under the axis */}
      {Array.from({ length: hops }, (_, k) => (
        <Bracket key={k} g={g} a={mu + k * sd} b={mu + (k + 1) * sd} y={g.base + 96} p={ease(frame, [tDivide + k * 12, tDivide + 14 + k * 12], [0, 1], theme.ease.out)} color={kindColor.sd} label={hops === 1 ? `1 SD = ${sd}` : `${k + 1} SD`} />
      ))}
      {/* the equation */}
      <div style={{ position: "absolute", left: 540, top: 1150, transform: "translate(-50%, -50%)", display: "flex", alignItems: "center", gap: 18, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 52, color: C.text, whiteSpace: "nowrap" }}>
        <span style={{ opacity: Math.min(1, eq[0] * 2), transform: `translateY(${(1 - eq[0]) * 16}px)`, display: "inline-block" }}>
          ({x} - <span style={{ color: kindColor.mean }}>{mu}</span>)
        </span>
        <span style={{ opacity: Math.min(1, eq[1] * 2), transform: `translateY(${(1 - eq[1]) * 16}px)`, display: "inline-block" }}>
          ÷ <span style={{ color: kindColor.sd }}>{sd}</span>
        </span>
        <span style={{ opacity: Math.min(1, eq[2] * 2), transform: `translateY(${(1 - eq[2]) * 16}px)`, display: "inline-block" }}>
          = <span style={{ color: C.green, textShadow: glowText(C.green, 0.5) }}>{zText}</span>
        </span>
      </div>
      {zP > 0.01 ? (
        <div style={{ position: "absolute", left: 540, top: 1268, transform: `translate(-50%, -50%) scale(${interpolate(zP, [0, 1], [1.6, 1])})`, opacity: Math.min(1, zP * 2) }}>
          <Pill label={`z = ${zText}`} color={C.green} size={48} glow={1} />
        </div>
      ) : null}
    </>
  );
};
