// SCENE 2 — 30-SECOND RECAP. Left: a skewed RAW DATA histogram; samples drip into an arrow; right: the AVERAGES bell grows;
// SE = σ/√n, and the bell narrows on "narrower".
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Radical } from "../components/Clt";
import { FnCurve } from "../components/Curve";
import { Arrow } from "../components/Icons";
import { SceneTitle } from "../components/Kit";
import { ease, Pop } from "../components/Motion";
import { Sigma } from "../components/ZKit";
import { skew } from "../components/Uses";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const GL = { x0: 100, x1: 470, vmin: 0, vmax: 4, base: 900, h: 300 };
const GR = { x0: 600, x1: 980, vmin: -3.6, vmax: 3.6, base: 900, h: 300 };

export const S2Recap: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s2");
  const raw = ease(frame, [4, 26], [0, 1], theme.ease.inOut);
  const B = s.cueS(1, "bell");
  const bp = ease(frame, [B - 8, B + 16], [0, 1], theme.ease.inOut);
  const NAR = s.cueS(2, "narrower");
  const sd = 1 - 0.45 * ease(frame, [NAR - 6, NAR + 14], [0, 1]);
  return (
    <AbsoluteFill>
      <SceneTitle label="THE CLT IN 10 SECONDS" color={C.violet} at={2} />
      <FnCurve g={GL} f={skew} fmax={0.23} p={raw} color={C.orange} fill={0.3} />
      <div style={{ position: "absolute", left: 285, top: 940, transform: "translateX(-50%)", opacity: raw, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.14em", color: C.orange, whiteSpace: "nowrap" }}>RAW DATA: SKEWED</div>
      <div style={{ position: "absolute", left: 495, top: 720, opacity: ease(frame, [s.cueS(0, "average") - 6, s.cueS(0, "average") + 6], [0, 1]) }}>
        <Arrow size={90} color={C.text} />
      </div>
      <Pop at={s.cueS(0, "average") - 2} x={540} y={640} from="up" dist={10}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.14em", color: C.dim, whiteSpace: "nowrap" }}>AVERAGE MANY SAMPLES</div>
      </Pop>
      {bp > 0.001 ? <FnCurve g={GR} f={(v) => Math.exp(-(v * v) / (2 * sd * sd))} fmax={1} p={bp} color={C.violet} fill={0.2} /> : null}
      <div style={{ position: "absolute", left: 790, top: 940, transform: "translateX(-50%)", opacity: bp, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.14em", color: C.violet, whiteSpace: "nowrap" }}>AVERAGES: A BELL</div>
      <Pop at={s.cueS(2, "sigma") - 6} x={540} y={1110} from="scale" scaleFrom={0.6} cfg={theme.spring.pop}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 34px", borderRadius: 999, background: alpha(C.green, 0.18), border: `3px solid ${C.green}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 48, color: C.text, whiteSpace: "nowrap" }}>
          SE = <Sigma size={52} color={C.green} /> /
          <Radical color={C.text} size={44}>
            n
          </Radical>
        </div>
      </Pop>
      <Pop at={NAR - 4} x={540} y={1230} from="up" dist={10}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 36, color: C.text, whiteSpace: "nowrap" }}>
          MORE DATA = <span style={{ color: C.violet, textShadow: glowText(C.violet, 0.5) }}>A NARROWER BELL</span>
        </div>
      </Pop>
    </AbsoluteFill>
  );
};
