// SCENE 6 — EFFECT 2: TRENDS. Hours studied vs score: seven students on a clear rising line (slope +6.6 marks/hour).
// One student studied 8 hours but missed the exam (score 10): the least-squares line tilts almost flat (+0.6).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { SceneTitle } from "../components/Kit";
import { ease, Pop, Ripple, shake, useSpr } from "../components/Motion";
import { Tag } from "../components/Nodes";
import { alpha, glowText, kindColor, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const O = kindColor.outlier;
const TL = C.cyan;
export const PTS: [number, number][] = [
  [1, 35],
  [2, 42],
  [3, 50],
  [4, 55],
  [5, 62],
  [6, 68],
  [7, 75],
];
export const ODD: [number, number] = [8, 10];
const PX = (h: number) => 190 + h * 82;
const PY = (sc: number) => 1250 - sc * 6.2;

// weighted least squares: the odd point counts with weight w (0 → ignored, 1 → a normal point)
export const fit = (w: number) => {
  const pts = [...PTS.map(([x, y]) => [x, y, 1]), [ODD[0], ODD[1], w]];
  const W = pts.reduce((a, p) => a + p[2], 0);
  const mx = pts.reduce((a, p) => a + p[0] * p[2], 0) / W;
  const my = pts.reduce((a, p) => a + p[1] * p[2], 0) / W;
  const sxy = pts.reduce((a, p) => a + p[2] * (p[0] - mx) * (p[1] - my), 0);
  const sxx = pts.reduce((a, p) => a + p[2] * (p[0] - mx) ** 2, 0);
  const b = sxy / sxx;
  return { b, a: my - b * mx };
};

export const S6Trend: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s6");
  const SEC = s.cueS(0, "Second,");
  const PTSW = s.sent(1).from;
  const RISE = s.cueS(1, "rising");
  const ADD = s.sent(2).from;
  const EIGHT = s.cueS(2, "8");
  const MISS = s.cueS(2, "missed");
  const FLAT = s.cueS(3, "flat,");
  const HELPS = s.cueS(3, "helps!");

  const axes = ease(frame, [4, 20], [0, 1], theme.ease.inOut);
  const draw = ease(frame, [RISE - 8, RISE + 12], [0, 1], theme.ease.inOut);
  const w = ease(frame, [FLAT - 14, FLAT + 10], [0, 1], theme.ease.inOut);
  const { a, b } = fit(w);
  const drop = ease(frame, [EIGHT - 4, EIGHT + 10], [0, 1], theme.ease.in);
  const sh = shake(frame, EIGHT + 10, 10, 8);
  const xa = 0.4;
  const xb = 8.6;
  const lx1 = interpolate(draw, [0, 1], [xa, xb]);
  const chip = spr(RISE + 6, theme.spring.bouncy);
  const slopeCol = w > 0.5 ? O : TL;

  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      <SceneTitle label="HOW OUTLIERS AFFECT ANALYSIS" pill="2 · TRENDS" color={O} at={-60} pillAt={SEC - 2} />

      {/* axes */}
      <div style={{ position: "absolute", left: PX(0), top: PY(0), width: (PX(9) - PX(0)) * axes, height: 4, borderRadius: 2, background: alpha(C.text, 0.4) }} />
      <div style={{ position: "absolute", left: PX(0) - 2, top: PY(100) + (PY(0) - PY(100)) * (1 - axes), width: 4, height: (PY(0) - PY(100)) * axes, borderRadius: 2, background: alpha(C.text, 0.4) }} />
      {[0, 2, 4, 6, 8].map((h) => (
        <div key={h} style={{ position: "absolute", left: PX(h), top: PY(0) + 30, transform: "translate(-50%, -50%)", fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 24, color: C.dim, opacity: axes }}>{h}</div>
      ))}
      {[0, 50, 100].map((v) => (
        <div key={v} style={{ position: "absolute", left: PX(0) - 20, top: PY(v), transform: "translate(-100%, -50%)", fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 24, color: C.dim, opacity: axes }}>{v}</div>
      ))}
      <div style={{ position: "absolute", left: (PX(0) + PX(9)) / 2, top: PY(0) + 72, transform: "translate(-50%, -50%)", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.22em", color: C.dim, opacity: axes, whiteSpace: "nowrap" }}>HOURS STUDIED</div>
      <div style={{ position: "absolute", left: PX(0) + 18, top: PY(100) - 6, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.22em", color: C.dim, opacity: axes, whiteSpace: "nowrap" }}>SCORE</div>

      {/* line of best fit */}
      {draw > 0.01 ? (
        <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <line x1={PX(xa)} y1={PY(a + b * xa)} x2={PX(lx1)} y2={PY(a + b * lx1)} stroke={w > 0.5 ? O : TL} strokeWidth={7} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 10px ${alpha(w > 0.5 ? O : TL, 0.8)})` }} />
          {w > 0.02 ? <line x1={PX(xa)} y1={PY(fit(0).a + fit(0).b * xa)} x2={PX(xb)} y2={PY(fit(0).a + fit(0).b * xb)} stroke={alpha(TL, 0.45)} strokeWidth={4} strokeDasharray="12 10" strokeLinecap="round" /> : null}
        </svg>
      ) : null}

      {/* the students */}
      {PTS.map(([h, sc], i) => {
        const p = spr(PTSW + 2 + i * 3, theme.spring.pop);
        if (p <= 0.001) return null;
        return <div key={i} style={{ position: "absolute", left: PX(h) - 16, top: PY(sc) - 16, width: 32, height: 32, borderRadius: 16, background: kindColor.data, boxShadow: `0 0 14px ${alpha(kindColor.data, 0.8)}`, transform: `scale(${p})` }} />;
      })}
      {drop > 0.001 ? (
        <div style={{ position: "absolute", left: PX(ODD[0]) - 18, top: interpolate(drop, [0, 1], [PY(100) - 60, PY(ODD[1])]) - 18, width: 36, height: 36, borderRadius: 18, background: O, boxShadow: `0 0 22px ${alpha(O, 0.9)}` }} />
      ) : null}
      <Ripple at={EIGHT + 10} x={PX(ODD[0])} y={PY(ODD[1])} color={O} size={260} rings={2} flat={0.5} />
      <Pop at={MISS - 4} x={PX(ODD[0]) - 150} y={PY(ODD[1]) - 70} from="right" dist={20} cfg={theme.spring.bouncy}>
        <div style={{ textAlign: "right", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 28, color: O, lineHeight: 1.15, whiteSpace: "nowrap", textShadow: glowText(O, 0.3) }}>
          8 HOURS, SCORE 10
          <div style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 22, color: C.text }}>missed the exam</div>
        </div>
      </Pop>

      {/* slope readout */}
      {chip > 0.01 ? (
        <div style={{ position: "absolute", left: 470, top: 668, transform: `translate(-50%, -50%) scale(${interpolate(chip, [0, 1], [0.5, 1])})`, opacity: Math.min(1, chip * 2), padding: "10px 22px", borderRadius: 18, background: alpha("#060B2A", 0.86), border: `3px solid ${slopeCol}`, boxShadow: `0 0 24px ${alpha(slopeCol, 0.35)}`, textAlign: "center" }}>
          <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 46, color: slopeCol, textShadow: glowText(slopeCol, 0.5), whiteSpace: "nowrap" }}>+{b.toFixed(1)}</div>
          <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 18, letterSpacing: "0.18em", color: C.dim, whiteSpace: "nowrap" }}>MARKS PER HOUR</div>
        </div>
      ) : null}
      <Pop at={HELPS - 6} x={540} y={560} from="down" dist={20} cfg={theme.spring.bouncy}>
        <Tag color={O} size={30}>
          ONE POINT BENT THE TREND
        </Tag>
      </Pop>
    </AbsoluteFill>
  );
};
