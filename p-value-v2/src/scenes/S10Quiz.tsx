// SCENE 10 — QUIZ + TEASER + CTA. A test gives p = 0.30: statistically significant? Options YES / NO / ALMOST /
// CAN'T SAY → NO (0.30 is above 0.05: data like this could easily happen by luck). Teaser: Type 1 & 2 errors.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Cta } from "../components/Cta";
import { exitP, Mark, Pop, shake, useSpr } from "../components/Motion";
import { Tag } from "../components/Nodes";
import { Countdown, Options, Question, QuizBadge, type QuizOpt, quizClock, Reveal } from "../components/Quiz";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { EXT, LINE, NULLC, PPill, PV } from "./S1Hook";

const C = theme.colors;
const OPTS: QuizOpt[] = [
  { v: "YES", color: C.cyan, why: "too high" },
  { v: "NO", color: C.green, why: "" },
  { v: "ALMOST", color: C.violet, why: "not close" },
  { v: "CAN'T SAY", color: C.orange, why: "we can" },
];

const ErrorGrid: React.FC<{ cell: number; at: number }> = ({ cell, at }) => {
  const cells = [
    { t: "1", c: EXT },
    { t: "", c: LINE },
    { t: "", c: LINE },
    { t: "2", c: PV },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(2, ${cell}px)`, gap: 14 }}>
      {cells.map((k, i) => (
        <div key={i} style={{ width: cell, height: cell, borderRadius: 22, boxSizing: "border-box", background: alpha(k.c, k.t ? 0.3 : 0.12), border: `4px solid ${k.t ? k.c : alpha(k.c, 0.6)}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          {k.t ? (
            <>
              <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: cell * 0.12, letterSpacing: "0.14em", color: k.c }}>TYPE</div>
              <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: cell * 0.42, lineHeight: 1, color: C.text }}>{k.t}</div>
            </>
          ) : (
            <Mark kind="check" at={at + i * 3} size={cell * 0.4} color={LINE} width={9} />
          )}
        </div>
      ))}
    </div>
  );
};

export const S10Quiz: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s10");
  const QQ = s.sent(0).from;
  const CASE = s.sent(1).from;
  const Q = s.sent(2).from;
  const SIG = s.cueS(2, "significant?");
  const QEND = s.sent(2).to;
  const { CD0 } = quizClock(QEND, s.fps);
  const ANS = s.sent(3).from;
  const WHY = s.sent(4).from;
  const LUCK = s.cueS(4, "luck.");
  const TZ = s.sent(5).from;
  const T1 = s.cueS(5, "Type");
  const FOL = s.sent(6).from;
  const FOLW = s.cueS(6, "Follow");
  const DATAW = s.cueS(6, "data");
  const SIMPLE = s.cueS(6, "simple!");
  const sh = shake(frame, ANS, 12, 10);
  const clear = exitP(frame, TZ - 10, 10);
  const teaseOut = exitP(frame, FOL - 10, 10);
  const cs = spr(CASE - 4, theme.spring.bouncy);
  const lab = spr(TZ - 4, theme.spring.smooth);
  const ttl = spr(T1 - 2, theme.spring.bouncy);
  const ico = spr(T1 + 8, theme.spring.pop);
  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      {clear < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - clear, transform: `scale(${1 - clear * 0.06})` }}>
          <QuizBadge at={QQ} />
          {cs > 0.001 ? (
            <div style={{ position: "absolute", left: 540, top: 600, transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, cs), [0, 1], [0.5, 1])})`, display: "flex", alignItems: "center", gap: 28, whiteSpace: "nowrap" }}>
              <PPill v="0.30" size={54} />
              <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 26, letterSpacing: "0.12em", color: C.dim }}>
                LINE: <span style={{ color: LINE }}>0.05</span>
              </div>
            </div>
          ) : null}
          <Question at={Q} keyAt={SIG} CD0={CD0} line1="Statistically significant?" line2="YES OR NO?" color={C.yellow} />
          <Countdown CD0={CD0} />
          <Reveal ANS={ANS} label="NO!" size={70} />
          <Options opts={OPTS} answer={1} QEND={QEND} CD0={CD0} ANS={ANS} WHY={WHY} />
          <Pop at={LUCK - 8} x={540} y={1110} from="up" dist={24} cfg={theme.spring.bouncy}>
            <Tag color={NULLC} size={28}>
              0.30 IS ABOVE 0.05: COULD EASILY BE LUCK
            </Tag>
          </Pop>
        </AbsoluteFill>
      ) : null}
      {frame >= TZ - 6 && teaseOut < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - teaseOut }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 520, textAlign: "center", opacity: Math.min(1, lab * 2), fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 30, letterSpacing: "0.26em", color: C.dim }}>NEXT: WHEN TESTS GET IT WRONG</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 640, textAlign: "center", transform: `translateY(-50%) scale(${interpolate(ttl, [0, 1], [0.6, 1])})`, opacity: Math.min(1, ttl * 2), fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 76, color: EXT, textShadow: glowText(EXT, 0.6), whiteSpace: "nowrap" }}>TYPE 1 &amp; 2 ERRORS</div>
          <div style={{ position: "absolute", left: 540, top: 900, transform: `translate(-50%, -50%) scale(${ico})` }}>
            <ErrorGrid cell={150} at={T1 + 10} />
          </div>
        </AbsoluteFill>
      ) : null}
      {frame >= FOL - 6 ? (
        <Cta
          FOL={FOL}
          FOLW={FOLW}
          DATAW={DATAW}
          SIMPLE={SIMPLE}
          next="TYPE 1 & 2 ERRORS"
          chips={[
            { l: "If null true", c: NULLC },
            { l: "Small = surprising", c: EXT },
            { l: "0.05 line", c: LINE },
            { l: "Not P(null)", c: C.red },
          ]}
        />
      ) : null}
    </AbsoluteFill>
  );
};
