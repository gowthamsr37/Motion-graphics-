// SCENE 7 — EXAMPLE 3: A NEW DRUG. Blood-pressure drop: DRUG (tall bar) vs PLACEBO (shorter), a GAP bracket and
// p = 0.02 → IF THE DRUG DID NOTHING, A GAP THIS BIG: ONLY 2% OF THE TIME → SIGNIFICANT. (Bars are illustrative.)
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { ease, Mark, Pop, useSpr } from "../components/Motion";
import { ExampleTag } from "../components/Simple";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { LINE, NULLC, PPill } from "./S1Hook";
import { PillIcon } from "./S3Null";

const C = theme.colors;
const BASE = 1000;

export const S7Drug: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s7");
  const PAT = s.sent(1).from;
  const PLAC = s.cueS(1, "placebo,");
  const PW = s.cueS(1, "0.02.");
  const IF = s.sent(2).from;
  const SIG = s.cueS(2, "significant.");
  const bars = [
    { x: 360, h: 330, c: C.violet, l: "DRUG", at: PAT + 10 },
    { x: 720, h: 190, c: NULLC, l: "PLACEBO", at: PLAC - 4 },
  ];
  return (
    <AbsoluteFill>
      <ExampleTag n={3} at={s.sent(0).from} color={LINE} label="A NEW DRUG" y={290} />
      <Pop at={s.sent(0).from + 6} x={540} y={410} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
        <PillIcon w={180} />
      </Pop>
      {bars.map((b) => {
        const g = ease(frame, [b.at - 4, b.at + 22], [0, 1], theme.ease.out);
        if (g <= 0) return null;
        return (
          <React.Fragment key={b.l}>
            <div style={{ position: "absolute", left: b.x - 110, top: BASE - b.h * g, width: 220, height: b.h * g, borderRadius: "18px 18px 4px 4px", background: `linear-gradient(180deg, ${alpha(b.c, 0.75)}, ${alpha(b.c, 0.3)})`, border: `3px solid ${b.c}`, boxSizing: "border-box" }} />
            <div style={{ position: "absolute", left: b.x, top: BASE + 40, transform: "translate(-50%, -50%)", opacity: g, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 34, color: b.c }}>{b.l}</div>
          </React.Fragment>
        );
      })}
      <div style={{ position: "absolute", left: 200, top: BASE, width: 680, height: 4, background: alpha(C.text, 0.4), opacity: ease(frame, [PAT, PAT + 10], [0, 1]) }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: BASE + 84, textAlign: "center", opacity: ease(frame, [PAT + 6, PAT + 16], [0, 1]), fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.16em", color: C.dim }}>BLOOD PRESSURE DROP</div>
      {/* the gap */}
      {frame >= PLAC + 14 ? (
        <>
          <div style={{ position: "absolute", left: 870, top: BASE - 330, width: 4, height: 140 * Math.min(1, ease(frame, [PLAC + 14, PLAC + 26], [0, 1])), background: C.orange }} />
          <div style={{ position: "absolute", left: 852, top: BASE - 330, width: 40, height: 4, background: C.orange }} />
          <div style={{ position: "absolute", left: 852, top: BASE - 190, width: 40, height: 4, background: C.orange, opacity: ease(frame, [PLAC + 22, PLAC + 26], [0, 1]) }} />
          <div style={{ position: "absolute", left: 610, top: BASE - 330, width: 260, height: 2, borderTop: `2px dashed ${alpha(C.orange, 0.6)}` }} />
          <div style={{ position: "absolute", left: 905, top: BASE - 260, transform: "translateY(-50%)", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.12em", color: C.orange }}>GAP</div>
        </>
      ) : null}
      <Pop at={PW - 4} x={540} y={540} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
        <PPill v="0.02" size={56} color={LINE} />
      </Pop>
      <Pop at={IF - 2} x={540} y={1170} from="up" dist={12} cfg={theme.spring.bouncy}>
        <div style={{ textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 32, color: C.text, lineHeight: 1.25, whiteSpace: "nowrap" }}>
          IF THE DRUG DID <span style={{ color: NULLC }}>NOTHING</span>,<br />A GAP THIS BIG: ONLY <span style={{ color: C.orange }}>2% OF THE TIME</span>
        </div>
      </Pop>
      {spr(SIG - 4, theme.spring.pop) > 0.01 ? (
        <div style={{ position: "absolute", left: 540, top: 1300, transform: "translate(-50%, -50%)", display: "flex", alignItems: "center", gap: 14, padding: "10px 28px", borderRadius: 999, background: alpha(LINE, 0.2), border: `3px solid ${LINE}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 36, color: C.text, opacity: Math.min(1, spr(SIG - 4, theme.spring.pop) * 2), textShadow: glowText(LINE, 0.4) }}>
          <Mark kind="check" at={SIG} size={36} color={LINE} width={8} />
          SIGNIFICANT
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
