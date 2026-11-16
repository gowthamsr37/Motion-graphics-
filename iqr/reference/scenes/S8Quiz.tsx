// SCENE 8 — QUIZ + CTA. Q1 = 20, Q3 = 30: which value is an outlier? 12, 48, 18 or 38.
// 5-second countdown → 48 (fences at 5 and 45; only 48 is outside) → "Next time: how to treat outliers" → Follow.
import React from "react";
import { AbsoluteFill, interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { Burst, Confetti, ease, exitP, Mark, Pop, Ripple, shake, useSpr } from "../components/Motion";
import { Orb, Pill, Tag } from "../components/Nodes";
import { alpha, glowBox, glowText, HANDLE, kindColor, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const O = kindColor.outlier;
const V = kindColor.spread;
const OPTIONS = [
  { v: "12", color: C.cyan, x: 330, y: 1050, why: "inside" },
  { v: "48", color: C.green, x: 750, y: 1050, why: "" },
  { v: "18", color: C.violet, x: 330, y: 1166, why: "inside" },
  { v: "38", color: C.orange, x: 750, y: 1166, why: "inside" },
];
const ANSWER = 1;
const RING = { x: 540, y: 900, r: 100 };
const AXY = 712;
const BOX_Y = 592;
const X = (v: number) => 140 + v * 13.3;

export const S8Quiz: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s8");
  const QQ = s.sent(0).from;
  const PROP = s.sent(1).from;
  const C20 = s.cueS(1, "20");
  const C30 = s.cueS(1, "30.");
  const Q = s.sent(2).from;
  const OUTQ = s.cueS(2, "outlier?");
  const QEND = s.sent(2).to;
  const CD0 = QEND + Math.round(0.2 * s.fps);
  const SEC = s.fps;
  const REVEAL = CD0 + 5 * SEC;
  const ANS = s.sent(3).from;
  const WHY = s.sent(4).from;
  const F5 = s.cueS(4, "5");
  const F45 = s.cueS(4, "45.");
  const ONLY = s.cueS(4, "Only");
  const NEXT = s.sent(5).from;
  const TREAT = s.cueS(5, "treat");
  const FOL = s.sent(6).from;
  const FOLW = s.cueS(6, "Follow");
  const DATAW = s.cueS(6, "data");
  const SIMPLE = s.cueS(6, "simple!");
  const CLEAR = NEXT - 10;

  const sh = shake(frame, ANS, 12, 10);
  const clear = exitP(frame, CLEAR, 10);
  const cdT = (frame - CD0) / SEC;
  const digit = Math.max(1, 5 - Math.floor(cdT));
  const tickAt = CD0 + (5 - digit) * SEC;
  const tick = spr(tickAt, theme.spring.pop);
  const ringIn = spr(CD0 - 6, theme.spring.bouncy);
  const ringOut = ease(frame, [REVEAL, REVEAL + 10], [0, 1], theme.ease.in);
  const remain = 1 - ease(cdT, [0, 5], [0, 1], theme.ease.soft);
  const ringCol = interpolateColors(Math.min(1, Math.max(0, cdT / 5)), [0, 0.45, 0.75, 1], [C.green, C.yellow, C.orange, C.red]);
  const scan = frame >= CD0 && frame < REVEAL ? Math.floor((frame - CD0) / 9) % 4 : -1;
  const qOut = exitP(frame, CD0 - 8, 8);
  const reveal = spr(ANS - 3, theme.spring.pop);
  const ax = ease(frame, [PROP - 10, PROP + 6], [0, 1], theme.ease.inOut);
  const box = spr(C20 - 4, theme.spring.bouncy);
  const boxW = ease(frame, [C20 - 2, C30 + 2], [0, 1], theme.ease.inOut);
  const teaser = spr(NEXT - 4, theme.spring.bouncy);
  const teaserOut = exitP(frame, FOL - 10, 10);

  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      {clear < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - clear, transform: `scale(${1 - clear * 0.06})` }}>
          <Pop at={QQ - 4} x={540} y={300} from="scale" scaleFrom={0.3} cfg={theme.spring.bouncy}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 34px 16px 18px", borderRadius: 999, background: `linear-gradient(180deg, ${C.yellow}, #F59E0B)`, boxShadow: glowBox(C.yellow, 0.7), transform: `rotate(${Math.sin(frame / 10) * 2}deg)` }}>
              <div style={{ width: 62, height: 62, borderRadius: 31, background: C.ink, color: C.yellow, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 42 }}>?</div>
              <span style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 54, color: C.ink, letterSpacing: "0.04em" }}>QUICK QUIZ</span>
            </div>
          </Pop>
          <Burst at={QQ} x={540} y={300} color={C.yellow} count={20} radius={260} seed={81} />

          {/* the prop: a box with Q1 = 20 and Q3 = 30 */}
          <div style={{ position: "absolute", left: X(0) - 16, top: AXY - 2, width: (X(60) - X(0) + 32) * ax, height: 4, borderRadius: 2, background: alpha(C.text, 0.35) }} />
          {[0, 10, 20, 30, 40, 50, 60].map((v) => (
            <div key={v} style={{ position: "absolute", left: X(v), top: AXY + 34, transform: "translate(-50%, -50%)", fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 22, color: C.dim, opacity: ax }}>{v}</div>
          ))}
          {box > 0.01 ? (
            <div style={{ position: "absolute", left: X(20), top: BOX_Y - 40, width: (X(30) - X(20)) * boxW, height: 80, boxSizing: "border-box", borderRadius: 10, background: alpha(V, 0.24), border: `4px solid ${V}`, boxShadow: `0 0 26px ${alpha(V, 0.45)}`, opacity: Math.min(1, box * 2) }} />
          ) : null}
          <Pop at={C20 - 2} x={X(20) - 14} y={BOX_Y - 72} from="down" dist={14}>
            <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 28, color: C.text, whiteSpace: "nowrap" }}>
              <span style={{ color: V }}>Q1</span> 20
            </div>
          </Pop>
          <Pop at={C30 - 2} x={X(30) + 14} y={BOX_Y - 72} from="down" dist={14}>
            <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 28, color: C.text, whiteSpace: "nowrap" }}>
              <span style={{ color: V }}>Q3</span> 30
            </div>
          </Pop>
          {/* the why: fences at 5 and 45, the four options as dots */}
          {[
            { v: 5, at: F5 },
            { v: 45, at: F45 },
          ].map((f) => {
            const p = ease(frame, [f.at - 6, f.at + 8], [0, 1], theme.ease.out);
            if (p <= 0.001) return null;
            return (
              <React.Fragment key={f.v}>
                <div style={{ position: "absolute", left: X(f.v) - 2, top: 524, height: (AXY + 10 - 524) * p, borderLeft: `4px dashed ${alpha(C.text, 0.85)}` }} />
                <div style={{ position: "absolute", left: X(f.v), top: 500, transform: "translate(-50%, -50%)", opacity: p, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 30, color: C.text }}>{f.v}</div>
              </React.Fragment>
            );
          })}
          {[12, 18, 38, 48].map((v, i) => {
            const p = spr(ONLY - 10 + i * 3, theme.spring.pop);
            if (p <= 0.001) return null;
            const out = v === 48;
            const col = out ? O : "#E4EEFF";
            return (
              <React.Fragment key={v}>
                <div style={{ position: "absolute", left: X(v) - 15, top: AXY - 15, width: 30, height: 30, borderRadius: 15, background: col, boxShadow: `0 0 14px ${alpha(col, 0.8)}`, transform: `scale(${p})` }} />
                <div style={{ position: "absolute", left: X(v), top: AXY - 40, transform: "translate(-50%, -50%)", opacity: Math.min(1, p * 2), fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 24, color: col }}>{v}</div>
              </React.Fragment>
            );
          })}
          <Ripple at={ONLY + 2} x={X(48)} y={AXY} color={O} size={220} rings={2} flat={0.4} />

          {/* question */}
          {qOut < 1 ? (
            <div style={{ position: "absolute", left: 0, right: 0, top: RING.y, textAlign: "center", transform: `translateY(-50%) translateY(${-qOut * 30}px)`, opacity: (1 - qOut) * Math.min(1, spr(Q - 2, theme.spring.snappy) * 2) }}>
              <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 46, color: C.text }}>Which value is</div>
              {(() => {
                const p = spr(OUTQ - 3, theme.spring.pop);
                return <div style={{ marginTop: 4, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 80, color: C.cyan, textShadow: glowText(C.cyan, 0.7), opacity: Math.min(1, p * 2), transform: `scale(${interpolate(p, [0, 1], [1.3, 1])})`, whiteSpace: "nowrap" }}>AN OUTLIER?</div>;
              })()}
            </div>
          ) : null}
          {/* countdown ring */}
          {ringIn > 0.01 && ringOut < 1 ? (
            <div style={{ position: "absolute", left: RING.x, top: RING.y, transform: `translate(-50%, -50%) scale(${ringIn * (1 + ringOut * 0.5) * (1 + (1 - tick) * 0.08)})`, opacity: 1 - ringOut }}>
              <svg width={RING.r * 2 + 40} height={RING.r * 2 + 40} viewBox={`${-RING.r - 20} ${-RING.r - 20} ${RING.r * 2 + 40} ${RING.r * 2 + 40}`} style={{ display: "block", overflow: "visible" }}>
                <circle r={RING.r} fill={alpha("#060B2A", 0.85)} stroke={alpha(C.text, 0.12)} strokeWidth={16} />
                <circle r={RING.r} fill="none" stroke={ringCol} strokeWidth={16} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - remain} transform="rotate(-90)" style={{ filter: `drop-shadow(0 0 12px ${ringCol})` }} />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 120, color: C.text, transform: `scale(${interpolate(tick, [0, 1], [1.6, 1])})`, opacity: Math.min(1, tick * 2), textShadow: glowText(ringCol, 0.8) }}>
                {digit}
              </div>
            </div>
          ) : null}
          {[0, 1, 2, 3, 4].map((k) => (
            <Ripple key={k} at={CD0 + k * SEC} x={RING.x} y={RING.y} color={ringCol} size={300} rings={1} />
          ))}
          <Burst at={REVEAL} x={RING.x} y={RING.y} color={C.red} count={18} radius={220} seed={91} />

          {/* answer */}
          {reveal > 0.01 ? (
            <div style={{ position: "absolute", left: 540, top: RING.y, transform: `translate(-50%, -50%) scale(${interpolate(reveal, [0, 1], [1.8, 1])})`, opacity: Math.min(1, reveal * 2) }}>
              <Pill label="48" color={C.green} size={70} glow={1.2} />
            </div>
          ) : null}
          <Confetti at={ANS} x={540} y={RING.y} colors={[C.green, C.cyan, C.violet, C.orange, C.yellow]} count={46} seed={12} spread={1.1} />

          {/* options */}
          {OPTIONS.map((o, i) => {
            const p = spr(QEND - 6 + i * 4, theme.spring.bouncy);
            if (p <= 0.001) return null;
            const isAns = i === ANSWER;
            const win = isAns ? reveal : 0;
            const lose = !isAns ? ease(frame, [ANS - 3, ANS + 6], [0, 1]) : 0;
            const scanned = scan === i;
            const gone = exitP(frame, WHY - 4 + i * 2, 9);
            if (gone >= 1) return null;
            const strike = o.why ? ease(frame, [ANS + 8 + i * 4, ANS + 16 + i * 4], [0, 1]) : 0;
            return (
              <div key={o.v} style={{ position: "absolute", left: o.x, top: o.y, transform: `translate(-50%, -50%) scale(${interpolate(p, [0, 1], [0.6, 1]) * (1 + win * 0.1 - lose * 0.05 + (scanned ? 0.04 : 0))})`, opacity: Math.min(1, p * 2) * (1 - lose * (o.why ? 0.35 : 0.75)) * (1 - gone) }}>
                <div
                  style={{
                    width: 390,
                    height: 96,
                    boxSizing: "border-box",
                    borderRadius: 26,
                    background: isAns && win > 0.5 ? alpha(o.color, 0.3) : `linear-gradient(180deg, ${C.panelHi}, ${C.panel})`,
                    border: `3px solid ${scanned || win > 0.5 ? o.color : alpha(o.color, 0.45)}`,
                    boxShadow: win > 0.5 ? glowBox(o.color, win) : scanned ? `0 0 26px ${alpha(o.color, 0.45)}` : "none",
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "0 22px",
                    fontFamily: theme.fonts.display,
                    fontWeight: 800,
                    fontSize: 34,
                    color: C.text,
                    position: "relative",
                    whiteSpace: "nowrap",
                  }}
                >
                  <div style={{ width: 20, height: 20, borderRadius: 10, background: o.color, boxShadow: `0 0 12px ${o.color}`, flexShrink: 0 }} />
                  {o.v}
                  {isAns && win > 0.01 ? (
                    <div style={{ marginLeft: "auto" }}>
                      <Mark kind="check" at={ANS - 1} size={48} color={C.green} />
                    </div>
                  ) : null}
                  {strike > 0.01 ? <div style={{ position: "absolute", left: 52, top: "50%", width: (o.v.length * 19 + 10) * strike, height: 6, borderRadius: 3, background: C.red, boxShadow: `0 0 10px ${alpha(C.red, 0.8)}` }} /> : null}
                  {strike > 0.01 ? (
                    <span style={{ position: "absolute", right: 16, bottom: 6, fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 19, color: C.text, opacity: strike }}>{o.why}</span>
                  ) : null}
                </div>
              </div>
            );
          })}

          <Pop at={WHY + 2} x={540} y={1100} from="up" dist={24} cfg={theme.spring.bouncy}>
            <Tag color={C.green} size={32}>
              FENCES: 5 AND 45
            </Tag>
          </Pop>
          <Pop at={ONLY - 2} x={540} y={1196} from="up" dist={20} cfg={theme.spring.bouncy}>
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 36, color: C.text, whiteSpace: "nowrap" }}>
              only <span style={{ color: O, fontWeight: 800, textShadow: glowText(O, 0.5) }}>48</span> is outside
            </div>
          </Pop>
        </AbsoluteFill>
      ) : null}


      {/* teaser: the next video */}
      {teaser > 0.01 && teaserOut < 1 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 800, textAlign: "center", transform: `translateY(-50%) scale(${interpolate(teaser, [0, 1], [0.7, 1]) * (1 - teaserOut * 0.1)})`, opacity: Math.min(1, teaser * 2) * (1 - teaserOut), fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1 }}>
          <div style={{ fontFamily: theme.fonts.body, fontSize: 30, letterSpacing: "0.3em", color: C.dim }}>NEXT TIME</div>
          <div style={{ marginTop: 26, fontSize: 76, color: C.text }}>HOW TO TREAT</div>
          <div style={{ marginTop: 14, fontSize: 124, letterSpacing: "-0.02em", color: O, textShadow: glowText(O, 0.7), transform: `scale(${interpolate(spr(TREAT, theme.spring.pop), [0, 1], [1.25, 1])})` }}>OUTLIERS</div>
        </div>
      ) : null}
      <Pop at={FOL + 2} x={540} y={372} from="down" dist={20} cfg={theme.spring.bouncy}>
        <div style={{ padding: "10px 24px", borderRadius: 999, background: alpha(O, 0.14), border: `2.5px solid ${O}`, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.16em", color: C.text, whiteSpace: "nowrap" }}>
          NEXT: <span style={{ color: O }}>HOW TO TREAT OUTLIERS</span>
        </div>
      </Pop>

      {frame >= FOL - 6 ? <Cta FOL={FOL} FOLW={FOLW} DATAW={DATAW} SIMPLE={SIMPLE} /> : null}
    </AbsoluteFill>
  );
};

const Cta: React.FC<{ FOL: number; FOLW: number; DATAW: number; SIMPLE: number }> = ({ FOL, FOLW, DATAW, SIMPLE }) => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const logo = spr(FOL - 6, theme.spring.bouncy);
  const leaves = [
    { c: C.cyan, x: -150 },
    { c: C.green, x: -50 },
    { c: C.violet, x: 50 },
    { c: C.orange, x: 150 },
  ];
  const btn = spr(FOLW - 2, theme.spring.bouncy);
  const PRESS = FOLW + 16;
  const press = ease(frame, [PRESS, PRESS + 4], [0, 1]) * (1 - ease(frame, [PRESS + 4, PRESS + 12], [0, 1]));
  const tapX = interpolate(ease(frame, [PRESS - 14, PRESS], [0, 1], theme.ease.out), [0, 1], [760, 620]);
  const tapY = interpolate(ease(frame, [PRESS - 14, PRESS], [0, 1], theme.ease.out), [0, 1], [1010, 880]);
  const tapOn = ease(frame, [PRESS - 14, PRESS - 8], [0, 1]) * (1 - ease(frame, [PRESS + 16, PRESS + 24], [0, 1]));
  const followed = frame >= PRESS + 3;
  const breathe = 1 + Math.sin(frame / 12) * 0.02;
  return (
    <AbsoluteFill>
      {/* mini tree mark */}
      <div style={{ position: "absolute", left: 540, top: 560, transform: `translate(-50%, -50%) scale(${logo})` }}>
        <svg width={400} height={240} viewBox="-200 -60 400 240" style={{ position: "absolute", left: -200, top: -60, overflow: "visible" }}>
          {leaves.map((l, i) => {
            const p = ease(frame, [FOL + i * 3, FOL + 12 + i * 3], [0, 1], theme.ease.inOut);
            return (
              <g key={i}>
                <path d={`M0 30 C0 90 ${l.x} 80 ${l.x} 140`} stroke={l.c} strokeWidth={6} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} strokeLinecap="round" />
                <circle cx={l.x} cy={150} r={18 * ease(frame, [FOL + 10 + i * 3, FOL + 18 + i * 3], [0, 1], theme.ease.out)} fill={l.c} style={{ filter: `drop-shadow(0 0 10px ${l.c})` }} />
              </g>
            );
          })}
        </svg>
        <div style={{ position: "relative", left: -55, top: -55 }}>
          <Orb size={110} />
        </div>
      </div>

      {/* FOLLOW button */}
      {btn > 0.01 ? (
        <div
          style={{
            position: "absolute",
            left: 540,
            top: 880,
            transform: `translate(-50%, -50%) scale(${interpolate(btn, [0, 1], [0.5, 1]) * (1 - press * 0.08) * (followed ? breathe : 1)})`,
            opacity: Math.min(1, btn * 2),
            display: "flex",
            alignItems: "center",
            gap: 18,
            padding: "26px 64px",
            borderRadius: 999,
            background: followed ? `linear-gradient(90deg, ${C.green}, ${C.cyan})` : `linear-gradient(90deg, ${C.cyan}, ${C.violet})`,
            boxShadow: glowBox(followed ? C.green : C.cyan, 0.9),
            fontFamily: theme.fonts.display,
            fontWeight: 800,
            fontSize: 66,
            color: C.ink,
            letterSpacing: "0.04em",
            whiteSpace: "nowrap",
          }}
        >
          {followed ? <Mark kind="check" at={PRESS + 3} size={60} color={C.ink} width={14} /> : <span style={{ fontSize: 72, lineHeight: 1, marginTop: -6 }}>+</span>}
          FOLLOW
        </div>
      ) : null}
      <Ripple at={PRESS + 2} x={540} y={880} color={C.green} size={700} rings={2} flat={0.32} />
      {tapOn > 0.01 ? (
        <div style={{ position: "absolute", left: tapX, top: tapY, width: 64, height: 64, borderRadius: 32, transform: `translate(-50%, -50%) scale(${1 - press * 0.25})`, background: "rgba(255,255,255,0.85)", border: `4px solid ${C.ink}`, opacity: tapOn, boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }} />
      ) : null}

      {/* the page handle */}
      <Pop at={FOLW + 2} x={540} y={1002} from="up" dist={20} cfg={theme.spring.bouncy}>
        <div style={{ display: "flex", alignItems: "center", gap: 2, padding: "8px 22px", borderRadius: 999, background: "rgba(8,14,44,0.85)", border: `2px solid ${alpha(C.cyan, 0.6)}`, fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 36, color: C.text, whiteSpace: "nowrap" }}>
          <span style={{ color: C.cyan }}>@</span>
          {HANDLE.slice(1)}
        </div>
      </Pop>
      {/* for data science made simple */}
      <Pop at={DATAW - 6} x={540} y={1098} from="up" dist={30}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 56, color: C.text, whiteSpace: "nowrap" }}>for data science</div>
      </Pop>
      <Pop at={SIMPLE - 8} x={540} y={1184} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
        <div
          style={{
            fontFamily: theme.fonts.display,
            fontWeight: 800,
            fontSize: 84,
            letterSpacing: "-0.01em",
            background: `linear-gradient(90deg, ${C.green}, ${C.cyan})`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            filter: `drop-shadow(0 0 22px ${alpha(C.green, 0.5)})`,
            whiteSpace: "nowrap",
          }}
        >
          MADE SIMPLE.
        </div>
      </Pop>
      {/* recap chips */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1292, display: "flex", justifyContent: "center", gap: 14 }}>
        {[
          { l: "Outliers", c: C.orange },
          { l: "Mistakes", c: C.violet },
          { l: "Real but rare", c: C.cyan },
          { l: "IQR fences", c: C.green },
        ].map((k, i) => {
          const p = spr(SIMPLE + 4 + i * 4, theme.spring.pop);
          return (
            <div
              key={k.l}
              style={{
                transform: `translateY(${(1 - p) * 30 + Math.sin(frame / 15 + i) * 3}px) scale(${interpolate(p, [0, 1], [0.6, 1])})`,
                opacity: Math.min(1, p * 2),
                padding: "10px 18px",
                borderRadius: 999,
                border: `2px solid ${k.c}`,
                background: alpha(k.c, 0.14),
                fontFamily: theme.fonts.display,
                fontWeight: 700,
                fontSize: 26,
                color: C.text,
                whiteSpace: "nowrap",
              }}
            >
              {k.l}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
