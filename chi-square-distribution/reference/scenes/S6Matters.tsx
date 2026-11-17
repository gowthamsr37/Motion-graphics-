// SCENE 6 — WHAT IT CHANGES. The middle 95%: on the normal curve ±1.96 ("about two steps"); on the t-curve with
// 5 values (df = 4) ±2.78 ("about 2.8 steps") → wider, more honest ranges.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Bracket, FnCurve, type Geo, gx, ValueAxis } from "../components/Curve";
import { SceneTitle } from "../components/Kit";
import { ease, Pop } from "../components/Motion";
import { Tag } from "../components/Nodes";
import { npdf, T95, tpdf, Z95 } from "../components/TDist";
import { glowText, theme } from "../theme";
import { useScene } from "../timing";
import { NC, SAMPLE, TC } from "./S1Hook";

const C = theme.colors;
const G1: Geo = { x0: 150, x1: 930, vmin: -4.5, vmax: 4.5, base: 810, h: 230 };
const G2: Geo = { x0: 150, x1: 930, vmin: -4.5, vmax: 4.5, base: 1170, h: 230 };
const TICKS = [-4, -2, 0, 2, 4].map((v) => ({ v, label: v > 0 ? `+${v}` : `${v}` }));

export const S6Matters: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s6");
  const NORMAL = s.sent(1).from;
  const FIVE = s.sent(2).from;
  const WIDER = s.sent(3).from;
  const b1 = ease(frame, [NORMAL + 4, NORMAL + 26], [0, 1]);
  const b2 = ease(frame, [FIVE + 6, FIVE + 30], [0, 1]);
  return (
    <AbsoluteFill>
      <SceneTitle label="WHY IT MATTERS" color={TC} at={2} />
      <Pop at={6} x={540} y={420} from="up" dist={14} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 44, color: C.text, whiteSpace: "nowrap" }}>
          THE <span style={{ color: SAMPLE, textShadow: glowText(SAMPLE, 0.5) }}>MIDDLE 95%</span>
        </div>
      </Pop>
      <FnCurve g={G1} f={npdf} fmax={0.4} p={ease(frame, [8, 30], [0, 1])} color={NC} fill={0.1} bands={[{ a: -Z95, b: Z95, color: SAMPLE, p: b1, opacity: 0.45 }]} />
      <ValueAxis g={G1} ticks={TICKS} p={ease(frame, [8, 20], [0, 1])} />
      <div style={{ position: "absolute", left: 160, top: 560, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.14em", color: NC }}>NORMAL</div>
      <Bracket x0={gx(G1, -Z95)} x1={gx(G1, Z95)} y={G1.base + 64} p={b1} color={SAMPLE} down size={30} label={<span style={{ fontFamily: theme.fonts.mono }}>±1.96</span>} />
      {frame >= FIVE - 6 ? (
        <>
          <FnCurve g={G2} f={(x) => tpdf(x, 4)} fmax={0.4} p={ease(frame, [FIVE - 6, FIVE + 14], [0, 1])} color={TC} fill={0.12} bands={[{ a: -T95[4], b: T95[4], color: SAMPLE, p: b2, opacity: 0.45 }]} />
          <ValueAxis g={G2} ticks={TICKS} p={ease(frame, [FIVE - 6, FIVE + 6], [0, 1])} />
          <div style={{ position: "absolute", left: 160, top: 920, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.14em", color: TC }}>t-CURVE, 5 VALUES</div>
          <Bracket x0={gx(G2, -T95[4])} x1={gx(G2, T95[4])} y={G2.base + 64} p={b2} color={SAMPLE} down size={30} label={<span style={{ fontFamily: theme.fonts.mono }}>±2.78</span>} />
        </>
      ) : null}
      <Pop at={WIDER - 2} x={540} y={1340} from="up" dist={14} cfg={theme.spring.bouncy}>
        <Tag color={SAMPLE} size={32}>
          SMALL SAMPLE: WIDER, MORE HONEST RANGE
        </Tag>
      </Pop>
    </AbsoluteFill>
  );
};
