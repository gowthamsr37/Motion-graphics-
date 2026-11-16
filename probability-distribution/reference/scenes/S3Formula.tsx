// SCENE 3 — THE FORMULA. z = (value − mean) ÷ SD assembles piece by piece over dashed slots, with a 3-step tracker.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { SceneTitle } from "../components/Kit";
import { ease, Mark, useSpr } from "../components/Motion";
import { alpha, glowText, kindColor, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const EQ_Y = 700;

export const Formula: React.FC<{ show: number[]; scale?: number; x?: number; y?: number }> = ({ show, scale = 1, x = 540, y = EQ_Y }) => {
  // show: [z=, value, − mean, bar, SD] progress 0..1
  const piece = (p: number, el: React.ReactNode, dashW: number) => (
    <span style={{ position: "relative", display: "inline-block", minWidth: dashW, textAlign: "center" }}>
      <span style={{ position: "absolute", inset: "6px 0", borderRadius: 14, border: `3px dashed ${alpha("#F3F7FF", 0.28)}`, opacity: 1 - p }} />
      <span style={{ display: "inline-block", opacity: Math.min(1, p * 2), transform: `translateY(${(1 - p) * 20}px) scale(${interpolate(p, [0, 1], [0.7, 1])})` }}>{el}</span>
    </span>
  );
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${scale})`, display: "flex", alignItems: "center", gap: 30, fontFamily: theme.fonts.mono, fontWeight: 800, color: C.text, whiteSpace: "nowrap" }}>
      {piece(show[0], <span style={{ fontSize: 110, color: C.green, textShadow: glowText(C.green, 0.6) }}>z =</span>, 220)}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 76 }}>
          {piece(show[1], <span>value</span>, 260)}
          {piece(show[2], <span>- <span style={{ color: kindColor.mean }}>mean</span></span>, 270)}
        </div>
        <div style={{ width: 560 * show[3], height: 8, borderRadius: 4, background: C.text, margin: "10px 0" }} />
        {piece(show[4], <span style={{ fontSize: 76, color: kindColor.sd }}>SD</span>, 140)}
      </div>
    </div>
  );
};

export const S3Formula: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s3");
  const VAL = s.cueS(1, "value,");
  const SUB = s.cueS(1, "subtract");
  const DIV = s.cueS(2, "divide");
  const STD = s.cueS(2, "standard");
  const pp = (t: number) => spr(t - 3, theme.spring.pop);
  const show = [pp(8), pp(VAL), pp(SUB + 4), ease(frame, [DIV - 2, DIV + 10], [0, 1], theme.ease.inOut), pp(STD)];
  const steps = [
    { n: 1, t: "TAKE THE VALUE", at: VAL, c: C.text },
    { n: 2, t: "SUBTRACT THE MEAN", at: SUB, c: kindColor.mean },
    { n: 3, t: "DIVIDE BY THE SD", at: DIV, c: kindColor.sd },
  ];
  const doneAt = [SUB, DIV, s.duration - 20];

  return (
    <AbsoluteFill>
      <SceneTitle label="THE FORMULA" color={C.green} at={2} />
      <Formula show={show} />
      {steps.map((st, i) => {
        const p = spr(st.at - 6, theme.spring.bouncy);
        const ghost = ease(frame, [4 + i * 4, 14 + i * 4], [0, 1]);
        const active = frame >= st.at - 4 && frame < doneAt[i] - 4;
        const done = frame >= doneAt[i] - 4;
        const y = 1010 + i * 108;
        return (
          <div key={st.n} style={{ position: "absolute", left: 540, top: y, transform: `translate(-50%, -50%) scale(${active ? 1.04 : 1})`, width: 660, height: 88, boxSizing: "border-box", borderRadius: 24, display: "flex", alignItems: "center", gap: 20, padding: "0 26px", background: p > 0.01 ? `linear-gradient(90deg, ${alpha(st.c === C.text ? "#E4EEFF" : st.c, 0.18)}, rgba(14,24,64,0.9))` : "transparent", border: p > 0.01 ? `3px solid ${active ? (st.c === C.text ? "#E4EEFF" : st.c) : alpha(st.c === C.text ? "#E4EEFF" : st.c, 0.45)}` : `3px dashed ${alpha("#F3F7FF", 0.22)}`, opacity: Math.max(ghost * 0.6, Math.min(1, p * 2)), boxShadow: active ? `0 0 24px ${alpha(st.c === C.text ? "#E4EEFF" : st.c, 0.35)}` : "none" }}>
            <div style={{ width: 52, height: 52, borderRadius: 26, flexShrink: 0, background: done ? C.green : alpha("#F3F7FF", 0.12), display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 28, color: done ? C.ink : C.text }}>
              {done ? <Mark kind="check" at={doneAt[i] - 4} size={34} color={C.ink} width={8} /> : st.n}
            </div>
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 36, color: C.text, whiteSpace: "nowrap", opacity: Math.min(1, p * 2) }}>{st.t}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
