// Pictograph stacks of chai cups: the running example of the video.
import React from "react";
import { interpolate } from "remotion";
import { theme } from "../theme";
import { useSpr } from "./Motion";
import { ChaiCup } from "./Icons";

export const CUP = { w: 50, step: 33 };
export const COLS = [180, 360, 540, 720, 900];
export const BASE = 1150;
export const cupCenterY = (base: number, j: number, s = 1) => base - CUP.step * s * (j + 0.5);

// n cups; cup j appears at appear(j) with a little drop + pop. s scales size and spacing (zoom-out).
export const CupStack: React.FC<{ x: number; base?: number; n: number; appear?: (j: number) => number; s?: number; glow?: string; dim?: number }> = ({
  x,
  base = BASE,
  n,
  appear,
  s = 1,
  glow,
  dim = 1,
}) => {
  const spr = useSpr();
  const w = CUP.w * s;
  return (
    <>
      {Array.from({ length: n }).map((_, j) => {
        const at = appear ? appear(j) : -100;
        const p = spr(at, theme.spring.pop);
        if (p <= 0.001) return null;
        const y = cupCenterY(base, j, s);
        return (
          <div
            key={j}
            style={{
              position: "absolute",
              left: x - w / 2,
              top: y - (w * 0.66) / 2,
              opacity: Math.min(1, p * 2) * dim,
              transform: `translateY(${(1 - p) * -36 * s}px) scale(${interpolate(p, [0, 1], [0.5, 1])})`,
              zIndex: 2,
            }}
          >
            <ChaiCup w={w} glow={glow} />
          </div>
        );
      })}
    </>
  );
};

// Number label under a column.
export const ColLabel: React.FC<{ x: number; y?: number; value: string; color: string; p: number; size?: number }> = ({ x, y = BASE + 42, value, color, p, size = 44 }) =>
  p <= 0.001 ? null : (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${interpolate(p, [0, 1], [0.6, 1])})`,
        opacity: Math.min(1, p * 2),
        fontFamily: theme.fonts.mono,
        fontWeight: 800,
        fontSize: size,
        color,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {value}
    </div>
  );
