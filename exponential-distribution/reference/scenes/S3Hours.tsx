// SCENE 3 — HOUR BY HOUR. Four hour-long timelines fill with customers arriving at random moments (3, 5, 4, 2), each
// count spoken. Then 60 simulated hours drop into a histogram of counts → a shape appears.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { SceneTitle } from "../components/Kit";
import { ease, exitP, Pop, rng, useSpr } from "../components/Motion";
import { poisSamples } from "../components/Pois";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { EVT, RATE } from "./S1Hook";

const C = theme.colors;
const COUNTS = [3, 5, 4, 2];
const ROW_Y = [560, 690, 820, 950];
const LX0 = 260;
const LX1 = 860;
// arrival moments within each hour (0..1), deterministic
const TIMES = COUNTS.map((n, i) => {
  const r = rng(40 + i);
  return Array.from({ length: n }, () => r()).sort();
});
export const HOURS = poisSamples(4, 60, 2024);
const HB_BASE = 1300;
const HB_X0 = 170;
const HB_X1 = 910;
const DOT = 15;
const hbx = (k: number) => HB_X0 + ((k + 0.5) / 11) * (HB_X1 - HB_X0);
const SLOT = (() => {
  const c: Record<number, number> = {};
  return HOURS.map((k) => {
    c[k] = (c[k] ?? 0) + 1;
    return c[k] - 1;
  });
})();

export const S3Hours: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s3");
  const ARRIVE = s.sent(1).from;
  const countAt = [s.cueS(2, "three."), s.cueS(2, "five."), s.cueS(2, "four,"), s.cueS(2, "two.")];
  const MANY = s.sent(3).from;
  const rowsOut = exitP(frame, MANY + 30, 12);

  return (
    <AbsoluteFill>
      <SceneTitle label="HOUR BY HOUR" color={EVT} at={2} />
      {rowsOut < 1
        ? COUNTS.map((n, i) => {
            const y = ROW_Y[i];
            const line = ease(frame, [6 + i * 4, 18 + i * 4], [0, 1]);
            const start = i === 0 ? ARRIVE : countAt[i] - 16;
            return (
              <div key={i} style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, opacity: 1 - rowsOut }}>
                <div style={{ position: "absolute", left: 110, top: y, transform: "translateY(-50%)", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.14em", color: C.dim, opacity: line }}>HOUR {i + 1}</div>
                <div style={{ position: "absolute", left: LX0, top: y - 2, width: (LX1 - LX0) * line, height: 4, borderRadius: 2, background: alpha(C.text, 0.4) }} />
                {TIMES[i].map((t, j) => {
                  const p = spr(start + Math.round(t * 14), theme.spring.pop);
                  return p > 0.001 ? <div key={j} style={{ position: "absolute", left: LX0 + t * (LX1 - LX0) - 14, top: y - 14, width: 28, height: 28, borderRadius: 14, background: EVT, boxShadow: `0 0 12px ${EVT}`, transform: `scale(${p})` }} /> : null;
                })}
                {(() => {
                  const p = spr(countAt[i] - 2, theme.spring.pop);
                  return p > 0.01 ? <div style={{ position: "absolute", left: 930, top: y, transform: `translate(-50%, -50%) scale(${interpolate(p, [0, 1], [0.5, 1])})`, width: 70, height: 70, borderRadius: 35, background: alpha(RATE, 0.25), border: `3px solid ${RATE}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 38, color: C.text }}>{n}</div> : null;
                })()}
              </div>
            );
          })
        : null}
      <Pop at={ARRIVE + 2} out={MANY - 4} x={540} y={430} from="up" dist={14}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 44, color: C.text, whiteSpace: "nowrap" }}>
          CUSTOMERS ARRIVE <span style={{ color: EVT, textShadow: glowText(EVT, 0.5) }}>AT RANDOM</span>
        </div>
      </Pop>
      {/* many hours → a shape */}
      {frame >= MANY - 4 ? (
        <>
          <Pop at={MANY} x={540} y={430} from="up" dist={14} cfg={theme.spring.bouncy}>
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 48, color: C.text, whiteSpace: "nowrap" }}>
              <span style={{ color: RATE }}>60 HOURS</span> OF COUNTS
            </div>
          </Pop>
          <div style={{ position: "absolute", left: HB_X0 - 10, top: HB_BASE + 1, width: (HB_X1 - HB_X0 + 20) * ease(frame, [MANY, MANY + 10], [0, 1]), height: 4, background: alpha(C.text, 0.4) }} />
          {Array.from({ length: 11 }, (_, k) => (
            <div key={k} style={{ position: "absolute", left: hbx(k), top: HB_BASE + 30, transform: "translate(-50%, -50%)", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 22, color: C.dim, opacity: ease(frame, [MANY + 4, MANY + 14], [0, 1]) }}>{k}</div>
          ))}
          <div style={{ position: "absolute", left: 0, right: 0, top: HB_BASE + 70, textAlign: "center", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.18em", color: C.dim, opacity: ease(frame, [MANY + 4, MANY + 14], [0, 1]) }}>CUSTOMERS IN AN HOUR</div>
          {HOURS.map((k, i) => {
            if (k > 10) return null;
            const t = MANY + 4 + i * 1.2;
            const d = ease(frame, [t, t + 8], [0, 1], theme.ease.in);
            if (d <= 0.001) return null;
            const y = HB_BASE - (SLOT[i] + 0.5) * (DOT + 2);
            return <div key={i} style={{ position: "absolute", left: hbx(k) - DOT / 2, top: interpolate(d, [0, 1], [600, y - DOT / 2]), width: DOT, height: DOT, borderRadius: DOT / 2, background: EVT, boxShadow: `0 0 6px ${alpha(EVT, 0.8)}` }} />;
          })}
        </>
      ) : null}
    </AbsoluteFill>
  );
};
