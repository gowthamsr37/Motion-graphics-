// SCENE 7 — WHICH IS WORSE? IT DEPENDS. Medical screening: a missed disease can be deadly → avoid TYPE 2.
// A court: jailing an innocent person is a Type 1 error → demand strong evidence (avoid TYPE 1).
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { T1C, T2C } from "../components/Errors";
import { SceneTitle } from "../components/Kit";
import { Pop, useSpr } from "../components/Motion";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

const Cross: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block", overflow: "visible", filter: `drop-shadow(0 0 12px ${alpha(color, 0.6)})` }}>
    <path d="M38 10 H62 V38 H90 V62 H62 V90 H38 V62 H10 V38 H38 Z" fill={alpha(color, 0.3)} stroke={color} strokeWidth={5} strokeLinejoin="round" />
  </svg>
);

const Scales: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block", overflow: "visible", filter: `drop-shadow(0 0 12px ${alpha(color, 0.6)})` }}>
    <path d="M50 12 V86 M30 88 H70 M18 26 H82" stroke={color} strokeWidth={5} strokeLinecap="round" fill="none" />
    <path d="M18 26 L6 56 H30 Z M82 26 L70 56 H94 Z" fill={alpha(color, 0.3)} stroke={color} strokeWidth={4} strokeLinejoin="round" />
    <circle cx={50} cy={12} r={6} fill={color} />
  </svg>
);

const Case: React.FC<{ y: number; at: number; icon: React.ReactNode; where: string; risk: string; avoid: string; color: string }> = ({ y, at, icon, where, risk, avoid, color }) => {
  const spr = useSpr();
  const p = spr(at - 6, theme.spring.bouncy);
  if (p <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: 90, top: y, width: 900, height: 270, transform: `translateY(-50%) scale(${interpolate(Math.min(1, p), [0, 1], [0.85, 1])})`, opacity: Math.min(1, p * 2), boxSizing: "border-box", borderRadius: 30, background: `linear-gradient(90deg, ${alpha(color, 0.18)}, rgba(14,24,64,0.92) 65%)`, border: `3px solid ${color}` }}>
      <div style={{ position: "absolute", left: 50, top: 135, transform: "translateY(-50%)" }}>{icon}</div>
      <div style={{ position: "absolute", left: 210, top: 40, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.16em", color: C.dim }}>{where}</div>
      <div style={{ position: "absolute", left: 210, top: 82, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 36, color: C.text, whiteSpace: "nowrap" }}>{risk}</div>
      <div style={{ position: "absolute", left: 210, top: 160, padding: "8px 20px", borderRadius: 999, background: alpha(color, 0.22), border: `3px solid ${color}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 32, color: C.text, whiteSpace: "nowrap" }}>
        AVOID <span style={{ color, textShadow: glowText(color, 0.5) }}>{avoid}</span>
      </div>
    </div>
  );
};

export const S7Worse: React.FC = () => {
  const s = useScene("s7");
  return (
    <AbsoluteFill>
      <SceneTitle label="WHICH IS WORSE?" color={T1C} at={2} />
      <Pop at={s.cueS(0, "depends.") - 4} x={540} y={420} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 64, color: C.text, whiteSpace: "nowrap" }}>
          IT <span style={{ color: C.yellow, textShadow: glowText(C.yellow, 0.5) }}>DEPENDS</span>
        </div>
      </Pop>
      <Case y={680} at={s.sent(1).from} icon={<Cross size={120} color={T2C} />} where="DISEASE SCREENING" risk="A missed disease can be deadly" avoid="TYPE 2" color={T2C} />
      <Case y={1000} at={s.sent(2).from} icon={<Scales size={120} color={T1C} />} where="A COURT" risk="Never jail an innocent person" avoid="TYPE 1" color={T1C} />
    </AbsoluteFill>
  );
};
