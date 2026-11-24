// SCENE 1 — TITLE CARD FROM FRAME 0: 100 DAYS OF ML pill + DAY 3 / 100; "The Machine Learning Workflow"; the 7-step path
// (DEFINE → … → EVALUATE) laid out as a snake of numbered stops by ~1.5 s; chips (7 steps · one full example · the
// beginner mistake) glow as named; SAVE THIS ONE.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Bookmark } from "../components/Guide";
import { Pill, Pop, Txt } from "../components/D2";
import { ease } from "../components/Motion";
import { STEPS, STEP_C } from "../components/Steps";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

export const S1Title: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s1");
  const chips = [
    { t: "7 STEPS", c: C.cyan, at: s.cueS(1, "7") },
    { t: "ONE FULL EXAMPLE", c: C.green, at: s.cueS(1, "example") },
    { t: "THE BEGINNER MISTAKE", c: C.red, at: s.cueS(1, "mistake") },
  ];
  return (
    <AbsoluteFill>
      <Pop x={330} y={240} at={0}>
        <Pill color={C.violet} size={30}>100 DAYS OF ML</Pill>
      </Pop>
      <Pop x={800} y={240} at={3}>
        <Txt size={56} color={C.yellow} glow>
          DAY 3 <span style={{ color: C.dim, fontSize: 36 }}>/ 100</span>
        </Txt>
      </Pop>
      <Pop x={540} y={380} at={4}>
        <Txt size={84}>The Machine Learning</Txt>
      </Pop>
      <Pop x={540} y={490} at={8}>
        <Txt size={120} style={{ background: `linear-gradient(90deg, ${C.cyan}, ${C.violet}, ${C.orange})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", textShadow: "none", filter: `drop-shadow(0 0 22px ${alpha(C.violet, 0.5)})` }}>WORKFLOW</Txt>
      </Pop>
      <div style={{ position: "absolute", left: 60, right: 60, top: 600, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 14 }}>
        {STEPS.map((t, i) => {
          const p = ease(frame, [12 + i * 3, 18 + i * 3], [0, 1]);
          return (
            <div key={t} style={{ opacity: p, transform: `scale(${0.6 + 0.4 * p})`, display: "flex", alignItems: "center", gap: 10, padding: "12px 20px", borderRadius: 18, background: alpha(STEP_C[i], 0.14), border: `3px solid ${STEP_C[i]}` }}>
              <span style={{ width: 44, height: 44, borderRadius: 22, background: STEP_C[i], color: C.ink, display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 26 }}>{i + 1}</span>
              <span style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 32, color: C.text }}>{t}</span>
              {i < 6 ? <span style={{ fontFamily: theme.fonts.display, fontSize: 30, color: C.dim }}>→</span> : null}
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 990, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 14 }}>
        {chips.map((k, i) => {
          const on = ease(frame, [k.at, k.at + 8], [0, 1]);
          const p = ease(frame, [30 + i * 4, 38 + i * 4], [0, 1]);
          return (
            <div key={k.t} style={{ opacity: p, transform: `scale(${(0.6 + 0.4 * p) * (1 + on * 0.06)})`, padding: "12px 24px", borderRadius: 999, background: alpha(k.c, 0.12 + on * 0.16), border: `3px solid ${k.c}`, boxShadow: `0 0 ${10 + on * 24}px ${alpha(k.c, 0.3 + on * 0.4)}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 32, color: C.text, whiteSpace: "nowrap" }}>{k.t}</div>
          );
        })}
      </div>
      <Pop x={540} y={1300} at={s.cueS(1, "Save") - 4}>
        <Pill color={C.green} size={32}>
          <Bookmark size={34} color={C.green} />
          SAVE THIS ONE
        </Pill>
      </Pop>
    </AbsoluteFill>
  );
};
