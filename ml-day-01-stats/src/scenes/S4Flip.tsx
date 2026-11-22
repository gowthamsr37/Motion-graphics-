// SCENE 4 — MACHINE LEARNING FLIPS IT. Thousands of emails (envelopes) each get a label sticker (SPAM / NOT SPAM); an
// arrow feeds them to the robot ("learning…"), which writes out the RULES it found on a sticky (weird spelling · lots
// of $$$ · unknown sender). Bottom: the two lines side by side, Normal: data + rules → answers vs ML: data + answers →
// RULES (circled, highlighted).
import React from "react";
import { AbsoluteFill } from "remotion";
import { Envelope, Robot } from "../components/Doodles";
import { Arrow, CircleAround, Header, Hi, Layer, Stamp, Sticky, Write, WriteAt } from "../components/NB";
import { hand, nb } from "../theme";
import { useScene } from "../timing";

export const S4Flip: React.FC = () => {
  const s = useScene("s4");
  const THOU = s.cueS(1, "thousands");
  const LAB = s.cueS(1, "labelled:");
  const NOT = s.cueS(1, "not");
  const SELF = s.sent(2).from;
  const ITS = s.cueS(2, "itself.");
  const R1 = s.sent(3).from;
  const OUT = s.cueS(3, "out.");
  return (
    <AbsoluteFill>
      <Header text="machine learning flips it" at={2} color={nb.red} />
      <Layer>
        {[0, 1, 2].map((i) => (
          <Envelope key={i} x={230 + i * 14} y={470 + i * 105} s={150} at={THOU - 8 + i * 5} />
        ))}
      </Layer>
      <Stamp x={330} y={455} at={LAB} size={26} rot={-10}>
        SPAM
      </Stamp>
      <Stamp x={350} y={562} at={NOT} size={26} rot={6} color={nb.green}>
        NOT SPAM
      </Stamp>
      <Stamp x={360} y={668} at={NOT + 8} size={26} rot={-6}>
        SPAM
      </Stamp>
      <WriteAt x={240} y={760} at={THOU + 4} size={36} color={nb.pencil} font="body" cps={40} pencil={false}>
        x 10,000 emails
      </WriteAt>
      <Layer>
        <Arrow x1={420} y1={560} x2={488} y2={560} bend={0.1} at={SELF - 10} dur={8} />
        <Robot x={590} y={555} s={190} at={SELF - 6} />
        <Arrow x1={695} y1={560} x2={752} y2={560} bend={-0.1} at={ITS - 4} dur={8} />
      </Layer>
      <WriteAt x={590} y={690} at={SELF + 6} size={40} color={nb.purple} font="body" cps={18} pencil={false}>
        learning...
      </WriteAt>
      <Sticky x={880} y={575} w={290} h={330} at={ITS - 2} rot={3} color={nb.stickyGreen}>
        <div style={{ fontFamily: hand.title, fontWeight: 700, fontSize: 50, color: nb.green, lineHeight: 1 }}>rules it found</div>
        <div style={{ fontFamily: hand.body, fontSize: 32, color: nb.ink, lineHeight: 1.35, textAlign: "left", marginTop: 10 }}>
          • weird spelling
          <br />• lots of cash
          <br />• unknown sender
          <br />• &quot;URGENT!!!&quot;
        </div>
      </Sticky>
      {/* side by side */}
      <WriteAt x={160} y={1020} align="left" at={R1 - 8} size={44} color={nb.pencil} font="body" cps={60} pencil={false}>
        Normal:
      </WriteAt>
      <WriteAt x={480} y={1020} at={R1 - 6} size={56} color={nb.pencil} cps={60} pencil={false}>
        data + rules
      </WriteAt>
      <WriteAt x={860} y={1020} at={R1} size={56} color={nb.pencil} cps={60} pencil={false}>
        answers
      </WriteAt>
      <WriteAt x={160} y={1170} align="left" at={R1 + 4} size={48} color={nb.red} font="body" cps={60} pencil={false}>
        ML:
      </WriteAt>
      <div style={{ position: "absolute", left: 480, top: 1170, transform: "translate(-50%, -50%)" }}>
        <Write at={R1 + 6} size={64} cps={40}>
          data + answers
        </Write>
      </div>
      <div style={{ position: "absolute", left: 860, top: 1170, transform: "translate(-50%, -50%)" }}>
        <Hi at={OUT - 4}>
          <Write at={OUT - 14} size={78} color={nb.red} cps={30}>
            RULES!
          </Write>
        </Hi>
      </div>
      <Layer>
        <Arrow x1={640} y1={1022} x2={735} y2={1022} bend={0} at={R1 - 2} dur={6} o={{ color: nb.pencil }} />
        <Arrow x1={660} y1={1172} x2={745} y2={1172} bend={0} at={OUT - 18} dur={6} />
        <CircleAround x={862} y={1170} w={260} h={120} at={OUT + 4} />
      </Layer>
    </AbsoluteFill>
  );
};
