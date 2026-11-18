// SCENE 11 — QUIZ + TEASER + CTA. A school claims its new teaching method raises test scores: what is the null
// hypothesis? Options SCORES UP / NO CHANGE / SCORES DOWN / CAN'T SAY → NO CHANGE (the null always says: no effect).
// Teaser: the p-value.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { type BarGeo, HeadsBars } from "../components/Coins";
import { Cta } from "../components/Cta";
import { exitP, Pop, shake, useSpr } from "../components/Motion";
import { Tag } from "../components/Nodes";
import { Countdown, Options, Question, QuizBadge, type QuizOpt, quizClock, Reveal } from "../components/Quiz";
import { glowText, theme } from "../theme";
import { useScene } from "../timing";
import { ALT, DATA, LINE, NULLC } from "./S1Hook";
import { GradCap } from "./S4Pairs";

const C = theme.colors;
const OPTS: QuizOpt[] = [
  { v: "SCORES UP", color: C.cyan, why: "that's H1" },
  { v: "NO CHANGE", color: C.green, why: "" },
  { v: "SCORES DOWN", color: C.violet, why: "wrong way" },
  { v: "CAN'T SAY", color: C.orange, why: "we can" },
];
const TB: BarGeo = { x0: 0, x1: 460, base: 220, h: 200 };

export const S11Quiz: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s11");
  const QQ = s.sent(0).from;
  const CLAIM = s.sent(1).from;
  const Q = s.sent(2).from;
  const NULLW = s.cueS(2, "null");
  const QEND = s.sent(2).to;
  const { CD0 } = quizClock(QEND, s.fps);
  const ANS = s.sent(3).from;
  const WHY = s.sent(4).from;
  const EFF = s.cueS(4, "effect,");
  const TZ = s.sent(5).from;
  const PV = s.cueS(5, "data?");
  const FOL = s.sent(6).from;
  const FOLW = s.cueS(6, "Follow");
  const DATAW = s.cueS(6, "data");
  const SIMPLE = s.cueS(6, "simple!");
  const sh = shake(frame, ANS, 12, 10);
  const clear = exitP(frame, TZ - 10, 10);
  const teaseOut = exitP(frame, FOL - 10, 10);
  const cl = spr(CLAIM - 4, theme.spring.bouncy);
  const lab = spr(TZ - 4, theme.spring.smooth);
  const ttl = spr(PV - 2, theme.spring.bouncy);
  const ico = spr(PV + 8, theme.spring.pop);
  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      {clear < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - clear, transform: `scale(${1 - clear * 0.06})` }}>
          <QuizBadge at={QQ} />
          {cl > 0.001 ? (
            <div style={{ position: "absolute", left: 540, top: 600, transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, cl), [0, 1], [0.5, 1])})`, display: "flex", alignItems: "center", gap: 26, whiteSpace: "nowrap" }}>
              <GradCap size={110} color={DATA} />
              <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 38, color: C.text, lineHeight: 1.15 }}>
                CLAIM: NEW METHOD
                <br />
                <span style={{ color: ALT }}>RAISES SCORES</span>
              </div>
            </div>
          ) : null}
          <Question at={Q} keyAt={NULLW} CD0={CD0} line1="The null hypothesis is..." line2="WHICH ONE?" color={C.yellow} />
          <Countdown CD0={CD0} />
          <Reveal ANS={ANS} label="NO CHANGE" size={60} />
          <Options opts={OPTS} answer={1} QEND={QEND} CD0={CD0} ANS={ANS} WHY={WHY} />
          <Pop at={EFF - 8} x={540} y={1110} from="up" dist={24} cfg={theme.spring.bouncy}>
            <Tag color={NULLC} size={30}>
              THE NULL ALWAYS SAYS: NO EFFECT
            </Tag>
          </Pop>
        </AbsoluteFill>
      ) : null}
      {frame >= TZ - 6 && teaseOut < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - teaseOut }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 520, textAlign: "center", opacity: Math.min(1, lab * 2), fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 30, letterSpacing: "0.26em", color: C.dim }}>NEXT: HOW SURPRISING IS THE DATA?</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 640, textAlign: "center", transform: `translateY(-50%) scale(${interpolate(ttl, [0, 1], [0.6, 1])})`, opacity: Math.min(1, ttl * 2), fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 76, color: DATA, textShadow: glowText(DATA, 0.6), whiteSpace: "nowrap" }}>
            THE <span style={{ fontStyle: "italic" }}>p</span>-VALUE
          </div>
          <div style={{ position: "absolute", left: 540, top: 900, transform: `translate(-50%, -50%) scale(${ico})` }}>
            <div style={{ position: "relative", width: 460, height: 240 }}>
              <HeadsBars g={TB} growAt={TZ - 20} hi={{ 9: ALT, 10: ALT }} color={DATA} labels={false} />
            </div>
          </div>
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
            { l: "H0: no effect", c: NULLC },
            { l: "H1: real effect", c: ALT },
            { l: "5% line", c: LINE },
            { l: "Reject or not", c: DATA },
          ]}
        />
      ) : null}
    </AbsoluteFill>
  );
};
