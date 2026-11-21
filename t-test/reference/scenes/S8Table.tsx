// SCENE 8 — METHOD 1, THE p-VALUE (table: z → area). AREA TO THE LEFT OF z; the row −2.0 and the column 0.00 sweep in, the cell 0.0228
// pops; a mini curve shades that left tail (= 2.3%); then both tails and 2 × 0.0228 = p ≈ 0.046.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Badge, FnCurve, gx } from "../components/Curve";
import { ease, Pop, useSpr } from "../components/Motion";
import { CLAIM, StepTracker, TAIL, zf, ZFMAX, zGeo, ZTable } from "../components/ZKit";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const G = zGeo(1110, 200, 200, 880);

export const S8Table: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s8");
  const ROW = s.cueS(1, "row");
  const COL = s.cueS(1, "column");
  const CELL = s.cueS(1, "0.0228.");
  const PCT = s.cueS(2, "2.3%");
  const DBL = s.cueS(2, "double");
  const PV = s.cueS(2, "0.046,");
  const ALPHA = s.cueS(2, "alpha,");
  const tbl = spr(s.sent(0).from - 4, theme.spring.smooth);
  const draw = ease(frame, [CELL - 6, CELL + 20], [0, 1], theme.ease.inOut);
  const left = ease(frame, [CELL, CELL + 14], [0, 1]);
  const right = ease(frame, [DBL - 6, DBL + 10], [0, 1]);
  return (
    <AbsoluteFill>
      <StepTracker active={3} />
      <Pop at={s.sent(0).from - 2} x={540} y={400} from="up" dist={10}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.16em", color: C.dim, whiteSpace: "nowrap" }}>
          TWO-TAILED · METHOD 1 · p-VALUE · <span style={{ color: TAIL }}>z → AREA</span>
        </div>
      </Pop>
      <ZTable x={540} y={440} p={Math.min(1, tbl)} row={1} col={0} rowP={ease(frame, [ROW - 4, ROW + 12], [0, 1])} colP={ease(frame, [COL - 4, COL + 12], [0, 1])} cell={[1, 0]} cellP={ease(frame, [CELL - 6, CELL + 4], [0, 1])} />
      <FnCurve g={G} f={zf} fmax={ZFMAX} p={draw} color={CLAIM} fill={0.1} bands={[{ a: -3.6, b: -2, color: TAIL, opacity: 0.8, p: left }, { a: 2, b: 3.6, color: TAIL, opacity: 0.8, p: right }]} />
      <div style={{ position: "absolute", left: G.x0 - 10, top: G.base, width: (G.x1 - G.x0 + 20) * draw, height: 4, background: alpha(C.text, 0.4), borderRadius: 2 }} />
      <Badge x={gx(G, -2.7)} y={G.base - 56} p={spr(PCT - 4, theme.spring.pop)} color={TAIL} size={26}>
        0.0228
      </Badge>
      <Badge x={gx(G, 2.7)} y={G.base - 56} p={spr(DBL, theme.spring.pop)} color={TAIL} size={26}>
        0.0228
      </Badge>
      <Pop at={PCT - 4} x={540} y={1180} from="up" dist={10}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 36, color: C.text, whiteSpace: "nowrap" }}>
          ONE TAIL: <span style={{ fontFamily: theme.fonts.mono, color: TAIL }}>0.0228 = 2.3%</span>
        </div>
      </Pop>
      <Pop at={PV - 6} x={540} y={1268} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
        <div style={{ padding: "12px 34px", borderRadius: 999, background: alpha(TAIL, 0.2), border: `3px solid ${TAIL}`, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 44, color: C.text, whiteSpace: "nowrap" }}>
          p = 2 × 0.0228 = <span style={{ color: TAIL, textShadow: glowText(TAIL, 0.6) }}>0.046</span>
          <span style={{ color: C.dim, fontSize: 34 }}>{frame >= ALPHA - 4 ? "  < 0.05" : ""}</span>
        </div>
      </Pop>
    </AbsoluteFill>
  );
};
