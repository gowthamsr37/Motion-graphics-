// SCENE 5 — WHY IT FEELS WRONG. BEFORE you start: 5 heads in a row = 1/2 × 1/2 × 1/2 × 1/2 × 1/2 = 1 in 32 (rare);
// AFTER they've happened: they're history (greyed, "already happened"), only ONE flip left: ½ heads · ½ tails;
// then "your brain expects 5 flips to look balanced; the law of large numbers needs thousands".
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { HOT } from "../components/BKit";
import { Panel, Pop, Txt } from "../components/L";
import { ease } from "../components/Motion";
import { theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

export const S5Why: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s5");
  const P32 = s.cueS(0, "32.");
  const AFTER = s.sent(1).from;
  const HIST = s.cueS(1, "history.");
  const HALF = s.cueS(1, "half,");
  const BRAIN = s.sent(2).from;
  const LLN = s.cueS(2, "law");
  return (
    <AbsoluteFill>
      <Pop x={540} y={250} at={s.sent(0).from - 4}>
        <Txt size={52}>
          why does tails feel <span style={{ color: C.yellow }}>due</span>?
        </Txt>
      </Pop>
      <Pop x={290} y={600} at={s.cueS(0, "rare.") - 6}>
        <Panel w={470} h={500} color={C.violet}>
          <Txt size={30} color={C.dim} font="body" style={{ letterSpacing: "0.14em" }}>BEFORE YOU START</Txt>
          <Txt size={34} font="mono">½×½×½×½×½</Txt>
          <Txt size={90} color={C.violet} glow style={{ opacity: ease(frame, [P32 - 4, P32 + 4], [0, 1]) }}>1 in 32</Txt>
          <Txt size={32} font="body">5 heads in a row: rare</Txt>
        </Panel>
      </Pop>
      <Pop x={790} y={600} at={AFTER - 2}>
        <Panel w={470} h={500} color={HOT}>
          <Txt size={30} color={C.dim} font="body" style={{ letterSpacing: "0.14em" }}>AFTER THEY HAPPEN</Txt>
          <div style={{ display: "flex", gap: 8, opacity: 1 - ease(frame, [HIST - 6, HIST + 6], [0, 0.7]) }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} style={{ width: 54, height: 54, borderRadius: 27, background: "#F5C542", border: "4px solid #B7791F", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 26, color: "#7C4A03" }}>H</div>
            ))}
          </div>
          <Txt size={28} font="body" color={C.dim} style={{ opacity: ease(frame, [HIST - 4, HIST + 4], [0, 1]) }}>history: already happened</Txt>
          <Txt size={34} font="body">only ONE flip left:</Txt>
          <Txt size={70} color={HOT} glow style={{ opacity: ease(frame, [HALF - 6, HALF + 4], [0, 1]) }}>½ · ½</Txt>
        </Panel>
      </Pop>
      <Pop x={540} y={1000} at={BRAIN - 4}>
        <Txt size={40} font="body">
          your brain wants <span style={{ color: C.yellow }}>5 flips</span> to look balanced
        </Txt>
      </Pop>
      <Pop x={540} y={1120} at={LLN - 4}>
        <Panel w={960} h={160} color={C.green} style={{ flexDirection: "row", gap: 18 }}>
          <Txt size={38}>law of large numbers:</Txt>
          <Txt size={38} color={C.green}>thousands, not five</Txt>
        </Panel>
      </Pop>
    </AbsoluteFill>
  );
};
