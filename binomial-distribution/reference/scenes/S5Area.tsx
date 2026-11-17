// SCENE 5 — AREA IS CHANCE. The bus-wait rectangle: 10 wide × 1/10 tall = total area 1.
// Waiting less than 3 minutes = the slice from 0 to 3 = 3/10 = 30%.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { SceneTitle } from "../components/Kit";
import { ease, Pop } from "../components/Motion";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { AREA, CONT } from "./S1Hook";
import { MinAxis, Rect, tx } from "./S4Bus";

const C = theme.colors;
const BASE = 1150;
const H = 300;

export const S5Area: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s5");
  const MEAS = s.cueS(0, "area.");
  const W10 = s.cueS(1, "10");
  const TENTH = s.cueS(1, "110");
  const TOTAL = s.cueS(1, "1.");
  const W3 = s.cueS(2, "3");
  const P30 = s.cueS(2, "30");
  const width = ease(frame, [W10 - 4, W10 + 10], [0, 1]);
  const height = ease(frame, [TENTH - 4, TENTH + 10], [0, 1]);
  const slice = ease(frame, [W3 - 4, W3 + 14], [0, 1], theme.ease.inOut);

  return (
    <AbsoluteFill>
      <SceneTitle label="CHANCE = AREA" color={AREA} at={2} />
      <Pop at={MEAS - 4} x={540} y={420} from="up" dist={16} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 56, color: C.text, whiteSpace: "nowrap" }}>
          MEASURE THE <span style={{ color: AREA, textShadow: glowText(AREA, 0.5) }}>AREA</span>
        </div>
      </Pop>
      <Rect base={BASE} h={H} p={ease(frame, [4, 18], [0, 1], theme.ease.out)} color={CONT} />
      <MinAxis base={BASE} />
      {/* width: 10 minutes */}
      {width > 0.01 ? (
        <>
          <div style={{ position: "absolute", left: tx(0), top: BASE - H - 40, width: (tx(10) - tx(0)) * width, height: 4, background: C.text }} />
          <div style={{ position: "absolute", left: tx(0) - 2, top: BASE - H - 52, width: 4, height: 28, background: C.text }} />
          <div style={{ position: "absolute", left: tx(0) + (tx(10) - tx(0)) * width - 2, top: BASE - H - 52, width: 4, height: 28, background: C.text }} />
          <div style={{ position: "absolute", left: 540, top: BASE - H - 84, transform: "translate(-50%, -50%)", opacity: width, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 34, color: C.text, whiteSpace: "nowrap" }}>10 wide</div>
        </>
      ) : null}
      {/* height: 1/10 */}
      {height > 0.01 ? (
        <>
          <div style={{ position: "absolute", left: tx(0) - 40, top: BASE - H * height, width: 4, height: H * height, background: C.text }} />
          <div style={{ position: "absolute", left: tx(0) - 52, top: BASE - H - 2, width: 28, height: 4, background: C.text, opacity: height }} />
          <div style={{ position: "absolute", left: tx(0) - 60, top: BASE - H / 2, transform: "translate(-100%, -50%)", opacity: height, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 30, color: C.text, whiteSpace: "nowrap", textAlign: "right", lineHeight: 1.1 }}>
            1/10
            <br />
            <span style={{ fontSize: 20, color: C.dim }}>tall</span>
          </div>
        </>
      ) : null}
      <Pop at={TOTAL - 4} out={W3 - 6} x={540} y={BASE - H / 2} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
        <div style={{ padding: "10px 26px", borderRadius: 20, background: "#0A1440", border: `3px solid ${AREA}`, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 40, color: C.text, whiteSpace: "nowrap" }}>
          10 × 1/10 = <span style={{ color: AREA, textShadow: glowText(AREA, 0.6) }}>1</span>
        </div>
      </Pop>
      {/* less than 3 minutes */}
      {slice > 0.01 ? <div style={{ position: "absolute", left: tx(0) + 4, top: BASE - H + 4, width: (tx(3) - tx(0) - 4) * slice, height: H - 4, background: alpha(AREA, 0.6), borderRight: `4px solid ${AREA}` }} /> : null}
      <Pop at={W3 + 6} x={(tx(0) + tx(3)) / 2} y={BASE - H / 2} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
        <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 40, color: C.text, textShadow: glowText(AREA, 0.8), whiteSpace: "nowrap" }}>3/10</div>
      </Pop>
      <Pop at={P30 - 4} x={540} y={560} from="up" dist={14} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 46, color: C.text, whiteSpace: "nowrap" }}>
          WAIT UNDER 3 MIN = <span style={{ color: AREA, textShadow: glowText(AREA, 0.6) }}>30%</span>
        </div>
      </Pop>
    </AbsoluteFill>
  );
};
