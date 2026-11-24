// SCENE 1 — TITLE CARD FROM FRAME 0: DAY 3 / 100, "Your First ML PROJECT · the real way", the 8 steps by their proper
// names (problem definition … deployment) listed by ~1.6 s, then the promise chip "+ the real problem at every step";
// SAVE THIS ONE.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Bookmark } from "../components/Guide";
import { Pill, Pop, Txt } from "../components/D2";
import { ease } from "../components/Motion";
import { JARGON, STEP_C } from "../components/Steps";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

export const S1Title: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s1");
  const PROB = s.cueS(1, "problems");
  return (
    <AbsoluteFill>
      <Pop x={330} y={230} at={0}>
        <Pill color={C.violet} size={30}>100 DAYS OF ML</Pill>
      </Pop>
      <Pop x={800} y={230} at={3}>
        <Txt size={56} color={C.yellow} glow>
          DAY 3 <span style={{ color: C.dim, fontSize: 36 }}>/ 100</span>
        </Txt>
      </Pop>
      <Pop x={540} y={350} at={4}>
        <Txt size={80}>Your First ML</Txt>
      </Pop>
      <Pop x={540} y={455} at={8}>
        <Txt size={110} style={{ background: `linear-gradient(90deg, ${C.cyan}, ${C.violet}, ${C.orange})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", textShadow: "none", filter: `drop-shadow(0 0 22px ${alpha(C.violet, 0.5)})` }}>PROJECT</Txt>
      </Pop>
      <Pop x={540} y={545} at={10}>
        <Txt size={40} color={C.dim} font="body">the real way</Txt>
      </Pop>
      <div style={{ position: "absolute", left: 40, right: 40, top: 610, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12 }}>
        {JARGON.map((t, i) => {
          const p = ease(frame, [14 + i * 3, 20 + i * 3], [0, 1]);
          return (
            <div key={t} style={{ opacity: p, transform: `scale(${0.6 + 0.4 * p})`, display: "flex", alignItems: "center", gap: 10, padding: "10px 18px", borderRadius: 18, background: alpha(STEP_C[i], 0.14), border: `3px solid ${STEP_C[i]}` }}>
              <span style={{ width: 40, height: 40, borderRadius: 20, background: STEP_C[i], color: C.ink, display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 24 }}>{i + 1}</span>
              <span style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 29, color: C.text, whiteSpace: "nowrap" }}>{t}</span>
            </div>
          );
        })}
      </div>
      <Pop x={540} y={1150} at={PROB - 4}>
        <Pill color={C.red} size={38}>+ THE REAL PROBLEM AT EVERY STEP</Pill>
      </Pop>
      <Pop x={540} y={1290} at={s.cueS(1, "Save") - 4}>
        <Pill color={C.green} size={32}>
          <Bookmark size={34} color={C.green} />
          SAVE THIS ONE
        </Pill>
      </Pop>
    </AbsoluteFill>
  );
};
