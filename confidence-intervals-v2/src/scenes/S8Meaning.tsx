// SCENE 8 — WHAT 95% MEANS. The myth card ("95% CHANCE THIS RANGE IS RIGHT") is struck out; then 20 repeated surveys
// stack up as ranges around the green TRUE VALUE line: 19 catch it, 1 misses (orange) → ABOUT 95 IN 100 CATCH IT.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Interval, type Line, lx, SURVEYS, TRUE_MEAN } from "../components/CI";
import { SceneTitle } from "../components/Kit";
import { ease, Mark, Pop, useSpr } from "../components/Motion";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { MISS, RANGE, TRUE } from "./S1Hook";

const C = theme.colors;
const G: Line = { x0: 170, x1: 910, vmin: 27, vmax: 37 };
const Y0 = 640;
const DY = 30;

export const S8Meaning: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s8");
  const MYTH = s.sent(1).from;
  const NOTW = s.cueS(1, "not");
  const REP = s.sent(2).from;
  const CATCH = s.cueS(2, "catch");
  const myth = spr(MYTH - 4, theme.spring.bouncy);
  const strike = ease(frame, [NOTW + 4, NOTW + 16], [0, 1]);
  const dim = ease(frame, [REP, REP + 10], [0, 1]);
  const line = ease(frame, [REP - 4, REP + 10], [0, 1]);
  const shown = SURVEYS.filter((_, i) => frame >= REP + 4 + i * 4).length;
  const hits = SURVEYS.slice(0, shown).filter((v) => v.hit).length;
  return (
    <AbsoluteFill>
      <SceneTitle label="WHAT 95% REALLY MEANS" color={MISS} at={2} />
      {myth > 0.001 ? (
        <div style={{ position: "absolute", left: 90, top: 420, width: 900, height: 120, transform: "translateY(-50%)", opacity: Math.min(1, myth * 2) * (1 - dim * 0.45), boxSizing: "border-box", borderRadius: 26, background: alpha(C.red, 0.12), border: `3px solid ${alpha(C.red, 0.8)}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 20 }}>
          <span style={{ position: "relative", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 36, color: C.text, whiteSpace: "nowrap" }}>
            &ldquo;95% CHANCE THIS RANGE IS RIGHT&rdquo;
            <span style={{ position: "absolute", left: -8, top: "52%", width: `${strike * 104}%`, height: 6, borderRadius: 3, background: C.red, boxShadow: `0 0 10px ${C.red}` }} />
          </span>
          <Mark kind="cross" at={NOTW + 10} size={48} color={C.red} width={9} />
        </div>
      ) : null}
      <Pop at={REP - 2} x={540} y={540} from="up" dist={12}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 36, color: C.text, whiteSpace: "nowrap" }}>
          REPEAT THE SURVEY <span style={{ color: RANGE }}>MANY TIMES</span>
        </div>
      </Pop>
      {line > 0 ? (
        <>
          <div style={{ position: "absolute", left: lx(G, TRUE_MEAN) - 2, top: Y0 - 26, width: 4, height: (DY * 20 + 30) * line, background: TRUE, boxShadow: `0 0 12px ${TRUE}` }} />
          <div style={{ position: "absolute", left: lx(G, TRUE_MEAN), top: Y0 - 48, transform: "translate(-50%, -50%)", opacity: line, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.14em", color: TRUE, whiteSpace: "nowrap" }}>TRUE VALUE</div>
        </>
      ) : null}
      {SURVEYS.map((v, i) => {
        const p = spr(REP + 4 + i * 4, theme.spring.pop);
        return <Interval key={i} g={G} y={Y0 + i * DY} m={v.m} lo={v.lo} hi={v.hi} p={p} color={v.hit ? RANGE : MISS} dot={v.hit ? C.text : MISS} thick={7} />;
      })}
      {shown > 0 ? (
        <div style={{ position: "absolute", right: 70, top: Y0 + 4 * DY, textAlign: "right", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 40, color: TRUE, textShadow: glowText(TRUE, 0.4) }}>
          {hits}
          <div style={{ fontFamily: theme.fonts.body, fontSize: 16, letterSpacing: "0.12em", color: C.dim }}>OF {shown}</div>
        </div>
      ) : null}
      <Pop at={CATCH - 2} x={540} y={1300} from="up" dist={14} cfg={theme.spring.bouncy}>
        <div style={{ padding: "12px 30px", borderRadius: 999, background: alpha(TRUE, 0.18), border: `3px solid ${TRUE}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 36, color: C.text, whiteSpace: "nowrap" }}>
          ABOUT <span style={{ color: TRUE }}>95 IN 100</span> RANGES CATCH IT
        </div>
      </Pop>
    </AbsoluteFill>
  );
};
