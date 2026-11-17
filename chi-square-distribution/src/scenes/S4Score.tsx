// SCENE 4 — THE SCORE. For each face: gap from 10 (orange segments), squared, divided by 10 → 0.4, 0.1, 0.4, 0.1, 3.6,
// 3.6; the two big gaps (±6) count most; add them up → chi-square score = 8.2.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { EXPECTED, OBS, SCORE } from "../components/Chi";
import { SceneTitle } from "../components/Kit";
import { ease, Pop, useSpr } from "../components/Motion";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { Faces, FX } from "./Faces";
import { GAP } from "./S1Hook";

const C = theme.colors;
const G = { base: 930, h: 340, max: 18 };
const yOf = (v: number) => G.base - (v / G.max) * G.h;

export const S4Score: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s4");
  const GAPW = s.cueS(0, "gap");
  const SQ = s.cueS(0, "square");
  const DIV = s.cueS(0, "divide");
  const BIG = s.sent(1).from;
  const ADD = s.sent(2).from;
  const TOTAL = s.cueS(2, "8.2.");
  const hi: Record<number, string> = frame >= BIG + 10 ? { 4: GAP, 5: GAP } : {};
  return (
    <AbsoluteFill>
      <SceneTitle label="THE MISMATCH SCORE" color={GAP} at={2} />
      <Faces g={G} vals={OBS} growAt={[-30, -30, -30, -30, -30, -30]} lineAt={-30} hi={hi} labels dieSize={44} />
      {/* the gaps */}
      {OBS.map((o, i) => {
        const p = ease(frame, [GAPW - 4 + i * 3, GAPW + 8 + i * 3], [0, 1]);
        if (p <= 0.001) return null;
        const y1 = yOf(EXPECTED);
        const y2 = yOf(o);
        const top = Math.min(y1, y2);
        const hgt = Math.abs(y2 - y1) * p;
        return <div key={i} style={{ position: "absolute", left: FX(i) + 48, top: y2 < y1 ? y1 - hgt : top, width: 8, height: hgt, borderRadius: 4, background: GAP, boxShadow: `0 0 10px ${GAP}` }} />;
      })}
      {/* the per-face arithmetic */}
      {OBS.map((o, i) => {
        const g = o - EXPECTED;
        const a = spr(GAPW + 2 + i * 3, theme.spring.pop);
        const b = spr(SQ + 2 + i * 3, theme.spring.pop);
        const c = spr(DIV + 4 + i * 3, theme.spring.pop);
        const big = Math.abs(g) >= 6 && frame >= BIG + 10;
        return (
          <div key={i} style={{ position: "absolute", left: FX(i), top: 1030, transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, fontFamily: theme.fonts.mono, fontWeight: 800 }}>
            <div style={{ fontSize: 30, color: GAP, opacity: Math.min(1, a * 2) }}>{g > 0 ? `+${g}` : g}</div>
            <div style={{ fontSize: 24, color: C.dim, opacity: Math.min(1, b * 2) }}>{g * g}</div>
            <div style={{ fontSize: big ? 36 : 30, color: big ? GAP : C.text, textShadow: big ? glowText(GAP, 0.6) : undefined, opacity: Math.min(1, c * 2), transform: `scale(${interpolate(Math.min(1, c), [0, 1], [0.6, 1])})` }}>{((g * g) / EXPECTED).toFixed(1)}</div>
          </div>
        );
      })}
      {[
        { t: "GAP", at: GAPW, y: 1046 },
        { t: "SQUARED", at: SQ, y: 1094 },
        { t: "÷ 10", at: DIV, y: 1146 },
      ].map((r) => (
        <div key={r.t} style={{ position: "absolute", left: 92, top: r.y, transform: "translateY(-50%)", opacity: ease(frame, [r.at - 2, r.at + 8], [0, 1]), fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 15, letterSpacing: "0.06em", color: C.dim, width: 90 }}>{r.t}</div>
      ))}
      <Pop at={BIG + 8} out={ADD - 4} x={540} y={450} from="up" dist={12} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 44, color: C.text, whiteSpace: "nowrap" }}>
          <span style={{ color: GAP, textShadow: glowText(GAP, 0.5) }}>BIG GAPS</span> COUNT MORE
        </div>
      </Pop>
      <Pop at={TOTAL - 8} x={540} y={1290} from="up" dist={14} cfg={theme.spring.pop}>
        <div style={{ padding: "12px 36px", borderRadius: 24, background: alpha(GAP, 0.18), border: `4px solid ${GAP}`, boxShadow: `0 0 30px ${alpha(GAP, 0.4)}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 52, color: C.text, whiteSpace: "nowrap" }}>
          SCORE = <span style={{ color: GAP, textShadow: glowText(GAP, 0.5) }}>{SCORE.toFixed(1)}</span>
        </div>
      </Pop>
      <Pop at={ADD - 2} x={540} y={450} from="up" dist={12}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text, whiteSpace: "nowrap" }}>
          0.4 + 0.1 + 0.4 + 0.1 + 3.6 + 3.6
        </div>
      </Pop>
    </AbsoluteFill>
  );
};
