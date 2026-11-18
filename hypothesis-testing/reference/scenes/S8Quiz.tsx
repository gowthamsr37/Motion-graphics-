// SCENE 8 — QUIZ + TEASER + CTA. 100 people → margin ±4. 400 people → new margin? Options 1 / 2 / 4 / 8 → 2
// (4× the data halves the margin: √4 = 2). Teaser: hypothesis testing.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Radical } from "../components/Clt";
import { Cta } from "../components/Cta";
import { Teaser } from "../components/Explain";
import { ease, exitP, Pop, shake } from "../components/Motion";
import { Tag } from "../components/Nodes";
import { Coin } from "../components/Prob";
import { Countdown, Options, Question, QuizBadge, type QuizOpt, quizClock, Reveal } from "../components/Quiz";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";
import { MISS, RANGE, SAMPLE, TRUE } from "./S1Hook";

const C = theme.colors;
const OPTS: QuizOpt[] = [
  { v: "1", color: C.cyan, why: "that's ÷ 4" },
  { v: "2", color: C.green, why: "" },
  { v: "4", color: C.violet, why: "no change" },
  { v: "8", color: C.orange, why: "wrong way" },
];
const CX = 540;
const PX = 40; // pixels per point of margin

export const S8Quiz: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s8");
  const QQ = s.sent(0).from;
  const SURVEY = s.sent(1).from;
  const Q = s.sent(2).from;
  const N400 = s.cueS(2, "400");
  const QEND = s.sent(2).to;
  const { CD0 } = quizClock(QEND, s.fps);
  const ANS = s.sent(3).from;
  const WHY = s.sent(4).from;
  const ROOT = s.cueS(4, "root");
  const TZ = s.sent(5).from;
  const HYP = s.cueS(5, "Hypothesis");
  const FOL = s.sent(6).from;
  const FOLW = s.cueS(6, "Follow");
  const DATAW = s.cueS(6, "data");
  const SIMPLE = s.cueS(6, "simple!");
  const sh = shake(frame, ANS, 12, 10);
  const clear = exitP(frame, TZ - 10, 10);
  const teaseOut = exitP(frame, FOL - 10, 10);
  const bar = (y: number, half: number, p: number, color: string, label: string, val: string) =>
    p > 0.001 ? (
      <>
        <div style={{ position: "absolute", left: CX - half * PX * p, top: y - 6, width: 2 * half * PX * p, height: 12, borderRadius: 6, background: color, boxShadow: `0 0 12px ${alpha(color, 0.6)}` }} />
        <div style={{ position: "absolute", left: CX - 7, top: y - 7, width: 14, height: 14, borderRadius: 7, background: C.text }} />
        <div style={{ position: "absolute", left: 100, top: y, transform: "translateY(-50%)", opacity: Math.min(1, p * 2), fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.1em", color, whiteSpace: "nowrap" }}>{label}</div>
        <div style={{ position: "absolute", left: CX + half * PX + 30, top: y, transform: "translateY(-50%)", opacity: Math.min(1, p * 2), fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 30, color: C.text, whiteSpace: "nowrap" }}>{val}</div>
      </>
    ) : null;
  const n400 = ease(frame, [N400 - 4, N400 + 10], [0, 1]);
  const solved = ease(frame, [ANS + 4, ANS + 20], [0, 1]);

  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      {clear < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - clear, transform: `scale(${1 - clear * 0.06})` }}>
          <QuizBadge at={QQ} />
          {bar(560, 4, ease(frame, [SURVEY, SURVEY + 16], [0, 1]), RANGE, "100 PEOPLE", "± 4")}
          {n400 > 0.001 ? bar(680, interpolate(solved, [0, 1], [4, 2]), n400, solved > 0.5 ? TRUE : MISS, "400 PEOPLE", solved > 0.5 ? "± 2" : "± ?") : null}
          <Question at={Q} keyAt={N400} CD0={CD0} line1="400 people: new margin?" line2="± ?" color={C.yellow} size={90} />
          <Countdown CD0={CD0} />
          <Reveal ANS={ANS} label="± 2 POINTS" size={70} />
          <Options opts={OPTS} answer={1} QEND={QEND} CD0={CD0} ANS={ANS} WHY={WHY} />
          <Pop at={ROOT - 8} x={540} y={1110} from="up" dist={24} cfg={theme.spring.bouncy}>
            <Tag color={TRUE} size={34}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
                4× DATA: MARGIN ÷ <Radical color={C.text} size={34}>4</Radical> = ÷ 2
              </span>
            </Tag>
          </Pop>
        </AbsoluteFill>
      ) : null}
      {frame >= TZ - 6 && teaseOut < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - teaseOut }}>
          <Teaser at={TZ} titleAt={Math.min(HYP, TZ + 6)} label="NEXT: HYPOTHESIS TESTING" title="IS IT REAL?" color={SAMPLE} icon={<Coin side="H" size={220} />} />
        </AbsoluteFill>
      ) : null}
      {frame >= FOL - 6 ? (
        <Cta
          FOL={FOL}
          FOLW={FOLW}
          DATAW={DATAW}
          SIMPLE={SIMPLE}
          next="HYPOTHESIS TESTING"
          chips={[
            { l: "A range", c: RANGE },
            { l: "Average ± margin", c: SAMPLE },
            { l: "95 of 100", c: TRUE },
            { l: "More data", c: MISS },
          ]}
        />
      ) : null}
    </AbsoluteFill>
  );
};
