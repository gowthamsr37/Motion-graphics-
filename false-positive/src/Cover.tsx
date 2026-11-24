// ADAPT FOR THIS VIDEO: copied from the reference project (house style). Keep the layer stack, look and mix; replace scene list, cues and cover text.
// False positive paradox cover on the shared Probability Paradoxes cover.
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
      n={4}
      lines={
        <>
          <div>FALSE POSITIVE</div>
          <div style={{ fontSize: 120, color: P.hot }}>PARADOX</div>
        </>
      }
      big="9%"
      sub="99% accurate test. positive. sick?"
      art={
        <div style={{ position: "absolute", left: 0, right: 0, top: 1220, display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 12, padding: "0 170px" }}>
          {Array.from({ length: 22 }, (_, i) => (
            <div key={i} style={{ width: 54, height: 54, borderRadius: 27, background: i < 2 ? "#FF3B5C" : P.hot, opacity: i < 2 ? 1 : 0.9 }} />
          ))}
        </div>
      }
    />
  );
};
export const _t = theme;
