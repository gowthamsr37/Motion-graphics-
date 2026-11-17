// SCENE 8 — QUIZ + TEASER + CTA. A dataset makes a perfect bell on a log scale: what shape on a normal scale?
// Options BELL / SKEWED RIGHT / FLAT / SKEWED LEFT → skewed right (the bell morphs into a right-skewed curve).
// Teaser: Bernoulli & geometric.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Cta } from "../components/Cta";
import { Teaser } from "../components/Explain";
import { ease, exitP, Pop, shake } from "../components/Motion";
import { Tag } from "../components/Nodes";
import { Countdown, Options, Question, QuizBadge, type QuizOpt, quizClock, Reveal } from "../components/Quiz";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";
import { bell, skew } from "./S2Definition";
import { GROW, LOG, RAW, ZERO } from "./S1Hook";

const C = theme.colors;
const OPTS: QuizOpt[] = [
  { v: "BELL", color: C.cyan, why: "that's the log scale" },
  { v: "SKEWED RIGHT", color: C.green, why: "" },
  { v: "FLAT", color: C.violet, why: "that's uniform" },
  { v: "SKEWED LEFT", color: C.orange, why: "wrong way" },
];
const BX0 = 200;
const BX1 = 880;
const BASE = 700;
const BH = 200;

export const S8Quiz: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s8");
  const QQ = s.sent(0).from;
  const DATA = s.sent(1).from;
  const Q = s.sent(2).from;
  const SHAPE = s.cueS(2, "shape");
  const QEND = s.sent(2).to;
  const { CD0 } = quizClock(QEND, s.fps);
  const ANS = s.sent(3).from;
  const WHY = s.sent(4).from;
  const TAIL = s.cueS(4, "tail");
  const TZ = s.sent(5).from;
  const BERN = s.cueS(5, "Bernoulli");
  const FOL = s.sent(6).from;
  const FOLW = s.cueS(6, "Follow");
  const DATAW = s.cueS(6, "data");
  const SIMPLE = s.cueS(6, "simple!");
  const sh = shake(frame, ANS, 12, 10);
  const clear = exitP(frame, TZ - 10, 10);
  const teaseOut = exitP(frame, FOL - 10, 10);
  const draw = ease(frame, [DATA - 2, DATA + 20], [0, 1], theme.ease.inOut);
  const morph = ease(frame, [ANS + 4, ANS + 30], [0, 1], theme.ease.inOut);
  const f = (u: number) => interpolate(morph, [0, 1], [bell(u), Math.min(1, skew(u))]);
  const col = morph > 0.5 ? RAW : LOG;
  const n = Math.round(120 * draw);
  const d = Array.from({ length: n + 1 }, (_, i) => `${i ? "L" : "M"}${(BX0 + (i / 120) * (BX1 - BX0)).toFixed(1)} ${(BASE - f(i / 120) * BH).toFixed(1)}`).join(" ");

  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      {clear < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - clear, transform: `scale(${1 - clear * 0.06})` }}>
          <QuizBadge at={QQ} />
          {draw > 0.001 ? (
            <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
              <path d={`${d} L${(BX0 + (n / 120) * (BX1 - BX0)).toFixed(1)} ${BASE} L${BX0} ${BASE} Z`} fill={alpha(col, 0.18)} />
              <path d={d} fill="none" stroke={col} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
              <line x1={BX0 - 10} y1={BASE + 2} x2={BX1 + 10} y2={BASE + 2} stroke={alpha("#F3F7FF", 0.45)} strokeWidth={4} />
            </svg>
          ) : null}
          {draw > 0.3 ? (
            <div style={{ position: "absolute", left: 0, right: 0, top: BASE + 28, textAlign: "center", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.16em", color: morph > 0.5 ? RAW : LOG }}>
              {morph > 0.5 ? "THE SAME DATA, NORMAL SCALE" : "ON A LOG SCALE"}
            </div>
          ) : null}
          <Question at={Q} keyAt={SHAPE} CD0={CD0} line1="On a normal scale?" line2="WHAT SHAPE?" color={C.yellow} />
          <Countdown CD0={CD0} />
          <Reveal ANS={ANS} label="SKEWED RIGHT" size={64} />
          <Options opts={OPTS} answer={1} QEND={QEND} CD0={CD0} ANS={ANS} WHY={WHY} fontSize={34} />
          <Pop at={TAIL - 10} x={540} y={1110} from="up" dist={24} cfg={theme.spring.bouncy}>
            <Tag color={GROW} size={32}>
              BUNCHED LEFT, LONG TAIL RIGHT
            </Tag>
          </Pop>
        </AbsoluteFill>
      ) : null}
      {frame >= TZ - 6 && teaseOut < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - teaseOut }}>
          <Teaser
            at={TZ}
            titleAt={Math.min(BERN, TZ + 6)}
            label="NEXT: BERNOULLI & GEOMETRIC"
            title="YES OR NO?"
            color={ZERO}
            icon={
              <div style={{ display: "flex", gap: 60, alignItems: "flex-end" }}>
                <div style={{ display: "flex", gap: 14, alignItems: "flex-end" }}>
                  <div style={{ width: 70, height: 200, borderRadius: 10, background: alpha(C.orange, 0.6), border: `3px solid ${C.orange}` }} />
                  <div style={{ width: 70, height: 60, borderRadius: 10, background: alpha(GROW, 0.6), border: `3px solid ${GROW}` }} />
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
                  {[1, 0.83, 0.69, 0.58, 0.48, 0.4, 0.33].map((v, i) => <div key={i} style={{ width: 30, height: 180 * v, borderRadius: 6, background: alpha(ZERO, 0.6), border: `2px solid ${ZERO}` }} />)}
                </div>
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
          next="BERNOULLI & GEOMETRIC"
          chips={[
            { l: "Positive values", c: ZERO },
            { l: "Skewed right", c: RAW },
            { l: "Logs are normal", c: LOG },
            { l: "Take the log", c: GROW },
          ]}
        />
      ) : null}
    </AbsoluteFill>
  );
};
