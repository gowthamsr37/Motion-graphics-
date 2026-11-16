// SCENE 1 — HOOK. A crowd of 1,368 dots stands for crores of voters. A few light up (the people a poll asks).
// It doesn't ask everyone (the crowd dims) — it asks a SAMPLE: the lit dots gather into a small circle.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Burst, ease, Pop, useSpr } from "../components/Motion";
import { discPoints, pick } from "../components/Sampling";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
export const POP = C.violet;
export const SAMP = C.cyan;
export const TRUTH = C.green;
export const BIAS = C.orange;
const COLS = 36;
const ROWS = 38;
const STEP = 22;
const X0 = 540 - ((COLS - 1) * STEP) / 2;
const Y0 = 520;
const PICKS = pick(COLS * ROWS, 44, 11);
const RING = discPoints(PICKS.length, 120);

export const S1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s1");
  const CRORES = s.cueS(0, "crores");
  const FEW = s.cueS(0, "few");
  const NOT = s.sent(1).from;
  const SAMPLE = s.cueS(2, "sample.");
  const lit = ease(frame, [FEW - 4, FEW + 10], [0, 1]);
  const dim = ease(frame, [NOT - 2, NOT + 12], [0, 1]);
  const gather = ease(frame, [SAMPLE - 10, SAMPLE + 12], [0, 1], theme.ease.inOut);
  const slam = spr(SAMPLE - 2, theme.spring.pop);
  const picked = new Set(PICKS);

  return (
    <AbsoluteFill>
      <Pop at={CRORES - 6} out={SAMPLE - 8} x={540} y={410} from="up" dist={18} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 64, color: C.text, whiteSpace: "nowrap", textAlign: "center", lineHeight: 1.1 }}>
          <span style={{ color: POP, textShadow: glowText(POP, 0.5) }}>CRORES</span> OF VOTERS
        </div>
      </Pop>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", left: 0, top: 0 }}>
        {Array.from({ length: COLS * ROWS }, (_, i) => {
          const c = i % COLS;
          const r = Math.floor(i / COLS);
          const d = Math.hypot(c - COLS / 2, r - ROWS / 2) / 26;
          const q = ease(frame, [2 + d * 16, 10 + d * 16], [0, 1]);
          if (q <= 0.001) return null;
          const isP = picked.has(i);
          if (isP) return null;
          return <circle key={i} cx={X0 + c * STEP} cy={Y0 + r * STEP} r={4.5 * q} fill={alpha("#B9A8FF", 0.55 - dim * 0.4)} />;
        })}
        {PICKS.map((i, k) => {
          const c = i % COLS;
          const r = Math.floor(i / COLS);
          const d = Math.hypot(c - COLS / 2, r - ROWS / 2) / 26;
          const q = ease(frame, [2 + d * 16, 10 + d * 16], [0, 1]);
          const x = interpolate(gather, [0, 1], [X0 + c * STEP, 540 + RING[k].x]);
          const y = interpolate(gather, [0, 1], [Y0 + r * STEP, 940 + RING[k].y]);
          const on = lit;
          return <circle key={`p${i}`} cx={x} cy={y} r={(4.5 + on * 4 + gather * 3) * q} fill={on > 0.5 ? SAMP : alpha("#B9A8FF", 0.55 - dim * 0.4)} style={on > 0.5 ? { filter: `drop-shadow(0 0 6px ${SAMP})` } : undefined} />;
        })}
      </svg>
      <Pop at={FEW - 2} out={SAMPLE - 8} x={540} y={478} from="up" dist={14} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text, whiteSpace: "nowrap" }}>
          ask just <span style={{ color: SAMP, textShadow: glowText(SAMP, 0.5) }}>a few thousand</span>
        </div>
      </Pop>
      {gather > 0.6 ? <div style={{ position: "absolute", left: 540 - 150, top: 940 - 150, width: 300, height: 300, borderRadius: 150, border: `4px solid ${SAMP}`, boxShadow: `0 0 30px ${alpha(SAMP, 0.5)}`, opacity: (gather - 0.6) / 0.4 }} /> : null}
      {slam > 0.001 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 520, textAlign: "center", transform: `translateY(-50%) scale(${interpolate(slam, [0, 1], [1.7, 1])})`, opacity: Math.min(1, slam * 2), fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 150, letterSpacing: "-0.02em", lineHeight: 1 }}>
          <span style={{ background: `linear-gradient(180deg, #FFFFFF, ${SAMP})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 26px ${alpha(SAMP, 0.55)})` }}>A SAMPLE</span>
        </div>
      ) : null}
      <Burst at={SAMPLE} x={540} y={940} color={SAMP} count={22} radius={320} seed={5} />
    </AbsoluteFill>
  );
};
