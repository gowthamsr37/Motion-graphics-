// SCENE 11 — THE FULL COMPARISON (the save moment). A 7-row table z vs t cascades in: SPREAD USED · DISTRIBUTION · TAILS ·
// 5% CUT-OFF · USE WHEN · CLASSIC USE · PYTHON; SAVE and SEND badges drop on their words.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Bookmark } from "../components/Guide";
import { SceneTitle } from "../components/Kit";
import { useSpr } from "../components/Motion";
import { SEc, TC, ZC } from "../components/ZT";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

const ROWS: [string, string, string][] = [
  ["SPREAD USED", "sigma (known)", "s (from sample)"],
  ["DISTRIBUTION", "Normal", "t, df = n − 1"],
  ["TAILS", "Thin", "Fatter (small n)"],
  ["5% CUT-OFF", "±1.96", "±2.306 at df 8, shrinks"],
  ["USE WHEN", "sigma known", "sigma unknown"],
  ["CLASSIC USE", "Proportions, A/B", "Means, small samples"],
  ["PYTHON", "ztest()", "ttest_1samp()"],
];

const Badge: React.FC<{ x: number; at: number; label: string; color: string; icon?: React.ReactNode }> = ({ x, at, label, color, icon }) => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const p = spr(at - 4, theme.spring.pop);
  if (p <= 0.001) return null;
  const wig = Math.sin((frame - at) / 3) * 6 * Math.max(0, 1 - (frame - at) / 30);
  return (
    <div style={{ position: "absolute", left: x, top: 286, transform: `translate(-50%, -50%) translateY(${(1 - Math.min(1, p)) * -60}px) rotate(${wig}deg) scale(${interpolate(Math.min(1, p), [0, 1], [0.4, 1])})`, opacity: Math.min(1, p * 2), display: "flex", alignItems: "center", gap: 10, padding: "8px 16px", borderRadius: 999, background: alpha(color, 0.2), border: `2px solid ${color}`, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.12em", color: C.text }}>
      {icon}
      {label}
    </div>
  );
};

export const S11Table: React.FC = () => {
  const spr = useSpr();
  const s = useScene("s11");
  const S0 = s.sent(0).from;
  const y0 = 470, rh = 112;
  const hp = spr(S0 - 6, theme.spring.smooth);
  return (
    <AbsoluteFill>
      <SceneTitle label="THE FULL COMPARISON" color={SEc} at={2} />
      <Badge x={170} at={s.cueS(1, "send")} label="SEND" color={C.cyan} />
      <Badge x={910} at={s.cueS(1, "save")} label="SAVE" color={SEc} icon={<Bookmark size={24} color={SEc} />} />
      <div style={{ position: "absolute", left: 90, top: y0 - 80, width: 900, height: 66, display: "flex", opacity: Math.min(1, hp * 2) }}>
        <div style={{ width: 260 }} />
        <div style={{ width: 300, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: ZC }}>z-TEST</div>
        <div style={{ width: 340, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: TC }}>
          <span style={{ fontStyle: "italic" }}>t</span>-TEST
        </div>
      </div>
      {ROWS.map((r, i) => {
        const p = spr(S0 + i * 5, theme.spring.bouncy);
        return (
          <div key={r[0]} style={{ position: "absolute", left: 90, top: y0 + i * rh, width: 900, height: rh - 12, boxSizing: "border-box", borderRadius: 20, background: "rgba(14,24,64,0.9)", border: `2px solid ${alpha(C.text, 0.16)}`, display: "flex", alignItems: "center", opacity: Math.min(1, p * 2), transform: `translateX(${(1 - Math.min(1, p)) * -50}px)` }}>
            <div style={{ width: 260, paddingLeft: 22, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.12em", color: C.dim }}>{r[0]}</div>
            <div style={{ width: 300, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 28, color: C.text, borderLeft: `2px solid ${alpha(ZC, 0.4)}` }}>{r[1]}</div>
            <div style={{ width: 340, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: r[2].length > 18 ? 24 : 28, color: C.text, borderLeft: `2px solid ${alpha(TC, 0.4)}` }}>{r[2]}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
