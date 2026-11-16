// SCENE 1 — HOOK. Ten days of your commute (cards with a bus), most take 20–30 min, one traffic jam: 60.
// The cards drop onto a minutes axis: RANGE = 42 MIN (dragged by the jam) vs IQR = 8 MIN → "LET'S DECODE THE IQR".
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Bus } from "../components/Icons";
import { Burst, ease, exitP, Pop, Ripple, shake, useSpr } from "../components/Motion";
import { Tag } from "../components/Nodes";
import { COMMUTE, JAM, Q1, Q3, stackIdx } from "../data";
import { alpha, glowText, kindColor, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const O = kindColor.outlier;
const V = kindColor.spread;
const AXY = 1090;
export const AX = (v: number) => 110 + (v - 15) * 17;
const CARD = (i: number) => ({ x: 140 + (i % 5) * 200, y: 720 + Math.floor(i / 5) * 190 });

const Line: React.FC<{ at: number; out: number; y: number; pre: string; word: string; color: string }> = ({ at, out, y, pre, word, color }) => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const a = spr(at - 3, theme.spring.snappy);
  const b = spr(at + 1, theme.spring.pop);
  const e = exitP(frame, out, 8);
  const under = ease(frame, [at + 4, at + 14], [0, 1]);
  if (a <= 0.001 || e >= 1) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", gap: 22, transform: `translateY(-50%) translateY(${-30 * e}px)`, opacity: 1 - e, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 70, letterSpacing: "-0.02em", lineHeight: 1 }}>
      <span style={{ color: C.text, opacity: a, transform: `translateY(${(1 - a) * 40}px)` }}>{pre}</span>
      <span style={{ position: "relative", color, opacity: Math.min(1, b * 1.5), transform: `scale(${interpolate(b, [0, 1], [1.35, 1])})`, textShadow: glowText(color, 0.7) }}>
        {word}
        <span style={{ position: "absolute", left: 0, bottom: -10, height: 8, borderRadius: 4, width: `${under * 100}%`, background: color }} />
      </span>
    </div>
  );
};

export const S1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s1");
  const H0 = s.sent(0).from;
  const MOST = s.sent(1).from;
  const JAMW = s.cueS(2, "jam:");
  const VARY = s.sent(3).from;
  const R42 = s.cueS(4, "42");
  const I8 = s.cueS(5, "8.");
  const DEC = s.cueS(6, "decode");
  const END = s.duration;

  const toDots = ease(frame, [VARY - 4, VARY + 14], [0, 1], theme.ease.inOut);
  const most = ease(frame, [MOST + 4, MOST + 14], [0, 1]);
  const jamOn = frame >= JAMW - 2;
  const sh = shake(frame, JAMW - 2, 12, 10);
  const plotOut = exitP(frame, DEC - 6, 12);
  const range = ease(frame, [R42 - 8, R42 + 8], [0, 1], theme.ease.inOut);
  const box = spr(I8 - 4, theme.spring.bouncy);
  const slamA = spr(DEC - 4, theme.spring.snappy);
  const slamB = spr(DEC + 2, theme.spring.pop);
  const glitch = frame >= DEC + 2 && frame < DEC + 10 ? (frame % 2 ? 1 : -1) : 0;
  const ax = ease(frame, [VARY - 8, VARY + 6], [0, 1], theme.ease.inOut);

  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      <Line at={H0} out={VARY - 6} y={300} pre="YOUR" word="COMMUTE" color={C.cyan} />
      <Pop at={VARY - 2} out={DEC - 8} x={540} y={330} from="up" dist={24} cfg={theme.spring.bouncy}>
        <div style={{ textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 62, lineHeight: 1.08, color: C.text, whiteSpace: "nowrap" }}>
          HOW MUCH DOES IT
          <br />
          REALLY <span style={{ color: C.cyan, textShadow: glowText(C.cyan, 0.6) }}>VARY?</span>
        </div>
      </Pop>

      {plotOut < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - plotOut, transform: `scale(${1 - plotOut * 0.08})`, transformOrigin: "540px 1000px" }}>
          {/* minutes axis */}
          <div style={{ position: "absolute", left: AX(15) - 10, top: AXY - 2, width: (AX(65) - AX(15) + 20) * ax, height: 4, borderRadius: 2, background: alpha(C.text, 0.35) }} />
          {[20, 30, 40, 50, 60].map((v) => (
            <div key={v} style={{ position: "absolute", left: AX(v), top: AXY + 34, transform: "translate(-50%, -50%)", fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 24, color: C.dim, opacity: ax }}>{v}</div>
          ))}
          <div style={{ position: "absolute", left: AX(65), top: AXY + 34, transform: "translate(-50%, -50%)", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 18, letterSpacing: "0.16em", color: C.dim, opacity: ax }}>MIN</div>

          {/* range: dragged out by the jam */}
          {range > 0.01 ? (
            <>
              <div style={{ position: "absolute", left: AX(18), top: AXY + 62, width: (AX(JAM) - AX(18)) * range, height: 18, borderLeft: `4px dashed ${O}`, borderRight: range > 0.97 ? `4px dashed ${O}` : undefined, borderBottom: `4px dashed ${O}`, borderRadius: "0 0 8px 8px" }} />
              <div style={{ position: "absolute", left: (AX(18) + AX(JAM)) / 2, top: AXY + 118, transform: "translate(-50%, -50%)", opacity: range, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 36, color: O, textShadow: glowText(O, 0.4), whiteSpace: "nowrap" }}>RANGE = 42 MIN</div>
            </>
          ) : null}
          {/* IQR: the middle half */}
          {box > 0.01 ? (
            <>
              <div style={{ position: "absolute", left: AX(Q1) - 22, top: AXY - 76, width: (AX(Q3) - AX(Q1) + 44) * Math.min(1, box), height: 100, boxSizing: "border-box", borderRadius: 16, background: alpha(V, 0.2), border: `4px solid ${V}`, boxShadow: `0 0 30px ${alpha(V, 0.45)}`, opacity: Math.min(1, box * 2) }} />
              <div style={{ position: "absolute", left: (AX(Q1) + AX(Q3)) / 2, top: AXY - 122, transform: `translate(-50%, -50%) scale(${interpolate(box, [0, 1], [0.5, 1])})`, opacity: Math.min(1, box * 2), fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 42, color: V, textShadow: glowText(V, 0.6), whiteSpace: "nowrap" }}>IQR = 8 MIN</div>
            </>
          ) : null}

          {/* the ten days: cards, then dots */}
          {COMMUTE.map((v, i) => {
            const p = spr(H0 + 2 + i * 3, theme.spring.bouncy);
            if (p <= 0.001) return null;
            const c = CARD(i);
            const isJam = v === JAM;
            const inMost = v >= 20 && v <= 30;
            const hot = isJam && jamOn;
            const col = hot ? O : most > 0.5 && inMost ? C.cyan : C.edge;
            const dx = AX(v);
            const dy = AXY - stackIdx(COMMUTE, i) * 34;
            const x = interpolate(toDots, [0, 1], [c.x, dx]);
            const y = interpolate(toDots, [0, 1], [c.y, dy]);
            const cardO = 1 - ease(toDots, [0, 0.5], [0, 1]);
            const dotO = ease(toDots, [0.4, 0.9], [0, 1]);
            const dim = !jamOn && most > 0.5 && !inMost ? 0.55 : jamOn && !isJam && frame < VARY ? 0.6 : 1;
            const pulse = hot && frame < VARY ? 1 + Math.max(0, 1 - Math.abs(frame - JAMW) / 10) * 0.12 : 1;
            return (
              <React.Fragment key={i}>
                {cardO > 0.01 ? (
                  <div style={{ position: "absolute", left: x - 84, top: y - 80, width: 168, height: 160, boxSizing: "border-box", borderRadius: 24, background: hot ? `linear-gradient(180deg, ${alpha(O, 0.3)}, rgba(14,24,64,0.9))` : `linear-gradient(180deg, ${C.panelHi}, ${C.panel})`, border: `2.5px solid ${col}`, boxShadow: hot ? `0 0 30px ${alpha(O, 0.5)}` : "0 16px 30px -18px rgba(0,0,0,0.8)", opacity: Math.min(1, p * 2) * cardO * dim, transform: `translateY(${(1 - p) * 40}px) scale(${interpolate(p, [0, 1], [0.7, 1]) * pulse * (1 - toDots * 0.6)})`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 17, letterSpacing: "0.2em", color: C.dim }}>DAY {i + 1}</div>
                    <Bus w={64} color={hot ? O : C.cyan} />
                    <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 36, color: hot ? O : C.text, lineHeight: 1 }}>
                      {v}
                      <span style={{ fontSize: 18, color: C.dim }}> min</span>
                    </div>
                    {hot ? <div style={{ position: "absolute", right: -10, top: -12, width: 40, height: 40, borderRadius: 20, background: C.red, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 26 }}>!</div> : null}
                  </div>
                ) : null}
                {dotO > 0.01 ? <div style={{ position: "absolute", left: x - 15, top: y - 15, width: 30, height: 30, borderRadius: 15, background: isJam ? O : kindColor.data, boxShadow: `0 0 14px ${alpha(isJam ? O : kindColor.data, 0.8)}`, opacity: dotO, zIndex: 3 }} /> : null}
              </React.Fragment>
            );
          })}
          <Pop at={MOST + 6} out={JAMW - 4} x={540} y={1080} from="up" dist={20} cfg={theme.spring.bouncy}>
            <Tag color={C.cyan} size={30}>
              MOST DAYS: 20 TO 30 MIN
            </Tag>
          </Pop>
          <Pop at={JAMW + 2} out={VARY - 6} x={540} y={1080} from="up" dist={20} cfg={theme.spring.bouncy}>
            <Tag color={O} size={30}>
              ONE TRAFFIC JAM: 60 MIN
            </Tag>
          </Pop>
        </AbsoluteFill>
      ) : null}
      <Burst at={JAMW} x={CARD(3).x} y={CARD(3).y} color={O} count={16} radius={150} seed={3} />
      <Ripple at={I8} x={(AX(Q1) + AX(Q3)) / 2} y={AXY - 26} color={V} size={300} rings={1} flat={0.4} />

      {/* LET'S DECODE THE IQR */}
      {slamA > 0.001 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 560, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1, opacity: 1 - exitP(frame, END - 8, 8) }}>
          <div style={{ fontSize: 56, color: C.text, opacity: slamA, transform: `translateY(${(1 - slamA) * 30}px)`, letterSpacing: "0.02em" }}>LET&apos;S DECODE THE</div>
        </div>
      ) : null}
      {slamB > 0.001 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 720, textAlign: "center", transform: `translateY(-50%) translateX(${glitch * 8}px) scale(${interpolate(slamB, [0, 1], [1.6, 1])})`, opacity: Math.min(1, slamB * 2), fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 230, letterSpacing: "0.02em", lineHeight: 1 }}>
          <span style={{ background: `linear-gradient(90deg, ${C.violet}, ${C.cyan})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: glitch ? `drop-shadow(-6px 0 0 ${alpha(C.cyan, 0.8)}) drop-shadow(6px 0 0 ${alpha(C.red, 0.8)})` : `drop-shadow(0 0 30px ${alpha(V, 0.6)})` }}>IQR</span>
        </div>
      ) : null}
      <Burst at={DEC + 2} x={540} y={720} color={V} count={22} radius={320} seed={11} />
    </AbsoluteFill>
  );
};
