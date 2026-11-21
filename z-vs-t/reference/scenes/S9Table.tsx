// SCENE 9 — TWO-TAILED: THE t TABLE. Row df 8 and the two-tailed 0.05 column sweep to 2.306 = CRITICAL VALUE ±2.306;
// the zone curve (critical region beyond ±2.306); then |−2| = 2 < 2.306 → p > 0.05, SOFTWARE p = 0.08, with t = −2 marked
// inside the fail-to-reject zone.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { gx, Marker } from "../components/Curve";
import { ease, Pop, useSpr } from "../components/Motion";
import { BB, SE, StepTracker, TAIL, tGeo, TTable, TZone } from "../components/TKit";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const G = tGeo(1170, 190, 160, 920);

export const S9Table: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s9");
  const ROW = s.cueS(0, "Row");
  const COL = s.cueS(0, "column");
  const CV = s.cueS(0, "2.306.");
  const REG = s.sent(1).from;
  const PB = s.sent(2).from;
  const SW = s.cueS(2, "Software");
  const draw = ease(frame, [REG - 4, REG + 22], [0, 1], theme.ease.inOut);
  return (
    <AbsoluteFill>
      <StepTracker active={3} />
      <Pop at={s.sent(0).from - 2} x={540} y={392} from="up" dist={10}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.16em", color: C.dim, whiteSpace: "nowrap" }}>
          TWO-TAILED · THE <span style={{ color: TAIL }}>t TABLE</span>
        </div>
      </Pop>
      <TTable x={540} y={430} p={Math.min(1, spr(s.sent(0).from + 2, theme.spring.smooth))} row={2} col={1} rowP={ease(frame, [ROW - 4, ROW + 12], [0, 1])} colP={ease(frame, [COL - 4, COL + 12], [0, 1])} cells={[[2, 1]]} cellP={ease(frame, [CV - 8, CV + 4], [0, 1])} hiHead="two" />
      <Pop at={CV - 4} x={540} y={880} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text, whiteSpace: "nowrap" }}>
          CRITICAL VALUE = <span style={{ fontFamily: theme.fonts.mono, color: TAIL, textShadow: glowText(TAIL, 0.6) }}>±2.306</span>
        </div>
      </Pop>
      {frame >= REG - 6 ? <TZone g={G} p={draw} zones={draw} /> : null}
      {frame >= PB - 4 ? <Marker x={gx(G, -2)} base={G.base} top={G.base - 150} p={spr(PB, theme.spring.bouncy)} color={BB} label="t = −2" size={24} /> : null}
      <Pop at={PB - 2} x={540} y={945} from="up" dist={10}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 36, color: C.text, whiteSpace: "nowrap" }}>
          <span style={{ fontFamily: theme.fonts.mono, color: BB }}>2</span> &lt; <span style={{ fontFamily: theme.fonts.mono }}>2.306</span> <span style={{ color: C.dim }}>so</span> <span style={{ fontFamily: theme.fonts.mono, color: SE }}>p &gt; 0.05</span>
        </div>
      </Pop>
      <Pop at={SW - 4} x={540} y={1290} from="scale" scaleFrom={0.6} cfg={theme.spring.pop}>
        <div style={{ padding: "10px 30px", borderRadius: 999, background: alpha(SE, 0.2), border: `3px solid ${SE}`, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 38, color: C.text, whiteSpace: "nowrap" }}>
          <span style={{ fontFamily: theme.fonts.body, fontSize: 20, letterSpacing: "0.14em", color: C.dim }}>SOFTWARE </span> p = <span style={{ color: SE }}>0.08</span>
        </div>
      </Pop>
    </AbsoluteFill>
  );
};
