// SCENE 9 — QUIZ + TEASER + CTA. A salesperson closes 1 call in 4: on average, how many calls until the first sale?
// Options 1 / 4 / 25 / 3 → 4 (one over the chance). Teaser: the t-distribution.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Bracket } from "../components/Curve";
import { Cta } from "../components/Cta";
import { CurveIcon, Teaser } from "../components/Explain";
import { ease, exitP, Mark, Pop, shake, useSpr } from "../components/Motion";
import { Pill, Tag } from "../components/Nodes";
import { Countdown, Options, Question, QuizBadge, type QuizOpt, quizClock, Reveal } from "../components/Quiz";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";
import { AVG, NO, TRY, YES } from "./S1Hook";

const C = theme.colors;
const OPTS: QuizOpt[] = [
  { v: "1", color: C.cyan, why: "that's one call" },
  { v: "4", color: C.green, why: "" },
  { v: "25", color: C.violet, why: "that's the percent" },
  { v: "3", color: C.orange, why: "count the sale too" },
];
const CX = (i: number) => 175 + i * 66;
const SALE = (i: number) => i % 4 === 3;

export const S9Quiz: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s9");
  const QQ = s.sent(0).from;
  const CALLS = s.sent(1).from;
  const Q = s.sent(2).from;
  const FIRSTW = s.cueS(2, "first");
  const QEND = s.sent(2).to;
  const { CD0 } = quizClock(QEND, s.fps);
  const ANS = s.sent(3).from;
  const WHY = s.sent(4).from;
  const FOURC = s.cueS(4, "four");
  const TZ = s.sent(5).from;
  const TW = s.cueS(5, "t-distribution.");
  const FOL = s.sent(6).from;
  const FOLW = s.cueS(6, "Follow");
  const DATAW = s.cueS(6, "data");
  const SIMPLE = s.cueS(6, "simple!");
  const sh = shake(frame, ANS, 12, 10);
  const clear = exitP(frame, TZ - 10, 10);
  const teaseOut = exitP(frame, FOL - 10, 10);
  const tail = (u: number) => Math.exp(-(((u - 0.5) / 0.13) ** 2) / 2);
  const fat = (u: number) => Math.pow(1 + ((u - 0.5) / 0.1) ** 2 / 2, -1.5) * 0.82;

  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      {clear < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - clear, transform: `scale(${1 - clear * 0.06})` }}>
          <QuizBadge at={QQ} />
          {/* calls: one in every four is a sale */}
          {Array.from({ length: 12 }, (_, i) => {
            const p = spr(CALLS + 2 + i * 2, theme.spring.pop);
            if (p <= 0.001) return null;
            const sale = SALE(i);
            const c = sale ? YES : NO;
            return (
              <div key={i} style={{ position: "absolute", left: CX(i), top: 580, transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, p), [0, 1], [0.5, 1])})`, opacity: Math.min(1, p * 2), width: 54, height: 54, borderRadius: 27, background: alpha(c, sale ? 0.6 : 0.18), border: `3px solid ${c}`, boxShadow: sale ? `0 0 14px ${YES}` : "none", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 20, color: sale ? C.ink : C.dim }}>
                {sale ? <Mark kind="check" at={0} size={28} color={C.ink} width={6} /> : i + 1}
              </div>
            );
          })}
          <Pop at={CALLS + 20} x={540} y={690} from="up" dist={12} cfg={theme.spring.bouncy}>
            <Pill label="1 IN EVERY 4 CALLS IS A SALE" color={YES} size={28} glow={0.4} />
          </Pop>
          <Bracket x0={CX(0) - 28} x1={CX(3) + 28} y={512} p={ease(frame, [FOURC - 6, FOURC + 6], [0, 1])} color={AVG} label={<span style={{ fontSize: 28, color: AVG }}>4 CALLS</span>} />
          <Question at={Q} keyAt={FIRSTW} CD0={CD0} line1="Calls until the first sale?" line2="ON AVERAGE?" color={C.yellow} />
          <Countdown CD0={CD0} />
          <Reveal ANS={ANS} label="4 CALLS" size={70} />
          <Options opts={OPTS} answer={1} QEND={QEND} CD0={CD0} ANS={ANS} WHY={WHY} />
          <Pop at={FOURC - 8} x={540} y={1110} from="up" dist={24} cfg={theme.spring.bouncy}>
            <Tag color={AVG} size={34}>
              AVERAGE WAIT = 1 ÷ (1/4) = 4
            </Tag>
          </Pop>
        </AbsoluteFill>
      ) : null}
      {frame >= TZ - 6 && teaseOut < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - teaseOut }}>
          <Teaser
            at={TZ}
            titleAt={Math.min(TW, TZ + 6)}
            label="NEXT: SMALL SAMPLES"
            title="THE t-DISTRIBUTION"
            color={AVG}
            icon={
              <div style={{ position: "relative", width: 460, height: 240 }}>
                <div style={{ position: "absolute", left: 0, top: 0 }}>
                  <CurveIcon color={TRY} f={tail} w={460} h={240} />
                </div>
                <div style={{ position: "absolute", left: 0, top: 0 }}>
                  <CurveIcon color={AVG} f={fat} w={460} h={240} />
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
          next="THE t-DISTRIBUTION"
          chips={[
            { l: "One yes/no try", c: YES },
            { l: "Success = 1", c: NO },
            { l: "Tries till first yes", c: TRY },
            { l: "Mean = 1 ÷ chance", c: AVG },
          ]}
        />
      ) : null}
    </AbsoluteFill>
  );
};
