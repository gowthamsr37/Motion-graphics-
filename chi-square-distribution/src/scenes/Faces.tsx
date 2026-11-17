// Shared by scenes 1, 3 and 4: the six dice faces with observed-count bars and the dashed "expected = 10" line.
import React from "react";
import { useCurrentFrame } from "remotion";
import { ease } from "../components/Motion";
import { Die } from "../components/Prob";
import { EXPECTED } from "../components/Chi";
import { alpha, theme } from "../theme";
import { EXP, OBSC } from "./S1Hook";

const C = theme.colors;
export type FaceGeo = { base: number; h: number; max: number };
export const FX = (i: number) => 215 + i * 130;

export const Faces: React.FC<{ g: FaceGeo; vals: number[]; growAt: number[]; lineAt: number; hi?: Record<number, string>; labels?: boolean; dieSize?: number }> = ({ g, vals, growAt, lineAt, hi = {}, labels = true, dieSize = 54 }) => {
  const frame = useCurrentFrame();
  const ly = g.base - (EXPECTED / g.max) * g.h;
  const line = ease(frame, [lineAt, lineAt + 14], [0, 1]);
  return (
    <>
      {vals.map((v, i) => {
        const p = ease(frame, [growAt[i], growAt[i] + 14], [0, 1], theme.ease.out);
        const h = (v / g.max) * g.h * p;
        const c = hi[i] ?? OBSC;
        return (
          <React.Fragment key={i}>
            {p > 0.001 ? <div style={{ position: "absolute", left: FX(i) - 44, top: g.base - h, width: 88, height: h, borderRadius: "10px 10px 3px 3px", background: alpha(c, hi[i] ? 0.65 : 0.4), border: `3px solid ${c}`, boxSizing: "border-box", boxShadow: hi[i] ? `0 0 20px ${alpha(c, 0.5)}` : "none" }} /> : null}
            {labels && p > 0.5 ? <div style={{ position: "absolute", left: FX(i), top: g.base - h - 26, transform: "translate(-50%, -50%)", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 30, color: hi[i] ?? C.text, opacity: ease(p, [0.5, 1], [0, 1]) }}>{Math.round(v)}</div> : null}
            <div style={{ position: "absolute", left: FX(i), top: g.base + 12 + dieSize / 2, transform: "translate(-50%, -50%)" }}>
              <Die value={i + 1} size={dieSize} color={hi[i] ?? OBSC} />
            </div>
          </React.Fragment>
        );
      })}
      <div style={{ position: "absolute", left: 140, top: g.base + 1, width: 800, height: 4, background: alpha(C.text, 0.4) }} />
      {line > 0.001 ? (
        <>
          <div style={{ position: "absolute", left: 140, top: ly - 2, width: 800 * line, height: 0, borderTop: `5px dashed ${EXP}` }} />
          <div style={{ position: "absolute", left: 948, top: ly, transform: "translateY(-50%)", opacity: line, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 28, color: EXP }}>10</div>
        </>
      ) : null}
    </>
  );
};
