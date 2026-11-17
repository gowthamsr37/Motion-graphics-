// SCENE 9 — QUIZ + TEASER + CTA. Another dice scores 20 (same 5 df): fair or suspicious? Options FAIR / SUSPICIOUS /
// CAN'T TELL / PERFECT → suspicious (20 is far past 11.1, deep in the tail: about 1 in 800 by luck). Teaser: cheat sheet.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CRIT95 } from "../components/Chi";
import { Cta } from "../components/Cta";
import { FnCurve, type Geo, gx, Marker } from "../components/Curve";
import { BarsIcon, CurveIcon, FlatIcon, Teaser } from "../components/Explain";
import { ease, exitP, Pop, shake, useSpr } from "../components/Motion";
import { Tag } from "../components/Nodes";
import { Countdown, Options, Question, QuizBadge, type QuizOpt, quizClock, Reveal } from "../components/Quiz";
import { theme } from "../theme";
import { useScene } from "../timing";
import { chi5 } from "./S6Verdict";
import { EXP, FAIR, GAP, OBSC } from "./S1Hook";

const C = theme.colors;
const OPTS: QuizOpt[] = [
  { v: "FAIR", color: C.cyan, why: "20 > 11.1" },
  { v: "SUSPICIOUS", color: C.green, why: "" },
  { v: "CAN'T TELL", color: C.violet, why: "we can" },
  { v: "PERFECT", color: C.orange, why: "never" },
];
const G: Geo = { x0: 170, x1: 910, vmin: 0, vmax: 25, base: 720, h: 230 };

export const S9Quiz: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s9");
  const QQ = s.sent(0).from;
  const SCORES = s.sent(1).from;
  const TWENTY = s.cueS(1, "20,");
  const Q = s.sent(2).from;
  const SUS = s.cueS(2, "suspicious?");
  const QEND = s.sent(2).to;
  const { CD0 } = quizClock(QEND, s.fps);
  const ANS = s.sent(3).from;
  const WHY = s.sent(4).from;
  const LUCK = s.cueS(4, "luck.");
  const TZ = s.sent(5).from;
  const CHEAT = s.cueS(5, "cheat");
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
          <FnCurve g={G} f={chi5} fmax={0.16} p={ease(frame, [SCORES - 6, SCORES + 14], [0, 1])} color={OBSC} fill={0.1} bands={[{ a: CRIT95, b: 25, color: GAP, p: ease(frame, [SCORES + 6, SCORES + 20], [0, 1]), opacity: 0.6 }]} />
          {frame >= SCORES - 6 ? <div style={{ position: "absolute", left: G.x0 - 10, top: G.base + 1, width: G.x1 - G.x0 + 20, height: 4, background: "rgba(243,247,255,0.4)", opacity: ease(frame, [SCORES - 6, SCORES + 4], [0, 1]) }} /> : null}
          {[0, 11.1, 20].map((v) => (
            <div key={v} style={{ position: "absolute", left: gx(G, v), top: G.base + 26, transform: "translate(-50%, -50%)", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 22, color: v === 20 ? GAP : C.dim, opacity: ease(frame, [SCORES, SCORES + 10], [0, 1]) }}>{v}</div>
          ))}
          <Marker x={gx(G, 20)} base={G.base} top={G.base - 170} p={spr(TWENTY - 4, theme.spring.bouncy)} color={GAP} label="SCORE 20" size={28} />
          <Question at={Q} keyAt={SUS} CD0={CD0} line1="Fair, or..." line2="SUSPICIOUS?" color={C.yellow} />
          <Countdown CD0={CD0} />
          <Reveal ANS={ANS} label="SUSPICIOUS" size={70} />
          <Options opts={OPTS} answer={1} QEND={QEND} CD0={CD0} ANS={ANS} WHY={WHY} />
          <Pop at={LUCK - 10} x={540} y={1110} from="up" dist={24} cfg={theme.spring.bouncy}>
            <Tag color={GAP} size={32}>
              DEEP IN THE TAIL: ABOUT 1 IN 800 BY LUCK
            </Tag>
          </Pop>
        </AbsoluteFill>
      ) : null}
      {frame >= TZ - 6 && teaseOut < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - teaseOut }}>
          <Teaser
            at={TZ}
            titleAt={Math.min(CHEAT, TZ + 6)}
            label="NEXT: EVERY DISTRIBUTION"
            title="THE CHEAT SHEET"
            color={FAIR}
            icon={
              <div style={{ display: "flex", gap: 26, alignItems: "flex-end" }}>
                <FlatIcon color={OBSC} w={150} h={96} />
                <BarsIcon color={EXP} vals={[1, 4, 6, 4, 1]} w={150} h={96} />
                <CurveIcon color={FAIR} f={(u) => Math.exp(-((u - 0.5) ** 2) / 0.03)} w={150} h={96} />
                <CurveIcon color={GAP} f={(u) => Math.exp(-u * 4)} w={150} h={96} />
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
          next="THE DISTRIBUTION CHEAT SHEET"
          chips={[
            { l: "Seen vs expected", c: OBSC },
            { l: "Gap² ÷ expected", c: GAP },
            { l: "df = categories − 1", c: EXP },
            { l: "Tail = not luck", c: FAIR },
          ]}
        />
      ) : null}
    </AbsoluteFill>
  );
};
