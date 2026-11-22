// SCENE 6 — HOW WIDE IS THE BELL? STANDARD ERROR = √( p (1 − p) / n ); the n glows (BIGGER n = NARROWER BELL); then filled in: √( 0.52 × 0.48 / 1,000 ) ≈ 0.016 =
// 1.6%, with a small bell whose width bracket reads 1 SE = 1.6%.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Radical } from "../components/Clt";
import { FnCurve, Geo, gx } from "../components/Curve";
import { SceneTitle } from "../components/Kit";
import { ease, Pop } from "../components/Motion";
import { Tag } from "../components/Nodes";
import { bell, USES } from "../components/Uses";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const U = USES[0];
const G: Geo = { x0: 240, x1: 840, vmin: 46.5, vmax: 57.5, base: 1330, h: 190 };

const Frac: React.FC<{ top: React.ReactNode; bot: React.ReactNode; size: number }> = ({ top, bot, size }) => (
  <span style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", verticalAlign: "middle", fontSize: size }}>
    <span style={{ padding: "0 10px 6px" }}>{top}</span>
    <span style={{ alignSelf: "stretch", height: 4, background: C.text, borderRadius: 2 }} />
    <span style={{ padding: "6px 10px 0" }}>{bot}</span>
  </span>
);

export const S6Width: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s6");
  const SE = s.cueS(0, "standard");
  const ROOT = s.cueS(0, "square");
  const NOTE = s.sent(1).from;
  const NUM = s.sent(2).from;
  const RES = s.cueS(2, "about");
  const nHi = ease(frame, [NOTE - 4, NOTE + 6], [0, 1]) * (1 - ease(frame, [NUM - 10, NUM], [0, 1]));
  const w = ease(frame, [RES, RES + 16], [0, 1]);
  return (
    <AbsoluteFill>
      <SceneTitle label="HOW WIDE IS THE BELL?" color={U.c} at={2} />
      <Pop at={SE - 6} x={540} y={410} from="up" dist={12} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 46, color: C.text, whiteSpace: "nowrap" }}>
          SPREAD = <span style={{ color: C.yellow, textShadow: glowText(C.yellow, 0.5) }}>STANDARD ERROR</span>
        </div>
      </Pop>
      <Pop at={ROOT - 6} x={540} y={600} from="scale" scaleFrom={0.6} cfg={theme.spring.pop}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontFamily: theme.fonts.mono, fontWeight: 800, color: C.text, whiteSpace: "nowrap" }}>
          <span style={{ fontSize: 56, color: C.yellow }}>SE =</span>
          <Radical color={C.text} size={150}>
            <Frac size={56} top={<span>p × (1 − p)</span>} bot={<span style={{ color: nHi > 0.5 ? C.green : C.text, textShadow: nHi > 0.5 ? glowText(C.green, 0.8) : "none", display: "inline-block", transform: `scale(${1 + 0.4 * nHi})` }}>n</span>} />
          </Radical>
        </div>
      </Pop>
      <Pop at={s.cueS(1, "bigger") - 4} out={NUM - 8} x={540} y={830} from="up" dist={14} cfg={theme.spring.bouncy}>
        <Tag color={C.green} size={32}>
          BIGGER n = NARROWER BELL
        </Tag>
      </Pop>
      <Pop at={NUM - 4} x={540} y={850} from="up" dist={14} cfg={theme.spring.pop}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontFamily: theme.fonts.mono, fontWeight: 800, color: C.text, whiteSpace: "nowrap" }}>
          <span style={{ fontSize: 50, color: C.yellow }}>=</span>
          <Radical color={C.text} size={140}>
            <Frac size={50} top={<span><span style={{ color: U.c }}>0.52</span> × 0.48</span>} bot={<span>1,000</span>} />
          </Radical>
        </div>
      </Pop>
      <Pop at={RES - 4} x={540} y={1020} from="scale" scaleFrom={0.5} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 64, color: C.text, whiteSpace: "nowrap" }}>
          ABOUT 0.016 = <span style={{ color: C.yellow, textShadow: glowText(C.yellow, 0.7) }}>1.6%</span>
        </div>
      </Pop>
      <FnCurve g={G} f={bell(52, 1.58)} fmax={1} p={ease(frame, [RES - 6, RES + 14], [0, 1])} color={U.c} fill={0.12} width={5} />
      {w > 0 ? (
        <>
          <div style={{ position: "absolute", left: gx(G, 52), top: G.base - G.h * 0.62, width: (gx(G, 53.58) - gx(G, 52)) * w, height: 5, background: C.yellow, borderRadius: 3 }} />
          <div style={{ position: "absolute", left: gx(G, 52) - 2, top: G.base - G.h, width: 4, height: G.h, background: alpha(C.text, 0.5) }} />
          <div style={{ position: "absolute", left: gx(G, 53.58) + 14, top: G.base - G.h * 0.62 - 22, opacity: w, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 28, color: C.yellow, whiteSpace: "nowrap" }}>1 SE = 1.6%</div>
        </>
      ) : null}
      <div style={{ position: "absolute", left: G.x0, width: G.x1 - G.x0, top: G.base, height: 4, background: alpha(C.text, 0.4), opacity: ease(frame, [RES - 6, RES + 4], [0, 1]) }} />
    </AbsoluteFill>
  );
};
