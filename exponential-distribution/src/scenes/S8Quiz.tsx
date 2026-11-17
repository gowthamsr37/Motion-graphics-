// SCENE 8 — QUIZ + TEASER + CTA. Buses come at random, 6 an hour on average: what's the average wait between buses?
// Options 6 MIN / 10 MIN / 60 MIN / 1 MIN → 10 MIN (flip the rate: 60 min ÷ 6 = 10). Teaser: which distribution?
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Cta } from "../components/Cta";
import { BarsIcon, CurveIcon, FlatIcon, Teaser } from "../components/Explain";
import { Bus } from "../components/Icons";
import { ease, exitP, Pop, shake, useSpr } from "../components/Motion";
import { Pill, Tag } from "../components/Nodes";
import { Countdown, Options, Question, QuizBadge, type QuizOpt, quizClock, Reveal } from "../components/Quiz";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";
import { GAP, LONG, RATE, SHORT } from "./S1Hook";

const C = theme.colors;
const OPTS: QuizOpt[] = [
  { v: "6 MIN", color: C.cyan, why: "that's the rate" },
  { v: "10 MIN", color: C.green, why: "" },
  { v: "60 MIN", color: C.violet, why: "that's an hour" },
  { v: "1 MIN", color: C.orange, why: "too short" },
];
const BX0 = 170;
const BX1 = 910;
const BAR_Y = 600;
const bmx = (m: number) => BX0 + (m / 60) * (BX1 - BX0);
const RANDOM = [3, 15, 22, 36, 44, 58]; // random arrival minutes within the hour
const EVEN = [10, 20, 30, 40, 50, 60];
const BUS_C = [C.cyan, C.violet, C.green, C.orange, C.cyan, C.violet];

export const S8Quiz: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s8");
  const QQ = s.sent(0).from;
  const BUS = s.sent(1).from;
  const SIX = s.cueS(1, "6");
  const Q = s.sent(2).from;
  const WAITW = s.cueS(2, "wait");
  const QEND = s.sent(2).to;
  const { CD0 } = quizClock(QEND, s.fps);
  const ANS = s.sent(3).from;
  const WHY = s.sent(4).from;
  const SIXTY = s.cueS(4, "60");
  const TEN = s.cueS(4, "10");
  const TZ = s.sent(5).from;
  const WHICH = s.cueS(5, "Which");
  const FOL = s.sent(6).from;
  const FOLW = s.cueS(6, "Follow");
  const DATAW = s.cueS(6, "data");
  const SIMPLE = s.cueS(6, "simple!");
  const sh = shake(frame, ANS, 12, 10);
  const clear = exitP(frame, TZ - 10, 10);
  const teaseOut = exitP(frame, FOL - 10, 10);
  const even = ease(frame, [SIXTY - 4, SIXTY + 18], [0, 1], theme.ease.inOut);
  const bar = ease(frame, [BUS - 2, BUS + 12], [0, 1]);

  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      {clear < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - clear, transform: `scale(${1 - clear * 0.06})` }}>
          <QuizBadge at={QQ} />
          {/* one hour, with 6 buses arriving at random; on the answer they slide to one every 10 minutes */}
          <div style={{ position: "absolute", left: BX0, top: BAR_Y - 5, width: (BX1 - BX0) * bar, height: 10, borderRadius: 5, background: alpha(C.text, 0.35) }} />
          {bar > 0.5 && even < 0.6 ? (
            <>
              <div style={{ position: "absolute", left: BX0, top: BAR_Y + 34, transform: "translate(-50%, -50%)", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 22, color: C.dim }}>0</div>
              <div style={{ position: "absolute", left: BX1, top: BAR_Y + 34, transform: "translate(-50%, -50%)", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 22, color: C.dim, whiteSpace: "nowrap" }}>60 MIN</div>
            </>
          ) : null}
          {even > 0.5
            ? EVEN.slice(0, 5).map((m) => <div key={m} style={{ position: "absolute", left: bmx(m) - 2, top: BAR_Y - 14, width: 4, height: 28, background: SHORT, opacity: ease(even, [0.5, 1], [0, 1]) }} />)
            : null}
          {even > 0.6
            ? EVEN.map((m, i) => (
                <div key={`l${m}`} style={{ position: "absolute", left: bmx(m - 5), top: BAR_Y + 34, transform: "translate(-50%, -50%)", opacity: spr(SIXTY + 14 + i * 3, theme.spring.pop), fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 26, color: SHORT }}>10</div>
              ))
            : null}
          {RANDOM.map((m, i) => {
            const p = spr(SIX - 6 + i * 3, theme.spring.bouncy);
            if (p <= 0.001) return null;
            const x = bmx(interpolate(even, [0, 1], [m, EVEN[i]]));
            return (
              <div key={i} style={{ position: "absolute", left: x, top: BAR_Y - 8, transform: `translate(-50%, -100%) scale(${p})`, transformOrigin: "bottom center" }}>
                <Bus w={70} color={BUS_C[i]} />
              </div>
            );
          })}
          <Pop at={SIX - 2} x={540} y={720} from="up" dist={12} cfg={theme.spring.bouncy}>
            <Pill label="6 BUSES AN HOUR (AVERAGE)" color={RATE} size={28} glow={0.4} />
          </Pop>
          <Question at={Q} keyAt={WAITW} CD0={CD0} line1="Average wait" line2="BETWEEN BUSES?" color={C.yellow} size={76} />
          <Countdown CD0={CD0} />
          <Reveal ANS={ANS} label="10 MINUTES" size={70} />
          <Options opts={OPTS} answer={1} QEND={QEND} CD0={CD0} ANS={ANS} WHY={WHY} />
          <Pop at={TEN - 8} x={540} y={1110} from="up" dist={24} cfg={theme.spring.bouncy}>
            <Tag color={SHORT} size={34}>
              60 MIN ÷ 6 BUSES = 10 MIN
            </Tag>
          </Pop>
        </AbsoluteFill>
      ) : null}
      {frame >= TZ - 6 && teaseOut < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - teaseOut }}>
          <Teaser
            at={TZ}
            titleAt={Math.min(WHICH, TZ + 6)}
            label="NEXT: A CHEAT SHEET"
            title="WHICH ONE?"
            color={SHORT}
            icon={
              <div style={{ display: "flex", gap: 26, alignItems: "flex-end" }}>
                <FlatIcon color={GAP} w={150} h={96} />
                <BarsIcon color={RATE} vals={[1, 4, 6, 4, 1]} w={150} h={96} />
                <CurveIcon color={SHORT} f={(u) => Math.exp(-((u - 0.5) ** 2) / 0.03)} w={150} h={96} />
                <CurveIcon color={LONG} f={(u) => Math.exp(-u * 4)} w={150} h={96} />
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
          next="WHICH DISTRIBUTION?"
          chips={[
            { l: "Waiting time", c: GAP },
            { l: "Next event", c: LONG },
            { l: "Steady rate", c: RATE },
            { l: "Mean = 1 / rate", c: SHORT },
          ]}
        />
      ) : null}
    </AbsoluteFill>
  );
};
