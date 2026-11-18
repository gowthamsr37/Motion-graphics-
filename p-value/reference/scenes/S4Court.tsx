// SCENE 4 — LIKE A COURTROOM. The null = innocent until proven guilty. Strong evidence → reject it (guilty).
// Weak evidence → "not guilty", which is not the same as "innocent" (fail to reject ≠ prove).
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { NotEqual } from "../components/Icons";
import { SceneTitle } from "../components/Kit";
import { Pop, useSpr } from "../components/Motion";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { ALT, DATA, NULLC } from "./S1Hook";

const C = theme.colors;

const Gavel: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block", overflow: "visible" }}>
    <rect x={30} y={14} width={46} height={26} rx={6} transform="rotate(-35 53 27)" fill={alpha(color, 0.4)} stroke={color} strokeWidth={6} />
    <path d="M50 40 L22 76" stroke={color} strokeWidth={9} strokeLinecap="round" />
    <rect x={44} y={80} width={46} height={10} rx={4} fill={color} />
  </svg>
);

export const S4Court: React.FC = () => {
  const spr = useSpr();
  const s = useScene("s4");
  const INNOCENT = s.sent(1).from;
  const STRONG = s.cueS(2, "strong");
  const WEAK = s.cueS(2, "Weak");
  const NOTSAME = s.cueS(2, "same");
  const row = (y: number, at: number, label: string, arrow: string, verdict: string, color: string) => {
    const p = spr(at - 4, theme.spring.bouncy);
    if (p <= 0.001) return null;
    return (
      <div style={{ position: "absolute", left: 540, top: y, width: 880, height: 140, transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, p), [0, 1], [0.85, 1])})`, opacity: Math.min(1, p * 2), boxSizing: "border-box", borderRadius: 26, background: "rgba(14,24,64,0.92)", border: `3px solid ${alpha(color, 0.75)}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 36px" }}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 34, color: C.text }}>{label}</div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 34, color, textShadow: glowText(color, 0.4) }}>{arrow}</div>
          <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.1em", color: C.dim }}>{verdict}</div>
        </div>
      </div>
    );
  };
  return (
    <AbsoluteFill>
      <SceneTitle label="LIKE A COURTROOM" color={DATA} at={2} />
      <Pop at={6} x={540} y={540} from="scale" scaleFrom={0.5} cfg={theme.spring.bouncy}>
        <Gavel size={150} color={DATA} />
      </Pop>
      <Pop at={INNOCENT - 2} x={540} y={700} from="up" dist={12} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text, whiteSpace: "nowrap" }}>
          <span style={{ color: NULLC, textShadow: glowText(NULLC, 0.5) }}>NULL</span> = INNOCENT UNTIL PROVEN GUILTY
        </div>
      </Pop>
      {row(860, STRONG, "STRONG EVIDENCE", "REJECT THE NULL", "GUILTY", ALT)}
      {row(1030, WEAK, "WEAK EVIDENCE", "FAIL TO REJECT", "NOT GUILTY", NULLC)}
      <Pop at={NOTSAME - 4} x={540} y={1190} from="up" dist={12} cfg={theme.spring.bouncy}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 38, color: C.text, whiteSpace: "nowrap" }}>
          NOT GUILTY <NotEqual size={44} color={C.red} /> INNOCENT
        </div>
      </Pop>
    </AbsoluteFill>
  );
};
