// SCENE 6 — EXAMPLE 2: AVERAGES. A food-app card (100 ORDERS · AVERAGE 32 MIN) → 95% CONFIDENCE INTERVAL: 30 TO 34
// MINUTES on a minutes line.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { type Line, lx } from "../components/CI";
import { ClockGlyph } from "../components/Icons";
import { ease, Pop, useSpr } from "../components/Motion";
import { ExampleTag } from "../components/Simple";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { EST, RANGE } from "./S1Hook";
import { PctAxis, Range } from "./S5Poll";

const C = theme.colors;
const G: Line = { x0: 150, x1: 930, vmin: 26, vmax: 38 };
const Y = 1010;

export const S6Average: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s6");
  const APP = s.sent(1).from;
  const AVG = s.cueS(1, "32");
  const CI = s.sent(2).from;
  const card = spr(APP - 4, theme.spring.bouncy);
  const axis = ease(frame, [AVG - 10, AVG + 6], [0, 1]);
  const dot = spr(AVG - 2, theme.spring.pop);
  const grow = spr(s.cueS(2, "30") - 4, theme.spring.bouncy);
  return (
    <AbsoluteFill>
      <ExampleTag n={2} at={s.sent(0).from} color={EST} label="AVERAGES" y={290} />
      {card > 0.001 ? (
        <div style={{ position: "absolute", left: 540, top: 540, width: 760, height: 290, transform: `translate(-50%, -50%) scale(${0.6 + 0.4 * Math.min(1, card)})`, opacity: Math.min(1, card * 2), boxSizing: "border-box", borderRadius: 30, background: "linear-gradient(180deg, rgba(30,44,104,0.95), rgba(14,24,64,0.95))", border: `2px solid ${alpha(EST, 0.7)}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 34 }}>
          <ClockGlyph size={110} color={EST} />
          <div>
            <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.16em", color: C.dim }}>FOOD APP · 100 ORDERS</div>
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: C.text, marginTop: 6 }}>AVERAGE DELIVERY</div>
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 84, lineHeight: 1, color: C.text, textShadow: glowText(EST, 0.5), opacity: Math.min(1, dot * 2) }}>
              32 <span style={{ fontSize: 40, color: EST }}>MIN</span>
            </div>
            <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.12em", color: C.dim, marginTop: 8 }}>
              SPREAD (SD): <span style={{ color: C.green }}>10 MIN</span>
            </div>
          </div>
        </div>
      ) : null}
      <PctAxis g={G} y={Y} ticks={[26, 28, 30, 32, 34, 36, 38]} p={axis} label="DELIVERY TIME (MINUTES)" unit="" />
      <Range g={G} y={Y - 70} m={32} lo={30} hi={34} p={grow} />
      {dot > 0.01 ? <div style={{ position: "absolute", left: lx(G, 32) - 16, top: Y - 86, width: 32, height: 32, borderRadius: 16, background: EST, border: `3px solid ${C.text}`, boxShadow: `0 0 16px ${EST}`, transform: `scale(${dot})` }} /> : null}
      <Pop at={CI - 2} x={540} y={780} from="up" dist={12} cfg={theme.spring.bouncy}>
        <div style={{ padding: "12px 30px", borderRadius: 999, background: alpha(RANGE, 0.2), border: `3px solid ${RANGE}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 38, color: C.text, whiteSpace: "nowrap" }}>
          95% CI: <span style={{ color: RANGE }}>30 TO 34 MINUTES</span>
        </div>
      </Pop>
    </AbsoluteFill>
  );
};
