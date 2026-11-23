// SCENE 1 — TITLE CARD FROM FRAME 0: WHY THE CASINO NEVER LOSES · THE LAW OF LARGE NUMBERS; a roulette wheel spinning;
// five topic chips (the edge · coin test · the law · real life · gambler's trap) on screen by ~1.5 s, each glowing as
// it is named; SAVE THIS ONE pill.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Bookmark } from "../components/Guide";
import { Wheel } from "../components/Casino";
import { Pill, Pop, Txt } from "../components/L";
import { ease } from "../components/Motion";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
export const GRAD = `linear-gradient(90deg, ${C.cyan}, ${C.violet}, ${C.orange})`;

export const S1Title: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s1");
  const chips = [
    { t: "THE EDGE", c: C.green, at: s.cueS(1, "edge,") },
    { t: "COIN TEST", c: C.yellow, at: s.cueS(1, "coin") },
    { t: "THE LAW", c: C.cyan, at: s.cueS(1, "law,") },
    { t: "REAL LIFE", c: C.violet, at: s.cueS(1, "real-life") },
    { t: "GAMBLER'S TRAP", c: C.red, at: s.cueS(1, "gambler's") },
  ];
  const SAVE = s.cueS(1, "Save");
  return (
    <AbsoluteFill>
      <Pop x={540} y={300} at={0}>
        <Txt size={92} style={{ textAlign: "center" }}>WHY THE CASINO</Txt>
      </Pop>
      <Pop x={540} y={405} at={4}>
        <Txt size={112} style={{ background: `linear-gradient(90deg, ${C.green}, ${C.yellow})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", textShadow: "none", filter: `drop-shadow(0 0 22px ${alpha(C.green, 0.5)})` }}>
          NEVER LOSES
        </Txt>
      </Pop>
      <Pop x={540} y={500} at={8}>
        <Txt size={40} style={{ letterSpacing: "0.06em", background: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", textShadow: "none" }}>THE LAW OF LARGE NUMBERS</Txt>
      </Pop>
      <Pop x={540} y={790} at={6}>
        <div style={{ filter: `drop-shadow(0 0 40px ${alpha(C.green, 0.35)})` }}>
          <Wheel r={210} rot={frame * 4} ball={-frame * 7} />
        </div>
      </Pop>
      <div style={{ position: "absolute", left: 40, right: 40, top: 1060, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16 }}>
        {chips.map((k, i) => {
          const on = ease(frame, [k.at, k.at + 8], [0, 1]);
          const p = ease(frame, [14 + i * 4, 22 + i * 4], [0, 1]);
          return (
            <div key={k.t} style={{ opacity: p, transform: `scale(${(0.6 + 0.4 * p) * (1 + on * 0.08)})` }}>
              <div style={{ padding: "12px 26px", borderRadius: 999, background: alpha(k.c, 0.12 + on * 0.16), border: `3px solid ${k.c}`, boxShadow: `0 0 ${10 + on * 26}px ${alpha(k.c, 0.3 + on * 0.4)}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 34, color: C.text, whiteSpace: "nowrap" }}>{k.t}</div>
            </div>
          );
        })}
      </div>
      <Pop x={540} y={1320} at={SAVE - 4}>
        <Pill color={C.green} size={32}>
          <Bookmark size={34} color={C.green} />
          SAVE THIS ONE
        </Pill>
      </Pop>
    </AbsoluteFill>
  );
};
