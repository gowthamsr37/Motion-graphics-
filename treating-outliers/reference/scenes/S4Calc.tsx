// SCENE 4 — HOW TO CALCULATE, step by step on the commute data (a 4-step tracker in the header).
// 1 sort the ten cards · 2 median halfway between 25 and 27 = 26 · 3 split into halves · Q1 = 22, Q3 = 30 · 4 30 − 22 = 8 min.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { SceneTitle } from "../components/Kit";
import { Burst, ease, Mark, Pop, Ripple, useSpr } from "../components/Motion";
import { Pill } from "../components/Nodes";
import { COMMUTE, SORTED } from "../data";
import { alpha, glowText, kindColor, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const V = kindColor.spread;
const QC = C.cyan;
const MC = kindColor.median;
const CY = 830;
const CX = (j: number) => 153 + j * 86;
// stable sort: display index → sorted slot
const SLOT = (() => {
  const idx = COMMUTE.map((v, i) => ({ v, i })).sort((a, b) => a.v - b.v || a.i - b.i);
  const slot: number[] = [];
  idx.forEach((o, j) => (slot[o.i] = j));
  return slot;
})();
const STEPS = ["SORT", "MEDIAN", "SPLIT", "SUBTRACT"];

export const S4Calc: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s4");
  const SORTW = s.cueS(0, "sort");
  const MEDS = s.sent(1).from;
  const C25 = s.cueS(1, "25");
  const C26 = s.cueS(1, "26.");
  const SPLIT = s.sent(2).from;
  const Q1N = s.cueS(3, "Q1:");
  const Q1W = s.cueS(3, "22.");
  const Q3N = s.cueS(4, "Q3:");
  const Q3W = s.cueS(4, "30.");
  const SUB = s.sent(5).from;
  const E30 = s.cueS(5, "30");
  const E22 = s.cueS(5, "22");
  const E8 = s.cueS(5, "8");
  const stepAt = [s.sent(0).from + 20, MEDS, SPLIT, SUB];
  const active = stepAt.filter((a) => frame >= a - 4).length - 1;

  const split = ease(frame, [SPLIT + 6, SPLIT + 20], [0, 1], theme.ease.inOut);
  const medMark = ease(frame, [C26 - 6, C26 + 6], [0, 1], theme.ease.out);
  const halves = ease(frame, [SPLIT + 12, SPLIT + 26], [0, 1], theme.ease.inOut);

  return (
    <AbsoluteFill>
      <SceneTitle label="HOW TO CALCULATE IT" color={V} at={2} />
      {/* step tracker */}
      {STEPS.map((st, k) => {
        const p = spr(4 + k * 3, theme.spring.pop);
        const isOn = k === active;
        const done = k < active;
        const col = isOn ? V : done ? MC : alpha(C.text, 0.4);
        return (
          <div key={st} style={{ position: "absolute", left: 222 + k * 212, top: 372, transform: `translate(-50%, -50%) scale(${interpolate(p, [0, 1], [0.6, 1]) * (isOn ? 1.08 : 1)})`, opacity: Math.min(1, p * 2) * (isOn || done ? 1 : 0.55), display: "flex", alignItems: "center", gap: 10, padding: "8px 16px 8px 8px", borderRadius: 999, background: isOn ? alpha(V, 0.22) : "rgba(14,24,64,0.8)", border: `2.5px solid ${col}`, boxShadow: isOn ? `0 0 22px ${alpha(V, 0.45)}` : "none" }}>
            <div style={{ width: 34, height: 34, borderRadius: 17, background: col, color: C.ink, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 20 }}>{done ? <Mark kind="check" at={stepAt[k + 1] - 4} size={24} color={C.ink} width={14} /> : k + 1}</div>
            <span style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 22, color: C.text, whiteSpace: "nowrap" }}>{st}</span>
          </div>
        );
      })}

      {/* median marker */}
      {medMark > 0.01 ? (
        <>
          <div style={{ position: "absolute", left: 538, top: CY - 80, height: 160 * medMark, borderLeft: `5px solid ${MC}`, filter: `drop-shadow(0 0 8px ${alpha(MC, 0.8)})` }} />
          <div style={{ position: "absolute", left: 540, top: CY - 118, transform: `translate(-50%, -50%) scale(${interpolate(medMark, [0, 1], [0.5, 1])})`, opacity: medMark }}>
            <Pill label="MEDIAN 26" color={MC} size={28} glow={0.6} />
          </div>
        </>
      ) : null}
      <Pop at={C25 - 2} out={C26 - 4} x={540} y={CY - 118} from="down" dist={14}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: MC, whiteSpace: "nowrap" }}>(25 + 27) ÷ 2</div>
      </Pop>

      {/* the ten cards */}
      {COMMUTE.map((v, i) => {
        const p = spr(4 + i * 2, theme.spring.bouncy);
        if (p <= 0.001) return null;
        const j = SLOT[i];
        const t = ease(frame, [SORTW + j * 1.5, SORTW + 16 + j * 1.5], [0, 1], theme.ease.inOut);
        const lowHalf = j < 5;
        const x = interpolate(t, [0, 1], [CX(i), CX(j)]) + (lowHalf ? -22 : 22) * split;
        const y = CY - 70 * Math.sin(Math.PI * t) * (j % 2 ? 1 : -0.6);
        const isMed = (j === 4 || j === 5) && frame >= C25 - 2;
        const isQ = (j === 2 && frame >= Q1N - 2) || (j === 7 && frame >= Q3N - 2);
        const col = isQ ? QC : isMed && frame < SPLIT + 10 ? MC : C.edge;
        const dimOut = frame >= SPLIT + 12 && !isQ ? 0.7 : 1;
        return (
          <div key={i} style={{ position: "absolute", left: x - 40, top: y - 50, width: 80, height: 100, boxSizing: "border-box", borderRadius: 16, background: isQ ? alpha(QC, 0.22) : `linear-gradient(180deg, ${C.panelHi}, ${C.panel})`, border: `2.5px solid ${col}`, boxShadow: isQ ? `0 0 24px ${alpha(QC, 0.55)}` : "0 14px 26px -16px rgba(0,0,0,0.8)", opacity: Math.min(1, p * 2) * dimOut, transform: `translateY(${(1 - p) * 40}px) scale(${interpolate(p, [0, 1], [0.6, 1]) * (isQ ? 1.08 : 1)})`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: Math.round(t * 10) }}>
            <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 38, color: isQ ? QC : C.text, lineHeight: 1 }}>{v}</div>
            <div style={{ marginTop: 4, fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 15, color: C.dim }}>min</div>
          </div>
        );
      })}
      <Pop at={SORTW + 20} out={MEDS - 4} x={540} y={CY + 90} from="up" dist={14}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.22em", color: C.dim, whiteSpace: "nowrap" }}>SMALLEST TO LARGEST</div>
      </Pop>

      {/* halves */}
      {halves > 0.01
        ? [
            { a: CX(0) - 22, b: CX(4) - 22, label: "LOWER HALF" },
            { a: CX(5) + 22, b: CX(9) + 22, label: "UPPER HALF" },
          ].map((h) => (
            <React.Fragment key={h.label}>
              <div style={{ position: "absolute", left: h.a - 40, top: CY + 64, width: (h.b - h.a + 80) * halves, height: 16, borderLeft: `4px solid ${alpha(C.text, 0.6)}`, borderRight: halves > 0.97 ? `4px solid ${alpha(C.text, 0.6)}` : undefined, borderBottom: `4px solid ${alpha(C.text, 0.6)}`, borderRadius: "0 0 8px 8px" }} />
              <div style={{ position: "absolute", left: (h.a + h.b) / 2, top: CY + 106, transform: "translate(-50%, -50%)", opacity: halves, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.2em", color: C.dim, whiteSpace: "nowrap" }}>{h.label}</div>
            </React.Fragment>
          ))
        : null}
      {/* Q1 and Q3 */}
      {[
        { at: Q1W - 4, x: CX(2) - 22, label: "Q1 = 22", sub: "middle of the lower half" },
        { at: Q3W - 4, x: CX(7) + 22, label: "Q3 = 30", sub: "middle of the upper half" },
      ].map((q) => (
        <Pop key={q.label} at={q.at} x={q.x} y={CY + 184} from="up" dist={20} cfg={theme.spring.bouncy}>
          <div style={{ textAlign: "center" }}>
            <Pill label={q.label} color={QC} size={32} glow={0.7} />
            <div style={{ marginTop: 10, fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 20, color: alpha(QC, 0.95), whiteSpace: "nowrap" }}>{q.sub}</div>
          </div>
        </Pop>
      ))}
      <Ripple at={Q1N} x={CX(2) - 22} y={CY} color={QC} size={220} rings={1} />
      <Ripple at={Q3N} x={CX(7) + 22} y={CY} color={QC} size={220} rings={1} />

      {/* step 4: subtract */}
      {(() => {
        const p = spr(SUB - 2, theme.spring.bouncy);
        if (p <= 0.001) return null;
        const a = spr(E30 - 3, theme.spring.pop);
        const b = spr(E22 - 3, theme.spring.pop);
        const c = spr(E8 - 3, theme.spring.pop);
        return (
          <div style={{ position: "absolute", left: 540, top: 1210, transform: `translate(-50%, -50%) scale(${interpolate(p, [0, 1], [0.6, 1])})`, opacity: Math.min(1, p * 2), display: "flex", alignItems: "center", gap: 18, padding: "16px 32px", borderRadius: 26, background: alpha("#060B2A", 0.88), border: `3px solid ${V}`, boxShadow: `0 0 30px ${alpha(V, 0.4)}`, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 58, color: C.text, whiteSpace: "nowrap" }}>
            <span style={{ color: V }}>IQR</span>
            <span>=</span>
            <span style={{ color: QC, opacity: a, transform: `scale(${interpolate(a, [0, 1], [1.5, 1])})`, display: "inline-block" }}>30</span>
            <span style={{ opacity: b }}>-</span>
            <span style={{ color: QC, opacity: b, transform: `scale(${interpolate(b, [0, 1], [1.5, 1])})`, display: "inline-block" }}>22</span>
            <span style={{ opacity: c }}>=</span>
            <span style={{ color: V, opacity: c, transform: `scale(${interpolate(c, [0, 1], [1.8, 1])})`, display: "inline-block", textShadow: glowText(V, 0.8) }}>8</span>
            <span style={{ fontSize: 28, color: C.dim, opacity: c }}>MIN</span>
          </div>
        );
      })()}
      <Burst at={E8} x={700} y={1210} color={V} count={18} radius={220} seed={5} />
    </AbsoluteFill>
  );
};
