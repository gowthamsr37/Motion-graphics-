// SCENE 3 — THE ANSWER: "50-50?" (most people) struck out; SWITCH WINS 2/3 huge, STICK 1/3; "switching doubles your
// chance"; 1990 newspaper card: Marilyn vos Savant · thousands of letters "YOU'RE WRONG" (some from PhDs) → SHE WAS RIGHT.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { HOT } from "../components/Doors";
import { Panel, Pill, Pop, Txt } from "../components/L";
import { ease } from "../components/Motion";
import { glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

export const S3Answer: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s3");
  const FF = s.cueS(0, "50-50.");
  const W = s.sent(1).from;
  const DBL = s.cueS(1, "doubles");
  const P90 = s.sent(2).from;
  const WRONG = s.cueS(2, "wrong.");
  const RIGHT = s.cueS(2, "right.");
  const top = 1 - ease(frame, [P90 - 8, P90], [0, 1]);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", inset: 0, opacity: top }}>
        <Pop x={540} y={300} at={FF - 8}>
          <div style={{ position: "relative" }}>
            <Txt size={80}>&quot;50-50&quot;</Txt>
            <div style={{ position: "absolute", left: -12, right: -12, top: "52%", height: 9, borderRadius: 5, background: C.red, transform: `scaleX(${ease(frame, [W - 2, W + 8], [0, 1])}) rotate(-5deg)`, transformOrigin: "left center" }} />
          </div>
        </Pop>
        <div style={{ position: "absolute", left: 0, right: 0, top: 440, display: "flex", justifyContent: "center", gap: 40 }}>
          <div style={{ opacity: ease(frame, [W + 4, W + 12], [0, 1]) }}>
            <Panel w={420} h={420} color={C.cyan}>
              <Txt size={40} color={C.cyan}>STICK</Txt>
              <Txt size={150} glow color={C.cyan}>1/3</Txt>
            </Panel>
          </div>
          <div style={{ opacity: ease(frame, [W + 10, W + 18], [0, 1]), transform: `scale(${1 + ease(frame, [DBL, DBL + 10], [0, 0.08])})` }}>
            <Panel w={420} h={420} color={HOT}>
              <Txt size={40} color={HOT}>SWITCH</Txt>
              <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 150, color: HOT, textShadow: glowText(HOT, 0.8) }}>2/3</div>
            </Panel>
          </div>
        </div>
        <Pop x={540} y={1000} at={DBL - 4}>
          <Pill color={HOT} size={46} solid>SWITCHING DOUBLES YOUR CHANCE</Pill>
        </Pop>
      </div>
      {frame >= P90 - 8 ? (
        <AbsoluteFill style={{ opacity: 1 - top }}>
          <Pop x={540} y={480} at={P90}>
            <div style={{ width: 860, padding: "30px 40px", boxSizing: "border-box", borderRadius: 14, background: "#EDE4CF", transform: "rotate(-2deg)", boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}>
              <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: "#5B4A2A", letterSpacing: "0.2em" }}>NEWSPAPER · 1990</div>
              <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 56, color: "#1F1A10", marginTop: 8 }}>&quot;Yes, you should switch.&quot;</div>
              <div style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 30, color: "#3B3220", marginTop: 8 }}>— Marilyn vos Savant</div>
            </div>
          </Pop>
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const t = ease(frame, [WRONG - 30 + i * 5, WRONG - 18 + i * 5], [0, 1]);
            return t > 0 ? (
              <div key={i} style={{ position: "absolute", left: 120 + (i % 3) * 300, top: 760 + Math.floor(i / 3) * 140, opacity: t, transform: `rotate(${(i % 2 ? 6 : -6)}deg) scale(${0.7 + 0.3 * t})`, padding: "16px 24px", background: "#FFFFFF", borderRadius: 8, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: C.red, whiteSpace: "nowrap" }}>{["YOU'RE WRONG!", "IT'S 50-50!", "— a PhD", "WRONG!!", "SHAME!", "IT'S 1/2!"][i]}</div>
            ) : null;
          })}
          <Pop x={540} y={1150} at={s.cueS(2, "thousands") - 2}>
            <Txt size={38} font="body">thousands of angry letters</Txt>
          </Pop>
          <Pop x={540} y={1260} at={RIGHT - 4}>
            <Pill color={C.green} size={50} solid>SHE WAS RIGHT</Pill>
          </Pop>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
