// SCENE 9 — QUIZ + CTA. Flip a coin twice: what's the chance of exactly one head? Options 1/4, 1/2, 3/4, 1/3 → 1/2
// (of the four equally likely outcomes HH, HT, TH, TT, two have exactly one head).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Cta } from "../components/Cta";
import { exitP, Pop, shake, useSpr } from "../components/Motion";
import { Tag } from "../components/Nodes";
import { Coin } from "../components/Prob";
import { Countdown, Options, Question, QuizBadge, type QuizOpt, quizClock, Reveal } from "../components/Quiz";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";
import { CONT, DISC, PROB } from "./S1Hook";

const C = theme.colors;
const OPTS: QuizOpt[] = [
  { v: "1/4", color: C.cyan, why: "that's just HT" },
  { v: "1/2", color: C.green, why: "" },
  { v: "3/4", color: C.violet, why: "too many" },
  { v: "1/3", color: C.orange, why: "4 outcomes" },
];
const OUTCOMES: ["H" | "T", "H" | "T"][] = [
  ["H", "H"],
  ["H", "T"],
  ["T", "H"],
  ["T", "T"],
];

export const S9Quiz: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s9");
  const QQ = s.sent(0).from;
  const FLIP = s.sent(1).from;
  const Q = s.sent(2).from;
  const ONEW = s.cueS(2, "one");
  const QEND = s.sent(2).to;
  const { CD0 } = quizClock(QEND, s.fps);
  const ANS = s.sent(3).from;
  const WHY = s.sent(4).from;
  const TWO = s.cueS(4, "two");
  const FOL = s.sent(5).from;
  const FOLW = s.cueS(5, "Follow");
  const DATAW = s.cueS(5, "data");
  const SIMPLE = s.cueS(5, "simple!");
  const sh = shake(frame, ANS, 12, 10);
  const clear = exitP(frame, FOL - 10, 10);
  const coinsOut = exitP(frame, WHY - 6, 8);
  const hi = spr(TWO - 4, theme.spring.pop);

  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      {clear < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - clear, transform: `scale(${1 - clear * 0.06})` }}>
          <QuizBadge at={QQ} />
          {/* the prop: two coins flipping */}
          {coinsOut < 1
            ? [0, 1].map((i) => {
                const p = spr(FLIP - 4 + i * 4, theme.spring.bouncy);
                if (p <= 0.001) return null;
                const sq = Math.cos((frame - FLIP) * 0.32 + i * 1.3);
                const side = Math.floor(((frame - FLIP) * 0.32 + i * 1.3) / Math.PI) % 2 === 0 ? "H" : "T";
                return (
                  <div key={i} style={{ position: "absolute", left: 400 + i * 280, top: 590 - Math.abs(Math.sin((frame - FLIP) * 0.16 + i)) * 50, transform: `translate(-50%, -50%) scale(${p * (1 - coinsOut * 0.3)})`, opacity: 1 - coinsOut }}>
                    <Coin side={side} size={170} squash={sq} />
                  </div>
                );
              })
            : null}
          {/* the four outcomes */}
          {OUTCOMES.map((o, i) => {
            const p = spr(WHY + i * 5, theme.spring.bouncy);
            if (p <= 0.001) return null;
            const one = o[0] !== o[1];
            const glow = one ? hi : 0;
            const dim = !one ? 1 - hi * 0.5 : 1;
            return (
              <div key={i} style={{ position: "absolute", left: 180 + i * 240, top: 600, transform: `translate(-50%, -50%) scale(${interpolate(p, [0, 1], [0.5, 1]) * (1 + glow * 0.06)})`, opacity: Math.min(1, p * 2) * dim, width: 210, height: 150, boxSizing: "border-box", borderRadius: 26, background: one && hi > 0.5 ? alpha(C.green, 0.2) : "rgba(14,24,64,0.9)", border: `3px solid ${one && hi > 0.5 ? C.green : alpha("#F3F7FF", 0.25)}`, boxShadow: glow > 0.5 ? `0 0 26px ${alpha(C.green, 0.5)}` : "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                <Coin side={o[0]} size={72} />
                <Coin side={o[1]} size={72} />
              </div>
            );
          })}
          <Question at={Q} keyAt={ONEW} CD0={CD0} line1="Chance of exactly" line2="ONE HEAD?" color={C.yellow} />
          <Countdown CD0={CD0} />
          <Reveal ANS={ANS} label="1/2" size={80} />
          <Options opts={OPTS} answer={1} QEND={QEND} CD0={CD0} ANS={ANS} WHY={WHY} />
          <Pop at={TWO - 2} x={540} y={1110} from="up" dist={24} cfg={theme.spring.bouncy}>
            <Tag color={C.green} size={32}>
              2 OF 4 OUTCOMES = 1/2
            </Tag>
          </Pop>
        </AbsoluteFill>
      ) : null}
      {frame >= FOL - 6 ? (
        <Cta
          FOL={FOL}
          FOLW={FOLW}
          DATAW={DATAW}
          SIMPLE={SIMPLE}
          next="POPULATION VS SAMPLE"
          chips={[
            { l: "Total = 1", c: PROB },
            { l: "Discrete", c: DISC },
            { l: "Continuous", c: CONT },
            { l: "Area = chance", c: C.orange },
          ]}
        />
      ) : null}
    </AbsoluteFill>
  );
};
