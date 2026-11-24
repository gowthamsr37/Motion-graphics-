// SCENE 3 — THE ANSWER: guesses "99%?" "90%?" struck out; ABOUT 9% huge; "9 out of 10+ positives are false alarms" with a
// row of 11 figures, only 1 red.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Guy, HOT } from "../components/BKit";
import { FALSE, SICK } from "../components/People";
import { Pop, Txt } from "../components/L";
import { ease } from "../components/Motion";
import { glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

const Struck: React.FC<{ at: number; t: string }> = ({ at, t }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "relative" }}>
      <Txt size={70} color={C.dim}>{t}</Txt>
      <div style={{ position: "absolute", left: -8, right: -8, top: "52%", height: 8, borderRadius: 4, background: C.red, transform: `scaleX(${ease(frame, [at, at + 8], [0, 1])}) rotate(-6deg)`, transformOrigin: "left center" }} />
    </div>
  );
};

export const S3Answer: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s3");
  const A = s.sent(1).from;
  const NINE = s.cueS(1, "9%.");
  const FA = s.cueS(1, "false");
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 260, display: "flex", justifyContent: "center", gap: 60 }}>
        <Pop x={0} y={0} at={s.cueS(0, "99%.") - 4} anchor="left" style={{ position: "relative", transform: "none" }}><Struck at={A} t="99%?" /></Pop>
        <Pop x={0} y={0} at={s.cueS(0, "90.") - 4} anchor="left" style={{ position: "relative", transform: "none" }}><Struck at={A + 4} t="90%?" /></Pop>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 440, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, color: HOT, textShadow: glowText(HOT, 0.8), opacity: ease(frame, [NINE - 6, NINE + 2], [0, 1]), transform: `scale(${ease(frame, [NINE - 6, NINE + 4], [1.3, 1])})` }}>
        <div style={{ fontSize: 60, color: C.text, textShadow: "none" }}>ABOUT</div>
        <div style={{ fontSize: 260, lineHeight: 1 }}>9%</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 900, display: "flex", justifyContent: "center", gap: 10, opacity: ease(frame, [FA - 8, FA], [0, 1]) }}>
        {Array.from({ length: 11 }, (_, i) => (
          <Guy key={i} size={64} color={i === 0 ? SICK : FALSE} />
        ))}
      </div>
      <Pop x={540} y={1110} at={FA - 2}>
        <Txt size={46}>
          most positives are <span style={{ color: FALSE }}>false alarms</span>
        </Txt>
      </Pop>
    </AbsoluteFill>
  );
};
