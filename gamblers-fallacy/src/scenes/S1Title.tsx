// SCENE 1 — TITLE CARD FROM FRAME 0: PARADOX #2, THE GAMBLER'S FALLACY, five heads + a "?" coin, "IS TAILS DUE?",
// four chips (Monte Carlo 1913 · the maths · million-flip test · everyday traps), SAVE THIS ONE.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Bookmark } from "../components/Guide";
import { HOT } from "../components/BKit";
import { Pill, Pop, Txt } from "../components/L";
import { ease } from "../components/Motion";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";
import { CoinRow } from "./Bits";

const C = theme.colors;

export const S1Title: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s1");
  const chips = [
    { t: "MONTE CARLO, 1913", c: C.red, at: s.cueS(1, "true") },
    { t: "THE MATHS", c: C.cyan, at: s.cueS(1, "maths,") },
    { t: "1,000,000 FLIPS", c: C.green, at: s.cueS(1, "million-flip") },
    { t: "EVERYDAY TRAPS", c: C.violet, at: s.cueS(1, "fools") },
  ];
  return (
    <AbsoluteFill>
      <Pop x={540} y={250} at={0}>
        <Pill color={HOT} size={36} solid>PARADOX #2</Pill>
      </Pop>
      <Pop x={540} y={390} at={3}>
        <Txt size={96}>THE GAMBLER&apos;S</Txt>
      </Pop>
      <Pop x={540} y={500} at={6}>
        <Txt size={124} color={HOT} glow>FALLACY</Txt>
      </Pop>
      <div style={{ position: "absolute", left: 0, right: 0, top: 640 }}>
        <CoinRow faces={["H", "H", "H", "H", "H", "?"]} at={[8, 11, 14, 17, 20, 26]} size={140} />
      </div>
      <Pop x={540} y={880} at={30}>
        <Txt size={58}>
          is tails <span style={{ color: C.yellow }}>due</span>?
        </Txt>
      </Pop>
      <div style={{ position: "absolute", left: 60, right: 60, top: 990, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 14 }}>
        {chips.map((k, i) => {
          const on = ease(frame, [k.at, k.at + 8], [0, 1]);
          const p = ease(frame, [20 + i * 4, 28 + i * 4], [0, 1]);
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
