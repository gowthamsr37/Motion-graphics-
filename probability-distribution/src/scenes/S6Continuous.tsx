// SCENE 6 — CONTINUOUS. Height can take any value: a needle at 165.0000… cm has no width, so the chance of one exact value
// is 0. Instead the chance is the area under the curve: 158–172 cm ≈ 68%. The total area is 1.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Axis, Bell, type BellGeo, curveY, vx } from "../components/Bell";
import { SceneTitle } from "../components/Kit";
import { ease, exitP, Pop, useSpr } from "../components/Motion";
import { Bracket } from "../components/Rule";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { CONT, PROB } from "./S1Hook";

const C = theme.colors;
const G: BellGeo = { x0: 110, x1: 970, vmin: 140, vmax: 190, base: 960, peakH: 300, sigmaRef: 7 };

export const S6Continuous: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s6");
  const ANY = s.cueS(0, "any");
  const EXACT = s.cueS(0, "exact");
  const ZERO = s.cueS(0, "zero.");
  const AREA = s.sent(1).from;
  const W158 = s.cueS(2, "158");
  const W172 = s.cueS(2, "172");
  const W68 = s.cueS(2, "68");
  const TOTAL = s.sent(3).from;
  const needle = ease(frame, [ANY - 4, ANY + 8], [0, 1]) * (1 - ease(frame, [AREA - 4, AREA + 6], [0, 1]));
  // the band: 160–170 sweep on "area", then 158–172 on the numbers
  const b1 = ease(frame, [AREA + 4, AREA + 22], [0, 1], theme.ease.inOut);
  const b2 = ease(frame, [W158 - 4, W172 + 4], [0, 1], theme.ease.inOut);
  const lo = interpolate(b2, [0, 1], [165 - 5 * b1, 158]);
  const hi = interpolate(b2, [0, 1], [165 + 5 * b1, 172]);
  const total = ease(frame, [TOTAL - 4, TOTAL + 12], [0, 1], theme.ease.inOut);
  // a readout that never stops: 165.000000… with the last digits rolling
  const digits = Array.from({ length: 7 }, (_, i) => (i < 3 ? 0 : Math.floor((Math.sin((frame + i * 13) * (1.7 + i)) + 1) * 4.99))).join("");
  const readOut = exitP(frame, AREA - 6, 8);
  const yTop = curveY(G, 165, 7, 165);

  return (
    <AbsoluteFill>
      <SceneTitle label="CONTINUOUS · HEIGHT" color={CONT} at={2} />
      <Bell g={G} mu={165} sigma={7} p={ease(frame, [4, 24], [0, 1], theme.ease.inOut)} color={CONT} fill={0.12 + total * 0.35} width={5} bands={b1 > 0.01 && total < 1 ? [{ a: lo, b: hi, color: PROB, opacity: 0.6 * (1 - total) }] : []} />
      <Axis g={G} p={ease(frame, [6, 20], [0, 1])} ticks={[144, 151, 158, 165, 172, 179, 186].map((v) => ({ v, label: `${v}`, big: (v === 158 && frame >= W158 - 2) || (v === 172 && frame >= W172 - 2) || (v === 165 && needle > 0.5), color: (v === 158 && frame >= W158 - 2) || (v === 172 && frame >= W172 - 2) ? PROB : undefined }))} />
      <div style={{ position: "absolute", left: vx(G, 190) + 6, top: G.base + 34, transform: "translateY(-50%)", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, color: C.dim }}>cm</div>

      {/* one exact value: a line with no width */}
      {needle > 0.01 ? (
        <>
          <div style={{ position: "absolute", left: vx(G, 165) - 1.5, top: yTop - 60, width: 3, height: (G.base - yTop + 60) * needle, background: C.text, boxShadow: `0 0 10px ${alpha("#F3F7FF", 0.9)}` }} />
        </>
      ) : null}
      {readOut < 1 && frame >= ANY - 6 ? (
        <div style={{ position: "absolute", left: 540, top: 470, transform: "translate(-50%, -50%)", opacity: (1 - readOut) * ease(frame, [ANY - 4, ANY + 6], [0, 1]), textAlign: "center" }}>
          <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 64, color: C.text, whiteSpace: "nowrap" }}>
            165.{digits}… <span style={{ fontSize: 34, color: C.dim }}>cm</span>
          </div>
          <div style={{ marginTop: 14, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text, whiteSpace: "nowrap", opacity: ease(frame, [EXACT - 4, EXACT + 6], [0, 1]) }}>
            chance of this exact value = <span style={{ fontFamily: theme.fonts.mono, color: C.orange, textShadow: glowText(C.orange, 0.6), fontSize: 56 }}>{frame >= ZERO - 4 ? "0" : "?"}</span>
          </div>
        </div>
      ) : null}
      <Pop at={EXACT + 6} out={AREA - 6} x={vx(G, 165) + 150} y={yTop - 40} from="left" dist={12}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.12em", color: C.dim, whiteSpace: "nowrap" }}>A LINE HAS NO WIDTH</div>
      </Pop>

      {/* area = chance */}
      <Pop at={AREA - 2} out={TOTAL - 6} x={540} y={460} from="up" dist={16} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 64, color: C.text, whiteSpace: "nowrap" }}>
          <span style={{ color: PROB, textShadow: glowText(PROB, 0.6) }}>AREA</span> = CHANCE
        </div>
      </Pop>
      <Pop at={W68 - 3} out={TOTAL - 4} x={540} y={G.base - 130} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 80, color: C.text, textShadow: glowText(PROB, 0.9), whiteSpace: "nowrap" }}>68%</div>
      </Pop>
      <Bracket g={G} a={158} b={172} y={G.base + 100} p={total > 0.02 ? 0 : ease(frame, [W172, W172 + 14], [0, 1])} color={PROB} label="158 to 172 cm" />
      <Pop at={TOTAL - 2} x={540} y={460} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 64, color: C.text, whiteSpace: "nowrap" }}>
          TOTAL AREA = <span style={{ color: CONT, textShadow: glowText(CONT, 0.7) }}>1</span>
        </div>
      </Pop>
    </AbsoluteFill>
  );
};
