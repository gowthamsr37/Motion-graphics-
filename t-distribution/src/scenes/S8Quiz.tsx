// SCENE 8 — QUIZ + TEASER + CTA. As the sample grows, what does the t-distribution turn into? Options UNIFORM / NORMAL /
// POISSON / EXPONENTIAL → normal (the t-curve slims onto the dashed normal as n counts up). Teaser: chi-square.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Cta } from "../components/Cta";
import { FnCurve, type Geo } from "../components/Curve";
import { CurveIcon, Teaser } from "../components/Explain";
import { ease, exitP, Pop, shake } from "../components/Motion";
import { Tag } from "../components/Nodes";
import { Countdown, Options, Question, QuizBadge, type QuizOpt, quizClock, Reveal } from "../components/Quiz";
import { npdf, tpdf } from "../components/TDist";
import { theme } from "../theme";
import { useScene } from "../timing";
import { NC, SAMPLE, TAIL, TC } from "./S1Hook";

const C = theme.colors;
const OPTS: QuizOpt[] = [
  { v: "UNIFORM", color: C.cyan, why: "not flat" },
  { v: "NORMAL", color: C.green, why: "" },
  { v: "POISSON", color: C.violet, why: "counts" },
  { v: "EXPONENTIAL", color: C.orange, why: "one-sided" },
];
const G: Geo = { x0: 190, x1: 890, vmin: -4.5, vmax: 4.5, base: 720, h: 250 };
// chi-square with 4 degrees of freedom: x·e^(−x/2), peak 2/e at x = 2
const chi3 = (u: number) => {
  const x = u * 14;
  return (x * Math.exp(-x / 2)) / 0.7358;
};

export const S8Quiz: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s8");
  const QQ = s.sent(0).from;
  const MORE = s.sent(1).from;
  const Q = s.sent(2).from;
  const INTO = s.cueS(2, "into?");
  const QEND = s.sent(2).to;
  const { CD0 } = quizClock(QEND, s.fps);
  const ANS = s.sent(3).from;
  const WHY = s.sent(4).from;
  const SLIM = s.cueS(4, "slim");
  const TZ = s.sent(5).from;
  const CHI = s.cueS(5, "chi-square");
  const FOL = s.sent(6).from;
  const FOLW = s.cueS(6, "Follow");
  const DATAW = s.cueS(6, "data");
  const SIMPLE = s.cueS(6, "simple!");
  const sh = shake(frame, ANS, 12, 10);
  const clear = exitP(frame, TZ - 10, 10);
  const teaseOut = exitP(frame, FOL - 10, 10);
  const grow = ease(frame, [MORE, ANS + 30], [0, 1], theme.ease.inOut);
  const n = Math.round(interpolate(grow, [0, 1], [3, 41]));
  const df = n - 1;

  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      {clear < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - clear, transform: `scale(${1 - clear * 0.06})` }}>
          <QuizBadge at={QQ} />
          <FnCurve g={G} f={npdf} fmax={0.4} p={ease(frame, [MORE - 6, MORE + 14], [0, 1])} color={NC} fill={0} dashed width={4} />
          <FnCurve g={G} f={(x) => tpdf(x, df)} fmax={0.4} p={ease(frame, [MORE - 6, MORE + 14], [0, 1])} color={TC} fill={0.14} />
          {frame >= MORE ? (
            <div style={{ position: "absolute", left: 0, right: 0, top: G.base + 32, textAlign: "center", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 28, color: SAMPLE }}>
              SAMPLE SIZE n = {n}
            </div>
          ) : null}
          <Question at={Q} keyAt={INTO} CD0={CD0} line1="As the sample grows, t becomes..." line2="WHICH CURVE?" color={C.yellow} size={76} />
          <Countdown CD0={CD0} />
          <Reveal ANS={ANS} label="THE NORMAL" size={70} />
          <Options opts={OPTS} answer={1} QEND={QEND} CD0={CD0} ANS={ANS} WHY={WHY} fontSize={34} />
          <Pop at={SLIM - 8} x={540} y={1110} from="up" dist={24} cfg={theme.spring.bouncy}>
            <Tag color={SAMPLE} size={32}>
              MORE DATA, SLIMMER TAILS: NORMAL
            </Tag>
          </Pop>
        </AbsoluteFill>
      ) : null}
      {frame >= TZ - 6 && teaseOut < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - teaseOut }}>
          <Teaser at={TZ} titleAt={Math.min(CHI, TZ + 6)} label="NEXT: IS THIS DICE FAIR?" title="CHI-SQUARE" color={TAIL} icon={<CurveIcon color={TAIL} f={chi3} w={460} h={240} />} />
        </AbsoluteFill>
      ) : null}
      {frame >= FOL - 6 ? (
        <Cta
          FOL={FOL}
          FOLW={FOLW}
          DATAW={DATAW}
          SIMPLE={SIMPLE}
          next="CHI-SQUARE DISTRIBUTION"
          chips={[
            { l: "Bell, fatter tails", c: TAIL },
            { l: "Small samples", c: SAMPLE },
            { l: "df = n − 1", c: TC },
            { l: "Big n: normal", c: NC },
          ]}
        />
      ) : null}
    </AbsoluteFill>
  );
};
