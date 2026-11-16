// SCENE 5 — OPTION 2: TRANSFORM IT (log). A right-skewed salary histogram with the mean dragged right of the peak.
// A ×10 log ladder (₹10K · ₹1L · ₹10L · ₹1Cr, equally spaced) appears; the long tail squeezes in, the histogram
// becomes balanced and the mean moves back to the middle ("the mean works again").
import React from "react";
import { AbsoluteFill, interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { Rupee } from "../components/Icons";
import { TREATS, TreatPill } from "../components/Kit";
import { ease, Mark, Pop, useSpr } from "../components/Motion";
import { Tag, TreeHeader } from "../components/Nodes";
import { alpha, glowText, kindColor, theme } from "../theme";
import { useScene } from "../timing";
import { OUT_HEADER } from "./S2Why";

const C = theme.colors;
const O = kindColor.outlier;
const RV = kindColor.rare;
const GR = kindColor.median;
const BASE = 1110;
const BX = (i: number) => 177 + i * 66;
const SKEW = [70, 190, 240, 200, 150, 110, 80, 58, 42, 30, 22, 16];
const BELL = [16, 34, 64, 110, 168, 214, 214, 168, 110, 64, 34, 16];
const meanIdx = (h: number[]) => h.reduce((a, v, i) => a + v * i, 0) / h.reduce((a, v) => a + v, 0);
const LADDER = ["10K", "1L", "10L", "1Cr"];

export const S5Log: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s5");
  const TR = s.sent(0).from;
  const STEP = s.cueS(1, "step");
  const SQ = s.cueS(1, "squeezes");
  const BAL = s.cueS(2, "balanced,");
  const MEAN = s.cueS(2, "mean");

  const m = ease(frame, [SQ - 4, BAL + 6], [0, 1], theme.ease.inOut);
  const h = SKEW.map((v, i) => interpolate(m, [0, 1], [v, BELL[i]]));
  const mi = interpolate(ease(frame, [MEAN - 8, MEAN + 10], [0, 1], theme.ease.inOut), [0, 1], [meanIdx(SKEW), 5.5]);
  const mx = BX(0) + mi * 66;
  const meanOk = frame >= MEAN + 6;
  const mcol = interpolateColors(ease(frame, [MEAN - 8, MEAN + 10], [0, 1]), [0, 1], [O, GR]);
  const ladder = ease(frame, [STEP - 6, STEP + 10], [0, 1], theme.ease.out);

  return (
    <AbsoluteFill>
      <TreeHeader {...OUT_HEADER} parentIn={-60} kidsIn={-60} activeAt={-60} activeIdx={1} prevIdx={1} />
      <TreatPill t={TREATS[4]} color={RV} at={TR - 2} sub="USUALLY WITH A LOG" />
      <Pop at={TR + 6} x={540} y={690} from="up" dist={14}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.22em", color: C.dim, whiteSpace: "nowrap" }}>
          SALARIES {m > 0.5 ? "(LOG SCALE)" : "(A LONG RIGHT TAIL)"}
        </div>
      </Pop>

      {/* histogram */}
      <div style={{ position: "absolute", left: 130, top: BASE + 2, width: 820 * ease(frame, [TR, TR + 14], [0, 1]), height: 4, borderRadius: 2, background: alpha(C.text, 0.35) }} />
      {h.map((v, i) => {
        const p = spr(TR + 2 + i * 2, theme.spring.smooth);
        const hh = v * p;
        const tail = i >= 7 && m < 0.5;
        return <div key={i} style={{ position: "absolute", left: BX(i) - 27, top: BASE - hh, width: 54, height: hh, borderRadius: "10px 10px 2px 2px", background: tail ? `linear-gradient(180deg, ${O}, ${alpha(O, 0.35)})` : `linear-gradient(180deg, ${alpha(RV, 0.9)}, ${alpha(RV, 0.3)})`, boxShadow: tail ? `0 0 14px ${alpha(O, 0.5)}` : "none" }} />;
      })}
      {/* the mean marker */}
      {(() => {
        const p = spr(TR + 20, theme.spring.pop);
        if (p <= 0.001) return null;
        return (
          <>
            <div style={{ position: "absolute", left: mx - 3, top: BASE - 290, height: 300 * p, borderLeft: `6px dashed ${mcol}`, filter: `drop-shadow(0 0 6px ${alpha(mcol, 0.8)})` }} />
            <div style={{ position: "absolute", left: mx, top: BASE - 316, transform: "translate(-50%, -50%)", opacity: p, display: "flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 12, background: alpha("#060B2A", 0.86), border: `2px solid ${mcol}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 24, color: C.text, whiteSpace: "nowrap" }}>
              {meanOk ? <Mark kind="check" at={MEAN + 6} size={24} color={GR} width={14} /> : null}
              {meanOk ? "MEAN = TYPICAL" : "MEAN, DRAGGED BY THE TAIL"}
            </div>
          </>
        );
      })()}

      {/* the ×10 ladder */}
      {ladder > 0.01 ? (
        <>
          {LADDER.map((l, i) => {
            const x = 210 + i * 220;
            return (
              <React.Fragment key={l}>
                <div style={{ position: "absolute", left: x - 2, top: BASE + 10, height: 20 * ladder, borderLeft: `4px solid ${alpha(C.text, 0.7)}` }} />
                <div style={{ position: "absolute", left: x, top: BASE + 52, transform: "translate(-50%, -50%)", opacity: ladder, display: "flex", alignItems: "center", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 28, color: C.text }}>
                  <Rupee size={26} color={C.text} />
                  {l}
                </div>
                {i < 3 ? (
                  <>
                    <svg width={220} height={50} viewBox="0 0 220 50" style={{ position: "absolute", left: x, top: BASE + 76, opacity: ladder, overflow: "visible" }}>
                      <path d="M12 6 Q110 52 208 6" stroke={RV} strokeWidth={4} fill="none" strokeLinecap="round" />
                      <path d="M196 4 L208 6 L202 17" stroke={RV} strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div style={{ position: "absolute", left: x + 110, top: BASE + 132, transform: "translate(-50%, -50%)", opacity: ladder, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 26, color: RV, textShadow: glowText(RV, 0.5) }}>×10</div>
                  </>
                ) : null}
              </React.Fragment>
            );
          })}
        </>
      ) : null}
      <Pop at={BAL + 8} x={540} y={1305} from="up" dist={16} cfg={theme.spring.bouncy}>
        <Tag color={RV} size={26}>
          GREAT FOR SALARIES · HOUSE PRICES
        </Tag>
      </Pop>
    </AbsoluteFill>
  );
};
