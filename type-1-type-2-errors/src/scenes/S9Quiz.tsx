// SCENE 9 — QUIZ + TEASER + CTA. A spam filter sends a real email from your boss to the spam folder: which error?
// Options TYPE 2 / TYPE 1 / NONE / BOTH → TYPE 1 (the null "this email is normal" was true, and the filter
// rejected it: a false alarm). Teaser: A/B testing.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Cta } from "../components/Cta";
import { NULLC, OKC, T1C, T2C } from "../components/Errors";
import { Teaser } from "../components/Explain";
import { Arrow } from "../components/Icons";
import { exitP, Pop, shake, useSpr } from "../components/Motion";
import { Tag } from "../components/Nodes";
import { Countdown, Options, Question, QuizBadge, type QuizOpt, quizClock, Reveal } from "../components/Quiz";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const OPTS: QuizOpt[] = [
  { v: "TYPE 2", color: C.cyan, why: "no miss" },
  { v: "TYPE 1", color: C.green, why: "" },
  { v: "NONE", color: C.violet, why: "it erred" },
  { v: "BOTH", color: C.orange, why: "just one" },
];

const Envelope: React.FC<{ w: number; color: string }> = ({ w, color }) => (
  <svg width={w} height={w * 0.7} viewBox="0 0 100 70" style={{ display: "block", overflow: "visible" }}>
    <rect x={3} y={3} width={94} height={64} rx={8} fill={alpha(color, 0.22)} stroke={color} strokeWidth={4} />
    <path d="M5 8 L50 40 L95 8" fill="none" stroke={color} strokeWidth={4} strokeLinejoin="round" />
  </svg>
);

export const AB: React.FC<{ size: number }> = ({ size }) => (
  <div style={{ display: "flex", alignItems: "center", gap: size * 0.25 }}>
    {[
      { t: "A", c: C.cyan },
      { t: "B", c: C.orange },
    ].map((k, i) => (
      <React.Fragment key={k.t}>
        {i === 1 ? <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: size * 0.32, color: C.dim }}>VS</div> : null}
        <div style={{ width: size, height: size * 0.62, borderRadius: size * 0.18, background: alpha(k.c, 0.3), border: `5px solid ${k.c}`, boxShadow: `0 0 24px ${alpha(k.c, 0.45)}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: size * 0.4, color: C.text }}>{k.t}</div>
      </React.Fragment>
    ))}
  </div>
);

export const S9Quiz: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s9");
  const QQ = s.sent(0).from;
  const MAIL = s.sent(1).from;
  const SPAM = s.cueS(1, "spam", 1);
  const Q = s.sent(2).from;
  const TYPEW = s.cueS(2, "type");
  const QEND = s.sent(2).to;
  const { CD0 } = quizClock(QEND, s.fps);
  const ANS = s.sent(3).from;
  const WHY = s.sent(4).from;
  const NORMAL = s.cueS(4, "normal,");
  const TZ = s.sent(5).from;
  const ABW = s.cueS(5, "A/B");
  const FOL = s.sent(6).from;
  const FOLW = s.cueS(6, "Follow");
  const DATAW = s.cueS(6, "data");
  const SIMPLE = s.cueS(6, "simple!");
  const sh = shake(frame, ANS, 12, 10);
  const clear = exitP(frame, TZ - 10, 10);
  const teaseOut = exitP(frame, FOL - 10, 10);
  const mail = spr(MAIL - 4, theme.spring.bouncy);
  const fly = interpolate(frame, [SPAM - 14, SPAM + 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: theme.ease.inOut });
  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      {clear < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - clear, transform: `scale(${1 - clear * 0.06})` }}>
          <QuizBadge at={QQ} />
          {mail > 0.001 ? (
            <div style={{ position: "absolute", left: 540, top: 600, transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, mail), [0, 1], [0.5, 1])})`, display: "flex", alignItems: "center", gap: 26, whiteSpace: "nowrap" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ transform: `translateX(${fly * 40}px)` }}>
                  <Envelope w={130} color={NULLC} />
                </div>
                <div style={{ marginTop: 8, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.12em", color: C.text }}>FROM: YOUR BOSS</div>
              </div>
              <div style={{ opacity: fly }}>
                <Arrow size={48} color={T1C} />
              </div>
              <div style={{ opacity: fly, padding: "14px 26px", borderRadius: 18, border: `4px solid ${T1C}`, background: alpha(T1C, 0.18), fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text }}>SPAM</div>
            </div>
          ) : null}
          <Question at={Q} keyAt={TYPEW} CD0={CD0} line1="Which type of error?" line2="WHICH ONE?" color={C.yellow} />
          <Countdown CD0={CD0} />
          <Reveal ANS={ANS} label="TYPE 1: FALSE ALARM" size={52} />
          <Options opts={OPTS} answer={1} QEND={QEND} CD0={CD0} ANS={ANS} WHY={WHY} />
          <Pop at={NORMAL - 8} x={540} y={1110} from="up" dist={24} cfg={theme.spring.bouncy}>
            <Tag color={NULLC} size={28}>
              NULL: THE EMAIL IS NORMAL
            </Tag>
          </Pop>
        </AbsoluteFill>
      ) : null}
      {frame >= TZ - 6 && teaseOut < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - teaseOut }}>
          <Teaser at={TZ} titleAt={Math.min(ABW, TZ + 40)} label="NEXT: PUTTING IT ALL TOGETHER" title="A/B TESTING" color={OKC} icon={<AB size={200} />} />
        </AbsoluteFill>
      ) : null}
      {frame >= FOL - 6 ? (
        <Cta
          FOL={FOL}
          FOLW={FOLW}
          DATAW={DATAW}
          SIMPLE={SIMPLE}
          next="A/B TESTING"
          chips={[
            { l: "Type 1: alarm", c: T1C },
            { l: "Type 2: miss", c: T2C },
            { l: "Alpha 5%", c: C.cyan },
            { l: "More data", c: OKC },
          ]}
        />
      ) : null}
    </AbsoluteFill>
  );
};
