// SCENE 5 — THE DISTRIBUTION. How big is too big? 150 fair dice, 60 rolls each: their scores drop as dots into bins of
// 1 → the chi-square shape; the 5-df curve traces over it (starts at 0, long tail right); df = 6 − 1 = 5.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { chiPdf, SIM } from "../components/Chi";
import { SceneTitle } from "../components/Kit";
import { ease, Pop } from "../components/Motion";
import { Pill } from "../components/Nodes";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { FAIR, GAP, OBSC } from "./S1Hook";

const C = theme.colors;
export const X0 = 150;
export const X1 = 930;
export const XMAX = 25;
export const sx = (v: number) => X0 + (v / XMAX) * (X1 - X0);
const BASE = 1150;
const DOT = 12;
const ROW = 14;
const BW = (X1 - X0) / XMAX;
const SLOT = (() => {
  const c: Record<number, number> = {};
  return SIM.map((v) => {
    const k = Math.min(XMAX - 1, Math.floor(v));
    c[k] = (c[k] ?? 0) + 1;
    return { k, i: c[k] - 1 };
  });
})();
// the density scaled to the dot heights (150 dots, bins of width 1)
const curveY = (v: number) => BASE - 2 - 150 * chiPdf(v, 5) * ROW;

export const S5Curve: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s5");
  const REPEAT = s.sent(1).from;
  const FORM = s.cueS(1, "form");
  const ZERO = s.cueS(2, "zero,");
  const TAILW = s.cueS(2, "tail");
  const FIVE = s.cueS(2, "five.");
  const axis = ease(frame, [REPEAT - 6, REPEAT + 6], [0, 1]);
  const draw = ease(frame, [FORM, FORM + 26], [0, 1], theme.ease.inOut);
  const n = Math.round(200 * draw);
  const d = Array.from({ length: n + 1 }, (_, i) => {
    const v = (i / 200) * XMAX;
    return `${i ? "L" : "M"}${sx(v).toFixed(1)} ${curveY(Math.max(0.05, v)).toFixed(1)}`;
  }).join(" ");

  return (
    <AbsoluteFill>
      <SceneTitle label="HOW BIG IS TOO BIG?" color={GAP} at={2} />
      <Pop at={6} out={REPEAT - 4} x={540} y={450} from="up" dist={14}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 42, color: C.text, whiteSpace: "nowrap" }}>
          EVEN A <span style={{ color: FAIR, textShadow: glowText(FAIR, 0.5) }}>FAIR DICE</span> IS NEVER PERFECT
        </div>
      </Pop>
      <Pop at={REPEAT - 2} x={540} y={450} from="up" dist={14} cfg={theme.spring.bouncy}>
        <Pill label="150 FAIR DICE · 60 ROLLS EACH" color={FAIR} size={30} glow={0.4} />
      </Pop>
      {axis > 0.001 ? (
        <>
          <div style={{ position: "absolute", left: X0 - 10, top: BASE + 1, width: (X1 - X0 + 20) * axis, height: 4, background: alpha(C.text, 0.4) }} />
          {[0, 5, 10, 15, 20, 25].map((v) => (
            <div key={v} style={{ position: "absolute", left: sx(v), top: BASE + 30, transform: "translate(-50%, -50%)", opacity: axis, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 22, color: C.dim }}>{v}</div>
          ))}
          <div style={{ position: "absolute", left: 0, right: 0, top: BASE + 66, textAlign: "center", opacity: axis, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.18em", color: C.dim }}>CHI-SQUARE SCORE OF A FAIR DICE</div>
        </>
      ) : null}
      {SIM.map((v, j) => {
        const { k, i } = SLOT[j];
        const t = REPEAT + 4 + j * 0.45;
        const dd = ease(frame, [t, t + 8], [0, 1], theme.ease.in);
        if (dd <= 0.001) return null;
        const x = X0 + (k + 0.5) * BW - DOT / 2;
        const y = BASE - 2 - (i + 1) * ROW;
        return <div key={j} style={{ position: "absolute", left: x, top: interpolate(dd, [0, 1], [640, y]), width: DOT, height: DOT, borderRadius: DOT / 2, background: OBSC, boxShadow: `0 0 5px ${alpha(OBSC, 0.7)}` }} />;
      })}
      {draw > 0.001 ? (
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <path d={d} fill="none" stroke={GAP} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : null}
      <Pop at={ZERO - 4} x={sx(0) + 90} y={BASE - 420} from="up" dist={10}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.1em", color: C.text, whiteSpace: "nowrap" }}>STARTS AT 0</div>
      </Pop>
      <Pop at={TAILW - 4} x={sx(17)} y={BASE - 120} from="right" dist={12}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 34, color: GAP, textShadow: glowText(GAP, 0.5), whiteSpace: "nowrap" }}>LONG TAIL</div>
      </Pop>
      <Pop at={FIVE - 10} x={540} y={540} from="up" dist={12} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 40, color: C.text, whiteSpace: "nowrap" }}>
          df = 6 faces − 1 = <span style={{ color: GAP, textShadow: glowText(GAP, 0.5) }}>5</span>
        </div>
      </Pop>
    </AbsoluteFill>
  );
};
