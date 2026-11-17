// SCENE 5 — SHAPES. The t-curve (violet) against the normal (dashed cyan): df = 4 (fat orange tails beyond ±2.5) →
// df = 10 (slimmer) → df = 30 (almost exactly normal).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FnCurve, type Geo, ValueAxis } from "../components/Curve";
import { SceneTitle } from "../components/Kit";
import { ease, Pop } from "../components/Motion";
import { npdf, tpdf } from "../components/TDist";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { NC, TAIL, TC } from "./S1Hook";

const C = theme.colors;
export const GS: Geo = { x0: 150, x1: 930, vmin: -4.5, vmax: 4.5, base: 1160, h: 520 };

export const S5Shapes: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s5");
  const TEN = s.sent(1).from;
  const THIRTY = s.cueS(2, "thirty,");
  const t1 = ease(frame, [TEN, TEN + 24], [0, 1], theme.ease.inOut);
  const t2 = ease(frame, [THIRTY - 4, THIRTY + 24], [0, 1], theme.ease.inOut);
  // df glides 4 → 10 → 30 (geometric interpolation reads smoothly)
  const df = t2 > 0 ? interpolate(t2, [0, 1], [10, 30]) : interpolate(t1, [0, 1], [4, 10]);
  const draw = ease(frame, [4, 30], [0, 1], theme.ease.inOut);
  const tails = 1 - 0.75 * t2 - 0.15 * t1;
  const label = t2 > 0.5 ? "df = 30" : t1 > 0.5 ? "df = 10" : "df = 4";
  const lc = t2 > 0.5 ? C.green : t1 > 0.5 ? TC : TAIL;

  return (
    <AbsoluteFill>
      <SceneTitle label="THE SHAPE" color={TC} at={2} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 460, textAlign: "center", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 80, color: lc, textShadow: glowText(lc, 0.5), opacity: draw }}>{label}</div>
      <FnCurve g={GS} f={npdf} fmax={0.4} p={draw} color={NC} fill={0} dashed width={4} />
      <FnCurve g={GS} f={(x) => tpdf(x, df)} fmax={0.4} p={draw} color={TC} fill={0.14} bands={[{ a: -4.5, b: -2.5, color: TAIL, opacity: 0.6 * tails }, { a: 2.5, b: 4.5, color: TAIL, opacity: 0.6 * tails }]} />
      <ValueAxis g={GS} ticks={[-4, -2, 0, 2, 4].map((v) => ({ v, label: v > 0 ? `+${v}` : `${v}` }))} p={draw} label="STEPS FROM THE CENTRE" />
      <div style={{ position: "absolute", left: 640, top: 600, display: "flex", flexDirection: "column", gap: 10, opacity: draw }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, color: TC }}><div style={{ width: 40, height: 6, borderRadius: 3, background: TC }} />t-CURVE</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, color: NC }}><div style={{ width: 40, height: 0, borderTop: `5px dashed ${NC}` }} />NORMAL</div>
      </div>
      <Pop at={20} out={TEN - 4} x={540} y={1300} from="up" dist={10}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 34, color: C.text, whiteSpace: "nowrap" }}>
          <span style={{ color: TAIL, textShadow: glowText(TAIL, 0.5) }}>FAT TAILS</span>
        </div>
      </Pop>
      <Pop at={TEN + 10} out={THIRTY - 4} x={540} y={1300} from="up" dist={10}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 34, color: C.text, whiteSpace: "nowrap" }}>SLIMMER</div>
      </Pop>
      <Pop at={THIRTY + 16} x={540} y={1300} from="up" dist={10} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 34, color: C.text, whiteSpace: "nowrap", padding: "4px 18px", borderRadius: 12, background: alpha(C.green, 0.2) }}>
          ALMOST EXACTLY <span style={{ color: C.green }}>NORMAL</span>
        </div>
      </Pop>
    </AbsoluteFill>
  );
};
