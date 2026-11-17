// SCENE 6 — TWO BONUS FACTS, on one salary axis: the bell of averages is centred on the TRUE AVERAGE of the whole city
// (₹40K), and bigger samples (30 → 120) make it narrower → a more precise estimate.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Bell, type BellGeo } from "../components/Bell";
import { SceneTitle } from "../components/Kit";
import { ease, Pop } from "../components/Motion";
import { AxisLabels, K, PopBars, POP_SD, px, TRUE_MEAN } from "../components/Salary";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { AVG, PREC, RAW } from "./S1Hook";

const C = theme.colors;
const SE30 = POP_SD / Math.sqrt(30);
const SE120 = POP_SD / Math.sqrt(120);
const G: BellGeo = { x0: px(0), x1: px(160), vmin: 0, vmax: 160, base: 1250, peakH: 200, sigmaRef: SE30 };

export const S6Facts: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s6");
  const TRUE = s.cueS(1, "true");
  const BIG = s.sent(2).from;
  const NAR = s.cueS(2, "narrower,");
  const PREW = s.cueS(2, "precise.");
  const k = ease(frame, [NAR - 6, NAR + 12], [0, 1], theme.ease.inOut);
  const sigma = interpolate(k, [0, 1], [SE30, SE120]);
  const line = ease(frame, [TRUE - 4, TRUE + 12], [0, 1]);

  return (
    <AbsoluteFill>
      <SceneTitle label="TWO BONUS FACTS" color={AVG} at={2} />
      <div style={{ position: "absolute", left: 140, top: 450, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.16em", color: RAW, opacity: ease(frame, [6, 16], [0, 1]) }}>CITY SALARIES</div>
      <div style={{ opacity: ease(frame, [6, 18], [0, 1]) }}>
        <PopBars base={760} h={240} color={RAW} dim={0.65} />
      </div>
      <div style={{ position: "absolute", left: px(0) - 10, top: 761, width: px(160) - px(0) + 20, height: 3, background: alpha(C.text, 0.4) }} />
      <div style={{ position: "absolute", left: 140, top: 900, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.16em", color: AVG, opacity: ease(frame, [10, 20], [0, 1]) }}>THE AVERAGES (SAME SCALE)</div>
      <Bell g={G} mu={TRUE_MEAN} sigma={sigma} p={ease(frame, [10, 30], [0, 1], theme.ease.inOut)} color={k > 0.5 ? PREC : AVG} fill={0.25} width={5} />
      <div style={{ position: "absolute", left: px(0) - 10, top: G.base + 1, width: px(160) - px(0) + 20, height: 3, background: alpha(C.text, 0.4) }} />
      <AxisLabels base={G.base} vals={[0, 40, 80, 120, 160]} at={px} />
      {/* fact 1: centred on the true average */}
      <div style={{ position: "absolute", left: px(TRUE_MEAN) - 2, top: 520, height: (G.base - 520) * line, borderLeft: `4px dashed ${C.text}` }} />
      <Pop at={TRUE - 2} x={px(TRUE_MEAN) + 30} y={520} from="left" dist={14} cfg={theme.spring.pop}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 18px", borderRadius: 999, background: "#0A1440", border: `3px solid ${C.text}`, whiteSpace: "nowrap", transform: "translateX(50%)" }}>
          <span style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 24, color: C.text }}>TRUE AVERAGE</span>
          <K v={TRUE_MEAN} size={26} color={C.text} />
        </div>
      </Pop>
      {/* fact 2: bigger samples, narrower */}
      <Pop at={BIG - 2} x={780} y={1040} from="right" dist={16} cfg={theme.spring.bouncy}>
        <div style={{ padding: "8px 22px", borderRadius: 16, background: "#0A1440", border: `3px solid ${k > 0.5 ? PREC : AVG}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: C.text, whiteSpace: "nowrap" }}>
          SAMPLES OF <span style={{ fontFamily: theme.fonts.mono, color: k > 0.5 ? PREC : AVG }}>{k > 0.5 ? 120 : 30}</span>
        </div>
      </Pop>
      <Pop at={PREW - 6} x={780} y={1130} from="up" dist={14} cfg={theme.spring.pop}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 36, color: PREC, textShadow: glowText(PREC, 0.5), whiteSpace: "nowrap" }}>MORE PRECISE</div>
      </Pop>
    </AbsoluteFill>
  );
};

