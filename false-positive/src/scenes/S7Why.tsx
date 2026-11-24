// SCENE 7 — WHY: two crowds to scale: SICK 10 (tiny red square) vs HEALTHY 9,990 (huge grey square); 1% of the huge one
// (≈100) dwarfs the 10 real cases; BASE RATE NEGLECT.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FALSE, SICK } from "../components/People";
import { Pill, Pop, Txt } from "../components/L";
import { ease } from "../components/Motion";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

export const S7Why: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s7");
  const HUGE = s.cueS(0, "huge.");
  const ERR = s.sent(1).from;
  const NEG = s.cueS(2, "base");
  const fp = ease(frame, [ERR + 10, ERR + 40], [0, 1]);
  return (
    <AbsoluteFill>
      <Pop x={540} y={250} at={s.sent(0).from - 4}>
        <Txt size={54}>the trap: the <span style={{ color: C.yellow }}>base rate</span></Txt>
      </Pop>
      <div style={{ position: "absolute", left: 120, top: 380, display: "flex", alignItems: "flex-end", gap: 60 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, opacity: ease(frame, [s.cueS(0, "rare") - 4, s.cueS(0, "rare") + 4], [0, 1]) }}>
          <div style={{ width: 40, height: 40, background: SICK, borderRadius: 6, boxShadow: `0 0 16px ${SICK}` }} />
          <Txt size={32}>sick: 10</Txt>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, opacity: ease(frame, [HUGE - 6, HUGE + 4], [0, 1]) }}>
          <div style={{ position: "relative", width: 640, height: 640, background: alpha(C.text, 0.16), border: `3px solid ${alpha(C.text, 0.4)}`, borderRadius: 10 }}>
            <div style={{ position: "absolute", right: 0, bottom: 0, width: 64 * fp, height: 640, background: alpha(FALSE, 0.85), borderRadius: "0 10px 10px 0" }} />
          </div>
          <Txt size={32}>healthy: 9,990</Txt>
        </div>
      </div>
      <Pop x={540} y={1150} at={ERR + 20}>
        <Txt size={40} font="body">
          1% of the huge crowd (<span style={{ color: FALSE }}>~100</span>) &gt; all real cases (<span style={{ color: SICK }}>10</span>)
        </Txt>
      </Pop>
      <Pop x={540} y={1280} at={NEG - 4}>
        <Pill color={C.yellow} size={50} solid>BASE RATE NEGLECT</Pill>
      </Pop>
    </AbsoluteFill>
  );
};
