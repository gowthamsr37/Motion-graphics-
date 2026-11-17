// Shared by scenes 3 and 4: ten customer groups in a row (biggest spenders on the left), each a box with a person.
import React from "react";
import { interpolate } from "remotion";
import { Person } from "../components/Icons";
import { useSpr } from "../components/Motion";
import { alpha, theme } from "../theme";

const C = theme.colors;
export const COLX = (k: number) => 130 + (k + 0.5) * 82;
export const BOX_TOP = 1110;
export const BOX_H = 150;
const SHIRTS = [C.cyan, C.violet, C.green];

export const GroupRow: React.FC<{ appearAt: number; boxAt?: number; hi?: Record<number, string>; labels?: boolean }> = ({ appearAt, boxAt, hi = {}, labels }) => {
  const spr = useSpr();
  return (
    <>
      {Array.from({ length: 10 }, (_, k) => {
        const p = spr(appearAt + k * 3, theme.spring.bouncy);
        if (p <= 0.001) return null;
        const b = boxAt === undefined ? 0 : spr(boxAt + k * 2, theme.spring.pop);
        const c = hi[k];
        return (
          <React.Fragment key={k}>
            {b > 0.01 ? <div style={{ position: "absolute", left: COLX(k) - 37, top: BOX_TOP, width: 74, height: BOX_H, boxSizing: "border-box", borderRadius: 16, background: c ? alpha(c, 0.22) : "rgba(14,24,64,0.7)", border: `3px solid ${c ?? alpha("#F3F7FF", 0.35)}`, opacity: Math.min(1, b * 2), transform: `scale(${interpolate(Math.min(1, b), [0, 1], [0.8, 1])})` }} /> : null}
            <div style={{ position: "absolute", left: COLX(k), top: BOX_TOP + BOX_H - 12, transform: `translate(-50%, -100%) scale(${p})`, transformOrigin: "bottom center" }}>
              <Person height={112} shirt={c ?? SHIRTS[k % 3]} />
            </div>
            {labels && b > 0.01 ? <div style={{ position: "absolute", left: COLX(k), top: BOX_TOP + BOX_H + 28, transform: "translate(-50%, -50%)", opacity: Math.min(1, b * 2), fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 22, color: c ?? C.dim }}>10%</div> : null}
          </React.Fragment>
        );
      })}
    </>
  );
};
