// Notebook end card: a robot doodle, a hand-drawn FOLLOW button that gets "tapped" by a sketched hand cursor,
// the handle written in pen, "for data science made simple" with a marker swipe, and a TOMORROW sticky note.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Robot } from "./Doodles";
import { Hi, Layer, Sketch, Sticky, Write, WriteAt } from "./NB";
import { useSpr } from "./Motion";
import { hand, HANDLE, nb, STYLE, theme } from "../theme";

export const NBCta: React.FC<{ TEASE: number; FOL: number; FOLW: number; SIMPLE: number; tomorrow: string }> = ({ TEASE, FOL, FOLW, SIMPLE, tomorrow }) => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const btn = spr(FOLW - 6, theme.spring.bouncy);
  const tap = frame >= FOLW + 10 && frame < FOLW + 18;
  const tapped = frame >= FOLW + 14;
  const hx = interpolate(frame, [FOLW - 4, FOLW + 12], [760, 600], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: theme.ease.out });
  const hy = interpolate(frame, [FOLW - 4, FOLW + 12], [1060, 905], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: theme.ease.out });
  return (
    <>
      <Sticky x={540} y={360} w={800} h={180} at={TEASE - 2} rot={-2} color={nb.stickyBlue}>
        <div style={{ fontFamily: hand.body, fontSize: 30, color: nb.pencil, letterSpacing: "0.12em" }}>TOMORROW</div>
        <div style={{ fontFamily: hand.title, fontWeight: 700, fontSize: 50, color: nb.ink, lineHeight: 1, whiteSpace: "nowrap" }}>{tomorrow}</div>
      </Sticky>
      <Layer>
        <Robot x={540} y={640} s={190} at={FOL - 4} />
      </Layer>
      {btn > 0.001 ? (
        <div style={{ position: "absolute", left: 540, top: 880, transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, btn), [0, 1], [0.6, 1]) * (tap ? 0.94 : 1)})`, opacity: Math.min(1, btn * 2) }}>
          <svg width={420} height={130} viewBox="0 0 420 130" style={{ position: "absolute", left: -10, top: -5, overflow: "visible" }}>
            <Sketch s={{ k: "rect", x: 10, y: 10, w: 400, h: 110 }} p={1} o={{ color: nb.ink, width: 5, fill: tapped ? nb.green : nb.red, fillStyle: "solid", seed: 61, rough: 1.3 }} />
          </svg>
          <div style={{ position: "relative", width: 400, height: 120, display: "flex", alignItems: "center", justifyContent: "center", gap: 14, fontFamily: hand.title, fontWeight: 700, fontSize: 76, color: STYLE === "chalk" ? nb.paperDeep : "#FFFFFF" }}>
            {tapped ? "Following!" : "+ Follow"}
          </div>
        </div>
      ) : null}
      {/* sketched hand cursor */}
      {frame >= FOLW - 4 && frame < FOLW + 40 ? (
        <svg width={90} height={110} viewBox="0 0 90 110" style={{ position: "absolute", left: hx, top: hy, overflow: "visible", transform: `scale(${tap ? 0.9 : 1})` }}>
          <path d="M30 8 Q38 4 42 12 L44 50 L56 46 Q66 46 66 56 L70 50 Q80 50 80 62 L80 84 Q78 104 56 104 L42 104 Q28 102 20 86 L8 62 Q6 52 16 54 L28 66 L26 14 Q26 8 30 8 Z" fill={nb.hand} stroke={nb.ink} strokeWidth={4} strokeLinejoin="round" />
        </svg>
      ) : null}
      <WriteAt x={540} y={1035} at={FOLW + 6} size={58} color={nb.blue} font="body" cps={34}>
        {HANDLE}
      </WriteAt>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1150, textAlign: "center" }}>
        <Write at={SIMPLE - 22} size={64} pencil={false} cps={40} style={{ marginRight: 18 }}>
          for data science
        </Write>
        <Hi at={SIMPLE - 4}>
          <Write at={SIMPLE - 8} size={78} color={nb.red} pencil={false} cps={40}>
            made simple!
          </Write>
        </Hi>
      </div>
    </>
  );
};
