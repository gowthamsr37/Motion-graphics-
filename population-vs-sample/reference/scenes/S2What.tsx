// SCENE 2 — WHAT IT IS. Tomorrow's weather as a distribution: every outcome (sunny, cloudy, rainy) and its chance
// (0.5, 0.3, 0.2). A 100% bar fills segment by segment: 0.5 + 0.3 + 0.2 = 1.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { SceneTitle } from "../components/Kit";
import { ease, Pop, useSpr } from "../components/Motion";
import { CloudGlyph, SunGlyph } from "../components/Prob";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { PROB } from "./S1Hook";

const C = theme.colors;
export const WEATHER = [
  { l: "SUNNY", p: 0.5, c: C.orange, icon: (s: number) => <SunGlyph size={s} /> },
  { l: "CLOUDY", p: 0.3, c: C.violet, icon: (s: number) => <CloudGlyph size={s} /> },
  { l: "RAINY", p: 0.2, c: C.cyan, icon: (s: number) => <CloudGlyph size={s} color={C.cyan} rain /> },
];

export const S2What: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s2");
  const EVERY = s.cueS(0, "every");
  const LIKELY = s.cueS(0, "likely");
  const ADD = s.cueS(1, "add");
  const ONE = s.cueS(1, "1,");
  const ROW_Y = [620, 750, 880];
  const fill = WEATHER.map((_, i) => ease(frame, [ADD - 6 + i * 10, ADD + 6 + i * 10], [0, 1], theme.ease.inOut));
  const BAR_X = 140;
  const BAR_W = 800;

  return (
    <AbsoluteFill>
      <SceneTitle label="WHAT IT IS" color={PROB} at={2} />
      <Pop at={6} x={540} y={420} from="up" dist={16}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 52, color: C.text, whiteSpace: "nowrap" }}>
          TOMORROW&apos;S <span style={{ color: PROB, textShadow: glowText(PROB, 0.5) }}>WEATHER</span>
        </div>
      </Pop>
      <Pop at={8} x={540} y={750} from="up" dist={20} cfg={theme.spring.smooth}>
        <div style={{ width: 760, height: 420, boxSizing: "border-box", borderRadius: 32, background: "linear-gradient(180deg, rgba(26,40,98,0.9), rgba(14,24,64,0.9))", border: `2px solid ${C.edge}` }} />
      </Pop>
      <Pop at={10} x={300} y={520} from="up" dist={10}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.22em", color: C.dim }}>OUTCOME</div>
      </Pop>
      <Pop at={LIKELY - 6} x={790} y={520} from="up" dist={10}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.22em", color: PROB }}>CHANCE</div>
      </Pop>
      {WEATHER.map((w, i) => {
        const p = spr(EVERY - 4 + i * 6, theme.spring.bouncy);
        const v = spr(LIKELY - 2 + i * 5, theme.spring.pop);
        if (p <= 0.001) return null;
        return (
          <React.Fragment key={w.l}>
            <div style={{ position: "absolute", left: 200, top: ROW_Y[i], transform: `translateY(-50%) translateX(${(1 - p) * -40}px)`, opacity: Math.min(1, p * 2), display: "flex", alignItems: "center", gap: 22 }}>
              {w.icon(80)}
              <span style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 44, color: C.text }}>{w.l}</span>
            </div>
            {v > 0.01 ? (
              <div style={{ position: "absolute", left: 790, top: ROW_Y[i], transform: `translate(-50%, -50%) scale(${interpolate(v, [0, 1], [0.5, 1])})`, opacity: Math.min(1, v * 2), fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 56, color: w.c, textShadow: glowText(w.c, 0.4) }}>{w.p.toFixed(1)}</div>
            ) : null}
          </React.Fragment>
        );
      })}
      {/* they add up to 1 */}
      <div style={{ position: "absolute", left: BAR_X, top: 1080, width: BAR_W, height: 90, boxSizing: "border-box", borderRadius: 24, border: `3px dashed ${alpha("#F3F7FF", 0.3)}`, opacity: ease(frame, [ADD - 12, ADD - 4], [0, 1]) }} />
      {WEATHER.map((w, i) => {
        const x0 = BAR_X + WEATHER.slice(0, i).reduce((a, b) => a + b.p, 0) * BAR_W;
        const wd = w.p * BAR_W * fill[i];
        if (wd < 1) return null;
        return (
          <div key={w.l} style={{ position: "absolute", left: x0, top: 1080, width: wd, height: 90, borderRadius: i === 0 ? "24px 0 0 24px" : i === 2 ? "0 24px 24px 0" : 0, background: alpha(w.c, 0.55), borderTop: `3px solid ${w.c}`, borderBottom: `3px solid ${w.c}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 36, color: C.text }}>
            {fill[i] > 0.6 ? `${Math.round(w.p * 100)}%` : ""}
          </div>
        );
      })}
      <Pop at={ONE - 4} x={540} y={1250} from="up" dist={20} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 48, color: C.text, whiteSpace: "nowrap" }}>
          <span style={{ fontFamily: theme.fonts.mono }}>0.5 + 0.3 + 0.2</span> = <span style={{ color: PROB, textShadow: glowText(PROB, 0.6) }}>1</span>
        </div>
      </Pop>
    </AbsoluteFill>
  );
};
