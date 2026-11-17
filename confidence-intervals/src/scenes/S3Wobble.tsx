// SCENE 3 — WHY A RANGE. Every sample of 100 orders gives a slightly different average: 32, 31, 33.5 (and more dots)
// land on the number line → ONE NUMBER HIDES THE WOBBLE.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Axis, type Line, lx } from "../components/CI";
import { SceneTitle } from "../components/Kit";
import { ease, Pop, useSpr } from "../components/Motion";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { MISS, SAMPLE } from "./S1Hook";

const C = theme.colors;
const G: Line = { x0: 170, x1: 910, vmin: 28, vmax: 36 };
const MORE = [32.6, 31.4, 32.9, 30.7, 32.2, 33.1, 31.8];

export const S3Wobble: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s3");
  const T31 = s.cueS(1, "31,");
  const T335 = s.cueS(1, "33.5.");
  const HIDE = s.sent(2).from;
  const samples = [
    { v: 32, at: 10, lab: "SAMPLE 1" },
    { v: 31, at: T31 - 4, lab: "SAMPLE 2" },
    { v: 33.5, at: T335 - 4, lab: "SAMPLE 3" },
  ];
  return (
    <AbsoluteFill>
      <SceneTitle label="WHY A RANGE?" color={SAMPLE} at={2} />
      <Pop at={6} x={540} y={450} from="up" dist={14}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 44, color: C.text, whiteSpace: "nowrap" }}>
          EVERY SAMPLE <span style={{ color: SAMPLE, textShadow: glowText(SAMPLE, 0.5) }}>WOBBLES</span>
        </div>
      </Pop>
      {samples.map((sm, i) => {
        const p = spr(sm.at, theme.spring.bouncy);
        if (p <= 0.001) return null;
        return (
          <div key={i} style={{ position: "absolute", left: 540, top: 600 + i * 110, transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, p), [0, 1], [0.6, 1])})`, opacity: Math.min(1, p * 2), display: "flex", alignItems: "center", gap: 24, padding: "12px 30px", borderRadius: 999, background: "rgba(14,24,64,0.9)", border: `3px solid ${alpha(SAMPLE, 0.6)}` }}>
            <span style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.12em", color: C.dim }}>{sm.lab} · 100 ORDERS</span>
            <span style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 40, color: SAMPLE }}>{sm.v.toFixed(1)}</span>
          </div>
        );
      })}
      <Axis g={G} y={1120} ticks={[28, 30, 32, 34, 36]} p={ease(frame, [8, 20], [0, 1])} label="SAMPLE AVERAGE (MINUTES)" />
      {[...samples.map((sm) => ({ v: sm.v, at: sm.at + 8 })), ...MORE.map((v, i) => ({ v, at: HIDE - 30 + i * 4 }))].map((d, i) => {
        const p = spr(d.at, theme.spring.pop);
        if (p <= 0.001) return null;
        return <div key={i} style={{ position: "absolute", left: lx(G, d.v) - 13, top: 1080 - 13 - (i % 2) * 0, width: 26, height: 26, borderRadius: 13, background: SAMPLE, opacity: 0.85, boxShadow: `0 0 12px ${SAMPLE}`, transform: `scale(${p})` }} />;
      })}
      <Pop at={HIDE - 2} x={540} y={1250} from="up" dist={12} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 38, color: C.text, whiteSpace: "nowrap" }}>
          ONE NUMBER <span style={{ color: MISS, textShadow: glowText(MISS, 0.5) }}>HIDES THE WOBBLE</span>
        </div>
      </Pop>
    </AbsoluteFill>
  );
};
