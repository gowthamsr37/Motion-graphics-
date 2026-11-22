// z vs t kit: the two colours (z = cyan, t = violet), a split card, a verdict row and a t-density helper.
import React from "react";
import { interpolate } from "remotion";
import { useSpr } from "./Motion";
import { tpdf } from "./TDist";
import { alpha, glowText, theme } from "../theme";

const C = theme.colors;
export const ZC = C.cyan;
export const TC = C.violet;
export const SEc = C.green;
export const TL = C.orange;
export const td = (df: number) => (v: number) => tpdf(v, df);

export const Split: React.FC<{ y: number; h: number; at: number; atR?: number; left: React.ReactNode; right: React.ReactNode; tagL?: string; tagR?: string }> = ({ y, h, at, atR, left, right, tagL = "z-TEST", tagR = "t-TEST" }) => {
  const spr = useSpr();
  const a = spr(at - 6, theme.spring.bouncy);
  const b = spr((atR ?? at) - 6, theme.spring.bouncy);
  const card = (k: number, c: string, tag: string, body: React.ReactNode, x: number) =>
    k > 0.001 ? (
      <div style={{ position: "absolute", left: x, top: y, width: 430, height: h, boxSizing: "border-box", borderRadius: 30, background: `linear-gradient(180deg, ${alpha(c, 0.2)}, rgba(14,24,64,0.92) 55%)`, border: `3px solid ${c}`, opacity: Math.min(1, k * 2), transform: `translateY(${(1 - Math.min(1, k)) * 40}px) scale(${interpolate(Math.min(1, k), [0, 1], [0.92, 1])})`, padding: "22px 26px", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 42, color: c, textShadow: glowText(c, 0.4) }}>{tag}</div>
        {body}
      </div>
    ) : null;
  return (
    <>
      {card(a, ZC, tagL, left, 90)}
      {card(b, TC, tagR, right, 560)}
    </>
  );
};
