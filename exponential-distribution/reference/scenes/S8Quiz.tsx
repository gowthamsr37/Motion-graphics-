// SCENE 8 — QUIZ + TEASER + CTA. A help desk gets 3 calls an hour on average: how many in 4 hours? Options 3 / 12 / 7 / 4
// → 12 (the average grows with time: 3 × 4). Teaser: the exponential distribution.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Cta } from "../components/Cta";
import { CurveIcon, Teaser } from "../components/Explain";
import { exitP, Pop, shake, useSpr } from "../components/Motion";
import { Pill, Tag } from "../components/Nodes";
import { Countdown, Options, Question, QuizBadge, type QuizOpt, quizClock, Reveal } from "../components/Quiz";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";
import { EVT, HI, RARE, RATE } from "./S1Hook";

const C = theme.colors;
const OPTS: QuizOpt[] = [
  { v: "3", color: C.cyan, why: "that's 1 hour" },
  { v: "12", color: C.green, why: "" },
  { v: "7", color: C.violet, why: "don't add" },
  { v: "4", color: C.orange, why: "that's hours" },
];
const HX = (h: number) => 200 + h * 170;

export const S8Quiz: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s8");
  const QQ = s.sent(0).from;
  const DESK = s.sent(1).from;
  const Q = s.sent(2).from;
  const FOURH = s.cueS(2, "4");
  const QEND = s.sent(2).to;
  const { CD0 } = quizClock(QEND, s.fps);
  const ANS = s.sent(3).from;
  const WHY = s.sent(4).from;
  const TWELVE = s.cueS(4, "12.");
  const TZ = s.sent(5).from;
  const EXPW = s.cueS(5, "exponential");
  const FOL = s.sent(6).from;
  const FOLW = s.cueS(6, "Follow");
  const DATAW = s.cueS(6, "data");
  const SIMPLE = s.cueS(6, "simple!");
  const sh = shake(frame, ANS, 12, 10);
  const clear = exitP(frame, TZ - 10, 10);
  const teaseOut = exitP(frame, FOL - 10, 10);

  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      {clear < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - clear, transform: `scale(${1 - clear * 0.06})` }}>
          <QuizBadge at={QQ} />
          {/* 4 hour blocks; the first shows its 3 calls, the rest fill in during the answer */}
          {[0, 1, 2, 3].map((h) => {
            const p = spr((h === 0 ? DESK : FOURH) - 4 + h * 4, theme.spring.bouncy);
            if (p <= 0.001) return null;
            const fill = h === 0 ? frame >= DESK + 6 : frame >= WHY + 4 + h * 8;
            return (
              <div key={h} style={{ position: "absolute", left: HX(h) + 85, top: 560, transform: `translate(-50%, -50%) scale(${interpolate(p, [0, 1], [0.6, 1])})`, opacity: Math.min(1, p * 2), width: 150, height: 120, boxSizing: "border-box", borderRadius: 20, background: alpha(RATE, 0.14), border: `3px solid ${alpha(RATE, 0.7)}` }}>
                <div style={{ position: "absolute", left: 0, right: 0, top: 10, textAlign: "center", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 18, letterSpacing: "0.14em", color: C.dim }}>HOUR {h + 1}</div>
                <div style={{ position: "absolute", left: 0, right: 0, top: 52, display: "flex", justifyContent: "center", gap: 10 }}>
                  {[0, 1, 2].map((j) => <div key={j} style={{ width: 26, height: 26, borderRadius: 13, background: fill ? EVT : "transparent", border: `3px ${fill ? "solid" : "dashed"} ${fill ? EVT : alpha("#F3F7FF", 0.3)}`, boxShadow: fill ? `0 0 10px ${EVT}` : "none", boxSizing: "border-box" }} />)}
                </div>
              </div>
            );
          })}
          <Pop at={DESK + 4} x={540} y={700} from="up" dist={12} cfg={theme.spring.bouncy}>
            <Pill label="3 CALLS AN HOUR" color={EVT} size={28} glow={0.4} />
          </Pop>
          <Question at={Q} keyAt={FOURH} CD0={CD0} line1="Calls expected" line2="IN 4 HOURS?" color={C.yellow} />
          <Countdown CD0={CD0} />
          <Reveal ANS={ANS} label="12 CALLS" size={70} />
          <Options opts={OPTS} answer={1} QEND={QEND} CD0={CD0} ANS={ANS} WHY={WHY} />
          <Pop at={TWELVE - 8} x={540} y={1110} from="up" dist={24} cfg={theme.spring.bouncy}>
            <Tag color={HI} size={34}>
              3 AN HOUR × 4 HOURS = 12
            </Tag>
          </Pop>
        </AbsoluteFill>
      ) : null}
      {frame >= TZ - 6 && teaseOut < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - teaseOut }}>
          <Teaser at={TZ} titleAt={Math.min(EXPW, TZ + 6)} label="NEXT" title="EXPONENTIAL" color={RARE} icon={<CurveIcon color={RARE} f={(u) => Math.exp(-u * 4)} w={460} h={240} />} />
        </AbsoluteFill>
      ) : null}
      {frame >= FOL - 6 ? (
        <Cta
          FOL={FOL}
          FOLW={FOLW}
          DATAW={DATAW}
          SIMPLE={SIMPLE}
          next="EXPONENTIAL DISTRIBUTION"
          chips={[
            { l: "Counts events", c: EVT },
            { l: "Fixed interval", c: RATE },
            { l: "Steady rate", c: HI },
            { l: "One number", c: RARE },
          ]}
        />
      ) : null}
    </AbsoluteFill>
  );
};
