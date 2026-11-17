// SCENE 6 — THE AVERAGE = TRIES × CHANCE: 10 × 1/2 = 5 and 10 × 1/5 = 2, each beside its bars with the mean marked.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { BarsIcon } from "../components/Explain";
import { SceneTitle } from "../components/Kit";
import { Pop, useSpr } from "../components/Motion";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { AVGC, BARS } from "./S1Hook";
import { binom } from "./S4Test";

const C = theme.colors;
const ROWS = [
  { p: 0.5, label: "10 × 1/2 = 5", mean: 5, y: 760, c: BARS },
  { p: 0.2, label: "10 × 1/5 = 2", mean: 2, y: 1030, c: C.cyan },
];

export const S6Average: React.FC = () => {
  useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s6");
  const at = [s.cueS(1, "12"), s.cueS(1, "15")];

  return (
    <AbsoluteFill>
      <SceneTitle label="THE AVERAGE" color={AVGC} at={2} />
      <Pop at={s.sent(0).from + 2} x={540} y={470} from="up" dist={16} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 54, color: C.text, whiteSpace: "nowrap" }}>
          AVERAGE = <span style={{ color: AVGC, textShadow: glowText(AVGC, 0.5) }}>TRIES × CHANCE</span>
        </div>
      </Pop>
      {ROWS.map((r, i) => {
        const p = spr(14 + i * 10, theme.spring.bouncy);
        const eq = spr(at[i] - 8, theme.spring.pop);
        if (p <= 0.001) return null;
        const vals = binom(10, r.p);
        return (
          <div key={r.label} style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, opacity: Math.min(1, p * 2), transform: `translateX(${(1 - p) * -50}px)` }}>
            <div style={{ position: "absolute", left: 90, top: r.y - 120, width: 900, height: 240, boxSizing: "border-box", borderRadius: 28, background: `linear-gradient(90deg, ${alpha(r.c, 0.16)}, rgba(14,24,64,0.9) 55%)`, border: `3px solid ${alpha(r.c, 0.7)}` }} />
            <div style={{ position: "absolute", left: 130, top: r.y - 80 }}>
              <BarsIcon color={r.c} vals={vals} w={360} h={150} hi={[r.mean]} hiColor={AVGC} />
            </div>
            <div style={{ position: "absolute", left: 130 + (r.mean + 0.5) * (360 / 11) - 2, top: r.y - 100, width: 4, height: 170, background: AVGC, opacity: 0.9 }} />
            <div style={{ position: "absolute", left: 540, top: r.y, transform: `translateY(-50%) scale(${interpolate(eq, [0, 1], [0.6, 1])})`, transformOrigin: "left center", opacity: Math.min(1, eq * 2), fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 50, color: C.text, whiteSpace: "nowrap" }}>
              {r.label.slice(0, -1)}
              <span style={{ color: AVGC, textShadow: glowText(AVGC, 0.6) }}>{r.label.slice(-1)}</span>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
