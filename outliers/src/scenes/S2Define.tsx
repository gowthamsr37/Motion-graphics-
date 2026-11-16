// SCENE 2 — WHAT IS AN OUTLIER? The dots from the café: nine huddled together ("THE REST"), one far away.
// Definition card, distance arrow. "They come in two kinds" → OUTLIERS branches into MISTAKES and REAL BUT RARE.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { ease, exitP, Pop, useSpr } from "../components/Motion";
import { Pill, TreeHeader } from "../components/Nodes";
import { alpha, glowText, kindColor, theme } from "../theme";
import { useScene } from "../timing";
import { DOT_Y, dotX, dotY, FRIENDS, OUT_X } from "./S1Hook";

const C = theme.colors;
const O = kindColor.outlier;
export const OUT_HEADER = {
  parent: { label: "OUTLIERS", color: O },
  kids: [
    { label: "MISTAKES", color: kindColor.mistake },
    { label: "REAL BUT RARE", color: kindColor.rare },
  ],
};

export const S2Define: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s2");
  const VAL = s.cueS(0, "value");
  const FAR = s.cueS(0, "far");
  const REST = s.cueS(0, "rest");
  const KINDS = s.sent(1).from;
  const TWO = s.cueS(1, "two");
  const END = s.duration;

  const defOut = exitP(frame, KINDS - 6, 10);
  const dotsOut = exitP(frame, END - 12, 10);
  const arrow = ease(frame, [FAR - 4, FAR + 12], [0, 1], theme.ease.inOut);
  const rest = spr(REST - 4, theme.spring.smooth);
  const x0 = dotX(48) + 30;
  const x1 = OUT_X - 30;

  return (
    <AbsoluteFill>
      {/* the definition pill flies up into the header when the two kinds appear */}
      {frame < KINDS - 4 ? (
        <Pop at={4} x={540} y={640} from="scale" scaleFrom={0.4} cfg={theme.spring.bouncy}>
          <div style={{ transform: "scale(1.3)" }}>
            <Pill label="OUTLIERS" color={O} size={40} glow={0.9} />
          </div>
        </Pop>
      ) : (
        <TreeHeader {...OUT_HEADER} parentIn={KINDS - 4} zoomFrom={1.3} kidsIn={TWO - 14} activeAt={99999} activeIdx={0} prevIdx={null} />
      )}

      {defOut < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - defOut, transform: `translateY(${-20 * defOut}px)` }}>
          <Pop at={VAL - 4} x={540} y={808} from="up" dist={24}>
            <div style={{ textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 50, lineHeight: 1.12, color: C.text, whiteSpace: "nowrap" }}>
              a value that sits
              <br />
              <span style={{ color: O, fontWeight: 800, textShadow: glowText(O, 0.6), opacity: Math.min(1, spr(FAR - 3, theme.spring.pop) * 2) }}>far away</span> from the rest
            </div>
          </Pop>
          {/* "the rest" huddle */}
          {rest > 0.01 ? (
            <>
              <div style={{ position: "absolute", left: dotX(30) - 40, top: DOT_Y - 72, width: dotX(48) - dotX(30) + 80, height: 124, borderRadius: 62, border: `3px dashed ${alpha(kindColor.data, 0.7)}`, background: alpha(kindColor.data, 0.06), opacity: rest, transform: `scale(${interpolate(rest, [0, 1], [0.8, 1])})` }} />
              <div style={{ position: "absolute", left: (dotX(30) + dotX(48)) / 2, top: DOT_Y - 104, transform: "translate(-50%, -50%)", opacity: rest, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.22em", color: C.dim, whiteSpace: "nowrap" }}>THE REST</div>
            </>
          ) : null}
          {/* distance arrow */}
          {arrow > 0.01 ? (
            <>
              <svg width={1080} height={200} viewBox="0 0 1080 200" style={{ position: "absolute", left: 0, top: DOT_Y + 20, overflow: "visible" }}>
                <line x1={x0} y1={40} x2={x0 + (x1 - x0) * arrow} y2={40} stroke={O} strokeWidth={5} strokeDasharray="14 10" strokeLinecap="round" />
                <path d={`M${x0 + (x1 - x0) * arrow - 16} 28 L${x0 + (x1 - x0) * arrow + 2} 40 L${x0 + (x1 - x0) * arrow - 16} 52`} stroke={O} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div style={{ position: "absolute", left: (x0 + x1) / 2, top: DOT_Y + 100, transform: "translate(-50%, -50%)", opacity: arrow, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 32, color: O, textShadow: glowText(O, 0.4), letterSpacing: "0.04em" }}>FAR AWAY</div>
            </>
          ) : null}
        </AbsoluteFill>
      ) : null}

      {/* the dots (exactly where the café scene left them) */}
      {dotsOut < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - dotsOut }}>
          {FRIENDS.map((v, i) => (
            <div key={i} style={{ position: "absolute", left: dotX(v) - 15, top: dotY(i) - 15 + Math.sin(frame / 20 + i) * 2, width: 30, height: 30, borderRadius: 15, background: kindColor.data, boxShadow: `0 0 14px ${alpha(kindColor.data, 0.8)}` }} />
          ))}
          <div style={{ position: "absolute", left: OUT_X - 17, top: DOT_Y - 17, width: 34, height: 34, borderRadius: 17, background: O, boxShadow: `0 0 22px ${alpha(O, 0.9)}`, transform: `scale(${1 + Math.sin(frame / 7) * 0.06})` }} />
          <div style={{ position: "absolute", left: OUT_X - 40, top: DOT_Y - 40, width: 80, height: 80, borderRadius: 40, border: `4px solid ${O}`, opacity: 0.9 * (1 - ease(frame, [KINDS, KINDS + 10], [0, 1])), boxShadow: `0 0 20px ${alpha(O, 0.6)}` }} />
        </AbsoluteFill>
      ) : null}

      {/* the two kinds, previewed under the header */}
      {[
        { x: 290, label: "a typo, a glitch", c: kindColor.mistake },
        { x: 790, label: "a billionaire", c: kindColor.rare },
      ].map((k, i) => (
        <Pop key={k.label} at={TWO + 4 + i * 5} out={END - 10} x={k.x} y={560} from="up" dist={16}>
          <div style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 26, color: alpha(k.c, 0.95), whiteSpace: "nowrap", letterSpacing: "0.04em" }}>e.g. {k.label}</div>
        </Pop>
      ))}
    </AbsoluteFill>
  );
};
