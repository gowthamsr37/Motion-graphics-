// SCENE 3 — QUARTILES. Twelve sorted bars (a staircase) are cut into four equal groups of three.
// Q1 marks 25% (cyan), Q2 = the median at 50% (green), Q3 marks 75% (cyan) → IQR = Q3 − Q1 (violet bracket).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { SceneTitle } from "../components/Kit";
import { ease, Pop, useSpr } from "../components/Motion";
import { Pill } from "../components/Nodes";
import { alpha, glowText, kindColor, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const V = kindColor.spread;
const QC = C.cyan;
const MC = kindColor.median;
const BASE = 1210;
const BX = (i: number) => 158 + i * 68;
const BH = (i: number) => 70 + i * 22;
const CUTS = [
  { x: (BX(2) + BX(3)) / 2, label: "Q1", sub: "25% BELOW", col: QC },
  { x: (BX(5) + BX(6)) / 2, label: "Q2", sub: "THE MEDIAN", col: MC },
  { x: (BX(8) + BX(9)) / 2, label: "Q3", sub: "75% BELOW", col: QC },
];

export const S3Quartiles: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s3");
  const FOUR = s.cueS(0, "four");
  const qAt = [s.sent(1).from, s.sent(2).from, s.sent(3).from];
  const IQRS = s.sent(4).from;
  const MINUS = s.cueS(4, "minus");

  const bracket = ease(frame, [IQRS + 2, IQRS + 16], [0, 1], theme.ease.inOut);
  const lit = (g: number) => (frame >= IQRS + 2 && (g === 1 || g === 2) ? 1 : 0);

  return (
    <AbsoluteFill>
      <SceneTitle label="THE BUILDING BLOCKS" pill="QUARTILES" color={QC} at={2} pillAt={6} />

      {/* sorted data: a staircase of twelve bars */}
      {Array.from({ length: 12 }).map((_, i) => {
        const p = spr(6 + i * 2, theme.spring.smooth);
        if (p <= 0.001) return null;
        const g = Math.floor(i / 3);
        const split = ease(frame, [FOUR - 2, FOUR + 10], [0, 1], theme.ease.inOut);
        const dx = (g - 1.5) * 14 * split;
        const on = lit(g);
        const h = BH(i) * p;
        return (
          <div key={i} style={{ position: "absolute", left: BX(i) - 26 + dx, top: BASE - h, width: 52, height: h, borderRadius: "10px 10px 3px 3px", background: on ? `linear-gradient(180deg, ${V}, ${alpha(V, 0.35)})` : `linear-gradient(180deg, ${alpha("#E4EEFF", 0.75)}, ${alpha("#E4EEFF", 0.2)})`, boxShadow: on ? `0 0 18px ${alpha(V, 0.5)}` : "none" }} />
        );
      })}
      <div style={{ position: "absolute", left: 100, top: BASE + 2, width: 880 * ease(frame, [4, 18], [0, 1]), height: 4, borderRadius: 2, background: alpha(C.text, 0.35) }} />
      <Pop at={10} out={FOUR - 4} x={540} y={BASE + 50} from="up" dist={12}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.22em", color: C.dim, whiteSpace: "nowrap" }}>SORTED, SMALLEST TO LARGEST</div>
      </Pop>
      {[0, 1, 2, 3].map((g) => (
        <Pop key={g} at={FOUR + 4 + g * 3} x={(BX(g * 3) + BX(g * 3 + 2)) / 2 + (g - 1.5) * 14} y={BASE + 46} from="up" dist={14} cfg={theme.spring.pop}>
          <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 28, color: lit(g) ? V : C.text }}>25%</div>
        </Pop>
      ))}

      {/* the three cut lines */}
      {CUTS.map((c, k) => {
        const drop = ease(frame, [FOUR - 2 + k * 3, FOUR + 10 + k * 3], [0, 1], theme.ease.out);
        if (drop <= 0.001) return null;
        const named = spr(qAt[k] - 3, theme.spring.bouncy);
        const col = named > 0.3 ? c.col : alpha(C.text, 0.7);
        const x = c.x + (k - 1) * 14 * ease(frame, [FOUR - 2, FOUR + 10], [0, 1], theme.ease.inOut);
        return (
          <React.Fragment key={k}>
            <div style={{ position: "absolute", left: x - 2, top: 870, height: (BASE + 20 - 870) * drop, borderLeft: `${named > 0.3 ? 5 : 3}px dashed ${col}`, filter: named > 0.3 ? `drop-shadow(0 0 8px ${alpha(c.col, 0.8)})` : undefined }} />
            {named > 0.001 ? (
              <div style={{ position: "absolute", left: x, top: 820, transform: `translate(-50%, -50%) scale(${interpolate(named, [0, 1], [0.4, 1])})`, opacity: Math.min(1, named * 2), textAlign: "center" }}>
                <Pill label={c.label} color={c.col} size={30} glow={0.6} />
                <div style={{ position: "absolute", left: "50%", top: -34, transform: "translateX(-50%)", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 18, letterSpacing: "0.16em", color: alpha(c.col, 0.95), whiteSpace: "nowrap" }}>{c.sub}</div>
              </div>
            ) : null}
          </React.Fragment>
        );
      })}

      {/* IQR = Q3 − Q1 */}
      {bracket > 0.01 ? (
        <>
          <div style={{ position: "absolute", left: CUTS[0].x, top: 726, width: (CUTS[2].x - CUTS[0].x) * bracket, height: 18, borderLeft: `5px solid ${V}`, borderRight: bracket > 0.97 ? `5px solid ${V}` : undefined, borderTop: `5px solid ${V}`, borderRadius: "8px 8px 0 0" }} />
          <div style={{ position: "absolute", left: (CUTS[0].x + CUTS[2].x) / 2, top: 700, transform: "translate(-50%, -50%)", opacity: bracket, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: V, textShadow: glowText(V, 0.6) }}>IQR</div>
        </>
      ) : null}
      <Pop at={MINUS - 6} x={540} y={590} from="up" dist={20} cfg={theme.spring.bouncy}>
        <div style={{ padding: "12px 30px", borderRadius: 22, background: alpha("#060B2A", 0.86), border: `3px solid ${V}`, boxShadow: `0 0 26px ${alpha(V, 0.35)}`, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 54, color: C.text, whiteSpace: "nowrap" }}>
          <span style={{ color: V }}>IQR</span> = <span style={{ color: QC }}>Q3</span> - <span style={{ color: QC }}>Q1</span>
        </div>
      </Pop>
    </AbsoluteFill>
  );
};
