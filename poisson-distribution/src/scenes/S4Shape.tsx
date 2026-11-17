// SCENE 4 — THE SHAPE for an average of 4 (exact Poisson bars 0–12): 3 and 4 most likely (19.5% each), 0 ≈ 2%,
// 10 ≈ 0.5% (about 1 in 200).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { SceneTitle } from "../components/Kit";
import { ease, Pop, useSpr } from "../components/Motion";
import { Pill } from "../components/Nodes";
import { CountBars, poisDist } from "../components/Pois";
import { glowText, theme } from "../theme";
import { useScene } from "../timing";
import { EVT, HI, RARE, RATE } from "./S1Hook";

const C = theme.colors;
export const P4 = poisDist(4, 12);
const X0 = 130;
const X1 = 950;
const BASE = 1180;
const H = 560;
const MAX = 0.21;
const bx = (k: number) => X0 + ((k + 0.5) / 13) * (X1 - X0);

export const S4Shape: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s4");
  const MOST = s.sent(1).from;
  const ZERO = s.sent(2).from;
  const TEN = s.sent(3).from;
  const grow = ease(frame, [8, 30], [0, 1], theme.ease.out);
  const hi: Record<number, string> = {};
  if (frame >= MOST - 4) {
    hi[3] = HI;
    hi[4] = HI;
  }
  if (frame >= ZERO - 4) hi[0] = RARE;
  if (frame >= TEN - 4) hi[10] = RARE;
  const label = (k: number, at: number, text: string, c: string, dy = 0) => {
    const p = spr(at, theme.spring.pop);
    if (p <= 0.01) return null;
    return <div style={{ position: "absolute", left: bx(k), top: BASE - (P4[k] / MAX) * H - 40 + dy, transform: `translate(-50%, -50%) scale(${interpolate(p, [0, 1], [0.5, 1])})`, opacity: Math.min(1, p * 2), padding: "4px 12px", borderRadius: 12, background: "#0A1440", border: `3px solid ${c}`, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 26, color: C.text, whiteSpace: "nowrap" }}>{text}</div>;
  };

  return (
    <AbsoluteFill>
      <SceneTitle label="THE SHAPE" color={EVT} at={2} />
      <Pop at={6} x={540} y={420} from="up" dist={14} cfg={theme.spring.bouncy}>
        <Pill label="AVERAGE = 4 AN HOUR" color={RATE} size={32} glow={0.4} />
      </Pop>
      <CountBars vals={P4} x0={X0} x1={X1} base={BASE} h={H} scaleMax={MAX} color={EVT} grow={grow} hi={hi} />
      <div style={{ position: "absolute", left: 0, right: 0, top: BASE + 70, textAlign: "center", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.18em", color: C.dim }}>CUSTOMERS IN AN HOUR</div>
      {(() => {
        const p = spr(MOST + 4, theme.spring.pop);
        if (p <= 0.01) return null;
        return <div style={{ position: "absolute", left: (bx(3) + bx(4)) / 2, top: BASE - (P4[4] / MAX) * H - 44, transform: `translate(-50%, -50%) scale(${interpolate(p, [0, 1], [0.5, 1])})`, opacity: Math.min(1, p * 2), padding: "4px 14px", borderRadius: 12, background: "#0A1440", border: `3px solid ${HI}`, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 26, color: C.text, whiteSpace: "nowrap" }}>20% EACH</div>;
      })()}
      {label(0, ZERO + 4, "2%", RARE)}
      {label(10, TEN + 4, "0.5%", RARE, -20)}
      <Pop at={MOST + 6} out={ZERO - 4} x={540} y={530} from="up" dist={14}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text, whiteSpace: "nowrap" }}>
          <span style={{ color: HI, textShadow: glowText(HI, 0.5) }}>3 AND 4</span> ARE MOST LIKELY
        </div>
      </Pop>
      <Pop at={TEN + 8} x={540} y={530} from="up" dist={14}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text, whiteSpace: "nowrap" }}>
          <span style={{ color: RARE, textShadow: glowText(RARE, 0.5) }}>10</span>: ABOUT 1 IN 200
        </div>
      </Pop>
    </AbsoluteFill>
  );
};
