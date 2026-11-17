// SCENE 3 — THE EXAMPLE. Monthly salaries in a city: most people earn a little, a few earn a lot → skewed, not a bell.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Arrow, Person } from "../components/Icons";
import { Stamp } from "../components/Kit";
import { ease, Pop } from "../components/Motion";
import { AxisLabels, PopBars, POP_BINS, px } from "../components/Salary";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { RAW } from "./S1Hook";

const C = theme.colors;
const BASE = 880;

export const S3Example: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s3");
  const SAL = s.sent(1).from;
  const LITTLE = s.cueS(2, "little,");
  const LOT = s.cueS(2, "lot.");
  const SKEW = s.cueS(3, "skewed,");
  const grow = POP_BINS.map((_, i) => ease(frame, [SAL + i * 2, SAL + 16 + i * 2], [0, 1], theme.ease.out));
  const hiLeft = ease(frame, [LITTLE - 4, LITTLE + 6], [0, 1]);
  const hiTail = ease(frame, [LOT - 4, LOT + 6], [0, 1]);

  return (
    <AbsoluteFill>
      <Pop at={s.sent(0).from - 2} x={540} y={300} from="up" dist={12}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 26, letterSpacing: "0.24em", color: C.dim, whiteSpace: "nowrap" }}>AN EXAMPLE</div>
      </Pop>
      <Pop at={SAL - 4} x={540} y={400} from="up" dist={16} cfg={theme.spring.bouncy}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 52, color: C.text, whiteSpace: "nowrap" }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 2 }}>
            {[C.cyan, C.violet, C.orange].map((c, i) => (
              <Person key={i} height={70 - i * 6} shirt={c} />
            ))}
          </div>
          SALARIES <span style={{ color: RAW, textShadow: glowText(RAW, 0.4) }}>IN A CITY</span>
        </div>
      </Pop>
      {frame >= SAL - 6 ? (
        <>
          <PopBars base={BASE} h={300} p={grow} color={RAW} />
          <div style={{ position: "absolute", left: px(0) - 10, top: BASE + 1, width: px(160) - px(0) + 20, height: 3, background: alpha(C.text, 0.4) }} />
          <AxisLabels base={BASE} vals={[0, 40, 80, 120, 160]} at={px} p={ease(frame, [SAL, SAL + 12], [0, 1])} />
          <div style={{ position: "absolute", left: 0, right: 0, top: BASE + 70, textAlign: "center", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.16em", color: C.dim, opacity: ease(frame, [SAL + 6, SAL + 16], [0, 1]) }}>MONTHLY SALARY</div>
        </>
      ) : null}
      {/* most earn a little */}
      {hiLeft > 0.01 ? <div style={{ position: "absolute", left: px(0), top: BASE - 340, width: px(50) - px(0), height: 340, borderRadius: 16, background: alpha(C.cyan, 0.1 * hiLeft), border: `3px dashed ${alpha(C.cyan, 0.8 * hiLeft)}` }} /> : null}
      <Pop at={LITTLE - 2} x={px(25)} y={BASE - 375} from="down" dist={12} cfg={theme.spring.pop}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: C.cyan, textShadow: glowText(C.cyan, 0.4), whiteSpace: "nowrap" }}>MOST EARN A LITTLE</div>
      </Pop>
      {/* a few earn a lot */}
      {hiTail > 0.01 ? <div style={{ position: "absolute", left: px(90), top: BASE - 80, width: px(160) - px(90), height: 80, borderRadius: 14, background: alpha(RAW, 0.12 * hiTail), border: `3px dashed ${alpha(RAW, 0.9 * hiTail)}` }} /> : null}
      <Pop at={LOT - 2} x={px(125)} y={BASE - 150} from="down" dist={12} cfg={theme.spring.pop}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: RAW, textShadow: glowText(RAW, 0.4), whiteSpace: "nowrap" }}>
          A FEW EARN A LOT <div style={{ transform: "rotate(90deg)" }}><Arrow size={28} color={RAW} /></div>
        </div>
      </Pop>
      {frame >= SKEW - 6 ? <Stamp at={SKEW - 4} x={540} y={1110} color={RAW} rot={-6} size={52}>SKEWED, NOT A BELL</Stamp> : null}
    </AbsoluteFill>
  );
};

