// Shared bits for the gambler's fallacy reel: a row of coin results, a roulette result ball, an answer card.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Coin, RED } from "../components/Casino";
import { ease } from "../components/Motion";
import { alpha, theme } from "../theme";

const C = theme.colors;

export const CoinRow: React.FC<{ faces: ("H" | "T" | "?")[]; at: number[]; size?: number }> = ({ faces, at, size = 130 }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 14 }}>
      {faces.map((f, i) => {
        const p = ease(frame, [at[i], at[i] + 10], [0, 1]);
        if (f === "?")
          return (
            <div key={i} style={{ width: size, height: size, borderRadius: size / 2, border: `5px dashed ${C.yellow}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: size * 0.5, color: C.yellow, opacity: p, transform: `scale(${1 + Math.abs(Math.sin(frame / 8)) * 0.06})` }}>?</div>
          );
        return (
          <div key={i} style={{ opacity: Math.min(1, p * 3), transform: `translateY(${(1 - p) * -60}px)` }}>
            <Coin size={size} flip={(1 - p) * 3} face={f} />
          </div>
        );
      })}
    </div>
  );
};

export const Ball: React.FC<{ c: "R" | "B"; size?: number; p?: number }> = ({ c, size = 70, p = 1 }) => (
  <div style={{ width: size, height: size, borderRadius: size / 2, background: c === "R" ? RED : "radial-gradient(circle at 35% 30%, #4B5563, #0B0B0B 70%)", border: `4px solid ${c === "R" ? "#FCA5A5" : "#E5E7EB"}`, boxShadow: `0 0 12px ${alpha(c === "R" ? RED : "#9CA3AF", 0.5)}`, transform: `scale(${p})`, opacity: Math.min(1, p * 2) }} />
);
