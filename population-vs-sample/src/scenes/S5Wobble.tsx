// SCENE 5 — SAMPLES WOBBLE. A height axis with the TRUE MEAN (165 cm, green). Six samples of 5 people: their means land
// all over (162.8 … 171.4) → they wobble around the truth. Six samples of 50: the means cluster (164.9 … 166.2) → less wobble.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { SceneTitle } from "../components/Kit";
import { ease, Pop, useSpr } from "../components/Motion";
import { meanOf, normals } from "../components/Sampling";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { SAMP, TRUTH } from "./S1Hook";

const C = theme.colors;
const AX0 = 150;
const AX1 = 180;
const X0 = 130;
const X1 = 950;
const ax = (v: number) => X0 + ((v - AX0) / (AX1 - AX0)) * (X1 - X0);
export const SMALL = [0, 1, 2, 3, 4, 5].map((k) => normals(3000 + k, 5, 165, 7));
export const BIG = [0, 1, 2, 3, 4, 5].map((k) => normals(40000 + k, 50, 165, 7));
const M5 = SMALL.map(meanOf);
const M50 = BIG.map(meanOf);
const ROWS = [
  { y: 760, label: "SAMPLES OF 5", means: M5, data: SMALL },
  { y: 1110, label: "SAMPLES OF 50", means: M50, data: BIG },
];

const Row: React.FC<{ y: number; label: string; means: number[]; data: number[][]; t0: number; gap: number; spanAt: number; spanLabel: string; spanColor: string }> = ({ y, label, means, data, t0, gap, spanAt, spanLabel, spanColor }) => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const line = ease(frame, [t0 - 12, t0], [0, 1]);
  const lo = Math.min(...means);
  const hi = Math.max(...means);
  const span = ease(frame, [spanAt - 4, spanAt + 12], [0, 1], theme.ease.inOut);
  return (
    <>
      <div style={{ position: "absolute", left: X0, top: y - 140, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.2em", color: C.dim, opacity: line }}>{label}</div>
      <div style={{ position: "absolute", left: X0 - 10, top: y - 2, width: (X1 - X0 + 20) * line, height: 4, borderRadius: 2, background: alpha(C.text, 0.4) }} />
      {[150, 155, 160, 165, 170, 175, 180].map((v) => (
        <div key={v} style={{ position: "absolute", left: ax(v), top: y + 30, transform: "translate(-50%, -50%)", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 22, color: v === 165 ? TRUTH : C.dim, opacity: line }}>{v}</div>
      ))}
      {means.map((m, k) => {
        const t = t0 + k * gap;
        const flash = ease(frame, [t - 8, t], [0, 1]) * (1 - ease(frame, [t + 4, t + 16], [0, 1]));
        const p = spr(t - 2, theme.spring.pop);
        return (
          <React.Fragment key={k}>
            {flash > 0.01
              ? data[k].slice(0, 12).map((v, j) => <div key={j} style={{ position: "absolute", left: ax(Math.max(AX0, Math.min(AX1, v))) - 6, top: y - 70 - (j % 3) * 14, width: 12, height: 12, borderRadius: 6, background: alpha(SAMP, 0.7), opacity: flash }} />)
              : null}
            {p > 0.01 ? <div style={{ position: "absolute", left: ax(m) - 4, top: y - 46 * p, width: 8, height: 46 * p, borderRadius: 4, background: SAMP, boxShadow: `0 0 10px ${SAMP}` }} /> : null}
          </React.Fragment>
        );
      })}
      {span > 0.01 ? (
        <>
          <div style={{ position: "absolute", left: ax(lo), top: y - 92, width: (ax(hi) - ax(lo)) * span, height: 5, borderRadius: 3, background: spanColor }} />
          <div style={{ position: "absolute", left: ax(lo) - 2, top: y - 104, width: 4, height: 28, background: spanColor, opacity: span }} />
          <div style={{ position: "absolute", left: ax(lo) + (ax(hi) - ax(lo)) * span - 2, top: y - 104, width: 4, height: 28, background: spanColor }} />
          <div style={{ position: "absolute", left: (ax(lo) + ax(hi)) / 2, top: y - 120, transform: `translate(-50%, -50%) scale(${interpolate(span, [0, 1], [0.6, 1])})`, opacity: span, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 28, color: spanColor, whiteSpace: "nowrap" }}>{spanLabel}</div>
        </>
      ) : null}
    </>
  );
};

export const S5Wobble: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s5");
  const ANOTHER = s.cueS(0, "another");
  const WOB = s.sent(1).from;
  const BIGGER = s.sent(2).from;
  const LESS = s.cueS(2, "less,");

  return (
    <AbsoluteFill>
      <SceneTitle label="SAMPLES WOBBLE" color={SAMP} at={2} />
      <Pop at={6} x={540} y={430} from="up" dist={14}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text, whiteSpace: "nowrap" }}>
          EACH <span style={{ color: SAMP }}>|</span> IS ONE SAMPLE&apos;S MEAN
        </div>
      </Pop>
      {/* the truth */}
      <div style={{ position: "absolute", left: ax(165) - 2, top: 560, height: 680 * ease(frame, [4, 20], [0, 1]), borderLeft: `4px dashed ${TRUTH}` }} />
      <Pop at={8} x={ax(165)} y={530} from="down" dist={10}>
        <div style={{ padding: "4px 16px", borderRadius: 999, background: alpha(TRUTH, 0.2), border: `2px solid ${TRUTH}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 24, color: C.text, whiteSpace: "nowrap" }}>TRUE MEAN 165</div>
      </Pop>
      <Row {...ROWS[0]} t0={ANOTHER - 6} gap={14} spanAt={WOB + 4} spanLabel="BIG WOBBLE" spanColor={C.orange} />
      {frame >= BIGGER - 14 ? <Row {...ROWS[1]} t0={BIGGER - 2} gap={7} spanAt={LESS} spanLabel="LESS WOBBLE" spanColor={TRUTH} /> : null}
      <Pop at={LESS + 10} x={540} y={1300} from="up" dist={16} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text, whiteSpace: "nowrap" }}>
          BIGGER SAMPLE = <span style={{ color: TRUTH, textShadow: glowText(TRUTH, 0.5) }}>BETTER GUESS</span>
        </div>
      </Pop>
    </AbsoluteFill>
  );
};
