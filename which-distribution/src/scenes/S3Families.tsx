// SCENE 3 — THREE FAMILIES: COUNTS (cyan) · MEASUREMENTS (violet) · TOOLS FOR TESTING (orange), each with its members.
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { SceneTitle } from "../components/Kit";
import { useSpr } from "../components/Motion";
import { Shape } from "../components/Pick";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { COUNTS, MEAS, TEST } from "./S1Hook";

const C = theme.colors;
export const FAMILIES = [
  { t: "COUNTS", sub: "Uniform · Bernoulli · Binomial · Geometric · Poisson", c: COUNTS, tok: "counts,", kind: "binomial" as const },
  { t: "MEASUREMENTS", sub: "Normal · Exponential · Log-normal · Pareto", c: MEAS, tok: "measurements,", kind: "normal" as const },
  { t: "TOOLS FOR TESTING", sub: "t · Chi-square", c: TEST, tok: "testing.", kind: "chisq" as const },
];

export const S3Families: React.FC = () => {
  const spr = useSpr();
  const s = useScene("s3");
  return (
    <AbsoluteFill>
      <SceneTitle label="THREE FAMILIES" color={MEAS} at={2} />
      {FAMILIES.map((f, i) => {
        const p = spr(s.cueS(0, f.tok) - 8, theme.spring.bouncy);
        if (p <= 0.001) return null;
        return (
          <div key={f.t} style={{ position: "absolute", left: 540, top: 590 + i * 220, width: 880, height: 180, transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, p), [0, 1], [0.8, 1])})`, opacity: Math.min(1, p * 2), boxSizing: "border-box", borderRadius: 30, background: `linear-gradient(90deg, ${alpha(f.c, 0.2)}, rgba(14,24,64,0.92) 70%)`, border: `3px solid ${f.c}`, boxShadow: `0 0 26px ${alpha(f.c, 0.3)}` }}>
            <div style={{ position: "absolute", left: 36, top: 36, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 46, color: f.c, textShadow: glowText(f.c, 0.4) }}>{f.t}</div>
            <div style={{ position: "absolute", left: 36, top: 110, fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 22, color: C.text, whiteSpace: "nowrap" }}>{f.sub}</div>
            <div style={{ position: "absolute", right: 40, top: 40 }}>
              <Shape kind={f.kind} w={150} h={66} color={f.c} p={Math.min(1, p)} axis={false} />
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
