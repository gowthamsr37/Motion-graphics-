// SCENE 3 — DISCRETE: A DICE. Six outcomes, 1/6 each → six equal bars → a DISCRETE UNIFORM distribution.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { SceneTitle } from "../components/Kit";
import { ease, exitP, Pop, useSpr } from "../components/Motion";
import { Pill } from "../components/Nodes";
import { Die } from "../components/Prob";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";
import { DISC } from "./S1Hook";

const C = theme.colors;
const FX = (i: number) => 540 + (i - 2.5) * 140;
const BASE = 1100;

export const S3Dice: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s3");
  const SIX = s.cueS(1, "Six");
  const ONE6 = s.cueS(1, "6.");
  const EQUAL = s.sent(2).from;
  const DISCW = s.cueS(2, "discrete");
  const roll = frame < SIX - 10;
  const dieOut = exitP(frame, SIX - 6, 10);
  const grow = ease(frame, [SIX + 4, SIX + 22], [0, 1], theme.ease.out);

  return (
    <AbsoluteFill>
      <SceneTitle label="DISCRETE · A FAIR DICE" color={DISC} at={2} />
      {dieOut < 1 ? (
        <div style={{ position: "absolute", left: 540, top: 760 - (roll ? Math.abs(Math.sin(frame / 5)) * 70 : 0), transform: `translate(-50%, -50%) rotate(${roll ? frame * 12 : 0}deg) scale(${spr(4, theme.spring.bouncy) * (1 - dieOut * 0.4)})`, opacity: 1 - dieOut }}>
          <Die value={roll ? 1 + (Math.floor(frame / 3) * 5) % 6 : 6} size={220} color={DISC} glow={0.7} />
        </div>
      ) : null}
      <div style={{ position: "absolute", left: 110, top: BASE, width: 860 * ease(frame, [SIX - 4, SIX + 8], [0, 1]), height: 4, borderRadius: 2, background: alpha(C.text, 0.4) }} />
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const p = spr(SIX - 2 + i * 4, theme.spring.bouncy);
        if (p <= 0.001) return null;
        const chip = spr(ONE6 - 2 + i * 3, theme.spring.pop);
        const h = 300 * grow;
        return (
          <React.Fragment key={i}>
            <div style={{ position: "absolute", left: FX(i) - 56, top: BASE - h, width: 112, height: h, boxSizing: "border-box", borderRadius: "16px 16px 4px 4px", background: `linear-gradient(180deg, ${alpha(DISC, 0.7)}, ${alpha(DISC, 0.25)})`, border: `3px solid ${DISC}`, boxShadow: `0 0 16px ${alpha(DISC, 0.35)}` }} />
            <div style={{ position: "absolute", left: FX(i), top: BASE + 66, transform: `translate(-50%, -50%) scale(${interpolate(p, [0, 1], [0.4, 1])}) rotate(${(1 - p) * 90}deg)`, opacity: Math.min(1, p * 2) }}>
              <Die value={i + 1} size={88} color={DISC} />
            </div>
            {chip > 0.01 ? <div style={{ position: "absolute", left: FX(i), top: BASE - h - 36, transform: `translate(-50%, -50%) scale(${interpolate(chip, [0, 1], [0.5, 1])})`, opacity: Math.min(1, chip * 2), fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 38, color: C.text, whiteSpace: "nowrap" }}>1/6</div> : null}
          </React.Fragment>
        );
      })}
      <Pop at={EQUAL - 2} x={540} y={520} from="up" dist={16} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 56, color: C.text, whiteSpace: "nowrap" }}>SIX EQUAL BARS</div>
      </Pop>
      <Pop at={DISCW - 4} x={540} y={620} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
        <Pill label="DISCRETE UNIFORM" color={DISC} size={38} glow={0.8} />
      </Pop>
    </AbsoluteFill>
  );
};
