// SCENE 5 — WAY 2: ALL THREE CASES. A table, one row per sentence: car behind 1 → switching LOSES; car behind 2 →
// host opens 3, switch to 2, WIN; car behind 3 → host opens 2, switch to 3, WIN; SWITCH WINS 2 OF 3.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Car } from "../components/Casino";
import { HOT, Goat } from "../components/Doors";
import { Pill, Pop } from "../components/L";
import { ease } from "../components/Motion";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

export const S5Way2: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s5");
  const rows = [
    { car: 0, host: "2 or 3", res: "LOSE", at: s.sent(1).from },
    { car: 1, host: "3", res: "WIN", at: s.sent(2).from },
    { car: 2, host: "2", res: "WIN", at: s.sent(3).from },
  ];
  return (
    <AbsoluteFill>
      <Pop x={540} y={240} at={s.sent(0).from - 4}>
        <Pill color={C.cyan} size={40}>WAY 2 · EVERY CASE</Pill>
      </Pop>
      <div style={{ position: "absolute", left: 60, right: 60, top: 340, display: "flex", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 26, color: C.dim, letterSpacing: "0.1em", opacity: ease(frame, [s.sent(0).from, s.sent(0).from + 8], [0, 1]) }}>
        <div style={{ width: 420, textAlign: "center" }}>DOORS 1 · 2 · 3</div>
        <div style={{ width: 220, textAlign: "center" }}>HOST OPENS</div>
        <div style={{ flex: 1, textAlign: "center" }}>IF YOU SWITCH</div>
      </div>
      {rows.map((r, i) => {
        const p = ease(frame, [r.at - 4, r.at + 6], [0, 1]);
        const win = r.res === "WIN";
        return (
          <div key={i} style={{ position: "absolute", left: 60, right: 60, top: 400 + i * 230, height: 200, display: "flex", alignItems: "center", borderRadius: 24, background: "rgba(14,24,64,0.9)", border: `3px solid ${alpha(win ? C.green : C.red, 0.8)}`, opacity: p, transform: `translateX(${(1 - p) * -40}px)` }}>
            <div style={{ width: 420, display: "flex", justifyContent: "center", gap: 18 }}>
              {[0, 1, 2].map((d) => (
                <div key={d} style={{ width: 120, height: 120, borderRadius: 14, background: d === 0 ? alpha(C.cyan, 0.2) : "rgba(255,255,255,0.05)", border: `3px solid ${d === 0 ? C.cyan : alpha(C.text, 0.25)}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {d === r.car ? <Car size={100} color={C.yellow} /> : <Goat size={80} />}
                </div>
              ))}
            </div>
            <div style={{ width: 220, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 44, color: C.text }}>{r.host}</div>
            <div style={{ flex: 1, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 60, color: win ? C.green : C.red }}>{r.res}</div>
          </div>
        );
      })}
      <Pop x={540} y={1180} at={s.sent(4).from - 2}>
        <Pill color={HOT} size={50} solid>SWITCH WINS 2 OF 3</Pill>
      </Pop>
    </AbsoluteFill>
  );
};
