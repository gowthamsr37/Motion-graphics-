// SCENE 1 — HOOK. A food app card: AVERAGE DELIVERY 32 MIN · from only 100 orders → HOW SURE? → CONFIDENCE INTERVALS.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Stopwatch } from "../components/Exp";
import { Burst, Pop, useSpr } from "../components/Motion";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
export const SAMPLE = C.cyan; // sample averages / data
export const TRUE = C.green; // the true average
export const RANGE = C.violet; // intervals / margins
export const MISS = C.orange; // misses / warnings

export const S1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s1");
  const N100 = s.cueS(1, "100");
  const SURE = s.cueS(1, "sure");
  const CI = s.cueS(2, "confidence");
  const card = spr(6, theme.spring.bouncy);
  const title = spr(CI - 3, theme.spring.pop);
  return (
    <AbsoluteFill>
      {card > 0.001 ? (
        <div style={{ position: "absolute", left: 540, top: 820, width: 640, height: 420, transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, card), [0, 1], [0.7, 1])})`, opacity: Math.min(1, card * 2), boxSizing: "border-box", borderRadius: 48, background: "linear-gradient(180deg, rgba(26,40,98,0.95), rgba(14,24,64,0.95))", border: `4px solid ${alpha(SAMPLE, 0.7)}`, boxShadow: `0 0 40px ${alpha(SAMPLE, 0.25)}` }}>
          <div style={{ position: "absolute", left: 40, top: 36, display: "flex", alignItems: "center", gap: 14, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.16em", color: C.dim }}>
            <Stopwatch size={44} color={SAMPLE} frac={0.4} />
            FOOD APP · AVERAGE DELIVERY
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 150, color: C.text, textShadow: glowText(SAMPLE, 0.4) }}>
            32<span style={{ fontSize: 60, color: C.dim }}> MIN</span>
          </div>
          <Pop at={N100 - 4} x={320} y={350} from="up" dist={10} cfg={theme.spring.bouncy}>
            <div style={{ padding: "8px 22px", borderRadius: 999, background: alpha(MISS, 0.2), border: `3px solid ${MISS}`, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 26, color: C.text, whiteSpace: "nowrap" }}>
              FROM ONLY <span style={{ color: MISS }}>100 ORDERS</span>
            </div>
          </Pop>
        </div>
      ) : null}
      <Pop at={SURE - 4} out={CI - 6} x={540} y={420} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 80, color: C.text, whiteSpace: "nowrap" }}>
          HOW <span style={{ color: RANGE, textShadow: glowText(RANGE, 0.5) }}>SURE</span>
          <span style={{ color: C.yellow }}>?</span>
        </div>
      </Pop>
      {title > 0.001 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 420, textAlign: "center", transform: `translateY(-50%) scale(${interpolate(title, [0, 1], [1.5, 1])})`, opacity: Math.min(1, title * 2), fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1.02, letterSpacing: "-0.02em" }}>
          <div style={{ fontSize: 92, background: `linear-gradient(90deg, ${SAMPLE}, ${RANGE})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 24px ${alpha(RANGE, 0.5)})`, whiteSpace: "nowrap" }}>CONFIDENCE</div>
          <div style={{ fontSize: 92, color: C.text }}>INTERVALS</div>
        </div>
      ) : null}
      <Burst at={CI} x={540} y={420} color={RANGE} count={22} radius={340} seed={7} />
      <Pop at={CI + 10} x={540} y={1160} from="up" dist={14}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 28, letterSpacing: "0.2em", color: C.dim, whiteSpace: "nowrap" }}>EXPLAINED SIMPLY</div>
      </Pop>
    </AbsoluteFill>
  );
};
