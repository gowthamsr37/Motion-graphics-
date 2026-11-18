// SCENE 4 — THE RESULTS. After a week: green (A) 400 purchases of 5,000 = 8%; orange (B) 460 of 5,000 = 9.2%.
// ORANGE LOOKS BETTER... REAL, OR JUST LUCK?
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { AC, BC, PV } from "../components/AB";
import { SceneTitle } from "../components/Kit";
import { ease, Pop, Rolling } from "../components/Motion";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const BASE = 1130;
const SCALE = 52; // px per percentage point

export const S4Results: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s4");
  const A = s.cueS(0, "400");
  const B = s.cueS(1, "460:");
  const LUCK = s.sent(2).from;
  const bars = [
    { x: 330, at: A, v: 8, n: "400", c: AC, l: "GREEN (A)", d: 0 },
    { x: 750, at: B, v: 9.2, n: "460", c: BC, l: "ORANGE (B)", d: 1 },
  ];
  return (
    <AbsoluteFill>
      <SceneTitle label="THE RESULTS" color={BC} at={2} />
      <Pop at={6} out={LUCK - 4} x={540} y={410} from="up" dist={12}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 44, color: C.text, whiteSpace: "nowrap" }}>
          AFTER A WEEK: <span style={{ color: C.cyan }}>PURCHASES</span>
        </div>
      </Pop>
      <Pop at={LUCK - 2} x={540} y={410} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 52, color: C.text, whiteSpace: "nowrap" }}>
          REAL, OR <span style={{ color: PV, textShadow: glowText(PV, 0.5) }}>JUST LUCK?</span>
        </div>
      </Pop>
      {bars.map((b) => {
        const g = ease(frame, [b.at - 6, b.at + 24], [0, 1], theme.ease.out);
        if (g <= 0) return null;
        const h = b.v * SCALE * g;
        return (
          <React.Fragment key={b.l}>
            <div style={{ position: "absolute", left: b.x - 110, top: BASE - h, width: 220, height: h, borderRadius: "18px 18px 4px 4px", background: `linear-gradient(180deg, ${alpha(b.c, 0.75)}, ${alpha(b.c, 0.35)})`, border: `3px solid ${b.c}`, boxSizing: "border-box", boxShadow: `0 0 26px ${alpha(b.c, 0.4)}` }} />
            <div style={{ position: "absolute", left: b.x, top: BASE - h - 50, transform: "translate(-50%, -50%)", display: "flex", alignItems: "baseline", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 56, color: C.text, textShadow: glowText(b.c, 0.5) }}>
              <Rolling value={b.v * g} decimals={b.d} height={64} color={C.text} size={56} />%
            </div>
            <div style={{ position: "absolute", left: b.x, top: BASE + 40, transform: "translate(-50%, -50%)", opacity: g, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: b.c, whiteSpace: "nowrap" }}>{b.l}</div>
            <div style={{ position: "absolute", left: b.x, top: BASE + 84, transform: "translate(-50%, -50%)", opacity: g, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.1em", color: C.dim, whiteSpace: "nowrap" }}>
              <span style={{ fontFamily: theme.fonts.mono, color: C.text }}>{b.n}</span> OF 5,000 BOUGHT
            </div>
          </React.Fragment>
        );
      })}
      <div style={{ position: "absolute", left: 160, top: BASE, width: 760, height: 4, background: alpha(C.text, 0.4), opacity: ease(frame, [A - 10, A], [0, 1]) }} />
    </AbsoluteFill>
  );
};
