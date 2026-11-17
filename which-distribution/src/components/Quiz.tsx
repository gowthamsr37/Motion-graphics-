// Quiz kit (house style), shared by every video: QUICK QUIZ badge, question, 5-second countdown ring,
// four colour-coded options (scan during the countdown, check on the answer, red strike + reason on the rest)
// and the reveal pill with confetti. The scene supplies the cue frames and its own prop.
import React from "react";
import { interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { alpha, glowBox, glowText, theme } from "../theme";
import { Burst, Confetti, ease, exitP, Mark, Pop, Ripple, useSpr } from "./Motion";
import { Pill } from "./Nodes";

const C = theme.colors;
export type QuizOpt = { v: string; color: string; why: string };
export const QUIZ_POS = [
  { x: 330, y: 1050 },
  { x: 750, y: 1050 },
  { x: 330, y: 1166 },
  { x: 750, y: 1166 },
];
export const RING = { x: 540, y: 900, r: 100 };
// the countdown starts 0.2 s after the question ends and lasts 5 s
export const quizClock = (QEND: number, fps: number) => {
  const CD0 = QEND + Math.round(0.2 * fps);
  return { CD0, REVEAL: CD0 + 5 * fps, SEC: fps };
};

export const QuizBadge: React.FC<{ at: number; y?: number }> = ({ at, y = 300 }) => {
  const frame = useCurrentFrame();
  return (
    <>
      <Pop at={at - 4} x={540} y={y} from="scale" scaleFrom={0.3} cfg={theme.spring.bouncy}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 34px 16px 18px", borderRadius: 999, background: `linear-gradient(180deg, ${C.yellow}, #F59E0B)`, boxShadow: glowBox(C.yellow, 0.7), transform: `rotate(${Math.sin(frame / 10) * 2}deg)` }}>
          <div style={{ width: 62, height: 62, borderRadius: 31, background: C.ink, color: C.yellow, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 42 }}>?</div>
          <span style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 54, color: C.ink, letterSpacing: "0.04em" }}>QUICK QUIZ</span>
        </div>
      </Pop>
      <Burst at={at} x={540} y={y} color={C.yellow} count={20} radius={260} seed={81} />
    </>
  );
};

// two-line question in the ring's place; line 2 is the keyword (pops on keyAt) and leaves before the countdown
export const Question: React.FC<{ at: number; keyAt: number; CD0: number; line1: string; line2: string; color?: string; size?: number }> = ({ at, keyAt, CD0, line1, line2, color = C.cyan, size = 84 }) => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const qOut = exitP(frame, CD0 - 8, 8);
  if (qOut >= 1) return null;
  const p = spr(keyAt - 3, theme.spring.pop);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: RING.y, textAlign: "center", transform: `translateY(-50%) translateY(${-qOut * 30}px)`, opacity: (1 - qOut) * Math.min(1, spr(at - 2, theme.spring.snappy) * 2) }}>
      <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 46, color: C.text, whiteSpace: "nowrap" }}>{line1}</div>
      <div style={{ marginTop: 4, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: size, color, textShadow: glowText(color, 0.7), opacity: Math.min(1, p * 2), transform: `scale(${interpolate(p, [0, 1], [1.3, 1])})`, whiteSpace: "nowrap" }}>{line2}</div>
    </div>
  );
};

export const Countdown: React.FC<{ CD0: number }> = ({ CD0 }) => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const SEC = 30;
  const REVEAL = CD0 + 5 * SEC;
  const cdT = (frame - CD0) / SEC;
  const digit = Math.min(5, Math.max(1, 5 - Math.floor(cdT)));
  const tick = spr(CD0 + (5 - digit) * SEC, theme.spring.pop);
  const ringIn = spr(CD0 - 6, theme.spring.bouncy);
  const ringOut = ease(frame, [REVEAL, REVEAL + 10], [0, 1], theme.ease.in);
  const remain = 1 - ease(cdT, [0, 5], [0, 1], theme.ease.soft);
  const ringCol = interpolateColors(Math.min(1, Math.max(0, cdT / 5)), [0, 0.45, 0.75, 1], [C.green, C.yellow, C.orange, C.red]);
  return (
    <>
      {ringIn > 0.01 && ringOut < 1 ? (
        <div style={{ position: "absolute", left: RING.x, top: RING.y, transform: `translate(-50%, -50%) scale(${ringIn * (1 + ringOut * 0.5) * (1 + (1 - tick) * 0.08)})`, opacity: 1 - ringOut }}>
          <svg width={RING.r * 2 + 40} height={RING.r * 2 + 40} viewBox={`${-RING.r - 20} ${-RING.r - 20} ${RING.r * 2 + 40} ${RING.r * 2 + 40}`} style={{ display: "block", overflow: "visible" }}>
            <circle r={RING.r} fill={alpha("#060B2A", 0.85)} stroke={alpha(C.text, 0.12)} strokeWidth={16} />
            <circle r={RING.r} fill="none" stroke={ringCol} strokeWidth={16} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - remain} transform="rotate(-90)" style={{ filter: `drop-shadow(0 0 12px ${ringCol})` }} />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 120, color: C.text, transform: `scale(${interpolate(tick, [0, 1], [1.6, 1])})`, opacity: Math.min(1, tick * 2), textShadow: glowText(ringCol, 0.8) }}>
            {digit}
          </div>
        </div>
      ) : null}
      {[0, 1, 2, 3, 4].map((k) => (
        <Ripple key={k} at={CD0 + k * SEC} x={RING.x} y={RING.y} color={ringCol} size={300} rings={1} />
      ))}
      <Burst at={REVEAL} x={RING.x} y={RING.y} color={C.red} count={18} radius={220} seed={91} />
    </>
  );
};

export const Reveal: React.FC<{ ANS: number; label: string; size?: number }> = ({ ANS, label, size = 64 }) => {
  const spr = useSpr();
  const reveal = spr(ANS - 3, theme.spring.pop);
  return (
    <>
      {reveal > 0.01 ? (
        <div style={{ position: "absolute", left: 540, top: RING.y, transform: `translate(-50%, -50%) scale(${interpolate(reveal, [0, 1], [1.8, 1])})`, opacity: Math.min(1, reveal * 2) }}>
          <Pill label={label} color={C.green} size={size} glow={1.2} />
        </div>
      ) : null}
      <Confetti at={ANS} x={540} y={RING.y} colors={[C.green, C.cyan, C.violet, C.orange, C.yellow]} count={46} seed={12} spread={1.1} />
    </>
  );
};

export const Options: React.FC<{ opts: QuizOpt[]; answer: number; QEND: number; CD0: number; ANS: number; WHY: number; fontSize?: number }> = ({ opts, answer, QEND, CD0, ANS, WHY, fontSize = 40 }) => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const REVEAL = CD0 + 150;
  const scan = frame >= CD0 && frame < REVEAL ? Math.floor((frame - CD0) / 9) % 4 : -1;
  const reveal = spr(ANS - 3, theme.spring.pop);
  return (
    <>
      {opts.map((o, i) => {
        const pos = QUIZ_POS[i];
        const p = spr(QEND - 6 + i * 4, theme.spring.bouncy);
        if (p <= 0.001) return null;
        const isAns = i === answer;
        const win = isAns ? reveal : 0;
        const lose = !isAns ? ease(frame, [ANS - 3, ANS + 6], [0, 1]) : 0;
        const scanned = scan === i;
        const gone = exitP(frame, WHY - 4 + i * 2, 9);
        if (gone >= 1) return null;
        const strike = o.why ? ease(frame, [ANS + 8 + i * 4, ANS + 16 + i * 4], [0, 1]) : 0;
        return (
          <div key={o.v} style={{ position: "absolute", left: pos.x, top: pos.y, transform: `translate(-50%, -50%) scale(${interpolate(p, [0, 1], [0.6, 1]) * (1 + win * 0.1 - lose * 0.05 + (scanned ? 0.04 : 0))})`, opacity: Math.min(1, p * 2) * (1 - lose * (o.why ? 0.35 : 0.75)) * (1 - gone) }}>
            <div
              style={{
                width: 390,
                height: 96,
                boxSizing: "border-box",
                borderRadius: 26,
                background: isAns && win > 0.5 ? alpha(o.color, 0.3) : `linear-gradient(180deg, ${C.panelHi}, ${C.panel})`,
                border: `3px solid ${scanned || win > 0.5 ? o.color : alpha(o.color, 0.45)}`,
                boxShadow: win > 0.5 ? glowBox(o.color, win) : scanned ? `0 0 26px ${alpha(o.color, 0.45)}` : "none",
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "0 22px",
                fontFamily: theme.fonts.display,
                fontWeight: 800,
                // long option names shrink so the strike reason on the right never overlaps them
                fontSize: o.v.length > 10 ? Math.min(fontSize, 26) : o.v.length > 8 ? Math.min(fontSize, 30) : fontSize,
                color: C.text,
                position: "relative",
                whiteSpace: "nowrap",
              }}
            >
              <div style={{ width: 20, height: 20, borderRadius: 10, background: o.color, boxShadow: `0 0 12px ${o.color}`, flexShrink: 0 }} />
              <span style={{ position: "relative" }}>
                {o.v}
                {strike > 0.01 ? <span style={{ position: "absolute", left: -4, top: "50%", width: `calc(${strike * 100}% + 8px)`, height: 6, marginTop: -3, borderRadius: 3, background: C.red, boxShadow: `0 0 10px ${alpha(C.red, 0.8)}` }} /> : null}
              </span>
              {isAns && win > 0.01 ? (
                <div style={{ marginLeft: "auto" }}>
                  <Mark kind="check" at={ANS - 1} size={48} color={C.green} />
                </div>
              ) : null}
              {strike > 0.01 ? (
                <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", padding: "2px 8px", borderRadius: 8, background: C.panel, fontFamily: theme.fonts.body, fontWeight: 700, fontSize: o.v.length > 8 ? 19 : 22, color: C.text, opacity: strike }}>{o.why}</span>
              ) : null}
            </div>
          </div>
        );
      })}
    </>
  );
};
