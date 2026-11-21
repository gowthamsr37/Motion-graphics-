// SCENE 4 — FATTER TAILS. The normal curve (dashed, the z curve) and one t curve whose df steps 2 → 5 → 30 on the words,
// tails shaded, morphing toward the normal; df = n − 1 picks the curve.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FnCurve, gx, ValueAxis } from "../components/Curve";
import { ease, Pop } from "../components/Motion";
import { npdf, tpdf } from "../components/TDist";
import { SceneTitle } from "../components/Kit";
import { TC, TL, ZC } from "../components/ZT";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const G = { x0: 110, x1: 970, vmin: -4.5, vmax: 4.5, base: 1140, h: 520 };
const FM = npdf(0);

export const S4Tails: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s4");
  const D2 = s.cueS(1, "2");
  const D5 = s.cueS(1, "5,");
  const D30 = s.cueS(1, "30,");
  // df eases between the spoken values (log-ish interpolation for a smooth morph)
  const df = frame < D2 ? 2 : frame < D5 ? 2 : frame < D30 ? 2 + 3 * ease(frame, [D5 - 6, D5 + 10], [0, 1]) : 5 + 25 * ease(frame, [D30 - 6, D30 + 14], [0, 1]);
  const draw = ease(frame, [4, 30], [0, 1], theme.ease.inOut);
  const tcur = ease(frame, [D2 - 6, D2 + 16], [0, 1], theme.ease.inOut);
  const f = (v: number) => tpdf(v, df);
  const label = df < 2.5 ? "2" : df < 5.5 ? "5" : df > 29 ? "30" : Math.round(df).toString();
  return (
    <AbsoluteFill>
      <SceneTitle label="FATTER TAILS" color={TC} at={2} />
      <FnCurve g={G} f={npdf} fmax={FM} p={draw} color={ZC} fill={0} dashed width={5} />
      {tcur > 0.001 ? <FnCurve g={G} f={f} fmax={FM} p={tcur} color={TC} fill={0.12} bands={[{ a: -4.5, b: -2.2, color: TL, opacity: 0.55 }, { a: 2.2, b: 4.5, color: TL, opacity: 0.55 }]} /> : null}
      <ValueAxis g={G} p={draw} ticks={[-3, -2, -1, 0, 1, 2, 3].map((v) => ({ v, label: `${v}` }))} />
      <div style={{ position: "absolute", left: gx(G, 1.3), top: G.base - G.h - 40, opacity: draw, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.12em", color: ZC }}>NORMAL (z) · dashed</div>
      {tcur > 0.001 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 440, textAlign: "center", opacity: tcur, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 56, color: C.text }}>
          t CURVE · <span style={{ fontFamily: theme.fonts.mono, color: TC, textShadow: glowText(TC, 0.5) }}>df {label}</span>
        </div>
      ) : null}
      <Pop at={s.cueS(1, "fat.") - 4} x={240} y={1000} from="up" dist={10}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.12em", color: TL }}>FAT TAILS</div>
      </Pop>
      <Pop at={s.cueS(1, "normal") - 4} x={540} y={1230} from="up" dist={10}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 36, color: C.text, whiteSpace: "nowrap" }}>
          MORE DATA <span style={{ color: C.dim }}>=</span> <span style={{ color: TC }}>t</span> LOOKS LIKE <span style={{ color: ZC }}>z</span>
        </div>
      </Pop>
      <Pop at={s.sent(2).from - 2} x={540} y={1310} from="up" dist={10}>
        <div style={{ padding: "8px 26px", borderRadius: 999, background: alpha(TC, 0.18), border: `2px solid ${TC}`, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 32, color: C.text, whiteSpace: "nowrap" }}>df = n − 1</div>
      </Pop>
    </AbsoluteFill>
  );
};
