// A/B-testing kit: colours, a phone mockup with a product card and a coloured BUY button, the "p = 0.03" lockup,
// and the 100-dot visitor split (seeded shuffle: 50 to A, 50 to B).
import React from "react";
import { Rupee } from "./Icons";
import { rng } from "./Motion";
import { alpha, glowText, theme } from "../theme";

const C = theme.colors;
export const AC = C.green; // version A: the green button
export const BC = C.orange; // version B: the orange button
export const NULLC = C.cyan; // the null ("both convert the same")
export const PV = C.violet; // the p-value / the test

// exact numbers (two-proportion z-test): A 400/5000 = 8%, B 460/5000 = 9.2%, pooled 8.6%, SE 0.561 points,
// z = 2.14, two-sided p = 0.032, relative lift 9.2/8 − 1 = 15%
export const RES = { nA: 5000, nB: 5000, xA: 400, xB: 460, se: 0.5607, z: 2.14, p: 0.032 };

export const PLess: React.FC<{ v: string; size: number; color?: string; op?: string }> = ({ v, size, color = PV, op = "=" }) => (
  <span style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: size, color: C.text, whiteSpace: "nowrap" }}>
    <span style={{ fontStyle: "italic", color, textShadow: glowText(color, 0.5) }}>p</span> {op} <span style={{ fontFamily: theme.fonts.mono }}>{v}</span>
  </span>
);

export const BuyButton: React.FC<{ color: string; w: number; glow?: number }> = ({ color, w, glow = 0.4 }) => (
  <div style={{ width: w, height: w * 0.3, borderRadius: w * 0.15, background: color, boxShadow: `0 0 ${24 * glow + 6}px ${alpha(color, 0.6)}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: w * 0.13, letterSpacing: "0.04em", color: C.ink }}>BUY NOW</div>
);

export const Phone: React.FC<{ color: string; w: number; tag?: string; glow?: number }> = ({ color, w, tag, glow = 0.4 }) => {
  const h = w * 1.85;
  return (
    <div style={{ position: "relative", width: w, height: h, borderRadius: w * 0.14, background: "linear-gradient(180deg, rgba(34,50,116,0.98), rgba(16,26,70,0.98))", border: `${Math.max(3, w * 0.018)}px solid ${alpha(C.text, 0.35)}`, boxShadow: "0 20px 50px rgba(0,0,0,0.45)" }}>
      <div style={{ position: "absolute", left: "50%", top: w * 0.05, width: w * 0.28, height: w * 0.035, borderRadius: 99, transform: "translateX(-50%)", background: alpha(C.text, 0.25) }} />
      <div style={{ position: "absolute", left: w * 0.1, top: w * 0.16, width: w * 0.8, height: w * 0.72, borderRadius: w * 0.07, background: `linear-gradient(135deg, ${alpha(C.cyan, 0.3)}, ${alpha(C.violet, 0.3)})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width={w * 0.42} height={w * 0.42} viewBox="0 0 100 100">
          <path d="M18 34 L50 18 L82 34 L82 72 L50 88 L18 72 Z" fill={alpha(C.text, 0.18)} stroke={alpha(C.text, 0.7)} strokeWidth={4} strokeLinejoin="round" />
          <path d="M18 34 L50 50 L82 34 M50 50 V88" fill="none" stroke={alpha(C.text, 0.7)} strokeWidth={4} strokeLinejoin="round" />
        </svg>
      </div>
      <div style={{ position: "absolute", left: w * 0.1, top: w * 0.96, width: w * 0.55, height: w * 0.06, borderRadius: 99, background: alpha(C.text, 0.35) }} />
      <div style={{ position: "absolute", left: w * 0.1, top: w * 1.08, width: w * 0.35, height: w * 0.05, borderRadius: 99, background: alpha(C.text, 0.2) }} />
      <div style={{ position: "absolute", left: w * 0.1, top: w * 1.2, display: "flex", alignItems: "center", gap: w * 0.02, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: w * 0.09, color: C.text }}>
        <Rupee size={w * 0.085} color={C.text} />
        999
      </div>
      <div style={{ position: "absolute", left: w * 0.1, top: w * 1.45 }}>
        <BuyButton color={color} w={w * 0.8} glow={glow} />
      </div>
      {tag ? (
        <div style={{ position: "absolute", left: "50%", top: -w * 0.13, transform: "translate(-50%, -50%)", width: w * 0.24, height: w * 0.24, borderRadius: "50%", background: color, boxShadow: `0 0 20px ${alpha(color, 0.6)}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: w * 0.15, color: C.ink }}>{tag}</div>
      ) : null}
    </div>
  );
};

// 100 visitor dots: which half each one is randomly assigned to (exactly 50 / 50), and its slot inside that half
export const SPLIT = (() => {
  const r = rng(11);
  const idx = Array.from({ length: 100 }, (_, i) => i);
  for (let i = 99; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  const side = new Array<number>(100);
  const slot = new Array<number>(100);
  idx.forEach((d, k) => {
    side[d] = k < 50 ? 0 : 1;
    slot[d] = k % 50;
  });
  return { side, slot };
})();
