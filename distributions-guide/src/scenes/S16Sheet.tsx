// SCENE 16 — THE CHEAT SHEET. All twelve rows (question → name + mini shape) cascade in; SAVE and SEND badges pop on
// their words; FULL VIDEO ON EACH ONE in the title pill.
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { BONUS, Bookmark, DIST } from "../components/Guide";
import { SceneTitle } from "../components/Kit";
import { useSpr } from "../components/Motion";
import { CheatRow } from "../components/Pick";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

const Plane: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block", overflow: "visible", filter: `drop-shadow(0 0 10px ${alpha(color, 0.6)})` }}>
    <path d="M8 46 L92 10 L66 90 L48 58 Z" fill={alpha(color, 0.3)} stroke={color} strokeWidth={6} strokeLinejoin="round" />
    <path d="M48 58 L92 10" stroke={color} strokeWidth={5} strokeLinecap="round" />
  </svg>
);

const Badge: React.FC<{ x: number; at: number; label: string; color: string; icon: React.ReactNode }> = ({ x, at, label, color, icon }) => {
  const spr = useSpr();
  const p = spr(at - 4, theme.spring.pop);
  if (p <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: x, top: 286, transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, p), [0, 1], [0.4, 1])})`, opacity: Math.min(1, p * 2), display: "flex", alignItems: "center", gap: 10, padding: "8px 16px", borderRadius: 999, background: alpha(color, 0.2), border: `2px solid ${color}`, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.12em", color: C.text }}>
      {icon}
      {label}
    </div>
  );
};

export const S16Sheet: React.FC = () => {
  const s = useScene("s16");
  const S0 = s.sent(0).from;
  return (
    <AbsoluteFill>
      <SceneTitle label="THE CHEAT SHEET" pill="FULL VIDEO ON EACH ONE" color={BONUS} at={2} pillAt={s.sent(2).from} />
      <Badge x={170} at={s.cueS(1, "send")} label="SEND" color={C.cyan} icon={<Plane size={26} color={C.cyan} />} />
      <Badge x={910} at={s.cueS(1, "Save")} label="SAVE" color={BONUS} icon={<Bookmark size={26} color={BONUS} />} />
      {DIST.map((d, i) => (
        <CheatRow key={d.kind} y={450 + i * 84} q={d.q} name={d.short} kind={d.kind} color={d.c} at={S0 - 6 + i * 3} nameAt={S0 + i * 3} h={76} qSize={23} nameSize={32} />
      ))}
    </AbsoluteFill>
  );
};
