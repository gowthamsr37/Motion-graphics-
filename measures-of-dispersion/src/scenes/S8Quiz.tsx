// SCENE 8 — QUIZ + CTA. Two classes average 70; SD 5 vs SD 15 → which is more consistent? 5-second countdown → CLASS A → Follow.
import React from "react";
import { AbsoluteFill, interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { Burst, Confetti, ease, exitP, Mark, Pop, Ripple, shake, useSpr } from "../components/Motion";
import { Orb, Pill, Tag } from "../components/Nodes";
import { alpha, glowBox, glowText, HANDLE, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const V = C.violet;
const OPTIONS = [
  { v: "Class A", color: C.cyan, x: 330, y: 1050, why: "" },
  { v: "Class B", color: C.green, x: 750, y: 1050, why: "more spread" },
  { v: "Same", color: C.violet, x: 330, y: 1166, why: "only averages match" },
  { v: "Can't tell", color: C.orange, x: 750, y: 1166, why: "" },
];
const ANSWER = 0;
const RING = { x: 540, y: 880, r: 100 };
const CARD_Y = 640;

// a little bell curve for the class cards (revealed with the answer)
const MiniBell: React.FC<{ wide: boolean; p: number }> = ({ wide, p }) => {
  const s = wide ? 70 : 22;
  const peak = wide ? 30 : 64;
  const pts: string[] = [];
  for (let x = 0; x <= 300; x += 5) pts.push(`${x === 0 ? "M" : "L"}${x} ${(80 - peak * Math.exp(-(((x - 150) / s) ** 2) / 2)).toFixed(1)}`);
  return (
    <svg width={300} height={84} viewBox="0 0 300 84" style={{ display: "block", overflow: "visible" }}>
      <line x1={0} y1={80} x2={300} y2={80} stroke={alpha(C.text, 0.35)} strokeWidth={3} />
      <path d={pts.join(" ")} stroke={V} strokeWidth={5} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} style={{ filter: `drop-shadow(0 0 6px ${alpha(V, 0.8)})` }} />
    </svg>
  );
};

export const S8Quiz: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s8");
  const QQ = s.sent(0).from;
  const CLS = s.sent(1).from;
  const SDA = s.cueS(2, "5.");
  const SDB = s.cueS(2, "15.");
  const Q = s.sent(3).from;
  const QEND = s.sent(3).to;
  const CD0 = QEND + Math.round(0.2 * s.fps);
  const SEC = s.fps;
  const REVEAL = CD0 + 5 * SEC;
  const ANS = s.sent(4).from;
  const WHY = s.sent(5).from;
  const FOL = s.sent(6).from;
  const FOLW = s.cueS(6, "Follow");
  const DATAW = s.cueS(6, "data");
  const SIMPLE = s.cueS(6, "simple!");
  const CLEAR = FOL - 10;

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
  const curves = ease(frame, [ANS + 4, ANS + 24], [0, 1], theme.ease.inOut);

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

          {/* the two class cards */}
          {[
            { name: "CLASS A", sd: "5", sdAt: SDA, x: 300, wide: false, win: true },
            { name: "CLASS B", sd: "15", sdAt: SDB, x: 780, wide: true, win: false },
          ].map((c, i) => {
            const p = spr(CLS - 4 + i * 5, theme.spring.bouncy);
            if (p <= 0.001) return null;
            const sdP = spr(c.sdAt - 2, theme.spring.pop);
            const lit = c.win && reveal > 0.5;
            return (
              <div
                key={c.name}
                style={{
                  position: "absolute",
                  left: c.x - 200,
                  top: CARD_Y - 140,
                  width: 400,
                  height: 280,
                  boxSizing: "border-box",
                  padding: "20px 24px",
                  borderRadius: 30,
                  background: lit ? alpha(V, 0.18) : "linear-gradient(180deg, rgba(26,40,98,0.95), rgba(14,24,64,0.95))",
                  border: `3px solid ${lit ? V : C.edgeHi}`,
                  boxShadow: lit ? glowBox(V, 0.8) : "0 20px 40px -20px rgba(0,0,0,0.7)",
                  transform: `translateY(${(1 - p) * 60}px) scale(${interpolate(p, [0, 1], [0.7, 1]) * (lit ? 1.04 : 1)})`,
                  opacity: Math.min(1, p * 2) * (reveal > 0.5 && !c.win ? 0.7 : 1),
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 36, color: C.text }}>{c.name}</span>
                  <span style={{ fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 26, color: C.dim }}>AVG 70</span>
                </div>
                <div style={{ marginTop: 10, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 64, color: C.text, opacity: Math.min(1, sdP * 2), transform: `scale(${interpolate(sdP, [0, 1], [1.4, 1])})`, transformOrigin: "0% 50%" }}>
                  <span style={{ fontSize: 30, color: V, marginRight: 12 }}>SD</span>
                  {c.sd}
                </div>
                <div style={{ position: "absolute", left: 50, bottom: 16, opacity: curves }}>
                  <MiniBell wide={c.wide} p={curves} />
                </div>
              </div>
            );
          })}

          {/* question */}
          {qOut < 1 ? (
            <div style={{ position: "absolute", left: 0, right: 0, top: RING.y, textAlign: "center", transform: `translateY(-50%) translateY(${-qOut * 30}px)`, opacity: (1 - qOut) * Math.min(1, spr(Q - 2, theme.spring.snappy) * 2) }}>
              <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 46, color: C.text }}>Which class is</div>
              {(() => {
                const p = spr(s.cueS(3, "consistent?") - 3, theme.spring.pop);
                return <div style={{ marginTop: 4, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 76, color: V, textShadow: glowText(V, 0.7), opacity: Math.min(1, p * 2), transform: `scale(${interpolate(p, [0, 1], [1.3, 1])})`, whiteSpace: "nowrap" }}>MORE CONSISTENT?</div>;
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
              <Pill label="CLASS A" color={V} size={56} glow={1.2} />
            </div>
          ) : null}
          <Confetti at={ANS} x={540} y={RING.y} colors={[V, C.cyan, C.green, C.orange, C.yellow]} count={46} seed={12} spread={1.1} />

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
                    width: 380,
                    height: 96,
                    boxSizing: "border-box",
                    borderRadius: 26,
                    background: isAns && win > 0.5 ? alpha(o.color, 0.3) : `linear-gradient(180deg, ${C.panelHi}, ${C.panel})`,
                    border: `3px solid ${scanned || win > 0.5 ? o.color : alpha(o.color, 0.45)}`,
                    boxShadow: win > 0.5 ? glowBox(o.color, win) : scanned ? `0 0 26px ${alpha(o.color, 0.45)}` : "none",
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "0 24px",
                    fontFamily: theme.fonts.display,
                    fontWeight: 800,
                    fontSize: 38,
                    color: C.text,
                    position: "relative",
                    whiteSpace: "nowrap",
                  }}
                >
                  <div style={{ width: 22, height: 22, borderRadius: 11, background: o.color, boxShadow: `0 0 12px ${o.color}`, flexShrink: 0 }} />
                  {o.v}
                  {isAns && win > 0.01 ? (
                    <div style={{ marginLeft: "auto" }}>
                      <Mark kind="check" at={ANS - 1} size={52} color={C.green} />
                    </div>
                  ) : null}
                  {strike > 0.01 ? <div style={{ position: "absolute", left: 56, top: "50%", width: (o.v.length * 22 + 10) * strike, height: 6, borderRadius: 3, background: C.red, boxShadow: `0 0 10px ${alpha(C.red, 0.8)}` }} /> : null}
                  {strike > 0.01 ? (
                    <span style={{ position: "absolute", right: 18, bottom: 6, fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 19, color: C.text, opacity: strike }}>{o.why}</span>
                  ) : null}
                </div>
              </div>
            );
          })}

          <Pop at={WHY + 2} x={540} y={1100} from="up" dist={24} cfg={theme.spring.bouncy}>
            <Tag color={V} size={32}>
              SMALLER SD = MORE CONSISTENT
            </Tag>
          </Pop>
        </AbsoluteFill>
      ) : null}

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
          { l: "Range", c: C.cyan },
          { l: "Variance", c: C.green },
          { l: "Std Dev", c: C.violet },
          { l: "Spread", c: C.orange },
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
