// SCENE 6 — WATCH A MACHINE LEARN. Hand-drawn axes (size → price) and 10 house data points. Round 1: a random guess line
// ("terrible!"). The error appears as dashed pencil lines from each house to the line, and an ERROR meter with the average
// miss in $k. The line is nudged round by round (2, 3, 4 on "nudges / again / again", ghosts of earlier guesses stay in
// pencil), then fast-forwards to round 50: error tiny, green tick. Bottom: the loop GUESS → ERROR → ADJUST → REPEAT.
// Data chosen so the least-squares line is exactly price = 50 + 0.15 × size ($k), used again in scene 7.
import React from "react";
import { AbsoluteFill, interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { House } from "../components/Doodles";
import { Arrow, Check, CircleAround, Header, Layer, Sketch, WriteAt } from "../components/NB";
import { ease } from "../components/Motion";
import { hand, nb, theme } from "../theme";
import { useScene } from "../timing";

export const DATA: [number, number][] = [
  [700, 175], [900, 160], [1100, 230], [1250, 219.5], [1400, 268],
  [1600, 298], [1750, 294.5], [1900, 350], [2100, 340], [2300, 415],
];
export const FIT = { b: 50, m: 0.15 };
const START = { b: 330, m: -0.06 };
const X0 = 200, X1 = 800, Y0 = 1010, Y1 = 470;
const sx = (s: number) => X0 + ((s - 500) / 2000) * (X1 - X0);
const py = (p: number) => Y0 - (p / 450) * (Y0 - Y1);
const params = (r: number) => {
  const f = Math.pow(0.6, r - 1);
  return { b: FIT.b + (START.b - FIT.b) * f, m: FIT.m + (START.m - FIT.m) * f };
};
const mae = (q: { b: number; m: number }) => DATA.reduce((a, [s, p]) => a + Math.abs(p - (q.b + q.m * s)), 0) / DATA.length;
const MAE0 = mae(START);

const FitLine: React.FC<{ q: { b: number; m: number }; color: string; width: number; opacity?: number; dash?: string; p?: number }> = ({ q, color, width, opacity = 1, dash, p = 1 }) => {
  const s0 = 500, s1 = 500 + 2000 * p;
  return <line x1={sx(s0)} y1={py(q.b + q.m * s0)} x2={sx(s1)} y2={py(q.b + q.m * s1)} stroke={color} strokeWidth={width} strokeLinecap="round" opacity={opacity} strokeDasharray={dash} />;
};

export const S6Learn: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s6");
  const S0 = s.sent(0).from;
  const HOU = s.cueS(1, "houses:");
  const G = s.cueS(2, "guess.");
  const TER = s.cueS(2, "terrible.");
  const ERR = s.cueS(3, "error.");
  const steps = [s.cueS(4, "nudges"), s.cueS(4, "again.", 0), s.cueS(4, "again.", 1)];
  const AF = s.sent(5).from;
  const TINY = s.cueS(5, "tiny.");
  const loop = [s.cueS(5, "Guess,"), s.cueS(5, "measure"), s.cueS(5, "adjust,"), s.cueS(5, "repeat.")];
  const LEARN = s.cueS(5, "learning.");
  // the round counter (continuous)
  let r = 1;
  steps.forEach((t, i) => {
    r += ease(frame, [t - 2, t + 8], [0, 1]);
    void i;
  });
  const ff = ease(frame, [AF, TINY], [0, 1], theme.ease.inOut);
  r = r + ff * 46;
  const q = params(r);
  const err = mae(q);
  const errK = err / MAE0;
  const lineOn = ease(frame, [G - 6, G + 8], [0, 1]);
  const resP = ease(frame, [ERR - 10, ERR + 6], [0, 1]);
  const lineCol = interpolateColors(ff, [0, 1], [nb.red, nb.blue]);
  const meterCol = interpolateColors(errK, [0.1, 0.6], [nb.green, nb.red]);
  const done = frame >= TINY;
  return (
    <AbsoluteFill>
      <Header text="watch a machine learn" at={S0 - 4} />
      <Layer>
        <House x={930} y={330} s={110} at={S0 + 4} />
        {/* axes */}
        <Sketch s={{ k: "line", x1: X0, y1: Y1 - 30, x2: X0, y2: Y0 }} at={HOU - 12} dur={8} o={{ width: 4, seed: 201 }} />
        <Sketch s={{ k: "line", x1: X0, y1: Y0, x2: X1 + 20, y2: Y0 }} at={HOU - 6} dur={8} o={{ width: 4, seed: 202 }} />
        {/* data */}
        {DATA.map(([sz, pr], i) => (
          <Sketch key={i} s={{ k: "circle", x: sx(sz), y: py(pr), d: 22 }} at={HOU + 4 + i * 3} dur={5} o={{ color: nb.ink, width: 3, fill: nb.orange, fillStyle: "solid", seed: 210 + i }} />
        ))}
        {/* residuals */}
        {resP > 0
          ? DATA.map(([sz, pr], i) => {
              const yl = py(q.b + q.m * sz);
              const yp = py(pr);
              return <line key={i} x1={sx(sz)} y1={yp} x2={sx(sz)} y2={yp + (yl - yp) * resP} stroke={nb.pencil} strokeWidth={3} strokeDasharray="7 7" />;
            })
          : null}
        {/* ghosts of earlier guesses */}
        {steps.map((t, i) => (frame >= t + 8 && frame < AF + 20 ? <FitLine key={i} q={params(i + 1)} color={nb.pencil} width={3} opacity={0.35} dash="4 8" /> : null))}
        {lineOn > 0 ? <FitLine q={q} color={lineCol} width={7} p={lineOn} /> : null}
        {/* error meter */}
        <Sketch s={{ k: "rect", x: 880, y: 520, w: 80, h: 480 }} at={ERR - 8} dur={10} o={{ width: 4, seed: 230 }} />
      </Layer>
      {frame >= ERR - 2 ? (
        <>
          <div style={{ position: "absolute", left: 886, top: 994 - 468 * Math.min(1, errK) * ease(frame, [ERR - 2, ERR + 12], [0, 1]), width: 68, height: 468 * Math.min(1, errK) * ease(frame, [ERR - 2, ERR + 12], [0, 1]), background: meterCol, opacity: 0.75, borderRadius: 4, mixBlendMode: "multiply" }} />
          <div style={{ position: "absolute", left: 920, top: 488, transform: "translate(-50%, -50%)", fontFamily: hand.body, fontSize: 36, color: nb.ink }}>ERROR</div>
          <div style={{ position: "absolute", left: 920, top: 1050, transform: "translate(-50%, -50%)", fontFamily: hand.title, fontWeight: 700, fontSize: 40, color: meterCol, whiteSpace: "nowrap" }}>Rs {(err * 0.2).toFixed(1)}L</div>
        </>
      ) : null}
      {/* labels */}
      <WriteAt x={500} y={1058} at={s.cueS(1, "size,") - 4} size={42} color={nb.pencil} font="body" cps={40} pencil={false}>
        size (sq ft)
      </WriteAt>
      <div style={{ position: "absolute", left: 160, top: 740, transform: "translate(-50%, -50%) rotate(-90deg)" }}>
        <WriteAt x={0} y={0} at={s.cueS(1, "price.") - 4} size={42} color={nb.pencil} font="body" cps={40} pencil={false}>
          price (Rs lakh)
        </WriteAt>
      </div>
      {frame >= G - 4 ? (
        <div style={{ position: "absolute", left: 230, top: 440, transform: "translateY(-50%)", fontFamily: hand.title, fontWeight: 700, fontSize: 54, color: nb.purple, whiteSpace: "nowrap" }}>
          round {Math.max(1, Math.round(r))}
        </div>
      ) : null}
      <div style={{ opacity: 1 - ease(frame, [ERR - 14, ERR - 6], [0, 1]) }}>
        <WriteAt x={640} y={935} at={TER - 4} size={58} color={nb.red} cps={30} rot={-6}>
          terrible!
        </WriteAt>
      </div>
      <Layer>{done ? <Check x={920} y={1110} s={60} at={TINY} /> : null}</Layer>
      {/* the loop */}
      {["guess", "error", "adjust", "repeat"].map((w, i) => (
        <WriteAt key={w} x={220 + i * 220} y={1215} at={loop[i] - 4} size={60} color={[nb.red, nb.orange, nb.blue, nb.green][i]} cps={30} pencil={false}>
          {w}
        </WriteAt>
      ))}
      <Layer>
        {[0, 1, 2].map((i) => (
          <Arrow key={i} x1={290 + i * 220} y1={1218} x2={360 + i * 220} y2={1218} bend={0} at={loop[i + 1] - 8} dur={5} />
        ))}
        <Arrow x1={880} y1={1262} x2={220} y2={1262} bend={-0.12} at={loop[3] + 6} dur={12} o={{ color: nb.green }} />
        <CircleAround x={550} y={1225} w={940} h={150} at={LEARN - 4} dur={16} color={nb.purple} />
      </Layer>
      {frame >= LEARN ? (
        <div style={{ position: "absolute", left: 540, top: 1345, transform: `translate(-50%, -50%) scale(${interpolate(ease(frame, [LEARN, LEARN + 8], [0, 1]), [0, 1], [0.6, 1])})`, fontFamily: hand.title, fontWeight: 700, fontSize: 56, color: nb.purple }}>= learning!</div>
      ) : null}
    </AbsoluteFill>
  );
};
