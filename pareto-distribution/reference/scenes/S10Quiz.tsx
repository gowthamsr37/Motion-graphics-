// SCENE 10 — QUIZ + TEASER + CTA. You count how many emails arrive each hour: which distribution fits?
// Options UNIFORM / POISSON / NORMAL / EXPONENTIAL → POISSON (counting events in a fixed stretch of time).
// Teaser: confidence intervals.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Cta } from "../components/Cta";
import { CurveIcon, Teaser } from "../components/Explain";
import { ease, exitP, Pop, shake, useSpr } from "../components/Motion";
import { Pill, Tag } from "../components/Nodes";
import { Envelope } from "../components/Pick";
import { Countdown, Options, Question, QuizBadge, type QuizOpt, quizClock, Reveal } from "../components/Quiz";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";
import { BIN, EXP, POI, UNI } from "./S1Hook";

const C = theme.colors;
const OPTS: QuizOpt[] = [
  { v: "UNIFORM", color: C.cyan, why: "not equally likely" },
  { v: "POISSON", color: C.green, why: "" },
  { v: "NORMAL", color: C.violet, why: "not a measurement" },
  { v: "EXPONENTIAL", color: C.orange, why: "that's waiting time" },
];
const BX0 = 170;
const BX1 = 910;
const BAR_Y = 600;
const MAILS = [6, 17, 24, 39, 51]; // minutes within the hour

export const S10Quiz: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s10");
  const QQ = s.sent(0).from;
  const MAIL = s.sent(1).from;
  const EMAILS = s.cueS(1, "emails");
  const Q = s.sent(2).from;
  const WHICH = s.cueS(2, "Which");
  const QEND = s.sent(2).to;
  const { CD0 } = quizClock(QEND, s.fps);
  const ANS = s.sent(3).from;
  const WHY = s.sent(4).from;
  const COUNTING = s.cueS(4, "counting");
  const TZ = s.sent(5).from;
  const CONF = s.cueS(5, "Confidence");
  const FOL = s.sent(6).from;
  const FOLW = s.cueS(6, "Follow");
  const DATAW = s.cueS(6, "data");
  const SIMPLE = s.cueS(6, "simple!");
  const sh = shake(frame, ANS, 12, 10);
  const clear = exitP(frame, TZ - 10, 10);
  const teaseOut = exitP(frame, FOL - 10, 10);
  const bar = ease(frame, [MAIL - 2, MAIL + 12], [0, 1]);
  const count = MAILS.filter((_, i) => frame >= EMAILS + i * 5).length;

  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      {clear < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - clear, transform: `scale(${1 - clear * 0.06})` }}>
          <QuizBadge at={QQ} />
          {/* one hour; emails land at random minutes and get counted */}
          <div style={{ position: "absolute", left: BX0, top: BAR_Y - 5, width: (BX1 - BX0) * bar, height: 10, borderRadius: 5, background: alpha(C.text, 0.35) }} />
          {bar > 0.5 ? (
            <>
              <div style={{ position: "absolute", left: BX0, top: BAR_Y + 34, transform: "translate(-50%, -50%)", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 22, color: C.dim }}>0</div>
              <div style={{ position: "absolute", left: BX1, top: BAR_Y + 34, transform: "translate(-50%, -50%)", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 22, color: C.dim, whiteSpace: "nowrap" }}>60 MIN</div>
            </>
          ) : null}
          {MAILS.map((m, i) => {
            const p = spr(EMAILS - 4 + i * 5, theme.spring.bouncy);
            if (p <= 0.001) return null;
            return (
              <div key={i} style={{ position: "absolute", left: BX0 + (m / 60) * (BX1 - BX0), top: BAR_Y - 10, transform: `translate(-50%, -100%) translateY(${(1 - Math.min(1, p)) * -60}px) scale(${interpolate(Math.min(1, p), [0, 1], [0.6, 1])})`, opacity: Math.min(1, p * 2) }}>
                <Envelope w={62} color={C.cyan} />
              </div>
            );
          })}
          <Pop at={EMAILS + 2} x={540} y={720} from="up" dist={12} cfg={theme.spring.bouncy}>
            <Pill label={`EMAILS THIS HOUR: ${count}`} color={POI} size={28} glow={0.4} />
          </Pop>
          <Question at={Q} keyAt={WHICH} CD0={CD0} line1="Which distribution" line2="FITS?" color={C.yellow} />
          <Countdown CD0={CD0} />
          <Reveal ANS={ANS} label="POISSON" size={70} />
          <Options opts={OPTS} answer={1} QEND={QEND} CD0={CD0} ANS={ANS} WHY={WHY} fontSize={34} />
          <Pop at={COUNTING - 6} x={540} y={1110} from="up" dist={24} cfg={theme.spring.bouncy}>
            <Tag color={POI} size={32}>
              COUNTING EVENTS IN A FIXED TIME
            </Tag>
          </Pop>
        </AbsoluteFill>
      ) : null}
      {frame >= TZ - 6 && teaseOut < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - teaseOut }}>
          <Teaser
            at={TZ}
            titleAt={Math.min(CONF, TZ + 6)}
            label="NEXT: CONFIDENCE INTERVALS"
            title="HOW SURE?"
            color={BIN}
            icon={
              <div style={{ position: "relative" }}>
                <CurveIcon color={BIN} f={(u) => Math.exp(-((u - 0.5) ** 2) / 0.03)} w={460} h={220} />
                <div style={{ position: "absolute", left: 140, top: 236, width: 180, height: 6, borderRadius: 3, background: C.green }} />
                <div style={{ position: "absolute", left: 137, top: 222, width: 6, height: 34, borderRadius: 3, background: C.green }} />
                <div style={{ position: "absolute", left: 317, top: 222, width: 6, height: 34, borderRadius: 3, background: C.green }} />
              </div>
            }
          />
        </AbsoluteFill>
      ) : null}
      {frame >= FOL - 6 ? (
        <Cta
          FOL={FOL}
          FOLW={FOLW}
          DATAW={DATAW}
          SIMPLE={SIMPLE}
          next="CONFIDENCE INTERVALS"
          chips={[
            { l: "Uniform", c: UNI },
            { l: "Binomial", c: BIN },
            { l: "Poisson", c: POI },
            { l: "Exponential", c: EXP },
          ]}
        />
      ) : null}
    </AbsoluteFill>
  );
};
