// SCENE 6 — NO MEMORY. A stopwatch runs to 10:00 (the first 10 minutes of the curve shade orange: WAITED). That
// doesn't bring the next customer sooner: from minute 10 the same curve starts again, and the wait ahead still
// averages 15 minutes (bracket 10 → 25).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { ExpCurve, type ExpGeo, MinAxis, Stopwatch, tx } from "../components/Exp";
import { SceneTitle } from "../components/Kit";
import { ease, Mark, Pop, useSpr } from "../components/Motion";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { GAP, LONG, RATE } from "./S1Hook";

const C = theme.colors;
const G6: ExpGeo = { x0: 130, x1: 950, tmax: 60, base: 1250, h: 360 };

export const S6NoMemory: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s6");
  const WAIT = s.sent(1).from;
  const ALREADY = s.cueS(1, "already?");
  const NOT = s.cueS(1, "doesn't");
  const FROM = s.sent(2).from;
  const STILL = s.cueS(2, "still");
  const run = ease(frame, [WAIT + 2, ALREADY + 8], [0, 1], theme.ease.inOut);
  const mins = run * 10;
  const fresh = ease(frame, [FROM + 2, FROM + 30], [0, 1], theme.ease.inOut);
  const brace = spr(STILL - 4, theme.spring.bouncy);
  const watch = spr(6, theme.spring.bouncy);
  const BY = G6.base - G6.h - 46;
  const axisHi: Record<number, string> = {};
  if (run > 0) axisHi[10] = LONG;
  if (brace > 0.01) axisHi[25] = RATE;

  return (
    <AbsoluteFill>
      <SceneTitle label="NO MEMORY" color={RATE} at={2} />
      {/* stopwatch */}
      <div style={{ position: "absolute", left: 540, top: 470, transform: `translate(-50%, -50%) scale(${interpolate(watch, [0, 1], [0.6, 1])})`, opacity: Math.min(1, watch * 2), display: "flex", alignItems: "center", gap: 26 }}>
        <Stopwatch size={96} color={run > 0 ? LONG : GAP} frac={run * 10} />
        <div>
          <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.18em", color: C.dim }}>ALREADY WAITED</div>
          <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 76, color: run > 0 ? LONG : C.text, textShadow: run >= 1 ? glowText(LONG, 0.5) : undefined }}>
            {String(Math.floor(mins)).padStart(2, "0")}:{String(Math.floor((mins % 1) * 60)).padStart(2, "0")}
          </div>
        </div>
      </div>
      <Pop at={NOT - 4} x={540} y={640} from="up" dist={14} cfg={theme.spring.bouncy}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "10px 28px 10px 16px", borderRadius: 999, background: "rgba(10,20,64,0.9)", border: `3px solid ${alpha(C.red, 0.8)}` }}>
          <Mark kind="cross" at={NOT} size={34} color={C.red} width={8} />
          <span style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 34, color: C.text, whiteSpace: "nowrap" }}>NEXT CUSTOMER: NOT ANY SOONER</span>
        </div>
      </Pop>
      {/* the original curve, the waited part, and the fresh curve from minute 10 */}
      <ExpCurve g={G6} color={GAP} opacity={1 - 0.6 * fresh} dashed={fresh > 0.5} fill={0.1} bands={[{ a: 0, b: 10, color: LONG, p: run, opacity: 0.35 }]} />
      <ExpCurve g={G6} t0={10} p={fresh} color={GAP} width={7} fill={0.16} />
      <MinAxis g={G6} ticks={[0, 10, 25, 40, 60]} hi={axisHi} label="MINUTES" />
      {run > 0.3 ? <div style={{ position: "absolute", left: tx(G6, 5), top: G6.base - 40, transform: "translate(-50%, -50%)", opacity: ease(run, [0.3, 0.7], [0, 1]) * (1 - 0.5 * fresh), fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 18, letterSpacing: "0.12em", color: LONG }}>WAITED</div> : null}
      {/* the wait ahead still averages 15 minutes: 10 → 25 */}
      {brace > 0.01 ? (
        <>
          <div style={{ position: "absolute", left: tx(G6, 10), top: BY, width: (tx(G6, 25) - tx(G6, 10)) * Math.min(1, brace), height: 20, boxSizing: "border-box", borderTop: `5px solid ${RATE}`, borderLeft: `5px solid ${RATE}`, borderRight: brace > 0.9 ? `5px solid ${RATE}` : "none", borderRadius: "6px 6px 0 0" }} />
          <div style={{ position: "absolute", left: 540, top: BY - 46, transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, brace), [0, 1], [0.6, 1])})`, opacity: Math.min(1, brace * 2), fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 36, color: C.text, whiteSpace: "nowrap" }}>
              STILL <span style={{ color: RATE, textShadow: glowText(RATE, 0.5) }}>15 MIN</span> AHEAD, ON AVERAGE
          </div>
        </>
      ) : null}
    </AbsoluteFill>
  );
};
