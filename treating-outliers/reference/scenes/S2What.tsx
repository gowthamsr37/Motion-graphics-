// SCENE 2 — WHAT IT IS. The big "IQR" opens into INTER (between) · QUARTILE (the quarter marks) · RANGE (the spread).
// A sorted-data strip splits into four 25% quarters: drop the lowest and highest quarter, measure the middle half → IQR.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { ease, Pop, useSpr } from "../components/Motion";
import { alpha, glowText, kindColor, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const V = kindColor.spread;
const O = kindColor.outlier;
const STRIP = { x0: 120, w: 840, y: 1160, h: 84 };
const QW = STRIP.w / 4;
const WORDS = [
  { w: "INTER", mean: "between", y: 520 },
  { w: "QUARTILE", mean: "the quarter marks", y: 690 },
  { w: "RANGE", mean: "the spread", y: 860 },
];

export const S2What: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s2");
  const IQW = s.cueS(0, "interquartile");
  const HALF = s.sent(1).from;
  const MID = s.cueS(1, "middle");
  const LOW = s.cueS(2, "lowest");
  const HIGH = s.cueS(2, "highest");
  const MEAS = s.cueS(2, "measure");

  const open = ease(frame, [IQW - 6, IQW + 8], [0, 1], theme.ease.inOut);
  const strip = spr(HALF - 6, theme.spring.smooth);
  const mid = ease(frame, [MID - 2, MID + 10], [0, 1]);
  const drop = [ease(frame, [LOW - 2, LOW + 12], [0, 1], theme.ease.inOut), 0, 0, ease(frame, [HIGH - 2, HIGH + 12], [0, 1], theme.ease.inOut)];
  const meas = ease(frame, [MEAS - 4, MEAS + 12], [0, 1], theme.ease.inOut);

  return (
    <AbsoluteFill>
      {/* the big IQR from the hook, opening up */}
      {open < 1 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 720, textAlign: "center", transform: `translateY(-50%) scale(${1 - open * 0.5})`, opacity: 1 - open, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 230, letterSpacing: "0.02em", lineHeight: 1 }}>
          <span style={{ background: `linear-gradient(90deg, ${C.violet}, ${C.cyan})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 30px ${alpha(V, 0.6)})` }}>IQR</span>
        </div>
      ) : null}
      {WORDS.map((w, i) => {
        const p = spr(IQW - 4 + i * 6, theme.spring.bouncy);
        if (p <= 0.001) return null;
        const m = spr(IQW + 10 + i * 6, theme.spring.smooth);
        return (
          <div key={w.w} style={{ position: "absolute", left: 0, right: 0, top: w.y, textAlign: "center", transform: `translateY(-50%) scale(${interpolate(p, [0, 1], [0.6, 1])})`, opacity: Math.min(1, p * 2) }}>
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 96, lineHeight: 1, letterSpacing: "0.01em", color: C.text, whiteSpace: "nowrap" }}>
              <span style={{ color: V, textShadow: glowText(V, 0.7) }}>{w.w[0]}</span>
              {w.w.slice(1)}
            </div>
            <div style={{ marginTop: 10, fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 28, letterSpacing: "0.06em", color: alpha(C.cyan, 0.95), opacity: m, transform: `translateY(${(1 - m) * 10}px)` }}>= {w.mean}</div>
          </div>
        );
      })}

      {/* the sorted data strip in four quarters */}
      {strip > 0.01
        ? [0, 1, 2, 3].map((q) => {
            const isMid = q === 1 || q === 2;
            const d = drop[q];
            const col = isMid ? interpolate(mid, [0, 1], [0, 1]) : 0;
            return (
              <React.Fragment key={q}>
                <div
                  style={{
                    position: "absolute",
                    left: STRIP.x0 + q * QW + 3,
                    top: STRIP.y - STRIP.h / 2 + d * 70,
                    width: QW - 6,
                    height: STRIP.h,
                    boxSizing: "border-box",
                    borderRadius: 16,
                    background: col > 0.5 ? `linear-gradient(180deg, ${alpha(V, 0.55)}, ${alpha(V, 0.25)})` : `linear-gradient(180deg, ${alpha("#E4EEFF", 0.3)}, ${alpha("#E4EEFF", 0.12)})`,
                    border: `2.5px solid ${col > 0.5 ? V : alpha("#E4EEFF", 0.4)}`,
                    boxShadow: col > 0.5 ? `0 0 26px ${alpha(V, 0.45)}` : "none",
                    opacity: Math.min(1, strip * 2) * (1 - d * 0.7),
                    transform: `scaleX(${strip})`,
                    transformOrigin: "0% 50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: theme.fonts.mono,
                    fontWeight: 800,
                    fontSize: 32,
                    color: C.text,
                  }}
                >
                  25%
                </div>
                {d > 0.05 ? (
                  <div style={{ position: "absolute", left: STRIP.x0 + q * QW + QW / 2, top: STRIP.y + 120, transform: `translate(-50%, -50%) scale(${interpolate(d, [0, 1], [0.6, 1])})`, opacity: d, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 28, color: O, whiteSpace: "nowrap" }}>
                    {q === 0 ? "LOWEST" : "HIGHEST"} · DROP
                  </div>
                ) : null}
              </React.Fragment>
            );
          })
        : null}
      <Pop at={HALF - 2} x={STRIP.x0 + 20} y={STRIP.y - 82} from="down" dist={12}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.2em", color: C.dim, whiteSpace: "nowrap", transform: "translateX(50%)" }}>SMALLEST</div>
      </Pop>
      <Pop at={HALF + 2} x={STRIP.x0 + STRIP.w - 20} y={STRIP.y - 82} from="down" dist={12}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.2em", color: C.dim, whiteSpace: "nowrap", transform: "translateX(-50%)" }}>LARGEST</div>
      </Pop>
      {/* the middle half, measured */}
      {mid > 0.01 ? (
        <div style={{ position: "absolute", left: STRIP.x0 + QW, top: STRIP.y - 82, width: 2 * QW, textAlign: "center", opacity: mid * (1 - meas), fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.2em", color: V, transform: "translateY(-50%)" }}>MIDDLE HALF</div>
      ) : null}
      {meas > 0.01 ? (
        <>
          <div style={{ position: "absolute", left: STRIP.x0 + 2 * QW - QW * meas, top: STRIP.y - 76, width: 2 * QW * meas, height: 18, borderLeft: `5px solid ${V}`, borderRight: `5px solid ${V}`, borderTop: `5px solid ${V}`, borderRadius: "8px 8px 0 0" }} />
          <div style={{ position: "absolute", left: STRIP.x0 + 2 * QW, top: STRIP.y - 112, transform: `translate(-50%, -50%) scale(${interpolate(meas, [0, 1], [0.5, 1])})`, opacity: meas, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 48, color: V, textShadow: glowText(V, 0.7) }}>IQR</div>
        </>
      ) : null}
    </AbsoluteFill>
  );
};
