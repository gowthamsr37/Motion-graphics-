// SCENE 8 — QUIZ + TEASER + CTA. A train every 20 minutes, you arrive at random: chance you wait more than 15 minutes?
// Options 75% / 25% / 15% / 50% → 25% (the slice 15–20 is 5 of the 20 minutes). Teaser: the binomial distribution.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Cta } from "../components/Cta";
import { BarsIcon, Teaser } from "../components/Explain";
import { Bus } from "../components/Icons";
import { ease, exitP, Pop, shake, useSpr } from "../components/Motion";
import { Tag } from "../components/Nodes";
import { Countdown, Options, Question, QuizBadge, type QuizOpt, quizClock, Reveal } from "../components/Quiz";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";
import { AREA, CONT, DISC, HOT } from "./S1Hook";
import { MinAxis } from "./S4Bus";

const C = theme.colors;
const OPTS: QuizOpt[] = [
  { v: "75%", color: C.cyan, why: "that's under 15" },
  { v: "25%", color: C.green, why: "" },
  { v: "15%", color: C.violet, why: "not 15/100" },
  { v: "50%", color: C.orange, why: "too big" },
];
const QX0 = 190;
const QX1 = 890;
const qx = (m: number) => QX0 + (m / 20) * (QX1 - QX0);
const BASE = 720;
const H = 170;

export const S8Quiz: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s8");
  const QQ = s.sent(0).from;
  const TRAIN = s.sent(1).from;
  const Q = s.sent(2).from;
  const W15 = s.cueS(2, "15");
  const QEND = s.sent(2).to;
  const { CD0 } = quizClock(QEND, s.fps);
  const ANS = s.sent(3).from;
  const WHY = s.sent(4).from;
  const QUARTER = s.cueS(4, "quarter.");
  const TZ = s.sent(5).from;
  const BINO = s.cueS(5, "binomial");
  const FOL = s.sent(6).from;
  const FOLW = s.cueS(6, "Follow");
  const DATAW = s.cueS(6, "data");
  const SIMPLE = s.cueS(6, "simple!");
  const sh = shake(frame, ANS, 12, 10);
  const clear = exitP(frame, TZ - 10, 10);
  const teaseOut = exitP(frame, FOL - 10, 10);
  const rect = ease(frame, [TRAIN + 4, TRAIN + 18], [0, 1], theme.ease.out);
  const slice = ease(frame, [WHY - 2, WHY + 14], [0, 1], theme.ease.inOut);

  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      {clear < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - clear, transform: `scale(${1 - clear * 0.06})` }}>
          <QuizBadge at={QQ} />
          {frame >= TRAIN - 6 ? (
            <>
              {[0, 20].map((m, i) => (
                <div key={m} style={{ position: "absolute", left: qx(m), top: 470, transform: `translate(-50%, -50%) scale(${spr(TRAIN - 2 + i * 6, theme.spring.bouncy)})` }}>
                  <Bus w={90} color={CONT} />
                </div>
              ))}
              <div style={{ position: "absolute", left: 0, right: 0, top: 420, textAlign: "center", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.18em", color: CONT, opacity: ease(frame, [TRAIN, TRAIN + 10], [0, 1]) }}>A TRAIN EVERY 20 MIN</div>
              <div style={{ position: "absolute", left: QX0, top: BASE - H * rect, width: QX1 - QX0, height: H * rect, boxSizing: "border-box", borderRadius: "10px 10px 2px 2px", background: alpha(CONT, 0.25), border: `4px solid ${CONT}` }} />
              {slice > 0.01 ? <div style={{ position: "absolute", left: qx(15), top: BASE - H + 4, width: (qx(20) - qx(15) - 4) * slice, height: H - 4, background: alpha(HOT, 0.6), borderLeft: `4px solid ${HOT}` }} /> : null}
              <MinAxis base={BASE} max={20} step={5} at={qx} p={rect} />
            </>
          ) : null}
          {frame >= W15 - 2 && slice < 0.01 ? <div style={{ position: "absolute", left: qx(15) - 2, top: BASE - H - 20, height: H + 20, borderLeft: `4px dashed ${C.yellow}` }} /> : null}

          <Question at={Q} keyAt={W15} CD0={CD0} line1="Chance you wait" line2="OVER 15 MIN?" color={C.yellow} />
          <Countdown CD0={CD0} />
          <Reveal ANS={ANS} label="25%" size={80} />
          <Options opts={OPTS} answer={1} QEND={QEND} CD0={CD0} ANS={ANS} WHY={WHY} />
          <Pop at={WHY + 10} x={(qx(15) + qx(20)) / 2} y={BASE - H / 2} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
            <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 30, color: C.text, whiteSpace: "nowrap" }}>5 min</div>
          </Pop>
          <Pop at={QUARTER - 6} x={540} y={1110} from="up" dist={24} cfg={theme.spring.bouncy}>
            <Tag color={HOT} size={32}>
              5 OF 20 MINUTES = 1/4 = 25%
            </Tag>
          </Pop>
        </AbsoluteFill>
      ) : null}
      {frame >= TZ - 6 && teaseOut < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - teaseOut }}>
          <Teaser at={TZ} titleAt={Math.min(BINO, TZ + 6)} label="NEXT" title="BINOMIAL" color={AREA} icon={<BarsIcon color={AREA} vals={[1, 10, 45, 120, 210, 252, 210, 120, 45, 10, 1]} w={460} h={240} />} />
        </AbsoluteFill>
      ) : null}
      {frame >= FOL - 6 ? (
        <Cta
          FOL={FOL}
          FOLW={FOLW}
          DATAW={DATAW}
          SIMPLE={SIMPLE}
          next="BINOMIAL DISTRIBUTION"
          chips={[
            { l: "Equally likely", c: DISC },
            { l: "Flat shape", c: CONT },
            { l: "Area = chance", c: AREA },
            { l: "Mean in middle", c: HOT },
          ]}
        />
      ) : null}
    </AbsoluteFill>
  );
};
