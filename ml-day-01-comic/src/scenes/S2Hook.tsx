// SCENE 2 — HOOK: "You've already used ML a dozen times today." 12 tally marks scratch on; four doodles sketch on as they
// are named (face unlock · spam filter · YouTube picks · Maps traffic), each labelled in pen; then a red-pen verdict:
// NO RULES. THEY LEARNED.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Envelope, MapPin, PhoneFace, PlayBtn } from "../components/Doodles";
import { Layer, Sketch, Squiggle, Stamp, WriteAt } from "../components/NB";
import { nb } from "../theme";
import { useScene } from "../timing";

export const S2Hook: React.FC = () => {
  const s = useScene("s2");
  const S0 = s.sent(0).from;
  const DOZ = s.cueS(0, "dozen");
  const cues = [s.cueS(1, "face."), s.cueS(1, "Gmail"), s.cueS(1, "YouTube"), s.cueS(1, "Maps")];
  const NO = s.sent(2).from;
  const LEARN = s.cueS(2, "learned.");
  const tiles = [
    { x: 320, y: 650, label: "Face unlock", Icon: PhoneFace },
    { x: 770, y: 650, label: "Spam filter", Icon: Envelope },
    { x: 320, y: 1000, label: "Video picks", Icon: PlayBtn },
    { x: 770, y: 1000, label: "Live traffic", Icon: MapPin },
  ];
  return (
    <AbsoluteFill>
      <WriteAt x={540} y={270} at={S0 - 4} size={78} cps={40}>
        You used ML today...
      </WriteAt>
      {/* tally: 12 */}
      <Layer>
        {Array.from({ length: 12 }, (_, i) => {
          const grp = Math.floor(i / 5);
          const j = i % 5;
          const x0 = 330 + grp * 170;
          if (j === 4) return <Sketch key={i} s={{ k: "line", x1: x0 - 14, y1: 410, x2: x0 + 92, y2: 356 }} at={DOZ - 6 + i * 2} dur={4} o={{ color: nb.red, width: 5, seed: 80 + i }} />;
          return <Sketch key={i} s={{ k: "line", x1: x0 + j * 24, y1: 350, x2: x0 + j * 24 + 4, y2: 414 }} at={DOZ - 6 + i * 2} dur={3} o={{ color: nb.ink, width: 5, seed: 80 + i }} />;
        })}
      </Layer>
      <WriteAt x={720} y={384} align="left" at={DOZ + 18} size={56} color={nb.red} cps={40} pencil={false}>
        x12
      </WriteAt>
      <Layer>
        {tiles.map((t, i) => (
          <React.Fragment key={t.label}>
            <t.Icon x={t.x} y={t.y - 20} s={230} at={cues[i] - 8} />
          </React.Fragment>
        ))}
      </Layer>
      {tiles.map((t, i) => (
        <WriteAt key={t.label} x={t.x} y={t.y + 130} at={cues[i] + 6} size={50} font="body" cps={40} pencil={false}>
          {t.label}
        </WriteAt>
      ))}
      <Stamp x={850} y={540} at={cues[1] + 14} rot={12} size={34}>
        SPAM
      </Stamp>
      <WriteAt x={540} y={1265} at={NO} size={84} color={nb.red} cps={30}>
        No rules. They learned.
      </WriteAt>
      <Layer>
        <Squiggle x={310} y={1325} w={460} at={LEARN} color={nb.red} />
      </Layer>
    </AbsoluteFill>
  );
};
