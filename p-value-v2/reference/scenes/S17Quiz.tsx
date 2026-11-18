// SCENE 17 — QUIZ + TEASER + CTA. The number of emails you get every hour: which distribution? Options NORMAL / POISSON
// / BINOMIAL / PARETO → POISSON (it counts events in a stretch of time). Teaser: confidence intervals.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Cta } from "../components/Cta";
import { BONUS, COUNTS, MEAS, TEST } from "../components/Guide";
import { exitP, Pop, shake, useSpr } from "../components/Motion";
import { Tag } from "../components/Nodes";
import { Countdown, Options, Question, QuizBadge, type QuizOpt, quizClock, Reveal } from "../components/Quiz";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const OPTS: QuizOpt[] = [
  { v: "NORMAL", color: C.cyan, why: "not counts" },
  { v: "POISSON", color: C.green, why: "" },
  { v: "BINOMIAL", color: C.violet, why: "no limit" },
  { v: "PARETO", color: C.orange, why: "no giants" },
];

const Envelope: React.FC<{ w: number; color: string }> = ({ w, color }) => (
  <svg width={w} height={w * 0.7} viewBox="0 0 100 70" style={{ display: "block", overflow: "visible" }}>
    <rect x={3} y={3} width={94} height={64} rx={8} fill={alpha(color, 0.22)} stroke={color} strokeWidth={4} />
    <path d="M5 8 L50 40 L95 8" fill="none" stroke={color} strokeWidth={4} strokeLinejoin="round" />
  </svg>
);

// teaser icon: 95% ranges around a true value
const Ranges: React.FC = () => (
  <svg width={420} height={220} viewBox="0 0 420 220" style={{ overflow: "visible" }}>
    <line x1={210} y1={0} x2={210} y2={220} stroke={C.green} strokeWidth={5} />
    {[
      [120, 300],
      [150, 330],
      [95, 270],
      [240, 400],
      [130, 290],
    ].map(([a, b], i) => (
      <g key={i}>
        <line x1={a} y1={24 + i * 42} x2={b} y2={24 + i * 42} stroke={i === 3 ? C.orange : C.violet} strokeWidth={8} strokeLinecap="round" />
        <circle cx={(a + b) / 2} cy={24 + i * 42} r={8} fill={C.text} />
      </g>
    ))}
  </svg>
);

export const S17Quiz: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s17");
  const QQ = s.sent(0).from;
  const CASE = s.sent(1).from;
  const Q = s.sent(2).from;
  const FITS = s.cueS(2, "fits");
  const QEND = s.sent(2).to;
  const { CD0 } = quizClock(QEND, s.fps);
  const ANS = s.sent(3).from;
  const WHY = s.sent(4).from;
  const STRETCH = s.cueS(4, "stretch");
  const TZ = s.sent(5).from;
  const CI = s.cueS(5, "Confidence");
  const FOL = s.sent(6).from;
  const FOLW = s.cueS(6, "Follow");
  const DATAW = s.cueS(6, "data");
  const SIMPLE = s.cueS(6, "simple!");
  const sh = shake(frame, ANS, 12, 10);
  const clear = exitP(frame, TZ - 10, 10);
  const teaseOut = exitP(frame, FOL - 10, 10);
  const cs = spr(CASE - 4, theme.spring.bouncy);
  const lab = spr(TZ - 4, theme.spring.smooth);
  const ttl = spr(CI - 2, theme.spring.bouncy);
  const ico = spr(CI + 8, theme.spring.pop);
  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      {clear < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - clear, transform: `scale(${1 - clear * 0.06})` }}>
          <QuizBadge at={QQ} />
          {cs > 0.001 ? (
            <div style={{ position: "absolute", left: 540, top: 600, transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, cs), [0, 1], [0.5, 1])})`, display: "flex", alignItems: "center", gap: 26, whiteSpace: "nowrap" }}>
              <Envelope w={120} color={COUNTS} />
              <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 44, color: C.text }}>
                EMAILS <span style={{ color: COUNTS }}>PER HOUR</span>
              </div>
            </div>
          ) : null}
          <Question at={Q} keyAt={FITS} CD0={CD0} line1="Which distribution fits?" line2="WHICH ONE?" color={C.yellow} />
          <Countdown CD0={CD0} />
          <Reveal ANS={ANS} label="POISSON" size={60} />
          <Options opts={OPTS} answer={1} QEND={QEND} CD0={CD0} ANS={ANS} WHY={WHY} />
          <Pop at={STRETCH - 8} x={540} y={1110} from="up" dist={24} cfg={theme.spring.bouncy}>
            <Tag color={COUNTS} size={28}>
              COUNTS EVENTS IN A STRETCH OF TIME
            </Tag>
          </Pop>
        </AbsoluteFill>
      ) : null}
      {frame >= TZ - 6 && teaseOut < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - teaseOut }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 520, textAlign: "center", opacity: Math.min(1, lab * 2), fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 30, letterSpacing: "0.26em", color: C.dim }}>NEXT: HOW SURE CAN WE BE?</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 680, textAlign: "center", transform: `translateY(-50%) scale(${interpolate(ttl, [0, 1], [0.6, 1])})`, opacity: Math.min(1, ttl * 2), fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 76, lineHeight: 1.05, color: MEAS, textShadow: glowText(MEAS, 0.6) }}>
            CONFIDENCE
            <br />
            INTERVALS
          </div>
          <div style={{ position: "absolute", left: 540, top: 960, transform: `translate(-50%, -50%) scale(${ico})` }}>
            <Ranges />
          </div>
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
            { l: "Testing", c: TEST },
            { l: "Save it", c: BONUS },
          ]}
        />
      ) : null}
    </AbsoluteFill>
  );
};
