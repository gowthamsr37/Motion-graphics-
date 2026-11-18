// SCENE 5 — WHAT YOU'LL BUILD. Four project cards land on their words: HOUSE PRICES (regression) · CUSTOMER CHURN
// (classification) · SPAM FILTER (text) · IMAGE CLASSIFIER (deep learning).
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { House } from "../components/Icons";
import { SceneTitle } from "../components/Kit";
import { Envelope, ImageIcon, UserIcon } from "../components/ML";
import { useSpr } from "../components/Motion";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

const Project: React.FC<{ x: number; y: number; at: number; name: string; tag: string; c: string; icon: React.ReactNode }> = ({ x, y, at, name, tag, c, icon }) => {
  const spr = useSpr();
  const p = spr(at - 6, theme.spring.bouncy);
  if (p <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 420, height: 380, transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, p), [0, 1], [0.6, 1])})`, opacity: Math.min(1, p * 2), boxSizing: "border-box", borderRadius: 32, background: `linear-gradient(180deg, ${alpha(c, 0.2)}, rgba(14,24,64,0.92) 70%)`, border: `3px solid ${c}`, boxShadow: `0 0 28px ${alpha(c, 0.3)}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 22 }}>
      {icon}
      <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 38, lineHeight: 1.1, textAlign: "center", whiteSpace: "pre-line", color: C.text, textShadow: glowText(c, 0.4) }}>{name}</div>
      <div style={{ padding: "6px 16px", borderRadius: 999, background: alpha(c, 0.22), fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.14em", color: c }}>{tag}</div>
    </div>
  );
};

export const S5Projects: React.FC = () => {
  const s = useScene("s5");
  return (
    <AbsoluteFill>
      <SceneTitle label="WHAT YOU'LL BUILD" pill="REAL PROJECTS" color={C.yellow} at={2} pillAt={s.sent(0).from} />
      <Project x={315} y={640} at={s.cueS(1, "house")} name={"HOUSE\nPRICES"} tag="REGRESSION" c={C.cyan} icon={<House w={130} color={C.cyan} />} />
      <Project x={765} y={640} at={s.cueS(1, "customer")} name={"CUSTOMER\nCHURN"} tag="CLASSIFICATION" c={C.violet} icon={<UserIcon w={120} color={C.violet} />} />
      <Project x={315} y={1060} at={s.cueS(1, "spam")} name={"SPAM\nFILTER"} tag="TEXT" c={C.orange} icon={<Envelope w={140} color={C.orange} />} />
      <Project x={765} y={1060} at={s.cueS(1, "image")} name={"IMAGE\nCLASSIFIER"} tag="DEEP LEARNING" c={C.green} icon={<ImageIcon w={140} color={C.green} />} />
    </AbsoluteFill>
  );
};
