// SCENE 6 — BIAS. A sample must be random: the RANDOM panel picks dots from all over (fair answer ✓). The GYM ONLY panel
// picks everyone from one corner (the gym) → the answer is way off ✗ → stamped BIAS.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Stamp } from "../components/Kit";
import { ease, Mark, Pop, useSpr } from "../components/Motion";
import { pick } from "../components/Sampling";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { BIAS, SAMP } from "./S1Hook";

const C = theme.colors;
const G = 12;
const STEP = 30;
const RANDOM = new Set(pick(G * G, 16, 3));
// the gym: the top-right 4 × 4 corner
const GYM = new Set(Array.from({ length: G * G }, (_, i) => i).filter((i) => i % G >= 8 && Math.floor(i / G) < 4));

const Panel: React.FC<{ x: number; at: number; label: string; color: string; picks: Set<number>; gym?: boolean; verdictAt: number; good: boolean }> = ({ x, at, label, color, picks, gym, verdictAt, good }) => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const p = spr(at - 6, theme.spring.bouncy);
  if (p <= 0.001) return null;
  const lit = ease(frame, [at + 6, at + 20], [0, 1]);
  const x0 = x - ((G - 1) * STEP) / 2;
  const y0 = 820 - ((G - 1) * STEP) / 2;
  const v = spr(verdictAt, theme.spring.pop);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, opacity: Math.min(1, p * 2), transform: `translateY(${(1 - p) * 40}px)` }}>
      <div style={{ position: "absolute", left: x - 215, top: 590, width: 430, height: 460, boxSizing: "border-box", borderRadius: 30, background: `linear-gradient(180deg, ${alpha(color, 0.14)}, rgba(14,24,64,0.9))`, border: `3px solid ${alpha(color, 0.75)}` }} />
      <div style={{ position: "absolute", left: x, top: 556, transform: "translate(-50%, -50%)", padding: "6px 22px", borderRadius: 999, background: "#0A1440", border: `3px solid ${color}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color, whiteSpace: "nowrap" }}>{label}</div>
      {gym ? <div style={{ position: "absolute", left: x0 + 8 * STEP - 18, top: y0 - 18, width: 4 * STEP + 6, height: 4 * STEP + 6, borderRadius: 14, border: `3px dashed ${BIAS}`, background: alpha(BIAS, 0.1) }} /> : null}
      {gym ? <div style={{ position: "absolute", left: x0 + 9.5 * STEP, top: y0 + 4 * STEP + 6, transform: "translateX(-50%)", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 18, letterSpacing: "0.16em", color: BIAS }}>GYM</div> : null}
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", left: 0, top: 0 }}>
        {Array.from({ length: G * G }, (_, i) => {
          const on = picks.has(i);
          return <circle key={i} cx={x0 + (i % G) * STEP} cy={y0 + Math.floor(i / G) * STEP} r={on ? 6 + 4 * lit : 6} fill={on && lit > 0.5 ? color : alpha("#B9A8FF", 0.5)} style={on && lit > 0.5 ? { filter: `drop-shadow(0 0 6px ${color})` } : undefined} />;
        })}
      </svg>
      {v > 0.01 ? (
        <div style={{ position: "absolute", left: x, top: 1100, transform: `translate(-50%, -50%) scale(${interpolate(v, [0, 1], [0.6, 1])})`, opacity: Math.min(1, v * 2), display: "flex", alignItems: "center", gap: 12, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 34, color: good ? C.green : C.red, whiteSpace: "nowrap" }}>
          <Mark kind={good ? "check" : "cross"} at={verdictAt} size={40} color={good ? C.green : C.red} />
          {good ? "FAIR ANSWER" : "WAY OFF"}
        </div>
      ) : null}
    </div>
  );
};

export const S6Bias: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s6");
  const RAND = s.cueS(0, "random.");
  const GYMW = s.cueS(1, "gym");
  const OFF = s.cueS(1, "off.");
  const BIASW = s.cueS(2, "bias.");

  return (
    <AbsoluteFill>
      <Pop at={s.sent(0).from - 4} x={540} y={420} from="up" dist={18} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 58, color: C.text, whiteSpace: "nowrap" }}>
          IT MUST BE <span style={{ color: SAMP, textShadow: glowText(SAMP, 0.5) }}>RANDOM</span>
        </div>
      </Pop>
      <Panel x={300} at={RAND - 2} label="RANDOM" color={SAMP} picks={RANDOM} verdictAt={RAND + 26} good />
      <Panel x={780} at={GYMW - 4} label="GYM ONLY" color={BIAS} picks={GYM} gym verdictAt={OFF - 4} good={false} />
      {frame >= BIASW - 6 ? <Stamp at={BIASW - 4} x={780} y={820} color={BIAS} rot={-10} size={70}>BIAS!</Stamp> : null}
      <Pop at={BIASW + 6} x={540} y={1240} from="up" dist={14}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 26, letterSpacing: "0.12em", color: C.dim, whiteSpace: "nowrap" }}>RANDOM = EVERYONE HAS THE SAME CHANCE</div>
      </Pop>
    </AbsoluteFill>
  );
};
