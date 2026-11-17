// SCENE 5 — CHANGE THE CHANCE. Five options per question → a guess is right 1 time in 5: the bars morph from
// p = 1/2 to p = 1/5 and shift left; 2 right becomes the most likely (30%).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { SceneTitle } from "../components/Kit";
import { ease, Pop, useSpr } from "../components/Motion";
import { Pill } from "../components/Nodes";
import { glowText, theme } from "../theme";
import { useScene } from "../timing";
import { BARS, SUCC } from "./S1Hook";
import { BASE, binom, BinomBars, bx, H, HMAX } from "./S4Test";

const C = theme.colors;
const B50 = binom(10, 0.5);
const B20 = binom(10, 0.2);

export const S5Chance: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s5");
  const FIVE = s.cueS(1, "five");
  const SHIFT = s.sent(2).from;
  const TWO = s.cueS(2, "2");
  const m = ease(frame, [FIVE - 4, FIVE + 22], [0, 1], theme.ease.inOut);
  const vals = B50.map((v, k) => interpolate(m, [0, 1], [v, B20[k]]));
  const hi: Record<number, string> = {};
  if (frame >= TWO - 4) hi[2] = SUCC;
  const lab = spr(TWO, theme.spring.pop);

  return (
    <AbsoluteFill>
      <SceneTitle label="CHANGE THE CHANCE" color={BARS} at={2} />
      <div style={{ position: "absolute", left: 540, top: 430, transform: "translate(-50%, -50%)" }}>
        <Pill label={m > 0.5 ? "RIGHT 1 TIME IN 5" : "RIGHT 1 TIME IN 2"} color={m > 0.5 ? C.cyan : BARS} size={34} glow={0.5} />
      </div>
      <BinomBars vals={vals} grow={1} hi={hi} />
      {lab > 0.01 ? (
        <div style={{ position: "absolute", left: bx(2), top: BASE - (B20[2] / HMAX) * H - 40, transform: `translate(-50%, -50%) scale(${interpolate(lab, [0, 1], [0.5, 1])})`, opacity: Math.min(1, lab * 2), padding: "4px 14px", borderRadius: 12, background: "#0A1440", border: `3px solid ${SUCC}`, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 28, color: C.text, whiteSpace: "nowrap" }}>30%</div>
      ) : null}
      <Pop at={SHIFT - 2} x={700} y={560} from="left" dist={20} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text, whiteSpace: "nowrap" }}>
          THE BARS <span style={{ color: C.cyan, textShadow: glowText(C.cyan, 0.5) }}>SHIFT LEFT</span>
        </div>
      </Pop>
    </AbsoluteFill>
  );
};
