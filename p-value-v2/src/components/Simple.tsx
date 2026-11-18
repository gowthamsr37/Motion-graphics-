// "Made simple" v2 kit (CI v2 / p-value v2): the INTERVIEW ANSWER card (a definition that reveals chunk by chunk on
// its spoken words, key phrases highlighted), an EXAMPLE n tag, and a big headline helper.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { ease, useSpr } from "./Motion";
import { alpha, glowText, theme } from "../theme";

const C = theme.colors;

export type Chunk = { t: string; at: number; hi?: string };

const Bubble: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size * 0.86} viewBox="0 0 100 86" style={{ display: "block", overflow: "visible" }}>
    <path d="M10 8 H90 Q96 8 96 14 V56 Q96 62 90 62 H44 L24 80 L28 62 H10 Q4 62 4 56 V14 Q4 8 10 8 Z" fill={alpha(color, 0.3)} stroke={color} strokeWidth={6} strokeLinejoin="round" />
    <circle cx={30} cy={35} r={6} fill={color} />
    <circle cx={50} cy={35} r={6} fill={color} />
    <circle cx={70} cy={35} r={6} fill={color} />
  </svg>
);

// the badge + card; chunks fade in on their cue; `note` (optional) is a second line under a divider
export const InterviewCard: React.FC<{ at: number; y?: number; h?: number; chunks: Chunk[]; size?: number; note?: { label: string; text: React.ReactNode; at: number; c: string } }> = ({ at, y = 560, h = 640, chunks, size = 44, note }) => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const badge = spr(at - 6, theme.spring.pop);
  const card = spr(at, theme.spring.smooth);
  const n = note ? spr(note.at - 4, theme.spring.bouncy) : 0;
  return (
    <>
      {badge > 0.001 ? (
        <div style={{ position: "absolute", left: 540, top: y - 70, transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, badge), [0, 1], [0.5, 1])})`, opacity: Math.min(1, badge * 2), display: "flex", alignItems: "center", gap: 14, padding: "10px 28px", borderRadius: 999, background: alpha(C.yellow, 0.18), border: `3px solid ${C.yellow}`, boxShadow: `0 0 26px ${alpha(C.yellow, 0.4)}`, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 28, letterSpacing: "0.18em", color: C.text, whiteSpace: "nowrap" }}>
          <Bubble size={40} color={C.yellow} />
          INTERVIEW ANSWER
        </div>
      ) : null}
      <div style={{ position: "absolute", left: 90, top: y, width: 900, height: h, boxSizing: "border-box", borderRadius: 34, background: "linear-gradient(180deg, rgba(26,40,98,0.94), rgba(14,24,64,0.94))", border: `2px solid ${alpha(C.yellow, 0.5)}`, opacity: Math.min(1, card * 1.5), transform: `translateY(${(1 - Math.min(1, card)) * 30}px)` }}>
        <div style={{ position: "absolute", left: 30, top: -6, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 150, lineHeight: 1, color: alpha(C.yellow, 0.35) }}>&ldquo;</div>
        <div style={{ position: "absolute", left: 60, right: 50, top: 80, fontFamily: theme.fonts.display, fontWeight: 700, fontSize: size, lineHeight: 1.32, color: C.text }}>
          {chunks.map((c, i) => {
            const p = ease(frame, [c.at - 6, c.at + 6], [0, 1]);
            return (
              <span key={i} style={{ opacity: 0.12 + 0.88 * p, color: c.hi && p > 0.5 ? c.hi : C.text, fontWeight: c.hi ? 800 : 700, textShadow: c.hi && p > 0.5 ? glowText(c.hi, 0.45) : undefined }}>
                {c.t}{" "}
              </span>
            );
          })}
        </div>
        {note && n > 0.001 ? (
          <div style={{ position: "absolute", left: 60, right: 50, bottom: 40, opacity: Math.min(1, n * 2), transform: `translateY(${(1 - Math.min(1, n)) * 12}px)` }}>
            <div style={{ height: 2, background: alpha(C.text, 0.15), marginBottom: 22 }} />
            <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.2em", color: note.c, marginBottom: 10 }}>{note.label}</div>
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 34, lineHeight: 1.3, color: C.text }}>{note.text}</div>
          </div>
        ) : null}
      </div>
    </>
  );
};

export const ExampleTag: React.FC<{ n: number; at: number; color: string; y?: number; label?: string }> = ({ n, at, color, y = 300, label }) => {
  const spr = useSpr();
  const p = spr(at - 4, theme.spring.pop);
  if (p <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: 540, top: y, transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, p), [0, 1], [0.5, 1])})`, opacity: Math.min(1, p * 2), display: "flex", alignItems: "center", gap: 14, padding: "10px 26px", borderRadius: 999, background: alpha(color, 0.2), border: `3px solid ${color}`, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 28, letterSpacing: "0.18em", color: C.text, whiteSpace: "nowrap" }}>
      <span style={{ fontFamily: theme.fonts.display, fontSize: 34, color }}>{n}</span>
      EXAMPLE{label ? <span style={{ color: C.dim }}> · {label}</span> : null}
    </div>
  );
};
