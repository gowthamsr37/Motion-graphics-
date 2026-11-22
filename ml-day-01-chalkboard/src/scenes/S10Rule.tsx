// SCENE 10 — REMEMBER THIS. Two sticky notes side by side: NORMAL PROGRAMMING (person doodle · WE write the rules) vs
// MACHINE LEARNING (robot doodle · the MACHINE learns the rules from data); then the save moment: a SAVE THIS bookmark
// and a paper plane flying off with a dashed trail, "send it to a friend".
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Person, Plane, Robot } from "../components/Doodles";
import { Header, Hi, Layer, Sketch, Sticky, WriteAt } from "../components/NB";
import { ease } from "../components/Motion";
import { hand, nb } from "../theme";
import { useScene } from "../timing";

export const S10Rule: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s10");
  const NOR = s.cueS(0, "normal");
  const MAC = s.cueS(0, "machine", 1);
  const SAVE = s.cueS(1, "Save");
  const SEND = s.cueS(1, "send");
  const fly = ease(frame, [SEND - 4, SEND + 30], [0, 1]);
  const px = interpolate(fly, [0, 1], [560, 930]);
  const py = interpolate(fly, [0, 1], [1210, 1060]) - Math.sin(fly * Math.PI) * 40;
  return (
    <AbsoluteFill>
      <Header text="remember this" at={s.sent(0).from - 4} color={nb.red} />
      <Sticky x={295} y={640} w={410} h={500} at={NOR - 6} rot={-3} color={nb.stickyPink}>
        <svg width={170} height={170} viewBox="0 0 170 170" style={{ overflow: "visible" }}>
          <Person x={85} y={85} s={160} at={NOR} />
        </svg>
        <div style={{ fontFamily: hand.body, fontSize: 36, color: nb.pencil, marginTop: 6 }}>normal programming</div>
        <div style={{ fontFamily: hand.title, fontWeight: 700, fontSize: 64, color: nb.ink, lineHeight: 1 }}>
          <span style={{ color: nb.red }}>WE</span> write
          <br />
          the rules
        </div>
      </Sticky>
      <WriteAt x={540} y={650} at={MAC - 10} size={70} color={nb.pencil} cps={20} pencil={false}>
        vs
      </WriteAt>
      <Sticky x={790} y={650} w={410} h={500} at={MAC - 6} rot={3} color={nb.stickyBlue}>
        <svg width={170} height={170} viewBox="0 0 170 170" style={{ overflow: "visible" }}>
          <Robot x={85} y={85} s={160} at={MAC} />
        </svg>
        <div style={{ fontFamily: hand.body, fontSize: 36, color: nb.pencil, marginTop: 6 }}>machine learning</div>
        <div style={{ fontFamily: hand.title, fontWeight: 700, fontSize: 60, color: nb.ink, lineHeight: 1 }}>
          the <Hi at={MAC + 16}>MACHINE</Hi>
          <br />
          learns the rules
        </div>
      </Sticky>
      {/* save moment */}
      <Layer>
        <Sketch s={{ k: "poly", pts: [[190, 1060], [260, 1060], [260, 1210], [225, 1180], [190, 1210]] }} at={SAVE - 6} dur={10} o={{ color: nb.ink, width: 4, fill: nb.red, fillStyle: "hachure", hachureGap: 7, seed: 601 }} />
        {fly > 0 ? <path d={`M560 1210 Q${(560 + px) / 2} ${Math.min(1210, py) - 50} ${px} ${py}`} fill="none" stroke={nb.pencil} strokeWidth={3} strokeDasharray="8 10" /> : null}
        <Plane x={px} y={py} s={110} at={SEND - 10} />
      </Layer>
      <WriteAt x={290} y={1130} align="left" at={SAVE - 2} size={66} color={nb.red} cps={30}>
        save this
      </WriteAt>
      <WriteAt x={760} y={1260} at={SEND + 6} size={44} color={nb.blue} font="body" cps={40} pencil={false}>
        send it to a friend
      </WriteAt>
    </AbsoluteFill>
  );
};
