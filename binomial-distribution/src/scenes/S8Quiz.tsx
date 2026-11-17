// SCENE 8 — QUIZ + TEASER + CTA. She scores 80% of penalties and takes 10: on average, how many goals?
// Options 10 / 8 / 5 / 0.8 → 8 (10 × 0.8). Teaser: the Poisson distribution.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Cta } from "../components/Cta";
import { BarsIcon, Teaser } from "../components/Explain";
import { exitP, Mark, Pop, shake, useSpr } from "../components/Motion";
import { Pill, Tag } from "../components/Nodes";
import { Countdown, Options, Question, QuizBadge, type QuizOpt, quizClock, Reveal } from "../components/Quiz";
import { theme } from "../theme";
import { useScene } from "../timing";
import { AVGC, BARS, FAIL, SUCC } from "./S1Hook";

const C = theme.colors;
const OPTS: QuizOpt[] = [
  { v: "10", color: C.cyan, why: "not every time" },
  { v: "8", color: C.green, why: "" },
  { v: "5", color: C.violet, why: "that's 50-50" },
  { v: "0.8", color: C.orange, why: "that's the chance" },
];
const SCORED = [true, true, false, true, true, true, true, false, true, true];
// Poisson(4) shape for the teaser
const POIS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((k) => {
  let f = 1;
  for (let i = 2; i <= k; i++) f *= i;
  return (Math.exp(-4) * 4 ** k) / f;
});

const Ball: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block" }}>
    <circle cx={50} cy={50} r={44} fill="#F3F7FF" stroke="#071033" strokeWidth={4} />
    <path d="M50 30 L66 42 L60 62 L40 62 L34 42 Z" fill="#071033" />
  </svg>
);

export const S8Quiz: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s8");
  const QQ = s.sent(0).from;
  const PEN = s.sent(1).from;
  const W80 = s.cueS(1, "80");
  const Q = s.sent(2).from;
  const MANY = s.cueS(2, "many");
  const QEND = s.sent(2).to;
  const { CD0 } = quizClock(QEND, s.fps);
  const ANS = s.sent(3).from;
  const WHY = s.sent(4).from;
  const W08 = s.cueS(4, "08");
  const TZ = s.sent(5).from;
  const POI = s.cueS(5, "Poisson");
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
          {SCORED.map((ok, i) => {
            const p = spr(PEN - 4 + i * 3, theme.spring.bouncy);
            if (p <= 0.001) return null;
            const res = frame >= WHY + 4 + i * 3;
            return (
              <div key={i} style={{ position: "absolute", left: 160 + i * 84, top: 560, transform: `translate(-50%, -50%) scale(${p})`, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{ opacity: res && !ok ? 0.4 : 1 }}>
                  <Ball size={64} />
                </div>
                <div style={{ height: 40 }}>{res ? <Mark kind={ok ? "check" : "cross"} at={WHY + 4 + i * 3} size={36} color={ok ? SUCC : FAIL} width={8} /> : null}</div>
              </div>
            );
          })}
          <Pop at={PEN} x={540} y={430} from="down" dist={10}>
            <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.2em", color: C.dim, whiteSpace: "nowrap" }}>10 PENALTIES</div>
          </Pop>
          <Pop at={W80 - 4} x={540} y={680} from="up" dist={12} cfg={theme.spring.bouncy}>
            <Pill label="SCORES 80%" color={SUCC} size={28} glow={0.4} />
          </Pop>
          <Question at={Q} keyAt={MANY} CD0={CD0} line1="On average," line2="HOW MANY GOALS?" color={C.yellow} size={74} />
          <Countdown CD0={CD0} />
          <Reveal ANS={ANS} label="8 GOALS" size={70} />
          <Options opts={OPTS} answer={1} QEND={QEND} CD0={CD0} ANS={ANS} WHY={WHY} />
          <Pop at={W08 - 6} x={540} y={1110} from="up" dist={24} cfg={theme.spring.bouncy}>
            <Tag color={AVGC} size={34}>
              10 TRIES × 0.8 = 8
            </Tag>
          </Pop>
        </AbsoluteFill>
      ) : null}
      {frame >= TZ - 6 && teaseOut < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - teaseOut }}>
          <Teaser at={TZ} titleAt={Math.min(POI, TZ + 6)} label="NEXT" title="POISSON" color={C.cyan} icon={<BarsIcon color={C.cyan} vals={POIS} w={460} h={240} />} />
        </AbsoluteFill>
      ) : null}
      {frame >= FOL - 6 ? (
        <Cta
          FOL={FOL}
          FOLW={FOLW}
          DATAW={DATAW}
          SIMPLE={SIMPLE}
          next="POISSON DISTRIBUTION"
          chips={[
            { l: "Count successes", c: SUCC },
            { l: "Fixed tries", c: BARS },
            { l: "Same chance", c: C.cyan },
            { l: "Mean = n × p", c: AVGC },
          ]}
        />
      ) : null}
    </AbsoluteFill>
  );
};
