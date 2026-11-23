// SCENE 6 — THE MILLION-FLIP TEST (mulberry32 seed 2): a flip counter races to 1,000,000; "5 HEADS IN A ROW" counter
// to 31,225; the next flip split bar fills to HEADS 15,599 (50.0%) vs TAILS 15,626.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { HOT } from "../components/BKit";
import { Panel, Pill, Pop, Txt } from "../components/L";
import { ease } from "../components/Motion";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const STREAKS = 31225, NEXTH = 15599;

export const S6Test: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s6");
  const GO = s.cueS(0, "million");
  const ST = s.sent(1).from;
  const NEXT = s.cueS(1, "next");
  const flips = Math.round(ease(frame, [GO - 6, ST + 10], [0, 1000000], (t) => t));
  const st = Math.round(ease(frame, [ST, ST + 30], [0, STREAKS]));
  const b = ease(frame, [NEXT, NEXT + 40], [0, 1]);
  const h = Math.round(NEXTH * b), t = Math.round((STREAKS - NEXTH) * b);
  return (
    <AbsoluteFill>
      <Pop x={540} y={250} at={s.sent(0).from - 4}>
        <Txt size={52}>don&apos;t trust me? <span style={{ color: HOT }}>test it</span></Txt>
      </Pop>
      <Pop x={540} y={420} at={GO - 6}>
        <Panel w={960} h={190} color={C.cyan}>
          <Txt size={30} color={C.dim} font="body" style={{ letterSpacing: "0.14em" }}>COIN FLIPS</Txt>
          <Txt size={84} font="mono" color={C.cyan} glow>{flips.toLocaleString("en-IN")}</Txt>
        </Panel>
      </Pop>
      <Pop x={540} y={660} at={ST - 4}>
        <Panel w={960} h={190} color={C.violet}>
          <Txt size={30} color={C.dim} font="body" style={{ letterSpacing: "0.14em" }}>TIMES WE SAW 5 HEADS IN A ROW</Txt>
          <Txt size={84} font="mono" color={C.violet} glow>{st.toLocaleString("en-IN")}</Txt>
        </Panel>
      </Pop>
      <Pop x={540} y={920} at={NEXT - 4}>
        <Txt size={40} font="body">and the very next flip…</Txt>
      </Pop>
      <div style={{ position: "absolute", left: 90, top: 990, width: 900, opacity: ease(frame, [NEXT, NEXT + 6], [0, 1]) }}>
        <div style={{ display: "flex", height: 90, borderRadius: 18, overflow: "hidden", border: `3px solid ${alpha(C.text, 0.4)}` }}>
          <div style={{ width: `${50 * b}%`, background: C.cyan, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 34, color: C.ink }}>HEADS</div>
          <div style={{ flex: 1 }} />
          <div style={{ width: `${50 * b}%`, background: C.violet, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 34, color: C.ink }}>TAILS</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 34, color: C.text }}>
          <span>{h.toLocaleString("en-IN")}</span>
          <span>{t.toLocaleString("en-IN")}</span>
        </div>
      </div>
      <Pop x={540} y={1260} at={s.cueS(1, "50%") - 2}>
        <Pill color={C.green} size={50} solid>HEADS: 50.0%</Pill>
      </Pop>
    </AbsoluteFill>
  );
};
