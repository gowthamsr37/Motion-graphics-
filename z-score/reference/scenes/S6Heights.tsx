// SCENE 6 — HEIGHTS EXAMPLE. Mean 165 cm, SD 7 cm. ±1 SD = 158–172 cm (68%), ±2 SD = 151–179 cm (95%).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Axis, Bell, type BellGeo, vx } from "../components/Bell";
import { SceneTitle } from "../components/Kit";
import { ease, Pop } from "../components/Motion";
import { Pill } from "../components/Nodes";
import { alpha, glowText, kindColor, theme } from "../theme";
import { useScene } from "../timing";
import { Bracket, ruleBands, SD_COL } from "./S5Rule";

const C = theme.colors;
const MU = 165;
const SD = 7;
const G: BellGeo = { x0: 110, x1: 970, vmin: MU - 3.686 * SD, vmax: MU + 3.686 * SD, base: 1010, peakH: 340, sigmaRef: SD };

export const S6Heights: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s6");
  const W165 = s.cueS(0, "165");
  const W7 = s.cueS(0, "7");
  const W68 = s.cueS(1, "68");
  const W158 = s.cueS(1, "158");
  const W172 = s.cueS(1, "172");
  const W95 = s.cueS(2, "95");
  const W151 = s.cueS(2, "151");
  const W179 = s.cueS(2, "179");
  const END = s.duration;
  const b1 = ease(frame, [W68 - 4, W68 + 16], [0, 1], theme.ease.inOut);
  const b2 = ease(frame, [W95 - 4, W95 + 16], [0, 1], theme.ease.inOut);
  // ruleBands works in SD units around 0: shift it to centimetres
  const bands = ruleBands([b1, b2]).map((b) => ({ ...b, a: MU + b.a * SD, b: MU + b.b * SD }));
  const hot = (t: number) => frame >= t - 2;
  const ticks = [
    { v: 144, label: "144" },
    { v: 151, label: "151", color: hot(W151) ? SD_COL[1] : undefined, big: hot(W151) },
    { v: 158, label: "158", color: hot(W158) ? SD_COL[0] : undefined, big: hot(W158) },
    { v: 165, label: "165", color: hot(W165) ? kindColor.mean : undefined, big: hot(W165) },
    { v: 172, label: "172", color: hot(W172) ? SD_COL[0] : undefined, big: hot(W172) },
    { v: 179, label: "179", color: hot(W179) ? SD_COL[1] : undefined, big: hot(W179) },
    { v: 186, label: "186" },
  ];
  const meanLine = ease(frame, [W165 - 4, W165 + 10], [0, 1]);

  return (
    <AbsoluteFill>
      <SceneTitle label="EXAMPLE: HEIGHTS" color={C.cyan} at={2} />
      <Pop at={W165 - 4} x={330} y={420} from="left" dist={24} cfg={theme.spring.bouncy}>
        <Pill label="MEAN 165 cm" color={kindColor.mean} size={34} glow={0.5} />
      </Pop>
      <Pop at={W7 - 4} x={770} y={420} from="right" dist={24} cfg={theme.spring.bouncy}>
        <Pill label="SD 7 cm" color={kindColor.sd} size={34} glow={0.5} />
      </Pop>
      <Bell g={G} mu={MU} sigma={SD} p={ease(frame, [2, 22], [0, 1], theme.ease.inOut)} color={C.text} fill={0.08} width={5} bands={bands} />
      <Axis g={G} ticks={ticks} p={ease(frame, [4, 18], [0, 1])} />
      <div style={{ position: "absolute", left: vx(G, 186) + 34, top: G.base + 34, transform: "translateY(-50%)", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, color: C.dim }}>cm</div>
      {meanLine > 0.01 ? <div style={{ position: "absolute", left: vx(G, MU) - 2.5, top: G.base - 360 * meanLine, height: 360 * meanLine, borderLeft: `5px solid ${kindColor.mean}`, filter: `drop-shadow(0 0 6px ${kindColor.mean})` }} /> : null}
      {/* one SD = 7 cm steps */}
      <Pop at={W158 - 2} out={W95 - 6} x={(vx(G, 158) + vx(G, 165)) / 2} y={G.base - 40} from="down" dist={10}>
        <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 30, color: C.ink, background: SD_COL[0], borderRadius: 10, padding: "0 10px" }}>-7</div>
      </Pop>
      <Pop at={W172 - 2} out={W95 - 6} x={(vx(G, 165) + vx(G, 172)) / 2} y={G.base - 40} from="down" dist={10}>
        <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 30, color: C.ink, background: SD_COL[0], borderRadius: 10, padding: "0 10px" }}>+7</div>
      </Pop>
      {/* the answers */}
      <Pop at={W158 - 2} out={W95 - 6} x={540} y={560} from="up" dist={14} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 46, color: C.text, whiteSpace: "nowrap" }}>
          <span style={{ color: SD_COL[0], textShadow: glowText(SD_COL[0], 0.5) }}>68%</span> are 158 to 172 cm
        </div>
      </Pop>
      <Pop at={W151 - 2} out={END - 6} x={540} y={560} from="up" dist={14} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 46, color: C.text, whiteSpace: "nowrap" }}>
          <span style={{ color: SD_COL[1], textShadow: glowText(SD_COL[1], 0.5) }}>95%</span> are 151 to 179 cm
        </div>
      </Pop>
      <Bracket g={G} a={158} b={172} y={G.base + 100} p={ease(frame, [W172, W172 + 14], [0, 1], theme.ease.out)} color={SD_COL[0]} label="68%" />
      <Bracket g={G} a={151} b={179} y={G.base + 172} p={ease(frame, [W179, W179 + 14], [0, 1], theme.ease.out)} color={SD_COL[1]} label="95%" />
    </AbsoluteFill>
  );
};
