// SCENE 7 — THE RECIPE. Three steps with the commute numbers: sort · find Q1 and Q3 · subtract → then MEDIAN + IQR.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { SceneTitle } from "../components/Kit";
import { Burst, ease, Mark, Pop, useSpr } from "../components/Motion";
import { Pill } from "../components/Nodes";
import { alpha, glowText, kindColor, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const V = kindColor.spread;
const MC = kindColor.median;
const ROWS = [
  { y: 640, w: "Sort.", title: "SORT THE DATA", ex: <>18 20 22 22 25 <span style={{ color: MC }}>|</span> 27 30 30 35 60</> },
  { y: 830, w: "Find", title: "FIND Q1 AND Q3", ex: <>middle of each half: <span style={{ color: C.cyan }}>22</span> and <span style={{ color: C.cyan }}>30</span></> },
  { y: 1020, w: "Subtract.", title: "SUBTRACT: Q3 - Q1", ex: <>30 - 22 = <span style={{ color: V }}>8 minutes</span></> },
];

export const S7Recipe: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s7");
  const PAIR = s.cueS(2, "median.");
  const END = s.duration;
  const out = ease(frame, [END - 10, END], [0, 1], theme.ease.in);

  return (
    <AbsoluteFill style={{ opacity: 1 - out, transform: `scale(${1 - out * 0.06})` }}>
      <SceneTitle label="THE RECIPE" pill="IQR IN 3 STEPS" color={V} at={2} pillAt={6} />
      {/* empty recipe slots, filled as each step is spoken */}
      {ROWS.map((r, i) => {
        const g = spr(4 + i * 4, theme.spring.smooth);
        const filled = frame >= s.cueS(1, r.w) + 4;
        if (g <= 0.001 || filled) return null;
        return (
          <div key={`ghost${i}`} style={{ position: "absolute", left: 110, top: r.y - 80, width: 860, height: 160, boxSizing: "border-box", borderRadius: 28, border: `2.5px dashed ${alpha(V, 0.45)}`, opacity: Math.min(1, g * 2) * 0.8, transform: `translateY(${(1 - g) * 30}px)` }}>
            <div style={{ position: "absolute", left: 26, top: 40, width: 76, height: 76, borderRadius: 38, border: `3px solid ${alpha(V, 0.6)}`, color: alpha(V, 0.8), display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, boxSizing: "border-box" }}>{i + 1}</div>
          </div>
        );
      })}
      {ROWS.map((r, i) => {
        const at = s.cueS(1, r.w) - 4;
        const p = spr(at, theme.spring.bouncy);
        if (p <= 0.001) return null;
        return (
          <div key={r.title} style={{ position: "absolute", left: 110, top: r.y - 80, width: 860, height: 160, boxSizing: "border-box", padding: "24px 28px 24px 120px", borderRadius: 28, background: `linear-gradient(90deg, ${alpha(V, 0.18)}, rgba(14,24,64,0.9) 60%)`, border: `2.5px solid ${alpha(V, 0.6)}`, opacity: Math.min(1, p * 2), transform: `translateX(${(1 - p) * 60}px)` }}>
            <div style={{ position: "absolute", left: 26, top: 40, width: 76, height: 76, borderRadius: 38, background: V, color: C.ink, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, boxShadow: `0 0 20px ${alpha(V, 0.6)}` }}>{i + 1}</div>
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text, whiteSpace: "nowrap" }}>{r.title}</div>
            <div style={{ marginTop: 10, fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 28, color: C.dim, whiteSpace: "nowrap" }}>{r.ex}</div>
            <div style={{ position: "absolute", right: 26, top: 50 }}>
              <Mark kind="check" at={at + 8} size={54} color={MC} width={12} />
            </div>
          </div>
        );
      })}
      {/* the robust pair */}
      <Pop at={PAIR - 14} x={540} y={1170} from="up" dist={14}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.24em", color: C.dim, whiteSpace: "nowrap" }}>THE OUTLIER-PROOF PAIR</div>
      </Pop>
      {(() => {
        const p = spr(PAIR - 6, theme.spring.pop);
        if (p <= 0.001) return null;
        return (
          <div style={{ position: "absolute", left: 540, top: 1250, transform: `translate(-50%, -50%) scale(${interpolate(p, [0, 1], [1.6, 1])})`, opacity: Math.min(1, p * 2), display: "flex", alignItems: "center", gap: 20 }}>
            <Pill label="MEDIAN" color={MC} size={40} glow={0.8} />
            <span style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 56, color: C.text, textShadow: glowText(C.text, 0.3) }}>+</span>
            <Pill label="IQR" color={V} size={40} glow={0.8} />
          </div>
        );
      })()}
      <Burst at={PAIR - 4} x={540} y={1250} color={V} count={20} radius={300} seed={21} />
    </AbsoluteFill>
  );
};
