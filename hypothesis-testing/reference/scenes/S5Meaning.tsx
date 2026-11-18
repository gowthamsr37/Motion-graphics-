// SCENE 5 — WHAT 95% MEANS. Not a 95% chance for this one range. Repeat the survey: 20 simulated surveys, 20 ranges
// stack up; 19 catch the true average (green line), 1 misses (orange) → about 95 of 100 ranges catch the truth.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Axis, Interval, type Line, lx, SURVEYS, TRUE_MEAN } from "../components/CI";
import { SceneTitle } from "../components/Kit";
import { ease, Mark, Pop, useSpr } from "../components/Motion";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { MISS, RANGE, TRUE } from "./S1Hook";

const C = theme.colors;
const G: Line = { x0: 170, x1: 910, vmin: 27, vmax: 37 };
const Y0 = 640;
const STEP = 29;

export const S5Meaning: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s5");
  const NOT = s.sent(1).from;
  const REPEAT = s.sent(2).from;
  const CATCH = s.cueS(2, "catch");
  const shown = SURVEYS.filter((_, i) => frame >= REPEAT + 6 + i * 4).length;
  const caught = SURVEYS.filter((v, i) => v.hit && frame >= REPEAT + 6 + i * 4).length;
  const yEnd = Y0 + 19 * STEP;
  return (
    <AbsoluteFill>
      <SceneTitle label="WHAT DOES 95% MEAN?" color={RANGE} at={2} />
      <Pop at={NOT - 2} out={REPEAT - 4} x={540} y={470} from="up" dist={12} cfg={theme.spring.bouncy}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "10px 26px 10px 16px", borderRadius: 999, background: "rgba(10,20,64,0.9)", border: `3px solid ${alpha(C.red, 0.8)}` }}>
          <Mark kind="cross" at={NOT + 4} size={32} color={C.red} width={8} />
          <span style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 32, color: C.text, whiteSpace: "nowrap" }}>NOT "95% SURE ABOUT THIS ONE RANGE"</span>
        </div>
      </Pop>
      <Pop at={REPEAT - 2} x={540} y={470} from="up" dist={12} cfg={theme.spring.bouncy}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "10px 26px 10px 16px", borderRadius: 999, background: "rgba(10,20,64,0.9)", border: `3px solid ${alpha(TRUE, 0.8)}` }}>
          <Mark kind="check" at={REPEAT + 4} size={32} color={TRUE} width={8} />
          <span style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 32, color: C.text, whiteSpace: "nowrap" }}>REPEAT IT: <span style={{ color: TRUE }}>95 IN 100</span> RANGES CATCH IT</span>
        </div>
      </Pop>
      {/* the true average */}
      <div style={{ position: "absolute", left: lx(G, TRUE_MEAN) - 2, top: Y0 - 30, width: 4, height: (yEnd - Y0 + 60) * ease(frame, [8, 24], [0, 1]), background: TRUE, boxShadow: `0 0 12px ${TRUE}` }} />
      <div style={{ position: "absolute", left: lx(G, TRUE_MEAN), top: Y0 - 54, transform: "translate(-50%, -50%)", opacity: ease(frame, [14, 24], [0, 1]), fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.12em", color: TRUE, whiteSpace: "nowrap" }}>TRUE AVERAGE (32)</div>
      {/* one survey, then twenty */}
      {SURVEYS.map((v, i) => {
        const at = i === 0 ? 20 : REPEAT + 6 + i * 4;
        const p = ease(frame, [at, at + 10], [0, 1], theme.ease.out);
        return <Interval key={i} g={G} y={Y0 + i * STEP} m={v.m} lo={v.lo} hi={v.hi} p={p} color={v.hit ? RANGE : MISS} dot={v.hit ? C.text : MISS} thick={6} />;
      })}
      <Axis g={G} y={yEnd + 50} ticks={[28, 30, 32, 34, 36]} p={ease(frame, [8, 20], [0, 1])} hi={{ 32: TRUE }} />
      {shown > 1 ? (
        <div style={{ position: "absolute", left: 930, top: Y0 + 9 * STEP, transform: "translate(-100%, -50%)", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 30, color: C.text, textAlign: "right", lineHeight: 1.2 }}>
          <div style={{ color: TRUE, textShadow: glowText(TRUE, 0.4) }}>{caught}</div>
          <div style={{ fontSize: 18, color: C.dim }}>OF {shown}</div>
        </div>
      ) : null}
      <Pop at={CATCH + 6} x={lx(G, SURVEYS[9].lo) - 24} y={Y0 + 9 * STEP} from="right" dist={10}>
        <div style={{ transform: "translateX(-50%)", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.1em", color: MISS, whiteSpace: "nowrap" }}>MISSED</div>
      </Pop>
    </AbsoluteFill>
  );
};
