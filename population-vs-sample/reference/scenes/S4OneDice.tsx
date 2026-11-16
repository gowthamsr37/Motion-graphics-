// SCENE 4 — DISCRETE: ONE DICE. Six faces, 1/6 each. Drawn as bars, the heights are the probabilities.
// Then all six bars fly into one stack: 6 × 1/6 = 1.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { SceneTitle } from "../components/Kit";
import { ease, Pop, useSpr } from "../components/Motion";
import { Tag } from "../components/Nodes";
import { Die } from "../components/Prob";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { DISC, PROB } from "./S1Hook";

const C = theme.colors;
const FX = (i: number) => 540 + (i - 2.5) * 140;
const BASE = 1100;
const H1 = 100; // the height of probability 1/6

export const S4OneDice: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s4");
  const SIX = s.cueS(0, "6");
  const ONE6 = s.cueS(0, "6", 1);
  const BARS = s.cueS(1, "bars,");
  const HEIGHTS = s.cueS(1, "heights");
  const STACK = s.cueS(2, "Stack");
  const ONE = s.cueS(2, "1.");
  const grow = ease(frame, [BARS - 4, BARS + 14], [0, 1], theme.ease.inOut);
  const stackT = (i: number) => ease(frame, [STACK - 4 + i * 5, STACK + 12 + i * 5], [0, 1], theme.ease.inOut);
  const faceOut = ease(frame, [STACK - 6, STACK + 6], [0, 1]);

  return (
    <AbsoluteFill>
      <SceneTitle label="DISCRETE · ONE DICE" color={DISC} at={2} />
      <Pop at={HEIGHTS - 4} out={STACK - 6} x={540} y={430} from="up" dist={16} cfg={theme.spring.bouncy}>
        <Tag color={PROB} size={34}>BAR HEIGHT = PROBABILITY</Tag>
      </Pop>
      <div style={{ position: "absolute", left: 120, top: BASE, width: 840, height: 4, borderRadius: 2, background: alpha(C.text, 0.4), opacity: ease(frame, [4, 14], [0, 1]) }} />
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const p = spr(SIX - 8 + i * 4, theme.spring.bouncy);
        const chip = spr(ONE6 - 2 + i * 3, theme.spring.pop);
        const st = stackT(i);
        const h = H1 * grow;
        const x = interpolate(st, [0, 1], [FX(i), 540]);
        const bottom = interpolate(st, [0, 1], [BASE, BASE - i * H1]);
        return (
          <React.Fragment key={i}>
            {grow > 0.01 ? (
              <div style={{ position: "absolute", left: x - 56, top: bottom - h, width: 112, height: h, boxSizing: "border-box", borderRadius: 14, background: `linear-gradient(180deg, ${alpha(DISC, 0.75)}, ${alpha(DISC, 0.3)})`, border: `3px solid ${DISC}`, boxShadow: `0 0 16px ${alpha(DISC, 0.35)}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 26, color: C.ink }}>
                {st > 0.5 ? i + 1 : ""}
              </div>
            ) : null}
            {p > 0.001 ? (
              <div style={{ position: "absolute", left: FX(i), top: BASE + 66, transform: `translate(-50%, -50%) scale(${interpolate(p, [0, 1], [0.4, 1])}) rotate(${(1 - p) * 90}deg)`, opacity: Math.min(1, p * 2) * (1 - faceOut * 0.6) }}>
                <Die value={i + 1} size={86} color={DISC} />
              </div>
            ) : null}
            {chip > 0.01 ? (
              <div style={{ position: "absolute", left: FX(i), top: BASE - h - 36, transform: `translate(-50%, -50%) scale(${interpolate(chip, [0, 1], [0.5, 1])})`, opacity: Math.min(1, chip * 2) * (1 - ease(frame, [STACK - 6, STACK + 2], [0, 1])), fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 38, color: C.text, whiteSpace: "nowrap" }}>1/6</div>
            ) : null}
          </React.Fragment>
        );
      })}
      {/* the stack reaches 1 */}
      <Pop at={STACK + 20} x={260} y={BASE - 3 * H1} from="right" dist={20}>
        <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 44, color: C.dim, whiteSpace: "nowrap" }}>6 × 1/6</div>
      </Pop>
      {(() => {
        const p = spr(ONE - 3, theme.spring.pop);
        if (p <= 0.001) return null;
        return (
          <div style={{ position: "absolute", left: 820, top: BASE - 3 * H1, transform: `translate(-50%, -50%) scale(${interpolate(p, [0, 1], [1.8, 1])})`, opacity: Math.min(1, p * 2), fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 110, color: PROB, textShadow: glowText(PROB, 0.8), whiteSpace: "nowrap" }}>= 1</div>
        );
      })()}
      {frame >= ONE - 4 ? <div style={{ position: "absolute", left: 470, top: BASE - 6 * H1 - 14, width: 140, height: 0, borderTop: `4px dashed ${PROB}`, opacity: ease(frame, [ONE - 4, ONE + 6], [0, 1]) }} /> : null}
    </AbsoluteFill>
  );
};
