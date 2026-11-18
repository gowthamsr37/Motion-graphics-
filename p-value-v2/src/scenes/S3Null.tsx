// SCENE 3 — THE NULL HYPOTHESIS = THE BORING EXPLANATION: nothing special is going on. Three cards: THE COIN IS FAIR ·
// THE DRUG DOES NOTHING · THE BUTTON CHANGES NOTHING.
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { SceneTitle } from "../components/Kit";
import { Pop, useSpr } from "../components/Motion";
import { Coin } from "../components/Prob";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { NULLC } from "./S1Hook";

const C = theme.colors;

export const PillIcon: React.FC<{ w: number }> = ({ w }) => (
  <svg width={w} height={w * 0.42} viewBox="0 0 100 42" style={{ display: "block", overflow: "visible" }}>
    <rect x={3} y={3} width={94} height={36} rx={18} fill={alpha(NULLC, 0.25)} stroke={NULLC} strokeWidth={4} />
    <path d="M50 3 V39" stroke={NULLC} strokeWidth={4} />
    <rect x={50} y={3} width={47} height={36} rx={18} fill={alpha(C.orange, 0.45)} />
  </svg>
);

const ButtonIcon: React.FC<{ w: number }> = ({ w }) => (
  <div style={{ width: w, height: w * 0.36, borderRadius: w * 0.18, background: C.green, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: w * 0.15, color: C.ink, boxShadow: `0 0 18px ${alpha(C.green, 0.5)}` }}>BUY NOW</div>
);

const Card: React.FC<{ y: number; at: number; icon: React.ReactNode; t: string; sub: string }> = ({ y, at, icon, t, sub }) => {
  const spr = useSpr();
  const p = spr(at - 6, theme.spring.bouncy);
  if (p <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: 90, top: y, width: 900, height: 170, transform: `translateY(-50%) translateX(${(1 - Math.min(1, p)) * -40}px)`, opacity: Math.min(1, p * 2), boxSizing: "border-box", borderRadius: 28, background: `linear-gradient(90deg, ${alpha(NULLC, 0.16)}, rgba(14,24,64,0.92) 60%)`, border: `3px solid ${alpha(NULLC, 0.75)}`, display: "flex", alignItems: "center", gap: 34, paddingLeft: 40 }}>
      <div style={{ width: 170, display: "flex", justifyContent: "center", transform: `scale(${interpolate(Math.min(1, p), [0, 1], [0.6, 1])})` }}>{icon}</div>
      <div>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text }}>{t}</div>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.14em", color: C.dim, marginTop: 6 }}>{sub}</div>
      </div>
    </div>
  );
};

export const S3Null: React.FC = () => {
  const s = useScene("s3");
  return (
    <AbsoluteFill>
      <SceneTitle label="THE NULL HYPOTHESIS" color={NULLC} at={2} />
      <Pop at={s.cueS(0, "boring") - 6} x={540} y={410} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
        <div style={{ textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, whiteSpace: "nowrap" }}>
          <div style={{ fontSize: 56, color: C.text }}>
            THE <span style={{ color: NULLC, textShadow: glowText(NULLC, 0.5) }}>BORING</span> EXPLANATION
          </div>
          <div style={{ fontSize: 30, color: C.dim, marginTop: 10 }}>&ldquo;nothing special is going on&rdquo;</div>
        </div>
      </Pop>
      <Card y={650} at={s.cueS(1, "coin")} icon={<Coin side="H" size={120} />} t="The coin is fair" sub="HEADS AND TAILS 50/50" />
      <Card y={860} at={s.cueS(1, "drug")} icon={<PillIcon w={160} />} t="The drug does nothing" sub="SAME AS A PLACEBO" />
      <Card y={1070} at={s.cueS(1, "button")} icon={<ButtonIcon w={170} />} t="The button changes nothing" sub="SAME NUMBER OF CLICKS" />
    </AbsoluteFill>
  );
};
