// SCENE 9 — QUIZ + TEASER + CTA. Heights SD 7 cm; you average samples of 49 people: what's the spread of those averages?
// Options 7 cm / 1 cm / 49 cm / 0.14 cm → 1 cm (7 ÷ √49 = 7 ÷ 7 = 1). Then the "more distributions" teaser and the end card.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Bell, type BellGeo } from "../components/Bell";
import { Radical } from "../components/Clt";
import { Cta } from "../components/Cta";
import { ease, exitP, Pop, shake, useSpr } from "../components/Motion";
import { Pill } from "../components/Nodes";
import { Countdown, Options, Question, QuizBadge, type QuizOpt, quizClock, Reveal } from "../components/Quiz";
import { alpha, glowText, kindColor, theme } from "../theme";
import { useScene } from "../timing";
import { MEANS, RAW, SE, SKEW } from "./S1Hook";

const C = theme.colors;
const OPTS: QuizOpt[] = [
  { v: "7 cm", color: C.cyan, why: "one person" },
  { v: "1 cm", color: C.green, why: "" },
  { v: "49 cm", color: C.violet, why: "too big" },
  { v: "0.14 cm", color: C.orange, why: "not ÷ 49" },
];
const G: BellGeo = { x0: 170, x1: 910, vmin: 141, vmax: 189, base: 720, peakH: 100, sigmaRef: 7 };
const G2: BellGeo = { ...G, peakH: 250, sigmaRef: 1 };

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

export const S9Quiz: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s9");
  const QQ = s.sent(0).from;
  const H = s.sent(1).from;
  const W7 = s.cueS(1, "7");
  const W49 = s.cueS(1, "49");
  const Q = s.sent(2).from;
  const AVGW = s.cueS(2, "averages?");
  const QEND = s.sent(2).to;
  const { CD0 } = quizClock(QEND, s.fps);
  const ANS = s.sent(3).from;
  const WHY = s.sent(4).from;
  const ROOT = s.cueS(4, "square");
  const GIVES = s.cueS(4, "gives");
  const TZ = s.sent(5).from;
  const FUTURE = s.cueS(5, "future");
  const FOL = s.sent(6).from;
  const FOLW = s.cueS(6, "Follow");
  const DATAW = s.cueS(6, "data");
  const SIMPLE = s.cueS(6, "simple!");
  const sh = shake(frame, ANS, 12, 10);
  const clear = exitP(frame, TZ - 10, 10);
  const teaseOut = exitP(frame, FOL - 10, 10);
  const narrow = ease(frame, [WHY - 2, WHY + 18], [0, 1], theme.ease.inOut);

  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      {clear < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - clear, transform: `scale(${1 - clear * 0.06})` }}>
          <QuizBadge at={QQ} />
          <Pop at={H - 4} x={540} y={410} from="down" dist={14}>
            <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.22em", color: C.dim, whiteSpace: "nowrap" }}>HEIGHTS (cm)</div>
          </Pop>
          {frame >= H - 6 ? (
            <>
              <Bell g={G} mu={165} sigma={7} p={ease(frame, [H - 4, H + 18], [0, 1], theme.ease.inOut)} color={C.text} fill={0.07} width={4} />
              <div style={{ position: "absolute", left: G.x0 - 10, top: G.base - 2, width: G.x1 - G.x0 + 20, height: 4, borderRadius: 2, background: alpha(C.text, 0.4) }} />
            </>
          ) : null}
          {narrow > 0.01 ? <Bell g={G2} mu={165} sigma={1} p={narrow} color={MEANS} fill={0.3} width={5} /> : null}
          <Pop at={WHY + 10} x={700} y={520} from="left" dist={14}>
            <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.14em", color: MEANS, whiteSpace: "nowrap" }}>AVERAGES OF 49</div>
          </Pop>
          <Pop at={W7 - 4} x={260} y={520} from="left" dist={20} cfg={theme.spring.bouncy}>
            <Pill label="SD 7 cm" color={kindColor.sd} size={28} glow={0.4} />
          </Pop>
          <Pop at={W49 - 4} x={830} y={600} from="right" dist={20} cfg={theme.spring.bouncy}>
            <Pill label="n = 49" color={RAW} size={28} glow={0.4} />
          </Pop>

          <Question at={Q} keyAt={AVGW} CD0={CD0} line1="Spread of the" line2="AVERAGES?" color={C.yellow} />
          <Countdown CD0={CD0} />
          <Reveal ANS={ANS} label="1 cm" size={80} />
          <Options opts={OPTS} answer={1} QEND={QEND} CD0={CD0} ANS={ANS} WHY={WHY} />
          {frame >= ROOT - 6 ? (
            <div style={{ position: "absolute", left: 540, top: 1120, transform: `translate(-50%, -50%) scale(${interpolate(spr(ROOT - 4, theme.spring.bouncy), [0, 1], [0.6, 1])})`, display: "flex", alignItems: "center", gap: 14, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 54, color: C.text, whiteSpace: "nowrap", padding: "8px 30px", borderRadius: 24, background: "#0A1440", border: `3px solid ${SE}` }}>
              7 ÷
              <Radical color={C.text} size={54}>
                49
              </Radical>
              <span style={{ display: "inline-block", overflow: "hidden", maxWidth: 420 * ease(frame, [GIVES - 8, GIVES + 2], [0, 1]), opacity: ease(frame, [GIVES - 8, GIVES], [0, 1]) }}>
                = 7 ÷ 7 = <span style={{ color: MEANS, textShadow: glowText(MEANS, 0.6) }}>1</span>
              </span>
            </div>
          ) : null}
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
            { l: "Sample means", c: RAW },
            { l: "Bell shape", c: MEANS },
            { l: "Std error", c: SE },
            { l: "n = 30", c: SKEW },
          ]}
        />
      ) : null}
    </AbsoluteFill>
  );
};
