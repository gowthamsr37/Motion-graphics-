// SCENE 9 — QUIZ + CTA. Heights: mean 165 cm, SD 7. What is the z-score of someone 151 cm tall?
// Options +2 / −2 / −14 / 0.5 → −2 (151 is 14 below the mean; 14 ÷ 7 = 2; below means negative).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Axis, Bell, type BellGeo, curveY, vx } from "../components/Bell";
import { Cta } from "../components/Cta";
import { ease, exitP, Pop, shake, useSpr } from "../components/Motion";
import { Pill, Tag } from "../components/Nodes";
import { Countdown, Options, Question, QuizBadge, type QuizOpt, quizClock, Reveal } from "../components/Quiz";
import { Bracket, Span } from "../components/Rule";
import { kindColor, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const OPTS: QuizOpt[] = [
  { v: "+2", color: C.cyan, why: "wrong side" },
  { v: "-2", color: C.green, why: "" },
  { v: "-14", color: C.violet, why: "still in cm" },
  { v: "0.5", color: C.orange, why: "that's Maths" },
];
const G: BellGeo = { x0: 170, x1: 910, vmin: 140, vmax: 190, base: 720, peakH: 200, sigmaRef: 7 };

export const S9Quiz: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s9");
  const QQ = s.sent(0).from;
  const H = s.sent(1).from;
  const W165 = s.cueS(1, "165");
  const W7 = s.cueS(1, "7.");
  const Q = s.sent(2).from;
  const W151 = s.cueS(2, "151");
  const QEND = s.sent(2).to;
  const { CD0 } = quizClock(QEND, s.fps);
  const ANS = s.sent(3).from;
  const WHY = s.sent(4).from;
  const W14 = s.cueS(4, "14");
  const DIV = s.cueS(4, "divided");
  const NEGW = s.cueS(4, "negative.");
  const FOL = s.sent(5).from;
  const FOLW = s.cueS(5, "Follow");
  const DATAW = s.cueS(5, "data");
  const SIMPLE = s.cueS(5, "simple!");
  const sh = shake(frame, ANS, 12, 10);
  const clear = exitP(frame, FOL - 10, 10);
  const mark = spr(W151 - 4, theme.spring.pop);
  const y151 = curveY(G, 165, 7, 151);

  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      {clear < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - clear, transform: `scale(${1 - clear * 0.06})` }}>
          <QuizBadge at={QQ} />
          <Pop at={H - 4} x={540} y={410} from="down" dist={14}>
            <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.22em", color: C.dim, whiteSpace: "nowrap" }}>HEIGHTS (cm)</div>
          </Pop>
          {frame >= H - 6 ? (
            <>
              <Bell g={G} mu={165} sigma={7} p={ease(frame, [H - 4, H + 18], [0, 1], theme.ease.inOut)} color={C.text} fill={0.08} width={5} />
              <Axis g={G} p={ease(frame, [H - 2, H + 12], [0, 1])} ticks={[144, 151, 158, 165, 172, 179, 186].map((v) => ({ v, label: `${v}`, big: v === 165 || (v === 151 && mark > 0.5), color: v === 165 && frame >= W165 - 2 ? kindColor.mean : v === 151 && mark > 0.5 ? C.yellow : undefined }))} />
            </>
          ) : null}
          <Pop at={W165 - 4} x={260} y={500} from="left" dist={20} cfg={theme.spring.bouncy}>
            <Pill label="MEAN 165" color={kindColor.mean} size={28} glow={0.4} />
          </Pop>
          <Pop at={W7 - 4} x={830} y={500} from="right" dist={20} cfg={theme.spring.bouncy}>
            <Pill label="SD 7" color={kindColor.sd} size={28} glow={0.4} />
          </Pop>
          {mark > 0.01 ? (
            <>
              <div style={{ position: "absolute", left: vx(G, 151) - 3, top: y151 - 40, height: (G.base - y151 + 40) * mark, width: 6, borderRadius: 3, background: C.yellow, boxShadow: `0 0 10px ${C.yellow}` }} />
              <div style={{ position: "absolute", left: vx(G, 151) - 14, top: y151 - 54, width: 28, height: 28, borderRadius: 14, background: C.yellow, transform: `scale(${mark})` }} />
            </>
          ) : null}
          <Span g={G} a={165} b={151} y={G.base - 34} p={ease(frame, [W14 - 4, W14 + 10], [0, 1], theme.ease.inOut)} color={C.cyan} label="-14" />
          {[0, 1].map((k) => (
            <Bracket key={k} g={G} a={165 - (k + 1) * 7} b={165 - k * 7} y={G.base + 84} p={ease(frame, [DIV - 4 + k * 10, DIV + 8 + k * 10], [0, 1])} color={kindColor.sd} label={`${k + 1} SD`} />
          ))}

          <Question at={Q} keyAt={W151} CD0={CD0} line1="The z-score of" line2="151 cm?" color={C.yellow} />
          <Countdown CD0={CD0} />
          <Reveal ANS={ANS} label="z = -2" />
          <Options opts={OPTS} answer={1} QEND={QEND} CD0={CD0} ANS={ANS} WHY={WHY} />
          <Pop at={NEGW - 4} x={540} y={1110} from="up" dist={24} cfg={theme.spring.bouncy}>
            <Tag color={C.cyan} size={32}>
              BELOW THE MEAN = NEGATIVE
            </Tag>
          </Pop>
        </AbsoluteFill>
      ) : null}
      {frame >= FOL - 6 ? (
        <Cta
          FOL={FOL}
          FOLW={FOLW}
          DATAW={DATAW}
          SIMPLE={SIMPLE}
          next="PROBABILITY DISTRIBUTIONS"
          chips={[
            { l: "In SDs", c: C.green },
            { l: "Sign = side", c: C.cyan },
            { l: "Fair compare", c: C.violet },
            { l: "Outliers", c: C.orange },
          ]}
        />
      ) : null}
    </AbsoluteFill>
  );
};

