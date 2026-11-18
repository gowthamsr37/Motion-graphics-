// SCENE 9 — QUIZ + TEASER + CTA. A test gives p = 0.03: statistically significant at the 5% level?
// Options NO / YES / ONLY IF BIG / CAN'T TELL → YES (0.03 < 0.05), but still not a 3% chance that the null is true.
// Teaser: Type 1 and Type 2 errors.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Cta } from "../components/Cta";
import { Teaser } from "../components/Explain";
import { exitP, Mark, Pop, shake, useSpr } from "../components/Motion";
import { Tag } from "../components/Nodes";
import { Countdown, Options, Question, QuizBadge, type QuizOpt, quizClock, Reveal } from "../components/Quiz";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";
import { EXT, LINE, NULLC, PLess, PV } from "./S1Hook";

const C = theme.colors;
const OPTS: QuizOpt[] = [
  { v: "NO", color: C.cyan, why: "0.03 < 0.05" },
  { v: "YES", color: C.green, why: "" },
  { v: "ONLY IF BIG", color: C.violet, why: "not the rule" },
  { v: "CAN'T TELL", color: C.orange, why: "we can" },
];

// 2×2 decision grid: the two error cells (TYPE 1 orange, TYPE 2 violet) and two correct cells (green ticks)
export const ErrorGrid: React.FC<{ cell: number; at: number }> = ({ cell, at }) => {
  const cells = [
    { t: "1", c: EXT },
    { t: "", c: LINE },
    { t: "", c: LINE },
    { t: "2", c: PV },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(2, ${cell}px)`, gap: 14 }}>
      {cells.map((k, i) => (
        <div key={i} style={{ width: cell, height: cell, borderRadius: 22, boxSizing: "border-box", background: alpha(k.c, k.t ? 0.3 : 0.12), border: `4px solid ${k.t ? k.c : alpha(k.c, 0.6)}`, boxShadow: k.t ? `0 0 22px ${alpha(k.c, 0.45)}` : "none", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
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

export const S9Quiz: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s9");
  const QQ = s.sent(0).from;
  const PVAL = s.sent(1).from;
  const Q = s.sent(2).from;
  const SIG = s.cueS(2, "significant,");
  const QEND = s.sent(2).to;
  const { CD0 } = quizClock(QEND, s.fps);
  const ANS = s.sent(3).from;
  const WHY = s.sent(4).from;
  const NULLW = s.cueS(4, "null");
  const TZ = s.sent(5).from;
  const T1 = s.cueS(5, "Type");
  const FOL = s.sent(6).from;
  const FOLW = s.cueS(6, "Follow");
  const DATAW = s.cueS(6, "data");
  const SIMPLE = s.cueS(6, "simple!");
  const sh = shake(frame, ANS, 12, 10);
  const clear = exitP(frame, TZ - 10, 10);
  const teaseOut = exitP(frame, FOL - 10, 10);
  const pv = spr(PVAL - 4, theme.spring.bouncy);
  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      {clear < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - clear, transform: `scale(${1 - clear * 0.06})` }}>
          <QuizBadge at={QQ} />
          {pv > 0.001 ? (
            <div style={{ position: "absolute", left: 540, top: 600, transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, pv), [0, 1], [0.5, 1])})`, display: "flex", alignItems: "center", gap: 30, whiteSpace: "nowrap" }}>
              <div style={{ padding: "10px 30px", borderRadius: 999, background: alpha(PV, 0.2), border: `4px solid ${PV}` }}>
                <PLess v="0.03" size={56} op="=" />
              </div>
              <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 26, letterSpacing: "0.12em", color: C.dim, opacity: Math.min(1, spr(Q - 2, theme.spring.pop) * 2) }}>
                LEVEL: <span style={{ color: LINE }}>5%</span>
              </div>
            </div>
          ) : null}
          <Question at={Q} keyAt={SIG} CD0={CD0} line1="Statistically significant?" line2="WHICH ONE?" color={C.yellow} />
          <Countdown CD0={CD0} />
          <Reveal ANS={ANS} label="YES, SIGNIFICANT" size={56} />
          <Options opts={OPTS} answer={1} QEND={QEND} CD0={CD0} ANS={ANS} WHY={WHY} />
          <Pop at={NULLW - 8} x={540} y={1110} from="up" dist={24} cfg={theme.spring.bouncy}>
            <Tag color={NULLC} size={28}>
              BUT NOT A 3% CHANCE THE NULL IS TRUE
            </Tag>
          </Pop>
        </AbsoluteFill>
      ) : null}
      {frame >= TZ - 6 && teaseOut < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - teaseOut }}>
          <Teaser at={TZ} titleAt={Math.min(T1, TZ + 40)} label="NEXT: WHEN TESTS GET IT WRONG" title="TYPE 1 & 2 ERRORS" color={EXT} icon={<ErrorGrid cell={150} at={T1 + 10} />} />
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
            { l: "Small = rare", c: PV },
            { l: "0.05: a habit", c: LINE },
            { l: "Not P(null)", c: C.red },
          ]}
        />
      ) : null}
    </AbsoluteFill>
  );
};
