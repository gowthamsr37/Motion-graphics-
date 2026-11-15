// SCENE 6 — INTERACTIVE QUIZ + CTA. "What type of data is a jersey number?" 5-second countdown → CATEGORICAL → NOMINAL!
import React from "react";
import { AbsoluteFill, interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { Burst, Confetti, ease, exitP, Mark, Pop, Ripple, shake, useSpr } from "../components/Motion";
import { Arrow, Jersey } from "../components/Icons";
import { Orb, Tag } from "../components/Nodes";
import { alpha, glowBox, glowText, kindColor, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const OPTIONS = [
  { label: "Discrete", color: kindColor.discrete, x: 320, y: 1136 },
  { label: "Continuous", color: kindColor.continuous, x: 760, y: 1136 },
  { label: "Nominal", color: kindColor.nominal, x: 320, y: 1246 },
  { label: "Ordinal", color: kindColor.ordinal, x: 760, y: 1246 },
];
const ANSWER = 2;
const RING = { x: 770, y: 640, r: 118 };

export const S8Quiz: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s8");
  const QQ = s.sent(0).from;
  const Q = s.sent(1).from;
  const QEND = s.sent(1).to;
  const CD0 = QEND + Math.round(0.2 * s.fps);
  const SEC = s.fps;
  const REVEAL = CD0 + 5 * SEC;
  const CATW = s.cue("categorical.");
  const NOMW = s.cue("Nominal!");
  const EXPL = s.sent(3).from;
  const IDW = s.cue("identifier,");
  const QTY = s.cue("quantity.");
  const FOL = s.sent(4).from;
  const FOLW = s.cue("Follow");
  const DATAW = s.cueS(4, "data");
  const SIMPLE = s.cue("simple!");
  const CLEAR = FOL - 10;

  const sh = shake(frame, NOMW, 12, 10);
  const clear = exitP(frame, CLEAR, 10);

  // jersey: centre → left during the countdown → centre for the answer
  const toLeft = ease(frame, [CD0 - 8, CD0 + 6], [0, 1], theme.ease.inOut) * (1 - ease(frame, [REVEAL - 2, REVEAL + 12], [0, 1], theme.ease.inOut));
  const jIn = spr(Q - 6, theme.spring.bouncy);
  const jx = interpolate(toLeft, [0, 1], [540, 320]);
  const js = interpolate(toLeft, [0, 1], [1, 0.82]);

  // countdown
  const cdT = (frame - CD0) / SEC; // 0..5
  const digit = Math.max(1, 5 - Math.floor(cdT));
  const tickAt = CD0 + (5 - digit) * SEC;
  const tick = spr(tickAt, theme.spring.pop);
  const ringIn = spr(CD0 - 6, theme.spring.bouncy);
  const ringOut = ease(frame, [REVEAL, REVEAL + 10], [0, 1], theme.ease.in);
  const remain = 1 - ease(cdT, [0, 5], [0, 1], theme.ease.soft);
  const ringCol = interpolateColors(Math.min(1, Math.max(0, cdT / 5)), [0, 0.45, 0.75, 1], [C.green, C.yellow, C.orange, C.red]);
  const scan = frame >= CD0 && frame < REVEAL ? Math.floor((frame - CD0) / 9) % 4 : -1;

  const reveal = spr(NOMW - 3, theme.spring.pop);
  const qOut = exitP(frame, CATW - 10, 9);

  const words = ["What", "type", "of", "data", "is", "a"];

  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      {/* ---------------- quiz ---------------- */}
      {clear < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - clear, transform: `scale(${1 - clear * 0.06})` }}>
          <Pop at={QQ - 4} x={540} y={300} from="scale" scaleFrom={0.3} cfg={theme.spring.bouncy}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "16px 34px 16px 18px",
                borderRadius: 999,
                background: `linear-gradient(180deg, ${C.yellow}, #F59E0B)`,
                boxShadow: glowBox(C.yellow, 0.7),
                transform: `rotate(${Math.sin(frame / 10) * 2}deg)`,
              }}
            >
              <div style={{ width: 62, height: 62, borderRadius: 31, background: C.ink, color: C.yellow, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 42 }}>?</div>
              <span style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 54, color: C.ink, letterSpacing: "0.04em" }}>QUICK QUIZ</span>
            </div>
          </Pop>
          <Burst at={QQ} x={540} y={300} color={C.yellow} count={20} radius={260} seed={81} />

          {/* jersey */}
          {jIn > 0.01 ? (
            <div style={{ position: "absolute", left: jx, top: 640, transform: `translate(-50%, -50%) translateY(${(1 - jIn) * -600}px) scale(${js}) rotate(${Math.sin(frame / 18) * 5}deg)`, transformOrigin: "50% 0%" }}>
              <Jersey size={330} number="10" color="#3B4FD8" trim={C.cyan} />
            </div>
          ) : null}

          {/* countdown ring */}
          {ringIn > 0.01 && ringOut < 1 ? (
            <div style={{ position: "absolute", left: RING.x, top: RING.y, transform: `translate(-50%, -50%) scale(${ringIn * (1 + ringOut * 0.5) * (1 + (1 - tick) * 0.08)})`, opacity: 1 - ringOut }}>
              <svg width={RING.r * 2 + 40} height={RING.r * 2 + 40} viewBox={`${-RING.r - 20} ${-RING.r - 20} ${RING.r * 2 + 40} ${RING.r * 2 + 40}`} style={{ display: "block", overflow: "visible" }}>
                <circle r={RING.r} fill={alpha("#060B2A", 0.85)} stroke={alpha(C.text, 0.12)} strokeWidth={16} />
                <circle r={RING.r} fill="none" stroke={ringCol} strokeWidth={16} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - remain} transform="rotate(-90)" style={{ filter: `drop-shadow(0 0 12px ${ringCol})` }} />
              </svg>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: theme.fonts.mono,
                  fontWeight: 800,
                  fontSize: 140,
                  color: C.text,
                  transform: `scale(${interpolate(tick, [0, 1], [1.6, 1])})`,
                  opacity: Math.min(1, tick * 2),
                  textShadow: glowText(ringCol, 0.8),
                }}
              >
                {digit}
              </div>
              <div style={{ position: "absolute", left: "50%", top: "100%", transform: "translate(-50%, 6px)", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 26, letterSpacing: "0.3em", color: C.dim, whiteSpace: "nowrap" }}>THINK!</div>
            </div>
          ) : null}
          {[0, 1, 2, 3, 4].map((k) => (
            <Ripple key={k} at={CD0 + k * SEC} x={RING.x} y={RING.y} color={ringCol} size={330} rings={1} />
          ))}
          <Burst at={REVEAL} x={RING.x} y={RING.y} color={C.red} count={18} radius={220} seed={91} />

          {/* question, word by word */}
          {qOut < 1 ? (
            <div style={{ position: "absolute", left: 0, right: 0, top: 846, textAlign: "center", opacity: 1 - qOut, transform: `translateY(${-qOut * 30}px)` }}>
              <div style={{ display: "flex", justifyContent: "center", gap: 14, fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 48, color: C.text }}>
                {words.map((w, i) => {
                  const p = spr(s.cueS(1, w) - 3, theme.spring.snappy);
                  return (
                    <span key={i} style={{ display: "inline-block", opacity: p, transform: `translateY(${(1 - p) * 26}px)` }}>
                      {w}
                    </span>
                  );
                })}
              </div>
              {(() => {
                const p = spr(s.cueS(1, "jersey") - 3, theme.spring.pop);
                return (
                  <div style={{ marginTop: 14, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 80, letterSpacing: "-0.01em", color: C.orange, textShadow: glowText(C.orange, 0.7), opacity: Math.min(1, p * 2), transform: `scale(${interpolate(p, [0, 1], [1.3, 1])})` }}>
                    JERSEY NUMBER?
                  </div>
                );
              })()}
            </div>
          ) : null}

          {/* answer */}
          <Pop at={CATW - 3} x={540} y={872} from="up" dist={30} out={CLEAR}>
            <div style={{ display: "flex", alignItems: "center", gap: 18, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 60, color: C.violet, textShadow: glowText(C.violet, 0.5) }}>
              CATEGORICAL
              <Arrow size={70} color={C.text} />
            </div>
          </Pop>
          {reveal > 0.01 ? (
            <div
              style={{
                position: "absolute",
                left: 540,
                top: 978,
                transform: `translate(-50%, -50%) scale(${interpolate(reveal, [0, 1], [1.8, 1])})`,
                opacity: Math.min(1, reveal * 2),
                fontFamily: theme.fonts.display,
                fontWeight: 800,
                fontSize: 100,
                letterSpacing: "-0.01em",
                color: C.text,
                textShadow: glowText(C.violet, 1.2),
                whiteSpace: "nowrap",
              }}
            >
              NOMINAL!
            </div>
          ) : null}
          <Confetti at={NOMW} x={540} y={960} colors={[C.violet, C.cyan, C.green, C.orange, C.yellow]} count={46} seed={12} spread={1.1} />

          {/* options */}
          {OPTIONS.map((o, i) => {
            const p = spr(QEND - 6 + i * 4, theme.spring.bouncy);
            if (p <= 0.001) return null;
            const isAns = i === ANSWER;
            const win = isAns ? reveal : 0;
            const lose = !isAns ? ease(frame, [NOMW - 3, NOMW + 6], [0, 1]) : 0;
            const scanned = scan === i;
            const gone = exitP(frame, EXPL - 2 + i * 2, 9);
            if (gone >= 1) return null;
            return (
              <div
                key={o.label}
                style={{
                  position: "absolute",
                  left: o.x,
                  top: o.y,
                  width: 400,
                  height: 92,
                  boxSizing: "border-box",
                  transform: `translate(-50%, -50%) scale(${interpolate(p, [0, 1], [0.6, 1]) * (1 + win * 0.1 - lose * 0.05 + (scanned ? 0.04 : 0))})`,
                  opacity: Math.min(1, p * 2) * (1 - lose * 0.75) * (1 - gone),
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
                }}
              >
                <div style={{ width: 22, height: 22, borderRadius: 11, background: o.color, boxShadow: `0 0 12px ${o.color}` }} />
                {o.label}
                {isAns && win > 0.01 ? (
                  <div style={{ marginLeft: "auto" }}>
                    <Mark kind="check" at={NOMW - 1} size={52} color={C.green} />
                  </div>
                ) : null}
              </div>
            );
          })}

          {/* identifier, not a quantity */}
          <Pop at={IDW - 3} x={540} y={1112} from="up" dist={26} cfg={theme.spring.bouncy}>
            <Tag color={C.violet} size={32}>
              IDENTIFIER, NOT A QUANTITY
            </Tag>
          </Pop>
          {[
            { t: "10 > 7", x: 540, y: 1206 },
            { t: "10 + 7 = 17", x: 540, y: 1284 },
          ].map((e, i) => {
            const strike = ease(frame, [QTY + i * 5, QTY + 8 + i * 5], [0, 1]);
            return (
              <Pop key={e.t} at={IDW + 6 + i * 5} x={e.x} y={e.y} from="up" dist={24}>
                <div style={{ position: "relative", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 52, color: interpolateColors(strike, [0, 1], [C.text, C.dim]), whiteSpace: "nowrap" }}>
                  {e.t}
                  <span style={{ color: C.yellow }}> ?</span>
                  <div style={{ position: "absolute", left: -10, top: "52%", height: 7, borderRadius: 4, width: `calc(${strike * 100}% + 20px)`, background: C.red, boxShadow: `0 0 12px ${alpha(C.red, 0.8)}` }} />
                </div>
              </Pop>
            );
          })}
        </AbsoluteFill>
      ) : null}

      {/* ---------------- CTA ---------------- */}
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

      {/* for data science made simple */}
      <Pop at={DATAW - 6} x={540} y={1036} from="up" dist={30}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 56, color: C.text, whiteSpace: "nowrap" }}>for data science</div>
      </Pop>
      <Pop at={SIMPLE - 8} x={540} y={1124} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
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
      <div style={{ position: "absolute", left: 0, right: 0, top: 1250, display: "flex", justifyContent: "center", gap: 14 }}>
        {[
          { l: "Discrete", c: C.cyan },
          { l: "Continuous", c: C.green },
          { l: "Nominal", c: C.violet },
          { l: "Ordinal", c: C.orange },
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
