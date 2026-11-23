// SCENE 4 — THE ANSWER: "50-50. STILL." huge; a coin with a crossed-out memory bubble ("NO MEMORY"); five old flips
// fade to grey while the next flip stands alone at 50% / 50%; INDEPENDENCE definition card.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Coin } from "../components/Casino";
import { HOT } from "../components/BKit";
import { Panel, Pill, Pop, Txt } from "../components/L";
import { ease } from "../components/Motion";
import { glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

export const S4Answer: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s4");
  const FF = s.cueS(0, "50-50.");
  const MEM = s.sent(1).from;
  const NEW = s.cueS(1, "brand");
  const IND = s.sent(2).from;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 250, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 170, color: HOT, textShadow: glowText(HOT, 0.8), opacity: ease(frame, [FF - 6, FF + 2], [0, 1]), transform: `scale(${ease(frame, [FF - 6, FF + 4], [1.3, 1])})` }}>50-50</div>
      <Pop x={540} y={500} at={s.cueS(0, "Still.") - 2}>
        <Txt size={60}>still.</Txt>
      </Pop>
      <div style={{ position: "absolute", left: 0, right: 0, top: 600, display: "flex", justifyContent: "center", alignItems: "center", gap: 14, opacity: ease(frame, [MEM - 4, MEM + 6], [0, 1]) }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} style={{ opacity: 1 - ease(frame, [NEW - 10, NEW + 10], [0, 0.75]) }}>
            <Coin size={90} face="H" />
          </div>
        ))}
        <div style={{ width: 40 }} />
        <div style={{ transform: `scale(${1 + ease(frame, [NEW, NEW + 10], [0, 0.25])})` }}>
          <Coin size={130} flip={frame / 8} />
        </div>
      </div>
      <Pop x={540} y={820} at={MEM + 6}>
        <Pill color={C.yellow} size={44} solid>NO MEMORY</Pill>
      </Pop>
      <Pop x={540} y={920} at={NEW}>
        <Txt size={40} font="body">each flip is a brand new event</Txt>
      </Pop>
      <Pop x={540} y={1150} at={IND - 4}>
        <Panel w={960} h={240} color={C.cyan}>
          <Txt size={56} color={C.cyan} glow>INDEPENDENCE</Txt>
          <Txt size={36} font="body">past flips don&apos;t change the next one</Txt>
        </Panel>
      </Pop>
    </AbsoluteFill>
  );
};
