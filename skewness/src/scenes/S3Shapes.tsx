// SCENE 3 — THREE SHAPES. Symmetric (heights: both sides match) · right-skewed (salaries: a few huge values, tail right)
// · left-skewed (easy-test scores: most score high, a few trail off left). Each card has a mini histogram.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Bars, type Geo, LEFT, RIGHT, SYM } from "../components/Hist";
import { SceneTitle } from "../components/Kit";
import { ease, useSpr } from "../components/Motion";
import { alpha, glowText, kindColor, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const O = kindColor.outlier;
export const SHAPE = { sym: "#E4EEFF", right: O, left: "#60A5FA" };
const CARDS = [
  { y: 640, title: "SYMMETRIC", col: SHAPE.sym, ex: "e.g. heights in a class", note: "BOTH SIDES MATCH", counts: SYM, tail: undefined as number | undefined, tailLeft: undefined as number | undefined, word: { i: 1, w: "Symmetric," } },
  { y: 880, title: "RIGHT-SKEWED", col: SHAPE.right, ex: "e.g. salaries", note: "LONG TAIL TO THE RIGHT", counts: RIGHT, tail: 6, tailLeft: undefined, word: { i: 2, w: "Right-skewed," } },
  { y: 1120, title: "LEFT-SKEWED", col: SHAPE.left, ex: "e.g. scores on an easy test", note: "LONG TAIL TO THE LEFT", counts: LEFT, tail: undefined, tailLeft: 5, word: { i: 3, w: "Left-skewed," } },
];

export const S3Shapes: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s3");

  return (
    <AbsoluteFill>
      <SceneTitle label="THE THREE SHAPES" color={O} at={2} />
      {CARDS.map((c, k) => {
        const at = s.cueS(c.word.i, c.word.w) - 4;
        const p = spr(at, theme.spring.smooth);
        if (p <= 0.001) return null;
        const grow = c.counts.map((_, i) => ease(frame, [at + 4 + i * 1.5, at + 16 + i * 1.5], [0, 1], theme.ease.out));
        const g: Geo = { x0: 120, bw: 18, gap: 4, base: c.y + 82, maxH: 140, maxC: 13 };
        return (
          <React.Fragment key={c.title}>
            <div style={{ position: "absolute", left: 90, top: c.y - 100, width: 900, height: 200, boxSizing: "border-box", borderRadius: 30, background: `linear-gradient(90deg, ${alpha(c.col, 0.14)}, rgba(14,24,64,0.9) 50%)`, border: `2.5px solid ${alpha(c.col, 0.7)}`, boxShadow: `0 0 24px ${alpha(c.col, 0.15)}`, opacity: Math.min(1, p * 1.6), transform: `translateX(${(1 - p) * 60}px)` }}>
              <div style={{ position: "absolute", left: 340, top: 34 }}>
                <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 42, color: c.col, textShadow: glowText(c.col, 0.35), whiteSpace: "nowrap" }}>{c.title}</div>
                <div style={{ marginTop: 8, fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 27, color: C.text, whiteSpace: "nowrap" }}>{c.ex}</div>
                <div style={{ marginTop: 12, display: "inline-block", padding: "5px 14px", borderRadius: 10, background: alpha(c.col, 0.16), border: `1.5px solid ${alpha(c.col, 0.6)}`, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 18, letterSpacing: "0.16em", color: C.text, opacity: ease(frame, [at + 14, at + 24], [0, 1]) }}>{c.note}</div>
              </div>
            </div>
            <div style={{ position: "absolute", left: 0, top: 0, opacity: Math.min(1, p * 1.6) }}>
              <div style={{ position: "absolute", left: 114, top: c.y + 84, width: 276, height: 3, background: alpha(C.text, 0.35) }} />
              <Bars g={g} counts={c.counts} p={grow} color={k === 0 ? alpha("#E4EEFF", 0.85) : C.cyan} tailColor={c.col} tail={c.tail} tailLeft={c.tailLeft} />
            </div>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

