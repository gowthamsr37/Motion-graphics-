// SCENE 5 — LIKE A COURTROOM. H0 = INNOCENT UNTIL PROVEN GUILTY. STRONG EVIDENCE: REJECT H0 (guilty). NOT ENOUGH
// EVIDENCE: FAIL TO REJECT (not guilty) → NOT GUILTY ≠ INNOCENT.
import React from "react";
import { AbsoluteFill } from "remotion";
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

const Row: React.FC<{ y: number; at: number; left: string; right: string; sub: string; c: string }> = ({ y, at, left, right, sub, c }) => {
  const spr = useSpr();
  const p = spr(at - 6, theme.spring.bouncy);
  if (p <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: 90, top: y, width: 900, height: 140, transform: `translateY(-50%) translateX(${(1 - Math.min(1, p)) * -40}px)`, opacity: Math.min(1, p * 2), boxSizing: "border-box", borderRadius: 26, background: `linear-gradient(90deg, rgba(14,24,64,0.92) 40%, ${alpha(c, 0.2)})`, border: `3px solid ${alpha(c, 0.8)}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 34px" }}>
      <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 34, color: C.text, whiteSpace: "nowrap" }}>{left}</div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 34, color: c, textShadow: glowText(c, 0.4), whiteSpace: "nowrap" }}>{right}</div>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 19, letterSpacing: "0.14em", color: C.dim }}>{sub}</div>
      </div>
    </div>
  );
};

export const S5Court: React.FC = () => {
  const s = useScene("s5");
  return (
    <AbsoluteFill>
      <SceneTitle label="LIKE A COURTROOM" color={DATA} at={2} />
      <Pop at={4} x={540} y={430} from="scale" scaleFrom={0.4} cfg={theme.spring.pop}>
        <Gavel size={120} color={DATA} />
      </Pop>
      <Pop at={s.cueS(0, "innocent") - 6} x={540} y={580} from="up" dist={12} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text, whiteSpace: "nowrap" }}>
          <span style={{ color: NULLC, textShadow: glowText(NULLC, 0.5) }}>H0</span> = INNOCENT UNTIL PROVEN GUILTY
        </div>
      </Pop>
      <Row y={740} at={s.cueS(1, "strong")} left="STRONG EVIDENCE" right="REJECT H0" sub="GUILTY" c={ALT} />
      <Row y={910} at={s.cueS(1, "Not")} left="NOT ENOUGH EVIDENCE" right="FAIL TO REJECT" sub="NOT GUILTY" c={NULLC} />
      <Pop at={s.cueS(1, "innocent.") - 8} x={540} y={1090} from="up" dist={12} cfg={theme.spring.bouncy}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "12px 30px", borderRadius: 999, background: alpha(C.red, 0.12), border: `3px solid ${alpha(C.red, 0.8)}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text, whiteSpace: "nowrap" }}>
          NOT GUILTY <NotEqual size={42} color={C.red} /> INNOCENT
        </div>
      </Pop>
    </AbsoluteFill>
  );
};
