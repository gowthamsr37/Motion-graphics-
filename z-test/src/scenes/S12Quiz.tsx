// SCENE 12 — QUIZ + TEASER + CTA. A two-tailed z-test gives z = 1.5: reject H0 at 5%? A YES · B NO · C ALMOST ·
// D CAN'T SAY → B NO (inside ±1.96, p ≈ 0.13). After the reveal the curve shows 1.5 inside the cut-offs. Teaser: t-test.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FnCurve, gx, Marker, ValueAxis } from "../components/Curve";
import { Cta } from "../components/Cta";
import { Teaser } from "../components/Explain";
import { ease, exitP, Pop, shake, useSpr } from "../components/Motion";
import { Countdown, Options, PollHint, Question, QuizBadge, type QuizOpt, quizClock, Reveal } from "../components/Quiz";
import { TestViz } from "../components/Tests";
import { CLAIM, MEAN, SE, TAIL, zf, ZFMAX, zGeo } from "../components/ZKit";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const OPTS: QuizOpt[] = [
  { v: "YES", color: C.cyan, why: "too small" },
  { v: "NO", color: C.green, why: "" },
  { v: "ALMOST", color: C.violet, why: "no almost" },
  { v: "CAN'T SAY", color: C.orange, why: "we can" },
];
const G = zGeo(1300, 150, 220, 860);

export const S12Quiz: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s12");
  const QQ = s.sent(0).from;
  const GIV = s.sent(1).from;
  const Q = s.sent(2).from;
  const KEY = s.cueS(2, "H0?");
  const QEND = s.sent(2).to;
  const { CD0 } = quizClock(QEND, s.fps);
  const ANS = s.sent(3).from;
  const WHY = s.sent(4).from;
  const TZ = s.sent(5).from;
  const FOL = s.sent(6).from;
  const sh = shake(frame, ANS, 12, 10);
  const clear = exitP(frame, TZ - 10, 10);
  const teaseOut = exitP(frame, FOL - 10, 10);
  const zp = spr(GIV + 6, theme.spring.pop);
  const curve = ease(frame, [WHY - 4, WHY + 20], [0, 1], theme.ease.inOut);
  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      {clear < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - clear, transform: `scale(${1 - clear * 0.06})` }}>
          <QuizBadge at={QQ} />
          {zp > 0.001 ? (
            <div style={{ position: "absolute", left: 540, top: 470, transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, zp), [0, 1], [0.5, 1])})`, opacity: Math.min(1, zp * 2), display: "flex", alignItems: "center", gap: 24, whiteSpace: "nowrap" }}>
              <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.16em", color: C.dim }}>TWO-TAILED</div>
              <div style={{ padding: "12px 34px", borderRadius: 999, background: alpha(MEAN, 0.2), border: `3px solid ${MEAN}`, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 56, color: C.text }}>
                <span style={{ fontFamily: theme.fonts.display, fontStyle: "italic" }}>z</span> = <span style={{ color: MEAN, textShadow: glowText(MEAN, 0.5) }}>1.5</span>
              </div>
              <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.16em", color: C.dim }}>ALPHA 5%</div>
            </div>
          ) : null}
          <Question at={Q} keyAt={KEY} CD0={CD0} line1="At 5%, do we reject" line2="H0?" color={C.yellow} />
          <Countdown CD0={CD0} />
          <Reveal ANS={ANS} label="NO!" size={64} />
          <Options opts={OPTS} answer={1} QEND={QEND} CD0={CD0} ANS={ANS} WHY={WHY} />
          <PollHint at={Q + 6} out={ANS - 6} />
          {frame >= WHY - 6 ? (
            <>
              <FnCurve g={G} f={zf} fmax={ZFMAX} p={curve} color={CLAIM} fill={0.1} bands={[{ a: -3.6, b: -1.96, color: TAIL, opacity: 0.6, p: curve }, { a: 1.96, b: 3.6, color: TAIL, opacity: 0.6, p: curve }]} />
              <ValueAxis g={G} p={curve} ticks={[{ v: -1.96, label: "−1.96", color: TAIL }, { v: 1.96, label: "+1.96", color: TAIL }]} />
              <Marker x={gx(G, 1.5)} base={G.base} top={G.base - 170} p={spr(WHY + 14, theme.spring.bouncy)} color={MEAN} label="1.5: INSIDE" size={24} />
              <Pop at={s.cueS(4, "0.13.") - 4} x={540} y={1060} from="up" dist={12}>
                <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 38, color: C.text, whiteSpace: "nowrap" }}>
                  p = <span style={{ fontFamily: theme.fonts.mono, color: SE }}>0.13</span> &gt; 0.05: <span style={{ color: SE }}>COULD BE CHANCE</span>
                </div>
              </Pop>
            </>
          ) : null}
        </AbsoluteFill>
      ) : null}
      {frame >= TZ - 6 && teaseOut < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - teaseOut }}>
          <Teaser
            at={TZ}
            titleAt={s.cueS(5, "t-test.")}
            label="NEXT: WHAT IF SIGMA IS UNKNOWN?"
            title="THE t-TEST"
            color={C.violet}
            icon={
              <div style={{ width: 520 }}>
                <TestViz kind="t1" w={520} h={186} color={C.violet} p={interpolate(frame, [TZ, TZ + 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} tiny />
              </div>
            }
          />
        </AbsoluteFill>
      ) : null}
      {frame >= FOL - 6 ? (
        <Cta
          FOL={FOL}
          FOLW={s.cueS(6, "Follow")}
          DATAW={s.cueS(6, "data")}
          SIMPLE={s.cueS(6, "simple!")}
          next="THE t-TEST"
          chips={[
            { l: "z = gap ÷ SE", c: SE },
            { l: "Z table: left area", c: CLAIM },
            { l: "±1.96 at 5%", c: TAIL },
            { l: "Two-tailed: × 2", c: MEAN },
          ]}
        />
      ) : null}
    </AbsoluteFill>
  );
};
