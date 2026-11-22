// SCENE 5 — THE TEXTBOOK DEFINITION on an index card, written line by line as it is spoken ("learn patterns from data"
// in yellow marker, "explicitly programmed" in pink); then Arthur Samuel's 1959 line on a taped sticky note.
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Header, Hi, WriteAt } from "../components/NB";
import { useSpr } from "../components/Motion";
import { hand, nb, theme } from "../theme";
import { Sticky } from "../components/NB";
import { useScene } from "../timing";

const Card: React.FC<{ at: number }> = ({ at }) => {
  const spr = useSpr();
  const p = spr(at, theme.spring.snappy);
  if (p <= 0.001) return null;
  const k = Math.min(1, p);
  return (
    <div style={{ position: "absolute", left: 540, top: 650, width: 900, height: 500, transform: `translate(-50%, -50%) rotate(${-1 + (1 - k) * 6}deg) scale(${interpolate(k, [0, 1], [1.15, 1])})`, opacity: Math.min(1, p * 2), background: "#FFFFFF", boxShadow: "0 22px 40px -18px rgba(60,40,10,0.5)", borderRadius: 6, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, top: 120, backgroundImage: `repeating-linear-gradient(to bottom, transparent 0 76px, ${nb.rule} 76px 78px)` }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 96, height: 3, background: nb.margin }} />
      <div style={{ position: "absolute", left: 30, top: 26, fontFamily: hand.body, fontSize: 40, color: nb.blue, letterSpacing: "0.06em" }}>MACHINE LEARNING (n.)</div>
    </div>
  );
};

export const S5Define: React.FC = () => {
  const s = useScene("s5");
  const S0 = s.sent(0).from;
  const L = [s.sent(1).from, s.cueS(1, "artificial"), s.cueS(1, "computers"), s.cueS(1, "instead")];
  const PAT = s.cueS(1, "patterns");
  const EXP = s.cueS(1, "explicitly");
  const Q = s.sent(2).from;
  const lines: React.ReactNode[] = [
    <>Machine learning is a branch of</>,
    <>artificial intelligence where</>,
    <>
      computers <Hi at={PAT}>learn patterns from data</Hi>,
    </>,
    <>
      instead of being <Hi at={EXP} color={nb.pink}>explicitly programmed.</Hi>
    </>,
  ];
  const chars = [31, 29, 35, 39];
  return (
    <AbsoluteFill>
      <Header text="the textbook definition" at={S0 - 4} />
      <Card at={S0 + 2} />
      {lines.map((ln, i) => (
        <WriteAt key={i} x={130} y={532 + i * 78} align="left" at={L[i] - 2} size={54} font="body" chars={chars[i]} cps={34}>
          {ln}
        </WriteAt>
      ))}
      <Sticky x={560} y={1150} w={820} h={300} at={Q - 4} rot={2}>
        <div style={{ position: "absolute", left: 24, top: -6, fontFamily: hand.title, fontWeight: 700, fontSize: 150, color: nb.orange, opacity: 0.6, lineHeight: 1 }}>&ldquo;</div>
        <div style={{ fontFamily: hand.title, fontWeight: 700, fontSize: 60, color: nb.ink, lineHeight: 1.05, padding: "0 40px" }}>
          the ability to learn without being explicitly programmed.
        </div>
        <div style={{ fontFamily: hand.body, fontSize: 34, color: nb.pencil, marginTop: 12 }}>&mdash; Arthur Samuel, 1959</div>
      </Sticky>
    </AbsoluteFill>
  );
};
