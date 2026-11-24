// SCENE 10 — REMEMBER THIS (save moment): the 7 steps light up one by one on their spoken names in a numbered column;
// SAVE THIS · "the map for the next 97 days".
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Bookmark } from "../components/Guide";
import { Pill, Pop, Txt } from "../components/D2";
import { ease } from "../components/Motion";
import { STEPS, STEP_C } from "../components/Steps";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const WORDS = ["define,", "collect,", "clean,", "explore,", "split,", "train,", "evaluate"];

export const S10Rule: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s10");
  return (
    <AbsoluteFill>
      <Pop x={540} y={240} at={s.sent(0).from - 4}>
        <Txt size={62} color={C.yellow} glow>THE 7 STEPS</Txt>
      </Pop>
      {STEPS.map((t, i) => {
        const at = s.cueS(0, WORDS[i]);
        const p = ease(frame, [at - 4, at + 4], [0, 1]);
        return (
          <div key={t} style={{ position: "absolute", left: 220, top: 330 + i * 105, display: "flex", alignItems: "center", gap: 24, opacity: 0.25 + 0.75 * p, transform: `translateX(${(1 - p) * -20}px)` }}>
            <div style={{ width: 76, height: 76, borderRadius: 38, background: p > 0.5 ? STEP_C[i] : "transparent", border: `4px solid ${STEP_C[i]}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 38, color: p > 0.5 ? C.ink : C.text, boxShadow: p > 0.5 ? `0 0 20px ${alpha(STEP_C[i], 0.6)}` : undefined }}>{i + 1}</div>
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 56, color: C.text }}>{t}{i === 6 ? <span style={{ color: C.dim, fontSize: 40 }}> + DEPLOY</span> : null}</div>
          </div>
        );
      })}
      <Pop x={540} y={1130} at={s.cueS(1, "Save") - 4}>
        <Pill color={C.green} size={40}>
          <Bookmark size={40} color={C.green} />
          SAVE THIS · the map for the next 97 days
        </Pill>
      </Pop>
    </AbsoluteFill>
  );
};
