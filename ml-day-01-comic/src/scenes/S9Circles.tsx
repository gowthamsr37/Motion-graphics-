// SCENE 9 — WHERE IT FITS. Three nested hand-drawn ellipses with pastel hatching: ARTIFICIAL INTELLIGENCE (machines doing
// smart things) ⊃ MACHINE LEARNING ⊃ DEEP LEARNING, with a ChatGPT sticky in the middle.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Header, Layer, Sketch, Sticky, WriteAt } from "../components/NB";
import { hand, nb } from "../theme";
import { useScene } from "../timing";

export const S9Circles: React.FC = () => {
  const s = useScene("s9");
  const AI = s.cueS(0, "Artificial");
  const SM = s.cueS(0, "smart");
  const ML = s.sent(1).from;
  const DL = s.cueS(1, "deep");
  const GPT = s.cueS(1, "ChatGPT,");
  return (
    <AbsoluteFill>
      <Header text="where does it all fit?" at={s.sent(0).from - 4} />
      <Layer>
        <Sketch s={{ k: "ellipse", x: 540, y: 800, w: 880, h: 780 }} at={AI - 6} dur={18} o={{ color: nb.orange, width: 5, fill: nb.ellAI, fillStyle: "hachure", hachureGap: 14, fillWeight: 3, seed: 501, rough: 1.4 }} />
        <Sketch s={{ k: "ellipse", x: 540, y: 880, w: 620, h: 520 }} at={ML - 4} dur={16} o={{ color: nb.blue, width: 5, fill: nb.ellML, fillStyle: "hachure", hachureGap: 12, fillWeight: 3, seed: 502, rough: 1.4 }} />
        <Sketch s={{ k: "ellipse", x: 540, y: 970, w: 360, h: 290 }} at={DL - 4} dur={14} o={{ color: nb.purple, width: 5, fill: nb.ellDL, fillStyle: "solid", seed: 503, rough: 1.4 }} />
      </Layer>
      <WriteAt x={540} y={500} at={AI} size={66} color={nb.orange} cps={30}>
        Artificial Intelligence
      </WriteAt>
      <WriteAt x={540} y={556} at={SM - 2} size={36} color={nb.pencil} font="body" cps={40} pencil={false}>
        machines doing smart things
      </WriteAt>
      <WriteAt x={540} y={690} at={ML + 4} size={66} color={nb.blue} cps={30}>
        Machine Learning
      </WriteAt>
      <WriteAt x={540} y={745} at={ML + 14} size={34} color={nb.pencil} font="body" cps={40} pencil={false}>
        learns from data
      </WriteAt>
      <WriteAt x={540} y={905} at={DL + 2} size={60} color={nb.purple} cps={30}>
        Deep Learning
      </WriteAt>
      <Sticky x={540} y={1020} w={230} h={86} at={GPT - 4} rot={-4} tape={false} color={nb.stickyGreen}>
        <div style={{ fontFamily: hand.body, fontSize: 42, color: nb.ink, lineHeight: 1 }}>ChatGPT</div>
      </Sticky>
    </AbsoluteFill>
  );
};
