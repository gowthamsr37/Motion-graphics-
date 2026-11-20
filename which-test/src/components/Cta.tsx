// End card (house style): tree logo, FOLLOW button that gets tapped, the page handle, "for data science MADE SIMPLE." and recap chips.
// Shared by every video; pass the cue frames from the quiz scene.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { alpha, glowBox, HANDLE, theme } from "../theme";
import { ease, Mark, Pop, Ripple, useSpr } from "./Motion";
import { Orb } from "./Nodes";

const C = theme.colors;

export type CtaChip = { l: string; c: string };
// next: the topic teased on the end card ("NEXT: …"); chips: the video's key terms
export const Cta: React.FC<{ FOL: number; FOLW: number; DATAW: number; SIMPLE: number; next?: string; chips: CtaChip[] }> = ({ FOL, FOLW, DATAW, SIMPLE, next, chips }) => {
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
      {next ? (
        <Pop at={FOL - 2} x={540} y={340} from="down" dist={16} cfg={theme.spring.bouncy}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 24px", borderRadius: 999, background: "rgba(8,14,44,0.85)", border: `2px solid ${alpha(C.violet, 0.7)}`, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.16em", color: C.text, whiteSpace: "nowrap" }}>
            <span style={{ color: C.violet }}>NEXT:</span> {next}
          </div>
        </Pop>
      ) : null}
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
        {chips.map((k, i) => {
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
