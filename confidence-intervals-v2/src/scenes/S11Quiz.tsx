// SCENE 11 — QUIZ + TEASER + CTA. Average sleep 7 h, 95% CI 6.5 to 7.5 h: does that mean 95% of people sleep that
// long? Options YES / NO / AT 99% / CAN'T SAY → NO (it's a range for the average, not for individual people).
// Teaser: hypothesis testing.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Cta } from "../components/Cta";
import { exitP, Pop, shake, useSpr } from "../components/Motion";
import { Tag } from "../components/Nodes";
import { Coin } from "../components/Prob";
import { Countdown, Options, Question, QuizBadge, type QuizOpt, quizClock, Reveal } from "../components/Quiz";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { EST, RANGE, TRUE } from "./S1Hook";

const C = theme.colors;
const OPTS: QuizOpt[] = [
  { v: "YES", color: C.cyan, why: "common trap" },
  { v: "NO", color: C.green, why: "" },
  { v: "AT 99%", color: C.violet, why: "still no" },
  { v: "CAN'T SAY", color: C.orange, why: "we can" },
];

const Moon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block", overflow: "visible", filter: `drop-shadow(0 0 12px ${alpha(color, 0.6)})` }}>
    <path d="M62 8 A42 42 0 1 0 92 66 A34 34 0 1 1 62 8 Z" fill={alpha(color, 0.35)} stroke={color} strokeWidth={6} strokeLinejoin="round" />
  </svg>
);

export const S11Quiz: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s11");
  const QQ = s.sent(0).from;
  const CASE = s.sent(1).from;
  const Q = s.sent(2).from;
  const LONG = s.cueS(2, "long?");
  const QEND = s.sent(2).to;
  const { CD0 } = quizClock(QEND, s.fps);
  const ANS = s.sent(3).from;
  const WHY = s.sent(4).from;
  const IND = s.cueS(4, "individual");
  const TZ = s.sent(5).from;
  const HT = s.cueS(5, "Hypothesis");
  const FOL = s.sent(6).from;
  const FOLW = s.cueS(6, "Follow");
  const DATAW = s.cueS(6, "data");
  const SIMPLE = s.cueS(6, "simple!");
  const sh = shake(frame, ANS, 12, 10);
  const clear = exitP(frame, TZ - 10, 10);
  const teaseOut = exitP(frame, FOL - 10, 10);
  const cs = spr(CASE - 4, theme.spring.bouncy);
  const lab = spr(TZ - 4, theme.spring.smooth);
  const ttl = spr(HT - 2, theme.spring.bouncy);
  const ico = spr(HT + 8, theme.spring.pop);
  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      {clear < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - clear, transform: `scale(${1 - clear * 0.06})` }}>
          <QuizBadge at={QQ} />
          {cs > 0.001 ? (
            <div style={{ position: "absolute", left: 540, top: 600, transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, cs), [0, 1], [0.5, 1])})`, display: "flex", alignItems: "center", gap: 26, whiteSpace: "nowrap" }}>
              <Moon size={100} color={RANGE} />
              <div>
                <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text }}>
                  AVERAGE SLEEP: <span style={{ color: EST }}>7 H</span>
                </div>
                <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 34, color: C.text }}>
                  95% CI: <span style={{ color: RANGE }}>6.5 TO 7.5 H</span>
                </div>
              </div>
            </div>
          ) : null}
          <Question at={Q} keyAt={LONG} CD0={CD0} line1="95% of people sleep that long?" line2="YES OR NO?" color={C.yellow} size={76} />
          <Countdown CD0={CD0} />
          <Reveal ANS={ANS} label="NO!" size={70} />
          <Options opts={OPTS} answer={1} QEND={QEND} CD0={CD0} ANS={ANS} WHY={WHY} />
          <Pop at={IND - 8} x={540} y={1110} from="up" dist={24} cfg={theme.spring.bouncy}>
            <Tag color={TRUE} size={28}>
              IT&apos;S ABOUT THE AVERAGE, NOT PEOPLE
            </Tag>
          </Pop>
        </AbsoluteFill>
      ) : null}
      {frame >= TZ - 6 && teaseOut < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - teaseOut }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 520, textAlign: "center", opacity: Math.min(1, lab * 2), fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 30, letterSpacing: "0.26em", color: C.dim }}>NEXT: IS IT REAL?</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 680, textAlign: "center", transform: `translateY(-50%) scale(${interpolate(ttl, [0, 1], [0.6, 1])})`, opacity: Math.min(1, ttl * 2), fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 76, lineHeight: 1.05, color: EST, textShadow: glowText(EST, 0.6) }}>
            HYPOTHESIS
            <br />
            TESTING
          </div>
          <div style={{ position: "absolute", left: 540, top: 960, transform: `translate(-50%, -50%) scale(${ico})` }}>
            <Coin side="H" size={200} />
          </div>
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
            { l: "Estimate ± margin", c: EST },
            { l: "95 of 100", c: TRUE },
            { l: "For the average", c: C.orange },
          ]}
        />
      ) : null}
    </AbsoluteFill>
  );
};
