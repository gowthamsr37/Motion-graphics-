// SCENE 4 — THE TEST. 10 tries, each a 50-50 guess: the exact binomial bars for 0–10 right. 5 right is the most likely
// (24.6%, about 1 in 4); 7 right ≈ 12%; all 10 right = 1/1024 (< 1 in 1,000).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { SceneTitle } from "../components/Kit";
import { ease, Pop, useSpr } from "../components/Motion";
import { Pill } from "../components/Nodes";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { AVGC, BARS, FAIL, SUCC } from "./S1Hook";

const C = theme.colors;
const comb = (n: number, k: number) => {
  let r = 1;
  for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i;
  return r;
};
export const binom = (n: number, p: number) => Array.from({ length: n + 1 }, (_, k) => comb(n, k) * p ** k * (1 - p) ** (n - k));
export const X0 = 130;
export const X1 = 950;
export const BASE = 1180;
export const HMAX = 0.31; // the bar scale (fits both p = 1/2 and p = 1/5)
export const H = 560;
export const bx = (k: number) => X0 + ((k + 0.5) / 11) * (X1 - X0);
export const BW = ((X1 - X0) / 11) * 0.76;

export const BinomBars: React.FC<{ vals: number[]; grow: number; hi: Record<number, string> }> = ({ vals, grow, hi }) => (
  <>
    {vals.map((v, k) => {
      const h = (v / HMAX) * H * grow;
      const c = hi[k] ?? BARS;
      return <div key={k} style={{ position: "absolute", left: bx(k) - BW / 2, top: BASE - h, width: BW, height: Math.max(2, h), borderRadius: "8px 8px 2px 2px", background: alpha(c, hi[k] ? 0.7 : 0.45), border: `2px solid ${c}`, boxSizing: "border-box", boxShadow: hi[k] ? `0 0 18px ${alpha(c, 0.6)}` : "none" }} />;
    })}
    <div style={{ position: "absolute", left: X0 - 10, top: BASE + 1, width: X1 - X0 + 20, height: 4, background: alpha(C.text, 0.4) }} />
    {vals.map((_, k) => (
      <div key={`l${k}`} style={{ position: "absolute", left: bx(k), top: BASE + 30, transform: "translate(-50%, -50%)", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 24, color: hi[k] ?? C.dim }}>{k}</div>
    ))}
    <div style={{ position: "absolute", left: 0, right: 0, top: BASE + 70, textAlign: "center", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.18em", color: C.dim }}>NUMBER RIGHT (OUT OF 10)</div>
  </>
);

const B50 = binom(10, 0.5);

export const S4Test: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s4");
  const FIVE = s.sent(1).from;
  const SEVEN = s.sent(2).from;
  const TEN = s.sent(3).from;
  const grow = ease(frame, [10, 34], [0, 1], theme.ease.out);
  const hi: Record<number, string> = {};
  if (frame >= FIVE - 4) hi[5] = SUCC;
  if (frame >= SEVEN - 4) hi[7] = FAIL;
  if (frame >= TEN - 4) hi[10] = C.cyan;
  const label = (k: number, at: number, text: string, c: string, dy = 0) => {
    const p = spr(at, theme.spring.pop);
    if (p <= 0.01) return null;
    const top = BASE - (B50[k] / HMAX) * H - 40 + dy;
    return <div style={{ position: "absolute", left: bx(k), top, transform: `translate(-50%, -50%) scale(${interpolate(p, [0, 1], [0.5, 1])})`, opacity: Math.min(1, p * 2), padding: "4px 14px", borderRadius: 12, background: "#0A1440", border: `3px solid ${c}`, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 28, color: C.text, whiteSpace: "nowrap" }}>{text}</div>;
  };

  return (
    <AbsoluteFill>
      <SceneTitle label="BACK TO THE TEST" color={BARS} at={2} />
      <Pop at={s.cueS(0, "10") - 4} x={330} y={420} from="left" dist={20} cfg={theme.spring.bouncy}>
        <Pill label="10 TRIES" color={AVGC} size={32} glow={0.4} />
      </Pop>
      <Pop at={s.cueS(0, "guess.") - 8} x={750} y={420} from="right" dist={20} cfg={theme.spring.bouncy}>
        <Pill label="50-50 EACH" color={BARS} size={32} glow={0.4} />
      </Pop>
      <BinomBars vals={B50} grow={grow} hi={hi} />
      {label(5, FIVE, "25%", SUCC)}
      {label(7, SEVEN, "12%", FAIL)}
      {label(10, TEN + 4, "0.1%", C.cyan, -30)}
      <Pop at={FIVE + 8} out={SEVEN - 4} x={540} y={540} from="up" dist={14}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text, whiteSpace: "nowrap" }}>
          <span style={{ color: SUCC, textShadow: glowText(SUCC, 0.5) }}>5 RIGHT</span>: ABOUT 1 IN 4
        </div>
      </Pop>
      <Pop at={TEN + 6} x={540} y={540} from="up" dist={14}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text, whiteSpace: "nowrap" }}>
          <span style={{ color: C.cyan }}>ALL 10</span>: UNDER 1 IN 1,000
        </div>
      </Pop>
    </AbsoluteFill>
  );
};
