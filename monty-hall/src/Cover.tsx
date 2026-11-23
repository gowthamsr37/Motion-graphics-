// ADAPT FOR THIS VIDEO: copied from the reference project (house style). Keep the layer stack, look and mix; replace scene list, cues and cover text.
// Monty Hall cover on the shared Probability Paradoxes cover.
import React from "react";
import { getInputProps } from "remotion";
import { ParadoxCover, PPALS, PARADOX_PAL } from "./components/ParadoxCover";
import { theme } from "./theme";

export const Cover: React.FC = () => {
  const pal = (getInputProps() as { pal?: string }).pal;
  const P = PPALS[pal ?? PARADOX_PAL];
  return (
    <ParadoxCover
      pal={pal}
      n={3}
      lines={
        <>
          <div>THE MONTY HALL</div>
          <div style={{ fontSize: 120, color: P.hot }}>PROBLEM</div>
        </>
      }
      big="2/3"
      sub="stick or switch? switching wins 2 out of 3"
      art={
        <div style={{ position: "absolute", left: 0, right: 0, top: 1210, display: "flex", justifyContent: "center", gap: 30 }}>
          {[1, 2, 3].map((n) => (
            <div key={n} style={{ width: 150, height: 220, borderRadius: "16px 16px 4px 4px", background: n === 3 ? "transparent" : "linear-gradient(180deg, #FF8A00, #C2410C)", border: `5px solid ${n === 3 ? P.dim : "#FDBA74"}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Sora", fontWeight: 800, fontSize: n === 3 ? 40 : 80, color: n === 3 ? P.dim : "#1A0A00" }}>{n === 3 ? "GOAT" : n}</div>
          ))}
        </div>
      }
    />
  );
};
export const _t = theme;
