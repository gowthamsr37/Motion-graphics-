// SCENE 1 — HOOK. A chai stall gets 4 customers an hour on average. One just left: how long until the next one?
// A stopwatch starts counting → THE EXPONENTIAL DISTRIBUTION.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Stopwatch } from "../components/Exp";
import { ChaiCup, Person } from "../components/Icons";
import { Burst, ease, exitP, Pop, useSpr } from "../components/Motion";
import { Pill } from "../components/Nodes";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
export const GAP = C.cyan; // waiting times, the curve
export const RATE = C.violet; // the average
export const SHORT = C.green; // short waits
export const LONG = C.orange; // long waits

const mmss = (sec: number) => `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(Math.floor(sec % 60)).padStart(2, "0")}`;

export const S1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s1");
  const FOUR = s.cueS(0, "4");
  const LEFT = s.cueS(1, "left.");
  const HOW = s.cueS(1, "How");
  const EXP = s.cueS(2, "exponential");
  const stall = spr(4, theme.spring.bouncy);
  const title = spr(EXP - 3, theme.spring.pop);
  const walk = ease(frame, [LEFT - 4, LEFT + 22], [0, 1], theme.ease.inOut);
  const clockIn = spr(HOW - 4, theme.spring.bouncy);
  const clockOut = exitP(frame, EXP - 4, 8);
  const secs = Math.max(0, frame - (HOW - 2)) * 7; // the wait, sped up (7 s a frame)

  return (
    <AbsoluteFill>
      {/* the stall */}
      <div style={{ position: "absolute", left: 540, top: 760, transform: `translate(-50%, -50%) scale(${stall})`, width: 520, height: 300, boxSizing: "border-box", borderRadius: 30, background: `linear-gradient(180deg, ${alpha(C.orange, 0.2)}, rgba(14,24,64,0.92))`, border: `3px solid ${alpha(C.orange, 0.7)}` }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: -54, height: 70, borderRadius: "30px 30px 0 0", background: `repeating-linear-gradient(90deg, ${alpha(C.orange, 0.8)} 0 52px, ${alpha("#F3F7FF", 0.85)} 52px 104px)` }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 40, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 44, color: C.text }}>CHAI STALL</div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 120, display: "flex", justifyContent: "center", gap: 20 }}>
          <ChaiCup w={90} />
          <ChaiCup w={90} />
          <ChaiCup w={90} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 100, top: 1112, width: 880, height: 4, borderRadius: 2, background: alpha(C.text, 0.35), opacity: spr(6, theme.spring.smooth) }} />
      {/* the customer who just left walks off to the right */}
      {walk < 1 ? (
        <div style={{ position: "absolute", left: interpolate(walk, [0, 1], [540, 1180]), top: 1110, transform: `translate(-50%, -100%) scale(${spr(8, theme.spring.bouncy)})`, transformOrigin: "bottom center" }}>
          <Person height={130} shirt={C.violet} swing={walk > 0 && walk < 1 ? Math.sin(frame / 2.5) * 22 : 0} />
        </div>
      ) : null}
      <Pop at={FOUR - 2} out={HOW - 6} x={540} y={420} from="up" dist={16} cfg={theme.spring.bouncy}>
        <Pill label="4 CUSTOMERS AN HOUR (AVERAGE)" color={RATE} size={32} glow={0.5} />
      </Pop>
      <Pop at={HOW - 2} out={EXP - 6} x={540} y={420} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 64, color: C.text, whiteSpace: "nowrap" }}>
          NEXT ONE <span style={{ color: GAP, textShadow: glowText(GAP, 0.5) }}>WHEN</span>
          <span style={{ color: C.yellow }}>?</span>
        </div>
      </Pop>
      {/* the stopwatch: the wait ticking up */}
      {clockIn > 0.001 && clockOut < 1 ? (
        <div style={{ position: "absolute", left: 540, top: 1240, transform: `translate(-50%, -50%) scale(${interpolate(clockIn, [0, 1], [0.6, 1])})`, opacity: Math.min(1, clockIn * 2) * (1 - clockOut), display: "flex", alignItems: "center", gap: 22, padding: "12px 30px 12px 18px", borderRadius: 999, background: "rgba(10,20,64,0.9)", border: `3px solid ${alpha(GAP, 0.8)}` }}>
          <Stopwatch size={64} color={GAP} frac={(secs % 60) / 60} />
          <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.16em", color: C.dim }}>WAITING</div>
          <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 52, color: C.text, minWidth: 160 }}>{mmss(secs)}</div>
        </div>
      ) : null}
      {title > 0.001 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 420, textAlign: "center", transform: `translateY(-50%) scale(${interpolate(title, [0, 1], [1.5, 1])})`, opacity: Math.min(1, title * 2), fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1.02, letterSpacing: "-0.02em" }}>
          <div style={{ fontSize: 70, color: C.text, whiteSpace: "nowrap" }}>THE EXPONENTIAL</div>
          <div style={{ fontSize: 96, background: `linear-gradient(90deg, ${GAP}, ${RATE})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 24px ${alpha(RATE, 0.5)})`, whiteSpace: "nowrap" }}>DISTRIBUTION</div>
        </div>
      ) : null}
      <Burst at={EXP} x={540} y={420} color={GAP} count={22} radius={340} seed={7} />
      <Pop at={EXP + 10} x={540} y={1240} from="up" dist={14}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 28, letterSpacing: "0.2em", color: C.dim, whiteSpace: "nowrap" }}>EXPLAINED SIMPLY</div>
      </Pop>
    </AbsoluteFill>
  );
};
