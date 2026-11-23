// SCENE 2 — HOOK: five coins land HEADS one by one on each spoken "heads"; then the "?" coin and three options
// HEADS · TAILS · 50-50; COMMENT YOUR ANSWER.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { HOT } from "../components/BKit";
import { Pill, Pop, Txt } from "../components/L";
import { ease } from "../components/Motion";
import { theme } from "../theme";
import { useScene } from "../timing";
import { CoinRow } from "./Bits";

const C = theme.colors;

export const S2Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s2");
  const heads = [0, 1, 2, 3, 4].map((i) => s.cueS(0, i < 4 ? "Heads," : "heads.", i < 4 ? i : 0));
  const Q = s.sent(1).from;
  const opts = [s.cueS(1, "Heads,"), s.cueS(1, "tails,"), s.cueS(1, "50-50?")];
  const COM = s.cueS(1, "Comment");
  return (
    <AbsoluteFill>
      <Pop x={540} y={260} at={s.sent(0).from - 4}>
        <Txt size={50}>a fair coin, 5 flips</Txt>
      </Pop>
      <div style={{ position: "absolute", left: 0, right: 0, top: 380 }}>
        <CoinRow faces={["H", "H", "H", "H", "H", "?"]} at={[...heads.map((h) => h - 6), Q]} size={140} />
      </div>
      <Pop x={540} y={680} at={Q}>
        <Txt size={54}>next flip?</Txt>
      </Pop>
      <div style={{ position: "absolute", left: 0, right: 0, top: 780, display: "flex", justifyContent: "center", gap: 20 }}>
        {["HEADS", "TAILS", "50-50"].map((t, i) => (
          <div key={t} style={{ opacity: ease(frame, [opts[i] - 4, opts[i] + 4], [0, 1]), transform: `scale(${ease(frame, [opts[i] - 4, opts[i] + 6], [0.6, 1])})`, width: 280, padding: "24px 0", borderRadius: 24, textAlign: "center", background: "rgba(14,24,64,0.9)", border: `3px solid ${[C.cyan, C.violet, C.green][i]}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 52, color: C.text }}>{t}</div>
        ))}
      </div>
      <Pop x={540} y={1080} at={COM - 4}>
        <div style={{ transform: `scale(${1 + Math.abs(Math.sin(frame / 8)) * 0.04})` }}>
          <Pill color={HOT} size={42} solid>COMMENT YOUR ANSWER</Pill>
        </div>
      </Pop>
    </AbsoluteFill>
  );
};
