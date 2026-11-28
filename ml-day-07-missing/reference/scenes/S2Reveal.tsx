// SCENE 2 — REVEAL + TITLE: the model's inputs list (area · bedrooms · locality · STAMP DUTY PAID), stamp duty flagged:
// "calculated from the sale price" → "it was reading the answer"; "doesn't exist before the sale"; then the title:
// FEATURES + LABELS · the 6 tests every good feature must pass (6 chips).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Panel, Pill, Pop, Txt } from "../components/D2";
import { ease } from "../components/Motion";
import { JARGON, STEP_C } from "../components/Steps";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";
import { SeriesStrip } from "./S1Hook";

const C = theme.colors;
const INPUTS = ["area", "bedrooms", "locality", "STAMP DUTY PAID"];

export const S2Reveal: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s2");
  const SD = s.cueS(0, "stamp");
  const CALC = s.cueS(0, "calculated");
  const ANS = s.cueS(0, "answer.");
  const T = s.sent(2).from;
  const top = 1 - ease(frame, [T - 8, T], [0, 1]);
  return (
    <AbsoluteFill>
      <SeriesStrip />
      <div style={{ position: "absolute", inset: 0, opacity: top }}>
        <Pop x={540} y={320} at={0}>
          <Txt size={48}>the model&apos;s inputs</Txt>
        </Pop>
        <Pop x={540} y={600} at={4}>
          <Panel w={900} h={440} color={C.cyan} style={{ gap: 14 }}>
            {INPUTS.map((t, i) => {
              const bad = i === 3;
              const on = bad ? ease(frame, [SD - 4, SD + 6], [0, 1]) : 0;
              return (
                <div key={t} style={{ width: 760, padding: "14px 24px", borderRadius: 14, background: bad ? alpha(C.red, 0.1 + 0.2 * on) : "rgba(255,255,255,0.06)", border: `3px solid ${bad ? alpha(C.red, on) : "transparent"}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text, transform: `scale(${1 + on * 0.04})` }}>{t}</div>
              );
            })}
          </Panel>
        </Pop>
        <Pop x={540} y={900} at={CALC - 4}>
          <Txt size={40} font="body">stamp duty = a % of the <span style={{ color: C.red }}>sale price</span></Txt>
        </Pop>
        <Pop x={540} y={1000} at={ANS - 6}>
          <Pill color={C.red} size={44} solid>IT WAS READING THE ANSWER</Pill>
        </Pop>
        <Pop x={540} y={1110} at={s.sent(1).from}>
          <Txt size={38} font="body">before the sale, that number <span style={{ color: C.yellow }}>doesn&apos;t exist</span></Txt>
        </Pop>
      </div>
      {frame >= T - 8 ? (
        <AbsoluteFill style={{ opacity: 1 - top }}>
          <Pop x={540} y={380} at={T}>
            <Txt size={64}>Features + Labels</Txt>
          </Pop>
          <Pop x={540} y={480} at={T + 4}>
            <Txt size={46} font="body" color={C.dim}>the 6 tests every good feature must pass</Txt>
          </Pop>
          <div style={{ position: "absolute", left: 50, right: 50, top: 570, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12 }}>
            {JARGON.map((t, i) => {
              const p = ease(frame, [s.cueS(2, "6") + i * 3, s.cueS(2, "6") + 6 + i * 3], [0, 1]);
              return (
                <div key={t} style={{ opacity: p, transform: `scale(${0.6 + 0.4 * p})`, display: "flex", alignItems: "center", gap: 10, padding: "10px 18px", borderRadius: 16, background: alpha(STEP_C[i], 0.14), border: `3px solid ${STEP_C[i]}` }}>
                  <span style={{ width: 40, height: 40, borderRadius: 20, background: STEP_C[i], color: C.ink, display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 24 }}>{i + 1}</span>
                  <span style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 32, color: C.text, whiteSpace: "nowrap" }}>{t}</span>
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
