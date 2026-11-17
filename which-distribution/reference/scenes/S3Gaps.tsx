// SCENE 3 — THE GAPS. One timeline of customers: 4 an hour means a gap of 15 minutes on average (dashed ticks), but
// the real gaps vary: 6, 22, 3, 31 min. Then 80 simulated gaps drop into 5-minute columns → a falling shape appears.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { expSamples } from "../components/Exp";
import { SceneTitle } from "../components/Kit";
import { ease, Pop, useSpr } from "../components/Motion";
import { Pill } from "../components/Nodes";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { GAP, LONG, RATE, SHORT } from "./S1Hook";

const C = theme.colors;
const TL_Y = 650;
const TL_X0 = 130;
const TL_X1 = 950;
const TMAX = 64;
const tlx = (t: number) => TL_X0 + (t / TMAX) * (TL_X1 - TL_X0);
const ARRIVALS = [0, 6, 28, 31, 62]; // gaps 6, 22, 3, 31 (mean 15.5)
// 80 seeded waits with a mean of 15 min (seed checked: 63% under 15 min, columns fall steadily)
export const WAITS = expSamples(15, 80, 99);
const HB_BASE = 1250;
const HB_X0 = 150;
const HB_X1 = 930;
const BW = (HB_X1 - HB_X0) / 12;
const DOT = 15;
const SLOT = (() => {
  const c: Record<number, number> = {};
  return WAITS.map((w) => {
    const k = Math.floor(w / 5);
    c[k] = (c[k] ?? 0) + 1;
    return c[k] - 1;
  });
})();

export const S3Gaps: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s3");
  const AVG = s.sent(1).from;
  const FIFTEEN = s.cueS(1, "15");
  const VARY = s.sent(2).from;
  const gapAt = [s.cueS(2, "6"), s.cueS(2, "22"), s.cueS(2, "3"), s.cueS(2, "31.")];
  const MANY = s.sent(3).from;
  const line = ease(frame, [4, 20], [0, 1]);
  const ghost = ease(frame, [FIFTEEN - 4, FIFTEEN + 6], [0, 1]) * (1 - ease(frame, [VARY, VARY + 10], [0, 1]));
  const dimTl = 1 - 0.45 * ease(frame, [MANY, MANY + 12], [0, 1]);
  const axis = ease(frame, [MANY + 2, MANY + 14], [0, 1]);

  return (
    <AbsoluteFill>
      <SceneTitle label="THE GAPS" color={GAP} at={2} />
      {/* one timeline of arrivals */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, opacity: dimTl }}>
        <div style={{ position: "absolute", left: TL_X0, top: TL_Y - 2, width: (TL_X1 - TL_X0) * line, height: 4, borderRadius: 2, background: alpha(C.text, 0.4) }} />
        {/* the "on average" spacing: a dashed tick every 15 min */}
        {[15, 30, 45, 60].map((t) =>
          ghost > 0.01 ? (
            <React.Fragment key={t}>
              <div style={{ position: "absolute", left: tlx(t) - 2, top: TL_Y - 34, width: 4, height: 68, opacity: ghost, background: `repeating-linear-gradient(180deg, ${RATE} 0 8px, transparent 8px 14px)` }} />
              <div style={{ position: "absolute", left: tlx(t), top: TL_Y + 58, transform: "translate(-50%, -50%)", opacity: ghost, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 24, color: RATE }}>{t}</div>
            </React.Fragment>
          ) : null,
        )}
        {ARRIVALS.map((t, i) => {
          const p = spr(8 + i * 7, theme.spring.pop);
          return p > 0.001 ? <div key={i} style={{ position: "absolute", left: tlx(t) - 16, top: TL_Y - 16, width: 32, height: 32, borderRadius: 16, background: GAP, boxShadow: `0 0 14px ${GAP}`, transform: `scale(${p})` }} /> : null;
        })}
        {/* the real gaps */}
        {[0, 1, 2, 3].map((i) => {
          const a = ARRIVALS[i];
          const b = ARRIVALS[i + 1];
          const len = b - a;
          const c = len < 15 ? SHORT : LONG;
          const p = spr(gapAt[i] - 4, theme.spring.bouncy);
          if (p <= 0.001) return null;
          const x0 = tlx(a) + 6;
          const x1 = tlx(b) - 6;
          return (
            <React.Fragment key={i}>
              <div style={{ position: "absolute", left: x0, top: TL_Y - 52, width: (x1 - x0) * Math.min(1, p), height: 18, boxSizing: "border-box", borderTop: `5px solid ${c}`, borderLeft: `5px solid ${c}`, borderRight: p > 0.9 ? `5px solid ${c}` : "none", borderRadius: "6px 6px 0 0" }} />
              <div style={{ position: "absolute", left: (x0 + x1) / 2, top: TL_Y - 84, transform: `translate(-50%, -50%) scale(${interpolate(p, [0, 1], [0.5, 1])})`, opacity: Math.min(1, p * 2), fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 34, color: c, textShadow: glowText(c, 0.4), whiteSpace: "nowrap" }}>
                {len}
                {i === 0 ? <span style={{ fontSize: 22 }}> MIN</span> : null}
              </div>
            </React.Fragment>
          );
        })}
      </div>
      <Pop at={AVG - 2} out={VARY - 4} x={540} y={430} from="up" dist={14} cfg={theme.spring.bouncy}>
        <Pill label="AVERAGE GAP = 15 MIN" color={RATE} size={32} glow={0.4} />
      </Pop>
      <Pop at={VARY + 2} out={MANY - 4} x={540} y={430} from="up" dist={14}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 46, color: C.text, whiteSpace: "nowrap" }}>
          REAL GAPS <span style={{ color: LONG, textShadow: glowText(LONG, 0.5) }}>VARY</span>
        </div>
      </Pop>
      {/* many gaps → a shape */}
      {frame >= MANY - 4 ? (
        <>
          <Pop at={MANY} x={540} y={430} from="up" dist={14} cfg={theme.spring.bouncy}>
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 46, color: C.text, whiteSpace: "nowrap" }}>
              <span style={{ color: GAP, textShadow: glowText(GAP, 0.5) }}>80 GAPS</span>, SORTED BY LENGTH
            </div>
          </Pop>
          <div style={{ position: "absolute", left: HB_X0 - 10, top: HB_BASE + 1, width: (HB_X1 - HB_X0 + 20) * axis, height: 4, background: alpha(C.text, 0.4) }} />
          {[0, 15, 30, 45, 60].map((t) => (
            <div key={t} style={{ position: "absolute", left: HB_X0 + (t / 60) * (HB_X1 - HB_X0), top: HB_BASE + 30, transform: "translate(-50%, -50%)", opacity: axis, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 24, color: C.dim }}>{t}</div>
          ))}
          <div style={{ position: "absolute", left: 0, right: 0, top: HB_BASE + 66, textAlign: "center", opacity: axis, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.18em", color: C.dim }}>MINUTES BETWEEN CUSTOMERS</div>
          {WAITS.map((w, i) => {
            if (w >= 60) return null;
            const k = Math.floor(w / 5);
            const t = MANY + 4 + i * 1.0;
            const d = ease(frame, [t, t + 8], [0, 1], theme.ease.in);
            if (d <= 0.001) return null;
            const y = HB_BASE - (SLOT[i] + 0.5) * (DOT + 2);
            return <div key={i} style={{ position: "absolute", left: HB_X0 + (k + 0.5) * BW - DOT / 2, top: interpolate(d, [0, 1], [700, y - DOT / 2]), width: DOT, height: DOT, borderRadius: DOT / 2, background: GAP, boxShadow: `0 0 6px ${alpha(GAP, 0.8)}` }} />;
          })}
        </>
      ) : null}
    </AbsoluteFill>
  );
};
