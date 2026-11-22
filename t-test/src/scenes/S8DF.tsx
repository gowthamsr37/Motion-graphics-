// SCENE 8 — DEGREES OF FREEDOM. df = nA + nB − 2 = 5 + 5 − 2 = 8; then the normal curve (dashed) and the t(8) curve:
// FATTER TAILS, cut-off 1.96 → 2.306.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FnCurve, gx, ValueAxis } from "../components/Curve";
import { ease, Pop } from "../components/Motion";
import { npdf } from "../components/TDist";
import { BB, StepTracker, TAIL, tf, TFMAX, tGeo } from "../components/TKit";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const G = tGeo(1130, 380);
const Sub: React.FC<{ children: React.ReactNode }> = ({ children }) => <sub style={{ fontSize: "0.5em", verticalAlign: "-0.25em" }}>{children}</sub>;

export const S8DF: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s8");
  const EIGHT = s.cueS(0, "8.");
  const FAT = s.cueS(1, "fatter");
  const BIG = s.cueS(1, "bigger");
  const draw = ease(frame, [s.sent(1).from - 4, s.sent(1).from + 24], [0, 1], theme.ease.inOut);
  return (
    <AbsoluteFill>
      <StepTracker active={3} />
      <Pop at={s.cueS(0, "degrees") - 4} x={540} y={430} from="up" dist={12}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.2em", color: C.dim, whiteSpace: "nowrap" }}>DEGREES OF FREEDOM</div>
      </Pop>
      <Pop at={s.cueS(0, "degrees")} x={540} y={520} from="scale" scaleFrom={0.6} cfg={theme.spring.pop}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 60, color: C.text, whiteSpace: "nowrap" }}>
          = n<Sub>A</Sub> + n<Sub>B</Sub> − 2
        </div>
      </Pop>
      <Pop at={EIGHT - 10} x={540} y={620} from="up" dist={12} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 56, color: C.text, whiteSpace: "nowrap" }}>
          = 5 + 5 − 2 = <span style={{ color: TAIL, textShadow: glowText(TAIL, 0.6) }}>8</span>
        </div>
      </Pop>
      <FnCurve g={G} f={npdf} fmax={TFMAX} p={draw} color={C.dim} fill={0} dashed width={4} />
      <FnCurve g={G} f={tf} fmax={TFMAX} p={draw} color={BB} fill={0.12} bands={[{ a: -4.5, b: -2.306, color: TAIL, opacity: 0.6, p: ease(frame, [FAT - 6, FAT + 10], [0, 1]) }, { a: 2.306, b: 4.5, color: TAIL, opacity: 0.6, p: ease(frame, [FAT - 6, FAT + 10], [0, 1]) }]} />
      <ValueAxis g={G} p={draw} ticks={[{ v: -1.96, label: "−1.96 (z)", color: C.dim }, { v: 2.306, label: "2.306 (t)", color: TAIL, big: true }]} />
      <div style={{ position: "absolute", left: gx(G, 0.9), top: G.base - G.h - 30, opacity: draw, whiteSpace: "nowrap", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.12em", color: BB }}>t CURVE<br />8 DEGREES OF FREEDOM</div>
      <div style={{ position: "absolute", left: gx(G, -3.9), top: G.base - G.h * 0.62, opacity: draw, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.12em", color: C.dim }}>NORMAL (dashed)</div>
      <Pop at={FAT - 4} x={540} y={1250} from="up" dist={12}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text, whiteSpace: "nowrap" }}>
          FATTER TAILS, BIGGER CUT-OFF: <span style={{ fontFamily: theme.fonts.mono, color: C.dim }}>1.96</span> vs <span style={{ fontFamily: theme.fonts.mono, color: TAIL }}>2.306</span>
        </div>
      </Pop>
      <div style={{ display: "none", background: alpha(C.text, 0) }}>{BIG}</div>
    </AbsoluteFill>
  );
};
