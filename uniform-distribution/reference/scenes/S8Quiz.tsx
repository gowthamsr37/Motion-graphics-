// SCENE 8 — QUIZ + TEASER + CTA. Very skewed data; many samples of 50; plot their averages: what shape?
// Options Skewed / Bell curve / Flat / Two peaks → A BELL CURVE (any shape in, a bell out). Then the
// "more distributions" teaser and the follow end card.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Bell, type BellGeo } from "../components/Bell";
import { Cta } from "../components/Cta";
import { Arrow } from "../components/Icons";
import { ease, exitP, Pop, shake, useSpr } from "../components/Motion";
import { Pill, Tag } from "../components/Nodes";
import { Countdown, Options, Question, QuizBadge, type QuizOpt, quizClock, Reveal } from "../components/Quiz";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";
import { AVG, MiniShape, PREC, RAW, SAMP } from "./S1Hook";

const C = theme.colors;
const OPTS: QuizOpt[] = [
  { v: "Skewed", color: C.orange, why: "that's the data" },
  { v: "Bell curve", color: C.green, why: "" },
  { v: "Flat", color: C.cyan, why: "not flat" },
  { v: "Two peaks", color: C.violet, why: "just one" },
];
const GB: BellGeo = { x0: 640, x1: 920, vmin: -3.2, vmax: 3.2, base: 700, peakH: 180, sigmaRef: 1 };

const shapePath = (kind: number) => {
  const W = 300;
  const H = 150;
  const pts: [number, number][] = [];
  for (let i = 0; i <= 60; i++) {
    const u = i / 60;
    const y = kind === 0 ? (u > 0.08 && u < 0.92 ? 0.62 : 0) : kind === 1 ? 0.95 * (Math.exp(-((u - 0.3) ** 2) / 0.012) + Math.exp(-((u - 0.7) ** 2) / 0.012)) : Math.exp(-u * 4.2);
    pts.push([u * W, H - Math.min(1, y) * H * 0.92]);
  }
  return `M0 ${H} ${pts.map(([x, y]) => `L${x.toFixed(1)} ${y.toFixed(1)}`).join(" ")} L${W} ${H} Z`;
};
const SPIKES = [0.18, 0.55, 0.85, 0.85, 0.64, 0.38, 0.19, 0.08];
const TEASE = [
  { c: C.cyan, kind: 0 },
  { c: C.violet, kind: 1 },
  { c: C.orange, kind: 2 },
  { c: C.green, kind: 3 },
];

export const S8Quiz: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s8");
  const QQ = s.sent(0).from;
  const SKEW = s.cueS(1, "skewed.");
  const W50 = s.cueS(1, "50,");
  const Q = s.sent(2).from;
  const SHAPE = s.cueS(2, "shape");
  const QEND = s.sent(2).to;
  const { CD0 } = quizClock(QEND, s.fps);
  const ANS = s.sent(3).from;
  const WHY = s.sent(4).from;
  const WHATEVER = s.cueS(4, "whatever");
  const TZ = s.sent(5).from;
  const FUTURE = s.cueS(5, "future");
  const FOL = s.sent(6).from;
  const FOLW = s.cueS(6, "Follow");
  const DATAW = s.cueS(6, "data");
  const SIMPLE = s.cueS(6, "simple!");
  const sh = shake(frame, ANS, 12, 10);
  const clear = exitP(frame, TZ - 10, 10);
  const teaseOut = exitP(frame, FOL - 10, 10);
  const bell = ease(frame, [WHY - 2, WHY + 18], [0, 1], theme.ease.inOut);

  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      {clear < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - clear, transform: `scale(${1 - clear * 0.06})` }}>
          <QuizBadge at={QQ} />
          {/* the prop: very skewed data, samples of 50 */}
          {frame >= SKEW - 8 ? (
            <>
              <MiniShape kind={0} x={bell > 0.01 ? interpolate(bell, [0, 1], [540, 300]) : 540} y={620} w={300} h={160} color={RAW} p={ease(frame, [SKEW - 6, SKEW + 10], [0, 1])} />
              <Pop at={SKEW - 4} x={bell > 0.01 ? interpolate(bell, [0, 1], [540, 300]) : 540} y={420} from="up" dist={10}>
                <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.18em", color: RAW, whiteSpace: "nowrap" }}>VERY SKEWED DATA</div>
              </Pop>
            </>
          ) : null}
          <Pop at={W50 - 4} out={WHY - 4} x={830} y={520} from="right" dist={20} cfg={theme.spring.bouncy}>
            <Pill label="SAMPLES OF 50" color={SAMP} size={26} glow={0.4} />
          </Pop>
          {bell > 0.01 ? (
            <>
              <div style={{ position: "absolute", left: 470, top: 640, transform: `translate(-50%, -50%) scale(${bell})` }}>
                <Arrow size={56} color={C.text} />
              </div>
              <div style={{ position: "absolute", left: GB.x0 - 6, top: GB.base, width: GB.x1 - GB.x0 + 12, height: 3, background: alpha(C.text, 0.4) }} />
              <Bell g={GB} mu={0} sigma={1} p={bell} color={AVG} fill={0.3} width={5} />
              <div style={{ position: "absolute", left: (GB.x0 + GB.x1) / 2, top: 420, transform: "translate(-50%, -50%)", opacity: bell, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.18em", color: AVG, whiteSpace: "nowrap" }}>THEIR AVERAGES</div>
            </>
          ) : null}

          <Question at={Q} keyAt={SHAPE} CD0={CD0} line1="What shape" line2="WILL YOU SEE?" color={C.yellow} size={78} />
          <Countdown CD0={CD0} />
          <Reveal ANS={ANS} label="A BELL CURVE" size={56} />
          <Options opts={OPTS} answer={1} QEND={QEND} CD0={CD0} ANS={ANS} WHY={WHY} fontSize={34} />
          <Pop at={WHATEVER - 4} x={540} y={1110} from="up" dist={24} cfg={theme.spring.bouncy}>
            <Tag color={AVG} size={32}>
              ANY SHAPE IN, A BELL OUT
            </Tag>
          </Pop>
        </AbsoluteFill>
      ) : null}

      {/* teaser: more distributions */}
      {frame >= TZ - 6 && teaseOut < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - teaseOut, transform: `scale(${1 - teaseOut * 0.05})` }}>
          <Pop at={TZ - 4} x={540} y={400} from="up" dist={16}>
            <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 28, letterSpacing: "0.24em", color: C.dim, whiteSpace: "nowrap" }}>IN FUTURE VIDEOS</div>
          </Pop>
          <Pop at={FUTURE - 2} x={540} y={510} from="scale" scaleFrom={0.5} cfg={theme.spring.bouncy}>
            <div style={{ textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1.02, letterSpacing: "-0.01em" }}>
              <div style={{ fontSize: 60, color: C.text }}>MORE</div>
              <div style={{ fontSize: 80, background: `linear-gradient(90deg, ${C.cyan}, ${C.violet}, ${C.orange})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 20px ${alpha(C.violet, 0.45)})`, whiteSpace: "nowrap" }}>DISTRIBUTIONS</div>
            </div>
          </Pop>
          {TEASE.map((t, i) => {
            const p = spr(FUTURE + 8 + i * 6, theme.spring.bouncy);
            if (p <= 0.001) return null;
            const x = i % 2 === 0 ? 320 : 760;
            const y = i < 2 ? 800 : 1080;
            const bob = Math.sin(frame / 14 + i * 1.7) * 4;
            return (
              <div key={i} style={{ position: "absolute", left: x, top: y + bob, transform: `translate(-50%, -50%) scale(${interpolate(p, [0, 1], [0.5, 1])})`, opacity: Math.min(1, p * 2), width: 400, height: 250, boxSizing: "border-box", borderRadius: 28, background: `linear-gradient(180deg, ${alpha(t.c, 0.16)}, rgba(14,24,64,0.9))`, border: `3px solid ${alpha(t.c, 0.8)}`, boxShadow: `0 0 26px ${alpha(t.c, 0.25)}` }}>
                <svg width={300} height={150} viewBox="0 0 300 150" style={{ position: "absolute", left: 50, top: 60, overflow: "visible" }}>
                  {t.kind < 3 ? (
                    <path d={shapePath(t.kind)} fill={alpha(t.c, 0.3)} stroke={t.c} strokeWidth={5} strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 6px ${alpha(t.c, 0.7)})` }} />
                  ) : (
                    SPIKES.map((h, j) => <rect key={j} x={14 + j * 36} y={150 - h * 138} width={22} height={h * 138} rx={5} fill={alpha(t.c, 0.55)} stroke={t.c} strokeWidth={3} />)
                  )}
                  <line x1={-10} y1={151} x2={310} y2={151} stroke={alpha(C.text, 0.4)} strokeWidth={3} />
                </svg>
                <div style={{ position: "absolute", right: 16, top: 14, width: 46, height: 46, borderRadius: 23, background: t.c, color: C.ink, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30 }}>?</div>
              </div>
            );
          })}
        </AbsoluteFill>
      ) : null}

      {frame >= FOL - 6 ? (
        <Cta
          FOL={FOL}
          FOLW={FOLW}
          DATAW={DATAW}
          SIMPLE={SIMPLE}
          next="MORE DISTRIBUTIONS"
          chips={[
            { l: "Many samples", c: SAMP },
            { l: "Their averages", c: AVG },
            { l: "Bell curve", c: PREC },
            { l: "Any shape", c: RAW },
          ]}
        />
      ) : null}
    </AbsoluteFill>
  );
};
