// SCENE 7 — n − 1. A sample of 10 heights (mean 165). Its SD: ÷ n gives 6.7 cm, ÷ (n − 1) gives 7.1 cm.
// Against the population's true SD (7 cm), ÷ n comes out too small; ÷ (n − 1) is about right.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { SceneTitle } from "../components/Kit";
import { ease, Pop, useSpr } from "../components/Motion";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { BIAS, SAMP, TRUTH } from "./S1Hook";

const C = theme.colors;
export const TEN = [155, 157, 160, 161, 164, 165, 168, 170, 173, 177];
const M = TEN.reduce((a, b) => a + b, 0) / TEN.length; // 165
const SS = TEN.reduce((a, v) => a + (v - M) ** 2, 0); // 448
export const SD_N = Math.sqrt(SS / TEN.length); // 6.69
export const SD_N1 = Math.sqrt(SS / (TEN.length - 1)); // 7.06
const ax = (v: number) => 130 + ((v - 150) / 30) * 820;
const BAR0 = 250;
const PX = 72; // px per cm of SD

export const S7NMinus1: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s7");
  const DIV = s.cueS(1, "divide");
  const MINUS = s.cueS(1, "1,");
  const NOT = s.cueS(1, "not");
  const UNDER = s.cueS(2, "underestimating");
  const SPREAD = s.cueS(2, "spread.");
  const strike = ease(frame, [NOT, NOT + 8], [0, 1]);
  const bars = ease(frame, [s.sent(2).from - 2, s.sent(2).from + 18], [0, 1], theme.ease.inOut);
  const cards = [
    { x: 300, at: DIV, t: "÷ n", c: BIAS, v: SD_N, strike },
    { x: 780, at: MINUS, t: "÷ (n - 1)", c: TRUTH, v: SD_N1, strike: 0 },
  ];

  return (
    <AbsoluteFill>
      <SceneTitle label="ONE MORE DETAIL" color={TRUTH} at={2} pill="SAMPLE SD" pillAt={s.sent(1).from - 4} />
      {/* a sample of 10 */}
      <div style={{ position: "absolute", left: 120, top: 620, width: 840 * ease(frame, [4, 16], [0, 1]), height: 4, borderRadius: 2, background: alpha(C.text, 0.4) }} />
      {[150, 155, 160, 165, 170, 175, 180].map((v) => (
        <div key={v} style={{ position: "absolute", left: ax(v), top: 652, transform: "translate(-50%, -50%)", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 22, color: C.dim, opacity: ease(frame, [6, 16], [0, 1]) }}>{v}</div>
      ))}
      {TEN.map((v, i) => {
        const p = spr(8 + i * 3, theme.spring.pop);
        return <div key={i} style={{ position: "absolute", left: ax(v) - 15, top: 620 - 34, width: 30, height: 30, borderRadius: 15, background: SAMP, boxShadow: `0 0 10px ${SAMP}`, transform: `scale(${p})` }} />;
      })}
      <Pop at={10} x={540} y={520} from="up" dist={12}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.2em", color: C.dim, whiteSpace: "nowrap" }}>A SAMPLE OF 10 HEIGHTS (cm)</div>
      </Pop>
      {/* ÷ n vs ÷ (n − 1) */}
      {cards.map((k) => {
        const p = spr(k.at - 6, theme.spring.bouncy);
        if (p <= 0.001) return null;
        return (
          <div key={k.t} style={{ position: "absolute", left: k.x, top: 840, transform: `translate(-50%, -50%) scale(${interpolate(p, [0, 1], [0.6, 1])})`, opacity: Math.min(1, p * 2) * (1 - k.strike * 0.35), width: 400, height: 180, boxSizing: "border-box", borderRadius: 28, background: `linear-gradient(180deg, ${alpha(k.c, 0.2)}, rgba(14,24,64,0.9))`, border: `3px solid ${k.c}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <div style={{ position: "relative", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 54, color: C.text, whiteSpace: "nowrap" }}>
              {k.t}
              {k.strike > 0.01 ? <div style={{ position: "absolute", left: -8, top: "52%", width: `calc(${k.strike * 100}% + 16px)`, height: 8, borderRadius: 4, background: C.red }} /> : null}
            </div>
            <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 34, color: k.c }}>SD = {k.v.toFixed(1)} cm</div>
          </div>
        );
      })}
      {/* against the truth */}
      {bars > 0.01 ? (
        <>
          <div style={{ position: "absolute", left: BAR0 + 7 * PX - 2, top: 1040, height: 220, borderLeft: `4px dashed ${C.text}`, opacity: bars }} />
          <div style={{ position: "absolute", left: BAR0 + 7 * PX, top: 1020, transform: "translate(-50%, -50%)", opacity: bars, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 26, color: C.text, whiteSpace: "nowrap" }}>TRUE SD 7</div>
          {[
            { v: SD_N, c: BIAS, l: "÷ n", tag: "TOO SMALL", y: 1100, at: UNDER },
            { v: SD_N1, c: TRUTH, l: "÷ (n - 1)", tag: "ABOUT RIGHT", y: 1200, at: SPREAD },
          ].map((b) => (
            <React.Fragment key={b.l}>
              <div style={{ position: "absolute", left: BAR0 - 160, top: b.y, transform: "translateY(-50%)", width: 150, textAlign: "right", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 26, color: b.c, whiteSpace: "nowrap" }}>{b.l}</div>
              <div style={{ position: "absolute", left: BAR0, top: b.y - 24, width: b.v * PX * bars, height: 48, borderRadius: 12, background: alpha(b.c, 0.5), border: `3px solid ${b.c}`, boxShadow: `0 0 16px ${alpha(b.c, 0.35)}` }} />
              <Pop at={b.at - 4} x={BAR0 + b.v * PX + 104} y={b.y} from="left" dist={14} cfg={theme.spring.pop}>
                <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 26, color: b.c, textShadow: glowText(b.c, 0.4), whiteSpace: "nowrap" }}>{b.tag}</div>
              </Pop>
            </React.Fragment>
          ))}
        </>
      ) : null}
    </AbsoluteFill>
  );
};
