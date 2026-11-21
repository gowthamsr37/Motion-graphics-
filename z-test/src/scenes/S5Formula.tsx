// SCENE 5 — STEP 3, THE FORMULA. z = (x̄ − µ) / (σ / √n) builds big; the top glows with x̄ SAMPLE MEAN · µ CLAIMED MEAN
// → HOW FAR OFF; the bottom glows with σ POPULATION SD · n SAMPLE SIZE → STANDARD ERROR; then the one-line meaning.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { ease, Pop } from "../components/Motion";
import { Tag } from "../components/Nodes";
import { CLAIM, Formula, MEAN, SE, Sigma, StepTracker, TAIL, XBar } from "../components/ZKit";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

const Legend: React.FC<{ at: number; y: number; items: { sym: React.ReactNode; t: string; c: string }[]; result: string; rc: string }> = ({ at, y, items, result, rc }) => (
  <Pop at={at} x={540} y={y} from="up" dist={14} cfg={theme.spring.bouncy}>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <div style={{ display: "flex", gap: 22 }}>
        {items.map((k, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 22px", borderRadius: 999, background: alpha(k.c, 0.16), border: `2px solid ${k.c}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: C.text, whiteSpace: "nowrap" }}>
            <span style={{ fontSize: 40, color: k.c, display: "flex" }}>{k.sym}</span>
            {k.t}
          </div>
        ))}
      </div>
      <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 38, color: rc, whiteSpace: "nowrap" }}>= {result}</div>
    </div>
  </Pop>
);

export const S5Formula: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s5");
  const F = s.cueS(0, "z");
  const TOP = s.sent(1).from;
  const BOT = s.sent(2).from;
  const hiTop = ease(frame, [TOP - 6, TOP + 6], [0, 1]) * (1 - ease(frame, [BOT - 6, BOT + 4], [0, 0.7]));
  const hiBot = ease(frame, [BOT - 6, BOT + 6], [0, 1]);
  return (
    <AbsoluteFill>
      <StepTracker active={2} />
      <Pop at={F - 4} x={540} y={560} from="scale" scaleFrom={0.6} cfg={theme.spring.pop}>
        <Formula size={96} hiTop={hiTop} hiBot={hiBot} />
      </Pop>
      <Legend at={TOP - 4} y={830} items={[{ sym: <XBar color={MEAN} />, t: "SAMPLE MEAN", c: MEAN }, { sym: "µ", t: "CLAIMED MEAN", c: CLAIM }]} result="HOW FAR OFF WE ARE" rc={MEAN} />
      <Legend at={BOT - 4} y={1020} items={[{ sym: <Sigma size={40} color={SE} />, t: "POPULATION SD", c: SE }, { sym: "n", t: "SAMPLE SIZE", c: C.text }]} result="STANDARD ERROR (THE WOBBLE)" rc={SE} />
      <Pop at={s.sent(2).to + 4} x={540} y={1190} from="up" dist={14} cfg={theme.spring.bouncy}>
        <Tag color={TAIL} size={32}>
          z = HOW MANY STANDARD ERRORS FROM THE CLAIM
        </Tag>
      </Pop>
    </AbsoluteFill>
  );
};
