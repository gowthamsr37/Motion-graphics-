// Poisson helpers: exact probabilities, a seeded sampler, and a bar chart for counts 0…kmax.
import React from "react";
import { rng } from "./Motion";
import { alpha, theme } from "../theme";

const C = theme.colors;
export const pois = (lam: number, k: number) => {
  let f = 1;
  for (let i = 2; i <= k; i++) f *= i;
  return (Math.exp(-lam) * lam ** k) / f;
};
export const poisDist = (lam: number, kmax: number) => Array.from({ length: kmax + 1 }, (_, k) => pois(lam, k));
// Knuth's method, deterministic for a seed
export const poisSamples = (lam: number, n: number, seed: number) => {
  const r = rng(seed);
  return Array.from({ length: n }, () => {
    const L = Math.exp(-lam);
    let k = 0;
    let p = 1;
    do {
      k++;
      p *= r();
    } while (p > L);
    return k - 1;
  });
};

export const CountBars: React.FC<{ vals: number[]; x0: number; x1: number; base: number; h: number; scaleMax: number; color: string; grow?: number; hi?: Record<number, string>; labels?: boolean; labelEvery?: number }> = ({ vals, x0, x1, base, h, scaleMax, color, grow = 1, hi = {}, labels = true, labelEvery = 1 }) => {
  const n = vals.length;
  const bw = (x1 - x0) / n;
  return (
    <>
      {vals.map((v, k) => {
        const hh = (v / scaleMax) * h * grow;
        const c = hi[k] ?? color;
        return <div key={k} style={{ position: "absolute", left: x0 + k * bw + bw * 0.12, top: base - hh, width: bw * 0.76, height: Math.max(2, hh), borderRadius: "8px 8px 2px 2px", background: alpha(c, hi[k] ? 0.7 : 0.45), border: `2px solid ${c}`, boxSizing: "border-box", boxShadow: hi[k] ? `0 0 18px ${alpha(c, 0.6)}` : "none" }} />;
      })}
      <div style={{ position: "absolute", left: x0 - 10, top: base + 1, width: x1 - x0 + 20, height: 4, background: alpha(C.text, 0.4) }} />
      {labels
        ? vals.map((_, k) =>
            k % labelEvery === 0 ? (
              <div key={`l${k}`} style={{ position: "absolute", left: x0 + (k + 0.5) * bw, top: base + 30, transform: "translate(-50%, -50%)", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 22, color: hi[k] ?? C.dim }}>{k}</div>
            ) : null,
          )
        : null}
    </>
  );
};
