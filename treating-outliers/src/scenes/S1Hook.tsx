// SCENE 1 — HOOK. An outlier on a dot plot; a cursor drags it toward the bin ("Just delete it?") → NOT SO FAST!
// It snaps back and glows: maybe the most important point in your data → "7 WAYS TO TREAT OUTLIERS".
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Stamp, TrashGlyph } from "../components/Kit";
import { Burst, ease, exitP, Pop, Ripple, shake, useSpr } from "../components/Motion";
import { Tag } from "../components/Nodes";
import { alpha, glowText, kindColor, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const O = kindColor.outlier;
const AXY = 1000;
const CLUSTER = [180, 214, 248, 248, 282, 316, 316, 350, 384, 418, 452, 520];
const STACK = [0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0];
const OX = 880;
const BIN = { x: 860, y: 1230 };

export const S1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s1");
  const FOUND = s.sent(0).from;
  const DEL = s.sent(1).from;
  const NOT = s.sent(2).from;
  const WRONG = s.sent(3).from;
  const IMP = s.cueS(3, "important");
  const SEVEN = s.sent(4).from;
  const END = s.duration;

  const drag = ease(frame, [DEL + 4, NOT - 2], [0, 1], theme.ease.inOut);
  const back = spr(NOT, theme.spring.bouncy);
  const k = drag * (1 - back);
  const ox = interpolate(k, [0, 1], [OX, BIN.x]);
  const oy = interpolate(k, [0, 1], [AXY, BIN.y - 70]);
  const bin = spr(DEL - 2, theme.spring.pop);
  const binOut = exitP(frame, NOT + 6, 10);
  const shNot = shake(frame, NOT, 12, 12);
  const glow = ease(frame, [IMP - 6, IMP + 8], [0, 1]);
  const plotOut = exitP(frame, SEVEN - 6, 12);
  const tapOn = ease(frame, [DEL - 6, DEL + 2], [0, 1]) * (1 - ease(frame, [NOT, NOT + 6], [0, 1]));
  const slam = spr(SEVEN - 2, theme.spring.pop);
  const slamOut = exitP(frame, END - 8, 8);

  return (
    <AbsoluteFill style={{ transform: `translate(${shNot.x}px, ${shNot.y}px)` }}>
      <Pop at={DEL - 2} out={NOT - 4} x={540} y={330} from="up" dist={24} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 74, color: C.text, whiteSpace: "nowrap" }}>
          JUST <span style={{ color: C.red, textShadow: glowText(C.red, 0.5) }}>DELETE</span> IT?
        </div>
      </Pop>
      <Pop at={WRONG - 2} out={SEVEN - 8} x={540} y={330} from="up" dist={24} cfg={theme.spring.bouncy}>
        <div style={{ textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 60, lineHeight: 1.1, color: C.text, whiteSpace: "nowrap" }}>
          DELETE THE WRONG ONE
          <br />
          AND YOU <span style={{ color: O, textShadow: glowText(O, 0.5) }}>LOSE THE STORY</span>
        </div>
      </Pop>

      {plotOut < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - plotOut, transform: `scale(${1 - plotOut * 0.08})`, transformOrigin: "540px 1000px" }}>
          <div style={{ position: "absolute", left: 120, top: AXY - 2, width: 840 * ease(frame, [2, 16], [0, 1]), height: 4, borderRadius: 2, background: alpha(C.text, 0.35) }} />
          {CLUSTER.map((x, i) => {
            const p = spr(FOUND - 8 + i * 2, theme.spring.pop);
            if (p <= 0.001) return null;
            return <div key={i} style={{ position: "absolute", left: x - 15, top: AXY - 15 - STACK[i] * 34, width: 30, height: 30, borderRadius: 15, background: kindColor.data, boxShadow: `0 0 12px ${alpha(kindColor.data, 0.8)}`, transform: `scale(${p})` }} />;
          })}
          {/* the bin */}
          {bin > 0.01 && binOut < 1 ? (
            <div style={{ position: "absolute", left: BIN.x - 60, top: BIN.y - 60, transform: `scale(${bin * (1 - binOut * 0.4)}) rotate(${frame >= NOT ? Math.sin(frame) * 8 * (1 - binOut) : 0}deg)`, opacity: 1 - binOut }}>
              <TrashGlyph size={120} color={alpha(C.text, 0.85)} />
            </div>
          ) : null}
          {/* the outlier */}
          {(() => {
            const p = spr(FOUND + 18, theme.spring.bouncy);
            if (p <= 0.001) return null;
            const sz = 34 + glow * 14;
            return (
              <>
                <div style={{ position: "absolute", left: ox - sz / 2, top: oy - sz / 2, width: sz, height: sz, borderRadius: sz / 2, background: O, boxShadow: `0 0 ${22 + glow * 30}px ${alpha(O, 0.9)}`, transform: `scale(${p})`, zIndex: 5 }} />
                <div style={{ position: "absolute", left: ox - 44, top: oy - 44, width: 88, height: 88, borderRadius: 44, border: `4px solid ${O}`, opacity: (1 - k) * Math.min(1, p), transform: `scale(${1 + Math.sin(frame / 6) * 0.06 + glow * 0.3})` }} />
              </>
            );
          })()}
          <Pop at={FOUND + 22} out={DEL - 4} x={OX} y={AXY - 90} from="down" dist={14}>
            <Tag color={O} size={28}>
              OUTLIER
            </Tag>
          </Pop>
          {/* the cursor */}
          {tapOn > 0.01 ? (
            <div style={{ position: "absolute", left: ox + 16, top: oy + 16, width: 56, height: 56, borderRadius: 28, background: "rgba(255,255,255,0.85)", border: `4px solid ${C.ink}`, opacity: tapOn, transform: `scale(${1 - drag * 0.1})`, boxShadow: "0 8px 24px rgba(0,0,0,0.4)", zIndex: 6 }} />
          ) : null}
          <Pop at={IMP - 4} x={680} y={AXY + 130} from="up" dist={20} cfg={theme.spring.bouncy}>
            <Tag color={O} size={30}>
              MAYBE YOUR MOST IMPORTANT POINT
            </Tag>
          </Pop>
        </AbsoluteFill>
      ) : null}
      <Ripple at={IMP} x={OX} y={AXY} color={O} size={340} rings={2} flat={0.5} />
      {frame < WRONG ? (
        <Stamp at={NOT} x={540} y={720} color={C.red} size={64} rot={-6}>
          NOT SO FAST!
        </Stamp>
      ) : null}

      {/* 7 WAYS TO TREAT OUTLIERS */}
      {slam > 0.001 && slamOut < 1 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 820, textAlign: "center", transform: `translateY(-50%)`, opacity: Math.min(1, slam * 2) * (1 - slamOut), fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1 }}>
          <div style={{ fontSize: 320, transform: `scale(${interpolate(slam, [0, 1], [1.8, 1])})`, background: `linear-gradient(180deg, #FFFFFF, ${O})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 30px ${alpha(O, 0.55)})` }}>7</div>
          <div style={{ marginTop: 10, fontSize: 64, color: C.text, opacity: Math.min(1, spr(SEVEN + 4, theme.spring.snappy) * 2) }}>WAYS TO TREAT</div>
          <div style={{ marginTop: 10, fontSize: 100, color: O, textShadow: glowText(O, 0.6), opacity: Math.min(1, spr(SEVEN + 8, theme.spring.pop) * 2) }}>OUTLIERS</div>
        </div>
      ) : null}
      <Burst at={SEVEN} x={540} y={720} color={O} count={22} radius={320} seed={7} />
    </AbsoluteFill>
  );
};
