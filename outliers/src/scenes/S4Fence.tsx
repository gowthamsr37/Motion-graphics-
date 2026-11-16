// SCENE 4 — SPOTTING THEM: the IQR fence rule. Eleven test scores drop onto a line. The box plot builds above them:
// Q1 = 50, Q3 = 62 → IQR 12. Step 1.5 × 12 = 18 beyond each end → fences at 32 and 80. 95 is beyond the fence: outlier.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Fence, SceneTitle } from "../components/Kit";
import { Burst, ease, exitP, Pop, Ripple, useSpr } from "../components/Motion";
import { Tag } from "../components/Nodes";
import { alpha, glowText, kindColor, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const O = kindColor.outlier;
const V = kindColor.spread;
// sorted: Q1 = median of the lower five = 50, median = 58, Q3 = median of the upper five = 62
export const SCORES = [40, 45, 50, 54, 54, 58, 58, 58, 62, 66, 95];
const ORDER = [5, 1, 9, 3, 7, 0, 10, 4, 8, 2, 6]; // drop-in order
const Q1 = 50;
const Q3 = 62;
const MED = 58;
const LO = 32;
const HI = 80;
const LINE = 1130;
const BOX_Y = 900;
const X = (v: number) => 110 + (v - 20) * 10.75;
const stackOf = (i: number) => SCORES.slice(0, i).filter((v) => v === SCORES[i]).length;

export const S4Fence: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s4");
  const IQRW = s.cueS(0, "IQR");
  const SC = s.sent(1).from;
  const MID = s.sent(2).from;
  const C50 = s.cueS(2, "50");
  const C62 = s.cueS(2, "62.");
  const IQR12 = s.cueS(2, "12.");
  const STEP = s.sent(3).from;
  const C18 = s.cueS(3, "18,");
  const FEN = s.sent(4).from;
  const C32 = s.cueS(4, "32");
  const C80 = s.cueS(4, "80.");
  const JUMP = s.sent(5).from;
  const OUTW = s.cueS(5, "Outlier!");

  const ax = ease(frame, [SC - 6, SC + 10], [0, 1], theme.ease.inOut);
  const box = spr(C50 - 4, theme.spring.bouncy);
  const boxW = ease(frame, [C50 - 2, C62 + 2], [0, 1], theme.ease.inOut);
  const med = ease(frame, [C62 + 4, C62 + 12], [0, 1]);
  const steps = ease(frame, [C18 - 10, C18 + 10], [0, 1], theme.ease.inOut);
  const stepsOut = exitP(frame, JUMP + 10, 10);
  const whisk = ease(frame, [JUMP + 14, JUMP + 26], [0, 1], theme.ease.inOut);
  const hop = ease(frame, [JUMP - 2, JUMP + 14], [0, 1], theme.ease.soft);
  const isOut = frame >= JUMP + 6;
  const midLit = frame >= C50 && frame < STEP;

  return (
    <AbsoluteFill>
      <SceneTitle label="HOW TO SPOT ONE" pill="IQR FENCE RULE" color={V} at={SC - 10} pillAt={SC - 6} />
      <Pop at={4} out={SC - 12} x={540} y={640} from="up" dist={24} cfg={theme.spring.bouncy}>
        <div style={{ textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 84, lineHeight: 1.04, color: C.text, whiteSpace: "nowrap" }}>
          HOW DO YOU
          <br />
          <span style={{ color: O, textShadow: glowText(O, 0.6) }}>SPOT</span> ONE?
        </div>
      </Pop>
      <Pop at={IQRW - 2} out={SC - 12} x={540} y={850} from="scale" scaleFrom={0.4} cfg={theme.spring.pop}>
        <Tag color={V} size={34}>
          THE IQR FENCE RULE
        </Tag>
      </Pop>

      {/* number line */}
      <div style={{ position: "absolute", left: X(20) - 20, top: LINE - 2, width: (X(100) - X(20) + 40) * ax, height: 4, borderRadius: 2, background: alpha(C.text, 0.35) }} />
      {[20, 40, 60, 80, 100].map((v) => (
        <div key={v} style={{ position: "absolute", left: X(v), top: LINE + 42, transform: "translate(-50%, -50%)", fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 24, color: C.dim, opacity: ax }}>{v}</div>
      ))}
      <Pop at={SC + 4} out={C50 - 6} x={540} y={LINE - 130} from="down" dist={16}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 26, letterSpacing: "0.22em", color: C.dim }}>11 TEST SCORES</div>
      </Pop>

      {/* the box: Q1 to Q3 */}
      {box > 0.01 ? (
        <>
          <div style={{ position: "absolute", left: X(Q1), top: BOX_Y - 48, width: (X(Q3) - X(Q1)) * boxW, height: 96, boxSizing: "border-box", borderRadius: 12, background: alpha(V, 0.24), border: `4px solid ${V}`, boxShadow: `0 0 30px ${alpha(V, 0.45)}`, opacity: Math.min(1, box * 2) }} />
          <div style={{ position: "absolute", left: X(MED) - 2, top: BOX_Y - 48, height: 96 * med, borderLeft: `4px solid ${alpha(C.text, 0.9)}` }} />
          {/* guides from the box down to the dots */}
          <div style={{ position: "absolute", left: X(Q1) - 1, top: BOX_Y + 48, height: (LINE - BOX_Y - 70) * boxW, borderLeft: `2px dotted ${alpha(V, 0.7)}` }} />
          <div style={{ position: "absolute", left: X(Q3) - 1, top: BOX_Y + 48, height: (LINE - BOX_Y - 70) * med, borderLeft: `2px dotted ${alpha(V, 0.7)}` }} />
        </>
      ) : null}
      <Pop at={C50 - 2} x={X(Q1) - 6} y={BOX_Y - 84} from="down" dist={14}>
        <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 28, color: C.text, whiteSpace: "nowrap" }}>
          <span style={{ color: V }}>Q1</span> 50
        </div>
      </Pop>
      <Pop at={C62 - 2} x={X(Q3) + 6} y={BOX_Y - 84} from="down" dist={14}>
        <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 28, color: C.text, whiteSpace: "nowrap" }}>
          <span style={{ color: V }}>Q3</span> 62
        </div>
      </Pop>
      <Pop at={IQR12 - 4} out={STEP - 4} x={(X(Q1) + X(Q3)) / 2} y={BOX_Y - 150} from="down" dist={16} cfg={theme.spring.bouncy}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 44, color: V, textShadow: glowText(V, 0.6), whiteSpace: "nowrap" }}>IQR = 12</div>
          <div style={{ margin: "6px auto 0", width: X(Q3) - X(Q1), height: 16, borderLeft: `4px solid ${V}`, borderRight: `4px solid ${V}`, borderTop: `4px solid ${V}`, borderRadius: "8px 8px 0 0" }} />
        </div>
      </Pop>

      {/* step out 1.5 × IQR = 18 on each side */}
      <Pop at={STEP - 2} out={FEN + 4} x={540} y={640} from="up" dist={20} cfg={theme.spring.bouncy}>
        <div style={{ padding: "12px 26px", borderRadius: 20, background: alpha("#060B2A", 0.86), border: `3px solid ${V}`, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 44, color: C.text, whiteSpace: "nowrap" }}>
          1.5 × 12 = <span style={{ color: V, textShadow: glowText(V, 0.6) }}>18</span>
        </div>
      </Pop>
      {steps > 0.01 && stepsOut < 1
        ? [
            { from: X(Q1), to: X(LO) },
            { from: X(Q3), to: X(HI) },
          ].map((a, i) => {
            const end = interpolate(steps, [0, 1], [a.from, a.to]);
            const dir = Math.sign(a.to - a.from);
            return (
              <React.Fragment key={i}>
                <svg width={1080} height={60} viewBox="0 0 1080 60" style={{ position: "absolute", left: 0, top: BOX_Y - 30, overflow: "visible", opacity: 1 - stepsOut }}>
                  <line x1={a.from} y1={30} x2={end} y2={30} stroke={V} strokeWidth={5} strokeDasharray="12 8" strokeLinecap="round" />
                  <path d={`M${end - dir * 16} 16 L${end} 30 L${end - dir * 16} 44`} stroke={V} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div style={{ position: "absolute", left: (a.from + a.to) / 2, top: BOX_Y - 34, transform: "translate(-50%, -50%)", opacity: steps * (1 - stepsOut), fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 30, color: C.text }}>{i === 0 ? "-18" : "+18"}</div>
              </React.Fragment>
            );
          })
        : null}

      {/* the fences */}
      <Fence x={X(LO)} y0={BOX_Y - 110} y1={LINE + 20} p={ease(frame, [C32 - 6, C32 + 8], [0, 1], theme.ease.out)} color={C.text} label="32" />
      <Fence x={X(HI)} y0={BOX_Y - 110} y1={LINE + 20} p={ease(frame, [C80 - 6, C80 + 8], [0, 1], theme.ease.out)} color={C.text} label="80" />

      {/* whiskers: the box plot completes */}
      {whisk > 0.01 ? (
        <>
          {[
            { a: X(Q1), b: X(40) },
            { a: X(Q3), b: X(66) },
          ].map((w, i) => (
            <React.Fragment key={i}>
              <div style={{ position: "absolute", left: Math.min(w.a, w.a + (w.b - w.a) * whisk), top: BOX_Y - 2, width: Math.abs(w.b - w.a) * whisk, height: 4, background: V }} />
              <div style={{ position: "absolute", left: w.b - 2, top: BOX_Y - 22, width: 4, height: 44, background: V, opacity: whisk > 0.95 ? 1 : 0 }} />
            </React.Fragment>
          ))}
          <div style={{ position: "absolute", left: X(95) - 12, top: BOX_Y - 12, width: 24, height: 24, borderRadius: 12, background: O, boxShadow: `0 0 16px ${O}`, transform: `scale(${spr(JUMP + 24, theme.spring.pop)})` }} />
        </>
      ) : null}

      {/* the scores */}
      {SCORES.map((v, i) => {
        const k = ORDER.indexOf(i);
        const p = spr(SC + 2 + k * 3, theme.spring.pop);
        if (p <= 0.001) return null;
        const outlier = i === SCORES.length - 1;
        const y = LINE - stackOf(i) * 34 - (outlier ? 70 * Math.sin(Math.PI * hop) : 0);
        const inMid = v >= Q1 && v <= Q3;
        const col = outlier && isOut ? O : "#E4EEFF";
        const dim = midLit && !inMid ? 0.4 : 1;
        return <div key={i} style={{ position: "absolute", left: X(v) - 15, top: y - 15 - (1 - p) * 80, width: 30, height: 30, borderRadius: 15, background: col, boxShadow: `0 0 14px ${alpha(col, 0.8)}`, opacity: Math.min(1, p * 2) * dim, zIndex: 3 }} />;
      })}
      <Ripple at={JUMP + 12} x={X(95)} y={LINE} color={O} size={260} rings={2} flat={0.4} />
      <Burst at={OUTW} x={X(95)} y={LINE} color={O} count={14} radius={140} seed={4} />
      <Pop at={OUTW - 3} x={872} y={LINE - 90} from="down" dist={20} cfg={theme.spring.bouncy}>
        <Tag color={O} size={32}>
          OUTLIER!
        </Tag>
      </Pop>
    </AbsoluteFill>
  );
};
