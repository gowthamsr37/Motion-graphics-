// SCENE 1 — HOOK. A NEWS POLL card: 52% SUPPORT THE NEW METRO LINE, then "± 3%" stamps on → WHAT DOES ± 3% MEAN? →
// title CONFIDENCE INTERVALS · EXPLAINED SIMPLY.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Burst, exitP, Pop, useSpr } from "../components/Motion";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
export const EST = C.cyan; // the estimate (sample value)
export const RANGE = C.violet; // the interval, the margin
export const TRUE = C.green; // the true population value
export const MISS = C.orange; // a miss, a wrong reading

export const S1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s1");
  const POLL = s.sent(0).from;
  const PM = s.cueS(0, "plus");
  const Q = s.sent(1).from;
  const CI = s.cueS(1, "confidence");
  const SIMPLE = s.cueS(1, "simple.");
  const card = spr(POLL - 4, theme.spring.bouncy);
  const pm = spr(PM - 4, theme.spring.pop);
  const title = spr(CI - 3, theme.spring.pop);
  const qOut = exitP(frame, CI - 6, 8);
  return (
    <AbsoluteFill>
      {card > 0.001 ? (
        <div style={{ position: "absolute", left: 540, top: 800, width: 820, height: 470, transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, card), [0, 1], [0.6, 1])})`, opacity: Math.min(1, card * 2), boxSizing: "border-box", borderRadius: 36, background: "linear-gradient(180deg, rgba(30,44,104,0.95), rgba(14,24,64,0.95))", border: `2px solid ${C.edge}`, boxShadow: "0 24px 60px rgba(0,0,0,0.4)" }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 74, borderRadius: "34px 34px 0 0", background: alpha(C.red, 0.85), display: "flex", alignItems: "center", justifyContent: "center", gap: 14, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 28, letterSpacing: "0.22em", color: C.text }}>
            <span style={{ width: 14, height: 14, borderRadius: 7, background: C.text, opacity: 0.5 + 0.5 * Math.sin(frame / 4) }} />
            NEWS POLL
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 110, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 190, lineHeight: 1, color: C.text, textShadow: glowText(EST, 0.5) }}>
            52%
            {pm > 0.001 ? <span style={{ display: "inline-block", marginLeft: 18, fontSize: 96, color: RANGE, textShadow: glowText(RANGE, 0.6), transform: `scale(${interpolate(Math.min(1, pm), [0, 1], [1.8, 1])})`, opacity: Math.min(1, pm * 2), verticalAlign: "middle" }}>± 3%</span> : null}
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 330, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 38, color: C.text }}>support the new metro line</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 392, textAlign: "center", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.16em", color: C.dim }}>1,000 VOTERS SURVEYED</div>
        </div>
      ) : null}
      {qOut < 1 ? (
        <Pop at={Q - 2} x={540} y={410} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
          <div style={{ opacity: 1 - qOut, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 58, color: C.text, whiteSpace: "nowrap" }}>
            WHAT DOES <span style={{ color: RANGE, textShadow: glowText(RANGE, 0.5) }}>± 3%</span> MEAN<span style={{ color: C.yellow }}>?</span>
          </div>
        </Pop>
      ) : null}
      {title > 0.001 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 400, textAlign: "center", transform: `translateY(-50%) scale(${interpolate(title, [0, 1], [1.5, 1])})`, opacity: Math.min(1, title * 2), fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1.02, letterSpacing: "-0.02em" }}>
          <div style={{ fontSize: 104, background: `linear-gradient(90deg, ${EST}, ${RANGE})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 24px ${alpha(RANGE, 0.45)})`, whiteSpace: "nowrap" }}>CONFIDENCE</div>
          <div style={{ fontSize: 104, color: C.text }}>INTERVALS</div>
        </div>
      ) : null}
      <Burst at={CI} x={540} y={400} color={RANGE} count={22} radius={340} seed={7} />
      <Pop at={SIMPLE - 6} x={540} y={1150} from="up" dist={14}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 28, letterSpacing: "0.2em", color: C.dim, whiteSpace: "nowrap" }}>EXPLAINED SIMPLY</div>
      </Pop>
    </AbsoluteFill>
  );
};
