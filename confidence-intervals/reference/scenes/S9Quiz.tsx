// SCENE 9 — QUIZ + TEASER + CTA. You measure how long each customer waits on hold: which distribution fits best?
// Options POISSON / EXPONENTIAL / BINOMIAL / NORMAL → exponential (a waiting time; counting the calls would be Poisson).
// Teaser: confidence intervals.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Cta } from "../components/Cta";
import { Stopwatch } from "../components/Exp";
import { CurveIcon, Teaser } from "../components/Explain";
import { Arrow } from "../components/Icons";
import { exitP, Pop, shake, useSpr } from "../components/Motion";
import { Pill, Tag } from "../components/Nodes";
import { Countdown, Options, Question, QuizBadge, type QuizOpt, quizClock, Reveal } from "../components/Quiz";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";
import { BONUS, COUNTS, MEAS, TEST } from "./S1Hook";

const C = theme.colors;
const OPTS: QuizOpt[] = [
  { v: "POISSON", color: C.cyan, why: "counts calls" },
  { v: "EXPONENTIAL", color: C.green, why: "" },
  { v: "BINOMIAL", color: C.violet, why: "no tries" },
  { v: "NORMAL", color: C.orange, why: "skewed" },
];

export const S9Quiz: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s9");
  const QQ = s.sent(0).from;
  const HOLD = s.sent(1).from;
  const Q = s.sent(2).from;
  const FITS = s.cueS(2, "fits");
  const QEND = s.sent(2).to;
  const { CD0 } = quizClock(QEND, s.fps);
  const ANS = s.sent(3).from;
  const WHY = s.sent(4).from;
  const WAITW = s.cueS(4, "waiting");
  const TZ = s.sent(5).from;
  const CONF = s.cueS(5, "Confidence");
  const FOL = s.sent(6).from;
  const FOLW = s.cueS(6, "Follow");
  const DATAW = s.cueS(6, "data");
  const SIMPLE = s.cueS(6, "simple!");
  const sh = shake(frame, ANS, 12, 10);
  const clear = exitP(frame, TZ - 10, 10);
  const teaseOut = exitP(frame, FOL - 10, 10);
  const secs = Math.max(0, frame - HOLD); // 30× speed
  const mm = `${String(Math.floor(secs / 60)).padStart(2, "0")}:${String(Math.floor(secs % 60)).padStart(2, "0")}`;
  const watch = spr(HOLD - 4, theme.spring.bouncy);

  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      {clear < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - clear, transform: `scale(${1 - clear * 0.06})` }}>
          <QuizBadge at={QQ} />
          {watch > 0.001 ? (
            <div style={{ position: "absolute", left: 540, top: 560, transform: `translate(-50%, -50%) scale(${watch})`, display: "flex", alignItems: "center", gap: 24, padding: "16px 36px 16px 22px", borderRadius: 999, background: "rgba(10,20,64,0.9)", border: `3px solid ${alpha(MEAS, 0.8)}` }}>
              <Stopwatch size={80} color={MEAS} frac={(secs % 60) / 60} />
              <div>
                <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.16em", color: C.dim }}>ON HOLD</div>
                <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 60, color: C.text }}>{mm}</div>
              </div>
            </div>
          ) : null}
          <Pop at={HOLD + 12} x={540} y={700} from="up" dist={12} cfg={theme.spring.bouncy}>
            <Pill label="HOW LONG EACH CUSTOMER WAITS" color={MEAS} size={28} glow={0.4} />
          </Pop>
          <Question at={Q} keyAt={FITS} CD0={CD0} line1="Which distribution" line2="FITS BEST?" color={C.yellow} />
          <Countdown CD0={CD0} />
          <Reveal ANS={ANS} label="EXPONENTIAL" size={64} />
          <Options opts={OPTS} answer={1} QEND={QEND} CD0={CD0} ANS={ANS} WHY={WHY} />
          <Pop at={WAITW - 6} x={540} y={1110} from="up" dist={24} cfg={theme.spring.bouncy}>
            <Tag color={MEAS} size={32}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 14 }}>
                WAITING TIME <Arrow size={34} color={C.text} /> EXPONENTIAL
              </span>
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
            color={MEAS}
            icon={
              <div style={{ position: "relative" }}>
                <CurveIcon color={MEAS} f={(u) => Math.exp(-((u - 0.5) ** 2) / 0.03)} w={460} h={220} />
                <div style={{ position: "absolute", left: 140, top: 236, width: 180, height: 6, borderRadius: 3, background: BONUS }} />
                <div style={{ position: "absolute", left: 137, top: 222, width: 6, height: 34, borderRadius: 3, background: BONUS }} />
                <div style={{ position: "absolute", left: 317, top: 222, width: 6, height: 34, borderRadius: 3, background: BONUS }} />
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
            { l: "Counts", c: COUNTS },
            { l: "Measurements", c: MEAS },
            { l: "Testing tools", c: TEST },
            { l: "Match the shape", c: BONUS },
          ]}
        />
      ) : null}
    </AbsoluteFill>
  );
};
