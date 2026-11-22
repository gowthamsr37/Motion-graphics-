// SCENE 5 — THE CUT-OFF LADDER. Rows df 5 / 10 / 30 / 60 / 100 / ∞ fill on their spoken values (2.571 → 1.96), each with a
// bar whose length is the cut-off on a 1.9–2.6 scale, shrinking toward the dashed 1.96 (z) line; then t BECOMES z.
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { SceneTitle } from "../components/Kit";
import { Pop, useSpr } from "../components/Motion";
import { TC, TL, ZC } from "../components/ZT";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const X0 = 420, X1 = 960, V0 = 1.9, V1 = 2.6;
const bx = (v: number) => X0 + ((v - V0) / (V1 - V0)) * (X1 - X0);

export const S5Ladder: React.FC = () => {
  const spr = useSpr();
  const s = useScene("s5");
  const rows = [
    { df: "5", v: 2.571, at: s.cueS(1, "2.571.") },
    { df: "10", v: 2.228, at: s.cueS(1, "2.228.") },
    { df: "30", v: 2.042, at: s.cueS(1, "2.042.") },
    { df: "60", v: 2.0, at: s.cueS(1, "exactly") + 6 },
    { df: "100", v: 1.984, at: s.cueS(1, "1.984.") },
    { df: "inf", v: 1.96, at: s.cueS(2, "1.96.") },
  ];
  const y0 = 480, gap = 118;
  return (
    <AbsoluteFill>
      <SceneTitle label="THE 5% CUT-OFF LADDER" pill="TWO-TAILED" color={TL} at={2} pillAt={s.sent(0).from} />
      <div style={{ position: "absolute", left: 120, top: y0 - 70, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.16em", color: TC }}>DEGREES OF FREEDOM</div>
      <div style={{ position: "absolute", left: bx(1.96) - 2, top: y0 - 40, width: 4, height: gap * 6, background: `repeating-linear-gradient(${ZC} 0 12px, transparent 12px 22px)`, opacity: 0.8 }} />
      <div style={{ position: "absolute", left: bx(1.96) - 40, top: y0 - 40 + gap * 6 + 8, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 22, color: ZC }}>z 1.96</div>
      {rows.map((r, i) => {
        const p = spr(r.at - 6, theme.spring.bouncy);
        const y = y0 + i * gap;
        const last = i === rows.length - 1;
        const c = last ? ZC : TC;
        return (
          <React.Fragment key={r.df}>
            <div style={{ position: "absolute", left: 120, top: y, height: 90, display: "flex", alignItems: "center", opacity: Math.min(1, p * 2), fontFamily: theme.fonts.display, fontWeight: 800, fontSize: last ? 34 : 40, color: c }}>{r.df === "inf" ? "INFINITE (z)" : r.df}</div>
            <div style={{ position: "absolute", left: X0, top: y + 20, width: Math.max(0, (bx(r.v) - X0) * Math.min(1, p)), height: 50, borderRadius: 12, background: `linear-gradient(90deg, ${alpha(c, 0.25)}, ${alpha(c, 0.7)})`, border: `2px solid ${c}` }} />
            {p > 0.001 ? (
              <div style={{ position: "absolute", left: bx(r.v) + 14, top: y + 45, transform: `translateY(-50%) scale(${interpolate(Math.min(1, p), [0, 1], [1.4, 1])})`, transformOrigin: "left center", opacity: Math.min(1, p * 2), fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 38, color: C.text, textShadow: glowText(c, 0.4), whiteSpace: "nowrap" }}>{r.v === 2 ? "2.000" : r.v.toFixed(r.v === 1.96 ? 2 : 3)}</div>
            ) : null}
          </React.Fragment>
        );
      })}
      <Pop at={s.cueS(2, "becomes") - 4} x={540} y={1280} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 56, color: C.text, whiteSpace: "nowrap" }}>
          <span style={{ color: TC }}>t</span> BECOMES <span style={{ color: ZC, textShadow: glowText(ZC, 0.6) }}>z</span>
        </div>
      </Pop>
    </AbsoluteFill>
  );
};
