// ADAPT FOR THIS VIDEO: copied from the reference project (house style). Keep the layer stack, look and mix; replace scene list, cues and cover text.
// Gambler's fallacy cover on the shared Probability Paradoxes cover.
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
      n={2}
      lines={
        <>
          <div>THE GAMBLER&apos;S</div>
          <div style={{ fontSize: 120, color: P.hot }}>FALLACY</div>
        </>
      }
      big="50%"
      sub="after 5 heads, tails is STILL just 50%"
      art={
        <div style={{ position: "absolute", left: 0, right: 0, top: 1250, display: "flex", justifyContent: "center", gap: 16 }}>
          {["H", "H", "H", "H", "H", "?"].map((f, i) => (
            <div key={i} style={{ width: 120, height: 120, borderRadius: 60, background: f === "?" ? "transparent" : "#F5C542", border: f === "?" ? `5px dashed ${P.hot}` : "6px solid #B7791F", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Sora", fontWeight: 800, fontSize: 56, color: f === "?" ? P.hot : "#7C4A03" }}>{f}</div>
          ))}
        </div>
      }
    />
  );
};
export const _t = theme;
