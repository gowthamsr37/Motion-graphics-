// SCENE 3 — THE TINY EDGE. The wheel (37 pockets); counters 18 RED · 18 BLACK · 1 GREEN pop on their words; the
// probability bar: red 48.6% (you) vs house 51.4%; the green zero glows and HOUSE EDGE 2.7% lands; then
// "every Rs 100 bet → the casino keeps Rs 2.70" with a chip.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Chip, FELT, RED, Wheel } from "../components/Casino";
import { Pill, Pop, Txt } from "../components/L";
import { ease } from "../components/Motion";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

export const S3Edge: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s3");
  const cnt = [s.cueS(0, "18", 0), s.cueS(0, "18", 1), s.cueS(0, "green")];
  const BET = s.sent(1).from;
  const P486 = s.cueS(1, "48.6%");
  const HOUSE = s.cueS(2, "51.4%.");
  const ZERO = s.cueS(2, "zero");
  const EDGE = s.cueS(2, "edge");
  const RS = s.sent(3).from;
  const keep = s.cueS(3, "keeps");
  const glow = ease(frame, [ZERO - 4, ZERO + 6], [0, 1]);
  const spinStop = ease(frame, [0, 60], [0, 1]);
  const rot = 60 * spinStop + 40 * (1 - Math.pow(1 - spinStop, 3));
  const bar = ease(frame, [BET, BET + 18], [0, 1]);
  return (
    <AbsoluteFill>
      <Pop x={540} y={480} at={s.sent(0).from - 6}>
        <Wheel r={210} rot={rot} zeroGlow={glow} />
      </Pop>
      <div style={{ position: "absolute", left: 0, right: 0, top: 740, display: "flex", justifyContent: "center", gap: 22 }}>
        {[
          { n: "18", t: "RED", c: RED },
          { n: "18", t: "BLACK", c: "#E5E7EB" },
          { n: "1", t: "GREEN", c: FELT },
        ].map((k, i) => (
          <div key={k.t} style={{ opacity: ease(frame, [cnt[i] - 4, cnt[i] + 4], [0, 1]), transform: `scale(${ease(frame, [cnt[i] - 4, cnt[i] + 6], [0.6, 1])})`, display: "flex", alignItems: "center", gap: 12, padding: "10px 24px", borderRadius: 18, background: "rgba(14,24,64,0.9)", border: `3px solid ${k.c}` }}>
            <span style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 54, color: C.text }}>{k.n}</span>
            <span style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: k.c === "#E5E7EB" ? C.text : k.c }}>{k.t}</span>
          </div>
        ))}
      </div>
      {/* the bar */}
      <div style={{ position: "absolute", left: 90, top: 880, width: 900, opacity: bar }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 34, color: C.text, marginBottom: 10 }}>
          <span style={{ opacity: ease(frame, [P486 - 4, P486 + 4], [0, 1]) }}>YOU WIN <span style={{ color: RED }}>48.6%</span></span>
          <span style={{ opacity: ease(frame, [HOUSE - 4, HOUSE + 4], [0, 1]) }}>HOUSE <span style={{ color: C.green }}>51.4%</span></span>
        </div>
        <div style={{ display: "flex", height: 54, borderRadius: 14, overflow: "hidden", border: `3px solid ${alpha(C.text, 0.35)}` }}>
          <div style={{ width: `${48.6 * bar}%`, background: RED }} />
          <div style={{ flex: 1, background: alpha(C.green, 0.55) }} />
        </div>
      </div>
      <Pop x={540} y={1110} at={EDGE - 4}>
        <Pill color={C.green} size={54} solid>HOUSE EDGE 2.7%</Pill>
      </Pop>
      <Pop x={540} y={1280} at={RS - 2}>
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <Chip size={90} label="100" />
          <Txt size={42}>
            every Rs 100 → casino keeps <span style={{ color: C.green, opacity: ease(frame, [keep, keep + 8], [0, 1]) }}>Rs 2.70</span>
          </Txt>
        </div>
      </Pop>
    </AbsoluteFill>
  );
};
