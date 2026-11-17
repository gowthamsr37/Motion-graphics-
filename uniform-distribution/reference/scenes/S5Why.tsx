// SCENE 5 — WHY IT HAPPENS. Three random groups of 30 on the salary axis: each has a few huge salaries (orange) mixed
// with many ordinary ones. Their averages (green ticks) all land near the middle → extremes cancel out.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { ease, Pop, useSpr } from "../components/Motion";
import { AVGS, AxisLabels, K, px, SAMPLES } from "../components/Salary";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { AVG, RAW, SAMP } from "./S1Hook";

const C = theme.colors;
// three random groups that each contain big earners (up to ₹192K) yet average ₹38–42K
const ROWS = [5, 12, 19];
const ROW_Y = [650, 870, 1090];

export const S5Why: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s5");
  const WHY = s.sent(0).from;
  const GROUP = s.sent(1).from;
  const HUGE = s.cueS(1, "huge");
  const CANCEL = s.sent(2).from;
  const MIDDLE = s.cueS(2, "middle.");
  const pulse = ease(frame, [HUGE - 4, HUGE + 4], [0, 1]);
  const band = ease(frame, [MIDDLE - 6, MIDDLE + 8], [0, 1]);

  return (
    <AbsoluteFill>
      <Pop at={WHY - 2} out={CANCEL - 6} x={540} y={420} from="up" dist={16} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 70, color: C.text, whiteSpace: "nowrap" }}>
          WHY<span style={{ color: C.yellow }}>?</span>
        </div>
      </Pop>
      <Pop at={CANCEL - 2} x={540} y={420} from="up" dist={16} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 56, color: C.text, whiteSpace: "nowrap" }}>
          EXTREMES <span style={{ color: AVG, textShadow: glowText(AVG, 0.5) }}>CANCEL OUT</span>
        </div>
      </Pop>
      {/* the middle */}
      {band > 0.01 ? (
        <>
          <div style={{ position: "absolute", left: px(30), top: 540, width: (px(50) - px(30)) * band, height: 640, borderRadius: 18, background: alpha(AVG, 0.12), border: `3px dashed ${alpha(AVG, 0.7)}` }} />
          <div style={{ position: "absolute", left: px(40), top: 1225, transform: "translate(-50%, -50%)", opacity: band, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: AVG, whiteSpace: "nowrap" }}>NEAR THE MIDDLE</div>
        </>
      ) : null}
      {ROWS.map((si, r) => {
        const y = ROW_Y[r];
        const at = GROUP + 4 + r * 10;
        const p = spr(at, theme.spring.smooth);
        if (p <= 0.001) return null;
        const tick = spr(CANCEL + 6 + r * 8, theme.spring.pop);
        return (
          <div key={si} style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, opacity: Math.min(1, p * 2) }}>
            <div style={{ position: "absolute", left: 140, top: y - 92, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.14em", color: SAMP }}>GROUP {r + 1} · 30 PEOPLE</div>
            <div style={{ position: "absolute", left: px(0) - 10, top: y + 22, width: (px(160) - px(0) + 20) * p, height: 3, background: alpha(C.text, 0.4) }} />
            {SAMPLES[si].map((v, j) => {
              const big = v > 90;
              const q = ease(frame, [at + j * 0.7, at + 6 + j * 0.7], [0, 1]);
              const sc = big ? 1 + pulse * 0.35 * (0.5 + 0.5 * Math.sin(frame / 3)) : 1;
              return <div key={j} style={{ position: "absolute", left: px(v) - (big ? 10 : 7), top: y - (j % 3) * 13 - (big ? 10 : 7), width: big ? 20 : 14, height: big ? 20 : 14, borderRadius: 10, background: big ? RAW : alpha(SAMP, 0.85), boxShadow: big ? `0 0 12px ${RAW}` : "none", transform: `scale(${q * sc})` }} />;
            })}
            {tick > 0.01 ? (
              <>
                <div style={{ position: "absolute", left: px(AVGS[si]) - 4, top: y - 50, width: 8, height: 80 * tick, borderRadius: 4, background: AVG, boxShadow: `0 0 12px ${AVG}` }} />
                <div style={{ position: "absolute", left: px(AVGS[si]) + 14, top: y - 62, transform: `scale(${interpolate(tick, [0, 1], [0.6, 1])})`, transformOrigin: "left center", opacity: Math.min(1, tick * 2) }}>
                  <K v={AVGS[si]} size={26} color={AVG} />
                </div>
              </>
            ) : null}
          </div>
        );
      })}
      {frame >= GROUP ? <AxisLabels base={ROW_Y[2] + 30} vals={[0, 40, 80, 120, 160]} at={px} p={ease(frame, [GROUP + 20, GROUP + 30], [0, 1])} /> : null}
      <Pop at={HUGE + 2} out={CANCEL - 4} x={px(130)} y={540} from="down" dist={12}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 28, color: RAW, textShadow: glowText(RAW, 0.4), whiteSpace: "nowrap" }}>A FEW HUGE ONES</div>
      </Pop>
    </AbsoluteFill>
  );
};
