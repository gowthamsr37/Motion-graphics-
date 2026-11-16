// SCENE 9 — QUIZ + TEASER + CTA. To find students' average height you measure only the basketball team: what's the
// problem? → BIASED (they're taller than most students, so the average comes out too high). Then a teaser for the
// Central Limit Theorem (a histogram of sample means grows into a "?" shape) and the follow end card.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Cta } from "../components/Cta";
import { Person } from "../components/Icons";
import { ease, exitP, Pop, shake, useSpr } from "../components/Motion";
import { Tag } from "../components/Nodes";
import { Countdown, Options, Question, QuizBadge, type QuizOpt, quizClock, Reveal } from "../components/Quiz";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { BIAS, POP, SAMP, TRUTH } from "./S1Hook";

const C = theme.colors;
const OPTS: QuizOpt[] = [
  { v: "Too random", color: C.cyan, why: "it isn't" },
  { v: "Biased sample", color: C.green, why: "" },
  { v: "Use n - 1", color: C.violet, why: "unrelated" },
  { v: "No problem", color: C.orange, why: "there is" },
];
const STUDENTS = [86, 92, 80, 96, 88, 84, 90, 82];
const TEAM = [118, 122, 116];
const HIST = [1, 3, 7, 12, 16, 12, 7, 3, 1];

export const S9Quiz: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s9");
  const QQ = s.sent(0).from;
  const COLLEGE = s.cueS(1, "college,");
  const BBALL = s.cueS(1, "basketball");
  const Q = s.sent(2).from;
  const PROB = s.cueS(2, "problem?");
  const QEND = s.sent(2).to;
  const { CD0 } = quizClock(QEND, s.fps);
  const ANS = s.sent(3).from;
  const WHY = s.sent(4).from;
  const TALLER = s.cueS(4, "taller");
  const HIGH = s.cueS(4, "high.");
  const TZ = s.sent(5).from;
  const SHAPE = s.cueS(5, "shape");
  const FOL = s.sent(6).from;
  const FOLW = s.cueS(6, "Follow");
  const DATAW = s.cueS(6, "data");
  const SIMPLE = s.cueS(6, "simple!");
  const sh = shake(frame, ANS, 12, 10);
  const clear = exitP(frame, TZ - 10, 10);
  const teaseOut = exitP(frame, FOL - 10, 10);
  const team = spr(BBALL - 4, theme.spring.bouncy);
  const glow = ease(frame, [TALLER - 4, TALLER + 6], [0, 1]);

  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      {clear < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - clear, transform: `scale(${1 - clear * 0.06})` }}>
          <QuizBadge at={QQ} />
          {/* the prop: students, and the basketball team */}
          {STUDENTS.map((h, i) => {
            const p = spr(COLLEGE - 8 + i * 2, theme.spring.bouncy);
            if (p <= 0.001) return null;
            return (
              <div key={i} style={{ position: "absolute", left: 150 + i * 66, top: 690, transform: `translate(-50%, -100%) scale(${p})`, transformOrigin: "bottom center", opacity: 1 - team * 0.45 * (1 - glow * 0) }}>
                <Person height={h * 1.3} shirt={POP} />
              </div>
            );
          })}
          {TEAM.map((h, i) => (
            <div key={`t${i}`} style={{ position: "absolute", left: 770 + i * 78, top: 690, transform: `translate(-50%, -100%) scale(${team})`, transformOrigin: "bottom center", filter: glow > 0.5 ? `drop-shadow(0 0 14px ${BIAS})` : undefined }}>
              <Person height={h * 1.3} shirt={BIAS} />
            </div>
          ))}
          <div style={{ position: "absolute", left: 100, top: 694, width: 880, height: 4, borderRadius: 2, background: alpha(C.text, 0.35), opacity: ease(frame, [COLLEGE - 8, COLLEGE], [0, 1]) }} />
          <Pop at={COLLEGE - 4} x={380} y={730} from="up" dist={10}>
            <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.16em", color: POP, whiteSpace: "nowrap" }}>COLLEGE STUDENTS</div>
          </Pop>
          <Pop at={BBALL} x={848} y={730} from="up" dist={10}>
            <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.16em", color: BIAS, whiteSpace: "nowrap" }}>BASKETBALL TEAM</div>
          </Pop>

          <Question at={Q} keyAt={PROB} CD0={CD0} line1="What's the" line2="PROBLEM?" color={C.yellow} />
          <Countdown CD0={CD0} />
          <Reveal ANS={ANS} label="BIASED!" />
          <Options opts={OPTS} answer={1} QEND={QEND} CD0={CD0} ANS={ANS} WHY={WHY} fontSize={32} />
          <Pop at={HIGH - 6} x={540} y={1110} from="up" dist={24} cfg={theme.spring.bouncy}>
            <Tag color={BIAS} size={32}>
              TALLER GROUP = AVERAGE TOO HIGH
            </Tag>
          </Pop>
        </AbsoluteFill>
      ) : null}

      {/* teaser: the shape of sample means */}
      {frame >= TZ - 6 && teaseOut < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - teaseOut }}>
          <Pop at={TZ - 4} x={540} y={420} from="up" dist={14}>
            <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 28, letterSpacing: "0.24em", color: C.dim, whiteSpace: "nowrap" }}>NEXT</div>
          </Pop>
          <Pop at={SHAPE - 6} x={540} y={530} from="scale" scaleFrom={0.5} cfg={theme.spring.bouncy}>
            <div style={{ textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1.05, whiteSpace: "nowrap" }}>
              <div style={{ fontSize: 56, color: C.text }}>WHAT SHAPE DO</div>
              <div style={{ fontSize: 72, color: SAMP, textShadow: glowText(SAMP, 0.6) }}>SAMPLE MEANS MAKE?</div>
            </div>
          </Pop>
          {HIST.map((h, i) => {
            const p = ease(frame, [TZ + 4 + Math.abs(i - 4) * 4, TZ + 20 + Math.abs(i - 4) * 4], [0, 1], theme.ease.out);
            return <div key={i} style={{ position: "absolute", left: 540 + (i - 4) * 84 - 36, top: 1180 - h * 26 * p, width: 72, height: h * 26 * p, borderRadius: "10px 10px 3px 3px", background: alpha(SAMP, 0.45), border: `3px solid ${SAMP}` }} />;
          })}
          <div style={{ position: "absolute", left: 140, top: 1182, width: 800, height: 4, borderRadius: 2, background: alpha(C.text, 0.4) }} />
          <Pop at={TZ + 30} x={860} y={820} from="scale" cfg={theme.spring.pop}>
            <div style={{ width: 90, height: 90, borderRadius: 45, background: C.yellow, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 60, color: C.ink, boxShadow: `0 0 30px ${alpha(C.yellow, 0.6)}` }}>?</div>
          </Pop>
        </AbsoluteFill>
      ) : null}

      {frame >= FOL - 6 ? (
        <Cta
          FOL={FOL}
          FOLW={FOLW}
          DATAW={DATAW}
          SIMPLE={SIMPLE}
          next="CENTRAL LIMIT THEOREM"
          chips={[
            { l: "Population", c: POP },
            { l: "Sample", c: SAMP },
            { l: "Random", c: TRUTH },
            { l: "n - 1", c: BIAS },
          ]}
        />
      ) : null}
    </AbsoluteFill>
  );
};

