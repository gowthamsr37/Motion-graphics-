// SCENE 9 — QUIZ + TEASER + CTA. Version B beats A by just 0.1 points, with p = 0.4: what should you do?
// Options SHIP B / NOT YET / DELETE A / SHIP BOTH → NOT YET (0.4 is far above 0.05: easily luck, no winner yet).
// Teaser: the t-test.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { AC, BC, NULLC, PLess, PV } from "../components/AB";
import { Cta } from "../components/Cta";
import { FnCurve, type Geo } from "../components/Curve";
import { Teaser } from "../components/Explain";
import { exitP, Pop, shake, useSpr } from "../components/Motion";
import { Tag } from "../components/Nodes";
import { Countdown, Options, Question, QuizBadge, type QuizOpt, quizClock, Reveal } from "../components/Quiz";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const OPTS: QuizOpt[] = [
  { v: "SHIP B", color: C.cyan, why: "could be luck" },
  { v: "NOT YET", color: C.green, why: "" },
  { v: "DELETE A", color: C.violet, why: "no reason" },
  { v: "SHIP BOTH", color: C.orange, why: "pick one" },
];

// teaser icon: two overlapping bell curves (two group averages)
const TG: Geo = { x0: 0, x1: 460, vmin: -3, vmax: 5, base: 230, h: 200 };
const bell = (m: number) => (v: number) => Math.exp(-((v - m) ** 2) / 2);
const TwoBells: React.FC = () => (
  <div style={{ position: "relative", width: 460, height: 240 }}>
    <FnCurve g={TG} f={bell(0)} fmax={1} color={AC} fill={0.18} width={5} />
    <FnCurve g={TG} f={bell(2)} fmax={1} color={BC} fill={0.18} width={5} />
  </div>
);

export const S9Quiz: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s9");
  const QQ = s.sent(0).from;
  const CASE = s.sent(1).from;
  const PW = s.cueS(1, "p-value");
  const Q = s.sent(2).from;
  const DO = s.cueS(2, "do?");
  const QEND = s.sent(2).to;
  const { CD0 } = quizClock(QEND, s.fps);
  const ANS = s.sent(3).from;
  const WHY = s.sent(4).from;
  const LUCK = s.cueS(4, "luck,");
  const TZ = s.sent(5).from;
  const TT = s.cueS(5, "t-test.");
  const FOL = s.sent(6).from;
  const FOLW = s.cueS(6, "Follow");
  const DATAW = s.cueS(6, "data");
  const SIMPLE = s.cueS(6, "simple!");
  const sh = shake(frame, ANS, 12, 10);
  const clear = exitP(frame, TZ - 10, 10);
  const teaseOut = exitP(frame, FOL - 10, 10);
  const cs = spr(CASE - 4, theme.spring.bouncy);
  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      {clear < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - clear, transform: `scale(${1 - clear * 0.06})` }}>
          <QuizBadge at={QQ} />
          {cs > 0.001 ? (
            <div style={{ position: "absolute", left: 540, top: 600, transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, cs), [0, 1], [0.5, 1])})`, display: "flex", alignItems: "center", gap: 28, whiteSpace: "nowrap" }}>
              <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text }}>
                <span style={{ color: BC }}>B</span> BEATS <span style={{ color: AC }}>A</span> BY <span style={{ fontFamily: theme.fonts.mono }}>0.1</span>
              </div>
              <div style={{ opacity: Math.min(1, spr(PW - 4, theme.spring.pop) * 2), padding: "8px 24px", borderRadius: 999, background: alpha(PV, 0.2), border: `4px solid ${PV}` }}>
                <PLess v="0.4" size={44} />
              </div>
            </div>
          ) : null}
          <Question at={Q} keyAt={DO} CD0={CD0} line1="What should you do?" line2="WHICH ONE?" color={C.yellow} />
          <Countdown CD0={CD0} />
          <Reveal ANS={ANS} label="NOT YET: NO WINNER" size={52} />
          <Options opts={OPTS} answer={1} QEND={QEND} CD0={CD0} ANS={ANS} WHY={WHY} />
          <Pop at={LUCK - 8} x={540} y={1110} from="up" dist={24} cfg={theme.spring.bouncy}>
            <Tag color={NULLC} size={28}>
              0.4 IS FAR ABOVE 0.05: EASILY LUCK
            </Tag>
          </Pop>
        </AbsoluteFill>
      ) : null}
      {frame >= TZ - 6 && teaseOut < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - teaseOut }}>
          <Teaser at={TZ} titleAt={Math.min(TT, TZ + 40)} label="NEXT: COMPARING TWO AVERAGES" title="THE t-TEST" color={PV} icon={<TwoBells />} />
        </AbsoluteFill>
      ) : null}
      {frame >= FOL - 6 ? (
        <Cta
          FOL={FOL}
          FOLW={FOLW}
          DATAW={DATAW}
          SIMPLE={SIMPLE}
          next="THE t-TEST"
          chips={[
            { l: "Random split", c: NULLC },
            { l: "Two versions", c: BC },
            { l: "Test decides", c: PV },
            { l: "Don't peek", c: AC },
          ]}
        />
      ) : null}
    </AbsoluteFill>
  );
};
