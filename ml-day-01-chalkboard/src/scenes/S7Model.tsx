// SCENE 7 — THE MODEL. A MODEL box (with the learned line sketched inside, "a learned recipe"); a new house (1,500 sq ft)
// goes in, the prediction $275k comes out (50 + 0.15 × 1,500, the line from scene 6). Then FEATURE / LABEL tags and a
// small hand-drawn table: size (feature) → price (label), with the new house's price filled in by the model.
import React from "react";
import { AbsoluteFill } from "remotion";
import { House } from "../components/Doodles";
import { Arrow, Header, Hi, Layer, Sketch, Write, WriteAt } from "../components/NB";
import { nb } from "../theme";
import { useScene } from "../timing";

const ROWS: [string, string][] = [
  ["800", "$170k"],
  ["1,200", "$230k"],
  ["2,000", "$350k"],
];

export const S7Model: React.FC = () => {
  const s = useScene("s7");
  const MOD = s.cueS(0, "model:");
  const REC = s.cueS(0, "recipe");
  const NEV = s.cueS(1, "never");
  const K15 = s.cueS(1, "1,500");
  const PRED = s.cueS(1, "predicts");
  const FEAT = s.cueS(2, "features.");
  const LAB = s.cueS(2, "label.");
  const T0 = s.sent(2).from;
  return (
    <AbsoluteFill>
      <Header text="what it learned: a model" at={2} />
      <Layer>
        <Sketch s={{ k: "rect", x: 385, y: 440, w: 310, h: 230 }} at={MOD - 8} dur={12} o={{ color: nb.purple, width: 5, fill: nb.modelFill, fillStyle: "solid", seed: 301 }} />
        <Sketch s={{ k: "line", x1: 420, y1: 640, x2: 660, y2: 540 }} at={MOD + 8} dur={8} o={{ color: nb.blue, width: 5, seed: 302 }} />
        {[[450, 620], [500, 612], [560, 590], [610, 560], [640, 556]].map(([x, y], i) => (
          <Sketch key={i} s={{ k: "circle", x, y, d: 12 }} at={MOD + 4 + i * 2} dur={3} o={{ color: nb.ink, width: 2, fill: nb.orange, fillStyle: "solid", seed: 303 + i }} />
        ))}
        <House x={190} y={545} s={170} at={NEV - 6} />
        <Arrow x1={280} y1={555} x2={375} y2={555} bend={0} at={K15} dur={8} />
        <Arrow x1={705} y1={555} x2={790} y2={555} bend={0} at={PRED - 4} dur={8} />
      </Layer>
      <WriteAt x={540} y={480} at={MOD - 2} size={58} color={nb.purple} cps={30} pencil={false}>
        MODEL
      </WriteAt>
      <WriteAt x={540} y={712} at={REC - 4} size={40} color={nb.pencil} font="body" cps={36} pencil={false}>
        a learned recipe
      </WriteAt>
      <WriteAt x={190} y={665} at={K15 - 2} size={46} color={nb.ink} font="body" cps={40} pencil={false}>
        1,500 sq ft
      </WriteAt>
      <WriteAt x={895} y={545} at={PRED + 6} size={92} color={nb.green} cps={24}>
        $275k
      </WriteAt>
      <WriteAt x={895} y={625} at={PRED + 14} size={38} color={nb.pencil} font="body" cps={40} pencil={false}>
        predicted price
      </WriteAt>
      {/* feature / label tags */}
      <div style={{ position: "absolute", left: 190, top: 770, transform: "translate(-50%, -50%)" }}>
        <Hi at={FEAT - 2} color={nb.sky}>
          <Write at={FEAT - 8} size={58} color={nb.blue} cps={30} pencil={false}>
            FEATURE
          </Write>
        </Hi>
      </div>
      <div style={{ position: "absolute", left: 895, top: 770, transform: "translate(-50%, -50%)" }}>
        <Hi at={LAB - 2} color={nb.pink}>
          <Write at={LAB - 8} size={58} color={nb.red} cps={30} pencil={false}>
            LABEL
          </Write>
        </Hi>
      </div>
      <WriteAt x={190} y={825} at={FEAT} size={34} color={nb.pencil} font="body" cps={40} pencil={false}>
        the input
      </WriteAt>
      <WriteAt x={895} y={825} at={LAB} size={34} color={nb.pencil} font="body" cps={40} pencil={false}>
        the answer
      </WriteAt>
      {/* table */}
      <Layer>
        <Sketch s={{ k: "rect", x: 250, y: 880, w: 580, h: 410 }} at={T0 - 4} dur={12} o={{ width: 4, seed: 310 }} />
        <Sketch s={{ k: "line", x1: 540, y1: 880, x2: 540, y2: 1290 }} at={T0 + 4} dur={8} o={{ width: 3.5, seed: 311 }} />
        <Sketch s={{ k: "line", x1: 250, y1: 960, x2: 830, y2: 960 }} at={T0 + 6} dur={8} o={{ width: 3.5, seed: 312 }} />
      </Layer>
      <WriteAt x={395} y={920} at={T0 + 2} size={42} color={nb.blue} font="body" cps={40} pencil={false}>
        size (feature)
      </WriteAt>
      <WriteAt x={685} y={920} at={T0 + 6} size={42} color={nb.red} font="body" cps={40} pencil={false}>
        price (label)
      </WriteAt>
      {ROWS.map(([a, b], i) => (
        <React.Fragment key={a}>
          <WriteAt x={395} y={1010 + i * 64} at={T0 + 10 + i * 6} size={46} font="body" cps={60} pencil={false}>
            {a}
          </WriteAt>
          <WriteAt x={685} y={1010 + i * 64} at={T0 + 12 + i * 6} size={46} font="body" cps={60} pencil={false}>
            {b}
          </WriteAt>
        </React.Fragment>
      ))}
      <WriteAt x={395} y={1240} at={T0 + 30} size={50} color={nb.ink} font="body" cps={60} pencil={false}>
        1,500
      </WriteAt>
      <WriteAt x={685} y={1240} at={LAB + 4} size={58} color={nb.green} cps={30}>
        $275k
      </WriteAt>
    </AbsoluteFill>
  );
};
