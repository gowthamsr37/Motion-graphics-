// SCENE 8 — THE SIMULATION: 1,000 rooms of 23 random people (mulberry32 seed 8) fill a 40×25 grid; rooms with a shared
// birthday light orange, the rest stay dim; a counter climbs to 507 / 1,000; "half the rooms, just like the maths".
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { HOT, ROOMS } from "../components/BKit";
import { Pill, Pop, Txt } from "../components/L";
import { ease } from "../components/Motion";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

export const S8Sim: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s8");
  const GO = s.cueS(0, "simulated");
  const DONE = s.cueS(1, "507");
  const shown = Math.round(ease(frame, [GO, DONE], [0, 1000], (t) => t));
  const hits = ROOMS.slice(0, shown).filter(Boolean).length;
  return (
    <AbsoluteFill>
      <Pop x={540} y={250} at={s.sent(0).from - 4}>
        <Txt size={50}>
          1,000 rooms × <span style={{ color: HOT }}>23 people</span>
        </Txt>
      </Pop>
      <div style={{ position: "absolute", left: 100, top: 340, width: 880, display: "grid", gridTemplateColumns: "repeat(40, 1fr)", gap: 4 }}>
        {ROOMS.map((h, i) => (
          <div key={i} style={{ aspectRatio: "1", borderRadius: 4, background: i < shown ? (h ? HOT : alpha(C.text, 0.18)) : "rgba(255,255,255,0.04)", boxShadow: i < shown && h ? `0 0 6px ${alpha(HOT, 0.7)}` : undefined }} />
        ))}
      </div>
      <Pop x={540} y={980} at={GO}>
        <Txt size={90} font="mono" color={HOT} glow>
          {hits} <span style={{ fontSize: 50, color: C.dim }}>/ {shown.toLocaleString("en-IN")}</span>
        </Txt>
      </Pop>
      <Pop x={540} y={1080} at={GO + 4}>
        <Txt size={34} font="body">
          <span style={{ color: HOT }}>■</span> rooms with a shared birthday
        </Txt>
      </Pop>
      <Pop x={540} y={1240} at={s.cueS(1, "Half") - 4}>
        <Pill color={C.green} size={44} solid>HALF THE ROOMS, LIKE THE MATHS</Pill>
      </Pop>
    </AbsoluteFill>
  );
};
