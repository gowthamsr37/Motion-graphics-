// SCENE 6 — WAY 3: 100 DOORS. A 10×10 grid of small doors; you pick #1 (cyan); the host opens 98 (they grey out in a
// sweep), leaving yours and #57 (orange glow); "your random pick vs the one door he avoided" → SWITCH.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { HOT } from "../components/Doors";
import { Pill, Pop, Txt } from "../components/L";
import { ease } from "../components/Motion";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const KEEP = 56;

export const S6Way3: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s6");
  const IM = s.cueS(0, "100");
  const PICK = s.sent(1).from;
  const OPEN = s.cueS(1, "opens");
  const Q = s.sent(2).from;
  const SW = s.cueS(2, "Obviously,");
  return (
    <AbsoluteFill>
      <Pop x={540} y={240} at={s.sent(0).from - 4}>
        <Pill color={C.cyan} size={40}>WAY 3 · 100 DOORS</Pill>
      </Pop>
      <div style={{ position: "absolute", left: 140, top: 320, width: 800, display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: 10 }}>
        {Array.from({ length: 100 }, (_, i) => {
          const show = ease(frame, [IM - 6 + i * 0.3, IM + i * 0.3], [0, 1]);
          const mine = i === 0, keep = i === KEEP;
          const gone = !mine && !keep ? ease(frame, [OPEN + i * 0.5, OPEN + 6 + i * 0.5], [0, 1]) : 0;
          const col = mine && frame >= PICK ? C.cyan : keep && frame >= OPEN + 40 ? HOT : "#C2410C";
          return (
            <div key={i} style={{ aspectRatio: "1", borderRadius: "8px 8px 3px 3px", background: gone > 0.5 ? "rgba(255,255,255,0.05)" : col, border: `2px solid ${gone > 0.5 ? alpha(C.text, 0.15) : "#FDBA74"}`, opacity: show * (1 - gone * 0.6), boxShadow: (mine && frame >= PICK) || (keep && frame >= OPEN + 40) ? `0 0 20px ${col}` : undefined, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 20, color: "#1A0A00" }}>
              {gone > 0.5 ? "" : i + 1}
            </div>
          );
        })}
      </div>
      <Pop x={540} y={1150} at={OPEN + 10}>
        <Txt size={40} font="body">host opens <span style={{ color: C.dim }}>98 goats</span></Txt>
      </Pop>
      <Pop x={300} y={1225} at={Q}>
        <Txt size={34} font="body"><span style={{ color: C.cyan }}>#1</span> your random pick</Txt>
      </Pop>
      <Pop x={780} y={1225} at={Q + 10}>
        <Txt size={34} font="body"><span style={{ color: HOT }}>#57</span> the door he avoided</Txt>
      </Pop>
      <Pop x={540} y={1310} at={SW - 4}>
        <Pill color={HOT} size={46} solid>OBVIOUSLY: SWITCH</Pill>
      </Pop>
    </AbsoluteFill>
  );
};
