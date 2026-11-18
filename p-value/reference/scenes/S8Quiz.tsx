// SCENE 8 — QUIZ + TEASER + CTA. A company claims its new pill lowers blood pressure: what is the null hypothesis?
// Options PILL WORKS / PILL DOES NOTHING / PILL IS HARMFUL / PEOPLE ARE SICK → the pill does nothing (no effect).
// Teaser: the p-value.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { type BarGeo, HeadsBars } from "../components/Coins";
import { Cta } from "../components/Cta";
import { Teaser } from "../components/Explain";
import { exitP, Pop, shake, useSpr } from "../components/Motion";
import { Tag } from "../components/Nodes";
import { Countdown, Options, Question, QuizBadge, type QuizOpt, quizClock, Reveal } from "../components/Quiz";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";
import { ALT, DATA, LINE, NULLC } from "./S1Hook";

const C = theme.colors;
const OPTS: QuizOpt[] = [
  { v: "PILL WORKS", color: C.cyan, why: "alternative" },
  { v: "PILL DOES NOTHING", color: C.green, why: "" },
  { v: "PILL IS HARMFUL", color: C.violet, why: "not the claim" },
  { v: "PEOPLE ARE SICK", color: C.orange, why: "off topic" },
];
const TB: BarGeo = { x0: 0, x1: 460, base: 220, h: 200 };

const Pill: React.FC<{ w: number }> = ({ w }) => (
  <svg width={w} height={w * 0.42} viewBox="0 0 100 42" style={{ display: "block", overflow: "visible" }}>
    <rect x={3} y={3} width={94} height={36} rx={18} fill={alpha(NULLC, 0.25)} stroke={NULLC} strokeWidth={4} />
    <path d="M50 3 V39" stroke={NULLC} strokeWidth={4} />
    <rect x={50} y={3} width={47} height={36} rx={18} fill={alpha(ALT, 0.45)} />
  </svg>
);

export const S8Quiz: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s8");
  const QQ = s.sent(0).from;
  const CLAIM = s.sent(1).from;
  const Q = s.sent(2).from;
  const NULLW = s.cueS(2, "null");
  const QEND = s.sent(2).to;
  const { CD0 } = quizClock(QEND, s.fps);
  const ANS = s.sent(3).from;
  const WHY = s.sent(4).from;
  const NOEFF = s.cueS(4, "effect.");
  const TZ = s.sent(5).from;
  const PV = s.cueS(5, "p-value.");
  const FOL = s.sent(6).from;
  const FOLW = s.cueS(6, "Follow");
  const DATAW = s.cueS(6, "data");
  const SIMPLE = s.cueS(6, "simple!");
  const sh = shake(frame, ANS, 12, 10);
  const clear = exitP(frame, TZ - 10, 10);
  const teaseOut = exitP(frame, FOL - 10, 10);
  const pill = spr(CLAIM - 4, theme.spring.bouncy);
  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      {clear < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - clear, transform: `scale(${1 - clear * 0.06})` }}>
          <QuizBadge at={QQ} />
          {pill > 0.001 ? (
            <div style={{ position: "absolute", left: 540, top: 600, transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, pill), [0, 1], [0.5, 1])})`, display: "flex", alignItems: "center", gap: 30 }}>
              <Pill w={170} />
              <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text, lineHeight: 1.1 }}>
                CLAIM: <span style={{ color: ALT }}>LOWERS</span>
                <br />
                BLOOD PRESSURE
              </div>
            </div>
          ) : null}
          <Question at={Q} keyAt={NULLW} CD0={CD0} line1="The null hypothesis is..." line2="WHICH ONE?" color={C.yellow} />
          <Countdown CD0={CD0} />
          <Reveal ANS={ANS} label="THE PILL DOES NOTHING" size={52} />
          <Options opts={OPTS} answer={1} QEND={QEND} CD0={CD0} ANS={ANS} WHY={WHY} />
          <Pop at={NOEFF - 8} x={540} y={1110} from="up" dist={24} cfg={theme.spring.bouncy}>
            <Tag color={NULLC} size={32}>
              THE NULL ALWAYS SAYS: NO EFFECT
            </Tag>
          </Pop>
        </AbsoluteFill>
      ) : null}
      {frame >= TZ - 6 && teaseOut < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - teaseOut }}>
          <Teaser
            at={TZ}
            titleAt={Math.min(PV, TZ + 6)}
            label="NEXT: THAT 1% HAS A NAME"
            title="THE p-VALUE"
            color={DATA}
            icon={
              <div style={{ position: "relative", width: 460, height: 240 }}>
                <HeadsBars g={TB} growAt={TZ - 20} hi={{ 9: ALT, 10: ALT }} color={DATA} labels={false} />
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
          next="THE p-VALUE"
          chips={[
            { l: "Null: no effect", c: NULLC },
            { l: "Alternative", c: ALT },
            { l: "How surprising?", c: DATA },
            { l: "5% line", c: LINE },
          ]}
        />
      ) : null}
    </AbsoluteFill>
  );
};
