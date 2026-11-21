// SCENE 12 — QUIZ + TEASER + CTA. The same students, before vs after coaching: which test checks if scores improved?
// A 2-SAMPLE · B PAIRED · C ANOVA · D CHI-SQ → B PAIRED (same people measured twice). VOTE IN THE CAPTION POLL hint.
// Teaser: the z-test with a full calculation.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Cta } from "../components/Cta";
import { Teaser } from "../components/Explain";
import { exitP, Pop, shake, useSpr } from "../components/Motion";
import { Tag } from "../components/Nodes";
import { Countdown, Options, PollHint, Question, QuizBadge, type QuizOpt, quizClock, Reveal } from "../components/Quiz";
import { CAT, G1, G2, G3, TestViz } from "../components/Tests";
import { theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const OPTS: QuizOpt[] = [
  { v: "2-SAMPLE", color: C.cyan, why: "same kids" },
  { v: "PAIRED", color: C.green, why: "" },
  { v: "ANOVA", color: C.violet, why: "only 2 sets" },
  { v: "CHI-SQ", color: C.orange, why: "not counts" },
];

const ScoreCard: React.FC<{ label: string; v: number; c: string; at: number; x: number }> = ({ label, v, c, at, x }) => {
  const spr = useSpr();
  const p = spr(at - 4, theme.spring.bouncy);
  if (p <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: x, top: 600, transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, p), [0, 1], [0.5, 1])})`, opacity: Math.min(1, p * 2), width: 230, height: 150, boxSizing: "border-box", borderRadius: 24, background: "rgba(14,24,64,0.9)", border: `3px solid ${c}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4 }}>
      <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.18em", color: c }}>{label}</div>
      <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 60, color: C.text }}>{v}</div>
    </div>
  );
};

export const S12Quiz: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s12");
  const QQ = s.sent(0).from;
  const SAME = s.sent(1).from;
  const AFTER = s.cueS(1, "after");
  const Q = s.sent(2).from;
  const KEY = s.cueS(2, "improved?");
  const QEND = s.sent(2).to;
  const { CD0 } = quizClock(QEND, s.fps);
  const ANS = s.sent(3).from;
  const WHY = s.sent(4).from;
  const TZ = s.sent(5).from;
  const FOL = s.sent(6).from;
  const sh = shake(frame, ANS, 12, 10);
  const clear = exitP(frame, TZ - 10, 10);
  const teaseOut = exitP(frame, FOL - 10, 10);
  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      {clear < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - clear, transform: `scale(${1 - clear * 0.06})` }}>
          <QuizBadge at={QQ} />
          <Pop at={SAME - 4} x={540} y={450} from="up" dist={10}>
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 34, color: C.text, whiteSpace: "nowrap" }}>SAME STUDENTS · BEFORE vs AFTER COACHING</div>
          </Pop>
          <ScoreCard label="BEFORE" v={62} c={C.dim} at={SAME + 6} x={360} />
          <ScoreCard label="AFTER" v={71} c={G2} at={AFTER} x={720} />
          <Question at={Q} keyAt={KEY} CD0={CD0} line1="Did scores improve?" line2="WHICH TEST?" color={C.yellow} />
          <Countdown CD0={CD0} />
          <Reveal ANS={ANS} label="PAIRED t-TEST" size={56} />
          <Options opts={OPTS} answer={1} QEND={QEND} CD0={CD0} ANS={ANS} WHY={WHY} fontSize={32} />
          <PollHint at={Q + 6} out={ANS - 6} />
          <Pop at={WHY + 8} x={540} y={1110} from="up" dist={24} cfg={theme.spring.bouncy}>
            <Tag color={G2} size={30}>
              SAME PEOPLE, MEASURED TWICE
            </Tag>
          </Pop>
        </AbsoluteFill>
      ) : null}
      {frame >= TZ - 6 && teaseOut < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - teaseOut }}>
          <Teaser
            at={TZ}
            titleAt={s.cueS(5, "z-test,")}
            label="NEXT: WITH A FULL CALCULATION"
            title="THE z-TEST"
            color={G1}
            icon={
              <div style={{ width: 520 }}>
                <TestViz kind="z" w={520} h={186} color={G1} p={interpolate(frame, [TZ, TZ + 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} tiny />
              </div>
            }
          />
        </AbsoluteFill>
      ) : null}
      {frame >= FOL - 6 ? (
        <Cta
          FOL={FOL}
          FOLW={s.cueS(6, "Follow")}
          DATAW={s.cueS(6, "data")}
          SIMPLE={s.cueS(6, "simple!")}
          next="THE z-TEST"
          chips={[
            { l: "1 group: z / t", c: G1 },
            { l: "2 groups: t", c: G2 },
            { l: "3+: ANOVA", c: G3 },
            { l: "Counts: chi-square", c: CAT },
          ]}
        />
      ) : null}
    </AbsoluteFill>
  );
};
