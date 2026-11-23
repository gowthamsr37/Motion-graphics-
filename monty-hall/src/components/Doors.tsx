// Monty Hall kit: a game-show Door (numbered, opens to reveal a car or a goat), a Goat glyph, and the seeded 1,000-game
// simulation (mulberry32(9): always-switch wins 667, always-stick wins 333).
import React from "react";
import { Car } from "./Casino";
import { alpha, theme } from "../theme";

const C = theme.colors;
export const HOT = "#FF8A00";

export const Goat: React.FC<{ size: number; color?: string }> = ({ size, color = "#E5E7EB" }) => (
  <svg width={size} height={size * 0.8} viewBox="0 0 100 80" style={{ display: "block" }}>
    <ellipse cx={45} cy={42} rx={30} ry={16} fill={color} />
    <path d="M70 34 L84 22 L92 30 L80 42 Z" fill={color} />
    <path d="M82 22 Q80 10 72 8 M86 22 Q90 10 98 10" stroke="#9CA3AF" strokeWidth={4} fill="none" strokeLinecap="round" />
    <circle cx={86} cy={28} r={2.6} fill="#111827" />
    <path d="M88 38 Q90 46 86 48" stroke={color} strokeWidth={4} fill="none" />
    {[24, 36, 54, 64].map((x) => (
      <rect key={x} x={x} y={52} width={6} height={22} rx={3} fill={color} />
    ))}
    <path d="M15 38 Q6 30 10 24" stroke={color} strokeWidth={5} fill="none" strokeLinecap="round" />
  </svg>
);

// open: 0 closed → 1 fully open; prize shown behind; tag: "YOU" / "HOST" etc.
export const Door: React.FC<{ n: number | string; w?: number; open?: number; prize?: "car" | "goat"; hl?: string; dim?: number; tag?: React.ReactNode }> = ({ n, w = 240, open = 0, prize = "goat", hl, dim = 0, tag }) => {
  const h = w * 1.5;
  return (
    <div style={{ position: "relative", width: w, height: h, opacity: 1 - dim * 0.7 }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "18px 18px 6px 6px", background: "rgba(5,10,31,0.95)", border: `4px solid ${alpha(C.text, 0.25)}`, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: h * 0.18, boxSizing: "border-box" }}>
        {prize === "car" ? <Car size={w * 0.82} color={C.yellow} /> : <Goat size={w * 0.7} />}
      </div>
      <div style={{ position: "absolute", inset: 0, transformOrigin: "left center", transform: `perspective(900px) rotateY(${-open * 78}deg)`, borderRadius: "18px 18px 6px 6px", background: `linear-gradient(180deg, ${HOT}, #C2410C)`, border: `4px solid ${hl ?? "#FDBA74"}`, boxShadow: hl ? `0 0 30px ${hl}` : "0 10px 30px rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: w * 0.42, color: "#1A0A00", backfaceVisibility: "hidden" }}>
        {n}
        <div style={{ position: "absolute", right: w * 0.1, top: "52%", width: w * 0.07, height: w * 0.07, borderRadius: "50%", background: "#1A0A00" }} />
      </div>
      {tag ? <div style={{ position: "absolute", left: "50%", top: -18, transform: "translate(-50%, -100%)" }}>{tag}</div> : null}
    </div>
  );
};

const mul = (a: number) => () => {
  a |= 0;
  a = (a + 0x6d2b79f5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
// true = switching wins that game
export const GAMES: boolean[] = (() => {
  const r = mul(9);
  const out: boolean[] = [];
  for (let k = 0; k < 1000; k++) {
    const car = Math.floor(r() * 3);
    const pick = Math.floor(r() * 3);
    out.push(car !== pick);
  }
  return out;
})();
