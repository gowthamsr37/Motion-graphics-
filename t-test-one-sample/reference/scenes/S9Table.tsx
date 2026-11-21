// SCENE 9 — TWO-TAILED: THE t TABLE. The table (df 6–10; one- and two-tailed headers) slides in; row df 8 and the
// two-tailed 0.05 column sweep to 2.306 = THE CRITICAL VALUE; a t(8) zone curve shows the critical region (area =
// alpha); then t = 3 sits between 2.896 and 3.355 → 0.01 < p < 0.02, SOFTWARE: p = 0.017.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { gx, Marker } from "../components/Curve";
import { ease, Pop, useSpr } from "../components/Motion";
import { BB, StepTracker, TAIL, tGeo, TTable, TZone } from "../components/TKit";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const G = tGeo(1200, 190, 160, 920);

export const S9Table: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s9");
  const ROW = s.cueS(1, "Row");
  const COL = s.cueS(1, "column");
  const CV = s.cueS(1, "2.306.");
  const REG = s.sent(2).from;
  const PB = s.sent(3).from;
  const BETWEEN = s.cueS(3, "between", 0);
  const SW = s.cueS(3, "Software");
  const pMode = frame >= BETWEEN - 4;
  const draw = ease(frame, [REG - 4, REG + 22], [0, 1], theme.ease.inOut);
  return (
    <AbsoluteFill>
      <StepTracker active={3} />
      <Pop at={s.sent(0).from - 2} x={540} y={392} from="up" dist={10}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.16em", color: C.dim, whiteSpace: "nowrap" }}>
          TWO-TAILED · THE <span style={{ color: TAIL }}>t TABLE</span> LISTS CRITICAL VALUES
        </div>
      </Pop>
      <TTable
        x={540}
        y={430}
        p={Math.min(1, spr(s.sent(0).from + 2, theme.spring.smooth))}
        row={2}
        col={pMode ? undefined : 1}
        rowP={ease(frame, [ROW - 4, ROW + 12], [0, 1])}
        colP={ease(frame, [COL - 4, COL + 12], [0, 1])}
        cells={pMode ? [[2, 2], [2, 3]] : [[2, 1]]}
        cellP={pMode ? ease(frame, [BETWEEN - 4, BETWEEN + 8], [0, 1]) : ease(frame, [CV - 8, CV + 4], [0, 1])}
        hiHead="two"
      />
      <Pop at={CV - 4} x={540} y={880} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text, whiteSpace: "nowrap", opacity: pMode ? 0.35 : 1 }}>
          CRITICAL VALUE = <span style={{ fontFamily: theme.fonts.mono, color: TAIL, textShadow: glowText(TAIL, 0.6) }}>±2.306</span>
        </div>
      </Pop>
      {frame >= REG - 6 ? <TZone g={G} p={draw} zones={draw} /> : null}
      {pMode ? <Marker x={gx(G, 3)} base={G.base} top={G.base - 150} p={spr(BETWEEN, theme.spring.bouncy)} color={BB} label="t = 3" size={24} /> : null}
      <Pop at={PB - 2} x={540} y={945} from="up" dist={10}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 34, color: C.text, whiteSpace: "nowrap" }}>
          <span style={{ fontFamily: theme.fonts.mono }}>2.896 &lt; </span>
          <span style={{ fontFamily: theme.fonts.mono, color: BB }}>3</span>
          <span style={{ fontFamily: theme.fonts.mono }}> &lt; 3.355</span> <span style={{ color: C.dim }}>so</span> <span style={{ fontFamily: theme.fonts.mono, color: TAIL }}>0.01 &lt; p &lt; 0.02</span>
        </div>
      </Pop>
      <Pop at={SW - 4} x={540} y={1300} from="scale" scaleFrom={0.6} cfg={theme.spring.pop}>
        <div style={{ padding: "10px 30px", borderRadius: 999, background: alpha(TAIL, 0.2), border: `3px solid ${TAIL}`, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 38, color: C.text, whiteSpace: "nowrap" }}>
          <span style={{ fontFamily: theme.fonts.body, fontSize: 20, letterSpacing: "0.14em", color: C.dim }}>SOFTWARE </span> p = <span style={{ color: TAIL }}>0.017</span>
        </div>
      </Pop>
    </AbsoluteFill>
  );
};
