// SCENE 2 — THE REVEAL + TITLE: the four scatters (Anscombe's quartet) pop in: a LINE · a CURVE · AN OUTLIER · ONE
// EXTREME POINT; "you'd never know from the numbers" → NEVER SKIP EDA; then the title: EXPLORATORY DATA ANALYSIS · the 6
// problems it catches (6 chips).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { ANSCOMBE, Scatter } from "../components/Charts";
import { Panel, Pill, Pop, Txt } from "../components/D2";
import { ease } from "../components/Motion";
import { JARGON, STEP_C } from "../components/Steps";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";
import { SET_C, SeriesStrip } from "./S1Hook";

const C = theme.colors;
const NAMES = ["a line", "a curve", "an outlier", "one extreme point"];
const CUES = ["line,", "curve,", "outlier,", "extreme"];

export const S2Reveal: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s2");
  const T = s.sent(2).from;
  const top = 1 - ease(frame, [T - 8, T], [0, 1]);
  return (
    <AbsoluteFill>
      <SeriesStrip />
      <div style={{ position: "absolute", inset: 0, opacity: top }}>
        <Pop x={540} y={320} at={0}>
          <Txt size={56} color={C.red} glow>completely different</Txt>
        </Pop>
        {ANSCOMBE.map((pts, i) => {
          const at = s.cueS(0, CUES[i]);
          return (
            <Pop key={i} x={i % 2 ? 790 : 290} y={i < 2 ? 590 : 990} at={at - 8}>
              <Panel w={470} h={360} color={SET_C[i]} style={{ gap: 4 }}>
                <Scatter pts={pts} w={400} h={260} p={ease(frame, [at - 8, at + 6], [0, 1])} color={SET_C[i]} />
                <Txt size={32}>{NAMES[i]}</Txt>
              </Panel>
            </Pop>
          );
        })}
        <Pop x={540} y={1290} at={s.cueS(1, "skip") - 4}>
          <Pill color={C.red} size={46} solid>THAT&apos;S WHY YOU NEVER SKIP EDA</Pill>
        </Pop>
      </div>
      {frame >= T - 8 ? (
        <AbsoluteFill style={{ opacity: 1 - top }}>
          <Pop x={540} y={380} at={T}>
            <Txt size={64}>Exploratory</Txt>
          </Pop>
          <Pop x={540} y={480} at={T + 4}>
            <Txt size={96} style={{ background: `linear-gradient(90deg, ${C.cyan}, ${C.violet}, ${C.orange})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", textShadow: "none" }}>DATA ANALYSIS</Txt>
          </Pop>
          <Pop x={540} y={580} at={s.cueS(2, "6") - 2}>
            <Txt size={40} font="body" color={C.dim}>the 6 problems it catches</Txt>
          </Pop>
          <div style={{ position: "absolute", left: 50, right: 50, top: 660, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12 }}>
            {JARGON.map((t, i) => {
              const p = ease(frame, [s.cueS(2, "6") + i * 3, s.cueS(2, "6") + 6 + i * 3], [0, 1]);
              return (
                <div key={t} style={{ opacity: p, transform: `scale(${0.6 + 0.4 * p})`, display: "flex", alignItems: "center", gap: 10, padding: "10px 18px", borderRadius: 16, background: alpha(STEP_C[i], 0.14), border: `3px solid ${STEP_C[i]}` }}>
                  <span style={{ width: 40, height: 40, borderRadius: 20, background: STEP_C[i], color: C.ink, display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 24 }}>{i + 1}</span>
                  <span style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: C.text, whiteSpace: "nowrap" }}>{t}</span>
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
