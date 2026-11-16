// SCENE 6 — WHY IT MATTERS / WHAT TO DO. The city again: the mean (₹50K) misleads — crossed out — the median (₹30K)
// is typical. So report MEDIAN + IQR, or LOG-TRANSFORM the data to balance it (a mini histogram morphs into a bell).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Bars, RIGHT, SYM } from "../components/Hist";
import { Rupee } from "../components/Icons";
import { LogGlyph, SceneTitle, ShieldGlyph } from "../components/Kit";
import { ease, Mark, Pop, useSpr } from "../components/Motion";
import { alpha, glowText, kindColor, theme } from "../theme";
import { useScene } from "../timing";
import { PAY } from "./S1Hook";

const C = theme.colors;
const O = kindColor.outlier;
const MED = kindColor.median;
const BX = (i: number) => 180 + i * 90;
const BASE = 1010;
const BH = (v: number) => Math.min(v, 120) * 2.6;

export const S6Matters: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s6");
  const MIS = s.cueS(0, "misleads.");
  const MEDW = s.cueS(1, "median:");
  const REP = s.cueS(2, "median");
  const LOGW = s.cueS(2, "log-transform");

  const meanLine = ease(frame, [6, 20], [0, 1], theme.ease.inOut);
  const med = spr(MEDW - 2, theme.spring.pop);
  const morph = ease(frame, [LOGW + 4, LOGW + 26], [0, 1], theme.ease.inOut);

  return (
    <AbsoluteFill>
      <SceneTitle label="WHY IT MATTERS" color={O} at={2} />
      <div style={{ position: "absolute", left: 130, top: BASE + 2, width: 820, height: 4, borderRadius: 2, background: alpha(C.text, 0.35) }} />
      {PAY.map((v, i) => {
        const p = spr(4 + i * 2, theme.spring.smooth);
        const h = BH(v) * p;
        const rich = i === 8;
        const isMed = i === 4 && med > 0.5;
        const col = rich ? O : isMed ? C.cyan : "#E4EEFF";
        return (
          <React.Fragment key={i}>
            <div style={{ position: "absolute", left: BX(i) - 28, top: BASE - h, width: 56, height: h, borderRadius: "10px 10px 2px 2px", background: `linear-gradient(180deg, ${alpha(col, 0.9)}, ${alpha(col, 0.25)})`, boxShadow: isMed ? `0 0 20px ${alpha(C.cyan, 0.6)}` : "none" }} />
            {rich ? <div style={{ position: "absolute", left: BX(i) - 36, top: BASE - h + 60, width: 72, height: 12, background: C.bg, transform: "skewY(-12deg)", opacity: p }} /> : null}
            <div style={{ position: "absolute", left: BX(i), top: BASE + 26, transform: "translate(-50%, -50%)", opacity: p, display: "flex", alignItems: "center", fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 19, color: rich ? O : isMed ? C.cyan : C.dim }}>
              <Rupee size={17} color={rich ? O : isMed ? C.cyan : C.dim} />
              {rich ? "2L" : `${v}K`}
            </div>
          </React.Fragment>
        );
      })}
      {meanLine > 0.01 ? <div style={{ position: "absolute", left: 130, top: BASE - BH(50) - 3, width: 820 * meanLine, borderTop: `6px dashed ${O}`, filter: `drop-shadow(0 0 6px ${alpha(O, 0.7)})`, opacity: frame >= MIS ? 0.6 : 1 }} /> : null}
      <Pop at={14} x={290} y={BASE - BH(50) - 40} from="down" dist={14}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 14, background: alpha(O, 0.16), border: `2px solid ${O}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 28, color: C.text, whiteSpace: "nowrap" }}>
          MEAN <Rupee size={26} color={C.text} />
          50K
          {frame >= MIS - 2 ? <Mark kind="cross" at={MIS - 2} size={30} color={C.red} width={14} /> : null}
        </div>
      </Pop>
      <Pop at={MIS - 2} x={720} y={600} from="up" dist={16} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 34, color: O, whiteSpace: "nowrap" }}>THE MEAN MISLEADS</div>
      </Pop>
      {med > 0.01 ? (
        <>
          <div style={{ position: "absolute", left: BX(4) - 2, top: 700, height: (BASE - BH(30) - 700) * med, borderLeft: `3px dotted ${alpha(C.cyan, 0.8)}` }} />
          <div style={{ position: "absolute", left: BX(4) + 60, top: 680, transform: `translate(-50%, -50%) scale(${interpolate(med, [0, 1], [0.5, 1])})`, opacity: Math.min(1, med * 2), display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 999, background: alpha(C.cyan, 0.2), border: `3px solid ${C.cyan}`, boxShadow: `0 0 26px ${alpha(C.cyan, 0.5)}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: C.text, whiteSpace: "nowrap" }}>
            TYPICAL (MEDIAN) <Rupee size={28} color={C.cyan} />
            <span style={{ color: C.cyan, textShadow: glowText(C.cyan, 0.5) }}>30K</span>
          </div>
        </>
      ) : null}

      {/* what to do */}
      {[
        { at: REP - 4, x: 300, col: MED, G: ShieldGlyph, t1: "REPORT", t2: "MEDIAN + IQR" },
        { at: LOGW - 4, x: 780, col: C.cyan, G: LogGlyph, t1: "OR", t2: "LOG-TRANSFORM" },
      ].map((o, k) => {
        const p = spr(o.at, theme.spring.bouncy);
        if (p <= 0.001) return null;
        return (
          <div key={k} style={{ position: "absolute", left: o.x - 220, top: 1110, width: 440, height: 170, boxSizing: "border-box", padding: "20px 24px", borderRadius: 28, background: `linear-gradient(180deg, ${alpha(o.col, 0.2)}, rgba(14,24,64,0.9))`, border: `2.5px solid ${alpha(o.col, 0.8)}`, opacity: Math.min(1, p * 2), transform: `translateY(${(1 - p) * 40}px) scale(${interpolate(p, [0, 1], [0.8, 1])})`, display: "flex", alignItems: "center", gap: 18 }}>
            {k === 0 ? (
              <div style={{ flexShrink: 0 }}>
                <o.G size={70} color={o.col} />
              </div>
            ) : (
              <div style={{ position: "relative", width: 90, height: 90, flexShrink: 0 }}>
                <Bars g={{ x0: 0, bw: 6, gap: 1.5, base: 90, maxH: 80, maxC: 13 }} counts={RIGHT.map((c, i) => interpolate(morph, [0, 1], [c, SYM[i]]))} color={o.col} />
              </div>
            )}
            <div>
              <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.2em", color: C.dim }}>{o.t1}</div>
              <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: o.col, textShadow: glowText(o.col, 0.4), whiteSpace: "nowrap" }}>{o.t2}</div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

