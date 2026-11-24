// 10,000 people (mulberry32 seed 33): disease rate 1 in 1,000, test 99% sensitive / 99% specific → 10 sick (all 10 test
// positive) and 101 healthy false positives, so P(sick | positive) = 10 / 111 = 9.0%. Drawn as a 100×100 SVG grid.
import React from "react";
import { alpha, theme } from "../theme";

const C = theme.colors;
export const SICK = "#FF3B5C";
export const FALSE = "#FF8A00";

const mul = (a: number) => () => {
  a |= 0;
  a = (a + 0x6d2b79f5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
export type Person = { sick: boolean; pos: boolean };
export const PEOPLE: Person[] = (() => {
  const r = mul(33);
  const out: Person[] = [];
  for (let i = 0; i < 10000; i++) {
    const d = r() < 0.001;
    const u = r();
    out.push({ sick: d, pos: d ? u < 0.99 : u < 0.01 });
  }
  return out;
})();
export const N_TP = PEOPLE.filter((p) => p.sick && p.pos).length; // 10
export const N_FP = PEOPLE.filter((p) => !p.sick && p.pos).length; // 101

// show: 0..1 reveal of the crowd; sick/fp: 0..1 highlight strength; dimRest: fade the negatives
export const Crowd: React.FC<{ size: number; show?: number; sick?: number; fp?: number; dimRest?: number }> = ({ size, show = 1, sick = 0, fp = 0, dimRest = 0 }) => {
  const cell = size / 100;
  const nShow = Math.round(show * 10000);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block" }}>
      {PEOPLE.map((p, i) => {
        if (i >= nShow) return null;
        const x = (i % 100) * cell, y = Math.floor(i / 100) * cell;
        const isS = p.sick, isF = !p.sick && p.pos;
        let fill: string = alpha(C.text, 0.32 * (1 - dimRest * 0.7));
        let r = cell * 0.36;
        if (isS && sick > 0) { fill = SICK; r = cell * (0.36 + 0.9 * sick); }
        if (isF && fp > 0) { fill = FALSE; r = cell * (0.36 + 0.5 * fp); }
        return <circle key={i} cx={x + cell / 2} cy={y + cell / 2} r={r} fill={fill} />;
      })}
    </svg>
  );
};
