// SCENE 10 — THREE INTERVIEW TRAPS. 1 SIGMA UNKNOWN + SMALL n → t-TEST · 2 ONE-TAILED: cut-off −1.645, p = 0.023 ·
// 3 Z-SCORE ≠ Z-TEST.
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { NotEqual } from "../components/Icons";
import { SceneTitle } from "../components/Kit";
import { useSpr } from "../components/Motion";
import { CLAIM, SE, Sigma, TAIL } from "../components/ZKit";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

const Trap: React.FC<{ y: number; at: number; n: number; c: string; head: React.ReactNode; body: React.ReactNode }> = ({ y, at, n, c, head, body }) => {
  const spr = useSpr();
  const p = spr(at - 6, theme.spring.bouncy);
  if (p <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: 90, top: y, width: 900, height: 220, boxSizing: "border-box", borderRadius: 30, background: `linear-gradient(90deg, ${alpha(c, 0.18)}, rgba(14,24,64,0.9) 55%)`, border: `3px solid ${c}`, opacity: Math.min(1, p * 2), transform: `translateX(${(1 - Math.min(1, p)) * 60}px) scale(${interpolate(Math.min(1, p), [0, 1], [0.94, 1])})`, padding: "26px 34px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 42, color: C.text, whiteSpace: "nowrap" }}>
        <span style={{ width: 56, height: 56, borderRadius: 28, background: c, color: C.ink, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>{n}</span>
        {head}
      </div>
      <div style={{ marginTop: 18, fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 34, color: C.dim, whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 10 }}>{body}</div>
    </div>
  );
};

export const S10Traps: React.FC = () => {
  const s = useScene("s10");
  return (
    <AbsoluteFill>
      <SceneTitle label="THREE INTERVIEW TRAPS" color={TAIL} at={2} />
      <Trap y={400} at={s.sent(1).from} n={1} c={SE} head={<>Z OR t?</>} body={<><Sigma size={36} color={SE} /> unknown + small sample <span style={{ color: SE }}>= t-TEST</span></>} />
      <Trap y={650} at={s.sent(2).from} n={2} c={CLAIM} head={<>ONE TAIL OR TWO?</>} body={<>One-tailed: cut-off <span style={{ fontFamily: theme.fonts.mono, color: CLAIM }}>−1.645</span>, p = <span style={{ fontFamily: theme.fonts.mono, color: CLAIM }}>0.0228</span></>} />
      <Trap y={900} at={s.sent(3).from} n={3} c={TAIL} head={<>Z-SCORE <NotEqual size={38} color={C.text} /> Z-TEST</>} body={<>Score: one value · Test: a sample mean vs a claim</>} />
    </AbsoluteFill>
  );
};
