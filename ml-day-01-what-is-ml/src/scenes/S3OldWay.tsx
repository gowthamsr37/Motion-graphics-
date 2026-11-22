// SCENE 3 — THE OLD WAY (traditional programming). A programmer doodle writes RULE #1 on a sticky (IF email says "free
// money" THEN mark it SPAM); the classic diagram sketches on: DATA + RULES → computer → ANSWERS; then "fr3e m0ney"
// slips past: the rule gets crossed out and a pile of "if…" stickies appears: MILLIONS OF RULES?!
import React from "react";
import { AbsoluteFill } from "remotion";
import { Computer, Person } from "../components/Doodles";
import { Arrow, Cross, Header, Layer, Sketch, Sticky, WriteAt } from "../components/NB";
import { hand, nb } from "../theme";
import { useScene } from "../timing";

export const S3OldWay: React.FC = () => {
  const s = useScene("s3");
  const S0 = s.sent(0).from;
  const RULE = s.cueS(1, "rule:");
  const DIA = s.sent(2).from;
  const ANS = s.cueS(2, "Answers");
  const FR = s.cueS(3, "fr3e");
  const BRK = s.cueS(3, "breaks.");
  const MIL = s.cueS(3, "millions");
  const box = (x: number, w: number, label: string, at: number, c: string, seed: number) => (
    <>
      <Layer>
        <Sketch s={{ k: "rect", x: x - w / 2, y: 790, w, h: 90 }} at={at} dur={8} o={{ color: c, width: 4, seed }} />
      </Layer>
      <WriteAt x={x} y={836} at={at + 4} size={48} color={c} font="body" cps={50} pencil={false}>
        {label}
      </WriteAt>
    </>
  );
  return (
    <AbsoluteFill>
      <Header text="the old way: normal programming" at={2} />
      <Layer>
        <Person x={230} y={510} s={200} at={S0 + 4} />
      </Layer>
      <WriteAt x={230} y={650} at={S0 + 16} size={40} color={nb.pencil} font="body" cps={40} pencil={false}>
        programmer
      </WriteAt>
      <Sticky x={660} y={520} w={560} h={250} at={RULE - 6} rot={2}>
        <div style={{ fontFamily: hand.body, fontSize: 30, color: nb.red, letterSpacing: "0.1em" }}>RULE #1</div>
        <div style={{ fontFamily: hand.body, fontSize: 46, color: nb.ink, lineHeight: 1.15 }}>
          IF email says &quot;free money&quot;
          <br />
          THEN mark it <span style={{ color: nb.red }}>SPAM</span>
        </div>
      </Sticky>
      {/* the classic diagram */}
      {box(230, 170, "DATA", DIA - 4, nb.ink, 101)}
      <WriteAt x={337} y={834} at={DIA + 2} size={60} cps={30} pencil={false}>
        +
      </WriteAt>
      {box(450, 180, "RULES", DIA + 4, nb.red, 102)}
      <Layer>
        <Arrow x1={548} y1={835} x2={598} y2={835} bend={0} at={DIA + 10} dur={6} />
        <Computer x={665} y={830} s={120} at={DIA + 12} />
        <Arrow x1={732} y1={835} x2={782} y2={835} bend={0} at={ANS - 6} dur={6} />
      </Layer>
      {box(885, 190, "ANSWERS", ANS - 2, nb.green, 103)}
      {/* the rule breaks */}
      <Layer>
        <Sketch s={{ k: "rect", x: 150, y: 1050, w: 420, h: 180 }} at={FR - 8} dur={10} o={{ color: nb.ink, width: 3.5, fill: "#FFFFFF", fillStyle: "solid", seed: 104 }} />
      </Layer>
      <WriteAt x={175} y={1095} align="left" at={FR - 4} size={36} color={nb.pencil} font="body" cps={60} pencil={false}>
        From: totally.legit@win.biz
      </WriteAt>
      <WriteAt x={360} y={1170} at={FR} size={72} color={nb.ink} cps={30}>
        fr3e m0ney!!!
      </WriteAt>
      <Layer>
        <Cross x={660} y={520} s={200} at={BRK - 4} />
      </Layer>
      <WriteAt x={360} y={1278} at={BRK} size={44} color={nb.red} font="body" cps={40} pencil={false}>
        rule broken. straight to inbox.
      </WriteAt>
      {[0, 1, 2, 3, 4].map((i) => (
        <Sticky key={i} x={760 + (i % 3) * 80} y={1090 + Math.floor(i / 3) * 90 + (i % 2) * 14} w={150} h={110} at={MIL - 6 + i * 3} rot={[-8, 6, -3, 9, -5][i]} tape={false} color={[nb.sticky, nb.stickyPink, nb.stickyBlue, nb.stickyGreen, nb.sticky][i]}>
          <div style={{ fontFamily: hand.body, fontSize: 30, color: nb.ink }}>IF ...</div>
        </Sticky>
      ))}
      <WriteAt x={840} y={1290} at={MIL + 12} size={54} color={nb.red} cps={34} rot={-3}>
        millions of rules?!
      </WriteAt>
    </AbsoluteFill>
  );
};
