// SCENE 8 — STEP 6: TRAIN. Step bar (6). The guess → error → adjust loop (three nodes on a circle with a travelling
// dot) and an error meter falling from Rs 18L to Rs 4L over the 8,000 training flats; "like Day 1".
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Panel, Pop, Txt } from "../components/D2";
import { ease } from "../components/Motion";
import { StepBar } from "../components/Steps";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

export const S8Train: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s8");
  const G = s.cueS(1, "guesses,");
  const a = (frame - G) / 12;
  const err = ease(frame, [G, s.duration - 10], [18, 4]);
  const nodes = [
    { t: "GUESS", c: C.cyan, ang: -90 },
    { t: "ERROR", c: C.red, ang: 30 },
    { t: "ADJUST", c: C.green, ang: 150 },
  ];
  return (
    <AbsoluteFill>
      <StepBar cur={5} at={0} />
      <Pop x={540} y={420} at={s.sent(0).from}>
        <Txt size={70}>train the <span style={{ color: C.cyan }}>model</span></Txt>
      </Pop>
      <Pop x={540} y={500} at={s.cueS(1, "8,000") - 4}>
        <Txt size={34} font="body">on the <span style={{ color: C.cyan }}>8,000</span> training flats</Txt>
      </Pop>
      <div style={{ position: "absolute", left: 340, top: 600, width: 400, height: 400, opacity: ease(frame, [G - 6, G + 4], [0, 1]) }}>
        <svg width={400} height={400}>
          <circle cx={200} cy={200} r={140} fill="none" stroke={alpha(C.text, 0.25)} strokeWidth={4} strokeDasharray="10 10" />
          <circle cx={200 + Math.cos(a) * 140} cy={200 + Math.sin(a) * 140} r={14} fill={C.yellow} style={{ filter: `drop-shadow(0 0 10px ${C.yellow})` }} />
        </svg>
        {nodes.map((n) => {
          const r = (n.ang * Math.PI) / 180;
          return (
            <div key={n.t} style={{ position: "absolute", left: 200 + Math.cos(r) * 140, top: 200 + Math.sin(r) * 140, transform: "translate(-50%, -50%)", padding: "8px 18px", borderRadius: 14, background: "rgba(5,10,31,0.95)", border: `3px solid ${n.c}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 28, color: C.text }}>{n.t}</div>
          );
        })}
      </div>
      <Pop x={540} y={1130} at={G + 6}>
        <Panel w={800} h={170} color={C.green}>
          <Txt size={30} color={C.dim} font="body">average miss</Txt>
          <Txt size={60} font="mono" color={C.green}>Rs {err.toFixed(1)}L</Txt>
        </Panel>
      </Pop>
      <Pop x={540} y={1290} at={s.cueS(1, "Day") - 4}>
        <Txt size={32} font="body" color={C.dim}>just like Day 1</Txt>
      </Pop>
    </AbsoluteFill>
  );
};
