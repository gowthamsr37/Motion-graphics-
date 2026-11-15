// Reel cover: MEAN / MEDIAN / MODE · explained in 2 minutes, over a skewed dot plot where the three land in different places.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop, Grade, Grain, Vignette } from "./components/Backdrop";
import { alpha, glowText, theme } from "./theme";

const C = theme.colors;
// right-skewed data (values 1..9): mode 2 < median 3 < mean 4
const COUNTS = [1, 7, 4, 3, 2, 1, 1, 1, 2];
const X = (v: number) => 140 + (v - 1) * 100;
const AXIS = 1330;
const MARKS = [
  { l: "MODE", v: 2, c: C.violet, y: 900 },
  { l: "MEDIAN", v: 3, c: C.green, y: 966 },
  { l: "MEAN", v: 4, c: C.cyan, y: 1032 },
];

export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Backdrop a={C.cyan} b={C.violet} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 0.98, letterSpacing: "-0.03em" }}>
      {[
        { t: "MEAN", c: C.cyan },
        { t: "MEDIAN", c: C.green },
        { t: "MODE", c: C.violet },
      ].map((w) => (
        <div key={w.t} style={{ fontSize: 150, color: w.c, textShadow: glowText(w.c, 0.8) }}>
          {w.t}
        </div>
      ))}
      <div style={{ marginTop: 30, fontSize: 52, fontWeight: 700, color: C.text, letterSpacing: "0.01em" }}>
        explained in <span style={{ color: C.yellow, textShadow: glowText(C.yellow, 0.5) }}>2 minutes</span>
      </div>
    </div>
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      {MARKS.map((m) => (
        <line key={m.l} x1={X(m.v)} y1={m.y + 26} x2={X(m.v)} y2={AXIS + 4} stroke={m.c} strokeWidth={4} strokeDasharray="8 8" opacity={0.9} />
      ))}
      <line x1={90} y1={AXIS + 26} x2={990} y2={AXIS + 26} stroke={alpha(C.text, 0.35)} strokeWidth={4} strokeLinecap="round" />
      {COUNTS.map((n, i) =>
        Array.from({ length: n }).map((_, j) => <circle key={`${i}-${j}`} cx={X(i + 1)} cy={AXIS - j * 40} r={17} fill={alpha("#E4EEFF", 0.88)} />),
      )}
    </svg>
    {MARKS.map((m) => (
      <div
        key={m.l}
        style={{
          position: "absolute",
          left: X(m.v),
          top: m.y,
          transform: "translate(-50%, -50%)",
          padding: "8px 16px",
          borderRadius: 999,
          border: `3px solid ${m.c}`,
          background: alpha(m.c, 0.2),
          boxShadow: `0 0 24px ${alpha(m.c, 0.4)}`,
          fontFamily: theme.fonts.display,
          fontWeight: 800,
          fontSize: 28,
          color: C.text,
          whiteSpace: "nowrap",
        }}
      >
        {m.l} {m.v}
      </div>
    ))}
    <Grade />
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
