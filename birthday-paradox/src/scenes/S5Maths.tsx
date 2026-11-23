// SCENE 5 — THE MATHS, STEP BY STEP. "Work out the opposite: ALL DIFFERENT"; 23 fraction tiles (person k: (366−k)/365):
// the first three land on their sentences (365/365, 364/365, 363/365), then the rest race in down to 343/365.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Guy, HOT } from "../components/BKit";
import { Pill, Pop, Txt } from "../components/L";
import { ease } from "../components/Motion";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
export const TILE = (i: number) => ({ x: 150 + (i % 5) * 195, y: 560 + Math.floor(i / 5) * 140 });

export const S5Maths: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s5");
  const at = [s.sent(1).from, s.sent(2).from, s.sent(3).from];
  const REST = s.cueS(3, "on,");
  return (
    <AbsoluteFill>
      <Pop x={540} y={250} at={s.sent(0).from - 4}>
        <Txt size={44} font="body">easier: work out the opposite</Txt>
      </Pop>
      <Pop x={540} y={340} at={s.cueS(0, "different") - 6}>
        <Pill color={C.cyan} size={46}>EVERYONE DIFFERENT</Pill>
      </Pop>
      {Array.from({ length: 23 }, (_, i) => {
        const t = TILE(i);
        const a = i < 3 ? at[i] : REST + (i - 3) * 3;
        const p = ease(frame, [a - 2, a + 6], [0, 1]);
        const first = i < 3 && frame < REST;
        return (
          <div key={i} style={{ position: "absolute", left: t.x, top: t.y, transform: `translate(-50%, -50%) scale(${(0.5 + 0.5 * p) * (first ? 1.08 : 1)})`, opacity: p, width: 180, height: 116, boxSizing: "border-box", borderRadius: 18, background: "rgba(14,24,64,0.92)", border: `3px solid ${i < 3 ? alpha(C.cyan, 0.9) : alpha(C.text, 0.3)}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Guy size={20} color={i === 22 ? HOT : C.dim} />
              <span style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 20, color: C.dim }}>person {i + 1}</span>
            </div>
            <span style={{ fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 34, color: C.text }}>
              {365 - i}/365
            </span>
          </div>
        );
      })}
      {[0, 1, 2].map((i) => (
        <Pop key={i} x={540} y={1300} at={at[i] + 4} out={i < 2 ? at[i + 1] - 4 : REST - 4}>
          <Txt size={36} font="body">{["any day is fine", "must avoid 1 day", "must avoid 2 days"][i]}</Txt>
        </Pop>
      ))}
      <Pop x={540} y={1300} at={REST + 60}>
        <Txt size={36} font="body">
          person 23 must avoid <span style={{ color: HOT }}>22 days</span>
        </Txt>
      </Pop>
    </AbsoluteFill>
  );
};
