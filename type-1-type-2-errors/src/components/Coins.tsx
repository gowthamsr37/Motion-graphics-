// Coin-flip kit: exact binomial(10, ½) probabilities and a bar chart of "heads in 10 flips" with highlighted bars.
import React from "react";
import { useCurrentFrame } from "remotion";
import { ease } from "./Motion";
import { alpha, theme } from "../theme";

const C = theme.colors;
const choose = (n: number, k: number) => {
  let r = 1;
  for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i;
  return r;
};
export const B10 = Array.from({ length: 11 }, (_, k) => choose(10, k) / 1024);
export const tailAtLeast = (k: number) => B10.slice(k).reduce((a, b) => a + b, 0); // P(heads ≥ k)

export type BarGeo = { x0: number; x1: number; base: number; h: number };
export const bxk = (g: BarGeo, k: number) => g.x0 + ((k + 0.5) / 11) * (g.x1 - g.x0);

export const HeadsBars: React.FC<{ g: BarGeo; growAt: number; hi?: Record<number, string>; color?: string; labels?: boolean; axisLabel?: string }> = ({ g, growAt, hi = {}, color = C.cyan, labels = true, axisLabel = "HEADS IN 10 FLIPS OF A FAIR COIN" }) => {
  const frame = useCurrentFrame();
  const max = B10[5];
  const bw = (g.x1 - g.x0) / 11;
  const axis = ease(frame, [growAt - 6, growAt + 6], [0, 1]);
  return (
    <>
      {B10.map((p, k) => {
        const gr = ease(frame, [growAt + k * 2, growAt + k * 2 + 16], [0, 1], theme.ease.out);
        const h = (p / max) * g.h * gr;
        const c = hi[k] ?? color;
        return (
          <React.Fragment key={k}>
            <div style={{ position: "absolute", left: bxk(g, k) - bw * 0.36, top: g.base - Math.max(3, h), width: bw * 0.72, height: Math.max(3, h), borderRadius: "8px 8px 2px 2px", background: alpha(c, hi[k] ? 0.7 : 0.42), border: `3px solid ${c}`, boxSizing: "border-box", boxShadow: hi[k] ? `0 0 18px ${alpha(c, 0.6)}` : "none", opacity: gr > 0 ? 1 : 0 }} />
            {labels ? <div style={{ position: "absolute", left: bxk(g, k), top: g.base + 28, transform: "translate(-50%, -50%)", opacity: axis, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 24, color: hi[k] ?? C.dim }}>{k}</div> : null}
          </React.Fragment>
        );
      })}
      <div style={{ position: "absolute", left: g.x0 - 10, top: g.base + 1, width: (g.x1 - g.x0 + 20) * axis, height: 4, background: alpha(C.text, 0.4) }} />
      {labels && axisLabel ? <div style={{ position: "absolute", left: 0, right: 0, top: g.base + 64, textAlign: "center", opacity: axis, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.16em", color: C.dim }}>{axisLabel}</div> : null}
    </>
  );
};
