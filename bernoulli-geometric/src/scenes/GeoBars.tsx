// Shared by scenes 6 and 7: the geometric bars for a 1-in-6 chance, rolls 1–12: P(first six on roll k) = (5/6)^(k-1)/6.
import React from "react";
import { useCurrentFrame } from "remotion";
import { ease } from "../components/Motion";
import { alpha, theme } from "../theme";
import { TRY } from "./S1Hook";

const C = theme.colors;
export const GEO = Array.from({ length: 12 }, (_, i) => Math.pow(5 / 6, i) / 6);
export const GX = (k: number) => 150 + (k - 0.5) * 65; // k = 1..12
export const G_BASE = 1150;
export const G_H = 440;
export const gTop = (k: number) => G_BASE - (GEO[k - 1] / GEO[0]) * G_H;

export const GeoBars: React.FC<{ growAt: number[]; hi?: Record<number, string> }> = ({ growAt, hi = {} }) => {
  const frame = useCurrentFrame();
  return (
    <>
      {GEO.map((_, i) => {
        const k = i + 1;
        const g = ease(frame, [growAt[i], growAt[i] + 14], [0, 1], theme.ease.out);
        const h = (G_BASE - gTop(k)) * g;
        const c = hi[k] ?? TRY;
        return (
          <React.Fragment key={k}>
            {g > 0.001 ? <div style={{ position: "absolute", left: GX(k) - 25, top: G_BASE - h, width: 50, height: h, borderRadius: "8px 8px 2px 2px", background: alpha(c, hi[k] ? 0.7 : 0.45), border: `3px solid ${c}`, boxSizing: "border-box", boxShadow: hi[k] ? `0 0 20px ${alpha(c, 0.55)}` : "none" }} /> : null}
            <div style={{ position: "absolute", left: GX(k), top: G_BASE + 28, transform: "translate(-50%, -50%)", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 22, color: hi[k] ?? C.dim, opacity: ease(frame, [growAt[0] - 6, growAt[0] + 4], [0, 1]) }}>{k}</div>
          </React.Fragment>
        );
      })}
      <div style={{ position: "absolute", left: 140, top: G_BASE + 1, width: 800, height: 4, background: alpha(C.text, 0.4), opacity: ease(frame, [growAt[0] - 6, growAt[0] + 4], [0, 1]) }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: G_BASE + 64, textAlign: "center", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.16em", color: C.dim, opacity: ease(frame, [growAt[0] - 6, growAt[0] + 4], [0, 1]) }}>ROLL NUMBER OF THE FIRST SIX</div>
    </>
  );
};
