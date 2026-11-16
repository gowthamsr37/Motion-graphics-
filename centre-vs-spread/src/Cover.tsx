// Reel cover: WHEN TO USE · CENTRE vs SPREAD · explained in 2 minutes, the two pairs (mean ± SD, median + IQR) and the handle.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop, Grade, Grain, Vignette } from "./components/Backdrop";
import { alpha, glowText, HANDLE, theme } from "./theme";

const C = theme.colors;
const bell = (w: number, h: number) => {
  const pts: string[] = [];
  for (let x = 0; x <= w; x += 5) pts.push(`${x ? "L" : "M"}${x} ${(h - (h - 8) * Math.exp(-(((x - w / 2) / (w / 6)) ** 2) / 2)).toFixed(1)}`);
  return pts.join(" ");
};
const skew = [26, 70, 92, 74, 52, 34, 22, 14, 10, 8, 30];

export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Backdrop a={C.cyan} b={C.violet} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 330, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.03em" }}>
      <div style={{ fontSize: 96, color: C.text }}>WHEN TO USE</div>
      <div style={{ marginTop: 18, fontSize: 132, display: "flex", justifyContent: "center", alignItems: "baseline", gap: 26 }}>
        <span style={{ color: C.cyan, textShadow: glowText(C.cyan, 0.8) }}>CENTRE</span>
      </div>
      <div style={{ marginTop: 6, fontSize: 56, color: C.dim }}>vs</div>
      <div style={{ marginTop: 6, fontSize: 132, color: C.violet, textShadow: glowText(C.violet, 0.8) }}>SPREAD</div>
      <div style={{ marginTop: 30, fontSize: 52, fontWeight: 700, color: C.text, letterSpacing: "0.01em" }}>
        explained in <span style={{ color: C.yellow, textShadow: glowText(C.yellow, 0.5) }}>2 minutes</span>
      </div>
    </div>
    {[
      { x: 290, title: "MEAN ± SD", sub: "balanced data", c: C.green, kind: "bell" },
      { x: 790, title: "MEDIAN + IQR", sub: "skewed data", c: C.orange, kind: "skew" },
    ].map((k) => (
      <div key={k.title} style={{ position: "absolute", left: k.x - 220, top: 1180, width: 440, height: 250, boxSizing: "border-box", padding: "20px 24px", borderRadius: 30, background: "linear-gradient(180deg, rgba(26,40,98,0.92), rgba(14,24,64,0.92))", border: `3px solid ${alpha(k.c, 0.8)}`, boxShadow: `0 0 30px ${alpha(k.c, 0.25)}` }}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text, whiteSpace: "nowrap" }}>{k.title}</div>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 24, color: k.c, letterSpacing: "0.1em", textTransform: "uppercase" }}>{k.sub}</div>
        <div style={{ position: "absolute", left: 30, bottom: 22 }}>
          {k.kind === "bell" ? (
            <svg width={380} height={110} viewBox="0 0 380 110">
              <path d={`${bell(380, 106)} L380 106 L0 106 Z`} fill={alpha(k.c, 0.2)} />
              <path d={bell(380, 106)} stroke={k.c} strokeWidth={5} fill="none" />
            </svg>
          ) : (
            <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 110 }}>
              {skew.map((h, i) => (
                <div key={i} style={{ width: 28, height: h, borderRadius: "6px 6px 1px 1px", background: i === skew.length - 1 ? C.orange : alpha("#E4EEFF", 0.65) }} />
              ))}
            </div>
          )}
        </div>
      </div>
    ))}
    <div style={{ position: "absolute", left: 0, right: 0, top: 1500, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 36, color: C.text }}>
      <span style={{ color: C.cyan }}>@</span>
      {HANDLE.slice(1)}
    </div>
    <Grade />
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
