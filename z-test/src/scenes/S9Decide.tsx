// SCENE 9 — THE CUT-OFF AND THE DECISION. 5% ÷ 2 = 2.5% PER TAIL; the table searches for 0.0250 → row −1.9 + column
// 0.06 = −1.96. Then the curve with reject zones beyond ±1.96 and the z = −2 marker inside the left zone, two checks
// (z beyond −1.96, p = 0.046 < 0.05) and REJECT H0: THE MACHINE IS UNDER-FILLING.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FnCurve, gx, Marker, ValueAxis } from "../components/Curve";
import { ease, exitP, Mark, Pop, useSpr } from "../components/Motion";
import { Tag } from "../components/Nodes";
import { CLAIM, SE, StepTracker, TAIL, zf, ZFMAX, zGeo, ZTable } from "../components/ZKit";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const G = zGeo(860, 300);

export const S9Decide: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s9");
  const HALF = s.cueS(0, "2.5%");
  const FIND = s.cueS(0, "0.0250,");
  const CUT = s.cueS(0, "-1.96.");
  const DEC = s.sent(1).from;
  const REJ = s.cueS(1, "Reject");
  const tblOut = exitP(frame, DEC - 12, 12);
  const draw = ease(frame, [DEC - 4, DEC + 24], [0, 1], theme.ease.inOut);
  return (
    <AbsoluteFill>
      <StepTracker active={frame >= DEC ? 4 : 3} />
      {tblOut < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - tblOut }}>
          <Pop at={HALF - 6} x={540} y={410} from="up" dist={10}>
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text, whiteSpace: "nowrap" }}>
              5% ÷ 2 = <span style={{ fontFamily: theme.fonts.mono, color: TAIL }}>0.0250</span> PER TAIL
            </div>
          </Pop>
          <ZTable x={540} y={470} p={1} row={2} col={6} rowP={ease(frame, [CUT - 10, CUT], [0, 1])} colP={ease(frame, [CUT - 6, CUT + 4], [0, 1])} cell={[2, 6]} cellP={ease(frame, [FIND - 6, FIND + 6], [0, 1])} color={TAIL} />
          <Pop at={CUT - 4} x={540} y={830} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 46, color: C.text, whiteSpace: "nowrap" }}>
              ROW −1.9 + COLUMN 0.06 = <span style={{ fontFamily: theme.fonts.mono, color: TAIL, textShadow: glowText(TAIL, 0.6) }}>−1.96</span>
            </div>
          </Pop>
          <Pop at={CUT + 16} x={540} y={930} from="up" dist={10}>
            <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.16em", color: C.dim, whiteSpace: "nowrap" }}>THAT'S WHERE THE FAMOUS 1.96 COMES FROM</div>
          </Pop>
        </AbsoluteFill>
      ) : null}
      {frame >= DEC - 6 ? (
        <>
          <FnCurve g={G} f={zf} fmax={ZFMAX} p={draw} color={CLAIM} fill={0.1} bands={[{ a: -3.6, b: -1.96, color: TAIL, opacity: 0.6, p: draw }, { a: 1.96, b: 3.6, color: TAIL, opacity: 0.6, p: draw }]} />
          <ValueAxis g={G} p={draw} ticks={[{ v: -1.96, label: "−1.96", color: TAIL }, { v: 0, label: "0" }, { v: 1.96, label: "+1.96", color: TAIL }]} />
          <div style={{ position: "absolute", left: gx(G, -3.3), top: G.base - 200, opacity: draw, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.14em", color: TAIL }}>REJECT</div>
          <div style={{ position: "absolute", left: gx(G, 2.3), top: G.base - 200, opacity: draw, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.14em", color: TAIL }}>REJECT</div>
          <Marker x={gx(G, -2)} base={G.base} top={G.base - 260} p={spr(DEC + 10, theme.spring.bouncy)} color={C.violet} label="z = −2" size={30} />
          {[
            { y: 1010, at: s.cueS(1, "beyond"), t: <>z = −2 is beyond <span style={{ color: TAIL }}>−1.96</span></> },
            { y: 1100, at: s.cueS(1, "p"), t: <>p = 0.046 &lt; <span style={{ color: TAIL }}>0.05</span></> },
          ].map((r, i) => (
            <Pop key={i} at={r.at - 4} x={540} y={r.y} from="left" dist={30} cfg={theme.spring.bouncy}>
              <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "10px 28px", borderRadius: 20, background: "rgba(14,24,64,0.9)", border: `2px solid ${alpha(SE, 0.7)}`, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 38, color: C.text, whiteSpace: "nowrap" }}>
                <Mark kind="check" at={r.at + 4} size={38} color={SE} />
                {r.t}
              </div>
            </Pop>
          ))}
          <Pop at={REJ - 4} x={540} y={1220} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
            <Tag color={TAIL} size={34}>
              REJECT H0: THE MACHINE IS UNDER-FILLING
            </Tag>
          </Pop>
        </>
      ) : null}
    </AbsoluteFill>
  );
};
