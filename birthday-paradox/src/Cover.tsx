// Birthday paradox cover on the shared Probability Paradoxes cover.
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
      n={1}
      lines={
        <>
          <div>ONLY 23 PEOPLE.</div>
          <div>SAME BIRTHDAY?</div>
        </>
      }
      big="50%"
      sub="your brain says 6%. maths says 50%."
      art={
        <div style={{ position: "absolute", left: 0, right: 0, top: 1240, display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap", padding: "0 150px" }}>
          {Array.from({ length: 23 }, (_, i) => (
            <svg key={i} width={58} height={70} viewBox="0 0 58 70">
              <circle cx={29} cy={18} r={14} fill={i === 6 || i === 17 ? P.hot : P.dim} />
              <path d="M5 70 Q5 36 29 36 Q53 36 53 70 Z" fill={i === 6 || i === 17 ? P.hot : P.dim} opacity={i === 6 || i === 17 ? 1 : 0.6} />
            </svg>
          ))}
        </div>
      }
    />
  );
};
export const _t = theme;
