// SCENE 4 — REAL OUTLIERS, OPTION 1: CAP IT (winsorizing). Four options preview → the commute data with IQR fences
// at 10 and 42: the 60-minute jam is pulled back to 42 (mean 28.9 → 27.1). It still counts, but can't dominate.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Arrow } from "../components/Icons";
import { Fence, TREATS, TreatPill } from "../components/Kit";
import { ease, exitP, Mark, Pop, Ripple, useSpr } from "../components/Motion";
import { Tag, TreeHeader } from "../components/Nodes";
import { alpha, glowText, kindColor, theme } from "../theme";
import { useScene } from "../timing";
import { OUT_HEADER } from "./S2Why";

const C = theme.colors;
const O = kindColor.outlier;
const RV = kindColor.rare;
const COMMUTE = [25, 30, 18, 60, 22, 27, 35, 20, 30, 22]; // Q1 22, Q3 30, IQR 8 → fences 10 and 42; mean 28.9, capped 27.1
const AXY = 1090;
const X = (v: number) => 110 + (v - 5) * 14.3;
const stackIdx = (i: number) => COMMUTE.slice(0, i).filter((v) => v === COMMUTE[i]).length;

export const S4Cap: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s4");
  const FOUR = s.cueS(0, "four");
  const CAPS = s.sent(1).from;
  const FENCE = s.cueS(1, "fence");
  const PULL = s.cueS(1, "pulled");
  const JAM = s.sent(2).from;
  const C42 = s.cueS(2, "42.");
  const COUNTS = s.cueS(3, "counts,");
  const WINS = s.cueS(3, "winsorizing.");

  const plot = ease(frame, [CAPS - 6, CAPS + 10], [0, 1], theme.ease.inOut);
  const pull = ease(frame, [PULL - 2, PULL + 16], [0, 1], theme.ease.inOut);
  const jamV = interpolate(pull, [0, 1], [60, 42]);
  const fence = ease(frame, [FENCE - 6, FENCE + 8], [0, 1], theme.ease.out);

  return (
    <AbsoluteFill>
      <TreeHeader {...OUT_HEADER} parentIn={-60} kidsIn={-60} activeAt={4} activeIdx={1} prevIdx={0} />
      {/* four options for real outliers */}
      {TREATS.slice(3).map((t, i) => {
        const p = spr(FOUR - 4 + i * 4, theme.spring.bouncy);
        const e = exitP(frame, CAPS - 6 + (i === 0 ? 4 : 0), 8);
        if (p <= 0.001 || e >= 1) return null;
        const G = t.glyph;
        return (
          <div key={t.label} style={{ position: "absolute", left: 195 + i * 230, top: 800, transform: `translate(-50%, -50%) scale(${interpolate(p, [0, 1], [0.5, 1]) * (1 - e * 0.3)})`, opacity: Math.min(1, p * 2) * (1 - e), width: 210, height: 200, boxSizing: "border-box", borderRadius: 26, background: `linear-gradient(180deg, ${alpha(RV, 0.2)}, rgba(14,24,64,0.9))`, border: `2.5px solid ${alpha(RV, 0.7)}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
            <G size={70} color={RV} />
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 22, color: C.text, textAlign: "center", whiteSpace: "nowrap" }}>{t.label}</div>
          </div>
        );
      })}
      <TreatPill t={TREATS[3]} color={RV} at={CAPS - 2} />

      {/* the commute data */}
      {plot > 0.01 ? (
        <AbsoluteFill style={{ opacity: plot }}>
          <div style={{ position: "absolute", left: X(5) - 10, top: AXY - 2, width: (X(65) - X(5) + 20) * plot, height: 4, borderRadius: 2, background: alpha(C.text, 0.35) }} />
          {[10, 20, 30, 40, 50, 60].map((v) => (
            <div key={v} style={{ position: "absolute", left: X(v), top: AXY + 32, transform: "translate(-50%, -50%)", fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 22, color: C.dim }}>{v}</div>
          ))}
          <div style={{ position: "absolute", left: 540, top: AXY + 70, transform: "translate(-50%, -50%)", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.2em", color: C.dim, whiteSpace: "nowrap" }}>COMMUTE TIME (MIN)</div>
          {/* where the jam was */}
          {pull > 0.05 ? <div style={{ position: "absolute", left: X(60) - 17, top: AXY - 17, width: 34, height: 34, borderRadius: 17, border: `3px dashed ${alpha(O, 0.7)}`, opacity: pull }} /> : null}
          {pull > 0.05 && pull < 1 ? null : null}
          {COMMUTE.map((v, i) => {
            const p = spr(CAPS + i * 2, theme.spring.pop);
            if (p <= 0.001) return null;
            const isJam = v === 60;
            const x = X(isJam ? jamV : v);
            const y = AXY - stackIdx(i) * 32;
            const col = isJam ? O : kindColor.data;
            return (
              <React.Fragment key={i}>
                <div style={{ position: "absolute", left: x - 15, top: y - 15, width: 30, height: 30, borderRadius: 15, background: col, boxShadow: `0 0 14px ${alpha(col, 0.8)}`, transform: `scale(${p})`, zIndex: 3 }} />
                {isJam && pull > 0.9 ? <div style={{ position: "absolute", left: x - 20, top: y - 30, width: 40, height: 6, borderRadius: 3, background: RV, boxShadow: `0 0 10px ${RV}` }} /> : null}
              </React.Fragment>
            );
          })}
        </AbsoluteFill>
      ) : null}
      <Fence x={X(10)} y0={860} y1={AXY + 18} p={fence} color={C.text} label="10" />
      <Fence x={X(42)} y0={860} y1={AXY + 18} p={fence} color={C.text} label="42" />
      <Pop at={FENCE + 4} x={(X(10) + X(42)) / 2} y={800} from="down" dist={12}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.2em", color: C.dim, whiteSpace: "nowrap" }}>IQR FENCES</div>
      </Pop>
      <Ripple at={PULL + 16} x={X(42)} y={AXY} color={RV} size={220} rings={1} />

      {/* 60 → 42, mean 28.9 → 27.1 */}
      <Pop at={JAM - 2} x={X(51)} y={AXY - 110} from="down" dist={16} cfg={theme.spring.bouncy}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 44, color: C.text, whiteSpace: "nowrap" }}>
          <span style={{ color: O }}>60</span>
          <Arrow size={36} color={RV} />
          <span style={{ color: RV, textShadow: glowText(RV, 0.6) }}>42</span>
        </div>
      </Pop>
      <Pop at={C42 + 2} x={540} y={1210} from="up" dist={16} cfg={theme.spring.bouncy}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 22px", borderRadius: 18, background: alpha("#060B2A", 0.86), border: `2.5px solid ${alpha(RV, 0.7)}`, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 32, color: C.text, whiteSpace: "nowrap" }}>
          <span style={{ fontFamily: theme.fonts.body, fontSize: 20, letterSpacing: "0.2em", color: C.dim }}>MEAN</span>
          <span>28.9</span>
          <Arrow size={28} color={RV} />
          <span style={{ color: RV }}>27.1 min</span>
        </div>
      </Pop>
      <Pop at={COUNTS - 4} x={X(52)} y={AXY - 186} from="down" dist={14} cfg={theme.spring.pop}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 999, background: alpha(kindColor.median, 0.16), border: `2.5px solid ${kindColor.median}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 22, color: C.text, whiteSpace: "nowrap" }}>
          <Mark kind="check" at={COUNTS - 2} size={24} color={kindColor.median} width={14} />
          STILL IN THE DATA
        </div>
      </Pop>
      <Pop at={WINS - 6} x={540} y={1300} from="up" dist={16} cfg={theme.spring.bouncy}>
        <Tag color={RV} size={28}>
          A.K.A. WINSORIZING
        </Tag>
      </Pop>
    </AbsoluteFill>
  );
};
