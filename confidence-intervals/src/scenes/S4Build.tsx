// SCENE 4 — BUILDING THE RANGE. Average ± margin of error. Standard error = spread ÷ √n = 10 ÷ √100 = 1 minute.
// 95%: about 2 standard errors each way (1.96) → 32 ± 2 → 30 to 34 on the number line.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Axis, Interval, type Line, lx } from "../components/CI";
import { Radical } from "../components/Clt";
import { SceneTitle } from "../components/Kit";
import { ease, Pop, useSpr } from "../components/Motion";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { RANGE, SAMPLE, TRUE } from "./S1Hook";

const C = theme.colors;
const G: Line = { x0: 190, x1: 890, vmin: 28, vmax: 36 };
const mono = { fontFamily: theme.fonts.mono, fontWeight: 800 } as const;

export const S4Build: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s4");
  const SE = s.sent(1).from;
  const SPREAD = s.cueS(2, "10");
  const ROOT = s.cueS(2, "100");
  const ONE = s.cueS(2, "1");
  const P95 = s.sent(3).from;
  const TWO = s.cueS(3, "2.");
  return (
    <AbsoluteFill>
      <SceneTitle label="BUILDING THE RANGE" color={RANGE} at={2} />
      <Pop at={6} x={540} y={460} from="up" dist={14} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 50, color: C.text, whiteSpace: "nowrap" }}>
          <span style={{ color: SAMPLE }}>AVERAGE</span> ± <span style={{ color: RANGE, textShadow: glowText(RANGE, 0.5) }}>MARGIN OF ERROR</span>
        </div>
      </Pop>
      <Pop at={SE - 2} x={540} y={600} from="up" dist={12} cfg={theme.spring.bouncy}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 30px", borderRadius: 24, background: alpha(TRUE, 0.14), border: `3px solid ${alpha(TRUE, 0.7)}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text, whiteSpace: "nowrap" }}>
          <span style={{ color: TRUE }}>STANDARD ERROR</span> = SPREAD ÷ <Radical color={C.text} size={40}>n</Radical>
        </div>
      </Pop>
      <div style={{ position: "absolute", left: 0, right: 0, top: 730, display: "flex", justifyContent: "center", alignItems: "center", gap: 18, fontSize: 52, color: C.text, ...mono }}>
        <span style={{ opacity: ease(frame, [SPREAD - 4, SPREAD + 4], [0, 1]) }}>10 ÷</span>
        <span style={{ opacity: ease(frame, [ROOT - 4, ROOT + 4], [0, 1]) }}>
          <Radical color={C.text} size={52}>100</Radical>
        </span>
        <span style={{ opacity: ease(frame, [ONE - 6, ONE + 2], [0, 1]) }}>
          = 10 ÷ 10 = <span style={{ color: TRUE, textShadow: glowText(TRUE, 0.6) }}>1 MIN</span>
        </span>
      </div>
      {frame >= P95 - 6 ? (
        <>
          <Axis g={G} y={1130} ticks={[28, 30, 32, 34, 36]} p={ease(frame, [P95 - 6, P95 + 6], [0, 1])} hi={{ 30: RANGE, 34: RANGE }} />
          <Interval g={G} y={1050} m={32} lo={30} hi={34} p={ease(frame, [TWO - 10, TWO + 10], [0, 1])} color={RANGE} />
          {[-1, 1].map((d) => {
            const p = spr(P95 + 10 + (d > 0 ? 6 : 0), theme.spring.pop);
            return p > 0.01 ? <div key={d} style={{ position: "absolute", left: (lx(G, 32) + lx(G, 32 + 2 * d)) / 2, top: 990, transform: `translate(-50%, -50%) scale(${p})`, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.08em", color: RANGE, whiteSpace: "nowrap" }}>2 SE</div> : null;
          })}
          <Pop at={TWO - 6} x={540} y={880} from="up" dist={12} cfg={theme.spring.bouncy}>
            <div style={{ fontSize: 56, color: C.text, whiteSpace: "nowrap", ...mono }}>
              32 ± 2 <span style={{ color: C.dim, fontSize: 40 }}>=</span> <span style={{ color: RANGE, textShadow: glowText(RANGE, 0.5) }}>30 TO 34</span>
            </div>
          </Pop>
          <Pop at={P95 + 14} x={540} y={1240} from="up" dist={10}>
            <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.14em", color: C.dim, whiteSpace: "nowrap" }}>95%: 1.96 STANDARD ERRORS EACH WAY</div>
          </Pop>
        </>
      ) : null}
    </AbsoluteFill>
  );
};
