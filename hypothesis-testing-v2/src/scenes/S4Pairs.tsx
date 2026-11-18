// SCENE 4 — EVERY TEST HAS THIS PAIR. A table with H0 (cyan) and H1 (orange) columns: COIN fair | biased ·
// WEBSITE BUTTON no change | more clicks · TEACHING METHOD no difference | higher scores.
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { SceneTitle } from "../components/Kit";
import { useSpr } from "../components/Motion";
import { Coin } from "../components/Prob";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";
import { ALT, NULLC } from "./S1Hook";

const C = theme.colors;

export const GradCap: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size * 0.8} viewBox="0 0 100 80" style={{ display: "block", overflow: "visible" }}>
    <path d="M50 8 L96 28 L50 48 L4 28 Z" fill={alpha(color, 0.35)} stroke={color} strokeWidth={5} strokeLinejoin="round" />
    <path d="M24 38 V58 Q50 74 76 58 V38" fill="none" stroke={color} strokeWidth={5} strokeLinejoin="round" />
    <path d="M88 32 V56" stroke={color} strokeWidth={4} strokeLinecap="round" />
  </svg>
);

const Btn: React.FC<{ w: number }> = ({ w }) => (
  <div style={{ width: w, height: w * 0.4, borderRadius: w * 0.2, background: C.green, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: w * 0.16, color: C.ink }}>CLICK</div>
);

const PairRow: React.FC<{ y: number; at: number; icon: React.ReactNode; topic: string; h0: string; h1: string }> = ({ y, at, icon, topic, h0, h1 }) => {
  const spr = useSpr();
  const p = spr(at - 6, theme.spring.bouncy);
  const q = spr(at + 6, theme.spring.pop);
  if (p <= 0.001) return null;
  const cell = (t: string, c: string, x: number) => (
    <div style={{ position: "absolute", left: x, top: 22, width: 290, height: 116, boxSizing: "border-box", borderRadius: 20, background: alpha(c, 0.16), border: `3px solid ${alpha(c, 0.8)}`, display: "flex", alignItems: "center", justifyContent: "center", opacity: Math.min(1, q * 2), transform: `scale(${interpolate(Math.min(1, q), [0, 1], [0.7, 1])})`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 34, color: C.text, whiteSpace: "nowrap" }}>{t}</div>
  );
  return (
    <div style={{ position: "absolute", left: 90, top: y, width: 900, height: 160, transform: `translateY(-50%) translateX(${(1 - Math.min(1, p)) * -40}px)`, opacity: Math.min(1, p * 2), boxSizing: "border-box", borderRadius: 28, background: "rgba(14,24,64,0.88)", border: `2px solid ${C.edge}` }}>
      <div style={{ position: "absolute", left: 20, top: 0, width: 240, height: 160, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
        {icon}
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 19, letterSpacing: "0.12em", color: C.dim, whiteSpace: "nowrap" }}>{topic}</div>
      </div>
      {cell(h0, NULLC, 280)}
      {cell(h1, ALT, 590)}
    </div>
  );
};

export const S4Pairs: React.FC = () => {
  const spr = useSpr();
  const s = useScene("s4");
  const head = spr(s.sent(0).from, theme.spring.smooth);
  return (
    <AbsoluteFill>
      <SceneTitle label="EVERY TEST HAS THIS PAIR" color={ALT} at={2} />
      <div style={{ position: "absolute", left: 370, top: 440, width: 290, textAlign: "center", opacity: Math.min(1, head * 2), fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: NULLC }}>H0 · NULL</div>
      <div style={{ position: "absolute", left: 680, top: 440, width: 290, textAlign: "center", opacity: Math.min(1, head * 2), fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: ALT }}>H1 · ALTERNATIVE</div>
      <PairRow y={590} at={s.cueS(1, "coin:")} icon={<Coin side="H" size={70} />} topic="A COIN" h0="Fair" h1="Biased" />
      <PairRow y={780} at={s.cueS(1, "website")} icon={<Btn w={110} />} topic="WEBSITE BUTTON" h0="No change" h1="More clicks" />
      <PairRow y={970} at={s.sent(2).from} icon={<GradCap size={80} color={C.violet} />} topic="TEACHING METHOD" h0="No difference" h1="Higher scores" />
    </AbsoluteFill>
  );
};
