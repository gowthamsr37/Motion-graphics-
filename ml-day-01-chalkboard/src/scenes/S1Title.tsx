// SCENE 1 — TITLE CARD FROM FRAME 0. A notebook page: "100 DAYS OF ML" box + red "Day 1/100"; the title "What is
// Machine Learning?" writes itself (marker on "Machine Learning"); a robot doodle sketches itself; the checklist of what
// this reel covers (rules vs learning · how a machine learns · the 3 types · AI vs ML vs DL) is written by ~1.6 s and
// each box gets ticked as it is named; SAVE THIS sticky on "Save".
import React from "react";
import { AbsoluteFill } from "remotion";
import { Robot } from "../components/Doodles";
import { ChalkDust, Check, Hi, Layer, Sketch, Sticky, Write, WriteAt } from "../components/NB";
import { hand, nb } from "../theme";
import { useScene } from "../timing";

const ITEMS = ["Rules vs learning", "How a machine learns", "The 3 types", "AI vs ML vs Deep Learning"];

export const S1Title: React.FC = () => {
  const s = useScene("s1");
  const ticks = [s.cueS(1, "Rules"), s.cueS(1, "learns,"), s.cueS(1, "types."), s.cueS(1, "Save") - 6];
  const SAVE = s.cueS(1, "Save");
  return (
    <AbsoluteFill>
      {/* series tag + day */}
      <Layer>
        <Sketch s={{ k: "rect", x: 160, y: 212, w: 330, h: 74 }} at={0} dur={8} o={{ color: nb.blue, width: 4, seed: 3 }} />
      </Layer>
      <WriteAt x={325} y={250} at={1} size={40} color={nb.blue} font="body" cps={70} pencil={false}>
        100 DAYS OF ML
      </WriteAt>
      <WriteAt x={800} y={250} at={3} size={64} color={nb.red} cps={60} rot={-5} pencil={false}>
        Day 1 / 100
      </WriteAt>
      {/* title */}
      <div style={{ position: "absolute", left: 160, top: 330, lineHeight: 1 }}>
        <Write at={4} size={124} cps={55}>
          What is
        </Write>
      </div>
      <div style={{ position: "absolute", left: 160, top: 462, lineHeight: 1 }}>
        <Hi at={20} dur={8}>
          <Write at={9} size={136} cps={55}>
            Machine
          </Write>
        </Hi>
      </div>
      <div style={{ position: "absolute", left: 160, top: 600, lineHeight: 1 }}>
        <Hi at={26} dur={8}>
          <Write at={15} size={136} cps={55}>
            Learning
          </Write>
        </Hi>
        <Write at={24} size={136} color={nb.red} cps={30} pencil={false}>
          ?
        </Write>
      </div>
      <Layer>
        <Robot x={810} y={430} s={210} at={6} />
      </Layer>
      {/* chalk-dust burst as the title hits the board */}
      <ChalkDust x={400} y={420} at={0} count={60} spread={260} w={560} seed={2} />
      <ChalkDust x={420} y={640} at={14} count={34} spread={180} w={480} seed={5} />
      {/* checklist */}
      <WriteAt x={170} y={850} align="left" at={22} size={40} color={nb.pencil} font="body" cps={80} pencil={false}>
        In this one:
      </WriteAt>
      <Layer>
        {ITEMS.map((_, i) => (
          <React.Fragment key={i}>
            <Sketch s={{ k: "rect", x: 178, y: 902 + i * 100, w: 52, h: 52 }} at={24 + i * 4} dur={5} o={{ color: nb.ink, width: 3.5, seed: 70 + i }} />
            <Check x={206} y={928 + i * 100} s={50} at={ticks[i]} />
          </React.Fragment>
        ))}
      </Layer>
      {ITEMS.map((t, i) => (
        <WriteAt key={t} x={262} y={930 + i * 100} align="left" at={26 + i * 4} size={58} font="body" cps={90} pencil={false}>
          {t}
        </WriteAt>
      ))}
      <ChalkDust x={850} y={1290} at={SAVE - 2} count={26} spread={150} w={260} seed={8} />
      <Sticky x={850} y={1290} w={300} h={160} at={SAVE - 4} rot={5}>
        <div style={{ fontFamily: hand.title, fontWeight: 700, fontSize: 60, color: nb.red, lineHeight: 1 }}>Save this!</div>
        <div style={{ fontFamily: hand.body, fontSize: 30, color: nb.ink }}>you&apos;ll need it</div>
      </Sticky>
    </AbsoluteFill>
  );
};
