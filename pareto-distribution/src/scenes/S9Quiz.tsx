// SCENE 9 — QUIZ + TEASER + CTA. An app's crashes come from many bugs and follow 80/20: fix the top 20% of bugs, how
// many crashes disappear? Options 20% / 80% / 50% / 100% → about 80%. Teaser: the log-normal distribution.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Bracket } from "../components/Curve";
import { Cta } from "../components/Cta";
import { CurveIcon, Teaser } from "../components/Explain";
import { ease, exitP, Pop, shake, useSpr } from "../components/Motion";
import { Tag } from "../components/Nodes";
import { Countdown, Options, Question, QuizBadge, type QuizOpt, quizClock, Reveal } from "../components/Quiz";
import { DECILES } from "../data";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";
import { AVG, FEW, MANY, MID } from "./S1Hook";

const C = theme.colors;
const OPTS: QuizOpt[] = [
  { v: "20%", color: C.cyan, why: "that's the bugs" },
  { v: "80%", color: C.green, why: "" },
  { v: "50%", color: C.violet, why: "too low" },
  { v: "100%", color: C.orange, why: "not all of them" },
];
const BX = (k: number) => 190 + k * 78;
const BASE = 700;
const BH = 220;
const lognormal = (u: number) => {
  const x = Math.max(1e-3, u * 4);
  const m = Math.log(x) + 0.2;
  return Math.exp(-(m * m) / (2 * 0.5 * 0.5)) / x / 1.6;
};

export const S9Quiz: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s9");
  const QQ = s.sent(0).from;
  const BUGS = s.cueS(1, "bugs,");
  const Q = s.sent(2).from;
  const FIX = s.cueS(2, "fixes");
  const QEND = s.sent(2).to;
  const { CD0 } = quizClock(QEND, s.fps);
  const ANS = s.sent(3).from;
  const WHY = s.sent(4).from;
  const BIG = s.cueS(4, "big");
  const TZ = s.sent(5).from;
  const LOG = s.cueS(5, "log-normal");
  const FOL = s.sent(6).from;
  const FOLW = s.cueS(6, "Follow");
  const DATAW = s.cueS(6, "data");
  const SIMPLE = s.cueS(6, "simple!");
  const sh = shake(frame, ANS, 12, 10);
  const clear = exitP(frame, TZ - 10, 10);
  const teaseOut = exitP(frame, FOL - 10, 10);
  const grow = ease(frame, [BUGS - 6, BUGS + 18], [0, 1]);
  const top2 = frame >= WHY + 4;

  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      {clear < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - clear, transform: `scale(${1 - clear * 0.06})` }}>
          <QuizBadge at={QQ} />
          {DECILES.map((d, k) => {
            const h = Math.max(4, (d / 75) * BH * grow);
            const hot = top2 && k < 2;
            const c = hot ? FEW : MANY;
            return <div key={k} style={{ position: "absolute", left: BX(k) - 26, top: BASE - h, width: 52, height: h, borderRadius: "8px 8px 2px 2px", background: alpha(c, hot ? 0.7 : 0.45), border: `3px solid ${c}`, boxSizing: "border-box", boxShadow: hot ? `0 0 18px ${alpha(FEW, 0.6)}` : "none" }} />;
          })}
          {grow > 0.3 ? <div style={{ position: "absolute", left: 0, right: 0, top: BASE + 26, textAlign: "center", opacity: ease(grow, [0.3, 0.8], [0, 1]), fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.16em", color: C.dim }}>CRASHES BY BUG TYPE, BIGGEST FIRST</div> : null}
          <Bracket x0={BX(0) - 28} x1={BX(1) + 28} y={BASE - BH - 36} p={spr(FIX - 4, theme.spring.bouncy)} color={FEW} />
          <Pop at={FIX - 2} x={BX(1) + 60} y={BASE - BH - 30} from="left" dist={10}>
            <div style={{ transform: "translateX(50%)", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: C.text, whiteSpace: "nowrap" }}>
              FIX THE <span style={{ color: FEW }}>TOP 20%</span>
            </div>
          </Pop>
          <Question at={Q} keyAt={FIX} CD0={CD0} line1="Crashes that disappear?" line2="HOW MANY?" color={C.yellow} />
          <Countdown CD0={CD0} />
          <Reveal ANS={ANS} label="ABOUT 80%" size={70} />
          <Options opts={OPTS} answer={1} QEND={QEND} CD0={CD0} ANS={ANS} WHY={WHY} />
          <Pop at={BIG - 10} x={540} y={1110} from="up" dist={24} cfg={theme.spring.bouncy}>
            <Tag color={MID} size={32}>
              20% OF CAUSES, 80% OF THE EFFECT
            </Tag>
          </Pop>
        </AbsoluteFill>
      ) : null}
      {frame >= TZ - 6 && teaseOut < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - teaseOut }}>
          <Teaser at={TZ} titleAt={Math.min(LOG, TZ + 6)} label="NEXT: ANOTHER LONG TAIL" title="LOG-NORMAL" color={AVG} icon={<CurveIcon color={AVG} f={lognormal} w={460} h={240} />} />
        </AbsoluteFill>
      ) : null}
      {frame >= FOL - 6 ? (
        <Cta
          FOL={FOL}
          FOLW={FOLW}
          DATAW={DATAW}
          SIMPLE={SIMPLE}
          next="LOG-NORMAL DISTRIBUTION"
          chips={[
            { l: "Most are small", c: MANY },
            { l: "A few are huge", c: FEW },
            { l: "Long tail", c: AVG },
            { l: "80/20 rule", c: MID },
          ]}
        />
      ) : null}
    </AbsoluteFill>
  );
};
