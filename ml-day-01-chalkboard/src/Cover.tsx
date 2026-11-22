// Reel cover (notebook look): 100 DAYS OF ML box + red "Day 1 / 100"; "What is Machine Learning?" in handwriting with
// marker; robot doodle; the four everyday-ML doodles (face unlock, spam, video picks, traffic) with the hook "you use it
// 12× a day" and tally marks; a SAVE THIS sticky; @curious_datascientist in pen. Everything sits inside the 3:4 grid crop.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Envelope, MapPin, PhoneFace, PlayBtn, Robot } from "./components/Doodles";
import { ChalkDefs, Hi, Layer, Paper, Sketch, Sticky, Write, WriteAt } from "./components/NB";
import { hand, HANDLE, nb } from "./theme";

const DONE = -200; // draw everything fully

export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: nb.paper }}>
    <ChalkDefs />
    <Paper seed={7} />
    <Layer>
      <Sketch s={{ k: "rect", x: 160, y: 262, w: 330, h: 74 }} at={DONE} o={{ color: nb.blue, width: 4, seed: 3 }} />
    </Layer>
    <WriteAt x={325} y={300} at={DONE} size={40} color={nb.blue} font="body">
      100 DAYS OF ML
    </WriteAt>
    <WriteAt x={800} y={300} at={DONE} size={68} color={nb.red} rot={-5}>
      Day 1 / 100
    </WriteAt>
    <div style={{ position: "absolute", left: 160, top: 390, lineHeight: 1 }}>
      <Write at={DONE} size={140}>
        What is
      </Write>
    </div>
    <div style={{ position: "absolute", left: 160, top: 535, lineHeight: 1 }}>
      <Hi at={DONE}>
        <Write at={DONE} size={150}>
          Machine
        </Write>
      </Hi>
    </div>
    <div style={{ position: "absolute", left: 160, top: 685, lineHeight: 1 }}>
      <Hi at={DONE}>
        <Write at={DONE} size={150}>
          Learning
        </Write>
      </Hi>
      <Write at={DONE} size={150} color={nb.red}>
        ?
      </Write>
    </div>
    <Layer>
      <Robot x={830} y={500} s={220} at={DONE} />
      <PhoneFace x={230} y={1000} s={170} at={DONE} />
      <Envelope x={440} y={1000} s={170} at={DONE} />
      <PlayBtn x={650} y={1000} s={170} at={DONE} />
      <MapPin x={860} y={1000} s={170} at={DONE} />
      {/* tally */}
      {Array.from({ length: 12 }, (_, i) => {
        const grp = Math.floor(i / 5);
        const j = i % 5;
        const x0 = 745 + grp * 92;
        if (j === 4) return <Sketch key={i} s={{ k: "line", x1: x0 - 8, y1: 1184, x2: x0 + 56, y2: 1150 }} at={DONE} o={{ color: nb.red, width: 5, seed: 80 + i }} />;
        return <Sketch key={i} s={{ k: "line", x1: x0 + j * 13, y1: 1144, x2: x0 + j * 13 + 3, y2: 1188 }} at={DONE} o={{ color: nb.ink, width: 5, seed: 80 + i }} />;
      })}
    </Layer>
    <WriteAt x={165} y={1165} align="left" at={DONE} size={72} color={nb.red}>
      you use it 12x a day
    </WriteAt>
    <WriteAt x={540} y={1260} at={DONE} size={48} color={nb.pencil} font="body">
      but do you know what it actually is?
    </WriteAt>
    <Sticky x={330} y={1430} w={330} h={150} at={DONE} rot={-4}>
      <div style={{ fontFamily: hand.title, fontWeight: 700, fontSize: 62, color: nb.red, lineHeight: 1 }}>Save this!</div>
    </Sticky>
    <WriteAt x={770} y={1440} at={DONE} size={46} color={nb.blue} font="body">
      {HANDLE}
    </WriteAt>
  </AbsoluteFill>
);
